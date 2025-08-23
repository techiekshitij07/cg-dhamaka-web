import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  voice?: string;
  emotion?: string;
  speed?: number;
}

const getEmotionalVoiceSettings = (emotion: string, voice: string) => {
  const emotionSettings = {
    friendly: { voice: voice || 'alloy', speed: 1.0 },
    enthusiastic: { voice: 'shimmer', speed: 1.1 },
    calm: { voice: 'nova', speed: 0.9 },
    playful: { voice: 'echo', speed: 1.1 },
    wise: { voice: 'fable', speed: 0.9 },
    caring: { voice: 'alloy', speed: 0.95 }
  };

  return emotionSettings[emotion] || emotionSettings.friendly;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'alloy', emotion = 'friendly', speed = 1.0 }: TTSRequest = await req.json();

    if (!text) {
      throw new Error('Text is required for TTS');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const voiceSettings = getEmotionalVoiceSettings(emotion, voice);

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: voiceSettings.voice,
        speed: speed || voiceSettings.speed,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI TTS API error: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        emotion: emotion,
        voice: voiceSettings.voice 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('TTS Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});