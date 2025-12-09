import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';
import { googleAuthCallback } from '@/services/api';
import { toast } from 'sonner';

interface GoogleSignInModalProps {
  open: boolean;
  onSignIn: (user: { email: string; name: string; picture: string }) => void;
}

export function GoogleSignInModal({ open, onSignIn }: GoogleSignInModalProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // setLoading(true);
      window.open(`https://x402.cloakefy.com/v1/auth/google`, "_self");
    // try {
    //   // Check if Google Identity Services is loaded
    //   if (window.google && window.google.accounts) {
    //     // Use One Tap or Button flow
    //     window.google.accounts.id.initialize({
    //       client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    //       callback: handleCredentialResponse,
    //     });

    //     // Try One Tap first
    //     window.google.accounts.id.prompt((notification: any) => {
    //       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
    //         // Fallback: Use OAuth2 token client
    //         const client = window.google.accounts.oauth2.initTokenClient({
    //           client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    //           scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    //           callback: async (response: any) => {
    //             if (response.access_token) {
    //               await fetchUserInfo(response.access_token);
    //             } else {
    //               setLoading(false);
    //             }
    //           },
    //         });
    //         client.requestAccessToken();
    //       }
    //     });
    //   } else {
    //     // Fallback: Use mock authentication for development (when Google Client ID is not configured)
    //     setTimeout(() => {
    //       onSignIn({
    //         email: 'demo1@example.com',
    //         name: 'Demo User',
    //         picture: '',
    //       });
    //       setLoading(false);
    //     }, 1000);
    //   }
    // } catch (error) {
    //   console.error('Google Sign-In Error:', error);
    //   // Fallback to demo mode on error
    //   setTimeout(() => {
    //     onSignIn({
    //       email: 'demo1@example.com',
    //       name: 'Demo User',
    //       picture: '',
    //     });
    //     setLoading(false);
    //   }, 500);
    // }
  };

  const handleCredentialResponse = async (response: any) => {
    // Send credential to backend API
    try {
      const userInfo = await googleAuthCallback({
        credential: response.credential,
      });
      
      onSignIn({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture || '',
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error in credential response:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const fetchUserInfo = async (accessToken: string) => {
    try {
      // Send access token to backend API
      const userInfo = await googleAuthCallback({
        access_token: accessToken,
      });
      
      onSignIn({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture || '',
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="glass-card p-6 sm:p-8 max-w-md w-full relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Chrome className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Sign in to Tooling Platform
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please sign in with your Google account to access the platform
                  </p>
                </div>

                {/* Sign In Button */}
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold group relative overflow-hidden"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Chrome className="w-5 h-5" />
                      <span>Continue with Google</span>
                    </div>
                  )}
                </Button>

                {/* Info */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By signing in, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Extend Window interface for Google OAuth
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          prompt: (callback: (notification: any) => void) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

