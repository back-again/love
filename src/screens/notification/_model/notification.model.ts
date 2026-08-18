export interface NotificationItem {
  id: string;
  type: 'comment' | 'vote';
  postId?: string;
  postTitle: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
