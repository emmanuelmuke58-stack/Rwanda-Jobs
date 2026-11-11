import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../lib/firebase.ts';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#0F172A] p-10 text-center text-white space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Secure access for platform administrators only.</p>
        </div>

        <div className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="shrink-0" size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5 bg-white rounded-full p-0.5" />
              {loading ? 'Authenticating...' : 'Sign in with Google'}
            </button>
            <p className="text-center text-xs text-gray-400">
              By signing in, you agree to follow the internal security policies and data protection guidelines.
            </p>
          </div>
        </div>
        
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Return to public site
          </button>
        </div>
      </div>
    </div>
  );
}
