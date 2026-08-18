import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

interface ReportPostParams {
  postId: string;
  reportedUserId?: string;
  reason?: string;
}

export async function reportPostLib({
  postId,
  reportedUserId,
  reason = '부적절한 게시글',
}: ReportPostParams): Promise<void> {
  const reporterId = await getCurrentUserId();
  if (!reporterId) {
    throw new Error('로그인이 필요합니다.');
  }

  const rawPostId = postId.split('-loop-')[0];

  const { error } = await supabase
    .from('user_reports')
    .insert({
      reporter_id: reporterId,
      reported_user_id: reportedUserId || reporterId,
      target_type: 'POST',
      target_id: rawPostId,
      reason,
    });

  if (error) {
    console.warn('reportPostLib error:', error.message);
    throw error;
  }
}
