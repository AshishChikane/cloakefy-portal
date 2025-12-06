import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-medium text-foreground">Cloakefy</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Encrypted multi-recipient payments powered by x402 & eERC on Avalanche.
          </p>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/platform" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Platform
            </Link>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
