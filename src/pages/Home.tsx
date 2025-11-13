import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import ahmedImage from '@/assets/ahmed.png';
import PageTransition from '@/components/PageTransition';

const Home = () => {
  const { data: featuredProducts = [], isLoading, error } = useFeaturedProducts();
  const { t } = useTranslation();
  

  return (
    <PageTransition>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Star className="h-4 w-4 fill-primary" />
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t('hero.title')}
                <span className="block text-primary">{t('hero.titleAccent')}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('hero.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/store">
                    {t('hero.shopNow')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">{t('hero.learnMore')}</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-muted">
                <img
                  src={ahmedImage}
                  alt="Celebrate Syrian Heritage"
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -z-10 top-8 right-8 w-full h-full bg-primary/20 rounded-2xl" />
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t('features.quality.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.quality.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{t('features.shipping.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.shipping.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary fill-primary" />
              </div>
              <h3 className="font-semibold">{t('features.satisfaction.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('features.satisfaction.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('products.featured')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('products.explorePopular')}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <p className="text-destructive mb-2">{t('products.loadError') || 'Failed to load products'}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('common.retry') || 'Retry'}
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <p className="text-muted-foreground">{t('products.noFeatured') || 'No featured products available'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full max-w-sm"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" asChild>
              <Link to="/store">
                {t('products.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-primary to-accent text-primary-foreground">
        {/* Animated Syrian Flag Colors Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'linear-gradient(45deg, #007A3D 0%, #000000 50%, #FFFFFF 100%)',
              'linear-gradient(90deg, #000000 0%, #FFFFFF 50%, #007A3D 100%)',
              'linear-gradient(135deg, #FFFFFF 0%, #007A3D 50%, #000000 100%)',
              'linear-gradient(45deg, #007A3D 0%, #000000 50%, #FFFFFF 100%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Star className="h-8 w-8 text-primary-foreground/30 fill-primary-foreground/30" />
          </motion.div>
        ))}

        {/* Animated Arabic Pattern Circles */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full border-4 border-primary-foreground/20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full border-4 border-primary-foreground/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-6 py-3 rounded-full mb-4"
              >
                <Star className="h-5 w-5 fill-primary-foreground" />
                <span className="font-bold">🇸🇾</span>
                <Star className="h-5 w-5 fill-primary-foreground" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg"
            >
              {t('hero.showYourPride')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 text-primary-foreground/90 drop-shadow"
            >
              {t('hero.joinThousands')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="secondary" asChild className="shadow-xl">
                <Link to="/store">
                  {t('hero.startShopping')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default Home;
