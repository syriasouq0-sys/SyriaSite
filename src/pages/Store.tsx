import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Store = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar' | 'sv';

  // Fetch products from Supabase
  const { data: products = [], isLoading, error } = useProducts();

  const categories = [
    { id: 'all', label: t('store.categories.all') },
    { id: 'flags', label: t('store.categories.flags') },
    { id: 'scarves', label: t('store.categories.scarves') },
    { id: 'accessories', label: t('store.categories.accessories') },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description[lang].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t('store.loading') || 'Loading products...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>
              {t('store.error') || 'Error loading products. Please check your connection and try again.'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => window.location.reload()}>
              {t('store.retry') || 'Retry'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">{t('store.title')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('store.subtitle')}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('store.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {t('store.showing')} {filteredProducts.length} {filteredProducts.length === 1 ? t('store.product') : t('store.products')}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {t('store.noResults')}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              {t('store.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
