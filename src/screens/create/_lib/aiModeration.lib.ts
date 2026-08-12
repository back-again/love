export interface AiModerationResult {
  isValid: boolean;
  reason: string;
  suggestion?: string;
}

// Local rule-based fallback
function inspectPostQualityWithLocalFallback(
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

  // 1. Mindless consonant & keyboard mashing check
  const cleanMashTitle = cleanTitle.replace(/\s+/g, '');
  const cleanMashContent = cleanContent.replace(/\s+/g, '');
  const mashRegex = /(^[ㄱ-ㅎ]{3,}$|^[ㅏ-ㅣ]{3,}$|^[a-z]{6,}$|^[0-9]{8,}$)/i;

  if (mashRegex.test(cleanMashTitle) || mashRegex.test(cleanMashContent)) {
    return {
      isValid: false,
      reason: '의미 없는 초성이나 도배글은 등록할 수 없어요.',
      suggestion: '다른 유저분들이 이해할 수 있도록 사연 내용을 정돈해서 작성해 주세요.',
    };
  }

  // 2. Promotional & advertising spam check
  const promoRegex = /(http:\/\/|https:\/\/|open\.kakao|텔레그램|대출|토토|바카라|성인사이트|카톡ID)/i;
  if (promoRegex.test(cleanTitle) || promoRegex.test(cleanContent)) {
    return {
      isValid: false,
      reason: '외부 링크나 홍보/광고 목적의 게시글은 커뮤니티 정책상 등록이 제한돼요.',
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

export async function inspectPostQualityWithAi(
  title: string,
  content: string
): Promise<AiModerationResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.log('No Gemini API Key found in env. Using local rule-based AI moderation.');
    return inspectPostQualityWithLocalFallback(title, content);
  }

  try {
    const promptText = `[역할 정의]
당신은 커뮤니티 및 서비스 내 게시글 품질을 관리하는 'AI 콘텐츠 모더레이터'입니다. 
사용자가 작성한 글을 검토하여 서비스 정책에 위배되는 글을 필터링하고, 차단 시 정해진 제재 문구를 정확히 반환합니다.

[검토 및 제재 문구 규칙]
게시글 검토 결과 아래 사유에 해당할 경우, 지정된 제재 문구를 정확히 출력하세요.

1. SPAM_IRRELEVANT (무지성 초성 / 의미 없는 도배 / 성의 없는 글)
   - 의미 없는 자음/모음 연속 입력 (예: ㄴㅇㄹ, ㄱㅅㄷ, ㅋㅋㅋㅋㅋ 도배)
   - 키보드를 무작위로 타격한 문자열 반복 및 의미 없는 단문
   - [출력 문구]: "의미 없는 초성이나 도배글은 등록할 수 없어요."

2. PROMOTIONAL (광고 / 홍보 / 스팸성 글)
   - 상업적 목적의 외부 링크, 오픈채팅방 링크, 추천인 코드 포함
   - 특정 제품, 서비스, 주식/코인 리딩방, 불법 도박 등 홍보 및 유도
   - [출력 문구]: "외부 링크나 홍보/광고 목적의 게시글은 커뮤니티 정책상 등록이 제한돼요."

3. INAPPROPRIATE (비방 / 욕설 / 부적절한 언행)
   - 과도한 비속어, 특정인/집단에 대한 무분별한 비방 및 차별적 표현
   - [출력 문구]: "과도한 비속어나 상대방을 비방하는 표현은 수정 후 다시 시도해 주세요."

[출력 형식]
다른 설명 없이 아래 JSON 형식으로만 응답하세요.

{
  "is_approved": true 또는 false,
  "reason_code": "PASS" | "SPAM_IRRELEVANT" | "PROMOTIONAL" | "INAPPROPRIATE",
  "message": "위에서 지정된 차단 문구 (통과 시 빈 문자열 \"\")"
}

[입력 데이터]
제목: ${title}
본문: ${content}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const resJson = await response.json();
    const resultText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      return {
        isValid: parsed.is_approved === true,
        reason: parsed.message || '정책 위반으로 등록할 수 없습니다.',
        suggestion: parsed.reason_code === 'SPAM_IRRELEVANT'
          ? '다른 유저분들이 이해할 수 있도록 사연 내용을 정돈해서 작성해 주세요.'
          : parsed.reason_code === 'PROMOTIONAL'
          ? '커뮤니티 가이드라인에 맞는 고민 사연을 작성해 주세요.'
          : '내용을 수정해 주세요.',
      };
    }

    throw new Error('Invalid response structure from Gemini');
  } catch (error) {
    console.warn('Failed to call Gemini API for moderation. Falling back to local check:', error);
    return inspectPostQualityWithLocalFallback(title, content);
  }
}
