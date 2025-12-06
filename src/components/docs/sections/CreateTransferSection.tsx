import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateTransferSection() {
  const params = [
    { name: 'entityId', type: 'string', required: true, description: 'ID of the entity making the transfer' },
    { name: 'subUserId', type: 'string', required: true, description: 'ID of the sub user receiving the payment' },
    { name: 'amount', type: 'number', required: true, description: 'Amount to transfer' },
    { name: 'token', type: 'string', required: true, description: 'Token type: eAVAX, eUSDC, or eUSDT' },
  ];

  const curlExample = `curl -X POST https://api.eX402.io/v1/transfers \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entityId": "ent_abc123",
    "subUserId": "su_xyz789",
    "amount": 50,
    "token": "eAVAX"
  }'`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/transfers', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entityId: 'ent_abc123',
    subUserId: 'su_xyz789',
    amount: 50,
    token: 'eAVAX',
  }),
});

const transfer = await response.json();`;

  const responseExample = `{
  "id": "tx_def456",
  "entityId": "ent_abc123",
  "fromAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "toAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "toName": "Alice Johnson",
  "amount": 50,
  "token": "eAVAX",
  "status": "Completed",
  "txHash": "0x789abc...",
  "timestamp": "2024-01-15T12:00:00Z"
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Create Distribution / Transfer</h1>
        <p className="text-muted-foreground">
          Create an encrypted transfer from an entity's smart wallet to a sub user.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/api/transfers" />
      
      <ParamsTable params={params} />
      
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> A 0.1% fee is calculated and deducted from the transfer amount 
          as part of the x402 settlement process.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="201 Created" />
      </div>
    </div>
  );
}
