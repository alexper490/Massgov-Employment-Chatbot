import type { UserProfile, ActionPlan, ResourceLink } from '~/types';
import actionPlansData from '~/data/actionPlans.json';
import resourcesData from '~/data/resources.json';
import { determineEligibilityCategory } from './chatLogic';

const getResource = (resourceId: string): ResourceLink | undefined => {
  const resource = (resourcesData.resources as Record<string, any>)[resourceId];
  return resource ? { ...resource } : undefined;
};

const populateActionItemResources = (actionItems: any[]): any[] => {
  return actionItems.map(item => ({
    ...item,
    resources: item.resources
      .map((resourceId: string) => getResource(resourceId))
      .filter(Boolean)
  }));
};

const getAdditionalResources = (userProfile: UserProfile): ResourceLink[] => {
  const additionalResources: ResourceLink[] = [];
  
  // Add SNAP benefits for longer-term unemployed
  if (userProfile.timeline === 'months' || userProfile.timeline === 'long_term') {
    const snapResource = getResource('snap_benefits');
    if (snapResource) additionalResources.push(snapResource);
    
    const fuelAssistance = getResource('fuel_assistance');
    if (fuelAssistance) additionalResources.push(fuelAssistance);
  }
  
  // Add healthcare resources if recently unemployed
  if (userProfile.timeline === 'recent' || userProfile.timeline === 'weeks') {
    const healthcareResource = getResource('healthcare_coverage');
    if (healthcareResource) additionalResources.push(healthcareResource);
  }
  
  // Add disability services for health-related separations
  if (userProfile.separationReason === 'health') {
    const disabilityResource = getResource('disability_services');
    if (disabilityResource) additionalResources.push(disabilityResource);
  }
  
  // Add legal aid for fired employees
  if (userProfile.separationReason === 'fired') {
    const legalAidResource = getResource('legal_aid');
    if (legalAidResource) additionalResources.push(legalAidResource);
  }
  
  return additionalResources;
};

export const generateActionPlan = (userProfile: UserProfile): ActionPlan | null => {
  const eligibilityCategory = determineEligibilityCategory(userProfile);
  
  // Get the base action plan template
  const planTemplate = (actionPlansData.actionPlans as Record<string, any>)[eligibilityCategory];
  
  if (!planTemplate) {
    // Fallback to a general plan
    const fallbackPlan = (actionPlansData.actionPlans as Record<string, any>)['layoff_eligible'];
    if (!fallbackPlan) return null;
    
    return {
      ...fallbackPlan,
      title: 'General Unemployment Resources',
      description: 'Here are some general resources that may be helpful for your situation.',
      immediateActions: populateActionItemResources(fallbackPlan.immediateActions),
      shortTermActions: populateActionItemResources(fallbackPlan.shortTermActions),
      ongoingActions: populateActionItemResources(fallbackPlan.ongoingActions),
      hiddenResources: fallbackPlan.hiddenResources || []
    };
  }
  
  // Customize the plan based on user's specific situation
  let customizedPlan = { ...planTemplate };
  
  // Add additional resources based on user profile
  const additionalResources = getAdditionalResources(userProfile);
  customizedPlan.hiddenResources = [
    ...(customizedPlan.hiddenResources || []),
    ...additionalResources
  ];
  
  // Populate resource details for all action items
  customizedPlan.immediateActions = populateActionItemResources(customizedPlan.immediateActions);
  customizedPlan.shortTermActions = populateActionItemResources(customizedPlan.shortTermActions);
  customizedPlan.ongoingActions = populateActionItemResources(customizedPlan.ongoingActions);
  
  return customizedPlan;
};

export const customizeActionPlanContent = (
  plan: ActionPlan,
  userProfile: UserProfile
): ActionPlan => {
  let customTitle = plan.title;
  let customDescription = plan.description;
  
  // Customize based on timeline
  if (userProfile.timeline === 'recent') {
    customDescription += ' Since your job loss is recent, acting quickly will help you access benefits sooner.';
  } else if (userProfile.timeline === 'long_term') {
    customDescription += ' Even though some time has passed, there are still resources and programs available to help you.';
  }
  
  // Customize based on separation reason
  if (userProfile.separationReason === 'layoff' && userProfile.additionalInfo.massLayoff) {
    customDescription += ' Since you were part of a mass layoff, you may be eligible for additional services through the Worker Adjustment and Retraining Notification (WARN) program.';
  }
  
  return {
    ...plan,
    title: customTitle,
    description: customDescription
  };
};
