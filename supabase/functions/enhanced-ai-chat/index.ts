import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

interface ChatRequest {
  message: string;
  emotion?: string;
  responseLength?: 'short' | 'medium' | 'long';
  sessionId?: string;
  userId?: string;
}

const getEmotionalPrompt = (emotion: string, responseLength: string) => {
  const emotions = {
    friendly: "दोस्ताना अउ मिलनसार तरीका से",
    enthusiastic: "जोशीला अउ उत्साही तरीका से",
    calm: "शांत अउ धैर्यवान तरीका से",
    playful: "मजेदार अउ हंसी-मजाक के साथ",
    wise: "ज्ञानी अउ समझदार तरीका से",
    caring: "प्रेम अउ देखभाल के साथ"
  };

  const lengths = {
    short: "एकदम छोटा जवाब (1-2 वाक्य)",
    medium: "मध्यम जवाब (3-5 वाक्य)",
    long: "विस्तार से जवाब (6+ वाक्य)"
  };

  return `तुम एक छत्तीसगढ़ी AI सहायक हो जो ${emotions[emotion] || emotions.friendly} जवाब देता है। 
  ${lengths[responseLength] || lengths.medium} में जवाब दो।
  छत्तीसगढ़ी भाषा का ज्यादा इस्तेमाल करो।`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, emotion = 'friendly', responseLength = 'medium', sessionId, userId }: ChatRequest = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get cultural context from database
    const { data: culturalData } = await supabase
      .from('cg_culture')
      .select('*')
      .limit(5);

    // Get weather data for context
    const { data: weatherData } = await supabase
      .from('cg_weather')
      .select('*')
      .limit(3);

    const culturalContext = culturalData?.map(c => `${c.title}: ${c.content}`).join('\n') || '';
    const weatherContext = weatherData?.map(w => `${w.district_name}: ${w.temperature}°C, ${w.weather_condition}`).join('\n') || '';

    const systemPrompt = `${getEmotionalPrompt(emotion, responseLength)}
    
आपको निम्नलिखित छत्तीसगढ़ की जानकारी है:

सांस्कृतिक जानकारी:
${culturalContext}

मौसम की जानकारी:
${weatherContext}

छत्तीसगढ़ के बारे में अपडेट जानकारी के साथ जवाब दो। अगर कोई खास जानकारी नहीं है तो सामान्य सहायक तरीके से जवाब दो।`;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nउपयोगकर्ता का सवाल: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: responseLength === 'short' ? 100 : responseLength === 'medium' ? 300 : 600,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'माफ करना, मैं समझ नहीं पाया।';

    // Save to database if user is logged in
    if (sessionId && userId) {
      await supabase.from('chat_messages').insert([
        { session_id: sessionId, user_id: userId, message_text: message, message_type: 'user' },
        { 
          session_id: sessionId, 
          user_id: userId, 
          message_text: aiResponse, 
          message_type: 'ai', 
          emotion: emotion,
          response_length: responseLength 
        }
      ]);
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        emotion: emotion,
        responseLength: responseLength 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enhanced AI Chat Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});