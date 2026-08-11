import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../_model/feed.model';
import { submitVoteLib } from '../_lib/submitVote.lib';

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

export function useVoteState(post: Post) {
  const [localVote, setLocalVote] = useState<'O' | 'X' | null>(null);
  const selectedVote = localVote ?? post.myVote ?? null;
  const isVoted = selectedVote !== null;
  const hasVoted = isVoted;

  const [voteOCount, setVoteOCount] = useState<number>(post.voteOCount ?? 0);
  const [voteXCount, setVoteXCount] = useState<number>(post.voteXCount ?? 0);

  const totalVoteCount = voteOCount + voteXCount;
  const totalVotes = totalVoteCount;
  const percentO =
    totalVoteCount > 0 ? Math.round((voteOCount / totalVoteCount) * 100) : 50;
  const percentX = 100 - percentO;

  const handleVote = (choice: 'O' | 'X') => {
    if (isVoted) return;

    setLocalVote(choice);
    if (choice === 'O') setVoteOCount(prev => prev + 1);
    else setVoteXCount(prev => prev + 1);

    submitVoteLib(post.id, choice);
  };

  return {
    selectedVote,
    voteOCount,
    voteXCount,
    hasVoted,
    isVoted,
    totalVoteCount,
    totalVotes,
    percentO,
    percentX,
    handleVote,
  };
}
