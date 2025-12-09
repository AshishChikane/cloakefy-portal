import { EndpointBox } from '../EndpointBox';
import { CodeBlock } from '../CodeBlock';

export function GetBalanceSection() {
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

const result = await response.json();`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "entity_id": 1,
    "email_id": "user@example.com",
    "name": "My DAO Treasury",
    "entity_type": "DAO",
    "base_token": "eUSDC",
    "wallet": {
      "wallet_id": 1,
      "entity_id": 1,
      "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "network": "avalanche-fuji",
      "chain_id": "eip155:43113",
      "balances": {
        "avax": {
          "balance": "0.0",
          "balanceWei": "0"
        },
        "eusdc": {
          "tokenBalance": "1.114112",
          "tokenBalanceWei": "1114112",
          "encryptedBalance": "0",
          "encryptedBalanceWei": "0",
          "isRegistered": true
        }
      }
    },
    "sub_entities": [...]
  },
  "message": "Entity retrieved successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Get Entity Balance</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Retrieve the current balance and details of an entity's smart wallet. Returns wallet balances for AVAX, eUSDC, and eUSDT.
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
          The response includes wallet balances in the <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">wallet.balances</code> object:
        </p>
        <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 mb-3 list-disc list-inside">
          <li><code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">tokenBalance</code> - USDC/USDT balance (regular token)</li>
          <li><code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">encryptedBalance</code> - eUSDC/eUSDT balance (encrypted token)</li>
        </ul>
        <CodeBlock code={responseExample} title="200 OK" />
      </div>
    </div>
  );
}
