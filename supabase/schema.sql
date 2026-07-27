-- ========================================================
-- 오답연애 (Odap Love) Fully Normalized Supabase PostgreSQL Schema (11 Tables + 2 Views)
-- ========================================================

-- 1. users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  gender VARCHAR(10),
  birth_year INT,
  notification_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
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
CREATE OR REPLACE VIEW public.post_details_view AS
SELECT 
  p.id,
  p.user_id,
  p.title,
  p.content,
  p.review_content,
  p.created_at,
  COALESCE(v_o.count, 0) AS vote_o_count,
  COALESCE(v_x.count, 0) AS vote_x_count,
  COALESCE(rr.count, 0) AS curious_count,
  (p.review_content IS NOT NULL AND p.review_content <> '') AS has_review
FROM public.posts p
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.votes WHERE choice = 'O' GROUP BY post_id
) v_o ON p.id = v_o.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.votes WHERE choice = 'X' GROUP BY post_id
) v_x ON p.id = v_x.post_id
LEFT JOIN (
  SELECT post_id, COUNT(*)::INT AS count FROM public.review_requests GROUP BY post_id
) rr ON p.id = rr.post_id;

-- ========================================================
-- SQL View 2: comment_details_view
-- ========================================================
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
-- RLS DISABLE COMMANDS (Run this to bypass RLS errors completely)
-- ========================================================
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
-- Seed Mock Test User for Expo Go Testing
-- ========================================================
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'expo-test@datingnote.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, provider, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'expo-test@datingnote.com', 'google', NOW())
ON CONFLICT (id) DO NOTHING;
