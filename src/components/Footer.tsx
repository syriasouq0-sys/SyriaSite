import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-1 mb-4">
              <div className="h-8 w-2 bg-primary" />
              <div className="h-8 w-2 bg-white border border-border" />
              <div className="h-8 w-2 bg-black" />
              <span className="font-bold text-lg ml-2">Syria Store</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Authentic Syrian flags, scarves, and accessories. Celebrating Syrian heritage with pride.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/store" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/store?category=flags" className="hover:text-primary transition-colors">Flags</Link></li>
              <li><Link to="/store?category=scarves" className="hover:text-primary transition-colors">Scarves</Link></li>
              <li><Link to="/store?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us for updates and new products
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="sr-only">Facebook</span>
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="sr-only">Instagram</span>
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 Syria Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-secondary text-secondary" /> for Syria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
