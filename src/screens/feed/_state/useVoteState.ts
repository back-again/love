import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../_model/feed.model';
import { submitVoteLib } from '../_lib/submitVote.lib';

const STORAGE_KEY = 'has_seen_first_vote_guide';

let globalHasSeenFirstVoteGuide = false;

AsyncStorage.getItem(STORAGE_KEY)
  .then(val => {
    if (val === 'true') {
      globalHasSeenFirstVoteGuide = true;
    }
  })
  .catch(() => {});

export function getHasSeenFirstVoteGuide(): boolean {
  return globalHasSeenFirstVoteGuide;
}

export function setHasSeenFirstVoteGuideTrue(): void {
  globalHasSeenFirstVoteGuide = true;
  AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
}

export function useVoteState(post: Post) {
  const [localVote, setLocalVote] = useState<'O' | 'X' | null>(null);
  const selectedVote = localVote ?? post.myVote ?? null;
  const isVoted = selectedVote !== null;

  const baseVoteOCount = post.voteOCount ?? 0;
  const baseVoteXCount = post.voteXCount ?? 0;

  const additionalO = localVote === 'O' && post.myVote !== 'O' ? 1 : 0;
  const additionalX = localVote === 'X' && post.myVote !== 'X' ? 1 : 0;

  const voteOCount = baseVoteOCount + additionalO;
  const voteXCount = baseVoteXCount + additionalX;

  const totalVotes = voteOCount + voteXCount;
  const percentO =
    totalVotes > 0 ? Math.round((voteOCount / totalVotes) * 100) : 50;
  const percentX = 100 - percentO;

  const handleVote = (choice: 'O' | 'X') => {
    if (isVoted) return;

    setLocalVote(choice);
    submitVoteLib(post.id, choice);
  };

  return {
    selectedVote,
    isVoted,
    totalVotes,
    percentO,
    percentX,
    handleVote,
  };
}
