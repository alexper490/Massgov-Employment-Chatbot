import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '~/stores/chatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { QuestionOptions } from './QuestionOptions';
import { ActionPlanDisplay } from '~/components/ActionPlan/ActionPlanDisplay';
import { getNextQuestion, getNextStep, generateBotResponse } from '~/utils/chatLogic';
import { generateActionPlan, customizeActionPlanContent } from '~/utils/actionPlanGenerator';
import { Button } from '~/components/UI/Button';
import { RefreshCw } from 'lucide-react';
import questionsData from '~/data/questions.json';

export const ChatContainer: React.FC = () => {
  const {
    messages,
    userProfile,
    currentStep,
    isTyping,
    conversationComplete,
    actionPlan,
    addMessage,
    updateUserProfile,
    setCurrentStep,
    setTyping,
    setActionPlan,
    resetChat
  } = useChatStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showOptions]);

  // Initialize conversation with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = (questionsData.questions as any).initial.text;
      addMessage({
        content: welcomeMessage,
        sender: 'bot'
      });
    }
  }, [messages.length, addMessage]);

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      callback();
    }, delay);
  };

  const handleSendMessage = async (message: string) => {
    // Hide options when user sends a message
    setShowOptions(false);
    
    // Add user message
    addMessage({
      content: message,
      sender: 'user'
    });

    // Process the user's response based on current step
    await processUserResponse(message);
  };

  const handleOptionSelect = async (value: string, label: string) => {
    setShowOptions(false);
    
    // Add user message with the selected option
    addMessage({
      content: label,
      sender: 'user'
    });

    // Process the response using the option value
    await processUserResponse(value);
  };

  const processUserResponse = async (userResponse: string) => {
    let updatedProfile = { ...userProfile };
    
    // Update user profile based on current step and response
    switch (currentStep) {
      case 'initial':
        // Free text response to initial question, move to employment status
        break;
        
      case 'employment_status':
        updatedProfile.employmentStatus = userResponse as any;
        break;
        
      case 'timeline':
        updatedProfile.timeline = userResponse as any;
        break;
        
      case 'separation_reason':
        updatedProfile.separationReason = userResponse as any;
        break;
        
      case 'follow_up':
        // Store additional details
        const key = getAdditionalInfoKey(userProfile.separationReason);
        updatedProfile.additionalInfo[key] = userResponse;
        break;
    }

    updateUserProfile(updatedProfile);

    // Generate empathetic bot response
    const botResponse = generateBotResponse(userResponse, updatedProfile, currentStep);
    
    // Get next question and step
    const nextQuestion = getNextQuestion(currentStep, userResponse, updatedProfile);
    const nextStep = getNextStep(currentStep, userResponse, updatedProfile);
    
    setCurrentStep(nextStep);
    setCurrentQuestion(nextQuestion);

    // Simulate typing and respond
    simulateTyping(() => {
      if (botResponse) {
        addMessage({
          content: botResponse,
          sender: 'bot'
        });
      }

      // If there's a next question, ask it after a brief pause
      if (nextQuestion) {
        setTimeout(() => {
          simulateTyping(() => {
            addMessage({
              content: nextQuestion.text,
              sender: 'bot',
              type: 'question'
            });
            
            // Show options after the question is displayed
            if (nextQuestion.options && nextQuestion.inputType === 'radio') {
              setTimeout(() => {
                setShowOptions(true);
              }, 500);
            }
          }, 800);
        }, 500);
      } else {
        // End of conversation, generate action plan
        setTimeout(() => {
          generateAndShowActionPlan(updatedProfile);
        }, 1000);
      }
    });
  };

  const getAdditionalInfoKey = (separationReason?: string): string => {
    switch (separationReason) {
      case 'fired': return 'terminationReason';
      case 'quit': return 'quitReason';
      case 'layoff': return 'layoffType';
      case 'health': return 'healthCondition';
      default: return 'additionalDetails';
    }
  };

  const generateAndShowActionPlan = (profile: any) => {
    simulateTyping(() => {
      addMessage({
        content: "Thank you for providing all that information. Based on what you've told me, I'm creating a personalized action plan with resources and next steps. This will help you navigate the unemployment system and access the benefits you may be entitled to.",
        sender: 'bot'
      });

      setTimeout(() => {
        const plan = generateActionPlan(profile);
        if (plan) {
          const customizedPlan = customizeActionPlanContent(plan, profile);
          setActionPlan(customizedPlan);
          
          addMessage({
            content: "Here's your personalized action plan:",
            sender: 'bot',
            type: 'action_plan'
          });
        }
      }, 1500);
    }, 2000);
  };

  const handleRestart = () => {
    resetChat();
    setCurrentQuestion(null);
    setShowOptions(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-blue-100 font-bold text-sm">MA</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">Massachusetts Unemployment Assistant</h1>
            <p className="text-blue-100 text-sm hidden sm:block">Get help navigating unemployment resources</p>
          </div>
        </div>
        {conversationComplete && (
          <Button
            onClick={handleRestart}
            variant="secondary"
            size="sm"
            className="bg-blue-600 border-blue-400 text-blue-100 hover:bg-blue-500 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Start Over</span>
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 chat-scroll">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {/* Show question options */}
        {showOptions && currentQuestion && (
          <QuestionOptions
            question={currentQuestion}
            onSelectOption={handleOptionSelect}
            disabled={isTyping}
          />
        )}
        
        {actionPlan && <ActionPlanDisplay actionPlan={actionPlan} />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!conversationComplete && (
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={
            showOptions 
              ? "Choose an option above or describe your situation in your own words..." 
              : "Tell me about your situation..."
          }
        />
      )}
    </div>
  );
};
