import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateEntityRequest, EntityType, BaseToken } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { createEntity } from '@/services/api';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CreateEntityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateEntityRequest) => Promise<void>;
}

export function CreateEntityModal({ open, onOpenChange, onSubmit: onSubmitCallback }: CreateEntityModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState<EntityType>('DAO');
  const [baseToken, setBaseToken] = useState<BaseToken>('eUSDC');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter entity name');
      return;
    }

    // const emailId = user?.email;
    const emailId = 'work.ashishc@gmail.com'
    if (!emailId) {
      toast.error('User email not found. Please sign in again.');
      return;
    }
    
    setLoading(true);
    try {
      // Call API function from api.ts to create entity
      await createEntity({ name, type, baseToken }, emailId);
      
      // Call onSubmit callback if provided - this will refresh entities list in parent
      if (onSubmitCallback) {
        await onSubmitCallback({ name, type, baseToken });
      }
      
      // Reset form
      setName('');
      setType('DAO');
      setBaseToken('eUSDC');
      onOpenChange(false);
      toast.success('Entity created successfully');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create entity';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <DialogTitle className="text-foreground text-lg sm:text-xl">Create New Entity</DialogTitle>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Set up a new entity to manage encrypted distributions
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">Entity Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My DAO Treasury"
              required
              className="bg-secondary/50 border-border h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground font-medium text-sm sm:text-base">Entity Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as EntityType)}>
              <SelectTrigger className="bg-secondary/50 border-border h-10 sm:h-11 text-sm sm:text-base">
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
            <Label htmlFor="token" className="text-foreground font-medium text-sm sm:text-base">Base Token</Label>
            <Select value={baseToken} onValueChange={(v) => setBaseToken(v as BaseToken)}>
              <SelectTrigger className="bg-secondary/50 border-border h-10 sm:h-11 text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="eUSDC">eUSDC</SelectItem>
                <SelectItem value="eAVAX">eAVAX</SelectItem>
                <SelectItem value="eUSDT">eUSDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 text-sm sm:text-base" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 font-semibold text-sm sm:text-base" 
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Entity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
