import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../_model/feed.model';
import {
  submitVoteApi,
  togglePostReactionApi,
  requestReviewApi,
} from '../_lib/feedService';

let globalHasSeenFirstVoteGuide = false;

AsyncStorage.getItem('has_seen_first_vote_guide').then(val => {
  if (val === 'true') {
    globalHasSeenFirstVoteGuide = true;
  }
}).catch(() => {});

export function getHasSeenFirstVoteGuide(): boolean {
  return globalHasSeenFirstVoteGuide;
}

export function setHasSeenFirstVoteGuideTrue(): void {
  globalHasSeenFirstVoteGuide = true;
  AsyncStorage.setItem('has_seen_first_vote_guide', 'true').catch(() => {});
}

// 1. 투표 State & Action
export function useVoteState(post: Post) {
  const [selectedVote, setSelectedVote] = useState<'O' | 'X' | null>(null);
  const [voteOCount, setVoteOCount] = useState<number>(post.voteOCount ?? 12);
  const [voteXCount, setVoteXCount] = useState<number>(post.voteXCount ?? 8);
  const hasVoted = selectedVote !== null;
  const totalVoteCount = voteOCount + voteXCount;

  const handleVote = (choice: 'O' | 'X') => {
    if (selectedVote === choice) {
      setSelectedVote(null);
      if (choice === 'O') setVoteOCount(prev => Math.max(0, prev - 1));
      else setVoteXCount(prev => Math.max(0, prev - 1));
    } else {
      if (selectedVote === 'O') setVoteOCount(prev => Math.max(0, prev - 1));
      if (selectedVote === 'X') setVoteXCount(prev => Math.max(0, prev - 1));

      setSelectedVote(choice);
      if (choice === 'O') setVoteOCount(prev => prev + 1);
      else setVoteXCount(prev => prev + 1);

      submitVoteApi(post.id, choice);
    }
  };

  return {
    selectedVote,
    voteOCount,
    voteXCount,
    hasVoted,
    totalVoteCount,
    handleVote,
  };
}

// 2. 스토리 확장 State
export function useStoryState() {
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  return {
    isStoryExpanded,
    setIsStoryExpanded,
  };
}

// 3. 좋아요 (Fire) State & Action
export function useLikeState(post: Post) {
  const [hasFired, setHasFired] = useState<boolean>(post.hasFired ?? false);
  const [fireCount, setFireCount] = useState<number>(post.fireCount ?? 0);

  const handleFireReaction = () => {
    const nextFired = !hasFired;
    setHasFired(nextFired);
    setFireCount(prev => (nextFired ? prev + 1 : Math.max(0, prev - 1)));
    togglePostReactionApi(post.id, 'FIRE', nextFired);
  };

  return {
    hasFired,
    fireCount,
    handleFireReaction,
  };
}

// 4. 뒷골 (Facepalm) State & Action
export function useRearState(post: Post) {
  const [hasFacepalmed, setHasFacepalmed] = useState<boolean>(
    post.hasFacepalmed ?? false,
  );
  const [facepalmCount, setFacepalmCount] = useState<number>(
    post.facepalmCount ?? 0,
  );

  const handleFacepalmReaction = () => {
    const nextFacepalmed = !hasFacepalmed;
    setHasFacepalmed(nextFacepalmed);
    setFacepalmCount(prev =>
      nextFacepalmed ? prev + 1 : Math.max(0, prev - 1),
    );
    togglePostReactionApi(post.id, 'FACEPALM', nextFacepalmed);
  };

  return {
    hasFacepalmed,
    facepalmCount,
    handleFacepalmReaction,
  };
}

// 5. 후기 (Review) State & Action
export function useReviewState(post: Post, onOpenViewReview: () => void) {
  const [hasRequestedReview, setHasRequestedReview] = useState<boolean>(
    post.hasRequestedReview ?? false,
  );

  const handleReviewAction = () => {
    if (post.hasReview) {
      onOpenViewReview();
    } else if (!hasRequestedReview) {
      setHasRequestedReview(true);
      requestReviewApi(post.id);
    }
  };

  return {
    hasRequestedReview,
    handleReviewAction,
  };
}

// 6. 이미지 (Image) State & Action
export function useImageState() {
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>(
    {},
  );

  const handleImageError = (index: number) => {
    setImageErrorMap(prev => ({ ...prev, [index]: true }));
  };

  return {
    imageErrorMap,
    handleImageError,
  };
}

// 7. 통합 Feed State 훅
export function useFeedState(post: Post, onOpenViewReview: () => void) {
  const voteState = useVoteState(post);
  const storyState = useStoryState();
  const likeState = useLikeState(post);
  const rearState = useRearState(post);
  const reviewState = useReviewState(post, onOpenViewReview);
  const imageState = useImageState();

  return {
    ...voteState,
    ...storyState,
    ...likeState,
    ...rearState,
    ...reviewState,
    ...imageState,
  };
}
