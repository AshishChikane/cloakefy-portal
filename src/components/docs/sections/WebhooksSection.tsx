import { CodeBlock } from '../CodeBlock';

export function WebhooksSection() {
  const webhookPayload = `{
  "event": "transfer.completed",
  "data": {
    "id": "tx_def456",
    "entityId": "ent_abc123",
    "amount": 50,
    "token": "eAVAX",
    "status": "Completed",
    "txHash": "0x789abc...",
    "timestamp": "2024-01-15T12:00:00Z"
  },
  "signature": "sha256=..."
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Webhooks</h1>
        <p className="text-muted-foreground">
          Receive real-time notifications about events in your Cloakefy account.
        </p>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Available Events</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded text-primary">entity.created</code>
            <span>- When a new entity is created</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded text-primary">sub_user.created</code>
            <span>- When a new sub user is added</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded text-primary">transfer.pending</code>
            <span>- When a transfer is initiated</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded text-primary">transfer.completed</code>
            <span>- When a transfer is completed</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="text-xs bg-secondary/50 px-2 py-0.5 rounded text-primary">transfer.failed</code>
            <span>- When a transfer fails</span>
          </li>
        </ul>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Example Webhook Payload</h3>
        <CodeBlock code={webhookPayload} title="POST to your webhook URL" />
      </div>
      
      <div className="glass-card p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Coming Soon:</strong> Webhook configuration will be available 
          in the dashboard settings.
        </p>
      </div>
    </div>
  );
}
