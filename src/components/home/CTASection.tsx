import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start sending encrypted multi-party payments
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join organizations already using Cloakefy for secure, compliant crypto distributions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/platform">
                  Launch Tooling Platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link to="/docs">
                  <BookOpen className="w-4 h-4" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
