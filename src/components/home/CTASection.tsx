import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowRight, BookOpen } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="glass-card p-12 md:p-16 lg:p-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Start sending{' '}
              <span className="gradient-text">encrypted</span>
              <br />
              multi-party payments
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Join organizations already using eX402 for secure, compliant crypto distributions on Avalanche.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            {/* <MagneticButton> */}
              <Button asChild variant="hero" size="lg" className="group">
                <Link to="/platform">
                  Launch Tooling Platform
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </Button>
            {/* </MagneticButton>
            <MagneticButton> */}
              <Button asChild variant="heroOutline" size="lg">
                <Link to="/docs">
                  <BookOpen className="w-4 h-4" />
                  Read the Docs
                </Link>
              </Button>
            {/* </MagneticButton> */}
          </motion.div>
          
          <motion.div 
            className="pt-8 border-t border-border/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by leading Web3 organizations</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {['DAO', 'Protocol', 'DeFi', 'Avalanche'].map((name, i) => (
                <motion.div
                  key={name}
                  className="text-lg font-bold text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
