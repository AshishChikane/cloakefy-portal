import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail, Shield, Zap, Code2, LayoutDashboard, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Platform', href: '/platform', icon: LayoutDashboard },
    { label: 'API Reference', href: '/docs', icon: Code2 },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-card/50 to-card/30 overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-30" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Brand Section */}
          <div className="flex-1 max-w-md">
            <Link to="/" className="inline-block mb-4">
              <img src="../cloakefy.png" alt="eX402" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Encrypted multi-recipient payments powered by x402 & eERC on Avalanche. 
              Secure, fast, and compliant token distribution.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-200 group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {footerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex flex-col items-center sm:items-start gap-2 group"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>© {currentYear} eX402 by Cloakefy All rights reserved.</p>
              <span className="hidden md:inline">•</span>
              <p className="flex items-center gap-2">
                Built on{' '}
                <span className="text-primary font-medium">Avalanche</span>
                {' '}with{' '}
                <motion.span
                  className="inline-flex items-center gap-1 text-red-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Heart className="w-3.5 h-3.5 fill-red-500" />
                </motion.span>
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary/50" />
                <span>End-to-end encrypted</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary/50" />
                <span>Powered by x402</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
