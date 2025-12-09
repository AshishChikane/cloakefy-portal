import { cn } from '@/lib/utils';
import { X, FileText, Key, Building2, Wallet, Users, UserPlus, Send, Webhook, Code, ArrowDownCircle, ArrowUpCircle, Lock, Mail } from 'lucide-react';

interface DocsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const docSections = [
  { id: 'overview', label: 'Overview', icon: FileText, description: 'Get started' },
  { id: 'authentication', label: 'Authentication', icon: Key, description: 'API keys & auth' },
  { id: 'create-entity', label: 'Create Entity', icon: Building2, description: 'New entity setup' },
  { id: 'get-balance', label: 'Get Entity Balance', icon: Wallet, description: 'Check balances' },
  { id: 'list-sub-users', label: 'List Sub Users', icon: Users, description: 'View recipients' },
  { id: 'create-sub-user', label: 'Create Sub User', icon: UserPlus, description: 'Add recipients' },
  { id: 'create-transfer', label: 'Create Distribution', icon: Send, description: 'Send payments' },
  { id: 'deposit', label: 'Deposit Funds', icon: ArrowDownCircle, description: 'Deposit USDC' },
  { id: 'withdraw', label: 'Withdraw Funds', icon: ArrowUpCircle, description: 'Withdraw tokens' },
  { id: 'get-private-key', label: 'Get Private Key', icon: Lock, description: 'Export wallet key' },
  { id: 'resend-verification', label: 'Resend Verification', icon: Mail, description: 'Verify email' },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook, description: 'Event notifications' },
  { id: 'sdk', label: 'SDK Usage', icon: Code, description: 'Developer tools' },
];

export function DocsSidebar({ activeSection, onSectionChange, mobileOpen, onMobileClose }: DocsSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 bottom-0 w-72 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border/50 z-50 transition-transform lg:translate-x-0 shadow-2xl overflow-y-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-sidebar-border/50">
          <span className="font-semibold text-sidebar-foreground text-sm uppercase tracking-wider">Documentation</span>
          <button 
            onClick={onMobileClose} 
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {docSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  onMobileClose();
                }}
                className={cn(
                  "w-full flex items-start gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/10 text-white shadow-lg shadow-sidebar-primary/10 border border-sidebar-primary/30"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
                )}
                
                {/* Icon */}
                <div className={cn(
                  "relative flex-shrink-0 transition-transform duration-200",
                  isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}>
                  <section.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                  )}
                </div>
                
                {/* Label and description */}
                <div className="flex-1 text-left">
                  <div className="font-semibold">{section.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5 transition-colors",
                    isActive ? "text-white/80" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60"
                  )}>
                    {section.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer decoration */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border/50">
          <div className="text-xs text-sidebar-foreground/40 text-center">
            Powered by x402 Settlement
          </div>
        </div>
      </aside>
    </>
  );
}
