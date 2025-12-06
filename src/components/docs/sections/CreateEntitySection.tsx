import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateEntitySection() {
  const params = [
    { name: 'name', type: 'string', required: true, description: 'Name of the entity' },
    { name: 'type', type: 'string', required: true, description: 'Entity type: DAO, Protocol, Company, or Other' },
    { name: 'baseToken', type: 'string', required: true, description: 'Base token: eAVAX, eUSDC, or eUSDT' },
  ];

  const curlExample = `curl -X POST https://api.eX402.io/v1/entities \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My DAO Treasury",
    "type": "DAO",
    "baseToken": "eAVAX"
  }'`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/entities', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My DAO Treasury',
    type: 'DAO',
    baseToken: 'eAVAX',
  }),
});

const entity = await response.json();`;

  const responseExample = `{
  "id": "ent_abc123",
  "name": "My DAO Treasury",
  "type": "DAO",
  "baseToken": "eAVAX",
  "smartWalletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "balance": 0
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Create Entity</h1>
        <p className="text-muted-foreground">
          Create a new entity (organization) with an associated smart wallet for encrypted distributions.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/api/entities" />
      
      <ParamsTable params={params} />
      
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
