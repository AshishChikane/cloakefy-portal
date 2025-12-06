import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DocsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const docSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'create-entity', label: 'Create Entity' },
  { id: 'get-balance', label: 'Get Entity Balance' },
  { id: 'list-sub-users', label: 'List Sub Users' },
  { id: 'create-sub-user', label: 'Create Sub User' },
  { id: 'create-transfer', label: 'Create Distribution' },
  { id: 'webhooks', label: 'Webhooks' },
  { id: 'sdk', label: 'SDK Usage' },
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
        "fixed top-16 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform lg:translate-x-0 overflow-y-auto",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold text-sidebar-foreground">Documentation</span>
          <button onClick={onMobileClose} className="p-1 hover:bg-sidebar-accent rounded">
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            API Reference
          </p>
          {docSections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onSectionChange(section.id);
                onMobileClose();
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
