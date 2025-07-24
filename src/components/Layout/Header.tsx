import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { notices } = useData();

  const unreadNotices = notices.filter(notice => 
    notice.courseId === user?.courseId && !notice.read.includes(user?.id || '')
  );

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Panel de Administración' : 'Mi Panel'}
          </h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' 
              ? 'Gestiona tu curso y mantente conectado con los apoderados'
              : `Información de ${user?.name}`
            }
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <Bell className="h-6 w-6" />
              {unreadNotices.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotices.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;