import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Users, Globe } from 'lucide-react';

const stats = [
  { icon: Shield, value: '100%', label: 'Encrypted', description: 'End-to-end encryption' },
  { icon: Zap, value: '<30s', label: 'Settlement', description: 'Lightning fast execution' },
  { icon: Users, value: '∞', label: 'Recipients', description: 'Unlimited batch size' },
  { icon: Globe, value: '24/7', label: 'Uptime', description: 'Always available' },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="glass-card p-8 text-center h-full hover:border-primary/40 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/20 group-hover:border-primary/40 group-hover:scale-110 transition-all">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-5xl font-bold gradient-text mb-3">
                  {stat.value}
                </div>
                <div className="font-semibold text-foreground mb-2 text-lg">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
