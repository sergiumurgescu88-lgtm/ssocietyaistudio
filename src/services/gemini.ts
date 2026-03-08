import { supabase } from "@/integrations/supabase/client";
import { activityLogService } from "./activityLog";

interface ScriptParams {
  name: string;
  duration: number;
  description: string;
  audience: string[];
  femaleSpeakerName?: string;
  maleSpeakerName?: string;
}

async function invokeGemini<T>(payload: Record<string, unknown>): Promise<T> {
  const start = Date.now();
  const { data, error } = await supabase.functions.invoke('gemini', {
    body: payload,
  });
  const duration = Date.now() - start;

  if (error) {
    activityLogService.log({
      type: 'generation', status: 'error', title: `Gemini ${payload.action} Failed`,
      description: error.message, metadata: { api: 'gemini', action: payload.action, duration },
    });
    throw new Error(`Gemini service error: ${error.message}`);
  }
  if (!data?.success) {
    const errMsg = data?.error || 'Gemini request failed';
    activityLogService.log({
      type: 'generation', status: 'error', title: `Gemini ${payload.action} Failed`,
      description: errMsg, metadata: { api: 'gemini', action: payload.action, duration },
    });
    throw new Error(errMsg);
  }

  activityLogService.log({
    type: 'generation', status: 'success', title: `Gemini ${payload.action} Success`,
    description: `Completed in ${duration}ms`, metadata: { api: 'gemini', action: payload.action, duration },
  });
  return data.data as T;
}

export const geminiService = {
  async generateScript(params: ScriptParams): Promise<string> {
    return invokeGemini<string>({ action: 'generateScript', ...params });
  },

  async generateImage(prompt: string): Promise<string> {
    return invokeGemini<string>({ action: 'generateImage', prompt });
  },

  async generateSEOContent(toolData: { name: string; keywords?: string[] }): Promise<unknown> {
    return invokeGemini({ action: 'generateSEO', ...toolData });
  },
};
