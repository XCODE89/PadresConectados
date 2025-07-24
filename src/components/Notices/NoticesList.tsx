import React, { useState } from 'react';
import { Bell, Plus, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NoticeForm from './NoticeForm';

const NoticesList: React.FC = () => {
  const { user } = useAuth();
  const { notices, markNoticeAsRead } = useData();
  const [showForm, setShowForm] = useState(false);

  const handleMarkAsRead = (noticeId: string) => {
    if (!user) return;
    markNoticeAsRead(noticeId, user.id);
  };

  const isRead = (notice: any) => {
    return notice.read.includes(user?.id || '');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      default: return 'Baja';
    }
  };

  const sortedNotices = notices.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avisos Importantes</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Publica avisos importantes para todos los apoderados'
              : 'Mantente informado de las últimas noticias del curso'
            }
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Aviso
          </button>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.map((notice) => {
          const read = isRead(notice);
          const PriorityIcon = getPriorityIcon(notice.priority);
          
          return (
            <div 
              key={notice.id} 
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 ${
                read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    notice.priority === 'high' ? 'bg-red-100 text-red-600' :
                    notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <PriorityIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notice.title}
                      </h3>
                      {!read && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                        Prioridad {getPriorityLabel(notice.priority)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(notice.createdAt), 'dd/MM/yyyy - HH:mm', { locale: es })}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {notice.message}
                    </p>

                    {user?.role === 'admin' && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Leído por {notice.read.length} apoderados</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {user?.role === 'parent' && !read && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleMarkAsRead(notice.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar como leído
                  </button>
                </div>
              )}

              {read && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Leído</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {notices.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay avisos</h3>
          <p className="text-gray-500">No se han publicado avisos aún.</p>
        </div>
      )}

      {/* Notice Form Modal */}
      {showForm && (
        <NoticeForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default NoticesList;