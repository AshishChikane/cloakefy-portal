import { useState } from 'react';
import { SubUser, CreateSubUserRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Loader2 } from 'lucide-react';

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

  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Sub Users</h3>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Sub User
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : subUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No sub users yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="text-right">
                <code className="text-xs text-muted-foreground">{shortAddress(user.walletAddress)}</code>
                {user.allocation && (
                  <p className="text-xs text-primary">
                    {user.allocation}{user.allocationType === 'Percentage' ? '%' : ` ${user.allocationType}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add Sub User</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-foreground">Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Alice Johnson"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Role</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Developer"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Wallet Address</Label>
              <Input
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="0x..."
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">Allocation Type</Label>
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
                <Label className="text-foreground">Allocation</Label>
                <Input
                  type="number"
                  value={formData.allocation}
                  onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
