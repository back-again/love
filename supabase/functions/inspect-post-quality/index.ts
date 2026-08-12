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
    const { title = '', content = '' } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    const systemInstruction = `
[역할 정의]
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
반드시 다른 설명 없이 아래 JSON 형식으로만 응답하세요.

{
"is_approved": true 또는 false,
"reason_code": "PASS" | "SPAM_IRRELEVANT" | "PROMOTIONAL" | "INAPPROPRIATE",
"message": "위에서 지정된 차단 문구 (통과 시 빈 문자열 \"\")"
}
`;

    const promptText = `제목: "${title}"\n본문: "${content}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsedResult = {
      is_approved: true,
      reason_code: 'PASS',
      message: '',
    };

    try {
      const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonObj = JSON.parse(cleanJsonStr);
      if (typeof jsonObj.is_approved === 'boolean') {
        parsedResult = {
          is_approved: jsonObj.is_approved,
          reason_code: jsonObj.reason_code || (jsonObj.is_approved ? 'PASS' : 'SPAM_IRRELEVANT'),
          message: jsonObj.message || '',
        };
      }
    } catch (parseError) {
      console.warn('[inspect-post-quality] JSON parse error:', parseError);
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        is_approved: true,
        reason_code: 'PASS',
        message: '',
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
