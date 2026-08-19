/**
 * Rule-based Vote Option Generator:
 * Performs semantic analysis of the post title & content to dynamically generate realistic Korean O/X options.
 */
export function getDefaultVoteOptions(
  title: string = '',
  content: string = '',
  itemVoteO?: string,
  itemVoteX?: string
): { voteO: string; voteX: string } {
  const result = getRawDefaultVoteOptions(title, content, itemVoteO, itemVoteX);
  return {
    voteO: result.voteO.slice(0, 15).trim(),
    voteX: result.voteX.slice(0, 15).trim(),
  };
}

function getRawDefaultVoteOptions(
  title: string = '',
  content: string = '',
  itemVoteO?: string,
  itemVoteX?: string
): { voteO: string; voteX: string } {
  if (itemVoteO && itemVoteX) {
    return { voteO: itemVoteO, voteX: itemVoteX };
  }

  const cleanTitle = title.trim();
  const cleanContent = content.trim();
  const text = `${cleanTitle} ${cleanContent}`.toLowerCase();

  // 1. Direct question pattern extraction from title
  if (cleanTitle.includes('고백할까') || cleanTitle.includes('고백 해야') || cleanTitle.includes('고백')) {
    return { voteO: '지금 고백해', voteX: '아직 고백하지 마' };
  }
  if (cleanTitle.includes('헤어질까') || cleanTitle.includes('헤어져야') || cleanTitle.includes('헤어')) {
    return { voteO: '헤어지는 게 맞아', voteX: '더 만나보는 게 좋아' };
  }
  if (cleanTitle.includes('말할까') || cleanTitle.includes('말해야') || cleanTitle.includes('말해')) {
    return { voteO: '솔직히 말하자', voteX: '속으로 참고 넘어가' };
  }
  if (cleanTitle.includes('연락할까') || cleanTitle.includes('선톡') || cleanTitle.includes('연락')) {
    return { voteO: '먼저 연락해', voteX: '기다리는 게 나아' };
  }
  if (cleanTitle.includes('살까') || cleanTitle.includes('지를까') || cleanTitle.includes('구매')) {
    return { voteO: '지르는 게 맞아', voteX: '지갑 지켜' };
  }
  if (cleanTitle.includes('퇴사') || cleanTitle.includes('이직')) {
    return { voteO: '퇴사가 답이다', voteX: '버티는 게 이기는 거야' };
  }

  // 2. Keyword & Theme semantic extraction
  if (text.includes('재회') || text.includes('전애인') || text.includes('다시 만')) {
    return { voteO: '다시 시도해보자', voteX: '이미 끝난 사이야' };
  }
  if (text.includes('이별') || text.includes('헤어') || text.includes('차임')) {
    return { voteO: '미련 버리고 정해', voteX: '한 번 더 대화해봐' };
  }
  if (text.includes('짝사랑') || text.includes('썸')) {
    return { voteO: '용기 내서 표현해', voteX: '아직은 시기상조야' };
  }
  if (text.includes('답장') || text.includes('카톡') || text.includes('읽씹')) {
    return { voteO: '먼저 다가가자', voteX: '자존심 지켜' };
  }
  if (text.includes('데이트통장') || (text.includes('더치페이') && text.includes('통장'))) {
    return { voteO: '더치페이가 깔끔해', voteX: '데이트통장이 훨씬 편해' };
  }
  if (text.includes('더치페이') || text.includes('데이트비용') || text.includes('계산') || text.includes('선물') || text.includes('돈')) {
    return { voteO: '이 정도는 이해해', voteX: '선 넘은 게 맞아' };
  }
  if (text.includes('여사친') || text.includes('남사친') || text.includes('이성친구') || text.includes('바람')) {
    return { voteO: '서운할 만해', voteX: '이해해 줄 수 있어' };
  }
  if (text.includes('결혼') || text.includes('동거') || text.includes('시댁') || text.includes('처가')) {
    return { voteO: '신중하게 판단해', voteX: '단호하게 의사표현해' };
  }
  if (text.includes('거절') || text.includes('약속') || text.includes('친구') || text.includes('싸움')) {
    return { voteO: '솔직하게 풀어', voteX: '시간을 두고 보자' };
  }

  // 3. Fallback pattern for general questions
  if (cleanTitle.endsWith('?') || cleanTitle.includes('어때')) {
    return { voteO: '완전 괜찮아', voteX: '난 좀 별로야' };
  }

  return { voteO: '찬성해 (그럴 수 있어)', voteX: '반대해 (선 넘었어)' };
}
