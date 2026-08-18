import { supabase } from '@/api/supabase';

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
  const { data: authData } = await supabase.auth.getUser();
  const reporterId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

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
  }
}
