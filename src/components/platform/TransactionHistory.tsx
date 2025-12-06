import { Transaction } from '@/types/api';
import { ExternalLink, Loader2, History, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
}

export function TransactionHistory({ transactions, loading }: TransactionHistoryProps) {
  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const shortHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-6)}`;

  const statusConfig = {
    Pending: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      icon: Clock,
    },
    Completed: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      icon: CheckCircle2,
    },
    Failed: {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      icon: XCircle,
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
          <History className="w-8 h-8 text-primary opacity-50" />
        </div>
        <p className="text-muted-foreground font-medium">No transactions yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Transactions will appear here once you start making transfers</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="space-y-2">
          {transactions.map((tx, index) => {
            const status = statusConfig[tx.status];
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card p-2.5 sm:p-3 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                  {/* Left side - Date and Recipient */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1 rounded-lg ${status.bgColor} border ${status.borderColor} flex-shrink-0`}>
                        <StatusIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${status.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{tx.toName}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{shortAddress(tx.toAddress)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(tx.timestamp), 'MMM d, yyyy • HH:mm')}
                    </p>
                  </div>

                  {/* Center - Amount */}
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {tx.amount} {tx.token}
                    </p>
                  </div>

                  {/* Right side - Status and Hash */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bgColor} ${status.color} border ${status.borderColor} whitespace-nowrap`}>
                      {tx.status}
                    </span>
                    <a
                      href={`https://snowtrace.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all duration-200 group/link flex-shrink-0 ml-auto sm:ml-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
