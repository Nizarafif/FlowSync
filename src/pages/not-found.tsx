import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowLeft, Layers } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden text-slate-100">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/15 blur-[120px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 flex flex-col items-center text-center space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            FlowSync
          </span>
        </div>

        {/* 404 Glass Card */}
        <div className="w-full glass rounded-2xl p-8 border border-white/10 shadow-2xl relative space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-black bg-gradient-to-r from-primary via-indigo-400 to-secondary bg-clip-text text-transparent leading-none">
              404
            </h1>
            <h2 className="text-lg font-bold text-white tracking-tight">Halaman Tidak Ditemukan</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau Anda mengetikkan alamat URL yang salah.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full justify-center"
            >
              <Layers className="h-4 w-4" />
              Kembali ke Dashboard
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="w-full justify-center text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali Sebelumnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
