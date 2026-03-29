export interface Quiz {
  id: number;
  idOrganization: number;
  avatarSrc: string;
  title: string;
  subtitle: string;
  imageSrc1: string;
  content: string;
  score: number;
  completed: boolean;
  startDate: string;
  endDate: string;
  series: Serie[];
  fields: Field[];
  granFactores: GFactor[];
  contestadas: number;
  totalEncuestas: number;
  pendientes: number;
  totalEmpleados: number;
  estado: number;
  estadoEnvio: string;
  tipoEvaluacion: string,
  estadisticasEnvio: EstadisticasEnvio;
}

export interface EstadisticasEnvio {
  total: number;
  total_creadas: number;
  total_enviadas: number;
  total_iniciadas: number;
  total_contestadas: number;
  total_error: number;
  total_empleados_activos: number;
  porcentaje: number;
}

export interface FieldsConfig {
  fields: Field[];
}

export interface Field {
  id: number;
  type: string;
  name: string;
  label: string;
  required: boolean;
  score: number;
  min: number;
  max: number;
  options: FieldOption[];
  value_correct: string;  
  file_type: string;
  is_random: boolean;
  is_active: number;
  serie: string;
}

export interface FieldOption {
  value: string;
  label: string;
  name: string;
  is_correct: boolean;
}



export interface Serie {
  Id: number;
  id_flujo: number;
  value: string;
  label: string;
  desc: string;
  fields: Field[];
  score: number;
}

export interface GFactor {
  Id: number;
  id_flujo: number;
  value: string;
  label: string;
  desc: string;
  series: Serie[];
}

export interface QuizBank {
  category: string;
  unit: number;
  fields: Field[];
}

export interface GFactorsDataSend {
  gfactores: GFactor[];
  idFlujo: number;
  
}

export interface SeriesDataSend {
  series: Serie[];
  ponderation_rest: number;
  ponderation_total: number;
  idFlujo: number;
  idGFactor: number;
  gfactores: any[];
}