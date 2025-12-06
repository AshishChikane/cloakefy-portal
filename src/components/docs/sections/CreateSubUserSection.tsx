import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateSubUserSection() {
  const params = [
    { name: 'name', type: 'string', required: true, description: 'Name of the sub user' },
    { name: 'role', type: 'string', required: false, description: 'Role or title of the sub user' },
    { name: 'walletAddress', type: 'string', required: true, description: 'Wallet address for receiving payments' },
    { name: 'allocationType', type: 'string', required: false, description: 'Fixed or Percentage' },
    { name: 'allocation', type: 'number', required: false, description: 'Allocation amount or percentage' },
  ];

  const curlExample = `curl -X POST https://api.cloakefy.io/v1/entities/ent_abc123/sub-users \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alice Johnson",
    "role": "Core Contributor",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "allocationType": "Percentage",
    "allocation": 25
  }'`;

  const jsExample = `const response = await fetch(
  'https://api.cloakefy.io/v1/entities/ent_abc123/sub-users',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Alice Johnson',
      role: 'Core Contributor',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      allocationType: 'Percentage',
      allocation: 25,
    }),
  }
);

const subUser = await response.json();`;

  const responseExample = `{
  "id": "su_xyz789",
  "entityId": "ent_abc123",
  "name": "Alice Johnson",
  "role": "Core Contributor",
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "allocationType": "Percentage",
  "allocation": 25
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Create Sub User</h1>
        <p className="text-muted-foreground">
          Add a new sub user to an entity for receiving encrypted distributions.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/api/entities/:id/sub-users" />
      
      <ParamsTable params={params} />
      
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
