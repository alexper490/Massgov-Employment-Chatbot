import React from 'react';
import type { ConversationQuestion } from '~/types';
import { Button } from '~/components/UI/Button';
import { Card } from '~/components/UI/Card';

interface QuestionOptionsProps {
  question: ConversationQuestion;
  onSelectOption: (value: string, label: string) => void;
  disabled?: boolean;
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({ 
  question, 
  onSelectOption, 
  disabled = false 
}) => {
  if (!question.options || question.inputType !== 'radio') {
    return null;
  }

  return (
    <Card variant="elevated" className="bg-blue-50 border-blue-200 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">MA</span>
        </div>
        <p className="text-sm text-blue-800 font-medium">Please choose one of the following options:</p>
      </div>
      
      <div className="grid gap-2">
        {question.options.map((option, index) => (
          <Button
            key={option.value}
            onClick={() => onSelectOption(option.value, option.label)}
            disabled={disabled}
            variant="secondary"
            className="justify-start text-left h-auto py-3 px-4 bg-white hover:bg-blue-50 border-blue-200 text-blue-900"
          >
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
              {index + 1}
            </span>
            {option.label}
          </Button>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          💡 You can also type your own response in the text box below if none of these options fit your situation exactly.
        </p>
      </div>
    </Card>
  );
};
