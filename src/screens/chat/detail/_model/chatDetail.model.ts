export interface Message {
  id: string;
  sender: 'user' | 'counselor';
  text: string;
  timestamp: string;
  isPostSelectorPrompt?: boolean;
  isInitialOptionsPrompt?: boolean;
  isTopicSelectorPrompt?: boolean;
}

export interface PostItemData {
  id: string;
  title: string;
  storySummary?: string;
  fullStory?: string;
  voteO?: string;
  voteX?: string;
  percentO?: number;
  percentX?: number;
  totalVotes?: number;
  category?: string;
  topComments?: Array<{ nickname?: string; text: string }>;
}
