import { Student } from '../data/students';

export interface Schedule {
  date: Date;
  students: Student[];
  representative: Student;
}

export interface Proof {
  id: string;
  nim: string;
  date: Date;
  imageUrl: string | null;
  notes: string;
  timestamp: Date;
}