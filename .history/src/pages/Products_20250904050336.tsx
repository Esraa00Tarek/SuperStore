import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star } from "lucide-react";
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [availableCategories, setAvailableCategories] = useState<{key: string, label: string}[]>([
    { key: 'all', label: isRTL ? 'الكل' : 'All' },
  ]);

  useEffect(() => {
    if (!loading && !error) {
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
            <Card key={product.id} className="product-card overflow-hidden">
              <CardContent className="p-0 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {product.rating}
                  </Badge>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${isRTL ? 'arabic-text text-right' : ''}`}>
                    {product.name}
                  </h3>
                  
                  {/* Preview first line of description */}
                  <p className={`text-sm text-muted-foreground mb-1 ${isRTL ? 'arabic-text text-right' : ''} line-clamp-1`}>
                    {product.description}
                  </p>

                  {/* Preview first line of secondDescription */}
                  {product.secondDescription && (
                    <p className={`text-sm text-muted-foreground mb-2 ${isRTL ? 'arabic-text text-right' : ''} line-clamp-1`}>
                      {product.secondDescription}
                    </p>
                  )}

                  {/* Read more button aligned right */}
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {isRTL ? 'اقرأ المزيد' : 'Read more'}
                    </Button>
                  </div>

                  <div className={`flex items-center justify-between mb-4 mt-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-lg font-bold text-primary">
                      {product.priceValue} {product.priceCurrency}
                    </span>
                    {product.seller && (
                      <span className={`text-sm text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                        {isRTL ? 'بواسطة:' : 'by'} {product.seller}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                    onClick={() => handleWhatsAppOrder(product.name, product.seller)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span className={isRTL ? 'arabic-text' : ''}>
                      {t('product.order')}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog for full product view */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className={`text-2xl font-bold ${isRTL ? 'arabic-text text-right' : ''}`}>
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xl font-bold text-primary">
                    {selectedProduct.priceValue} {selectedProduct.priceCurrency}
                  </span>
                  {selectedProduct.seller && (
                    <span className={`text-sm text-muted-foreground ${isRTL ? 'arabic-text' : ''}`}>
                      {isRTL ? 'بواسطة:' : 'by'} {selectedProduct.seller}
                    </span>
                  )}
                </div>

                <p className={`text-base text-muted-foreground ${isRTL ? 'arabic-text text-right' : ''}`}>
                  {selectedProduct.description}
                </p>
                {selectedProduct.secondDescription && (
                  <p className={`text-base text-muted-foreground ${isRTL ? 'arabic-text text-right' : ''}`}>
                    {selectedProduct.secondDescription}
                  </p>
                )}

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleWhatsAppOrder(selectedProduct.name, selectedProduct.seller)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className={isRTL ? 'arabic-text' : ''}>
                    {t('product.order')}
                  </span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
