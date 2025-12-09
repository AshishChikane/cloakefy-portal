import { useState } from 'react';
import { BaseToken } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { depositToEntity, withdrawFromEntity } from '@/services/api';

interface DepositWithdrawCardProps {
  entityId: string;
  baseToken: BaseToken;
  onDeposit?: (amount: number) => Promise<void>;
  onWithdraw?: (amount: number) => Promise<void>;
}

export function DepositWithdrawCard({ entityId, baseToken, onDeposit, onWithdraw }: DepositWithdrawCardProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  // Get display token name based on tab
  // Deposit: Show regular token (USDC)
  // Withdraw: Show encrypted token (e.USDC)
  const getDisplayToken = (): string => {
    if (activeTab === 'deposit') {
      // For deposit, show regular token (remove 'e' prefix)
      if (baseToken === 'eUSDC') return 'USDC';
      if (baseToken === 'eUSDT') return 'USDT';
      if (baseToken === 'eAVAX') return 'AVAX';
      return baseToken as string; // Type assertion for TypeScript
    } else {
      // For withdraw, show encrypted token with dot (e.USDC)
      if (baseToken === 'eUSDC') return 'e.USDC';
      if (baseToken === 'eUSDT') return 'e.USDT';
      if (baseToken === 'eAVAX') return 'e.AVAX';
      return baseToken;
    }
  };

  const displayToken = getDisplayToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      if (activeTab === 'deposit') {
        // Call the deposit API
        await depositToEntity(entityId, numAmount);
        toast.success(`Successfully deposited ${numAmount} ${displayToken}`);
        // Call onDeposit callback if provided (for refreshing entity data)
        if (onDeposit) {
          await onDeposit(numAmount);
        }
      } else {
        // Call the withdraw API
        await withdrawFromEntity(entityId, numAmount);
        toast.success(`Successfully withdrew ${numAmount} ${displayToken}`);
        // Call onWithdraw callback if provided (for refreshing entity data)
        if (onWithdraw) {
          await onWithdraw(numAmount);
        }
      }
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || `${activeTab === 'deposit' ? 'Deposit' : 'Withdraw'} failed`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all h-[470px] flex flex-col border-border">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">Deposit & Withdraw</h3>
        <p className="text-xs text-muted-foreground">Manage funds for this entity</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 p-1 bg-secondary/30 rounded-lg">
        <button
          onClick={() => {
            setActiveTab('deposit');
            setAmount('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'deposit'
              ? 'bg-primary text-black shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" />
          Deposit
        </button>
        <button
          onClick={() => {
            setActiveTab('withdraw');
            setAmount('');
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
            activeTab === 'withdraw'
              ? 'bg-primary text-black shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" />
          Withdraw
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground font-medium text-sm sm:text-base">
            Amount ({displayToken})
          </Label>
          <Input
            id="amount"
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter amount in ${displayToken}`}
            required
            className="bg-secondary/50 border-border h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>

        <div className="mt-auto">
          <Button
            type="submit"
            className="w-full font-semibold text-sm sm:text-base"
            disabled={processing || !amount || parseFloat(amount) <= 0}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                {activeTab === 'deposit' ? (
                  <>
                    <ArrowDownCircle className="w-4 h-4 mr-2" />
                    Deposit {displayToken}
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                    Withdraw {displayToken}
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {activeTab === 'deposit' && (
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> Deposit funds to this entity's smart wallet. 
              The funds will be available for distribution to sub-users.
            </p>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
              <strong className="text-foreground">Note:</strong> Withdraw funds from this entity's smart wallet. 
              Make sure you have sufficient balance before withdrawing.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

