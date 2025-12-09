import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PlatformLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasProcessed = useRef(false);
  const toastShown = useRef(false);

  useEffect(() => {
    // If already authenticated, redirect immediately
    if (isAuthenticated) {
      navigate('/platform', { replace: true });
      return;
    }

    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }

    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      if (!toastShown.current) {
        setStatus('error');
        setErrorMessage('No token provided');
        toast.error('Authentication failed: No token provided');
        toastShown.current = true;
      }
      setTimeout(() => {
        navigate('/platform', { replace: true });
      }, 2000);
      return;
    }

    // Mark as processed immediately to prevent re-execution
    hasProcessed.current = true;

    // Decode URL-encoded token (in case it's URL encoded)
    const token = decodeURIComponent(tokenParam);

    // Decode/decrypt the JWT token
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid token format - expected JWT format');
      }

      // Decode the payload (second part) - JWT uses base64url encoding
      // Replace URL-safe characters: - becomes +, _ becomes /
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
      
      let payload;
      try {
        payload = JSON.parse(atob(paddedPayload));
      } catch (decodeError) {
        // If base64 decoding fails, try direct parsing (in case token is encrypted differently)
        throw new Error('Failed to decode token payload');
      }
      
      // Extract user information from token payload
      // Try multiple possible field names
      const userInfo = {
        email: payload.email || payload.email_id || payload.sub || '',
        name: payload.name || payload.full_name || payload.given_name || payload.username || 'User',
        picture: payload.picture || payload.avatar || payload.image || '',
      };

      // Validate that we have at least an email
      if (!userInfo.email) {
        throw new Error('Token does not contain user email');
      }

      // Check if user is already signed in with same email
      const storedUser = localStorage.getItem('platform_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.email === userInfo.email && parsed.token === token) {
            // Already authenticated with same token, just redirect
            setStatus('success');
            setTimeout(() => {
              navigate('/platform', { replace: true });
            }, 500);
            return;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }

      // Sign in the user with token
      signIn({
        ...userInfo,
        token: token,
      });
      
      setStatus('success');
      
      // Show toast only once
      if (!toastShown.current) {
        toast.success(`Welcome, ${userInfo.name}!`);
        toastShown.current = true;
      }
      
      // Redirect to platform after a short delay
      setTimeout(() => {
        navigate('/platform', { replace: true });
      }, 1500);
      
    } catch (error: any) {
      console.error('Error decoding token:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to decode token');
      
      // Show error toast only once
      if (!toastShown.current) {
        toast.error('Authentication failed: ' + (error.message || 'Invalid token'));
        toastShown.current = true;
      }
      
      setTimeout(() => {
        navigate('/platform', { replace: true });
      }, 3000);
    }
  }, [searchParams, navigate, signIn, isAuthenticated]);

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-card/30 relative">
        <DashboardBackground />
        <div className="relative z-10 flex items-center justify-center w-full">
          <div className="glass-card p-8 sm:p-12 max-w-md w-full mx-4 text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Authenticating...
                </h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we verify your credentials
                </p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Authentication Successful!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecting to platform...
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Authentication Failed
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {errorMessage || 'An error occurred during authentication'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Redirecting to platform...
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

