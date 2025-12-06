import { cn } from '@/lib/utils';
import { Building2, History, Settings, X } from 'lucide-react';

interface PlatformSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { id: 'entities', label: 'Entities', icon: Building2 },
  { id: 'transactions', label: 'Transactions', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function PlatformSidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }: PlatformSidebarProps) {
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
        "fixed top-16 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold text-sidebar-foreground">Navigation</span>
          <button onClick={onMobileClose} className="p-1 hover:bg-sidebar-accent rounded">
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onMobileClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
