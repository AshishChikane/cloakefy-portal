import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-foreground">eX402</span>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground text-center md:text-left max-w-md">
            Encrypted multi-recipient payments powered by x402 & eERC on Avalanche.
          </p>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/platform" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Platform
            </Link>
            <Link 
              to="/docs" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
        
        {/* Made with love section */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <motion.div
              className="inline-flex items-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500 mx-1" />
            </motion.div>
            <span>by the eX402 team</span>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center mt-2">
            © {new Date().getFullYear()} eX402. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
