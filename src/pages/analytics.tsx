import React from 'react';
import { useAppStore } from '../store';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { tasks, projects, activeWorkspace, members } = useAppStore();

  const workspaceProjects = projects.filter(p => p.workspace_id === activeWorkspace?.id);
  const workspaceTasks = tasks.filter(t => t.workspace_id === activeWorkspace?.id);

  // Chart 1: Status Distribution
  const todo = workspaceTasks.filter(t => t.status === 'todo').length;
  const inProgress = workspaceTasks.filter(t => t.status === 'in_progress').length;
  const review = workspaceTasks.filter(t => t.status === 'review').length;
  const done = workspaceTasks.filter(t => t.status === 'done').length;

  const statusData = [
    { name: 'To Do', value: todo, color: '#94A3B8' },
    { name: 'In Progress', value: inProgress, color: '#6366F1' },
    { name: 'Review', value: review, color: '#F59E0B' },
    { name: 'Done', value: done, color: '#10B981' },
  ].filter(c => c.value > 0);

  // Chart 2: Project Progress Rates
  const projectProgressData = workspaceProjects.map((p) => {
    const projTasks = workspaceTasks.filter(t => t.project_id === p.id);
    const completed = projTasks.filter(t => t.status === 'done').length;
    const progress = projTasks.length > 0 ? Math.round((completed / projTasks.length) * 100) : 0;
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      Progress: progress,
      color: p.color || '#6366F1'
    };
  });

  // Chart 3: Workload Distribution (Tasks per member)
  const workloadData = members.map((m) => {
    const count = workspaceTasks.filter(t => t.assignees.includes(m.id)).length;
    return {
      name: m.name.split(' ')[0], // First name only for clean layout
      Tasks: count
    };
  });

  // Chart 4: Monthly velocity performance (Line chart)
  const monthlyTimeline = [
    { month: 'Jan', completed: 12 },
    { month: 'Feb', completed: 18 },
    { month: 'Mar', completed: 15 },
    { month: 'Apr', completed: 25 },
    { month: 'May', completed: 32 },
    { month: 'Jun', completed: 28 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Project Velocity', value: '88%', desc: '+12% dari kuartal lalu', icon: TrendingUp, color: 'text-indigo-500 bg-indigo-500/10' },
          { title: 'Task Cycle Time', value: '4.2 Hari', desc: 'Rata-rata penyelesaian', icon: Calendar, color: 'text-emerald-500 bg-emerald-500/10' },
          { title: 'Penyelesaian Tepat Waktu', value: '92%', desc: 'Berdasarkan target due date', icon: BarChart3, color: 'text-teal-500 bg-teal-500/10' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between shadow-premium"
            >
              <div className="space-y-1.5 text-left">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.title}</span>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-none">{item.value}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{item.desc}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution (PieChart) */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Distribusi Status Tugas</h3>
          <div className="h-[260px] w-full flex items-center justify-center">
            {statusData.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada tugas untuk dipetakan.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '11px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Progress rate (Bar Chart) */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Kemajuan Penyelesaian Proyek (%)</h3>
          <div className="h-[260px] pr-4">
            {projectProgressData.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-10 text-center">Belum ada proyek.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      color: '#FFF',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="Progress" radius={[4, 4, 0, 0]} fill="#6366F1">
                    {projectProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Team Workload distribution (Bar Chart) */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Beban Kerja Anggota Tim (Tugas Aktif)</h3>
          <div className="h-[260px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="Tasks" fill="#14B8A6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Productivity (LineChart) */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col shadow-premium text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Tren Penyelesaian Tugas Bulanan</h3>
          <div className="h-[260px] pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTimeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Line type="monotone" dataKey="completed" stroke="#6366F1" strokeWidth={3} dot={{ fill: '#6366F1', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
