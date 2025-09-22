import React, { useState } from 'react';
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
  
  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the password reset link!');
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
          {showForgotPassword ? 'Reset Password' : (isSignUp ? 'Create an Account' : 'YO! Creator')}
        </h2>
        
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        {message && <p className="text-center text-sm text-green-600">{message}</p>}
        
        {showForgotPassword ? (
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
