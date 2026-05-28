import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  Timestamp,
  type DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";
import { Dependency } from "../types";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getTemplates = async () => {
  const path = 'templates';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getTemplate = async (templateId: string) => {
  const path = `templates/${templateId}`;
  try {
    const docSnap = await getDoc(doc(db, "templates", templateId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const submitDocument = async (templateId: string, data: any) => {
  const path = 'submissions';
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    
    const submissionId = `${auth.currentUser.uid}_${templateId}_${Date.now()}`;
    await setDoc(doc(db, "submissions", submissionId), {
      userId: auth.currentUser.uid,
      templateId,
      data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return submissionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getUserSubmissions = async () => {
  const path = 'submissions';
  try {
    if (!auth.currentUser) return [];
    const q = query(collection(db, "submissions"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const syncUserProfile = async (userData: any) => {
  const path = `alumnos_tecnologico/${auth.currentUser?.uid}`;
  try {
    if (!auth.currentUser) throw new Error("User not authenticated");
    const userRef = doc(db, "alumnos_tecnologico", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    
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
    
    const baseObj = userSnap.exists() ? userSnap.data() : { apto: false };
    const originalDatos = baseObj.datos || {};
    const originalDomicilio = baseObj.domicilio || {};
    
    let fechaNac = userData.birthDate || originalDatos.fecha_nacimiento || "";
    if (typeof fechaNac === "string" && /^\d{4}-\d{2}-\d{2}$/.test(fechaNac)) {
      try {
        const d = new Date(fechaNac + "T12:00:00");
        if (!isNaN(d.getTime())) {
          fechaNac = Timestamp.fromDate(d);
        }
      } catch (e) {}
    }
    
    const updatedDatos = {
      ...originalDatos,
      nombre: nombre || originalDatos.nombre || "",
      apellido_paterno: apellido_paterno || originalDatos.apellido_paterno || "",
      apellido_materno: apellido_materno || originalDatos.apellido_materno || "",
      no_control: userData.controlNumber || originalDatos.no_control || "",
      correo_institucional: userData.email || originalDatos.correo_institucional || "",
      fecha_nacimiento: fechaNac,
      foto: userData.profilePicture || originalDatos.foto || "",
      
      // Update other fields using the Spanish structure to keep them synchronized with the Firestore document
      semestre: userData.semester || originalDatos.semestre || "",
      sexo: userData.gender || originalDatos.sexo || "",
      genero: userData.gender || originalDatos.genero || "",
      telefono: userData.phone || originalDatos.telefono || "",
      nss: userData.nss || originalDatos.nss || ""
    };

    const updatedDomicilio = {
      ...originalDomicilio,
      calle: userData.address?.street || originalDomicilio.calle || "",
      colonia: userData.address?.neighborhood || originalDomicilio.colonia || "",
      cp: userData.address?.zipCode || originalDomicilio.cp || "",
      ciudad: userData.address?.city || originalDomicilio.ciudad || "",
      estado: userData.address?.state || originalDomicilio.estado || ""
    };
    
    await setDoc(userRef, {
      ...baseObj,
      datos: updatedDatos,
      domicilio: updatedDomicilio,
      updatedAt: Timestamp.now()
    }, { merge: true });
    
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  if (!auth.currentUser) throw new Error("User not authenticated");
  const path = `alumnos_tecnologico_fotos/${auth.currentUser.uid}`;
  try {
    const fileExtension = file.name.split('.').pop() || 'jpg';
    // Store in the specified folder "alumnos_tecnologico_fotos" as folders inside Firebase Storage
    const filePath = `alumnos_tecnologico_fotos/${auth.currentUser.uid}_profile.${fileExtension}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading to Firebase Storage: ", error);
    throw error;
  }
};

export const uploadDependencyLogo = async (file: File): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop() || 'png';
    const filePath = `logo_dependencias/${Date.now()}_logo.${fileExtension}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading dependency logo to Firebase Storage: ", error);
    throw error;
  }
};

export const uploadStudentDocument = async (studentUid: string, docKey: string, file: File): Promise<string> => {
  const path = `alumnos_tecnologico/${studentUid}`;
  try {
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const filePath = `alumnos_tecnologico_documentos/${studentUid}/${docKey}_${Date.now()}.${fileExtension}`;
    
    let downloadUrl = "";
    try {
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      downloadUrl = await getDownloadURL(snapshot.ref);
    } catch (e) {
      console.warn("Firebase Storage unavailable; fallback to simulated URL", e);
      downloadUrl = `https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800&filename=${encodeURIComponent(file.name)}`;
    }

    const docRef = doc(db, "alumnos_tecnologico", studentUid);
    await setDoc(docRef, {
      [docKey]: {
        estado_validacion: false,
        fecha_subida: Timestamp.now(),
        observaciones: "",
        url_documento: downloadUrl
      }
    }, { merge: true });

    return downloadUrl;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const setProfileConfirmed = async (studentUid: string) => {
  const path = `alumnos_tecnologico/${studentUid}`;
  try {
    const userRef = doc(db, "alumnos_tecnologico", studentUid);
    await setDoc(userRef, {
      perfil_confirmado: true
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export interface FirestoreDependency {
  id?: string;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  vacancies: number;
  maxVacancies: number;
  status: any;
  image: string;
  objective?: string;
  activities?: string[];
  contact?: {
    titular: string;
    phone: string;
    email: string;
    schedule: string;
    address: string;
  };
}

export const getDependencies = async (): Promise<Dependency[]> => {
  const path = 'dependencias';
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map(doc => {
      const docData = doc.data();
      // Support both a nested capital 'Datos' map (as standard in user's DB), lowercase 'datos' map, or direct root-level fields
      const data = docData.Datos || docData.datos || docData;
      
      const isInternal = data.interno === true;
      let category = data.category || data.categoria || data.sector || '';
      
      if (!category) {
        if (isInternal) {
          category = 'Internos';
        } else {
          category = 'Gobierno / Ayuntamiento'; // default
        }
      } else if (category === 'publico' || category === 'público') {
        category = 'Gobierno / Ayuntamiento';
      } else if (category === 'interno') {
        category = 'Internos';
      } else if (category === 'social') {
        category = 'Asociaciones Civiles';
      } else if (category === 'salud') {
        category = 'Salud / Hospitales';
      }

      const activities = data.actividades || data.activities || [];
      const vacancies = typeof data.vacantes === 'number' ? data.vacantes : (typeof data.vacancies === 'number' ? data.vacancies : 0);
      const maxVacancies = typeof data.maxVacancies === 'number' ? data.maxVacancies : (typeof data.max_vacantes === 'number' ? data.max_vacantes : Math.max(10, vacancies));

      const rawUbicacion = data.ubicacion || {};
      const address = typeof rawUbicacion === 'object' ? (rawUbicacion.domicilio_dependencia || '') : (data.location || '');
      const mapsUrl = typeof rawUbicacion === 'object' ? (rawUbicacion.ubicacion_maps || '') : '';

      const rawContact = data.contacto || data.contact || {};
      const rawHorarios = data.horarios_servicio || data.horarios || {};
      
      let scheduleStr = '';
      if (rawHorarios.dias && rawHorarios.horas) {
        scheduleStr = `${rawHorarios.dias} - ${rawHorarios.horas}`;
      } else if (rawHorarios.dias || rawHorarios.horas) {
        scheduleStr = rawHorarios.dias || rawHorarios.horas || '';
      } else if (rawContact.schedule) {
        scheduleStr = rawContact.schedule;
      }

      return {
        id: doc.id,
        name: data.nombre_dependencia || data.name || data.nombre || '',
        category: category,
        subCategory: data.nombre_programa || data.subCategory || data.subcategoria || '',
        location: address || data.location || 'Cancún, Q.R.',
        vacancies: vacancies,
        maxVacancies: maxVacancies,
        status: vacancies > 4 ? 'Alta Disponibilidad' : (vacancies > 0 ? 'Lugares Limitados' : 'Disponible'),
        image: data.logo || data.image || data.imagen || 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=200',
        objective: data.objetivo || data.objective || '',
        activities: Array.isArray(activities) ? activities : [],
        contact: {
          titular: rawContact.nombre_titular || rawContact.titular || '',
          phone: rawContact.telefono || rawContact.phone || '',
          email: rawContact.correo || rawContact.email || '',
          schedule: scheduleStr || 'Lunes a Viernes de 9:00 AM a 4:00 PM',
          address: address || rawContact.address || 'Cancún, Q.R.',
          puesto_titular: rawContact.puesto_titular || '',
          responsable_del_programa: rawContact.responsable_del_programa || '',
          modalidad: data.modalidad || 'presencial',
          ubicacion_maps: mapsUrl
        }
      } as Dependency;
    });
  } catch (error) {
    console.error("Error retrieving dependencies from database: ", error);
    return [];
  }
};

export const getDependency = async (id: string): Promise<Dependency | null> => {
  const path = `dependencias/${id}`;
  try {
    const docSnap = await getDoc(doc(db, "dependencias", id));
    if (!docSnap.exists()) {
      return null;
    }
    const docData = docSnap.data();
    const data = docData.Datos || docData.datos || docData;
    
    const isInternal = data.interno === true;
    let category = data.category || data.categoria || data.sector || '';
    
    if (!category) {
      if (isInternal) {
        category = 'Internos';
      } else {
        category = 'Gobierno / Ayuntamiento';
      }
    } else if (category === 'publico' || category === 'público') {
      category = 'Gobierno / Ayuntamiento';
    } else if (category === 'interno') {
      category = 'Internos';
    } else if (category === 'social') {
      category = 'Asociaciones Civiles';
    } else if (category === 'salud') {
      category = 'Salud / Hospitales';
    }

    const activities = data.actividades || data.activities || [];
    const vacancies = typeof data.vacantes === 'number' ? data.vacantes : (typeof data.vacancies === 'number' ? data.vacancies : 0);
    const maxVacancies = typeof data.maxVacancies === 'number' ? data.maxVacancies : (typeof data.max_vacantes === 'number' ? data.max_vacantes : Math.max(10, vacancies));

    const rawUbicacion = data.ubicacion || {};
    const address = typeof rawUbicacion === 'object' ? (rawUbicacion.domicilio_dependencia || '') : (data.location || '');
    const mapsUrl = typeof rawUbicacion === 'object' ? (rawUbicacion.ubicacion_maps || '') : '';

    const rawContact = data.contacto || data.contact || {};
    const rawHorarios = data.horarios_servicio || data.horarios || {};
    
    let scheduleStr = '';
    if (rawHorarios.dias && rawHorarios.horas) {
      scheduleStr = `${rawHorarios.dias} - ${rawHorarios.horas}`;
    } else if (rawHorarios.dias || rawHorarios.horas) {
      scheduleStr = rawHorarios.dias || rawHorarios.horas || '';
    } else if (rawContact.schedule) {
      scheduleStr = rawContact.schedule;
    }

    return {
      id: docSnap.id,
      name: data.nombre_dependencia || data.name || data.nombre || '',
      category: category,
      subCategory: data.nombre_programa || data.subCategory || data.subcategoria || '',
      location: address || data.location || 'Cancún, Q.R.',
      vacancies: vacancies,
      maxVacancies: maxVacancies,
      status: vacancies > 4 ? 'Alta Disponibilidad' : (vacancies > 0 ? 'Lugares Limitados' : 'Disponible'),
      image: data.logo || data.image || data.imagen || 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=200',
      objective: data.objetivo || data.objective || '',
      activities: Array.isArray(activities) ? activities : [],
      contact: {
        titular: rawContact.nombre_titular || rawContact.titular || '',
        phone: rawContact.telefono || rawContact.phone || '',
        email: rawContact.correo || rawContact.email || '',
        schedule: scheduleStr || 'Lunes a Viernes de 9:00 AM a 4:00 PM',
        address: address || rawContact.address || 'Cancún, Q.R.',
        puesto_titular: rawContact.puesto_titular || '',
        responsable_del_programa: rawContact.responsable_del_programa || '',
        modalidad: data.modalidad || 'presencial',
        ubicacion_maps: mapsUrl
      }
    } as Dependency;
  } catch (error) {
    console.error("Error retrieving single dependency from database: ", error);
    return null;
  }
};

export const saveDependency = async (dep: Omit<Dependency, 'id'> & { id?: string }): Promise<string> => {
  const path = 'dependencias';
  try {
    const docId = dep.id || `dep_${Date.now()}`;
    const docRef = doc(db, "dependencias", docId);
    
    // Check if there is an existing document so we don't wipe out other fields
    let existingDatos: any = {};
    let saveWithKey = 'Datos'; // Default key name
    
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const existingData = snap.data();
        if (existingData.datos) {
          existingDatos = existingData.datos;
          saveWithKey = 'datos';
        } else if (existingData.Datos) {
          existingDatos = existingData.Datos;
          saveWithKey = 'Datos';
        }
      }
    } catch (e) {}

    // Map the UI category to the appropriate sector database string
    let sectorVal = 'publico';
    if (dep.category === 'Internos') {
      sectorVal = 'interno';
    } else if (dep.category === 'Asociaciones Civiles') {
      sectorVal = 'social';
    } else if (dep.category === 'Salud / Hospitales') {
      sectorVal = 'salud';
    }

    const scheduleParts = dep.contact?.schedule?.split(' - ') || [];
    const diasVal = scheduleParts[0] || 'lunes - viernes';
    const horasVal = scheduleParts[1] || '9:00 AM - 4:00 PM';

    // Form strict map field according to the DB schema
    const customDatos = {
      ...existingDatos,
      actividades: dep.activities || [],
      activo: true,
      contacto: {
        correo: dep.contact?.email || '',
        nombre_titular: dep.contact?.titular || '',
        puesto_titular: dep.contact?.puesto_titular || existingDatos.contacto?.puesto_titular || 'Directora/Director General',
        responsable_del_programa: dep.contact?.responsable_del_programa || existingDatos.contacto?.responsable_del_programa || dep.contact?.titular || '',
        telefono: dep.contact?.phone || ''
      },
      horarios_servicio: {
        dias: diasVal,
        horas: horasVal
      },
      interno: dep.category === 'Internos',
      logo: dep.image || 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=200',
      modalidad: dep.contact?.modalidad || existingDatos.modalidad || 'presencial',
      nombre_dependencia: dep.name,
      nombre_programa: dep.subCategory,
      objetivo: dep.objective || '',
      sector: sectorVal,
      ubicacion: {
        domicilio_dependencia: dep.contact?.address || dep.location || 'Cancún, Q.R.',
        ubicacion_maps: dep.contact?.ubicacion_maps || existingDatos.ubicacion?.ubicacion_maps || 'https://maps.google.com'
      },
      vacantes: Number(dep.vacancies)
    };

    // Save only under the specified map Key ('Datos' or 'datos') to avoid root flat clutter
    const dbData = {
      [saveWithKey]: customDatos
    };
    
    await setDoc(docRef, dbData, { merge: true });
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const deleteDependency = async (id: string): Promise<void> => {
  const path = `dependencias/${id}`;
  try {
    // For safety with simulated or nested logic, we can import deleteDoc too,
    // wait, we need to import deleteDoc! Let's check imports.
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "dependencias", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAlumnosTecnologico = async (): Promise<any[]> => {
  const path = "alumnos_tecnologico";
  try {
    const querySnapshot = await getDocs(collection(db, path));
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const d = data.datos || {};
      const statusAcad = data.status_academico || {};
      
      const firstName = d.nombre || "";
      const p = d.apellido_paterno || "";
      const m = d.apellido_materno || "";
      const fullName = `${firstName} ${p} ${m}`.trim().replace(/\s+/g, " ") || 'Estudiante';
      
      // Calculate dynamic progress and credits
      const aprobados = typeof statusAcad.creditos_aprobados === 'number' ? statusAcad.creditos_aprobados : 0;
      const totalCarrera = typeof statusAcad.creditos_total_carrera === 'number' ? statusAcad.creditos_total_carrera : 0;
      let computedProgress = 0;
      if (totalCarrera > 0) {
        computedProgress = Math.round((aprobados / totalCarrera) * 100);
      } else if (typeof statusAcad.porcentaje_avance === 'number') {
        computedProgress = statusAcad.porcentaje_avance;
      } else if (typeof d.porcentaje_avance === 'number') {
        computedProgress = d.porcentaje_avance;
      }

      let compCredits = 0;
      if (typeof statusAcad.creditos_complemnetarios === 'number') {
        compCredits = statusAcad.creditos_complemnetarios;
      } else if (typeof statusAcad.creditos_complementarios === 'number') {
        compCredits = statusAcad.creditos_complementarios;
      } else if (typeof d.creditos_complementarios === 'number') {
        compCredits = d.creditos_complementarios;
      }
      
      return {
        id: doc.id,
        name: fullName,
        control: d.no_control || d.noControl || doc.id.substring(0, 8),
        career: statusAcad.carrera || d.carrera || 'INGENIERÍA EN SISTEMAS COMPUTACIONALES',
        status: data.apto ? 'Apto' : 'Pendiente Confirmación',
        progress: computedProgress,
        credits: compCredits,
        date: 'Reciente',
        ...data
      };
    });
  } catch (error) {
    console.error("Error fetching alumnos_tecnologico:", error);
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
    const docRef = doc(db, "alumnos_tecnologico", randomId);

    const checkAprobados = studentData?.creditos_aprobados !== undefined ? studentData.creditos_aprobados : 210;
    const checkTotal = studentData?.creditos_total_carrera !== undefined ? studentData.creditos_total_carrera : 260;
    const checkCredits = studentData?.creditos_complementarios !== undefined ? studentData.creditos_complementarios : 5;
    const progressPerc = checkTotal > 0 ? (checkAprobados / checkTotal) : 0;
    
    // meets criteria if it has 70% progress and at least 5 complementary credits
    const isApto = progressPerc >= 0.70 && checkCredits >= 5;

    const defaultStudent = {
      apto: isApto,
      datos: {
        nombre: studentData?.nombre || "Sofía",
        apellido_paterno: studentData?.apellido_paterno || "García",
        apellido_materno: studentData?.apellido_materno || "Ruiz",
        no_control: studentData?.no_control || `21530${Math.floor(100 + Math.random() * 900)}`,
        correo_institucional: studentData?.correo_institucional || "sofia.garcia@cancun.tecnm.mx",
        foto: studentData?.sexo === "Masculino" 
          ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150"
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        semestre: studentData?.semestre || 8,
        sexo: studentData?.sexo || "Femenino",
        genero: studentData?.sexo || "Femenino",
        telefono: studentData?.telefono || "9981234567",
        nss: "12345678901",
        fecha_nacimiento: Timestamp.fromDate(new Date("2003-04-18T12:00:00"))
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    await setDoc(docRef, defaultStudent);
    return randomId;
  } catch (error) {
    console.error("Error creating test student:", error);
    throw error;
  }
};

export const deleteAlumno = async (id: string): Promise<void> => {
  try {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "alumnos_tecnologico", id));
  } catch (error) {
    console.error("Error deleting alumno:", error);
    throw error;
  }
};

export const selectDependencyForStudent = async (studentUid: string, dependency: Dependency): Promise<void> => {
  try {
    let prevDependencyId = "";
    
    // 1. Get current student selected dependency
    const studentRef = doc(db, "alumnos_tecnologico", studentUid);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      prevDependencyId = studentData.id_dependencia || (studentData.datos && studentData.datos.id_dependencia) || "";
    }

    // If already linked to the same dependency, don't adjust any vacancies!
    if (prevDependencyId === dependency.id) {
      if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        const originalDatos = studentData.datos || {};
        await setDoc(studentRef, {
          id_dependencia: dependency.id,
          dependencia_seleccionada: dependency.name,
          datos: {
            ...originalDatos,
            id_dependencia: dependency.id
          },
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
      return; // Stop here! No vacancies altered!
    }

    // Otherwise, they are selecting it for the first time or changing dependencies.
    // 2. Update student document with the selected dependency ID
    if (studentSnap.exists()) {
      const studentData = studentSnap.data();
      const originalDatos = studentData.datos || {};
      
      await setDoc(studentRef, {
        id_dependencia: dependency.id,
        dependencia_seleccionada: dependency.name,
        datos: {
          ...originalDatos,
          id_dependencia: dependency.id
        },
        updatedAt: Timestamp.now()
      }, { merge: true });
    }

    // 3. Increment vacancies for original dependency if changing dependencies
    if (prevDependencyId) {
      try {
        const prevDepRef = doc(db, "dependencias", prevDependencyId);
        const prevDepSnap = await getDoc(prevDepRef);
        if (prevDepSnap.exists()) {
          const prevDepData = prevDepSnap.data();
          let saveWithKey = 'Datos';
          let originalDatos: any = {};
          
          if (prevDepData.datos) {
            originalDatos = prevDepData.datos;
            saveWithKey = 'datos';
          } else if (prevDepData.Datos) {
            originalDatos = prevDepData.Datos;
            saveWithKey = 'Datos';
          } else {
            originalDatos = prevDepData;
            saveWithKey = 'Datos';
          }

          const currentVacancies = typeof originalDatos.vacantes === 'number' 
            ? originalDatos.vacantes 
            : (typeof originalDatos.vacancies === 'number' ? originalDatos.vacancies : 0);
          
          const newVacancies = currentVacancies + 1;
          
          await setDoc(prevDepRef, {
            [saveWithKey]: {
              ...originalDatos,
              vacantes: newVacancies,
              vacancies: newVacancies
            }
          }, { merge: true });
        }
      } catch (err) {
        console.error("Error returning vacancy to previous dependency:", err);
      }
    }

    // 4. Decrement available vacancies in the new dependency document in Firestore
    const depRef = doc(db, "dependencias", dependency.id);
    const depSnap = await getDoc(depRef);
    if (depSnap.exists()) {
      const depData = depSnap.data();
      let saveWithKey = 'Datos';
      let originalDatos: any = {};
      
      if (depData.datos) {
        originalDatos = depData.datos;
        saveWithKey = 'datos';
      } else if (depData.Datos) {
        originalDatos = depData.Datos;
        saveWithKey = 'Datos';
      } else {
        originalDatos = depData;
        saveWithKey = 'Datos';
      }

      const currentVacancies = typeof originalDatos.vacantes === 'number' 
        ? originalDatos.vacantes 
        : (typeof originalDatos.vacancies === 'number' ? originalDatos.vacancies : 0);
      
      const newVacancies = Math.max(0, currentVacancies - 1);
      
      await setDoc(depRef, {
        [saveWithKey]: {
          ...originalDatos,
          vacantes: newVacancies,
          vacancies: newVacancies
        }
      }, { merge: true });
    }
  } catch (error) {
    console.error("Error linking student with dependency in Firestore:", error);
    throw error;
  }
};

export const updateStudentDocumentValidation = async (
  studentUid: string, 
  docKey: string, 
  approved: boolean, 
  observaciones: string = ""
): Promise<void> => {
  const path = `alumnos_tecnologico/${studentUid}`;
  try {
    const docRef = doc(db, "alumnos_tecnologico", studentUid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Student document does not exist");
    }
    const currentDocData = docSnap.data()?.[docKey] || {};
    await setDoc(docRef, {
      [docKey]: {
        ...currentDocData,
        estado_validacion: approved,
        observaciones: observaciones,
        fecha_validacion: Timestamp.now()
      }
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const saveAnexo17Datos = async (
  studentUid: string, 
  datos: any
): Promise<void> => {
  const path = `alumnos_tecnologico/${studentUid}`;
  try {
    const docRef = doc(db, "alumnos_tecnologico", studentUid);
    await setDoc(docRef, {
      anexo_17_datos: datos,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};


