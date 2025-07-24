import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Volume2, Users, Globe } from "lucide-react";

const LanguageSection = () => {
  const languageFeatures = [
    {
      title: "शब्द संग्रह",
      description: "छत्तीसगढ़ी के हजारों शब्द अउ ओकर अर्थ",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      count: "5000+ शब्द"
    },
    {
      title: "उच्चारण गाइड",
      description: "सही तरीका से छत्तीसगढ़ी बोलना सीखव",
      icon: <Volume2 className="w-6 h-6 text-secondary" />,
      count: "Audio उदाहरण"
    },
    {
      title: "व्याकरण",
      description: "छत्तीसगढ़ी भाषा के व्याकरण के नियम",
      icon: <Users className="w-6 h-6 text-accent" />,
      count: "Complete Guide"
    },
    {
      title: "अनुवाद",
      description: "हिंदी से छत्तीसगढ़ी अउ छत्तीसगढ़ी से हिंदी अनुवाद",
      icon: <Globe className="w-6 h-6 text-primary" />,
      count: "Instant Translation"
    }
  ];

  const commonPhrases = [
    { cg: "का हाल हे?", hindi: "क्या हाल है?", english: "How are you?" },
    { cg: "बहुत बढ़िया", hindi: "बहुत अच्छा", english: "Very good" },
    { cg: "धन्यवाद", hindi: "धन्यवाद", english: "Thank you" },
    { cg: "माफ करव", hindi: "माफ करें", english: "Sorry" },
    { cg: "फेर मिलबो", hindi: "फिर मिलेंगे", english: "See you again" },
    { cg: "का करत हव?", hindi: "क्या कर रहे हो?", english: "What are you doing?" }
  ];

  const wordOfTheDay = {
    word: "सुग्घर",
    meaning: "सुंदर, अच्छा",
    example: "ए गाँव बहुत सुग्घर हे।",
    pronunciation: "सुग्-घर"
  };

  return (
    <section id="language" className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">छत्तीसगढ़ी भाषा</h2>
          <p className="text-lg text-muted-foreground">हमर मातृभाषा के सीखव अउ समझव</p>
        </div>

        {/* Language Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {languageFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-warm transition-all duration-300 text-center">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge variant="secondary" className="mx-auto">
                  {feature.count}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  खोलव
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word of the Day */}
          <Card className="shadow-cultural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                आज के शब्द
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-gradient-warm rounded-lg">
                <h3 className="text-3xl font-bold text-foreground mb-2">{wordOfTheDay.word}</h3>
                <p className="text-sm text-muted-foreground mb-1">उच्चारण: {wordOfTheDay.pronunciation}</p>
                <p className="text-lg text-primary mb-4">{wordOfTheDay.meaning}</p>
                <div className="bg-background/50 p-3 rounded">
                  <p className="text-sm font-medium">उदाहरण:</p>
                  <p className="italic">"{wordOfTheDay.example}"</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Volume2 className="w-4 h-4 mr-2" />
                  सुनव
                </Button>
                <Button className="flex-1">
                  अउ शब्द देखव
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Common Phrases */}
          <Card className="shadow-cultural">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                रोजमर्रा के वाक्य
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {commonPhrases.map((phrase, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="font-semibold text-primary mb-1">{phrase.cg}</div>
                    <div className="text-sm text-muted-foreground">{phrase.hindi}</div>
                    <div className="text-xs text-muted-foreground italic">{phrase.english}</div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">
                अउ वाक्य देखव
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Language Learning Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-3xl mx-auto bg-gradient-cultural text-card-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">छत्तीसगढ़ी भाषा सीखव</h3>
              <p className="mb-6">
                हमर सुग्घर छत्तीसगढ़ी भाषा ल आसान तरीका से सीखव। 
                AI Assistant के सहायता से practice करव अउ धीरे-धीरे expert बनव।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Basic Course शुरू करव
                </Button>
                <Button variant="outline" size="lg" className="border-card-foreground text-card-foreground hover:bg-card-foreground hover:text-background">
                  AI के साथ Practice करव
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LanguageSection;