import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.title.en} added to cart!`);
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={product.images[0]}
              alt={product.title.en}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title.en}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description.en}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">
                {product.price} {product.currency}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs text-muted-foreground">In stock</span>
              ) : (
                <span className="text-xs text-destructive">Out of stock</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
