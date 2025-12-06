export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">API Overview</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          eX402 delivers a unified, secure, and automated framework for encrypted crypto distributions. 
          By integrating privacy-preserving x402 settlement and eERC encryption on Avalanche, it simplifies 
          how Web3 organizations handle multi-recipient payments.
        </p>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Key Features</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Encrypted Distributions:</strong> Multi-recipient payouts with complete privacy.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">x402 Settlement:</strong> Secure, validated payment processing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">eERC Technology:</strong> Privacy-preserving tokens on Avalanche.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span><strong className="text-foreground">Entity Management:</strong> Create and manage organizations with smart wallets.</span>
          </li>
        </ul>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Base URL</h2>
        <code className="block text-sm bg-secondary/50 p-3 rounded-lg text-foreground">
          https://api.eX402.io/v1
        </code>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Response Format</h2>
        <p className="text-muted-foreground">
          All API responses are returned in JSON format. Successful responses include the requested data, 
          while error responses include an error code and message.
        </p>
      </div>
    </div>
  );
}
