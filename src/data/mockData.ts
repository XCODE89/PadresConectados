import { User, Course, Student, Event, Fee, Vote, Notice, Payment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Profesora María González',
    email: 'maria.gonzalez@colegio.cl'
  },
  {
    id: '2',
    username: 'padre1',
    password: 'pass123',
    role: 'parent',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    courseId: '1',
    studentId: '1'
  },
  {
    id: '3',
    username: 'padre2',
    password: 'pass123',
    role: 'parent',
    name: 'Ana López',
    email: 'ana.lopez@email.com',
    courseId: '1',
    studentId: '2'
  },
  {
    id: '4',
    username: 'padre3',
    password: 'pass123',
    role: 'parent',
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    courseId: '1',
    studentId: '3'
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: '4° Básico A',
    grade: '4° Básico',
    year: 2024,
    adminId: '1',
    createdAt: '2024-03-01'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Sofía Rodríguez',
    courseId: '1',
    parentId: '2',
    parentName: 'Carlos Rodríguez',
    parentEmail: 'carlos.rodriguez@email.com',
    parentPhone: '+56912345678',
    relationship: 'Padre'
  },
  {
    id: '2',
    name: 'Diego López',
    courseId: '1',
    parentId: '3',
    parentName: 'Ana López',
    parentEmail: 'ana.lopez@email.com',
    parentPhone: '+56987654321',
    relationship: 'Madre'
  },
  {
    id: '3',
    name: 'Valentina Silva',
    courseId: '1',
    parentId: '4',
    parentName: 'Roberto Silva',
    parentEmail: 'roberto.silva@email.com',
    parentPhone: '+56955555555',
    relationship: 'Padre'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Prueba de Matemáticas',
    description: 'Evaluación de multiplicaciones y divisiones',
    date: '2024-12-20',
    time: '10:00',
    type: 'exam',
    courseId: '1',
    createdBy: '1'
  },
  {
    id: '2',
    title: 'Reunión de Apoderados',
    description: 'Reunión mensual para revisar el progreso del curso',
    date: '2024-12-22',
    time: '19:00',
    type: 'meeting',
    courseId: '1',
    createdBy: '1'
  },
  {
    id: '3',
    title: 'Obra de Teatro Navideña',
    description: 'Presentación navideña de los alumnos',
    date: '2024-12-23',
    time: '11:00',
    type: 'activity',
    courseId: '1',
    createdBy: '1'
  }
];

export const mockFees: Fee[] = [
  {
    id: '1',
    title: 'Cuota Diciembre',
    description: 'Cuota mensual de escolaridad',
    amount: 45000,
    dueDate: '2024-12-15',
    courseId: '1',
    createdBy: '1',
    payments: [
      {
        id: '1',
        feeId: '1',
        studentId: '1',
        amount: 45000,
        paidDate: '2024-12-01',
        status: 'paid'
      }
    ]
  },
  {
    id: '2',
    title: 'Material Didáctico',
    description: 'Aporte para material educativo del próximo semestre',
    amount: 15000,
    dueDate: '2024-12-30',
    courseId: '1',
    createdBy: '1',
    payments: []
  }
];

export const mockVotes: Vote[] = [
  {
    id: '1',
    title: 'Horario Reunión Enero',
    description: '¿Cuál es el mejor horario para la primera reunión de enero?',
    options: [
      { id: '1', text: 'Lunes 19:00', votes: 2 },
      { id: '2', text: 'Miércoles 19:00', votes: 5 },
      { id: '3', text: 'Viernes 18:30', votes: 1 }
    ],
    courseId: '1',
    createdBy: '1',
    startDate: '2024-12-15',
    endDate: '2024-12-25',
    allowViewResults: true,
    voters: ['2', '3']
  }
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Horarios de Vacaciones',
    message: 'Les recordamos que las vacaciones de verano comenzarán el 24 de diciembre. El regreso a clases será el 6 de marzo de 2025.',
    courseId: '1',
    createdBy: '1',
    createdAt: '2024-12-10',
    priority: 'high',
    read: ['2']
  },
  {
    id: '2',
    title: 'Lista de Útiles 2025',
    message: 'La lista de útiles escolares para el próximo año estará disponible en la secretaría a partir del 15 de enero.',
    courseId: '1',
    createdBy: '1',
    createdAt: '2024-12-08',
    priority: 'medium',
    read: []
  }
];