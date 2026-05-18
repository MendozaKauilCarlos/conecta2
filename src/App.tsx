/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight, 
  AlertCircle, 
  AlertTriangle,
  User, 
  Lock, 
  Eye, 
  EyeOff,
  Quote,
  Loader2,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Scale,
  ShieldCheck,
  XCircle,
  X,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Info,
  Building2,
  HeartPulse,
  Gavel,
  Globe,
  Briefcase,
  Menu,
  History,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileEdit,
  PenLine,
  Check,
  HelpCircle,
  Key,
  Trash2,
  FileCheck,
  MessageSquare,
  FileSignature,
  Edit,
  Bot,
  Moon,
  Sun,
  Download,
  Upload,
  Lightbulb
} from 'lucide-react';
import { FirebaseProvider, useFirebase } from './components/FirebaseProvider';
import { signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth as firebaseAuth } from './lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import * as dbService from './services/dbService';
import { ChatBot } from './components/ChatBot';

// --- Types ---
type UserRole = 'admin' | 'student';

interface AcademicStats {
  careerProgress: number; // Percentage
  complementaryCredits: number; // Count
}

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UserData {
  id: string;
  name: string;
  role: UserRole;
  controlNumber?: string;
  academicStats?: AcademicStats;
  address?: AddressData;
  gender?: string;
  profilePicture?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  semester?: string;
  career?: string;
  nss?: string;
}

// --- Shared Components ---
const ThemeToggle = ({ isDarkMode, onToggle }: { isDarkMode: boolean; onToggle: () => void }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={`p-3 rounded-2xl transition-all duration-300 border-2 ${
        isDarkMode 
          ? 'bg-[#1a2333]/80 border-[#2d3a54] text-brand-teal shadow-[0_0_15px_rgba(0,191,165,0.2)]' 
          : 'bg-white border-neutral-100 text-brand-blue shadow-lg shadow-neutral-100/50'
      }`}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};

// --- Components ---
const Logo = ({ dark = false, isDarkMode = false, showText = true, className = "", size = "normal" }: { dark?: boolean; isDarkMode?: boolean; showText?: boolean; className?: string; size?: "normal" | "small" }) => {
  const isSmall = size === "small";
  const iconSize = isSmall ? "w-8 h-8" : "w-10 h-10";
  const borderSize = isSmall ? "border-[2.5px]" : "border-[3.5px]";
  const dotSize = isSmall ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = isSmall ? "text-lg md:text-xl" : "text-2xl md:text-3xl";

  const isLightOnDark = dark || isDarkMode;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-4 ${className}`}
    >
      <div className={`relative ${iconSize} flex items-center justify-center shrink-0`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 ${borderSize} border-l-transparent border-t-transparent rounded-full ${isLightOnDark ? 'border-brand-teal' : 'border-brand-blue'} opacity-30`}
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 ${borderSize} border-r-transparent border-b-transparent rounded-full ${isLightOnDark ? 'border-brand-teal' : 'border-brand-blue'}`}
        />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute -top-1 -right-1 ${dotSize} bg-brand-teal rounded-full border-2 ${isLightOnDark ? 'border-[#0a0f18]' : 'border-white'} z-20 shadow-[0_0_10px_rgba(0,191,165,0.5)]`} 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className={`absolute -bottom-1 -right-1 ${dotSize} bg-brand-orange rounded-full border-2 ${isLightOnDark ? 'border-[#0a0f18]' : 'border-white'} z-20 shadow-[0_0_10px_rgba(255,152,0,0.5)]`} 
        />
        
        <div className="flex flex-col gap-0.5 z-10">
          <FileText size={isSmall ? 10 : 16} className={isLightOnDark ? 'text-white' : 'text-brand-blue'} strokeWidth={3} />
          <FileText size={isSmall ? 10 : 16} className={isLightOnDark ? 'text-white' : 'text-brand-blue'} strokeWidth={3} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSize} font-black tracking-tight leading-none ${isLightOnDark ? 'text-white' : 'text-brand-blue'}`}>
            Conecta<span className="text-brand-teal">2</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[2px] w-4 bg-brand-orange"></span>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isLightOnDark ? 'text-white/60' : 'text-neutral-400'}`}>Portal Alumno</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface Dependency {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  vacancies: number;
  maxVacancies: number;
  status: 'Alta Disponibilidad' | 'Lugares Limitados' | 'Disponible' | 'Últimos Lugares' | 'Pocos Lugares' | 'Disponibilidad Media';
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

// --- Mock Data ---
const MOCK_USERS = {
  admin: { 
    id: '1', 
    name: 'Administrador Conecta2', 
    role: 'admin' as const,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  student1: { 
    id: '2', 
    name: 'Carlos Mendoza', 
    role: 'student' as const, 
    controlNumber: '21530321', 
    academicStats: {
      careerProgress: 65, // Below 70%
      complementaryCredits: 3 // Below 5
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
    role: 'student' as const, 
    controlNumber: '19530001', 
    academicStats: {
      careerProgress: 85, // Meets requirements
      complementaryCredits: 6 // Meets requirements
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

const DEPENDENCIES: Dependency[] = [
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

const REQUIREMENTS = {
  minProgress: 70,
  minCredits: 5
};

export default function App() {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebase();
  const [user, setUser] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [tempUser, setTempUser] = useState<UserData | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to automatically log in the user if already authenticated via Firebase
  useEffect(() => {
    if (firebaseUser && !user) {
      const fetchProfile = async () => {
        try {
          const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              ...MOCK_USERS.student2, // Use as base for stats if needed
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'Usuario',
              role: data.role || 'student',
              email: firebaseUser.email || undefined,
              ...data
            });
            setSelectedInstitution('itcancun'); // Default to ITC if logged via Google
          } else {
            // Default student if no firestore profile yet
            setUser({
              ...MOCK_USERS.student2,
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Estudiante',
              email: firebaseUser.email || undefined,
            });
            setSelectedInstitution('itcancun');
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      };
      fetchProfile();
    }
  }, [firebaseUser, user]);

  const handleLogin = (userData: UserData) => {
    setTempUser(userData);
    setIsVerifying(true);
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerifying(false);
    if (success) {
      setUser(tempUser);
    } else {
      setShowRequirements(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTempUser(null);
    setSelectedInstitution(null);
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-[#0a0f18]' : 'bg-white'} min-h-screen transition-colors duration-500 selection:bg-brand-teal/30`}>
      <AnimatePresence mode="wait">
        {!selectedInstitution && (
          <LandingPage 
            onSelect={(inst) => setSelectedInstitution(inst)} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          />
        )}

        {selectedInstitution && !user && !isVerifying && !showRequirements && (
          <LoginPage 
            onLogin={handleLogin} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            onBack={() => setSelectedInstitution(null)}
            institutionId={selectedInstitution}
          />
        )}
        
        {isVerifying && tempUser && (
          <VerificationModal 
            user={tempUser} 
            onComplete={handleVerificationComplete} 
            isDarkMode={isDarkMode}
          />
        )}

        {showRequirements && tempUser && (
          <RequirementsModal 
            user={tempUser} 
            onClose={() => setShowRequirements(false)} 
          />
        )}

        {user && !isVerifying && (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onUpdateProfile={setUser} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        )}
      </AnimatePresence>
      <ChatBot isDarkMode={isDarkMode} />
    </div>
  );
}

// --- Verification Modal ---
function VerificationModal({ user, onComplete, isDarkMode }: { user: UserData, onComplete: (success: boolean) => void, isDarkMode?: boolean }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Verificando identidad",
    "Evaluando avance académico",
    "Revisando créditos complementarios",
    "Buscando vacantes"
  ];

  const meetsRequirements = user.role === 'admin' || (
    (user.academicStats?.careerProgress ?? 0) >= REQUIREMENTS.minProgress &&
    (user.academicStats?.complementaryCredits ?? 0) >= REQUIREMENTS.minCredits
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(() => onComplete(meetsRequirements), 800);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/20 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-sm w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48" cy="48" r="44"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-neutral-50"
            />
            <motion.circle
              cx="48" cy="48" r="44"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={276}
              initial={{ strokeDashoffset: 276 }}
              animate={{ strokeDashoffset: 276 - (276 * (step + 1)) / steps.length }}
              className="text-brand-teal"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-brand-blue mb-2 tracking-tight">¡Hola de nuevo!</h3>
        <p className="text-neutral-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Estamos preparando tu acceso</p>

        <div className="space-y-4 text-left max-w-[240px] mx-auto">
          {steps.map((s, i) => {
            const isDone = i < step;
            const isCurrent = i === step;
            const isFailed = !meetsRequirements && user.role !== 'admin' && i > 0 && i <= step;

            return (
              <div key={s} className={`flex items-center gap-4 transition-all ${i > step ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                {isDone ? (
                  isFailed ? (
                    <XCircle className="w-5 h-5 text-brand-orange" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                  )
                ) : isCurrent ? (
                  isFailed ? (
                    <XCircle className="w-5 h-5 text-brand-orange" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-brand-teal animate-spin" />
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-100 shrink-0" />
                )}
                <span className={`text-sm font-black tracking-tight ${isCurrent ? 'text-brand-blue' : isFailed ? 'text-brand-orange' : 'text-neutral-300'}`}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// --- Requirements Modal ---
function RequirementsModal({ user, onClose }: { user: UserData, onClose: () => void }) {
  const stats = user.academicStats!;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 text-neutral-300 hover:text-brand-orange hover:bg-brand-orange/5 rounded-full transition-all"
        >
          <X size={24} />
        </button>

        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-orange/20">
            <AlertCircle className="w-10 h-10 text-brand-orange" />
          </div>

          <h3 className="text-3xl font-black text-brand-blue mb-4 tracking-tighter">Requisitos incompletos</h3>
          <p className="text-neutral-500 font-medium leading-relaxed mb-10">
            Hola <span className="font-bold text-brand-blue">{user.name.split(' ')[0]}</span>, para iniciar tu proceso necesitas cumplir con los lineamientos académicos:
          </p>

          <div className="bg-neutral-50 rounded-[2rem] p-8 space-y-8 text-left border border-neutral-100 shadow-inner">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3 text-brand-blue">
                  <XCircle size={16} className="text-brand-orange" />
                  <span>Avance de Carrera</span>
                </div>
                <span className="text-brand-orange">{stats.careerProgress}% <span className="text-neutral-300">/ {REQUIREMENTS.minProgress}%</span></span>
              </div>
              <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.careerProgress}%` }}
                  className="h-full bg-brand-orange rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3 text-brand-blue">
                  <XCircle size={16} className="text-brand-orange" />
                  <span>Créditos Complementarios</span>
                </div>
                <span className="text-brand-orange">{stats.complementaryCredits} <span className="text-neutral-300">/ {REQUIREMENTS.minCredits}</span></span>
              </div>
              <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.complementaryCredits / REQUIREMENTS.minCredits) * 100}%` }}
                  className="h-full bg-brand-orange rounded-full"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-[#162a45] transition-all active:scale-95 shadow-xl shadow-brand-blue/20"
          >
            Entendido, volver
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Landing Page Component ---
function LandingPage({ onSelect, isDarkMode, onToggleDarkMode }: { onSelect: (inst: string) => void, isDarkMode: boolean, onToggleDarkMode: () => void }) {
  const institutions = [
    {
      id: 'itcancun',
      name: 'Instituto Tecnológico de Cancún',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
      id: 'utcancun',
      name: 'Universidad Tecnológica de Cancún',
      image: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3f0?auto=format&fit=crop&q=80&w=400&h=300'
    },
    {
      id: 'ucaribe',
      name: 'Universidad del Caribe',
      image: 'https://images.unsplash.com/photo-1523050335456-c38a89b7028e?auto=format&fit=crop&q=80&w=400&h=300'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col items-center py-20 px-4 transition-colors duration-500 overflow-x-hidden ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-[#f0f4f8] text-neutral-900'}`}
    >
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <Logo isDarkMode={isDarkMode} size="normal" showText={true} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
            Portal de Vinculación Profesional
          </h1>
          <p className={`text-lg font-medium max-w-2xl mx-auto ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Accede al sistema integral de gestión de servicio social y prácticas profesionales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {institutions.map((inst, index) => (
            <motion.div
              key={inst.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => onSelect(inst.id)}
              className={`cursor-pointer group flex flex-col rounded-3xl border transition-all duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-[#121926] border-neutral-800 hover:border-brand-teal' 
                  : 'bg-white border-neutral-200 hover:border-brand-blue shadow-lg'
              }`}
            >
              <div className="h-40 overflow-hidden relative">
                <img src={inst.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={inst.name} />
                <div className={`absolute inset-0 transition-opacity group-hover:opacity-60 ${isDarkMode ? 'bg-black/40' : 'bg-brand-blue/20'}`}></div>
              </div>
              <div className="p-6 text-center">
                <h3 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{inst.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- Login Component ---
function LoginPage({ 
  onLogin, 
  isDarkMode, 
  onToggleDarkMode, 
  onBack, 
  institutionId 
}: { 
  onLogin: (u: UserData) => void, 
  isDarkMode: boolean, 
  onToggleDarkMode: () => void, 
  onBack?: () => void,
  institutionId?: string | null
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      // Intentar loguear con Firebase Auth (Email/Pass)
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = userCredential.user;

      // Intentar traer datos adicionales de Firestore
      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        onLogin({
          ...MOCK_USERS.student2, // Base para stats
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Estudiante',
          role: data.role || 'student',
          email: firebaseUser.email || undefined,
          ...data
        });
      } else {
        // Usuario existe en Auth pero no tiene perfil en Firestore
        onLogin({
          ...MOCK_USERS.student2,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Estudiante',
          email: firebaseUser.email || undefined,
          controlNumber: 'TEMP-' + firebaseUser.uid.substring(0, 5),
          career: 'POR DEFINIR',
        });
        
        // Sync to Firestore for future logins
        dbService.syncUserProfile({
          name: firebaseUser.displayName || 'Estudiante',
          controlNumber: 'TEMP-' + firebaseUser.uid.substring(0, 5),
          career: 'POR DEFINIR'
        }).catch(err => console.error("Error syncing profile:", err));
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setError('Error al conectar con la plataforma.');
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col lg:flex-row font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-white'}`}
    >
      {/* Theme Toggle & Back Floating */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 border backdrop-blur-md ${
              isDarkMode 
                ? 'bg-[#121926]/80 text-brand-teal border-neutral-800 hover:border-brand-teal/50' 
                : 'bg-white/80 text-brand-blue border-neutral-200 hover:border-brand-blue/30 shadow-lg shadow-neutral-100'
            }`}
          >
            <ArrowLeft size={14} />
            <span>Regresar</span>
          </button>
        )}
        <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      </div>

      {/* Left Side: Branding & Visual */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden p-8">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Office Background"
            className="w-full h-full object-cover rounded-[3rem]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/40 to-transparent rounded-[3rem]"></div>
        </motion.div>

        {/* Abstract Background Elements */}
        <div className="absolute top-12 left-12 z-10 flex flex-col items-start gap-6">
          <Logo dark={true} />
        </div>

        {/* Quote Card / Specific Institution Visual */}
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/20 p-12 rounded-[2.5rem] text-white shadow-2xl relative group overflow-hidden"
          >
            <Quote className="w-12 h-12 text-brand-teal mb-6 opacity-50" />
            <h2 className="text-4xl font-black leading-[1.1] mb-8 tracking-tight text-white">
              Diseña tu <span className="text-brand-teal underline decoration-brand-orange underline-offset-8">camino</span> profesional.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-medium mb-10 italic">
              "Simplificando tu camino hacia el éxito profesional."
            </p>
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:border-brand-teal/30 transition-colors">
              <Logo size="small" showText={false} isDarkMode={true} />
              <div>
                <h4 className="font-bold text-base text-white">Departamento Conecta2</h4>
                <p className="text-sm text-white/50 tracking-wider font-bold">Plataforma Profesional</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className={`w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-16 xl:p-24 relative z-10 overflow-y-auto custom-scrollbar transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-white'}`}>
        <div className="max-w-md mx-auto lg:mx-0 w-full animate-in fade-in slide-in-from-right-10 duration-700">
          {/* Mobile Logo & Institution Info */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-12 gap-8">
            <Logo isDarkMode={isDarkMode} />
            
            {onBack && (
              <button 
                onClick={onBack}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 border ${isDarkMode ? 'bg-[#121926] text-brand-teal border-neutral-800' : 'bg-neutral-50 text-brand-blue border-neutral-100 hover:bg-neutral-100'}`}
              >
                <ArrowLeft size={12} />
                <span>Cambiar institución</span>
              </button>
            )}
          </div>

          {/* Welcome Text */}
          <div className="mb-14">
            <h2 className={`text-5xl font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>¡Hola de nuevo!</h2>
            <p className={`leading-relaxed text-lg font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Ingresa tus datos para acceder a tu panel de vinculación profesional <span className="text-brand-teal">Conecta2</span>.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border-l-4 border-red-500 font-bold px-4 py-4 rounded-xl text-sm flex items-center gap-3 overflow-hidden shadow-sm ${isDarkMode ? 'bg-red-950/20 text-red-400' : 'bg-red-50 text-red-700'}`}
                >
                  <AlertCircle size={20} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Correo Institucional
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isDarkMode ? 'text-neutral-600 group-focus-within:text-brand-teal' : 'text-neutral-400 group-focus-within:text-brand-teal'}`}>
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@cancun.tecnm.mx"
                  disabled={isLoggingIn}
                  className={`w-full pl-11 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all disabled:opacity-50 font-bold ${
                    isDarkMode 
                      ? 'bg-[#1a2333]/50 border-neutral-800 text-white placeholder:text-neutral-700' 
                      : 'bg-neutral-50 border-neutral-100 text-neutral-800 placeholder:text-neutral-300'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Contraseña de Acceso
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isDarkMode ? 'text-neutral-600 group-focus-within:text-brand-teal' : 'text-neutral-400 group-focus-within:text-brand-teal'}`}>
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  className={`w-full pl-11 pr-12 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all disabled:opacity-50 font-bold ${
                    isDarkMode 
                      ? 'bg-[#1a2333]/50 border-neutral-800 text-white placeholder:text-neutral-700' 
                      : 'bg-neutral-50 border-neutral-100 text-neutral-800 placeholder:text-neutral-300'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-brand-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`peer appearance-none w-6 h-6 border-2 rounded-lg checked:bg-brand-blue checked:border-brand-blue transition-all cursor-pointer box-content ${isDarkMode ? 'border-neutral-800 bg-[#1a2333]' : 'border-neutral-200 bg-white'}`}
                  />
                  <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" />
                </div>
                <span className={`text-sm font-bold group-hover:text-brand-blue transition-colors ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>Mantener sesión activa</span>
              </label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand-blue hover:bg-[#162a45] text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-blue/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 h-16 group mt-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoggingIn ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="text-lg tracking-tight">Acceder al Portal</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
          </div>

          {/* Support Link */}
          <div className={`mt-12 text-center lg:text-left p-6 border rounded-3xl transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333]/30 border-neutral-800 shadow-xl shadow-brand-teal/5' : 'bg-brand-teal/5 border-brand-teal/10'}`}>
            <p className={`text-sm font-bold ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
              ¿Problemas para ingresar? <br className="lg:hidden" />
              <button 
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="text-brand-teal font-black hover:text-brand-teal/80 ml-1 transition-colors decoration-2 underline-offset-4"
              >
                Obtener asistencia técnica
              </button>
            </p>
          </div>
        </div>

        <AnimatePresence>
          {showSupportModal && (
            <SupportModal onClose={() => setShowSupportModal(false)} isDarkMode={isDarkMode} />
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 lg:mt-0">
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
            © 2026 CONECTA2
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Support Modal Component ---
function SupportModal({ onClose, isDarkMode }: { onClose: () => void, isDarkMode?: boolean }) {
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-xl p-6 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/60'}`}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden relative border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-8 right-8 p-3 rounded-full transition-colors z-10 ${isDarkMode ? 'hover:bg-neutral-800 text-neutral-500 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-brand-blue'}`}
        >
          <X size={24} />
        </button>

        <div className="p-10 sm:p-14">
          <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center mb-10 shadow-inner group">
            <HelpCircle className="text-brand-teal w-10 h-10 group-hover:scale-110 transition-transform" />
          </div>
          
          <h3 className={`text-4xl font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Centro de Ayuda</h3>
          <p className={`text-lg font-medium leading-relaxed mb-10 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Si experimentas dificultades técnicas, nuestro equipo de soporte está listo para asistirte en el proceso de vinculación.
          </p>

          <div className="space-y-4">
            <a href="mailto:soporte@conecta2.mx" className={`flex items-center gap-6 p-6 border-2 rounded-[2rem] transition-all group ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800 hover:border-brand-teal' : 'bg-neutral-50 border-neutral-100 hover:border-brand-teal'}`}>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-sm group-hover:bg-brand-teal/20 transition-colors">
                <Mail className="text-brand-teal" size={24} />
              </div>
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Vía Correo Electrónico</p>
                <p className={`font-black tracking-tight ${isDarkMode ? 'text-white/90' : 'text-brand-blue'}`}>soporte@conecta2.mx</p>
              </div>
            </a>

            <div className={`flex items-center gap-6 p-6 border-2 rounded-[2rem] transition-all ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-sm">
                <Clock className="text-brand-teal" size={24} />
              </div>
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Horario de Atención</p>
                <p className={`font-black tracking-tight ${isDarkMode ? 'text-white/90' : 'text-brand-blue'}`}>Lun - Vie: 9:00 - 15:00 hrs</p>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className={`w-full mt-10 py-5 font-black rounded-3xl shadow-xl transition-all text-lg tracking-tight ${isDarkMode ? 'bg-brand-blue text-white hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue text-white shadow-brand-blue/20 hover:bg-[#162a45]'}`}
          >
            Entendido, gracias
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard({ 
  user, 
  onLogout, 
  onUpdateProfile,
  isDarkMode,
  onToggleDarkMode
}: { 
  user: UserData, 
  onLogout: () => void, 
  onUpdateProfile: (u: UserData) => void,
  isDarkMode: boolean,
  onToggleDarkMode: () => void
}) {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebase();

  const handleFirebaseLogout = async () => {
    try {
      await signOut(firebaseAuth);
      onLogout(); // Log out from the app too
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'AdminCatalog' : 'Profile');
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null);

  // Close sidebar on tab change (mobile)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleSelectDependency = (dep: Dependency) => {
    setSelectedDependency(dep);
    setActiveTab('Docs');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen font-sans flex flex-col lg:flex-row transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] text-white' : 'bg-[#f8fafc] text-neutral-900'}`}
    >
      {/* Mobile Header */}
      <header className={`lg:hidden border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
        <div className="flex items-center gap-3">
          <Logo isDarkMode={isDarkMode} size="small" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-neutral-400 hover:bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen border-r p-8 flex flex-col transition-all duration-500 w-80
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}
      `}>
        {/* Logo (Desktop) */}
        <div className="hidden lg:flex items-center justify-between gap-3 mb-8">
          <Logo isDarkMode={isDarkMode} />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
        </div>

        {/* Firebase Sync Indicator */}
        <div className={`mb-10 p-5 rounded-[1.5rem] border transition-all ${isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
          {firebaseLoading ? (
             <div className="flex items-center gap-3">
               <Loader2 size={14} className="text-brand-teal animate-spin" />
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Verificando Nube...</span>
             </div>
          ) : firebaseUser ? (
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal">Sincronizado</span>
                 </div>
                 <button onClick={handleFirebaseLogout} className="p-1.5 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-lg transition-all text-neutral-400">
                   <LogOut size={12} />
                 </button>
               </div>
               <div className="truncate">
                 <p className="text-[10px] font-bold text-neutral-500 truncate">{firebaseUser.email}</p>
               </div>
             </div>
          ) : (
             <div className="flex items-center gap-3">
               <Info size={14} className="text-neutral-400" />
               <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Sin Conexión Nube</span>
             </div>
          )}
        </div>

        <div className="flex-1 space-y-10">
          <div>
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-6 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>Menú Principal</h3>
            <nav className="space-y-3">
              {user.role === 'admin' ? (
                <>
                  <NavItem 
                    icon={<Building2 size={20} />} 
                    label="Gestión de Catálogo" 
                    active={activeTab === 'AdminCatalog'} 
                    onClick={() => handleTabChange('AdminCatalog')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<FileCheck size={20} />} 
                    label="Revisión de Expedientes" 
                    active={activeTab === 'AdminReviews'} 
                    onClick={() => handleTabChange('AdminReviews')}
                    isDarkMode={isDarkMode}
                  />
                </>
              ) : (
                <>
                  <NavItem 
                    icon={<User size={20} />} 
                    label="Mi Perfil" 
                    active={activeTab === 'Profile'} 
                    onClick={() => handleTabChange('Profile')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<Building2 size={20} />} 
                    label="Catálogo de Plazas" 
                    active={activeTab === 'Catalog'} 
                    locked={user.role === 'student' && !dataConfirmed}
                    onClick={() => handleTabChange('Catalog')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<FileEdit size={20} />} 
                    label="Mis Documentos" 
                    active={activeTab === 'Docs'} 
                    locked={!selectedDependency || (user.role === 'student' && !dataConfirmed)}
                    onClick={() => handleTabChange('Docs')}
                    isDarkMode={isDarkMode}
                  />
                </>
              )}
            </nav>
          </div>
        </div>

        {/* User Profile Bottom */}
        <div className={`pt-8 border-t space-y-6 transition-colors duration-500 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border transition-colors duration-500 ${
              isDarkMode 
                ? 'bg-[#1a2333] border-neutral-700 text-neutral-400' 
                : 'bg-neutral-100 border-neutral-200 text-neutral-500'
            }`}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-800'}`}>{user.name}</span>
              <span className={`text-[11px] font-bold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{user.controlNumber || 'Admin'}</span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-rose-600 hover:text-rose-700 transition-colors text-sm font-bold group w-full"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'AdminCatalog' ? (
              <AdminCatalogView isDarkMode={isDarkMode} />
            ) : activeTab === 'AdminReviews' ? (
              <AdminReviewsView isDarkMode={isDarkMode} />
            ) : activeTab === 'Profile' ? (
              <ProfileView 
                user={user} 
                onUpdateProfile={onUpdateProfile} 
                dataConfirmed={dataConfirmed}
                onConfirmData={() => setDataConfirmed(true)}
                isDarkMode={isDarkMode}
              />
            ) : user.role === 'student' && !dataConfirmed && (activeTab === 'Catalog' || activeTab === 'Docs') ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 border shadow-xl transition-colors duration-500 ${isDarkMode ? 'bg-brand-orange/10 border-brand-orange/20 shadow-brand-orange/5' : 'bg-brand-orange/10 border-brand-orange/20 shadow-brand-orange/5'}`}>
                  <Lock size={40} className="text-brand-orange" />
                </div>
                <h3 className={`text-3xl font-black mb-4 tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Acceso Bloqueado</h3>
                <p className={`font-medium leading-relaxed mb-10 transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Para acceder a esta sección, primero debes verificar que tus datos de perfil coincidan con tus registros oficiales.
                </p>
                <button 
                  onClick={() => handleTabChange('Profile')}
                  className="px-10 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-[#162a45] transition-all shadow-xl shadow-brand-blue/20 flex items-center gap-3 active:scale-95"
                >
                  <User size={20} className="text-brand-teal" />
                  Ir a Verificar mi Perfil
                </button>
              </div>
            ) : activeTab === 'Catalog' ? (
              <CatalogView 
                onSelectDependency={handleSelectDependency}
                isDarkMode={isDarkMode}
              />
            ) : activeTab === 'Docs' && selectedDependency ? (
              <DocumentsView user={user} isDarkMode={isDarkMode} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Lock size={48} className={`mb-4 opacity-20 ${isDarkMode ? 'text-white' : 'text-neutral-400'}`} />
                <p className={`font-bold uppercase tracking-widest text-xs ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Sección Bloqueada</p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>Primero debes seleccionar una plaza en el catálogo para habilitar tus documentos.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}

// --- Profile View Component ---
function ProfileView({ 
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
  const [editForm, setEditForm] = useState<UserData>(user);
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

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editForm);
    }
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, profilePicture: imageUrl }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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
                
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-brand-blue/60 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
              <div className={`px-6 py-5 rounded-[1.5rem] border font-bold shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-100 text-brand-blue'}`}>{user.birthDate || 'No especificada'}</div>
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
        {/* Action Buttons */}
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

      {/* Success Notification overlay */}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/40'}`}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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

      {/* History Section */}
      {!isEditing && (
        <div className="mt-12 space-y-6">
          <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-3 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <History size={14} className="text-brand-orange" />
            Historial de Trámites en Nube
          </h3>
          
          <div className={`rounded-[2.5rem] border overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100 shadow-xl shadow-blue-900/5'}`}>
            <div className="p-8">
              {loadingSubmissions ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Cargando historial...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}>
                    <FileText className="text-neutral-300" size={32} />
                  </div>
                  <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>No tienes trámites guardados aún.</p>
                  <p className="text-xs font-medium text-neutral-500 mt-2">Tus formularios guardados en Firebase aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((sub, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border flex items-center justify-between transition-all group hover:scale-[1.01] ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 hover:border-brand-teal/50' : 'bg-neutral-50 border-neutral-100 hover:bg-white hover:shadow-lg'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <h4 className={`font-black text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{sub.templateId === 'anexo-17' ? 'Solicitud de Servicio Social (Anexo 17)' : 'Formulario Guardado'}</h4>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Enviado: {sub.submittedAt?.toDate?.()?.toLocaleDateString() || 'Reciente'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                           En Nube
                         </span>
                         <ArrowRight size={14} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Admin Views ---
function AdminCatalogView({ isDarkMode }: { isDarkMode?: boolean }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Gestión de Catálogo</h2>
          <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Administra las dependencias y plazas disponibles para servicio social.</p>
        </div>
        <button className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-4 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20 transition-all active:scale-95 whitespace-nowrap group">
          <Plus size={22} className="group-hover:rotate-90 transition-transform" />
          <span>Nueva Dependencia</span>
        </button>
      </div>

      <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Dependencia</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Categoría</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Vacantes</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Estado</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-right ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-neutral-800' : 'divide-neutral-50'}`}>
              {DEPENDENCIES.map((dep) => (
                <tr key={dep.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-[#1a2333]' : 'hover:bg-brand-teal/[0.02]'}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border shadow-sm group-hover:shadow-md transition-all duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-100 border-neutral-50'}`}>
                        <img src={dep.image} alt={dep.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{dep.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{dep.category}</td>
                  <td className={`px-6 py-4 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-700'}`}>{dep.vacancies} / {dep.maxVacancies}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-teal/10 text-brand-teal">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-neutral-600 hover:text-brand-teal hover:bg-brand-teal/10' : 'text-neutral-400 hover:text-blue-600 hover:bg-blue-50'}`}>
                        <Edit size={18} />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-neutral-600 hover:text-brand-orange hover:bg-brand-orange/10' : 'text-neutral-400 hover:text-rose-600 hover:bg-rose-50'}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminReviewsView({ isDarkMode }: { isDarkMode?: boolean }) {
  const mockStudents = [
    { id: '1', name: 'Carlos Mendoza', control: '21530321', career: 'Ing. Sistemas', status: 'Pendiente Revisión', date: '24 Mar 2026' },
    { id: '2', name: 'Ana Sofía López', control: '21530112', career: 'Ing. Industrial', status: 'Aprobado', date: '23 Mar 2026' },
    { id: '3', name: 'Luis Ramírez', control: '20530998', career: 'Administración', status: 'Rechazado', date: '22 Mar 2026' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Revisión de Expedientes</h2>
          <p className={`text-base sm:text-lg font-medium mt-2 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Evalúa los documentos técnicos y genera las cartas de liberación.</p>
        </div>
      </div>

      <div className={`rounded-[2.5rem] border shadow-sm overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}>
        <div className={`p-8 border-b transition-colors duration-500 ${isDarkMode ? 'border-neutral-800 bg-[#0a0f18]/30' : 'border-neutral-100 bg-neutral-50/30'}`}>
          <div className="relative w-full max-w-md group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número de control..." 
              className={`w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-sm font-bold shadow-sm ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800 text-white placeholder:text-neutral-700' : 'bg-white border-neutral-200 text-neutral-800'}`}
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]/50 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Alumno</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Carrera</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Envío</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Estado</th>
                <th className={`px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 text-right ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Acción</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-neutral-800' : 'divide-neutral-50'}`}>
              {mockStudents.map((student) => (
                <tr key={student.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-[#1a2333]' : 'hover:bg-brand-teal/[0.02]'}`}>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{student.name}</span>
                      <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{student.control}</span>
                    </div>
                  </td>
                  <td className={`px-8 py-6 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{student.career}</td>
                  <td className={`px-8 py-6 text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>{student.date}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.status === 'Aprobado' ? 'bg-brand-teal/10 text-brand-teal' :
                      student.status === 'Rechazado' ? 'bg-brand-orange/10 text-brand-orange' :
                      isDarkMode ? 'bg-brand-blue/20 text-brand-blue' : 'bg-brand-blue/10 text-brand-blue'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className={`inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 ${isDarkMode ? 'bg-[#1a2333] text-brand-teal hover:bg-brand-teal hover:text-white border border-neutral-800' : 'bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white'}`}>
                      <FileSignature size={14} />
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Document Detail View ---
function DocumentDetailView({ 
  doc, 
  user,
  onBack, 
  isDarkMode 
}: { 
  doc: any, 
  user: UserData,
  onBack: () => void, 
  isDarkMode?: boolean 
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Configuración dinámica basada en el ID o Título del documento
  const getDocConfig = () => {
    const title = doc.title.toLowerCase();
    
    if (title.includes('kardex')) {
      return {
        fileName: 'kardex_final_19530001.pdf',
        tip: 'Tip: Verifica que tu promedio y porcentaje de créditos sean correctos en el Kardex oficial de servicios escolares.',
        timeline: [
          { 
            date: '12 MAY', 
            event: 'Documento Rechazado', 
            description: 'El documento cargado no es legible. Asegúrate de que el sello de rectoría y la firma sean visibles en la versión digital.', 
            status: 'RECHAZADO' 
          },
          { date: '10 MAY', event: 'Enviado a revisión', status: 'SENT' },
        ]
      };
    }
    
    if (title.includes('carga')) {
      return {
        fileName: 'carga_academica_2026.pdf',
        tip: 'Tip: Sube tu carga académica actualizada del semestre en curso, debe incluir el código de barras o sello digital.',
        timeline: [
          { 
            date: 'AHORA', 
            event: 'Pendiente de Revisión', 
            description: 'Tu documento ha sido recibido y está en espera de ser validado por el coordinador.', 
            status: 'PENDIENTE' 
          },
        ]
      };
    }

    if (title.includes('vigencia')) {
      return {
        fileName: 'constancia_imss.pdf',
        tip: 'Tip: La constancia de vigencia de derechos se descarga gratuitamente desde el portal del IMSS Digital.',
        timeline: [
          { 
            date: 'AHORA', 
            event: 'Documento en Espera', 
            description: 'Sube tu constancia descargada directamente del portal del IMSS (formato PDF).', 
            status: 'PENDIENTE' 
          },
        ]
      };
    }

    if (doc.id === '10' || title.includes('solicitud')) {
      return {
        fileName: 'anexo_17_solicitud_generada.pdf',
        tip: 'Tip: Este documento se genera automáticamente con tus datos. Revisa que todo esté correcto antes de finalizar.',
        timeline: [
          { 
            date: 'HOY', 
            event: 'Borrador Guardado', 
            description: 'Los datos de tu solicitud han sido guardados. Puedes editarlos antes de finalizar.', 
            status: 'BORRADOR' 
          },
        ]
      };
    }

    return {
      fileName: 'documento_digital.pdf',
      tip: 'Tip: Asegúrate de que el documento esté en formato PDF y sea menor a 5MB.',
      timeline: [
        { date: 'HOY', event: 'Pendiente', description: 'Esperando carga de archivo.', status: 'PENDIENTE' },
      ]
    };
  };

  const config = getDocConfig();
  const title = doc.title.toLowerCase();
  const isKardex = title.includes('kardex');
  const isCarga = title.includes('carga');
  const isVigencia = title.includes('vigencia');
  const isGenerateType = doc.id === '10' || title.includes('solicitud');

  if (isGenerating) {
    return (
      <FormServiceRequest 
        user={user}
        onBack={() => setIsGenerating(false)} 
        isDarkMode={isDarkMode} 
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-20 mt-8 sm:mt-12"
    >
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <button 
              onClick={onBack}
              className={`hover:text-brand-teal transition-colors ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}
            >
              Mis Documentos
            </button>
            <ChevronRight size={10} className={isDarkMode ? 'text-neutral-800' : 'text-neutral-300'} />
            <span className={isDarkMode ? 'text-neutral-300' : 'text-brand-blue'}>{doc.title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              {doc.title}
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
              doc.status === 'RECHAZADO' 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                : doc.status === 'PENDIENTE' ? 'bg-neutral-100 text-neutral-400 border-neutral-200' : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                doc.status === 'RECHAZADO' ? 'bg-rose-500 animate-pulse' : doc.status === 'PENDIENTE' ? 'bg-neutral-400' : 'bg-brand-teal'
              }`}></div>
              {doc.status}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border ${
              isDarkMode 
                ? 'bg-white/5 border-neutral-800 text-white hover:bg-white/10' 
                : 'bg-white border-neutral-100 text-brand-blue shadow-sm hover:shadow-md'
            }`}
          >
            Regresar
          </button>
          {isGenerateType ? (
            <button 
              onClick={() => setIsGenerating(true)}
              className="px-6 py-3 rounded-2xl font-black text-sm bg-brand-orange text-white shadow-xl shadow-brand-orange/20 hover:bg-brand-orange/90 transition-all flex items-center gap-2 active:scale-95"
            >
              <FileEdit size={18} />
              <span>Editar Solicitud</span>
            </button>
          ) : !isKardex ? (
            <button className="px-6 py-3 rounded-2xl font-black text-sm bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90 transition-all flex items-center gap-2 active:scale-95">
              <Upload size={18} />
              <span>Reemplazar Archivo</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-3xl border overflow-hidden transition-colors duration-500 min-h-[600px] flex flex-col ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-[#fcfdfe] border-neutral-100'}`}>
            {/* File Info Bar */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-white border-neutral-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-rose-500/20 text-rose-500' : (isGenerateType ? 'bg-brand-orange/10 text-brand-orange' : 'bg-rose-50 text-rose-500')}`}>
                  <FileText size={16} />
                </div>
                <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {isGenerateType ? 'anexo_17_solicitud_auto.pdf' : config.fileName}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button className={`p-1.5 rounded-lg hover:bg-brand-teal/10 hover:text-brand-teal transition-all ${isDarkMode ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  <Search size={16} />
                </button>
                <button className={`p-1.5 rounded-lg hover:bg-brand-teal/10 hover:text-brand-teal transition-all ${isDarkMode ? 'text-neutral-600' : 'text-neutral-300'}`}>
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="p-8 sm:p-12 flex-1 flex items-center justify-center relative overflow-hidden group">
              <div className={`w-full max-w-2xl aspect-[1/1.41] rounded-sm shadow-2xl relative transition-colors duration-500 ${isDarkMode ? 'bg-white' : 'bg-white'} overflow-y-auto custom-scrollbar`}>
                {/* Simulated Document Content */}
                {isGenerateType ? (
                  <div className="bg-white text-black p-4 sm:p-10 text-[6px] sm:text-[9px] leading-tight font-serif min-h-full flex flex-col items-stretch">
                    {/* Header Table */}
                    <table className="w-full border-collapse border border-black mb-4">
                      <tbody>
                        <tr>
                          <td className="border border-black p-2 w-[18%] text-center">
                            <div className="flex justify-center items-center h-full">
                               <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo-TecNM-2017.png" className="h-8 sm:h-12 object-contain" alt="TecNM" />
                            </div>
                          </td>
                          <td className="border border-black p-4 w-[57%] text-center font-bold text-[8px] sm:text-[11px] align-middle uppercase leading-normal">
                             <div className="flex flex-col gap-1 items-center justify-center">
                               <span>Formato para Solicitud de</span>
                               <span>Servicio Social</span>
                             </div>
                          </td>
                          <td className="border border-black p-0 w-[25%] align-top">
                            <table className="w-full h-full border-collapse">
                              <tbody>
                                <tr className="border-b border-black">
                                  <td className="p-1 px-2 font-bold text-[5px] sm:text-[8px]">Fecha de aprobación: 17 febrero 2023</td>
                                </tr>
                                <tr className="border-b border-black">
                                  <td className="p-1 px-2 font-bold text-[5px] sm:text-[8px]">Revisión: 0</td>
                                </tr>
                                <tr>
                                  <td className="p-1 px-2 font-bold text-[5px] sm:text-[8px]">Página 1 de 1</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Department and Title */}
                    <div className="text-center font-bold mb-6 uppercase">
                      <p className="text-[7px] sm:text-[10px] tracking-tight">DEPARTAMENTO DE GESTIÓN TECNOLÓGICA Y VINCULACIÓN</p>
                      <p className="text-[9px] sm:text-[13px]">SOLICITUD DE SERVICIO SOCIAL</p>
                    </div>

                    {/* Small Photo Box as in image */}
                    <div className="flex justify-end mb-4 pr-6">
                      <div className="w-12 h-14 sm:w-24 sm:h-28 border border-black flex items-center justify-center text-[5px] sm:text-[8px] italic text-neutral-300 relative">
                        <div className="absolute inset-2 border border-dashed border-neutral-100" />
                      </div>
                    </div>

                    {/* DATOS PERSONALES */}
                    <div className="mb-4">
                      <h5 className="font-bold mb-2 text-[7px] sm:text-[10px] uppercase">DATOS PERSONALES</h5>
                      <div className="space-y-2">
                        <div className="flex items-end gap-1">
                          <span className="font-medium whitespace-nowrap">Nombre completo</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">{user.name}</span>
                          <span className="font-medium">Sexo</span>
                          <span className="w-16 border-b border-black text-brand-blue font-bold px-1 text-center min-h-[14px] uppercase">{user.gender || '______'}</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Teléfono:</span>
                          <span className="w-32 border-b border-black text-brand-blue font-bold px-1 min-h-[14px]">{user.phone}</span>
                          <span className="font-medium">Domicilio:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">{user.address ? `${user.address.street}, ${user.address.neighborhood}` : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* ESCOLARIDAD */}
                    <div className="mb-4">
                      <h5 className="font-bold mb-2 text-[7px] sm:text-[10px] uppercase">ESCOLARIDAD</h5>
                      <div className="space-y-2">
                        <div className="flex items-end gap-1">
                          <span className="font-medium">No. de Control:</span>
                          <span className="w-32 border-b border-black text-brand-blue font-bold px-1 min-h-[14px]">{user.controlNumber}</span>
                          <span className="font-medium">Carrera:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">{user.career}</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Periodo:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">AGOSTO - DICIEMBRE 2026</span>
                          <span className="font-medium">Semestre:</span>
                          <span className="w-24 border-b border-black text-brand-blue font-bold px-1 text-center min-h-[14px] uppercase">{user.semester}</span>
                        </div>
                      </div>
                    </div>

                    {/* DATOS DEL PROGRAMA */}
                    <div className="mb-4">
                      <h5 className="font-bold mb-2 text-[7px] sm:text-[10px] uppercase">DATOS DEL PROGRAMA</h5>
                      <div className="space-y-2">
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Dependencia Oficial:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">INSTITUTO TECNOLÓGICO DE CANCÚN</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Titular de la Dependencia:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">LIC. MARÍA FERNANDA LÓPEZ</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Puesto:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">JEFE DE VINCULACIÓN PROFESIONAL</span>
                        </div>
                        <div className="flex items-end gap-1">
                          <span className="font-medium">Nombre del Programa:</span>
                          <span className="flex-1 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] uppercase">APOYO A LA DOCENCIA</span>
                        </div>
                        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                          <div className="flex items-end gap-1">
                            <span className="font-medium">Modalidad:</span>
                            <span className="w-20 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] text-center">PRESENCIAL</span>
                          </div>
                          <div className="flex items-end gap-1">
                            <span className="font-medium">Fecha de Inicio:</span>
                            <span className="w-20 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] text-center">21/08/2026</span>
                          </div>
                          <div className="flex items-end gap-1">
                            <span className="font-medium">Fecha de Terminación:</span>
                            <span className="w-20 border-b border-black text-brand-blue font-bold px-1 min-h-[14px] text-center">21/02/2027</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="font-medium">Actividades:</span>
                          <div className="border-b border-black min-h-[14px] text-brand-blue font-medium pt-1 uppercase">1. REVISIÓN Y ACTUALIZACIÓN DE MATERIAL DIDÁCTICO DIGITAL.</div>
                          <div className="border-b border-black min-h-[14px] text-brand-blue font-medium pt-1 uppercase">2. ASISTENCIA EN LABORATORIOS DE CÓMPUTO Y SOPORTE TÉCNICO.</div>
                          <div className="border-b border-black min-h-[14px] text-brand-blue font-medium pt-1 uppercase">3. COLABORACIÓN EN PROYECTOS DE INVESTIGACIÓN ESCOLAR.</div>
                        </div>
                      </div>
                    </div>

                    {/* TIPO DE PROGRAMA */}
                    <div className="mb-4">
                      <h5 className="font-bold mb-2 text-[7px] sm:text-[10px] uppercase">Tipo de programa: (17)</h5>
                      <div className="grid grid-cols-3 gap-y-1">
                        {[
                          "Educación para adultos", "Desarrollo de comunidad", "Actividades deportivas",
                          "Actividades cívicas", "Actividades culturales", "Medio ambiente",
                          "Desarrollo sustentable", "Apoyo a la salud", "Otros"
                        ].map((label, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-3 h-3 border border-black flex items-center justify-center text-[5px] sm:text-[8px]">
                              {label === "Apoyo a la salud" ? "X" : ""}
                            </div>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* OFFICE USE */}
                    <div className="mt-auto border-t border-black/20 pt-4 opacity-70">
                       <p className="font-bold text-[6px] sm:text-[8px] mb-2">PARA USO EXCLUSIVO DE LA OFICINA DE SERVICIO SOCIAL</p>
                       <div className="flex items-center gap-6 mb-2">
                         <div className="flex items-center gap-1">
                           <span>ACEPTADO: (18) SI ( ) NO ( )</span>
                         </div>
                         <div className="flex items-end gap-1 flex-1">
                           <span>MOTIVO: (19)</span>
                           <span className="flex-1 border-b border-black/30 min-h-[10px]"></span>
                         </div>
                       </div>
                       <div className="flex flex-col gap-1">
                         <span>OBSERVACIONES: (20)</span>
                         <span className="border-b border-black/30 min-h-[10px]"></span>
                         <span className="border-b border-black/30 min-h-[10px]"></span>
                       </div>
                       <div className="mt-8 flex justify-center text-neutral-400 italic">
                          <p className="text-[5px] sm:text-[7px]">Este documento es una representación digital del formato oficial Anexo 17 de los lineamientos del TecNM.</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className={`h-8 w-48 mx-auto rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                    <div className="space-y-2">
                      <div className={`h-3 w-full rounded ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                      <div className={`h-3 w-full rounded ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                      <div className={`h-3 w-3/4 mx-auto rounded ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-20">
                      <div className={`h-24 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                      <div className={`h-24 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-neutral-50'}`}></div>
                    </div>
                  </div>
                )}

                {/* Rejection Stamp */}
                {doc.status === 'RECHAZADO' && (
                  <motion.div 
                    initial={{ scale: 1.5, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: -15 }}
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-8 pointer-events-none select-none"
                  >
                    <div className="border-8 border-rose-500/40 rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-4 bg-white/10 backdrop-blur-sm rotate-2">
                      <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40">
                        <X size={40} strokeWidth={3} />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-rose-500 tracking-tighter uppercase whitespace-nowrap">Documento Inválido</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Background Glow */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-20 ${doc.status === 'RECHAZADO' ? 'bg-rose-500' : 'bg-brand-teal'}`}></div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-center pt-8">
            <button 
              onClick={onBack}
              className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 border ${
                isDarkMode 
                  ? 'bg-[#1a2333] text-brand-teal border-neutral-800 hover:border-brand-teal/50 shadow-xl shadow-brand-teal/5' 
                  : 'bg-neutral-50 text-brand-blue border-neutral-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5'
              }`}
            >
              <ArrowLeft size={18} />
              <span>Regresar a documentos</span>
            </button>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-8">
          {/* Tracking Section (Seguimiento) */}
          <div className={`rounded-3xl border p-8 transition-colors duration-500 h-full ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
              <div className="w-1.5 h-4 bg-brand-orange rounded-full"></div>
              Seguimiento y Observaciones
            </h3>
            <div className="space-y-10 relative">
              <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-neutral-100 dark:bg-neutral-800"></div>
              {config.timeline.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 group">
                  <div className={`shrink-0 w-6 h-6 rounded-full border-4 flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 ${
                    item.status === 'RECHAZADO' 
                      ? 'bg-rose-500 border-rose-500/20' 
                      : i === 0 && item.status !== 'PENDIENTE' ? 'bg-brand-teal border-brand-teal/20' : 'bg-brand-blue/20 border-brand-blue/5 shadow-inner shadow-black/5'
                  }`}></div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                        {item.event}
                      </h4>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {item.date}
                      </span>
                    </div>
                    {item.description && (
                      <div className={`p-4 rounded-2xl border text-[13px] leading-relaxed font-medium transition-all ${
                        item.status === 'RECHAZADO' 
                          ? 'bg-rose-500/[0.03] border-rose-500/10 text-rose-500/70 hover:bg-rose-500/10' 
                          : isDarkMode ? 'bg-white/5 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-100 text-neutral-500'
                      }`}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tip Section */}
            <div className={`mt-12 p-6 rounded-[2.5rem] border flex items-start gap-5 group transition-all duration-500 ${isDarkMode ? 'bg-brand-blue/10 border-brand-blue/20' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-brand-blue/20 text-brand-teal' : 'bg-white text-brand-teal shadow-md shadow-blue-900/5'}`}>
                <Lightbulb size={20} className="group-hover:rotate-12 transition-transform" />
              </div>
              <p className={`text-[11px] leading-relaxed font-medium italic ${isDarkMode ? 'text-neutral-400' : 'text-blue-900/60'}`}>
                {config.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Form Service Request ---
function FormServiceRequest({ user, onBack, isDarkMode }: { user: UserData, onBack: () => void, isDarkMode?: boolean }) {
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

  // Effect to load custom configuration (templates) from Firebase
  useEffect(() => {
    async function loadTemplate() {
      setLoadStatus('loading');
      try {
        const template = (await dbService.getTemplate('anexo-17')) as any;
        if (template && template.fields) {
          // If Firestore has a template, we apply its default values
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
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-brand-teal">
                  <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                  Conexión segura establecida
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-neutral-400">
                  <div className="w-2 h-2 rounded-full bg-neutral-300" />
                  Encriptación de grado militar
                </div>
              </div>
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

function DocumentsView({ user, isDarkMode }: { user: UserData, isDarkMode?: boolean }) {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  
  const documents = [
    {
      id: '10',
      title: 'Anexo 17: Solicitud de Servicio Social',
      description: 'Formato oficial para iniciar el proceso de asignación de servicio social.',
      status: 'BORRADOR',
      lastModified: 'Hoy',
    },
    {
      id: '7',
      title: 'Kardex Académico',
      description: 'Historial académico oficial para validar porcentaje de avance.',
      status: 'RECHAZADO',
      lastModified: '12 May 2026',
    },
    {
      id: '8',
      title: 'Carga Académica',
      description: 'Documento que acredita las materias cursadas en el ciclo actual.',
      status: 'PENDIENTE',
      lastModified: null,
    },
    {
      id: '9',
      title: 'Vigencia de Derechos',
      description: 'Constancia oficial del IMSS para acreditar seguridad social activa.',
      status: 'PENDIENTE',
      lastModified: null,
    },
  ];

  if (selectedDoc) {
    return (
      <DocumentDetailView 
        doc={selectedDoc} 
        user={user}
        onBack={() => {
          setSelectedDoc(null);
        }} 
        isDarkMode={isDarkMode} 
      />
    );
  }

  return (
    <div className="space-y-10 mt-8 sm:mt-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <h2 className={`text-4xl sm:text-5xl font-black tracking-tighter leading-[0.9] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Mis Documentos</h2>
          <p className={`text-base sm:text-lg font-medium leading-relaxed max-w-xl transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Gestiona tu expediente de servicio social y realiza el seguimiento de tus trámites en tiempo real.
          </p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border flex items-center gap-8 transition-all shrink-0 ${isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-white border-neutral-100 shadow-xl shadow-blue-900/5'}`}>
          <div className="shrink-0 relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" className={`fill-none stroke-[6] transition-all duration-1000 ${isDarkMode ? 'stroke-neutral-800' : 'stroke-neutral-100'}`} />
              <circle cx="32" cy="32" r="28" className="fill-none stroke-[6] stroke-brand-teal stroke-dash-100" style={{ strokeDashoffset: 176 * (1 - 0.33) }} strokeLinecap="round" />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center font-black text-sm ${isDarkMode ? 'text-brand-teal' : 'text-brand-teal'}`}>33%</div>
          </div>
          <div className="space-y-1">
            <span className={`block text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>Integridad del Expediente</span>
            <div className={`text-xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Nivel Bronce</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
        {documents.map((doc) => (
          <div key={doc.id}>
            <DocumentCard 
              doc={doc} 
              isDarkMode={isDarkMode} 
              onClick={() => setSelectedDoc(doc)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface DocumentCardProps {
  doc: {
    id: string;
    title: string;
    description: string;
    status: string;
    lastModified: string | null;
  };
  isDarkMode?: boolean;
  onClick?: () => void;
}

function DocumentCard({ doc, isDarkMode, onClick }: DocumentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return {
          bg: isDarkMode ? 'bg-brand-teal/5' : 'bg-brand-teal/10',
          text: 'text-brand-teal',
          border: isDarkMode ? 'border-brand-teal/20' : 'border-brand-teal/20',
          icon: <CheckCircle2 size={14} />,
          label: 'Aceptado'
        };
      case 'EN REVISIÓN':
        return {
          bg: isDarkMode ? 'bg-brand-orange/5' : 'bg-brand-orange/10',
          text: 'text-brand-orange',
          border: isDarkMode ? 'border-brand-orange/20' : 'border-brand-orange/20',
          icon: <Clock size={14} />,
          label: 'En Proceso'
        };
      case 'RECHAZADO':
        return {
          bg: isDarkMode ? 'bg-rose-500/5' : 'bg-rose-50',
          text: 'text-rose-500',
          border: isDarkMode ? 'border-rose-500/20' : 'border-rose-100',
          icon: <AlertCircle size={14} />,
          label: 'Requiere Atención'
        };
      case 'BORRADOR':
        return {
          bg: isDarkMode ? 'bg-brand-blue/10' : 'bg-brand-blue/10',
          text: 'text-brand-blue',
          border: isDarkMode ? 'border-brand-blue/20' : 'border-brand-blue/20',
          icon: <PenLine size={14} />,
          label: 'Borrador'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-[#0a0f18]' : 'bg-neutral-50',
          text: isDarkMode ? 'text-neutral-600' : 'text-neutral-400',
          border: isDarkMode ? 'border-neutral-800' : 'border-neutral-100',
          icon: <FileText size={14} />,
          label: 'Pendiente'
        };
    }
  };

  const status = getStatusConfig(doc.status);
  const isActionable = ['RECHAZADO', 'BORRADOR', 'PENDIENTE'].includes(doc.status);
  const title = doc.title.toLowerCase();
  const isUploadType = ['7', '8', '9'].includes(doc.id) || title.includes('kardex') || title.includes('carga') || title.includes('vigencia');
  const isGenerateType = doc.id === '10' || title.includes('solicitud');

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`rounded-[2rem] p-8 border shadow-sm transition-all group cursor-pointer ${isDarkMode ? 'bg-[#121926] border-neutral-800 hover:shadow-brand-teal/5' : 'bg-white border-neutral-100 hover:shadow-xl hover:shadow-blue-900/5'}`}
    >
      <div className="flex items-start justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${isDarkMode ? 'bg-[#0a0f18] text-neutral-700 group-hover:bg-brand-teal group-hover:text-white' : 'bg-neutral-50 text-neutral-400 group-hover:bg-brand-teal group-hover:text-white'}`}>
          {isGenerateType ? (
            <FileEdit size={24} className="group-hover:scale-110 transition-transform" />
          ) : (
            <FileText size={24} className="group-hover:scale-110 transition-transform" />
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border} text-[10px] font-black tracking-widest uppercase`}>
            {status.icon}
            <span>{status.label}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded pl-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
             <ShieldCheck size={10} className="text-brand-teal" />
             <span className="text-[8px] font-black uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400">Verificado</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h3 className={`text-xl font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{doc.title}</h3>
        <p className={`text-sm font-medium leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>{doc.description}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-300'}`}>
          {doc.lastModified ? (
            <>
              <Clock size={12} className="text-brand-orange" />
              <span>Actualizado: {doc.lastModified}</span>
            </>
          ) : (
            <span className="opacity-50 italic">Pendiente de iniciar</span>
          )}
        </div>

        {isActionable ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`w-full py-4 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] group ${isGenerateType ? 'bg-brand-orange shadow-brand-orange/20 hover:bg-brand-orange/90' : 'bg-brand-teal shadow-brand-teal/20 hover:bg-brand-teal/90'}`}
          >
            {isUploadType ? (
              <>
                <Upload size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Subir Documento</span>
              </>
            ) : isGenerateType ? (
              <>
                <FileEdit size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Generar Documento</span>
              </>
            ) : (
              <>
                <PenLine size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Llenar Documento</span>
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`w-full py-4 border-2 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm ${isDarkMode ? 'bg-[#1a2333] border-neutral-800 text-brand-teal hover:border-brand-teal/50' : 'bg-neutral-50 hover:bg-white hover:border-brand-blue/30 border-transparent text-brand-blue'}`}
          >
            <Eye size={18} className="text-brand-teal" />
            <span>Ver Documento</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function CatalogView({ 
  onSelectDependency,
  isDarkMode 
}: { 
  onSelectDependency: (dep: Dependency) => void,
  isDarkMode?: boolean
}) {
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDependencyModal, setSelectedDependencyModal] = useState<Dependency | null>(null);
  const [showNewAgreementNotice, setShowNewAgreementNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { name: 'Todos', icon: null },
    { name: 'Internos', icon: <GraduationCap size={16} /> },
    { name: 'Gobierno / Ayuntamiento', icon: <Building2 size={16} /> },
    { name: 'Salud / Hospitales', icon: <HeartPulse size={16} /> },
    { name: 'Asociaciones Civiles', icon: <Users size={16} /> },
    { name: 'Justicia / Fiscalías', icon: <Gavel size={16} /> }
  ];

  const filteredDependencies = useMemo(() => {
    return DEPENDENCIES.filter(d => {
      const matchesFilter = filter === 'Todos' || d.category === filter;
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           d.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Action */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="flex-1 relative group">
          <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-neutral-600 group-focus-within:text-brand-teal' : 'text-neutral-400 group-focus-within:text-brand-teal'}`} size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por dependencia, categoría o ubicación..."
            className={`w-full pl-16 pr-6 py-5 border rounded-[2rem] shadow-sm focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all font-bold ${isDarkMode ? 'bg-[#121926] border-neutral-800 text-white placeholder:text-neutral-700 shadow-brand-teal/5' : 'bg-white border-neutral-100 text-neutral-800 placeholder:text-neutral-400'}`}
          />
        </div>
        <button 
          onClick={() => setShowNewAgreementNotice(true)}
          className={`flex items-center justify-center gap-3 px-8 py-5 border rounded-[2rem] shadow-sm transition-all text-sm font-black active:scale-95 group ${isDarkMode ? 'bg-[#121926] border-neutral-800 text-brand-teal hover:bg-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-200 text-brand-blue hover:shadow-xl hover:shadow-brand-teal/5'}`}
        >
          <Plus size={20} className="text-brand-teal group-hover:rotate-90 transition-transform" />
          <span>Proponer Nuevo Convenio</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar lg:custom-scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setFilter(cat.name)}
            className={`px-7 py-4 rounded-full text-sm font-black transition-all whitespace-nowrap border-2 flex items-center gap-3 active:scale-95 ${
              filter === cat.name 
                ? 'bg-brand-blue text-white border-brand-blue shadow-xl shadow-brand-blue/20 scale-105 z-10' 
                : isDarkMode
                  ? 'bg-[#1a2333] text-neutral-600 border-neutral-800 hover:border-brand-teal/30 hover:text-brand-teal'
                  : 'bg-white text-neutral-400 border-neutral-50 hover:border-brand-teal/30 hover:text-brand-teal'
            }`}
          >
            <span className={filter === cat.name ? 'text-brand-teal' : 'text-inherit opacity-70'}>{cat.icon}</span>
            <span className="tracking-tight">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`rounded-[2rem] p-8 h-[400px] animate-pulse border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-50'}`}>
              <div className={`h-4 w-24 rounded-full mb-8 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
              <div className="flex justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
                <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
              </div>
              <div className={`h-2 rounded-full mb-8 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
              <div className="space-y-3">
                <div className={`h-6 rounded-lg w-3/4 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
                <div className={`h-4 rounded-lg w-1/2 ${isDarkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredDependencies.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10"
            >
              {filteredDependencies.map(dep => (
                <DependencyCard 
                  key={dep.id} 
                  dependency={dep} 
                  onViewDetails={() => setSelectedDependencyModal(dep)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex flex-col items-center justify-center py-20 transition-colors duration-500 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-400'}`}
            >
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">Sin resultados</p>
              <p className="text-sm mt-2">Intenta con otros términos o filtros.</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDependencyModal && (
          <DependencyDetailsModal 
            dependency={selectedDependencyModal} 
            onClose={() => setSelectedDependencyModal(null)} 
            onSelect={() => onSelectDependency(selectedDependencyModal)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* New Agreement Notice Modal */}
      <AnimatePresence>
        {showNewAgreementNotice && (
          <NewAgreementNoticeModal 
            onClose={() => setShowNewAgreementNotice(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewAgreementNoticeModal({ onClose, isDarkMode }: { onClose: () => void, isDarkMode?: boolean }) {
  return (
    <div className={`fixed inset-0 z-[150] flex items-center justify-center backdrop-blur-xl p-4 sm:p-6 transition-colors duration-500 ${isDarkMode ? 'bg-[#05080f]/80' : 'bg-brand-blue/60'}`}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh] relative border transition-colors duration-500 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-8 right-8 p-3 rounded-full transition-all z-20 ${isDarkMode ? 'hover:bg-white/5 text-neutral-600 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'}`}
        >
          <X size={24} />
        </button>

        {/* Warning Header */}
        <div className="bg-brand-orange p-8 sm:p-14 flex items-center gap-6 sm:gap-8 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          <div className="bg-black/10 p-4 rounded-3xl relative z-10">
            <AlertTriangle className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-widest leading-none uppercase mb-2">
              Importante
            </h3>
            <p className="text-white/80 font-bold text-sm sm:text-base uppercase tracking-widest">Procedimiento Presencial Requerido</p>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-8 sm:p-14 overflow-y-auto custom-scrollbar">
          <div className={`border rounded-[2rem] p-8 mb-12 flex items-start gap-6 shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/20' : 'bg-brand-teal/5 border-brand-teal/20'}`}>
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center shrink-0">
              <Info className="text-brand-teal" size={28} />
            </div>
            <p className={`font-bold text-base sm:text-lg leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              Por motivos de protocolos de seguridad interna, el trámite de propuesta de nuevo convenio se realizará de manera <span className="text-brand-teal underline decoration-2 underline-offset-4">estrictamente presencial</span> en las oficinas de Conecta2.
            </p>
          </div>

          <p className={`leading-relaxed mb-10 sm:mb-12 font-medium text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Si deseas proponer un nuevo convenio, considera los siguientes puntos antes de acudir a la oficina:
          </p>

          <div className="space-y-8 sm:space-y-10">
            {/* Tiempos de Trámite */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
                <Clock className="w-7 h-7 text-brand-orange" />
              </div>
              <div>
                <h4 className={`font-black mb-1.5 text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Tiempos de Trámite</h4>
                <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  El trámite de formalización tarda <span className={`font-bold ${isDarkMode ? 'text-brand-orange' : 'text-brand-blue'}`}>varios meses</span>. Si tienes prisa por liberar tu servicio, te recomendamos elegir una plaza existente.
                </p>
              </div>
            </div>

            {/* Vigencia Obligatoria */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
                <Calendar className="w-7 h-7 text-brand-teal" />
              </div>
              <div>
                <h4 className={`font-black mb-1.5 text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Vigencia Obligatoria</h4>
                <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  El convenio tendrá una vigencia obligatoria mínima de <span className={`font-bold ${isDarkMode ? 'text-brand-teal' : 'text-brand-blue'}`}>3 años</span> para futuras generaciones.
                </p>
              </div>
            </div>

            {/* Requisito Documental */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
                <FileText className="w-7 h-7 text-brand-blue" />
              </div>
              <div>
                <h4 className={`font-black mb-1.5 text-base sm:text-lg transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>Requisito Documental</h4>
                <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  La empresa debe tener su documentación legal completa (Acta Constitutiva, Poder Notarial, RFC, etc.) lista para entrega inmediata.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <button 
              onClick={onClose}
              className={`w-full py-4 sm:py-5 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl text-base sm:text-lg ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20'}`}
            >
              Entendido, volver al catálogo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DependencyDetailsModal({ dependency, onClose, onSelect, isDarkMode }: { dependency: Dependency, onClose: () => void, onSelect: () => void, isDarkMode?: boolean }) {
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
                  {/* Titular */}
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <User size={24} className={isDarkMode ? "text-neutral-700" : "text-brand-blue/40"} />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Titular del Programa</p>
                      <p className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.contact?.titular || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <Clock size={24} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Teléfono Directo</p>
                      <p className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.contact?.phone || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-[#1a2333] border-neutral-800' : 'bg-white border-neutral-100'}`}>
                      <FileText size={24} className="text-brand-teal" />
                    </div>
                    <div>
                      <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Correo Institucional</p>
                      <p className="text-sm sm:text-base font-black text-brand-teal hover:text-brand-blue transition-colors cursor-pointer break-all">{dependency.contact?.email || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Schedule */}
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
                {/* Address */}
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

      {/* Confirmation Modal Overlay */}
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
                  className={`flex-1 py-4 font-black rounded-2xl transition-all disabled:opacity-50 ${isDarkMode ? 'bg-[#1a2333] text-neutral-600 hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={`flex-1 py-4 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 group ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue hover:bg-[#162a45] shadow-brand-blue/20'}`}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sí, confirmar</span>
                      <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface DependencyCardProps {
  dependency: Dependency;
  onViewDetails: () => void;
  isDarkMode?: boolean;
}

const DependencyCard: React.FC<DependencyCardProps> = ({ dependency, onViewDetails, isDarkMode }) => {
  const statusColors = {
    'Alta Disponibilidad': 'text-brand-teal',
    'Lugares Limitados': 'text-brand-orange',
    'Disponible': 'text-brand-teal',
    'Últimos Lugares': 'text-brand-orange',
    'Pocos Lugares': 'text-brand-orange',
    'Disponibilidad Media': 'text-brand-blue'
  };

  const barColors = {
    'Alta Disponibilidad': 'bg-brand-teal',
    'Lugares Limitados': 'bg-brand-orange',
    'Disponible': 'bg-brand-teal',
    'Últimos Lugares': 'bg-brand-orange',
    'Pocos Lugares': 'bg-brand-orange',
    'Disponibilidad Media': 'bg-brand-blue'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`rounded-[2rem] border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-6 sm:p-8 ${isDarkMode ? 'bg-[#121926] border-neutral-800 shadow-brand-teal/5' : 'bg-white border-neutral-100'}`}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <span className={`text-[10px] font-black uppercase tracking-widest ${statusColors[dependency.status as keyof typeof statusColors]}`}>
          {dependency.status}
        </span>
        <div className={`w-2 h-2 rounded-full ${barColors[dependency.status as keyof typeof barColors]}`} />
      </div>

      {/* Image and Vacancies */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-inner border transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50'}`}>
          <img src={dependency.image} alt={dependency.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-right">
          <span className={`text-3xl sm:text-4xl font-black block leading-none transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{dependency.vacancies}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {dependency.status === 'Últimos Lugares' || dependency.status === 'Pocos Lugares' ? 'Quedan' : 'Vacantes'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`h-2 rounded-full mb-6 sm:mb-8 overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-neutral-50'}`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(dependency.vacancies / dependency.maxVacancies) * 100}%` }}
          className={`h-full rounded-full ${barColors[dependency.status as keyof typeof barColors]}`} 
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 space-y-2 mb-6 sm:mb-8">
        <h4 className={`text-lg sm:text-xl font-black tracking-tight leading-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-200' : 'text-brand-blue'}`}>{dependency.name}</h4>
        <p className="text-xs sm:text-sm font-bold text-brand-teal uppercase tracking-widest">{dependency.subCategory}</p>
      </div>

      {/* Location */}
      <div className={`flex items-center gap-2 mb-6 sm:mb-8 transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
        <MapPin size={16} className="flex-shrink-0 text-brand-orange" />
        <span className="text-[10px] font-black uppercase tracking-widest truncate">{dependency.location}</span>
      </div>

      {/* Action Button */}
      <button 
        onClick={onViewDetails}
        className={`w-full border-2 font-black py-4 sm:py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-sm ${isDarkMode ? 'bg-[#1a2333] border-neutral-800 text-neutral-400 hover:text-white hover:border-brand-teal' : 'bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white border-transparent hover:border-brand-blue'}`}
      >
        <span className="text-xs sm:text-sm uppercase tracking-[0.2em]">Explorar Vacante</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

function NavItem({ 
  icon, 
  label, 
  active = false, 
  locked = false, 
  onClick,
  isDarkMode
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  locked?: boolean, 
  onClick: () => void,
  isDarkMode?: boolean
}) {
  return (
    <button 
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative group ${
        active 
          ? isDarkMode 
            ? 'bg-brand-teal/10 text-brand-teal font-black shadow-[0_0_20px_rgba(0,191,165,0.1)]' 
            : 'bg-brand-teal/5 text-brand-blue font-black' 
          : isDarkMode
            ? 'text-neutral-600 hover:bg-[#1a2333] hover:text-neutral-400'
            : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'
      } ${locked ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <span className={`transition-colors font-bold ${active ? 'text-brand-teal' : isDarkMode ? 'text-neutral-700 group-hover:text-neutral-500' : 'text-neutral-400 group-hover:text-neutral-500'}`}>{icon}</span>
        <span className="text-sm tracking-tight">{label}</span>
      </div>
      {active && (
        <motion.div 
          layoutId="activeNav"
          className="absolute inset-y-2 left-2 w-1.5 bg-brand-teal rounded-full shadow-[0_0_10px_rgba(0,191,165,0.4)]"
        />
      )}
      {locked && <Lock size={14} className={isDarkMode ? "text-neutral-800" : "text-neutral-300"} />}
    </button>
  );
}

function StatusCard({ title, status, icon, color, description, isDarkMode }: { title: string, status: string, icon: React.ReactNode, color: string, description: string, isDarkMode?: boolean }) {
  return (
    <div className={`p-8 rounded-[2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{title}</h3>
        <div className={`p-2 rounded-lg border transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50 border-neutral-100'}`}>
          {icon}
        </div>
      </div>
      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-black mb-4 border transition-colors duration-500 ${color.replace('text-', isDarkMode ? 'text-' : 'text-')}`}>
        {status}
      </div>
      <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>{description}</p>
    </div>
  );
}
