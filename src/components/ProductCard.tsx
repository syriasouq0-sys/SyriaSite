import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Tag, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useActiveEvent } from '@/hooks/useEvents';
import QuickViewModal from './QuickViewModal';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar' | 'sv';
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    const productTitle = product.title?.[lang] || product.title?.en || 'Product';
    toast.success(`${productTitle} ${t('products.addToCart')}!`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowQuickView(true);
  };

  // Get active event from context
  const { data: activeEvent } = useActiveEvent();
  
  // Calculate discounted price if applicable
  // First check product discount (must be active), then event discount if available
  const productDiscount = product.discount_active && product.discount_percentage && product.discount_percentage > 0;
  const eventDiscount = activeEvent?.discount_percentage && activeEvent.discount_percentage > 0;
  
  // Use product discount first, fall back to event discount
  const hasDiscount = productDiscount || eventDiscount;
  const discountPercentage = productDiscount 
    ? product.discount_percentage 
    : (eventDiscount ? activeEvent?.discount_percentage : 0);
    
  const discountedPrice = hasDiscount && discountPercentage
    ? Math.round(product.price * (1 - discountPercentage / 100)) 
    : product.price;

  return (
    <>
      <Link to={`/product/${product.slug}`} className="h-full">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="h-full"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow flex flex-col">
            <div className="aspect-square overflow-hidden bg-muted relative group">
              <LazyImage
                src={product.images[0]}
                alt={product.title?.[lang] || product.title?.en || 'Product'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              
              {/* Discount Badge */}
              {hasDiscount && discountPercentage && (
                <div className="absolute top-0 left-0">
                  <Badge variant="destructive" className="m-2 px-2 py-1 text-xs font-bold">
                    <Tag className="h-3 w-3 mr-1" />
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}

              {/* Quick View Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <Button
                  onClick={handleQuickView}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Quick View
                </Button>
              </motion.div>
            </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {product.title?.[lang] || product.title?.en || 'Product'}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {product.description?.[lang] || product.description?.en || ''}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className={cn(
                  "text-xl font-bold",
                  hasDiscount && "text-destructive"
                )}>
                  {discountedPrice} {product.currency}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.price} {product.currency}
                  </span>
                )}
              </div>
              {product.stock > 0 ? (
                <span className="text-xs text-muted-foreground">{t('products.inStock')}</span>
              ) : (
                <span className="text-xs text-destructive">{t('products.outOfStock')}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('products.addToCart')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>

    <QuickViewModal
      product={product}
      open={showQuickView}
      onClose={() => setShowQuickView(false)}
    />
  </>
  );
};

export default ProductCard;
