import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { SubEntitySidebar } from '@/components/platform/SubEntitySidebar';
import { SubUser, Transaction } from '@/types/api';
import { getAllSubUsers, depositToSubEntity, withdrawFromSubEntity, getTransactions, getSubUserPrivateKey, getBalanceByWalletAddress, transferToExternalWallet } from '@/services/api';
import { Button } from '@/components/ui/button';
import { DepositWithdrawCard } from '@/components/platform/DepositWithdrawCard';
import { TransactionHistory } from '@/components/platform/TransactionHistory';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Users, Wallet, Copy, RefreshCw, Menu, Key, Eye, EyeOff, Check, Send, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubEntityPlatform() {
  const [subUser, setSubUser] = useState<SubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshingBalance, setRefreshingBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [privateKeyModalOpen, setPrivateKeyModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loadingPrivateKey, setLoadingPrivateKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferToken, setTransferToken] = useState<'USDC' | 'AVAX'>('USDC');
  const [transferring, setTransferring] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);

  useEffect(() => {
    loadSubUserData();
  }, []);

  useEffect(() => {
    if (subUser?.id) {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subUser?.id]);

  const loadSubUserData = async () => {
    setLoading(true);
    try {
      const data = await getAllSubUsers();
      if (data.length > 0) {
        setSubUser(data[0]); // Get the first (and likely only) sub-user
      } else {
        toast.error('No sub-user found');
      }
    } catch (error) {
      toast.error('Failed to load sub-user data');
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
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const refreshBalance = async () => {
    setRefreshingBalance(true);
    try {
      // Fetch fresh balance using wallet address API
      if (subUser?.walletAddress) {
        const walletBalance = await getBalanceByWalletAddress(subUser.walletAddress);
        
        // Update sub-user data with fresh balance
        const updatedSubUser: SubUser = {
          ...subUser,
          walletBalance: walletBalance,
        };
        
        setSubUser(updatedSubUser);
        
        // Also refresh transactions
        await loadTransactions();
        
        toast.success('Balance refreshed');
      } else {
        toast.error('Wallet address not found');
      }
    } catch (error: any) {
      console.error('Error refreshing balance:', error);
      toast.error(error.message || 'Failed to refresh balance');
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

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      setCopied(true);
      toast.success('Private key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPrivateKey = async () => {
    if (!subUser?.id) {
      toast.error('Sub-user ID not found');
      return;
    }

    setPrivateKeyModalOpen(true);
    setPrivateKey(null);
    setShowPrivateKey(false);
    setLoadingPrivateKey(true);

    try {
      const key = await getSubUserPrivateKey(subUser.id);
      setPrivateKey(key);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch private key');
      setPrivateKeyModalOpen(false);
    } finally {
      setLoadingPrivateKey(false);
    }
  };

  const maskPrivateKey = (key: string) => {
    if (key.length <= 8) return '•'.repeat(key.length);
    return `${key.slice(0, 4)}${'•'.repeat(key.length - 8)}${key.slice(-4)}`;
  };

  const shortAddress = subUser?.walletAddress
    ? `${subUser.walletAddress.slice(0, 6)}...${subUser.walletAddress.slice(-4)}`
    : '';

  const handleDeposit = async (amount: number) => {
    try {
      if (subUser?.id) {
        await depositToSubEntity(subUser.id, amount);
        await refreshBalance();
        await loadTransactions();
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
      if (subUser?.id) {
        await withdrawFromSubEntity(subUser.id, amount);
        await refreshBalance();
        await loadTransactions();
        toast.success('Withdraw successful');
      } else {
        toast.error('Sub-user ID not found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to withdraw');
    }
  };

  const handleTransferToExternal = async () => {
    if (!subUser?.id) {
      toast.error('Sub-user ID not found');
      return;
    }

    if (!transferAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    if (!transferAddress.startsWith('0x') || transferAddress.length !== 42) {
      toast.error('Please enter a valid Ethereum/Avalanche wallet address');
      return;
    }

    const numAmount = parseFloat(transferAmount);
    if (!transferAmount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check balance
    if (transferToken === 'USDC' && subUser.walletBalance?.eusdc) {
      const availableBalance = parseFloat(subUser.walletBalance.eusdc.tokenBalance || '0');
      if (numAmount > availableBalance) {
        toast.error(`Insufficient balance. Available: ${availableBalance.toFixed(2)} USDC`);
        return;
      }
    } else if (transferToken === 'AVAX' && subUser.walletBalance?.avax) {
      const availableBalance = parseFloat(subUser.walletBalance.avax.balance || '0');
      if (numAmount > availableBalance) {
        toast.error(`Insufficient balance. Available: ${availableBalance.toFixed(4)} AVAX`);
        return;
      }
    }

    setTransferring(true);
    try {
      const result = await transferToExternalWallet(
        subUser.id,
        transferAddress.trim(),
        transferAmount,
        transferToken
      );

      if (result === true) {
        // Payment required (statusCode 402)
        setNeedsPayment(true);
        toast.info('Please proceed with payment to complete the transfer');
      } else {
        // Transfer completed successfully
        toast.success(`Successfully transferred ${transferAmount} ${transferToken} to ${transferAddress.slice(0, 6)}...${transferAddress.slice(-4)}`);
        setTransferModalOpen(false);
        setTransferAddress('');
        setTransferAmount('');
        setNeedsPayment(false);
        await refreshBalance();
        await loadTransactions();
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to transfer funds');
      setNeedsPayment(false);
    } finally {
      setTransferring(false);
    }
  };

  const handleProceedWithPayment = async () => {
    if (!subUser?.id) {
      toast.error('Sub-user ID not found');
      return;
    }

    setTransferring(true);
    try {
      // Call the API again with payment header (if needed)
      // For now, we'll just retry the same call
      const result = await transferToExternalWallet(
        subUser.id,
        transferAddress.trim(),
        transferAmount,
        transferToken
      );

      if (result === true) {
        toast.info('Payment processed. Transfer is being completed...');
        // Wait a bit and refresh
        setTimeout(async () => {
          await refreshBalance();
          await loadTransactions();
          setTransferModalOpen(false);
          setTransferAddress('');
          setTransferAmount('');
          setNeedsPayment(false);
        }, 2000);
      } else {
        toast.success(`Successfully transferred ${transferAmount} ${transferToken} to ${transferAddress.slice(0, 6)}...${transferAddress.slice(-4)}`);
        setTransferModalOpen(false);
        setTransferAddress('');
        setTransferAmount('');
        setNeedsPayment(false);
        await refreshBalance();
        await loadTransactions();
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to complete transfer');
    } finally {
      setTransferring(false);
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
                <div className="glass-card p-8 sm:p-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Sub User Found</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have a sub-user account assigned yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
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
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleExportPrivateKey}
                        className="group flex-1 sm:flex-none"
                      >
                        <Key className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Export Key
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={refreshBalance} 
                        disabled={refreshingBalance}
                        className="group flex-1 sm:flex-none"
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
                          {/* USDC Balance */}
                          {subUser.walletBalance.eusdc && (
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30 border border-border/50">
                              <div className="flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground">USDC</span>
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {subUser.walletBalance.eusdc.tokenBalance 
                                  ? parseFloat(subUser.walletBalance.eusdc.tokenBalance).toFixed(2)
                                  : '0.00'}
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

                    {/* Transfer to External Wallet Button */}
                    <div className="pt-2 border-t border-border/50">
                      <Button
                        onClick={() => setTransferModalOpen(true)}
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black font-semibold"
                        size="sm"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send to External Wallet
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Transfer USDC or AVAX to any external wallet
                      </p>
                    </div>
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

      {/* Private Key Export Modal */}
      <Dialog open={privateKeyModalOpen} onOpenChange={setPrivateKeyModalOpen}>
        <DialogContent className="bg-card border-border max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30 flex-shrink-0">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
              <DialogTitle className="text-foreground text-lg sm:text-xl">Private Key</DialogTitle>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              ⚠️ Keep this private key secure. Never share it with anyone.
            </p>
          </DialogHeader>
          
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            {loadingPrivateKey ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : privateKey ? (
              <>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="p-3 sm:p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border-2 border-yellow-500/30 relative overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                        }} />
                      </div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <Label className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">
                            Private Key
                          </Label>
                          <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="p-1.5 hover:bg-yellow-500/20 rounded-md transition-colors"
                          >
                            {showPrivateKey ? (
                              <EyeOff className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </button>
                        </div>
                        
                        <div className="relative">
                          <code className="text-xs sm:text-sm font-mono text-foreground break-all block p-2.5 sm:p-3 bg-background/50 rounded-md border border-yellow-500/20">
                            {showPrivateKey ? privateKey : maskPrivateKey(privateKey)}
                          </code>
                          
                          {/* Shimmer effect */}
                          {!showPrivateKey && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-pulse rounded-md" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                      ⚠️ Security Warning: Anyone with access to this private key can control the wallet. Store it securely and never share it.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    onClick={copyPrivateKey}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold text-sm sm:text-base"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Private Key
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-sm sm:text-base"
                    onClick={() => {
                      setPrivateKeyModalOpen(false);
                      setShowPrivateKey(false);
                      setPrivateKey(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">Failed to load private key</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer to External Wallet Modal */}
      <Dialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="bg-card border-border max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30 flex-shrink-0">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <DialogTitle className="text-foreground text-lg sm:text-xl">Transfer to External Wallet</DialogTitle>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Send USDC or AVAX to any external wallet address
            </p>
          </DialogHeader>
          
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            {needsPayment ? (
              <>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">
                    Payment Required
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please proceed with payment to complete the transfer of {transferAmount} {transferToken} to {transferAddress.slice(0, 6)}...{transferAddress.slice(-4)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleProceedWithPayment}
                    disabled={transferring}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {transferring ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Proceed with Payment
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNeedsPayment(false);
                      setTransferAddress('');
                      setTransferAmount('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Token Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-foreground font-medium text-sm">
                      Select Token
                    </Label>
                    <Select value={transferToken} onValueChange={(value: 'USDC' | 'AVAX') => setTransferToken(value)}>
                      <SelectTrigger className="bg-secondary/50 border-border h-10 sm:h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="AVAX">AVAX</SelectItem>
                      </SelectContent>
                    </Select>
                    {transferToken === 'USDC' && subUser.walletBalance?.eusdc && (
                      <p className="text-xs text-muted-foreground">
                        Available: {parseFloat(subUser.walletBalance.eusdc.tokenBalance || '0').toFixed(2)} USDC
                      </p>
                    )}
                    {transferToken === 'AVAX' && subUser.walletBalance?.avax && (
                      <p className="text-xs text-muted-foreground">
                        Available: {parseFloat(subUser.walletBalance.avax.balance || '0').toFixed(4)} AVAX
                      </p>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground font-medium text-sm">
                      Recipient Wallet Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={transferAddress}
                      onChange={(e) => setTransferAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-secondary/50 border-border h-10 sm:h-11 font-mono text-xs sm:text-sm"
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-foreground font-medium text-sm">
                      Amount ({transferToken})
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="any"
                      min="0"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder={`Enter amount in ${transferToken}`}
                      className="bg-secondary/50 border-border h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button
                    onClick={handleTransferToExternal}
                    disabled={transferring || !transferAddress.trim() || !transferAmount || parseFloat(transferAmount) <= 0}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {transferring ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Transfer {transferToken}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTransferModalOpen(false);
                      setTransferAddress('');
                      setTransferAmount('');
                      setNeedsPayment(false);
                      setTransferring(false);
                    }}
                    className="flex-1"
                    disabled={transferring}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

