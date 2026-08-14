import { RelationshipProfile } from '../../_state/useRelationshipProfileStore';
import { QuizQuestion } from '../_model/quiz.model';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      '1. 바쁜 하루 중 연인의 연락 텀이 4시간 이상 길어질 때 나의 심리 상태는?',
    options: [
      {
        text: '상대방의 상황이나 개인 시간을 존중하며 내 일상에 집중한다.',
        trait: 'independent',
      },
      {
        text: '서운함이나 불안감이 시작되며 무슨 일인지 상태를 확인하고 싶어진다.',
        trait: 'attached',
      },
    ],
  },
  {
    id: 2,
    question:
      '2. 서운함이나 오해가 생겼을 때 내가 선호하는 갈등 해결 타이밍은?',
    options: [
      {
        text: '감정이 고조된 직후라도 그 자리에서 바로 솔직하게 대화로 풀어야 한다.',
        trait: 'expressive',
      },
      {
        text: '생각을 가다듬고 내 감정을 정리할 수 있는 시간과 여유를 거친 뒤 말한다.',
        trait: 'reflective',
      },
    ],
  },
  {
    id: 3,
    question:
      '3. ⚠️ 이것만은 절대 타협 불가! 연인 관계에서 가장 감당하기 힘든 행동은?',
    options: [
      {
        text: '사소한 일이라도 거짓말하거나 투명하지 않은 비정직한 태도.',
        trait: 'honesty_dealbreaker',
      },
      {
        text: '문제가 생겼을 때 대화를 피하고 침묵하거나 잠수타는 회피 태도.',
        trait: 'avoidance_dealbreaker',
      },
    ],
  },
  {
    id: 4,
    question: '4. 연인에게 가장 깊은 위로와 사랑을 느끼는 표현 방식은?',
    options: [
      {
        text: '"많이 힘들었지, 내가 항상 네 편이야"라는 따뜻하고 공감 가득한 말.',
        trait: 'words',
      },
      {
        text: '말없이 곁을 든든하게 지켜주거나 실질적인 도움을 주는 행동.',
        trait: 'actions',
      },
    ],
  },
  {
    id: 5,
    question: '5. 주말 데이트나 휴식을 보낼 때 내가 가장 만족하는 방식은?',
    options: [
      {
        text: '둘만의 아늑한 공간에서 편안하게 맛있는 걸 먹으며 조용히 쉬기.',
        trait: 'cozy',
      },
      {
        text: '새로운 핫플, 전시, 야외 액티비티 등을 함께 경험하며 추억 쌓기.',
        trait: 'active',
      },
    ],
  },
  {
    id: 6,
    question: '6. 연인에게 서운한 감정을 전할 때 나의 주된 소통 스타일은?',
    options: [
      {
        text: '"이 부분이 서운했어"라고 핵심만 돌직구로 분명하게 말한다.',
        trait: 'direct_msg',
      },
      {
        text: '상대방의 기분을 살피며 은유적이거나 부드럽게 감정을 푼다.',
        trait: 'subtle',
      },
    ],
  },
  {
    id: 7,
    question: '7. 연인의 이성 친구 관계나 사적 연락에 대한 나의 관용 기준은?',
    options: [
      {
        text: '단둘이 만나거나 개인적인 잦은 연락은 원천적으로 불편하다.',
        trait: 'strict_boundary',
      },
      {
        text: '투명하게 공유하고 예의를 지킨다면 사적인 친목도 이해할 수 있다.',
        trait: 'flexible_boundary',
      },
    ],
  },
  {
    id: 8,
    question: '8. 연애 관계에서 내가 지향하는 가장 핵심적인 비전과 성장은?',
    options: [
      {
        text: '서로의 결점까지 안아주며 정서적 안식처가 되어주는 무조건적인 편안함.',
        trait: 'sanctuary',
      },
      {
        text: '서로의 꿈과 일상을 응원하며 함께 시너지를 내며 발전하는 관계.',
        trait: 'synergy',
      },
    ],
  },
  {
    id: 9,
    question: '9. 연애 중 불쑥 질투심이나 불안감이 밀려올 때 나의 행동 패턴은?',
    options: [
      {
        text: '내 안의 불안 원인을 먼저 파악하고 혼자 감정을 정돈하려 노력한다.',
        trait: 'self_soothe',
      },
      {
        text: '솔직하게 질투심과 불안을 인정하고 상대방에게 확신을 요청한다.',
        trait: 'ask_reassurance',
      },
    ],
  },
  {
    id: 10,
    question:
      '10. 이 연애를 계속 유지할지 심각하게 재고하게 만드는 가장 결정적인 순간은?',
    options: [
      {
        text: '상대방이 나의 가치관과 감정을 경시하고 일방적 배려만 요구할 때.',
        trait: 'disrespect',
      },
      {
        text: '갈등 해결을 위한 대화 의지가 없고 관계 개선 노력을 포기할 때.',
        trait: 'no_effort',
      },
    ],
  },
];

export const ALL_TEN_PROFILES: RelationshipProfile[] = [
  {
    typeTitle: '말랑말랑 리트리버 인형',
    typeOneLiner: '대화로 풀고, 함께 해결하는 안정형',
    conflictHeadline: '문제 발생 시 즉시 대화를 청하며 해결을 선택해요',
    conflictSub: '회피하기보다 원인을 함께 정면으로 풀어나가는 편',
    matchPartnerHeadline:
      '스스로 관계를 돌아보고 감정을 다룰 줄 아는 성숙한 상대',
    matchPartnerSub: '내가 혼자 관계를 이끌지 않아도 편안히 소통되는 사람',
    vulnerabilityHeadline:
      '책임감이 강해 상대의 문제나 몫까지 혼자 해결하려 해요',
    vulnerabilitySub: '혼자 짐을 안고 가다가 지칠 수 있어요',
    avoidPartners: [
      {
        tag: '',
        desc: '갈등을 대화로 풀지 않고 미루며 반복적으로 잠수타는 경우',
      },
      { tag: '', desc: '문제 해결을 위한 대화 후에도 개선 의지가 없는 경우' },
      {
        tag: '',
        desc: '신뢰를 깨뜨리는 작은 거짓말이나 속임을 습관적으로 하는 경우',
      },
    ],
    stats: [
      { label: '표현 솔직도', level: 5 },
      { label: '애정 집착도', level: 2 },
      { label: '감정 포용력', level: 5 },
      { label: '갈등 해결력', level: 5 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '폭신폭신 수면베개',
    typeOneLiner: '너의 모든 것을 안아주는 몰입형',
    conflictHeadline: '상대의 서운함에 먼저 공감하고 내 입장을 양보해요',
    conflictSub: '충돌보다 관계의 온기를 먼저 유지하려는 편',
    matchPartnerHeadline:
      '받은 사랑을 당연하게 여기지 않고 다정하게 표현해 주는 상대',
    matchPartnerSub: '내 따뜻한 배려를 고맙게 느끼고 알아봐주는 사람',
    vulnerabilityHeadline:
      '상대에게 너무 맞추다 보니 정작 내 본래 감정을 눌러 담아요',
    vulnerabilitySub: '속으로 상처가 깊어져 뒤늦게 지칠 수 있어요',
    avoidPartners: [
      { tag: '', desc: '내 헌신과 배려를 이용하거나 당연하게 받아들이는 경우' },
      { tag: '', desc: '갈등 시 일방적으로 윽박지르거나 무시하는 태도' },
    ],
    stats: [
      { label: '표현 솔직도', level: 3 },
      { label: '애정 집착도', level: 4 },
      { label: '감정 포용력', level: 5 },
      { label: '갈등 해결력', level: 3 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '착착 스위스 아미 칼',
    typeOneLiner: '감정보다 정답을 찾는 분석형',
    conflictHeadline: '다툼의 사실관계(Fact)를 파악하고 대안을 제시해요',
    conflictSub: '감정 다툼보다 재발 방지 규칙과 해결책 중심',
    matchPartnerHeadline:
      '감정 기복이 적고 논리적이고 깔끔한 대화가 통하는 상대',
    matchPartnerSub: '어른스럽고 깔끔한 소통 방식을 지닌 연인',
    vulnerabilityHeadline:
      '상대의 서운한 감정을 논리나 효율로만 다루려 해 상처를 줘요',
    vulnerabilitySub: '공감 표현이 부족해 차갑게 느껴질 수 있어요',
    avoidPartners: [
      { tag: '', desc: '문제 해결 의지 없이 무작정 감정적으로 떼쓰는 경우' },
      { tag: '', desc: '약속을 반복해서 어기거나 규칙을 무시할 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 4 },
      { label: '애정 집착도', level: 1 },
      { label: '감정 포용력', level: 3 },
      { label: '갈등 해결력', level: 5 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '단단한 압력밥솥',
    typeOneLiner: '다툼을 피하고 은은하게 맞춰가는 평화형',
    conflictHeadline: '웬만한 일은 참아 넘기며 상황이 완화되기를 기다려요',
    conflictSub: '직접적 다툼보다 조용한 수용을 선택하는 편',
    matchPartnerHeadline:
      '먼저 편안하게 내 솔직한 속마음을 꺼낼 수 있도록 잘 끌어주는 상대',
    matchPartnerSub: '부담 주지 않고 다정히 기다려주는 사람',
    vulnerabilityHeadline:
      '속으로 서운함을 쌓아두다 한 번에 마음을 닫아버릴 수 있어요',
    vulnerabilitySub: '표현하지 않은 서운함이 묵혀질 위험이 있음',
    avoidPartners: [
      {
        tag: '',
        desc: '지속적인 강요나 압박으로 내 자유와 평화가 계속 위협받을 때',
      },
      {
        tag: '',
        desc: '내 말을 듣지 않고 본인 방식대로만 관계를 끌고 가려 할 때',
      },
    ],
    stats: [
      { label: '표현 솔직도', level: 2 },
      { label: '애정 집착도', level: 3 },
      { label: '감정 포용력', level: 5 },
      { label: '갈등 해결력', level: 2 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '톡 쏘는 탄산음료 캔',
    typeOneLiner: '답답함 제로, 즉시 풀어야 하는 직진형',
    conflictHeadline:
      '앙금이 남지 않도록 그 자리에서 솔직하고 화끈하게 풀어버려요',
    conflictSub: '답답한 미룸 없이 즉각 직면하는 타입',
    matchPartnerHeadline:
      '돌려 말하지 않고 똑같이 직설적이며 감정을 담아두지 않는 상대',
    matchPartnerSub: '화끈하고 솔직하게 뒤끝 없는 연인',
    vulnerabilityHeadline:
      '직설적인 표현 때문에 다툴 때 상대에게 의도치 않은 상처를 줘요',
    vulnerabilitySub: '감정이 과열되면 어조가 거칠어질 수 있음',
    avoidPartners: [
      { tag: '', desc: '문제 앞에서 대화를 거부하거나 피하고 잠수타는 경우' },
      { tag: '', desc: '앞에서는 괜찮다고 하고 뒤에서 앙금을 품을 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 5 },
      { label: '애정 집착도', level: 3 },
      { label: '감정 포용력', level: 2 },
      { label: '갈등 해결력', level: 4 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '잠금장치 다이어리',
    typeOneLiner: '혼자 정리하고 대안을 내놓는 쿨형',
    conflictHeadline:
      '혼자 생각할 시간을 가진 뒤 정리된 생각과 대안을 전달해요',
    conflictSub: '감정 폭발보다 냉정한 정리를 거치는 편',
    matchPartnerHeadline:
      '감정적으로 들볶지 않고 혼자만의 시간을 존중해 주는 담백한 상대',
    matchPartnerSub: '집착 없이 내 여유를 존중해주는 연인',
    vulnerabilityHeadline:
      '생각을 정리하는 동안 상대가 회피나 거절로 오해할 수 있어요',
    vulnerabilitySub: '소통 공백기에 상대의 불안을 살필 필요가 있음',
    avoidPartners: [
      {
        tag: '',
        desc: '개인적인 공간과 시간을 지속적으로 침해하거나 집착할 때',
      },
      { tag: '', desc: '감정적인 폭언이나 비난을 지속하는 경우' },
    ],
    stats: [
      { label: '표현 솔직도', level: 3 },
      { label: '애정 집착도', level: 1 },
      { label: '감정 포용력', level: 3 },
      { label: '갈등 해결력', level: 4 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '바스락 쿠쿠다스 과자',
    typeOneLiner: '작은 기류도 알아채는 반응형',
    conflictHeadline: '내 감정과 상처를 연인에게 털어놓고 확신을 받아내려 해요',
    conflictSub: '상대의 온도 차이를 민감히 감지하고 확인받는 편',
    matchPartnerHeadline:
      '세심하게 상태를 물어봐 주고 정서적 안정감을 지속해서 제공하는 상대',
    matchPartnerSub: '확신과 다정함을 아낌없이 건네는 사람',
    vulnerabilityHeadline:
      '연인의 작은 표정이나 말투 변화에도 과도하게 민감해져요',
    vulnerabilitySub: '작은 변화도 불안으로 크게 해석할 수 있음',
    avoidPartners: [
      {
        tag: '',
        desc: '내 감정과 서운함에 대해 예민하다고 무시하거나 폄하할 때',
      },
      { tag: '', desc: '성의 없는 반응과 차가운 태도가 반복될 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 3 },
      { label: '애정 집착도', level: 5 },
      { label: '감정 포용력', level: 2 },
      { label: '갈등 해결력', level: 2 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '반짝이는 도자기 선인장',
    typeOneLiner: '나의 영역이 명확한 자립형',
    conflictHeadline: '무리하게 맞추기보다 각자의 라이프스타일을 유지하려 해요',
    conflictSub: '독립적 공간과 자유로운 경계를 중시함',
    matchPartnerHeadline:
      '자존감이 높고 각자의 일상과 라이프스타일이 독립적인 상대',
    matchPartnerSub: '서로의 성장을 쿨하게 응원해주는 사람',
    vulnerabilityHeadline:
      '관계에 대한 의지나 노력이 상대적으로 적어 보일 수 있어요',
    vulnerabilitySub: '상대가 무관심하다고 느낄 위험이 있음',
    avoidPartners: [
      {
        tag: '',
        desc: '내 생활 방식을 인정하지 않고 상대의 틀에 맞추라고 강요할 때',
      },
      { tag: '', desc: '지나친 통제나 과도한 구속을 시도할 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 3 },
      { label: '애정 집착도', level: 1 },
      { label: '감정 포용력', level: 4 },
      { label: '갈등 해결력', level: 3 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '동글동글 몽돌 돌멩이',
    typeOneLiner: '말없이 깊게 이해해 주는 묵묵형',
    conflictHeadline: '충돌을 피하며 상대방의 입장을 먼저 이해하고 받아들여요',
    conflictSub: '겉으로 드러내기보다 속으로 품어주는 스타일',
    matchPartnerHeadline:
      '표현이 적은 내 마음을 깊이 있게 인지해 주고 고마워해 주는 상대',
    matchPartnerSub: '은은한 진심을 알아채주는 따뜻한 사람',
    vulnerabilityHeadline:
      '문제를 해결하기보다 그저 품어주기만 해서 오해가 길어져요',
    vulnerabilitySub: '솔직한 자기표현이 더 필요한 유형',
    avoidPartners: [
      {
        tag: '',
        desc: '내 묵묵한 이해와 포용을 약점 삼아 지속적으로 서운하게 할 때',
      },
      { tag: '', desc: '신뢰를 반복해서 저버릴 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 1 },
      { label: '애정 집착도', level: 2 },
      { label: '감정 포용력', level: 5 },
      { label: '갈등 해결력', level: 1 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
  {
    typeTitle: '쫀득쫀득 딱풀',
    typeOneLiner: '끊임없는 확신을 원하는 애정 갈구형',
    conflictHeadline:
      '대화로 원인을 풀기보다 나를 얼마나 사랑하는지 확신받고 싶어 해요',
    conflictSub: '사랑의 크기와 연결감을 최우선으로 확인하는 편',
    matchPartnerHeadline:
      '끊임없이 사랑을 표현해 주고 정서적 울타리가 되어주는 다정한 상대',
    matchPartnerSub: '항상 편안하고 확실한 애정을 보여주는 사람',
    vulnerabilityHeadline:
      '불안감이 커지면 상대방을 시험하려 하거나 집착하게 돼요',
    vulnerabilitySub: '불안 시 조급해지기 쉬우므로 자기 안정이 필요함',
    avoidPartners: [
      { tag: '', desc: '나를 뒷전으로 미루거나 연락이 지속적으로 무성의할 때' },
      { tag: '', desc: '확신을 주지 않고 불안하게 만드는 행동을 반복할 때' },
    ],
    stats: [
      { label: '표현 솔직도', level: 1 },
      { label: '애정 집착도', level: 5 },
      { label: '감정 포용력', level: 1 },
      { label: '갈등 해결력', level: 1 },
    ],
    analyzedAt: new Date().toLocaleDateString('ko-KR'),
  },
];

export function calculateProfileMatch(
  answers: Record<number, string>,
): RelationshipProfile {
  let userHonesty = 1;
  let userAttachment = 1;
  let userEmpathy = 1;
  let userResolution = 1;

  if (answers[0] === 'attached') userAttachment += 2;
  if (answers[0] === 'independent') userHonesty += 1;

  if (answers[1] === 'expressive') userHonesty += 2;
  if (answers[1] === 'reflective') userResolution += 2;

  if (answers[2] === 'honesty_dealbreaker') userHonesty += 1;
  if (answers[2] === 'avoidance_dealbreaker') userResolution += 1;

  if (answers[3] === 'words') userEmpathy += 2;
  if (answers[3] === 'actions') userResolution += 1;

  if (answers[4] === 'cozy') userEmpathy += 1;
  if (answers[4] === 'active') userHonesty += 1;

  if (answers[5] === 'direct_msg') userHonesty += 2;
  if (answers[5] === 'subtle') userEmpathy += 1;

  if (answers[6] === 'strict_boundary') userAttachment += 2;
  if (answers[6] === 'flexible_boundary') userEmpathy += 1;

  if (answers[7] === 'sanctuary') userEmpathy += 2;
  if (answers[7] === 'synergy') userResolution += 1;

  if (answers[8] === 'ask_reassurance') userAttachment += 2;
  if (answers[8] === 'self_soothe') userResolution += 1;

  if (answers[9] === 'no_effort') userResolution += 1;
  if (answers[9] === 'disrespect') userEmpathy += 1;

  const uH = Math.min(5, Math.max(1, userHonesty));
  const uA = Math.min(5, Math.max(1, userAttachment));
  const uE = Math.min(5, Math.max(1, userEmpathy));
  const uR = Math.min(5, Math.max(1, userResolution));

  let minDistance = Infinity;
  let selectedIndex = 0;

  ALL_TEN_PROFILES.forEach((prof, idx) => {
    const tH = prof.stats.find(s => s.label === '표현 솔직도')?.level || 3;
    const tA = prof.stats.find(s => s.label === '애정 집착도')?.level || 3;
    const tE = prof.stats.find(s => s.label === '감정 포용력')?.level || 3;
    const tR = prof.stats.find(s => s.label === '갈등 해결력')?.level || 3;

    const dist = Math.sqrt(
      Math.pow(uH - tH, 2) +
        Math.pow(uA - tA, 2) +
        Math.pow(uE - tE, 2) +
        Math.pow(uR - tR, 2),
    );

    if (dist < minDistance) {
      minDistance = dist;
      selectedIndex = idx;
    }
  });

  return ALL_TEN_PROFILES[selectedIndex];
}
