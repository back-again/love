import { inspectPostQualityWithAi } from './aiModeration.lib';

export interface AiVoteOptions {
  oText: string;
  xText: string;
}

// Local fallback rules (what we currently have)
function getLocalFallbackOptions(title: string, detail: string): AiVoteOptions {
  // 1. Try parsing explicit A vs B options first
  const parsed = parseOpposingOptions(title, detail);
  if (parsed) {
    return parsed;
  }

  const text = `${title} ${detail}`.toLowerCase();

  // 2. Prioritize literal question checking (e.g. "내가 예민한거야?", "내가 속좁은거야?")
  if (text.includes('예민') || text.includes('속좁') || text.includes('소심') || text.includes('예민한')) {
    return { oText: '예민한 거 맞아', xText: '선 넘은 거지' };
  }
  if (text.includes('서운') || text.includes('나만')) {
    return { oText: '서운할 만해', xText: '바쁠 수도 있어' };
  }

  // 3. Topic-based rules
  if (text.includes('이별') || text.includes('헤어') || text.includes('끝') || text.includes('손절')) {
    return { oText: '헤어지는 게 맞아', xText: '한 번 더 대화해봐' };
  }
  if (text.includes('연락') || text.includes('카톡') || text.includes('전화') || text.includes('답장') || text.includes('안읽십')) {
    return { oText: '서운할 만해', xText: '바쁠 수도 있어' };
  }
  if (text.includes('더치') || text.includes('돈') || text.includes('계산') || text.includes('비용') || text.includes('데이트통장')) {
    return { oText: '정나미 떨어져', xText: '이해해 줄 수 있어' };
  }
  if (text.includes('고백') || text.includes('짝사랑') || text.includes('마음') || text.includes('고백할까')) {
    return { oText: '지금 고백해!', xText: '조금 더 지켜봐' };
  }
  if (text.includes('바람') || text.includes('여사친') || text.includes('남사친') || text.includes('이성친구') || text.includes('클럽') || text.includes('술자리')) {
    return { oText: '선 넘은 거지', xText: '단순 친목이야' };
  }
  if (text.includes('선물') || text.includes('기념일') || text.includes('생일') || text.includes('100일')) {
    return { oText: '서운할 만하지', xText: '너무 예민한 거야' };
  }
  if (text.includes('결혼') || text.includes('시댁') || text.includes('처가') || text.includes('부모')) {
    return { oText: '신중히 고민해', xText: '맞춰갈 수 있어' };
  }
  if (text.includes('스킨십') || text.includes('잠자리') || text.includes('진도')) {
    return { oText: '이해할 수 있어', xText: '이건 좀 서두르네' };
  }
  if (text.includes('취업') || text.includes('취준') || text.includes('백수') || text.includes('공부')) {
    return { oText: '기다려줘야 해', xText: '현실을 봐야 해' };
  }

  return { oText: '괜찮은 것 같아', xText: '이건 좀 반대야' };
}

function parseOpposingOptions(title: string, detail: string): { oText: string; xText: string } | null {
  const combined = `${title} ${detail}`;

  // 1. VS pattern
  const vsMatch = combined.match(/(.+?)\s+v\.?s\.?\s+(.+)/i);
  if (vsMatch) {
    const optA = cleanOption(vsMatch[1]);
    const optB = cleanOption(vsMatch[2]);
    if (optA && optB) return { oText: optA, xText: optB };
  }

  // 2. "혹은" pattern
  const horMatch = combined.match(/(.+?)\s+혹은\s+(.+)/);
  if (horMatch) {
    const optA = cleanOption(horMatch[1]);
    const optB = cleanOption(horMatch[2]);
    if (optA && optB) return { oText: optA, xText: optB };
  }

  // 3. "아니면" pattern
  const animenMatch = combined.match(/(.+?)\s+아니면\s+(.+)/);
  if (animenMatch) {
    const optA = cleanOption(animenMatch[1]);
    const optB = cleanOption(animenMatch[2]);
    if (optA && optB) return { oText: optA, xText: optB };
  }

  // 4. "랑" and "중에" pattern
  const rangMatch = combined.match(/(.+?)\s*랑\s+(.+?)\s+중에/);
  if (rangMatch) {
    const optA = cleanOption(rangMatch[1]);
    const optB = cleanOption(rangMatch[2]);
    if (optA && optB) return { oText: optA, xText: optB };
  }

  // 5. Slash pattern
  const slashMatch = combined.match(/(.+?)\s*\/\s*(.+)/);
  if (slashMatch) {
    const optA = cleanOption(slashMatch[1]);
    const optB = cleanOption(slashMatch[2]);
    if (optA && optB && !optA.startsWith('http') && optA.length < 25 && optB.length < 25) {
      return { oText: optA, xText: optB };
    }
  }

  // 6. ~나아 ~나아 pattern: e.g. "A가 나아 B가 나아", "A 나아 B 나아"
  const naaMatch = combined.match(/(.+?)\s*(이|가)?\s*나아\s+(.+?)\s*(이|가)?\s*나아/);
  if (naaMatch) {
    const optA = cleanOption(naaMatch[1]);
    const optB = cleanOption(naaMatch[3]);
    if (optA && optB) return { oText: optA, xText: optB };
  }

  return null;
}

function cleanOption(text: string): string {
  let clean = text.trim();
  clean = clean.replace(/^[?.,!\s]+/, '');
  clean = clean.replace(/[?.,!\s]+$/, '');
  clean = clean.replace(/\s*(중에|중|어떤|어떤게|골라줘|추천|뭐가|뭐가나아|뭐가나을까|선택|나을까|나음|나아)\s*$/, '');
  clean = clean.replace(/(이|가|은|는)$/, '');
  const words = clean.split(/\s+/);
  if (words.length > 3) {
    clean = words.slice(-3).join(' ');
  }
  return clean.substring(0, 15);
}

// Real Gemini API call
export async function getAiVoteOptionsLib(
  title: string,
  detail: string
): Promise<AiVoteOptions> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.log('No Gemini API Key found in env. Using local rule-based AI options generator.');
    return getLocalFallbackOptions(title, detail);
  }

  try {
    const promptText = `[역할 정의]
당신은 커뮤니티의 '빠른 의견받기(투표)' 콘텐츠를 분석하여, 투표 버튼(옵션 1, 옵션 2)에 들어갈 가장 직관적이고 커뮤니티 감성에 맞는 맞춤형 선택지 문구를 생성하는 AI 엔진입니다.

[분석 가이드라인]
게시글의 상황(본문), 작성자의 말투/의도, 그리고 질문을 종합 분석하여 아래 5가지 카테고리 중 하나로 분류한 뒤, 유저들이 바로 이입할 수 있는 찰떡같은 선택지 2개를 도출하세요.

1. 유형 A: 고민/판단형 (잘못/예민 여부 판단)
   - 내가 예민한지, 상대가 잘못했는지 등 옳고 그름을 묻는 경우
   - O 옵션: 작성자의 손을 들어주는 동조/인정
   - X 옵션: 작성자의 예민함 지적 또는 상대방 대변
   - 예시: "내가 너무 예민한 거냐?" ➔ [O: ㅇㅇ 네가 예민함] / [X: ㄴㄴ 상대가 선 넘음]

2. 유형 B: 선택/양자택일형 (A안 / B안)
   - A vs B 중 어떤 것을 선택할지 골라달라고 하는 경우
   - 가장 팽팽하게 갈릴 만한 핵심 파벌 2개로 나눔
   - 예시: "제주도 여행 vs 스위트룸 호캉스" ➔ [A: 연차 쓰고 제주도] / [B: 힐링 스위트룸]

3. 유형 C: 상황 공감/경험 공유형 (동병상련 여부)
   - 특정한 상태/유형의 유저들에게 공감이나 동일한 경험 여부를 물을 때
   - O 옵션: "나도 그렇다" (동병상련/공감)
   - X 옵션: "나는 아니다" (상반된 상황/극복함)
   - 예시: "장기연애 권태기 온 사람 있어?" ➔ [O: 나도 요즘 권태기임] / [X: 전혀, 여전히 달달함]

4. 유형 D: 조언/액션 추천형 (행동 방향 선택)
   - "잡을까? 말까?", "말할까? 참을까?"처럼 취해야 할 행동 방향을 묻는 경우
   - A 옵션: 능동적/직진 행동 (말한다, 잡는다 등)
   - B 옵션: 수동적/신중 행동 (참는다, 기다린다 등)
   - 예시: "헤어진 전애인한테 연락해 볼까?" ➔ [A: 미련 남으면 연락해] / [B: 참고 차라리 잊어]

5. 유형 E: 평가/감상형 (긍정 반응 vs 부정 반응) ⭐ 신규 추가
   - "너네는 어떻게 생각해?", "이거 어때?"처럼 특정 상황/행동에 대한 감정적 평가나 반응을 묻는 경우
   - O 옵션: 긍정적인 평가 (귀엽다, 호의적이다, 세심하다 등)
   - X 옵션: 부정적인 평가 (짜친다, 별로다, 센스없다 등)
   - 예시: "남친이 PX에서 생선 사다 줬는데 어떰?" ➔ [O: 솔직히 귀여움/감동] / [X: 와 그건 좀 짜친다]

[출력 형식 (JSON)]
반드시 다른 설명 없이 아래 JSON 형식으로만 응답하세요.

{
  "category": "유형 A(판단)" 또는 "유형 B(선택)" 또는 "유형 C(공감)" 또는 "유형 D(액션)" 또는 "유형 E(평가)",
  "reasoning": "상황과 질문 분석 요약 (1문장)",
  "option_1": "옵션 1 문구 (15자 이내)",
  "option_2": "옵션 2 문구 (15자 이내)"
}

[입력 데이터]
질문(제목): ${title}
상황(본문): ${detail}`;

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
      if (parsed.option_1 && parsed.option_2) {
        return {
          oText: parsed.option_1.substring(0, 15),
          xText: parsed.option_2.substring(0, 15),
        };
      }
    }

    throw new Error('Invalid response structure from Gemini');
  } catch (error) {
    console.warn('Failed to call Gemini API. Falling back to local AI options:', error);
    return getLocalFallbackOptions(title, detail);
  }
}
