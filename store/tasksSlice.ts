
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState, PaginatedResponse } from '../types';

const initialState: TasksState = {
  items: [
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new feature',
      priority: 'High',
      status: 'Todo',
      dueDate: '2026-01-25',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Review code changes',
      description: 'Review the pull request for the authentication module',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2026-01-22',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Update dependencies',
      description: 'Update all outdated npm packages to latest versions',
      priority: 'Low',
      status: 'Todo',
      dueDate: '2026-01-30',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Fix bug in user interface',
      description: 'The modal dialog is not closing properly on mobile devices',
      priority: 'High',
      status: 'Todo',
      dueDate: '2026-01-23',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Set up CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2026-01-20',
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 5,
  aiAnalyzing: false,
};

// Mock API Call for Async Pagination
export const fetchTasksPaginated = createAsyncThunk(
  'tasks/fetchPaginated',
  async ({ page, limit }: { page: number; limit: number }, { getState }) => {
    // In a real app, this would be a fetch/axios call
    // Simulating async delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const state = (getState() as any).tasks;
    const allTasks = state.items;
    const start = (page - 1) * limit;
    const paginatedItems = allTasks.slice(start, start + limit);

    return {
      data: paginatedItems,
      total: allTasks.length,
      page
    } as PaginatedResponse;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.unshift(action.payload);
      state.totalItems += 1;
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: Task['status'] }>) => {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    updateTaskPriority: (state, action: PayloadAction<{ id: string; priority: Task['priority'] }>) => {
      const task = state.items.find(t => t.id === action.payload.id);
      if (task) task.priority = action.payload.priority;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      state.totalItems -= 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setAiAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.aiAnalyzing = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.totalItems = action.payload.total;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchTasksPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  },
});

export const { addTask, updateTaskStatus, updateTaskPriority, deleteTask, setPage, setAiAnalyzing } = tasksSlice.actions;
export default tasksSlice.reducer;
