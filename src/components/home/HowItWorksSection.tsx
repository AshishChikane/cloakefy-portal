import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { User, Calculator, Lock, Cpu, Wallet, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Submit Request',
    description: 'Tool user or API developer submits x402 request payload',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calculator,
    title: 'Fee Calculation',
    description: 'eX402 validates & calculates fee (0.1%)',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Lock,
    title: 'Encryption',
    description: 'Encrypted batch created with eERC technology',
    color: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Cpu,
    title: 'Execution',
    description: 'Avalanche C-Chain execution initiated',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Wallet,
    title: 'Distribution',
    description: 'Recipients receive encrypted payouts',
    color: 'from-green-500 to-primary',
  },
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

const stepVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
    },
  }),
};

export function HowItWorksSection() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div ref={ref} className="relative max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Cpu className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">Automated Flow</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and automated encrypted distributions in 5 steps
          </p>
        </motion.div>
        
        {/* Desktop view - horizontal timeline */}
        <div className="hidden lg:block relative">
          {/* Animated progress line */}
          <div className="absolute top-[60px] left-0 right-0 h-1 bg-border/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"
              style={{ width: lineWidth }}
            />
          </div>
          
          <motion.div 
            className="grid grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={stepVariants}
                className="relative group"
              >
                {/* Step card */}
                <div className="glass-card p-6 text-center h-full hover:border-primary/30 transition-all duration-500 group-hover:translate-y-[-8px]">
                  {/* Icon with animated ring */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${step.color.split(' ')[0].replace('from-', '')} 0%, ${step.color.split(' ')[1].replace('to-', '')} 100%)`,
                        opacity: 0.2,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-[1px]`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    
                    {/* Step number */}
                    <motion.div 
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30"
                      whileHover={{ scale: 1.2 }}
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="absolute top-[60px] -right-6 text-muted-foreground/30"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Mobile view - vertical timeline */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-[1px] flex-shrink-0`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                )}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
