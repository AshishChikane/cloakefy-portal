import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardBackground } from '@/components/ui/DashboardBackground';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { decodeJWT, extractTokenData } from '@/lib/jwt';

export default function PlatformLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasProcessed = useRef(false);
  const toastShown = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/platform', { replace: true });
      return;
    }

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

    // Decode JWT token and extract user data
    try {
      // Decode the JWT token payload
      const tokenData = extractTokenData(token);
      
      // Validate required fields
      if (!tokenData.email) {
        throw new Error('Token does not contain user email');
      }
      
      if (!tokenData.id) {
        throw new Error('Token does not contain user id');
      }

      const userInfo = {
        email: tokenData.email,
        name: tokenData.email.split('@')[0] || 'User', // Use email prefix as name if name not available
        picture: '', // Picture not in token, can be fetched separately if needed
        id: tokenData.id,
        google_id: tokenData.google_id,
        role: tokenData.role,
        api_key:tokenData.api_key,
      };
      console.log({userInfo})
      // Prepare user data for localStorage
      const platformUserData = {
        email: tokenData.email,
        name: userInfo.name,
        picture: userInfo.picture,
        id: tokenData.id,
        google_id: tokenData.google_id,
        role: tokenData.role ,
        token: token,
        api_key:tokenData.api_key,
        // Store token metadata
        tokenExpiry: tokenData.exp ? new Date(tokenData.exp * 1000).toISOString() : null,
        tokenIssuedAt: tokenData.iat ? new Date(tokenData.iat * 1000).toISOString() : null,
      };

      // Check if user is already signed in with same token
      const storedUser = localStorage.getItem('platform_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.email === userInfo.email && parsed.token === token) {
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

      localStorage.setItem('platform_user', JSON.stringify(platformUserData));
      
      // Also store token data separately for easy access
      localStorage.setItem('jwt_token_data', JSON.stringify({
        id: tokenData.id,
        email: tokenData.email,
        google_id: tokenData.google_id,
        role: tokenData.role,
        exp: tokenData.exp,
        iat: tokenData.iat,
        api_key: tokenData.api_key,
      }));

      // Store api_key separately for easy access (used by API functions)
      if (tokenData.api_key) {
        localStorage.setItem('api_key', tokenData.api_key);
      }
      
      // Sign in user with AuthContext (includes api_key)
      signIn({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        token: token,
        api_key: tokenData.api_key,
      });
      
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

