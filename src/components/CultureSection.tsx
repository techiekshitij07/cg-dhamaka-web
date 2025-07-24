import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Palette, Users, Star } from "lucide-react";

const CultureSection = () => {
  const culturalElements = [
    {
      title: "लोक नृत्य",
      description: "पंथी, राउत नाचा, करमा अउ सुआ जइसन पारंपरिक नृत्य",
      icon: <Music className="w-8 h-8 text-primary" />,
      items: ["पंथी नृत्य", "राउत नाचा", "करमा", "सुआ गीत"]
    },
    {
      title: "हस्तकला",
      description: "काष्ठकला, बेल मेटल, टेराकोटा अउ हस्तकरघा",
      icon: <Palette className="w-8 h-8 text-secondary" />,
      items: ["काष्ठकला", "बेल मेटल", "टेराकोटा", "हस्तकरघा"]
    },
    {
      title: "जनजातीय संस्कृति",
      description: "गोंड, हल्बा, कमार अउ अउर जनजाति के रीति-रिवाज",
      icon: <Users className="w-8 h-8 text-accent" />,
      items: ["गोंड कला", "हल्बा परंपरा", "कमार शिल्प", "बैगा संस्कृति"]
    },
    {
      title: "त्यौहार",
      description: "करवा चौथ, हरेली, पोला अउ देवारी के उत्सव",
      icon: <Star className="w-8 h-8 text-primary" />,
      items: ["हरेली", "पोला", "देवारी", "करवा चौथ"]
    }
  ];

  return (
    <section id="culture" className="py-16 bg-gradient-cultural">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-card-foreground mb-4">छत्तीसगढ़ की संस्कृति</h2>
          <p className="text-lg text-card-foreground/80">हमर समृद्ध परंपरा अउ कला के दर्शन</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {culturalElements.map((element, index) => (
            <Card key={index} className="hover:shadow-cultural transition-all duration-300 border-0 bg-card/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  {element.icon}
                </div>
                <CardTitle className="text-lg text-card-foreground">{element.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 text-center">{element.description}</p>
                <ul className="space-y-2">
                  {element.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-card-foreground flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Cultural Highlight */}
        <Card className="max-w-4xl mx-auto shadow-cultural bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-card-foreground mb-4">आज के सांस्कृतिक कार्यक्रम</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">पंथी नृत्य प्रदर्शन</h4>
                  <p className="text-sm text-muted-foreground">समय: शाम 6 बजे</p>
                  <p className="text-sm text-muted-foreground">स्थान: कला मंदिर, रायपुर</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">हस्तकला प्रदर्शनी</h4>
                  <p className="text-sm text-muted-foreground">समय: पूरा दिन</p>
                  <p className="text-sm text-muted-foreground">स्थान: शिल्प ग्राम</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">करमा गीत संध्या</h4>
                  <p className="text-sm text-muted-foreground">समय: रात 7 बजे</p>
                  <p className="text-sm text-muted-foreground">स्थान: सामुदायिक हॉल</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CultureSection;