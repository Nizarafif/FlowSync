import React, { useState } from 'react';
import { useAppStore } from '../store';
import { 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  CheckSquare, 
  Send, 
  Activity as ActivityIcon
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  useDroppable 
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Task, TaskStatus, Priority } from '../types';

// Droppable Column Component
interface ColumnProps {
  id: TaskStatus;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<ColumnProps> = ({ id, title, count, color, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-full min-w-[280px] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/30 rounded-2xl p-4 h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
          {count}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-[200px] pr-1 pb-4"
      >
        {children}
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const { 
    tasks, 
    projects, 
    activeProject, 
    activeWorkspace, 
    members, 
    addTask, 
    updateTask, 
    deleteTask,
    moveTask,
    addComment,
    addAttachment,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Task detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Create task modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createColumnId, setCreateColumnId] = useState<TaskStatus>('todo');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [newLabels, setNewLabels] = useState<string[]>([]);
  const [newAssigneeId, setNewAssigneeId] = useState<string>('');

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid triggering drag on simple clicks
      },
    })
  );

  // Handle Drag End event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetStatus = over.id as TaskStatus;
    
    // Update task status in global store
    moveTask(taskId, targetStatus);
  };

  // Filter tasks based on query and active project
  const projectTasks = tasks.filter(
    (t) => t.workspace_id === activeWorkspace?.id && (!activeProject || t.project_id === activeProject.id)
  );

  const filteredTasks = projectTasks.filter(
    (t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Columns definition
  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-primary' },
    { id: 'review', title: 'Review', color: 'bg-amber-400' },
    { id: 'done', title: 'Done', color: 'bg-emerald-400' },
  ];

  // Helper: priority color badge
  const getPriorityBadge = (p: Priority) => {
    const map = {
      low: 'secondary',
      medium: 'warning',
      high: 'danger'
    } as const;
    return <Badge variant={map[p]} className="text-[9px] font-bold px-1.5 py-0 capitalize">{p}</Badge>;
  };

  // Helper: get avatar by member id
  const getAssigneeAvatar = (memberId: string) => {
    const m = members.find((x) => x.id === memberId);
    return m ? (
      <img 
        src={m.avatar_url} 
        alt={m.name} 
        title={m.name}
        className="h-6 w-6 rounded-full object-cover border border-white dark:border-slate-900 shadow-sm shrink-0" 
      />
    ) : null;
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !activeWorkspace) return;

    addTask({
      project_id: activeProject?.id || projects[0]?.id || 'p-1',
      workspace_id: activeWorkspace.id,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: createColumnId,
      priority: newPriority,
      due_date: newDueDate || undefined,
      labels: newLabels,
      assignees: newAssigneeId ? [newAssigneeId] : [],
      checklist: []
    });

    // Reset create state
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewDueDate('');
    setNewLabels([]);
    setNewAssigneeId('');
    setIsCreateOpen(false);
  };

  // Label helpers inside task modal
  const handleAddLabel = () => {
    if (newLabelInput.trim() && selectedTask) {
      const updatedLabels = [...selectedTask.labels, newLabelInput.trim()];
      updateTask(selectedTask.id, { labels: updatedLabels });
      setSelectedTask({ ...selectedTask, labels: updatedLabels });
      setNewLabelInput('');
    }
  };

  const handleRemoveLabel = (lbl: string) => {
    if (selectedTask) {
      const updatedLabels = selectedTask.labels.filter((l) => l !== lbl);
      updateTask(selectedTask.id, { labels: updatedLabels });
      setSelectedTask({ ...selectedTask, labels: updatedLabels });
    }
  };

  // Checklist actions
  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistText.trim() && selectedTask) {
      addChecklistItem(selectedTask.id, newChecklistText.trim());
      // Refresh selected task in modal local view
      const freshTask = tasks.find(t => t.id === selectedTask.id);
      if (freshTask) {
        setSelectedTask(freshTask);
      }
      setNewChecklistText('');
    }
  };

  const handleToggleChecklist = (itemId: string) => {
    if (selectedTask) {
      toggleChecklistItem(selectedTask.id, itemId);
      const freshTask = tasks.find(t => t.id === selectedTask.id);
      if (freshTask) setSelectedTask(freshTask);
    }
  };

  const handleDeleteChecklist = (itemId: string) => {
    if (selectedTask) {
      deleteChecklistItem(selectedTask.id, itemId);
      const freshTask = tasks.find(t => t.id === selectedTask.id);
      if (freshTask) setSelectedTask(freshTask);
    }
  };

  // Comment actions
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && selectedTask) {
      addComment(selectedTask.id, newComment.trim());
      const freshTask = tasks.find(t => t.id === selectedTask.id);
      if (freshTask) setSelectedTask(freshTask);
      setNewComment('');
    }
  };

  // Mock upload attachment
  const handleMockAttachment = () => {
    if (selectedTask) {
      const mockFiles = [
        { name: 'dashboard-redesign.pdf', size: '2.4 MB', type: 'application/pdf' },
        { name: 'api-spec.json', size: '15 KB', type: 'application/json' },
        { name: 'branding-guidelines.zip', size: '12 MB', type: 'application/zip' }
      ];
      const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
      addAttachment(selectedTask.id, randomFile.name, randomFile.size, randomFile.type);
      const freshTask = tasks.find(t => t.id === selectedTask.id);
      if (freshTask) setSelectedTask(freshTask);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kanban Sub-Header / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs sm:text-sm pl-9 pr-4 py-2 w-[220px] rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {activeProject && (
            <Badge variant="default" className="text-xs uppercase font-semibold">
              Filter: {activeProject.name}
            </Badge>
          )}
        </div>

        <Button
          onClick={() => {
            setCreateColumnId('todo');
            setIsCreateOpen(true);
          }}
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Tugas
        </Button>
      </div>

      {/* Columns DndContext */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                count={colTasks.length} 
                color={col.color}
              >
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleOpenDetail(task)}
                    className="group relative p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 hover:bg-white hover:dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700/60 shadow-premium hover:shadow-lg transition-all duration-200 flex flex-col gap-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
                        {task.title}
                      </h4>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Task labels */}
                    {task.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.labels.map((lbl, idx) => (
                          <span key={idx} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-primary dark:text-indigo-400">
                            {lbl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-3 mt-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        {task.due_date && (
                          <span className="flex items-center gap-0.5 font-semibold text-slate-400 dark:text-slate-500">
                            <Calendar className="h-3 w-3 shrink-0" />
                            {task.due_date}
                          </span>
                        )}
                        {task.checklist.length > 0 && (
                          <span className="flex items-center gap-0.5 font-semibold text-slate-400 dark:text-slate-500">
                            <CheckSquare className="h-3 w-3 shrink-0" />
                            {task.checklist.filter(c => c.is_completed).length}/{task.checklist.length}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        <div className="flex -space-x-1 overflow-hidden">
                          {task.assignees.map((id) => (
                            <div key={id} className="relative z-10">
                              {getAssigneeAvatar(id)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State within Column */}
                {colTasks.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <button
                      onClick={() => {
                        setCreateColumnId(col.id);
                        setIsCreateOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah
                    </button>
                  </div>
                )}
              </KanbanColumn>
            );
          })}
        </div>
      </DndContext>

      {/* CREATE TASK DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Buat Tugas Baru</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateTask} className="space-y-4 pt-2">
            <Input
              label="Judul Tugas"
              required
              placeholder="e.g. Desain sketsa mockup halaman settings"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deskripsi</label>
              <textarea
                rows={3}
                placeholder="Tulis penjelasan singkat mengenai tugas ini..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Prioritas</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Deadline</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pilih Assignee</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2"
                >
                  <option value="">Belum Ditugaskan</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Batal</Button>
              <Button type="submit">Tambah Tugas</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TASK DETAIL MODAL */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 p-0 overflow-hidden shadow-2xl">
          {selectedTask && (
            <div className="flex flex-col h-[80vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">STATUS:</span>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      const newStat = e.target.value as TaskStatus;
                      updateTask(selectedTask.id, { status: newStat });
                      setSelectedTask({ ...selectedTask, status: newStat });
                    }}
                    className="text-xs font-bold px-2 py-1 bg-primary/10 border-primary/20 text-primary dark:bg-primary/25 dark:text-indigo-300 rounded-lg outline-none cursor-pointer"
                  >
                    <option value="todo">TO DO</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="review">REVIEW</option>
                    <option value="done">DONE</option>
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    deleteTask(selectedTask.id);
                    setIsDetailOpen(false);
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:bg-rose-500/5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-500/10 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Tugas
                </button>
              </div>

              {/* Body (scrollable split panel) */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left panel: content, subtasks, attachments, comments */}
                <div className="md:col-span-2 space-y-6 text-left">
                  {/* Title & Description */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={selectedTask.title}
                      onChange={(e) => {
                        updateTask(selectedTask.id, { title: e.target.value });
                        setSelectedTask({ ...selectedTask, title: e.target.value });
                      }}
                      className="w-full text-lg sm:text-xl font-extrabold bg-transparent border-none text-slate-900 dark:text-white focus:outline-none focus:ring-0 px-0"
                    />
                    <textarea
                      placeholder="Tambahkan deskripsi detail..."
                      value={selectedTask.description || ''}
                      onChange={(e) => {
                        updateTask(selectedTask.id, { description: e.target.value });
                        setSelectedTask({ ...selectedTask, description: e.target.value });
                      }}
                      rows={4}
                      className="w-full text-xs sm:text-sm p-3 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 text-slate-700 dark:text-slate-300 rounded-lg placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  {/* Checklist Subtasks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckSquare className="h-4 w-4" /> Subtugas Checklist
                    </h4>
                    
                    <div className="space-y-2">
                      {selectedTask.checklist.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30">
                          <label className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => handleToggleChecklist(item.id)}
                              className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <span className={item.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                              {item.text}
                            </span>
                          </label>
                          <button
                            onClick={() => handleDeleteChecklist(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Checklist Item */}
                      <form onSubmit={handleAddChecklist} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tambah butir checklist..."
                          value={newChecklistText}
                          onChange={(e) => setNewChecklistText(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white focus:outline-none"
                        />
                        <Button type="submit" size="sm">Tambah</Button>
                      </form>
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Paperclip className="h-4 w-4" /> Lampiran Dokumen
                      </h4>
                      <button
                        onClick={handleMockAttachment}
                        className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                      >
                        + Lampirkan File
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTask.attachments.map((att) => (
                        <div key={att.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">{att.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{att.size}</p>
                          </div>
                          <Badge variant="secondary" className="text-[9px] uppercase font-bold shrink-0">{att.type.split('/')[1] || 'FILE'}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments Feed */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" /> Komentar ({selectedTask.comments.length})
                    </h4>
                    
                    {/* Add Comment input */}
                    <form onSubmit={handleAddComment} className="flex gap-2 items-end">
                      <input
                        type="text"
                        placeholder="Tulis balasan atau masukan..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 text-xs px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white focus:outline-none"
                      />
                      <Button type="submit" size="sm" className="h-[36px]"><Send className="h-3.5 w-3.5" /></Button>
                    </form>

                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                      {selectedTask.comments.map((comm) => (
                        <div key={comm.id} className="flex gap-3 text-xs leading-normal">
                          <img
                            src={comm.user_avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex'}
                            alt={comm.user_name}
                            className="h-7 w-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                          />
                          <div className="flex-1 bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{comm.user_name}</span>
                              <span className="text-[9px] text-slate-400">{new Date(comm.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-normal">{comm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right panel: parameters and settings */}
                <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 text-left space-y-5 h-fit text-xs">
                  {/* Parameter: Assignee */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assignee</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedTask.assignees.map((id) => (
                        <div key={id} className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
                          {getAssigneeAvatar(id)}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {members.find(m => m.id === id)?.name.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                      
                      {/* Select Assignee drop-down selector */}
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && !selectedTask.assignees.includes(val)) {
                            const updated = [...selectedTask.assignees, val];
                            updateTask(selectedTask.id, { assignees: updated });
                            setSelectedTask({ ...selectedTask, assignees: updated });
                          }
                        }}
                        className="bg-transparent border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 rounded px-1.5 py-1 text-[10px]"
                      >
                        <option value="">+ Assign</option>
                        {members.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Parameter: Priority */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prioritas</span>
                    <select
                      value={selectedTask.priority}
                      onChange={(e) => {
                        const val = e.target.value as Priority;
                        updateTask(selectedTask.id, { priority: val });
                        setSelectedTask({ ...selectedTask, priority: val });
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-700 dark:text-slate-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Parameter: Due Date */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Batas</span>
                    <input
                      type="date"
                      value={selectedTask.due_date || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateTask(selectedTask.id, { due_date: val || undefined });
                        setSelectedTask({ ...selectedTask, due_date: val || undefined });
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  {/* Parameter: Labels */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Label</span>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedTask.labels.map((lbl, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-primary dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                          <span>{lbl}</span>
                          <button onClick={() => handleRemoveLabel(lbl)} className="hover:text-rose-500 shrink-0">×</button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Tag..."
                        value={newLabelInput}
                        onChange={(e) => setNewLabelInput(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs"
                      />
                      <button 
                        onClick={handleAddLabel}
                        className="bg-primary text-white px-2 py-1 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Parameter: Task Activity Feed */}
                  <div className="border-t border-slate-200 dark:border-slate-800/60 pt-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <ActivityIcon className="h-3 w-3" /> Log Aktivitas
                    </span>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {selectedTask.activities.map((act) => (
                        <div key={act.id} className="text-[10px] text-slate-400 leading-normal">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{act.user_name}</span> {act.action}{' '}
                          <div className="text-[9px] text-slate-500 font-semibold">{new Date(act.created_at).toLocaleTimeString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default KanbanBoard;
