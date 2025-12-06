import { User, Send, Calculator, Lock, Cpu, Wallet } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Submit Request',
    description: 'Tool user or API developer submits x402 request payload',
  },
  {
    icon: Calculator,
    title: 'Fee Calculation',
    description: 'Cloakefy validates & calculates fee (0.1%)',
  },
  {
    icon: Lock,
    title: 'Encryption',
    description: 'Encrypted batch created with eERC technology',
  },
  {
    icon: Cpu,
    title: 'Execution',
    description: 'Avalanche C-Chain execution initiated',
  },
  {
    icon: Wallet,
    title: 'Distribution',
    description: 'Recipients receive encrypted payouts',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Simple, secure, and automated encrypted distributions
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="glass-card p-6 text-center hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
