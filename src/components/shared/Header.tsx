import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, Bell, Sun, Moon, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SearchBar } from './SearchBar';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, notifications, markNotificationAsRead, markAllNotificationsAsRead, logout } = useAppStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md">
      {/* Left section: mobile button & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
      </div>

      {/* Right section: search, notification, theme toggle, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Command Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200/40 dark:border-slate-800/20 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-all duration-200 cursor-pointer focus:outline-none"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-1 font-mono text-[9px] font-bold text-slate-400">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>

        <SearchBar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-900/60 transition-colors cursor-pointer focus:outline-none">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
            )}
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-[300px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-950/10 animate-in fade-in-80 zoom-in-95"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[240px] overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`px-3 py-2.5 rounded-lg text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer ${
                        !notif.is_read ? 'bg-indigo-500/5 dark:bg-indigo-400/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{notif.title}</span>
                        {!notif.is_read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Profile Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
            <img
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex'}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm object-cover"
            />
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:inline" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 w-[200px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl shadow-slate-950/10 animate-in fade-in-80 zoom-in-95"
            >
              <div className="px-2.5 py-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              
              <DropdownMenu.Item
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer focus:outline-none select-none transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>My Profile</span>
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer focus:outline-none select-none transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-800" />

              <DropdownMenu.Item
                onClick={handleLogout}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 cursor-pointer focus:outline-none select-none transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
export default Header;
