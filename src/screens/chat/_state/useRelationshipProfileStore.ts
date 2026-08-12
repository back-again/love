import { create } from 'zustand';

export interface AvoidPartnerItem {
  tag: string; // e.g. "갈등 회피형"
  desc: string; // e.g. "대화를 미루고 잠수하는 사람"
}

export interface ProfileStat {
  label: string;
  level: number; // 1 to 5
}

export interface RelationshipProfile {
  typeTitle: string; // e.g. "솔직·성숙 수호자"
  typeOneLiner: string; // e.g. "대화로 풀고, 함께 해결하는 안정형"
  conflictHeadline: string; // e.g. "대화로 바로 풀어요"
  conflictSub: string; // e.g. "회피하기보다 해결을 선택하는 편"
  matchPartnerHeadline: string; // e.g. "스스로 관계를 돌아보는 사람"
  matchPartnerSub: string; // e.g. "내가 혼자 관계를 이끌지 않아도 되는 상대"
  vulnerabilityHeadline: string; // e.g. "상대의 문제까지 혼자 해결하려 해요"
  vulnerabilitySub: string; // e.g. "책임감이 강한 만큼 상대의 몫까지 떠안을 수 있어요"
  avoidPartners: AvoidPartnerItem[]; // 3 scannable chips
  stats: ProfileStat[];
  analyzedAt: string;
}

interface RelationshipProfileState {
  profile: RelationshipProfile | null;
  setProfile: (profile: RelationshipProfile | null) => void;
  resetProfile: () => void;
}

export const useRelationshipProfileStore = create<RelationshipProfileState>(set => ({
  profile: null,
  setProfile: (profile: RelationshipProfile | null) => set({ profile }),
  resetProfile: () => set({ profile: null }),
}));
