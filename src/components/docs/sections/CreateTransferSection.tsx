import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateTransferSection() {
  const params = [
    { name: 'entity_id', type: 'number', required: true, description: 'ID of the entity making the transfer' },
    { name: 'recipients', type: 'array', required: true, description: 'Array of recipient objects with address and amount' },
    { name: 'recipients[].address', type: 'string', required: true, description: 'Wallet address of the recipient (sub user wallet address)' },
    { name: 'recipients[].amount', type: 'string', required: true, description: 'Amount to transfer (as string, e.g., "0.1")' },
    { name: 'network', type: 'string', required: true, description: 'Network name: "avalanche-fuji"' },
  ];

  const curlExample = `curl -X POST https://api.eX402.io/v1/facilitator/run \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entity_id": 3,
    "recipients": [
      {
        "address": "0xA86F33Ee644CC7C7a7890698786799062d36fef4",
        "amount": "0.1"
      },
      {
        "address": "0xe56fe1F7EE2C1454a250e29AefB4BAc192f00225",
        "amount": "0.5"
      }
    ],
    "network": "avalanche-fuji"
  }'`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/facilitator/run', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entity_id: 3,
    recipients: [
      {
        address: '0xA86F33Ee644CC7C7a7890698786799062d36fef4',
        amount: '0.1'
      },
      {
        address: '0xe56fe1F7EE2C1454a250e29AefB4BAc192f00225',
        amount: '0.5'
      }
    ],
    network: 'avalanche-fuji',
  }),
});

const result = await response.json();`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "transactionHash": "0x789abc...",
    "status": "completed"
  },
  "message": "Transfer completed successfully",
  "statusCode": 200
}`;

  const paymentFlowExample = `// First call - Check if payment is needed
const firstResponse = await fetch('https://api.eX402.io/v1/facilitator/run', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entity_id: 3,
    recipients: [...],
    network: 'avalanche-fuji',
  }),
});

const firstResult = await firstResponse.json();

// If statusCode is 402, make second call with x-payment header
if (firstResult.statusCode === 402) {
  const paymentResponse = await fetch('https://api.eX402.io/v1/facilitator/run', {
    method: 'POST',
    headers: {
      'x-secret-key': 'YOUR_SECRET_KEY',
      'x-payment': 'true',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entity_id: 3,
      recipients: [...],
      network: 'avalanche-fuji',
    }),
  });
  
  const paymentResult = await paymentResponse.json();
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Create Distribution / Transfer</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create encrypted transfers from an entity's smart wallet to one or multiple recipients in a single transaction. 
          Uses wallet addresses directly (not sub-user IDs).
        </p>
      </div>
      
      <EndpointBox method="POST" path="/v1/facilitator/run" />
      
      <div className="glass-card p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs sm:text-sm text-yellow-400">
          <strong>Required Header:</strong> You must include the <code className="text-yellow-300">x-secret-key</code> header 
          with your secret key obtained from creating an entity.
        </p>
      </div>
      
      <ParamsTable params={params} />
      
      <div className="glass-card p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30">
        <h3 className="text-sm sm:text-base font-semibold text-blue-400 mb-2">Payment Flow</h3>
        <p className="text-xs sm:text-sm text-blue-400/90 mb-3">
          This API uses a two-step payment flow:
        </p>
        <ol className="text-xs sm:text-sm text-blue-400/90 space-y-2 list-decimal list-inside">
          <li>First call: Make the transfer request. If statusCode is 402, payment is required.</li>
          <li>Second call: If statusCode was 402, call the same endpoint again with <code className="text-blue-300">x-payment: true</code> header to complete the payment.</li>
        </ol>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
        <div className="mt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Payment Flow Example</h4>
          <CodeBlock code={paymentFlowExample} title="JavaScript - Two-Step Payment" />
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="200 OK" />
        <div className="mt-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <strong>Note:</strong> If the API returns statusCode 402, you need to make a second call with the 
            <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">x-payment: true</code> header to complete the transfer.
          </p>
        </div>
      </div>
    </div>
  );
}
