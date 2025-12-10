import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/platform', label: 'Tooling Platform' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed border-b border-border/30 border-gray-800 top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
      {/* Beautiful gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="border-b border-border/30" />
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="../cloakefy.png" alt="eX402" className="w-full h-11" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            // Check if current path matches the link
            // For platform, also check if path starts with /platform, /entity, or /sub-entity
            const isActive = link.href === '/platform'
              ? location.pathname === link.href || 
                location.pathname.startsWith('/platform') || 
                location.pathname.startsWith('/entity/') || 
                location.pathname.startsWith('/sub-entity/')
              : location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => {
              // Check if current path matches the link
              // For platform, also check if path starts with /platform, /entity, or /sub-entity
              const isActive = link.href === '/platform'
                ? location.pathname === link.href || 
                  location.pathname.startsWith('/platform') || 
                  location.pathname.startsWith('/entity/') || 
                  location.pathname.startsWith('/sub-entity/')
                : location.pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block text-sm font-medium transition-colors",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
