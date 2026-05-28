import React from 'react';
import { motion } from 'motion/react';
import { Building2, Info, ArrowUpRight, GraduationCap, HeartPulse, Users, Gavel, CheckCircle2 } from 'lucide-react';
import { Dependency } from '../../types';

export function DependencyCard({ 
  dependency, 
  onViewDetails, 
  isDarkMode,
  isSelected
}: { 
  dependency: Dependency, 
  onViewDetails: () => void,
  isDarkMode?: boolean,
  isSelected?: boolean
}) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className={`group rounded-[2.5rem] p-8 border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden flex flex-col h-full ${
        isSelected
          ? (isDarkMode ? 'bg-[#121926]/90 border-brand-teal shadow-lg shadow-brand-teal/5' : 'bg-white border-brand-teal shadow-lg shadow-brand-teal/5')
          : (isDarkMode ? 'bg-[#121926] border-neutral-800 hover:shadow-brand-teal/5' : 'bg-white border-neutral-100 hover:shadow-brand-teal/5')
      }`}
      onClick={onViewDetails}
    >
      <div className={`absolute inset-0 bg-brand-teal/[0.02] pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 blur-[60px] -translate-y-12 translate-x-12 rounded-full transition-colors group-hover:bg-brand-teal/10`} />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-inner group-hover:scale-110 transition-transform duration-500 ${isDarkMode ? 'bg-[#0a0f18] border-neutral-800' : 'bg-neutral-50 border-white'}`}>
          <img src={dependency.image} alt={dependency.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        {isSelected ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00c49f]/10 border border-[#00c49f]/30 text-[10px] font-black uppercase tracking-widest text-[#00c49f] animate-pulse">
            <CheckCircle2 size={12} />
            <span>Seleccionada</span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors ${
            isDarkMode 
              ? 'bg-neutral-900/50 border-neutral-800 text-neutral-500 group-hover:text-brand-teal' 
              : 'bg-neutral-50 border-neutral-100 text-neutral-400 group-hover:text-brand-teal'
          }`}>
            <Info size={12} />
            <span>Detalles</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-10 flex-1 relative z-10">
        <div>
          <h3 className={`text-xl font-black mb-1.5 leading-[1.1] transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>{dependency.name}</h3>
          <p className="text-xs font-black text-brand-teal uppercase tracking-[0.15em]">{dependency.subCategory}</p>
        </div>
        <p className={`text-sm font-medium leading-relaxed line-clamp-3 transition-colors duration-500 ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          {dependency.objective || 'Participa en proyectos de impacto social y profesional en esta destacada institución.'}
        </p>
      </div>

      <div className="pt-8 border-t border-neutral-50 dark:border-neutral-800/50 flex items-center justify-between mt-auto relative z-10">
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isDarkMode ? 'text-neutral-700' : 'text-neutral-300'}`}>Vacantes</span>
          <span className={`text-lg font-black leading-none ${isDarkMode ? 'text-brand-teal' : 'text-brand-teal'}`}>
            {dependency.vacancies} <span className="text-[10px] font-bold text-neutral-400 ml-1">/{dependency.maxVacancies}</span>
          </span>
        </div>
        
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-[#00c49f] text-white shadow-md shadow-[#00c49f]/20'
            : isDarkMode ? 'bg-[#0a0f18] text-neutral-700 group-hover:bg-brand-teal group-hover:text-white' : 'bg-neutral-50 text-neutral-300 group-hover:bg-brand-blue group-hover:text-white group-hover:shadow-lg shadow-brand-blue/20'
        }`}>
          <ArrowUpRight size={20} />
        </div>
      </div>
    </motion.div>
  );
}
