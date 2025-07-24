import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeatherSection from "@/components/WeatherSection";
import LanguageSection from "@/components/LanguageSection";
import CultureSection from "@/components/CultureSection";
import NewsSection from "@/components/NewsSection";
import PoetrySection from "@/components/PoetrySection";
import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WeatherSection />
      <LanguageSection />
      <CultureSection />
      <NewsSection />
      <PoetrySection />
      <AIAssistant />
    </div>
  );
};

export default Index;
