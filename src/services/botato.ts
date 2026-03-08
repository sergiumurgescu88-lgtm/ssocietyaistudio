import { supabase } from "@/integrations/supabase/client";

interface Workflow {
  name: string;
  platforms: string[];
  schedule: Record<string, string>;
  content: {
    video: string;
    thumbnail: string;
    title: string;
    description: string;
  };
  autoEngagement?: boolean;
}

interface WorkflowResponse {
  id: string;
  status: 'scheduled' | 'publishing' | 'completed' | 'failed';
  posts: Array<{
    platform: string;
    status: string;
    url?: string;
    publishedAt?: string;
  }>;
}

interface AnalyticsResponse {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

async function invokeBotato<T>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('botato', {
    body: payload,
  });
  if (error) throw new Error(`Botato service error: ${error.message}`);
  if (!data?.success) throw new Error(data?.error || 'Botato request failed');
  return data.data as T;
}

export const botatoService = {
  async createWorkflow(workflow: Workflow): Promise<WorkflowResponse> {
    return invokeBotato<WorkflowResponse>({ action: 'createWorkflow', ...workflow });
  },

  async getWorkflowStatus(workflowId: string): Promise<WorkflowResponse> {
    return invokeBotato<WorkflowResponse>({ action: 'getWorkflowStatus', workflowId });
  },

  async publishWorkflow(workflowId: string): Promise<WorkflowResponse> {
    return invokeBotato<WorkflowResponse>({ action: 'publishWorkflow', workflowId });
  },

  async connectPlatform(platform: string): Promise<{ authUrl: string }> {
    return invokeBotato<{ authUrl: string }>({ action: 'connectPlatform', platform });
  },

  async getConnectedPlatforms(): Promise<string[]> {
    return invokeBotato<string[]>({ action: 'getConnectedPlatforms' });
  },

  async getAnalytics(workflowId: string): Promise<AnalyticsResponse> {
    return invokeBotato<AnalyticsResponse>({ action: 'getAnalytics', workflowId });
  },
};
