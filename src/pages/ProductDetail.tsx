import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductBySlug } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ArrowLeft, ShoppingCart, Package, Truck, ShieldCheck, Loader2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useActiveEvent } from '@/hooks/useEvents';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar' | 'sv';
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: activeEvent } = useActiveEvent();

  const { data: product, isLoading, error } = useProductBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('product.loading') || 'Loading product...'}</p>
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('product.notFound') || 'Product not found'}</h2>
          <Button onClick={() => navigate('/store')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('product.backToStore') || 'Back to Store'}
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    const productTitle = product.title?.[lang] || product.title?.en || 'Product';
    toast.success(`${productTitle} ${t('product.addedToCart') || 'added to cart!'}`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('product.backToStore') || 'Back to Store'}
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.title?.[lang] || product.title?.en || 'Product'} - Image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-all hover:scale-105",
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.title?.[lang] || product.title?.en || 'Product'} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">
                {product.title?.[lang] || product.title?.en || 'Product'}
              </h1>
              
              {/* Calculate discount logic */}
              {(() => {
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
                  <div className="flex items-baseline gap-2">
                    {hasDiscount && discountPercentage ? (
                      <>
                        <Badge variant="destructive" className="mr-2">
                          <Tag className="h-3 w-3 mr-1" />
                          -{discountPercentage}% OFF
                        </Badge>
                        <span className="text-3xl font-bold text-destructive">
                          {discountedPrice} {product.currency}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          {product.price} {product.currency}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {product.price} {product.currency}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description?.[lang] || product.description?.en || ''}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    <span className="font-semibold text-primary">{product.stock}</span> items in stock
                  </span>
                </>
              ) : (
                <span className="text-destructive font-semibold">Out of stock</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Add to cart */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Authentic Quality</p>
                  <p className="text-sm text-muted-foreground">
                    Premium materials and craftsmanship
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Fast Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Quick delivery across Sweden
                  </p>
                </div>
              </div>
            </div>

            {/* Multilingual info preview */}
            <div className="border-t pt-6 space-y-3">
              <h3 className="font-semibold">Multilingual Support</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Arabic:</span>{' '}
                  <span className="text-muted-foreground" dir="rtl">
                    {product.title?.ar || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Swedish:</span>{' '}
                  <span className="text-muted-foreground">
                    {product.title?.sv || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
