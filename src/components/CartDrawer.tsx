import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, X, ShoppingBag, Package, Tag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const CartDrawer = () => {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal,
    getDiscount,
    getTotalPrice, 
    currency,
    discountCode,
    discountPercentage,
    applyDiscountCode,
    clearDiscount
  } = useCartStore();
  
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const lang = i18n.language as 'en' | 'ar' | 'sv';
  
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const handleApplyDiscount = () => {
    if (!code) return;
    
    setIsApplying(true);
    setTimeout(() => {
      const success = applyDiscountCode(code);
      
      if (success) {
        toast({
          title: "Discount applied!",
          description: `20% discount has been applied to your order.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid code",
          description: "Please check your discount code and try again.",
          variant: "destructive",
        });
      }
      
      setIsApplying(false);
    }, 600); // Simulate API call
  };
  
  const handleRemoveDiscount = () => {
    clearDiscount();
    setCode('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl">{t('cart.title')}</SheetTitle>
                <SheetDescription className="text-xs">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </SheetDescription>
              </div>
            </div>
            {items.length > 0 && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {items.length}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <Separator />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6 text-sm max-w-[250px]">
                {t('cart.empty')}
              </p>
              <Button onClick={toggleCart} asChild className="shadow-lg">
                <Link to="/store">{t('cart.continueShopping')}</Link>
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="group relative flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title[lang]}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
                      />
                      {item.quantity >= item.product.stock && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 text-xs px-2 py-0.5"
                        >
                          Max
                        </Badge>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-semibold text-sm leading-tight line-clamp-2 pr-2">
                            {item.product.title[lang]}
                          </h4>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-base font-bold mb-2">
                          {(() => {
                            // Get active event from window
                            const activeEvent = window.activeEvent;
                            
                            // Calculate discount
                            const productDiscount = item.product.discount_percentage && item.product.discount_percentage > 0;
                            const eventDiscount = activeEvent?.discount_percentage && activeEvent.discount_percentage > 0;
                            
                            const hasDiscount = productDiscount || eventDiscount;
                            const discountPercentage = productDiscount 
                              ? item.product.discount_percentage 
                              : (eventDiscount ? activeEvent?.discount_percentage : 0);
                            
                            const discountedPrice = hasDiscount && discountPercentage
                              ? Math.round(item.product.price * (1 - discountPercentage / 100))
                              : item.product.price;
                            
                            return (
                              <>
                                <span className={hasDiscount ? "text-destructive" : "text-primary"}>
                                  {discountedPrice} {currency}
                                </span>
                                {hasDiscount && (
                                  <span className="text-sm text-muted-foreground line-through ml-2">
                                    {item.product.price} {currency}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">
                          {item.product.stock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div className="hidden sm:flex flex-col items-end justify-between">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                        <p className="font-bold text-sm">
                          {(() => {
                            // Get active event from window
                            const activeEvent = window.activeEvent;
                            
                            // Calculate discount
                            const productDiscount = item.product.discount_percentage && item.product.discount_percentage > 0;
                            const eventDiscount = activeEvent?.discount_percentage && activeEvent.discount_percentage > 0;
                            
                            const hasDiscount = productDiscount || eventDiscount;
                            const discountPercentage = productDiscount 
                              ? item.product.discount_percentage 
                              : (eventDiscount ? activeEvent?.discount_percentage : 0);
                            
                            const discountedPrice = hasDiscount && discountPercentage
                              ? Math.round(item.product.price * (1 - discountPercentage / 100))
                              : item.product.price;
                            
                            return `${discountedPrice * item.quantity} ${currency}`;
                          })()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t bg-muted/30 mt-auto"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Discount Code */}
              <div className="w-full">
                {discountCode ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-primary/10 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 flex gap-1.5 items-center px-2">
                        <Check className="h-3 w-3" />
                        <span>{discountPercentage}% OFF</span>
                      </Badge>
                      <span className="text-sm font-medium">{discountCode}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs hover:bg-primary/10"
                      onClick={handleRemoveDiscount}
                    >
                      Remove
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Discount code"
                        className="pl-9"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                      />
                    </div>
                    <Button 
                      onClick={handleApplyDiscount} 
                      disabled={!code || isApplying}
                      className="shrink-0"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Summary */}
              <div className="w-full">
                <dl>
                  <div className="flex justify-between py-1.5">
                    <dt className="text-sm text-muted-foreground">Subtotal</dt>
                    <dd className="text-sm font-medium">{getSubtotal()} {currency}</dd>
                  </div>
                  
                  {discountCode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between py-1.5"
                    >
                      <dt className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <span>Discount</span>
                        <Badge variant="outline" className="text-xs h-5">
                          {discountPercentage}%
                        </Badge>
                      </dt>
                      <dd className="text-sm font-medium text-primary">-{getDiscount()} {currency}</dd>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between py-1.5">
                    <dt className="text-sm text-muted-foreground">Shipping</dt>
                    <dd className="text-sm text-primary">Calculated at checkout</dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between py-1.5">
                    <dt className="text-base font-semibold">{t('cart.total')}</dt>
                    <dd className="text-base font-semibold text-primary">{getTotalPrice()} {currency}</dd>
                  </div>
                </dl>
              </div>

              {/* Checkout Button */}
              <Button 
                size="lg" 
                className="w-full shadow-lg hover:shadow-xl transition-all duration-200" 
                asChild
              >
                <Link to="/checkout" onClick={toggleCart}>
                  {t('cart.checkout')}
                </Link>
              </Button>

              {/* Continue Shopping Link */}
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={toggleCart}
                asChild
              >
                <Link to="/store">{t('cart.continueShopping')}</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
