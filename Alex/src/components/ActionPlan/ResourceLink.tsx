import React from 'react';
import type { ResourceLink as ResourceLinkType } from '~/types';
import { ExternalLink, Phone, Globe } from 'lucide-react';
import { cn } from '~/utils/cn';

interface ResourceLinkProps {
  resource: ResourceLinkType;
  compact?: boolean;
}

export const ResourceLink: React.FC<ResourceLinkProps> = ({ resource, compact = false }) => {
  const getResourceIcon = () => {
    if (resource.category === 'benefits') return '💰';
    if (resource.category === 'job_search') return '💼';
    if (resource.category === 'healthcare') return '🏥';
    if (resource.category === 'legal') return '⚖️';
    if (resource.category === 'training') return '📚';
    if (resource.category === 'disability') return '♿';
    return '🔗';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
        <span className="text-sm">{getResourceIcon()}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
            >
              {resource.name}
            </a>
            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
          </div>
          {resource.phone && (
            <a
              href={`tel:${resource.phone}`}
              className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 mt-1"
            >
              <Phone className="w-3 h-3" />
              {resource.phone}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
        {getResourceIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 truncate pr-2">{resource.name}</h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                <Globe className="w-3 h-3" />
                Visit Site
              </a>
            )}
            {resource.phone && (
              <a
                href={`tel:${resource.phone}`}
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 hover:underline"
              >
                <Phone className="w-3 h-3" />
                Call
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>

        {/* Contact info */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          {resource.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {resource.phone}
            </span>
          )}
          {resource.url && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {new URL(resource.url).hostname}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
