import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Home, Store, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Header = () => {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = getTotalItems();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: <Home className="h-4 w-4" /> },
    { to: '/store', label: t('nav.store'), icon: <Store className="h-4 w-4" /> },
    { to: '/about', label: t('nav.about'), icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80" : "bg-background/60 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 md:h-18 items-center justify-between">
        <Link to="/" className="group flex items-center space-x-2 rtl:space-x-reverse">
          <div className="flex items-center gap-1 transition-transform duration-500 group-hover:scale-110">
            <motion.div 
              className="h-8 w-2 bg-primary rounded-sm" 
              whileHover={{ height: 32 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="h-8 w-2 bg-white border border-border rounded-sm" 
              whileHover={{ height: 24 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
            />
            <motion.div 
              className="h-8 w-2 bg-black rounded-sm" 
              whileHover={{ height: 32 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            />
          </div>
          <div>
            <span className="font-bold text-xl whitespace-nowrap">
              {isArabic ? 'سوق سوريا' : 'Syria Store'}
            </span>
            <div className="hidden sm:block text-xs text-muted-foreground">
              {isArabic ? 'تراث سوري أصيل' : 'Authentic Syrian Heritage'}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-full flex items-center gap-1.5",
                  isActive 
                    ? "text-primary-foreground bg-primary shadow-sm" 
                    : "hover:bg-primary/10 hover:text-primary"
                )}
              >
                {link.icon}
                {link.label}
                {isActive && (
                  <Badge variant="outline" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/10 absolute -top-1 -right-1 h-2 w-2 p-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher, Cart & Mobile Menu */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <Button
            variant={scrolled ? "secondary" : "outline"}
            size="sm"
            onClick={toggleCart}
            className="relative px-3 gap-2 transition-all duration-300 shadow-sm hover:shadow"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.div
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                    key={totalItems}
                  >
                    <Badge 
                      variant="secondary" 
                      className="h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
                    >
                      {totalItems}
                    </Badge>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-md"
          >
            <nav className="container py-6 flex flex-col divide-y divide-border/30">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "flex items-center gap-3 py-4 px-2 text-sm font-medium transition-all",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      isActive ? "bg-primary/10 text-primary" : "bg-muted"
                    )}>
                      {link.icon}
                    </div>
                    <div className="flex flex-col">
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="text-xs text-muted-foreground">
                          {t('footer.current')}
                        </span>
                      )}
                    </div>
                    {isActive && <Star className="ml-auto h-4 w-4 text-primary" />}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
