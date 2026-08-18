const { createClient } = require('@supabase/supabase-js');

// Supabase Connection Configuration (Loads from environment if run locally)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://heddincpvgpehisfdaoa.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_wB5zVAL_lQ8quWG3UiQxjg_hi1qxfK7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const MY_USER_ID = 'f91a2e4a-f2b6-4c09-a7d4-afae43684c45';

const CATEGORY_MAP = {
  '연애/썸': 'c087b497-6a3d-4bc1-a1dd-ee0f0dba9d64',
  '이별/재회': '324ade76-827f-4c49-b179-4b3438652d60',
  '19/관계': '8f47d20f-7bc2-4b1e-bfec-0645ca3d5abd',
  '일상/고민': '48b3eea3-98bb-4da7-8bcc-dfd76185bc84'
};

const STORIES = [
  {
    orderKey: 1,
    timeOffsetMinutes: 1,
    category: '연애/썸',
    title: '소개팅에서 첫 만남에 더치페이하자고 하는 남자, 애프터 신청 받아야 할까요?',
    content: "어제 주선자 통해 소개팅을 하고 왔어요. 밥 먹고 계산할 때 남자가 자연스럽게 카드를 꺼내서 계산하길래 '잘 먹었습니다~ 커피는 제가 살게요!' 하고 기분 좋게 2차 카페로 갔거든요. 그런데 커피 주문하려고 보니까 남자가 '아, 아까 밥값 46000원 나왔는데 23000원 보내주시면 돼요!' 하면서 계좌번호를 카톡으로 보내주더라고요. 기분이 팍 상했어요. 돈이 아까워서가 아니라 첫 만남부터 정확히 반반 나누자고 계좌 찍어주는 모습이 좀 정떨어진달까... 그래놓고 집 가니까 '오늘 즐거웠다'면서 주말에 또 보재요. 이거 애프터 받아야 할까요?",
    vote_o: '계산은 확실한 게 좋지, 애프터 받는다',
    vote_x: '첫 만남부터 쪼잔해 보여서 패스한다',
    biasX: 0.75,
    commentsO: [
      '나중에 정산하는 건 쪼끔 아쉽지만 그래도 돈 계산 확실한 게 오히려 깔끔하고 낫지 않나? 요즘은 더치페이가 대세임.',
      '첫 만남에 눈치 안 보고 정확하게 반반 하는 게 난 더 편하더라. 한 번 더 만나보고 결정해도 늦지 않음.',
      '만나서 밥 사고 커피 사고 복잡하게 밀당하는 것보다 그냥 칼같이 더치하는 게 상호간에 부담 없고 좋음.',
      '밥 사고 커피 사는 기회비용 따지는 것보단 깔끔하게 엔빵하는 게 현대식 연애지 ㅇㅇ'
    ],
    commentsX: [
      '진짜 개쪼잔하다 ㅋㅋㅋ 커피 산다고 했는데도 굳이 밥값 이만삼천원 계좌 찍어보내는 심보는 대체 뭐임?',
      '첫 만남부터 저렇게 푼돈에 벌벌 떨고 계산기 두드리는 남자랑 연애하면 매사에 서운할 일만 생김. 거르셈.',
      '돈이 아까운 게 아니라 배려랑 센스가 1도 없는 거임. 주말 애프터 주선자 얼굴 봐서라도 핑계 대고 취소하셈.',
      '와 진짜 정떨어진다... 밥 사고 커피 산다는데 굳이 엔빵 계좌 쏘는 거 가성비 연애하려는 심보 백퍼임. 거르길.',
      '첫 만남에 계좌번호 띡 보내는 건 사회성 결여임 ㅋㅋㅋ 센스 재기했네 걍 패스하셈.'
    ]
  },
  {
    orderKey: 2,
    timeOffsetMinutes: 5,
    category: '연애/썸',
    title: '장거리 연애 중인데, 연락 횟수 때문에 매일 싸워요. 누가 문제인가요?',
    content: "저희는 서울-부산 장거리 커플입니다. 만난 지는 6개월 정도 됐고요. 남친은 직장인이고 저는 취준생인데, 연락 문제로 주말마다 싸우고 있어요. 저는 장거리일수록 카톡이나 전화를 더 자주 해서 끈을 유지해야 한다고 생각하는데, 남친은 일할 때 바쁘고 퇴근하면 피곤하니까 연락을 듬성듬성 해요. 3~4시간 연락 두절은 기본이고, 퇴근하고 게임할 때는 톡 답장도 안 해요. 남친은 '연락 횟수가 애정의 크기가 아니다, 나를 믿어라'라고 하는데 저는 외롭고 방치당하는 기분이 듭니다. 이거 누가 맞춰야 하는 문제인가요?",
    vote_o: '장거리면 연락이 생명, 남친이 맞춰야 함',
    vote_x: '일하고 피곤한 남친 입장도 배려해야 함',
    biasX: 0.35,
    commentsO: [
      '장거리인데 연락까지 듬성듬성 하면 그게 그냥 남남이지 연인임? 장거리는 연락 끊기면 그냥 끝임.',
      '장거리 연애는 연락이 유일한 끈인데 3~4시간 연락두절을 당연하게 생각하는 남친 마인드가 노답임.',
      '외롭고 방치당하는 기분 들게 만드는 연애를 왜 이어감? 시간 낭비하지 말고 당장 남친한테 통보하셈.',
      '진짜 좋아하는 여자면 아무리 바빠도 연락하게 돼 있음. 핑계 대는 남친 냅두고 걍 정리하길 바람.'
    ],
    commentsX: [
      '일할 때 바쁘고 퇴근해서 쉬고 싶은 마음도 이해해줘야지. 연락 횟수 = 애정 크기는 절대 아님.',
      '취준생이라 남친 연락만 기다리니까 더 서운한 걸 수도 있음. 본인 취미생활이나 공부에 집중해보셈.',
      '매 순간 카톡 답장 확인하면서 피말리는 것보단 신뢰하고 서로의 시간을 존중해주는 게 장거리 비결임.',
      '직장인이 퇴근하고 겜하면서 쉴 수도 있는 거지, 일일이 톡 답장 다 요구하면 남친도 지쳐서 떨어져나감.',
      '연락 안 된다고 의심하기 시작하면 끝도 없음. 장거리면 서로 사생활은 쿨하게 냅두는 게 맞음.'
    ]
  },
  {
    orderKey: 3,
    timeOffsetMinutes: 10,
    category: '이별/재회',
    title: '헤어진 지 3달 됐는데 전남친이 제 인스타 스토리를 매일 염탐해요. 무슨 심리인가요?',
    content: "전남친이랑 헤어진 지 딱 3달 됐어요. 제가 차였고 헤어질 땐 카톡으로 엄청 단호하게 끝났거든요. 서로 팔로우도 끊고 멀티프로필도 안 하는데, 2주 전부터 제가 인스타 스토리 올릴 때마다 30분도 안 돼서 전남친 부계정(본인 강아지 이름으로 만든 비공개 계정인데 프사랑 강아지 이름 때문에 전남친 부계정인 거 백퍼 확실함)이 와서 염탐을 하고 가요. 스토리 올릴 때마다 매일매일 보는 건데... 이거 그냥 단순한 호기심인가요? 아니면 미련이 남아있는 걸까요? 연락을 해볼까요, 아니면 그냥 염탐 즐기게 냅둘까요?",
    vote_o: '미련이 있어서 보는 거다, 연락해본다',
    vote_x: '단순 호기심일 뿐, 의미 부여 말고 차단한다',
    biasX: 0.60,
    commentsO: [
      '헤어지고 3달이면 후폭풍 슬슬 올 때임. 부계까지 파서 매일 보는 거면 미련 500%임.',
      '비공개 부계정 이름이랑 프사까지 특정되는 수준이면 그냥 나 보라고 티 내는 거임. 찔러보기 톡 한번 해보셈.',
      '단순 호기심이면 한두 번 보고 말지, 스토리 올릴 때마다 30분 만에 확인하는 건 하루 종일 내 생각 한다는 증거임.',
      '마음 없으면 팔로우 끊은 전남친 스토리 볼 일 평생 없음. 미련 남아서 훔쳐보는 거 맞으니까 직진 ㄱㄱ'
    ],
    commentsX: [
      '염탐하는 거 개찌질하네 ㅋㅋㅋ 괜히 미련인가 헷갈려 하면서 감정 소모하지 말고 걍 차단 박는 게 정신건강에 좋음.',
      '그냥 인스타 알고리즘에 뜨니까 뇌 비우고 누르는 걸 수도 있음. 의미 부여 해서 연락했다가 이불킥 함.',
      '염탐은 하면서 지가 먼저 연락할 용기는 없는 찌질이임. 신경 끄고 염탐하든 말든 차단해버리셈.',
      '의미 부여 절대 하지 마셈. 미련 있으면 부계로 숨어서 염탐 안 하고 당당하게 선톡 보냈음.'
    ]
  },
  {
    orderKey: 4,
    timeOffsetMinutes: 15,
    category: '19/관계',
    title: '남친 폰에서 조건만남 어플 결제 내역을 발견했어요. 실수였다는데 봐줘야 하나요?',
    content: "남친이랑 결혼 전제로 1년 반째 동거 중입니다. 어제 남친 카드값 명세서 정리하는 걸 도와주다가 정체모를 해외 결제 내역이 매달 찍혀있는 걸 봤어요. 이상해서 남친 잘 때 폰을 확인해봤는데, 흔히 말하는 미팅/조건만남 어플 결제 내역이었더라고요. 대화 내역은 다 지웠는지 없었지만 가입일이 저랑 사귀는 도중이었어요. 깨워서 물어보니까 친구들이랑 술 마시고 호기심에 결제만 해본 거지, 실제로 사람을 만나거나 딴짓을 한 적은 맹세코 단 한 번도 없대요. 자기가 미쳤었다면서 무릎 꿇고 우는데... 이거 호기심 한 번이라고 믿고 봐줘야 할까요, 아니면 당장 짐 싸서 나와야 할까요?",
    vote_o: '실제로 만나진 않았다니 한 번은 눈감아준다',
    vote_x: '어플 결제까지 한 건 이미 선 넘은 바람, 파혼이다',
    biasX: 0.95,
    commentsO: [
      '실제로 누굴 만나서 딴짓한 건 아니라니까 진짜 반성하고 빌면 이번 한 번만 딱 마지막 기회 주는 건 어떰?',
      '결혼 전제로 동거까지 할 정도로 깊은 관계였는데 호기심 실수 한 번에 바로 파혼하기엔 아깝기도 함...',
      '정말 뼈저리게 후회하고 다시는 안 그러겠다는 약속 각서 받고, 모든 계정 공유하는 조건으로 지켜보셈.'
    ],
    commentsX: [
      '조건만남 어플 결제까지 한 건 실수가 아님 ㅋㅋㅋ 대화 내역 다 지운 시점에서 이미 백퍼 행동 개시한 거임.',
      '동거 중인데 저딴 어플에 돈까지 쓴다? 조상신이 도우신 파혼 기회임. 당장 짐 싸서 탈출하셈.',
      '무릎 꿇고 우는 연기에 속지 마셈. 저런 성벽이나 버릇은 절대로 못 고치고 평생 반복함.',
      '결혼하고 애 낳고 저랬으면 이혼각인데 지금 안 걸 다행으로 생각하고 바로 뒤도 돌아보지 말고 끊어내셈.'
    ]
  },
  {
    orderKey: 5,
    timeOffsetMinutes: 20,
    category: '일상/고민',
    title: "여사친이 남친한테 새벽에 '우울하다'고 전화했는데, 제가 기분 나빠하는 게 예민한 건가요?",
    content: "제 남친에게는 고등학생 때부터 10년 넘게 친하게 지낸 여사친이 한 명 있어요. 저도 몇 번 같이 만나서 밥도 먹고 무난하게 지냈는데, 어제 새벽 2시에 그 여사친한테 남친 폰으로 전화가 왔더라고요. 남친이 자고 있어서 제가 대신 받았는데 여사친이 취해서 울면서 '나 요즘 사는 게 너무 우울하고 힘들다, 너 목소리 듣고 싶었다' 이러는 거예요. 그래서 제가 '남친 자니까 나중에 통화해라' 하고 끊고 남친한테 아침에 말했어요. 근데 남친은 '그냥 친한 친구가 우울해서 연락한 건데 왜 그렇게 예민하게 구냐'면서 오히려 저를 속 좁은 사람 취급하네요. 진짜 제가 이상한가요?",
    vote_o: '10년 지기 친구가 힘들면 연락할 수 있지, 예민함',
    vote_x: '새벽에 남의 남친한테 울며 전화하는 건 선 넘었음, 무조건 화날 일',
    biasX: 0.90,
    commentsO: [
      '10년 넘은 친구가 진짜 인생 힘들고 우울해서 술 먹고 실수한 걸 수도 있지. 너무 예민하게 굴 필요는 없음.',
      '남친이 전화를 받은 것도 아니고 여친이 대신 끊었는데 굳이 여사친이랑 바람 피는 것처럼 몰고 가는 건 좀 과함.',
      '오래된 친구면 힘든 일 있을 때 새벽이라도 하소연할 수 있는 거 아닌가? 남친 믿고 넓은 마음으로 넘어가 주셈.'
    ],
    commentsX: [
      '새벽 2시에 취해서 울면서 \'남의 남친 목소리 듣고 싶었다\'고 지랄하는 여사친 진짜 여우짓의 정석임.',
      '남친 태도가 제일 노답임. 여친이 기분 나빠하는 걸 예민하다고 가스라이팅 하면서 여사친 변호하는 꼬라지 ㅋㅋㅋ',
      '남사친/여사친 사이에 선 넘는 행동 1순위가 새벽 감정 배출임. 남친한테 강력하게 여사친 단절 요구하셈.',
      '내 남친이 남의 여친한테 새벽에 저랬으면 뺨 맞았음. 남친이 공감 능력 결여에 여사친 편드는 거면 걍 거르셈.'
    ]
  },
  {
    orderKey: 6,
    timeOffsetMinutes: 25,
    category: '연애/썸',
    title: '남친이 전여친이랑 연락한 걸 들켰는데, 친구 사이로 지내기로 했대요. 이거 이해해줘야 하나요?',
    content: "2년 만난 남친이 있어요. 며칠 전에 남친 카톡을 우연히 봤는데 전여친이랑 톡한 흔적이 있더라구요. 내용 보니까 '요즘 어떻게 지내냐', '나중에 밥이나 한번 먹자' 같은 평범한 안부 톡이긴 한데... 남친한테 따졌더니 전여친이랑은 나쁘게 헤어진 게 아니라서 그냥 친구로 지내기로 합의했대요. 자기는 떳떳하니까 비번도 안 바꾸고 보여주는 거라고 하는데, 저는 솔직히 1도 이해가 안 가고 미칠 것 같아요. 제가 속이 좁은 건가요? 아니면 남친한테 당장 연락 끊으라고 단호하게 말해야 할까요?",
    vote_o: '친구 사이일 뿐, 이해해준다',
    vote_x: '전여친이랑 친구가 어딨어? 당장 정리하라 한다',
    biasX: 0.85,
    commentsO: [
      '안부 톡 가끔 주고받는 거고 떳떳하게 비번 다 까서 보여주는 거면 진짜 친구 사이로 끝난 거라 봐줄 만함.',
      '나쁘게 헤어진 게 아니면 인간 대 인간으로 안부 정도는 묻고 지낼 수 있지. 쿨하게 넘겨보는 것도 방법.',
      '바람 피우려는 목적이었으면 애초에 대화 숨기고 비번 바꿨을 거임. 남친 말 믿고 지켜보셈.'
    ],
    commentsX: [
      '전여친이랑 친구? 지나가던 개가 웃겠네 ㅋㅋㅋ 헤어진 사이끼리 연락 끈 쥐고 있는 거 어장관리임.',
      '여친이 대놓고 싫다는데도 \'떳떳하다\'면서 연락 계속하는 남친 이기주의 끝판왕임. 당장 연락 끊으라고 하셈.',
      '떳떳하면 전여친이랑 단둘이 밥도 먹겠네? ㅋㅋㅋ 연인에 대한 최소한의 예의가 없는 짓거리임 정리 권유.',
      '전여친이랑 친구로 남는 부류치고 후폭풍 왔을 때 다시 안 흔들리는 꼴 못 봄. 당장 끊게 만드셈.'
    ]
  }
];

async function run() {
  console.log('Seeding dummy posts, votes, and comments...');

  // Get existing users
  const { data: users } = await supabase.from('users').select('id');
  const userIds = (users || []).map(u => u.id).filter(id => id !== MY_USER_ID);

  if (userIds.length === 0) {
    console.error('No dummy users found to seed votes.');
    return;
  }

  // Clear previous dummy posts
  const { data: oldPosts } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', MY_USER_ID);

  if (oldPosts && oldPosts.length > 0) {
    const oldPostIds = oldPosts.map(p => p.id);
    await supabase.from('votes').delete().in('post_id', oldPostIds);
    await supabase.from('comments').delete().in('post_id', oldPostIds);
    await supabase.from('posts').delete().in('id', oldPostIds);
  }

  for (const story of STORIES) {
    const categoryId = CATEGORY_MAP[story.category];
    const createdAtTime = new Date(Date.now() - story.timeOffsetMinutes * 60000).toISOString();

    const { data: post, error: postErr } = await supabase
      .from('posts')
      .insert({
        user_id: MY_USER_ID,
        category_id: categoryId,
        title: story.title,
        content: story.content,
        vote_o: story.vote_o,
        vote_x: story.vote_x,
        created_at: createdAtTime
      })
      .select('id')
      .single();

    if (postErr) {
      console.error(`Error seeding post "${story.title}":`, postErr.message);
      continue;
    }

    const postId = post.id;

    // Generate mock votes
    const votesToInsert = userIds.map(uid => {
      const choice = Math.random() > story.biasX ? 'O' : 'X';
      return {
        post_id: postId,
        user_id: uid,
        choice
      };
    });
    await supabase.from('votes').insert(votesToInsert);

    // Insert mock comments mapping correctly to O/X choices
    const shuffUsers = [...userIds].sort(() => 0.5 - Math.random());
    const commentsToInsert = [];
    
    let indexO = 0;
    let indexX = 0;

    for (let k = 0; k < Math.min(8, shuffUsers.length); k++) {
      const commenterId = shuffUsers[k];
      const userVote = votesToInsert.find(v => v.user_id === commenterId);
      const votedChoice = userVote ? userVote.choice : 'X';

      let content = '';
      if (votedChoice === 'O') {
        content = story.commentsO[indexO % story.commentsO.length];
        indexO++;
      } else {
        content = story.commentsX[indexX % story.commentsX.length];
        indexX++;
      }

      commentsToInsert.push({
        post_id: postId,
        user_id: commenterId,
        content: content,
        voted_choice: votedChoice
      });
    }
    await supabase.from('comments').insert(commentsToInsert);
  }

  console.log('Database Seeding successfully completed!');
}

run();
