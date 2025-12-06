import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { OverviewSection } from '@/components/docs/sections/OverviewSection';
import { AuthenticationSection } from '@/components/docs/sections/AuthenticationSection';
import { CreateEntitySection } from '@/components/docs/sections/CreateEntitySection';
import { GetBalanceSection } from '@/components/docs/sections/GetBalanceSection';
import { ListSubUsersSection } from '@/components/docs/sections/ListSubUsersSection';
import { CreateSubUserSection } from '@/components/docs/sections/CreateSubUserSection';
import { CreateTransferSection } from '@/components/docs/sections/CreateTransferSection';
import { WebhooksSection } from '@/components/docs/sections/WebhooksSection';
import { SDKSection } from '@/components/docs/sections/SDKSection';
import { Menu } from 'lucide-react';

const sections: Record<string, React.ComponentType> = {
  'overview': OverviewSection,
  'authentication': AuthenticationSection,
  'create-entity': CreateEntitySection,
  'get-balance': GetBalanceSection,
  'list-sub-users': ListSubUsersSection,
  'create-sub-user': CreateSubUserSection,
  'create-transfer': CreateTransferSection,
  'webhooks': WebhooksSection,
  'sdk': SDKSection,
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SectionComponent = sections[activeSection] || OverviewSection;

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
        <DashboardBackground />
        <div className="relative z-10 flex w-full">
          <DocsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          
          <div className="flex-1 lg:ml-72">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Mobile menu button */}
              <button
                className="lg:hidden mb-4 p-2.5 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              
              <SectionComponent />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
