import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateEntityRequest, EntityType, BaseToken } from '@/types/api';
import { Loader2 } from 'lucide-react';

interface CreateEntityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateEntityRequest) => Promise<void>;
}

export function CreateEntityModal({ open, onOpenChange, onSubmit }: CreateEntityModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<EntityType>('DAO');
  const [baseToken, setBaseToken] = useState<BaseToken>('eAVAX');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit({ name, type, baseToken });
      setName('');
      setType('DAO');
      setBaseToken('eAVAX');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Entity</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Entity Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My DAO Treasury"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground">Entity Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as EntityType)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="DAO">DAO</SelectItem>
                <SelectItem value="Protocol">Protocol</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token" className="text-foreground">Base Token</Label>
            <Select value={baseToken} onValueChange={(v) => setBaseToken(v as BaseToken)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="eAVAX">eAVAX</SelectItem>
                <SelectItem value="eUSDC">eUSDC</SelectItem>
                <SelectItem value="eUSDT">eUSDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !name.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Entity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
