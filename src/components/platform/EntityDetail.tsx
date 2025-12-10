import { useState, useEffect, useRef } from 'react';
import { Entity, SubUser, CreateSubUserRequest, TransferRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { SubUsersList } from './SubUsersList';
import { TransferForm } from './TransferForm';
import { TransactionHistory, TransactionHistoryRef } from './TransactionHistory';
import { DepositWithdrawCard } from './DepositWithdrawCard';
import { getSubUsers, getEntityBalance, createSubUser, getEntity, resendVerification } from '@/services/api';
import { toast } from 'sonner';
import { Copy, RefreshCw, ArrowLeft, Loader2, Wallet, TrendingUp, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EntityDetailProps {
  entity: Entity;
  onBack: () => void;
  onEntityUpdate: (entity: Entity) => void;
}

export function EntityDetail({ entity, onBack, onEntityUpdate }: EntityDetailProps) {
  const [subUsers, setSubUsers] = useState([]);
  const [loadingSubUsers, setLoadingSubUsers] = useState(true);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [entityData, setEntityData] = useState<Entity>(entity);
  const transactionHistoryRef = useRef<TransactionHistoryRef>(null);
  
  useEffect(() => {
    loadData();
    loadEntityData();
    let jwt = localStorage.getItem('platform_user');
    // console.log({jwt})
    // localStorage.setItem('api_key', 'd9f7643f93827e7224d76fabfac42b430500e4d9aa0ab7a61597900c5a6a88a5');
  }, [entity.id]);

  useEffect(() => {
    setEntityData(entity);
  }, [entity]);

  const loadData = async () => {
    setLoadingSubUsers(true);
    
    try {
      const usersData = await getSubUsers(entity.id);
      setSubUsers(usersData);
    } catch (error) {
      toast.error('Failed to load sub users');
    } finally {
      setLoadingSubUsers(false);
    }
  };

  const loadEntityData = async () => {
    try {
      const updatedEntity = await getEntity(entity.id);
      if (updatedEntity) {
        setEntityData(updatedEntity);
        onEntityUpdate(updatedEntity);
      }
    } catch (error) {
      console.error('Error loading entity data:', error);
    }
  };

  const refreshBalance = async () => {
    setRefreshingBalance(true);
    try {
      await loadEntityData();
      toast.success('Balance refreshed');
    } catch (error) {
      toast.error('Failed to refresh balance');
    } finally {
      setRefreshingBalance(false);
    }
  };

  const handleResendVerification = async () => {
    setSendingVerification(true);
    try {
      await resendVerification(entity.id);
      toast.success('Verification email sent successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  const getIsRegistered = (): boolean => {
    if (!entityData.walletBalance) return false;
    
    if (entityData.baseToken === 'eUSDC') {
      return entityData.walletBalance.eusdc?.isRegistered ?? false;
    } else if (entityData.baseToken === 'eUSDT') {
      return entityData.walletBalance.eusdt?.isRegistered ?? false;
    } else if (entityData.baseToken === 'eAVAX') {
      return true;
    }
    
    return false;
  };

  const handleAddSubUser = async (data: CreateSubUserRequest) => {
    try {
      const newUser = await createSubUser(entity.id, data);
      setSubUsers([...subUsers, newUser]);
      toast.success('Sub user added successfully');
      const updatedSubUsers = await getSubUsers(entity.id);
      setSubUsers(updatedSubUsers);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add sub user';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleTransfer = async (data: TransferRequest) => {
    try {
      await loadEntityData();
      
      // Refresh transaction history to show the latest transaction
      if (transactionHistoryRef.current) {
        await transactionHistoryRef.current.refresh();
      }
      
      toast.success('Transfer completed successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to refresh data after transfer');
      throw error;
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(entityData.smartWalletAddress);
    toast.success('Address copied to clipboard');
  };

  const shortAddress = `${entityData.smartWalletAddress.slice(0, 10)}...${entityData.smartWalletAddress.slice(-8)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Entities
      </button>
      <div className="flex items-center gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-border/50">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center border border-primary/20">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-50" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 truncate">{entityData.name}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              {entityData.type}
            </span>
            <span className="text-xs text-muted-foreground">Entity Details</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Balance</span>
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-base sm:text-lg font-bold text-foreground">
              {(() => {
                if (entityData.walletBalance) {
                  if (entityData.baseToken === 'eUSDC' && entityData.walletBalance.eusdc) {
                    return parseFloat(entityData.walletBalance.eusdc.encryptedBalance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  } else if (entityData.baseToken === 'eUSDT' && entityData.walletBalance.eusdt) {
                    return parseFloat(entityData.walletBalance.eusdt.encryptedBalance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  } else if (entityData.baseToken === 'eAVAX' && entityData.walletBalance.avax) {
                    return parseFloat(entityData.walletBalance.avax.balance || '0').toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
                  }
                }
                return entityData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              })()}
            </p>
            <span className="text-xs text-muted-foreground font-medium">{entityData.baseToken}</span>
          </div>
        </div>
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sub Users</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground">{subUsers.length}</p>
        </div>
        <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Transactions</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground">-</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-4 flex flex-col">
          <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all h-[470px] border-border flex flex-col">
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
            
            <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
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
              {entityData.walletBalance && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Wallet Balances</p>
                  <div className="flex flex-wrap gap-2">
                    {entityData.walletBalance.avax && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/50 flex-shrink-0">
                        <Wallet className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground">AVAX</span>
                        <span className="text-xs font-semibold text-foreground">
                          {parseFloat(entityData.walletBalance.avax.balance || '0').toFixed(4)}
                        </span>
                      </div>
                    )}
                    {entityData.walletBalance.eusdc && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/50 flex-shrink-0">
                        <Wallet className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground">e.USDC</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-foreground">
                            {parseFloat(entityData.walletBalance.eusdc.encryptedBalance || '0').toFixed(2)}
                          </span>
                          {entityData.walletBalance.eusdc.tokenBalance && parseFloat(entityData.walletBalance.eusdc.tokenBalance) > 0 && (
                            <span className="text-xs text-blue-400/70">
                              ({parseFloat(entityData.walletBalance.eusdc.tokenBalance).toFixed(2)} USDC)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {entityData.walletBalance.eusdt && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/50 flex-shrink-0">
                        <Wallet className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-foreground">e.USDT</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-foreground">
                            {parseFloat(entityData.walletBalance.eusdt.encryptedBalance || '0').toFixed(2)}
                          </span>
                          {entityData.walletBalance.eusdt.tokenBalance && parseFloat(entityData.walletBalance.eusdt.tokenBalance) > 0 && (
                            <span className="text-xs text-green-400/70">
                              ({parseFloat(entityData.walletBalance.eusdt.tokenBalance).toFixed(2)} USDT)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!getIsRegistered() && (
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-start gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
                        Verification Required
                      </p>
                      <p className="text-xs text-orange-600/80 dark:text-orange-400/80 leading-relaxed mb-2">
                        Your {entityData.baseToken === 'eUSDC' ? 'e.USDC' : entityData.baseToken === 'eUSDT' ? 'e.USDT' : entityData.baseToken} token is not registered. Please verify your email to complete registration.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResendVerification}
                        disabled={sendingVerification}
                        className="w-full text-xs border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50"
                      >
                        {sendingVerification ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3 mr-2" />
                            Verify Again
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {getIsRegistered() && (
                <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">
                      Token Verified
                    </p>
                  </div>
                </div>
              )}
              
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Fund this wallet from your preferred Avalanche wallet. 
                  Balances are updated when you click 'Refresh Balance'.
                </p>
              </div>
            </div>
          </div>
          <DepositWithdrawCard
            entityId={entityData.id}
            baseToken={entityData.baseToken}
            onDeposit={async (amount) => {
              await loadEntityData();
            }}
            onWithdraw={async (amount) => {
              // TODO: Implement withdraw API call
              await refreshBalance();
            }}
          />
        </div>
        <div className="space-y-4 flex flex-col">
          <SubUsersList
            subUsers={subUsers}
            loading={loadingSubUsers}
            onAddSubUser={handleAddSubUser}
          />
          <TransferForm
            subUsers={subUsers}
            baseToken={entityData.baseToken}
            entityId={entityData.id}
            onTransfer={handleTransfer}
          />
        </div>
      </div>
      <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all border-border">
        <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 sm:mb-4">Transaction History</h3>
        <TransactionHistory ref={transactionHistoryRef} entityId={entityData.id} />
      </div>
    </motion.div>
  );
}
