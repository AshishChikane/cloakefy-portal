import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParticleField } from '@/components/ui/ParticleField';
import { GradientOrbs } from '@/components/ui/GradientOrbs';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SankeyDiagram } from '@/components/ui/SankeyDiagram';
import { ArrowRight, ExternalLink, Shield, Zap, CheckCircle2, Sparkles } from 'lucide-react';

const flowSteps = [
  'Request payload received',
  'Fee calculated (0.1% of total)',
  'Encrypted x402 payload prepared',
  'Validator validates payment',
  'Distribution batch processed',
  'Avalanche C-Chain execution',
  'Recipients receive encrypted payments',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <ParticleField />
      <GradientOrbs />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 w-full">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Left content */}
          <div className="space-y-8">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-sm text-primary font-medium">Powered by x402 Settlement</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight"
            >
              Encrypted crypto{' '}
              <br className="hidden sm:block" />
              <span className="relative">
                <span className="gradient-text">
                  <TypewriterText 
                    words={['distributions', 'payments', 'transfers', 'settlements']} 
                  />
                </span>
              </span>
              <br />
              <span className="text-muted-foreground">made simple.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
            >
              Web3 organizations face complexity when distributing encrypted payments at scale. 
              eX402 automates privacy-preserving multi-party payments with one API.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton>
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto group">
                  <Link to="/platform">
                    Open Tooling Platform
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button asChild variant="heroOutline" size="lg" className="w-full sm:w-auto">
                  <Link to="/docs">
                    View API & SDK Docs
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-4"
            >
              {[
                { value: '0.1%', label: 'Fee Rate' },
                { value: '<2s', label: 'Settlement' },
                { value: '100%', label: 'Encrypted' },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <motion.div 
                    className="text-2xl md:text-3xl font-bold gradient-text"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Right content - Sankey Diagram */}
          <motion.div variants={itemVariants} className="lg:pl-8">
            <div className="w-full">
              <SankeyDiagram />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
