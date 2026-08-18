import { supabase } from '@/api/supabase';
import { CommentItem, ReplyItem } from '../_model/comment.model';

export interface FetchCommentsParams {
  postId: string;
  postAuthorId?: string;
}

export async function getCommentsLib({
  postId,
  postAuthorId,
}: FetchCommentsParams): Promise<CommentItem[]> {
  if (!postId) return [];

  const { data: dbComments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error.message);
    return [];
  }

  if (!dbComments || dbComments.length === 0) return [];

  const commentIds = dbComments.map(c => c.id);
  const { data: dbLikes } = await supabase
    .from('comment_likes')
    .select('comment_id, user_id')
    .in('comment_id', commentIds);

  const { data: authData } = await supabase.auth.getUser();
  const currentUserId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

  const likeCountMap: Record<string, number> = {};
  const userLikedSet = new Set<string>();

  if (dbLikes) {
    dbLikes.forEach(l => {
      likeCountMap[l.comment_id] = (likeCountMap[l.comment_id] || 0) + 1;
      if (currentUserId && l.user_id === currentUserId) {
        userLikedSet.add(l.comment_id);
      }
    });
  }

  const rootComments: CommentItem[] = [];
  const replyMap: Record<string, ReplyItem[]> = {};

  const userMap = new Map<string, number>();
  let nextUserNum = 1;

  const getUserLabel = (userId?: string) => {
    if (userId && postAuthorId && userId === postAuthorId) {
      return '글쓴이';
    }
    const key = userId || 'unknown';
    if (!userMap.has(key)) {
      userMap.set(key, nextUserNum++);
    }
    return `익명${userMap.get(key)}`;
  };

  dbComments.forEach(c => {
    const isReply = Boolean(c.parent_id);
    const userLabel = getUserLabel(c.user_id);
    const likes = likeCountMap[c.id] || 0;
    const isLiked = userLikedSet.has(c.id);
    const isMyComment = Boolean(currentUserId && c.user_id === currentUserId);
    const votedChoice = (c.voted_choice as 'O' | 'X') || undefined;

    if (isReply && c.parent_id) {
      if (!replyMap[c.parent_id]) replyMap[c.parent_id] = [];
      replyMap[c.parent_id].push({
        id: c.id,
        user: userLabel,
        text: c.content,
        likes,
        isLiked,
        isMyComment,
        votedChoice,
      });
    } else {
      rootComments.push({
        id: c.id,
        user: userLabel,
        text: c.content,
        likes,
        isLiked,
        isMyComment,
        votedChoice,
        replies: [],
      });
    }
  });

  return rootComments.map(rc => ({
    ...rc,
    replies: replyMap[rc.id] || [],
  }));
}
