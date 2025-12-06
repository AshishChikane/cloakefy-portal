import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Automated Flow</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            How It{' '}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and automated encrypted distributions in 5 steps
          </p>
        </motion.div>
        
        {/* Desktop view */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute top-[80px] left-0 right-0 h-0.5 bg-border/30" />
            <div className="grid grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative group"
                >
                  <div className="glass-card p-8 text-center hover:border-primary/40 transition-all duration-300">
                    <div className="relative inline-flex items-center justify-center mb-6">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-[2px]`}>
                        <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="absolute top-[80px] -right-6 text-muted-foreground/30">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile view */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} p-[2px] flex-shrink-0`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                )}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
