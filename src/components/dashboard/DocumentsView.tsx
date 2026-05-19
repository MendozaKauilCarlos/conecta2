
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserData } from '../../types';
import { FileEdit, FileText, CheckCircle2, Clock, AlertCircle, PenLine, ShieldCheck, Eye, Upload } from 'lucide-react';
import { DocumentDetailView } from './DocumentDetailView';

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
      className={`rounded-[2rem] p-8 border shadow-sm transition-all group cursor-pointer h-full ${isDarkMode ? 'bg-[#121926] border-neutral-800 hover:shadow-brand-teal/5' : 'bg-white border-neutral-100 hover:shadow-xl hover:shadow-blue-900/5'}`}
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

      <div className="mt-auto flex flex-col gap-6">
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

export function DocumentsView({ user, isDarkMode }: { user: UserData, isDarkMode?: boolean }) {
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
          <DocumentCard 
            key={doc.id}
            doc={doc} 
            isDarkMode={isDarkMode} 
            onClick={() => setSelectedDoc(doc)}
          />
        ))}
      </div>
    </div>
  );
}
