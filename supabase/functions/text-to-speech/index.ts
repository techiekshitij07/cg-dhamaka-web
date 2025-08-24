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

const getEmotionalVoiceSettings = (emotion: string) => {
  const emotionSettings = {
    friendly: { voice: 'Aria', model: 'eleven_multilingual_v2' },
    enthusiastic: { voice: 'Charlie', model: 'eleven_multilingual_v2' },
    calm: { voice: 'Sarah', model: 'eleven_multilingual_v2' },
    playful: { voice: 'River', model: 'eleven_multilingual_v2' },
    wise: { voice: 'George', model: 'eleven_multilingual_v2' },
    caring: { voice: 'Laura', model: 'eleven_multilingual_v2' },
    excited: { voice: 'Liam', model: 'eleven_multilingual_v2' },
    professional: { voice: 'Brian', model: 'eleven_multilingual_v2' },
    gentle: { voice: 'Alice', model: 'eleven_multilingual_v2' },
    authoritative: { voice: 'Daniel', model: 'eleven_multilingual_v2' }
  };

  return emotionSettings[emotion] || emotionSettings.friendly;
};

const voiceIdMap = {
  'Aria': '9BWtsMINqrJLrRacOk9x',
  'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
  'Sarah': 'EXAVITQu4vr4xnSDxMaL',
  'Laura': 'FGY2WhTYpPnrIDTdsKH5',
  'Charlie': 'IKne3meq5aSn9XLyUdCD',
  'George': 'JBFqnCBsd6RMkjVDRZzb',
  'River': 'SAz9YHcvj6GT2YYXdXww',
  'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
  'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
  'Brian': 'nPczCjzI2devNBz1zQrb',
  'Daniel': 'onwK4e9ZLuTAKqWW03F9'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, emotion = 'friendly' }: TTSRequest = await req.json();

    if (!text) {
      throw new Error('Text is required for TTS');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const voiceSettings = getEmotionalVoiceSettings(emotion);
    const voiceId = voiceIdMap[voiceSettings.voice];

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: voiceSettings.model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs TTS API error: ${error}`);
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