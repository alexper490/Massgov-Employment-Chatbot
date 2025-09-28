export interface UserProfile {
  employmentStatus: 'unemployed' | 'underemployed' | 'expecting_loss' | 'never_employed';
  separationReason?: 'layoff' | 'fired' | 'quit' | 'health' | 'contract_end' | 'company_closed';
  timeline?: 'recent' | 'weeks' | 'months' | 'long_term';
  additionalInfo: Record<string, any>;
  eligibilityCategory?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'question' | 'action_plan';
}

export interface ResourceLink {
  id: string;
  name: string;
  url: string;
  phone?: string;
  description: string;
  category: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'immediate' | 'short_term' | 'ongoing';
  timeEstimate: string;
  resources: ResourceLink[];
  completed: boolean;
}

export interface ConversationQuestion {
  id: string;
  text: string;
  options?: {
    value: string;
    label: string;
    nextQuestionId?: string;
  }[];
  inputType: 'text' | 'select' | 'radio';
  category: string;
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  eligibilityCategory: string;
  immediateActions: ActionItem[];
  shortTermActions: ActionItem[];
  ongoingActions: ActionItem[];
  hiddenResources: ResourceLink[];
}

export interface ChatState {
  messages: ChatMessage[];
  userProfile: UserProfile;
  currentQuestionId?: string;
  isTyping: boolean;
  conversationComplete: boolean;
  actionPlan?: ActionPlan;
}

export type ConversationStep = 'initial' | 'employment_status' | 'separation_reason' | 'timeline' | 'follow_up' | 'action_plan';

export interface ConversationContext {
  currentStep: ConversationStep;
  responses: Record<string, any>;
  nextQuestion?: ConversationQuestion;
}
