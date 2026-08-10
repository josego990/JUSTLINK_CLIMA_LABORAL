import * as XLSX from 'xlsx';

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
  requiredRatingLevel: 'Nivel exigencia (1-5) *',
  itemCode: 'Código ítem',
  itemText: 'Ítem evaluativo *',
  itemType: 'Tipo de ítem *',
  scale: 'Escala',
  options: 'Opciones Likert (separadas por |)',
};

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

export function parseDesEvaluationExcelWorkbook(
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
      : sheetName;
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
        requiredRatingLevel === null ||
        !Number.isInteger(requiredRatingLevel) ||
        requiredRatingLevel < 1 ||
        requiredRatingLevel > 5
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
        dimensionName: text(get('dimensionName')),
        dimensionDescription: text(get('dimensionDescription')),
        dimensionWeight: dimensionWeight!,
        criterionCode,
        criterionName: text(get('criterionName')),
        criterionDescription: text(get('criterionDescription')),
        criterionWeight: criterionWeight!,
        requiredRatingLevel: requiredRatingLevel!,
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
  errors: string[]
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
