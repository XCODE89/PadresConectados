import React, { useState } from 'react';
import { Vote, Plus, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import VoteForm from './VoteForm';

const VotesList: React.FC = () => {
  const { user } = useAuth();
  const { votes, submitVote } = useData();
  const [showForm, setShowForm] = useState(false);

  const handleVote = (voteId: string, optionId: string) => {
    if (!user) return;
    submitVote(voteId, optionId, user.id);
  };

  const hasVoted = (vote: any) => {
    return vote.voters.includes(user?.id || '');
  };

  const isVoteActive = (vote: any) => {
    const now = new Date();
    return new Date(vote.startDate) <= now && new Date(vote.endDate) >= now;
  };

  const getTotalVotes = (vote: any) => {
    return vote.options.reduce((total: number, option: any) => total + option.votes, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Votaciones</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Crea y gestiona votaciones para el curso'
              : 'Participa en las votaciones activas'
            }
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Votación
          </button>
        )}
      </div>

      {/* Votes List */}
      <div className="space-y-6">
        {votes.map((vote) => {
          const totalVotes = getTotalVotes(vote);
          const userHasVoted = hasVoted(vote);
          const voteIsActive = isVoteActive(vote);
          const canShowResults = vote.allowViewResults || userHasVoted || user?.role === 'admin';

          return (
            <div key={vote.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{vote.title}</h3>
                  <p className="text-gray-600 mb-4">{vote.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(vote.startDate), 'dd/MM', { locale: es })} - {format(new Date(vote.endDate), 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{totalVotes} votos</span>
                    </div>
                  </div>

                  {voteIsActive && !userHasVoted && user?.role === 'parent' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-700 text-sm font-medium">¡Puedes votar en esta encuesta!</p>
                    </div>
                  )}

                  {userHasVoted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-green-700 text-sm font-medium">Ya has votado en esta encuesta</p>
                    </div>
                  )}

                  {!voteIsActive && new Date(vote.endDate) < new Date() && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <p className="text-gray-700 text-sm font-medium">Votación finalizada</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vote Options */}
              <div className="space-y-3">
                {vote.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 transition-all duration-200 ${
                        voteIsActive && !userHasVoted && user?.role === 'parent'
                          ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                          : ''
                      }`}
                      onClick={() => {
                        if (voteIsActive && !userHasVoted && user?.role === 'parent') {
                          handleVote(vote.id, option.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{option.text}</span>
                        {canShowResults && (
                          <span className="text-sm text-gray-500">
                            {option.votes} votos ({percentage.toFixed(0)}%)
                          </span>
                        )}
                      </div>
                      
                      {canShowResults && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!canShowResults && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    Los resultados se mostrarán después de votar o cuando termine la votación.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {votes.length === 0 && (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay votaciones</h3>
          <p className="text-gray-500">No se han creado votaciones aún.</p>
        </div>
      )}

      {/* Vote Form Modal */}
      {showForm && (
        <VoteForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default VotesList;