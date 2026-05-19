
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileEdit, Upload, FileText, Search, Download, ArrowLeft, Lightbulb, X, Clock, Calendar } from 'lucide-react';
import { UserData } from '../../types';
import { FormServiceRequest } from './FormServiceRequest';

export function DocumentDetailView({ 
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
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-3xl border overflow-hidden transition-colors duration-500 min-h-[600px] flex flex-col ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-[#fcfdfe] border-neutral-100'}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-white border-neutral-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-rose-500/20 text-rose-500' : (isGenerateType ? 'bg-brand-orange/10 text-brand-orange' : 'bg-rose-50 text-rose-500')}`}>
                  <FileText size={16} />
                </div>
                <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                   {isGenerateType ? 'anexo_17_solicitud_auto.pdf' : config.fileName}
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-12 flex-1 flex items-center justify-center relative overflow-hidden group">
              <div className={`w-full max-w-2xl aspect-[1/1.41] rounded-sm shadow-2xl relative transition-colors duration-500 ${isDarkMode ? 'bg-white' : 'bg-white'} overflow-y-auto custom-scrollbar`}>
                {isGenerateType ? (
                  <div className="bg-white text-black p-4 sm:p-10 text-[6px] sm:text-[9px] leading-tight font-serif min-h-full flex flex-col items-stretch">
                   {/* Simplified Representation */}
                   <div className="text-center font-bold mb-6 uppercase">
                      <p className="text-[7px] sm:text-[10px] tracking-tight">DEPARTAMENTO DE GESTIÓN TECNOLÓGICA Y VINCULACIÓN</p>
                      <p className="text-[9px] sm:text-[13px]">SOLICITUD DE SERVICIO SOCIAL</p>
                    </div>
                    <div className="space-y-4">
                      <p><strong>Nombre:</strong> {user.name}</p>
                      <p><strong>Control:</strong> {user.controlNumber}</p>
                      <p><strong>Carrera:</strong> {user.career}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-300 italic">
                    Vista previa no disponible para carga manual
                  </div>
                )}
                {doc.status === 'RECHAZADO' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-4 border-rose-500 text-rose-500 font-black p-4 rotate-12 bg-white/80">RECHAZADO</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`rounded-3xl border p-8 transition-colors duration-500 h-full ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 ${isDarkMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
              <div className="w-1.5 h-4 bg-brand-orange rounded-full"></div>
              Seguimiento
            </h3>
            <div className="space-y-10">
              {config.timeline.map((item, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${item.status === 'RECHAZADO' ? 'bg-rose-500' : 'bg-brand-teal'}`} />
                  <div className="space-y-1">
                    <p className="text-sm font-bold">{item.event}</p>
                    <p className="text-xs text-neutral-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-blue-50 dark:bg-brand-blue/5 rounded-2xl">
              <p className="text-xs font-medium text-brand-blue/70 italic flex items-start gap-2">
                <Lightbulb size={14} className="shrink-0" />
                {config.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
