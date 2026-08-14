import { useUserStore } from '@/_state/useUserStore';
import { RelationshipProfile } from '@/screens/chat/_state/useRelationshipProfileStore';
import { PostItemData } from '../_model/chatDetail.model';

export const COMPREHENSIVE_TOPICS = [
  '이 사람과 미래를 그려도 괜찮은 사람일까?',
  '그 사람과 나의 성향 차이 종합 분석하기',
  '반복되는 갈등 원인과 해결 패턴 찾기',
  '유저들이 말하는 이 관계의 솔직한 시그널',
  '이 연애를 계속 이어가도 될까? (관계 건강도 진단)',
];

export function getDdayCounselingText(days: number, query: string): string {
  const isEarlyDating = days <= 150;
  const isLongDating = days >= 700;

  if (isEarlyDating) {
    if (
      query.includes('거짓말') ||
      query.includes('바람') ||
      query.includes('남사친') ||
      query.includes('여사친') ||
      query.includes('싸움')
    ) {
      return `현재 연애 ${days}일 차로 연애 초반이신데 벌써 이와 같은 신뢰나 가치관 갈등이 발생하고 있군요. 연애 초기에는 서로 맞춰가는 단계이지만, 반복되는 신뢰 문제나 갈등은 이 시기 연애로는 적합하지 않은 경고 신호(Red Flag)일 수 있습니다. 상대방을 지나치게 배려하기보다, 단호히 대화해 보세요.`;
    }
    return `현재 연애 ${days}일 차로 서로를 한창 알아가며 맞춰가는 연애 초반이시네요. 이 시기에는 작은 서운함도 마음속에 쌓아두기보다, 그때그때 정중하고 예쁘게 대화의 기준을 세워 나가는 편이 장기 연애로 가는 튼튼한 다리가 되어줍니다.`;
  } else if (isLongDating) {
    if (
      query.includes('권태') ||
      query.includes('식었') ||
      query.includes('재미') ||
      query.includes('지루') ||
      query.includes('헤어') ||
      query.includes('이별')
    ) {
      return `벌써 연애를 시작한 지 ${days}일(${Math.floor(days / 365)}년 이상)이 지난 깊고 소중한 장기 연애를 이어오고 계시네요. 오래 연애하신 만큼 서로 익숙해져 설렘이 무뎌지는 권태감이나 결혼/미래에 대한 진지한 고민이 깊어질 수 있는 시기입니다. 이 고민을 외면하기보다, 단둘이 깊은 미래에 대한 로드맵을 맞춰보는 시간을 제안드려요.`;
    }
    return `현재 연애 ${days}일 차의 깊고 두터운 관계를 맺어오고 계시네요. 서로를 가장 잘 아는 시기인 만큼, 가벼운 섭섭함이 해묵은 갈등으로 번지지 않도록 대화를 통해 서로의 감정을 점검해 주시는 것을 추천합니다.`;
  } else {
    if (
      query.includes('결혼') ||
      query.includes('가족') ||
      query.includes('돈') ||
      query.includes('미래')
    ) {
      return `현재 연애 ${days}일 차로, 점차 연애 안정기에 들어서며 미래나 현실적인 문제(결혼, 가치관, 경제적 부분)가 슬슬 수면 위로 올라오는 시기입니다. 이 시기에는 막연한 연애 감정만으로 타협하기 어렵기 때문에 서로의 구체적인 기준을 맞춰보는 진지한 조율이 반드시 필요해요.`;
    }
    return `현재 연애 ${days}일 차의 서로에 대한 신뢰와 안정감이 한창 두터워지는 시기를 지나고 계시네요. 사소하게 거슬리거나 맞지 않는 조각들이 있다면, 묵히지 말고 상대방에게 편안한 분위기 속에서 털어놓아 보세요.`;
  }
}

export function generateInitialGreeting(
  profile: RelationshipProfile | null,
): string {
  return profile
    ? `안녕하세요 두두님! 연애 상담원 두림이입니다. 💖\n\n두두님의 연애 추구미인 '${profile.typeTitle}' 성향과 갈등 해결 방식('${profile.conflictHeadline}')을 기억하고 있어요.\n\n두두님의 피해야 할 상대 기준을 바탕으로 단호하고 명확한 솔루션을 들려드릴게요. 오늘 어떤 이야기가 나누고 싶으신가요?`
    : `안녕하세요 두두님! 연애 상담원 두림이입니다. 💖\n\n연애 고민, 감정 토로, 한풀이 대화 등 무엇이든 이야기해주세요. 상단에서 '내 연애 추구미'를 진단받으시면 더욱 정밀한 맞춤 솔루션을 받아보실 수 있습니다.`;
}

export function generateCounselingResponse(
  textToSend: string,
  profile: RelationshipProfile | null,
): string {
  const currentUser = useUserStore.getState().user;
  let diffDays = 0;
  if (currentUser?.dating_started_at) {
    try {
      const startDate = new Date(currentUser.dating_started_at);
      const today = new Date();
      startDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - startDate.getTime();
      diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch (e) {
      console.warn('Failed to calculate diffDays:', e);
    }
  }

  const ddayDurationText =
    diffDays > 0 ? getDdayCounselingText(diffDays, textToSend) : '';

  const isRuleViolation =
    textToSend.includes('거짓말') ||
    textToSend.includes('속임') ||
    textToSend.includes('잠수') ||
    textToSend.includes('회피') ||
    textToSend.includes('스킨십') ||
    textToSend.includes('강제') ||
    textToSend.includes('조급') ||
    textToSend.includes('개선') ||
    textToSend.includes('반복') ||
    textToSend.includes('넘어가') ||
    textToSend.includes('또') ||
    textToSend.includes('헤어') ||
    textToSend.includes('이별');

  if (isRuleViolation && profile) {
    const avoidReason =
      profile.avoidPartners?.[0]?.desc || '회피와 개선 의지 부족 행동';
    return (
      `두두님, 대화를 나누어보아도 ${avoidReason} 태도가 반복된다면 무조건 이별을 고민하셔야 할 때입니다.\n\n` +
      (ddayDurationText ? `[연애 기간 분석]\n${ddayDurationText}\n\n` : '') +
      `두두님의 연애 성향(${profile.typeTitle})을 파악해본 바, 상대방의 변화 없는 행동을 끌어안고 참으시면 두두님의 마음 상처만 깊어집니다.\n\n` +
      `두두님 자신을 소중히 지키기 위해 이 관계는 단호하게 정돈하시고 이별을 선택하시는 것을 권유해 드려요.`
    );
  }

  let responseText = profile
    ? `두두님의 연애 추구미인 '${profile.typeTitle}' 성향을 고려하면, ${profile.conflictHeadline}처럼 마음에 묵혀두기보다 솔직하게 대화로 풀어내는 편이 두두님 마음 건강에 가장 좋습니다.`
    : '두두님이 말씀하신 내용에 진심으로 공감이 돼요. 상대방의 입장을 한 번 헤아려보시되, 두두님이 느끼는 솔직한 감정을 전해보는 걸 추천해요.';

  if (ddayDurationText) {
    responseText = `[연애 기간 분석]\n${ddayDurationText}\n\n` + responseText;
  }

  return responseText;
}
