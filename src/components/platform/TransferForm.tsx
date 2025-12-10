import { useState } from 'react';
import { SubUser, BaseToken, TransferRequest, TransferRecipient } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, ArrowRight, Plus, X, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTransfer } from '@/services/api';
import { toast } from 'sonner';

interface TransferFormProps {
  subUsers: SubUser[];
  baseToken: BaseToken;
  entityId: string;
  onTransfer: (data: TransferRequest) => Promise<void>;
}

interface RecipientEntry {
  id: string;
  subUserId: string;
  amount: string;
}

export function TransferForm({ subUsers, baseToken, entityId, onTransfer }: TransferFormProps) {
  const [recipients, setRecipients] = useState<RecipientEntry[]>([
    { id: '1', subUserId: '', amount: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [pendingTransferData, setPendingTransferData] = useState<TransferRequest | null>(null);
 
  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now().toString(), subUserId: '', amount: '' }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const updateRecipient = (id: string, field: 'subUserId' | 'amount', value: string) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  // Get available sub-users (not already selected in other recipients)
  const getAvailableSubUsers = (currentRecipientId: string) => {
    // Get currently selected sub-user ID for this recipient (if any)
    const currentRecipient = recipients.find(r => r.id === currentRecipientId);
    const currentSelectedId = currentRecipient?.subUserId;
    
    // Get all sub-user IDs that are selected in OTHER recipients
    const selectedSubUserIds = recipients
      .filter(r => r.id !== currentRecipientId && r.subUserId)
      .map(r => r.subUserId);
    
    // Return all users that are either:
    // 1. Not selected in any other recipient, OR
    // 2. Currently selected in this recipient (so user can see their current selection)
    return subUsers.filter(user => 
      !selectedSubUserIds.includes(user.id) || user.id === currentSelectedId
    );
  };

  const getTotalAmount = () => {
    return recipients.reduce((sum, r) => {
      const amount = Number(r.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const isRecipientRegistered = (subUserId: string): boolean => {
    const user = subUsers.find(u => u.id === subUserId);
    if (!user || !user.walletBalance) return false;
    
    // Check registration status based on base token
    if (baseToken === 'eUSDC') {
      return user.walletBalance.eusdc?.isRegistered ?? false;
    } else if (baseToken === 'eUSDT') {
      return user.walletBalance.eusdt?.isRegistered ?? false;
    } else if (baseToken === 'eAVAX') {
      // AVAX doesn't have registration, so always return true
      return true;
    }
    
    return false;
  };

  const getUnregisteredRecipients = (): RecipientEntry[] => {
    return recipients.filter(r => {
      if (!r.subUserId || !r.amount || Number(r.amount) <= 0) return false;
      return !isRecipientRegistered(r.subUserId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validRecipients = recipients.filter(r => r.subUserId && r.amount && Number(r.amount) > 0);
    
    if (validRecipients.length === 0) {
      toast.error('Please add at least one valid recipient');
      return;
    }

    // Check if any recipient is not registered
    const unregisteredRecipients = validRecipients.filter(r => !isRecipientRegistered(r.subUserId));
    
    if (unregisteredRecipients.length > 0) {
      const unregisteredNames = unregisteredRecipients.map(r => {
        const user = subUsers.find(u => u.id === r.subUserId);
        return user?.name || 'Unknown';
      }).join(', ');
      
      toast.error(`Please verify the following recipients before transferring: ${unregisteredNames}`, {
        duration: 5000,
      });
      return;
    }
    
    setLoading(true);
    try {
      // If needsPayment is true, this is the second call with payment header
      if (needsPayment && pendingTransferData) {
        // Second API call: with x-payment: true header
        console.log('Making payment API call with x-payment header');
        const result = await createTransfer(pendingTransferData, subUsers, true);
        console.log({paymentResult: result, message: 'payment processed'});
        
        toast.success(`Successfully transferred to ${pendingTransferData.recipients.length} recipient${pendingTransferData.recipients.length !== 1 ? 's' : ''}`);
        
        // Call onTransfer callback if provided (for refreshing data)
        if (onTransfer) {
          await onTransfer(pendingTransferData);
        }
        
        // Reset form and state
        setRecipients([{ id: '1', subUserId: '', amount: '' }]);
        setNeedsPayment(false);
        setPendingTransferData(null);
      } else {
        // First API call: without payment header
        const transferData: TransferRequest = {
          entityId,
          recipients: validRecipients.map(r => ({
            subUserId: r.subUserId,
            amount: Number(r.amount),
          })),
          token: baseToken,
        };
        
        console.log('Making first API call without payment header');
        const result = await createTransfer(transferData, subUsers, false);
        console.log({firstCallResult: result});
        
        // If result is true (statusCode 402), show proceed and pay button
        if (result === true) {
          setNeedsPayment(true);
          setPendingTransferData(transferData);
          toast.info('Please proceed with payment to complete the transfer');
        } else {
          // Transfer completed successfully without payment
          toast.success(`Successfully transferred to ${validRecipients.length} recipient${validRecipients.length !== 1 ? 's' : ''}`);
          
          // Call onTransfer callback if provided (for refreshing data)
          if (onTransfer) {
            await onTransfer(transferData);
          }
          
          // Reset form
          setRecipients([{ id: '1', subUserId: '', amount: '' }]);
        }
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to create transfer');
      // Reset payment state on error
      setNeedsPayment(false);
      setPendingTransferData(null);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getTotalAmount();
  const hasValidRecipients = recipients.some(r => r.subUserId && r.amount && Number(r.amount) > 0);
  const hasUnregisteredRecipients = getUnregisteredRecipients().length > 0;

  return (
    <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all flex flex-col h-[470px] border-border">
      <div className="mb-3 sm:mb-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">Create Multi-Recipient Transfer</h3>
        </div>
        <p className="text-xs text-muted-foreground">Send encrypted payments to multiple recipients in one transaction</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col min-h-0">
        {getUnregisteredRecipients().length > 0 && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">
                Verification Required
              </p>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80">
                Some recipients need to verify their email before receiving transfers. Please verify them first.
              </p>
            </div>
          </div>
        )}
        <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto min-h-0 pr-1">
          <AnimatePresence>
            {recipients.map((recipient, index) => {
              const selectedUser = subUsers.find(u => u.id === recipient.subUserId);
              
              return (
                <motion.div
                  key={recipient.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-2.5 sm:p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Recipient {index + 1}</span>
                    </div>
                    {recipients.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecipient(recipient.id)}
                        className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-foreground font-medium text-xs">Recipient</Label>
                      <Select 
                        value={recipient.subUserId} 
                        onValueChange={(value) => updateRecipient(recipient.id, 'subUserId', value)}
                      >
                        <SelectTrigger className="bg-secondary/50 border-border h-9 sm:h-10 text-sm">
                          <SelectValue placeholder="Choose recipient" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {getAvailableSubUsers(recipient.id).map((user) => {
                            const isRegistered = isRecipientRegistered(user.id);
                            return (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center justify-between w-full gap-2">
                                  <div className="flex items-center gap-2">
                                    <span>{user.name}</span>
                                    {user.role && (
                                      <span className="text-xs text-muted-foreground">({user.role})</span>
                                    )}
                                  </div>
                                  {!isRegistered && (
                                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                      ⚠️ Verify
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                          {getAvailableSubUsers(recipient.id).length === 0 && (
                            <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                              No available recipients
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {selectedUser && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-mono">
                            {selectedUser.walletAddress.slice(0, 10)}...{selectedUser.walletAddress.slice(-8)}
                          </p>
                          {!isRecipientRegistered(recipient.subUserId) && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20">
                              <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                Verification required
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label className="text-foreground font-medium text-xs">Amount</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={recipient.amount}
                          onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="pr-12 sm:pr-14 h-9 sm:h-10 bg-secondary/50 border-border text-sm"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                          {baseToken}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 space-y-2.5 sm:space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={addRecipient}
            className="w-full group text-xs sm:text-sm"
            disabled={subUsers.length === 0}
            size="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            Add Another Recipient
          </Button>

          {totalAmount > 0 && (
            <div className="p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Total Amount</span>
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {baseToken}
                </span>
              </div>
              {/* <p className="text-xs text-muted-foreground mt-1">
                {recipients.filter(r => r.subUserId && r.amount).length} recipient{recipients.filter(r => r.subUserId && r.amount).length !== 1 ? 's' : ''}
              </p> */}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 mt-auto">
          <Button 
            type="submit" 
            className="w-full h-9 sm:h-10 text-xs sm:text-sm font-semibold group" 
            disabled={loading || (!needsPayment && (!hasValidRecipients || subUsers.length === 0 || hasUnregisteredRecipients))}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin mr-1.5" />
                {needsPayment ? (
                  <>
                    <span className="hidden sm:inline">Processing Payment...</span>
                    <span className="sm:hidden">Processing...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Processing {recipients.filter(r => r.subUserId && r.amount).length} Transfer{recipients.filter(r => r.subUserId && r.amount).length !== 1 ? 's' : ''}...</span>
                    <span className="sm:hidden">Processing...</span>
                  </>
                )}
              </>
            ) : needsPayment ? (
              <>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 group-hover:translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Proceed and Pay</span>
                <span className="sm:hidden">Pay</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 group-hover:translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Send to {recipients.filter(r => r.subUserId && r.amount).length || 'Multiple'} Recipient{recipients.filter(r => r.subUserId && r.amount).length !== 1 ? 's' : ''}</span>
                <span className="sm:hidden">Send Payment</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {subUsers.length === 0 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              Add sub users first to enable transfers
            </p>
          )}
          {hasUnregisteredRecipients && (
            <p className="text-xs text-orange-600 dark:text-orange-400 text-center pt-2">
              Please verify all recipients before sending transfers
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
