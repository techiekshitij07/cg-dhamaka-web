import { Button } from "@/components/ui/button";
import heroImage from "@/assets/cg-hero.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="छत्तीसगढ़ की संस्कृति" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            छत्तीसगढ़
            <span className="block text-primary">दर्शन</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            हमर छत्तीसगढ़ के संस्कृति, भाषा, समाचार अउ कविता के साथ जुड़व।
            मौसम ले लेके सब जानकारी एक ठउर मिलही।
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-hero hover:opacity-90 text-primary-foreground shadow-cultural text-lg px-8 py-6"
            >
              छत्तीसगढ़ जानव
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6"
            >
              मौसम देखव
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;