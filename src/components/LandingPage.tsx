
import React from 'react';
import { motion } from 'motion/react';
import { ThemeToggle, Logo } from './Common';

export function LandingPage({ onSelect, isDarkMode, onToggleDarkMode }: { onSelect: (inst: string) => void, isDarkMode: boolean, onToggleDarkMode: () => void }) {
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
