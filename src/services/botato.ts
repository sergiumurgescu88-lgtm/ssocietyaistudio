import { supabase } from "@/integrations/supabase/client";
import { activityLogService } from "./activityLog";

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
  const start = Date.now();
  const { data, error } = await supabase.functions.invoke('botato', {
    body: payload,
  });
  const duration = Date.now() - start;

  if (error) {
    activityLogService.log({
      type: 'publishing', status: 'error', title: `Botato ${payload.action} Failed`,
      description: error.message, metadata: { api: 'botato', action: payload.action, duration },
    });
    throw new Error(`Botato service error: ${error.message}`);
  }
  if (!data?.success) {
    const errMsg = data?.error || 'Botato request failed';
    activityLogService.log({
      type: 'publishing', status: 'error', title: `Botato ${payload.action} Failed`,
      description: errMsg, metadata: { api: 'botato', action: payload.action, duration },
    });
    throw new Error(errMsg);
  }

  activityLogService.log({
    type: 'publishing', status: 'success', title: `Botato ${payload.action} Success`,
    description: `Completed in ${duration}ms`, metadata: { api: 'botato', action: payload.action, duration },
  });
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
