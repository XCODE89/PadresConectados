import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, User, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StudentForm from './StudentForm';

const StudentsList: React.FC = () => {
  const { students } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h1>
          <p className="text-gray-600">Administra la lista de alumnos y sus apoderados</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Alumno
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar alumno o apoderado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">4° Básico A</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Apoderado</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{student.parentName} ({student.relationship})</span>
                  </div>
                  
                  {student.parentEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{student.parentEmail}</span>
                    </div>
                  )}
                  
                  {student.parentPhone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{student.parentPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Editar
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-500">No hay alumnos que coincidan con tu búsqueda.</p>
        </div>
      )}

      {students.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alumnos registrados</h3>
          <p className="text-gray-500">Comienza agregando el primer alumno al curso.</p>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Curso</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            <p className="text-sm text-gray-600">Total Alumnos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {students.filter(s => s.parentEmail).length}
            </p>
            <p className="text-sm text-gray-600">Con Email</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {students.filter(s => s.parentPhone).length}
            </p>
            <p className="text-sm text-gray-600">Con Teléfono</p>
          </div>
        </div>
      </div>

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default StudentsList;