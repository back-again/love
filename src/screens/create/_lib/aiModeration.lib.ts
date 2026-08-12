export interface AiModerationResult {
  isValid: boolean;
  reason: string;
  suggestion?: string;
}

/**
 * AI Content Moderation Engine
 * Moderates only mindless consonant/keyboard mashing or promotional spam.
 */
export function inspectPostQualityWithAi(
  title: string,
  content: string
): AiModerationResult {
  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  if (cleanTitle.length === 0) {
    return {
      isValid: false,
      reason: '제목을 입력해 주세요.',
      suggestion: '고민의 질문 제목을 작성해 주세요.',
    };
  }

  if (cleanContent.length === 0) {
    return {
      isValid: false,
      reason: '고민 내용을 입력해 주세요.',
      suggestion: '고민 상황을 작성해 주세요.',
    };
  }

  // 1. Mindless consonant & keyboard mashing check (e.g., ㄴㅇㄹㅁㄴㅇㄹ, ㅁㄴㅇㄹ, asdfghjkl)
  const cleanMashTitle = cleanTitle.replace(/\s+/g, '');
  const cleanMashContent = cleanContent.replace(/\s+/g, '');
  const mashRegex = /(^[ㄱ-ㅎ]{3,}$|^[ㅏ-ㅣ]{3,}$|^[a-z]{6,}$|^[0-9]{8,}$)/i;

  if (mashRegex.test(cleanMashTitle) || mashRegex.test(cleanMashContent)) {
    return {
      isValid: false,
      reason: '무지성 초성 남발이나 자판 도배글은 작성할 수 없어요.',
      suggestion: '다른 유저분들이 이해할 수 있도록 사연 내용을 정돈해서 작성해 주세요.',
    };
  }

  // 2. Promotional & advertising spam check
  const promoRegex = /(http:\/\/|https:\/\/|open\.kakao|텔레그램|대출|토토|바카라|성인사이트|카톡ID)/i;
  if (promoRegex.test(cleanTitle) || promoRegex.test(cleanContent)) {
    return {
      isValid: false,
      reason: '광고성 또는 홍보 목적의 글은 등록할 수 없습니다.',
      suggestion: '커뮤니티 가이드라인에 맞는 고민 사연을 작성해 주세요.',
    };
  }

  // 3. Extreme repetition check
  const extremeRepetition = /(.)\1{14,}/;
  if (extremeRepetition.test(cleanTitle) || extremeRepetition.test(cleanContent)) {
    return {
      isValid: false,
      reason: '동일한 문자가 너무 많이 반복되어 있습니다.',
      suggestion: '반복되는 문자를 조금만 정돈해서 작성해 주세요.',
    };
  }

  return {
    isValid: true,
    reason: '검토 완료. 등록 가능합니다.',
  };
}
