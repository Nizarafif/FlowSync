import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  LayoutGrid, 
  Calendar, 
  BarChart2, 
  Settings, 
  User, 
  LogOut, 
  X, 
  ChevronRight,
  Plus
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { 
    projects, 
    activeWorkspace, 
    activeProject, 
    setActiveProject, 
    createProject, 
    logout 
  } = useAppStore();

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Filter projects belonging to active workspace
  const workspaceProjects = projects.filter(
    (p) => p.workspace_id === activeWorkspace?.id
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      // Custom soft colors for project cards
      const colors = ['#6366F1', '#3B82F6', '#14B8A6', '#EC4899', '#F59E0B', '#10B981'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      createProject(newProjectName.trim(), '', randomColor);
      setNewProjectName('');
      setShowAddProject(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Board', path: '/kanban', icon: LayoutGrid },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'User Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-40 w-[270px] h-screen flex flex-col border-r border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/50 backdrop-blur-xl transition-transform duration-300 ease-out shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/40 dark:border-slate-900/30">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
              FlowSync
            </span>
            <span className="text-[10px] font-bold bg-indigo-500/10 text-primary dark:bg-indigo-400/25 px-1.5 py-0.5 rounded-full">
              v1.0
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Workspace Switcher wrapper */}
        <div className="px-4 py-4">
          <WorkspaceSwitcher />
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 space-y-7 pb-6">
          <div className="space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-indigo-300' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </NavLink>
              );
            })}
          </div>

          {/* Active Projects List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Projects
              </p>
              <button 
                onClick={() => setShowAddProject(!showAddProject)}
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleCreateProject} className="px-3 mb-3">
                <input
                  type="text"
                  required
                  placeholder="Project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </form>
            )}

            <div className="space-y-0.5">
              {workspaceProjects.length === 0 ? (
                <p className="px-3 py-2 text-xs italic text-slate-400 dark:text-slate-500">
                  No projects created
                </p>
              ) : (
                workspaceProjects.map((proj) => {
                  const isActive = activeProject?.id === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setActiveProject(proj.id);
                        navigate('/kanban'); // Navigate to Kanban board when switching projects
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left group cursor-pointer
                        ${isActive
                          ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold'
                          : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span 
                          className="h-2 w-2 rounded-full shrink-0" 
                          style={{ backgroundColor: proj.color || '#6366F1' }}
                        />
                        <span className="truncate">{proj.name}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Logout & User Summary */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-900/30 bg-white/40 dark:bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
