import { cn } from '@/lib/utils';
import { Users, Settings, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubEntitySidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { id: 'sub-users', label: 'Sub Users', icon: Users, description: 'View sub users', path: '/platform' },
  // { id: 'settings', label: 'Settings', icon: Settings, description: 'Platform settings', path: '/platform/settings' },
];

export function SubEntitySidebar({ mobileOpen, onMobileClose }: SubEntitySidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onMobileClose();
  };

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
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-sidebar-border/50">
          <span className="font-semibold text-sidebar-foreground text-sm uppercase tracking-wider">Navigation</span>
          <button 
            onClick={onMobileClose} 
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/platform' && (location.pathname.startsWith('/platform') || location.pathname.startsWith('/sub-entity/')));
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
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
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                  )}
                </div>
                
                {/* Label and description */}
                <div className="flex-1 text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5 transition-colors",
                    isActive ? "text-white/80" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60"
                  )}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User info and sign out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border/50 bg-sidebar/50">
          {user && (
            <div className="mb-3 px-2">
              <div className="text-xs text-sidebar-foreground/60 mb-1">Signed in as</div>
              <div className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</div>
              <div className="text-xs text-sidebar-foreground/50 truncate">{user.email}</div>
            </div>
          )}
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          <div className="text-xs text-sidebar-foreground/40 text-center mt-2">
            Powered by x402 Settlement
          </div>
        </div>
      </aside>
    </>
  );
}

