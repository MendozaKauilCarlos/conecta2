import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, FileText, CheckCircle2, Clock, AlertCircle, Eye, Download, ShieldCheck, Loader2 } from 'lucide-react';
import { UserData } from '../../types';
import * as dbService from '../../services/dbService';

interface BimestralReportDetailViewProps {
  reportNo: number;
  user: UserData;
  dbStudentData: any;
  onBack: () => void;
  isDarkMode?: boolean;
  hideHeader?: boolean;
}

export function BimestralReportDetailView({
  reportNo,
  user,
  dbStudentData,
  onBack,
  isDarkMode,
  hideHeader = false
}: BimestralReportDetailViewProps) {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [activePreviewTitle, setActivePreviewTitle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSubKey, setSelectedSubKey] = useState<string | null>(null);

  const report = dbStudentData?.reportes_bimestrales?.find((r: any) => r.numero_reporte === reportNo) || {
    numero_reporte: reportNo,
    reporte_bimestral_doc: {},
    evaluacion_cualitativa: {},
    auto_evaluacion: {}
  };

  const getKeys = () => {
    if (reportNo === 3) {
      return [
        'reporte_bimestral_doc',
        'evaluacion_cualitativa',
        'auto_evaluacion',
        'evaluacion_desempeno_final',
        'formato_final',
        'reporte_final'
      ] as const;
    }
    return ['reporte_bimestral_doc', 'evaluacion_cualitativa', 'auto_evaluacion'] as const;
  };

  const getSubDocObj = (key: string) => {
    if (key === 'evaluacion_desempeno_final' || key === 'formato_final' || key === 'reporte_final') {
      return dbStudentData?.cierre_servicio?.[key] || {};
    }
    return report[key] || {};
  };

  const getSubDocConfig = (key: string) => {
    switch (key) {
      case 'reporte_bimestral_doc':
        return {
          title: `Reporte Bimestral ${reportNo}`,
          desc: 'Formato oficial de avance bimestral, detallando actividades realizadas y acumulado de horas.',
          template: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FReportes%2FREPORTE%20BIMESTRAL%20DE%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=894380ad-60b6-41ff-80c1-fc1f630efba8'
        };
      case 'evaluacion_cualitativa':
        return {
          title: `Evaluación Cualitativa ${reportNo}`,
          desc: 'Formato de evaluación que debe llenar, firmar y sellar tu asesor externo asignado.',
          template: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FReportes%2FEVALUACION%20CUALITATIVA%20DE%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=487d90e2-a083-48e0-a4ea-2db6d8959d28'
        };
      case 'auto_evaluacion':
        return {
          title: `Autoevaluación Cualitativa ${reportNo}`,
          desc: 'Formato de autoevaluación cualitativa que llenas tú como prestante del servicio social.',
          template: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FReportes%2FAUTO_EVALUACION%20CUALITATIVA_V.0.pdf?alt=media&token=8d279e8d-8cd9-4d6d-895c-9c3f85bc1f60'
        };
      case 'evaluacion_desempeno_final':
        return {
          title: 'Evaluación Cualitativa Final',
          desc: 'Formato acumulado de desempeño y calificación final firmado y sellado por el asesor externo.',
          template: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FReportes%2FEVALUACION%20CUALITATIVA%20DE%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=487d90e2-a083-48e0-a4ea-2db6d8959d28'
        };
      case 'formato_final':
        return {
          title: 'Formato de Informe Final',
          desc: 'Formato oficial para la estructura y presentación de tu reporte o informe final de actividades.',
          template: 'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FReportes%2FREPORTE%20BIMESTRAL%20DE%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=894380ad-60b6-41ff-80c1-fc1f630efba8'
        };
      case 'reporte_final':
        return {
          title: 'Informe Final',
          desc: 'Reporte global final con todas tus actividades concluidas y objetivos del servicio social cumplidos.',
          template: ''
        };
      default:
        return { title: key, desc: '', template: '' };
    }
  };

  const getStatusConfig = (subDoc: any) => {
    const url = subDoc?.url_documento || subDoc?.url_sellado || '';
    const valid = subDoc?.estado_validacion === true;
    const obs = subDoc?.observaciones || '';

    if (!url) {
      return {
        label: 'Pendiente',
        bg: isDarkMode ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-neutral-50 text-neutral-400 border-neutral-100',
        icon: <FileText size={12} />,
        status: 'PENDIENTE'
      };
    }

    if (valid) {
      return {
        label: 'Aceptado',
        bg: isDarkMode ? 'bg-brand-teal/5 text-brand-teal border-brand-teal/20' : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
        icon: <CheckCircle2 size={12} />,
        status: 'APROBADO'
      };
    }

    if (obs && obs.trim() !== '') {
      return {
        label: 'Requiere Atención',
        bg: isDarkMode ? 'bg-rose-500/5 text-rose-500 border-rose-500/20' : 'bg-rose-50 text-rose-500 border-rose-100',
        icon: <AlertCircle size={12} />,
        status: 'RECHAZADO'
      };
    }

    return {
      label: 'En Proceso',
      bg: isDarkMode ? 'bg-brand-orange/5 text-brand-orange border-brand-orange/20' : 'bg-[#fffbeb] text-brand-orange border-[#fef3c7]',
      icon: <Clock size={12} />,
      status: 'EN REVISIÓN'
    };
  };

  const handleUploadClick = (key: string) => {
    setSelectedSubKey(key);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSubKey || !user.id) return;

    setUploadingKey(selectedSubKey);
    try {
      if (selectedSubKey === 'evaluacion_desempeno_final' || selectedSubKey === 'formato_final' || selectedSubKey === 'reporte_final') {
        await dbService.uploadCierreDocument(user.id, selectedSubKey as any, file);
      } else {
        await dbService.uploadBimestralDocument(user.id, reportNo, selectedSubKey as any, file);
      }
    } catch (err) {
      console.error("Error uploading bimestral sub file:", err);
      alert("No se pudo subir el archivo. Intente de nuevo.");
    } finally {
      setUploadingKey(null);
      setSelectedSubKey(null);
    }
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className={`space-y-10 ${hideHeader ? 'mt-4' : 'mt-8 sm:mt-12'}`}>
      {/* Header with Back button */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-3.5 rounded-full border transition-all hover:scale-105 active:scale-95 flex items-center justify-center ${
                isDarkMode ? 'border-neutral-800 bg-[#121926] text-neutral-400 hover:text-white' : 'border-neutral-100 bg-white text-neutral-500 hover:text-brand-blue hover:shadow-md'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal">Seguimiento Bimestral</span>
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tight leading-none mt-1 ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                Reporte Bimestral {reportNo}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
              <ShieldCheck size={12} className="text-brand-teal" />
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400">
                Validación Oficial
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of the required documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {getKeys().map((key) => {
          const subDoc = getSubDocObj(key);
          const config = getSubDocConfig(key);
          const status = getStatusConfig(subDoc);
          const url = subDoc?.url_documento || subDoc?.url_sellado || '';
          const hasObs = subDoc?.observaciones && subDoc.observaciones.trim() !== '';

          return (
            <motion.div
              key={key}
              whileHover={{ y: -4 }}
              className={`rounded-[2rem] p-8 border flex flex-col justify-between shadow-sm transition-all relative ${
                isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100 hover:shadow-xl'
              }`}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-[#0a0f18] text-brand-teal' : 'bg-neutral-50 text-brand-teal'
                  }`}>
                    <FileText size={20} />
                  </div>
                  
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black tracking-widest uppercase ${status.bg}`}>
                    {status.icon}
                    <span>{status.label}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                    {config.title}
                  </h3>
                  <p className={`text-xs font-medium leading-relaxed ${isDarkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {config.desc}
                  </p>
                </div>

                {/* Observations Warning Box */}
                {hasObs && (
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider font-mono flex items-center gap-1">
                      <AlertCircle size={10} /> Observaciones:
                    </span>
                    <p className="text-[11px] italic text-neutral-400">"{subDoc.observaciones}"</p>
                  </div>
                )}

                {/* Last modified date info */}
                {url && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                    <Clock size={12} className="text-brand-teal" />
                    <span>Subido: {formatDate(subDoc?.fecha_subida || subDoc?.fecha_generacion) || 'Recientemente'}</span>
                  </div>
                )}
              </div>

              {/* Actions panel */}
              <div className="space-y-3 mt-8">
                {/* Download Template Button */}
                {config.template ? (
                  <a
                    href={config.template}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-3.5 border rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isDarkMode 
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700' 
                        : 'bg-neutral-50 hover:bg-white hover:border-neutral-200 text-neutral-600 border-transparent'
                    }`}
                  >
                    <Download size={14} />
                    <span>Descargar Plantilla</span>
                  </a>
                ) : (
                  <div className={`w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center ${
                    isDarkMode ? 'text-neutral-500 bg-neutral-800/10' : 'text-neutral-400 bg-neutral-50'
                  }`}>
                    Sin Plantilla Requerida
                  </div>
                )}

                {/* Action primary button */}
                {status.status === 'APROBADO' ? (
                  <button
                    onClick={() => {
                      setActivePreviewUrl(url);
                      setActivePreviewTitle(config.title);
                    }}
                    className={`w-full py-3.5 border-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isDarkMode ? 'border-neutral-800 bg-[#1a2333] text-brand-teal hover:border-brand-teal/50' : 'border-transparent bg-neutral-100 hover:bg-white hover:border-brand-blue/30 text-brand-blue'
                    }`}
                  >
                    <Eye size={14} className="text-brand-teal" />
                    <span>Ver Archivo</span>
                  </button>
                ) : (
                  <button
                    disabled={uploadingKey !== null}
                    onClick={() => handleUploadClick(key)}
                    className="w-full py-3.5 rounded-2xl bg-brand-teal text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-teal/15 disabled:opacity-50"
                  >
                    {uploadingKey === key ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>{url ? 'Volver a Subir' : 'Subir Archivo'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hidden File Input for uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />

      {/* Document Quick Viewer Frame inside page */}
      {activePreviewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[2.5rem] border shadow-lg space-y-4 ${
            isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-4 border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight">{activePreviewTitle}</h4>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Visualizador VinculaTec</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setActivePreviewUrl(null);
                setActivePreviewTitle(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-500'
              }`}
            >
              Cerrar Vista
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden h-[450px] border border-neutral-100 dark:border-neutral-800 relative bg-[#070e1b]">
            <iframe
              src={activePreviewUrl}
              className="w-full h-full border-0"
              title="Quick Sub Document Preview"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
