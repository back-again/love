import { Post } from '@/screens/feed/_model/feed.model';

export interface PostDetailData {
  post: Post;
  myVote: 'O' | 'X' | null;
}
