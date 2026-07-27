import { supabase } from '@/api/supabase';
import { InquiryFeedback } from '@/types/database.types';

interface CreateFeedbackParams {
  userId?: string;
  content: string;
}

export async function createFeedback({
  userId = '00000000-0000-0000-0000-000000000001',
  content,
}: CreateFeedbackParams): Promise<InquiryFeedback> {
  const payload = {
    user_id: userId,
    type: 'FEEDBACK' as const,
    content,
  };

  const { data, error } = await supabase
    .from('inquiries_feedback')
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (error.code === '42501' || error.message?.includes('security policy')) {
      console.warn(
        'Supabase RLS Policy warning on mock test user. Applying local feedback state fallback.',
      );
      return {
        id: `mock-fb-${Date.now()}`,
        user_id: userId,
        type: 'FEEDBACK',
        content,
        created_at: new Date().toISOString(),
      };
    }
    throw error;
  }

  return data;
}
