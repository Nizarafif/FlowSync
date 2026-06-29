import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Sparkles } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppStore();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[90px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 flex flex-col items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 hover:opacity-90 transition-opacity">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            FlowSync
          </span>
        </Link>

        {/* Content Outlet */}
        <div className="w-full glass rounded-2xl p-8 border border-white/10 shadow-2xl relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
