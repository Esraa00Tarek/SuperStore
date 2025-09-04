import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const Products = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { products, loading, error } = useProducts();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const [availableCategories, setAvailableCategories] = useState<
    { key: string; label: string }[]
  >([{ key: "all", label: isRTL ? "الكل" : "All" }]);

  useEffect(() => {
    if (!loading && !error) {
      const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category))
      );
      const categoryOptions = uniqueCategories.map((category) => ({
        key: category.toLowerCase(),
        label: isRTL ? t(`categories.${category}`) || category : category,
      }));

      setAvailableCategories([
        { key: "all", label: isRTL ? "الكل" : "All" },
        ...categoryOptions,
      ]);
    }
  }, [products, loading, error, isRTL, t]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleWhatsAppOrder = (productName: string, seller: string) => {
    const message = isRTL
      ? `مرحباً، أود طلب ${productName} من ${seller}`
      : `Hello, I would like to order ${productName} from ${seller}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1
          className={`text-3xl md:text-4xl font-bold text-center mb-8 ${
            isRTL ? "arabic-text" : ""
          }`}
        >
          {t("nav.products")}
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
            {availableCategories.map((category) => (
              <Button
                key={category.key}
                variant={
                  selectedCategory === category.key ? "default" : "outline"
                }
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
          {filteredProducts.map((product) => {
            const isExpanded = expandedCard === product.id;

            return (
              <Card
                key={product.id}
                className={`product-card flex flex-col overflow-hidden transition-all ${
                  isExpanded ? "max-h-full" : "max-h-[500px]"
                }`}
              >
                <CardContent className="flex flex-col flex-1 p-0">
                  {/* Image + rating */}
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

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        isRTL ? "arabic-text text-right" : ""
                      }`}
                    >
                      {product.name}
                    </h3>

                    <div
                      className={`text-sm text-muted-foreground mb-3 ${
                        isRTL ? "arabic-text text-right" : ""
                      } ${!isExpanded ? "line-clamp-2" : ""}`}
                    >
                      {product.description}
                    </div>

                    {/* Read more / collapse */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start mb-3"
                      onClick={() =>
                        setExpandedCard(isExpanded ? null : product.id)
                      }
                    >
                      {isExpanded
                        ? isRTL
                          ? "إخفاء"
                          : "Read less"
                        : isRTL
                        ? "اقرأ المزيد"
                        : "Read more"}
                    </Button>

                    {/* Price + Seller */}
                    <div
                      className={`flex items-center justify-between mb-4 mt-auto ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-lg font-bold text-primary">
                        {product.priceValue} {product.priceCurrency}
                      </span>
                      {product.seller && (
                        <span
                          className={`text-sm text-muted-foreground ${
                            isRTL ? "arabic-text" : ""
                          }`}
                        >
                          {isRTL ? "بواسطة:" : "by"} {product.seller}
                        </span>
                      )}
                    </div>

                    {/* WhatsApp Button (fixed at bottom) */}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                      onClick={() =>
                        handleWhatsAppOrder(product.name, product.seller)
                      }
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span className={isRTL ? "arabic-text" : ""}>
                        {t("product.order")}
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
