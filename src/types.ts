export interface CampaignSubmission {
  id: string;
  fullName: string;
  email: string;
  platform: string;
  campaignName: string;
  notesBudget: string;
  timestamp: string;
  status: 'submitted' | 'failed' | 'simulated';
  errorMessage?: string;
}

export type ActiveTab = 'preview' | 'html-code' | 'script-code' | 'setup-guide' | 'submissions';

export interface FormState {
  fullName: string;
  email: string;
  platform: string;
  campaignName: string;
  notesBudget: string;
}

export interface DeploymentConfig {
  webAppUrl: string;
  useSimulationMode: boolean;
}
