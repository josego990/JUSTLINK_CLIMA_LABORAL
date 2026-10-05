import ExcelJS from 'exceljs';
import {
  CriteriaBankImportCriterion,
  CriteriaBankImportResult,
  CriteriaBankQuestionType,
} from './criteria-bank.models';

type CriteriaBankColumn =
  | 'code'
  | 'criterion'
  | 'description'
  | 'dimension'
  | 'requiredLevel'
  | 'tags'
  | 'question'
  | 'questionType'
  | 'scale';

const COLUMN_ALIASES: Record<CriteriaBankColumn, string[]> = {
  code: ['CODIGO CRITERIO', 'CRITERION CODE', 'CODE'],
  criterion: ['CRITERIO', 'CRITERION'],
  description: ['DESCRIPCION CRITERIO', 'CRITERION DESCRIPTION', 'DESCRIPCION'],
  dimension: ['DIMENSION SUGERIDA', 'SUGGESTED DIMENSION', 'DIMENSION'],
  requiredLevel: ['NIVEL EXIGENCIA', 'NIVEL EXIGENCIA %', 'REQUIRED LEVEL', 'REQUIRED LEVEL %'],
  tags: ['ETIQUETAS', 'TAGS', 'TAG'],
  question: ['PREGUNTA', 'QUESTION', 'ITEM'],
  questionType: ['TIPO PREGUNTA', 'QUESTION TYPE', 'TIPO ITEM'],
  scale: ['ESCALA SUGERIDA', 'SUGGESTED SCALE', 'ESCALA', 'SCALE'],
};

export const CRITERIA_BANK_EXCEL_HEADERS = [
  'CODIGO_CRITERIO',
  'CRITERIO *',
  'DESCRIPCION_CRITERIO',
  'DIMENSION_SUGERIDA',
  'NIVEL_EXIGENCIA (%)',
  'ETIQUETAS',
  'PREGUNTA *',
  'TIPO_PREGUNTA *',
  'ESCALA_SUGERIDA',
] as const;

export class CriteriaBankExcelValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(errors.join('\n'));
    this.name = 'CriteriaBankExcelValidationError';
  }
}

export async function parseCriteriaBankWorkbook(
  buffer: ArrayBuffer
): Promise<CriteriaBankImportResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets.find(
    (sheet) => normalize(sheet.name) !== 'INSTRUCCIONES' && normalize(sheet.name) !== 'INSTRUCTIONS'
  );

  if (!worksheet) {
    throw new CriteriaBankExcelValidationError([
      'El archivo debe incluir una hoja de datos distinta de INSTRUCCIONES.',
    ]);
  }

  const headerRow = worksheet.getRow(1);
  const columns = resolveColumns(headerRow.values as ExcelJS.CellValue[]);
  const missingHeaders: string[] = [];

  if (!columns.criterion) {
    missingHeaders.push('CRITERIO');
  }
  if (!columns.question) {
    missingHeaders.push('PREGUNTA');
  }
  if (!columns.questionType) {
    missingHeaders.push('TIPO_PREGUNTA');
  }

  if (missingHeaders.length > 0) {
    throw new CriteriaBankExcelValidationError([
      `Faltan columnas obligatorias: ${missingHeaders.join(', ')}.`,
    ]);
  }

  const errors: string[] = [];
  const grouped = new Map<string, CriteriaBankImportCriterion>();
  let rowCount = 0;

  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const criterionName = getCellText(row, columns.criterion);
    const questionText = getCellText(row, columns.question);
    const hasContent = (row.values as ExcelJS.CellValue[]).some((value) => cellText(value).length > 0);

    if (!hasContent) {
      continue;
    }

    rowCount += 1;

    if (!criterionName) {
      errors.push(`Fila ${rowNumber}: el criterio es obligatorio.`);
    }
    if (!questionText) {
      errors.push(`Fila ${rowNumber}: la pregunta es obligatoria.`);
    }

    const questionTypeRaw = getCellText(row, columns.questionType);
    const questionType = parseQuestionType(questionTypeRaw);
    if (!questionType) {
      errors.push(
        `Fila ${rowNumber}: el tipo de pregunta debe ser "Likert de 5 niveles" o "Pregunta abierta".`
      );
    }

    const requiredLevelRaw = getCellText(row, columns.requiredLevel);
    const requiredLevel = requiredLevelRaw ? Number(requiredLevelRaw.replace(',', '.')) : 80;
    if (!Number.isInteger(requiredLevel) || requiredLevel < 1 || requiredLevel > 100) {
      errors.push(`Fila ${rowNumber}: el nivel de exigencia debe ser un entero entre 1 y 100.`);
    }

    if (!criterionName || !questionText || !questionType || !Number.isInteger(requiredLevel) || requiredLevel < 1 || requiredLevel > 100) {
      continue;
    }

    const code = getCellText(row, columns.code);
    const dimension = getCellText(row, columns.dimension);
    const groupKey = code
      ? `CODE:${normalize(code)}`
      : `NAME:${normalize(criterionName)}|${normalize(dimension)}`;
    const description = getCellText(row, columns.description);
    const tags = parseTags(getCellText(row, columns.tags));
    const scale = questionType === 'ABIERTA'
      ? null
      : getCellText(row, columns.scale) || 'Cumplimiento';
    const existing = grouped.get(groupKey);

    if (!existing) {
      grouped.set(groupKey, {
        code: code || createCriterionCode(criterionName),
        name: criterionName,
        description,
        suggestedDimension: dimension,
        requiredLevel,
        tags,
        questions: [{ text: questionText, type: questionType, suggestedScale: scale }],
        sourceRows: [rowNumber],
      });
      continue;
    }

    if (normalize(existing.name) !== normalize(criterionName)) {
      errors.push(`Fila ${rowNumber}: el código ${existing.code} ya se usó para el criterio "${existing.name}".`);
      continue;
    }

    if (existing.requiredLevel !== requiredLevel) {
      errors.push(
        `Fila ${rowNumber}: el nivel de exigencia no coincide con las otras filas del criterio "${existing.name}".`
      );
    }

    const duplicateQuestion = existing.questions.some(
      (question) => normalize(question.text) === normalize(questionText)
    );
    if (duplicateQuestion) {
      errors.push(`Fila ${rowNumber}: la pregunta está repetida dentro del criterio "${existing.name}".`);
      continue;
    }

    existing.description ||= description;
    existing.suggestedDimension ||= dimension;
    existing.tags = unique([...existing.tags, ...tags]);
    existing.questions.push({ text: questionText, type: questionType, suggestedScale: scale });
    existing.sourceRows.push(rowNumber);
  }

  if (rowCount === 0) {
    errors.push('La hoja de datos no contiene filas para importar.');
  }

  if (errors.length > 0) {
    throw new CriteriaBankExcelValidationError(errors);
  }

  const criteria = Array.from(grouped.values());
  return {
    criteria,
    rowCount,
    questionCount: criteria.reduce((total, criterion) => total + criterion.questions.length, 0),
  };
}

function resolveColumns(values: ExcelJS.CellValue[]): Partial<Record<CriteriaBankColumn, number>> {
  const result: Partial<Record<CriteriaBankColumn, number>> = {};

  values.forEach((value, index) => {
    const header = normalize(cellText(value));
    if (!header) {
      return;
    }

    (Object.keys(COLUMN_ALIASES) as CriteriaBankColumn[]).forEach((column) => {
      if (!result[column] && COLUMN_ALIASES[column].some((alias) => header === normalize(alias))) {
        result[column] = index;
      }
    });
  });

  return result;
}

function getCellText(row: ExcelJS.Row, column?: number): string {
  return column ? cellText(row.getCell(column).value) : '';
}

function cellText(value: ExcelJS.CellValue | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    if ('text' in value) {
      return String(value.text ?? '').trim();
    }
    if ('result' in value) {
      return String(value.result ?? '').trim();
    }
    if ('richText' in value && Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text).join('').trim();
    }
  }
  return String(value).trim();
}

function parseQuestionType(value: string): CriteriaBankQuestionType | null {
  const normalized = normalize(value);
  if (['LIKERT', 'LIKERT 1 5', 'LIKERT DE 5 NIVELES', '5 LEVEL LIKERT'].includes(normalized)) {
    return 'LIKERT_1_5';
  }
  if (['ABIERTA', 'PREGUNTA ABIERTA', 'RESPUESTA ABIERTA', 'OPEN QUESTION', 'OPEN RESPONSE'].includes(normalized)) {
    return 'ABIERTA';
  }
  return null;
}

function parseTags(value: string): string[] {
  return unique(
    value
      .split(/[,;|]/)
      .map((tag) => tag.trim().replace(/^#+/, ''))
      .filter(Boolean)
  );
}

function createCriterionCode(value: string): string {
  const slug = normalize(value).replace(/\s+/g, '_').slice(0, 32);
  return `CRT_${slug || 'CRITERIO'}`;
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function normalize(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_*()%]/g, ' ')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase();
}
