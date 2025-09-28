import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import SuperJSON from 'superjson';
import type { ChatMessage, UserProfile, ActionPlan, ConversationStep } from '~/types';

interface ChatStore {
  messages: ChatMessage[];
  userProfile: UserProfile;
  currentStep: ConversationStep;
  isTyping: boolean;
  conversationComplete: boolean;
  actionPlan?: ActionPlan;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setCurrentStep: (step: ConversationStep) => void;
  setTyping: (typing: boolean) => void;
  setActionPlan: (plan: ActionPlan) => void;
  completeConversation: () => void;
  resetChat: () => void;
  toggleActionItemComplete: (actionId: string) => void;
}

const initialState = {
  messages: [],
  userProfile: {
    employmentStatus: 'unemployed' as const,
    additionalInfo: {},
  },
  currentStep: 'initial' as ConversationStep,
  isTyping: false,
  conversationComplete: false,
  actionPlan: undefined,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      updateUserProfile: (updates) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      setTyping: (typing) => {
        set({ isTyping: typing });
      },

      setActionPlan: (plan) => {
        set({
          actionPlan: plan,
          conversationComplete: true,
          currentStep: 'action_plan',
        });
      },

      completeConversation: () => {
        set({ conversationComplete: true });
      },

      resetChat: () => {
        set(initialState);
      },

      toggleActionItemComplete: (actionId) => {
        const { actionPlan } = get();
        if (!actionPlan) return;

        const updateActions = (actions: any[]) =>
          actions.map((action) =>
            action.id === actionId
              ? { ...action, completed: !action.completed }
              : action
          );

        const updatedPlan = {
          ...actionPlan,
          immediateActions: updateActions(actionPlan.immediateActions),
          shortTermActions: updateActions(actionPlan.shortTermActions),
          ongoingActions: updateActions(actionPlan.ongoingActions),
        };

        set({ actionPlan: updatedPlan });
      },
    }),
    {
      name: 'ma-unemployment-chat',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return SuperJSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, SuperJSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      onRehydrateStorage: () => (state) => {
        if (state?.messages) {
          // Ensure all message timestamps are proper Date objects
          state.messages = state.messages.map((message: ChatMessage) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          }));
        }
      },
    }
  )
);
