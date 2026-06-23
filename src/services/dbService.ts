import { Dependency } from "../types";
import { DEPENDENCIES } from "../constants";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// LocalStorage Keys
const STUDENTS_KEY = 'vinculatec_local_students';
const DEPENDENCIES_KEY = 'vinculatec_local_dependencies';
const SUBMISSIONS_KEY = 'vinculatec_local_submissions';

// Dynamic DB State
export let isMongoActive = false;

if (typeof window !== 'undefined') {
  fetch('/api/db-status')
    .then(r => r.json())
    .then(status => {
      isMongoActive = !!status.connected;
      console.log(`🔌 Database Service: MongoDB Active = ${isMongoActive}`);
    })
    .catch(e => {
      console.log("🔌 Database Service running in pure LocalStorage mode (offline)");
      isMongoActive = false;
    });
}

// Reactive Pub/Sub Listeners
type AlumnoListener = (data: any) => void;
const listeners = new Set<() => void>();

export const subscribeToAlumno = (studentUid: string, callback: AlumnoListener) => {
  const checkAndNotify = async () => {
    if (isMongoActive) {
      try {
        const res = await fetch(`/api/alumnos/${studentUid}`);
        const json = await res.json();
        if (json.success && json.data) {
          const normalized = normalizeStudent({
            ...json.data,
            id: json.data._id || json.data.id,
          });
          callback(normalized);
          return;
        }
      } catch (err) {
        console.warn("Realtime sub fallback to local: ", err);
      }
    }

    const list = getAlumnosTecnologicoSync();
    const target = list.find((a: any) => a.id === studentUid);
    if (target) {
      callback(target);
    }
  };
  
  checkAndNotify();
  
  const listener = () => checkAndNotify();
  listeners.add(listener);

  const interval = setInterval(checkAndNotify, 4000);
  
  return () => {
    listeners.delete(listener);
    clearInterval(interval);
  };
};

export const notifyDbChanged = () => {
  listeners.forEach(l => {
    try { l(); } catch (e) { console.error("Error notifying DB listener: ", e); }
  });
};

// Initial Data Seed Helpers
const initializeLocalStorageDb = () => {
  if (typeof window === 'undefined') return;

  // 1. Seed Dependencies
  if (!localStorage.getItem(DEPENDENCIES_KEY)) {
    // Generate initial loaded list of dependencies from default constants
    // Let's add the specific SEDEQ/SEQ dependency from the user's Mongoose script
    const initialDeps: Dependency[] = [
      {
        id: 'dep_seq',
        name: 'Secretaría de Educación Pública de Quintana Roo',
        category: 'Gobierno / Ayuntamiento',
        subCategory: 'Virtualización Documental',
        location: 'Av. Bonampak 31, 77500 Cancún, Q.R.',
        vacancies: 9, // started with 10, reduced to 9 because Carlos is pre-assigned to it below
        maxVacancies: 10,
        status: 'Alta Disponibilidad',
        image: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/logo_dependencias%2FSEQ.png?alt=media&token=37becfc2-d190-401e-8757-a30238bd5c29',
        objective: 'Apoyar en la gestión de programas educativos y alfabetización en zonas vulnerables del municipio, promoviendo el desarrollo integral de los estudiantes.',
        activities: [
          'Captura y análisis de datos de aprovechamiento escolar.',
          'Apoyo logístico en eventos culturales y ferias de ciencias.',
          'Atención a padres de familia en ventanilla de servicios.'
        ],
        contact: {
          titular: 'Lic. María Fernanda López',
          phone: '9981563589',
          email: 'prueba1@gmail.com',
          schedule: 'Lunes - Viernes, 9:00 AM - 4:00 PM',
          address: 'Av. Bonampak 31, 77500 Cancún, Q.R.',
          puesto_titular: 'Directora General',
          responsable_del_programa: 'Victor Hugo Molina',
          modalidad: 'presencial',
          ubicacion_maps: 'https://maps.app.goo.gl/38Kj45k53tY4jbBD7'
        }
      },
      ...DEPENDENCIES
    ];
    localStorage.setItem(DEPENDENCIES_KEY, JSON.stringify(initialDeps));
  }

  // 2. Seed Students representing original users
  if (!localStorage.getItem(STUDENTS_KEY)) {
    const initialStudents = [
      {
        id: '2', // Carlos Mendoza (UID is 2 or 21530321)
        apto: true,
        id_dependencia: 'dep_seq',
        dependencia_seleccionada: 'Secretaría de Educación Pública de Quintana Roo',
        perfil_confirmado: false,
        datos: {
          nombre: 'Carlos Eduardo',
          apellido_paterno: 'Mendoza',
          apellido_materno: 'Kauil',
          correo_institucional: 'l21530321@cancun.tecnm.mx',
          fecha_nacimiento: '2003-05-17',
          foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
          no_control: '21530321',
          nss: '56180315360',
          sexo: 'Hombre',
          telefono: '9981563528'
        },
        domicilio: {
          calle: 'Majahua',
          ciudad: 'Cancún',
          colonia: 'Prado Norte',
          cp: '77539',
          estado: 'Quintana Roo'
        },
        status_academico: {
          carrera: 'Ingeniería en Sistemas Computacionales',
          creditos_aprobados: 220,
          creditos_complementarios: 5,
          creditos_total_carrera: 254,
          periodo: '2026-05-01',
          semestre: 10
        },
        kardex: {
          estado_validacion: false,
          fecha_subida: '2026-06-12T18:30:10.000Z',
          observaciones: '',
          url_documento: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'
        },
        carga_academica: {
          estado_validacion: false,
          fecha_subida: '2026-06-12T18:32:00.000Z',
          observaciones: '',
          url_documento: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'
        },
        vigencia_derechos: {
          estado_validacion: false,
          fecha_subida: '2026-06-12T18:34:11.000Z',
          observaciones: '',
          url_documento: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'
        },
        // initial opening docs empty or simulated
        solicitud_servicio_social: null,
        carta_compromiso: null,
        carta_asignacion: null,
        plan_de_trabajo: null,
        tarjeta_control: null
      },
      {
        id: '3', // Ana Sofía López
        apto: true,
        id_dependencia: '',
        dependencia_seleccionada: '',
        perfil_confirmado: false,
        datos: {
          nombre: 'Ana Sofía',
          apellido_paterno: 'López',
          apellido_materno: 'García',
          correo_institucional: 'l19530001@cancun.tecnm.mx',
          fecha_nacimiento: '1999-10-22',
          foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          no_control: '19530001',
          nss: '98765432109',
          sexo: 'Femenino',
          telefono: '(998) 987-6543'
        },
        domicilio: {
          calle: 'Av. Las Américas, Mz 14, Lote 3',
          ciudad: 'Cancún',
          colonia: 'Residencial Las Américas',
          cp: '77500',
          estado: 'Quintana Roo'
        },
        status_academico: {
          carrera: 'Arquitectura',
          creditos_aprobados: 230,
          creditos_complementarios: 6,
          creditos_total_carrera: 270,
          periodo: '2026-05-01',
          semestre: 9
        },
        kardex: null,
        carga_academica: null,
        vigencia_derechos: null,
      }
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(initialStudents));
  }
};

// Seed automatically on load
initializeLocalStorageDb();

// Sync getter functions
export const normalizeStudent = (s: any): any => {
  if (!s) return s;

  // Resolve nested structures safely and keep top-level edits prioritized
  const reqInit = s.requisitos_iniciales || {};
  const docAper = s.documentos_apertura || {};

  const kardex = s.kardex !== undefined ? s.kardex : (reqInit.kardex || null);
  const carga_academica = s.carga_academica !== undefined ? s.carga_academica : (reqInit.carga_academica || null);
  const constancia_vigencia_derechos = s.vigencia_derechos !== undefined ? s.vigencia_derechos : (reqInit.constancia_vigencia_derechos || s.constancia_vigencia_derechos || null);

  const solicitud_servicio = s.solicitud_servicio_social !== undefined ? s.solicitud_servicio_social : (docAper.solicitud_servicio || s.solicitud_servicio || null);
  const carta_compromiso = s.carta_compromiso !== undefined ? s.carta_compromiso : (docAper.carta_compromiso || null);
  const carta_presentacion = s.carta_presentacion !== undefined ? s.carta_presentacion : (docAper.carta_presentacion || null);
  const carta_asignacion = s.carta_asignacion !== undefined ? s.carta_asignacion : (docAper.carta_asignacion || null);
  const plan_trabajo = s.plan_de_trabajo !== undefined ? s.plan_de_trabajo : (docAper.plan_trabajo || s.plan_trabajo || null);
  const tarjeta_control = s.tarjeta_control !== undefined ? s.tarjeta_control : (docAper.tarjeta_control || null);

  return {
    ...s,
    // Flat keys for backwards compatibility in all views
    kardex,
    carga_academica,
    vigencia_derechos: constancia_vigencia_derechos,
    solicitud_servicio_social: solicitud_servicio,
    carta_compromiso,
    carta_presentacion,
    carta_asignacion,
    plan_de_trabajo: plan_trabajo,
    tarjeta_control,
    
    // Nested MongoDB schema matches
    credenciales: s.credenciales || {
      correo: s.datos?.correo_institucional || s.email || '',
      password: s.password || 'TecCancun2026*'
    },
    requisitos_iniciales: {
      kardex,
      carga_academica,
      constancia_vigencia_derechos
    },
    documentos_apertura: {
      carta_asignacion,
      carta_compromiso,
      carta_presentacion,
      plan_trabajo,
      solicitud_servicio,
      tarjeta_control
    },
    reportes_bimestrales: s.reportes_bimestrales || [
      {
        numero_reporte: 1,
        auto_evaluacion: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        evaluacion_cualitativa: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        reporte_bimestral_doc: { estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', fecha_inicio: '2026-05-16T05:00:00Z', fecha_termina: '2026-05-16T05:00:00Z', hora_bimestre: 180, horas_acumuladas: 0, observaciones: '', resumen: '', url_plantilla: '', url_sellado: '' }
      },
      {
        numero_reporte: 2,
        auto_evaluacion: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        evaluacion_cualitativa: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        reporte_bimestral_doc: { estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', fecha_inicio: '2026-05-16T05:00:00Z', fecha_termina: '2026-05-16T05:00:00Z', hora_bimestre: 180, horas_acumuladas: 0, observaciones: '', resumen: '', url_plantilla: '', url_sellado: '' }
      },
      {
        numero_reporte: 3,
        auto_evaluacion: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        evaluacion_cualitativa: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeño: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
        reporte_bimestral_doc: { estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', fecha_inicio: '2026-05-16T05:00:00Z', fecha_termina: '2026-05-16T05:00:00Z', hora_bimestre: 180, horas_acumuladas: 0, observaciones: '', resumen: '', url_plantilla: '', url_sellado: '' }
      }
    ],
    cierre_servicio: s.cierre_servicio || {
      evaluacion_desempeno_final: { calificacion: 0, estado_validacion: false, fecha_generacion: '2026-05-16T05:00:00Z', nivel_desempeno: '', observaciones: '', puntaje: [], url_plantilla: '', url_sellado: '' },
      formato_final: { puntaje: [], calificacion: 0, comentarios_vinculacion: '', url_plantilla: '', url_sellado: '', observaciones: '', estado_validacion: false, fecha_generacion: null },
      reporte_final: { url_documento: '', observaciones: '', estado_validacion: false, fecha_subida: null }
    }
  };
};

const getAlumnosTecnologicoSync = (): any[] => {
  try {
    const raw = localStorage.getItem(STUDENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((student: any) => normalizeStudent(student));
  } catch (e) {
    console.error("Local DB read error: ", e);
    return [];
  }
};

const saveAlumnosTecnologicoSync = (list: any[]) => {
  try {
    const normalized = list.map((student: any) => normalizeStudent(student));
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(normalized));
    notifyDbChanged();
  } catch (e) {
    console.error("Local DB write error: ", e);
  }
};

const getDependenciesSync = (): Dependency[] => {
  try {
    const raw = localStorage.getItem(DEPENDENCIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Local DB read error: ", e);
    return [];
  }
};

const saveDependenciesSync = (list: Dependency[]) => {
  try {
    localStorage.setItem(DEPENDENCIES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Local DB write error: ", e);
  }
};

// ------------------------- EXPORTED API OPERATIONS -------------------------

export const getTemplates = async () => {
  return [
    { id: "10", name: "Solicitud de Servicio Social", code: "anexo_17" },
    { id: "11", name: "Carta Compromiso", code: "carta_compromiso" },
    { id: "15", name: "Carta de Presentación", code: "carta_presentacion" },
    { id: "12", name: "Carta Asignación", code: "carta_asignacion" },
    { id: "13", name: "Plan de Trabajo", code: "plan_trabajo" },
    { id: "14", name: "Tarjeta de Control", code: "tarjeta_control" }
  ];
};

export const getTemplate = async (templateId: string) => {
  const list = await getTemplates();
  return list.find(t => t.id === templateId) || null;
};

export const submitDocument = async (templateId: string, data: any) => {
  const currentUserId = JSON.parse(localStorage.getItem('vinculatec_current_user') || '{}')?.id || '2';
  try {
    // Determine target doc key
    const templateKeyMap: Record<string, string> = {
      '10': 'solicitud_servicio_social',
      '11': 'carta_compromiso',
      '15': 'carta_presentacion',
      '12': 'carta_asignacion',
      '13': 'plan_de_trabajo',
      '14': 'tarjeta_control'
    };
    const docKey = templateKeyMap[templateId];
    if (docKey) {
      const students = getAlumnosTecnologicoSync();
      const updated = students.map(student => {
        if (student.id === currentUserId) {
          return {
            ...student,
            [docKey]: {
              estado_validacion: false,
              fecha_subida: new Date().toISOString(),
              observaciones: "",
              url_documento: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
              data: data
            }
          };
        }
        return student;
      });
      saveAlumnosTecnologicoSync(updated);
    }
    return `sub_${Date.now()}`;
  } catch (error) {
    console.error(error);
    throw new Error('Local Storage submission error');
  }
};

export const getUserSubmissions = async () => {
  return [];
};

export const syncUserProfile = async (userData: any) => {
  try {
    const currentUserId = JSON.parse(localStorage.getItem('vinculatec_current_user') || '{}')?.id || '2';
    const students = getAlumnosTecnologicoSync();
    
    let nombre = userData.name || "";
    let apellido_paterno = "";
    let apellido_materno = "";
    
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 3) {
      apellido_materno = parts.pop() || "";
      apellido_paterno = parts.pop() || "";
      nombre = parts.join(" ");
    } else if (parts.length === 2) {
      apellido_paterno = parts.pop() || "";
      nombre = parts[0];
    }

    const updated = students.map(s => {
      if (s.id === currentUserId) {
        const d = s.datos || {};
        const dom = s.domicilio || {};
        const statusAcad = s.status_academico || {};

        return {
          ...s,
          datos: {
            ...d,
            nombre: nombre || d.nombre,
            apellido_paterno: apellido_paterno || d.apellido_paterno,
            apellido_materno: apellido_materno || d.apellido_materno,
            no_control: userData.controlNumber || d.no_control,
            correo_institucional: userData.email || d.correo_institucional,
            fecha_nacimiento: userData.birthDate || d.fecha_nacimiento,
            foto: userData.profilePicture || d.foto,
            sexo: userData.gender || d.sexo,
            genero: userData.gender || d.genero,
            telefono: userData.phone || d.telefono,
            nss: userData.nss || d.nss
          },
          domicilio: {
            ...dom,
            calle: userData.address?.street || dom.calle,
            colonia: userData.address?.neighborhood || dom.colonia,
            cp: userData.address?.zipCode || dom.cp,
            ciudad: userData.address?.city || dom.ciudad,
            estado: userData.address?.state || dom.estado
          },
          status_academico: {
            ...statusAcad,
            semestre: typeof userData.semester === 'string' ? parseInt(userData.semester) || statusAcad.semestre : (userData.semester || statusAcad.semestre)
          }
        };
      }
      return s;
    });

    saveAlumnosTecnologicoSync(updated);

    // Sync active session user info
    const sessionUser = JSON.parse(localStorage.getItem('vinculatec_current_user') || '{}');
    if (sessionUser && sessionUser.id === currentUserId) {
      const refreshedTarget = updated.find(a => a.id === currentUserId);
      const combined = { ...sessionUser, ...userData, ...refreshedTarget };
      localStorage.setItem('vinculatec_current_user', JSON.stringify(combined));
    }
  } catch (error) {
    console.error("Local Storage User Profile sync error: ", error);
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  // Return standard picture representation mock
  return URL.createObjectURL(file);
};

export const uploadDependencyLogo = async (file: File): Promise<string> => {
  return URL.createObjectURL(file);
};

export const uploadStudentDocument = async (studentUid: string, docKey: string, file: File): Promise<string> => {
  const mockFileUrl = `https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800&filename=${encodeURIComponent(file.name)}`;
  
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const updatePayload: any = {};
        
        if (['kardex', 'carga_academica', 'vigencia_derechos'].includes(docKey)) {
          const reqKey = docKey === 'vigencia_derechos' ? 'constancia_vigencia_derechos' : docKey;
          updatePayload[`requisitos_iniciales.${reqKey}`] = {
            estado_validacion: false,
            fecha_subida: new Date().toISOString(),
            observaciones: "",
            url_documento: mockFileUrl
          };
        } else {
          const mapKey: any = {
            'solicitud_servicio_social': 'solicitud_servicio',
            'carta_compromiso': 'carta_compromiso',
            'carta_presentacion': 'carta_presentacion',
            'carta_asignacion': 'carta_asignacion',
            'plan_de_trabajo': 'plan_trabajo',
            'tarjeta_control': 'tarjeta_control'
          };
          const apertureKey = mapKey[docKey] || docKey;
          updatePayload[`documentos_apertura.${apertureKey}`] = {
            estado_validacion: false,
            fecha_subida: new Date().toISOString(),
            observaciones: "",
            url_documento: mockFileUrl,
            url_modificado: mockFileUrl
          };
        }

        updatePayload[docKey] = {
          estado_validacion: false,
          fecha_subida: new Date().toISOString(),
          observaciones: "",
          url_documento: mockFileUrl
        };

        await updateAlumnoCompleto(studentUid, updatePayload);
        return mockFileUrl;
      }
    } catch (e) {
      console.error("MongoDB upload document error, falling back: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    
    const updated = list.map(student => {
      if (student.id === studentUid) {
        return {
          ...student,
          [docKey]: {
            estado_validacion: false,
            fecha_subida: new Date().toISOString(),
            observaciones: "",
            url_documento: mockFileUrl
          }
        };
      }
      return student;
    });
    
    saveAlumnosTecnologicoSync(updated);
    return mockFileUrl;
  } catch (error) {
    console.error("Local Storage Doc upload error: ", error);
    throw error;
  }
};

export const uploadBimestralDocument = async (
  studentUid: string,
  reportNo: number,
  subKey: 'reporte_bimestral_doc' | 'evaluacion_cualitativa' | 'auto_evaluacion',
  file: File
): Promise<string> => {
  const mockFileUrl = `https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800&filename=${encodeURIComponent(file.name)}`;
  
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const reports = student.reportes_bimestrales || [];
        const index = reports.findIndex((r: any) => r.numero_reporte === reportNo);
        
        if (index !== -1) {
          const path = `reportes_bimestrales.${index}.${subKey}`;
          const currentSub = reports[index][subKey] || {};
          
          const updatePayload = {
            [path]: {
              ...currentSub,
              estado_validacion: false,
              fecha_generacion: new Date().toISOString(),
              fecha_subida: new Date().toISOString(),
              observaciones: "",
              url_sellado: mockFileUrl,
              url_documento: mockFileUrl
            }
          };
          
          await updateAlumnoCompleto(studentUid, updatePayload);
          return mockFileUrl;
        }
      }
    } catch (e) {
      console.error("MongoDB upload bimestral document error, falling back: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        const reports = student.reportes_bimestrales || [];
        const updatedReports = reports.map((r: any) => {
          if (r.numero_reporte === reportNo) {
            return {
              ...r,
              [subKey]: {
                ...(r[subKey] || {}),
                estado_validacion: false,
                fecha_generacion: new Date().toISOString(),
                fecha_subida: new Date().toISOString(),
                observaciones: "",
                url_sellado: mockFileUrl,
                url_documento: mockFileUrl
              }
            };
          }
          return r;
        });
        return {
          ...student,
          reportes_bimestrales: updatedReports
        };
      }
      return student;
    });

    saveAlumnosTecnologicoSync(updated);
    return mockFileUrl;
  } catch (err) {
    console.error("Error uploading bimestral doc in local mode:", err);
    throw err;
  }
};

export const validateBimestralDocument = async (
  studentUid: string,
  reportNo: number,
  subKey: 'reporte_bimestral_doc' | 'evaluacion_cualitativa' | 'auto_evaluacion',
  approved: boolean,
  observaciones: string = ""
): Promise<void> => {
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const reports = student.reportes_bimestrales || [];
        const index = reports.findIndex((r: any) => r.numero_reporte === reportNo);
        if (index !== -1) {
          const path = `reportes_bimestrales.${index}.${subKey}`;
          const currentSub = reports[index][subKey] || {};
          const updatePayload = {
            [path]: {
              ...currentSub,
              estado_validacion: approved,
              observaciones: observaciones,
              fecha_validacion: new Date().toISOString()
            }
          };
          await updateAlumnoCompleto(studentUid, updatePayload);
          return;
        }
      }
    } catch (e) {
      console.error("MongoDB validate bimestral document error: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        const reports = student.reportes_bimestrales || [];
        const updatedReports = reports.map((r: any) => {
          if (r.numero_reporte === reportNo) {
            return {
              ...r,
              [subKey]: {
                ...(r[subKey] || {}),
                estado_validacion: approved,
                observaciones: observaciones,
                fecha_validacion: new Date().toISOString()
              }
            };
          }
          return r;
        });
        return {
          ...student,
          reportes_bimestrales: updatedReports
        };
      }
      return student;
    });
    saveAlumnosTecnologicoSync(updated);
  } catch (err) {
    console.error("Error validating bimestral document:", err);
  }
};

export const uploadCierreDocument = async (
  studentUid: string,
  subKey: 'evaluacion_desempeno_final' | 'formato_final' | 'reporte_final',
  file: File
): Promise<string> => {
  const mockFileUrl = `https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800&filename=${encodeURIComponent(file.name)}`;
  
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const currentCierre = student.cierre_servicio || {};
        const currentSub = currentCierre[subKey] || {};
        const path = `cierre_servicio.${subKey}`;
        
        const updatePayload = {
          [path]: {
            ...currentSub,
            estado_validacion: false,
            fecha_generacion: new Date().toISOString(),
            fecha_subida: new Date().toISOString(),
            observaciones: "",
            url_documento: mockFileUrl,
            url_sellado: mockFileUrl
          }
        };
        
        await updateAlumnoCompleto(studentUid, updatePayload);
        return mockFileUrl;
      }
    } catch (e) {
      console.error("MongoDB upload closure document error, falling back: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        const currentCierre = student.cierre_servicio || {};
        const updatedCierre = {
          ...currentCierre,
          [subKey]: {
            ...(currentCierre[subKey] || {}),
            estado_validacion: false,
            fecha_generacion: new Date().toISOString(),
            fecha_subida: new Date().toISOString(),
            observaciones: "",
            url_documento: mockFileUrl,
            url_sellado: mockFileUrl
          }
        };
        return {
          ...student,
          cierre_servicio: updatedCierre
        };
      }
      return student;
    });

    saveAlumnosTecnologicoSync(updated);
    return mockFileUrl;
  } catch (err) {
    console.error("Error uploading closure doc in local mode:", err);
    throw err;
  }
};

export const validateCierreDocument = async (
  studentUid: string,
  subKey: 'evaluacion_desempeno_final' | 'formato_final' | 'reporte_final',
  approved: boolean,
  observaciones: string = ""
): Promise<void> => {
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const currentCierre = student.cierre_servicio || {};
        const currentSub = currentCierre[subKey] || {};
        const path = `cierre_servicio.${subKey}`;
        const updatePayload = {
          [path]: {
            ...currentSub,
            estado_validacion: approved,
            observaciones: observaciones,
            fecha_validacion: new Date().toISOString()
          }
        };
        await updateAlumnoCompleto(studentUid, updatePayload);
        return;
      }
    } catch (e) {
      console.error("MongoDB validate closure document error: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        const currentCierre = student.cierre_servicio || {};
        const updatedCierre = {
          ...currentCierre,
          [subKey]: {
            ...(currentCierre[subKey] || {}),
            estado_validacion: approved,
            observaciones: observaciones,
            fecha_validacion: new Date().toISOString()
          }
        };
        return {
          ...student,
          cierre_servicio: updatedCierre
        };
      }
      return student;
    });
    saveAlumnosTecnologicoSync(updated);
  } catch (err) {
    console.error("Error validating closure document:", err);
  }
};

export const setProfileConfirmed = async (studentUid: string) => {
  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(s => {
      if (s.id === studentUid) {
        return { ...s, perfil_confirmado: true };
      }
      return s;
    });
    saveAlumnosTecnologicoSync(updated);
  } catch (error) {
    console.error("Local Storage profile confirmation error: ", error);
  }
};

export const getDependencies = async (): Promise<Dependency[]> => {
  if (isMongoActive) {
    try {
      const res = await fetch('/api/dependencias');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((dep: any) => {
          const vacancies = typeof dep.vacantes === 'number' ? dep.vacantes : 0;
          return {
            id: dep._id || dep.id,
            name: (dep.nombre_dependencia || 'DEPENDENCIA').toUpperCase(),
            category: dep.sector === 'publico' ? 'Gobierno / Ayuntamiento' : 'Iniciativa Privada',
            subCategory: dep.nombre_programa || 'Servicio Social',
            location: dep.ubicacion?.domicilio_dependencia || 'Cancún',
            vacancies: vacancies,
            maxVacancies: dep.vacantes || 10,
            status: (vacancies > 4 ? 'Alta Disponibilidad' : (vacancies > 0 ? 'Lugares Limitados' : 'Disponible')) as any,
            image: dep.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
            oculta: dep.oculta || false,
            objective: dep.objetivo || '',
            activities: dep.actividades || [],
            contact: {
              titular: dep.contacto?.nombre_titular || '',
              phone: dep.contacto?.telefono || '',
              email: dep.contacto?.correo || '',
              schedule: `${dep.horarios_servicio?.dias || 'Lunes - Viernes'}, ${dep.horarios_servicio?.horas || '9:00 AM - 4:00 PM'}`,
              address: dep.ubicacion?.domicilio_dependencia || '',
              puesto_titular: dep.contacto?.puesto_titular || '',
              responsable_del_programa: dep.contacto?.responsable_del_programa || '',
              modalidad: dep.modalidad || 'presencial',
              ubicacion_maps: dep.ubicacion?.ubicacion_maps || ''
            }
          };
        });
      }
    } catch (e) {
      console.warn("Fallback dependencias error API, reading from local:", e);
    }
  }
  return getDependenciesSync();
};

export const getDependency = async (id: string): Promise<Dependency | null> => {
  if (isMongoActive) {
    try {
      const res = await fetch(`/api/dependencias/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const dep = json.data;
        const vacancies = typeof dep.vacantes === 'number' ? dep.vacantes : 0;
        return {
          id: dep._id || dep.id,
          name: (dep.nombre_dependencia || 'DEPENDENCIA').toUpperCase(),
          category: dep.sector === 'publico' ? 'Gobierno / Ayuntamiento' : 'Iniciativa Privada',
          subCategory: dep.nombre_programa || 'Servicio Social',
          location: dep.ubicacion?.domicilio_dependencia || 'Cancún',
          vacancies: vacancies,
          maxVacancies: dep.vacantes || 10,
          status: (vacancies > 4 ? 'Alta Disponibilidad' : (vacancies > 0 ? 'Lugares Limitados' : 'Disponible')) as any,
          image: dep.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
          oculta: dep.oculta || false,
          objective: dep.objetivo || '',
          activities: dep.actividades || [],
          contact: {
            titular: dep.contacto?.nombre_titular || '',
            phone: dep.contacto?.telefono || '',
            email: dep.contacto?.correo || '',
            schedule: `${dep.horarios_servicio?.dias || 'Lunes - Viernes'}, ${dep.horarios_servicio?.horas || '9:00 AM - 4:00 PM'}`,
            address: dep.ubicacion?.domicilio_dependencia || '',
            puesto_titular: dep.contacto?.puesto_titular || '',
            responsable_del_programa: dep.contacto?.responsable_del_programa || '',
            modalidad: dep.modalidad || 'presencial',
            ubicacion_maps: dep.ubicacion?.ubicacion_maps || ''
          }
        };
      }
    } catch (e) {
      console.warn("Error getting dependency from MongoDB, falling back: ", e);
    }
  }
  const list = getDependenciesSync();
  return list.find(d => d.id === id) || null;
};

export const saveDependency = async (dep: Omit<Dependency, 'id'> & { id?: string }): Promise<string> => {
  if (isMongoActive) {
    try {
      const mongooseDep = {
        id: dep.id,
        _id: dep.id,
        activo: dep.status !== 'Disponible',
        oculta: dep.oculta || false,
        interno: false,
        modalidad: dep.contact?.modalidad || 'presencial',
        nombre_dependencia: (dep.name || '').toLowerCase(),
        nombre_programa: dep.subCategory || '',
        objetivo: dep.objective || '',
        sector: dep.category?.includes('Gobierno') ? 'publico' : 'privado',
        vacantes: dep.vacancies,
        logo: dep.image || '',
        actividades: dep.activities || [],
        contacto: {
          correo: dep.contact?.email || '',
          nombre_titular: dep.contact?.titular || '',
          puesto_titular: dep.contact?.puesto_titular || '',
          responsable_del_programa: dep.contact?.responsable_del_programa || '',
          telefono: dep.contact?.phone || ''
        },
        horarios_servicio: {
          dias: dep.contact?.schedule?.split(',')[0]?.trim() || 'Lunes - Viernes',
          horas: dep.contact?.schedule?.split(',')[1]?.trim() || '9:00 AM - 4:00 PM'
        },
        ubicacion: {
          domicilio_dependencia: dep.contact?.address || dep.location || '',
          ubicacion_maps: dep.contact?.ubicacion_maps || ''
        }
      };

      const res = await fetch('/api/dependencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongooseDep)
      });
      const json = await res.json();
      if (json.success && json.data) {
        return json.data._id || json.data.id;
      }
    } catch (e) {
      console.warn("Error saving dependency to MongoDB, falling back: ", e);
    }
  }

  try {
    const list = getDependenciesSync();
    const docId = dep.id || `dep_${Date.now()}`;
    
    const existingIndex = list.findIndex(d => d.id === docId);
    
    const newDep: Dependency = {
      ...dep,
      id: docId,
      status: dep.vacancies > 4 ? 'Alta Disponibilidad' : (dep.vacancies > 0 ? 'Lugares Limitados' : 'Disponible')
    };

    if (existingIndex !== -1) {
      list[existingIndex] = newDep;
    } else {
      list.push(newDep);
    }

    saveDependenciesSync(list);
    return docId;
  } catch (error) {
    console.error("Local Storage save dependency error: ", error);
    throw error;
  }
};

export const deleteDependency = async (id: string): Promise<void> => {
  if (isMongoActive) {
    try {
      const res = await fetch(`/api/dependencias/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) return;
    } catch (e) {
      console.warn("Error deleting dependency from MongoDB, falling back: ", e);
    }
  }
  try {
    const list = getDependenciesSync();
    const filtered = list.filter(d => d.id !== id);
    saveDependenciesSync(filtered);
  } catch (error) {
    console.error("Local Storage delete dependency error: ", error);
  }
};

export const getAlumnosTecnologico = async (): Promise<any[]> => {
  if (isMongoActive) {
    try {
      const res = await fetch('/api/alumnos');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((student: any) => {
          const d = student.datos || {};
          const statusAcad = student.status_academico || {};
          const fullName = `${d.nombre || ''} ${d.apellido_paterno || ''} ${d.apellido_materno || ''}`.trim() || 'Estudiante';
          const aprobados = typeof statusAcad.creditos_aprobados === 'number' ? statusAcad.creditos_aprobados : 0;
          const totalCarrera = typeof statusAcad.creditos_total_carrera === 'number' ? statusAcad.creditos_total_carrera : 0;
          const computedProgress = totalCarrera > 0 ? Math.round((aprobados / totalCarrera) * 100) : 0;
          
          return {
            ...normalizeStudent({
              ...student,
              id: student._id || student.id,
              id_dependencia: student.id_dependencia?._id || student.id_dependencia || null,
              dependencia_seleccionada: student.id_dependencia?.nombre_dependencia?.toUpperCase() || ''
            }),
            id: student._id || student.id,
            name: fullName,
            control: d.no_control || student._id,
            career: statusAcad.carrera || 'INGENIERÍA EN SISTEMAS COMPUTACIONALES',
            status: student.apto ? 'Apto' : 'Pendiente Confirmación',
            progress: computedProgress,
            credits: statusAcad.creditos_complementarios || 0,
            date: 'Reciente',
            semester: statusAcad.semestre ? `${statusAcad.semestre}º Semestre` : '8vo Semestre'
          };
        });
      }
    } catch (e) {
      console.warn("Error getting Alumnos from MongoDB, falling back: ", e);
    }
  }
  try {
    const list = getAlumnosTecnologicoSync();
    return list.map(student => {
      const d = student.datos || {};
      const statusAcad = student.status_academico || {};
      
      const firstName = d.nombre || "";
      const p = d.apellido_paterno || "";
      const m = d.apellido_materno || "";
      const fullName = `${firstName} ${p} ${m}`.trim().replace(/\s+/g, " ") || 'Estudiante';
      
      const aprobados = typeof statusAcad.creditos_aprobados === 'number' ? statusAcad.creditos_aprobados : 0;
      const totalCarrera = typeof statusAcad.creditos_total_carrera === 'number' ? statusAcad.creditos_total_carrera : 0;
      let computedProgress = 0;
      if (totalCarrera > 0) {
        computedProgress = Math.round((aprobados / totalCarrera) * 100);
      } else if (typeof statusAcad.porcentaje_avance === 'number') {
        computedProgress = statusAcad.porcentaje_avance;
      }
      
      let compCredits = statusAcad.creditos_complementarios || 0;
      
      let formattedSemester = typeof statusAcad.semestre === 'number' ? `${statusAcad.semestre}º Semestre` : (statusAcad.semestre || '8vo Semestre');

      return {
        ...student,
        id: student.id,
        name: fullName,
        control: d.no_control || student.id,
        career: statusAcad.carrera || 'INGENIERÍA EN SISTEMAS COMPUTACIONALES',
        status: student.apto ? 'Apto' : 'Pendiente Confirmación',
        progress: computedProgress,
        credits: compCredits,
        date: 'Reciente',
        semester: formattedSemester
      };
    });
  } catch (error) {
    console.error("Local Storage list Alumnos error: ", error);
    return [];
  }
};

export const createTestAlumno = async (studentData?: {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  no_control: string;
  correo_institucional: string;
  carrera: string;
  semestre: number;
  creditos_aprobados: number;
  creditos_total_carrera: number;
  creditos_complementarios: number;
  sexo?: string;
  telefono?: string;
}): Promise<string> => {
  try {
    const randomId = `test_uid_${Math.random().toString(36).substring(2, 11)}`;
    const list = getAlumnosTecnologicoSync();

    const checkAprobados = studentData?.creditos_aprobados !== undefined ? studentData.creditos_aprobados : 210;
    const checkTotal = studentData?.creditos_total_carrera !== undefined ? studentData.creditos_total_carrera : 260;
    const checkCredits = studentData?.creditos_complementarios !== undefined ? studentData.creditos_complementarios : 5;
    const progressPerc = checkTotal > 0 ? (checkAprobados / checkTotal) : 0;
    
    const isApto = progressPerc >= 0.70 && checkCredits >= 5;

    const newStudent = {
      id: randomId,
      apto: isApto,
      datos: {
        nombre: studentData?.nombre || "Sofía",
        apellido_paterno: studentData?.apellido_paterno || "García",
        apellido_materno: studentData?.apellido_materno || "Ruiz",
        no_control: studentData?.no_control || `21530${Math.floor(100 + Math.random() * 900)}`,
        correo_institucional: studentData?.correo_institucional || "sofia.garcia@cancun.tecnm.mx",
        foto: studentData?.sexo === "Masculino" 
          ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        semestre: studentData?.semestre || 8,
        sexo: studentData?.sexo || "Femenino",
        genero: studentData?.sexo || "Femenino",
        telefono: studentData?.telefono || "9981234567",
        nss: "12345678901",
        fecha_nacimiento: "2003-04-18"
      },
      status_academico: {
        carrera: studentData?.carrera || "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
        semestre: studentData?.semestre || 8,
        creditos_aprobados: checkAprobados,
        creditos_total_carrera: checkTotal,
        creditos_complementarios: checkCredits
      },
      domicilio: {
        calle: "Av. Kabah Sm 62",
        colonia: "Centro",
        cp: "77500",
        ciudad: "Cancún",
        estado: "Quintana Roo"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    list.push(newStudent);
    saveAlumnosTecnologicoSync(list);
    return randomId;
  } catch (error) {
    console.error("Local Storage create test student error:", error);
    throw error;
  }
};

export const deleteAlumno = async (id: string): Promise<void> => {
  try {
    const list = getAlumnosTecnologicoSync();
    const filtered = list.filter(a => a.id !== id);
    saveAlumnosTecnologicoSync(filtered);
  } catch (error) {
    console.error("Local Storage delete student error:", error);
    throw error;
  }
};

export const selectDependencyForStudent = async (studentUid: string, dependency: Dependency): Promise<void> => {
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const prevDependencyId = student.id_dependencia?._id || student.id_dependencia || "";
        
        await updateAlumnoCompleto(studentUid, {
          id_dependencia: dependency.id,
          dependencia_seleccionada: dependency.name
        });

        // Alter vacancies in Mongo
        if (prevDependencyId && prevDependencyId !== dependency.id) {
          const prevDep = await getDependency(prevDependencyId);
          if (prevDep) {
            await saveDependency({
              ...prevDep,
              vacancies: prevDep.vacancies + 1
            });
          }
        }

        const targetDep = await getDependency(dependency.id);
        if (targetDep) {
          await saveDependency({
            ...targetDep,
            vacancies: Math.max(0, targetDep.vacancies - 1)
          });
        }
        
        notifyDbChanged();
        return;
      }
    } catch (e) {
      console.error("Error setting dependency in MongoDB: ", e);
    }
  }

  try {
    const students = getAlumnosTecnologicoSync();
    const dependencies = getDependenciesSync();
    
    let prevDependencyId = "";
    const updatedStudents = students.map(student => {
      if (student.id === studentUid) {
        prevDependencyId = student.id_dependencia || "";
        const originalDatos = student.datos || {};
        return {
          ...student,
          id_dependencia: dependency.id,
          dependencia_seleccionada: dependency.name,
          datos: {
            ...originalDatos,
            id_dependencia: dependency.id
          },
          updatedAt: new Date().toISOString()
        };
      }
      return student;
    });

    saveAlumnosTecnologicoSync(updatedStudents);

    // Adjust vacancies
    const updatedDeps = dependencies.map(dep => {
      let vacancies = dep.vacancies;
      if (dep.id === prevDependencyId && prevDependencyId && prevDependencyId !== dependency.id) {
        vacancies = vacancies + 1;
      }
      if (dep.id === dependency.id && prevDependencyId !== dependency.id) {
        vacancies = Math.max(0, vacancies - 1);
      }
      return {
        ...dep,
        vacancies,
        status: (vacancies > 4 ? 'Alta Disponibilidad' : (vacancies > 0 ? 'Lugares Limitados' : 'Disponible')) as any
      };
    });

    saveDependenciesSync(updatedDeps);
  } catch (error) {
    console.error("Local Storage select dependency error:", error);
    throw error;
  }
};

export const updateStudentDocumentValidation = async (
  studentUid: string, 
  docKey: string, 
  approved: boolean, 
  observaciones: string = ""
): Promise<void> => {
  if (isMongoActive) {
    try {
      const student = await getAlumnoCompleto(studentUid);
      if (student) {
        const currentDocData = student[docKey] || {};
        const updatePayload = {
          [docKey]: {
            ...currentDocData,
            estado_validacion: approved,
            observaciones: observaciones,
            fecha_validacion: new Date().toISOString()
          }
        };
        await updateAlumnoCompleto(studentUid, updatePayload);
        return;
      }
    } catch (e) {
      console.error("MongoDB document validation error: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        const currentDocData = student[docKey] || {};
        return {
          ...student,
          [docKey]: {
            ...currentDocData,
            estado_validacion: approved,
            observaciones: observaciones,
            fecha_validacion: new Date().toISOString()
          }
        };
      }
      return student;
    });
    
    saveAlumnosTecnologicoSync(updated);
  } catch (error) {
    console.error("Local Storage document validation error: ", error);
    throw error;
  }
};

export const saveAnexo17Datos = async (
  studentUid: string, 
  datos: any
): Promise<void> => {
  if (isMongoActive) {
    try {
      await updateAlumnoCompleto(studentUid, { anexo_17_datos: datos });
      return;
    } catch (e) {
      console.error("MongoDB save anexo 17 data error: ", e);
    }
  }

  try {
    const list = getAlumnosTecnologicoSync();
    const updated = list.map(student => {
      if (student.id === studentUid) {
        return {
          ...student,
          anexo_17_datos: datos,
          updatedAt: new Date().toISOString()
        };
      }
      return student;
    });
    saveAlumnosTecnologicoSync(updated);
  } catch (error) {
    console.error("Local Storage save anexo 17 data error: ", error);
    throw error;
  }
};

export const getAlumnoCompleto = async (studentUid: string): Promise<any | null> => {
  if (isMongoActive) {
    try {
      const res = await fetch(`/api/alumnos/${studentUid}`);
      const json = await res.json();
      if (json.success && json.data) {
        return normalizeStudent({
          ...json.data,
          id: json.data._id || json.data.id
        });
      }
    } catch (e) {
      console.warn("Error getting AlumnoCompleto from MongoDB, falling back: ", e);
    }
  }
  const list = getAlumnosTecnologicoSync();
  return list.find(s => s.id === studentUid) || null;
};

export const updateAlumnoCompleto = async (studentUid: string, data: Partial<any>): Promise<void> => {
  if (isMongoActive) {
    try {
      const res = await fetch(`/api/alumnos/${studentUid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        notifyDbChanged();
        return;
      }
    } catch (e) {
      console.warn("Error updating AlumnoCompleto on MongoDB, falling back: ", e);
    }
  }

  const list = getAlumnosTecnologicoSync();
  const updated = list.map(student => {
    if (student.id === studentUid) {
      return {
        ...student,
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
    return student;
  });
  saveAlumnosTecnologicoSync(updated);
};
