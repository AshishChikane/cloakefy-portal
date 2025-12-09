import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function ResendVerificationSection() {
  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const params = [
    { name: 'entity_id', type: 'number', required: true, description: 'ID of the entity to resend verification for' },
  ];

  const curlExample = `curl -X POST ${baseUrl}/v1/entities/resend-verification \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entity_id": 1
  }'`;

  const jsExample = `const response = await fetch('${baseUrl}/v1/entities/resend-verification', {
  method: 'POST',
  headers: {
    'x-secret-key': 'YOUR_SECRET_KEY',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    entity_id: 1,
  }),
});

const result = await response.json();`;

  const responseExample = `{
  "isSuccess": true,
  "message": "Verification email sent successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Resend Verification</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Resend the verification email for an entity's base token registration. Use this when <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">isRegistered</code> 
          is <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">false</code> in the wallet balances.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/v1/entities/resend-verification" />
      
      <div className="glass-card p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-xs sm:text-sm text-yellow-400">
          <strong>Required Header:</strong> You must include the <code className="text-yellow-300">x-secret-key</code> header 
          with your secret key obtained from creating an entity.
        </p>
      </div>

      <div className="glass-card p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30">
        <p className="text-xs sm:text-sm text-blue-400">
          <strong>When to use:</strong> If <code className="text-blue-300">wallet.balances.eusdc.isRegistered</code> or 
          <code className="text-blue-300">wallet.balances.eusdt.isRegistered</code> is <code className="text-blue-300">false</code>, 
          call this endpoint to resend the verification email. The entity owner needs to verify their email to enable encrypted token operations.
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

