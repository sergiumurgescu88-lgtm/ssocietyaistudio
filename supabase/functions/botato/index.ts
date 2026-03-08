import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BOTATO_API_KEY = Deno.env.get('BOTATO_API_KEY') || '';
const BASE_URL = 'https://api.botato.com/v1';

async function botatoRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${BOTATO_API_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Botato API error [${response.status}]: ${err}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!BOTATO_API_KEY) {
      throw new Error('BOTATO_API_KEY is not configured');
    }

    const { action, ...params } = await req.json();

    let result: unknown;

    switch (action) {
      case 'createWorkflow': {
        const { name, platforms, schedule, content, autoEngagement } = params;
        result = await botatoRequest('/workflows', {
          method: 'POST',
          body: JSON.stringify({ name, platforms, schedule, content, autoEngagement }),
        });
        break;
      }

      case 'getWorkflowStatus': {
        const { workflowId } = params;
        result = await botatoRequest(`/workflows/${workflowId}`);
        break;
      }

      case 'publishWorkflow': {
        const { workflowId } = params;
        result = await botatoRequest(`/workflows/${workflowId}/publish`, {
          method: 'POST',
        });
        break;
      }

      case 'connectPlatform': {
        const { platform } = params;
        result = await botatoRequest('/connect', {
          method: 'POST',
          body: JSON.stringify({ platform }),
        });
        break;
      }

      case 'getConnectedPlatforms': {
        result = await botatoRequest('/platforms');
        break;
      }

      case 'getAnalytics': {
        const { workflowId } = params;
        result = await botatoRequest(`/workflows/${workflowId}/analytics`);
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Botato function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
