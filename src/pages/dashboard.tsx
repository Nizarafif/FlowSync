import React from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  Users, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Inbox,
  FolderOpen
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tasks, 
    projects, 
    members, 
    activities, 
    activeWorkspace 
  } = useAppStore();

  // Filter items based on active workspace
  const workspaceProjects = projects.filter(p => p.workspace_id === activeWorkspace?.id);
  const workspaceTasks = tasks.filter(t => t.workspace_id === activeWorkspace?.id);

  // Statistics calculations
  const totalTasks = workspaceTasks.length;
  const completedTasks = workspaceTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = workspaceTasks.filter((t) => t.status === 'in_progress').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Upcoming deadlines (tasks with due dates sorted)
  const upcomingTasks = workspaceTasks
    .filter((t) => t.due_date && t.status !== 'done')
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 4);

  // Chart data: productivity metrics (completed tasks over week days)
  const chartData = [
    { day: 'Mon', completed: 3, inProgress: 4 },
    { day: 'Tue', completed: 5, inProgress: 3 },
    { day: 'Wed', completed: 2, inProgress: 6 },
    { day: 'Thu', completed: 6, inProgress: 4 },
    { day: 'Fri', completed: 8, inProgress: 2 },
    { day: 'Sat', completed: 4, inProgress: 3 },
    { day: 'Sun', completed: 7, inProgress: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Selamat Datang di Workspace Anda
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Berikut adalah ringkasan progres dan aktivitas terkini di workspace <span className="font-semibold text-primary">{activeWorkspace?.name}</span>.
          </p>
        </div>
        <button
          onClick={() => navigate('/kanban')}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          Buka Kanban Board
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Tasks', value: totalTasks, desc: `${inProgressTasks} sedang dikerjakan`, icon: CheckSquare, color: 'text-indigo-500 bg-indigo-500/10' },
          { title: 'Penyelesaian', value: `${completionRate}%`, desc: `${completedTasks} tugas selesai`, icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
          { title: 'Active Projects', value: workspaceProjects.length, desc: 'Proyek dalam inkubasi', icon: FolderOpen, color: 'text-blue-500 bg-blue-500/10' },
          { title: 'Team Members', value: members.length, desc: 'Kolaborator aktif', icon: Users, color: 'text-teal-500 bg-teal-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between shadow-premium"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-none">{stat.value}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.desc}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${stat.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Graph and Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Graph Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Grafik Produktivitas</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Tugas diselesaikan vs dalam proses minggu ini</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Selesai</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-300 dark:bg-indigo-700/60" />Dalam Proses</span>
            </div>
          </div>
          <div className="h-[280px] w-full mt-2 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="inProgress" stroke="#A5B4FC" strokeDasharray="4 4" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Deadline Terdekat</h3>
            <Calendar className="h-4.5 w-4.5 text-slate-400" />
          </div>

          <div className="flex-1 space-y-3.5">
            {upcomingTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="h-10 w-10 text-slate-400/50 mb-2" />
                <p className="text-xs text-slate-400">Tidak ada tugas dengan deadline dekat.</p>
              </div>
            ) : (
              upcomingTasks.map((task) => {
                return (
                  <div 
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/20 bg-white/20 dark:bg-slate-900/20 flex flex-col gap-2 hover:border-slate-300 dark:hover:border-slate-700/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{task.title}</span>
                      <Badge variant={task.priority as any} className="shrink-0 text-[9px] px-1.5 py-0">
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {task.due_date}
                      </span>
                      <span className="uppercase text-primary font-bold">{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Projects & Recent Activity & Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Projects progress */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-premium">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Proyek Aktif</h3>
          <div className="space-y-4">
            {workspaceProjects.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6">Tidak ada proyek aktif.</p>
            ) : (
              workspaceProjects.map((proj) => {
                const projTasks = tasks.filter(t => t.project_id === proj.id);
                const comp = projTasks.filter(t => t.status === 'done').length;
                const progress = projTasks.length > 0 ? Math.round((comp / projTasks.length) * 100) : 0;
                return (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: proj.color || '#6366F1' }} />
                        <span className="text-slate-800 dark:text-slate-200 truncate">{proj.name}</span>
                      </div>
                      <span className="text-slate-400">{progress}%</span>
                    </div>
                    {/* Progress Bar wrapper */}
                    <div className="h-2 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${progress}%`, backgroundColor: proj.color || '#6366F1' }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity feed */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-premium">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Aktivitas Workspace</h3>
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6">Tidak ada aktivitas.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs leading-normal">
                  <img 
                    src={act.user_avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar'} 
                    alt={act.user_name} 
                    className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
                  />
                  <div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      <span className="font-bold">{act.user_name}</span> {act.action}{' '}
                      <span className="font-semibold text-primary">{act.target_name}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold">{new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Members List */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-premium">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Anggota Tim</h3>
          <div className="space-y-3.5">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={member.avatar_url} 
                    alt={member.name} 
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{member.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="uppercase text-[9px] font-bold shrink-0">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
