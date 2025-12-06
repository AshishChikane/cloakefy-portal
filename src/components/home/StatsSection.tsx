import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Cpu, Globe, Lock, Zap, Users } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const stats = [
  { icon: Shield, value: '100%', label: 'Encrypted', description: 'End-to-end encryption' },
  { icon: Zap, value: '<2s', label: 'Settlement', description: 'Lightning fast execution' },
  { icon: Users, value: '∞', label: 'Recipients', description: 'Unlimited batch size' },
  { icon: Globe, value: '24/7', label: 'Uptime', description: 'Always available' },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <TiltCard className="h-full">
                <div className="glass-card p-6 text-center h-full group hover:border-primary/30 transition-all">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl md:text-4xl font-bold gradient-text mb-1"
                    initial={{ scale: 0.5 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="font-medium text-foreground mb-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
