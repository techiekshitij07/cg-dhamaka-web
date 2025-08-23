-- Create comprehensive database structure for Chhattisgarhi AI Assistant

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'chhattisgarhi',
  voice_preference TEXT DEFAULT 'alloy',
  emotion_preference TEXT DEFAULT 'friendly',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_name TEXT DEFAULT 'New Chat',
  language TEXT DEFAULT 'chhattisgarhi',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat messages table with emotion and response type
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
  response_length TEXT CHECK (response_length IN ('short', 'medium', 'long')),
  emotion TEXT DEFAULT 'neutral',
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weather data for Chhattisgarh districts
CREATE TABLE public.cg_weather (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district_name TEXT NOT NULL,
  temperature DECIMAL,
  humidity DECIMAL,
  weather_condition TEXT,
  wind_speed DECIMAL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- News and updates for Chhattisgarh
CREATE TABLE public.cg_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  source_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural information and poetry
CREATE TABLE public.cg_culture (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('festival', 'dance', 'song', 'poem', 'tradition', 'craft')),
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cg_weather ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cg_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cg_culture ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user-specific data
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat sessions" 
ON public.chat_sessions FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create chat sessions" 
ON public.chat_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own messages" 
ON public.chat_messages FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Public read access for weather, news, and culture
CREATE POLICY "Weather is publicly readable" 
ON public.cg_weather FOR SELECT 
USING (true);

CREATE POLICY "News is publicly readable" 
ON public.cg_news FOR SELECT 
USING (true);

CREATE POLICY "Culture is publicly readable" 
ON public.cg_culture FOR SELECT 
USING (true);

-- Insert sample Chhattisgarh districts for weather
INSERT INTO public.cg_weather (district_name, temperature, humidity, weather_condition, wind_speed) VALUES
('Raipur', 28.5, 65, 'Partly Cloudy', 12.5),
('Bilaspur', 27.8, 70, 'Clear', 8.2),
('Korba', 26.9, 68, 'Sunny', 10.1),
('Durg', 29.1, 63, 'Cloudy', 15.3),
('Bhilai', 28.7, 66, 'Partly Cloudy', 11.8),
('Jagdalpur', 25.4, 75, 'Light Rain', 6.7),
('Ambikapur', 24.3, 78, 'Overcast', 9.4),
('Rajnandgaon', 27.6, 69, 'Clear', 13.2);

-- Insert sample cultural data
INSERT INTO public.cg_culture (title, content, type, region) VALUES
('हरेली त्योहार', 'हरेली छत्तीसगढ़ का प्रमुख त्योहार हे जेला श्रावण अमावस्या के दिन मनाए जाथे। ए दिन बैलगाड़ी के पूजा होथे अउ किसान मन अपन खेती के औजार के पूजा करथे।', 'festival', 'समपूर्ण छत्तीसगढ़'),
('पंथी नृत्य', 'पंथी नृत्य छत्तीसगढ़ के प्रसिद्ध लोक नृत्य हे जेला सतनाम पंथी मन करथे। ए नृत्य में गुरु घासीदास जी के शिक्षा के बारे में गीत गाए जाथे।', 'dance', 'छत्तीसगढ़ मैदान'),
('राउत नाचा', 'राउत नाचा छत्तीसगढ़ के पारंपरिक लोक कला हे जेमा यादव समुदाय के वीरता के कहानी कहे जाथे। देवारी के समय ए नाचा होथे।', 'dance', 'छत्तीसगढ़ मैदान');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Foreign key constraints
ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON DELETE CASCADE;