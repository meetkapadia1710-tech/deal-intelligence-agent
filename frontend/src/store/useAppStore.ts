import { create } from 'zustand';

interface ChatMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
}

interface AppState {
  tab: string;
  activeDeal: any | null;
  messagesByDeal: Record<string, ChatMessage[]>;
  
  // Actions
  setTab: (tab: string) => void;
  setActiveDeal: (deal: any | null) => void;
  setMessages: (dealId: string, updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tab: 'dashboard',
  activeDeal: null,
  messagesByDeal: {
    global: [{
      role: 'agent',
      content: "Hello Alex! I'm your DealAI Agent. How can I help you analyze your pipeline today?"
    }]
  },

  setTab: (tab) => set({ tab }),
  
  setActiveDeal: (deal) => set({ activeDeal: deal }),
  
  setMessages: (dealId, updater) => set((state) => {
    const prevMsgs = state.messagesByDeal[dealId] || [];
    const updatedMsgs = typeof updater === 'function' ? updater(prevMsgs) : updater;
    return {
      messagesByDeal: {
        ...state.messagesByDeal,
        [dealId]: updatedMsgs,
      }
    };
  }),
}));
