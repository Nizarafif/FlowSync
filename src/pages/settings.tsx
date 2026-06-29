import React, { useState } from 'react';
import { useAppStore } from '../store';
import { useTheme } from '../contexts/ThemeContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Settings as SettingsIcon, Bell, Users, Paintbrush } from 'lucide-react';

export const Settings: React.FC = () => {
  const { activeWorkspace, members } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'viewer'>('member');


  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Workspace settings saved successfully! (Demo)');
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      alert(`Undangan kolaborasi telah dikirim ke ${inviteEmail} sebagai ${inviteRole}.`);
      setInviteEmail('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation/Shortcuts left card */}
        <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md h-fit space-y-1.5">
          {[
            { name: 'Workspace Info', icon: SettingsIcon, active: true },
            { name: 'Notifikasi', icon: Bell, active: false },
            { name: 'Manajemen Tim', icon: Users, active: false },
            { name: 'Tema & Visual', icon: Paintbrush, active: false },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors
                  ${item.active 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-indigo-300' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }
                `}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Configurations right cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: Workspace Info */}
          <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-primary" /> Informasi Workspace
            </h3>

            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <Input
                label="Nama Workspace"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <Input
                label="Workspace URL Slug"
                disabled
                value={activeWorkspace?.slug || ''}
                error="Slug URL dibuat otomatis berdasarkan nama workspace."
              />
              <Button type="submit" size="sm">Simpan Perubahan</Button>
            </form>
          </div>

          {/* Section 2: Themes Preference */}
          <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-primary" /> Pengaturan Tema & Tampilan
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/20 bg-slate-50/50 dark:bg-slate-950/20">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mode Tema</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Ubah skema warna aplikasi secara instan</p>
              </div>

              <Button onClick={toggleTheme} variant="secondary" size="sm">
                Ganti ke Mode {theme === 'light' ? 'Gelap' : 'Terang'}
              </Button>
            </div>
          </div>

          {/* Section 3: Invite Team Members */}
          <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Undang Kolaborator
            </h3>

            <form onSubmit={handleInvite} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  type="email"
                  required
                  placeholder="Masukkan alamat email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="text-xs px-3.5 py-2.5 h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <Button type="submit" className="h-10">Undang</Button>
            </form>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tim Aktif ({members.length})</span>
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800/20 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2.5 min-w-0 text-xs">
                    <img src={m.avatar_url} alt={m.name} className="h-7 w-7 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold truncate text-slate-800 dark:text-slate-200">{m.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{m.email}</p>
                    </div>
                  </div>
                  <Badge variant={m.role === 'owner' ? 'default' : 'secondary'} className="uppercase text-[9px] font-bold shrink-0">
                    {m.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
