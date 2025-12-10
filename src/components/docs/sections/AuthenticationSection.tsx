import { CodeBlock } from '../CodeBlock';
import { EndpointBox } from '../EndpointBox';

export function AuthenticationSection() {
  const baseUrl = 'https://your-api-base-url.com'; // Replace with your actual API base URL

  const googleAuthExample = `// Google Sign-In Flow
// 1. User signs in with Google (handled by frontend)
// 2. Redirect to: http://localhost:8080/platform/login?token=JWT_TOKEN
// 3. Backend callback endpoint: POST /v1/auth/google/callback

const response = await fetch('${baseUrl}/v1/auth/google/callback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    credential: 'GOOGLE_CREDENTIAL', // or access_token, or code
  }),
});

const result = await response.json();
// Response includes: { isSuccess: true, result: { user: {...}, token: "JWT_TOKEN" } }`;

  const secretKeyExample = `curl -X POST ${baseUrl}/v1/sub-entities \\
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
          API authentication uses x-secret-key for entity-specific operations. 
          The x-secret-key is obtained when you create an entity.
        </p>
      </div>
      
      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Google Sign-In Authentication</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          The platform uses Google OAuth for authentication. After signing in with Google, you'll receive a JWT token 
          that contains your user information (id, email, google_id, role). This token is stored locally and used for user session management.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-400">
            <strong>Flow:</strong> 
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>User signs in with Google (frontend handles OAuth)</li>
              <li>Redirect to: <code className="text-blue-300">/platform/login?token=JWT_TOKEN</code></li>
              <li>Frontend calls POST <code className="text-blue-300">/v1/auth/google/callback</code> with credential</li>
              <li>Backend returns JWT token with user info and role (entity/subentity)</li>
              <li>Token is stored and used for subsequent API calls</li>
            </ol>
          </p>
        </div>
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
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-2">Google Sign-In Callback</h3>
            <CodeBlock code={googleAuthExample} title="JavaScript" />
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

