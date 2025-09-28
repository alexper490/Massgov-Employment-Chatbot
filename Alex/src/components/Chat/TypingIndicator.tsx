import React from 'react';
import { Card } from '~/components/UI/Card';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="max-w-[80%] flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bg-blue-700 text-white">
          MA
        </div>
        
        {/* Typing bubble */}
        <Card 
          variant="elevated"
          padding="sm"
          className="relative bg-blue-50 border-blue-200"
        >
          {/* Speech bubble tail */}
          <div className="absolute top-3 -left-2 w-0 h-0 border-solid border-4 border-r-blue-200 border-l-transparent border-t-transparent border-b-transparent" />
          
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-blue-700 ml-2">Typing...</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
