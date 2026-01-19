
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { fetchTasksPaginated, setPage } from './store/tasksSlice';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Pagination from './components/Pagination';
import { Plus, Sparkles, LayoutGrid, ListTodo, CheckSquare, BrainCircuit, RefreshCw } from 'lucide-react';
import { geminiService } from './services/geminiService';
import * as Tabs from '@radix-ui/react-tabs';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, currentPage, itemsPerPage, totalItems } = useSelector((state: RootState) => state.tasks);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync pagination with items in store (mocking API behavior)
  useEffect(() => {
    dispatch(fetchTasksPaginated({ page: currentPage, limit: itemsPerPage }));
  }, [currentPage, items.length, dispatch, itemsPerPage]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);



  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="text-blue-600 w-8 h-8" />
            SmartTask
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your tasks efficiently.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </header>



      {/* Main Content: Tabs for Filtering (Visual/Semantic) */}
      <Tabs.Root defaultValue="all" className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-8">
          <Tabs.Trigger 
            value="all" 
            className="pb-4 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 outline-none flex items-center gap-2"
          >
            <ListTodo className="w-4 h-4" />
            Active Tasks ({totalItems})
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="stats" 
            className="pb-4 px-1 text-sm font-semibold text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 outline-none flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Summary
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="all">
          {loading && items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-5 animate-pulse h-32" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="text-slate-300 w-8 h-8" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">No tasks yet</h3>
              <p className="text-slate-500 mt-1">Get started by creating your first task above.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(p) => dispatch(setPage(p))} 
                isLoading={loading}
              />
            </>
          )}
        </Tabs.Content>

        <Tabs.Content value="stats">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Tasks" value={totalItems} color="blue" />
            <StatCard label="In Progress" value={items.filter(t => t.status === 'In Progress').length} color="amber" />
            <StatCard label="Completed" value={items.filter(t => t.status === 'Completed').length} color="emerald" />
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Task Creation Modal */}
      <TaskForm open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* Footer Branding */}
      <footer className="mt-20 py-8 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
          Made with <Sparkles className="w-4 h-4 text-yellow-500" /> & React
        </p>
      </footer>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: 'blue' | 'amber' | 'emerald' }> = ({ label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };
  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${colors[color]}`}>
      <span className="text-sm font-bold uppercase tracking-wider opacity-70">{label}</span>
      <p className="text-4xl font-black mt-2">{value}</p>
    </div>
  );
};

export default App;
