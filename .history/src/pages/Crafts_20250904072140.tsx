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

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">Error loading crafts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1
          className={`text-3xl md:text-4xl font-bold text-center mb-8 text-amber-900 ${
            isRTL ? "arabic-text" : ""
          }`}
        >
          {t("nav.crafts")}
        </h1>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl">
            {availableCategories.map((category) => (
              <Button
                key={category.key}
                variant={
                  selectedCategory === category.key ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-full px-6 py-2 transition-all duration-200 ${
                  selectedCategory === category.key
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                    : "border-amber-300 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrafts.map((craft) => (
            <Card
              key={craft.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
              onClick={() => setSelectedCraft(craft)}
            >
              <CardContent className="p-0">
                {/* Image Container */}
                <div className="relative w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                  <img
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg";
                    }}
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-amber-700 border-amber-200 shadow-md backdrop-blur-sm">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {craft.rating}
                    </Badge>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                      {isRTL ? "عرض التفاصيل" : "View Details"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3
                    className={`text-lg font-bold mb-3 text-gray-800 line-clamp-2 min-h-[3.5rem] leading-tight ${
                      isRTL ? "arabic-text text-right" : "text-left"
                    }`}
                  >
                    {craft.name}
                  </h3>

                  {/* Description */}
                  <div className="mb-4 min-h-[2.5rem]">
                    <p
                      className={`text-sm text-gray-600 line-clamp-2 leading-relaxed ${
                        isRTL ? "arabic-text text-right" : "text-left"
                      }`}
                    >
                      {craft.firstDescription}
                    </p>
                  </div>

                  {/* Price and Seller */}
                  <div
                    className={`flex items-center justify-between mb-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-amber-700">
                        {craft.priceValue} {craft.priceCurrency}
                      </span>
                      {craft.seller && (
                        <span
                          className={`text-xs text-gray-500 mt-1 ${
                            isRTL ? "arabic-text text-right" : "text-left"
                          }`}
                        >
                          {isRTL ? "بواسطة:" : "by"} {craft.seller}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppOrder(craft.name, craft.seller);
                    }}
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

        {/* Empty State */}
        {filteredCrafts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {isRTL ? "لا توجد حرف يدوية" : "No crafts found"}
            </h3>
            <p className="text-gray-500">
              {isRTL ? "لا توجد حرف يدوية في هذا التصنيف" : "No crafts available in this category"}
            </p>
          </div>
        )}
      </div>

      {/* Dialog for craft details */}
      <Dialog
        open={!!selectedCraft}
        onOpenChange={() => setSelectedCraft(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          {selectedCraft && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle
                  className={`text-2xl font-bold text-amber-900 ${
                    isRTL ? "arabic-text text-right" : "text-left"
                  }`}
                >
                  {selectedCraft.name}
                </DialogTitle>
              </DialogHeader>

              {/* Image */}
              <div className="w-full h-80 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden">
                <img
                  src={selectedCraft.image}
                  alt={selectedCraft.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg";
                  }}
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p
                    className={`text-gray-700 leading-relaxed ${
                      isRTL ? "arabic-text text-right" : "text-left"
                    }`}
                  >
                    {selectedCraft.firstDescription}
                  </p>
                  {selectedCraft.secondDescription && (
                    <p
                      className={`text-gray-700 leading-relaxed mt-2 ${
                        isRTL ? "arabic-text text-right" : "text-left"
                      }`}
                    >
                      {selectedCraft.secondDescription}
                    </p>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {isRTL ? "التصنيف:" : "Category:"}
                      </span>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {selectedCraft.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {isRTL ? "التقييم:" : "Rating:"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{selectedCraft.rating}</span>
                      </div>
                    </div>

                    {selectedCraft.seller && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {isRTL ? "البائع:" : "Seller:"}
                        </span>
                        <span
                          className={`text-gray-600 ${
                            isRTL ? "arabic-text" : ""
                          }`}
                        >
                          {selectedCraft.seller}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-amber-700 mb-2">
                        {selectedCraft.priceValue} {selectedCraft.priceCurrency}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Button */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() =>
                    handleWhatsAppOrder(selectedCraft.name, selectedCraft.seller)
                  }
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span className={isRTL ? "arabic-text" : ""}>
                    {isRTL ? "استفسر عبر واتساب" : "Inquire via WhatsApp"}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crafts;