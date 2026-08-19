import { supabase } from '@/api/supabase';

export interface VoteOptionsResult {
  oText: string;
  xText: string;
}

// In-Memory Cache Map to avoid duplicate AI API calls for identical title & detail
const optionsCache = new Map<string, VoteOptionsResult>();

// Local Fallback Rule Engine
function getLocalFallbackOptions(title: string, detail: string): VoteOptionsResult {
  const text = `${title} ${detail}`.toLowerCase();

  if (text.includes('이별') || text.includes('헤어') || text.includes('끝')) {
    return { oText: '헤어지는 게 맞아', xText: '한 번 더 대화해봐' };
  }
  if (text.includes('연락') || text.includes('카톡') || text.includes('전화') || text.includes('답장')) {
    return { oText: '서운할 만해', xText: '이해해 줘야 해' };
  }
  if (text.includes('더치') || text.includes('돈') || text.includes('계산') || text.includes('비용')) {
    return { oText: '정나미 떨어져', xText: '솔직해서 괜찮아' };
  }
  if (text.includes('고백') || text.includes('짝사랑') || text.includes('마음')) {
    return { oText: '지금 고백해!', xText: '조금 더 지켜봐' };
  }
  if (text.includes('바람') || text.includes('여사친') || text.includes('남사친') || text.includes('클럽')) {
    return { oText: '선 넘은 거지', xText: '믿어줘야 해' };
  }
  if (text.includes('선물') || text.includes('기념일') || text.includes('생일')) {
    return { oText: '마음이 부족해', xText: '센스가 아쉬워' };
  }
  if (text.includes('결혼') || text.includes('시댁') || text.includes('부모')) {
    return { oText: '신중히 고민해', xText: '대화로 맞춰가' };
  }

  return { oText: '괜찮은 것 같아', xText: '난 별로야' };
}

/**
 * Generates O/X Vote Options by invoking Supabase Edge Function 'generate-vote-options'
 * (Reuses cached result if title & detail are identical; falls back to local rules on error).
 */
export async function generateAiVoteOptions(
  title: string,
  detail: string
): Promise<VoteOptionsResult> {
  const cacheKey = `${title.trim()}:::${detail.trim()}`;

  // Return cached result immediately if title & detail haven't changed
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-vote-options', {
      body: { title, detail },
    });

    if (!error && data) {
      if (data.oText === '' || data.xText === '') {
        const result = { oText: '', xText: '' };
        optionsCache.set(cacheKey, result);
        return result;
      }
      if (data.oText && data.xText) {
        const result = {
          oText: data.oText.slice(0, 10).trim(),
          xText: data.xText.slice(0, 10).trim(),
        };
        optionsCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Edge Function invoke failed, using local rule fallback:', err);
  }

  const fallbackResult = getLocalFallbackOptions(title, detail);
  const slicedFallback = {
    oText: fallbackResult.oText.slice(0, 10).trim(),
    xText: fallbackResult.xText.slice(0, 10).trim(),
  };
  optionsCache.set(cacheKey, slicedFallback);
  return slicedFallback;
}
