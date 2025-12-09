import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function GetPrivateKeySection() {
  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const params = [
    { name: 'sub_entity_id', type: 'number', required: true, description: 'ID of the sub-entity to get the private key for' },
  ];

  const curlExample = `curl -X POST ${baseUrl}/v1/facilitator/private-key \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sub_entity_id": 1
  }'`;

  const jsExample = `const response = await fetch('${baseUrl}/v1/facilitator/private-key', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sub_entity_id: 1,
  }),
});

const result = await response.json();
// Access private key: result.result.private_key`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "private_key": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "sub_entity_id": 1
  },
  "message": "Private key retrieved successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Get Sub-Entity Private Key</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Retrieve the private key for a sub-entity's wallet. This allows you to export and manage the wallet externally.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/v1/facilitator/private-key" />
      
      <div className="glass-card p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs sm:text-sm text-yellow-400">
          <strong>Required Header:</strong> You must include the <code className="text-yellow-300">x-secret-key</code> header 
          with your secret key obtained from creating an entity.
        </p>
      </div>

      <div className="glass-card p-3 sm:p-4 bg-red-500/10 border border-red-500/30">
        <p className="text-xs sm:text-sm text-red-400">
          <strong>Security Warning:</strong> Private keys are sensitive credentials. Never expose them in logs, 
          client-side code, or public repositories. Store them securely and use them only in trusted environments.
        </p>
      </div>
      
      <ParamsTable params={params} />
      
      <div className="space-y-3 sm:space-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Examples</h3>
        <CodeBlock code={curlExample} title="cURL" />
        <CodeBlock code={jsExample} title="JavaScript" />
      </div>
      
      <div className="space-y-3 sm:space-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Response</h3>
        <CodeBlock code={responseExample} title="200 OK" />
      </div>
    </div>
  );
}

