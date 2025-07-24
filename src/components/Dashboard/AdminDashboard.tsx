import React from 'react';
import { Users, Calendar, DollarSign, Bell, TrendingUp, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminDashboard: React.FC = () => {
  const { students, events, fees, notices, votes } = useData();

  const today = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const totalStudents = students.length;
  const totalEvents = events.length;
  const unpaidFees = fees.reduce((total, fee) => {
    const unpaidCount = totalStudents - fee.payments.filter(p => p.status === 'paid').length;
    return total + unpaidCount;
  }, 0);
  const activeVotes = votes.filter(vote => new Date(vote.endDate) >= today).length;

  const stats = [
    {
      title: 'Total Alumnos',
      value: totalStudents,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+2 este mes'
    },
    {
      title: 'Eventos Programados',
      value: totalEvents,
      icon: Calendar,
      color: 'bg-green-500',
      trend: '3 próximos'
    },
    {
      title: 'Cuotas Pendientes',
      value: unpaidFees,
      icon: DollarSign,
      color: 'bg-orange-500',
      trend: 'Revisar pagos'
    },
    {
      title: 'Votaciones Activas',
      value: activeVotes,
      icon: Bell,
      color: 'bg-purple-500',
      trend: 'En progreso'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Bienvenido de vuelta!</h1>
        <p className="text-blue-100">
          Aquí tienes un resumen de la actividad de tu curso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.trend}</p>
          </div>
        ))}
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
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), 'dd/MM/yyyy', { locale: es })} - {event.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay eventos próximos</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Pago recibido</h3>
                <p className="text-sm text-gray-500">Carlos Rodríguez - Cuota Diciembre</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Nuevo aviso publicado</h3>
                <p className="text-sm text-gray-500">Horarios de Vacaciones</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Votación activa</h3>
                <p className="text-sm text-gray-500">Horario Reunión Enero - 2 votos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;