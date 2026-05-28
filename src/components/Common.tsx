
import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, FileText } from 'lucide-react';

export const ThemeToggle = ({ isDarkMode, onToggle }: { isDarkMode: boolean; onToggle: () => void }) => {
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

export const Logo = ({ dark = false, isDarkMode = false, showText = true, className = "", size = "normal" }: { dark?: boolean; isDarkMode?: boolean; showText?: boolean; className?: string; size?: "normal" | "small" }) => {
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
            Vincula<span className="text-brand-teal">Tec</span>
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
