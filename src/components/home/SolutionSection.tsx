import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, Code2, ShieldCheck, Layers, Zap, Globe } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const features = [
  {
    icon: Lock,
    title: 'Encrypted at Scale',
    description: 'Multi-recipient payouts with complete privacy preservation using eERC technology.',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconBg: 'bg-cyan-500/20',
  },
  {
    icon: Code2,
    title: 'API + No-Code Dashboard',
    description: 'Integrate programmatically or use our intuitive dashboard directly.',
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconBg: 'bg-violet-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Accuracy',
    description: 'Deterministic and auditable flow for complete transparency.',
    gradient: 'from-emerald-500/20 to-green-500/20',
    iconBg: 'bg-emerald-500/20',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
    },
  }),
};

export function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.05) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Built for Web3</span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            The eX402{' '}
            <span className="gradient-text">Solution</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            An encrypted distribution platform powered by x402 settlement and eERC 
            technology on Avalanche. Automate on-chain transfers with privacy, accuracy, 
            and compliance.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 perspective-1000">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <TiltCard className="h-full">
                <div className={`glass-card p-8 h-full relative overflow-hidden group cursor-pointer`}>
                  {/* Hover gradient */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  
                  {/* Animated border on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: 'linear-gradient(90deg, hsl(var(--primary) / 0.5), transparent, hsl(var(--primary) / 0.5))',
                      backgroundSize: '200% 100%',
                      padding: '1px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                    animate={{
                      backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  
                  <div className="relative">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <feature.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
