
import React from 'react';
import { Search, FileSignature } from 'lucide-react';

export function AdminReviewsView({ isDarkMode }: { isDarkMode?: boolean }) {
  const mockStudents = [
    { id: '1', name: 'Carlos Mendoza', control: '21530321', career: 'Ing. Sistemas', status: 'Pendiente Revisión', date: '24 Mar 2026' },
    { id: '2', name: 'Ana Sofía López', control: '21530112', career: 'Ing. Industrial', status: 'Aprobado', date: '23 Mar 2026' },
    { id: '3', name: 'Luis Ramírez', control: '20530998', career: 'Administración', status: 'Rechazado', date: '22 Mar 2026' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Revisión de Expedientes</h2>
          <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Evalúa los documentos técnicos y genera las cartas de liberación.</p>
        </div>
      </div>

      <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}>
        <div className={`p-8 border-b transition-colors duration-500 ${isDarkMode ? 'border-neutral-800 bg-[#0a0f18]/30' : 'border-neutral-100 bg-neutral-50/30'}`}>
          <div className="relative w-full max-w-md group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número de control..." 
              className={`w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-sm font-bold shadow-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-white border-neutral-200 text-neutral-800'}`}
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Alumno</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Carrera</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Envío</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Estado</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-right ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Acción</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-neutral-800' : 'divide-neutral-50'}`}>
              {mockStudents.map((student) => (
                <tr key={student.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-[#1a2333]' : 'hover:bg-brand-teal/[0.02]'}`}>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{student.name}</span>
                      <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{student.control}</span>
                    </div>
                  </td>
                  <td className={`px-8 py-6 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{student.career}</td>
                  <td className={`px-8 py-6 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>{student.date}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.status === 'Aprobado' ? 'bg-brand-teal/10 text-brand-teal' :
                      student.status === 'Rechazado' ? 'bg-brand-orange/10 text-brand-orange' :
                      isDarkMode ? 'bg-brand-blue/20 text-brand-blue' : 'bg-brand-blue/10 text-brand-blue'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className={`inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 ${isDarkMode ? 'bg-[#1a2333] text-brand-teal hover:bg-brand-teal hover:text-white border border-neutral-800' : 'bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white'}`}>
                      <FileSignature size={14} />
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
