import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star, Heart } from "lucide-react";
import { useCrafts } from '@/hooks/useCrafts';
import { Item } from "@/types";
import { useWhatsAppNumbers } from "@/hooks/useWhatsAppNumbers";
import { toast } from "@/hooks/use-toast";

const Crafts = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { crafts, loading, error } = useCrafts();
  const [availableCategories, setAvailableCategories] = useState<{key: string, label: string}[]>([]);
  const [selectedCraft, setSelectedCraft] = useState<Item | null>(null);
  const { number: craftsWhatsAppNumber } = useWhatsAppNumbers("crafts");

  useEffect(() => {
    if (!loading && !error) {
      const uniqueCategories = Array.from(new Set(crafts.map(craft => craft.category)));
      const categoryOptions = uniqueCategories.map(category => ({
        key: category?.toLowerCase(),
        label: isRTL ? t(`categories.${category}`) || category : category
      }));

      setAvailableCategories([
        { key: 'all', label: isRTL ? 'الكل' : 'All' },
        ...categoryOptions
      ]);
    }
  }, [crafts, loading, error, isRTL, t]);

  const filteredCrafts = selectedCategory === 'all' 
    ? crafts 
    : crafts.filter(craft => craft.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleWhatsAppOrder = (craftName: string, seller: string) => {
    if (!craftsWhatsAppNumber) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL
          ? "لم يتم تعيين رقم واتساب للحرف اليدوية. يرجى المحاولة لاحقاً."
          : "WhatsApp number for crafts is not set. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const message = isRTL
      ? `مرحباً، أود الاستفسار عن ${craftName} من ${seller}`
      : `Hello, I would like to inquire about ${craftName} from ${seller}`;
    const whatsappUrl = `https://wa.me/${craftsWhatsAppNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'arabic-text' : ''}`}>
            {t('nav.crafts')}
          </h1>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL 
              ? 'اكتشف المنتجات اليدوية الرائعة المصنوعة بحب وإتقان من قبل النساء المبدعات في مجتمعنا'
              : 'Discover beautiful handmade products crafted with love and skill by creative women in our community'
            }
          </p>
        </div>

        {/* Filter by category */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
            {availableCategories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.key)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrafts.map((craft) => (
            <Card key={craft.id} className="product-card overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={craft.image} 
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      {craft.rating}
                    </Badge>
                    <Badge variant="secondary" className="bg-soft-pink text-soft-pink-foreground">
                      {craft.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white/90 p-2"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'arabic-text text-right' : ''}`}>
                    {craft.name}
                  </h3>
                  <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'arabic-text text-right' : ''}`}>
                    {craft.description}
                  </p>
                  {craft.secondDescription && (
                    <p className={`text-sm text-muted-foreground mb-3 ${isRTL ? 'arabic-text text-right' : ''}`}>
                      {craft.secondDescription}
                    </p>
                  )}
                  
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-lg font-bold text-primary">
                      {craft.priceValue} {craft.priceCurrency}
                    </span>
                    <span className={`text-sm text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                      {isRTL ? 'صنع بواسطة:' : 'Made by'} {craft.seller}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleWhatsAppOrder(craft.name, craft.seller)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span className={isRTL ? 'arabic-text' : ''}>
                      {isRTL ? 'استفسر عبر واتساب' : 'Inquire via WhatsApp'}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-soft-pink to-warm-beige rounded-2xl">
          <h2 className={`text-2xl font-bold mb-4 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL ? 'هل لديك منتجات يدوية؟' : 'Do you have handmade products?'}
          </h2>
          <p className={`text-muted-foreground mb-6 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL 
              ? 'انضمي إلى مجتمعنا وابدئي في بيع منتجاتك اليدوية الرائعة'
              : 'Join our community and start selling your amazing handmade products'
            }
          </p>
          <Button className="btn-warm">
            <span className={isRTL ? 'arabic-text' : ''}>
              {isRTL ? 'ابدئي الآن' : 'Get Started'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Crafts;