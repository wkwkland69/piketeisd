import { createContext, useContext, useState, useEffect } from 'react';
import { generateSchedules } from '../utils/scheduleGenerator';
import { isAfter, differenceInCalendarDays } from 'date-fns';
import { students } from '../data/students';
import { Schedule, Proof } from '../types';

interface ScheduleContextType {
  schedules: Schedule[];
  proofs: Proof[];
  getUpcomingSchedules: (nim: string, count?: number) => Schedule[];
  getSchedulesByDate: (date: Date) => Schedule[];
  submitProof: (proof: Omit<Proof, 'id' | 'timestamp'>) => void;
  hasSubmittedProof: (date: Date, nim: string) => boolean;
  getProofsByDate: (date: Date) => Proof[];
  extendSchedulesTo: (targetDate: Date) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: { children: React.ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [proofs, setProofs] = useState<Proof[]>([]);

  useEffect(() => {
    // Load schedules from localStorage or generate new ones
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      try {
        const parsedSchedules = JSON.parse(savedSchedules).map((schedule: any) => ({
          ...schedule,
          date: new Date(schedule.date)
        }));
        setSchedules(parsedSchedules);
      } catch (error) {
        console.error('Error parsing saved schedules:', error);
        generateAndSaveSchedules();
      }
    } else {
      generateAndSaveSchedules();
    }

    // Load proofs from localStorage
    const savedProofs = localStorage.getItem('proofs');
    if (savedProofs) {
      try {
        const parsedProofs = JSON.parse(savedProofs).map((proof: any) => ({
          ...proof,
          date: new Date(proof.date),
          timestamp: new Date(proof.timestamp)
        }));
        setProofs(parsedProofs);
      } catch (error) {
        console.error('Error parsing saved proofs:', error);
        setProofs([]);
      }
    }
  }, []);

  const generateAndSaveSchedules = () => {
    // Generate schedules for the next 30 days (excluding weekends)
    const newSchedules = generateSchedules(students, 30);
    setSchedules(newSchedules);
    localStorage.setItem('schedules', JSON.stringify(newSchedules));
  };

  const getUpcomingSchedules = (nim: string, count: number = 5): Schedule[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return schedule.students.some(s => s.nim === nim) && scheduleDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, count);
  };

  const getSchedulesByDate = (date: Date): Schedule[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate.getTime() === targetDate.getTime();
    });
  };

  const extendSchedulesTo = (targetDate: Date) => {
    let lastDate = schedules.length > 0
      ? new Date(schedules[schedules.length - 1].date)
      : new Date();
    lastDate.setHours(0, 0, 0, 0);
    if (isAfter(targetDate, lastDate)) {
      const daysToAdd = differenceInCalendarDays(targetDate, lastDate) + 30;
      const newSchedules = generateSchedules(students, schedules.length + daysToAdd);
      setSchedules(newSchedules);
      localStorage.setItem('schedules', JSON.stringify(newSchedules));
    }
  };




  const submitProof = (proofData: Omit<Proof, 'id' | 'timestamp'>) => {
    const newProof: Proof = {
      ...proofData,
      id: `proof_${Date.now()}`,
      timestamp: new Date()
    };

    const updatedProofs = [...proofs, newProof];
    setProofs(updatedProofs);
    localStorage.setItem('proofs', JSON.stringify(updatedProofs));
  };

  const hasSubmittedProof = (date: Date, nim: string): boolean => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return proofs.some(proof => {
      const proofDate = new Date(proof.date);
      proofDate.setHours(0, 0, 0, 0);
      return proofDate.getTime() === targetDate.getTime() && proof.nim === nim;
    });
  };

  const getProofsByDate = (date: Date): Proof[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return proofs.filter(proof => {
      const proofDate = new Date(proof.date);
      proofDate.setHours(0, 0, 0, 0);
      return proofDate.getTime() === targetDate.getTime();
    });
  };

  const value = {
    schedules,
    proofs,
    getUpcomingSchedules,
    getSchedulesByDate,
    submitProof,
    hasSubmittedProof,
    getProofsByDate,
    extendSchedulesTo,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};