import { supabase } from '@/api/supabase';
import { uploadImageToR2 } from '@/api/storage.api';

export interface UpdatePostParams {
  id: string;
  title: string;
  content: string;
  category?: string;
  images?: string[]; // 로컬 선택 이미지 URI 또는 이미 업로드된 R2 URL 배열
  voteO?: string | null;
  voteX?: string | null;
}

export async function updatePost({
  id,
  title,
  content,
  category = '고민',
  images = [],
  voteO,
  voteX,
}: UpdatePostParams) {
  // 1. 카테고리 ID 확인 (categories 테이블 조회)
  let categoryId: string | null = null;
  try {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category)
      .maybeSingle();

    if (catData?.id) {
      categoryId = catData.id;
    }
  } catch (catErr) {
    console.warn('Category lookup warning:', catErr);
  }

  // 2. 이미지 처리: 로컬 이미지 업로드
  const uploadedImageUrls: string[] = [];
  try {
    const uploadPromises = images.map(async (imgUri, index) => {
      // 만약 이미 http로 시작하는 업로드된 R2 이미지라면 업로드 건너뜀
      if (imgUri.startsWith('http')) {
        return imgUri;
      }
      const uploadRes = await uploadImageToR2(
        imgUri,
        `post_img_${Date.now()}_${index}.jpg`
      );
      if (!uploadRes?.imageUrl) {
        throw new Error(`Image upload failed at index ${index}`);
      }
      return uploadRes.imageUrl;
    });

    const results = await Promise.all(uploadPromises);
    uploadedImageUrls.push(...results);
  } catch (uploadError) {
    console.error('R2 storage upload error during post update:', uploadError);
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }

  const updatePayload: any = {
    title,
    content,
    category,
    vote_o: voteO ? voteO.trim() : null,
    vote_x: voteX ? voteX.trim() : null,
  };
  if (categoryId) {
    updatePayload.category_id = categoryId;
  }

  const { data: postData, error: postError } = await supabase
    .from('posts')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (postError) {
    console.error('Supabase posts update error:', postError);
    throw new Error('게시글 수정 중 오류가 발생했습니다.');
  }

  // 4. 기존 post_images 제거 후 새로 등록
  const { error: deleteImagesError } = await supabase
    .from('post_images')
    .delete()
    .eq('post_id', id);

  if (deleteImagesError) {
    console.warn('Failed to clear old post images:', deleteImagesError);
  }

  if (uploadedImageUrls.length > 0) {
    const imageRecords = uploadedImageUrls.map((url, index) => ({
      post_id: id,
      image_url: url,
      order_index: index,
    }));

    const { error: imageError } = await supabase
      .from('post_images')
      .insert(imageRecords);

    if (imageError) {
      console.warn('Failed to insert new post images:', imageError);
    }
  }

  return { ...postData, images: uploadedImageUrls };
}
