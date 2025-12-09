import { useState } from 'react';
import { SubUser, CreateSubUserRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Loader2, Copy, Wallet, Key, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getSubUserPrivateKey } from '@/services/api';

interface SubUsersListProps {
  subUsers: SubUser[];
  loading: boolean;
  onAddSubUser: (data: CreateSubUserRequest) => Promise<void>;
}

export function SubUsersList({ subUsers, loading, onAddSubUser }: SubUsersListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email_id: '',
    role: '',
    walletAddress: '',
    allocationType: 'Fixed' as 'Fixed' | 'Percentage',
    allocation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [privateKeyModalOpen, setPrivateKeyModalOpen] = useState(false);
  const [selectedSubUserId, setSelectedSubUserId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loadingPrivateKey, setLoadingPrivateKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email_id) return;
    
    setSubmitting(true);
    try {
      await onAddSubUser({
        name: formData.name,
        email_id: formData.email_id,
        role: formData.role,
        walletAddress: formData.walletAddress,
        allocationType: formData.allocationType,
        allocation: formData.allocation ? Number(formData.allocation) : undefined,
      });
      setFormData({ name: '', email_id: '', role: '', walletAddress: '', allocationType: 'Fixed', allocation: '' });
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast.success('Address copied');
  };

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      setCopied(true);
      toast.success('Private key copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportPrivateKey = async (subUserId: string) => {
    setSelectedSubUserId(subUserId);
    setPrivateKeyModalOpen(true);
    setPrivateKey(null);
    setShowPrivateKey(false);
    setLoadingPrivateKey(true);
    
    try {
      const key = await getSubUserPrivateKey(subUserId);
      setPrivateKey(key);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch private key');
      setPrivateKeyModalOpen(false);
    } finally {
      setLoadingPrivateKey(false);
    }
  };

  const shortAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  
  const maskPrivateKey = (key: string) => {
    if (key.length <= 20) return '•'.repeat(key.length);
    return `${key.slice(0, 6)}${'•'.repeat(key.length - 12)}${key.slice(-6)}`;
  };
  return (
    <div className="glass-card p-3 sm:p-4 hover:border-primary/30 transition-all flex flex-col h-[470px] border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 flex-shrink-0">
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
      
      <div className="flex-1 overflow-y-auto min-h-0">
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
          <div className="space-y-2 pr-1">
          {subUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-secondary/30 hover:bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0 w-full sm:w-auto">
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
                    {user.walletAddress && (
                      <>
                        <code className="text-xs text-muted-foreground font-mono break-all">{shortAddress(user.walletAddress)}</code>
                        <button
                          onClick={() => copyAddress(user.walletAddress)}
                          className="p-0.5 hover:bg-primary/10 rounded transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100 flex-shrink-0"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground hover:text-primary" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleExportPrivateKey(user.id)}
                      className="ml-1 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 rounded-md border border-yellow-500/20 hover:border-yellow-500/40 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100 flex items-center gap-1"
                      title="Export Private Key"
                    >
                      <Key className="w-3 h-3" />
                      <span>Export Key</span>
                    </button>
                  </div>
                  {/* Wallet Balances */}
                  {user.walletBalance && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {user.walletBalance.avax && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                          <Wallet className="w-3 h-3 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            {parseFloat(user.walletBalance.avax.balance || '0').toFixed(4)} AVAX
                          </span>
                        </div>
                      )}
                      {user.walletBalance.eusdc && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                          <Wallet className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-medium text-blue-500">
                            {parseFloat(user.walletBalance.eusdc.encryptedBalance || '0').toFixed(2)} eUSDC
                          </span>
                          {user.walletBalance.eusdc.tokenBalance && parseFloat(user.walletBalance.eusdc.tokenBalance) > 0 && (
                            <span className="text-xs text-blue-400/70">
                              ({parseFloat(user.walletBalance.eusdc.tokenBalance).toFixed(2)} USDC)
                            </span>
                          )}
                        </div>
                      )}
                      {user.walletBalance.eusdt && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
                          <Wallet className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-medium text-green-500">
                            {parseFloat(user.walletBalance.eusdt.encryptedBalance || '0').toFixed(2)} eUSDT
                          </span>
                          {user.walletBalance.eusdt.tokenBalance && parseFloat(user.walletBalance.eusdt.tokenBalance) > 0 && (
                            <span className="text-xs text-green-400/70">
                              ({parseFloat(user.walletBalance.eusdt.tokenBalance).toFixed(2)} USDT)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
      </div>
      
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
              <Label className="text-foreground font-medium">Email ID</Label>
              <Input
                type="email"
                value={formData.email_id}
                onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                placeholder="e.g., alice@example.com"
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
                    className="flex-1 bg-gradient-to-r text-black font-semibold text-sm sm:text-base"
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
    </div>
  );
}
