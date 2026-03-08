import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KIE_API_KEY = Deno.env.get('KIE_API_KEY') || '';
const BASE_URL = 'https://api.kie.ai/v1';

async function kieRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Kie.ai API error [${response.status}]: ${err}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!KIE_API_KEY) {
      throw new Error('KIE_API_KEY is not configured');
    }

    const { action, ...params } = await req.json();

    let result: unknown;

    switch (action) {
      case 'generate': {
        const { tool, prompt, assets, output } = params;
        result = await kieRequest('/generate', {
          method: 'POST',
          body: JSON.stringify({
            tool: tool || 'kie-text-to-video',
            prompt,
            assets: assets || {},
            output: {
              format: output?.format || 'mp4',
              resolution: output?.resolution || '1080p',
              fps: output?.fps || 30,
            },
          }),
        });
        break;
      }

      case 'status': {
        const { videoId } = params;
        result = await kieRequest(`/status/${videoId}`);
        break;
      }

      case 'subtitles': {
        const { videoId, language } = params;
        result = await kieRequest('/subtitles', {
          method: 'POST',
          body: JSON.stringify({ videoId, language: language || 'ro' }),
        });
        break;
      }

      case 'resize': {
        const { videoId, aspectRatio } = params;
        result = await kieRequest('/resize', {
          method: 'POST',
          body: JSON.stringify({ videoId, aspectRatio }),
        });
        break;
      }

      case 'download': {
        const { videoId } = params;
        const response = await fetch(`${BASE_URL}/download/${videoId}`, {
          headers: { 'Authorization': `Bearer ${KIE_API_KEY}` },
        });
        if (!response.ok) {
          throw new Error(`Download failed [${response.status}]`);
        }
        const blob = await response.blob();
        return new Response(blob, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="${videoId}.mp4"`,
          },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Kie function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
