import { CodeBlock } from '../CodeBlock';

export function AuthenticationSection() {
  const curlExample = `curl -X GET https://api.eX402.io/v1/entities \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/entities', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
});

const data = await response.json();`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Authentication</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          All API requests require authentication using a Bearer token. Include your API key in the 
          Authorization header of every request.
        </p>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">API Key</h2>
        <p className="text-muted-foreground">
          You can obtain your API key from the eX402 dashboard under Settings → API Keys.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-400">
            <strong>Important:</strong> Keep your API key secure. Never expose it in client-side code 
            or public repositories.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Example Requests</h2>
        
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
    </div>
  );
}
