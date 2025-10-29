import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Scale, BookOpen } from 'lucide-react';

const TermsConditions = () => {
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
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using our services. By using our website, you agree to these conditions.
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
                These terms and conditions outline the rules and regulations for the use of Syria Store's website.
                By accessing this website, we assume you accept these terms and conditions in full.
                Do not continue to use Syria Store's website if you do not accept all of the terms and conditions stated on this page.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property Rights</h2>
              <p className="leading-relaxed">
                Other than the content you own, under these terms, Syria Store and/or its licensors own all the intellectual property rights
                and materials contained in this website. You are granted a limited license only for purposes of viewing the material contained on this website.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">3. Restrictions</h2>
              <p className="leading-relaxed">You are specifically restricted from all of the following:</p>
              <ul className="space-y-3 mt-4">
                <li className="leading-relaxed">Publishing any website material in any other media</li>
                <li className="leading-relaxed">Selling, sublicensing and/or otherwise commercializing any website material</li>
                <li className="leading-relaxed">Publicly performing and/or showing any website material</li>
                <li className="leading-relaxed">Using this website in any way that is or may be damaging to this website</li>
                <li className="leading-relaxed">Using this website in any way that impacts user access to this website</li>
                <li className="leading-relaxed">Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website, or to any person or business entity</li>
                <li className="leading-relaxed">Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this website</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">4. Your Content</h2>
              <p className="leading-relaxed">
                In these terms and conditions, "Your Content" shall mean any audio, video, text, images or other material you choose to display on this website.
                By displaying Your Content, you grant Syria Store a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish,
                translate and distribute it in any and all media.
              </p>
              <p className="leading-relaxed mt-4">
                Your Content must be your own and must not be invading any third-party's rights.
                Syria Store reserves the right to remove any of Your Content from this website at any time without notice.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">5. No Warranties</h2>
              <p className="leading-relaxed">
                This website is provided "as is," with all faults, and Syria Store expresses no representations or warranties, of any kind related to this website or the materials contained on this website.
                Also, nothing contained on this website shall be interpreted as advising you.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall Syria Store, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website,
                whether such liability is under contract. Syria Store, including its officers, directors and employees shall not be held liable for any indirect,
                consequential or special liability arising out of or in any way related to your use of this website.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">7. Indemnification</h2>
              <p className="leading-relaxed">
                You hereby indemnify to the fullest extent Syria Store from and against any and/or all liabilities, costs, demands, causes of action,
                damages and expenses arising in any way related to your breach of any of the provisions of these terms.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">8. Severability</h2>
              <p className="leading-relaxed">
                If any provision of these terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">9. Variation of Terms</h2>
              <p className="leading-relaxed">
                Syria Store is permitted to revise these terms at any time as it sees fit, and by using this website you are expected to review these terms on a regular basis.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">10. Assignment</h2>
              <p className="leading-relaxed">
                The Syria Store is allowed to assign, transfer, and subcontract its rights and/or obligations under these terms without any notification.
                However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these terms.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">11. Entire Agreement</h2>
              <p className="leading-relaxed">
                These terms constitute the entire agreement between Syria Store and you in relation to your use of this website,
                and supersede all prior agreements and understandings.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">12. Governing Law & Jurisdiction</h2>
              <p className="leading-relaxed">
                These terms will be governed by and interpreted in accordance with the laws of Sweden,
                and you submit to the non-exclusive jurisdiction of the courts located in Sweden for the resolution of any disputes.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mt-8 mb-4">13. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="leading-relaxed"><strong>Email:</strong> info@syriastore.com</p>
                <p className="leading-relaxed"><strong>Phone:</strong> +46 70 123 4567</p>
                <p className="leading-relaxed"><strong>Address:</strong> Storgatan 1, 12345 Stockholm, Sweden</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Key Terms Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="text-center"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Intellectual Property</h3>
            <p className="text-sm text-muted-foreground">
              All content on this website is the property of Syria Store and is protected by copyright laws.
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
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">User Responsibilities</h3>
            <p className="text-sm text-muted-foreground">
              By using our website, you agree not to misuse our services or violate any applicable laws.
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
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Governing Law</h3>
            <p className="text-sm text-muted-foreground">
              These terms are governed by the laws of Sweden, and any disputes will be resolved in Swedish courts.
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
          <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            If you have any questions about these terms and conditions, please don't hesitate to contact us.
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

export default TermsConditions;
