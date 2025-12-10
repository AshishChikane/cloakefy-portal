import { EndpointBox } from '../EndpointBox';
import { ParamsTable } from '../ParamsTable';
import { CodeBlock } from '../CodeBlock';

export function CreateEntitySection() {
  const params = [
    { name: 'name', type: 'string', required: true, description: 'Name of the entity' },
    { name: 'email_id', type: 'string', required: true, description: 'Email ID of the entity owner (automatically handled from authentication)' },
    { name: 'entity_type', type: 'string', required: true, description: 'Entity type: DAO, Protocol, Company, or Other' },
    { name: 'base_token', type: 'string', required: true, description: 'Base token: eAVAX, eUSDC, or eUSDT' },
  ];

  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const curlExample = `curl -X POST ${baseUrl}/v1/entities \\
  -H "X-User-Email: user@example.com" \\
  -H "ngrok-skip-browser-warning: true" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My DAO Treasury",
    "email_id": "user@example.com",
    "entity_type": "DAO",
    "base_token": "eUSDC"
  }'`;

  const jsExample = `const response = await fetch('${baseUrl}/v1/entities', {
  method: 'POST',
  headers: {
    'X-User-Email': 'user@example.com',
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My DAO Treasury',
    email_id: 'user@example.com', // Usually handled automatically from auth
    entity_type: 'DAO',
    base_token: 'eUSDC',
  }),
});

const result = await response.json();
// Store result.result.api_key as your x-secret-key`;

  const responseExample = `{
  "isSuccess": true,
  "result": {
    "entity_id": 1,
    "email_id": "user@example.com",
    "name": "My DAO Treasury",
    "entity_type": "DAO",
    "base_token": "eUSDC",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "api_key": "d9f7643f93827e7224d76fabfac42b430500e4d9aa0ab7a61597900c5a6a88a5",
    "createdAt": "2025-12-08T09:53:20.000Z",
    "updatedAt": "2025-12-08T09:53:20.000Z"
  },
  "message": "Entity created successfully",
  "statusCode": 200
}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Create Entity</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create a new entity (organization) with an associated smart wallet for encrypted distributions. 
          The <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">email_id</code> is typically handled automatically from the authenticated user's email, 
          but can be explicitly provided. This endpoint returns an <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">api_key</code> which serves as your 
          <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">x-secret-key</code> for entity-specific operations.
        </p>
      </div>
      
      <EndpointBox method="POST" path="/v1/entities" />
      
      <ParamsTable params={params} />
      
      <div className="glass-card p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30">
        <p className="text-xs sm:text-sm text-blue-400">
          <strong>Important:</strong> The response includes an <code className="text-blue-300">api_key</code> field. 
          This is your <code className="text-blue-300">x-secret-key</code> that you'll need to use in the 
          <code className="text-blue-300">x-secret-key</code> header for entity-specific API calls (sub-users, transfers, deposits, etc.). 
          Store it securely!
        </p>
      </div>
      
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
