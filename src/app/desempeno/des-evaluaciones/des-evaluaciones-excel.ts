import * as XLSX from 'xlsx';
import { requiredRatingPercentToScale } from '../shared/performance-score.utils';

export type DesEvaluationExcelScenarioKey =
  | 'BOSS_TO_EMPLOYEE'
  | 'EMPLOYEE_TO_BOSS'
  | 'SELF'
  | 'PEER';

export type DesEvaluationExcelItemType = 'LIKERT_1_5' | 'ABIERTA';

export interface DesEvaluationExcelScale {
  id: number;
  code?: string;
  name: string;
  levels: string[];
}

export interface DesEvaluationExcelContext {
  positions: string[];
  dimensions?: Array<{
    name: string;
    weight: number;
  }>;
  positionScenarios?: Array<{
    position: string;
    scenarios: Array<{
      key: DesEvaluationExcelScenarioKey;
      weight: number;
    }>;
  }>;
  scenarios: Array<{
    key: DesEvaluationExcelScenarioKey;
    names: string[];
  }>;
  scales: DesEvaluationExcelScale[];
  defaultScaleId: number;
  demoLimits?: {
    dimensions: number;
    criteriaPerDimension: number;
    itemsPerCriterion: number;
  };
  translate: (key: string, params?: Record<string, unknown>) => string;
}

export interface DesEvaluationExcelRow {
  sheetName: string;
  rowNumber: number;
  position: string;
  scenarioKey: DesEvaluationExcelScenarioKey;
  scenarioWeight: number;
  dimensionCode: string | null;
  dimensionName: string;
  dimensionDescription: string;
  dimensionWeight: number;
  criterionCode: string | null;
  criterionName: string;
  criterionDescription: string;
  criterionWeight: number;
  requiredRatingLevel: number;
  itemCode: string | null;
  itemText: string;
  itemType: DesEvaluationExcelItemType;
  scaleId: number | null;
  options: string[];
}

export interface DesEvaluationExcelImport {
  rows: DesEvaluationExcelRow[];
  positions: string[];
  scenarioCount: number;
  dimensionCount: number;
  criterionCount: number;
  itemCount: number;
}

export class DesEvaluationExcelValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(errors.join('\n'));
    this.name = 'DesEvaluationExcelValidationError';
  }
}

type ExcelColumnKey =
  | 'position'
  | 'scenario'
  | 'scenarioWeight'
  | 'dimensionCode'
  | 'dimensionName'
  | 'dimensionDescription'
  | 'dimensionWeight'
  | 'criterionCode'
  | 'criterionName'
  | 'criterionDescription'
  | 'criterionWeight'
  | 'requiredRatingLevel'
  | 'itemCode'
  | 'itemText'
  | 'itemType'
  | 'scale'
  | 'options';

export const DES_EVALUATION_EXCEL_HEADERS: Record<ExcelColumnKey, string> = {
  position: 'Puesto *',
  scenario: 'Escenario *',
  scenarioWeight: 'Ponderación escenario (%) *',
  dimensionCode: 'Código dimensión',
  dimensionName: 'Dimensión *',
  dimensionDescription: 'Descripción dimensión',
  dimensionWeight: 'Ponderación dimensión (%) *',
  criterionCode: 'Código criterio',
  criterionName: 'Criterio *',
  criterionDescription: 'Descripción criterio',
  criterionWeight: 'Ponderación criterio (%) *',
  requiredRatingLevel: 'Nivel exigencia (%) *',
  itemCode: 'Código ítem',
  itemText: 'Ítem evaluativo *',
  itemType: 'Tipo de ítem *',
  scale: 'Escala',
  options: 'Opciones Likert (separadas por |)',
};

const TEMPLATE_COLUMN_KEYS: ExcelColumnKey[] = [
  'scenario',
  'scenarioWeight',
  'dimensionName',
  'dimensionDescription',
  'dimensionWeight',
  'criterionName',
  'criterionDescription',
  'criterionWeight',
  'requiredRatingLevel',
  'itemText',
  'itemType',
  'scale',
  'options',
];

export const DES_EVALUATION_EXCEL_TEMPLATE_HEADERS = TEMPLATE_COLUMN_KEYS.map(
  (key) => DES_EVALUATION_EXCEL_HEADERS[key]
);

export const DES_EVALUATION_DIMENSION_EXCEL_HEADERS = {
  positions: 'PUESTOS *',
  scenarios: 'ESCENARIOS DE EVALUACION *',
} as const;

export const DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS = [
  DES_EVALUATION_DIMENSION_EXCEL_HEADERS.positions,
  DES_EVALUATION_DIMENSION_EXCEL_HEADERS.scenarios,
  'CRITERIO *',
  'PONDERACION (%) *',
  'NIVEL EXIGENCIA (%) *',
  'PREGUNTA *',
  'TIPO PREGUNTA *',
] as const;

export type DesEvaluationDimensionCriterionColumn =
  | 'criterion'
  | 'weight'
  | 'requiredRating'
  | 'question'
  | 'questionType';

const DIMENSION_CRITERION_COLUMN_ORDER: DesEvaluationDimensionCriterionColumn[] = [
  'criterion',
  'weight',
  'requiredRating',
  'question',
  'questionType',
];

export function getDesEvaluationDimensionCriterionHeader(
  column: DesEvaluationDimensionCriterionColumn,
  criterionNumber: number
): string {
  const labels: Record<DesEvaluationDimensionCriterionColumn, string> = {
    criterion: 'CRITERIO',
    weight: 'PONDERACION (%)',
    requiredRating: 'NIVEL EXIGENCIA (%)',
    question: 'PREGUNTA',
    questionType: 'TIPO PREGUNTA',
  };

  return `${labels[column]} ${criterionNumber}`;
}

export function getDesEvaluationDimensionExcelHeaders(criterionCount = 2): string[] {
  const headers: string[] = [
    DES_EVALUATION_DIMENSION_EXCEL_HEADERS.positions,
    DES_EVALUATION_DIMENSION_EXCEL_HEADERS.scenarios,
  ];

  for (let criterionNumber = 1; criterionNumber <= criterionCount; criterionNumber++) {
    DIMENSION_CRITERION_COLUMN_ORDER.forEach((column) => {
      headers.push(getDesEvaluationDimensionCriterionHeader(column, criterionNumber));
    });
  }

  return headers;
}

const POSITION_MAP_SHEET = '_CONFIG';
const POSITION_MAP_SHEET_HEADER = 'Hoja';
const POSITION_MAP_POSITION_HEADER = 'Puesto';
const DIMENSION_MAP_DIMENSION_HEADER = 'Dimension';

export function appendDesEvaluationPositionMapSheet(
  workbook: XLSX.WorkBook,
  mappings: Array<{ sheetName: string; position: string }>
): void {
  const worksheet = XLSX.utils.json_to_sheet(
    mappings.map((mapping) => ({
      [POSITION_MAP_SHEET_HEADER]: mapping.sheetName,
      [POSITION_MAP_POSITION_HEADER]: mapping.position,
    }))
  );
  worksheet['!cols'] = [{ wch: 34 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(workbook, worksheet, POSITION_MAP_SHEET);

  const workbookMetadata = (workbook as any).Workbook ?? {};
  const currentSheetMetadata = Array.isArray(workbookMetadata.Sheets)
    ? workbookMetadata.Sheets
    : [];
  workbookMetadata.Sheets = workbook.SheetNames.map((name, index) => ({
    ...(currentSheetMetadata[index] ?? {}),
    name,
    Hidden: name === POSITION_MAP_SHEET ? 2 : 0,
  }));
  (workbook as any).Workbook = workbookMetadata;
}

const COLUMN_ALIASES: Record<ExcelColumnKey, string[]> = {
  position: ['puesto', 'nombre puesto', 'position', 'position name'],
  scenario: ['escenario', 'scenario'],
  scenarioWeight: [
    'ponderacion escenario',
    'ponderacion escenario %',
    'peso escenario',
    'scenario weight',
  ],
  dimensionCode: ['codigo dimension', 'dimension code'],
  dimensionName: ['dimension', 'nombre dimension', 'dimension name'],
  dimensionDescription: ['descripcion dimension', 'dimension description'],
  dimensionWeight: [
    'ponderacion dimension',
    'ponderacion dimension %',
    'peso dimension',
    'dimension weight',
  ],
  criterionCode: ['codigo criterio', 'criterion code'],
  criterionName: ['criterio', 'nombre criterio', 'criterion', 'criterion name'],
  criterionDescription: ['descripcion criterio', 'criterion description'],
  criterionWeight: [
    'ponderacion criterio',
    'ponderacion criterio %',
    'peso criterio',
    'criterion weight',
  ],
  requiredRatingLevel: [
    'nivel exigencia',
    'nivel exigencia %',
    'nivel exigencia 1 100',
    'nivel exigencia 1 5',
    'nivel de exigencia',
    'required rating level',
  ],
  itemCode: ['codigo item', 'codigo item evaluativo', 'item code'],
  itemText: ['item evaluativo', 'pregunta', 'texto item', 'evaluative item', 'item text'],
  itemType: ['tipo de item', 'tipo item', 'item type'],
  scale: ['escala', 'scale'],
  options: ['opciones likert', 'opciones', 'likert options', 'options'],
};

const REQUIRED_COLUMNS: ExcelColumnKey[] = [
  'scenario',
  'scenarioWeight',
  'dimensionName',
  'dimensionWeight',
  'criterionName',
  'criterionWeight',
  'requiredRatingLevel',
  'itemText',
  'itemType',
];

const IGNORED_SHEETS = new Set(['LEEME', 'README', 'INSTRUCCIONES', 'CATALOGOS']);
const WEIGHT_TOLERANCE = 0.01;

function normalize(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase();
}

function text(value: unknown): string {
  return String(value ?? '').trim();
}

function optionalText(value: unknown): string | null {
  const result = text(value);
  return result || null;
}

function parseWeight(value: unknown): number | null {
  const normalized = text(value)
    .replace(/%/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function splitOptions(value: unknown): string[] {
  return text(value)
    .split(/[|\n]/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function splitSelections(value: unknown): string[] {
  return text(value)
    .split(/[|;\n]/g)
    .map((item) => item.replace(/^[\s\u2610\u2611\u2713\u2714]+/, '').trim())
    .filter((item) => item.length > 0);
}

function isDataSheet(name: string): boolean {
  const normalized = normalize(name).replace(/\s/g, '');
  return !!normalized && !IGNORED_SHEETS.has(normalized) && !name.trim().startsWith('_');
}

function valuesMatch(left: unknown, right: unknown): boolean {
  if (typeof left === 'number' || typeof right === 'number') {
    return Math.abs(Number(left) - Number(right)) <= WEIGHT_TOLERANCE;
  }
  return normalize(left) === normalize(right);
}

function getColumnMap(headers: string[]): Map<ExcelColumnKey, string> {
  const result = new Map<ExcelColumnKey, string>();

  (Object.keys(COLUMN_ALIASES) as ExcelColumnKey[]).forEach((key) => {
    const aliases = new Set([
      normalize(DES_EVALUATION_EXCEL_HEADERS[key]),
      ...COLUMN_ALIASES[key].map((alias) => normalize(alias)),
    ]);
    const header = headers.find((candidate) => aliases.has(normalize(candidate)));
    if (header) result.set(key, header);
  });

  return result;
}

function resolveItemType(value: unknown): DesEvaluationExcelItemType | null {
  const normalized = normalize(value).replace(/\s/g, '_');
  if (
    ['LIKERT', 'LIKERT_1_5', 'LIKERT_DE_5_NIVELES', 'LIKERT_5_NIVELES'].includes(normalized)
  ) {
    return 'LIKERT_1_5';
  }
  if (
    [
      'ABIERTA',
      'PREGUNTA_ABIERTA',
      'RESPUESTA_ABIERTA',
      'TEXTO_ABIERTO',
      'PREGUNTA_DE_TEXTO',
      'OPEN',
      'OPEN_QUESTION',
    ].includes(normalized)
  ) {
    return 'ABIERTA';
  }
  return null;
}

function validateCode(value: string | null): boolean {
  return !value || (value.length <= 50 && /^[A-Za-z0-9_-]+$/.test(value));
}

function isDimensionTemplateWorkbook(workbook: XLSX.WorkBook): boolean {
  return workbook.SheetNames.filter(isDataSheet).some((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const firstRow = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: false,
    })[0] ?? [];
    const normalizedHeaders = firstRow.map(normalize);

    return normalizedHeaders.some((header) => /^CRITERIO\s+1$/.test(header)) &&
      normalizedHeaders.some((header) =>
        ['PUESTOS', 'PUESTO', 'POSITIONS', 'POSITION'].includes(header)
      );
  });
}

function isGroupedDimensionTemplateWorkbook(workbook: XLSX.WorkBook): boolean {
  return workbook.SheetNames.filter(isDataSheet).some((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const firstRow = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: false,
    })[0] ?? [];
    const normalizedHeaders = firstRow.map(normalize);

    return normalizedHeaders.some((header) => header === 'CRITERIO') &&
      normalizedHeaders.some((header) =>
        ['PUESTOS', 'PUESTO', 'POSITIONS', 'POSITION'].includes(header)
      ) &&
      normalizedHeaders.some((header) =>
        ['PREGUNTA', 'QUESTION'].includes(header)
      );
  });
}

export function parseDesEvaluationExcelWorkbook(
  workbook: XLSX.WorkBook,
  context: DesEvaluationExcelContext
): DesEvaluationExcelImport {
  if (isGroupedDimensionTemplateWorkbook(workbook)) {
    return parseGroupedDimensionTemplateWorkbook(workbook, context);
  }
  if (isDimensionTemplateWorkbook(workbook)) {
    return parseDimensionTemplateWorkbook(workbook, context);
  }
  return parseLegacyPositionWorkbook(workbook, context);
}

function parseLegacyPositionWorkbook(
  workbook: XLSX.WorkBook,
  context: DesEvaluationExcelContext
): DesEvaluationExcelImport {
  const t = context.translate;
  const errors: string[] = [];
  const rows: DesEvaluationExcelRow[] = [];
  const dataSheetNames = workbook.SheetNames.filter(isDataSheet);
  const positionsByName = new Map(
    context.positions.map((position) => [normalize(position), position])
  );
  const scenariosByName = new Map<string, DesEvaluationExcelScenarioKey>();
  const scalesByName = new Map<string, DesEvaluationExcelScale>();
  const sheetsByPosition = new Map<string, string>();
  const positionBySheetName = getPositionBySheetName(workbook);
  const configuredDimensionsByName = new Map(
    (context.dimensions ?? []).map((dimension) => [normalize(dimension.name), dimension])
  );
  const configuredScenariosByPosition = new Map(
    (context.positionScenarios ?? []).map((positionConfig) => [
      normalize(positionConfig.position),
      new Map(positionConfig.scenarios.map((scenario) => [scenario.key, scenario])),
    ])
  );

  context.scenarios.forEach((scenario) => {
    scenariosByName.set(normalize(scenario.key), scenario.key);
    scenario.names.forEach((name) => scenariosByName.set(normalize(name), scenario.key));
  });

  context.scales.forEach((scale) => {
    scalesByName.set(normalize(scale.id), scale);
    scalesByName.set(normalize(scale.code), scale);
    scalesByName.set(normalize(scale.name), scale);
  });

  if (dataSheetNames.length === 0) {
    throw new DesEvaluationExcelValidationError([
      t('NO_DATA_SHEETS'),
    ]);
  }

  dataSheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: '',
      raw: false,
    });

    if (rawRows.length === 0) {
      errors.push(t('EMPTY_SHEET', { sheet: sheetName }));
      return;
    }

    const headers = Object.keys(rawRows[0] ?? {});
    const columnMap = getColumnMap(headers);
    const requiredRatingHeader = columnMap.get('requiredRatingLevel') ?? '';
    const usesLegacyRequiredRatingScale = normalize(requiredRatingHeader).includes('1 5');
    const missingHeaders = REQUIRED_COLUMNS
      .filter((key) => !columnMap.has(key))
      .map((key) => DES_EVALUATION_EXCEL_HEADERS[key]);

    if (missingHeaders.length > 0) {
      errors.push(t('MISSING_COLUMNS', {
        sheet: sheetName,
        columns: missingHeaders.join(', '),
      }));
      return;
    }

    const positionHeader = columnMap.get('position');
    const declaredPositions = positionHeader
      ? rawRows.map((row) => text(row[positionHeader]))
      : [];

    if (positionHeader) {
      declaredPositions.forEach((positionValue, index) => {
        if (!positionValue) {
          errors.push(t('REQUIRED_VALUE', {
            sheet: sheetName,
            row: index + 2,
            field: DES_EVALUATION_EXCEL_HEADERS.position,
          }));
        }
      });
    }

    const uniqueDeclaredPositions = Array.from(new Set(
      declaredPositions.filter((positionValue) => !!positionValue).map(normalize)
    ));
    if (uniqueDeclaredPositions.length > 1) {
      errors.push(t('MULTIPLE_POSITIONS_IN_SHEET', { sheet: sheetName }));
      return;
    }

    const positionValue = positionHeader
      ? declaredPositions.find((value) => !!value) ?? ''
      : positionBySheetName.get(normalize(sheetName)) ?? sheetName;
    if (!positionValue) {
      return;
    }

    const position = positionsByName.get(normalize(positionValue));
    if (!position) {
      errors.push(t('POSITION_NOT_FOUND', { sheet: sheetName, value: positionValue }));
      return;
    }

    const positionKey = normalize(position);
    const previousSheet = sheetsByPosition.get(positionKey);
    if (previousSheet && previousSheet !== sheetName) {
      errors.push(t('DUPLICATE_POSITION_SHEET', {
        position,
        sheet: sheetName,
        previousSheet,
      }));
      return;
    }
    sheetsByPosition.set(positionKey, sheetName);

    rawRows.forEach((rawRow, index) => {
      const rowNumber = index + 2;
      const get = (key: ExcelColumnKey): unknown => {
        const header = columnMap.get(key);
        return header ? rawRow[header] : '';
      };
      const rowErrors: string[] = [];
      const requiredValues: Array<[ExcelColumnKey, unknown]> = REQUIRED_COLUMNS.map(
        (key) => [key, get(key)]
      );

      requiredValues.forEach(([key, value]) => {
        if (!text(value)) {
          rowErrors.push(t('REQUIRED_VALUE', {
            sheet: sheetName,
            row: rowNumber,
            field: DES_EVALUATION_EXCEL_HEADERS[key],
          }));
        }
      });

      const scenarioValue = text(get('scenario'));
      const scenarioKey = scenariosByName.get(normalize(scenarioValue)) ?? null;
      if (scenarioValue && !scenarioKey) {
        rowErrors.push(t('INVALID_SCENARIO', {
          sheet: sheetName,
          row: rowNumber,
          value: scenarioValue,
        }));
      }

      const scenarioWeight = parseWeight(get('scenarioWeight'));
      const dimensionWeight = parseWeight(get('dimensionWeight'));
      const criterionWeight = parseWeight(get('criterionWeight'));
      const requiredRatingLevel = parseWeight(get('requiredRatingLevel'));
      const dimensionName = text(get('dimensionName'));
      const configuredDimension = configuredDimensionsByName.get(normalize(dimensionName));
      const configuredPositionScenarios = configuredScenariosByPosition.get(positionKey);
      const configuredScenario = scenarioKey
        ? configuredPositionScenarios?.get(scenarioKey)
        : null;

      if (context.positionScenarios && scenarioKey && !configuredScenario) {
        rowErrors.push(t('SCENARIO_NOT_CONFIGURED', {
          sheet: sheetName,
          row: rowNumber,
          scenario: scenarioValue,
          position,
        }));
      }

      if (context.dimensions && dimensionName && !configuredDimension) {
        rowErrors.push(t('DIMENSION_NOT_CONFIGURED', {
          sheet: sheetName,
          row: rowNumber,
          dimension: dimensionName,
        }));
      }

      ([
        ['scenarioWeight', scenarioWeight],
        ['dimensionWeight', dimensionWeight],
        ['criterionWeight', criterionWeight],
      ] as Array<[ExcelColumnKey, number | null]>).forEach(([key, value]) => {
        if (value === null || value < 0 || value > 100) {
          rowErrors.push(t('INVALID_WEIGHT', {
            sheet: sheetName,
            row: rowNumber,
            field: DES_EVALUATION_EXCEL_HEADERS[key],
          }));
        }
      });

      if (
        configuredScenario &&
        scenarioWeight !== null &&
        !valuesMatch(scenarioWeight, configuredScenario.weight)
      ) {
        rowErrors.push(t('CONFIGURED_WEIGHT_CHANGED', {
          sheet: sheetName,
          row: rowNumber,
          field: DES_EVALUATION_EXCEL_HEADERS.scenarioWeight,
          expected: configuredScenario.weight,
        }));
      }

      if (
        configuredDimension &&
        dimensionWeight !== null &&
        !valuesMatch(dimensionWeight, configuredDimension.weight)
      ) {
        rowErrors.push(t('CONFIGURED_WEIGHT_CHANGED', {
          sheet: sheetName,
          row: rowNumber,
          field: DES_EVALUATION_EXCEL_HEADERS.dimensionWeight,
          expected: configuredDimension.weight,
        }));
      }

      if (
        requiredRatingLevel === null ||
        !Number.isInteger(requiredRatingLevel) ||
        requiredRatingLevel < 1 ||
        requiredRatingLevel > (usesLegacyRequiredRatingScale ? 5 : 100)
      ) {
        rowErrors.push(t('INVALID_REQUIRED_LEVEL', {
          sheet: sheetName,
          row: rowNumber,
        }));
      }

      const itemTypeValue = text(get('itemType'));
      const itemType = resolveItemType(itemTypeValue);
      if (itemTypeValue && !itemType) {
        rowErrors.push(t('INVALID_ITEM_TYPE', {
          sheet: sheetName,
          row: rowNumber,
          value: itemTypeValue,
        }));
      }

      const dimensionCode = optionalText(get('dimensionCode'));
      const criterionCode = optionalText(get('criterionCode'));
      const itemCode = optionalText(get('itemCode'));
      ([
        ['dimensionCode', dimensionCode],
        ['criterionCode', criterionCode],
        ['itemCode', itemCode],
      ] as Array<[ExcelColumnKey, string | null]>).forEach(([key, value]) => {
        if (!validateCode(value)) {
          rowErrors.push(t('INVALID_CODE', {
            sheet: sheetName,
            row: rowNumber,
            field: DES_EVALUATION_EXCEL_HEADERS[key],
          }));
        }
      });

      let scaleId: number | null = null;
      let options: string[] = [];
      if (itemType === 'LIKERT_1_5') {
        const scaleValue = text(get('scale'));
        const scale = !scaleValue || ['PREDETERMINADA', 'DEFAULT'].includes(normalize(scaleValue))
          ? context.scales.find((item) => item.id === context.defaultScaleId)
          : scalesByName.get(normalize(scaleValue));

        if (!scale) {
          rowErrors.push(t('INVALID_SCALE', {
            sheet: sheetName,
            row: rowNumber,
            value: scaleValue || t('DEFAULT_SCALE'),
          }));
        } else if (scale.levels.length === 0) {
          rowErrors.push(t('SCALE_WITHOUT_LEVELS', {
            sheet: sheetName,
            row: rowNumber,
            value: scale.name,
          }));
        } else {
          scaleId = scale.id;
          const importedOptions = splitOptions(get('options'));
          if (importedOptions.length > 0 && importedOptions.length !== scale.levels.length) {
            rowErrors.push(t('INVALID_OPTION_COUNT', {
              sheet: sheetName,
              row: rowNumber,
              expected: scale.levels.length,
              actual: importedOptions.length,
            }));
          } else if (
            importedOptions.length > 0 &&
            importedOptions.some((option, optionIndex) =>
              normalize(option) !== normalize(scale.levels[optionIndex])
            )
          ) {
            rowErrors.push(t('INVALID_OPTIONS', {
              sheet: sheetName,
              row: rowNumber,
              scale: scale.name,
            }));
          }
          options = importedOptions.length > 0 ? importedOptions : [...scale.levels];
        }
      } else if (itemType === 'ABIERTA' && splitOptions(get('options')).length > 0) {
        rowErrors.push(t('OPEN_WITH_OPTIONS', {
          sheet: sheetName,
          row: rowNumber,
        }));
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        return;
      }

      rows.push({
        sheetName,
        rowNumber,
        position,
        scenarioKey: scenarioKey!,
        scenarioWeight: scenarioWeight!,
        dimensionCode,
        dimensionName,
        dimensionDescription: text(get('dimensionDescription')),
        dimensionWeight: dimensionWeight!,
        criterionCode,
        criterionName: text(get('criterionName')),
        criterionDescription: text(get('criterionDescription')),
        criterionWeight: criterionWeight!,
        requiredRatingLevel: usesLegacyRequiredRatingScale
          ? requiredRatingLevel!
          : requiredRatingPercentToScale(requiredRatingLevel!),
        itemCode,
        itemText: text(get('itemText')),
        itemType: itemType!,
        scaleId,
        options,
      });
    });
  });

  validateWorkbookConsistency(rows, context, errors);

  if (errors.length > 0) {
    throw new DesEvaluationExcelValidationError(errors);
  }

  const positions = Array.from(new Set(rows.map((row) => row.position)));
  const scenarios = new Set(rows.map((row) => `${normalize(row.position)}|${row.scenarioKey}`));
  const dimensions = new Set(rows.map((row) => normalize(row.dimensionName)));
  const criteria = new Set(rows.map((row) => criterionGroupKey(row)));

  return {
    rows,
    positions,
    scenarioCount: scenarios.size,
    dimensionCount: dimensions.size,
    criterionCount: criteria.size,
    itemCount: rows.length,
  };
}

interface DimensionCriterionBlock {
  criterionNumber: number;
  startColumn: number;
  valid: boolean;
}

function parseGroupedDimensionTemplateWorkbook(
  workbook: XLSX.WorkBook,
  context: DesEvaluationExcelContext
): DesEvaluationExcelImport {
  const t = context.translate;
  const errors: string[] = [];
  const rows: DesEvaluationExcelRow[] = [];
  const dataSheetNames = workbook.SheetNames.filter(isDataSheet);
  const positionsByName = new Map(
    context.positions.map((position) => [normalize(position), position])
  );
  const scenariosByName = new Map<string, DesEvaluationExcelScenarioKey>();
  const configuredDimensionsByName = new Map(
    (context.dimensions ?? []).map((dimension) => [normalize(dimension.name), dimension])
  );
  const configuredScenariosByPosition = new Map(
    (context.positionScenarios ?? []).map((positionConfig) => [
      normalize(positionConfig.position),
      new Map(positionConfig.scenarios.map((scenario) => [scenario.key, scenario])),
    ])
  );
  const dimensionBySheetName = getDimensionBySheetName(workbook);
  const defaultScale = context.scales.find((scale) => scale.id === context.defaultScaleId);

  context.scenarios.forEach((scenario) => {
    scenariosByName.set(normalize(scenario.key), scenario.key);
    scenario.names.forEach((name) => scenariosByName.set(normalize(name), scenario.key));
  });

  if (dataSheetNames.length === 0) {
    throw new DesEvaluationExcelValidationError([t('NO_DATA_SHEETS')]);
  }

  dataSheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const range = worksheet['!ref']
      ? XLSX.utils.decode_range(worksheet['!ref'])
      : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
    const headers = DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS.map((_, columnIndex) =>
      text(getWorksheetCellValue(worksheet, 0, columnIndex))
    );
    const dimensionName = dimensionBySheetName.get(normalize(sheetName)) ?? sheetName;
    const configuredDimension = configuredDimensionsByName.get(normalize(dimensionName));

    validateGroupedDimensionHeaders(headers, sheetName, t, errors);
    if (!configuredDimension) {
      errors.push(t('DIMENSION_SHEET_NOT_FOUND', { sheet: sheetName, dimension: dimensionName }));
    }

    let dataRowCount = 0;
    for (let rowIndex = 1; rowIndex <= range.e.r; rowIndex++) {
      const values = DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS.map((_, columnIndex) =>
        text(getWorksheetCellValue(worksheet, rowIndex, columnIndex))
      );
      if (values.every((value) => !value)) {
        continue;
      }
      dataRowCount++;

      const rowNumber = rowIndex + 1;
      const rowErrors: string[] = [];
      const [
        positionsValue,
        scenariosValue,
        criterionName,
        criterionWeightValue,
        requiredRatingValue,
        itemText,
        itemTypeValue,
      ] = values;
      const requiredValues = [
        positionsValue,
        scenariosValue,
        criterionName,
        criterionWeightValue,
        requiredRatingValue,
        itemText,
        itemTypeValue,
      ];
      requiredValues.forEach((value, columnIndex) => {
        if (!value) {
          rowErrors.push(t('REQUIRED_VALUE', {
            sheet: sheetName,
            row: rowNumber,
            field: DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS[columnIndex],
          }));
        }
      });

      const selectedPositions: string[] = [];
      splitSelections(positionsValue).forEach((positionValue) => {
        const position = positionsByName.get(normalize(positionValue));
        if (!position) {
          rowErrors.push(t('POSITION_NOT_FOUND', {
            sheet: sheetName,
            row: rowNumber,
            value: positionValue,
          }));
        } else if (!selectedPositions.some((item) => normalize(item) === normalize(position))) {
          selectedPositions.push(position);
        }
      });

      const selectedScenarios: Array<{
        key: DesEvaluationExcelScenarioKey;
        label: string;
      }> = [];
      splitSelections(scenariosValue).forEach((scenarioValue) => {
        const scenarioKey = scenariosByName.get(normalize(scenarioValue));
        if (!scenarioKey) {
          rowErrors.push(t('INVALID_SCENARIO', {
            sheet: sheetName,
            row: rowNumber,
            value: scenarioValue,
          }));
        } else if (!selectedScenarios.some((scenario) => scenario.key === scenarioKey)) {
          selectedScenarios.push({ key: scenarioKey, label: scenarioValue });
        }
      });

      const criterionWeight = parseWeight(criterionWeightValue);
      if (criterionWeight === null || criterionWeight < 0 || criterionWeight > 100) {
        rowErrors.push(t('INVALID_WEIGHT', {
          sheet: sheetName,
          row: rowNumber,
          field: DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS[3],
        }));
      }

      const requiredRatingPercent = parseWeight(requiredRatingValue);
      if (
        requiredRatingPercent === null ||
        !Number.isInteger(requiredRatingPercent) ||
        requiredRatingPercent < 1 ||
        requiredRatingPercent > 100
      ) {
        rowErrors.push(t('INVALID_REQUIRED_LEVEL', { sheet: sheetName, row: rowNumber }));
      }

      const itemType = resolveItemType(itemTypeValue);
      if (itemTypeValue && !itemType) {
        rowErrors.push(t('INVALID_ITEM_TYPE', {
          sheet: sheetName,
          row: rowNumber,
          value: itemTypeValue,
        }));
      }
      if (itemType === 'LIKERT_1_5' && (!defaultScale || defaultScale.levels.length === 0)) {
        rowErrors.push(defaultScale
          ? t('SCALE_WITHOUT_LEVELS', {
              sheet: sheetName,
              row: rowNumber,
              value: defaultScale.name,
            })
          : t('INVALID_SCALE', {
              sheet: sheetName,
              row: rowNumber,
              value: t('DEFAULT_SCALE'),
            }));
      }

      if (
        configuredDimension &&
        criterionName &&
        criterionWeight !== null &&
        requiredRatingPercent !== null &&
        Number.isInteger(requiredRatingPercent) &&
        itemText &&
        itemType &&
        (itemType !== 'LIKERT_1_5' || defaultScale)
      ) {
        selectedPositions.forEach((position) => {
          const configuredScenarios = configuredScenariosByPosition.get(normalize(position));
          selectedScenarios.forEach((scenario) => {
            const configuredScenario = configuredScenarios?.get(scenario.key);
            if (!configuredScenario) {
              rowErrors.push(t('SCENARIO_NOT_CONFIGURED', {
                sheet: sheetName,
                row: rowNumber,
                scenario: scenario.label,
                position,
              }));
              return;
            }

            rows.push({
              sheetName,
              rowNumber,
              position,
              scenarioKey: scenario.key,
              scenarioWeight: configuredScenario.weight,
              dimensionCode: null,
              dimensionName: configuredDimension.name,
              dimensionDescription: '',
              dimensionWeight: configuredDimension.weight,
              criterionCode: null,
              criterionName,
              criterionDescription: '',
              criterionWeight,
              requiredRatingLevel: requiredRatingPercentToScale(requiredRatingPercent),
              itemCode: null,
              itemText,
              itemType,
              scaleId: itemType === 'LIKERT_1_5' ? defaultScale!.id : null,
              options: itemType === 'LIKERT_1_5' ? [...defaultScale!.levels] : [],
            });
          });
        });
      }

      errors.push(...rowErrors);
    }

    if (dataRowCount === 0) {
      errors.push(t('EMPTY_SHEET', { sheet: sheetName }));
    }
  });

  validateWorkbookConsistency(rows, context, errors, { validateScenarioTotals: false });

  if (errors.length > 0) {
    throw new DesEvaluationExcelValidationError(Array.from(new Set(errors)));
  }

  return buildImportSummary(rows);
}

function getWorksheetCellValue(
  worksheet: XLSX.WorkSheet,
  rowIndex: number,
  columnIndex: number
): unknown {
  const getCellValue = (row: number, column: number): unknown => {
    const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: column })];
    return cell?.w ?? cell?.v ?? '';
  };
  const ownValue = getCellValue(rowIndex, columnIndex);
  if (text(ownValue)) {
    return ownValue;
  }

  const merge = (worksheet['!merges'] ?? []).find((range) =>
    rowIndex >= range.s.r &&
    rowIndex <= range.e.r &&
    columnIndex >= range.s.c &&
    columnIndex <= range.e.c
  );
  return merge ? getCellValue(merge.s.r, merge.s.c) : ownValue;
}

function validateGroupedDimensionHeaders(
  headers: string[],
  sheetName: string,
  t: DesEvaluationExcelContext['translate'],
  errors: string[]
): void {
  const aliases = [
    ['PUESTOS', 'PUESTO', 'POSITIONS', 'POSITION'],
    [
      'ESCENARIOS DE EVALUACION',
      'ESCENARIO DE EVALUACION',
      'ESCENARIOS',
      'EVALUATION SCENARIOS',
      'EVALUATION SCENARIO',
      'SCENARIOS',
    ],
    ['CRITERIO', 'CRITERION'],
    ['PONDERACION', 'PONDERACION CRITERIO', 'WEIGHT', 'CRITERION WEIGHT'],
    [
      'NIVEL EXIGENCIA',
      'NIVEL DE EXIGENCIA',
      'REQUIRED RATING',
      'REQUIRED RATING LEVEL',
      'REQUIRED LEVEL',
    ],
    ['PREGUNTA', 'QUESTION'],
    ['TIPO PREGUNTA', 'TIPO DE PREGUNTA', 'QUESTION TYPE'],
  ];

  headers.forEach((header, columnIndex) => {
    if (!aliases[columnIndex].includes(normalize(header))) {
      errors.push(t('INVALID_DIMENSION_HEADER', {
        sheet: sheetName,
        column: columnIndex + 1,
        expected: DES_EVALUATION_GROUPED_DIMENSION_EXCEL_HEADERS[columnIndex],
        actual: header || '-',
      }));
    }
  });
}

function parseDimensionTemplateWorkbook(
  workbook: XLSX.WorkBook,
  context: DesEvaluationExcelContext
): DesEvaluationExcelImport {
  const t = context.translate;
  const errors: string[] = [];
  const rows: DesEvaluationExcelRow[] = [];
  const dataSheetNames = workbook.SheetNames.filter(isDataSheet);
  const positionsByName = new Map(
    context.positions.map((position) => [normalize(position), position])
  );
  const scenariosByName = new Map<string, DesEvaluationExcelScenarioKey>();
  const configuredDimensionsByName = new Map(
    (context.dimensions ?? []).map((dimension) => [normalize(dimension.name), dimension])
  );
  const configuredScenariosByPosition = new Map(
    (context.positionScenarios ?? []).map((positionConfig) => [
      normalize(positionConfig.position),
      new Map(positionConfig.scenarios.map((scenario) => [scenario.key, scenario])),
    ])
  );
  const dimensionBySheetName = getDimensionBySheetName(workbook);
  const defaultScale = context.scales.find((scale) => scale.id === context.defaultScaleId);

  context.scenarios.forEach((scenario) => {
    scenariosByName.set(normalize(scenario.key), scenario.key);
    scenario.names.forEach((name) => scenariosByName.set(normalize(name), scenario.key));
  });

  if (dataSheetNames.length === 0) {
    throw new DesEvaluationExcelValidationError([t('NO_DATA_SHEETS')]);
  }

  dataSheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: false,
    });
    const headers = (matrix[0] ?? []).map(text);
    const dataRows = matrix.slice(1).filter((row) => row.some((value) => !!text(value)));
    const maxColumnCount = Math.max(headers.length, ...dataRows.map((row) => row.length));
    while (headers.length < maxColumnCount) {
      headers.push('');
    }
    const dimensionName = dimensionBySheetName.get(normalize(sheetName)) ?? sheetName;
    const configuredDimension = configuredDimensionsByName.get(normalize(dimensionName));

    if (!configuredDimension) {
      errors.push(t('DIMENSION_SHEET_NOT_FOUND', { sheet: sheetName, dimension: dimensionName }));
    }

    const blocks = getDimensionCriterionBlocks(headers, sheetName, t, errors);
    if (dataRows.length === 0) {
      errors.push(t('EMPTY_SHEET', { sheet: sheetName }));
      return;
    }

    dataRows.forEach((rawRow, rowIndex) => {
      const rowNumber = rowIndex + 2;
      const rowErrors: string[] = [];
      const positionValues = splitSelections(rawRow[0]);
      const scenarioValues = splitSelections(rawRow[1]);
      const selectedPositions: string[] = [];
      const selectedScenarios: Array<{
        key: DesEvaluationExcelScenarioKey;
        label: string;
      }> = [];

      if (positionValues.length === 0) {
        rowErrors.push(t('REQUIRED_VALUE', {
          sheet: sheetName,
          row: rowNumber,
          field: DES_EVALUATION_DIMENSION_EXCEL_HEADERS.positions,
        }));
      }
      positionValues.forEach((positionValue) => {
        const position = positionsByName.get(normalize(positionValue));
        if (!position) {
          rowErrors.push(t('POSITION_NOT_FOUND', {
            sheet: sheetName,
            row: rowNumber,
            value: positionValue,
          }));
        } else if (!selectedPositions.some((item) => normalize(item) === normalize(position))) {
          selectedPositions.push(position);
        }
      });

      if (scenarioValues.length === 0) {
        rowErrors.push(t('REQUIRED_VALUE', {
          sheet: sheetName,
          row: rowNumber,
          field: DES_EVALUATION_DIMENSION_EXCEL_HEADERS.scenarios,
        }));
      }
      scenarioValues.forEach((scenarioValue) => {
        const scenarioKey = scenariosByName.get(normalize(scenarioValue));
        if (!scenarioKey) {
          rowErrors.push(t('INVALID_SCENARIO', {
            sheet: sheetName,
            row: rowNumber,
            value: scenarioValue,
          }));
        } else if (!selectedScenarios.some((scenario) => scenario.key === scenarioKey)) {
          selectedScenarios.push({ key: scenarioKey, label: scenarioValue });
        }
      });

      let populatedBlockCount = 0;
      blocks.filter((block) => block.valid).forEach((block) => {
        const values = DIMENSION_CRITERION_COLUMN_ORDER.map((_, offset) =>
          text(rawRow[block.startColumn + offset])
        );
        if (values.every((value) => !value)) {
          return;
        }
        populatedBlockCount++;

        const missingFields = values
          .map((value, offset) => value
            ? null
            : getDesEvaluationDimensionCriterionHeader(
                DIMENSION_CRITERION_COLUMN_ORDER[offset],
                block.criterionNumber
              ))
          .filter((value): value is string => !!value);
        if (missingFields.length > 0) {
          rowErrors.push(t('INCOMPLETE_CRITERION_BLOCK', {
            sheet: sheetName,
            row: rowNumber,
            criterion: block.criterionNumber,
            columns: missingFields.join(', '),
          }));
          return;
        }

        const [criterionName, criterionWeightValue, requiredRatingValue, itemText, itemTypeValue] =
          values;
        const criterionWeight = parseWeight(criterionWeightValue);
        const requiredRatingPercent = parseWeight(requiredRatingValue);
        const itemType = resolveItemType(itemTypeValue);

        if (criterionWeight === null || criterionWeight < 0 || criterionWeight > 100) {
          rowErrors.push(t('INVALID_WEIGHT', {
            sheet: sheetName,
            row: rowNumber,
            field: getDesEvaluationDimensionCriterionHeader('weight', block.criterionNumber),
          }));
        }
        if (
          requiredRatingPercent === null ||
          !Number.isInteger(requiredRatingPercent) ||
          requiredRatingPercent < 1 ||
          requiredRatingPercent > 100
        ) {
          rowErrors.push(t('INVALID_REQUIRED_LEVEL', { sheet: sheetName, row: rowNumber }));
        }
        if (!itemType) {
          rowErrors.push(t('INVALID_ITEM_TYPE', {
            sheet: sheetName,
            row: rowNumber,
            value: itemTypeValue,
          }));
        }
        if (itemType === 'LIKERT_1_5' && (!defaultScale || defaultScale.levels.length === 0)) {
          rowErrors.push(defaultScale
            ? t('SCALE_WITHOUT_LEVELS', {
                sheet: sheetName,
                row: rowNumber,
                value: defaultScale.name,
              })
            : t('INVALID_SCALE', {
                sheet: sheetName,
                row: rowNumber,
                value: t('DEFAULT_SCALE'),
              }));
        }

        if (
          !configuredDimension ||
          criterionWeight === null ||
          requiredRatingPercent === null ||
          !Number.isInteger(requiredRatingPercent) ||
          !itemType ||
          (itemType === 'LIKERT_1_5' && !defaultScale)
        ) {
          return;
        }

        selectedPositions.forEach((position) => {
          const configuredScenarios = configuredScenariosByPosition.get(normalize(position));
          selectedScenarios.forEach((scenario) => {
            const configuredScenario = configuredScenarios?.get(scenario.key);
            if (!configuredScenario) {
              rowErrors.push(t('SCENARIO_NOT_CONFIGURED', {
                sheet: sheetName,
                row: rowNumber,
                scenario: scenario.label,
                position,
              }));
              return;
            }

            rows.push({
              sheetName,
              rowNumber,
              position,
              scenarioKey: scenario.key,
              scenarioWeight: configuredScenario.weight,
              dimensionCode: null,
              dimensionName: configuredDimension.name,
              dimensionDescription: '',
              dimensionWeight: configuredDimension.weight,
              criterionCode: null,
              criterionName,
              criterionDescription: '',
              criterionWeight,
              requiredRatingLevel: requiredRatingPercentToScale(requiredRatingPercent),
              itemCode: null,
              itemText,
              itemType,
              scaleId: itemType === 'LIKERT_1_5' ? defaultScale!.id : null,
              options: itemType === 'LIKERT_1_5' ? [...defaultScale!.levels] : [],
            });
          });
        });
      });

      if (populatedBlockCount === 0) {
        rowErrors.push(t('NO_CRITERION_DATA', { sheet: sheetName, row: rowNumber }));
      }
      errors.push(...rowErrors);
    });
  });

  validateWorkbookConsistency(rows, context, errors, { validateScenarioTotals: false });

  if (errors.length > 0) {
    throw new DesEvaluationExcelValidationError(Array.from(new Set(errors)));
  }

  return buildImportSummary(rows);
}

function getDimensionCriterionBlocks(
  headers: string[],
  sheetName: string,
  t: DesEvaluationExcelContext['translate'],
  errors: string[]
): DimensionCriterionBlock[] {
  const positionHeader = normalize(headers[0]);
  const scenarioHeader = normalize(headers[1]);
  const validPositionHeaders = new Set(['PUESTOS', 'PUESTO', 'POSITIONS', 'POSITION']);
  const validScenarioHeaders = new Set([
    'ESCENARIOS DE EVALUACION',
    'ESCENARIO DE EVALUACION',
    'ESCENARIOS',
    'EVALUATION SCENARIOS',
    'EVALUATION SCENARIO',
    'SCENARIOS',
  ]);

  if (!validPositionHeaders.has(positionHeader)) {
    errors.push(t('INVALID_DIMENSION_HEADER', {
      sheet: sheetName,
      column: 1,
      expected: DES_EVALUATION_DIMENSION_EXCEL_HEADERS.positions,
      actual: headers[0] || '-',
    }));
  }
  if (!validScenarioHeaders.has(scenarioHeader)) {
    errors.push(t('INVALID_DIMENSION_HEADER', {
      sheet: sheetName,
      column: 2,
      expected: DES_EVALUATION_DIMENSION_EXCEL_HEADERS.scenarios,
      actual: headers[1] || '-',
    }));
  }

  let lastHeaderIndex = headers.length - 1;
  while (lastHeaderIndex >= 2 && !text(headers[lastHeaderIndex])) {
    lastHeaderIndex--;
  }
  if (lastHeaderIndex < 2) {
    errors.push(t('NO_CRITERION_COLUMNS', { sheet: sheetName }));
    return [];
  }

  const blockCount = Math.ceil((lastHeaderIndex - 1) / DIMENSION_CRITERION_COLUMN_ORDER.length);
  const blocks: DimensionCriterionBlock[] = [];
  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const criterionNumber = blockIndex + 1;
    const startColumn = 2 + blockIndex * DIMENSION_CRITERION_COLUMN_ORDER.length;
    let valid = true;

    DIMENSION_CRITERION_COLUMN_ORDER.forEach((column, offset) => {
      const actual = headers[startColumn + offset] ?? '';
      if (!matchesDimensionCriterionHeader(actual, column, criterionNumber)) {
        valid = false;
        errors.push(t('INVALID_DIMENSION_HEADER', {
          sheet: sheetName,
          column: startColumn + offset + 1,
          expected: getDesEvaluationDimensionCriterionHeader(column, criterionNumber),
          actual: actual || '-',
        }));
      }
    });
    blocks.push({ criterionNumber, startColumn, valid });
  }

  return blocks;
}

function matchesDimensionCriterionHeader(
  header: string,
  column: DesEvaluationDimensionCriterionColumn,
  criterionNumber: number
): boolean {
  const normalized = normalize(header);
  const aliases: Record<DesEvaluationDimensionCriterionColumn, string[]> = {
    criterion: ['CRITERIO', 'CRITERION'],
    weight: ['PONDERACION', 'PONDERACION CRITERIO', 'WEIGHT', 'CRITERION WEIGHT'],
    requiredRating: [
      'NIVEL EXIGENCIA',
      'NIVEL DE EXIGENCIA',
      'REQUIRED RATING',
      'REQUIRED RATING LEVEL',
      'REQUIRED LEVEL',
    ],
    question: ['PREGUNTA', 'QUESTION'],
    questionType: ['TIPO PREGUNTA', 'TIPO DE PREGUNTA', 'QUESTION TYPE'],
  };

  return aliases[column].some((alias) =>
    normalized === `${alias} ${criterionNumber}` ||
    (column !== 'criterion' && normalized === alias)
  );
}

function buildImportSummary(rows: DesEvaluationExcelRow[]): DesEvaluationExcelImport {
  const positions = Array.from(new Set(rows.map((row) => row.position)));
  const scenarios = new Set(rows.map((row) => `${normalize(row.position)}|${row.scenarioKey}`));
  const dimensions = new Set(rows.map((row) => normalize(row.dimensionName)));
  const criteria = new Set(rows.map((row) => criterionGroupKey(row)));

  return {
    rows,
    positions,
    scenarioCount: scenarios.size,
    dimensionCount: dimensions.size,
    criterionCount: criteria.size,
    itemCount: rows.length,
  };
}

function getDimensionBySheetName(workbook: XLSX.WorkBook): Map<string, string> {
  const worksheet = workbook.Sheets[POSITION_MAP_SHEET];
  if (!worksheet) {
    return new Map<string, string>();
  }

  const mappings = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: '',
    raw: false,
  });

  return new Map(
    mappings
      .map((mapping) => [
        normalize(mapping[POSITION_MAP_SHEET_HEADER]),
        text(mapping[DIMENSION_MAP_DIMENSION_HEADER]),
      ] as const)
      .filter(([sheetName, dimension]) => !!sheetName && !!dimension)
  );
}

function getPositionBySheetName(workbook: XLSX.WorkBook): Map<string, string> {
  const worksheet = workbook.Sheets[POSITION_MAP_SHEET];
  if (!worksheet) {
    return new Map<string, string>();
  }

  const mappings = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: '',
    raw: false,
  });

  return new Map(
    mappings
      .map((mapping) => [
        normalize(mapping[POSITION_MAP_SHEET_HEADER]),
        text(mapping[POSITION_MAP_POSITION_HEADER]),
      ] as const)
      .filter(([sheetName, position]) => !!sheetName && !!position)
  );
}

function criterionGroupKey(row: DesEvaluationExcelRow): string {
  return [
    normalize(row.position),
    row.scenarioKey,
    normalize(row.dimensionName),
    normalize(row.criterionName),
  ].join('|');
}

function validateWorkbookConsistency(
  rows: DesEvaluationExcelRow[],
  context: DesEvaluationExcelContext,
  errors: string[],
  options: { validateScenarioTotals?: boolean } = {}
): void {
  const t = context.translate;
  const scenarioMap = new Map<string, DesEvaluationExcelRow>();
  const dimensionMap = new Map<string, DesEvaluationExcelRow>();
  const dimensionCodeMap = new Map<string, DesEvaluationExcelRow>();
  const criterionMap = new Map<string, DesEvaluationExcelRow>();
  const criterionCodeMap = new Map<string, DesEvaluationExcelRow>();
  const itemMap = new Map<string, DesEvaluationExcelRow>();

  rows.forEach((row) => {
    const scenarioKey = `${normalize(row.position)}|${row.scenarioKey}`;
    const existingScenario = scenarioMap.get(scenarioKey);
    if (existingScenario && !valuesMatch(existingScenario.scenarioWeight, row.scenarioWeight)) {
      errors.push(t('INCONSISTENT_VALUE', {
        sheet: row.sheetName,
        row: row.rowNumber,
        field: DES_EVALUATION_EXCEL_HEADERS.scenarioWeight,
      }));
    } else {
      scenarioMap.set(scenarioKey, row);
    }

    const dimensionKey = normalize(row.dimensionName);
    const existingDimension = dimensionMap.get(dimensionKey);
    if (
      existingDimension &&
      (
        !valuesMatch(existingDimension.dimensionCode, row.dimensionCode) ||
        !valuesMatch(existingDimension.dimensionDescription, row.dimensionDescription) ||
        !valuesMatch(existingDimension.dimensionWeight, row.dimensionWeight)
      )
    ) {
      errors.push(t('INCONSISTENT_ENTITY', {
        sheet: row.sheetName,
        row: row.rowNumber,
        entity: row.dimensionName,
      }));
    } else {
      dimensionMap.set(dimensionKey, row);
    }

    if (row.dimensionCode) {
      const codeKey = normalize(row.dimensionCode);
      const existingCode = dimensionCodeMap.get(codeKey);
      if (existingCode && !valuesMatch(existingCode.dimensionName, row.dimensionName)) {
        errors.push(t('DUPLICATE_CODE', {
          sheet: row.sheetName,
          row: row.rowNumber,
          code: row.dimensionCode,
        }));
      } else {
        dimensionCodeMap.set(codeKey, row);
      }
    }

    const criterionKey = criterionGroupKey(row);
    const existingCriterion = criterionMap.get(criterionKey);
    if (
      existingCriterion &&
      (
        !valuesMatch(existingCriterion.criterionCode, row.criterionCode) ||
        !valuesMatch(existingCriterion.criterionName, row.criterionName) ||
        !valuesMatch(existingCriterion.criterionDescription, row.criterionDescription) ||
        !valuesMatch(existingCriterion.criterionWeight, row.criterionWeight) ||
        !valuesMatch(existingCriterion.requiredRatingLevel, row.requiredRatingLevel)
      )
    ) {
      errors.push(t('INCONSISTENT_ENTITY', {
        sheet: row.sheetName,
        row: row.rowNumber,
        entity: row.criterionName,
      }));
    } else {
      criterionMap.set(criterionKey, row);
    }

    if (row.criterionCode) {
      const codeKey = [
        normalize(row.position),
        row.scenarioKey,
        normalize(row.dimensionName),
        normalize(row.criterionCode),
      ].join('|');
      const existingCode = criterionCodeMap.get(codeKey);
      if (existingCode && !valuesMatch(existingCode.criterionName, row.criterionName)) {
        errors.push(t('DUPLICATE_CODE', {
          sheet: row.sheetName,
          row: row.rowNumber,
          code: row.criterionCode,
        }));
      } else {
        criterionCodeMap.set(codeKey, row);
      }
    }

    const itemKey = `${criterionKey}|${normalize(row.itemCode || row.itemText)}`;
    if (itemMap.has(itemKey)) {
      errors.push(t('DUPLICATE_ITEM', {
        sheet: row.sheetName,
        row: row.rowNumber,
        item: row.itemText,
      }));
    } else {
      itemMap.set(itemKey, row);
    }
  });

  if (options.validateScenarioTotals !== false) {
    const scenarioTotals = new Map<string, number>();
    scenarioMap.forEach((row) => {
      const key = normalize(row.position);
      scenarioTotals.set(key, (scenarioTotals.get(key) ?? 0) + row.scenarioWeight);
    });
    scenarioTotals.forEach((total, positionKey) => {
      if (Math.abs(total - 100) > WEIGHT_TOLERANCE) {
        const position = rows.find((row) => normalize(row.position) === positionKey)?.position ?? positionKey;
        errors.push(t('SCENARIO_TOTAL', { position, total }));
      }
    });
  }

  const dimensionTotal = Array.from(dimensionMap.values())
    .reduce((total, row) => total + row.dimensionWeight, 0);
  if (Math.abs(dimensionTotal - 100) > WEIGHT_TOLERANCE) {
    errors.push(t('DIMENSION_TOTAL', { total: dimensionTotal }));
  }

  const criterionTotals = new Map<string, { total: number; row: DesEvaluationExcelRow }>();
  criterionMap.forEach((row) => {
    const key = [
      normalize(row.position),
      row.scenarioKey,
      normalize(row.dimensionName),
    ].join('|');
    const current = criterionTotals.get(key);
    criterionTotals.set(key, {
      total: (current?.total ?? 0) + row.criterionWeight,
      row,
    });
  });
  criterionTotals.forEach(({ total, row }) => {
    if (Math.abs(total - 100) > WEIGHT_TOLERANCE) {
      errors.push(t('CRITERION_TOTAL', {
        position: row.position,
        scenario: row.scenarioKey,
        dimension: row.dimensionName,
        total,
      }));
    }
  });

  if (context.demoLimits) {
    const dimensionCount = dimensionMap.size;
    if (dimensionCount > context.demoLimits.dimensions) {
      errors.push(t('DEMO_DIMENSION_LIMIT', {
        actual: dimensionCount,
        limit: context.demoLimits.dimensions,
      }));
    }

    criterionTotals.forEach(({ row }) => {
      const groupPrefix = [
        normalize(row.position),
        row.scenarioKey,
        normalize(row.dimensionName),
      ].join('|');
      const criterionCount = Array.from(criterionMap.keys())
        .filter((key) => key.startsWith(`${groupPrefix}|`)).length;
      if (criterionCount > context.demoLimits!.criteriaPerDimension) {
        errors.push(t('DEMO_CRITERION_LIMIT', {
          position: row.position,
          dimension: row.dimensionName,
          actual: criterionCount,
          limit: context.demoLimits!.criteriaPerDimension,
        }));
      }
    });

    criterionMap.forEach((criterionRow, criterionKey) => {
      const itemCount = Array.from(itemMap.keys())
        .filter((key) => key.startsWith(`${criterionKey}|`)).length;
      if (itemCount > context.demoLimits!.itemsPerCriterion) {
        errors.push(t('DEMO_ITEM_LIMIT', {
          criterion: criterionRow.criterionName,
          actual: itemCount,
          limit: context.demoLimits!.itemsPerCriterion,
        }));
      }
    });
  }
}
