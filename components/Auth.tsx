import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { GoogleIcon } from './icons/GoogleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface AuthProps {
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check for password reset session on component mount
  useEffect(() => {
    const checkResetSession = async () => {
      // Check URL hash for reset password parameters (Supabase uses hash, not query params)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      // Handle errors in URL
      if (error) {
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
          setError('Password reset link has expired. Please request a new one.');
        } else {
          setError('Password reset link is invalid. Please request a new one.');
        }
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      if (type === 'recovery' && accessToken && refreshToken) {
        try {
          // Set the session with the tokens from URL
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (!sessionError) {
            setShowResetPassword(true);
            setShowForgotPassword(false);
            setError(null);
            setMessage(null);
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setError('Password reset link is invalid or has expired. Please request a new one.');
          }
        } catch (err) {
          setError('Password reset link is invalid or has expired. Please request a new one.');
        }
      }
    };
    
    checkResetSession();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      if (isSignUp) {
        setMessage('Check your email for the confirmation link!');
      } else {
        onClose();
      }
    }
    setLoading(false);
  };
  
  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Session expired. Please request a new password reset link.');
        setShowResetPassword(false);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        setError(error.message);
      } else {
        setMessage('Password updated successfully! You can now sign in with your new password.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowResetPassword(false);
          setMessage(null);
          // Optionally close the modal after successful reset
          // onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };
  
  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });

      if (error) {
        console.error('Password reset error:', error);
        setError(error.message);
      } else {
        setMessage('Check your email for the password reset link!');
        setEmail(''); // Clear email field on success
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-sm bg-bg-card border border-border-primary/50 rounded-2xl shadow-lg p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors">
          <XCircleIcon className="w-8 h-8" />
        </button>
        
        <h2 className="text-2xl font-bold text-center text-text-main">
          {showResetPassword ? 'Set New Password' : (showForgotPassword ? 'Reset Password' : (isSignUp ? 'Create an Account' : 'YO! Creator'))}
        </h2>
        
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        {message && <p className="text-center text-sm text-green-600">{message}</p>}
        
        {showResetPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-text-muted">Enter your new password below</p>
            </div>
            <div>
              <label htmlFor="new-password-input" className="block text-sm font-medium text-text-muted mb-1">New Password</label>
              <input
                id="new-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                placeholder="Enter new password"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-text-muted mt-1">Must be at least 6 characters long</p>
            </div>
            <div>
              <label htmlFor="confirm-password-input" className="block text-sm font-medium text-text-muted mb-1">Confirm New Password</label>
              <input
                id="confirm-password-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                placeholder="Confirm new password"
                disabled={loading}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || password !== confirmPassword || password.length < 6}
              className="w-full px-6 py-3 rounded-md font-semibold text-brand-text bg-brand-primary hover:bg-brand-hover transition-colors disabled:bg-border-primary disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                setPassword('');
                setConfirmPassword('');
                setError(null);
                setMessage(null);
              }}
              className="w-full text-sm text-text-muted hover:text-text-main transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        ) : showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-text-muted mb-1">Email address</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-md font-semibold text-brand-text bg-brand-primary hover:bg-brand-hover transition-colors disabled:bg-border-primary disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-sm text-text-muted hover:text-text-main transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email-input" className="block text-sm font-medium text-text-muted mb-1">Email address</label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password-input" className="block text-sm font-medium text-text-muted mb-1">Password</label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              {!isSignUp && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-brand-primary hover:underline"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-md font-semibold text-brand-text bg-brand-primary hover:bg-brand-hover transition-colors disabled:bg-border-primary disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border-primary"></div>
                <span className="flex-shrink mx-4 text-text-muted text-sm">OR</span>
                <div className="flex-grow border-t border-border-primary"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-md font-semibold text-text-main bg-bg-primary/50 border border-border-primary hover:bg-border-primary transition-colors disabled:opacity-50"
            >
              <GoogleIcon className="w-5 h-5" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-text-muted">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-brand-primary hover:underline" disabled={loading}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default Auth;
