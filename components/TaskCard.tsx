
import React from 'react';
import { Task } from '../types';
import { Trash2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTaskStatus } from '../store/tasksSlice';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useDispatch();

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getStatusIcon = (s: Task['status']) => {
    switch (s) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default: return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const toggleStatus = () => {
    const nextStatus: Task['status'] = 
      task.status === 'Todo' ? 'In Progress' : 
      task.status === 'In Progress' ? 'Completed' : 'Todo';
    dispatch(updateTaskStatus({ id: task.id, status: nextStatus }));
  };

  return (
    <div className={`group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 relative`}>
      <div className="flex items-start justify-between gap-4">
        <button 
          onClick={toggleStatus}
          className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        >
          {getStatusIcon(task.status)}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-slate-800 truncate ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button 
          onClick={() => dispatch(deleteTask(task.id))}
          className="text-slate-300 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {task.aiSuggested && (
        <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> AI
        </div>
      )}
    </div>
  );
};

export default TaskCard;
