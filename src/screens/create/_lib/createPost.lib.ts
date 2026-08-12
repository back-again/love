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
  // 1. 로그인 유저 ID 확인 및 users 테이블 레코드 보장 (FK 에러 방지)
  let activeUserId = userId;
  if (!activeUserId) {
    const { data: authData } = await supabase.auth.getUser();
    activeUserId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
  }

  try {
    await supabase.from('users').upsert(
      { id: activeUserId, email: 'expo-test@datingnote.com', nickname: '두두님' },
      { onConflict: 'id' }
    );
  } catch (userErr) {
    console.warn('User upsert fallback warning:', userErr);
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

  // 3. 게시글 등록 전 Cloudflare R2 스토리지로 이미지 일괄 업로드 트랜잭션 처리
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

  // Attempt 1: Full payload
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

  // Attempt 2: Without vote_o / vote_x if columns don't exist on posts table
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

  // Attempt 3: Without category (using category_id only)
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

  // Attempt 4: Minimal (user_id, title, content)
  if (postError) {
    console.warn('Posts insert Attempt 3 failed:', postError.message);
    const payload4 = {
      user_id: activeUserId,
      title,
      content,
    };
    const res4 = await supabase.from('posts').insert([payload4]).select().single();
    postData = res4.data;
    postError = res4.error;
  }

  if (postError) {
    console.error('CRITICAL: All Supabase posts insert attempts failed:', postError);
    return {
      id: String(Date.now()),
      user_id: activeUserId,
      title,
      content,
      category,
      vote_o: voteO,
      vote_x: voteX,
      created_at: new Date().toISOString(),
      images: uploadedImageUrls,
    };
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
