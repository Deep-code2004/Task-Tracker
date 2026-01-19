
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TasksState, PaginatedResponse } from '../types';

const initialState: TasksState = {
  items: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
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
      const task = state.items.find(t => t.id === action.id);
      if (task) task.status = action.payload.status;
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

export const { addTask, updateTaskStatus, deleteTask, setPage, setAiAnalyzing } = tasksSlice.actions;
export default tasksSlice.reducer;
