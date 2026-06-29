import React, { useState } from 'react';
import { useAppStore } from '../store';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import { Clock, CheckSquare } from 'lucide-react';
import type { Task } from '../types';

export const CalendarPage: React.FC = () => {
  const { tasks, projects, activeWorkspace, members } = useAppStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tasks based on active workspace
  const workspaceTasks = tasks.filter(
    (t) => t.workspace_id === activeWorkspace?.id && t.due_date
  );

  const workspaceProjects = projects.filter(
    (p) => p.workspace_id === activeWorkspace?.id
  );

  // Map tasks to FullCalendar event format
  const events = workspaceTasks.map((task) => {
    const proj = workspaceProjects.find((p) => p.id === task.project_id);
    return {
      id: task.id,
      title: task.title,
      start: task.due_date,
      allDay: true,
      backgroundColor: proj?.color || '#6366F1',
      borderColor: 'transparent',
      textColor: '#FFFFFF',
      extendedProps: {
        task,
      },
    };
  });

  const handleEventClick = (info: any) => {
    const task = info.event.extendedProps.task as Task;
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Helper: priority color badge
  const getPriorityBadge = (p: Task['priority']) => {
    const map = {
      low: 'secondary',
      medium: 'warning',
      high: 'danger'
    } as const;
    return <Badge variant={map[p]} className="text-[9px] font-bold px-1.5 py-0 capitalize">{p}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Calendar layout card */}
      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow-premium">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
        />
      </div>

      {/* QUICK VIEW TASK MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 text-left">
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="default" className="text-[9px] font-bold uppercase tracking-wider">
                  {selectedTask.status.replace('_', ' ')}
                </Badge>
                {getPriorityBadge(selectedTask.priority)}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50">
                {selectedTask.title}
              </h3>

              {selectedTask.description && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-100 dark:border-slate-800/40">
                  {selectedTask.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold border-t border-slate-100 dark:border-slate-800/40 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Deadline</span>
                  <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    {selectedTask.due_date}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Subtugas Checklist</span>
                  <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <CheckSquare className="h-3.5 w-3.5 text-primary" />
                    {selectedTask.checklist.filter(c => c.is_completed).length}/{selectedTask.checklist.length}
                  </span>
                </div>
              </div>

              {selectedTask.assignees.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Ditugaskan Kepada</span>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {selectedTask.assignees.map((id) => {
                      const m = members.find(x => x.id === id);
                      return m ? (
                        <img
                          key={id}
                          src={m.avatar_url}
                          alt={m.name}
                          title={m.name}
                          className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CalendarPage;
