import { supabase } from '@/api/supabase';

export interface InspectionResult {
  isApproved: boolean;
  reasonCode: 'PASS' | 'SPAM_IRRELEVANT' | 'PROMOTIONAL' | 'INAPPROPRIATE' | string;
  message: string;
}

/**
 * Inspects post quality using Supabase Edge Function 'inspect-post-quality'
 * (with fallback to local rule-based inspection if network/server error occurs).
 */
export async function inspectPostQualityLib(
  title: string,
  content: string
): Promise<InspectionResult> {
  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  // Basic local fast-fail check
  if (!cleanTitle || !cleanContent) {
    return {
      isApproved: false,
      reasonCode: 'SPAM_IRRELEVANT',
      message: '제목과 내용을 모두 입력해 주세요.',
    };
  }

  // 1. Mindless consonant & mashing fast-fail check
  const cleanMashTitle = cleanTitle.replace(/\s+/g, '');
  const cleanMashContent = cleanContent.replace(/\s+/g, '');
  const mashRegex = /(^[ㄱ-ㅎ]{3,}$|^[ㅏ-ㅣ]{3,}$|^[a-z]{6,}$|^[0-9]{8,}$)/i;
  if (mashRegex.test(cleanMashTitle) || mashRegex.test(cleanMashContent)) {
    return {
      isApproved: false,
      reasonCode: 'SPAM_IRRELEVANT',
      message: '의미 없는 초성이나 도배글은 등록할 수 없어요.',
    };
  }

  // 2. Call Supabase Edge Function 'inspect-post-quality'
  try {
    const { data, error } = await supabase.functions.invoke('inspect-post-quality', {
      body: { title: cleanTitle, content: cleanContent },
    });

    if (!error && data && typeof data.is_approved === 'boolean') {
      return {
        isApproved: data.is_approved,
        reasonCode: data.reason_code || (data.is_approved ? 'PASS' : 'SPAM_IRRELEVANT'),
        message: data.message || (data.is_approved ? '' : '게시글 등록 정책에 위배되는 내용이 포함되어 있습니다.'),
      };
    }
  } catch (err) {
    console.warn('inspect-post-quality Edge Function invoke error:', err);
  }

  return {
    isApproved: true,
    reasonCode: 'PASS',
    message: '',
  };
}
