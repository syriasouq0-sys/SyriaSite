import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, Facebook, Instagram, Twitter, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <footer className="mt-20">
      {/* Newsletter Section */}
      <div className="bg-primary/5 border-y">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">{t('footer.stayUpdated')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('footer.newsletterText')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')}
                  className="pl-10"
                />
              </div>
              <Button className="gap-2">
                {t('footer.subscribe')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-muted/30">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Logo and Description */}
            <div className="md:col-span-4 space-y-4">
              <Link to="/" className="inline-block group">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
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
                    <span className="font-bold text-xl">
                      {isArabic ? 'سوق سوريا' : 'Syria Store'}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? 'تراث سوري أصيل' : 'Authentic Syrian Heritage'}
                    </div>
                  </div>
                </div>
              </Link>
              
              <p className="text-sm text-muted-foreground">
                {t('footer.description')}
              </p>
              
              <div className="pt-4">
                <h4 className="text-sm font-semibold mb-3">{t('footer.connect')}</h4>
                <div className="flex gap-3">
                  <a 
                    href="#" 
                    className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-foreground hover:bg-primary flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a 
                    href="#" 
                    className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-foreground hover:bg-primary flex items-center justify-center transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a 
                    href="#" 
                    className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-foreground hover:bg-primary flex items-center justify-center transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4 text-base">{t('footer.shop')}</h3>
              <ul className="space-y-2.5">
                {[
                  { to: "/store", label: t('footer.allProducts') },
                  { to: "/store?category=flags", label: t('footer.flags') },
                  { to: "/store?category=scarves", label: t('footer.scarves') },
                  { to: "/store?category=accessories", label: t('footer.accessories') }
                ].map((link, i) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-4 text-base">{t('footer.information')}</h3>
              <ul className="space-y-2.5">
                {[
                  { to: "/about", label: t('footer.aboutUs') },
                  { to: "/privacy-policy", label: t('footer.privacy') },
                  { to: "/terms-conditions", label: t('footer.terms') },
                  { to: "#", label: t('footer.contact') }
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4">
              <h3 className="font-semibold mb-4 text-base">{t('footer.contactUs')}</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div className="text-muted-foreground">
                    <p>123 Main Street</p>
                    <p>Stockholm, Sweden</p>
                  </div>
                </li>
                <li className="flex gap-3 text-sm items-center">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <a href="tel:+46123456789" className="text-muted-foreground hover:text-primary">
                    +46 123 456 789
                  </a>
                </li>
                <li className="flex gap-3 text-sm items-center">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <a href="mailto:info@syriastore.com" className="text-muted-foreground hover:text-primary">
                    info@syriastore.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-muted/30 border-t">
        <div className="container py-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              {t('footer.securePayment') || 'Secure Payment Methods'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Swish */}
              <div className="flex items-center justify-center h-12 px-4 bg-white rounded-lg border">
                <img 
                  src="/locales/images/swish.png" 
                  alt="Swish" 
                  className="h-8 object-contain"
                />
              </div>
              
              {/* Klarna */}
              <div className="flex items-center justify-center h-12 px-4 bg-white rounded-lg border">
                <img 
                  src="/locales/images/Klarna.png" 
                  alt="Klarna" 
                  className="h-6 object-contain"
                />
              </div>
              
              {/* Visa */}
              <div className="flex items-center justify-center h-12 px-4 bg-white rounded-lg border">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" 
                  alt="Visa" 
                  className="h-8 object-contain"
                />
              </div>
              
              {/* Mastercard */}
              <div className="flex items-center justify-center h-12 px-4 bg-white rounded-lg border">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                  alt="Mastercard" 
                  className="h-10 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-muted/50 border-t">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 {isArabic ? 'سوق سوريا' : 'Syria Store'}. {t('footer.rights')}.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                {t('footer.privacy')}
              </Link>
              <span>•</span>
              <Link to="/terms-conditions" className="hover:text-primary transition-colors">
                {t('footer.terms')}
              </Link>
              <span>•</span>
              <div className="flex items-center gap-1">
                {t('footer.madeWith')} <Heart className="h-4 w-4 fill-secondary text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
