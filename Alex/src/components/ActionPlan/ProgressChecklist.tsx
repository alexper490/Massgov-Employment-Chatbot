import React from 'react';
import type { ActionItem } from '~/types';
import { useChatStore } from '~/stores/chatStore';
import { ResourceLink } from './ResourceLink';
import { Card } from '~/components/UI/Card';
import { Check, Clock, ExternalLink } from 'lucide-react';
import { cn } from '~/utils/cn';

interface ProgressChecklistProps {
  action: ActionItem;
}

export const ProgressChecklist: React.FC<ProgressChecklistProps> = ({ action }) => {
  const { toggleActionItemComplete } = useChatStore();

  const handleToggleComplete = () => {
    toggleActionItemComplete(action.id);
  };

  return (
    <Card 
      variant="default" 
      className={cn(
        'transition-all duration-200',
        action.completed 
          ? 'bg-white/80 border-green-300 shadow-sm' 
          : 'bg-white border-gray-200 hover:shadow-md'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200',
            action.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          )}
        >
          {action.completed && <Check className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className={cn(
              'font-medium text-gray-900',
              action.completed && 'line-through text-gray-500'
            )}>
              {action.title}
            </h4>
            
            {/* Time estimate */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {action.timeEstimate}
            </div>
          </div>

          <p className={cn(
            'text-sm text-gray-700 mb-3',
            action.completed && 'text-gray-500'
          )}>
            {action.description}
          </p>

          {/* Resources */}
          {action.resources && action.resources.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                <ExternalLink className="w-3 h-3" />
                Resources:
              </div>
              {action.resources.map((resource) => (
                <ResourceLink key={resource.id} resource={resource} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
