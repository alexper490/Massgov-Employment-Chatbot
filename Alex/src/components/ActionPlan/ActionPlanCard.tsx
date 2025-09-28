import React from 'react';
import type { ActionItem } from '~/types';
import { Card } from '~/components/UI/Card';
import { ProgressChecklist } from './ProgressChecklist';
import { Clock } from 'lucide-react';

interface ActionPlanCardProps {
  title: string;
  description: string;
  actions: ActionItem[];
  priority: 'immediate' | 'short_term' | 'ongoing';
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({
  title,
  description,
  actions,
  priority,
  bgColor,
  borderColor,
  textColor,
  iconColor
}) => {
  const completedActions = actions.filter(action => action.completed).length;
  const totalActions = actions.length;
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

  const getPriorityIcon = () => {
    switch (priority) {
      case 'immediate':
        return '🚨';
      case 'short_term':
        return '⏰';
      case 'ongoing':
        return '🔄';
      default:
        return '📋';
    }
  };

  return (
    <Card variant="elevated" className={`${bgColor} ${borderColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center text-white text-lg`}>
            {getPriorityIcon()}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
            <p className={`text-sm ${textColor} opacity-80`}>{description}</p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="text-right">
          <div className={`text-sm font-medium ${textColor}`}>
            {completedActions}/{totalActions} completed
          </div>
          <div className="w-16 h-2 bg-white rounded-full mt-1">
            <div 
              className={`h-full ${iconColor} rounded-full transition-all duration-300`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {actions.length > 0 ? (
        <div className="space-y-4">
          {actions.map((action) => (
            <ProgressChecklist key={action.id} action={action} />
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${textColor} opacity-60`}>
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No specific actions required at this time</p>
        </div>
      )}
    </Card>
  );
};
