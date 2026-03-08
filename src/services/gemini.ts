import { supabase } from "@/integrations/supabase/client";

interface ScriptParams {
  name: string;
  duration: number;
  description: string;
  audience: string[];
}

async function invokeGemini<T>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('gemini', {
    body: payload,
  });
  if (error) throw new Error(`Gemini service error: ${error.message}`);
  if (!data?.success) throw new Error(data?.error || 'Gemini request failed');
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
