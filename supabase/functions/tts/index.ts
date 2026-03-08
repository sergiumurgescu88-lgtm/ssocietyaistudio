import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY') || '';
const TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

const VOICE_MAP: Record<string, { name: string; ssmlGender: string }> = {
  'alina': { name: 'ro-RO-Standard-A', ssmlGender: 'FEMALE' },
  'sergiu': { name: 'ro-RO-Standard-B', ssmlGender: 'MALE' },
  'alina-premium': { name: 'ro-RO-Wavenet-A', ssmlGender: 'FEMALE' },
  'sergiu-premium': { name: 'ro-RO-Wavenet-B', ssmlGender: 'MALE' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_TTS_API_KEY) {
      throw new Error('GOOGLE_TTS_API_KEY is not configured');
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'generate': {
        const { text, speaker, speed, pitch } = params;
        const voice = VOICE_MAP[speaker] || VOICE_MAP['alina'];

        const response = await fetch(`${TTS_URL}?key=${GOOGLE_TTS_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: 'ro-RO',
              name: voice.name,
              ssmlGender: voice.ssmlGender,
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: speed || 1.0,
              pitch: pitch || 0.0,
            },
          }),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Google TTS API error [${response.status}]: ${err}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify({ success: true, data: { audioContent: data.audioContent } }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'getVoices': {
        const voices = Object.entries(VOICE_MAP).map(([id, v]) => ({
          id,
          name: v.name,
          gender: v.ssmlGender.toLowerCase(),
        }));
        return new Response(JSON.stringify({ success: true, data: voices }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('TTS function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
