import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActiveEvent } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, open, onClose }: QuickViewModalProps) => {
  const { addItem } = useCartStore();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar' | 'sv';
  const { data: activeEvent } = useActiveEvent();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product);
    const productTitle = product.title?.[lang] || product.title?.en || 'Product';
    toast.success(`${productTitle} ${t('products.addToCart')}!`);
    onClose();
  };

  // Calculate discount
  const productDiscount = product.discount_active && product.discount_percentage && product.discount_percentage > 0;
  const eventDiscount = activeEvent?.discount_percentage && activeEvent.discount_percentage > 0;
  const hasDiscount = productDiscount || eventDiscount;
  const discountPercentage = productDiscount 
    ? product.discount_percentage 
    : (eventDiscount ? activeEvent?.discount_percentage : 0);
  const discountedPrice = hasDiscount && discountPercentage
    ? Math.round(product.price * (1 - discountPercentage / 100))
    : product.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {product.title?.[lang] || product.title?.en || 'Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img
              src={product.images[0]}
              alt={product.title?.[lang] || product.title?.en || 'Product'}
              className="w-full h-full object-cover"
            />
            {hasDiscount && discountPercentage && (
              <div className="absolute top-0 left-0">
                <Badge variant="destructive" className="m-3 px-3 py-1.5 text-sm font-bold">
                  <Tag className="h-4 w-4 mr-1" />
                  -{discountPercentage}%
                </Badge>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <Badge className="w-fit">{product.category}</Badge>

            <p className="text-muted-foreground">
              {product.description?.[lang] || product.description?.en || ''}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className={cn(
                "text-3xl font-bold",
                hasDiscount && "text-destructive"
              )}>
                {discountedPrice} {product.currency}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.price} {product.currency}
                </span>
              )}
            </div>

            {/* Stock */}
            <div>
              {product.stock > 0 ? (
                <p className="text-sm text-primary font-medium">
                  ✓ {t('products.inStock')} ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm text-destructive font-medium">
                  {t('products.outOfStock')}
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('products.addToCart')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link to={`/product/${product.slug}`} onClick={onClose}>
                  View Details
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;

