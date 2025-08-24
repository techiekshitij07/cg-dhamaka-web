import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, Send, X, Settings, User, Bot, Mic, MicOff, 
  Volume2, VolumeX, Heart, Zap, Smile, Brain, Star, Shield 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  emotion?: string;
  responseLength?: string;
  timestamp: Date;
  audioUrl?: string;
}

const emotions = {
  friendly: { icon: Smile, color: 'text-green-500', label: 'मिलनसार' },
  enthusiastic: { icon: Zap, color: 'text-yellow-500', label: 'उत्साही' },
  calm: { icon: Shield, color: 'text-blue-500', label: 'शांत' },
  playful: { icon: Star, color: 'text-purple-500', label: 'मजेदार' },
  wise: { icon: Brain, color: 'text-indigo-500', label: 'ज्ञानी' },
  caring: { icon: Heart, color: 'text-red-500', label: 'प्रेमी' }
};

const EnhancedAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Enhanced settings
  const [emotion, setEmotion] = useState('friendly');
  const [responseLength, setResponseLength] = useState('medium');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      createSession();
      addWelcomeMessage();
    }
  }, [isOpen]);

  const createSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ session_name: 'नई बातचीत', language: 'chhattisgarhi' }])
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Session creation error:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessages = {
      friendly: 'नमस्कार! मैं तुम्हार छत्तीसगढ़ी AI सहायक हावं। का पूछना चाहत हव?',
      enthusiastic: 'अरे वाह! स्वागत हे तुम्हार! मैं छत्तीसगढ़ के बारे में सब कुछ बता सकत हावं।',
      calm: 'नमस्कार मित्र। मैं यहाँ छत्तीसगढ़ की जानकारी देने खातिर हावं। आराम से पूछव।',
      playful: 'अरे भाई! कइसे हव? मैं तुम्हार मजेदार छत्तीसगढ़ी दोस्त हावं!',
      wise: 'प्रणाम। मैं छत्तीसगढ़ के ज्ञान का भंडार हावं। जो जानना चाहव, पूछव।',
      caring: 'बेटा, कैसे हव? मैं यहाँ तुम्हार मदद करे खातिर हावं। का चाही तुम्ला?'
    };

    const welcomeMsg: Message = {
      id: '1',
      text: welcomeMessages[emotion] || welcomeMessages.friendly,
      sender: 'ai',
      emotion: emotion,
      timestamp: new Date()
    };

    setMessages([welcomeMsg]);
    // Voice features temporarily disabled for Gemini API
    // if (voiceEnabled) {
    //   speakText(welcomeMsg.text, emotion);
    // }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('enhanced-ai-chat', {
        body: {
          message: messageText,
          emotion: emotion,
          responseLength: responseLength,
          sessionId: sessionId,
          userId: null // Will be user ID when auth is implemented
        }
      });

      if (response.error) throw response.error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        sender: 'ai',
        emotion: response.data.emotion,
        responseLength: response.data.responseLength,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Voice features temporarily disabled for Gemini API
      // if (voiceEnabled) {
      //   speakText(aiMessage.text, emotion);
      // }

    } catch (error) {
      console.error('Message error:', error);
      toast({
        title: "समस्या",
        description: "जवाब नई मिल सकिस। दुबारा कोशिश करव।",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string, emotionType: string) => {
    try {
      const response = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text,
          emotion: emotionType,
          voice: 'alloy'
        }
      });

      if (response.error) throw response.error;

      const audio = new Audio(`data:audio/mp3;base64,${response.data.audioContent}`);
      audio.play();

    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "माइक्रोफोन समस्या",
        description: "आवाज रिकॉर्ड नई हो सकिस।",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await supabase.functions.invoke('speech-to-text', {
          body: { audio: base64Audio }
        });

        if (response.error) throw response.error;
        
        const transcribedText = response.data.text;
        if (transcribedText) {
          await sendMessage(transcribedText);
        }
      };
      reader.readAsDataURL(audioBlob);

    } catch (error) {
      console.error('Audio processing error:', error);
      toast({
        title: "आवाज समझ नई आई",
        description: "दुबारा बोल के देखव।",
        variant: "destructive"
      });
    }
  };

  const EmotionIcon = emotions[emotion]?.icon || Smile;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-hero hover:opacity-90 shadow-cultural animate-float border-2 border-primary/20"
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 bg-card/98 backdrop-blur-lg">
        <CardHeader className="pb-3 bg-gradient-hero text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">छत्तीसगढ़ AI सहायक</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    Professional AI
                  </Badge>
                  <div className="flex items-center gap-1">
                    <EmotionIcon className={`w-3 h-3 ${emotions[emotion]?.color || 'text-white'}`} />
                    <span className="text-xs">{emotions[emotion]?.label}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {showSettings && (
            <div className="p-4 border-b bg-muted/50">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">भावना चुनें</label>
                  <Select value={emotion} onValueChange={setEmotion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(emotions).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className={`w-4 h-4 ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">जवाब की लंबाई</label>
                  <Select value={responseLength} onValueChange={setResponseLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">छोटा (1-2 वाक्य)</SelectItem>
                      <SelectItem value="medium">मध्यम (3-5 वाक्य)</SelectItem>
                      <SelectItem value="long">लंबा (विस्तार से)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">आवाज सुविधा</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={voiceEnabled ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-hero text-white'
                      : 'bg-muted border border-border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('hi-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.emotion && message.sender === 'ai' && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs opacity-70">{emotions[message.emotion]?.label}</span>
                        {React.createElement(emotions[message.emotion]?.icon, { 
                          className: `w-3 h-3 ${emotions[message.emotion]?.color}` 
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-3 rounded-2xl border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-background/50">
            <div className="flex gap-2">
              <Input
                placeholder="अपन सवाल पूछव..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button 
                onClick={() => sendMessage()} 
                disabled={isLoading || !inputMessage.trim()}
                size="sm"
                className="bg-gradient-hero"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              छत्तीसगढ़ के बारे में सवाल पूछव • Gemini AI द्वारा संचालित
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIAssistant;