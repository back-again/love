import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { InquiryFeedback } from '@/types/database.types';

interface CreateFeedbackParams {
  userId?: string;
  content: string;
}

export async function createFeedback({
  userId,
  content,
}: CreateFeedbackParams): Promise<InquiryFeedback> {
  const activeUserId = userId || (await getCurrentUserId());
  if (!activeUserId) {
    throw new Error('로그인이 필요합니다.');
  }

  const payload = {
    user_id: activeUserId,
    type: 'FEEDBACK' as const,
    content,
  };

  const { data, error } = await supabase
    .from('inquiries_feedback')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
