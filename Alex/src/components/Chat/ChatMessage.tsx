import React from 'react';
import type { ChatMessage as ChatMessageType } from '~/types';
import { cn } from '~/utils/cn';
import { Card } from '~/components/UI/Card';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={cn(
      'flex w-full mb-4',
      isBot ? 'justify-start' : 'justify-end'
    )}>
      <div className={cn(
        'max-w-[80%] flex items-start gap-3',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}>
        {/* Avatar */}
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
          isBot
            ? 'bg-blue-700 text-white'
            : 'bg-gray-600 text-white'
        )}>
          {isBot ? 'MA' : 'You'}
        </div>

        {/* Message bubble */}
        <Card
          variant="elevated"
          padding="sm"
          className={cn(
            'relative',
            isBot
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-100 border-gray-200'
          )}
        >
          {/* Speech bubble tail */}
          <div className={cn(
            'absolute top-3 w-0 h-0 border-solid border-4',
            isBot
              ? '-left-2 border-r-blue-200 border-l-transparent border-t-transparent border-b-transparent'
              : '-right-2 border-l-gray-200 border-r-transparent border-t-transparent border-b-transparent'
          )} />

          <div className={cn(
            'text-sm leading-relaxed',
            isBot ? 'text-blue-900' : 'text-gray-800'
          )}>
            {message.content}
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
