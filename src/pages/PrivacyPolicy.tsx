import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We care about your data and how it is used. This policy explains what information we collect and how we use it.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="prose prose-lg mx-auto space-y-8">
            <p className="text-muted-foreground mb-8">Last updated: October 12, 2025</p>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to Syria Store. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">2. The Data We Collect About You</h2>
              <p className="leading-relaxed">
                Personal data, or personal information, means any information about an individual from which that person can be identified.
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="leading-relaxed"><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li className="leading-relaxed"><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li className="leading-relaxed"><strong>Financial Data</strong> includes payment card details.</li>
                <li className="leading-relaxed"><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                <li className="leading-relaxed"><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li className="leading-relaxed"><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                <li className="leading-relaxed"><strong>Usage Data</strong> includes information about how you use our website and services.</li>
                <li className="leading-relaxed"><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Personal Data</h2>
              <p className="leading-relaxed">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="leading-relaxed">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li className="leading-relaxed">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li className="leading-relaxed">Where we need to comply with a legal obligation.</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p className="leading-relaxed">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Retention</h2>
              <p className="leading-relaxed">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for,
                including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
                We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation
                in respect to our relationship with you.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Legal Rights</h2>
              <p className="leading-relaxed">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="space-y-3 mt-4">
                <li className="leading-relaxed">Request access to your personal data.</li>
                <li className="leading-relaxed">Request correction of your personal data.</li>
                <li className="leading-relaxed">Request erasure of your personal data.</li>
                <li className="leading-relaxed">Object to processing of your personal data.</li>
                <li className="leading-relaxed">Request restriction of processing your personal data.</li>
                <li className="leading-relaxed">Request transfer of your personal data.</li>
                <li className="leading-relaxed">Right to withdraw consent.</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Third-Party Links</h2>
              <p className="leading-relaxed">
                This website may include links to third-party websites, plug-ins and applications.
                Clicking on those links or enabling those connections may allow third parties to collect or share data about you.
                We do not control these third-party websites and are not responsible for their privacy statements.
                When you leave our website, we encourage you to read the privacy policy of every website you visit.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Cookies</h2>
              <p className="leading-relaxed">
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Changes to the Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
                You are advised to review this privacy policy periodically for any changes.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="leading-relaxed"><strong>Email:</strong> info@syriastore.com</p>
                <p className="leading-relaxed"><strong>Phone:</strong> +46 70 123 4567</p>
                <p className="leading-relaxed"><strong>Address:</strong> Storgatan 1, 12345 Stockholm, Sweden</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Key Privacy Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Data Security</h3>
            <p className="text-sm text-muted-foreground">
              We implement strong security measures to protect your personal information from unauthorized access.
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Your Rights</h3>
            <p className="text-sm text-muted-foreground">
              You have the right to access, correct, or delete your personal data at any time.
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">No Data Sharing</h3>
            <p className="text-sm text-muted-foreground">
              We don't sell your data to third parties. Your information is used only to improve your shopping experience.
            </p>
          </motion.div>
        </div>
        
        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-12 text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Have Questions About Your Privacy?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            If you have any questions about this privacy policy or our privacy practices, please contact us.
          </p>
          <div className="text-lg font-medium">
            <p>Email: info@syriastore.com</p>
            <p>Phone: +46 70 123 4567</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
