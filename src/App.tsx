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
  Briefcase,
  Menu,
  ArrowRight,
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
  Bot
} from 'lucide-react';
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

// --- Components ---
const Logo = ({ dark = false, showText = true, className = "", size = "normal" }: { dark?: boolean; showText?: boolean; className?: string; size?: "normal" | "small" }) => {
  const isSmall = size === "small";
  const iconSize = isSmall ? "w-8 h-8" : "w-10 h-10";
  const borderSize = isSmall ? "border-[2.5px]" : "border-[3.5px]";
  const dotSize = isSmall ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = isSmall ? "text-lg md:text-xl" : "text-2xl md:text-3xl";

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
          className={`absolute inset-0 ${borderSize} border-l-transparent border-t-transparent rounded-full ${dark ? 'border-brand-blue' : 'border-white'} opacity-30`}
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 ${borderSize} border-r-transparent border-b-transparent rounded-full ${dark ? 'border-brand-blue' : 'border-white'}`}
        />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute -top-1 -right-1 ${dotSize} bg-brand-teal rounded-full border-2 ${dark ? 'border-white' : 'border-brand-blue'} z-20 shadow-[0_0_10px_rgba(0,191,165,0.5)]`} 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className={`absolute -bottom-1 -right-1 ${dotSize} bg-brand-orange rounded-full border-2 ${dark ? 'border-white' : 'border-brand-blue'} z-20 shadow-[0_0_10px_rgba(255,152,0,0.5)]`} 
        />
        
        <div className="flex flex-col gap-0.5 z-10">
          <FileText size={isSmall ? 10 : 16} className={dark ? 'text-brand-teal' : 'text-white'} strokeWidth={3} />
          <FileText size={isSmall ? 10 : 16} className={dark ? 'text-brand-orange' : 'text-white'} strokeWidth={3} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSize} font-black tracking-tight leading-none ${dark ? 'text-brand-blue' : 'text-white'}`}>
            Conecta<span className={dark ? 'text-brand-teal' : 'text-brand-teal'}>2</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`h-[2px] w-4 ${dark ? 'bg-brand-orange' : 'bg-brand-orange'}`}></span>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? 'text-neutral-400' : 'text-white/60'}`}>Portal Alumno</p>
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
  const [user, setUser] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [tempUser, setTempUser] = useState<UserData | null>(null);

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
  };

  return (
    <div className="selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence mode="wait">
        {!user && !isVerifying && !showRequirements && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {isVerifying && tempUser && (
          <VerificationModal 
            user={tempUser} 
            onComplete={handleVerificationComplete} 
          />
        )}

        {showRequirements && tempUser && (
          <RequirementsModal 
            user={tempUser} 
            onClose={() => setShowRequirements(false)} 
          />
        )}

        {user && !isVerifying && (
          <Dashboard user={user} onLogout={handleLogout} onUpdateProfile={setUser} />
        )}
      </AnimatePresence>
      <ChatBot />
    </div>
  );
}

// --- Verification Modal ---
function VerificationModal({ user, onComplete }: { user: UserData, onComplete: (success: boolean) => void }) {
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

// --- Login Component ---
function LoginPage({ onLogin }: { onLogin: (u: UserData) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setIsLoggingIn(true);
    
    // Simulate initial check
    setTimeout(() => {
      const user = Object.values(MOCK_USERS).find(
        u => (u.role === 'student' && u.controlNumber === username) ||
             (u.role === 'admin' && username === 'admin')
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Usuario no encontrado. Verifica tus datos.');
        setIsLoggingIn(false);
      }
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden selection:bg-brand-teal/30"
    >
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
        <div className="absolute top-12 left-12 z-10">
          <Logo />
        </div>

        {/* Quote Card */}
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/20 p-12 rounded-[2.5rem] text-white shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 blur-[60px] group-hover:bg-brand-teal/30 transition-colors"></div>
            <Quote className="w-12 h-12 text-brand-teal mb-6 opacity-50" />
            <h2 className="text-4xl font-black leading-[1.1] mb-8 tracking-tight">
              Diseña tu <span className="text-brand-teal underline decoration-brand-orange underline-offset-8">camino</span> profesional.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-medium mb-10 italic">
              "Simplificando tu camino hacia el éxito profesional."
            </p>
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:border-brand-teal/30 transition-colors">
              <Logo size="small" showText={false} />
              <div>
                <h4 className="font-bold text-base text-white">Departamento Conecta2</h4>
                <p className="text-sm text-white/50 tracking-wider font-bold">Plataforma Profesional</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-16 xl:p-24 relative z-10 bg-neutral-50 lg:bg-white overflow-y-auto custom-scrollbar">
        <div className="max-w-md mx-auto lg:mx-0 w-full animate-in fade-in slide-in-from-right-10 duration-700">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-16">
            <Logo dark={true} />
          </div>

          {/* Welcome Text */}
          <div className="mb-14">
            <h2 className="text-5xl font-black text-brand-blue mb-4 tracking-tighter">¡Hola de nuevo!</h2>
            <p className="text-neutral-500 leading-relaxed text-lg font-medium">
              Ingresa tus datos para acceder a tu panel de vinculación profesional <span className="text-brand-teal">Conecta2</span>.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 font-bold px-4 py-4 rounded-xl text-sm flex items-center gap-3 overflow-hidden shadow-sm"
                >
                  <AlertCircle size={20} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">
                Número de Control / Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand-teal transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. 19530001 o admin"
                  disabled={isLoggingIn}
                  className="w-full pl-11 pr-4 py-4 bg-white lg:bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">
                Contraseña de Acceso
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-brand-teal transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  className="w-full pl-11 pr-12 py-4 bg-white lg:bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50 font-bold"
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
                    className="peer appearance-none w-6 h-6 border-2 border-neutral-200 rounded-lg checked:bg-brand-blue checked:border-brand-blue transition-all cursor-pointer box-content"
                  />
                  <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm font-bold text-neutral-500 group-hover:text-brand-blue transition-colors">Mantener sesión activa</span>
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

          {/* Support Link */}
          <div className="mt-12 text-center lg:text-left p-6 bg-brand-teal/5 border border-brand-teal/10 rounded-3xl">
            <p className="text-sm text-neutral-500 font-bold">
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
            <SupportModal onClose={() => setShowSupportModal(false)} />
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-12 lg:mt-0">
          <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.3em]">
            © 2026 CONECTA2
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Support Modal Component ---
function SupportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/60 backdrop-blur-xl p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-brand-blue z-10"
        >
          <X size={24} />
        </button>

        <div className="p-10 sm:p-14">
          <div className="w-20 h-20 bg-brand-teal/10 rounded-3xl flex items-center justify-center mb-10 shadow-inner group">
            <HelpCircle className="text-brand-teal w-10 h-10 group-hover:scale-110 transition-transform" />
          </div>
          
          <h3 className="text-4xl font-black text-brand-blue mb-4 tracking-tighter">Centro de Ayuda</h3>
          <p className="text-neutral-500 font-medium mb-12">Si presentas inconvenientes para ingresar, sigue estas instrucciones según tu caso.</p>
          
          <div className="space-y-8">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex gap-6 p-6 rounded-3xl bg-neutral-50 border border-neutral-100 hover:border-brand-teal/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-neutral-100 group-hover:shadow-md transition-all">
                <GraduationCap className="text-brand-teal w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-blue mb-1">Estatus Académico</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                  Contacta a <span className="text-brand-blue font-bold">Coordinación Académica</span> para verificar si cumples con el porcentaje de créditos necesario.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-6 p-6 rounded-3xl bg-neutral-50 border border-neutral-100 hover:border-brand-orange/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-neutral-100 group-hover:shadow-md transition-all">
                <Key className="text-brand-orange w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-blue mb-1">Restablecer Contraseña</h4>
                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                  Acude al <span className="text-brand-blue font-bold">Departamento de Sistemas</span> para verificar la vigencia de tu cuenta de usuario.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full mt-12 py-5 bg-brand-blue text-white font-black rounded-3xl shadow-xl shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all text-lg tracking-tight"
          >
            Entendido, gracias
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Dashboard Component ---
function Dashboard({ user, onLogout, onUpdateProfile }: { user: UserData, onLogout: () => void, onUpdateProfile: (u: UserData) => void }) {
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
      className="min-h-screen bg-[#f8fafc] font-sans text-neutral-900 flex flex-col lg:flex-row"
    >
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo dark={true} size="small" />
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-neutral-500 hover:bg-neutral-50 rounded-xl transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
        fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-neutral-100 p-8 flex flex-col transition-transform duration-300 w-80
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 mb-12">
          <Logo dark={true} />
        </div>

        <div className="flex-1 space-y-10">
          <div>
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">Menú Principal</h3>
            <nav className="space-y-3">
              {user.role === 'admin' ? (
                <>
                  <NavItem 
                    icon={<Building2 size={20} />} 
                    label="Gestión de Catálogo" 
                    active={activeTab === 'AdminCatalog'} 
                    onClick={() => handleTabChange('AdminCatalog')}
                  />
                  <NavItem 
                    icon={<FileCheck size={20} />} 
                    label="Revisión de Expedientes" 
                    active={activeTab === 'AdminReviews'} 
                    onClick={() => handleTabChange('AdminReviews')}
                  />
                </>
              ) : (
                <>
                  <NavItem 
                    icon={<User size={20} />} 
                    label="Mi Perfil" 
                    active={activeTab === 'Profile'} 
                    onClick={() => handleTabChange('Profile')}
                  />
                  <NavItem 
                    icon={<Building2 size={20} />} 
                    label="Catálogo de Plazas" 
                    active={activeTab === 'Catalog'} 
                    locked={user.role === 'student' && !dataConfirmed}
                    onClick={() => handleTabChange('Catalog')}
                  />
                  <NavItem 
                    icon={<FileEdit size={20} />} 
                    label="Mis Documentos" 
                    active={activeTab === 'Docs'} 
                    locked={!selectedDependency || (user.role === 'student' && !dataConfirmed)}
                    onClick={() => handleTabChange('Docs')}
                  />
                </>
              )}
            </nav>
          </div>
        </div>

        {/* User Profile Bottom */}
        <div className="pt-8 border-t border-neutral-50 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-sm border border-neutral-200">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-800">{user.name}</span>
              <span className="text-[11px] text-neutral-400 font-bold tracking-tight">{user.controlNumber || 'Admin'}</span>
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
              <AdminCatalogView />
            ) : activeTab === 'AdminReviews' ? (
              <AdminReviewsView />
            ) : activeTab === 'Profile' ? (
              <ProfileView 
                user={user} 
                onUpdateProfile={onUpdateProfile} 
                dataConfirmed={dataConfirmed}
                onConfirmData={() => setDataConfirmed(true)}
              />
            ) : user.role === 'student' && !dataConfirmed && (activeTab === 'Catalog' || activeTab === 'Docs') ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center mb-10 border border-brand-orange/20 shadow-xl shadow-brand-orange/5">
                  <Lock size={40} className="text-brand-orange" />
                </div>
                <h3 className="text-3xl font-black text-brand-blue mb-4 tracking-tight">Acceso Bloqueado</h3>
                <p className="text-neutral-500 font-medium leading-relaxed mb-10">
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
              />
            ) : activeTab === 'Docs' && selectedDependency ? (
              <DocumentsView />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-neutral-400">
                <Lock size={48} className="mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Sección Bloqueada</p>
                <p className="text-sm mt-2">Primero debes seleccionar una plaza en el catálogo para habilitar tus documentos.</p>
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
  onConfirmData 
}: { 
  user: UserData, 
  onUpdateProfile?: (u: UserData) => void,
  dataConfirmed?: boolean,
  onConfirmData?: () => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editForm, setEditForm] = useState<UserData>(user);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          className="bg-brand-teal/5 border border-brand-teal/20 rounded-[2rem] p-8 mb-10 flex items-start gap-6 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 blur-[50px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
          <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center shrink-0 border border-brand-teal/20">
            <Info className="text-brand-teal w-6 h-6" />
          </div>
          <div>
            <h3 className="text-brand-blue font-black text-xl mb-2 tracking-tight">Verifica tu información</h3>
            <p className="text-neutral-500 font-medium leading-relaxed">
              Es fundamental que tu <span className="text-brand-blue font-bold">Número de Control</span>, <span className="text-brand-blue font-bold">Correo Institucional</span> y <span className="text-brand-blue font-bold">Carrera</span> coincidan exactamente con tus registros oficiales para evitar errores en tu documentación.
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] border border-neutral-100 shadow-xl shadow-brand-blue/5 p-8 sm:p-14 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-blue to-brand-orange opacity-60"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-14 pb-14 border-b border-neutral-50">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-28 h-28 rounded-[2.5rem] bg-neutral-100 flex items-center justify-center text-neutral-400 font-black text-4xl border-4 border-white shadow-2xl overflow-hidden relative"
              >
                {(isEditing ? editForm.profilePicture : user.profilePicture) ? (
                  <img src={isEditing ? editForm.profilePicture : user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-brand-blue/30">{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
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
              
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-teal rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-brand-blue tracking-tighter">{user.name}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-teal/10 text-brand-teal'}`}>
                  {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </span>
                <span className="text-neutral-300 font-bold">•</span>
                <p className="text-neutral-400 font-bold text-sm">Activo en plataforma</p>
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
              className="bg-neutral-50 text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all self-start sm:self-auto shadow-sm hover:shadow-xl hover:shadow-brand-blue/20"
            >
              <Edit size={20} className="text-brand-teal" />
              <span>Personalizar Perfil</span>
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="sm:col-span-2 group">
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors">Nombre de Usuario</label>
            {isEditing ? (
              <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.name}</div>
            )}
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Número de Control</label>
            <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-neutral-400 font-black shadow-inner uppercase tracking-widest">{user.controlNumber}</div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Programa Académico</label>
            <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-neutral-400 font-black shadow-inner truncate">{user.career || 'General'}</div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Ciclo Escolar</label>
            {isEditing ? (
              <input type="text" value={editForm.semester || ''} onChange={e => setEditForm({...editForm, semester: e.target.value})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.semester || 'No asignado'}</div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Progreso Carrera</label>
            <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 flex items-center justify-between shadow-inner">
              <span className="font-black text-brand-teal">{user.academicStats?.careerProgress || 0}%</span>
              <div className="w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user.academicStats?.careerProgress || 0}%` }}
                  className="h-full bg-brand-teal rounded-full"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Género</label>
            {isEditing ? (
              <select value={editForm.gender || ''} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner">
                <option value="">Selecciona uno...</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </select>
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.gender || 'No especificado'}</div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 text-balance">Fecha de Nacimiento</label>
            {isEditing ? (
              <input type="date" value={editForm.birthDate || ''} onChange={e => setEditForm({...editForm, birthDate: e.target.value})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.birthDate || 'No especificada'}</div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Canal de Contacto</label>
            {isEditing ? (
              <input type="tel" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.phone || 'Sin teléfono'}</div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 text-balance">Correo de Acceso</label>
            <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-neutral-400 font-black shadow-inner truncate">{user.email || 'No asignado'}</div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1">Identificador Único (NSS)</label>
            {isEditing ? (
              <input type="text" value={editForm.nss || ''} onChange={e => setEditForm({...editForm, nss: e.target.value})} maxLength={11} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
            ) : (
              <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner uppercase tracking-[0.2em]">{user.nss || 'No registrado'}</div>
            )}
          </div>
          
          <div className="sm:col-span-2 mt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-8 bg-brand-orange"></div>
              <h4 className="text-sm font-black text-brand-blue uppercase tracking-[0.2em]">Residencia Actual</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="group">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors text-balance">Dirección (Calle y Número)</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.street || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), street: e.target.value}})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
                ) : (
                  <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.address?.street || 'Sin registrar'}</div>
                )}
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors">Localidad / Colonia</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.neighborhood || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), neighborhood: e.target.value}})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
                ) : (
                  <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.address?.neighborhood || 'Sin registrar'}</div>
                )}
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors">Código Postal</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.zipCode || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), zipCode: e.target.value}})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
                ) : (
                  <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner tracking-widest">{user.address?.zipCode || '00000'}</div>
                )}
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors">Ciudad / Municipio</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.city || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), city: e.target.value}})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
                ) : (
                  <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.address?.city || 'Sin registrar'}</div>
                )}
              </div>
              <div className="sm:col-span-2 group">
                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3 ml-1 group-focus-within:text-brand-teal transition-colors">Estado / Entidad</label>
                {isEditing ? (
                  <input type="text" value={editForm.address?.state || ''} onChange={e => setEditForm({...editForm, address: {...(editForm.address || {street:'', neighborhood:'', zipCode:'', city:'', state:''}), state: e.target.value}})} className="w-full bg-neutral-50 px-6 py-4 rounded-[1.5rem] border-2 border-transparent focus:bg-white focus:border-brand-teal text-neutral-800 font-bold outline-none transition-all shadow-inner" />
                ) : (
                  <div className="bg-neutral-50 px-6 py-5 rounded-[1.5rem] border border-neutral-100 text-brand-blue font-bold shadow-inner">{user.address?.state || 'Sin registrar'}</div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-10 sm:p-14 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-blue"></div>
            <div className="w-20 h-20 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-orange/20">
              <AlertCircle className="w-10 h-10 text-brand-orange" />
            </div>
            
            <h3 className="text-3xl font-black text-brand-blue mb-4 tracking-tighter">Validación de Datos</h3>
            <p className="text-neutral-500 font-medium leading-relaxed mb-10">
              Confirma que toda tu información sea correcta. La <span className="text-brand-orange font-bold">precisión de tus datos</span> es vital para la validez de tu documentación oficial.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  onConfirmData?.();
                  setShowConfirmModal(false);
                }}
                className="w-full py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-[#162a45] transition-all shadow-xl shadow-brand-blue/20"
              >
                Sí, mis datos son correctos
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-5 bg-neutral-50 text-neutral-400 font-black rounded-2xl hover:bg-neutral-100 transition-all text-xs uppercase tracking-widest"
              >
                Revisar nuevamente
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// --- Admin Views ---
function AdminCatalogView() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">Gestión de Catálogo</h2>
          <p className="text-base sm:text-lg font-medium text-neutral-400 mt-2">Administra las dependencias y plazas disponibles para servicio social.</p>
        </div>
        <button className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-4 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20 transition-all active:scale-95 whitespace-nowrap group">
          <Plus size={22} className="group-hover:rotate-90 transition-transform" />
          <span>Nueva Dependencia</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Dependencia</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Categoría</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Vacantes</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {DEPENDENCIES.map((dep) => (
                <tr key={dep.id} className="hover:bg-brand-teal/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-50 shadow-sm group-hover:shadow-md transition-shadow">
                        <img src={dep.image} alt={dep.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-black text-brand-blue tracking-tight">{dep.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-500">{dep.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-neutral-700">{dep.vacancies} / {dep.maxVacancies}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-teal/10 text-brand-teal">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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

function AdminReviewsView() {
  const mockStudents = [
    { id: '1', name: 'Carlos Mendoza', control: '21530321', career: 'Ing. Sistemas', status: 'Pendiente Revisión', date: '24 Mar 2026' },
    { id: '2', name: 'Ana Sofía López', control: '21530112', career: 'Ing. Industrial', status: 'Aprobado', date: '23 Mar 2026' },
    { id: '3', name: 'Luis Ramírez', control: '20530998', career: 'Administración', status: 'Rechazado', date: '22 Mar 2026' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">Revisión de Expedientes</h2>
          <p className="text-base sm:text-lg font-medium text-neutral-400 mt-2">Evalúa los documentos técnicos y genera las cartas de liberación.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-brand-teal transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o número de control..." 
              className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all text-sm font-bold shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Alumno</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Carrera</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Envío</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-brand-teal/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-brand-blue tracking-tight">{student.name}</span>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{student.control}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-neutral-500">{student.career}</td>
                  <td className="px-8 py-6 text-sm font-bold text-neutral-300">{student.date}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.status === 'Aprobado' ? 'bg-brand-teal/10 text-brand-teal' :
                      student.status === 'Rechazado' ? 'bg-brand-orange/10 text-brand-orange' :
                      'bg-brand-blue/10 text-brand-blue'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
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

function DocumentsView() {
  const documents = [
    {
      id: '1',
      title: 'Formato de Solicitud',
      description: 'Solicitud oficial de asignación',
      status: 'APROBADO',
      lastModified: '15 Mar 2026',
    },
    {
      id: '2',
      title: 'Carta Compromiso',
      description: 'Aceptación de términos y lineamientos',
      status: 'EN REVISIÓN',
      lastModified: '17 Mar 2026',
    },
    {
      id: '3',
      title: 'Reporte Bimestral 1',
      description: 'Resumen de actividades meses 1 y 2',
      status: 'RECHAZADO',
      lastModified: '18 Mar 2026',
    },
    {
      id: '4',
      title: 'Reporte Bimestral 2',
      description: 'Resumen de actividades meses 3 y 4',
      status: 'BORRADOR',
      lastModified: '18 Mar 2026',
    },
    {
      id: '5',
      title: 'Reporte Bimestral 3',
      description: 'Resumen de actividades meses 5 y 6',
      status: 'PENDIENTE',
      lastModified: null,
    },
    {
      id: '6',
      title: 'Carta de Terminación',
      description: 'Documento final de liberación',
      status: 'PENDIENTE',
      lastModified: null,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight">Mis Documentos</h2>
        <p className="text-base sm:text-lg font-medium text-neutral-400 mt-2">Gestiona y edita tu expediente de servicio social en línea.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
        {documents.map((doc) => (
          <div key={doc.id}>
            <DocumentCard doc={doc} />
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
}

function DocumentCard({ doc }: DocumentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return {
          bg: 'bg-brand-teal/10',
          text: 'text-brand-teal',
          border: 'border-brand-teal/20',
          icon: <CheckCircle2 size={14} />,
          label: 'Verificado'
        };
      case 'EN REVISIÓN':
        return {
          bg: 'bg-brand-orange/10',
          text: 'text-brand-orange',
          border: 'border-brand-orange/20',
          icon: <Clock size={14} />,
          label: 'En Proceso'
        };
      case 'RECHAZADO':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          border: 'border-rose-100',
          icon: <AlertCircle size={14} />,
          label: 'Requiere Atención'
        };
      case 'BORRADOR':
        return {
          bg: 'bg-brand-blue/10',
          text: 'text-brand-blue',
          border: 'border-brand-blue/20',
          icon: <PenLine size={14} />,
          label: 'Borrador'
        };
      default:
        return {
          bg: 'bg-neutral-50',
          text: 'text-neutral-400',
          border: 'border-neutral-100',
          icon: <FileText size={14} />,
          label: 'Pendiente'
        };
    }
  };

  const status = getStatusConfig(doc.status);
  const isActionable = ['RECHAZADO', 'BORRADOR', 'PENDIENTE'].includes(doc.status);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-teal group-hover:text-white transition-all shadow-inner">
          <FileEdit size={24} />
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border} text-[10px] font-black tracking-widest uppercase`}>
          {status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="text-xl font-black text-brand-blue tracking-tight">{doc.title}</h3>
        <p className="text-sm font-medium text-neutral-400 leading-relaxed">{doc.description}</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
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
          <button className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-teal/20 active:scale-[0.98] group">
            <PenLine size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Llenar Documento</span>
          </button>
        ) : (
          <button className="w-full py-4 bg-neutral-50 hover:bg-white hover:border-brand-blue/30 border-2 border-transparent text-brand-blue rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm">
            <Eye size={18} className="text-brand-teal" />
            <span>Ver Documento</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function CatalogView({ onSelectDependency }: { onSelectDependency: (dep: Dependency) => void }) {
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
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-teal transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por dependencia, categoría o ubicación..."
            className="w-full pl-16 pr-6 py-5 bg-white border border-neutral-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal outline-none transition-all placeholder:text-neutral-400 font-bold"
          />
        </div>
        <button 
          onClick={() => setShowNewAgreementNotice(true)}
          className="flex items-center justify-center gap-3 px-8 py-5 bg-white border border-neutral-200 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-brand-teal/5 transition-all text-sm font-black text-brand-blue active:scale-95 group"
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
            <div key={i} className="bg-white rounded-[2rem] p-8 h-[400px] animate-pulse border border-neutral-50">
              <div className="h-4 w-24 bg-neutral-100 rounded-full mb-8" />
              <div className="flex justify-between mb-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl" />
                <div className="w-12 h-12 bg-neutral-100 rounded-xl" />
              </div>
              <div className="h-2 bg-neutral-100 rounded-full mb-8" />
              <div className="space-y-3">
                <div className="h-6 bg-neutral-100 rounded-lg w-3/4" />
                <div className="h-4 bg-neutral-100 rounded-lg w-1/2" />
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
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-neutral-400"
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
          />
        )}
      </AnimatePresence>

      {/* New Agreement Notice Modal */}
      <AnimatePresence>
        {showNewAgreementNotice && (
          <NewAgreementNoticeModal 
            onClose={() => setShowNewAgreementNotice(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewAgreementNoticeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-blue/60 backdrop-blur-xl p-4 sm:p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[95vh] relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 hover:bg-black/5 rounded-full transition-colors text-black/40 hover:text-black z-20"
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
          <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-[2rem] p-8 mb-12 flex items-start gap-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center shrink-0">
              <Info className="text-brand-teal" size={28} />
            </div>
            <p className="text-brand-blue font-bold text-base sm:text-lg leading-relaxed">
              Por motivos de protocolos de seguridad interna, el trámite de propuesta de nuevo convenio se realizará de manera <span className="text-brand-teal underline decoration-2 underline-offset-4">estrictamente presencial</span> en las oficinas de Conecta2.
            </p>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-10 sm:mb-12 font-medium text-base sm:text-lg">
            Si deseas proponer un nuevo convenio, considera los siguientes puntos antes de acudir a la oficina:
          </p>

          <div className="space-y-8 sm:space-y-10">
            {/* Tiempos de Trámite */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0 border border-neutral-100 shadow-sm">
                <Clock className="w-7 h-7 text-brand-orange" />
              </div>
              <div>
                <h4 className="font-black text-brand-blue mb-1.5 text-base sm:text-lg">Tiempos de Trámite</h4>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  El trámite de formalización tarda <span className="font-bold text-brand-blue">varios meses</span>. Si tienes prisa por liberar tu servicio, te recomendamos elegir una plaza existente.
                </p>
              </div>
            </div>

            {/* Vigencia Obligatoria */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0 border border-neutral-100 shadow-sm">
                <Calendar className="w-7 h-7 text-brand-teal" />
              </div>
              <div>
                <h4 className="font-black text-brand-blue mb-1.5 text-base sm:text-lg">Vigencia Obligatoria</h4>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  El convenio tendrá una vigencia obligatoria mínima de <span className="font-bold text-brand-blue">3 años</span> para futuras generaciones.
                </p>
              </div>
            </div>

            {/* Requisito Documental */}
            <div className="flex items-start gap-5 sm:gap-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center flex-shrink-0 border border-neutral-100 shadow-sm">
                <FileText className="w-7 h-7 text-brand-blue" />
              </div>
              <div>
                <h4 className="font-black text-brand-blue mb-1.5 text-base sm:text-lg">Requisito Documental</h4>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  La empresa debe tener su documentación legal completa (Acta Constitutiva, Poder Notarial, RFC, etc.) lista para entrega inmediata.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <button 
              onClick={onClose}
              className="w-full py-4 sm:py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-blue/90 transition-all active:scale-95 shadow-xl shadow-brand-blue/20 text-base sm:text-lg"
            >
              Entendido, volver al catálogo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DependencyDetailsModal({ dependency, onClose, onSelect }: { dependency: Dependency, onClose: () => void, onSelect: () => void }) {
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
          <div className="w-20 h-20 bg-brand-teal/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-teal/20">
            <CheckCircle2 className="text-brand-teal w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-brand-blue mb-4 tracking-tight">¡Solicitud Enviada!</h3>
          <p className="text-neutral-500 font-medium leading-relaxed mb-10">
            Tu solicitud para <span className="font-bold text-brand-blue">{dependency.name}</span> ha sido registrada con éxito. 
            Pronto recibirás noticias en tu correo académico.
          </p>
          <button 
            onClick={() => {
              onClose();
              onSelect();
            }}
            className="w-full py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-[#162a45] transition-all shadow-xl shadow-brand-blue/20"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[3.5rem] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] relative"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-blue to-brand-orange"></div>
          {/* Header */}
          <div className="p-10 sm:p-12 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-neutral-50 shadow-inner border border-neutral-100 flex-shrink-0">
                <img src={dependency.image} alt={dependency.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-brand-blue tracking-tight leading-tight">{dependency.name}</h3>
                <p className="text-base sm:text-lg font-bold text-brand-teal mt-1 uppercase tracking-widest">{dependency.subCategory}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-4 text-neutral-300 hover:text-brand-orange hover:bg-brand-orange/5 rounded-2xl transition-all"
            >
              <X size={32} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-10 sm:p-16 space-y-16 custom-scrollbar">
            {/* Objective */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-brand-blue">
                <Info size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Objetivo del Programa</h4>
              </div>
              <div className="bg-brand-teal/5 border border-brand-teal/10 rounded-[2rem] p-8">
                <p className="text-neutral-600 leading-relaxed font-medium text-sm sm:text-base">
                  {dependency.objective || 'No hay un objetivo definido para este programa.'}
                </p>
              </div>
            </section>

            {/* Activities */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-brand-blue">
                <Briefcase size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Actividades a Realizar</h4>
              </div>
              <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-[2rem] p-8 space-y-5">
                {dependency.activities?.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 p-1 bg-brand-orange/10 rounded-full">
                      <CheckCircle2 size={16} className="text-brand-orange" />
                    </div>
                    <span className="text-neutral-600 font-bold text-sm sm:text-base leading-relaxed">{activity}</span>
                  </div>
                ))}
                {!dependency.activities?.length && (
                  <p className="text-neutral-400 text-sm italic">No se han especificado actividades.</p>
                )}
              </div>
            </section>

            {/* Contact & Location */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-brand-blue">
                <Users size={24} className="text-brand-teal" />
                <h4 className="text-sm font-black uppercase tracking-[0.2em]">Contacto y Ubicación</h4>
              </div>
              <div className="bg-neutral-50 rounded-[2.5rem] p-10 border border-neutral-100 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Titular */}
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-brand-blue/40" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2">Titular del Programa</p>
                      <p className="text-sm sm:text-base font-black text-brand-blue tracking-tight">{dependency.contact?.titular || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={24} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2">Teléfono Directo</p>
                      <p className="text-sm sm:text-base font-black text-brand-blue tracking-tight">{dependency.contact?.phone || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={24} className="text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2">Correo Institucional</p>
                      <p className="text-sm sm:text-base font-black text-brand-teal hover:text-brand-blue transition-colors cursor-pointer break-all">{dependency.contact?.email || 'No disponible'}</p>
                    </div>
                  </div>
                  {/* Schedule */}
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={24} className="text-brand-blue/40" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2">Horario de Operación</p>
                      <p className="text-sm sm:text-base font-black text-brand-blue tracking-tight">{dependency.contact?.schedule || 'No disponible'}</p>
                    </div>
                  </div>
                </div>
                {/* Address */}
                <div className="mt-12 pt-12 border-t border-neutral-200/60 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-2">Dirección de la Institución</p>
                    <p className="text-sm sm:text-base font-bold text-neutral-600 leading-relaxed">{dependency.contact?.address || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-8 sm:p-10 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-8 sticky bottom-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-brand-teal animate-pulse" />
              <span className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">{dependency.vacancies} vacantes disponibles</span>
            </div>
            <div className="flex items-center gap-5 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-10 py-5 bg-white border-2 border-neutral-200 text-neutral-400 font-bold rounded-2xl hover:bg-neutral-50 hover:text-neutral-600 transition-all active:scale-95 text-base"
              >
                Cerrar
              </button>
              <button 
                onClick={() => setShowConfirmation(true)}
                className="flex-1 sm:flex-none px-10 py-5 bg-brand-teal text-white font-black rounded-2xl hover:bg-brand-teal/90 transition-all active:scale-95 shadow-xl shadow-brand-teal/20 flex items-center justify-center gap-3 text-base group"
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 blur-[40px]"></div>
              
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="text-brand-orange w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-brand-blue mb-4 tracking-tighter text-balance">¿Confirmar selección?</h3>
              <p className="text-neutral-500 leading-relaxed mb-10 font-medium">
                Estás por seleccionar <span className="font-bold text-brand-blue">{dependency.name}</span> como tu dependencia principal.
                <br /><br />
                <span className="text-brand-orange font-black uppercase text-[10px] tracking-widest block mb-2">Aviso Importante</span>
                Puedes cambiar de dependencia más adelante, pero esto podría reiniciar tu conteo de horas acumuladas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-neutral-100 text-neutral-400 font-black rounded-2xl hover:bg-neutral-200 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-[#162a45] transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 disabled:opacity-70 group"
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
}

const DependencyCard: React.FC<DependencyCardProps> = ({ dependency, onViewDetails }) => {
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
      className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col p-6 sm:p-8"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <span className={`text-[10px] font-black uppercase tracking-widest ${statusColors[dependency.status]}`}>
          {dependency.status}
        </span>
        <div className={`w-2 h-2 rounded-full ${barColors[dependency.status]}`} />
      </div>

      {/* Image and Vacancies */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-neutral-50 shadow-inner">
          <img src={dependency.image} alt={dependency.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-right">
          <span className="text-3xl sm:text-4xl font-black text-neutral-900 block leading-none">{dependency.vacancies}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            {dependency.status === 'Últimos Lugares' || dependency.status === 'Pocos Lugares' ? 'Quedan' : 'Vacantes'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-neutral-50 rounded-full mb-6 sm:mb-8 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(dependency.vacancies / dependency.maxVacancies) * 100}%` }}
          className={`h-full rounded-full ${barColors[dependency.status]}`} 
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 space-y-2 mb-6 sm:mb-8">
        <h4 className="text-lg sm:text-xl font-black text-brand-blue tracking-tight leading-tight">{dependency.name}</h4>
        <p className="text-xs sm:text-sm font-bold text-brand-teal uppercase tracking-widest">{dependency.subCategory}</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-neutral-400 mb-6 sm:mb-8">
        <MapPin size={16} className="flex-shrink-0 text-brand-orange" />
        <span className="text-[10px] font-black uppercase tracking-widest truncate">{dependency.location}</span>
      </div>

      {/* Action Button */}
      <button 
        onClick={onViewDetails}
        className="w-full bg-neutral-50 hover:bg-brand-blue text-brand-blue hover:text-white border-2 border-transparent hover:border-brand-blue font-black py-4 sm:py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-sm"
      >
        <span className="text-xs sm:text-sm uppercase tracking-[0.2em]">Explorar Vacante</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}

function NavItem({ icon, label, active = false, locked = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, locked?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative group ${
        active 
          ? 'bg-brand-teal/5 text-brand-blue font-black' 
          : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'
      } ${locked ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <span className={`transition-colors font-bold ${active ? 'text-brand-teal' : 'text-neutral-400 group-hover:text-neutral-500'}`}>{icon}</span>
        <span className="text-sm tracking-tight">{label}</span>
      </div>
      {active && (
        <motion.div 
          layoutId="activeNav"
          className="absolute inset-y-2 left-2 w-1.5 bg-brand-teal rounded-full shadow-[0_0_10px_rgba(0,191,165,0.4)]"
        />
      )}
      {locked && <Lock size={14} className="text-neutral-300" />}
    </button>
  );
}

function StatusCard({ title, status, icon, color, description }: { title: string, status: string, icon: React.ReactNode, color: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">{title}</h3>
        <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
          {icon}
        </div>
      </div>
      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-lg font-black mb-4 border ${color}`}>
        {status}
      </div>
      <p className="text-sm text-neutral-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
