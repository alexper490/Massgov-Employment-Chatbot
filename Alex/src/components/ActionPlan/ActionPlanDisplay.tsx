import React from 'react';
import type { ActionPlan } from '~/types';
import { Card } from '~/components/UI/Card';
import { ActionPlanCard } from './ActionPlanCard';
import { ResourceLink } from './ResourceLink';
import { Button } from '~/components/UI/Button';
import { Download, Mail, ExternalLink } from 'lucide-react';

interface ActionPlanDisplayProps {
  actionPlan: ActionPlan;
}

export const ActionPlanDisplay: React.FC<ActionPlanDisplayProps> = ({ actionPlan }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('My Massachusetts Unemployment Action Plan');
    const body = encodeURIComponent(
      `Here is my personalized unemployment action plan:\n\n` +
      `${actionPlan.title}\n${actionPlan.description}\n\n` +
      `View full plan at: ${window.location.href}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Action Plan Header */}
      <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <h2 className="text-xl font-bold text-blue-900">{actionPlan.title}</h2>
            </div>
            <p className="text-blue-800 leading-relaxed">{actionPlan.description}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-blue-200">
          <Button onClick={handlePrint} variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Print Plan
          </Button>
          <Button onClick={handleEmail} variant="secondary" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Email Plan
          </Button>
        </div>
      </Card>

      {/* Immediate Actions */}
      <ActionPlanCard
        title="Immediate Actions (24-48 hours)"
        description="These are the most urgent steps you should take right away."
        actions={actionPlan.immediateActions}
        priority="immediate"
        bgColor="bg-red-50"
        borderColor="border-red-200"
        textColor="text-red-900"
        iconColor="bg-red-600"
      />

      {/* Short-term Actions */}
      <ActionPlanCard
        title="Short-term Actions (This week)"
        description="Complete these tasks within the next week to set yourself up for success."
        actions={actionPlan.shortTermActions}
        priority="short_term"
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
        textColor="text-yellow-900"
        iconColor="bg-yellow-600"
      />

      {/* Ongoing Actions */}
      <ActionPlanCard
        title="Ongoing Actions (2-4 weeks)"
        description="These are ongoing activities to maintain your benefits and find new employment."
        actions={actionPlan.ongoingActions}
        priority="ongoing"
        bgColor="bg-green-50"
        borderColor="border-green-200"
        textColor="text-green-900"
        iconColor="bg-green-600"
      />

      {/* Hidden Resources */}
      {actionPlan.hiddenResources && actionPlan.hiddenResources.length > 0 && (
        <Card variant="elevated" className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              <ExternalLink className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900">Additional Resources</h3>
          </div>
          <p className="text-purple-800 mb-4 text-sm">
            These lesser-known programs and services may also be helpful for your situation:
          </p>
          <div className="space-y-3">
            {actionPlan.hiddenResources.map((resource) => (
              <ResourceLink key={resource.id} resource={resource} />
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <Card variant="outline" className="text-center">
        <p className="text-gray-600 text-sm">
          Need more help? Contact a MassHire Career Center at{' '}
          <a href="tel:617-626-5300" className="text-blue-600 hover:underline">
            (617) 626-5300
          </a>{' '}
          or visit{' '}
          <a 
            href="https://www.mass.gov/locations/masshire-career-centers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            mass.gov/locations/masshire-career-centers
          </a>
        </p>
      </Card>
    </div>
  );
};
