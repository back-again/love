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
    comments: [
      '첫 만남에 칼같이 23000원 찍어 보내는건 정떨어질만 함...',
      '더치페이가 나쁜건 아닌데 방식이 너무 쪼잔해 보임',
      '커피 산다고 했는데도 계좌 찍는건 융통성이 없는거지 ㅋㅋㅋ',
      '애프터는 무조건 거절하세요. 연애하면 매번 이럴 텐데 피곤합니다.',
      '요즘 시대에 더치라고 해도 첫 만남엔 보통 한명이 밥사면 다른사람이 커피 사고 그러지 않나?',
      '너무 계산적인 사람이랑 만나면 연애 내내 숨막힙니다.',
      '가성비 연애의 시초네요. 앞으로 데이트통장 바로 만들자고 할 사람임.',
      '첫 만남에 저러는건 센스가 1도 없거나 본인이 손해보기 싫다는 마인드.',
      '주선자 얼굴 봐서 애프터까진 좋게 거절하는 편이 낫겠네요.',
      '돈이 아까워서가 아니라 배려와 여유가 안 보여서 싫네요.'
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
    comments: [
      '장거리인데 연락까지 뜸하면 진짜 연애하는 기분 안 날듯 ㅠㅠ',
      '장거리 연애는 신뢰와 연락이 전부입니다. 남친이 고쳐야 해요.',
      '일할 때 바쁜건 이해하지만 퇴근하고 게임하면서 연락 씹는건 무성의한거임',
      '외롭고 방치당하는 기분이 든다면 이미 건강한 연애가 아닙니다.',
      '남친분도 지쳐서 듬성듬성 하는 거 아닐까요? 취준생이라 너무 남친만 기다리시는 듯',
      '서로 생활 밸런스가 너무 안 맞네요. 대화로 합의점을 찾아보세요.',
      '연락이 애정의 크기가 아니라니... 장거리에서 연락 말고 애정을 확인할 길이 어딨음?',
      '하루 이틀도 아니고 주말마다 싸우면 서로 감정소모 심할텐데 안타깝네요.',
      '연락 스타일 안 맞으면 진짜 오래 못 갑니다. 한쪽이 일방적으로 맞추긴 힘들어요.',
      '남친한테 진지하게 내 외로운 감정을 설명해 보고 반응을 보세요.'
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
    comments: [
      '부계정까지 파서 들어와 보는 건 호기심 이상입니다. 무조건 미련이에요.',
      '염탐하는 꼴 보기 싫으면 그냥 차단 박으세요. 그게 정신건강에 이롭습니다.',
      '헤어지고 3달이면 슬슬 후폭풍 올 시기네요 ㅋㅋㅋ 흔들어 보시는 것 추천.',
      '차라리 스토리 하이라이트나 일부러 의식할 만한 사진 올려서 유도해봐요.',
      '단순 호기심이 매일 30분 안에 보는걸로 이어지진 않음. 미련 100% 임.',
      '연락은 먼저 하지 마시고 지켜보다가 지가 먼저 톡 오게 만드세요.',
      '부계로 오는 건 진짜 찌질하네... 그냥 염탐하게 냅두면서 킹받게 해요.',
      '저도 전남친이 저러다가 한달 뒤에 새벽에 연락 왔었어요. 백퍼임.',
      '별 생각 없이 구경하다가 손가락 삐끗해서 본걸수도? 는 매일은 아니겠네요.',
      '의미 부여 하지 마세요. 그냥 킬링타임 하다가 뜨니까 누르는 거임.'
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
    comments: [
      '결제 내역까지 나왔는데 실수? ㅋㅋㅋ 당장 도망치세요.',
      '결혼 전이라 하늘이 도운겁니다. 조상신이 도우셨으니 파혼하세요.',
      '실제로 안 만났다는 보장이 어디있음? 대화 지운게 더 소름 돋는데.',
      '술 핑계 대는 남자치고 제대로 된 사람 없습니다. 걸러야 함.',
      '한 번 눈감아주면 평생 의심하면서 살아야 해요. 지옥길입니다.',
      '조건만남 어플을 가입하고 돈까지 내는건 이미 선을 억만광년 넘었음.',
      '무릎 꿇고 비는 연기에 속지 마세요. 버릇 절대 못 고칩니다.',
      '대화 내역 지운 시점에서 이미 실제로 만났거나 꿀리는 짓 한거 확실합니다.',
      '결혼하고 이랬으면 이혼 사유인데 지금 알았으니 다행이네요.',
      '절대 봐주지 마세요. 더한 꼴 보기 전에 탈출이 답입니다.'
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
    comments: [
      '새벽 2시에 남의 남친 목소리가 듣고 싶다? 여사친 진짜 여우짓 쩌네요.',
      '남친 태도가 더 킹받네요. 왜 지가 여사친 변호를 하고 자빠졌음?',
      '친한 친구라도 새벽에 우는 소리 하는 건 선 넘은게 맞습니다.',
      '적반하장으로 예민한 사람 만드네... 남친이랑 여사친 둘 다 거리 두세요.',
      '여사친도 제정신이 아니지만 받아주는 남친도 공감능력 상실한듯.',
      '남친 여사친이 선 넘은거 팩트고 글쓴이님 반응은 완전 정상입니다.',
      '이건 진짜 역지사지 해봐야 함. 글쓴이님이 남사친한테 저랬어봐라 ㅋㅋ',
      '여사친이 아주 영악하네요. 글쓴이님이 대신 받은걸로 이불킥 각임.',
      '남친한테 화내지 말고 팩트만 짚고 앞으로 여사친 단절 요구하세요.',
      '진짜 우울하면 112나 129에 전화해야지 왜 남의 남자친구한테...'
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
    comments: [
      '전여친이랑 친구로 남는 건 다음 연인에 대한 예의가 아니라고 봐요. 단호하게 정리하라고 하세요.',
      '안부 한두 번 묻는 거면 신경 쓰이긴 해도 떳떳하게 비번 다 보여주면 큰 문제는 아닐 수도 있어요.',
      '입장 바꿔서 생각해보라고 하세요. 본인이 전남친이랑 친구로 지낸다면 좋아할까요?',
      '전여친이랑 합의하에 친구 지내는게 무슨 떳떳한 일이라고 당당한지 참...',
      '비밀번호 안 바꿨다고 해서 딴짓 안 했다는 면죄부가 되지는 않습니다.',
      '그냥 쿨한 척 하면서 관계 끈 유지하고 싶은 전형적인 어장관리 마인드.',
      '단호하게 거절 의사 밝혔는데도 계속 연락 유지하면 그냥 거르세요.',
      '헤어진 인연이랑은 깔끔하게 정리하는게 새로 사귄 사람에 대한 상식임.',
      '남친이 참 철이 없고 이기적이네요. 본인 편하자고 여친 피말리는 중.',
      '친구 사이? ㅋㅋㅋ 지나가던 댕댕이가 웃겠네요. 정리하라고 하세요.'
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

    // Insert mock comments
    const shuffUsers = [...userIds].sort(() => 0.5 - Math.random());
    const commentsToInsert = [];
    for (let k = 0; k < Math.min(10, story.comments.length); k++) {
      const commenterId = shuffUsers[k] || userIds[0];
      const userVote = votesToInsert.find(v => v.user_id === commenterId);
      const votedChoice = userVote ? userVote.choice : 'X';

      commentsToInsert.push({
        post_id: postId,
        user_id: commenterId,
        content: story.comments[k],
        voted_choice: votedChoice
      });
    }
    await supabase.from('comments').insert(commentsToInsert);
  }

  console.log('Database Seeding successfully completed!');
}

run();
