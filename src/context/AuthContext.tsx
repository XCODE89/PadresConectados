import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  registerAdmin: (adminData: any) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const registerAdmin = (adminData: any): boolean => {
    // Check if username already exists
    const existingUser = mockUsers.find(u => u.username === adminData.username);
    if (existingUser) {
      return false;
    }

    // Create new admin user
    const newAdmin: User = {
      id: Date.now().toString(),
      username: adminData.username,
      password: adminData.password,
      role: 'admin',
      name: adminData.name,
      email: adminData.email
    };

    // Add to mock users (in a real app, this would be an API call)
    mockUsers.push(newAdmin);
    
    // Create course (in a real app, this would also be an API call)
    const newCourse = {
      id: Date.now().toString(),
      name: adminData.courseName,
      grade: adminData.courseGrade,
      year: new Date().getFullYear(),
      adminId: newAdmin.id,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage for persistence
    const savedCourses = localStorage.getItem('courses');
    const courses = savedCourses ? JSON.parse(savedCourses) : [];
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, registerAdmin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};