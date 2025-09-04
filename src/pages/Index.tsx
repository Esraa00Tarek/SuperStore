import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChefHat, Utensils, Cake, Sparkles, Heart, ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import cookedMealsImage from "@/assets/cooked-meals.jpg";
import pastriesImage from "@/assets/pastries.jpg";
import sweetsImage from "@/assets/sweets.jpg";
import handmadeCraftsImage from "@/assets/handmade-crafts.jpg";

interface CategoryItem {
  key: string;
  label?: string;
  image: string;
  icon: LucideIcon;
  path: string;
  color: string;
  type: 'products' | 'crafts';
}

const Index = () => {
  const { t, isRTL } = useLanguage();
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      key: 'categories.meals',
      image: cookedMealsImage,
      icon: Utensils,
      path: '/products?category=meals',
      color: 'from-orange-100 to-orange-200',
      type: 'products'
    },
    {
      key: 'categories.pastries',
      image: pastriesImage,
      icon: ChefHat,
      path: '/products?category=pastries',
      color: 'from-amber-100 to-amber-200',
      type: 'products'
    },
    {
      key: 'categories.sweets',
      image: sweetsImage,
      icon: Cake,
      path: '/products?category=sweets',
      color: 'from-pink-100 to-pink-200',
      type: 'products'
    },
    {
      key: 'categories.handmade',
      image: handmadeCraftsImage,
      icon: Sparkles,
      path: '/crafts',
      color: 'from-green-100 to-green-200',
      type: 'crafts'
    }
  ]);

  // Load custom categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      // Load product categories
      const storedProductCategories = localStorage.getItem('productsCategories');
      const storedCraftCategories = localStorage.getItem('craftsCategories');

      const newCategories = [...categories];
      
      // Add custom product categories
      if (storedProductCategories) {
        const productCategories = JSON.parse(storedProductCategories);
        productCategories.forEach((cat: string) => {
          if (!categories.some(c => c.key === `categories.${cat}`)) {
            newCategories.push({
              key: `categories.${cat}`,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              image: cookedMealsImage, // Default image
              icon: ShoppingBag,
              path: `/products?category=${cat}`,
              color: 'from-blue-100 to-blue-200',
              type: 'products'
            });
          }
        });
      }

      // Add custom craft categories
      if (storedCraftCategories) {
        const craftCategories = JSON.parse(storedCraftCategories);
        craftCategories.forEach((cat: string) => {
          if (!categories.some(c => c.key === `categories.${cat}`)) {
            newCategories.push({
              key: `categories.${cat}`,
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              image: handmadeCraftsImage, // Default image
              icon: ShoppingBag,
              path: `/crafts?category=${cat}`,
              color: 'from-purple-100 to-purple-200',
              type: 'crafts'
            });
          }
        });
      }

      setCategories(newCategories);
    };

    // Load categories on mount
    loadCategories();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCategories();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isRTL]);

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
            {categories.map((category) => {
              const IconComponent = category.icon;
              const displayLabel = category.label || t(category.key);
              return (
                <Link key={category.key} to={category.path}>
                  <Card className="category-card group hover:scale-105 transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img 
                          src={category.image} 
                          alt={displayLabel}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`}></div>
                      </div>
                      <div className="p-6 text-center">
                        <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className={`text-lg font-semibold ${isRTL ? 'arabic-text' : ''}`}>
                          {displayLabel}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
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
