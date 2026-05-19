
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Briefcase, CheckCircle2, User, Clock, FileText, MapPin, AlertCircle, Users } from 'lucide-react';
import { Dependency } from '../../types';

export function DependencyDetailsModal({ 
  dependency, 
  onClose, 
  onSelect, 
  isDarkMode 
}: { 
  dependency: Dependency, 
  onClose: () => void, 
  onSelect: () => void, 
  isDarkMode?: boolean 
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
          <div className="w-20 h-20 bg-brand-teal/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-teal/20">
            <CheckCircle2 className="text-brand-teal w-12 h-12" />
          </div>
          <h3 className={`text-3xl font-black mb-4 tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>¡Solicitud Enviada!</h3>
          <p className={`font-medium leading-relaxed mb-10 transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Tu solicitud para <span className="font-bold text-brand-teal">{dependency.name}</span> ha sido registrada con éxito. 
            Pronto recibirás noticias en tu correo académico.
          </p>
          <button 
            onClick={() => {
              onClose();
              onSelect();
            }}
            className={`w-full py-5 text-white font-black rounded-2xl transition-all shadow-xl ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue hover:bg-[#162a45] shadow-brand-blue/20'}`}
          >
            Entendido
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className={`rounded-[3.5rem] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] relative border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-blue to-brand-orange transition-opacity opacity-60"></div>
          {/* Header */}
          <div className={`p-10 sm:p-12 border-b flex items-center justify-between sticky top-0 z-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
            <div className="flex items-center gap-8">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-inner border flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
                <img src={dependency.image} alt={dependency.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.name}</h3>
                <p className="text-base sm:text-lg font-bold text-brand-teal mt-1 uppercase tracking-widest">{dependency.subCategory}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className={`p-4 rounded-2xl transition-all ${isDarkMode ? 'text-neutral-600 hover:text-brand-orange hover:bg-brand-orange/10' : 'text-neutral-300 hover:text-brand-orange hover:bg-brand-orange/5'}`}
            >
              <X size={32} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-10 sm:p-16 space-y-16 custom-scrollbar">
            {/* Objective */}
            <section className="space-y-6">
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                <Info size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Objetivo del Programa</h4>
              </div>
              <div className={`border rounded-[2rem] p-8 transition-colors duration-500 ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/10' : 'bg-brand-teal/5 border-brand-teal/10'}`}>
                <p className={`leading-relaxed font-medium text-sm sm:text-base transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {dependency.objective || 'No hay un objetivo definido para este programa.'}
                </p>
              </div>
            </section>

            {/* Activities */}
            <section className="space-y-6">
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                <Briefcase size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Actividades a Realizar</h4>
              </div>
              <div className={`border rounded-[2rem] p-8 space-y-5 transition-colors duration-500 ${isDarkMode ? 'bg-brand-orange/5 border-brand-orange/10' : 'bg-brand-orange/5 border-brand-orange/10'}`}>
                {dependency.activities?.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 p-1 bg-brand-orange/10 rounded-full">
                      <CheckCircle2 size={16} className="text-brand-orange" />
                    </div>
                    <span className={`font-bold text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>{activity}</span>
                  </div>
                ))}
                {!dependency.activities?.length && (
                  <p className="text-neutral-400 text-sm italic">No se han especificado actividades.</p>
                )}
              </div>
            </section>

            {/* Contact & Location */}
            <section className="space-y-6">
              <div className={`flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                <Users size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Contacto y Ubicación</h4>
              </div>
              <div className={`rounded-[2.5rem] p-10 border shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/40 border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <User size={24} className={isDarkMode ? "text-neutral-700" : "text-brand-blue/40"} />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Titular del Programa</p>
                      <p className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.contact?.titular || 'No disponible'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <Clock size={24} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Teléfono Directo</p>
                      <p className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.contact?.phone || 'No disponible'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <FileText size={24} className="text-brand-teal" />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Correo Institucional</p>
                      <p className="text-sm sm:text-base font-black text-brand-teal hover:text-brand-blue transition-colors cursor-pointer break-all">{dependency.contact?.email || 'No disponible'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <Clock size={24} className={isDarkMode ? "text-neutral-700" : "text-brand-blue/40"} />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Horario de Operación</p>
                      <p className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.contact?.schedule || 'No disponible'}</p>
                    </div>
                  </div>
                </div>
                <div className={`mt-12 pt-12 border-t flex items-start gap-6 transition-colors duration-500 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200/60'}`}>
                  <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                    <MapPin size={24} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Dirección de la Institución</p>
                    <p className={`text-sm sm:text-base font-bold leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-600'}`}>{dependency.contact?.address || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={`p-8 sm:p-10 border-t flex flex-col sm:flex-row items-center justify-between gap-8 sticky bottom-0 z-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-brand-teal animate-pulse" />
              <span className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{dependency.vacancies} vacantes disponibles</span>
            </div>
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className={`flex-1 sm:flex-none px-10 py-5 border-2 font-bold rounded-2xl transition-all active:scale-95 text-base ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-neutral-600 hover:text-neutral-400' : 'bg-white border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'}`}
              >
                Cerrar
              </button>
              <button 
                onClick={() => setShowConfirmation(true)}
                className={`flex-1 sm:flex-none px-10 py-5 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 text-base group ${isDarkMode ? 'bg-brand-teal hover:bg-brand-teal/90 shadow-brand-teal/10' : 'bg-brand-teal hover:bg-brand-teal/90 shadow-brand-teal/20'}`}
              >
                <span>Solicitar Vacante</span>
                <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className={`fixed inset-0 z-[110] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white'}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 blur-[40px]"></div>
              
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="text-brand-orange w-8 h-8" />
              </div>
              <h3 className={`text-3xl font-black mb-4 tracking-tighter text-balance transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>¿Confirmar selección?</h3>
              <p className={`leading-relaxed mb-10 font-medium transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Estás por seleccionar <span className={`font-bold ${isDarkMode ? 'text-brand-teal' : 'text-brand-blue'}`}>{dependency.name}</span> como tu dependencia principal.
                <br /><br />
                <span className="text-brand-orange font-black uppercase text-[10px] tracking-widest block mb-2">Aviso Importante</span>
                Puedes cambiar de dependencia más adelante, pero esto podría reiniciar tu conteo de horas acumuladas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className={`flex-1 py-5 font-black rounded-2xl transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest ${isDarkMode ? 'bg-[#1a2333] text-neutral-500 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={`flex-1 py-5 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue truncate hover:bg-[#162a45] shadow-brand-blue/20'}`}
                >
                  {isSubmitting ? <Clock className="w-5 h-5 animate-spin" /> : <span>Confirmar</span>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
