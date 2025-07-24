import React from 'react';
import { Calendar, DollarSign, Bell, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { students, events, fees, notices, votes } = useData();

  const myStudent = students.find(s => s.parentId === user?.id);
  
  const today = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const myPendingFees = fees.filter(fee => 
    !fee.payments.some(payment => payment.studentId === myStudent?.id && payment.status === 'paid')
  );

  const unreadNotices = notices.filter(notice => 
    !notice.read.includes(user?.id || '')
  );

  const activeVotes = votes.filter(vote => 
    new Date(vote.endDate) >= today && !vote.voters.includes(user?.id || '')
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Hola {user?.name}!</h1>
        <p className="text-green-100">
          Información sobre {myStudent?.name} - 4° Básico A
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</p>
              <p className="text-sm text-gray-600">Próximos eventos</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{myPendingFees.length}</p>
              <p className="text-sm text-gray-600">Cuotas pendientes</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{unreadNotices.length}</p>
              <p className="text-sm text-gray-600">Avisos sin leer</p>
            </div>
            <Bell className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">{activeVotes.length}</p>
              <p className="text-sm text-gray-600">Votaciones pendientes</p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Próximos Eventos
          </h2>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg mr-3 ${
                    event.type === 'exam' ? 'bg-red-100 text-red-600' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), 'dd/MM/yyyy', { locale: es })} - {event.time}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay eventos próximos</p>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            Acciones Pendientes
          </h2>
          <div className="space-y-3">
            {myPendingFees.map((fee) => (
              <div key={fee.id} className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{fee.title}</h3>
                  <p className="text-sm text-gray-500">
                    Vence: {format(new Date(fee.dueDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                  <p className="text-sm font-medium text-orange-600">
                    ${fee.amount.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            ))}

            {activeVotes.map((vote) => (
              <div key={vote.id} className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{vote.title}</h3>
                  <p className="text-sm text-gray-500">
                    Termina: {format(new Date(vote.endDate), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
              </div>
            ))}

            {unreadNotices.slice(0, 2).map((notice) => (
              <div key={notice.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{notice.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{notice.message}</p>
                </div>
              </div>
            ))}

            {myPendingFees.length === 0 && activeVotes.length === 0 && unreadNotices.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full p-3 inline-block mb-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-500">¡Todo al día! No tienes acciones pendientes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;