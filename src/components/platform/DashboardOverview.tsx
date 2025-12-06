import { Entity, Transaction } from '@/types/api';
import { Building2, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardOverviewProps {
  entities: Entity[];
  transactions: Transaction[];
  loading: boolean;
}

export function DashboardOverview({ entities, transactions, loading }: DashboardOverviewProps) {
  const totalBalance = entities.reduce((sum, e) => sum + e.balance, 0);
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(tx => tx.status === 'Completed').length;
  const pendingTransactions = transactions.filter(tx => tx.status === 'Pending').length;
  
  const stats = [
    {
      label: 'Total Entities',
      value: entities.length,
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20',
    },
    {
      label: 'Total Balance',
      value: `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AVAX`,
      icon: Wallet,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
    },
    {
      label: 'Total Transactions',
      value: totalTransactions,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
    },
    {
      label: 'Success Rate',
      value: totalTransactions > 0 ? `${Math.round((completedTransactions / totalTransactions) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/20',
      subValue: `${completedTransactions} completed`,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-3 sm:p-4 animate-pulse">
            <div className="h-3 w-20 bg-secondary rounded mb-2" />
            <div className="h-5 w-24 bg-secondary rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`} />
              </div>
              {stat.subValue && (
                <div className="text-xs text-muted-foreground font-medium hidden sm:block">
                  {stat.subValue}
                </div>
              )}
            </div>
            
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-0.5">{stat.label}</p>
              <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors break-words">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

