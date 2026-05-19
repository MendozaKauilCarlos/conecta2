
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { UserData } from '../types';
import { REQUIREMENTS } from '../constants';

// --- Verification Modal ---
export function VerificationModal({ user, onComplete, isDarkMode }: { user: UserData, onComplete: (success: boolean) => void, isDarkMode?: boolean }) {
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
export function RequirementsModal({ user, onClose }: { user: UserData, onClose: () => void }) {
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
