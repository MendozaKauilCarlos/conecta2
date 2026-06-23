
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, Save, Plus, Trash2, Info, User, Phone, Mail, Clock, MapPin, Hash, Briefcase, Upload, Loader2 } from 'lucide-react';

interface NewDependencyModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isDarkMode?: boolean;
  dependency?: any;
}

export function NewDependencyModal({ onClose, onSave, isDarkMode, dependency }: NewDependencyModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    id: dependency?.id || undefined,
    name: dependency?.name || '',
    objective: dependency?.objective || '',
    programName: dependency?.subCategory || dependency?.programName || '',
    activities: dependency?.activities && dependency.activities.length ? [...dependency.activities] : [''],
    contact: {
      titular: dependency?.contact?.titular || '',
      phone: dependency?.contact?.phone || '',
      email: dependency?.contact?.email || '',
      schedule: dependency?.contact?.schedule || '',
      address: dependency?.contact?.address || '',
      puesto_titular: dependency?.contact?.puesto_titular || '',
      responsable_del_programa: dependency?.contact?.responsable_del_programa || '',
      modalidad: dependency?.contact?.modalidad || 'presencial',
      ubicacion_maps: dependency?.contact?.ubicacion_maps || ''
    },
    vacancies: dependency?.vacancies !== undefined ? dependency.vacancies : 1,
    maxVacancies: dependency?.maxVacancies !== undefined ? dependency.maxVacancies : 10,
    category: dependency?.category || 'Gobierno / Ayuntamiento',
    subCategory: dependency?.subCategory || 'General',
    location: dependency?.location || 'Cancún',
    status: dependency?.status || 'Disponible',
    image: dependency?.image || ''
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { uploadDependencyLogo } = await import('../../services/dbService');
      const url = await uploadDependencyLogo(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Error uploading logo:", err);
    } finally {
      setIsUploading(false);
    }
  };

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
    onSave({
      ...formData,
      subCategory: formData.programName
    });
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
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                {dependency ? 'Editar Dependencia' : 'Nueva Dependencia'}
              </h2>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {dependency ? 'Modificar datos del catálogo' : 'Añadir al catálogo oficial'}
              </p>
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
          {/* Logo / Imagen */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
              <Building2 size={14} />
              Logo / Imagen de la Dependencia
            </h3>
            <div className={`p-8 border-2 border-dashed rounded-[2rem] transition-colors flex flex-col sm:flex-row items-center gap-8 ${
              isDarkMode ? 'border-neutral-800 bg-[#0a0f18]/30' : 'border-neutral-100 bg-neutral-50/30'
            }`}>
              <div className="relative group shrink-0">
                <div className={`w-28 h-28 rounded-3xl overflow-hidden border shadow-inner flex items-center justify-center transition-colors ${
                  isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-white border-neutral-100'
                }`}>
                  {formData.image ? (
                    <img src={formData.image} alt="Logo de dependencia" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Building2 size={36} className="text-neutral-400" />
                  )}
                </div>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute -top-2 -right-2 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition-transform scale-90 hover:scale-100"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-auto shrink-0">
                    <label className={`w-full sm:w-auto text-center px-8 py-5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 border-2 ${
                      isUploading 
                        ? 'bg-neutral-500 cursor-not-allowed border-transparent text-white' 
                        : 'bg-brand-teal text-white border-transparent hover:brightness-110 active:scale-95'
                    }`}>
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Subir Imagen / Logo</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="hidden" 
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <span className="text-xs font-bold text-brand-teal bg-brand-teal/5 px-4 py-2 rounded-xl border border-brand-teal/10">
                      ✓ Imagen cargada con éxito
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-neutral-500">Formato cuadrado PNG, JPG o SVG con fondo transparente o blanco preferentemente.</p>
              </div>
            </div>
          </section>

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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <User size={10} /> Puesto del Titular
                </label>
                <input 
                  type="text" 
                  value={formData.contact.puesto_titular}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, puesto_titular: e.target.value}})}
                  placeholder="Ej. Directora General"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <User size={10} /> Responsable del Programa
                </label>
                <input 
                  type="text" 
                  value={formData.contact.responsable_del_programa}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, responsable_del_programa: e.target.value}})}
                  placeholder="Nombre de la persona responsable"
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <Briefcase size={10} /> Modalidad del Servicio
                </label>
                <select 
                  value={formData.contact.modalidad}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, modalidad: e.target.value}})}
                  className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-brand-teal font-bold text-sm bg-no-repeat ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}
                >
                  <option value="presencial">Presencial</option>
                  <option value="hibrida">Híbrida</option>
                  <option value="distancia">A distancia / Virtual</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1 flex items-center gap-2">
                  <MapPin size={10} /> Enlace de Mapas (Google Maps URL)
                </label>
                <input 
                  type="url" 
                  value={formData.contact.ubicacion_maps}
                  onChange={(e) => setFormData({...formData, contact: {...formData.contact, ubicacion_maps: e.target.value}})}
                  placeholder="https://maps.app.goo.gl/..."
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
