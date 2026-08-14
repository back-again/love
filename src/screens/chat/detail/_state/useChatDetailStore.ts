import { create } from 'zustand';
import { Message, PostItemData } from '../_model/chatDetail.model';
import {
  generateInitialGreeting,
  generateCounselingResponse,
} from '../_lib/getDoorimiResponse.lib';
import { useRelationshipProfileStore } from '@/screens/chat/_state/useRelationshipProfileStore';

interface ChatDetailState {
  visible: boolean;
  messages: Message[];
  inputText: string;
  isTyping: boolean;
  userPosts: PostItemData[];
  selectedPostIdsForDiagnosis: string[];
  hasDiagnosedPosts: boolean;

  setUserPosts: (posts: PostItemData[]) => void;
  setInputText: (text: string) => void;
  togglePostSelectionForDiagnosis: (postId: string) => void;
  enterChatRoom: () => void;
  leaveChatRoom: () => void;
  sendMessage: (customText?: string) => void;
  confirmPostSelectionInChat: (
    posts?: Array<{ id: string; title: string }>,
  ) => void;
}

export const useChatDetailStore = create<ChatDetailState>((set, get) => ({
  visible: false,
  messages: [],
  inputText: '',
  isTyping: false,
  userPosts: [],
  selectedPostIdsForDiagnosis: [],
  hasDiagnosedPosts: false,

  setUserPosts: posts => set({ userPosts: posts }),
  setInputText: text => set({ inputText: text }),

  togglePostSelectionForDiagnosis: postId =>
    set(state => ({
      selectedPostIdsForDiagnosis: state.selectedPostIdsForDiagnosis.includes(postId)
        ? state.selectedPostIdsForDiagnosis.filter(id => id !== postId)
        : [...state.selectedPostIdsForDiagnosis, postId],
    })),

  enterChatRoom: () => {
    const profile = useRelationshipProfileStore.getState().profile;
    const greetingText = generateInitialGreeting(profile);

    set({
      visible: true,
      messages: [
        {
          id: `c_${Date.now()}`,
          sender: 'counselor',
          text: greetingText,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
      inputText: '',
      isTyping: false,
      hasDiagnosedPosts: false,
    });
  },

  leaveChatRoom: () => {
    set({
      visible: false,
      messages: [],
      inputText: '',
      isTyping: false,
      hasDiagnosedPosts: false,
    });
  },

  sendMessage: (customText?: string) => {
    const {
      inputText,
      hasDiagnosedPosts,
      userPosts,
      messages,
    } = get();
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    set({
      messages: [...messages, userMsg],
      inputText: customText ? inputText : '',
      isTyping: true,
    });

    if (
      (textToSend.includes('미래') ||
        textToSend.includes('건강도') ||
        textToSend.includes('성향')) &&
      !hasDiagnosedPosts &&
      userPosts.length > 0
    ) {
      setTimeout(() => {
        const promptMsg: Message = {
          id: `c_prompt_${Date.now()}`,
          sender: 'counselor',
          text: `이 질문에 대한 정확한 진단을 위해, 두두님이 작성하신 고민 사연 중 해당 상대방과 관련된 사연들을 선택해 주세요.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isPostSelectorPrompt: true,
        };
        set(state => ({
          messages: [...state.messages, promptMsg],
          isTyping: false,
        }));
      }, 800);
      return;
    }

    setTimeout(() => {
      const profile = useRelationshipProfileStore.getState().profile;
      const responseText = generateCounselingResponse(textToSend, profile);

      const counselorMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'counselor',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      set(state => ({
        messages: [...state.messages, counselorMsg],
        isTyping: false,
      }));
    }, 900);
  },

  confirmPostSelectionInChat: (posts?: Array<{ id: string; title: string }>) => {
    const {
      userPosts,
      selectedPostIdsForDiagnosis,
      messages,
    } = get();
    const availablePosts = posts && posts.length > 0 ? posts : userPosts;
    const chosenPosts = availablePosts.filter(p =>
      selectedPostIdsForDiagnosis.includes(p.id),
    );
    const titlesText = chosenPosts.map(p => `'${p.title}'`).join(', ');

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: `선택 사연: ${titlesText} 사연으로 종합 진단해주세요.`,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    set({
      hasDiagnosedPosts: true,
      messages: [...messages, userMsg],
      isTyping: true,
    });

    setTimeout(() => {
      const profile = useRelationshipProfileStore.getState().profile;
      const diagnosisResultText =
        `선택하신 ${chosenPosts.length}개의 사연을 바탕으로 이 사람과의 관계 건강도를 분석했습니다.\n\n` +
        `[관련 사연 종합 분석]\n` +
        `• 선택 사연: ${titlesText}\n` +
        `• 유저 공감도: 다수 유저들은 신중한 대화와 가치관 일치 여부를 중요하게 보았습니다.\n\n` +
        `[관계 건강도 진단 결과]\n` +
        (profile
          ? `두두님의 연애 추구미 '${profile.typeTitle}' 기준에서 볼 때, 상대방과의 고민 패턴이 반복되지 않으려면 대화의 기준을 명확히 설정해야 합니다. 더 깊이 논의해보고 싶은 부분이 있으신가요?`
          : `상대방과의 고민 패턴을 보면, 감정적 응어리가 반복되지 않도록 대화의 규칙을 세우시는 것이 매우 중요합니다. 더 논의해보고 싶은 부분이 있으신가요?`);

      const counselorMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'counselor',
        text: diagnosisResultText,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      set(state => ({
        messages: [...state.messages, counselorMsg],
        isTyping: false,
      }));
    }, 1000);
  },
}));
