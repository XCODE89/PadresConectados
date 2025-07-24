import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Vote, 
  Bell, 
  Users, 
  BookOpen, 
  BarChart3,
  User,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: BarChart3, label: 'Panel Principal' },
    { to: '/students', icon: Users, label: 'Alumnos' },
    { to: '/events', icon: Calendar, label: 'Eventos' },
    { to: '/fees', icon: DollarSign, label: 'Cuotas' },
    { to: '/votes', icon: Vote, label: 'Votaciones' },
    { to: '/notices', icon: Bell, label: 'Avisos' },
  ];

  const parentLinks = [
    { to: '/dashboard', icon: BookOpen, label: 'Mi Panel' },
    { to: '/events', icon: Calendar, label: 'Eventos' },
    { to: '/fees', icon: DollarSign, label: 'Cuotas' },
    { to: '/votes', icon: Vote, label: 'Votaciones' },
    { to: '/notices', icon: Bell, label: 'Avisos' },
  ];

  const links = user?.role === 'admin' ? adminLinks : parentLinks;

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-lg p-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PadresConectados</h1>
            <p className="text-sm text-gray-500">
              {user?.role === 'admin' ? 'Administrador' : 'Apoderado'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gray-100 rounded-full p-2">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;