import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeatherSection from "@/components/WeatherSection";
import LanguageSection from "@/components/LanguageSection";
import CultureSection from "@/components/CultureSection";
import NewsSection from "@/components/NewsSection";
import PoetrySection from "@/components/PoetrySection";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";

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
      <EnhancedAIAssistant />
    </div>
  );
};

export default Index;
