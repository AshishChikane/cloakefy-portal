import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function WithdrawSection() {
  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const paramsEntity = [
    { name: 'entity_id', type: 'number', required: true, description: 'ID of the entity to withdraw from' },
    { name: 'amount', type: 'string', required: true, description: 'Amount to withdraw (as string, e.g., "0.3") in eUSDC/eUSDT' },
  ];

  const paramsSubEntity = [
    { name: 'sub_entity_id', type: 'number', required: true, description: 'ID of the sub-entity to withdraw from' },
    { name: 'amount', type: 'number', required: true, description: 'Amount to withdraw (in eUSDC/eUSDT)' },
  ];

  const curlEntityExample = `curl -X POST ${baseUrl}/v1/entities/withdraw \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entity_id": 3,
    "amount": "0.3"
  }'`;

  const jsEntityExample = `const response = await fetch('${baseUrl}/v1/entities/withdraw', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entity_id: 3,
    amount: '0.3', // Note: amount is a string for entity withdraw
  }),
});

const result = await response.json();`;

  const curlSubEntityExample = `curl -X POST ${baseUrl}/v1/sub-entities/withdraw \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sub_entity_id": 3,
    "amount": 1
  }'`;

  const jsSubEntityExample = `const response = await fetch('${baseUrl}/v1/sub-entities/withdraw', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sub_entity_id: 3,
    amount: 1,
  }),
});

const result = await response.json();`;

  const responseExample = `{
  "isSuccess": true,
  "message": "Withdrawal successful",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Withdraw Funds</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Withdraw encrypted tokens (eUSDC/eUSDT) from an entity or sub-entity wallet. Withdrawals convert encrypted tokens back to USDC/USDT.
        </p>
      </div>

      <div className="glass-card p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs sm:text-sm text-yellow-400">
          <strong>Required Header:</strong> You must include the <code className="text-yellow-300">x-secret-key</code> header 
          with your secret key obtained from creating an entity.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Withdraw from Entity</h2>
          <EndpointBox method="POST" path="/v1/entities/withdraw" />
          <ParamsTable params={paramsEntity} />
          
          <div className="glass-card p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 mt-3">
            <p className="text-xs sm:text-sm text-blue-400">
              <strong>Note:</strong> For entity withdrawals, the <code className="text-blue-300">amount</code> parameter must be a string (e.g., "0.3").
            </p>
          </div>
          
          <div className="space-y-3 sm:space-4 mt-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
            <CodeBlock code={curlEntityExample} title="cURL" />
            <CodeBlock code={jsEntityExample} title="JavaScript" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Withdraw from Sub-Entity</h2>
          <EndpointBox method="POST" path="/v1/sub-entities/withdraw" />
          <ParamsTable params={paramsSubEntity} />
          
          <div className="space-y-3 sm:space-4 mt-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
            <CodeBlock code={curlSubEntityExample} title="cURL" />
            <CodeBlock code={jsSubEntityExample} title="JavaScript" />
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="200 OK" />
        <div className="glass-card p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30">
          <p className="text-xs sm:text-sm text-blue-400">
            <strong>Note:</strong> Withdrawals convert encrypted tokens (eUSDC/eUSDT) back to regular tokens (USDC/USDT). 
            After withdrawal, check balances using the Get Entity Balance endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}

