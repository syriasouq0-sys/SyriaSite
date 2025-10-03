import { motion } from 'framer-motion';
import { Heart, Star, Users, Package } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Syria Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating Syrian heritage through authentic, quality products that connect our community with pride
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Syria Store was born from a deep love for Syrian heritage and a desire to help our community stay connected to their roots, no matter where they are in the world.
              </p>
              <p>
                We carefully curate and create each product with authenticity and quality in mind. From our handmade crochet scarves to our premium flags, every item is chosen to represent the pride and beauty of Syrian culture.
              </p>
              <p>
                Based in Sweden, we serve the Syrian diaspora and anyone who appreciates Syrian culture, providing authentic products that celebrate our heritage and keep our traditions alive.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Authentic Heritage</h3>
            <p className="text-sm text-muted-foreground">
              Every product celebrates genuine Syrian culture and craftsmanship
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Premium Quality</h3>
            <p className="text-sm text-muted-foreground">
              We never compromise on quality, ensuring lasting products
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Community First</h3>
            <p className="text-sm text-muted-foreground">
              Serving and connecting the Syrian community worldwide
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Careful Curation</h3>
            <p className="text-sm text-muted-foreground">
              Each product is thoughtfully selected and crafted
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/90">Authentic Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-primary-foreground/90">Languages Supported</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
