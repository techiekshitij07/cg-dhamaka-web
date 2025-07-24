import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeatherSection from "@/components/WeatherSection";
import CultureSection from "@/components/CultureSection";
import NewsSection from "@/components/NewsSection";
import PoetrySection from "@/components/PoetrySection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WeatherSection />
      <CultureSection />
      <NewsSection />
      <PoetrySection />
    </div>
  );
};

export default Index;
