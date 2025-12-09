import { CodeBlock } from '../CodeBlock';
import { EndpointBox } from '../EndpointBox';

export function AuthenticationSection() {
  const curlExample = `curl -X GET https://api.eX402.io/v1/entities \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "X-User-Email: user@example.com" \\
  -H "Content-Type: application/json"`;

  const jsExample = `const response = await fetch('https://api.eX402.io/v1/entities', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'X-User-Email': 'user@example.com',
    'Content-Type': 'application/json',
  },
});

const data = await response.json();`;

  const secretKeyExample = `curl -X POST https://api.eX402.io/v1/sub-entities \\
  -H "x-secret-key: YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sub User Name",
    "email_id": "subuser@example.com",
    "role": "Developer"
  }'`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Authentication</h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          API authentication uses two types of credentials: Bearer tokens for general API access and 
          x-secret-key for entity-specific operations.
        </p>
      </div>
      
      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Getting Your Secret Key (x-secret-key)</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Your <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">x-secret-key</code> is automatically generated when you create an entity. 
          It is returned in the response of the <strong className="text-foreground">Create Entity</strong> API call.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-400">
            <strong>How to get it:</strong> Create an entity using the POST /v1/entities endpoint. 
            The response will include an <code className="text-blue-300">api_key</code> field - this is your x-secret-key. 
            Store it securely as you'll need it for entity-specific operations.
          </p>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Bearer Token Authentication</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          For general API requests (like listing entities), use Bearer token authentication with your Google OAuth token.
          Include the token in the Authorization header along with your email in the X-User-Email header.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-yellow-400">
            <strong>Important:</strong> Keep your tokens secure. Never expose them in client-side code 
            or public repositories.
          </p>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">x-secret-key Header</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          For entity-specific operations (creating sub-users, transfers, deposits, withdrawals), 
          include the <code className="text-primary bg-secondary/50 px-1.5 py-0.5 rounded">x-secret-key</code> header with your secret key value.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          <strong>Required for:</strong> Create Sub User, Create Transfer, Deposit, Withdraw, Get Private Key, Resend Verification
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Example Requests</h2>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">Bearer Token (General API)</h3>
            <CodeBlock code={curlExample} title="cURL" />
            <CodeBlock code={jsExample} title="JavaScript" />
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">x-secret-key (Entity Operations)</h3>
            <CodeBlock code={secretKeyExample} title="cURL" />
          </div>
        </div>
      </div>
    </div>
  );
}

