import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const NewsSection = () => {
  const news = [
    {
      title: "छत्तीसगढ़ मं नवा धान खरीदी केंद्र खुलिस",
      summary: "राज्य सरकार ह 50 नवा धान खरीदी केंद्र खोले हे। किसानन ल अब अउ सुविधा मिलही।",
      category: "कृषि",
      time: "2 घंटा पहिले",
      date: "आज"
    },
    {
      title: "रायपुर मं बढ़िस स्मार्ट सिटी के काम",
      summary: "रायपुर स्मार्ट सिटी प्रोजेक्ट के तहत नवा सड़क अउ बिजली के काम तेज हो गे हे।",
      category: "विकास",
      time: "4 घंटा पहिले",
      date: "आज"
    },
    {
      title: "छत्तीसगढ़ के जनजातीय कलाकारन ल मिलिस राष्ट्रीय पुरस्कार",
      summary: "दुर्ग जिला के 3 जनजातीय कलाकारन ल दिल्ली मं राष्ट्रीय पुरस्कार दे गे हे।",
      category: "कला",
      time: "6 घंटा पहिले",
      date: "आज"
    },
    {
      title: "बिलासपुर मं हरेली त्यौहार के तैयारी शुरू",
      summary: "हरेली त्यौहार खातिर बिलासपुर मं रंगबिरंगी तैयारी चालू हो गे हे।",
      category: "त्यौहार",
      time: "8 घंटा पहिले",
      date: "कल"
    }
  ];

  const categories = ["सब", "कृषि", "विकास", "कला", "त्यौहार", "राजनीति", "खेल"];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "कृषि": "bg-secondary text-secondary-foreground",
      "विकास": "bg-primary text-primary-foreground",
      "कला": "bg-accent text-accent-foreground",
      "त्यौहार": "bg-primary text-primary-foreground",
      "राजनीति": "bg-muted text-muted-foreground",
      "खेल": "bg-secondary text-secondary-foreground"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <section id="news" className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">ताजा समाचार</h2>
          <p className="text-lg text-muted-foreground">छत्तीसगढ़ के नवा खबर अउ घटना</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "सब" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {news.map((article, index) => (
            <Card key={index} className="hover:shadow-warm transition-all duration-300 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(article.category)}>
                    {article.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.time}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.date}
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    पढ़व <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breaking News Ticker */}
        <Card className="bg-gradient-hero text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-4 animate-pulse">
                तुरंत खबर
              </Badge>
              <p className="text-sm">
                छत्तीसगढ़ मं आज बारिश के संभावना। किसानन ल सलाह दे गे हे कि अपन फसल के सुरक्षा करव।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsSection;