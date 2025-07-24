import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from "lucide-react";
import { useState, useEffect } from "react";

const WeatherSection = () => {
  const [weather, setWeather] = useState({
    city: "रायपुर",
    temperature: 28,
    condition: "धूप वाला",
    humidity: 65,
    windSpeed: 12,
    icon: "sun"
  });

  const weatherIcons = {
    sun: <Sun className="w-8 h-8 text-accent" />,
    cloud: <Cloud className="w-8 h-8 text-muted-foreground" />,
    rain: <CloudRain className="w-8 h-8 text-primary" />
  };

  const cities = [
    { name: "रायपुर", temp: 28, condition: "धूप वाला", icon: "sun" },
    { name: "भिलाई", temp: 26, condition: "बदली", icon: "cloud" },
    { name: "दुर्ग", temp: 27, condition: "हल्का बारिश", icon: "rain" },
    { name: "बिलासपुर", temp: 29, condition: "धूप वाला", icon: "sun" },
  ];

  return (
    <section id="weather" className="py-16 bg-gradient-warm">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">मौसम जानकारी</h2>
          <p className="text-lg text-muted-foreground">छत्तीसगढ़ के मुख्य शहरन के मौसम</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cities.map((city, index) => (
            <Card key={index} className="hover:shadow-warm transition-all duration-300 cursor-pointer"
                  onClick={() => setWeather({...weather, ...city})}>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{city.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-2">
                  {weatherIcons[city.icon as keyof typeof weatherIcons]}
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{city.temp}°C</div>
                <div className="text-sm text-muted-foreground">{city.condition}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Weather Display */}
        <Card className="max-w-4xl mx-auto shadow-cultural">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-foreground mb-2">{weather.city}</h3>
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  {weatherIcons[weather.icon as keyof typeof weatherIcons]}
                  <span className="text-5xl font-bold text-primary">{weather.temperature}°C</span>
                </div>
                <p className="text-xl text-muted-foreground">{weather.condition}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Droplets className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">नमी</div>
                    <div className="text-lg font-semibold">{weather.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Wind className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">हवा</div>
                    <div className="text-lg font-semibold">{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WeatherSection;