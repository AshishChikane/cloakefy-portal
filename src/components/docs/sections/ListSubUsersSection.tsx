import { EndpointBox } from '../EndpointBox';
import { CodeBlock } from '../CodeBlock';

export function ListSubUsersSection() {
  const curlExample = `curl -X GET https://api.eX402.io/v1/entities/1 \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "X-User-Email: user@example.com"`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/entities/1', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'X-User-Email': 'user@example.com',
  },
});

const result = await response.json();
// Sub users are in result.result.sub_entities array`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "entity_id": 1,
    "name": "My DAO Treasury",
    "sub_entities": [
      {
        "sub_entity_id": 1,
        "email_id": "alice@example.com",
        "name": "Alice Johnson",
        "role": "Core Contributor",
        "entity_id": 1,
        "wallet": {
          "wallet_id": 1,
          "sub_entity_id": 1,
          "address": "0xA86F33Ee644CC7C7a7890698786799062d36fef4",
          "network": "avalanche-fuji",
          "balances": {
            "avax": {
              "balance": "0.0",
              "balanceWei": "0"
            },
            "eusdc": {
              "tokenBalance": "0",
              "encryptedBalance": "0",
              "isRegistered": false
            }
          }
        }
      },
      {
        "sub_entity_id": 2,
        "email_id": "bob@example.com",
        "name": "Bob Smith",
        "role": "Developer",
        "entity_id": 1,
        "wallet": {
          "address": "0xe56fe1F7EE2C1454a250e29AefB4BAc192f00225",
          "balances": {...}
        }
      }
    ]
  },
  "message": "Entity retrieved successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">List Sub Users</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Retrieve all sub users associated with an entity. Sub users are returned as part of the entity details 
          in the <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">sub_entities</code> array.
        </p>
      </div>
      
      <EndpointBox method="GET" path="/v1/entities/:id" />
      
      <div className="glass-card p-3 sm:p-4 space-y-2">
        <h4 className="text-sm sm:text-base font-medium text-foreground">Path Parameters</h4>
        <p className="text-xs sm:text-sm text-muted-foreground">
          <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">id</code> - The entity ID (number)
        </p>
      </div>

      <div className="glass-card p-3 sm:p-4 space-y-2">
        <h4 className="text-sm sm:text-base font-medium text-foreground">Headers</h4>
        <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
          <li><code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">Authorization: Bearer YOUR_TOKEN</code> - Your authentication token</li>
          <li><code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">X-User-Email: user@example.com</code> - Your email address</li>
        </ul>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Response</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
          Sub users are included in the <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">result.sub_entities</code> array, 
          each with their wallet address and balances.
        </p>
        <CodeBlock code={responseExample} title="200 OK" />
      </div>
    </div>
  );
}
