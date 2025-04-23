import { Student } from '../data/students';
import { Schedule } from '../types';

/**
 * Generates inspection schedules for the specified number of days
 * @param studentList List of all students
 * @param days Number of days to generate schedules for
 * @returns Array of schedules
 */
export const generateSchedules = (studentList: Student[], days: number): Schedule[] => {
  const schedules: Schedule[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create a copy of student list to avoid mutation
  const students = [...studentList];
  
  for (let i = 0; i < days; i++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(scheduleDate.getDate() + i);
    
    // Skip weekends
    if (scheduleDate.getDay() === 0 || scheduleDate.getDay() === 6) {
      continue;
    }
    
    // Shuffle the students to get random assignments
    const shuffledStudents = shuffleArray([...students]);
    
    // Select the first 6 students for the day
    const selectedStudents = shuffledStudents.slice(0, 6);
    
    // Select a random representative from the 6 students
    const representativeIndex = Math.floor(Math.random() * selectedStudents.length);
    const representative = selectedStudents[representativeIndex];
    
    schedules.push({
      date: scheduleDate,
      students: selectedStudents,
      representative
    });
  }
  
  return schedules;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array Array to shuffle
 * @returns Shuffled array
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};