import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateSubUserSection() {
  const params = [
    { name: 'name', type: 'string', required: true, description: 'Name of the sub user' },
    { name: 'email_id', type: 'string', required: true, description: 'Email ID of the sub user' },
    { name: 'role', type: 'string', required: false, description: 'Role or title of the sub user' },
  ];

  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const curlExample = `curl -X POST ${baseUrl}/v1/sub-entities \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alice Johnson",
    "email_id": "alice@example.com",
    "role": "Core Contributor"
  }'`;

  const jsExample = `const response = await fetch('${baseUrl}/v1/sub-entities', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Alice Johnson',
    email_id: 'alice@example.com',
    role: 'Core Contributor',
  }),
});

const result = await response.json();
// Response includes wallet address and initial balances`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "sub_entity_id": 1,
    "email_id": "alice@example.com",
    "name": "Alice Johnson",
    "role": "Core Contributor",
    "entity_id": 1,
    "createdAt": "2025-12-08T09:53:20.000Z",
    "updatedAt": "2025-12-08T09:53:20.000Z",
    "wallet": {
      "wallet_id": 1,
      "sub_entity_id": 1,
      "address": "0xA86F33Ee644CC7C7a7890698786799062d36fef4",
      "network": "avalanche-fuji",
      "chain_id": "eip155:43113",
      "balances": {
        "avax": {
          "balance": "0.0",
          "balanceWei": "0"
        },
        "eusdc": {
          "tokenBalance": "0",
          "tokenBalanceWei": "0",
          "encryptedBalance": "0",
          "encryptedBalanceWei": "0",
          "isRegistered": false
        }
      }
    }
  },
  "message": "Sub entity created successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Create Sub User</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Add a new sub user to an entity for receiving encrypted distributions. A wallet is automatically created for each sub user.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/v1/sub-entities" />
      
      <div className="glass-card p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs sm:text-sm text-yellow-400">
          <strong>Required Header:</strong> You must include the <code className="text-yellow-300">x-secret-key</code> header 
          with your secret key obtained from creating an entity.
        </p>
      </div>
      
      <ParamsTable params={params} />
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="200 OK" />
      </div>
    </div>
  );
}
