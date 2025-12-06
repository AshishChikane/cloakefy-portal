import { useState, useEffect } from 'react';
import { Entity, SubUser, Transaction, CreateSubUserRequest, TransferRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { SubUsersList } from './SubUsersList';
import { TransferForm } from './TransferForm';
import { TransactionHistory } from './TransactionHistory';
import { getSubUsers, getTransactions, getEntityBalance, createSubUser, createTransfer } from '@/services/api';
import { toast } from 'sonner';
import { Copy, RefreshCw, ArrowLeft, Loader2, Wallet } from 'lucide-react';

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
      const tx = await createTransfer(data);
      setTransactions([tx, ...transactions]);
      const balance = await getEntityBalance(entity.id);
      onEntityUpdate({ ...entity, balance });
      toast.success('Transfer completed successfully');
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
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Entities
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{entity.name}</h2>
          <span className="text-sm text-muted-foreground">{entity.type}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left column - Wallet Info */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Entity Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Smart Wallet Address</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-foreground bg-secondary/50 px-3 py-1.5 rounded flex-1 overflow-hidden">
                    {shortAddress}
                  </code>
                  <Button size="icon" variant="outline" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Base Token</p>
                <p className="text-foreground font-medium">{entity.baseToken}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Balance</p>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold text-foreground">
                    {entity.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className="text-lg text-muted-foreground">{entity.baseToken}</span>
                </div>
              </div>
              
              <Button variant="outline" onClick={refreshBalance} disabled={refreshingBalance}>
                {refreshingBalance ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh Balance
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Fund this wallet from your preferred Avalanche wallet. Balances are updated when you click 'Refresh Balance'.
              </p>
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
      <div className="glass-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Transaction History</h3>
        <TransactionHistory transactions={transactions} loading={loadingTransactions} />
      </div>
    </div>
  );
}
