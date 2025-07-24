import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Student, Event, Fee, Vote, Notice, Payment } from '../types';
import { mockCourses, mockStudents, mockEvents, mockFees, mockVotes, mockNotices } from '../data/mockData';

interface DataContextType {
  courses: Course[];
  students: Student[];
  events: Event[];
  fees: Fee[];
  votes: Vote[];
  notices: Notice[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  addFee: (fee: Omit<Fee, 'id' | 'payments'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addVote: (vote: Omit<Vote, 'id' | 'voters'>) => void;
  submitVote: (voteId: string, optionId: string, userId: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'read'>) => void;
  markNoticeAsRead: (noticeId: string, userId: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const savedCourses = localStorage.getItem('courses');
    const savedStudents = localStorage.getItem('students');
    const savedEvents = localStorage.getItem('events');
    const savedFees = localStorage.getItem('fees');
    const savedVotes = localStorage.getItem('votes');
    const savedNotices = localStorage.getItem('notices');

    setCourses(savedCourses ? JSON.parse(savedCourses) : mockCourses);
    setStudents(savedStudents ? JSON.parse(savedStudents) : mockStudents);
    setEvents(savedEvents ? JSON.parse(savedEvents) : mockEvents);
    setFees(savedFees ? JSON.parse(savedFees) : mockFees);
    setVotes(savedVotes ? JSON.parse(savedVotes) : mockVotes);
    setNotices(savedNotices ? JSON.parse(savedNotices) : mockNotices);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveToStorage('events', updatedEvents);
  };

  const addFee = (feeData: Omit<Fee, 'id' | 'payments'>) => {
    const newFee = { ...feeData, id: Date.now().toString(), payments: [] };
    const updatedFees = [...fees, newFee];
    setFees(updatedFees);
    saveToStorage('fees', updatedFees);
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment = { ...paymentData, id: Date.now().toString() };
    const updatedFees = fees.map(fee => 
      fee.id === paymentData.feeId 
        ? { ...fee, payments: [...fee.payments, newPayment] }
        : fee
    );
    setFees(updatedFees);
    saveToStorage('fees', updatedFees);
  };

  const addVote = (voteData: Omit<Vote, 'id' | 'voters'>) => {
    const newVote = { ...voteData, id: Date.now().toString(), voters: [] };
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    saveToStorage('votes', updatedVotes);
  };

  const submitVote = (voteId: string, optionId: string, userId: string) => {
    const updatedVotes = votes.map(vote => {
      if (vote.id === voteId && !vote.voters.includes(userId)) {
        const updatedOptions = vote.options.map(option =>
          option.id === optionId ? { ...option, votes: option.votes + 1 } : option
        );
        return { ...vote, options: updatedOptions, voters: [...vote.voters, userId] };
      }
      return vote;
    });
    setVotes(updatedVotes);
    saveToStorage('votes', updatedVotes);
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'read'>) => {
    const newNotice = { ...noticeData, id: Date.now().toString(), read: [] };
    const updatedNotices = [...notices, newNotice];
    setNotices(updatedNotices);
    saveToStorage('notices', updatedNotices);
  };

  const markNoticeAsRead = (noticeId: string, userId: string) => {
    const updatedNotices = notices.map(notice =>
      notice.id === noticeId && !notice.read.includes(userId)
        ? { ...notice, read: [...notice.read, userId] }
        : notice
    );
    setNotices(updatedNotices);
    saveToStorage('notices', updatedNotices);
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = { ...studentData, id: Date.now().toString() };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    saveToStorage('students', updatedStudents);
  };

  return (
    <DataContext.Provider value={{
      courses,
      students,
      events,
      fees,
      votes,
      notices,
      addEvent,
      addFee,
      addPayment,
      addVote,
      submitVote,
      addNotice,
      markNoticeAsRead,
      addStudent
    }}>
      {children}
    </DataContext.Provider>
  );
};