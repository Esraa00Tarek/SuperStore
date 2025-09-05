import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Package, Sparkles, Heart, ChefHat } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import trendingProductsImage from "@/assets/trending-products.webp";
import handmadeCraftsImage from "@/assets/handmade-crafts.jpg";
import { useCategories } from "@/hooks/useCategories";

interface CategoryItem {
  id: string;
  name: string;
  type: 'products' | 'crafts';
  image: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

const Index = () => {
  const { t, isRTL } = useLanguage();
  const { categories: productCategories, loading: productsLoading } = useCategories('products');
  const { categories: craftCategories, loading: craftsLoading } = useCategories('crafts');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Map category types to their respective images and icons
  const categoryTypeConfig = {
    products: {
      image: trendingProductsImage,
      icon: Package,
      pathPrefix: '/products?category=',
      color: 'from-blue-100 to-blue-200'
    },
    crafts: {
      image: handmadeCraftsImage,
      icon: Sparkles,
      pathPrefix: '/crafts?category=',
      color: 'from-purple-100 to-purple-200'
    }
  };

  // Combine and format categories when loaded
  useEffect(() => {
    if (!productsLoading && !craftsLoading) {
      const formattedCategories = [
        ...productCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          type: 'products' as const,
          image: categoryTypeConfig.products.image,
          icon: categoryTypeConfig.products.icon,
          path: `${categoryTypeConfig.products.pathPrefix}${encodeURIComponent(cat.name)}`,
          color: categoryTypeConfig.products.color
        })),
        ...craftCategories.map(cat => ({
          id: cat.id,
          name: cat.name,
          type: 'crafts' as const,
          image: categoryTypeConfig.crafts.image,
          icon: categoryTypeConfig.crafts.icon,
          path: `${categoryTypeConfig.crafts.pathPrefix}${encodeURIComponent(cat.name)}`,
          color: categoryTypeConfig.crafts.color
        }))
      ];
      
      setCategories(formattedCategories);
      setLoading(false);
    }
  }, [productCategories, craftCategories, productsLoading, craftsLoading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isRTL ? 'arabic-text' : ''}`}>
            {t('hero.title')}
          </h1>
          <p className={`text-lg md:text-xl mb-8 opacity-90 ${isRTL ? 'arabic-text' : ''}`}>
            {t('hero.subtitle')}
          </p>
          <Link to="/products">
            <Button size="lg" className={`btn-warm text-lg px-8 py-4 ${isRTL ? 'arabic-text' : ''}`}>
              {t('hero.cta')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isRTL ? 'arabic-text' : ''}`}>
            {t('categories.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link key={category.id} to={category.path}>
                    <Card className="category-card group hover:scale-105 transition-all duration-300 h-full">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden rounded-t-2xl">
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`}></div>
                        </div>
                        <div className="p-6 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <IconComponent className="h-10 w-10 text-primary" />
                            <h3 className={`text-lg font-semibold ${isRTL ? 'arabic-text' : ''}`}>
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No categories found. Please add some categories from the admin panel.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-cream to-soft-pink">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${isRTL ? 'arabic-text' : ''}`}>
            {t('mission.title')}
          </h2>
          <p className={`text-lg leading-relaxed text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
            {t('mission.text')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-6 w-6" />
            <span className={`text-lg font-semibold ${isRTL ? 'arabic-text' : ''}`}>
              {isRTL ? 'مطبخنا' : 'Our Kitchen'}
            </span>
          </div>
          <p className={`text-sm opacity-80 ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL ? 'منصة مجتمعية لتمكين النساء' : 'A community platform empowering women'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
