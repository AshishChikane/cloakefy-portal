import { Lock, Code2, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Encrypted at Scale',
    description: 'Multi-recipient payouts with complete privacy preservation.',
  },
  {
    icon: Code2,
    title: 'API + No-Code Dashboard',
    description: 'Integrate programmatically or use our intuitive dashboard directly.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Accuracy',
    description: 'Deterministic and auditable flow for complete transparency.',
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 md:py-28 bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            The Cloakefy Solution
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Cloakefy is an encrypted distribution platform powered by x402 settlement and eERC 
            technology on Avalanche. It automates on-chain transfers with privacy, accuracy, 
            and compliance – enabling businesses, DAOs, and protocols to send encrypted 
            multi-party payments seamlessly through one API or a no-code dashboard.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 md:p-8 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
