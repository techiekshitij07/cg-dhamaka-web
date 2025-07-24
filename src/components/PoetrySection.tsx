import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, BookOpen, User } from "lucide-react";
import { useState } from "react";

const PoetrySection = () => {
  const [selectedPoetry, setSelectedPoetry] = useState(0);

  const poems = [
    {
      title: "मोर छत्तीसगढ़",
      poet: "पंडित लोचन प्रसाद पांडेय",
      content: [
        "हरा भरा हे मोर देश",
        "छत्तीसगढ़ के नाम",
        "धान के कटोरा कहिथें",
        "एला सब ठुक जाने।",
        "",
        "नदी नाला, पर्वत डोंगरी",
        "हरे भरे जंगल",
        "सोना चांदी, हीरा मोती",
        "सबले भरे हे एमा।"
      ],
      category: "देश प्रेम",
      likes: 245
    },
    {
      title: "सुगरी माटी",
      poet: "हरि ठाकुर",
      content: [
        "एसो माटी कहाँ मिलही",
        "जइसन हमर छत्तीसगढ़",
        "सोना उगले, धान फसले",
        "हरियाली भरपूर।",
        "",
        "गोदना ले सजे हे नारी",
        "करमा गीत गावै",
        "पंथी नाचे, ढोल बाजे",
        "खुशी के लहर आवै।"
      ],
      category: "माटी प्रेम",
      likes: 189
    },
    {
      title: "हमर भाषा",
      poet: "कुंज बिहारी चौबे",
      content: [
        "छत्तीसगढ़ी हमर भाषा",
        "मीठे लागे कान",
        "दादी नानी के कहिनी",
        "मन मं बसे जान।",
        "",
        "ददा कहिथे, दीदी बोले",
        "प्रेम भरे बात",
        "एकर सुगंध फैले जग मं",
        "दिन अउ रात।"
      ],
      category: "भाषा प्रेम",
      likes: 156
    }
  ];

  const categories = ["सब", "देश प्रेम", "माटी प्रेम", "भाषा प्रेम", "त्यौहार", "प्रकृति"];

  return (
    <section id="poetry" className="py-16 bg-gradient-warm">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">छत्तीसगढ़ी कविता</h2>
          <p className="text-lg text-muted-foreground">हमर भाषा के मिठास अउ कविता के सुगंध</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={index === 0 ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Poetry List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  कविता संग्रह
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {poems.map((poem, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPoetry === index 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => setSelectedPoetry(index)}
                  >
                    <h4 className="font-semibold">{poem.title}</h4>
                    <p className="text-sm opacity-75">{poem.poet}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-background/20 px-2 py-1 rounded">
                        {poem.category}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {poem.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Selected Poetry Display */}
          <div className="lg:col-span-2">
            <Card className="shadow-warm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{poems[selectedPoetry].title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{poems[selectedPoetry].poet}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      {poems[selectedPoetry].likes}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <div className="space-y-2 text-lg leading-relaxed">
                    {poems[selectedPoetry].content.map((line, index) => (
                      <p key={index} className={line === "" ? "py-2" : "text-foreground"}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    श्रेणी: {poems[selectedPoetry].category}
                  </span>
                  <Button>
                    अउ कविता पढ़व
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-cultural text-card-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">अपन कविता भेजव</h3>
              <p className="mb-6">
                छत्तीसगढ़ी भाषा मं लिखे अपन कविता हमरे साथ साझा करव। 
                हम एला हमर वेबसाइट मं प्रकाशित करबो।
              </p>
              <Button variant="secondary" size="lg">
                कविता भेजव
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PoetrySection;