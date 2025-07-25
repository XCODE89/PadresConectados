import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';

interface ExcelUploadProps {
  onClose: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onClose }) => {
  const { addMultipleStudents } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }

    setFile(selectedFile);
    setError('');
    processFile(selectedFile);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate required columns
        if (jsonData.length === 0) {
          setError('El archivo está vacío');
          return;
        }

        const firstRow = jsonData[0] as any;
        const requiredColumns = ['nombre_alumno', 'nombre_apoderado', 'relacion'];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          setError(`Faltan las siguientes columnas: ${missingColumns.join(', ')}`);
          return;
        }

        setPreview(jsonData.slice(0, 5)); // Show first 5 rows as preview
      } catch (err) {
        setError('Error al procesar el archivo. Verifica que sea un archivo Excel válido.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const students = jsonData.map((row: any) => ({
          name: row.nombre_alumno || '',
          parentName: row.nombre_apoderado || '',
          parentEmail: row.email || '',
          parentPhone: row.telefono || '',
          relationship: row.relacion || 'Apoderado'
        }));

        addMultipleStudents(students);
        setSuccess(true);
        
        setTimeout(() => {
          onClose();
        }, 2000);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error al procesar los datos. Intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        nombre_alumno: 'Juan Pérez',
        nombre_apoderado: 'María Pérez',
        relacion: 'Madre',
        email: 'maria.perez@email.com',
        telefono: '+56912345678'
      },
      {
        nombre_alumno: 'Ana García',
        nombre_apoderado: 'Carlos García',
        relacion: 'Padre',
        email: 'carlos.garcia@email.com',
        telefono: '+56987654321'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
    XLSX.writeFile(wb, 'plantilla_alumnos.xlsx');
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Carga Exitosa!</h2>
          <p className="text-gray-600">Los alumnos han sido agregados correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Cargar Alumnos desde Excel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">¿Primera vez usando esta función?</h3>
              <p className="text-blue-700 text-sm mb-3">
                Descarga nuestra plantilla de Excel para asegurar el formato correcto.
              </p>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <Download className="h-4 w-4" />
                Descargar Plantilla
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar archivo Excel
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600">
                  Arrastra tu archivo aquí o{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                    selecciona un archivo
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">Formatos soportados: .xlsx, .xls</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Archivo seleccionado:</h4>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Vista previa (primeras 5 filas):</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Alumno
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Apoderado
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Relación
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preview.map((row: any, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row.nombre_alumno || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row.nombre_apoderado || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row.relacion || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row.email || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Required Format Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Formato requerido:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>nombre_alumno</strong>: Nombre completo del alumno (obligatorio)</li>
              <li>• <strong>nombre_apoderado</strong>: Nombre completo del apoderado (obligatorio)</li>
              <li>• <strong>relacion</strong>: Padre, Madre, Abuelo, etc. (obligatorio)</li>
              <li>• <strong>email</strong>: Email del apoderado (opcional)</li>
              <li>• <strong>telefono</strong>: Teléfono del apoderado (opcional)</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || preview.length === 0 || isProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Procesando...' : 'Cargar Alumnos'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;