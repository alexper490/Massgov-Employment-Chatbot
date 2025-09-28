import React from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { Button } from '~/components/UI/Button';
import { cn } from '~/utils/cn';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

interface ChatForm {
  message: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch
  } = useForm<ChatForm>();

  const messageValue = watch('message', '');
  const isMessageEmpty = !messageValue?.trim();

  const onSubmit = async ({ message }: ChatForm) => {
    if (!message.trim() || disabled) return;
    
    await onSendMessage(message.trim());
    reset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            {...register('message', { required: true })}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            onKeyPress={handleKeyPress}
            rows={1}
            className={cn(
              'w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              'placeholder:text-gray-400'
            )}
            style={{
              minHeight: '44px',
              maxHeight: '120px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={disabled || isSubmitting || isMessageEmpty}
          isLoading={isSubmitting}
          className="h-11 w-11 p-0 flex-shrink-0"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};
