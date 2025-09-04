import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Star } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string
  secondDescription?: string
  image: string
  priceValue: number
  priceCurrency: string
  rating?: number
  seller?: string
  category?: string
}

type ProductCardProps = {
  product: Product
  isRTL?: boolean
  t: (key: string) => string
}

export default function ProductCard({ product, isRTL, t }: ProductCardProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleWhatsAppOrder = (name: string, seller?: string) => {
    const message = `Hello, I'm interested in ${name}${seller ? ` by ${seller}` : ""}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <>
      <Card key={product.id} className="product-card overflow-hidden flex flex-col h-[450px]">
        <CardContent className="p-0 flex flex-col h-full">
          {/* الصورة */}
          <div className="relative h-56 w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.rating && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground flex items-center">
                <Star className="h-3 w-3 mr-1" />
                {product.rating}
              </Badge>
            )}
          </div>

          {/* المحتوى */}
          <div className="flex flex-col flex-1 p-6">
            <h3 className={`text-lg font-semibold mb-2 ${isRTL ? "arabic-text text-right" : ""}`}>
              {product.name}
            </h3>

            {/* الوصف (محدود بسطر واحد) */}
            <p
              className={`text-sm text-muted-foreground mb-2 line-clamp-1 ${
                isRTL ? "arabic-text text-right" : ""
              }`}
            >
              {product.description}
            </p>
            {product.secondDescription && (
              <p
                className={`text-sm text-muted-foreground mb-2 line-clamp-1 ${
                  isRTL ? "arabic-text text-right" : ""
                }`}
              >
                {product.secondDescription}
              </p>
            )}

            {/* Read more */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setSelectedProduct(product)}
                className="text-blue-600 text-sm hover:underline"
              >
                {isRTL ? "اقرأ المزيد" : "Read more"}
              </button>
            </div>

            {/* السعر + الباي */}
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

            {/* زرار الطلب مثبت تحت */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
              onClick={() => handleWhatsAppOrder(product.name, product.seller)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className={isRTL ? "arabic-text" : ""}>
                {t("product.order")}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog لعرض التفاصيل الكاملة */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className={isRTL ? "arabic-text text-right" : ""}>
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className={isRTL ? "arabic-text text-right" : ""}>
                  {selectedProduct.description}
                </p>
                {selectedProduct.secondDescription && (
                  <p className={isRTL ? "arabic-text text-right" : ""}>
                    {selectedProduct.secondDescription}
                  </p>
                )}
                {selectedProduct.category && (
                  <p className={isRTL ? "arabic-text text-right" : ""}>
                    {isRTL ? "التصنيف:" : "Category:"} {selectedProduct.category}
                  </p>
                )}
                {selectedProduct.seller && (
                  <p className={isRTL ? "arabic-text text-right" : ""}>
                    {isRTL ? "بواسطة:" : "by"} {selectedProduct.seller}
                  </p>
                )}
                <p className="font-bold text-primary">
                  {selectedProduct.priceValue} {selectedProduct.priceCurrency}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
