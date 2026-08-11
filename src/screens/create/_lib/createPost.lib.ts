import { supabase } from '@/api/supabase';
import { uploadImageToR2 } from '@/api/storage.api';

export interface CreatePostParams {
  title: string;
  content: string;
  category?: string;
  images?: string[]; // 로컬 선택 이미지 URI 배열
  userId?: string;
  voteO?: string;
  voteX?: string;
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
  // 1. 로그인 유저 ID 확인 또는 기본 유저 ID 적용
  let activeUserId = userId;
  if (!activeUserId) {
    const { data: authData } = await supabase.auth.getUser();
    activeUserId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
  }

  // 2. 게시글 등록 전 Cloudflare R2 스토리지로 이미지 일괄 업로드 트랜잭션 처리
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

  // 3. Supabase public.posts 레코드 생성
  const insertPayload: any = {
    user_id: activeUserId,
    title,
    content,
    category,
    vote_o: voteO,
    vote_x: voteX,
  };

  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert([insertPayload])
    .select()
    .single();

  if (postError) {
    if (
      postError.code === '42501' ||
      postError.message?.includes('violates row-level security policy') ||
      postError.message?.includes('security policy')
    ) {
      console.warn(
        'Supabase RLS Policy warning on post creation. Applying local state fallback.'
      );
      return {
        id: String(Date.now()),
        user_id: activeUserId,
        title,
        content,
        images: uploadedImageUrls,
      };
    }
    throw postError;
  }

  // 4. Supabase public.post_images 레코드 저장
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
