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
import { useCrafts } from "@/hooks/useCrafts";
import { useWhatsAppNumbers } from "@/hooks/useWhatsAppNumbers";
import { toast } from "@/hooks/use-toast";
import { Item } from "@/types";

const Crafts = () => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { crafts, loading, error } = useCrafts();
  const { number: craftsWhatsAppNumber } = useWhatsAppNumbers("crafts");

  const [availableCategories, setAvailableCategories] = useState<
    { key: string; label: string }[]
  >([]);

  const [selectedCraft, setSelectedCraft] = useState<Item | null>(null);

  useEffect(() => {
    if (!loading && !error) {
      const uniqueCategories = Array.from(
        new Set(crafts.map((craft) => craft.category))
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
  }, [crafts, loading, error, isRTL, t]);

  const filteredCrafts =
    selectedCategory === "all"
      ? crafts
      : crafts.filter(
          (craft) =>
            craft.category &&
            craft.category.toLowerCase() === selectedCategory.toLowerCase()
        );

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
      ? `مرحباً، أود طلب ${craftName} من ${seller}`
      : `Hello, I would like to order ${craftName} from ${seller}`;
    const whatsappUrl = `https://wa.me/${craftsWhatsAppNumber}?text=${encodeURIComponent(
      message
    )}`;
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
          {t("nav.crafts")}
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

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrafts.map((craft) => (
            <Card
              key={craft.id}
              className="product-card flex flex-col h-[450px] overflow-hidden"
            >
              <CardContent className="p-0 flex flex-col flex-1">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {craft.rating}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isRTL ? "arabic-text text-right" : ""
                    }`}
                  >
                    {craft.name}
                  </h3>

                  <p
                    className={`text-sm text-muted-foreground line-clamp-1 text-center ${
                      isRTL ? "arabic-text" : ""
                    }`}
                  >
                    {craft.firstDescription}
                  </p>
                  {craft.secondDescription && (
                    <p
                      className={`text-sm text-muted-foreground line-clamp-1 text-center ${
                        isRTL ? "arabic-text" : ""
                      }`}
                    >
                      {craft.secondDescription}
                    </p>
                  )}

                  {/* Read More */}
                  <div
                    className={`flex justify-end mb-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <button
                      onClick={() => setSelectedCraft(craft)}
                      className="text-sm text-brown-600 hover:text-brown-800 hover:underline"
                    >
                      {isRTL ? "اقرأ المزيد" : "Read more"}
                    </button>
                  </div>

                  {/* Price + Seller */}
                  <div
                    className={`flex items-center justify-between mb-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-lg font-bold text-primary">
                      {craft.priceValue} {craft.priceCurrency}
                    </span>
                    {craft.seller && (
                      <span
                        className={`text-sm text-muted-foreground ${
                          isRTL ? "arabic-text" : ""
                        }`}
                      >
                        {isRTL ? "بواسطة:" : "by"} {craft.seller}
                      </span>
                    )}
                  </div>

                  {/* Order Button */}
                  <Button
                    className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleWhatsAppOrder(craft.name, craft.seller)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span className={isRTL ? "arabic-text" : ""}>
                      {isRTL ? "استفسر عبر واتساب" : "Inquire via WhatsApp"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialog for craft details */}
      <Dialog
        open={!!selectedCraft}
        onOpenChange={() => setSelectedCraft(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedCraft && (
            <>
              <DialogHeader className="mb-0">
                <DialogTitle
                  className={`text-xl font-bold ${
                    isRTL ? "arabic-text text-right" : ""
                  }`}
                >
                  {selectedCraft.name}
                </DialogTitle>
              </DialogHeader>
              <img
                src={selectedCraft.image}
                alt={selectedCraft.name}
                className="w-full h-64 object-cover rounded-lg mb-0"
              />
              <p
                className={`text-sm text-muted-foreground mb-0 text-center ${
                  isRTL ? "arabic-text" : ""
                }`}
              >
                {selectedCraft.firstDescription}
              </p>
              {selectedCraft.secondDescription && (
                <p
                  className={`text-sm text-muted-foreground mb-0 text-center ${
                    isRTL ? "arabic-text" : ""
                  }`}
                >
                  {selectedCraft.secondDescription}
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-0">
                <strong>{isRTL ? "التصنيف:" : "Category:"}</strong>{" "}
                {selectedCraft.category}
              </p>
              <p className="text-sm text-muted-foreground mb-0">
                <strong>{isRTL ? "التقييم:" : "Rating:"}</strong>{" "}
                {selectedCraft.rating}
              </p>
              {selectedCraft.seller && (
                <p className="text-sm text-muted-foreground mb-0">
                  <strong>{isRTL ? "بواسطة:" : "By:"}</strong>{" "}
                  {selectedCraft.seller}
                </p>
              )}
              <p className="text-lg font-bold text-primary mb-0">
                {selectedCraft.priceValue} {selectedCraft.priceCurrency}
              </p>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() =>
                  handleWhatsAppOrder(selectedCraft.name, selectedCraft.seller)
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className={isRTL ? "arabic-text" : ""}>
                  {t("craft.order")}
                </span>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crafts;
