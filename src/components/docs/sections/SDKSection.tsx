import { CodeBlock } from '../CodeBlock';

export function SDKSection() {
  const installCode = `npm install @cloakefy/sdk
# or
yarn add @cloakefy/sdk`;

  const initCode = `import { CloakefyClient } from '@cloakefy/sdk';

const client = new CloakefyClient({
  apiKey: process.env.CLOAKEFY_API_KEY,
});`;

  const usageExample = `// Create an entity
const entity = await client.entities.create({
  name: 'My DAO Treasury',
  type: 'DAO',
  baseToken: 'eAVAX',
});

// Add a sub user
const subUser = await client.subUsers.create(entity.id, {
  name: 'Alice Johnson',
  role: 'Core Contributor',
  walletAddress: '0x1234...',
});

// Create a transfer
const transfer = await client.transfers.create({
  entityId: entity.id,
  subUserId: subUser.id,
  amount: 50,
  token: 'eAVAX',
});

console.log('Transfer completed:', transfer.txHash);`;

  const typesExample = `import type {
  Entity,
  SubUser,
  Transaction,
  CreateEntityRequest,
  CreateSubUserRequest,
  TransferRequest,
} from '@cloakefy/sdk';

// Full TypeScript support
const entity: Entity = await client.entities.get('ent_abc123');`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">SDK Usage</h1>
        <p className="text-muted-foreground">
          Use our JavaScript/TypeScript SDK for easier integration with Cloakefy.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Installation</h3>
        <CodeBlock code={installCode} title="Terminal" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Initialization</h3>
        <CodeBlock code={initCode} title="JavaScript/TypeScript" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Usage Example</h3>
        <CodeBlock code={usageExample} title="JavaScript/TypeScript" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">TypeScript Support</h3>
        <CodeBlock code={typesExample} title="TypeScript" />
      </div>
      
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> The SDK package is currently in development. 
          Check back soon for the official release.
        </p>
      </div>
    </div>
  );
}
