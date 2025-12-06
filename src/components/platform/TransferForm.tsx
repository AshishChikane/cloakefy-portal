import { useState } from 'react';
import { SubUser, BaseToken, TransferRequest, TransferRecipient } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, ArrowRight, Plus, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getTotalAmount = () => {
    return recipients.reduce((sum, r) => {
      const amount = Number(r.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validRecipients = recipients.filter(r => r.subUserId && r.amount && Number(r.amount) > 0);
    
    if (validRecipients.length === 0) {
      return;
    }
    
    setLoading(true);
    try {
      const transferData: TransferRequest = {
        entityId,
        recipients: validRecipients.map(r => ({
          subUserId: r.subUserId,
          amount: Number(r.amount),
        })),
        token: baseToken,
      };
      
      await onTransfer(transferData);
      
      // Reset form
      setRecipients([{ id: '1', subUserId: '', amount: '' }]);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getTotalAmount();
  const hasValidRecipients = recipients.some(r => r.subUserId && r.amount && Number(r.amount) > 0);

  return (
    <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">Create Multi-Recipient Transfer</h3>
        </div>
        <p className="text-xs text-muted-foreground">Send encrypted payments to multiple recipients in one transaction</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-2.5 sm:space-y-3">
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
                          {subUsers.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <span>{user.name}</span>
                                {user.role && (
                                  <span className="text-xs text-muted-foreground">({user.role})</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedUser && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {selectedUser.walletAddress.slice(0, 10)}...{selectedUser.walletAddress.slice(-8)}
                        </p>
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
            <p className="text-xs text-muted-foreground mt-1">
              {recipients.filter(r => r.subUserId && r.amount).length} recipient{recipients.filter(r => r.subUserId && r.amount).length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-9 sm:h-10 text-xs sm:text-sm font-semibold group" 
          disabled={loading || !hasValidRecipients || subUsers.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin mr-1.5" />
              <span className="hidden sm:inline">Processing {recipients.filter(r => r.subUserId && r.amount).length} Transfer{recipients.filter(r => r.subUserId && r.amount).length !== 1 ? 's' : ''}...</span>
              <span className="sm:hidden">Processing...</span>
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
      </form>
    </div>
  );
}
