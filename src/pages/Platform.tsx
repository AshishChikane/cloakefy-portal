import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PlatformSidebar } from '@/components/platform/PlatformSidebar';
import { EntityCard } from '@/components/platform/EntityCard';
import { CreateEntityModal } from '@/components/platform/CreateEntityModal';
import { TransactionHistory } from '@/components/platform/TransactionHistory';
import { DashboardOverview } from '@/components/platform/DashboardOverview';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { GoogleSignInModal } from '@/components/auth/GoogleSignInModal';
import { useAuth } from '@/contexts/AuthContext';
import { Entity, Transaction, CreateEntityRequest } from '@/types/api';
import { getEntities, createEntity, getTransactions } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Menu, Loader2, Building2, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUserRole } from '@/lib/role';
import SubEntityPlatform from './SubEntityPlatform';

export default function Platform() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(!isAuthenticated);
  const [activeTab, setActiveTab] = useState('entities');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    // Show sign-in modal if not authenticated
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }
    
    // Check user role and redirect if subentity
    const role = getUserRole();
    if (role === 'subentity') {
      // Don't load entities for sub-entity users
      return;
    }
    
    // Load entities only when authenticated and role is entity
    if (role === 'entity') {
      loadEntities();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab === 'transactions' || activeTab === 'entities') {
      loadAllTransactions();
    }
  }, [activeTab, entities]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const data = await getEntities();
      setEntities(data);
    } catch (error) {
      toast.error('Failed to load entities');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTransactions = async () => {
    try {
      const allTx = await Promise.all(entities.map(e => getTransactions(e.id)));
      setAllTransactions(allTx.flat().sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      toast.error('Failed to load transactions');
    }
  };

  const handleCreateEntity = async (data: CreateEntityRequest) => {
    try {
      // Reload entities to show the newly created entity
      await loadEntities();
    } catch (error) {
      toast.error('Failed to refresh entities list');
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'entities':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Entities
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage your encrypted distribution entities
                </p>
              </div>
              <Button 
                onClick={() => setCreateModalOpen(true)}
                className="group w-full sm:w-auto"
                size="default"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
                Create Entity
              </Button>
            </div>

            {/* Dashboard Overview */}
            {entities.length > 0 && (
              <div className="mb-4">
                <DashboardOverview 
                  entities={entities} 
                  transactions={allTransactions}
                  loading={loading}
                />
              </div>
            )}
            
            {/* Entities Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : entities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-16 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No entities yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Create your first entity to start managing encrypted distributions and multi-party payments.
                  </p>
                  <Button onClick={() => setCreateModalOpen(true)} size="lg" className="group">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Create Your First Entity
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {entities.map((entity, index) => (
                  <motion.div
                    key={entity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EntityCard 
                      entity={entity}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'transactions':
        return (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                All Transactions
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                View and track all transaction history across entities
              </p>
            </div>
            <div className="glass-card p-3 sm:p-4">
              <TransactionHistory transactions={allTransactions} loading={loading} />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Settings</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Configure your platform preferences
              </p>
            </div>
            <div className="glass-card p-6 sm:p-8 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">Settings Coming Soon</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Advanced configuration options will be available here.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleSignIn = (user: { email: string; name: string; picture: string }) => {
    signIn(user);
    setShowSignInModal(false);
    toast.success(`Welcome, ${user.name}!`);
  };

  // Show sign-in modal if not authenticated
  if (!isAuthenticated) {
    return (
      <Layout showFooter={false}>
        <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
          <DashboardBackground />
          <GoogleSignInModal 
            open={showSignInModal} 
            onSignIn={handleSignIn}
          />
        </div>
      </Layout>
    );
  }

  // Check role and show appropriate flow
  const role = getUserRole();
  if (role === 'subentity') {
    return <SubEntityPlatform />;
  }

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
        <DashboardBackground />
        <div className="relative z-10 flex w-full">
          <PlatformSidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
          
          <div className="flex-1 lg:ml-72">
            <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
              {/* Mobile menu button */}
              <button
                className="lg:hidden mb-4 p-2.5 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      
      <CreateEntityModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateEntity}
      />
    </Layout>
  );
}
