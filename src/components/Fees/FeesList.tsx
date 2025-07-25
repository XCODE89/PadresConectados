import React, { useState } from 'react';
import { DollarSign, Plus, Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import FeeForm from './FeeForm';
import FeeDetail from './FeeDetail';

const FeesList: React.FC = () => {
  const { user } = useAuth();
  const { fees, students, addPayment } = useData();
  const [showForm, setShowForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const myStudent = students.find(s => s.parentId === user?.id);

  const handleMarkAsPaid = (feeId: string) => {
    if (!myStudent) return;
    
    addPayment({
      feeId,
      studentId: myStudent.id,
      amount: fees.find(f => f.id === feeId)?.amount || 0,
      paidDate: new Date().toISOString(),
      status: 'paid'
    });
  };

  const getPaymentStatus = (fee: any) => {
    if (user?.role === 'admin') {
      const totalStudents = students.length;
      const paidCount = fee.payments.filter((p: any) => p.status === 'paid').length;
      return { paid: paidCount, total: totalStudents };
    } else {
      const isPaid = fee.payments.some((p: any) => 
        p.studentId === myStudent?.id && p.status === 'paid'
      );
      return { isPaid };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cuotas</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Administra las cuotas del curso y revisa los pagos'
              : 'Revisa y gestiona las cuotas de tu hijo/a'
            }
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Cuota
          </button>
        )}
      </div>

      {/* Fees List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fees.map((fee) => {
          const status = getPaymentStatus(fee);
          const isOverdue = new Date(fee.dueDate) < new Date();
          
          return (
            <div 
              key={fee.id} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => user?.role === 'admin' ? setSelectedFee(fee) : undefined}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{fee.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{fee.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ${fee.amount.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Vence: {format(new Date(fee.dueDate), 'dd/MM/yyyy', { locale: es })}</span>
                  {isOverdue && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Vencida
                    </span>
                  )}
                </div>

                {user?.role === 'admin' ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Estado de pagos</span>
                      <span className="text-sm text-gray-500">
                        {status.paid}/{status.total} pagados
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(status.paid / status.total) * 100}%` }}
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      {fee.payments.filter((p: any) => p.status === 'paid').slice(0, 3).map((payment: any) => {
                        const student = students.find(s => s.id === payment.studentId);
                        return (
                          <div key={payment.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{student?.parentName} - {format(new Date(payment.paidDate), 'dd/MM', { locale: es })}</span>
                          </div>
                        );
                      })}
                      {fee.payments.filter((p: any) => p.status === 'paid').length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{fee.payments.filter((p: any) => p.status === 'paid').length - 3} más...
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {status.isPaid ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Pagado</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-orange-700">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">Pendiente de pago</span>
                        </div>
                        <button
                          onClick={() => handleMarkAsPaid(fee.id)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Marcar como Pagado
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Al hacer clic confirmas que has realizado el pago
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {fees.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cuotas</h3>
          <p className="text-gray-500">No se han creado cuotas aún.</p>
        </div>
      )}

      {/* Fee Form Modal */}
      {showForm && (
        <FeeForm onClose={() => setShowForm(false)} />
      )}

      {/* Fee Detail Modal */}
      {selectedFee && (
        <FeeDetail 
          fee={selectedFee} 
          onClose={() => setSelectedFee(null)} 
        />
      )}
    </div>
  );
};

export default FeesList;