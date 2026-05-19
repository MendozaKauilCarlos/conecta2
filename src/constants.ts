
import { Dependency, UserData } from './types';

export const MOCK_USERS: Record<string, UserData> = {
  admin: { 
    id: '1', 
    name: 'Administrador Conecta2', 
    role: 'admin',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  student1: { 
    id: '2', 
    name: 'Carlos Mendoza', 
    role: 'student', 
    controlNumber: '21530321', 
    academicStats: {
      careerProgress: 65, 
      complementaryCredits: 3 
    },
    address: {
      street: 'Calle Majahua',
      neighborhood: 'Prado Norte',
      city: 'Cancún',
      state: 'Quintana Roo',
      zipCode: '77539'
    },
    gender: 'Masculino',
    profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
    phone: '(998) 123-4567',
    email: '21530321@cancun.tecnm.mx',
    birthDate: '2000-05-15',
    semester: '8vo Semestre',
    career: 'Ingeniería en Sistemas Computacionales',
    nss: '12345678901'
  },
  student2: { 
    id: '3', 
    name: 'Ana Sofía López', 
    role: 'student', 
    controlNumber: '19530001', 
    academicStats: {
      careerProgress: 85,
      complementaryCredits: 6
    },
    address: {
      street: 'Av. Las Américas, Mz 14, Lote 3',
      neighborhood: 'Residencial Las Américas',
      city: 'Cancún',
      state: 'Quintana Roo',
      zipCode: '77500'
    },
    gender: 'Femenino',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    phone: '(998) 987-6543',
    email: '19530001@cancun.tecnm.mx',
    birthDate: '1999-10-22',
    semester: '9no Semestre',
    career: 'Arquitectura',
    nss: '98765432109'
  }
};

export const DEPENDENCIES: Dependency[] = [
  {
    id: '1',
    name: 'Secretaría de Educación',
    category: 'Gobierno / Ayuntamiento',
    subCategory: 'Educación y Cultura',
    location: 'Centro Histórico',
    vacancies: 12,
    maxVacancies: 15,
    status: 'Alta Disponibilidad',
    image: 'https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=200',
    objective: 'Apoyar en la gestión de programas educativos y alfabetización en zonas vulnerables del municipio, promoviendo el desarrollo integral de los estudiantes.',
    activities: [
      'Captura y análisis de datos de aprovechamiento escolar.',
      'Apoyo logístico en eventos culturales y ferias de ciencias.',
      'Atención a padres de familia en ventanilla de servicios.',
      'Elaboración de material didáctico digital.'
    ],
    contact: {
      titular: 'Lic. María Fernanda López',
      phone: '(998) 123-4567 ext. 102',
      email: 'vinculacion@seducacion.gob.mx',
      schedule: 'Lunes a Viernes, 09:00 AM - 01:00 PM',
      address: 'Av. Tulum Sur, Mz 5, Lote 2, Centro Histórico, 77500 Cancún, Q.R.'
    }
  },
  {
    id: '2',
    name: 'Hospital General de Cancún',
    category: 'Salud / Hospitales',
    subCategory: 'Atención Médica y Social',
    location: 'Región 251',
    vacancies: 5,
    maxVacancies: 10,
    status: 'Disponibilidad Media',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=200',
    objective: 'Brindar apoyo en las áreas administrativas y de atención al paciente, facilitando los procesos de ingreso y gestión de expedientes.',
    activities: [
      'Organización de expedientes clínicos.',
      'Apoyo en la recepción de pacientes.',
      'Gestión de citas y turnos.',
      'Auxilio en campañas de salud comunitaria.'
    ],
    contact: {
      titular: 'Dr. Roberto Méndez',
      phone: '(998) 765-4321',
      email: 'rrhh@hospitalgeneral.qroo.gob.mx',
      schedule: 'Lunes a Viernes, 08:00 AM - 02:00 PM',
      address: 'Av. Arco Norte, Mz 10, Lote 1, Región 251, 77539 Cancún, Q.R.'
    }
  },
  {
    id: '3',
    name: 'Fiscalía General del Estado',
    category: 'Justicia / Fiscalías',
    subCategory: 'Jurídico y Administrativo',
    location: 'Zona Industrial',
    vacancies: 8,
    maxVacancies: 20,
    status: 'Alta Disponibilidad',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200',
    objective: 'Colaborar en las áreas jurídicas para el seguimiento de expedientes y apoyo en la digitalización de documentos oficiales.',
    activities: [
      'Digitalización de carpetas de investigación.',
      'Apoyo en la redacción de oficios administrativos.',
      'Organización de archivo jurídico.',
      'Asistencia en la atención ciudadana.'
    ],
    contact: {
      titular: 'Lic. Alejandro Ruiz',
      phone: '(998) 999-8888',
      email: 'servicio.social@fge.qroo.gob.mx',
      schedule: 'Lunes a Viernes, 09:00 AM - 03:00 PM',
      address: 'Av. Xcaret, Mz 2, Lote 3, Supermanzana 21, 77500 Cancún, Q.R.'
    }
  }
];

export const REQUIREMENTS = {
  minProgress: 70,
  minCredits: 5
};
