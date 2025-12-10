import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { SubEntitySidebar } from '@/components/platform/SubEntitySidebar';
import { SubUser, Transaction } from '@/types/api';
import { getAllSubUsers, depositToEntity, withdrawFromEntity, getTransactions } from '@/services/api';
import { Button } from '@/components/ui/button';
import { DepositWithdrawCard } from '@/components/platform/DepositWithdrawCard';
import { TransactionHistory } from '@/components/platform/TransactionHistory';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Wallet, Copy, RefreshCw, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubEntityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subUser, setSubUser] = useState<SubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    if (id) {
      loadSubUserData();
    }
  }, [id]);

  useEffect(() => {
    if (subUser?.id) {
      loadTransactions();
    }
  }, [subUser?.id]);

  const loadSubUserData = async () => {
    setLoading(true);
    try {
      const subUsers = await getAllSubUsers();
      const found = subUsers.find(su => su.id === id);
      if (found) {
        setSubUser(found);
      } else {
        toast.error('Sub-user not found');
        navigate('/platform');
      }
    } catch (error) {
      toast.error('Failed to load sub-user data');
      navigate('/platform');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!subUser?.id) return;
    
    setLoadingTransactions(true);
    try {
      const txns = await getTransactions(subUser.id);
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      // Don't show error toast, just log it
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const refreshBalance = async () => {
    setRefreshingBalance(true);
    try {
      await loadSubUserData();
      await loadTransactions(); // Also refresh transactions
      toast.success('Balance refreshed');
    } catch (error) {
      toast.error('Failed to refresh balance');
    } finally {
      setRefreshingBalance(false);
    }
  };

  const copyAddress = () => {
    if (subUser?.walletAddress) {
      navigator.clipboard.writeText(subUser.walletAddress);
      toast.success('Address copied to clipboard');
    }
  };

  const shortAddress = subUser?.walletAddress
    ? `${subUser.walletAddress.slice(0, 6)}...${subUser.walletAddress.slice(-4)}`
    : '';

  const handleDeposit = async (amount: number) => {
    try {
      // For sub-entity, use their sub-entity ID for deposit
      if (subUser?.id) {
        await depositToEntity(subUser.id, amount);
        await refreshBalance();
        await loadTransactions(); // Refresh transactions after deposit
        toast.success('Deposit successful');
      } else {
        toast.error('Sub-user ID not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to deposit');
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      // For sub-entity, use their sub-entity ID for withdraw
      if (subUser?.id) {
        await withdrawFromEntity(subUser.id, amount);
        await refreshBalance();
        await loadTransactions(); // Refresh transactions after withdraw
        toast.success('Withdraw successful');
      } else {
        toast.error('Sub-user ID not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to withdraw');
    }
  };

  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
          <DashboardBackground />
          <div className="relative z-10 flex items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!subUser) {
    return null;
  }

  // Determine base token from wallet balance
  const baseToken = subUser.walletBalance?.eusdc ? 'eUSDC' : 
                    subUser.walletBalance?.eusdt ? 'eUSDT' : 'eAVAX';

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
        <DashboardBackground />
        <div className="relative z-10 flex w-full">
          <SubEntitySidebar 
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          
          <div className="flex-1 lg:ml-72">
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
              {/* Mobile menu button */}
              <button
                className="lg:hidden mb-4 p-2.5 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/platform')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sub Users
            </Button>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {subUser.name}
              </h1>
              {subUser.email_id && (
                <p className="text-sm text-muted-foreground">{subUser.email_id}</p>
              )}
            </div>

            {/* Top Section: Wallet Info and Deposit/Withdraw */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Wallet Information Card */}
              <div className="glass-card p-4 sm:p-6 hover:border-primary/30 transition-all border-border h-[470px] flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 flex-shrink-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Wallet Information</h3>
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
                
                <div className="space-y-4 flex-1 overflow-y-auto min-h-0">
                  {/* Wallet Address */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Wallet Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-foreground bg-secondary/50 px-3 py-2 rounded-lg flex-1 border border-border/50 break-all">
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

                  {/* Wallet Balances */}
                  {subUser.walletBalance && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-3">Wallet Balances</p>
                      <div className="space-y-3">
                        {subUser.walletBalance.avax && (
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm font-medium text-foreground">AVAX</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {parseFloat(subUser.walletBalance.avax.balance || '0').toFixed(4)}
                            </span>
                          </div>
                        )}
                        {subUser.walletBalance.eusdc && (
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-foreground">e.USDC</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {parseFloat(subUser.walletBalance.eusdc.encryptedBalance || '0').toFixed(2)}
                              </span>
                              {subUser.walletBalance.eusdc.tokenBalance && parseFloat(subUser.walletBalance.eusdc.tokenBalance) > 0 && (
                                <span className="text-xs text-blue-400/70">
                                  ({parseFloat(subUser.walletBalance.eusdc.tokenBalance).toFixed(2)} USDC)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {subUser.walletBalance.eusdt && (
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-foreground">e.USDT</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {parseFloat(subUser.walletBalance.eusdt.encryptedBalance || '0').toFixed(2)}
                              </span>
                              {subUser.walletBalance.eusdt.tokenBalance && parseFloat(subUser.walletBalance.eusdt.tokenBalance) > 0 && (
                                <span className="text-xs text-green-400/70">
                                  ({parseFloat(subUser.walletBalance.eusdt.tokenBalance).toFixed(2)} USDT)
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DepositWithdrawCard
                entityId={subUser.id}
                baseToken={baseToken}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
            </div>

            {/* Transaction History Section */}
            <div className="glass-card p-4 sm:p-6 border-border">
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-4">Transaction History</h3>
              <TransactionHistory transactions={transactions} loading={loadingTransactions} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

