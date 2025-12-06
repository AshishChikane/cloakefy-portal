import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ArrowRight, BookOpen, Sparkles, Zap } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px]"
        style={{
          background: 'radial-gradient(ellipse at bottom, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div 
          className="glass-card p-8 md:p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                               radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Floating icons */}
          <motion.div
            className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-8 right-8 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Zap className="w-6 h-6 text-primary" />
          </motion.div>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
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
              Join organizations already using Cloakefy for secure, compliant crypto distributions on Avalanche.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton>
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
              </MagneticButton>
              <MagneticButton>
                <Button asChild variant="heroOutline" size="lg">
                  <Link to="/docs">
                    <BookOpen className="w-4 h-4" />
                    Read the Docs
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="mt-12 pt-8 border-t border-border/50"
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
