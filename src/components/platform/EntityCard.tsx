import { Entity } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Copy, ChevronRight, Wallet, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div 
        className="glass-card p-3 sm:p-4 hover:border-primary/40 transition-all duration-300 cursor-pointer relative overflow-hidden"
        onClick={() => onSelect(entity)}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-110">
                  <Wallet className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                </div>
                <div className="absolute -inset-0.5 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                  {entity.name}
                </h3>
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {entity.type}
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-secondary/50 group-hover:bg-primary/10 transition-colors flex-shrink-0 ml-2">
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
          
          {/* Wallet Address */}
          <div className="mb-3 p-2.5 rounded-lg bg-secondary/30 border border-border/50 group-hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Wallet</span>
              </div>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-primary/10 rounded-md transition-colors group/btn"
              >
                <Copy className="w-3 h-3 text-muted-foreground group-hover/btn:text-primary transition-colors" />
              </button>
            </div>
            <code className="text-xs font-mono text-foreground mt-1.5 block font-semibold">
              {shortAddress}
            </code>
          </div>
          
          {/* Balance */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Balance</span>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {entity.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-muted-foreground font-medium">{entity.baseToken}</span>
            </div>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
}
