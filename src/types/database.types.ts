export interface User {
  id: string;
  email: string;
  provider: 'apple' | 'google';
  gender?: 'male' | 'female';
  birth_year?: number;
  notification_allowed?: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  review_content?: string | null;
  created_at: string;
}

// SQL View for Post with aggregated counts (DB normalization)
export interface PostDetailView extends Post {
  vote_o_count: number;
  vote_x_count: number;
  like_count: number;
  rear_count: number;
  fire_count?: number;
  facepalm_count?: number;
  curious_count: number;
  has_review: boolean;
}

export interface PostImage {
  id: string;
  post_id: string;
  image_url: string;
  order_index: number;
}

export interface Vote {
  id: string;
  post_id: string;
  user_id: string;
  choice: 'O' | 'X';
  created_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  type: 'FIRE' | 'FACEPALM';
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  voted_choice?: 'O' | 'X' | null;
  created_at: string;
}

// SQL View for Comment with aggregated like count (DB normalization)
export interface CommentDetailView extends Comment {
  like_count: number;
}

export interface CommentLike {
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface ReviewRequest {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'REVIEW_REQUEST' | 'REVIEW_CREATED' | 'COMMENT_LIKE' | 'COMMENT_REPLY';
  post_id: string;
  is_read: boolean;
  created_at: string;
}

export interface UserBlock {
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface UserReport {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  target_type: 'COMMENT' | 'POST' | 'USER';
  target_id: string;
  reason: string;
  created_at: string;
}

export interface InquiryFeedback {
  id: string;
  user_id: string;
  type: 'FEEDBACK' | 'INQUIRY';
  content: string;
  created_at: string;
}
