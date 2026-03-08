import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const GEMINI_KEYS = [
  Deno.env.get('GEMINI_API_KEY_1') || '',
  Deno.env.get('GEMINI_API_KEY_2') || '',
  Deno.env.get('GEMINI_API_KEY_3') || '',
  Deno.env.get('GEMINI_API_KEY_4') || '',
].filter(Boolean);

async function retryWithFallback<T>(operation: (apiKey: string) => Promise<T>): Promise<T> {
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    try {
      return await operation(GEMINI_KEYS[i]);
    } catch (error) {
      console.warn(`Gemini key ${i} failed:`, error instanceof Error ? error.message : error);
      if (i === GEMINI_KEYS.length - 1) {
        throw new Error('All Gemini API keys exhausted');
      }
    }
  }
  throw new Error('Gemini API fallback exhausted');
}

async function callGemini(apiKey: string, model: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error [${res.status}]: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (GEMINI_KEYS.length === 0) {
      throw new Error('No Gemini API keys configured');
    }

    const { action, ...params } = await req.json();

    let result: unknown;

    switch (action) {
      case 'generateScript': {
        const { name, duration, description, audience } = params;
        const prompt = `Creează un script podcast pentru ${name}.
      
Difuzori: Alina (gazdă feminină), Sergiu (fondator masculin)
Limba: Română
Durata: ${duration} secunde

Descriere: ${description}
Public: ${(audience || []).join(', ')}

Include:
- Hook în primele 10 secunde
- Poveste client cu rezultate cuantificabile
- 3 beneficii principale
- Call-to-action clar
- Mențiune S Society Hub

Format:
Alina: [text]
Sergiu: [text]

Scrie numerele în cuvinte pentru TTS.`;

        result = await retryWithFallback((key) => callGemini(key, 'gemini-2.0-flash', prompt));
        break;
      }

      case 'generateSEO': {
        const { name, keywords } = params;
        const prompt = `Generează conținut SEO complet pentru ${name}.

Include:
1. YouTube: Titlu (60 chars), Descriere (500 words), Tags (20)
2. Blog: Articol 500-1000 words
3. Social: 5 postări (LinkedIn, Facebook, Instagram, TikTok, Twitter)
4. Email: 5-email sequence

Limba: Română
Keywords: ${(keywords || [name]).join(', ')}

Răspunde DOAR cu JSON valid.`;

        result = await retryWithFallback((key) => callGemini(key, 'gemini-2.0-flash', prompt));
        break;
      }

      case 'generateImage': {
        const { prompt: imgPrompt } = params;
        result = await retryWithFallback(async (key) => {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: imgPrompt }] }],
            }),
          });
          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini Image API error [${res.status}]: ${err}`);
          }
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        });
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
