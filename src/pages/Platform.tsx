import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PlatformSidebar } from '@/components/platform/PlatformSidebar';
import { EntityCard } from '@/components/platform/EntityCard';
import { CreateEntityModal } from '@/components/platform/CreateEntityModal';
import { EntityDetail } from '@/components/platform/EntityDetail';
import { TransactionHistory } from '@/components/platform/TransactionHistory';
import { Entity, Transaction, CreateEntityRequest } from '@/types/api';
import { getEntities, createEntity, getTransactions } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Menu, Loader2, Building2 } from 'lucide-react';

export default function Platform() {
  const [activeTab, setActiveTab] = useState('entities');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    if (activeTab === 'transactions') {
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
      const newEntity = await createEntity(data);
      setEntities([...entities, newEntity]);
      toast.success('Entity created successfully');
    } catch (error) {
      toast.error('Failed to create entity');
      throw error;
    }
  };

  const handleEntityUpdate = (updatedEntity: Entity) => {
    setEntities(entities.map(e => e.id === updatedEntity.id ? updatedEntity : e));
    setSelectedEntity(updatedEntity);
  };

  const renderContent = () => {
    if (selectedEntity && activeTab === 'entities') {
      return (
        <EntityDetail 
          entity={selectedEntity} 
          onBack={() => setSelectedEntity(null)}
          onEntityUpdate={handleEntityUpdate}
        />
      );
    }

    switch (activeTab) {
      case 'entities':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Entities</h1>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                New Entity
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : entities.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No entities yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first entity to start managing encrypted distributions.
                </p>
                <Button onClick={() => setCreateModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Create Entity
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {entities.map((entity) => (
                  <EntityCard 
                    key={entity.id} 
                    entity={entity} 
                    onSelect={setSelectedEntity}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'transactions':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">All Transactions</h1>
            <div className="glass-card p-5">
              <TransactionHistory transactions={allTransactions} loading={loading} />
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">Settings coming soon.</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <PlatformSidebar 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedEntity(null);
          }}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            <button
              className="lg:hidden mb-4 p-2 hover:bg-secondary rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            
            {renderContent()}
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
