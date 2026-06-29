import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { ChevronDown, Plus, Check } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const WorkspaceSwitcher: React.FC = () => {
  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setShowCreateInput(false);
    }
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer focus:outline-none text-left">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary/20 shrink-0">
            {activeWorkspace?.name.charAt(0) || 'F'}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider leading-none">Workspace</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">{activeWorkspace?.name || 'Loading...'}</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[240px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-950/10 animate-in fade-in-80 zoom-in-95"
        >
          <div className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspaces
          </div>
          
          {workspaces.map((ws) => (
            <DropdownMenu.Item
              key={ws.id}
              onClick={() => {
                setActiveWorkspace(ws.id);
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer focus:outline-none select-none transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
                  {ws.name.charAt(0)}
                </div>
                <span className="truncate">{ws.name}</span>
              </div>
              {activeWorkspace?.id === ws.id && (
                <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
              )}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

          {showCreateInput ? (
            <form onSubmit={handleCreate} className="p-1">
              <input
                autoFocus
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace Name..."
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary mb-1.5"
              />
              <div className="flex gap-1 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="px-2 py-1 text-[10px] rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-[10px] rounded bg-primary text-white hover:bg-primary/95"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault();
                setShowCreateInput(true);
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-primary dark:text-indigo-400 hover:bg-primary/5 dark:hover:bg-indigo-500/10 cursor-pointer focus:outline-none select-none transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default WorkspaceSwitcher;
