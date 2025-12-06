import { ReactNode, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const transform = useMotionTemplate`perspective(1000px) rotateX(${ySpring}deg) rotateY(${xSpring}deg)`;
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    
    x.set(rotateY);
    y.set(rotateX);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
