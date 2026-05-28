
import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileEdit, Upload, FileText, Search, Download, ArrowLeft, Lightbulb, X, Clock, Calendar, Loader2, ExternalLink } from 'lucide-react';
import { UserData } from '../../types';
import { FormServiceRequest } from './FormServiceRequest';
import * as dbService from '../../services/dbService';

export function DocumentDetailView({ 
  doc, 
  user,
  dbStudentData,
  onBack, 
  isDarkMode 
}: { 
  doc: any, 
  user: UserData,
  dbStudentData?: any,
  onBack: () => void, 
  isDarkMode?: boolean 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'digital' | 'signed'>(doc.url ? 'signed' : 'digital');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDbKey = (): string | null => {
    const t = doc.title.toLowerCase();
    if (t.includes('kardex')) return 'kardex';
    if (t.includes('carga')) return 'carga_academica';
    if (t.includes('vigencia')) return 'vigencia_derechos';
    if (t.includes('solicitud') || t.includes('anexo 17')) return 'solicitud_servicio_social';
    if (t.includes('compromiso')) return 'carta_compromiso';
    if (t.includes('asignacion') || t.includes('asignación')) return 'carta_asignacion';
    if (t.includes('plan de trabajo')) return 'plan_de_trabajo';
    if (t.includes('tarjeta')) return 'tarjeta_control';
    return null;
  };

  const getDocConfig = () => {
    const t = doc.title.toLowerCase();
    
    if (t.includes('kardex')) {
      return {
        fileName: 'kardex_final_19530001.pdf',
        tip: 'Tip: Verifica que tu promedio y porcentaje de créditos sean correctos en el Kardex oficial de servicios escolares.',
      };
    }
    
    if (t.includes('carga')) {
      return {
        fileName: 'carga_academica_2026.pdf',
        tip: 'Tip: Sube tu carga académica actualizada del semestre en curso, debe incluir el código de barras o sello digital.',
      };
    }

    if (t.includes('vigencia')) {
      return {
        fileName: 'constancia_imss.pdf',
        tip: 'Tip: La constancia de vigencia de derechos se descarga gratuitamente desde el portal del IMSS Digital.',
      };
    }

    if (t.includes('solicitud') || t.includes('anexo')) {
      return {
        fileName: 'solicitud_servicio_social.pdf',
        tip: 'Tip: Una vez descargada la plantilla oficial, imprímela, solicita la firma y sello en tu dependencia receptora, y súbela aquí para validar tu inicio de servicio social.',
      };
    }

    if (t.includes('compromiso')) {
      return {
        fileName: 'carta_compromiso.pdf',
        tip: 'Tip: Sube tu documento de Carta Compromiso debidamente firmado con firma autógrafa en tinta azul.',
      };
    }

    if (t.includes('asignacion') || t.includes('asignación')) {
      return {
        fileName: 'carta_asignacion.pdf',
        tip: 'Tip: Sube tu Carta de Asignación firmada y sellada por la dependencia receptora seleccionada.',
      };
    }

    if (t.includes('plan de trabajo')) {
      return {
        fileName: 'plan_de_trabajo.pdf',
        tip: 'Tip: Tu Plan de Trabajo Bimestral describe las metas y entregables acordados con tu asesor externo.',
      };
    }

    if (t.includes('tarjeta')) {
      return {
        fileName: 'tarjeta_de_control.pdf',
        tip: 'Tip: La Tarjeta de Control registra mensualmente el cúmulo de horas prácticas acreditadas en tu dependencia.',
      };
    }

    return {
      fileName: 'documento_digital.pdf',
      tip: 'Tip: Asegúrate de que el documento esté en formato PDF y sea menor a 5MB.',
    };
  };

  const config = getDocConfig();
  const title = doc.title.toLowerCase();
  const isGenerateType = ['10', '11', '12', '13', '14'].includes(doc.id) || 
                         title.includes('solicitud') || 
                         title.includes('compromiso') || 
                         title.includes('asignacion') || 
                         title.includes('asignación') || 
                         title.includes('plan de trabajo') || 
                         title.includes('tarjeta');

  const getPlantillaUrl = () => {
    const t = doc.title.toLowerCase();
    if (t.includes('solicitud') || t.includes('anexo')) {
      return dbStudentData?.solicitud_servicio_social?.url_plantilla || 
             dbStudentData?.seguimiento?.url_plantilla || 
             dbStudentData?.anexo_17_datos?.url_plantilla || 
             'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FApertura%2FSOLICITUD%20DE%20SERV.%20SOCIAL_V.0.pdf?alt=media&token=56ef4e3c-eb34-441a-b13e-eff43b75b5ef';
    }
    if (t.includes('compromiso')) {
      return dbStudentData?.carta_compromiso?.url_plantilla || 
             'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FApertura%2FCARTA%20COMPROMISO%20SERV.%20SOCIAL_V.0%20.pdf?alt=media&token=c168f7bc-8413-4e61-8777-db1da12cf62c';
    }
    if (t.includes('asignacion') || t.includes('asignación')) {
      return dbStudentData?.carta_asignacion?.url_plantilla || 
             'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FApertura%2FICARTA%20ASIGNACI%C3%93N%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=d1205953-95b9-4fe4-bdd6-0695f5c45eeb';
    }
    if (t.includes('plan de trabajo')) {
      return dbStudentData?.plan_de_trabajo?.url_plantilla || 
             'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FApertura%2FPLAN%20DE%20TRABAJO%20DEL%20PRESTANTE_V.0.pdf?alt=media&token=1c7be4b9-66c6-4588-85be-c05cb1f33894';
    }
    if (t.includes('tarjeta')) {
      return dbStudentData?.tarjeta_control?.url_plantilla || 
             'https://firebasestorage.googleapis.com/v0/b/vinculatec-e7656.firebasestorage.app/o/Documentos%2FApertura%2FTARJETA%20DE%20CONTROL%20DE%20SERVICIO%20SOCIAL_V.0.pdf?alt=media&token=0fcf75b6-2109-46a9-9194-699aa6a5e4d7';
    }
    return '';
  };

  const plantillaUrl = getPlantillaUrl();

  const getStepConfig = () => {
    const t = doc.title.toLowerCase();
    if (t.includes('solicitud') || t.includes('anexo 17')) {
      return {
        title: 'Descargar Solicitud',
        desc1: 'Descarga la plantilla del formato oficial de Solicitud de Servicio Social proporcionada por la Subdirección de Vinculación.',
        desc2: 'Imprime la plantilla, recaba la firma y sello del responsable de tu dependencia receptora, escanea el formato en PDF y cárgalo aquí.'
      };
    }
    if (t.includes('compromiso')) {
      return {
        title: 'Descargar Carta Compromiso',
        desc1: 'Descarga el formato oficial de Carta Compromiso del estudiante, donde aceptas los lineamientos del servicio social.',
        desc2: 'Firma la carta compromiso con tinta azul, escanea el documento completo en formato PDF y súbelo aquí.'
      };
    }
    if (t.includes('asignacion') || t.includes('asignación')) {
      return {
        title: 'Descargar Carta Asignación',
        desc1: 'Descarga tu Carta de Asignación oficial, que formaliza el inicio de tu servicio social en tu dependencia asignada.',
        desc2: 'Recaba la firma del titular del programa, fírmala tú también, sella el documento, escanéalo en PDF y súbelo aquí.'
      };
    }
    if (t.includes('plan de trabajo')) {
      return {
        title: 'Descargar Plan de Trabajo',
        desc1: 'Descarga el formato oficial del Plan de Trabajo para detallar tus actividades bimestrales programadas.',
        desc2: 'Redacta tu plan de trabajo de acuerdo con tus actividades, recaba firma y sello oficiales, escanéalo en PDF y súbelo aquí.'
      };
    }
    if (t.includes('tarjeta')) {
      return {
        title: 'Descargar Tarjeta de Control',
        desc1: 'Descarga la Tarjeta de Control oficial para registrar tus asistencias y constatar tus 500 horas de servicio.',
        desc2: 'Lleva el control de tus horas semanales, obtén la firma del responsable, sella el formato, escanéalo y súbelo aquí.'
      };
    }
    return {
      title: 'Descargar Formato',
      desc1: `Descarga el formato oficial correspondiente para ${doc.title}.`,
      desc2: 'Completa las firmas y sellos correspondientes, escanéalo en PDF y súbelo aquí.'
    };
  };

  const stepConfig = getStepConfig();

  const anexoData = {
    nombre_estudiante: dbStudentData?.anexo_17_datos?.nombre_estudiante || dbStudentData?.datos?.nombre || user.name || '',
    sexo: dbStudentData?.anexo_17_datos?.sexo || dbStudentData?.datos?.sexo || 'MASCULINO',
    telefono_estudiante: dbStudentData?.anexo_17_datos?.telefono_estudiante || dbStudentData?.datos?.telefono || user.phone || '998-123-4567',
    domicilio_estudiante: dbStudentData?.anexo_17_datos?.domicilio_estudiante || dbStudentData?.datos?.domicilio || dbStudentData?.datos?.direccion || (user.address ? `${user.address.street}, ${user.address.neighborhood}, ${user.address.city}` : 'AV. KABAH KM 3 S/N, CANCÚN, Q.ROO'),
    
    no_control: dbStudentData?.anexo_17_datos?.no_control || user.controlNumber || '',
    carrera: dbStudentData?.anexo_17_datos?.carrera || user.career || '',
    periodo: dbStudentData?.anexo_17_datos?.periodo || 'AGOSTO - DICIEMBRE 2026',
    semestre: dbStudentData?.anexo_17_datos?.semestre || dbStudentData?.status_academico?.semestre || dbStudentData?.datos?.semestre || '8vo Semestre',
    
    instancia: dbStudentData?.anexo_17_datos?.instancia || user.dependencia_seleccionada || 'INSTITUTO TECNOLÓGICO DE CANCÚN',
    departamento: dbStudentData?.anexo_17_datos?.departamento || 'DEPARTAMENTO DE VINCULACIÓN PROFESIONAL',
    titular: dbStudentData?.anexo_17_datos?.titular || 'LIC. MARÍA FERNANDA LÓPEZ',
    puesto: dbStudentData?.anexo_17_datos?.puesto || 'JEFE DE DEPARTAMENTO',
    modalidad: dbStudentData?.anexo_17_datos?.modalidad || 'PRESENCIAL',
    domicilio: dbStudentData?.anexo_17_datos?.domicilio || 'AV. KABAH KM 3 S/N, CANCÚN, Q.ROO',
    programa: dbStudentData?.anexo_17_datos?.programa || 'APOYO A LA DOCENCIA',
    
    fecha_inicio: dbStudentData?.anexo_17_datos?.fecha_inicio || '',
    fecha_fin: dbStudentData?.anexo_17_datos?.fecha_fin || '',
    actividades: dbStudentData?.anexo_17_datos?.actividades || '',
    tipoPrograma: dbStudentData?.anexo_17_datos?.tipoPrograma || 'Apoyo a la salud',
  };

  const handlePrint = (isBlank = false) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Por favor, permite las ventanas emergentes (popups) para descargar el archivo de impresión.");
      return;
    }

    const checkIndicator = (opt: string) => {
      if (isBlank) return '(   )';
      const selected = anexoData.tipoPrograma || '';
      return selected.toLowerCase() === opt.toLowerCase() ? '( X )' : '(   )';
    };

    const formatDateText = (dateStr: string) => {
      if (isBlank || !dateStr) return '__________________';
      try {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } catch (err) {
        return dateStr;
      }
    };

    const val_nombre = isBlank ? '' : anexoData.nombre_estudiante.toUpperCase();
    const val_sexo = isBlank ? '' : anexoData.sexo.toUpperCase();
    const val_telefono = isBlank ? '' : anexoData.telefono_estudiante;
    const val_domicilio = isBlank ? '' : anexoData.domicilio_estudiante.toUpperCase();
    
    const val_nocontrol = isBlank ? '' : anexoData.no_control;
    const val_carrera = isBlank ? '' : anexoData.carrera.toUpperCase();
    const val_periodo = isBlank ? '' : anexoData.periodo.toUpperCase();
    const val_semestre = isBlank ? '' : anexoData.semestre.toUpperCase();

    const val_instancia = isBlank ? '' : anexoData.instancia.toUpperCase();
    const val_titular = isBlank ? '' : anexoData.titular.toUpperCase();
    const val_puesto = isBlank ? '' : anexoData.puesto.toUpperCase();
    const val_programa = isBlank ? '' : anexoData.programa.toUpperCase();
    const val_modalidad = isBlank ? '' : anexoData.modalidad.toUpperCase();
    const val_actividades = isBlank ? '' : anexoData.actividades;

    const formattedDate = isBlank ? '____ de _________________ del 20___' : `${new Date().getDate()} de ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][new Date().getMonth()]} del ${new Date().getFullYear()}`;

    const printHtml = `
      <html>
        <head>
          <title>Solicitud de Servicio Social - ${isBlank ? 'Plantilla' : val_nombre}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body {
              font-family: 'Inter', Arial, sans-serif;
              color: #000;
              margin: 0;
              padding: 40px;
              line-height: 1.35;
              font-size: 11px;
              background-color: #fff;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .header-table td {
              border: 1px solid #000;
              padding: 6px;
              text-align: center;
              vertical-align: middle;
            }
            .logo-col {
              width: 25%;
              font-weight: bold;
              font-size: 9px;
            }
            .title-col {
              width: 45%;
              font-weight: bold;
              font-size: 12px;
            }
            .meta-col {
              width: 30%;
              text-align: left !important;
              font-size: 8.5px;
              line-height: 1.4;
            }
            .sub-dept {
              text-align: center;
              font-size: 11px;
              font-weight: bold;
              margin-top: 15px;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .main-title {
              text-align: center;
              font-size: 11.5px;
              font-weight: bold;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .form-body {
              position: relative;
              width: 100%;
            }
            .photo-box {
              position: absolute;
              top: 0;
              right: 0;
              width: 65px;
              height: 80px;
              border: 1px solid #000;
              font-size: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 4px;
              background: #fff;
            }
            .section-heading {
              font-size: 10.5px;
              font-weight: bold;
              margin-top: 14px;
              margin-bottom: 8px;
              border-bottom: 1px solid #111;
              padding-bottom: 2px;
              text-transform: uppercase;
            }
            .field-row {
              margin-bottom: 8px;
              display: flex;
              align-items: flex-end;
              width: 100%;
            }
            .field-label {
              font-weight: bold;
              margin-right: 6px;
              white-space: nowrap;
            }
            .field-value {
              border-bottom: 1px solid #000;
              flex-grow: 1;
              padding-bottom: 1px;
              min-height: 15px;
              text-transform: uppercase;
              font-weight: normal;
            }
            .program-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin: 12px 0;
            }
            .program-item {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .program-indicator {
              font-family: monospace;
              font-weight: bold;
              font-size: 12px;
            }
            .exclusive-use {
              border: 1.5px solid #000;
              padding: 10px;
              margin-top: 20px;
              background-color: #fafafa;
            }
            .exclusive-title {
              font-weight: bold;
              text-align: center;
              margin-bottom: 8px;
              font-size: 9.5px;
              letter-spacing: 0.5px;
            }
            .student-sig-area {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 60px;
              margin-top: 45px;
              text-align: center;
            }
            .student-sig-line {
              border-top: 1px solid #000;
              padding-top: 4px;
              font-size: 9px;
              font-weight: bold;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="logo-col">
                <div style="font-weight: 800; font-size: 8px; line-height: 1.1; color: #000;">TECNOLÓGICO NACIONAL<br>DE MÉXICO</div>
                <div style="font-weight: bold; font-size: 7px; color: #555; margin-top: 3px; border-top: 1px dashed #ddd; padding-top: 2px;">Campus Cancún</div>
              </td>
              <td class="title-col">
                Formato para Solicitud de Servicio Social
              </td>
              <td class="meta-col">
                <div><strong>Fecha de aprobación:</strong> 17 febrero 2023</div>
                <div><strong>Revisión:</strong> 0</div>
                <div><strong>Página:</strong> 1 de 1</div>
              </td>
            </tr>
          </table>

          <div class="sub-dept">Departamento de Gestión Tecnológica y Vinculación</div>
          <div class="main-title">Solicitud de Servicio Social</div>

          <div class="form-body">
            <div class="photo-box">
              FOTO<br>ALUMNO
            </div>

            <!-- SECTION 1 -->
            <div class="section-heading">Datos Personales</div>
            
            <div style="display: flex; width: 85%; gap: 15px;">
              <div class="field-row" style="flex: 3;">
                <span class="field-label">Nombre completo:</span>
                <span class="field-value">${val_nombre || '&nbsp;'}</span>
              </div>
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Sexo:</span>
                <span class="field-value">${val_sexo || '&nbsp;'}</span>
              </div>
            </div>

            <div style="display: flex; gap: 15px; width: 100%;">
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Teléfono:</span>
                <span class="field-value">${val_telefono || '&nbsp;'}</span>
              </div>
              <div class="field-row" style="flex: 2;">
                <span class="field-label">Domicilio:</span>
                <span class="field-value">${val_domicilio || '&nbsp;'}</span>
              </div>
            </div>

            <!-- SECTION 2 -->
            <div class="section-heading">Escolaridad</div>
            <div style="display: flex; gap: 15px; width: 100%;">
              <div class="field-row" style="flex: 1;">
                <span class="field-label">No. de Control:</span>
                <span class="field-value">${val_nocontrol || '&nbsp;'}</span>
              </div>
              <div class="field-row" style="flex: 2;">
                <span class="field-label">Carrera:</span>
                <span class="field-value">${val_carrera || '&nbsp;'}</span>
              </div>
            </div>

            <div style="display: flex; gap: 15px; width: 100%;">
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Periodo:</span>
                <span class="field-value">${val_periodo || '&nbsp;'}</span>
              </div>
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Semestre:</span>
                <span class="field-value">${val_semestre || '&nbsp;'}</span>
              </div>
            </div>

            <!-- SECTION 3 -->
            <div class="section-heading">Datos del Programa</div>
            
            <div class="field-row">
              <span class="field-label">Dependencia Oficial:</span>
              <span class="field-value">${val_instancia || '&nbsp;'}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Titular de la Dependencia:</span>
              <span class="field-value">${val_titular || '&nbsp;'}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Puesto:</span>
              <span class="field-value">${val_puesto || '&nbsp;'}</span>
            </div>

            <div class="field-row">
              <span class="field-label">Nombre del Programa:</span>
              <span class="field-value">${val_programa || '&nbsp;'}</span>
            </div>

            <div style="display: flex; gap: 15px; width: 100%;">
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Modalidad:</span>
                <span class="field-value">${val_modalidad || '&nbsp;'}</span>
              </div>
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Fecha de Inicio:</span>
                <span class="field-value">${formatDateText(anexoData.fecha_inicio)}</span>
              </div>
              <div class="field-row" style="flex: 1;">
                <span class="field-label">Fecha de Terminación:</span>
                <span class="field-value">${formatDateText(anexoData.fecha_fin)}</span>
              </div>
            </div>

            <div class="field-row" style="align-items: flex-start; flex-direction: column; margin-top: 10px;">
              <span class="field-label" style="margin-bottom: 4px;">Actividades:</span>
              <span class="field-value" style="border-bottom: none; width: 100%; text-transform: none; text-align: justify; line-height: 1.4; border: 1px solid #ccc; padding: 8px; border-radius: 4px; min-height: 60px;">
                ${val_actividades || 'Servicios y actividades coordinadas administrativamente con la dependencia.'}
              </span>
            </div>

            <!-- SECTION 4 -->
            <div class="section-heading">Tipo de programa: (17)</div>
            <div class="program-grid">
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Educación para adultos')}</span>
                <span>Educación para adultos</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Desarrollo de comunidad')}</span>
                <span>Desarrollo de comunidad</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Actividades deportivas')}</span>
                <span>Actividades deportivas</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Actividades cívicas')}</span>
                <span>Actividades cívicas</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Actividades culturales')}</span>
                <span>Actividades culturales</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Medio ambiente')}</span>
                <span>Medio ambiente</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Desarrollo sustentable')}</span>
                <span>Desarrollo sustentable</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Apoyo a la salud')}</span>
                <span>Apoyo a la salud</span>
              </div>
              <div class="program-item">
                <span class="program-indicator">${checkIndicator('Otros')}</span>
                <span>Otros</span>
              </div>
            </div>

            <!-- SECTION 5 -->
            <div class="exclusive-use">
              <div class="exclusive-title">PARA USO EXCLUSIVO DE LA OFICINA DE SERVICIO SOCIAL</div>
              <div style="display: flex; gap: 20px; font-weight: bold; margin-bottom: 8px;">
                <span>ACEPTADO: (18)  SI (   )   NO (   )</span>
                <span>MOTIVO: (19) __________________________________________________</span>
              </div>
              <div style="font-weight: bold;">
                OBSERVACIONES: (20) <br>
                <div style="border-bottom: 1px dotted #888; height: 18px; margin-top: 4px;"></div>
                <div style="border-bottom: 1px dotted #888; height: 18px; margin-top: 4px;"></div>
              </div>
            </div>

            <!-- SIGNATURES -->
            <div class="student-sig-area">
              <div class="student-sig-line" style="margin-top: 40px;">
                ${val_nombre || 'FIRMA DE ESTUDIANTE SOLICITANTE'}<br>
                Firma del Estudiante Solicitante
              </div>
              <div class="student-sig-line" style="margin-top: 40px;">
                <br>
                Firma y Sello de la Dependencia Receptora
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  const getTimeline = () => {
    if (isUploading) {
      return [
        { 
          date: 'AHORA', 
          event: 'Subiendo Documento...', 
          description: 'Transmitiendo los datos del archivo a su expediente escolar en la nube.', 
          status: 'PROCESANDO' 
        }
      ];
    }

    if (doc.status === 'APROBADO') {
      return [
        { 
          date: doc.lastModified || 'RECIENTE', 
          event: 'Documento Aprobado', 
          description: 'Tu documento ha sido validado correctamente por el departamento correspondiente.', 
          status: 'APROBADO' 
        }
      ];
    }

    if (doc.status === 'RECHAZADO') {
      return [
        { 
          date: doc.lastModified || 'RECIENTE', 
          event: 'Documento Rechazado', 
          description: doc.observaciones || 'El documento cargado no es legible o requiere atención.', 
          status: 'RECHAZADO' 
        }
      ];
    }

    if (doc.status === 'EN REVISIÓN') {
      return [
        { 
          date: doc.lastModified || 'RECIENTE', 
          event: 'En revisión de firmas', 
          description: 'Tu documento firmado ha sido recibido y está en espera de ser validado.', 
          status: 'SENT' 
        }
      ];
    }

    if (isGenerateType) {
      return [
        { 
          date: 'PENDIENTE', 
          event: 'Firmar y Sellar Solicitud', 
          description: 'Descargue la plantilla oficial, obtenga la firma y el sello en su dependencia receptora, y suba el archivo.', 
          status: 'PENDIENTE' 
        }
      ];
    }

    return [
      { 
        date: 'PENDIENTE', 
        event: 'Esperando Archivo', 
        description: 'Por favor, selecciona o arrastra el archivo digital oficial.', 
        status: 'PENDIENTE' 
      }
    ];
  };

  const timeline = getTimeline();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const dbKey = getDbKey();
      if (!dbKey) throw new Error("Document key not resolved");
      await dbService.uploadStudentDocument(user.id, dbKey, file);
      if (isGenerateType) {
        setActivePreviewTab('signed');
      }
    } catch (err: any) {
      console.error("Error uploading file:", err);
      setUploadError("Error al subir archivo. Intente nuevamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderDigitalFormPreview = () => {
    const checkIndicator = (opt: string) => {
      const selected = anexoData.tipoPrograma || '';
      return selected.toLowerCase() === opt.toLowerCase() ? '( X )' : '(   )';
    };

    const formatDateText = (dateStr: string) => {
      if (!dateStr) return '__________________';
      try {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } catch (err) {
        return dateStr;
      }
    };

    return (
      <div className="bg-white text-neutral-900 p-8 sm:p-12 text-[10px] sm:text-xs leading-relaxed font-sans min-h-full flex flex-col justify-start border border-neutral-200 shadow-xl relative select-text">
        {/* Dynamic Watermark Indicator */}
        <div className="absolute top-4 right-4 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest animate-pulse flex items-center gap-1 z-10 pointer-events-none">
          <Clock size={8} />
          Borrador Digital Conecta2Tec
        </div>

        {/* Oficial Header Table */}
        <table className="w-full border-collapse border border-neutral-900 text-center text-[8px] sm:text-[10px] mb-6">
          <tbody>
            <tr>
              <td className="border border-neutral-900 p-2 font-bold w-1/5">
                <div className="text-neutral-900 font-extrabold tracking-wider leading-none text-[9px]">IT CANCÚN</div>
              </td>
              <td className="border border-neutral-900 p-2 font-black text-xs w-3/5 text-neutral-900">
                Formato para Solicitud de Servicio Social
              </td>
              <td className="border border-neutral-900 p-2 text-left text-[8px] space-y-0.5 w-1/5 font-semibold text-neutral-600">
                <div><strong>Fecha de aprobación:</strong> 17 febrero 2023</div>
                <div className="border-t border-neutral-200 mt-1 pt-1"><strong>Revisión:</strong> 0</div>
                <div className="border-t border-neutral-200"><strong>Página:</strong> 1 de 1</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Institution Title */}
        <div className="text-center font-bold text-neutral-800 uppercase tracking-widest text-[10px] leading-relaxed mb-1">
          Departamento de Gestión Tecnológica y Vinculación
        </div>
        <div className="text-center font-extrabold text-[#005691] uppercase tracking-wide text-xs sm:text-sm mb-6">
          Solicitud de Servicio Social
        </div>

        {/* Form Body Wrap with Relative Absolute Photo stamp */}
        <div className="relative w-full">
          {/* Photograph stamp area */}
          <div className="absolute top-0 right-0 w-16 h-20 border border-neutral-900 rounded-sm bg-neutral-50/50 flex flex-col items-center justify-center text-center text-[7px] leading-tight text-neutral-400 font-bold border-dashed shrink-0">
            <span>FOTO</span>
            <span>ALUMNO</span>
          </div>

          {/* SECTION 1 */}
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-800 border-b border-neutral-900 pb-1 mt-4 mb-3">
            Datos Personales
          </div>
          
          <div className="grid grid-cols-12 gap-y-3 gap-x-4 w-[85%] mb-4">
            <div className="col-span-8 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500 whitespace-nowrap">Nombre completo:</span>
              <span className="font-extrabold text-neutral-800 text-[11px] truncate uppercase">{anexoData.nombre_estudiante}</span>
            </div>
            <div className="col-span-4 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Sexo:</span>
              <span className="font-extrabold text-neutral-800 uppercase text-[11px]">{anexoData.sexo}</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-y-3 gap-x-4 w-full mb-4">
            <div className="col-span-4 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Teléfono:</span>
              <span className="font-extrabold text-neutral-900 text-[11px]">{anexoData.telefono_estudiante}</span>
            </div>
            <div className="col-span-8 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Domicilio:</span>
              <span className="font-extrabold text-neutral-850 text-[10px] uppercase truncate">{anexoData.domicilio_estudiante}</span>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-800 border-b border-neutral-900 pb-1 mt-6 mb-3">
            Escolaridad
          </div>
          
          <div className="grid grid-cols-12 gap-y-3 gap-x-4 w-full mb-3">
            <div className="col-span-4 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">No. de Control:</span>
              <span className="font-extrabold text-neutral-800 text-[11px]">{anexoData.no_control}</span>
            </div>
            <div className="col-span-8 flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Carrera:</span>
              <span className="font-extrabold text-neutral-800 uppercase text-[10.5px] truncate">{anexoData.carrera}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 w-full mb-4">
            <div className="flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Periodo:</span>
              <span className="font-extrabold text-neutral-800 uppercase">{anexoData.periodo}</span>
            </div>
            <div className="flex items-end gap-1 pb-1 border-b border-neutral-400 min-h-[22px]">
              <span className="font-bold text-neutral-500">Semestre:</span>
              <span className="font-extrabold text-neutral-800 uppercase">{anexoData.semestre}</span>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="text-[10px] font-black uppercase tracking-widest text-[#005691] border-b border-[#005691] pb-1 mt-6 mb-3 flex items-center justify-between">
            <span>Datos del Programa</span>
            <span className="text-[7px] font-black border border-[#005691]/25 px-1.5 py-0.5 rounded-md bg-[#005691]/5 tracking-widest uppercase">Institucional 🔒</span>
          </div>

          <div className="space-y-3 w-full mb-4">
            <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
              <span className="font-bold text-neutral-500">Dependencia Oficial:</span>
              <span className="font-extrabold text-neutral-800 uppercase text-[10.5px]">{anexoData.instancia}</span>
            </div>
            
            <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
              <span className="font-bold text-neutral-500">Titular de la Dependencia:</span>
              <span className="font-extrabold text-neutral-800 uppercase">{anexoData.titular}</span>
            </div>

            <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
              <span className="font-bold text-neutral-500">Puesto:</span>
              <span className="font-extrabold text-neutral-800 uppercase">{anexoData.puesto}</span>
            </div>

            <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
              <span className="font-bold text-neutral-500">Nombre del Programa:</span>
              <span className="font-extrabold text-neutral-800 uppercase text-[10.5px]">{anexoData.programa}</span>
            </div>

            <div className="grid grid-cols-3 gap-x-4 w-full">
              <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
                <span className="font-bold text-neutral-500">Modalidad:</span>
                <span className="font-extrabold text-neutral-850 uppercase text-[10px]">{anexoData.modalidad}</span>
              </div>
              <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
                <span className="font-bold text-neutral-500">Fecha Inicio:</span>
                <span className="font-extrabold text-neutral-850">{formatDateText(anexoData.fecha_inicio)}</span>
              </div>
              <div className="flex items-end gap-1 pb-1 border-b border-neutral-350 min-h-[22px]">
                <span className="font-bold text-neutral-500">Fecha Término:</span>
                <span className="font-extrabold text-neutral-850">{formatDateText(anexoData.fecha_fin)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 w-full mb-4">
            <span className="font-bold text-neutral-500">Actividades Propuestas:</span>
            <div className="border border-neutral-200 rounded-lg p-3 text-[10px] font-medium text-neutral-700 bg-neutral-50/50 leading-relaxed text-left min-h-[60px]">
              {anexoData.actividades || 'Servicios y actividades coordinadas administrativamente con la dependencia.'}
            </div>
          </div>

          {/* SECTION 4 */}
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-800 border-b border-neutral-900 pb-1 mt-6 mb-3">
            Tipo de programa: (17)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mb-6 bg-neutral-50/50 p-4 border border-neutral-150 rounded-2xl">
            {[
              'Educación para adultos',
              'Desarrollo de comunidad',
              'Actividades deportivas',
              'Actividades cívicas',
              'Actividades culturales',
              'Medio ambiente',
              'Desarrollo sustentable',
              'Apoyo a la salud',
              'Otros'
            ].map((option, idx) => {
              const matched = anexoData.tipoPrograma?.toLowerCase() === option.toLowerCase();
              return (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold leading-none shrink-0 ${matched ? 'text-[#005691]' : 'text-neutral-400'}`}>
                    {checkIndicator(option)}
                  </span>
                  <span className={`text-[10px] font-bold ${matched ? 'text-neutral-900 font-extrabold' : 'text-neutral-500'}`}>{option}</span>
                </div>
              );
            })}
          </div>

          {/* SECTION 5 */}
          <div className="border-2 border-neutral-900 p-4 rounded-xl bg-neutral-50/80 mb-6">
            <div className="text-center font-black text-[9px] sm:text-[10px] tracking-wider mb-2.5 text-neutral-800">
              PARA USO EXCLUSIVO DE LA OFICINA DE SERVICIO SOCIAL
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-x-6 gap-y-2 font-bold mb-3 text-neutral-700 border-b border-neutral-200/60 pb-2">
              <span>ACEPTADO: (18)  SI (   )   NO (   )</span>
              <span>MOTIVO: (19) <span className="text-neutral-300">__________________________________________</span></span>
            </div>
            <div className="font-bold text-neutral-600">
              OBSERVACIONES: (20)
              <div className="border-b border-dashed border-neutral-300 h-5 mt-1"></div>
              <div className="border-b border-dashed border-neutral-300 h-5 mt-1"></div>
            </div>
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-2 gap-10 text-center mt-12 pt-4">
            <div className="space-y-1">
              <div className="h-10"></div>
              <p className="text-[10px] font-black border-t pt-1.5 border-neutral-600 max-w-[200px] mx-auto text-neutral-850 uppercase truncate">
                {anexoData.nombre_estudiante}
              </p>
              <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Firma del Estudiante Solicitante</p>
            </div>
            <div className="space-y-1">
              <div className="h-10"></div>
              <p className="text-[10px] font-black border-t pt-1.5 border-neutral-600 max-w-[200px] mx-auto text-neutral-850 uppercase">
                FIRMA Y SELLO
              </p>
              <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Dependencia Receptora</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isGenerating) {
    return (
      <FormServiceRequest 
        user={user}
        dbStudentData={dbStudentData}
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
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,image/*" 
      />
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
                : doc.status === 'PENDIENTE' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700' : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                doc.status === 'RECHAZADO' ? 'bg-rose-500 animate-pulse' : doc.status === 'PENDIENTE' ? 'bg-neutral-400 font-bold' : 'bg-brand-teal animate-pulse'
              }`}></div>
              {doc.status}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border flex items-center gap-2 active:scale-95 ${
              isDarkMode 
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-750' 
                : 'bg-white border-neutral-100 text-brand-blue shadow-sm hover:shadow-md'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Regresar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-3xl border overflow-hidden transition-colors duration-500 min-h-[500px] flex flex-col ${isDarkMode ? 'bg-[#121926] border-neutral-800' : 'bg-white border-neutral-100 shadow-sm'}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-[#005691]/20 text-[#005691]' : 'bg-blue-50 text-[#005691]'}`}>
                  <FileText size={16} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {doc.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">Buzón de entrega oficial</span>
                </div>
              </div>

              {doc.url && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse"></span>
                    Cargado
                  </span>
                </div>
              )}
            </div>

            <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
              {doc.url ? (
                /* State 1: File Already Uploaded */
                <div className="space-y-8 max-w-2xl mx-auto text-center py-6">
                  <div className="relative mx-auto w-20 h-20 bg-brand-teal/10 border-2 border-brand-teal/20 rounded-3xl flex items-center justify-center text-brand-teal animate-fade-in">
                    <FileText size={36} className="text-brand-teal" />
                    <div className="absolute -bottom-1 -right-1 bg-brand-teal text-white rounded-full p-1 border-2 border-white dark:border-[#121926]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Documento Recibido
                    </h3>
                  </div>

                  {/* Clean, perfectly-optimized vertical column details layout */}
                  <div className="max-w-md mx-auto w-full space-y-6">
                    {/* Compact File Info Box */}
                    <div className={`p-5 rounded-3xl border flex items-center gap-4 text-left ${
                      isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100 shadow-sm'
                    }`}>
                      <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-black truncate uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                          {config.fileName}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Digitalizado .pdf</span>
                      </div>
                    </div>

                    {/* Highly-aligned, stacked action buttons for absolute safety & elegance */}
                    <div className="flex flex-col gap-3 font-semibold w-full">
                      <button 
                        onClick={() => window.open(doc.url, '_blank')}
                        className="w-full py-4 bg-[#005691] hover:bg-[#005691]/95 text-white font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/15 transition-all active:scale-95"
                      >
                        <Download size={14} />
                        <span>Descargar Mi Archivo</span>
                      </button>

                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full py-4 bg-brand-orange hover:bg-brand-orange/95 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-brand-orange/15 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>Subir Nuevo Archivo</span>
                      </button>

                      {/* No edit pre-fill button needed since we removed pre-filling questionnaire */}
                    </div>
                  </div>
                </div>
              ) : (
                /* State 2: Missing / Upload Pending */
                isGenerateType ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
                    {/* Step 1: Download Original Template */}
                    <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
                      isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-[#005691]/5 border-[#005691]/10'
                    }`}>
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-[#005691]/10 text-[#005691] flex items-center justify-center font-bold">
                          1
                        </div>
                        <div className="space-y-1.5">
                          <h4 className={`text-xs font-black uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-brand-blue'}`}>
                            Descargar Formato
                          </h4>
                          <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed`}>
                            {stepConfig.desc1}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          onClick={() => {
                            if (plantillaUrl) {
                              window.open(plantillaUrl, '_blank');
                            } else {
                              handlePrint(true);
                            }
                          }}
                          className="w-full px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#005691] text-white shadow-xl shadow-brand-blue/20 hover:bg-[#005691]/90 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                          <Download size={14} />
                          <span>{stepConfig.title}</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Upload Signed / Sealed Document */}
                    <div className={`rounded-3xl border p-6 flex flex-col justify-between ${
                      isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-brand-teal/5 border-brand-teal/10'
                    }`}>
                      <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold">
                          2
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-black uppercase tracking-wide text-brand-teal">
                            Subir Firmado y Sellado
                          </h4>
                          <p className={`text-[11px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} leading-relaxed`}>
                            {stepConfig.desc2}
                          </p>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="w-full px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span>Subir PDF Copia</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Unified upload box for student documents like Kardex, Carga Académica, or Constancia */
                  <div className={`rounded-3xl border p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[300px] ${
                    isDarkMode ? 'bg-white/5 border-neutral-800' : 'bg-brand-teal/5 border-brand-teal/10'
                  }`}>
                    <div className="w-16 h-16 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center border border-dashed border-brand-teal/20">
                      {isUploading ? <Loader2 size={24} className="animate-spin text-brand-teal" /> : <Upload size={24} />}
                    </div>

                    <div className="space-y-2">
                      <h4 className={`text-base font-black uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        Cargar {doc.title}
                      </h4>
                      <p className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed max-w-md mx-auto`}>
                        {config.tip ? config.tip.replace('Tip: ', '') : 'Por favor, sube tu formato oficial en formato PDF. Asegurándote de que sea legible y de alta calidad para su correcta validación.'}
                      </p>
                    </div>

                    <div className="pt-2 w-full max-w-xs">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-brand-teal text-white shadow-xl shadow-brand-teal/20 hover:bg-brand-teal/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>Seleccionar y Subir PDF</span>
                      </button>
                    </div>
                  </div>
                )
              )}
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
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${
                    item.status === 'RECHAZADO' ? 'bg-rose-500' : 
                    item.status === 'APROBADO' ? 'bg-brand-teal' :
                    item.status === 'SENT' ? 'bg-brand-orange' : 'bg-brand-teal animate-pulse'
                  }`} />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{item.event}</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">{item.description}</p>
                    {item.date && (
                      <span className="block text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-widest mt-1">{item.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-blue-50 dark:bg-brand-blue/5 rounded-2xl">
              <p className="text-xs font-medium text-brand-blue/70 italic flex items-start gap-2">
                <Lightbulb size={14} className="shrink-0 animate-pulse" />
                {config.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
