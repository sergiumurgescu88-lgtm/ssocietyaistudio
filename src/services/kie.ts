import { supabase } from "@/integrations/supabase/client";

interface VideoOptions {
  tool?: 'kie-text-to-video' | 'kie-image-to-video' | 'kie-edit' | 'kie-merge';
  prompt: string;
  assets?: { script?: string; images?: string[]; audio?: string };
  output?: { format?: 'mp4' | 'mov' | 'webm'; resolution?: '1080p' | '720p' | '4k'; fps?: 24 | 30 | 60 };
}

interface VideoResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

async function invokeKie<T>(payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('kie', {
    body: payload,
  });
  if (error) throw new Error(`Kie service error: ${error.message}`);
  if (!data?.success) throw new Error(data?.error || 'Kie request failed');
  return data.data as T;
}

export const kieService = {
  async generateVideo(options: VideoOptions): Promise<VideoResponse> {
    return invokeKie<VideoResponse>({ action: 'generate', ...options });
  },

  async getVideoStatus(videoId: string): Promise<VideoResponse> {
    return invokeKie<VideoResponse>({ action: 'status', videoId });
  },

  async generateSubtitles(videoId: string, language = 'ro'): Promise<string> {
    return invokeKie<string>({ action: 'subtitles', videoId, language });
  },

  async resizeVideo(videoId: string, aspectRatio: '16:9' | '9:16' | '1:1'): Promise<VideoResponse> {
    return invokeKie<VideoResponse>({ action: 'resize', videoId, aspectRatio });
  },
};
