import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NoticeFormProps {
  onClose: () => void;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { addNotice } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addNotice({
      title: formData.title,
      message: formData.message,
      priority: formData.priority,
      courseId: '1',
      createdBy: user?.id || '',
      createdAt: new Date().toISOString()
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      default: return Bell;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Aviso</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del aviso
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Horarios de vacaciones"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="low">Baja - Información general</option>
              <option value="medium">Media - Información importante</option>
              <option value="high">Alta - Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Escribe el mensaje del aviso..."
              required
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  formData.priority === 'high' ? 'bg-red-100 text-red-600' :
                  formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {React.createElement(getPriorityIcon(formData.priority), { className: 'h-4 w-4' })}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">
                    {formData.title || 'Título del aviso'}
                  </h5>
                  <p className="text-gray-700 text-sm">
                    {formData.message || 'Mensaje del aviso...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Publicar Aviso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;