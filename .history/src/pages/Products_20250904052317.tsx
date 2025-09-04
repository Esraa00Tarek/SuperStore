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

const Products = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { products, loading, error } = useProducts();
  const [availableCategories, setAvailableCategories] = useState<
    { key: string; label: string }[]
  >([
    { key: "all", label: isRTL ? "الكل" : "All" },
    { key: "meals", label: isRTL ? "وجبات" : "Meals" },
    { key: "sweets", label: isRTL ? "حلويات" : "Sweets" },
    { key: "beverages", label: isRTL ? "مشروبات" : "Beverages" },
    { key: "appetizers", label: isRTL ? "مقبلات" : "Appetizers" },
    { key: "pastries", label: isRTL ? "معجنات" : "Pastries" },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

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
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="product-card flex flex-col h-[450px] overflow-hidden"
            >
              <CardContent className="p-0 flex flex-col flex-1">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
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

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      isRTL ? "arabic-text text-right" : ""
                    }`}
                  >
                    {product.name}
                  </h3>

                  <p
                    className={`text-sm text-muted-foreground line-clamp-1 ${
                      isRTL ? "arabic-text text-right" : ""
                    }`}
                  >
                    {product.description}
                  </p>
                  {product.secondDescription && (
                    <p
                      className={`text-sm text-muted-foreground line-clamp-1 ${
                        isRTL ? "arabic-text text-right" : ""
                      }`}
                    >
                      {product.secondDescription}
                    </p>
                  )}

                  {/* Read More */}
                  <div
                    className={`flex justify-end mt-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-sm text-brown-700 hover:text-brown-500"
                    >
                      {isRTL ? "اقرأ المزيد" : "Read more"}
                    </button>
                  </div>

                  {/* Price + Seller */}
                  <div
                    className={`flex items-center justify-between mt-2 ${
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

                  {/* Order Button */}
                  <Button
                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
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
          ))}
        </div>
      </div>

      {/* Dialog for product details */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle
                  className={`text-xl font-bold mb-2 ${
                    isRTL ? "arabic-text text-right" : ""
                  }`}
                >
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              <p
                className={`text-sm text-muted-foreground mb-2 ${
                  isRTL ? "arabic-text text-right" : ""
                }`}
              >
                {selectedProduct.description}
              </p>
              {selectedProduct.secondDescription && (
                <p
                  className={`text-sm text-muted-foreground mb-2 ${
                    isRTL ? "arabic-text text-right" : ""
                  }`}
                >
                  {selectedProduct.secondDescription}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-1">
                <strong>{isRTL ? "التصنيف:" : "Category:"}</strong>{" "}
                {selectedProduct.category}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>{isRTL ? "التقييم:" : "Rating:"}</strong>{" "}
                {selectedProduct.rating}
              </p>
              {selectedProduct.seller && (
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>{isRTL ? "بواسطة:" : "By:"}</strong>{" "}
                  {selectedProduct.seller}
                </p>
              )}
              <p className="text-lg font-bold text-primary mb-2">
                {selectedProduct.priceValue} {selectedProduct.priceCurrency}
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() =>
                  handleWhatsAppOrder(
                    selectedProduct.name,
                    selectedProduct.seller
                  )
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className={isRTL ? "arabic-text" : ""}>
                  {t("product.order")}
                </span>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
