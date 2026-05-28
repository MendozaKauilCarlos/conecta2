
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Edit, ShieldCheck, CheckCircle2, AlertCircle, History, Sparkles, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { UserData } from '../../types';
import * as dbService from '../../services/dbService';

const formatInputDate = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return d.toISOString().substring(0, 10);
      }
    } catch {}
    return val;
  }
  if (val instanceof Date) {
    return val.toISOString().substring(0, 10);
  }
  if (val && typeof val.toDate === "function") {
    try {
      return val.toDate().toISOString().substring(0, 10);
    } catch {}
  }
  if (val && typeof val.seconds === "number") {
    try {
      const d = new Date(val.seconds * 1000);
      return d.toISOString().substring(0, 10);
    } catch {}
  }
  return String(val);
};

const formatDisplayDate = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m, d] = val.split('-');
      return `${d}/${m}/${y}`;
    }
    return val;
  }
  if (val instanceof Date) {
    return val.toLocaleDateString();
  }
  if (val && typeof val.toDate === "function") {
    try {
      return val.toDate().toLocaleDateString();
    } catch {}
  }
  if (val && typeof val.seconds === "number") {
    try {
      const d = new Date(val.seconds * 1000);
      return d.toLocaleDateString();
    } catch {}
  }
  return String(val);
};

export function ProfileView({ 
  user, 
  onUpdateProfile,
  dataConfirmed,
  onConfirmData,
  isDarkMode
}: { 
  user: UserData, 
  onUpdateProfile?: (u: UserData) => void,
  dataConfirmed?: boolean,
  onConfirmData?: () => void,
  isDarkMode?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState<UserData>({
    ...user,
    birthDate: formatInputDate(user.birthDate)
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
        const subs = await dbService.getUserSubmissions();
        setSubmissions(subs || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleSave = async () => {
    try {
      await dbService.syncUserProfile(editForm);
    } catch (err) {
      console.error("Error updating user profile in Firestore: ", err);
    }
    if (onUpdateProfile) {
      onUpdateProfile(editForm);
    }
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingPhoto(true);
      try {
        const downloadUrl = await dbService.uploadProfilePicture(file);
        if (downloadUrl) {
          setEditForm(prev => ({ ...prev, profilePicture: downloadUrl }));
        }
      } catch (err) {
        console.error("Error al subir imagen a Storage, cargando preview local como respaldo:", err);
        const imageUrl = URL.createObjectURL(file);
        setEditForm(prev => ({ ...prev, profilePicture: imageUrl }));
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {!isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-[2rem] p-8 mb-10 flex items-start gap-6 shadow-sm relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/20' : 'bg-brand-teal/5 border-brand-teal/20'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 blur-[50px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-brand-teal/10 border-brand-teal/20'}`}>
            <Info className="text-brand-teal w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-black text-xl mb-2 tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Verifica tu información</h3>
            <p className={`font-medium leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Es fundamental que tu <span className="text-brand-teal font-bold">Número de Control</span>, <span className="text-brand-teal font-bold">Correo Institucional</span> y <span className="text-brand-teal font-bold">Carrera</span> coincidan exactamente con tus registros oficiales para evitar errores en tu documentación.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-[3rem] border shadow-xl p-8 sm:p-14 relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100 shadow-brand-blue/5'}`}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-blue to-brand-orange opacity-40"></div>
        
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-14 pb-14 border-b transition-colors duration-500 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-50'}`}>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center font-black text-4xl border-4 shadow-2xl overflow-hidden relative transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-neutral-100 border-white'}`}
              >
                {(isEditing ? editForm.profilePicture : user.profilePicture) ? (
                  <img src={isEditing ? editForm.profilePicture : user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className={`${isDarkMode ? 'text-neutral-700' : 'text-brand-blue/30'}`}>{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                )}
                
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                    <Loader2 size={24} className="animate-spin text-brand-teal mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-300">Subiendo...</span>
                  </div>
                )}
                
                {isEditing && !isUploadingPhoto && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                  >
                    <Edit size={24} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cambiar Foto</span>
                  </button>
                )}
              </motion.div>
              
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 bg-brand-teal rounded-2xl border-4 shadow-lg flex items-center justify-center text-white transition-colors duration-500 ${isDarkMode ? 'border-[#121926]' : 'border-white'}`}>
                <ShieldCheck size={20} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className={`text-4xl font-black tracking-tighter transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{user.name}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-teal/10 text-brand-teal'}`}>
                  {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </span>
                <span className="text-neutral-700 font-bold">•</span>
                <p className={`font-bold text-sm transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Activo en plataforma</p>
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditForm(user);
                setIsEditing(true);
              }}
              className={`px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all self-start sm:self-auto shadow-sm hover:shadow-xl ${isDarkMode ? 'bg-[#1a2333] text-brand-teal border border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-50 text-brand-blue border border-transparent hover:bg-brand-blue hover:text-white shadow-brand-blue/5 hover:shadow-brand-blue/20'}`}
            >
              <Edit size={20} className="text-brand-teal" />
              <span>Personalizar Perfil</span>
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="sm:col-span-2 group">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Nombre de Usuario</label>
            {isEditing ? (
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.name}</div>
            )}
          </div>
          
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>Número de Control</label>
            <div className={`px-6 py-5 rounded-[1.5rem] border font-black shadow-inner uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/40 border-neutral-800 text-neutral-600' : 'bg-neutral-50 border-neutral-100 text-neutral-400'}`}>{user.controlNumber}</div>
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>Programa Académico</label>
            <div className={`px-6 py-5 rounded-[1.5rem] border font-black shadow-inner truncate transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/40 border-neutral-800 text-neutral-600' : 'bg-neutral-50 border-neutral-100 text-neutral-400'}`}>{user.career || 'General'}</div>
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Ciclo Escolar</label>
            {isEditing ? (
              <input type="text" value={editForm.semester || ''} onChange={e => setEditForm({...editForm, semester: e.target.value})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.semester || 'No asignado'}</div>
            )}
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Progreso Carrera</label>
            <div className={`px-6 py-5 rounded-[1.5rem] border flex items-center justify-between shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
              <span className="font-black text-brand-teal">{user.academicStats?.careerProgress || 0}%</span>
              <div className={`w-32 h-2 rounded-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user.academicStats?.careerProgress || 0}%` }}
                  className="h-full bg-brand-teal rounded-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Género</label>
            {isEditing ? (
              <select value={editForm.gender || ''} onChange={e => setEditForm({...editForm, gender: e.target.value})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`}>
                <option value="">Selecciona uno...</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </select>
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.gender || 'No especificado'}</div>
            )}
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 text-balance ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Fecha de Nacimiento</label>
            {isEditing ? (
              <input type="date" value={editForm.birthDate || ''} onChange={e => setEditForm({...editForm, birthDate: e.target.value})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{formatDisplayDate(user.birthDate) || 'No especificada'}</div>
            )}
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Canal de Contacto</label>
            {isEditing ? (
              <input type="tel" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.phone || 'Sin teléfono'}</div>
            )}
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 text-balance ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Correo de Acceso</label>
            <div className={`px-6 py-5 rounded-[1.5rem] border font-black shadow-inner truncate transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/40 border-neutral-800 text-neutral-600' : 'bg-neutral-50 border-neutral-100 text-neutral-400'}`}>{user.email || 'No asignado'}</div>
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Identificador Único (NSS)</label>
            {isEditing ? (
              <input type="text" value={editForm.nss || ''} onChange={e => setEditForm({...editForm, nss: e.target.value})} maxLength={11} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
            ) : (
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.nss || 'No registrado'}</div>
            )}
          </div>
          
          <div className="sm:col-span-2 mt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-8 bg-brand-orange"></div>
              <h4 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Residencia Actual</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors text-balance ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Dirección (Calle y Número)</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.street || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), street: e.target.value}})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
                ) : (
                  <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.address?.street || 'Sin registrar'}</div>
                )}
              </div>
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Localidad / Colonia</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.neighborhood || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), neighborhood: e.target.value}})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
                ) : (
                  <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.address?.neighborhood || 'Sin registrar'}</div>
                )}
              </div>
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Código Postal</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.zipCode || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), zipCode: e.target.value}})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
                ) : (
                  <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner tracking-widest transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.address?.zipCode || '00000'}</div>
                )}
              </div>
              <div className="group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Ciudad / Municipio</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.city || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), city: e.target.value}})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
                ) : (
                  <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.address?.city || 'Sin registrar'}</div>
                )}
              </div>
              <div className="sm:col-span-2 group">
                <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Estado / Entidad</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.state || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), state: e.target.value}})} className={`w-full px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal font-bold outline-none transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-neutral-50 text-neutral-800 focus:bg-white'}`} />
                ) : (
                  <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.address?.state || 'Sin registrar'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {!isEditing && (
          <div className="mt-14 pt-14 border-t border-neutral-50 flex flex-col sm:flex-row items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowConfirmModal(true)}
              disabled={dataConfirmed}
              className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                dataConfirmed 
                  ? 'bg-brand-teal/10 text-brand-teal cursor-default shadow-none border border-brand-teal/20' 
                  : 'bg-brand-blue text-white hover:bg-[#162a45] shadow-brand-blue/20'
              }`}
            >
              {dataConfirmed ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Datos Confirmados Correctamente</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} className="text-brand-teal" />
                  <span>Confirmar Datos para Trámites</span>
                </>
              )}
            </motion.button>
          </div>
        )}
        
        {isEditing && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-14 pt-10 border-t border-neutral-50 flex flex-col sm:flex-row items-center justify-end gap-5"
          >
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto px-10 py-4 bg-neutral-100 text-neutral-400 font-black rounded-2xl hover:bg-neutral-200 transition-all uppercase text-[10px] tracking-widest"
            >
              Descartar
            </button>
            <button 
              onClick={handleSave}
              className="w-full sm:w-auto bg-brand-blue hover:bg-[#162a45] text-white px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20 transition-all active:scale-95 group"
            >
              <CheckCircle2 size={20} className="text-brand-teal group-hover:scale-110 transition-transform" />
              <span>Guardar Configuración</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-brand-teal text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-teal/20 flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <span>Cambios Guardados con Éxito</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-[3rem] p-10 sm:p-14 max-w-md w-full text-center shadow-2xl relative overflow-hidden border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border transition-colors duration-500 ${isDarkMode ? 'bg-brand-orange/10 border-brand-orange/20' : 'bg-brand-orange/10 border-brand-orange/20'}`}>
                <AlertCircle className="w-10 h-10 text-brand-orange" />
              </div>
              
              <h3 className={`text-3xl font-black mb-4 tracking-tighter transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Validación de Datos</h3>
              <p className={`font-medium leading-relaxed mb-10 transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Confirma que toda tu información sea correcta. La <span className="text-brand-orange font-bold">precisión de tus datos</span> es vital para la validez de tu documentación oficial.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    onConfirmData?.();
                    setShowConfirmModal(false);
                  }}
                  className={`w-full py-5 text-white font-black rounded-2xl transition-all shadow-xl ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue hover:bg-[#162a45] shadow-brand-blue/20'}`}
                >
                  Sí, mis datos son correctos
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className={`w-full py-5 font-black rounded-2xl transition-all text-xs uppercase tracking-widest ${isDarkMode ? 'bg-[#1a2333] text-neutral-500 hover:bg-neutral-800' : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'}`}
                >
                  Revisar nuevamente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
