// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { title = '', detail = '' } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    console.log(`[Edge Function] Analyzing title: "${title}", detail: "${detail}"`);

    const systemInstruction = `
[역할 정의]
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
5. 유형 E: 평가/감상형 (긍정 반응 vs 부정 반응)
    - "너네는 어떻게 생각해?", "이거 어때?"처럼 특정 상황/행동에 대한 감정적 평가나 반응을 묻는 경우
    - O 옵션: 긍정적인 평가 (귀엽다, 호의적이다, 세심하다 등)
    - X 옵션: 부정적인 평가 (짜친다, 별로다, 센스없다 등)
    - 예시: "남친이 PX에서 생선 사다 줬는데 어떰?" ➔ [O: 솔직히 귀여움/감동] / [X: 와 그건 좀 짜친다]

[예외 처리: 분류 불가 / 투표 불가 게시글]
- 단순 인사말("안녕하세요 반가워요"), 맥락 없는 일상/일기글, 투표의 의도가 전혀 없는 글, 내용이 너무 부족하여 분석이 불가능한 경우
- O/X나 A/B 형태의 선택지로 나눌 수 없다고 판단되면 아래와 같이 모든 필드에 null을 반환하세요.

[출력 형식 (JSON)]
반드시 다른 설명 없이 아래 JSON 형식으로만 응답하세요.

(정상 분류 시)
{
"category": "유형 A(판단)" | "유형 B(선택)" | "유형 C(공감)" | "유형 D(액션)" | "유형 E(평가)",
"reasoning": "상황과 질문 분석 요약 (1문장)",
"option_1": "옵션 1 문구 (15자 이내)",
"option_2": "옵션 2 문구 (15자 이내)"
}

(분류 불가 / 예외 발생 시)
{
"category": null,
"reasoning": null,
"option_1": null,
"option_2": null
}
`;

    const promptText = `제목: "${title}"\n내용: "${detail}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
          },
        }),
      }
    );

    const data = await response.json();
    console.log('[Edge Function] Gemini Response data:', JSON.stringify(data));

    if (data.error) {
      throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsedResult = {
      category: '유형 A(판단)',
      reasoning: '기본 선택지 생성 완료',
      oText: '괜찮은 것 같아',
      xText: '난 별로야',
    };

    try {
      const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonObj = JSON.parse(cleanJsonStr);
      if (jsonObj.option_1 === null || jsonObj.option_2 === null) {
        parsedResult = {
          category: '분석 불가',
          reasoning: '분석하기에 정보가 부족하여 기본 예시 표시',
          oText: '',
          xText: '',
        };
      } else if (jsonObj.option_1 && jsonObj.option_2) {
        parsedResult = {
          category: jsonObj.category || '유형 A(판단)',
          reasoning: jsonObj.reasoning || '',
          oText: String(jsonObj.option_1).trim(),
          xText: String(jsonObj.option_2).trim(),
        };
      }
    } catch (parseError) {
      console.warn('[Edge Function] JSON parsing error from Gemini output:', parseError);
    }

    console.log('[Edge Function] Final parsed result:', JSON.stringify(parsedResult));

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('[Edge Function] Internal Error:', error);
    return new Response(
      JSON.stringify({
        category: '오류',
        reasoning: error.message,
        oText: '괜찮은 것 같아',
        xText: '난 별로야',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
