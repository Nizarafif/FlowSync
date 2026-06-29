import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Dialog, DialogContent } from '../ui/Dialog';
import { Search, CheckSquare, Layers, Calendar, Settings, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { tasks, projects, activeWorkspace } = useAppStore();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // Filter tasks and projects based on query
  const filteredTasks = query.trim() 
    ? tasks.filter(t => t.workspace_id === activeWorkspace?.id && t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];

  const filteredProjects = query.trim()
    ? projects.filter(p => p.workspace_id === activeWorkspace?.id && p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  const handleNavigate = (path: string) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  const commandItems = [
    { name: 'Go to Dashboard', path: '/dashboard', icon: Layers },
    { name: 'View Kanban Board', path: '/kanban', icon: CheckSquare },
    { name: 'Open Calendar', path: '/calendar', icon: Calendar },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className="p-0 max-w-lg overflow-hidden border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks/projects..."
            className="w-full text-base bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-1.5 font-mono text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
            <span>ESC</span>
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-2 space-y-4">
          {/* Static Commands (show if query is empty or partially matches) */}
          <div className="space-y-1">
            <h3 className="px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Commands
            </h3>
            {commandItems
              .filter(item => !query || item.name.toLowerCase().includes(query.toLowerCase()))
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-slate-400" />
                  </button>
                );
              })}
          </div>

          {/* Searched Projects */}
          {filteredProjects.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Projects
              </h3>
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavigate('/kanban')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color || '#6366F1' }} />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Searched Tasks */}
          {filteredTasks.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 py-1 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Tasks
              </h3>
              {filteredTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleNavigate('/kanban')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckSquare className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{t.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    {t.status.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {query.trim() && filteredTasks.length === 0 && filteredProjects.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SearchBar;
