import type { UserProfile, ConversationQuestion, ConversationStep } from '~/types';
import questionsData from '~/data/questions.json';

const getQuestion = (questionId: string): ConversationQuestion | undefined => {
  return (questionsData.questions as Record<string, ConversationQuestion>)[questionId];
};

export const determineEligibilityCategory = (userProfile: UserProfile): string => {
  const { employmentStatus, separationReason, additionalInfo } = userProfile;
  
  if (employmentStatus === 'never_employed') {
    return 'first_time_seeker';
  }
  
  if (employmentStatus === 'underemployed') {
    return 'underemployed_benefits';
  }
  
  if (employmentStatus === 'expecting_loss') {
    return 'preparing_for_unemployment';
  }
  
  if (employmentStatus === 'unemployed') {
    switch (separationReason) {
      case 'layoff':
        return 'layoff_eligible';
      case 'company_closed':
        return 'layoff_eligible';
      case 'fired':
        if (additionalInfo.terminationReason === 'misconduct') {
          return 'misconduct_termination';
        }
        return 'fired_performance';
      case 'quit':
        if (additionalInfo.quitReason === 'unsafe_conditions' || 
            additionalInfo.quitReason === 'harassment' ||
            additionalInfo.quitReason === 'health_reasons' ||
            additionalInfo.quitReason === 'family_emergency') {
          return 'quit_good_cause';
        }
        return 'voluntary_quit_no_benefits';
      case 'health':
        return 'health_disability';
      case 'contract_end':
        return 'contract_end_eligible';
      default:
        return 'general_unemployment';
    }
  }
  
  return 'general_path';
};

export const getNextQuestion = (
  currentStep: ConversationStep,
  userResponse: string,
  userProfile: UserProfile
): ConversationQuestion | null => {
  switch (currentStep) {
    case 'initial':
      return getQuestion('employment_status') || null;
      
    case 'employment_status':
      if (userResponse === 'unemployed') {
        return getQuestion('unemployment_timeline') || null;
      } else if (userResponse === 'underemployed') {
        // For underemployed, we might want to ask different questions
        return null; // End conversation for now, generate plan
      } else if (userResponse === 'expecting_loss') {
        // For expecting loss, different flow
        return null; // End conversation for now, generate plan
      } else if (userResponse === 'never_employed') {
        // For never employed, different flow
        return null; // End conversation for now, generate plan
      }
      break;
      
    case 'timeline':
      return getQuestion('separation_reason') || null;
      
    case 'separation_reason':
      switch (userResponse) {
        case 'layoff':
          return getQuestion('layoff_details') || null;
        case 'fired':
          return getQuestion('termination_details') || null;
        case 'quit':
          return getQuestion('quit_reason') || null;
        case 'health':
          return getQuestion('health_details') || null;
        case 'contract_end':
        case 'company_closed':
          return null; // End conversation, generate action plan
        default:
          return null;
      }
      
    case 'follow_up':
      return null; // End conversation after follow-up questions
      
    default:
      return null;
  }
  
  return null;
};

export const getNextStep = (
  currentStep: ConversationStep,
  userResponse: string,
  userProfile: UserProfile
): ConversationStep => {
  switch (currentStep) {
    case 'initial':
      return 'employment_status';
      
    case 'employment_status':
      if (userProfile.employmentStatus === 'unemployed') {
        return 'timeline';
      }
      return 'follow_up';
      
    case 'timeline':
      return 'separation_reason';
      
    case 'separation_reason':
      return 'follow_up';
      
    case 'follow_up':
      return 'action_plan';
      
    default:
      return 'action_plan';
  }
};

export const generateBotResponse = (
  userResponse: string,
  userProfile: UserProfile,
  step: ConversationStep
): string => {
  switch (step) {
    case 'initial':
      return "Thank you for reaching out. I'm here to help you navigate Massachusetts unemployment resources. Let me ask you a few questions to understand your situation better.";
      
    case 'employment_status':
      if (userProfile.employmentStatus === 'unemployed') {
        return "I'm sorry to hear about your job loss. Losing employment is always challenging, but there are resources available to help you. Let me ask a few more questions to provide you with the most relevant assistance.";
      } else if (userProfile.employmentStatus === 'underemployed') {
        return "I understand that reduced hours or pay can be very stressful. There may be benefits available to help supplement your income during this difficult time.";
      } else if (userProfile.employmentStatus === 'expecting_loss') {
        return "It's smart to prepare ahead of time. I can help you understand what resources will be available and what steps you should take when the time comes.";
      } else if (userProfile.employmentStatus === 'never_employed') {
        return "Everyone has to start somewhere! There are specific programs and resources designed to help first-time job seekers in Massachusetts.";
      }
      return "Thank you for sharing that information. Let me ask a few questions to better understand your situation.";
      
    case 'timeline':
      if (userProfile.timeline === 'recent') {
        return "Since your job loss is very recent, time is important. The sooner you file for benefits, the sooner you can start receiving assistance.";
      } else if (userProfile.timeline === 'long_term') {
        return "Even though some time has passed, there are still resources available to help you. Let me find out more about your situation.";
      }
      return "Thank you for that information. Now I need to understand how your employment ended.";
      
    case 'separation_reason':
      if (userProfile.separationReason === 'layoff') {
        return "Layoffs are unfortunately common, especially in uncertain economic times. The good news is you'll likely qualify for unemployment benefits. Let me gather a bit more information.";
      } else if (userProfile.separationReason === 'fired') {
        return "I understand this must be a difficult situation. Depending on the circumstances, you may still be eligible for benefits. Let me ask about the specifics.";
      } else if (userProfile.separationReason === 'quit') {
        return "The reason you left your job is important for determining your eligibility for benefits. Some reasons for quitting can still qualify you for assistance.";
      } else if (userProfile.separationReason === 'health') {
        return "Health issues can make employment situations very challenging. There are specific resources and programs available for people dealing with health-related job loss.";
      } else if (userProfile.separationReason === 'company_closed') {
        return "Company closures are particularly difficult because they're completely out of your control. You should definitely be eligible for unemployment benefits.";
      } else if (userProfile.separationReason === 'contract_end') {
        return "Contract work can be unpredictable. Depending on the specifics of your situation, you may be eligible for unemployment benefits.";
      }
      return "Thank you for that information. This helps me understand your situation better.";
      
    case 'follow_up':
      return "Thank you for providing those additional details. This information will help me create the most appropriate action plan for your specific situation.";
      
    default:
      return "I'm here to help you navigate this situation. Let me gather some information to provide you with personalized guidance.";
  }
};
