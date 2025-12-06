import { useState, useEffect } from 'react';
import { Entity, SubUser, Transaction, CreateSubUserRequest, TransferRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { SubUsersList } from './SubUsersList';
import { TransferForm } from './TransferForm';
import { TransactionHistory } from './TransactionHistory';
import { getSubUsers, getTransactions, getEntityBalance, createSubUser, createTransfer } from '@/services/api';
import { toast } from 'sonner';
import { Copy, RefreshCw, ArrowLeft, Loader2, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EntityDetailProps {
  entity: Entity;
  onBack: () => void;
  onEntityUpdate: (entity: Entity) => void;
}

export function EntityDetail({ entity, onBack, onEntityUpdate }: EntityDetailProps) {
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingSubUsers, setLoadingSubUsers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [refreshingBalance, setRefreshingBalance] = useState(false);

  useEffect(() => {
    loadData();
  }, [entity.id]);

  const loadData = async () => {
    setLoadingSubUsers(true);
    setLoadingTransactions(true);
    
    try {
      const [usersData, txData] = await Promise.all([
        getSubUsers(entity.id),
        getTransactions(entity.id),
      ]);
      setSubUsers(usersData);
      setTransactions(txData);
    } catch (error) {
      toast.error('Failed to load entity data');
    } finally {
      setLoadingSubUsers(false);
      setLoadingTransactions(false);
    }
  };

  const refreshBalance = async () => {
    setRefreshingBalance(true);
    try {
      const balance = await getEntityBalance(entity.id);
      onEntityUpdate({ ...entity, balance });
      toast.success('Balance refreshed');
    } catch (error) {
      toast.error('Failed to refresh balance');
    } finally {
      setRefreshingBalance(false);
    }
  };

  const handleAddSubUser = async (data: CreateSubUserRequest) => {
    try {
      const newUser = await createSubUser(entity.id, data);
      setSubUsers([...subUsers, newUser]);
      toast.success('Sub user added successfully');
    } catch (error) {
      toast.error('Failed to add sub user');
      throw error;
    }
  };

  const handleTransfer = async (data: TransferRequest) => {
    try {
      const txs = await createTransfer(data);
      setTransactions([...txs, ...transactions]);
      const balance = await getEntityBalance(entity.id);
      onEntityUpdate({ ...entity, balance });
      toast.success(`Successfully sent ${txs.length} transfer${txs.length !== 1 ? 's' : ''} to ${txs.length} recipient${txs.length !== 1 ? 's' : ''}`);
    } catch (error: any) {
      toast.error(error.message || 'Transfer failed');
      throw error;
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(entity.smartWalletAddress);
    toast.success('Address copied to clipboard');
  };

  const shortAddress = `${entity.smartWalletAddress.slice(0, 10)}...${entity.smartWalletAddress.slice(-8)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Entities
      </button>

      {/* Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-border/50">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center border border-primary/20">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-50" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 truncate">{entity.name}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {entity.type}
            </span>
            <span className="text-xs text-muted-foreground">Entity Details</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Balance</span>
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-base sm:text-lg font-bold text-foreground">
              {entity.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-muted-foreground font-medium">{entity.baseToken}</span>
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sub Users</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground">{subUsers.length}</p>
        </div>
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Transactions</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground">{transactions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Left column - Wallet Info */}
        <div className="space-y-4">
          <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-bold text-foreground">Wallet Information</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshBalance} 
                disabled={refreshingBalance}
                className="group w-full sm:w-auto"
              >
                {refreshingBalance ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Smart Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-foreground bg-secondary/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex-1 border border-border/50 break-all">
                    {shortAddress}
                  </code>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={copyAddress}
                    className="h-8 w-8 hover:bg-primary/10 hover:border-primary/30 flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Base Token</p>
                <p className="text-sm font-semibold text-foreground">{entity.baseToken}</p>
              </div>
              
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Fund this wallet from your preferred Avalanche wallet. 
                  Balances are updated when you click 'Refresh Balance'.
                </p>
              </div>
            </div>
          </div>
          
          <TransferForm
            subUsers={subUsers}
            baseToken={entity.baseToken}
            entityId={entity.id}
            onTransfer={handleTransfer}
          />
        </div>
        
        {/* Right column - Sub Users */}
        <div>
          <SubUsersList
            subUsers={subUsers}
            loading={loadingSubUsers}
            onAddSubUser={handleAddSubUser}
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
        <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4">Transaction History</h3>
        <TransactionHistory transactions={transactions} loading={loadingTransactions} />
      </div>
    </motion.div>
  );
}
