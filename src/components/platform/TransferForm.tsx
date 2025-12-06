import { useState } from 'react';
import { SubUser, BaseToken, TransferRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2 } from 'lucide-react';

interface TransferFormProps {
  subUsers: SubUser[];
  baseToken: BaseToken;
  entityId: string;
  onTransfer: (data: TransferRequest) => Promise<void>;
}

export function TransferForm({ subUsers, baseToken, entityId, onTransfer }: TransferFormProps) {
  const [selectedSubUser, setSelectedSubUser] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubUser || !amount || Number(amount) <= 0) return;
    
    setLoading(true);
    try {
      await onTransfer({
        entityId,
        subUserId: selectedSubUser,
        amount: Number(amount),
        token: baseToken,
      });
      setSelectedSubUser('');
      setAmount('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-foreground mb-4">Transfer from Parent to Sub Users</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground">Select Sub User</Label>
          <Select value={selectedSubUser} onValueChange={setSelectedSubUser}>
            <SelectTrigger className="bg-secondary/50 border-border">
              <SelectValue placeholder="Choose recipient" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {subUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-foreground">Amount</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {baseToken}
            </span>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !selectedSubUser || !amount || subUsers.length === 0}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Payment
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
