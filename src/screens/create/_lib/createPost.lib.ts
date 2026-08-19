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
  category = '연애/썸',
  images = [],
  userId,
  voteO = '괜찮은데?',
  voteX = '난 싫어',
}: CreatePostParams) {
  // 1. 로그인 유저 ID 확인
  const activeUserId = userId || (await getCurrentUserId());
  if (!activeUserId) {
    throw new Error('로그인이 필요합니다.');
  }

  // 2. 카테고리 ID 확인 (categories 테이블 조회)
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

  // 3. 게시글 등록 전 Cloudflare R2 스토리지로 이미지 일괄 업로드
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

  // 4. Supabase public.posts 레코드 생성
  let postData: any = null;
  let postError: any = null;

  const fullPayload: any = {
    user_id: activeUserId,
    title,
    content,
    category,
    vote_o: voteO,
    vote_x: voteX,
  };
  if (categoryId) fullPayload.category_id = categoryId;

  const res1 = await supabase.from('posts').insert([fullPayload]).select().single();
  postData = res1.data;
  postError = res1.error;

  if (postError) {
    console.warn('Posts insert Attempt 1 failed:', postError.message);
    const payload2: any = {
      user_id: activeUserId,
      title,
      content,
      category,
    };
    if (categoryId) payload2.category_id = categoryId;

    const res2 = await supabase.from('posts').insert([payload2]).select().single();
    postData = res2.data;
    postError = res2.error;
  }

  if (postError) {
    console.warn('Posts insert Attempt 2 failed:', postError.message);
    const payload3: any = {
      user_id: activeUserId,
      title,
      content,
    };
    if (categoryId) payload3.category_id = categoryId;

    const res3 = await supabase.from('posts').insert([payload3]).select().single();
    postData = res3.data;
    postError = res3.error;
  }

  if (postError) {
    console.error('CRITICAL: All Supabase posts insert attempts failed:', postError);
    throw new Error('게시글 등록에 실패했습니다.');
  }

  // 5. Supabase public.post_images 레코드 저장
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
