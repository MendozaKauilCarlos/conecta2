
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, ArrowRight, Quote, HelpCircle, Clock, Check, X } from 'lucide-react';
import { ThemeToggle, Logo } from './Common';
import { UserData } from '../types';
import { MOCK_USERS } from '../constants';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as firebaseAuth, db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import * as dbService from '../services/dbService';

export function LoginPage({ 
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
    
    // Bypass for demo/testing
    if (email === 'admin' || password === 'admin') {
      setTimeout(() => {
        onLogin(MOCK_USERS.admin);
        setIsLoggingIn(false);
      }, 1000);
      return;
    }

    if (email === '19530001' || password === '19530001') {
      setTimeout(() => {
        onLogin(MOCK_USERS.student2);
        setIsLoggingIn(false);
      }, 1000);
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const firebaseUser = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        onLogin({
          ...MOCK_USERS.student2,
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Estudiante',
          role: data.role || 'student',
          email: firebaseUser.email || undefined,
          ...data
        });
      } else {
        onLogin({
          ...MOCK_USERS.student2,
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Estudiante',
          email: firebaseUser.email || undefined,
          controlNumber: 'TEMP-' + firebaseUser.uid.substring(0, 5),
          career: 'POR DEFINIR',
        });
        
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

        <div className="absolute top-12 left-12 z-10 flex flex-col items-start gap-6">
          <Logo dark={true} />
        </div>

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

      <div className={`w-full lg:w-[45%] flex flex-col justify-between p-8 lg:p-16 xl:p-24 relative z-10 overflow-y-auto custom-scrollbar transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-white'}`}>
        <div className="max-w-md mx-auto lg:mx-0 w-full animate-in fade-in slide-in-from-right-10 duration-700">
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

          <div className="mb-14">
            <h2 className={`text-5xl font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>¡Hola de nuevo!</h2>
            <p className={`leading-relaxed text-lg font-medium ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Ingresa tus datos para acceder a tu panel de vinculación profesional <span className="text-brand-teal">Conecta2</span>.
            </p>
          </div>

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
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Usuario o correo institucional"
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

        <div className="mt-12 lg:mt-0">
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
            © 2026 CONECTA2
          </p>
        </div>
      </div>
    </motion.div>
  );
}

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
