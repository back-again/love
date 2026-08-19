// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
    }

    // 1. Fetch AI Prompt from ai_prompts table
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: promptRow, error: promptError } = await supabase
      .from('ai_prompts')
      .select('prompt')
      .eq('type', 'inspect_post_quality')
      .single();

    if (promptError || !promptRow?.prompt) {
      throw new Error(`AI 프롬프트를 불러올 수 없습니다: ${promptError?.message || '데이터 없음'}`);
    }

    const systemInstruction = promptRow.prompt;
    const promptText = `제목: "${title}"\n본문: "${content}"`;

    // 2. Call Gemini API
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
