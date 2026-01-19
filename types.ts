
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
  aiSuggested?: boolean;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  aiAnalyzing: boolean;
}

export interface PaginatedResponse {
  data: Task[];
  total: number;
  page: number;
}
