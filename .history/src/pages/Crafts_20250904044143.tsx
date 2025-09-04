import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star, Heart } from "lucide-react";
import { useCrafts } from '@/hooks/useCrafts';

const Crafts = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { crafts, loading, error } = useCrafts();
  const [availableCategories, setAvailableCategories] = useState<{key: string, label: string}[]>([
    { key: 'all', label: isRTL ? 'الكل' : 'All' },
    { key: 'embroidery', label: isRTL ? 'تطريز' : 'Embroidery' },
    { key: 'jewelry', label: isRTL ? 'مجوهرات' : 'Jewelry' },
    { key: 'textiles', label: isRTL ? 'منسوجات' : 'Textiles' },
    { key: 'pottery', label: isRTL ? 'فخار' : 'Pottery' },
    { key: 'woodwork', label: isRTL ? 'أعمال خشبية' : 'Woodwork' },
    { key: 'leather', label: isRTL ? 'جلديات' : 'Leatherwork' }
  ]);

  useEffect(() => {
    if (!loading && !error) {
      const uniqueCategories = Array.from(new Set(crafts.map(craft => craft.category)));
      const categoryOptions = uniqueCategories.map(category => ({
        key: category.toLowerCase(),
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
    const message = isRTL 
      ? `مرحباً، أود الاستفسار عن ${craftName} من ${seller}`
      : `Hello, I would like to inquire about ${craftName} from ${seller}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            <Card key={craft.id} className="w-72 h-96 flex flex-col justify-between">
              <img
                src={craft.image}
                alt={craft.name}
                className="h-48 w-full object-cover rounded-t-md"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{craft.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {craft.description.slice(0, 50)}...
                </p>
                <Button
                  onClick={() => navigate(`/crafts/${craft.id}`)}
                  className="mt-auto w-full"
                >
                  {isRTL ? 'اقرأ المزيد' : 'Read More'}
                </Button>
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