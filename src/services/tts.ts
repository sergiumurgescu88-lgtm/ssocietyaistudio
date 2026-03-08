import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase.functions.invoke('tts', {
    body: payload,
  });
  if (error) throw new Error(`TTS service error: ${error.message}`);
  if (!data?.success) throw new Error(data?.error || 'TTS request failed');
  return data.data as T;
}

export const ttsService = {
  async generate(options: TTSOptions): Promise<string> {
    const result = await invokeTTS<{ audioContent: string }>({ action: 'generate', ...options });
    // Returns base64-encoded MP3 audio
    return result.audioContent;
  },

  async getVoices(): Promise<Voice[]> {
    return invokeTTS<Voice[]>({ action: 'getVoices' });
  },
};
