import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  parseISO,
} from 'date-fns';

export function formatTimeAgo(createdAt?: string | Date | null): string {
  if (!createdAt) return '방금 전';

  const date = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt;
  if (isNaN(date.getTime())) return '방금 전';

  const now = new Date();
  const diffInMinutes = differenceInMinutes(now, date);

  if (diffInMinutes < 1) {
    return '방금 전';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = differenceInHours(now, date);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = differenceInDays(now, date);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  const diffInMonths = differenceInMonths(now, date);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = differenceInYears(now, date);
  return `${diffInYears}년 전`;
}
