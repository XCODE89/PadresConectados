export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'parent';
  name: string;
  email?: string;
  courseId?: string;
  studentId?: string;
}

export interface Course {
  id: string;
  name: string;
  grade: string;
  year: number;
  adminId: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  courseId: string;
  parentId: string;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
  relationship: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'exam' | 'meeting' | 'activity' | 'holiday';
  courseId: string;
  createdBy: string;
  notified?: boolean;
}

export interface Fee {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  courseId: string;
  createdBy: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  feeId: string;
  studentId: string;
  amount: number;
  paidDate: string;
  status: 'paid' | 'pending';
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  options: VoteOption[];
  courseId: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  allowViewResults: boolean;
  voters: string[];
}

export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  courseId: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  read: string[];
}