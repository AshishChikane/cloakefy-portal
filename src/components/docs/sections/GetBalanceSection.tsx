import { EndpointBox } from '../EndpointBox';
import { CodeBlock } from '../CodeBlock';

export function GetBalanceSection() {
  const curlExample = `curl -X GET https://api.eX402.io/v1/entities/ent_abc123/balance \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const jsExample = `const response = await fetch(
  'https://api.eX402.io/v1/entities/ent_abc123/balance',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const { balance } = await response.json();`;

  const responseExample = `{
  "balance": 1250.75,
  "token": "eAVAX",
  "lastUpdated": "2024-01-15T10:30:00Z"
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Get Entity Balance</h1>
        <p className="text-muted-foreground">
          Retrieve the current balance of an entity's smart wallet.
        </p>
      </div>
      
      <EndpointBox method="GET" path="/api/entities/:id/balance" />
      
      <div className="glass-card p-4 space-y-2">
        <h4 className="font-medium text-foreground">Path Parameters</h4>
        <p className="text-sm text-muted-foreground">
          <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">id</code> - The entity ID
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="200 OK" />
      </div>
    </div>
  );
}
