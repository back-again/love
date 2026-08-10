export interface AiModerationResult {
  isValid: boolean;
  reason: string;
  suggestion?: string;
}

/**
 * AI Content Inspection & Quality Moderation Engine
 * Evaluates whether a post has genuine substance, clarity, and context before submission.
 */
export function inspectPostQualityWithAi(
  title: string,
  content: string
): AiModerationResult {
  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  // 1. Minimum character length check
  if (cleanTitle.length < 3) {
    return {
      isValid: false,
      reason: '제목이 너무 짧습니다.',
      suggestion: '고민의 핵심 질문을 3자 이상으로 명확하게 작성해 주세요.',
    };
  }

  if (cleanContent.length < 8) {
    return {
      isValid: false,
      reason: '고민 설명이 너무 부족해요.',
      suggestion: '어떤 고민 상황인지 8자 이상으로 조금만 더 구체적으로 적어주시면 유용한 투표 의견을 얻을 수 있어요!',
    };
  }

  // 2. Meaningless keyboard mashing / Gibberish detection (e.g., asdfgh, zxcvbn, 123456, ㅋㅋㅋ)
  const gibberishRegex = /(^[a-z]+$|^[0-9]+$|^[ㄱ-ㅎ]+$|^[ㅏ-ㅣ]+$)/i;
  const isGibberishTitle = gibberishRegex.test(cleanTitle.replace(/\s+/g, ''));
  const isGibberishContent = gibberishRegex.test(cleanContent.replace(/\s+/g, ''));

  if (isGibberishTitle || isGibberishContent) {
    return {
      isValid: false,
      reason: '단순 자음/모음이나 무의미한 자판 입력으로 작성된 글이에요.',
      suggestion: '다른 유저분들이 솔직하게 투표할 수 있도록 진정성 있는 고민 내용을 작성해 주세요.',
    };
  }

  // 3. Excessive repetitive character detection (e.g., "ㅋㅋㅋㅋㅋㅋㅋ", "........", "?????")
  const repetitiveRegex = /(.)\1{5,}/;
  if (repetitiveRegex.test(cleanTitle) || repetitiveRegex.test(cleanContent)) {
    return {
      isValid: false,
      reason: '동일한 문자가 너무 많이 반복되어 있어요.',
      suggestion: '반복되는 문자를 정리하고 고민의 본문 내용을 다듬어 주세요.',
    };
  }

  // 4. Low-effort single word vague post check
  const lowEffortKeywords = ['테스트', 'test', 'asdf', 'qwer', 'zxcv', '아무거나', 'ㅁㄴㅇㄹ', 'ㄱㄴㄷㄹ'];
  const isLowEffort = lowEffortKeywords.some(
    kw => cleanTitle.toLowerCase() === kw || cleanContent.toLowerCase() === kw
  );

  if (isLowEffort) {
    return {
      isValid: false,
      reason: '성의 없이 작성되었거나 테스트용 글로 판단됩니다.',
      suggestion: '실제 경험하신 고민이나 조언이 필요한 질문을 작성해 주시면 감사하겠습니다!',
    };
  }

  // Pass AI Moderation inspection
  return {
    isValid: true,
    reason: '검토 완료. 등록 가능한 고품질 사연입니다.',
  };
}
