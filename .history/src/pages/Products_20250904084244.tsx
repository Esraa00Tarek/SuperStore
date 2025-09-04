import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Star } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useWhatsAppNumbers } from "@/hooks/useWhatsAppNumbers";
import { toast } from "@/hooks/use-toast";
import { Item } from "@/types";

const Products = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { products, loading, error } = useProducts();
  const { number: productsWhatsAppNumber } = useWhatsAppNumbers("products");

  const [availableCategories, setAvailableCategories] = useState<
    { key: string; label: string }[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);

  useEffect(() => {
    if (!loading && !error) {
      const uniqueCategories = Array.from(
        new Set(products.map((product) => product.category))
      );
      const categoryOptions = uniqueCategories.map((category) => ({
        key: category?.toLowerCase(),
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
    if (!productsWhatsAppNumber) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL
          ? "لم يتم تعيين رقم واتساب للمنتجات. يرجى المحاولة لاحقاً."
          : "WhatsApp number for products is not set. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const message = isRTL
      ? `مرحباً، أود طلب ${productName} من ${seller}`
      : `Hello, I would like to order ${productName} from ${seller}`;
    const whatsappUrl = `https://wa.me/${productsWhatsAppNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8 ${
            isRTL ? "arabic-text" : ""
          }`}
        >
          {t("nav.products")}
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-3xl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={() => setSelectedProduct(product)}
            >
              <CardContent className="p-0 flex flex-col flex-1">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {product.rating}
                  </Badge>
                </div>
                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isRTL ? "arabic-text text-right" : ""
                    }`}
                  >
                    {product.name}
                  </h3>
                  <div className="min-h-[48px] flex flex-col justify-center">
                    <p
                      className={`text-sm text-muted-foreground line-clamp-1 text-center ${
                        isRTL ? "arabic-text" : ""
                      }`}
                    >
                      {product.description || " "}
                    </p>
                    <p
                      className={`text-sm text-muted-foreground line-clamp-1 text-center ${
                        isRTL ? "arabic-text" : ""
                      }`}
                    >
                      {product.secondDescription || " "}
                    </p>
                  </div>
                  {/* Price + Seller */}
                  <div
                    className={`flex items-center justify-between mb-4 ${
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
                  <div className="mt-auto">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppOrder(product.name, product.seller);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span className={isRTL ? "arabic-text" : ""}>
                        {t("product.order")}
                      </span>
                    </Button>
                  </div>
                </div>
                {/* Hover Overlay covers the whole card */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                    {isRTL ? "عرض التفاصيل" : "View Details"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog for product details */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          {selectedProduct && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className={`text-2xl font-bold text-primary ${isRTL ? "arabic-text text-right" : "text-left"}`}>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              {/* Image */}
              <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Details */}
              <div className="space-y-4">
                <div>
                  <p className={`text-muted-foreground leading-relaxed ${isRTL ? "arabic-text text-right" : "text-left"}`}>{selectedProduct.description}</p>
                  {selectedProduct.secondDescription && (
                    <p className={`text-muted-foreground leading-relaxed mt-2 ${isRTL ? "arabic-text text-right" : "text-left"}`}>{selectedProduct.secondDescription}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{isRTL ? "التصنيف:" : "Category:"}</span>
                      <Badge variant="outline" className="border-primary text-primary">{selectedProduct.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{isRTL ? "التقييم:" : "Rating:"}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{selectedProduct.rating}</span>
                      </div>
                    </div>
                    {selectedProduct.seller && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{isRTL ? "البائع:" : "Seller:"}</span>
                        <span className={`text-gray-600 ${isRTL ? "arabic-text" : ""}`}>{selectedProduct.seller}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-primary mb-2">{selectedProduct.priceValue} {selectedProduct.priceCurrency}</div>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => handleWhatsAppOrder(selectedProduct.name, selectedProduct.seller)}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span className={isRTL ? "arabic-text" : ""}>{t("product.order")}</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
