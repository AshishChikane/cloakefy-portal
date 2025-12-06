import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lock, Code2, ShieldCheck, Layers } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Encrypted at Scale',
    description: 'Multi-recipient payouts with complete privacy preservation using eERC technology.',
  },
  {
    icon: Code2,
    title: 'API + Dashboard',
    description: 'Integrate programmatically via REST API or use our intuitive no-code dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Ready',
    description: 'Deterministic and auditable flow for complete transparency and regulatory compliance.',
  },
];

export function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Built for Web3</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            The eX402{' '}
            <span className="gradient-text">Solution</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            An encrypted distribution platform powered by x402 settlement and eERC 
            technology on Avalanche. Automate on-chain transfers with privacy, accuracy, 
            and compliance built-in.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group"
            >
              <div className="glass-card p-10 h-full hover:border-primary/40 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:border-primary/40 group-hover:scale-110 transition-all">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
