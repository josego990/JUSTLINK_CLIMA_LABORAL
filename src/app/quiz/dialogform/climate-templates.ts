import * as XLSX from 'xlsx';

export type ClimateCreationMode = 'blank' | 'template';
export type ClimateTemplateId = 'gallup-q12' | 'gptw' | 'nom-035-mexico';

export interface ClimateTemplateDefinition {
  id: ClimateTemplateId;
  nameKey: string;
  descriptionKey: string;
  defaultNameKey: string;
  defaultDescriptionKey: string;
  assetPath: string;
  icon: string;
  surveyCount: number;
  factorCount: number;
  questionCount: number;
  evaluationMethod: 1 | 2;
}

export interface ClimateTemplateBatchItem {
  tipo: 'gran_factor' | 'factor' | 'pregunta';
  data: Record<string, unknown>;
}

export const CLIMATE_TEMPLATES: ClimateTemplateDefinition[] = [
  {
    id: 'gallup-q12',
    nameKey: 'MENUITEMS.QUIZ.TEMPLATES.GALLUP_NAME',
    descriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.GALLUP_DESCRIPTION',
    defaultNameKey: 'MENUITEMS.QUIZ.TEMPLATES.GALLUP_DEFAULT_NAME',
    defaultDescriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.GALLUP_DEFAULT_DESCRIPTION',
    assetPath: 'assets/data/climate-templates/Plantilla_Clima_Gallup_Q12.xlsx',
    icon: 'insights',
    surveyCount: 1,
    factorCount: 4,
    questionCount: 12,
    evaluationMethod: 2,
  },
  {
    id: 'gptw',
    nameKey: 'MENUITEMS.QUIZ.TEMPLATES.GPTW_NAME',
    descriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.GPTW_DESCRIPTION',
    defaultNameKey: 'MENUITEMS.QUIZ.TEMPLATES.GPTW_DEFAULT_NAME',
    defaultDescriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.GPTW_DEFAULT_DESCRIPTION',
    assetPath: 'assets/data/climate-templates/Plantilla_Clima_GPTW.xlsx',
    icon: 'workspace_premium',
    surveyCount: 1,
    factorCount: 5,
    questionCount: 30,
    evaluationMethod: 2,
  },
  {
    id: 'nom-035-mexico',
    nameKey: 'MENUITEMS.QUIZ.TEMPLATES.NOM035_NAME',
    descriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.NOM035_DESCRIPTION',
    defaultNameKey: 'MENUITEMS.QUIZ.TEMPLATES.NOM035_DEFAULT_NAME',
    defaultDescriptionKey: 'MENUITEMS.QUIZ.TEMPLATES.NOM035_DEFAULT_DESCRIPTION',
    assetPath: 'assets/data/climate-templates/Plantilla_Clima_NOM035_Mexico.xlsx',
    icon: 'fact_check',
    surveyCount: 3,
    factorCount: 22,
    questionCount: 133,
    evaluationMethod: 2,
  },
];

function normalize(value: unknown): string {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function readValue(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return '';
}

function resolveQuestionType(type: string): { type: string; prefix: string } | null {
  switch (normalize(type)) {
    case 'LIKERT':
      return { type: 'radio', prefix: 'rad_' };
    case 'PREGUNTA ABIERTA':
      return { type: 'text', prefix: 'txt_' };
    case 'PREGUNTA IA':
      return { type: 'iatext', prefix: 'iatxt_' };
    case 'RANGO':
      return { type: 'slider', prefix: 'sld_' };
    case 'LISTA':
      return { type: 'select', prefix: 'sel_' };
    case 'LISTA DEMOGRAFICO':
      return { type: 'selectdem', prefix: 'seldem_' };
    default:
      return null;
  }
}

export async function loadClimateTemplateItems(
  template: ClimateTemplateDefinition,
): Promise<ClimateTemplateBatchItem[]> {
  const response = await fetch(new URL(template.assetPath, document.baseURI).toString());
  if (!response.ok) {
    throw new Error(`No se pudo cargar la plantilla (${response.status}).`);
  }

  const workbook = XLSX.read(await response.arrayBuffer(), { type: 'array' });
  const sheetName = workbook.SheetNames.find((name) => normalize(name) === 'ENCUESTA');
  if (!sheetName) {
    throw new Error('La plantilla no contiene la hoja ENCUESTA.');
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
    defval: '',
  });
  const items: ClimateTemplateBatchItem[] = [];
  let surveyIndex = 0;
  let factorIndex = 0;
  let questionIndex = 1;
  let hasSurvey = false;
  let hasFactor = false;

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const type = normalize(readValue(row, ['TIPO', 'TYPE']));
    const label = readValue(row, ['ETIQUETA', 'LABEL']);
    const description = readValue(row, ['DESCRIPCION', 'DESCRIPTION']);
    const options = readValue(row, ['OPCIONES LISTA', 'OPTIONS LIST']);

    if (!type && !label && !description && !options) {
      return;
    }
    if (!label) {
      throw new Error(`La fila ${rowNumber} no tiene ETIQUETA.`);
    }

    if (type === 'ENCUESTA') {
      items.push({
        tipo: 'gran_factor',
        data: {
          Clave: `gfac_${surveyIndex}`,
          Etiqueta: label,
          Descripcion: description,
        },
      });
      surveyIndex += 1;
      hasSurvey = true;
      hasFactor = false;
      return;
    }

    if (type === 'FACTOR') {
      if (!hasSurvey) {
        throw new Error(`La fila ${rowNumber} contiene un FACTOR sin ENCUESTA.`);
      }
      items.push({
        tipo: 'factor',
        data: {
          Clave: `serie_${factorIndex}`,
          Etiqueta: label,
          Descripcion: description,
          Puntaje: 0,
          IdGranFactor: 0,
        },
      });
      factorIndex += 1;
      hasFactor = true;
      return;
    }

    if (!hasFactor) {
      throw new Error(`La fila ${rowNumber} contiene una pregunta sin FACTOR.`);
    }

    const questionType = resolveQuestionType(type);
    if (!questionType) {
      throw new Error(`La fila ${rowNumber} contiene un tipo no compatible: ${type}.`);
    }

    items.push({
      tipo: 'pregunta',
      data: {
        IdFactor: 0,
        Tipo: questionType.type,
        NombreCampo: `${questionType.prefix}${questionIndex}`,
        Etiqueta: label,
        Obligatoria: false,
        Puntaje: 0,
        ValorCorrecto: '',
        Aleatorio: false,
        Estado: 1,
        RangoMin: 1,
        RangoMax: 10,
        Lista: options,
        Desc: description,
      },
    });
    questionIndex += 1;
  });

  if (items.length === 0) {
    throw new Error('La plantilla seleccionada no contiene datos para importar.');
  }

  return items;
}
