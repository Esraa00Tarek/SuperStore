import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star, Heart } from "lucide-react";
import { productService } from "@/services/dataService";
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { products, loading, error } = useProducts();
  const [availableCategories, setAvailableCategories] = useState<{key: string, label: string}[]>([
    { key: 'all', label: isRTL ? 'الكل' : 'All' },
    { key: 'meals', label: isRTL ? 'وجبات' : 'Meals' },
    { key: 'sweets', label: isRTL ? 'حلويات' : 'Sweets' },
    { key: 'beverages', label: isRTL ? 'مشروبات' : 'Beverages' },
    { key: 'appetizers', label: isRTL ? 'مقبلات' : 'Appetizers' },
    { key: 'pastries', label: isRTL ? 'معجنات' : 'Pastries' }
  ]);

  // Load products and categories on component mount
  useEffect(() => {
    // const loadProducts = () => {
    //   const allProducts = productService.getAll();
    //   setProducts(allProducts);
      
    //   // Load categories from localStorage
    //   const loadCategories = () => {
    //     const storedCategories = localStorage.getItem('productsCategories');
    //     if (storedCategories) {
    //       const parsedCategories = JSON.parse(storedCategories);
          
    //       // Create category options from stored categories
    //       const categoryOptions = parsedCategories.map((category: string) => ({
    //         key: category.toLowerCase(),
    //         label: category
    //       }));
          
    //       // Always include 'All' as the first option
    //       setAvailableCategories([
    //         { key: 'all', label: isRTL ? 'الكل' : 'All' },
    //         ...categoryOptions
    //       ]);
    //     }
    //   };
      
    //   // Load initial categories
    //   loadCategories();
      
    //   // Listen for changes to categories
    //   const handleCategoryChange = (e: StorageEvent) => {
    //     if (e.key === 'productsCategories') {
    //       loadCategories();
    //     }
    //   };
      
    //   window.addEventListener('storage', handleCategoryChange);
    //   return () => window.removeEventListener('storage', handleCategoryChange);
    // };
    
    // loadProducts();
    
    // Listen for storage changes
    // const handleStorageChange = (e: StorageEvent) => {
    //   if (e.key === 'products') {
    //     loadProducts();
    //   }
    // };
    
    // window.addEventListener('storage', handleStorageChange);
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, [isRTL]);

  useEffect(() => {
    if (!loading && !error) {
      // Load categories dynamically from products
      const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
      const categoryOptions = uniqueCategories.map(category => ({
        key: category.toLowerCase(),
        label: isRTL ? t(`categories.${category}`) || category : category
      }));

      setAvailableCategories([
        { key: 'all', label: isRTL ? 'الكل' : 'All' },
        ...categoryOptions
      ]);
    }
  }, [products, loading, error, isRTL, t]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => 
        product.category && 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  const handleWhatsAppOrder = (productName: string, seller: string) => {
    const message = isRTL 
      ? `مرحباً، أود طلب ${productName} من ${seller}`
      : `Hello, I would like to order ${productName} from ${seller}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${isRTL ? 'arabic-text' : ''}`}>
          {t('nav.products')}
        </h1>

        {/* Category Filter */}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="w-72 h-96 flex flex-col justify-between">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-md"
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description.slice(0, 50)}...
                </p>
                <Button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="mt-auto w-full"
                >
                  {isRTL ? 'اقرأ المزيد' : 'Read More'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;