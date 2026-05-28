import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, Loader2, RefreshCw, Building2 } from 'lucide-react';
import { Dependency } from '../../types';
import * as dbService from '../../services/dbService';
import { NewDependencyModal } from './NewDependencyModal';
import { AnimatePresence, motion } from 'motion/react';

export function AdminCatalogView({ isDarkMode }: { isDarkMode?: boolean }) {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingDependency, setEditingDependency] = useState<Dependency | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDeps = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.getDependencies();
      setDependencies(data);
    } catch (err) {
      console.error("Error loading dependencies: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeps();
  }, []);

  const handleSaveDependency = async (data: any) => {
    try {
      await dbService.saveDependency(data);
      setSuccessMessage(data.id ? '¡Dependencia actualizada exitosamente!' : '¡Dependencia agregada exitosamente!');
      setShowNewModal(false);
      setEditingDependency(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await fetchDeps();
    } catch (err) {
      console.error("Error saving dependency:", err);
    }
  };

  const handleDeleteDependency = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la dependencia "${name}" del catálogo?`)) {
      try {
        await dbService.deleteDependency(id);
        setSuccessMessage('¡Dependencia eliminada exitosamente!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        await fetchDeps();
      } catch (err) {
        console.error("Error deleting dependency:", err);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Gestión de Catálogo</h2>
          <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Administra las dependencias y plazas disponibles para servicio social.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchDeps}
            className={`p-4 rounded-full border transition-all ${isDarkMode ? 'bg-[#121926] border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-neutral-150 text-neutral-500 hover:text-brand-blue'}`}
            title="Refrescar catálogo"
          >
            <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setEditingDependency(null);
              setShowNewModal(true);
            }}
            className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-4 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20 transition-all active:scale-95 whitespace-nowrap group"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" />
            <span>Nueva Dependencia</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] bg-brand-teal text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold"
          >
            <CheckCircle2 size={24} />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}>
        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
              <Loader2 className="animate-spin text-brand-teal mb-4" size={36} />
              <p className="font-bold uppercase tracking-widest text-[11px]">Cargando dependencias de la Base de Datos...</p>
            </div>
          ) : dependencies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
              <Building2 className="mb-4 opacity-20" size={48} />
              <p className="font-bold uppercase tracking-widest text-[11px]">Sin dependencias registradas</p>
              <p className="text-sm mt-1">Crea una nueva dependencia para guardarla en Firestore.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Dependencia</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Categoría</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Vacantes</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Estado</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-right ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-neutral-800' : 'divide-neutral-50'}`}>
                {dependencies.map((dep) => (
                  <tr key={dep.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-[#1a2333]' : 'hover:bg-brand-teal/[0.02]'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border shadow-sm group-hover:shadow-md transition-all duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-100 border-neutral-50'}`}>
                          {dep.image ? (
                            <img src={dep.image} alt={dep.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-teal/10 text-brand-teal font-bold text-sm">
                              {dep.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className={`font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{dep.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{dep.category}</td>
                    <td className={`px-6 py-4 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-700'}`}>{dep.vacancies} / {dep.maxVacancies}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        dep.vacancies > 0 ? 'bg-brand-teal/10 text-brand-teal' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}>
                        {dep.vacancies > 0 ? dep.status || 'Disponible' : 'Sin Cupos'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingDependency(dep);
                            setShowNewModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-neutral-600 hover:text-brand-teal hover:bg-brand-teal/10' : 'text-neutral-400 hover:text-blue-600 hover:bg-blue-50'}`}
                          title="Editar dependencia"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDependency(dep.id, dep.name)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'text-neutral-600 hover:text-brand-orange hover:bg-brand-orange/10' : 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50'}`}
                          title="Eliminar dependencia"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showNewModal && (
          <NewDependencyModal 
            onClose={() => {
              setShowNewModal(false);
              setEditingDependency(null);
            }}
            onSave={handleSaveDependency}
            isDarkMode={isDarkMode}
            dependency={editingDependency}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
