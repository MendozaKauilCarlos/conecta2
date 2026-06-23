
import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileSignature, Loader2, UserX, Plus, Trash2, CheckCircle, XCircle, AlertCircle, Sparkles, X, Check, Eye, Download, FileText, FolderArchive, ArrowRight, ArrowLeft } from 'lucide-react';
import * as dbService from '../../services/dbService';

export function AdminReviewsView({ isDarkMode, mode = 'activo' }: { isDarkMode?: boolean; mode?: 'activo' | 'historial' }) {
  const CURRENT_ACTIVE_PERIOD = "AGOSTO - DICIEMBRE 2026";
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = mode;
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    setSelectedPeriod(null);
  }, [mode]);

  useEffect(() => {
    let active = true;
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getAlumnosTecnologico();
        if (active) {
          setStudents(data);
        }
      } catch (err) {
        console.error("Error loading students: ", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchStudents();
    return () => { active = false; };
  }, []);

  const handleAddMockStudent = async (isApto: boolean) => {
    setIsAdding(true);
    try {
      const names = isApto 
        ? [
            { nombre: "Sofía", paterno: "García", materno: "Ruiz", no: "21530112", correo: "sofia.garcia@cancun.tecnm.mx", career: "INGENIERÍA EN SISTEMAS COMPUTACIONALES", semestre: 8, aprobados: 215, total: 260, credits: 6, sexo: "Femenino" },
            { nombre: "Javier Omar", paterno: "Salazar", materno: "Ochoa", no: "20530998", correo: "javier.salazar@cancun.tecnm.mx", career: "INGENIERÍA EN ADMINISTRACIÓN", semestre: 9, aprobados: 245, total: 260, credits: 5, sexo: "Masculino" },
            { nombre: "Andrea Celest", paterno: "Méndez", materno: "Flores", no: "21530415", correo: "andrea.mendez@cancun.tecnm.mx", career: "INGENIERÍA INDUSTRIAL", semestre: 8, aprobados: 200, total: 260, credits: 7, sexo: "Femenino" }
          ]
        : [
            { nombre: "Luis Alberto", paterno: "Ramírez", materno: "Reyes", no: "22530141", correo: "luis.ramirez@cancun.tecnm.mx", career: "INGENIERÍA EN SISTEMAS COMPUTACIONALES", semestre: 6, aprobados: 130, total: 260, credits: 3, sexo: "Masculino" },
            { nombre: "Diana Laura", paterno: "Morales", materno: "Vargas", no: "21530232", correo: "diana.morales@cancun.tecnm.mx", career: "INGENIERÍA INDUSTRIAL", semestre: 8, aprobados: 165, total: 260, credits: 2, sexo: "Femenino" },
            { nombre: "Brayan Jair", paterno: "Chávez", materno: "Sosa", no: "22530982", correo: "brayan.chavez@cancun.tecnm.mx", career: "INGENIERÍA CIVIL", semestre: 5, aprobados: 110, total: 260, credits: 4, sexo: "Masculino" }
          ];
      
      const chosen = names[Math.floor(Math.random() * names.length)];
      // Generate randomized control number to prevent duplicate visual keys
      const finalControl = `${chosen.no.substring(0, 5)}${Math.floor(100 + Math.random() * 900)}`;
      
      await dbService.createTestAlumno({
        nombre: chosen.nombre,
        apellido_paterno: chosen.paterno,
        apellido_materno: chosen.materno,
        no_control: finalControl,
        correo_institucional: chosen.correo.replace("@", `_${finalControl.substring(5)}@`),
        carrera: chosen.career,
        semestre: chosen.semestre,
        creditos_aprobados: chosen.aprobados,
        creditos_total_carrera: chosen.total,
        creditos_complementarios: chosen.credits,
        sexo: chosen.sexo,
        telefono: "998" + Math.floor(1000000 + Math.random() * 9000000)
      });
      
      // Refresh list
      const updated = await dbService.getAlumnosTecnologico();
      setStudents(updated);
    } catch (err) {
      console.error("Error creating test student:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el expediente de prueba de ${name}?`)) return;
    setDeletingIds(prev => ({ ...prev, [studentId]: true }));
    try {
      await dbService.deleteAlumno(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setDeletingIds(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const getStudentPeriodDisplay = (student: any): string => {
    const p = student.anexo_17_datos?.periodo || student.status_academico?.periodo;
    if (!p) return 'AGOSTO - DICIEMBRE 2026';
    const normalized = p.toUpperCase().trim();
    if (normalized.includes('2026-05') || normalized.includes('2026-01')) {
      return 'ENERO - JUNIO 2026';
    } else if (normalized.includes('2026-08') || normalized.includes('2026-12')) {
      return 'AGOSTO - DICIEMBRE 2026';
    }
    return normalized;
  };

  const availablePeriods = useMemo(() => {
    const periodsSet = new Set<string>();
    // Default standard periods so they are always there as choices
    periodsSet.add('ENERO - JUNIO 2026');
    periodsSet.add('AGOSTO - DICIEMBRE 2026');
    periodsSet.add('ENERO - JUNIO 2027');
    periodsSet.add('AGOSTO - DICIEMBRE 2027');
    
    // Extract periods from students
    students.forEach(student => {
      const p = getStudentPeriodDisplay(student);
      if (p) {
        periodsSet.add(p);
      }
    });

    // Sort descending to show newest first
    return Array.from(periodsSet).sort((a, b) => b.localeCompare(a));
  }, [students]);

  const availablePeriodsWithCounts = useMemo(() => {
    return availablePeriods.map(name => {
      const count = students.filter(s => getStudentPeriodDisplay(s) === name).length;
      return { name, count };
    });
  }, [students, availablePeriods]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const studentPeriod = getStudentPeriodDisplay(s);

      if (activeTab === 'activo') {
        // Only show students of the current active period
        if (studentPeriod !== CURRENT_ACTIVE_PERIOD) {
          return false;
        }
      } else {
        // Show students of the selected period in historical mode
        if (selectedPeriod !== null && studentPeriod !== selectedPeriod) {
          return false;
        }
      }

      const name = s.name || '';
      const control = s.control || s.controlNumber || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             control.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [students, searchQuery, activeTab, selectedPeriod]);

  // If in Historial mode and NO period is selected yet, render the Period Folder Grid
  if (mode === 'historial' && selectedPeriod === null) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              Historial de Periodos
            </h2>
            <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Consulta y visualiza los expedientes escolares históricos clasificados por cada ciclo escolar pasado.
            </p>
          </div>
        </div>

        {/* Info Header */}
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDarkMode 
            ? 'bg-[#121926] border-neutral-800' 
            : 'bg-white border-neutral-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-teal/10 text-brand-teal shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>
                Archivo Digital de Periodos
              </h3>
              <p className="text-[11px] font-medium text-neutral-500">
                Selecciona una carpeta para ingresar al registro de alumnos, verificar documentación técnica y descargar reportes específicos de ese periodo.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Obteniendo periodos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availablePeriodsWithCounts.map((period) => (
              <div 
                key={period.name}
                id={`period-card-${period.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedPeriod(period.name)}
                className={`p-8 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-[#121926] border-neutral-800 hover:border-brand-teal/50 hover:shadow-lg hover:shadow-brand-teal/5 hover:-translate-y-1' 
                    : 'bg-white border-neutral-100 hover:border-brand-teal/40 hover:shadow-xl hover:shadow-brand-teal/5 hover:-translate-y-1'
                }`}
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-colors duration-300" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-teal/5 text-brand-teal'} group-hover:scale-110 transition-transform duration-300`}>
                      <FolderArchive size={24} />
                    </div>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      period.count > 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}>
                      {period.count} {period.count === 1 ? 'Alumno' : 'Alumnos'}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-base font-black uppercase tracking-wider ${isDarkMode ? 'text-neutral-100' : 'text-brand-blue'}`}>
                      {period.name}
                    </h4>
                    <p className="text-xs font-medium text-neutral-500 mt-2">
                      Expedientes escolares, anexos y actas de liberación técnica firmadas.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/60 mt-6 flex items-center justify-between text-xs font-black uppercase tracking-widest text-brand-teal group-hover:text-emerald-500 transition-colors">
                  <span>Consultar Expedientes</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
            {mode === 'activo' ? 'Revisión de Expedientes' : 'Historial de Periodos'}
          </h2>
          <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {mode === 'activo' 
              ? 'Evalúa los documentos técnicos y genera las cartas de liberación de alumnos registrados.' 
              : `Filtra, consulta y visualiza expedientes escolares correspondientes al ciclo ${selectedPeriod}.`}
          </p>
        </div>
      </div>

      {/* Info Card or Period Selector based on Mode */}
      {mode === 'activo' ? (
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDarkMode 
            ? 'bg-emerald-950/10 border-emerald-900/30' 
            : 'bg-emerald-50/50 border-emerald-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <h3 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>
                Periodo Actual Vigente: {CURRENT_ACTIVE_PERIOD}
              </h3>
              <p className="text-[11px] font-medium text-neutral-500">
                Mostrando únicamente los expedientes de los alumnos registrados en este ciclo escolar activo.
              </p>
            </div>
          </div>
          <span className="self-start md:self-auto inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 animate-pulse">
            Ciclo Activo
          </span>
        </div>
      ) : (
        <div className={`p-6 rounded-[2rem] border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDarkMode 
            ? 'bg-[#121926] border-neutral-800' 
            : 'bg-white border-neutral-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedPeriod(null)}
              className={`p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 ${
                isDarkMode 
                  ? 'bg-neutral-850 hover:bg-neutral-800 text-neutral-300' 
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
              }`}
              title="Volver al Historial de Periodos"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Historial</span>
                <span className="text-neutral-300">/</span>
                <span className="text-xs font-black text-brand-teal uppercase tracking-wider">{selectedPeriod}</span>
              </div>
              <h3 className={`text-sm font-black tracking-tight mt-0.5 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>
                Expedientes del Periodo {selectedPeriod}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSelectedPeriod(null)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border cursor-pointer ${
              isDarkMode 
                ? 'bg-neutral-800/50 hover:bg-neutral-800 text-neutral-450 border-neutral-850 hover:text-neutral-200' 
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-150'
            }`}
          >
            ← Cambiar Periodo
          </button>
        </div>
      )}

      <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}>
        <div className={`p-8 border-b transition-colors duration-500 ${isDarkMode ? 'border-neutral-800 bg-[#0a0f18]/30' : 'border-neutral-100 bg-neutral-50/30'}`}>
          <div className="relative w-full max-w-md group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número de control..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-sm font-bold shadow-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-white border-neutral-200 text-neutral-800'}`}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Obteniendo alumnos...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}>
              <UserX className="text-neutral-400" size={36} />
            </div>
            <p className={`font-black text-lg transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-brand-blue'}`}>
              {searchQuery ? 'Ningún alumno coincide con tu búsqueda.' : 'No hay alumnos registrados actualmente.'}
            </p>
            <p className="text-xs font-medium text-neutral-500 mt-2">
              {searchQuery ? 'Intenta modificar el filtro o el término de búsqueda.' : 'Los alumnos aparecerán aquí cuando completen su registro.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Alumno</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Carrera</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Métricas Académicas</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Condición Acatada</th>
                  <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-right ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-neutral-800' : 'divide-neutral-50'}`}>
                {filteredStudents.map((student) => {
                  const isSufficient = (student.progress || 0) >= 70 && (student.credits || 0) >= 5;
                  
                  return (
                    <tr key={student.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-[#1a2333]' : 'hover:bg-brand-teal/[0.02]'}`}>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className={`font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{student.name}</span>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{student.control}</span>
                            <span className="text-[10px] text-neutral-400 shrink-0">•</span>
                            <span className="inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-teal/10 text-brand-teal border border-brand-teal/10 shrink-0">
                              {getStudentPeriodDisplay(student)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-8 py-6 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {student.career}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${student.progress >= 70 ? 'text-brand-teal' : 'text-brand-orange'}`}>
                              {student.progress}% Avance
                            </span>
                            <span className="text-[10px] text-neutral-400">•</span>
                            <span className={`text-xs font-bold ${student.credits >= 5 ? 'text-brand-teal' : 'text-brand-orange'}`}>
                              {student.credits} Créditos Compl.
                            </span>
                          </div>
                          <div className="w-24 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.progress >= 70 ? 'bg-brand-teal' : 'bg-brand-orange'}`} 
                              style={{ width: `${Math.min(100, student.progress)}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          student.apto 
                            ? 'bg-brand-teal/10 text-brand-teal' 
                            : 'bg-brand-orange/10 text-brand-orange'
                        }`}>
                          {student.apto ? (
                            <>
                              <CheckCircle size={10} />
                              Apto / Califica
                            </>
                          ) : (
                            <>
                              <AlertCircle size={10} />
                              No Apto / Falta Avance
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 ${isDarkMode ? 'bg-[#1a2333] text-brand-teal hover:bg-brand-teal hover:text-white border border-neutral-800' : 'bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white'}`}
                          >
                            <FileSignature size={14} />
                            Revisar
                          </button>
                          
                          <button
                            disabled={deletingIds[student.id]}
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className={`p-2.5 rounded-xl border transition-all active:scale-95 disabled:opacity-50 ${
                              isDarkMode
                                ? 'bg-[#111827] text-neutral-700 hover:text-brand-orange hover:border-brand-orange/30 border-neutral-800'
                                : 'bg-white text-neutral-400 hover:text-brand-orange hover:border-brand-orange/30 border-neutral-200'
                            }`}
                            title="Eliminar Expediente"
                          >
                            {deletingIds[student.id] ? (
                              <Loader2 size={14} className="animate-spin text-brand-orange" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedStudent && (
        <ReviewDocsModal
          student={selectedStudent}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedStudent(null)}
          onUpdate={async () => {
            try {
              const data = await dbService.getAlumnosTecnologico();
              setStudents(data);
              const refreshed = data.find(s => s.id === selectedStudent.id);
              if (refreshed) {
                setSelectedStudent(refreshed);
              }
            } catch (err) {
              console.error("Error refreshing roster:", err);
            }
          }}
        />
      )}
    </div>
  );
}

interface ReviewDocsModalProps {
  student: any;
  isDarkMode?: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

function ReviewDocsModal({ student, isDarkMode, onClose, onUpdate }: ReviewDocsModalProps) {
  const [activeCategory, setActiveCategory] = useState<'requisitos' | 'apertura' | 'r1' | 'r2' | 'r3'>('requisitos');
  const [activeKey, setActiveKey] = useState<string>('kardex');
  const [obsText, setObsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const docTitles: Record<string, string> = {
    kardex: 'Kardex Académico',
    carga_academica: 'Carga Académica',
    vigencia_derechos: 'Vigencia de Derechos',
    solicitud_servicio_social: 'Solicitud de Servicio Social',
    carta_compromiso: 'Carta Compromiso',
    carta_presentacion: 'Carta de Presentación',
    carta_asignacion: 'Carta Asignación',
    plan_de_trabajo: 'Plan de Trabajo',
    tarjeta_control: 'Tarjeta de Control',
    r1_reporte_bimestral_doc: 'Reporte 1: Reporte Bimestral',
    r1_evaluacion_cualitativa: 'Reporte 1: Evaluación Cualitativa',
    r1_auto_evaluacion: 'Reporte 1: Autoevaluación',
    r2_reporte_bimestral_doc: 'Reporte 2: Reporte Bimestral',
    r2_evaluacion_cualitativa: 'Reporte 2: Evaluación Cualitativa',
    r2_auto_evaluacion: 'Reporte 2: Autoevaluación',
    r3_reporte_bimestral_doc: 'Reporte 3: Reporte Bimestral',
    r3_evaluacion_cualitativa: 'Reporte 3: Evaluación Cualitativa',
    r3_auto_evaluacion: 'Reporte 3: Autoevaluación',
    evaluacion_desempeno_final: 'Evaluación Cualitativa Final',
    formato_final: 'Formato de Informe Final',
    reporte_final: 'Informe Final'
  };

  // Parse active document info
  const docInfo = useMemo(() => {
    if (activeKey.startsWith('r1_') || activeKey.startsWith('r2_') || activeKey.startsWith('r3_')) {
      const reportNo = parseInt(activeKey.substring(1, 2));
      const subKey = activeKey.substring(3) as 'reporte_bimestral_doc' | 'evaluacion_cualitativa' | 'auto_evaluacion';
      
      const reports = student?.reportes_bimestrales || [];
      const report = reports.find((r: any) => r.numero_reporte === reportNo);
      const docMap = report?.[subKey] || {};
      
      const url = docMap.url_documento || docMap.url_sellado || '';
      const valid = docMap.estado_validacion === true;
      const obs = docMap.observaciones || '';
      
      let status = 'PENDIENTE';
      if (url) {
        if (valid) {
          status = 'APROBADO';
        } else if (obs && obs.trim() !== '' && obs.trim() !== '""') {
          status = 'RECHAZADO';
        } else {
          status = 'EN REVISIÓN';
        }
      }
      return { status, url, observaciones: obs };
    } else if (activeKey === 'evaluacion_desempeno_final' || activeKey === 'formato_final' || activeKey === 'reporte_final') {
      const docMap = student?.cierre_servicio?.[activeKey] || {};
      const url = docMap.url_documento || docMap.url_sellado || '';
      const valid = docMap.estado_validacion === true;
      const obs = docMap.observaciones || '';
      
      let status = 'PENDIENTE';
      if (url) {
        if (valid) {
          status = 'APROBADO';
        } else if (obs && obs.trim() !== '' && obs.trim() !== '""') {
          status = 'RECHAZADO';
        } else {
          status = 'EN REVISIÓN';
        }
      }
      return { status, url, observaciones: obs };
    } else {
      const docMap = student?.[activeKey] || {};
      const url = docMap.url_documento || '';
      const valid = docMap.estado_validacion === true;
      const obs = docMap.observaciones || '';
      
      let status = 'PENDIENTE';
      if (url) {
        if (valid) {
          status = 'APROBADO';
        } else if (obs && obs.trim() !== '' && obs.trim() !== '""' && obs.trim() !== '" "') {
          status = 'RECHAZADO';
        } else {
          status = 'EN REVISIÓN';
        }
      }
      
      return {
        status,
        url,
        observaciones: obs,
      };
    }
  }, [student, activeKey]);

  useEffect(() => {
    setObsText(docInfo.observaciones || '');
    setShowRejectionForm(false);
  }, [activeKey, docInfo.observaciones]);

  const handleApprove = async () => {
    setIsSaving(true);
    try {
      if (activeKey.startsWith('r1_') || activeKey.startsWith('r2_') || activeKey.startsWith('r3_')) {
        const reportNo = parseInt(activeKey.substring(1, 2));
        const subKey = activeKey.substring(3) as 'reporte_bimestral_doc' | 'evaluacion_cualitativa' | 'auto_evaluacion';
        await dbService.validateBimestralDocument(student.id, reportNo, subKey, true, "");
      } else if (activeKey === 'evaluacion_desempeno_final' || activeKey === 'formato_final' || activeKey === 'reporte_final') {
        await dbService.validateCierreDocument(student.id, activeKey, true, "");
      } else {
        await dbService.updateStudentDocumentValidation(student.id, activeKey, true, "");
      }
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!obsText.trim()) {
      alert("Por favor escribe una observación o motivo del rechazo.");
      return;
    }
    setIsSaving(true);
    try {
      if (activeKey.startsWith('r1_') || activeKey.startsWith('r2_') || activeKey.startsWith('r3_')) {
        const reportNo = parseInt(activeKey.substring(1, 2));
        const subKey = activeKey.substring(3) as 'reporte_bimestral_doc' | 'evaluacion_cualitativa' | 'auto_evaluacion';
        await dbService.validateBimestralDocument(student.id, reportNo, subKey, false, obsText);
      } else if (activeKey === 'evaluacion_desempeno_final' || activeKey === 'formato_final' || activeKey === 'reporte_final') {
        await dbService.validateCierreDocument(student.id, activeKey, false, obsText);
      } else {
        await dbService.updateStudentDocumentValidation(student.id, activeKey, false, obsText);
      }
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getKeysForCategory = () => {
    if (activeCategory === 'requisitos') {
      return ['kardex', 'carga_academica', 'vigencia_derechos'];
    }
    if (activeCategory === 'apertura') {
      return ['solicitud_servicio_social', 'carta_compromiso', 'carta_presentacion', 'carta_asignacion', 'plan_de_trabajo', 'tarjeta_control'];
    }
    if (activeCategory === 'r1') {
      return ['r1_reporte_bimestral_doc', 'r1_evaluacion_cualitativa', 'r1_auto_evaluacion'];
    }
    if (activeCategory === 'r2') {
      return ['r2_reporte_bimestral_doc', 'r2_evaluacion_cualitativa', 'r2_auto_evaluacion'];
    }
    return [
      'r3_reporte_bimestral_doc',
      'r3_evaluacion_cualitativa',
      'r3_auto_evaluacion',
      'evaluacion_desempeno_final',
      'formato_final',
      'reporte_final'
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-5xl rounded-[2.5rem] border shadow-2xl overflow-hidden transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#0f172a] border-neutral-800 text-white' 
          : 'bg-white border-neutral-100 text-neutral-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-neutral-800 bg-[#070e1b]/40' : 'border-neutral-100 bg-neutral-50/50'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal">
                Expediente Digital
              </span>
              <span className="text-neutral-400">•</span>
              <p className="text-xs font-mono text-neutral-400">{student.control || student.id}</p>
            </div>
            <h3 className="text-2xl font-black tracking-tight mt-1">{student.name}</h3>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wide mt-0.5">{student.career}</p>
          </div>
          <button 
            onClick={onClose}
            className={`p-3 rounded-full hover:scale-110 active:scale-95 transition-all ${
              isDarkMode ? 'hover:bg-white/5 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Inner Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800/10 dark:divide-neutral-800">
          {/* Left Menu Selection & Validation Rules - 4cols */}
          <div className="lg:col-span-4 p-6 space-y-6 max-h-[600px] overflow-y-auto">
            {/* Category tabs */}
            <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-[#1a2333] rounded-2xl border border-neutral-200/50 dark:border-neutral-800">
              {(['requisitos', 'apertura', 'r1', 'r2', 'r3'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    const defaultKeys = {
                      requisitos: 'kardex',
                      apertura: 'solicitud_servicio_social',
                      r1: 'r1_reporte_bimestral_doc',
                      r2: 'r2_reporte_bimestral_doc',
                      r3: 'r3_reporte_bimestral_doc'
                    };
                    setActiveKey(defaultKeys[cat]);
                  }}
                  className={`flex-1 text-center py-2 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'text-neutral-500 hover:text-brand-blue dark:hover:text-white'
                  }`}
                >
                  {cat === 'requisitos' ? 'Iniciales' : cat === 'apertura' ? 'Apertura' : cat === 'r1' ? 'R1' : cat === 'r2' ? 'R2' : 'R3'}
                </button>
              ))}
            </div>

            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Selecciona para revisar:</p>
            
            <div className="space-y-3">
              {getKeysForCategory().map((key) => {
                let hasUrl = false;
                let isApproved = false;
                let obs = '';

                if (key.startsWith('r1_') || key.startsWith('r2_') || key.startsWith('r3_')) {
                  const rNo = parseInt(key.substring(1, 2));
                  const sKey = key.substring(3);
                  const r = student?.reportes_bimestrales?.find((rep: any) => rep.numero_reporte === rNo);
                  const subD = r?.[sKey] || {};
                  hasUrl = !!(subD.url_documento || subD.url_sellado);
                  isApproved = subD.estado_validacion === true;
                  obs = subD.observaciones || '';
                } else if (key === 'evaluacion_desempeno_final' || key === 'formato_final' || key === 'reporte_final') {
                  const docMap = student?.cierre_servicio?.[key] || {};
                  hasUrl = !!(docMap.url_documento || docMap.url_sellado);
                  isApproved = docMap.estado_validacion === true;
                  obs = docMap.observaciones || '';
                } else {
                  const docMap = student?.[key] || {};
                  hasUrl = !!docMap.url_documento;
                  isApproved = docMap.estado_validacion === true;
                  obs = docMap.observaciones || '';
                }

                const getStatusPill = () => {
                  if (!hasUrl) return <span className="text-[9px] font-black px-2 py-0.5 rounded bg-neutral-100 text-neutral-400 dark:bg-white/5 uppercase">No Subido</span>;
                  if (isApproved) {
                    return <span className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal uppercase">Aceptado</span>;
                  }
                  if (obs.trim() !== '' && obs.trim() !== '""') {
                    return <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 uppercase">Rechazado</span>;
                  }
                  return <span className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange uppercase">Revisión</span>;
                };

                return (
                  <button
                    key={key}
                    onClick={() => setActiveKey(key)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      activeKey === key
                        ? 'border-brand-teal bg-brand-teal/[0.03] shadow-inner shadow-brand-teal/5'
                        : isDarkMode
                          ? 'border-neutral-800 hover:border-neutral-700 bg-white/[0.01]'
                          : 'border-neutral-100 hover:border-neutral-200 bg-stone-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <div className={`p-2 rounded-xl shrink-0 ${
                        activeKey === key 
                          ? 'bg-brand-teal/10 text-brand-teal' 
                          : isDarkMode ? 'bg-neutral-800 text-neutral-500' : 'bg-neutral-50 text-neutral-400'
                      }`}>
                        <FileText size={16} />
                      </div>
                      <div className="truncate">
                        <p className={`text-[11px] font-black uppercase tracking-wider truncate ${activeKey === key ? 'text-brand-teal' : ''}`}>{docTitles[key]}</p>
                        <p className="text-[9px] text-neutral-400 font-bold">Expediente digital</p>
                      </div>
                    </div>
                    {getStatusPill()}
                  </button>
                );
              })}
            </div>

            {/* Validation Panel */}
            <div className={`p-5 rounded-3xl border ${
              isDarkMode ? 'bg-[#1e293b]/30 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'
            } space-y-4`}>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 font-mono">Panel de Validación</p>
              </div>

              {/* Status information */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-neutral-400">Estado de {docTitles[activeKey]}:</p>
                <div className="flex items-center gap-2 mt-1">
                  {docInfo.status === 'APROBADO' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-teal/10 text-brand-teal">
                      <CheckCircle size={10} />
                      Aprobado / Validado
                    </span>
                  )}
                  {docInfo.status === 'RECHAZADO' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500">
                      <XCircle size={10} />
                      Rechazado
                    </span>
                  )}
                  {docInfo.status === 'EN REVISIÓN' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-orange/10 text-brand-orange animate-pulse">
                      <AlertCircle size={10} />
                      Por Validar
                    </span>
                  )}
                  {docInfo.status === 'PENDIENTE' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                      <AlertCircle size={10} />
                      Sin Subir
                    </span>
                  )}
                </div>
              </div>

              {docInfo.observaciones && (
                <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider font-mono">Observaciones previas:</p>
                  <p className="text-xs italic text-neutral-400">"{docInfo.observaciones}"</p>
                </div>
              )}

              {/* Actions form */}
              {docInfo.url ? (
                <div className="space-y-3 pt-3">
                  {!showRejectionForm ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        disabled={isSaving}
                        onClick={handleApprove}
                        className="py-3 px-4 rounded-2xl bg-brand-teal text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-55 shadow-md shadow-brand-teal/10"
                      >
                        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Aprobar
                      </button>
                      <button
                        disabled={isSaving}
                        onClick={() => setShowRejectionForm(true)}
                        className={`py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 text-center flex items-center justify-center gap-2 disabled:opacity-55 ${
                          isDarkMode 
                            ? 'bg-neutral-800 text-rose-400 border-neutral-700 hover:bg-neutral-700' 
                            : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50/50'
                        }`}
                      >
                        <X size={12} />
                        Rechazar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-rose-500 font-mono">Motivo del rechazo:</label>
                        <textarea
                          placeholder="Firma no legible, documento vencido..."
                          value={obsText}
                          onChange={(e) => setObsText(e.target.value)}
                          className={`w-full p-3.5 border rounded-2xl text-xs outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 min-h-[90px] transition-all ${
                            isDarkMode 
                              ? 'bg-[#0f172a] border-neutral-800 text-white placeholder:text-neutral-600' 
                              : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          disabled={isSaving}
                          onClick={handleReject}
                          className="py-3 px-4 rounded-2xl bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-55 shadow-md"
                        >
                          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          Enviar
                        </button>
                        <button
                          disabled={isSaving}
                          onClick={() => setShowRejectionForm(false)}
                          className={`py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all active:scale-95 text-center flex items-center justify-center gap-2 ${
                            isDarkMode 
                              ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700' 
                              : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 text-center italic pt-4">Consola inactiva hasta que el alumno cargue el archivo correspondiente.</p>
              )}
            </div>
          </div>

          {/* Right Preview Drawer - 8cols */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between min-h-[500px] lg:min-h-[600px]">
            <div className="flex-1 flex flex-col justify-center animate-fadeIn animate-duration-500">
              {docInfo.url ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                        isDarkMode ? 'bg-[#0a0f18] text-brand-teal' : 'bg-[#f4f7fa] text-brand-teal'
                      }`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-black tracking-tight">{docTitles[activeKey]}</h4>
                        <p className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-[#00c49f]/80' : 'text-brand-teal'}`}>Visualizador Oficial VinculaTec</p>
                      </div>
                    </div>
                    
                    <a 
                      href={docInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-brand-teal text-white text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-md shadow-brand-teal/10 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Eye size={12} />
                      Ver Pantalla Completa
                    </a>
                  </div>
                  
                  {/* Embedded PDF/Image Iframe Previews */}
                  {docInfo.url && (
                    <div className={`rounded-3xl border overflow-hidden h-[540px] relative shadow-inner ${
                      isDarkMode ? 'border-neutral-800 bg-[#070e1b]' : 'border-neutral-100 bg-[#f9fafb]'
                    }`}>
                      <iframe 
                        src={docInfo.url} 
                        className="w-full h-full border-0" 
                        title="Document Preview"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className={`mx-auto w-14 h-14 rounded-[1.2rem] flex items-center justify-center ${
                    isDarkMode ? 'bg-white/5 text-neutral-700' : 'bg-neutral-50 text-neutral-300'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-neutral-400 font-mono">Sin Archivo Disponible</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">El alumno aún no ha subido el documento de {docTitles[activeKey]}.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t font-mono text-[8px] text-neutral-500 uppercase flex flex-wrap justify-between gap-4 border-neutral-800/10 dark:border-neutral-800">
              <span>Rastro de Depósito: Firestore Cloud Sync</span>
              <span>Modificado en tiempo real</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

