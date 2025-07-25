import React from 'react';
import { X, DollarSign, Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { Fee } from '../../types';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FeeDetailProps {
  fee: Fee;
  onClose: () => void;
}

const FeeDetail: React.FC<FeeDetailProps> = ({ fee, onClose }) => {
  const { students } = useData();

  const getPaymentStatus = (studentId: string) => {
    return fee.payments.find(payment => 
      payment.studentId === studentId && payment.status === 'paid'
    );
  };

  const paidStudents = students.filter(student => getPaymentStatus(student.id));
  const unpaidStudents = students.filter(student => !getPaymentStatus(student.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fee.title}</h2>
            <p className="text-gray-600 mt-1">{fee.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Fee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="bg-green-100 rounded-full p-3 inline-block mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">
              ${fee.amount.toLocaleString('es-CL')}
            </h3>
            <p className="text-green-700 text-sm">Monto de la cuota</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="bg-blue-100 rounded-full p-3 inline-block mb-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-600">
              {paidStudents.length}/{students.length}
            </h3>
            <p className="text-blue-700 text-sm">Alumnos que pagaron</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <div className="bg-orange-100 rounded-full p-3 inline-block mb-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-orange-600">
              {format(new Date(fee.dueDate), 'dd/MM/yyyy', { locale: es })}
            </h3>
            <p className="text-orange-700 text-sm">Fecha de vencimiento</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de pagos</span>
            <span className="text-sm text-gray-500">
              {Math.round((paidStudents.length / students.length) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(paidStudents.length / students.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Paid Students */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Alumnos que Pagaron ({paidStudents.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {paidStudents.map((student) => {
                const payment = getPaymentStatus(student.id);
                return (
                  <div key={student.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-2">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.parentName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-700">
                          ${payment?.amount.toLocaleString('es-CL')}
                        </p>
                        <p className="text-xs text-green-600">
                          {payment && format(new Date(payment.paidDate), 'dd/MM/yyyy', { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {paidStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Aún no hay pagos registrados</p>
                </div>
              )}
            </div>
          </div>

          {/* Unpaid Students */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              Alumnos Pendientes ({unpaidStudents.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {unpaidStudents.map((student) => (
                <div key={student.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 rounded-full p-2">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.parentName}</p>
                        {student.parentEmail && (
                          <p className="text-xs text-gray-500">{student.parentEmail}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-700">
                        ${fee.amount.toLocaleString('es-CL')}
                      </p>
                      <p className="text-xs text-orange-600">Pendiente</p>
                    </div>
                  </div>
                </div>
              ))}
              {unpaidStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <p className="text-green-600">¡Todos los alumnos han pagado!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeDetail;