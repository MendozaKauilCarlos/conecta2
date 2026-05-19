
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Save, Plus, Trash2, Info, User, Phone, Mail, Clock, MapPin, Hash, Briefcase } from 'lucide-react';

interface NewDependencyModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isDarkMode?: boolean;
}

export function NewDependencyModal({ onClose, onSave, isDarkMode }: NewDependencyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    programName: '',
    activities: [''],
    contact: {
      titular: '',
      phone: '',
      email: '',
      schedule: '',
      address: ''
    },
    vacancies: 1,
    category: 'Gobierno / Ayuntamiento'
  });

  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...formData.activities];
    newActivities[index] = value;
    setFormData({ ...formData, activities: newActivities });
  };

  const addActivity = () => {
    setFormData({ ...formData, activities: [...formData.activities, ''] });
  };

  const removeActivity = (index: number) => {
    const newActivities = formData.activities.filter((_, i) => i !== index);
    setFormData({ ...formData, activities: newActivities.length ? newActivities : [''] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className={`rounded-[3rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh] relative border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-200'}`}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-teal via-brand-blue to-brand-orange"></div>
        
        {/* Header */}
        <div className={`px-10 py-8 border-b flex items-center justify-between sticky top-0 z-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-teal/5 text-brand-teal'}`}>
              <Building2 size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Nueva Dependencia</h2>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Añadir al catálogo oficial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-3 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/5 text-neutral-600 hover:text-white' : 'hover:bg-neutral-50 text-neutral-400 hover:text-neutral-600'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
          {/* General Information */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
              <Info size={14} />
              Información del Programa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Nombre de la Dependencia/Institución</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej. Instituto Municipal de la Juventud"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Nombre del Programa</label>
                <input 
                  required
                  type="text" 
                  value={formData.programName}
                  onChange={(e) => setFormData({...formData, programName: e.target.value})}
                  placeholder="Ej. Apoyo Administrativo 2026"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm bg-no-repeat ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                >
                  <option>Internos</option>
                  <option>Gobierno / Ayuntamiento</option>
                  <option>Salud / Hospitales</option>
                  <option>Asociaciones Civiles</option>
                  <option>Justicia / Fiscalías</option>
                </select>
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Objetivo del Programa</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  placeholder="Describe brevemente el objetivo del servicio social en esta dependencia..."
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm resize-none ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
            </div>
          </section>

          {/* Activities */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                <Briefcase size={14} />
                Actividades a realizar
              </h3>
              <button 
                type="button"
                onClick={addActivity}
                className="p-2 bg-brand-teal/10 text-brand-teal rounded-lg hover:bg-brand-teal/20 transition-all active:scale-90"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <input 
                    required
                    type="text" 
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                    placeholder={`Actividad ${index + 1}`}
                    className={`flex-1 px-6 py-3 rounded-xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-xs ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                  />
                  {formData.activities.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Details */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
              <User size={14} />
              Contacto y Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <User size={10} /> Titular del programa
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.contact.titular}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, titular: e.target.value}})}
                  placeholder="Nombre completo"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <Phone size={10} /> Número Telefónico
                </label>
                <input 
                  required
                  type="tel" 
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})}
                  placeholder="998-123-4567"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <Mail size={10} /> Correo Electrónico
                </label>
                <input 
                  required
                  type="email" 
                  value={formData.contact.email}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <Clock size={10} /> Horario de Operación
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.contact.schedule}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, schedule: e.target.value}})}
                  placeholder="Ej. Lunes a Viernes 8:00 - 15:00"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <MapPin size={10} /> Dirección Completa
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.contact.address}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, address: e.target.value}})}
                  placeholder="Calle, Número, Colonia, CP"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>
            </div>
          </section>

          {/* Vacant slots */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
              <Hash size={14} />
              Capacidad
            </h3>
            <div className="max-w-[200px] space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Número de Vacantes</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.vacancies}
                onChange={(e) => setFormData({...formData, vacancies: parseInt(e.target.value)})}
                className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
              />
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className={`px-10 py-8 border-t flex items-center justify-end gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
          <button 
            type="button"
            onClick={onClose}
            className={`px-8 py-4 rounded-2xl border-2 font-black text-sm transition-all active:scale-95 ${isDarkMode ? 'border-neutral-800 text-neutral-500 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-400 hover:bg-neutral-100'}`}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-10 py-4 bg-brand-teal text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-teal/20 hover:brightness-110 transition-all flex items-center gap-3 active:scale-95"
          >
            <Save size={18} />
            <span>Guardar Dependencia</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
