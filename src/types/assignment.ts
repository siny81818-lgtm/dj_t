export interface Assignment {
  id: string;
  grade: number;
  classNum: number;
  subject: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}
