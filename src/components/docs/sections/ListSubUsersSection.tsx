import { EndpointBox } from '../EndpointBox';
import { CodeBlock } from '../CodeBlock';

export function ListSubUsersSection() {
  const curlExample = `curl -X GET https://api.cloakefy.io/v1/entities/ent_abc123/sub-users \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  const jsExample = `const response = await fetch(
  'https://api.cloakefy.io/v1/entities/ent_abc123/sub-users',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
    },
  }
);

const subUsers = await response.json();`;

  const responseExample = `{
  "data": [
    {
      "id": "su_xyz789",
      "entityId": "ent_abc123",
      "name": "Alice Johnson",
      "role": "Core Contributor",
      "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "allocationType": "Percentage",
      "allocation": 25
    },
    {
      "id": "su_xyz790",
      "entityId": "ent_abc123",
      "name": "Bob Smith",
      "role": "Developer",
      "walletAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
      "allocationType": "Fixed",
      "allocation": 100
    }
  ]
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">List Sub Users</h1>
        <p className="text-muted-foreground">
          Retrieve all sub users associated with an entity.
        </p>
      </div>
      
      <EndpointBox method="GET" path="/api/entities/:id/sub-users" />
      
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
