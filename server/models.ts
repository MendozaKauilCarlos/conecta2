import mongoose from 'mongoose';

// ==========================================================================
// 🏢 1. DEFINICIÓN DEL ESQUEMA DE DEPENDENCIAS
// ==========================================================================
const DependenciaSchema = new mongoose.Schema({
  activo: { type: Boolean, default: true },
  interno: { type: Boolean, default: false },
  modalidad: { type: String, default: 'presencial' },
  nombre_dependencia: { type: String, required: true, lowercase: true, trim: true },
  nombre_programa: { type: String, required: true },
  objetivo: { type: String },
  sector: { type: String, default: 'publico' },
  vacantes: { type: Number, default: 0 },
  logo: { type: String },
  actividades: [{ type: String }],
  contacto: { 
    correo: String, 
    nombre_titular: String, 
    puesto_titular: String, 
    responsable_del_programa: String, 
    telefono: String 
  },
  horarios_servicio: { dias: String, horas: String },
  ubicacion: { domicilio_dependencia: String, ubicacion_maps: String }
}, { timestamps: true });

export const Dependencia = (mongoose.models.Dependencia || mongoose.model('Dependencia', DependenciaSchema)) as any;

// ==========================================================================
// 🎓 2. DEFINICIÓN DEL ESQUEMA DE ALUMNOS
// ==========================================================================
const AlumnoSchema = new mongoose.Schema({
  apto: { type: Boolean, default: false },
  id_dependencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Dependencia', default: null },
  
  credenciales: {
    correo: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }
  },

  datos: {
    nombre: String, 
    apellido_paterno: String, 
    apellido_materno: String,
    correo_institucional: { type: String, unique: true }, 
    fecha_nacimiento: Date,
    foto: String, 
    no_control: { type: String, unique: true }, 
    nss: String, 
    sexo: String, 
    telefono: String
  },
  domicilio: { calle: String, ciudad: String, colonia: String, cp: String, estado: String },
  status_academico: { 
    carrera: String, 
    creditos_aprobados: Number, 
    creditos_complementarios: Number, 
    creditos_total_carrera: Number, 
    periodo: Date, 
    semestre: Number 
  },
  requisitos_iniciales: {
    carga_academica: { 
      estado_validacion: Boolean, 
      fecha_subida: Date, 
      observaciones: String, 
      url_documento: String 
    },
    constancia_vigencia_derechos: { 
      estado_validacion: Boolean, 
      fecha_subida: Date, 
      observaciones: String, 
      url_documento: String 
    },
    kardex: { 
      estado_validacion: Boolean, 
      fecha_subida: Date, 
      observaciones: String, 
      url_documento: String 
    }
  },
  documentos_apertura: {
    carta_asignacion: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_subida: Date, 
      observaciones: String, 
      url_modificado: String, 
      url_plantilla: String 
    },
    carta_compromiso: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_subida: Date, 
      observaciones: String, 
      url_modificado: String, 
      url_plantilla: String 
    },
    plan_trabajo: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_subida: Date, 
      observaciones: String, 
      url_modificado: String, 
      url_plantilla: String 
    },
    solicitud_servicio: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_subida: Date, 
      observaciones: String, 
      url_modificado: String, 
      url_plantilla: String 
    },
    tarjeta_control: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_subido: Date, 
      observaciones: String, 
      url_modificado: String, 
      url_plantilla: String 
    }
  },
  reportes_bimestrales: [{
    numero_reporte: Number,
    auto_evaluacion: { 
      calificacion: Number, 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      nivel_desempeño: String, 
      observaciones: String, 
      puntaje: [Number], 
      url_plantilla: String, 
      url_sellado: String 
    },
    evaluacion_cualitativa: { 
      calificacion: Number, 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      nivel_desempeño: String, 
      observaciones: String, 
      puntaje: [Number], 
      url_plantilla: String, 
      url_sellado: String 
    },
    reporte_bimestral_doc: { 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      fecha_inicio: Date, 
      fecha_termina: Date, 
      hora_bimestre: Number, 
      horas_acumuladas: Number, 
      observaciones: String, 
      resumen: String, 
      url_plantilla: String, 
      url_sellado: String 
    }
  }],
  cierre_servicio: {
    evaluacion_desempeno_final: { 
      calificacion: Number, 
      estado_validacion: Boolean, 
      fecha_generacion: Date, 
      nivel_desempeno: String, 
      observaciones: String, 
      puntaje: [Number], 
      url_plantilla: String, 
      url_sellado: String 
    },
    formato_final: { 
      puntaje: [Number], 
      calificacion: Number, 
      comentarios_vinculacion: String, 
      url_plantilla: String, 
      url_sellado: String, 
      observaciones: String, 
      estado_validacion: Boolean, 
      fecha_generacion: Date 
    },
    reporte_final: { 
      url_documento: String, 
      observaciones: String, 
      estado_validacion: Boolean, 
      fecha_subida: Date 
    }
  }
}, { timestamps: true });

export const Alumno = (mongoose.models.Alumno || mongoose.model('Alumno', AlumnoSchema)) as any;
