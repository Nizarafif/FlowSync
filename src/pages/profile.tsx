import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Sparkles, Shield, Building, Mail } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [company, setCompany] = useState(user?.company || '');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profil berhasil diperbarui! (Demo)');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col sm:flex-row items-center gap-6 shadow-premium">
        <img
          src={user?.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex'}
          alt={user?.name}
          className="h-20 w-20 rounded-full border-2 border-primary object-cover shrink-0"
        />
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Pro Member
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-none">{user?.name}</h2>
          <p className="text-xs text-slate-400 font-semibold">{user?.email}</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-premium">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2 mb-6">
          <User className="h-4 w-4 text-primary" /> Pengaturan Profil Saya
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Perusahaan"
              value={company}
              leftIcon={<Building className="h-4 w-4" />}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Peran / Jabatan"
              value={role}
              leftIcon={<Shield className="h-4 w-4" />}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <Input
            label="Alamat Email"
            type="email"
            disabled
            value={user?.email || ''}
            leftIcon={<Mail className="h-4 w-4" />}
            error="Email akun tidak dapat diubah setelah registrasi."
          />

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <Button type="submit">Perbarui Profil</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserProfile;
