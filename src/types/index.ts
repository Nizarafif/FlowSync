export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role?: string;
  company?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  owner_id: string;
}

export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color?: string; // hex code
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  due_date?: string;
  created_at: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar_url?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  is_completed: boolean;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
  created_at: string;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_name: string;
  action: string; // e.g. "created task", "moved to In Progress", "added comment"
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  workspace_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string;
  labels: string[];
  assignees: string[]; // member ids
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  activities: TaskActivity[];
  created_at: string;
}

export interface Activity {
  id: string;
  workspace_id: string;
  user_name: string;
  user_avatar?: string;
  action: string;
  target_name: string;
  target_type: 'task' | 'project' | 'workspace' | 'member';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
}
