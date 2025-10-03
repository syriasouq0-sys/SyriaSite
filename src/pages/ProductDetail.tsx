import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ArrowLeft, ShoppingCart, Package, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, toggleCart } = useCartStore();

  const product = getProductBySlug(slug || '');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/store')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.title.en} added to cart!`);
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
          Back to Store
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.title.en}
                className="w-full h-full object-cover"
              />
            </div>
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
              <h1 className="text-4xl font-bold mb-2">{product.title.en}</h1>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {product.price} {product.currency}
                </span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description.en}
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
                  <span className="text-muted-foreground" dir="rtl">{product.title.ar}</span>
                </div>
                <div>
                  <span className="font-medium">Swedish:</span>{' '}
                  <span className="text-muted-foreground">{product.title.sv}</span>
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
