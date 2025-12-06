import { useState } from 'react';
import { SubUser, CreateSubUserRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface SubUsersListProps {
  subUsers: SubUser[];
  loading: boolean;
  onAddSubUser: (data: CreateSubUserRequest) => Promise<void>;
}

export function SubUsersList({ subUsers, loading, onAddSubUser }: SubUsersListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    walletAddress: '',
    allocationType: 'Fixed' as 'Fixed' | 'Percentage',
    allocation: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.walletAddress) return;
    
    setSubmitting(true);
    try {
      await onAddSubUser({
        name: formData.name,
        role: formData.role,
        walletAddress: formData.walletAddress,
        allocationType: formData.allocationType,
        allocation: formData.allocation ? Number(formData.allocation) : undefined,
      });
      setFormData({ name: '', role: '', walletAddress: '', allocationType: 'Fixed', allocation: '' });
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast.success('Address copied');
  };

  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">Sub Users</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage recipients for this entity</p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setModalOpen(true)}
          className="group w-full sm:w-auto text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          Add User
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : subUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary opacity-50" />
          </div>
          <p className="text-muted-foreground font-medium mb-1">No sub users yet</p>
          <p className="text-sm text-muted-foreground/70">Add recipients to start making transfers</p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {subUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 w-full sm:w-auto">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {user.role && (
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    )}
                    {user.role && <span className="text-xs text-muted-foreground">•</span>}
                    <code className="text-xs text-muted-foreground font-mono break-all">{shortAddress(user.walletAddress)}</code>
                    <button
                      onClick={() => copyAddress(user.walletAddress)}
                      className="p-0.5 hover:bg-primary/10 rounded transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
              </div>
              {user.allocation && (
                <div className="text-left sm:text-right w-full sm:w-auto sm:ml-3">
                  <p className="text-xs sm:text-sm font-bold text-primary">
                    {user.allocation}{user.allocationType === 'Percentage' ? '%' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.allocationType}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl">Add Sub User</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Alice Johnson"
                required
                className="bg-secondary/50 border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Developer"
                className="bg-secondary/50 border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Wallet Address</Label>
              <Input
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="0x..."
                required
                className="bg-secondary/50 border-border font-mono"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Allocation Type</Label>
                <Select
                  value={formData.allocationType}
                  onValueChange={(v) => setFormData({ ...formData, allocationType: v as 'Fixed' | 'Percentage' })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Allocation</Label>
                <Input
                  type="number"
                  value={formData.allocation}
                  onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                  placeholder="0"
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add User'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
