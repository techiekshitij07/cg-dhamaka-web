import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CloudRain, Sun, Cloud, Wind, Droplets, Thermometer, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  id: string;
  district_name: string;
  temperature: number;
  humidity: number;
  weather_condition: string;
  wind_speed: number;
  last_updated: string;
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('बारिश')) return CloudRain;
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny') || lowerCondition.includes('धूप')) return Sun;
  if (lowerCondition.includes('cloud') || lowerCondition.includes('बादल')) return Cloud;
  return Sun;
};

const getConditionInChhattisgarhi = (condition: string) => {
  const conditions = {
    'Clear': 'साफ मौसम',
    'Sunny': 'धूप',
    'Partly Cloudy': 'थोड़ा बादल',
    'Cloudy': 'बादल',
    'Overcast': 'घना बादल',
    'Light Rain': 'हल्की बारिश',
    'Rain': 'बारिश',
    'Heavy Rain': 'तेज बारिश'
  };
  return conditions[condition] || condition;
};

const RealTimeWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchWeatherData = async () => {
    try {
      const { data, error } = await supabase
        .from('cg_weather')
        .select('*')
        .order('district_name');

      if (error) throw error;

      setWeatherData(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: "मौसम जानकारी त्रुटि",
        description: "मौसम की जानकारी नहीं मिल सकी।",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('weather-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cg_weather'
        },
        () => {
          fetchWeatherData();
        }
      )
      .subscribe();

    // Auto refresh every 15 minutes
    const interval = setInterval(fetchWeatherData, 15 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">छत्तीसगढ़ मौसम जानकारी</h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="outline" className="text-sm">
              Live Updates • रियल टाइम अपडेट
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last Updated: {lastUpdated.toLocaleString('hi-IN')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weatherData.map((district) => {
            const WeatherIcon = getWeatherIcon(district.weather_condition);
            
            return (
              <Card key={district.id} className="hover:shadow-lg transition-shadow duration-300 bg-card/90 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{district.district_name}</span>
                    <WeatherIcon className="w-6 h-6 text-primary" />
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {district.temperature?.toFixed(1)}°C
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getConditionInChhattisgarhi(district.weather_condition)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span>नमी</span>
                      </div>
                      <span className="font-medium">{district.humidity?.toFixed(0)}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-green-500" />
                        <span>हवा</span>
                      </div>
                      <span className="font-medium">{district.wind_speed?.toFixed(1)} km/h</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <div className="text-xs text-muted-foreground text-center">
                      Updated: {new Date(district.last_updated).toLocaleTimeString('hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            सभी जिलों का रियल टाइम मौसम डेटा • Weather data updates every 15 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default RealTimeWeather;