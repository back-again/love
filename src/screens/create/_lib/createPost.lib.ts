import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { uploadImageToR2 } from '@/api/storage.api';

export interface CreatePostParams {
  title: string;
  content: string;
  category?: string;
  images?: string[]; // 로컬 선택 이미지 URI 배열
  userId?: string;
  voteO?: string | null;
  voteX?: string | null;
}

export async function createPost({
  title,
  content,
  category = '고민',
  images = [],
  userId,
  voteO,
  voteX,
}: CreatePostParams) {
  const activeUserId = userId || (await getCurrentUserId());
  if (!activeUserId) {
    throw new Error('로그인이 필요합니다.');
  }

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

  const uploadedImageUrls: string[] = [];
  if (images.length > 0) {
    try {
      const uploadPromises = images.map(async (localUri, index) => {
        const uploadRes = await uploadImageToR2(
          localUri,
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
      console.error('R2 storage upload error before post creation:', uploadError);
      throw new Error('이미지 업로드 중 오류가 발생했습니다.');
    }
  }

  const insertPayload: any = {
    user_id: activeUserId,
    title,
    content,
    category,
    vote_o: voteO ? voteO.trim() : null,
    vote_x: voteX ? voteX.trim() : null,
  };
  if (categoryId) insertPayload.category_id = categoryId;

  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([insertPayload])
    .select()
    .single();

  if (postError) {
    console.error('Supabase posts insert error:', postError);
    throw new Error('게시글 등록에 실패했습니다.');
  }

  if (uploadedImageUrls.length > 0 && postData?.id) {
    const imageRecords = uploadedImageUrls.map((url, index) => ({
      post_id: postData.id,
      image_url: url,
      order_index: index,
    }));

    const { error: imageError } = await supabase
      .from('post_images')
      .insert(imageRecords);

    if (imageError) {
      console.warn('Post created, but failed to save post_images:', imageError);
    }
  }

  return { ...postData, images: uploadedImageUrls };
}
