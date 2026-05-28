import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Loader2, 
  User, 
  Building2, 
  Check, 
  Info, 
  Bot, 
  Calendar, 
  Phone, 
  Home, 
  FileText, 
  Clock, 
  Layers,
  MapPin,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { UserData } from '../../types';
import { useFirebase } from '../FirebaseProvider';
import * as dbService from '../../services/dbService';

export function FormServiceRequest({ 
  user, 
  dbStudentData,
  onBack, 
  isDarkMode 
}: { 
  user: UserData, 
  dbStudentData?: any,
  onBack: () => void, 
  isDarkMode?: boolean 
}) {
  const { user: firebaseUser } = useFirebase();
  const [isSaving, setIsSaving] = useState(false);
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hasSelectedDependency, setHasSelectedDependency] = useState(true);

  const [formData, setFormData] = useState({
    // DATOS PERSONALES
    nombre_estudiante: user.name || '',
    sexo: '', // MASCULINO / FEMENINO
    telefono_estudiante: user.phone || '',
    domicilio_estudiante: user.address ? `${user.address.street}, ${user.address.neighborhood}, ${user.address.city}` : '',
    
    // ESCOLARIDAD
    no_control: user.controlNumber || '',
    carrera: user.career || '',
    periodo: 'AGOSTO - DICIEMBRE 2026',
    semestre: '8vo Semestre',
    
    // DATOS DEL PROGRAMA (Sincronizado de dependencias/Admin)
    instancia: 'INSTITUTO TECNOLÓGICO DE CANCÚN',
    departamento: 'VINCULACIÓN PROFESIONAL',
    titular: 'LIC. MARÍA FERNANDA LÓPEZ',
    puesto: 'JEFE DE VINCULACIÓN PROFESIONAL',
    modalidad: 'PRESENCIAL',
    domicilio: 'AV. KABAH KM 3 S/N, CANCÚN, Q.ROO',
    programa: 'APOYO A LA DOCENCIA',
    
    // Alumno inputs
    fecha_inicio: '',
    fecha_fin: '',
    actividades: '',
    tipoPrograma: 'Apoyo a la salud', // Checkbox list choice
  });

  useEffect(() => {
    async function initForm() {
      setLoadStatus('loading');
      try {
        const existingData = dbStudentData?.anexo_17_datos || {};
        
        // Form default state based on user, DB profile state, and existing saved draft
        const initialForm = {
          nombre_estudiante: existingData.nombre_estudiante || dbStudentData?.datos?.nombre || user.name || '',
          sexo: existingData.sexo || dbStudentData?.datos?.sexo || 'MASCULINO',
          telefono_estudiante: existingData.telefono_estudiante || dbStudentData?.datos?.telefono || user.phone || '',
          domicilio_estudiante: existingData.domicilio_estudiante || dbStudentData?.datos?.domicilio || dbStudentData?.datos?.direccion || (user.address ? `${user.address.street}, ${user.address.neighborhood}, ${user.address.city}` : ''),
          
          no_control: user.controlNumber || '',
          carrera: user.career || '',
          periodo: existingData.periodo || 'AGOSTO - DICIEMBRE 2026',
          semestre: existingData.semestre || dbStudentData?.status_academico?.semestre || dbStudentData?.datos?.semestre || '8vo Semestre',
          
          instancia: existingData.instancia || user.dependencia_seleccionada || 'INSTITUTO TECNOLÓGICO DE CANCÚN',
          departamento: existingData.departamento || 'VINCULACIÓN PROFESIONAL',
          titular: existingData.titular || 'LIC. MARÍA FERNANDA LÓPEZ',
          puesto: existingData.puesto || 'JEFE DE VINCULACIÓN PROFESIONAL',
          modalidad: existingData.modalidad || 'PRESENCIAL',
          domicilio: existingData.domicilio || 'AV. KABAH KM 3 S/N, CANCÚN, Q.ROO',
          programa: existingData.programa || 'APOYO A LA DOCENCIA',
          
          fecha_inicio: existingData.fecha_inicio || '',
          fecha_fin: existingData.fecha_fin || '',
          actividades: existingData.actividades || '',
          tipoPrograma: existingData.tipoPrograma || 'Apoyo a la salud',
        };

        // Fetch selected dependency details
        const dependencyId = dbStudentData?.id_dependencia || user.id_dependencia;
        if (dependencyId) {
          setHasSelectedDependency(true);
          const depDetails = await dbService.getDependency(dependencyId);
          if (depDetails) {
            initialForm.instancia = depDetails.name || '';
            initialForm.departamento = depDetails.contact?.address?.split(',')[0] || 'DEPARTAMENTO RECEPTOR';
            initialForm.titular = depDetails.contact?.titular || '';
            initialForm.puesto = depDetails.contact?.puesto_titular || 'RESPONSABLE DIRECTO';
            initialForm.programa = depDetails.subCategory || depDetails.name || '';
            initialForm.modalidad = depDetails.contact?.modalidad?.toUpperCase() || 'PRESENCIAL';
            initialForm.domicilio = depDetails.contact?.address || depDetails.location || '';
            
            if (!initialForm.actividades && depDetails.activities && depDetails.activities.length > 0) {
              initialForm.actividades = depDetails.activities.join(', ');
            }
          }
        } else {
          setHasSelectedDependency(false);
        }
        
        setFormData(initialForm);
        setLoadStatus('success');
      } catch (err) {
        console.error("Error loading dependency data:", err);
        setLoadStatus('error');
      }
    }
    initForm();
  }, [user, dbStudentData]);

  const handleSaveDraft = async () => {
    if (!firebaseUser) {
      alert("No se detectó un usuario autenticado para guardar.");
      return;
    }
    
    setIsSaving(true);
    try {
      await dbService.saveAnexo17Datos(user.id, formData);
      alert("¡Solicitud guardada en Firebase exitosamente!");
    } catch (err) {
      console.error("Error saving draft to Firebase:", err);
      alert("Ocurrió un error al guardar tu borrador.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndExit = async () => {
    if (!firebaseUser) return;
    
    setIsSaving(true);
    try {
      await dbService.saveAnexo17Datos(user.id, formData);
      // Also register a mock submission to trigger PDF visual state updates
      await dbService.submitDocument('anexo-17', formData);
      onBack();
    } catch (err) {
      console.error("Error saving draft & exiting:", err);
      alert("Ocurrió un error al guardar tu solicitud.");
    } finally {
      setIsSaving(false);
    }
  };

  const tipoProgOptions = [
    'Educación para adultos',
    'Desarrollo de comunidad',
    'Actividades deportivas',
    'Actividades cívicas',
    'Actividades culturales',
    'Medio ambiente',
    'Desarrollo sustentable',
    'Apoyo a la salud',
    'Otros'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 mt-8 sm:mt-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              Pre-llenar Solicitud
            </h2>
            {loadStatus === 'success' && (
              <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal text-[8px] font-black uppercase tracking-widest border border-brand-teal/20 rounded-md animate-pulse">
                Sincronizado VinculaTec
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-neutral-500">
            Ajusta los campos del alumno. Los datos de la dependencia están bloqueados por seguridad institucional.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            disabled={isSaving || loadStatus === 'loading'}
            onClick={handleSaveDraft}
            className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
              isDarkMode 
                ? 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-750' 
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 shadow-sm'
            }`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            Guardar Borrador
          </button>
          <button 
            disabled={isSaving || loadStatus === 'loading'}
            onClick={handleSaveAndExit}
            className="px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Guardar y Ver PDF
          </button>
        </div>
      </div>

      {!hasSelectedDependency && (
        <div className="p-5 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500 flex items-start gap-4 text-xs sm:text-sm font-medium leading-relaxed">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">Dependencia no asignada</p>
            No has seleccionado ninguna dependencia activa de nuestro Catálogo. El borrador usará valores demostrativos del Tecnológico. Te recomendamos ir al <strong className="underline">Catálogo de Vacantes</strong> y elegir una dependencia antes de enviar tu firma.
          </div>
        </div>
      )}

      {loadStatus === 'loading' ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Cargando datos institucionales...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Primary Form Drawer */}
          <div className={`p-8 sm:p-12 rounded-[2.5rem] border space-y-10 ${
            isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100 shadow-xl shadow-blue-900/5'
          }`}>
            
            {/* Section 1: Datos Personales (Editable) */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                <User size={14} />
                1. Datos Personales
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nombre Completo del Alumno * (Corregible)</label>
                  <input 
                    type="text"
                    value={formData.nombre_estudiante}
                    onChange={(e) => setFormData({ ...formData, nombre_estudiante: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sexo *</label>
                  <select 
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  >
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMENINO">FEMENINO</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Teléfono Personal *</label>
                  <input 
                    type="tel"
                    value={formData.telefono_estudiante}
                    onChange={(e) => setFormData({ ...formData, telefono_estudiante: e.target.value })}
                    maxLength={15}
                    placeholder="e.g. 9981234567"
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Domicilio Particular *</label>
                  <input 
                    type="text"
                    value={formData.domicilio_estudiante}
                    onChange={(e) => setFormData({ ...formData, domicilio_estudiante: e.target.value })}
                    placeholder="Calle, Número, Colonia, CP"
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Escolaridad (Editable Periodo / Semestre) */}
            <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                <Layers size={14} />
                2. Datos de Escolaridad
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No. de Control 🔒</label>
                  <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 ${
                    isDarkMode ? 'bg-[#0a0f18]/30 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                  }`}>
                    {formData.no_control}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Carrera 🔒</label>
                  <div className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold opacity-60 truncate ${
                    isDarkMode ? 'bg-[#0a0f18]/30 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-500'
                  }`}>
                    {formData.carrera}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Semestre Actual *</label>
                  <select 
                    value={formData.semestre}
                    onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  >
                    <option value="6to Semestre">6to Semestre</option>
                    <option value="7mo Semestre">7mo Semestre</option>
                    <option value="8vo Semestre">8vo Semestre</option>
                    <option value="9no Semestre">9no Semestre</option>
                    <option value="10mo Semestre">10mo Semestre</option>
                    <option value="Semestre Especial">Semestre Especial</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Periodo Solicitado *</label>
                  <select 
                    value={formData.periodo}
                    onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  >
                    <option value="AGOSTO - DICIEMBRE 2026">AGOSTO - DICIEMBRE 2026</option>
                    <option value="ENERO - JUNIO 2027">ENERO - JUNIO 2027</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Datos de Dependencia (Read-only as requested!) */}
            <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#005691] flex items-center gap-2">
                  <Building2 size={14} />
                  3. Datos del Programa (Cargado por Admin)
                </h3>
                <span className="text-[8px] font-black tracking-widest text-[#005691] bg-blue-50 dark:bg-[#005691]/10 px-2 py-0.5 rounded-lg border border-[#005691]/15 uppercase">
                  Protegido 🔒
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-neutral-50/50 dark:bg-neutral-900/30 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Dependencia / Instancia Oficial</label>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    {formData.instancia.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Titular de Dependencia</label>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800 truncate">
                    {formData.titular}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Puesto del Titular</label>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800 truncate">
                    {formData.puesto}
                  </p>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nombre del Programa Oficial</label>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    {formData.programa}
                  </p>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Domicilio Oficial de la Dependencia</label>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                    {formData.domicilio}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Modalidad Oficial</label>
                  <p className="text-xs font-bold text-[#00c49f] bg-white dark:bg-[#0a0f18] px-4 py-3 rounded-xl border border-[#00c49f]/10">
                    {formData.modalidad}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Fechas y Actividades (Editable) */}
            <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                <ClipboardList size={14} />
                4. Fechas y Actividades Detalladas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Fecha de Inicio *</label>
                  <input 
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Fecha de Terminación *</label>
                  <input 
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Actividades Propuestas *</label>
                  <textarea 
                    value={formData.actividades}
                    onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
                    rows={4}
                    placeholder="Sintetiza las principales actividades a realizar coordinadas con tu dependencia receptora"
                    className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold focus:ring-2 focus:ring-brand-teal transition-all outline-none leading-relaxed ${
                      isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Tipo de Programa Choices (Selectable) */}
            <div className="space-y-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-orange flex items-center gap-2">
                <Info size={14} />
                5. Tipo de programa: (17)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {tipoProgOptions.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, tipoPrograma: option })}
                    className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                      formData.tipoPrograma === option
                        ? 'border-brand-teal bg-brand-teal/5 text-brand-teal ring-1 ring-brand-teal'
                        : isDarkMode
                          ? 'border-neutral-800 bg-[#0a0f18] hover:bg-neutral-800/50 text-neutral-400'
                          : 'border-neutral-100 bg-neutral-50 hover:bg-neutral-100/50 text-neutral-600'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.tipoPrograma === option ? 'border-brand-teal bg-brand-teal text-white' : 'border-neutral-300'
                    }`}>
                      {formData.tipoPrograma === option && <Check size={10} strokeWidth={4} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Close Buttons */}
            <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-4">
              <button 
                type="button"
                onClick={onBack}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all active:scale-95 ${
                  isDarkMode ? 'bg-white/5 border-neutral-800 text-neutral-400 hover:bg-neutral-800' : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                Cerrar sin guardar
              </button>
              <button 
                type="button"
                disabled={isSaving}
                onClick={handleSaveAndExit}
                className="flex-1.5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:brightness-110 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Guardar y Cerrar
              </button>
            </div>
          </div>

          {/* Assistant Info Cards */}
          <div className="hidden lg:block space-y-6 self-start sticky top-8">
            <div className={`p-10 rounded-[3rem] border ${
              isDarkMode ? 'bg-[#005691]/15 border-neutral-800' : 'bg-blue-50/50 border-blue-100'
            }`}>
              <div className="w-14 h-14 bg-brand-teal/15 rounded-2xl flex items-center justify-center mb-6 text-brand-teal">
                <Bot size={28} />
              </div>
              <h4 className={`text-xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                Asistente de Validación VinculaTec
              </h4>
              <p className={`text-xs leading-relaxed font-semibold mb-6 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Rellena tus datos personales y escolares con total tranquilidad. Los datos protegidos en color azul han sido cargados directamente de los registros administrados por tu departamento escolar y son válidos para el Anexo XVII de tu Servicio Social institucional.
              </p>
              
              <div className="space-y-3.5 bg-white dark:bg-[#0a0f18] p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-[11px] font-bold">
                <p className="text-neutral-400 uppercase tracking-widest text-[9px] mb-1">Pasos a seguir:</p>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-[10px] shrink-0 font-extrabold">1</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Guarda este borrador tocando "Guardar y Cerrar".</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-[10px] shrink-0 font-extrabold">2</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Descarga e imprime el PDF pre-llenado en la siguiente ventana.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-[10px] shrink-0 font-extrabold">3</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Consigue la firma autógrafa y el sello en tu dependencia receptora, tómale foto o escanea y súbelo para validación final por la Oficina de Servicio Social.</p>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border shrink-0 text-center ${
              isDarkMode ? 'bg-neutral-900/30 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <ClipboardList size={22} className="mx-auto mb-3 text-brand-orange" />
              <p className="text-xs font-semibold text-neutral-500">
                Aprobación del Anexo XVII regulada según los lineamientos del Tecnológico Nacional de México.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
