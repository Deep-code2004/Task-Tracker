
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import { Task, Priority } from '../types';

interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0]
    }
  });
  const dispatch = useDispatch();

  const onSubmit = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Todo',
      createdAt: new Date().toISOString(),
    };
    dispatch(addTask(newTask));
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-slate-900">Create New Task</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-slate-600 focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
              <input 
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Design Landing Page"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                {...register('description')}
                rows={3}
                placeholder="Provide some details..."
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  {...register('priority')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date"
                  {...register('dueDate', { required: 'Date is required' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4 shadow-lg shadow-blue-200"
            >
              Add Task
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TaskForm;
