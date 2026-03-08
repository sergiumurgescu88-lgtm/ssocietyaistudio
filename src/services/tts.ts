import { supabase } from "@/integrations/supabase/client";
import { activityLogService } from "./activityLog";

interface TTSOptions {
  text: string;
  speaker: 'alina' | 'sergiu' | 'alina-premium' | 'sergiu-premium';
  speed?: number;
  pitch?: number;
}

interface Voice {
  id: string;
  name: string;
  gender: string;
}

async function invokeTTS<T>(payload: Record<string, unknown>): Promise<T> {
  const start = Date.now();
  const { data, error } = await supabase.functions.invoke('tts', {
    body: payload,
  });
  const duration = Date.now() - start;

  if (error) {
    activityLogService.log({
      type: 'generation', status: 'error', title: 'TTS Generation Failed',
      description: error.message, metadata: { api: 'google-tts', action: payload.action, duration },
    });
    throw new Error(`TTS service error: ${error.message}`);
  }
  if (!data?.success) {
    const errMsg = data?.error || 'TTS request failed';
    activityLogService.log({
      type: 'generation', status: 'error', title: 'TTS Generation Failed',
      description: errMsg, metadata: { api: 'google-tts', action: payload.action, duration },
    });
    throw new Error(errMsg);
  }

  activityLogService.log({
    type: 'generation', status: 'success', title: `TTS ${payload.action} Success`,
    description: `Completed in ${duration}ms`, metadata: { api: 'google-tts', action: payload.action, duration },
  });
  return data.data as T;
}

export const ttsService = {
  async generate(options: TTSOptions): Promise<string> {
    const result = await invokeTTS<{ audioContent: string }>({ action: 'generate', ...options });
    return result.audioContent;
  },

  async getVoices(): Promise<Voice[]> {
    return invokeTTS<Voice[]>({ action: 'getVoices' });
  },
};
