import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Shield, Zap, CheckCircle2 } from 'lucide-react';

const flowSteps = [
  'Request payload received',
  'Fee calculated (0.1% of total)',
  'Encrypted x402 payload prepared',
  'Validator validates payment',
  'Distribution batch processed',
  'Avalanche C-Chain execution',
  'Recipients receive encrypted payments',
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powered by x402 Settlement</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Encrypted crypto distributions{' '}
              <span className="gradient-text">made simple.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Today, Web3 organizations, DAOs, and DeFi protocols face complexity when distributing 
              encrypted payments at scale. Payrolls, contributor rewards, and institutional settlements 
              often involve manual operations, multi-wallet errors, and privacy risks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/platform">
                  Open Tooling Platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link to="/docs">
                  View API & SDK Docs
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right content - Flow diagram */}
          <div className="lg:pl-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">x402 Settlement Flow</h3>
              </div>
              
              <div className="space-y-3">
                {flowSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
