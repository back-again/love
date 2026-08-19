-- ========================================================
-- 오답연애 (Odap Love) Fully Normalized Supabase PostgreSQL Schema (11 Tables + 2 Views)
-- ========================================================

-- 1. categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  gender VARCHAR(10),
  birth_year INT,
  notification_allowed BOOLEAN DEFAULT FALSE,
  push_token TEXT,
  dating_started_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  vote_o VARCHAR(100) DEFAULT '괜찮은데?',
  vote_x VARCHAR(100) DEFAULT '난 싫어',
  review_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. post_images
CREATE TABLE IF NOT EXISTS public.post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INT DEFAULT 0
);

-- 4. votes
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  choice VARCHAR(2) NOT NULL CHECK (choice IN ('O', 'X')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 5. comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  voted_choice VARCHAR(2) CHECK (voted_choice IN ('O', 'X')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. comment_likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- 7. review_requests
CREATE TABLE IF NOT EXISTS public.review_requests (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- 8. notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('REVIEW_REQUEST', 'REVIEW_CREATED', 'COMMENT_LIKE', 'COMMENT_REPLY')),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. user_blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
  blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- 10. user_reports
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('COMMENT', 'POST', 'USER')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. inquiries_feedback
CREATE TABLE IF NOT EXISTS public.inquiries_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('FEEDBACK', 'INQUIRY')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



-- ========================================================
-- SQL View 1: post_details_view
-- ========================================================
DROP VIEW IF EXISTS public.post_details_view CASCADE;
CREATE OR REPLACE VIEW public.post_details_view AS
SELECT
  p.id,
  p.user_id,
  p.category_id,
  cat.name AS category,
  p.title,
  p.content,
  p.vote_o,
  p.vote_x,
  p.review_content,
  p.created_at,
  COALESCE(v_o.count, 0) AS vote_o_count,
  COALESCE(v_x.count, 0) AS vote_x_count,
  COALESCE(rr.count, 0) AS curious_count,
  COALESCE(c_cnt.count, 0) AS comment_count,
  COALESCE(img.image_urls, '') AS image_urls,
  (p.review_content IS NOT NULL AND p.review_content <> '') AS has_review
FROM public.posts p
LEFT JOIN public.categories cat ON p.category_id = cat.id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.votes WHERE choice = 'O' GROUP BY post_id
) v_o ON p.id = v_o.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.votes WHERE choice = 'X' GROUP BY post_id
) v_x ON p.id = v_x.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.review_requests GROUP BY post_id
) rr ON p.id = rr.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.comments GROUP BY post_id
) c_cnt ON p.id = c_cnt.post_id
LEFT JOIN (
  SELECT post_id, STRING_AGG(image_url, ',' ORDER BY order_index) AS image_urls
  FROM public.post_images
  GROUP BY post_id
) img ON p.id = img.post_id;

-- ========================================================
-- SQL View 2: comment_details_view
-- ========================================================
DROP VIEW IF EXISTS public.comment_details_view CASCADE;
CREATE OR REPLACE VIEW public.comment_details_view AS
SELECT
  c.id,
  c.post_id,
  c.user_id,
  c.parent_id,
  c.content,
  c.created_at,
  COALESCE(cl.count, 0) AS like_count
FROM public.comments c
LEFT JOIN (
  SELECT comment_id, COUNT(*)::INT AS count FROM public.comment_likes GROUP BY comment_id
) cl ON c.id = cl.comment_id;

-- ========================================================
-- RLS DISABLE COMMANDS (Run this to bypass RLS errors completely for local testing)
-- ========================================================
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries_feedback DISABLE ROW LEVEL SECURITY;

-- ========================================================
-- RLS ENABLE & SECURITY POLICIES (Only Logged-in / Authenticated Users)
-- ========================================================

-- 1. categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to categories" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to users" ON public.users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to posts" ON public.posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. post_images
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to post_images" ON public.post_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. votes
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to votes" ON public.votes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to comments" ON public.comments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to comment_likes" ON public.comment_likes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. review_requests
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to review_requests" ON public.review_requests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to notifications" ON public.notifications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. user_blocks
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to user_blocks" ON public.user_blocks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. user_reports
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to user_reports" ON public.user_reports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. inquiries_feedback
ALTER TABLE public.inquiries_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access to inquiries_feedback" ON public.inquiries_feedback
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========================================================
-- Seed Mock Test Users for Expo Go Testing (1 ~ 100)
-- ========================================================
INSERT INTO auth.users (id, email)
SELECT
  ('00000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  CASE WHEN i = 1 THEN 'expo-test@datingnote.com' ELSE 'user' || i || '@datingnote.com' END
FROM generate_series(1, 100) AS i
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, provider, gender, birth_year, notification_allowed, dating_started_at, created_at)
SELECT
  ('00000000-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  CASE WHEN i = 1 THEN 'expo-test@datingnote.com' ELSE 'user' || i || '@datingnote.com' END,
  CASE WHEN i % 2 = 0 THEN 'google' ELSE 'apple' END,
  CASE WHEN i % 2 = 0 THEN 'female' ELSE 'male' END,
  1990 + (i % 12),
  (i % 3 != 0),
  '2025-08-13',
  NOW()
FROM generate_series(1, 100) AS i
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- Seed Categories (Actual UUIDs)
-- ========================================================
INSERT INTO public.categories (id, name, order_index)
VALUES
  ('c087b497-6a3d-4bc1-a1dd-ee0f0dba9d64', '연애/썸', 1),
  ('324ade76-827f-4c49-b179-4b3438652d60', '이별/재회', 2),
  ('8f47d20f-7bc2-4b1e-bfec-0645ca3d5abd', '19/관계', 3),
  ('48b3eea3-98bb-4da7-8bcc-dfd76185bc84', '일상/고민', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, order_index = EXCLUDED.order_index;

-- ========================================================
-- Seed Posts (Stories 1 ~ 6 from seed.js)
-- ========================================================
INSERT INTO public.posts (id, user_id, category_id, title, content, vote_o, vote_x, review_content, created_at)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'c087b497-6a3d-4bc1-a1dd-ee0f0dba9d64',
    '소개팅에서 첫 만남에 더치페이하자고 하는 남자, 애프터 신청 받아야 할까요?',
    '어제 주선자 통해 소개팅을 하고 왔어요. 밥 먹고 계산할 때 남자가 자연스럽게 카드를 꺼내서 계산하길래 ''잘 먹었습니다~ 커피는 제가 살게요!'' 하고 기분 좋게 2차 카페로 갔거든요. 그런데 커피 주문하려고 보니까 남자가 ''아, 아까 밥값 46000원 나왔는데 23000원 보내주시면 돼요!'' 하면서 계좌번호를 카톡으로 보내주더라고요. 기분이 팍 상했어요. 돈이 아까워서가 아니라 첫 만남부터 정확히 반반 나누자고 계좌 찍어주는 모습이 좀 정떨어진달까... 그래놓고 집 가니까 ''오늘 즐거웠다''면서 주말에 또 보재요. 이거 애프터 받아야 할까요?',
    '애프터 신청 받는다',
    '쪼잔해 보여 패스한다',
    NULL,
    NOW() - INTERVAL '1 minute'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'c087b497-6a3d-4bc1-a1dd-ee0f0dba9d64',
    '장거리 연애 중인데, 연락 횟수 때문에 매일 싸워요. 누가 문제인가요?',
    '저희는 서울-부산 장거리 커플입니다. 만난 지는 6개월 정도 됐고요. 남친은 직장인이고 저는 취준생인데, 연락 문제로 주말마다 싸우고 있어요. 저는 장거리일수록 카톡이나 전화를 더 자주 해서 끈을 유지해야 한다고 생각하는데, 남친은 일할 때 바쁘고 퇴근하면 피곤하니까 연락을 듬성듬성 해요. 3~4시간 연락 두절은 기본이고, 퇴근하고 게임할 때는 톡 답장도 안 해요. 남친은 ''연락 횟수가 애정의 크기가 아니다, 나를 믿어라''라고 하는데 저는 외롭고 방치당하는 기분이 듭니다. 이거 누가 맞춰야 하는 문제인가요?',
    '연락이 생명, 남친 탓',
    '바쁜 남친 입장 배려',
    NULL,
    NOW() - INTERVAL '5 minutes'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '324ade76-827f-4c49-b179-4b3438652d60',
    '헤어진 지 3달 됐는데 전남친이 제 인스타 스토리를 매일 염탐해요. 무슨 심리인가요?',
    '전남친이랑 헤어진 지 딱 3달 됐어요. 제가 차였고 헤어질 땐 카톡으로 엄청 단호하게 끝났거든요. 서로 팔로우도 끊고 멀티프로필도 안 하는데, 2주 전부터 제가 인스타 스토리 올릴 때마다 30분도 안 돼서 전남친 부계정(본인 강아지 이름으로 만든 비공개 계정인데 프사랑 강아지 이름 때문에 전남친 부계정인 거 백퍼 확실함)이 와서 염탐을 하고 가요. 스토리 올릴 때마다 매일매일 보는 건데... 이거 그냥 단순한 호기심인가요? 아니면 미련이 남아있는 걸까요? 연락을 해볼까요, 아니면 그냥 염탐 즐기게 냅둘까요?',
    '미련 있음, 선톡한다',
    '호기심일 뿐, 차단함',
    '댓글 보고 걍 차단할까 하다가 새벽에 술김에 ''왜 자꾸 염탐하냐''고 카톡 선톡 보냈음.' || E'\n\n' || '전남친 처음에 모르는 척 잡아떼고 부계정 뭔지 모른다 하다가, 결국 미련 남아서 계속 훔쳐본 거 맞다고 인정함 ㅋㅋㅋ' || E'\n\n' || '근데 대화하다 보니까 바뀐 거 하나도 없고 여전히 찌질하게 핑계만 대길래 정뚝떨이라 카톡 인스타 다 차단 박음.' || E'\n\n' || '진짜 탈출은 지능순인 듯. 역시 사람은 고쳐 쓰는 거 아니다 다들 조언 고마워!',
    NOW() - INTERVAL '10 minutes'
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004',
    '8f47d20f-7bc2-4b1e-bfec-0645ca3d5abd',
    '남친 폰에서 조건만남 어플 결제 내역을 발견했어요. 실수였다는데 봐줘야 하나요?',
    '남친이랑 결혼 전제로 1년 반째 동거 중입니다. 어제 남친 카드값 명세서 정리하는 걸 도와주다가 정체모를 해외 결제 내역이 매달 찍혀있는 걸 봤어요. 이상해서 남친 잘 때 폰을 확인해봤는데, 흔히 말하는 미팅/조건만남 어플 결제 내역이었더라고요. 대화 내역은 다 지웠는지 없었지만 가입일이 저랑 사귀는 도중이었어요. 깨워서 물어보니까 친구들이랑 술 마시고 호기심에 결제만 해본 거지, 실제로 사람을 만나거나 딴짓을 한 적은 맹세코 단 한 번도 없대요. 자기가 미쳤었다면서 무릎 꿇고 우는데... 이거 호기심 한 번이라고 믿고 봐줘야 할까요, 아니면 당장 짐 싸서 나와야 할까요?',
    '한 번은 눈감아준다',
    '이미 선 넘은 바람임',
    NULL,
    NOW() - INTERVAL '15 minutes'
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    '48b3eea3-98bb-4da7-8bcc-dfd76185bc84',
    '여사친이 남친한테 새벽에 ''우울하다''고 전화했는데, 제가 기분 나빠하는 게 예민한 건가요?',
    '제 남친에게는 고등학생 때부터 10년 넘게 친하게 지낸 여사친이 한 명 있어요. 저도 몇 번 같이 만나서 밥도 먹고 무난하게 지냈는데, 어제 새벽 2시에 그 여사친한테 남친 폰으로 전화가 왔더라고요. 남친이 자고 있어서 제가 대신 받았는데 여사친이 취해서 울면서 ''나 요즘 사는 게 너무 우울하고 힘들다, 너 목소리 듣고 싶었다'' 이러는 거예요. 그래서 제가 ''남친 자니까 나중에 통화해라'' 하고 끊고 남친한테 아침에 말했어요. 근데 남친은 ''그냥 친한 친구가 우울해서 연락한 건데 왜 그렇게 예민하게 구냐''면서 오히려 저를 속 좁은 사람 취급하네요. 진짜 제가 이상한가요?',
    '친구끼리 연락 가능',
    '새벽 통화는 선 넘음',
    NULL,
    NOW() - INTERVAL '20 minutes'
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000006',
    'c087b497-6a3d-4bc1-a1dd-ee0f0dba9d64',
    '남친이 전여친이랑 연락한 걸 들켰는데, 친구 사이로 지내기로 했대요. 이거 이해해줘야 하나요?',
    '2년 만난 남친이 있어요. 며칠 전에 남친 카톡을 우연히 봤는데 전여친이랑 톡한 흔적이 있더라구요. 내용 보니까 ''요즘 어떻게 지내냐'', ''나중에 밥이나 한번 먹자'' 같은 평범한 안부 톡이긴 한데... 남친한테 따졌더니 전여친이랑은 나쁘게 헤어진 게 아니라서 그냥 친구로 지내기로 합의했대요. 자기는 떳떳하니까 비번도 안 바꾸고 보여주는 거라고 하는데, 저는 솔직히 1도 이해가 안 가고 미칠 것 같아요. 제가 속이 좁은 건가요? 아니면 남친한테 당장 연락 끊으라고 단호하게 말해야 할까요?',
    '친구 사이, 이해함',
    '당장 정리하라고 함',
    NULL,
    NOW() - INTERVAL '25 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- Seed Votes (All Users in public.users Voting on All Posts in public.posts)
-- ========================================================
INSERT INTO public.votes (post_id, user_id, choice, created_at)
SELECT
  p.id AS post_id,
  u.id AS user_id,
  CASE
    -- Post 1: biasX = 0.75 (25% O, 75% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000001' THEN CASE WHEN (abs(hashtext(u.id::text || 'p1')) % 100 < 25) THEN 'O' ELSE 'X' END
    -- Post 2: biasX = 0.35 (65% O, 35% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000002' THEN CASE WHEN (abs(hashtext(u.id::text || 'p2')) % 100 < 65) THEN 'O' ELSE 'X' END
    -- Post 3: biasX = 0.50 (50% O, 50% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000003' THEN CASE WHEN (abs(hashtext(u.id::text || 'p3')) % 100 < 50) THEN 'O' ELSE 'X' END
    -- Post 4: biasX = 0.95 (5% O, 95% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000004' THEN CASE WHEN (abs(hashtext(u.id::text || 'p4')) % 100 < 5) THEN 'O' ELSE 'X' END
    -- Post 5: biasX = 0.90 (10% O, 90% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000005' THEN CASE WHEN (abs(hashtext(u.id::text || 'p5')) % 100 < 10) THEN 'O' ELSE 'X' END
    -- Post 6: biasX = 0.85 (15% O, 85% X)
    WHEN p.id = '20000000-0000-0000-0000-000000000006' THEN CASE WHEN (abs(hashtext(u.id::text || 'p6')) % 100 < 15) THEN 'O' ELSE 'X' END
    -- Other posts (50:50 default)
    ELSE CASE WHEN (abs(hashtext(u.id::text || p.id::text)) % 100 < 50) THEN 'O' ELSE 'X' END
  END AS choice,
  NOW() - (abs(hashtext(u.id::text || p.id::text)) % 3600 || ' seconds')::interval AS created_at
FROM public.posts p
CROSS JOIN public.users u
ON CONFLICT (post_id, user_id) DO UPDATE SET choice = EXCLUDED.choice;

-- ========================================================
-- Seed Comments (Detailed Comments for each Post from seed.js)
-- ========================================================
INSERT INTO public.comments (id, post_id, user_id, content, voted_choice, created_at)
VALUES
  -- Post 1 Comments
  ('30000000-0000-0000-0000-000000000101', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '나중에 정산하는 건 쪼끔 아쉽지만 그래도 돈 계산 확실한 게 오히려 깔끔하고 낫지 않나? 요즘은 더치페이가 대세임.', 'O', NOW() - INTERVAL '50 seconds'),
  ('30000000-0000-0000-0000-000000000102', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', '첫 만남에 눈치 안 보고 정확하게 반반 하는 게 난 더 편하더라. 한 번 더 만나보고 결정해도 늦지 않음.', 'O', NOW() - INTERVAL '45 seconds'),
  ('30000000-0000-0000-0000-000000000103', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', '만나서 밥 사고 커피 사고 복잡하게 밀당하는 것보다 그냥 칼같이 더치하는 게 상호간에 부담 없고 좋음.', 'O', NOW() - INTERVAL '40 seconds'),
  ('30000000-0000-0000-0000-000000000104', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000016', '밥 사고 커피 사는 기회비용 따지는 것보단 깔끔하게 엔빵하는 게 현대식 연애지 ㅇㅇ', 'O', NOW() - INTERVAL '35 seconds'),
  ('30000000-0000-0000-0000-000000000105', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '진짜 개쪼잔하다 ㅋㅋㅋ 커피 산다고 했는데도 굳이 밥값 이만삼천원 계좌 찍어보내는 심보는 대체 뭐임?', 'X', NOW() - INTERVAL '30 seconds'),
  ('30000000-0000-0000-0000-000000000106', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '첫 만남부터 저렇게 푼돈에 벌벌 떨고 계산기 두드리는 남자랑 연애하면 매사에 서운할 일만 생김. 거르셈.', 'X', NOW() - INTERVAL '25 seconds'),
  ('30000000-0000-0000-0000-000000000107', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '돈이 아까운 게 아니라 배려랑 센스가 1도 없는 거임. 주말 애프터 주선자 얼굴 봐서라도 핑계 대고 취소하셈.', 'X', NOW() - INTERVAL '20 seconds'),
  ('30000000-0000-0000-0000-000000000108', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', '와 진짜 정떨어진다... 밥 사고 커피 산다는데 굳이 엔빵 계좌 쏘는 거 가성비 연애하려는 심보 백퍼임. 거르길.', 'X', NOW() - INTERVAL '15 seconds'),

  -- Post 2 Comments
  ('30000000-0000-0000-0000-000000000201', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '장거리인데 연락까지 듬성듬성 하면 그게 그냥 남남이지 연인임? 장거리는 연락 끊기면 그냥 끝임.', 'O', NOW() - INTERVAL '4 minutes'),
  ('30000000-0000-0000-0000-000000000202', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '장거리 연애는 연락이 유일한 끈인데 3~4시간 연락두절을 당연하게 생각하는 남친 마인드가 노답임.', 'O', NOW() - INTERVAL '3 minutes 30 seconds'),
  ('30000000-0000-0000-0000-000000000203', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', '외롭고 방치당하는 기분 들게 만드는 연애를 왜 이어감? 시간 낭비하지 말고 당장 남친한테 통보하셈.', 'O', NOW() - INTERVAL '3 minutes'),
  ('30000000-0000-0000-0000-000000000204', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '일할 때 바쁘고 퇴근해서 쉬고 싶은 마음도 이해해줘야지. 연락 횟수 = 애정 크기는 절대 아님.', 'X', NOW() - INTERVAL '2 minutes 30 seconds'),
  ('30000000-0000-0000-0000-000000000205', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', '취준생이라 남친 연락만 기다리니까 더 서운한 걸 수도 있음. 본인 취미생활이나 공부에 집중해보셈.', 'X', NOW() - INTERVAL '2 minutes'),

  -- Post 3 Comments
  ('30000000-0000-0000-0000-000000000301', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '헤어지고 3달이면 후폭풍 슬슬 올 때임. 부계까지 파서 매일 보는 거면 미련 500%임.', 'O', NOW() - INTERVAL '9 minutes'),
  ('30000000-0000-0000-0000-000000000302', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', '비공개 부계정 이름이랑 프사까지 특정되는 수준이면 그냥 나 보라고 티 내는 거임. 찔러보기 톡 한번 해보셈.', 'O', NOW() - INTERVAL '8 minutes'),
  ('30000000-0000-0000-0000-000000000303', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '염탐하는 거 개찌질하네 ㅋㅋㅋ 괜히 미련인가 헷갈려 하면서 감정 소모하지 말고 걍 차단 박는 게 정신건강에 좋음.', 'X', NOW() - INTERVAL '7 minutes'),
  ('30000000-0000-0000-0000-000000000304', '20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', '그냥 인스타 알고리즘에 뜨니까 뇌 비우고 누르는 걸 수도 있음. 의미 부여 해서 연락했다가 이불킥 함.', 'X', NOW() - INTERVAL '6 minutes'),

  -- Post 4 Comments
  ('30000000-0000-0000-0000-000000000401', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000020', '결혼 전제로 동거까지 할 정도로 깊은 관계였는데 호기심 실수 한 번에 바로 파혼하기엔 아깝기도 함...', 'O', NOW() - INTERVAL '14 minutes'),
  ('30000000-0000-0000-0000-000000000402', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '조건만남 어플 결제까지 한 건 실수가 아님 ㅋㅋㅋ 대화 내역 다 지운 시점에서 이미 백퍼 행동 개시한 거임.', 'X', NOW() - INTERVAL '13 minutes'),
  ('30000000-0000-0000-0000-000000000403', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '동거 중인데 저딴 어플에 돈까지 쓴다? 조상신이 도우신 파혼 기회임. 당장 짐 싸서 탈출하셈.', 'X', NOW() - INTERVAL '12 minutes'),
  ('30000000-0000-0000-0000-000000000404', '20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '무릎 꿇고 우는 연기에 속지 마셈. 저런 성벽이나 버릇은 절대로 못 고치고 평생 반복함.', 'X', NOW() - INTERVAL '11 minutes'),

  -- Post 5 Comments
  ('30000000-0000-0000-0000-000000000501', '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000010', '10년 넘은 친구가 진짜 인생 힘들고 우울해서 술 먹고 실수한 걸 수도 있지. 너무 예민하게 굴 필요는 없음.', 'O', NOW() - INTERVAL '19 minutes'),
  ('30000000-0000-0000-0000-000000000502', '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '새벽 2시에 취해서 울면서 ''남의 남친 목소리 듣고 싶었다''고 지랄하는 여사친 진짜 여우짓의 정석임.', 'X', NOW() - INTERVAL '18 minutes'),
  ('30000000-0000-0000-0000-000000000503', '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '남친 태도가 제일 노답임. 여친이 기분 나빠하는 걸 예민하다고 가스라이팅 하면서 여사친 변호하는 꼬라지 ㅋㅋㅋ', 'X', NOW() - INTERVAL '17 minutes'),
  ('30000000-0000-0000-0000-000000000504', '20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '남사친/여사친 사이에 선 넘는 행동 1순위가 새벽 감정 배출임. 남친한테 강력하게 여사친 단절 요구하셈.', 'X', NOW() - INTERVAL '16 minutes'),

  -- Post 6 Comments
  ('30000000-0000-0000-0000-000000000601', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', '안부 톡 가끔 주고받는 거고 떳떳하게 비번 다 까서 보여주는 거면 진짜 친구 사이로 끝난 거라 봐줄 만함.', 'O', NOW() - INTERVAL '24 minutes'),
  ('30000000-0000-0000-0000-000000000602', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '전여친이랑 친구? 지나가던 개가 웃겠네 ㅋㅋㅋ 헤어진 사이끼리 연락 끈 쥐고 있는 거 어장관리임.', 'X', NOW() - INTERVAL '23 minutes'),
  ('30000000-0000-0000-0000-000000000603', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '여친이 대놓고 싫다는데도 ''떳떳하다''면서 연락 계속하는 남친 이기주의 끝판왕임. 당장 연락 끊으라고 하셈.', 'X', NOW() - INTERVAL '22 minutes'),
  ('30000000-0000-0000-0000-000000000604', '20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', '떳떳하면 전여친이랑 단둘이 밥도 먹겠네? ㅋㅋㅋ 연인에 대한 최소한의 예의가 없는 짓거리임 정리 권유.', 'X', NOW() - INTERVAL '21 minutes')
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- Seed Comment Likes
-- ========================================================
INSERT INTO public.comment_likes (comment_id, user_id, created_at)
SELECT
  c.id AS comment_id,
  ('00000000-0000-0000-0000-' || LPAD(u.i::text, 12, '0'))::uuid AS user_id,
  NOW() - (u.i || ' seconds')::interval AS created_at
FROM public.comments c
CROSS JOIN generate_series(1, 15) AS u(i)
WHERE (c.id::text || u.i::text)::text IN (
  SELECT (c2.id::text || u2.i::text)::text
  FROM public.comments c2
  CROSS JOIN generate_series(1, 15) AS u2(i)
  WHERE (u2.i % 2 = 0 OR u2.i % 3 = 0)
)
ON CONFLICT (comment_id, user_id) DO NOTHING;


