
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Upload, User, Building2, Check, Info, Bot } from 'lucide-react';
import { UserData } from '../../types';
import { useFirebase } from '../FirebaseProvider';
import * as dbService from '../../services/dbService';

export function FormServiceRequest({ user, onBack, isDarkMode }: { user: UserData, onBack: () => void, isDarkMode?: boolean }) {
  const { user: firebaseUser } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'refreshed' | 'error'>('idle');

  const [formData, setFormData] = useState({
    periodo: 'AGOSTO - DICIEMBRE 2026',
    programa: 'APOYO A LA DOCENCIA',
    instancia: 'INSTITUTO TECNOLÓGICO DE CANCÚN',
    departamento: 'VINCULACIÓN PROFESIONAL',
    titular: 'LIC. MARÍA FERNANDA LÓPEZ',
    puesto: 'JEFE DE VINCULACIÓN PROFESIONAL',
    modalidad: 'PRESENCIAL',
    tipoPrograma: 'Apoyo a la salud',
    domicilio: user.address ? `${user.address.street}, ${user.address.neighborhood}, ${user.address.city}` : 'AV. KABAH KM 3 S/N, CANCÚN, Q.ROO',
  });

  useEffect(() => {
    async function loadTemplate() {
      setLoadStatus('loading');
      try {
        const template = (await dbService.getTemplate('anexo-17')) as any;
        if (template && template.fields) {
          const updatedData = { ...formData };
          Object.keys(template.fields).forEach(key => {
             if (template.fields[key].defaultValue !== undefined) {
               (updatedData as any)[key] = template.fields[key].defaultValue;
             }
          });
          setFormData(updatedData);
          setLoadStatus('refreshed');
        } else {
          setLoadStatus('idle');
        }
      } catch (err) {
        console.error("Error loading template:", err);
        setLoadStatus('error');
      }
    }
    loadTemplate();
  }, []);

  const handleSave = async () => {
    if (!firebaseUser) {
      alert("Asegúrate de que la conexión a Firebase esté configurada y el usuario autenticado para guardar.");
      return;
    }
    
    setIsSaving(true);
    try {
      await dbService.submitDocument('anexo-17', formData);
      alert("¡Solicitud guardada exitosamente en Firebase!");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la solicitud. Revisa la configuración de Firebase.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 mt-8 sm:mt-12"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              Generar Solicitud
            </h2>
            {loadStatus === 'refreshed' && (
              <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal text-[8px] font-black uppercase tracking-widest border border-brand-teal/20 rounded-md">
                Vinculado a Firebase
              </span>
            )}
            {loadStatus === 'loading' && (
               <Loader2 className="w-4 h-4 text-brand-teal animate-spin" />
            )}
          </div>
          <p className="text-sm font-medium text-neutral-500">Completa los campos para generar tu Anexo 17 automáticamente.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
            disabled={isSaving}
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${isDarkMode ? 'bg-brand-teal/20 text-brand-teal hover:bg-brand-teal/30' : 'bg-brand-teal text-white hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20'} disabled:opacity-50`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Guardar en Nube
          </button>
          <button 
            onClick={onBack}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border transition-all ${isDarkMode ? 'bg-white/5 border-neutral-800 text-neutral-400 hover:bg-white/10' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:bg-white shadow-sm'}`}
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className={`p-8 sm:p-12 rounded-[2.5rem] border space-y-10 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100 shadow-xl shadow-blue-900/5'}`}>
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-3">
              <User size={14} />
              Información del Estudiante
              <span className="ml-auto text-[8px] px-2 py-0.5 bg-neutral-100 dark:bg-white/5 rounded-full text-neutral-400">Sólo lectura</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nombre Completo 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {user.name.toUpperCase()}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">No. de Control 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {user.controlNumber}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Carrera 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {user.career.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-3">
              <Building2 size={14} />
              Datos del Programa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Dependencia Asignada 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {formData.instancia}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Titular de Dependencia 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {formData.titular}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Puesto 🔒</label>
                <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                  {formData.puesto}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Periodo de Servicio</label>
                <select 
                  value={formData.periodo}
                  onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                  className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                >
                  <option>ENERO - JUNIO 2026</option>
                  <option>AGOSTO - DICIEMBRE 2026</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Modalidad</label>
                <select 
                  value={formData.modalidad}
                  onChange={(e) => setFormData({...formData, modalidad: e.target.value})}
                  className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                >
                  <option>PRESENCIAL</option>
                  <option>A DISTANCIA</option>
                  <option>HÍBRIDO</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Tipo de Programa (17)</label>
                <select 
                  value={formData.tipoPrograma}
                  onChange={(e) => setFormData({...formData, tipoPrograma: e.target.value})}
                  className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                >
                  <option>Educación para adultos</option>
                  <option>Desarrollo de comunidad</option>
                  <option>Actividades deportivas</option>
                  <option>Actividades cívicas</option>
                  <option>Actividades culturales</option>
                  <option>Medio ambiente</option>
                  <option>Desarrollo sustentable</option>
                  <option>Apoyo a la salud</option>
                  <option>Otros</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-6">
             <button 
              onClick={onBack}
              className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${isDarkMode ? 'bg-white/5 border-neutral-800 text-neutral-400 hover:bg-white/10' : 'bg-white border-neutral-200 text-neutral-500'}`}
             >
                Cancelar
             </button>
             <button 
              onClick={onBack}
              className="flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:brightness-110 flex items-center justify-center gap-3"
             >
                <Check size={18} />
                <span>Guardar y Generar PDF</span>
             </button>
          </div>
        </div>

        <div className="hidden lg:block space-y-6">
           <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-brand-blue/10 border-brand-blue/20' : 'bg-brand-blue/5 border-brand-blue/10'}`}>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Info className="text-brand-teal" size={32} />
              </div>
              <h4 className={`text-2xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Vista Previa en tiempo real</h4>
              <p className={`text-sm leading-relaxed font-medium mb-8 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Los cambios que realices en este formulario se verán reflejados inmediatamente en tu solicitud oficial. Asegúrate de que toda la información coincida con tu documentación oficial.
              </p>
           </div>

           <div className={`p-8 rounded-[2.5rem] border shrink-0 ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/10' : 'bg-blue-50 border-blue-100'}`}>
              <h4 className="text-sm font-black text-brand-teal mb-4 flex items-center gap-2">
                <Bot size={18} />
                Asistente de Pre-llenado
              </h4>
              <p className="text-sm font-medium text-neutral-500 leading-relaxed italic">
                "Hola {user.name.split(' ')[0]}, he detectado que ya cuentas con el {user.academicStats?.careerProgress}% de créditos. He pre-llenado tu información escolar directamente del portal para que no tengas que escribirla de nuevo."
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
