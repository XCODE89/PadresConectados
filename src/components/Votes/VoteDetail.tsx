import React from 'react';
import { X, Vote, Calendar, Users, CheckCircle, User } from 'lucide-react';
import { Vote as VoteType } from '../../types';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VoteDetailProps {
  vote: VoteType;
  onClose: () => void;
}

const VoteDetail: React.FC<VoteDetailProps> = ({ vote, onClose }) => {
  const { students } = useData();

  const getTotalVotes = () => {
    return vote.options.reduce((total, option) => total + option.votes, 0);
  };

  const getVoterDetails = () => {
    return vote.voters.map(voterId => {
      const student = students.find(s => s.parentId === voterId);
      return student ? { id: voterId, name: student.parentName, studentName: student.name } : null;
    }).filter(Boolean);
  };

  const getNonVoters = () => {
    const voterIds = vote.voters;
    return students.filter(student => !voterIds.includes(student.parentId));
  };

  const totalVotes = getTotalVotes();
  const voterDetails = getVoterDetails();
  const nonVoters = getNonVoters();
  const isActive = new Date(vote.endDate) >= new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{vote.title}</h2>
            <p className="text-gray-600 mt-1">{vote.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Vote Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="bg-blue-100 rounded-full p-3 inline-block mb-2">
              <Vote className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-600">{totalVotes}</h3>
            <p className="text-blue-700 text-sm">Total votos</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="bg-green-100 rounded-full p-3 inline-block mb-2">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-600">{voterDetails.length}</h3>
            <p className="text-green-700 text-sm">Han votado</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="bg-orange-100 rounded-full p-3 inline-block mb-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-orange-600">{nonVoters.length}</h3>
            <p className="text-orange-700 text-sm">Pendientes</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="bg-purple-100 rounded-full p-3 inline-block mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-purple-600">
              {format(new Date(vote.endDate), 'dd/MM', { locale: es })}
            </h3>
            <p className="text-purple-700 text-sm">
              {isActive ? 'Termina' : 'Terminó'}
            </p>
          </div>
        </div>

        {/* Vote Results */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados de la Votación</h3>
          <div className="space-y-4">
            {vote.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              
              return (
                <div key={option.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">{option.votes}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Apoderados que Votaron ({voterDetails.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {voterDetails.map((voter) => (
                <div key={voter?.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{voter?.name}</h4>
                      <p className="text-sm text-gray-600">Apoderado de {voter?.studentName}</p>
                    </div>
                  </div>
                </div>
              ))}
              {voterDetails.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Vote className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Aún no hay votos registrados</p>
                </div>
              )}
            </div>
          </div>

          {/* Non-voters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              Apoderados Pendientes ({nonVoters.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {nonVoters.map((student) => (
                <div key={student.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.parentName}</h4>
                      <p className="text-sm text-gray-600">Apoderado de {student.name}</p>
                      {student.parentEmail && (
                        <p className="text-xs text-gray-500">{student.parentEmail}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {nonVoters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <p className="text-green-600">¡Todos los apoderados han votado!</p>
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

export default VoteDetail;