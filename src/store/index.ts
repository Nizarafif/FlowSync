import { create } from 'zustand';
import type { User, Workspace, Project, Task, Member, Activity, Notification, TaskStatus, Comment, ChecklistItem, Attachment } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Workspace
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  
  // Project
  projects: Project[];
  activeProject: Project | null;
  
  // Task
  tasks: Task[];
  
  // Members
  members: Member[];
  
  // General Activity
  activities: Activity[];
  
  // Notifications
  notifications: Notification[];

  // Theme
  theme: 'light' | 'dark';

  // Actions
  login: (email: string, name: string) => void;
  register: (email: string, name: string, company: string) => void;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Workspace Actions
  setActiveWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string) => void;
  
  // Project Actions
  setActiveProject: (projectId: string | null) => void;
  createProject: (name: string, description?: string, color?: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'comments' | 'attachments' | 'activities'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  
  // Checklist Actions
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  
  // Comment Actions
  addComment: (taskId: string, content: string) => void;
  
  // Attachment Actions
  addAttachment: (taskId: string, name: string, size: string, type: string) => void;
  
  // Notification Actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  
  // Activity Action
  addActivity: (action: string, targetName: string, targetType: Activity['target_type']) => void;
}

// Initial Mock Data
const mockUser: User = {
  id: 'u-1',
  email: 'alex@flowsync.io',
  name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  role: 'Product Lead',
  company: 'FlowSync Inc.'
};

const mockWorkspaces: Workspace[] = [
  { id: 'w-1', name: 'FlowSync Core', slug: 'flowsync-core', owner_id: 'u-1' },
  { id: 'w-2', name: 'Marketing & Brand', slug: 'marketing-brand', owner_id: 'u-1' },
];

const mockMembers: Member[] = [
  { id: 'm-1', name: 'Alex Rivera', email: 'alex@flowsync.io', role: 'owner', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' },
  { id: 'm-2', name: 'Sarah Chen', email: 'sarah.c@flowsync.io', role: 'admin', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80' },
  { id: 'm-3', name: 'Marcus Vance', email: 'marcus.v@flowsync.io', role: 'member', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80' },
  { id: 'm-4', name: 'Elena Rostova', email: 'elena.r@flowsync.io', role: 'viewer', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80' },
];

const mockProjects: Project[] = [
  { id: 'p-1', workspace_id: 'w-1', name: 'FlowSync SaaS Platform', description: 'Core product implementation, setup Vite, Tailwind CSS v4, and supabase integration.', color: '#6366F1', status: 'active', due_date: '2026-07-15', created_at: '2026-06-25' },
  { id: 'p-2', workspace_id: 'w-1', name: 'Mobile Companion App', description: 'React Native application development for iOS and Android support.', color: '#3B82F6', status: 'planning', due_date: '2026-09-01', created_at: '2026-06-28' },
  { id: 'p-3', workspace_id: 'w-1', name: 'Infrastructure Migration', description: 'Migrate hosting to AWS with serverless edge functions.', color: '#14B8A6', status: 'on_hold', due_date: '2026-10-10', created_at: '2026-06-20' },
  { id: 'p-4', workspace_id: 'w-2', name: 'Q3 Brand Campaign', description: 'Creative guidelines, assets creation, and social media outreach campaign.', color: '#EC4899', status: 'active', due_date: '2026-08-30', created_at: '2026-06-27' },
];

const mockTasks: Task[] = [
  {
    id: 't-1',
    project_id: 'p-1',
    workspace_id: 'w-1',
    title: 'Initialize Tailwind CSS v4 and styling variables',
    description: 'Set up Tailwind v4 configured with custom color variables for the design system (#6366F1, #3B82F6, #14B8A6, #F8FAFC, #0F172A) and support light/dark mode.',
    status: 'done',
    priority: 'high',
    due_date: '2026-06-30',
    labels: ['Design', 'Frontend'],
    assignees: ['m-1', 'm-2'],
    checklist: [
      { id: 'c-1', text: 'Configure `@tailwindcss/vite` in `vite.config.ts`', is_completed: true },
      { id: 'c-2', text: 'Import css variables and fonts in `src/index.css`', is_completed: true },
      { id: 'c-3', text: 'Validate dark mode toggle selector', is_completed: true }
    ],
    comments: [
      { id: 'com-1', task_id: 't-1', user_id: 'u-1', user_name: 'Alex Rivera', content: 'Tailwind configuration is complete. Works beautifully with Vite!', created_at: '2026-06-29T10:00:00Z' }
    ],
    attachments: [
      { id: 'att-1', name: 'tailwind-v4-config.png', size: '142 KB', url: '#', type: 'image/png', created_at: '2026-06-29T09:45:00Z' }
    ],
    activities: [
      { id: 'act-1', task_id: 't-1', user_name: 'Alex Rivera', action: 'created the task', created_at: '2026-06-28T09:00:00Z' },
      { id: 'act-2', task_id: 't-1', user_name: 'Sarah Chen', action: 'moved task to Done', created_at: '2026-06-29T10:05:00Z' }
    ],
    created_at: '2026-06-28T09:00:00Z'
  },
  {
    id: 't-2',
    project_id: 'p-1',
    workspace_id: 'w-1',
    title: 'Integrate Zustand and define Global App Store',
    description: 'Create standard zustand stores to handle authentication status, workspace routing, project switching, and Kanban board state manipulation.',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2026-07-05',
    labels: ['Architecture', 'Frontend'],
    assignees: ['m-1'],
    checklist: [
      { id: 'c-4', text: 'Create state management models & stores', is_completed: true },
      { id: 'c-5', text: 'Connect state store to React elements', is_completed: false },
      { id: 'c-6', text: 'Add dummy initial mock data for seamless first run', is_completed: true }
    ],
    comments: [],
    attachments: [],
    activities: [
      { id: 'act-3', task_id: 't-2', user_name: 'Alex Rivera', action: 'started working on this task', created_at: '2026-06-29T11:00:00Z' }
    ],
    created_at: '2026-06-29T11:00:00Z'
  },
  {
    id: 't-3',
    project_id: 'p-1',
    workspace_id: 'w-1',
    title: 'Design Beautiful Premium Landing Page',
    description: 'Build an eye-catching landing page with animations using Framer Motion, pricing slider/cards, customer testimonials, and sleek preview of dashboard.',
    status: 'todo',
    priority: 'high',
    due_date: '2026-07-10',
    labels: ['Design', 'Marketing'],
    assignees: ['m-2', 'm-3'],
    checklist: [
      { id: 'c-7', text: 'Hero section with subtle gradient background and CTA buttons', is_completed: false },
      { id: 'c-8', text: 'Interactive dashboard mock-up with floating windows', is_completed: false },
      { id: 'c-9', text: 'Pricing, FAQ, and footer sections', is_completed: false }
    ],
    comments: [],
    attachments: [],
    activities: [],
    created_at: '2026-06-29T12:00:00Z'
  },
  {
    id: 't-4',
    project_id: 'p-1',
    workspace_id: 'w-1',
    title: 'Setup Supabase Client & Database Schema',
    description: 'Initialize supabase configurations, add database tables matching project requirements: workspaces, projects, members, tasks, comments, and real-time triggers.',
    status: 'review',
    priority: 'high',
    due_date: '2026-07-02',
    labels: ['Backend', 'Database'],
    assignees: ['m-3'],
    checklist: [
      { id: 'c-10', text: 'Create Supabase project and get API keys', is_completed: true },
      { id: 'c-11', text: 'Create table migrations & seed scripts', is_completed: true },
      { id: 'c-12', text: 'Verify Row Level Security policies', is_completed: false }
    ],
    comments: [
      { id: 'com-2', task_id: 't-4', user_id: 'u-3', user_name: 'Marcus Vance', content: 'Database migration scripts are uploaded. RLS policies need review.', created_at: '2026-06-29T13:30:00Z' }
    ],
    attachments: [],
    activities: [
      { id: 'act-4', task_id: 't-4', user_name: 'Marcus Vance', action: 'submitted schema for review', created_at: '2026-06-29T13:35:00Z' }
    ],
    created_at: '2026-06-28T10:00:00Z'
  },
  {
    id: 't-5',
    project_id: 'p-4',
    workspace_id: 'w-2',
    title: 'Create brand guidelines and design assets',
    description: 'Design the logo, social media templates, banners, and select new font pairings for the Q3 brand campaign.',
    status: 'in_progress',
    priority: 'low',
    due_date: '2026-07-12',
    labels: ['Marketing', 'Brand'],
    assignees: ['m-2'],
    checklist: [],
    comments: [],
    attachments: [],
    activities: [],
    created_at: '2026-06-29T08:00:00Z'
  }
];

const mockNotifications: Notification[] = [
  { id: 'n-1', user_id: 'u-1', title: 'New Task Assigned', message: 'Sarah Chen assigned you to "Design Beautiful Premium Landing Page".', is_read: false, type: 'info', created_at: '2026-06-29T12:05:00Z' },
  { id: 'n-2', user_id: 'u-1', title: 'Task Completed', message: 'Tailwind CSS v4 config task was marked done by Sarah Chen.', is_read: false, type: 'success', created_at: '2026-06-29T10:05:00Z' },
  { id: 'n-3', user_id: 'u-1', title: 'Supabase Review Request', message: 'Marcus Vance requested a code review for "Setup Supabase Client".', is_read: true, type: 'info', created_at: '2026-06-29T13:40:00Z' },
];

const mockActivities: Activity[] = [
  { id: 'a-1', workspace_id: 'w-1', user_name: 'Sarah Chen', user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80', action: 'completed task', target_name: 'Initialize Tailwind CSS v4 and styling variables', target_type: 'task', created_at: '2026-06-29T10:05:00Z' },
  { id: 'a-2', workspace_id: 'w-1', user_name: 'Marcus Vance', user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80', action: 'moved task to Review', target_name: 'Setup Supabase Client & Database Schema', target_type: 'task', created_at: '2026-06-29T13:35:00Z' },
  { id: 'a-3', workspace_id: 'w-1', user_name: 'Alex Rivera', user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80', action: 'assigned project', target_name: 'Mobile Companion App', target_type: 'project', created_at: '2026-06-28T14:20:00Z' },
  { id: 'a-4', workspace_id: 'w-2', user_name: 'Sarah Chen', user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80', action: 'created project', target_name: 'Q3 Brand Campaign', target_type: 'project', created_at: '2026-06-27T11:00:00Z' },
];

export const useAppStore = create<AppState>((set) => ({
  // Auth State
  user: mockUser,
  isAuthenticated: true, // Default to true for demo, can toggle to false for testing
  
  // Data State
  workspaces: mockWorkspaces,
  activeWorkspace: mockWorkspaces[0],
  projects: mockProjects,
  activeProject: mockProjects[0],
  tasks: mockTasks,
  members: mockMembers,
  activities: mockActivities,
  notifications: mockNotifications,
  theme: 'dark', // Default theme

  // Auth Actions
  login: (email, name) => set(() => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      role: 'Product Lead',
      company: 'FlowSync Inc.'
    };
    return {
      user: newUser,
      isAuthenticated: true
    };
  }),

  register: (email, name, company) => set((state) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      role: 'Administrator',
      company: company || 'My Company'
    };
    
    const newWorkspace: Workspace = {
      id: `w-${Date.now()}`,
      name: `${company || name}'s Workspace`,
      slug: (company || name).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      owner_id: newUser.id
    };

    return {
      user: newUser,
      isAuthenticated: true,
      workspaces: [...state.workspaces, newWorkspace],
      activeWorkspace: newWorkspace
    };
  }),

  logout: () => set({ user: null, isAuthenticated: false }),
  
  setTheme: (theme) => set({ theme }),

  // Workspace Actions
  setActiveWorkspace: (workspaceId) => set((state) => {
    const ws = state.workspaces.find(w => w.id === workspaceId) || null;
    // Auto switch project when changing workspace
    const wsProjects = state.projects.filter(p => p.workspace_id === workspaceId);
    return {
      activeWorkspace: ws,
      activeProject: wsProjects.length > 0 ? wsProjects[0] : null
    };
  }),

  createWorkspace: (name) => set((state) => {
    const newWs: Workspace = {
      id: `w-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      owner_id: state.user?.id || 'u-1'
    };
    return {
      workspaces: [...state.workspaces, newWs],
      activeWorkspace: newWs
    };
  }),

  // Project Actions
  setActiveProject: (projectId) => set((state) => ({
    activeProject: state.projects.find(p => p.id === projectId) || null
  })),

  createProject: (name, description, color) => set((state) => {
    if (!state.activeWorkspace) return {};
    const newProj: Project = {
      id: `p-${Date.now()}`,
      workspace_id: state.activeWorkspace.id,
      name,
      description,
      color: color || '#6366F1',
      status: 'planning',
      created_at: new Date().toISOString().split('T')[0]
    };
    
    const newActivity: Activity = {
      id: `a-${Date.now()}`,
      workspace_id: state.activeWorkspace.id,
      user_name: state.user?.name || 'Unknown',
      user_avatar: state.user?.avatar_url,
      action: 'created project',
      target_name: name,
      target_type: 'project',
      created_at: new Date().toISOString()
    };

    return {
      projects: [...state.projects, newProj],
      activeProject: newProj,
      activities: [newActivity, ...state.activities]
    };
  }),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, ...updates } : p),
    activeProject: state.activeProject?.id === projectId ? { ...state.activeProject, ...updates } : state.activeProject
  })),

  deleteProject: (projectId) => set((state) => ({
    projects: state.projects.filter(p => p.id !== projectId),
    activeProject: state.activeProject?.id === projectId ? null : state.activeProject
  })),

  // Task Actions
  addTask: (taskData) => set((state) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      comments: [],
      attachments: [],
      activities: [
        {
          id: `ta-${Date.now()}`,
          task_id: `t-${Date.now()}`,
          user_name: state.user?.name || 'Unknown',
          action: 'created the task',
          created_at: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString()
    };

    const newActivity: Activity = {
      id: `a-${Date.now()}`,
      workspace_id: state.activeWorkspace?.id || 'w-1',
      user_name: state.user?.name || 'Unknown',
      user_avatar: state.user?.avatar_url,
      action: 'created task',
      target_name: taskData.title,
      target_type: 'task',
      created_at: new Date().toISOString()
    };

    return {
      tasks: [...state.tasks, newTask],
      activities: [newActivity, ...state.activities]
    };
  }),

  updateTask: (taskId, updates) => set((state) => {
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === taskId) {
        // Record changes to task activity
        const newActivities = [...t.activities];
        Object.keys(updates).forEach((key) => {
          const val = (updates as any)[key];
          if (key === 'status') {
            newActivities.push({
              id: `ta-${Date.now()}-${Math.random()}`,
              task_id: taskId,
              user_name: state.user?.name || 'Unknown',
              action: `changed status to ${val.replace('_', ' ')}`,
              created_at: new Date().toISOString()
            });
          } else if (key === 'priority') {
            newActivities.push({
              id: `ta-${Date.now()}-${Math.random()}`,
              task_id: taskId,
              user_name: state.user?.name || 'Unknown',
              action: `changed priority to ${val}`,
              created_at: new Date().toISOString()
            });
          }
        });
        
        return {
          ...t,
          ...updates,
          activities: newActivities
        };
      }
      return t;
    });

    return { tasks: updatedTasks };
  }),

  deleteTask: (taskId) => set((state) => {
    const taskToDelete = state.tasks.find(t => t.id === taskId);
    const newActivity = taskToDelete ? {
      id: `a-${Date.now()}`,
      workspace_id: state.activeWorkspace?.id || 'w-1',
      user_name: state.user?.name || 'Unknown',
      user_avatar: state.user?.avatar_url,
      action: 'deleted task',
      target_name: taskToDelete.title,
      target_type: 'task' as const,
      created_at: new Date().toISOString()
    } : null;

    return {
      tasks: state.tasks.filter(t => t.id !== taskId),
      activities: newActivity ? [newActivity, ...state.activities] : state.activities
    };
  }),

  moveTask: (taskId, newStatus) => set((state) => {
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === taskId) {
        if (t.status === newStatus) return t;
        
        const newActivities = [
          ...t.activities,
          {
            id: `ta-${Date.now()}`,
            task_id: taskId,
            user_name: state.user?.name || 'Unknown',
            action: `moved task from ${t.status} to ${newStatus}`,
            created_at: new Date().toISOString()
          }
        ];

        return {
          ...t,
          status: newStatus,
          activities: newActivities
        };
      }
      return t;
    });

    return { tasks: updatedTasks };
  }),

  // Checklist Actions
  addChecklistItem: (taskId, text) => set((state) => ({
    tasks: state.tasks.map((t) => {
      if (t.id === taskId) {
        const newItem: ChecklistItem = {
          id: `c-${Date.now()}`,
          text,
          is_completed: false
        };
        return {
          ...t,
          checklist: [...t.checklist, newItem]
        };
      }
      return t;
    })
  })),

  toggleChecklistItem: (taskId, itemId) => set((state) => ({
    tasks: state.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.map(item =>
            item.id === itemId ? { ...item, is_completed: !item.is_completed } : item
          )
        };
      }
      return t;
    })
  })),

  deleteChecklistItem: (taskId, itemId) => set((state) => ({
    tasks: state.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          checklist: t.checklist.filter(item => item.id !== itemId)
        };
      }
      return t;
    })
  })),

  // Comment Actions
  addComment: (taskId, content) => set((state) => {
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      task_id: taskId,
      user_id: state.user?.id || 'u-1',
      user_name: state.user?.name || 'Unknown User',
      user_avatar: state.user?.avatar_url,
      content,
      created_at: new Date().toISOString()
    };

    return {
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          const newActivities = [
            ...t.activities,
            {
              id: `ta-${Date.now()}`,
              task_id: taskId,
              user_name: state.user?.name || 'Unknown',
              action: 'added a comment',
              created_at: new Date().toISOString()
            }
          ];
          return {
            ...t,
            comments: [...t.comments, newComment],
            activities: newActivities
          };
        }
        return t;
      })
    };
  }),

  // Attachment Actions
  addAttachment: (taskId, name, size, type) => set((state) => {
    const newAtt: Attachment = {
      id: `att-${Date.now()}`,
      name,
      size,
      url: '#',
      type,
      created_at: new Date().toISOString()
    };

    return {
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          const newActivities = [
            ...t.activities,
            {
              id: `ta-${Date.now()}`,
              task_id: taskId,
              user_name: state.user?.name || 'Unknown',
              action: `attached ${name}`,
              created_at: new Date().toISOString()
            }
          ];
          return {
            ...t,
            attachments: [...t.attachments, newAtt],
            activities: newActivities
          };
        }
        return t;
      })
    };
  }),

  // Notification Actions
  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
  })),

  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, is_read: true }))
  })),

  addNotification: (title, message, type) => set((state) => {
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      user_id: state.user?.id || 'u-1',
      title,
      message,
      is_read: false,
      type,
      created_at: new Date().toISOString()
    };
    return {
      notifications: [newNotif, ...state.notifications]
    };
  }),

  // Activity Actions
  addActivity: (action, targetName, targetType) => set((state) => {
    const newAct: Activity = {
      id: `a-${Date.now()}`,
      workspace_id: state.activeWorkspace?.id || 'w-1',
      user_name: state.user?.name || 'Unknown',
      user_avatar: state.user?.avatar_url,
      action,
      target_name: targetName,
      target_type: targetType,
      created_at: new Date().toISOString()
    };
    return {
      activities: [newAct, ...state.activities]
    };
  })
}));

