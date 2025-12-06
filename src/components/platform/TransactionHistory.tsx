import { Transaction } from '@/types/api';
import { ExternalLink, Loader2, History } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const shortHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;

  const statusColor = {
    Pending: 'text-yellow-400 bg-yellow-400/10',
    Completed: 'text-green-400 bg-green-400/10',
    Failed: 'text-red-400 bg-red-400/10',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date/Time</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">To</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tx Hash</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/20">
              <td className="py-3 px-4 text-sm text-foreground">
                {format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm text-foreground">{tx.toName}</p>
                  <p className="text-xs text-muted-foreground">{shortAddress(tx.toAddress)}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-sm font-medium text-foreground">
                  {tx.amount} {tx.token}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[tx.status]}`}>
                  {tx.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <a
                  href={`https://snowtrace.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {shortHash(tx.txHash)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
