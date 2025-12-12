import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PlatformSidebar } from '@/components/platform/PlatformSidebar';
import { EntityDetail } from '@/components/platform/EntityDetail';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { GoogleSignInModal } from '@/components/auth/GoogleSignInModal';
import { useAuth } from '@/contexts/AuthContext';
import { Entity } from '@/types/api';
import { getEntities, getEntity } from '@/services/api';
import { toast } from 'sonner';
import { Menu, Loader2 } from 'lucide-react';

export default function EntityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(!isAuthenticated);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('entities');
  console.log({id})
  useEffect(() => {
    // Show sign-in modal if not authenticated
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }
    
    // Load entity when authenticated and ID is available
    if (id) {
      loadEntity();
    }
  }, [isAuthenticated, id]);

  const loadEntity = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Call the API to get entity by ID
      const entityData = await getEntity(id);
      if (entityData) {
        setEntity(entityData);
      } else {
        toast.error('Entity not found');
        navigate('/platform');
      }
    } catch (error: any) {
      console.error('Error loading entity:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load entity';
      toast.error(errorMessage);
      navigate('/platform');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (user: { email: string; name: string; picture: string }) => {
    signIn(user);
    setShowSignInModal(false);
    toast.success(`Welcome, ${user.name}!`);
  };

  const handleEntityUpdate = (updatedEntity: Entity) => {
    setEntity(updatedEntity);
  };

  const handleBack = () => {
    navigate('/platform');
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

  if (loading) {
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
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!entity) {
    return null;
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
              
              <EntityDetail 
                entity={entity} 
                onBack={handleBack}
                onEntityUpdate={handleEntityUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

