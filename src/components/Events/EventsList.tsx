import React, { useState } from 'react';
import { Calendar, Clock, Plus, Filter, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EventForm from './EventForm';

const EventsList: React.FC = () => {
  const { user } = useAuth();
  const { events } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'exam' | 'meeting' | 'activity' | 'holiday'>('all');

  const filteredEvents = events
    .filter(event => filter === 'all' || event.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'activity': return 'bg-green-100 text-green-800 border-green-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'exam': return 'Examen';
      case 'meeting': return 'Reunión';
      case 'activity': return 'Actividad';
      case 'holiday': return 'Feriado';
      default: return 'Evento';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario de Eventos</h1>
          <p className="text-gray-600">Próximas actividades y fechas importantes</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="exam">Exámenes</option>
              <option value="meeting">Reuniones</option>
              <option value="activity">Actividades</option>
              <option value="holiday">Feriados</option>
            </select>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Evento
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                  {getEventTypeLabel(event.type)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(event.date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{event.time} hrs</span>
              </div>
            </div>

            {new Date(event.date) < new Date() && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  Evento pasado
                </span>
              </div>
            )}

            {new Date(event.date) >= new Date() && new Date(event.date) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                  Próximo evento
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay eventos</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'No se han programado eventos aún.' 
              : `No hay eventos del tipo ${getEventTypeLabel(filter).toLowerCase()}.`
            }
          </p>
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <EventForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default EventsList;