
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu, Loader2, LogOut, Info, User, Building2, FileEdit, FileCheck } from 'lucide-react';
import { Logo, ThemeToggle } from '../Common';
import { UserData, Dependency } from '../../types';
import { useFirebase } from '../FirebaseProvider';
import { signOut } from 'firebase/auth';
import { auth as firebaseAuth } from '../../lib/firebase';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  locked?: boolean;
  onClick?: () => void;
  isDarkMode?: boolean;
}

function NavItem({ icon, label, active, locked, onClick, isDarkMode }: NavItemProps) {
  return (
    <button 
      disabled={locked}
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all relative group
        ${active 
          ? (isDarkMode ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20' : 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20') 
          : (isDarkMode ? 'text-neutral-500 hover:bg-neutral-800 hover:text-white' : 'text-neutral-400 hover:bg-neutral-50 hover:text-brand-blue')}
        ${locked ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeTabIndicator"
          className="absolute left-2 w-1.5 h-6 bg-brand-teal rounded-full"
        />
      )}
      {locked && (
        <div className="ml-auto">
          <X size={14} className="opacity-40" />
        </div>
      )}
    </button>
  );
}

export function Sidebar({ 
  user, 
  activeTab, 
  onTabChange, 
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  isDarkMode,
  onToggleDarkMode,
  dataConfirmed,
  selectedDependency
}: { 
  user: UserData, 
  activeTab: string, 
  onTabChange: (tab: string) => void,
  onLogout: () => void,
  isSidebarOpen: boolean,
  setIsSidebarOpen: (open: boolean) => void,
  isDarkMode: boolean,
  onToggleDarkMode: () => void,
  dataConfirmed: boolean,
  selectedDependency: Dependency | null
}) {
  const { user: firebaseUser, loading: firebaseLoading } = useFirebase();

  const handleFirebaseLogout = async () => {
    try {
      await signOut(firebaseAuth);
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
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
        {user.role !== 'admin' && (
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
        )}

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
                    onClick={() => onTabChange('AdminCatalog')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<FileCheck size={20} />} 
                    label="Revisión de Expedientes" 
                    active={activeTab === 'AdminReviews'} 
                    onClick={() => onTabChange('AdminReviews')}
                    isDarkMode={isDarkMode}
                  />
                </>
              ) : (
                <>
                  <NavItem 
                    icon={<User size={20} />} 
                    label="Mi Perfil" 
                    active={activeTab === 'Profile'} 
                    onClick={() => onTabChange('Profile')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<Building2 size={20} />} 
                    label="Catálogo de Plazas" 
                    active={activeTab === 'Catalog'} 
                    locked={user.role === 'student' && !dataConfirmed}
                    onClick={() => onTabChange('Catalog')}
                    isDarkMode={isDarkMode}
                  />
                  <NavItem 
                    icon={<FileEdit size={20} />} 
                    label="Mis Documentos" 
                    active={activeTab === 'Docs'} 
                    locked={!selectedDependency || (user.role === 'student' && !dataConfirmed)}
                    onClick={() => onTabChange('Docs')}
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
              <span className={`text-sm font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-800'}`}>{user.name}</span>
              <span className={`text-[11px] font-bold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>{user.controlNumber || 'Admin'}</span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-rose-600 hover:text-rose-700 transition-colors text-sm font-bold group w-full text-left"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
