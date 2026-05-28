
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Plus, GraduationCap, Building2, HeartPulse, Users, Gavel, X } from 'lucide-react';
import { Dependency, UserData } from '../../types';
import * as dbService from '../../services/dbService';
import { DependencyCard } from './DependencyCard';
import { DependencyDetailsModal } from './DependencyDetailsModal';

export function CatalogView({ 
  user,
  onSelectDependency,
  isDarkMode 
}: { 
  user: UserData,
  onSelectDependency: (dep: Dependency) => void,
  isDarkMode?: boolean
}) {
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDependencyModal, setSelectedDependencyModal] = useState<Dependency | null>(null);
  const [showNewAgreementNotice, setShowNewAgreementNotice] = useState(false);

  useEffect(() => {
    const fetchDeps = async () => {
      setIsLoading(true);
      try {
        const data = await dbService.getDependencies();
        setDependencies(data);
      } catch (err) {
        console.error("Error fetching dependencies: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeps();
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
    return dependencies.filter(d => {
      const matchesFilter = filter === 'Todos' || d.category === filter;
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           d.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [dependencies, filter, searchQuery]);

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
            user={user}
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

        <div className="bg-brand-orange p-8 sm:p-14 flex items-center gap-6 sm:gap-8 shrink-0 relative overflow-hidden">
          <div className="bg-black/10 p-4 rounded-3xl relative z-10">
            <Search className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-widest leading-none uppercase mb-2">
              Importante
            </h3>
            <p className="text-white/80 font-bold text-sm sm:text-base uppercase tracking-widest">Procedimiento Presencial Requerido</p>
          </div>
        </div>

        <div className="p-8 sm:p-14 overflow-y-auto custom-scrollbar">
          <div className={`border rounded-[2rem] p-8 mb-12 flex items-start gap-6 shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-brand-teal/5 border-brand-teal/20' : 'bg-brand-teal/5 border-brand-teal/20'}`}>
            <p className={`font-bold text-base sm:text-lg leading-relaxed transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
              Por motivos de protocolos de seguridad interna, el trámite de propuesta de nuevo convenio se realizará de manera presencial en las oficinas de Conecta2.
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`w-full py-4 sm:py-5 text-white font-black rounded-2xl transition-all active:scale-95 shadow-xl text-base sm:text-lg ${isDarkMode ? 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/10' : 'bg-brand-blue hover:bg-brand-blue/90 shadow-brand-blue/20'}`}
          >
            Entendido, volver al catálogo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
