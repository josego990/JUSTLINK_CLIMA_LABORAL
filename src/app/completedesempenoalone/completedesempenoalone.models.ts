export interface DesempenoScaleValue {
  id: number;
  valor: number;
  etiqueta: string;
  orden: number;
}

export interface DesempenoEvaluationItem {
  id: number;
  codigo: string;
  texto: string;
  tipoItemCodigo: string;
  usaEscala: boolean;
  permiteTexto: boolean;
  permiteSeleccionMultiple: boolean;
  escalaId: number | null;
  requerido: boolean;
  permiteNoAplica: boolean;
  orden: number;
  valoresEscala: DesempenoScaleValue[];
}

export interface DesempenoEvaluationCriterion {
  id: number;
  codigo: string;
  nombre: string;
  ponderacion: number;
  nivelExigencia: number;
  orden: number;
  items: DesempenoEvaluationItem[];
}

export interface DesempenoEvaluationDimension {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  ponderacion: number;
  orden: number;
  criterios: DesempenoEvaluationCriterion[];
}

export interface DesempenoEvaluationForm {
  evaluacionId: number;
  evaluacion: string;
  fechaInicio: string;
  fechaCierre: string;
  asignacionId: number;
  tokenAcceso: string;
  evaluador: string;
  evaluado: string;
  escenarioCodigo: string;
  escenario: string;
  esAnonima: boolean;
  respondida?: boolean;
  puedeResponder?: boolean;
  mensaje?: string;
  dimensiones: DesempenoEvaluationDimension[];
}

export interface DesempenoAnswer {
  itemId: number;
  escalaValorId: number | null;
  valorNumero: number | null;
  valorTexto: string | null;
  noAplica: boolean;
  opcionIds: number[];
}

export interface DesempenoAnswerPayload {
  respuestas: DesempenoAnswer[];
}

export interface DesempenoResponseResult {
  idRespuesta: number;
  finalizada: boolean;
}
