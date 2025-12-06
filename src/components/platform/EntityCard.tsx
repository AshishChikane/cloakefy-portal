import { Entity } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Copy, ChevronRight, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface EntityCardProps {
  entity: Entity;
  onSelect: (entity: Entity) => void;
}

export function EntityCard({ entity, onSelect }: EntityCardProps) {
  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(entity.smartWalletAddress);
    toast.success('Address copied to clipboard');
  };

  const shortAddress = `${entity.smartWalletAddress.slice(0, 6)}...${entity.smartWalletAddress.slice(-4)}`;

  return (
    <div 
      className="glass-card p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(entity)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{entity.name}</h3>
            <span className="text-xs text-muted-foreground">{entity.type}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Wallet</span>
          <div className="flex items-center gap-2">
            <code className="text-xs text-foreground bg-secondary/50 px-2 py-1 rounded">
              {shortAddress}
            </code>
            <button
              onClick={copyAddress}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Balance</span>
          <span className="font-semibold text-foreground">
            {entity.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {entity.baseToken}
          </span>
        </div>
      </div>
    </div>
  );
}
