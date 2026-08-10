import * as XLSX from 'xlsx';
import {
  DES_EVALUATION_EXCEL_HEADERS,
  DesEvaluationExcelContext,
  DesEvaluationExcelValidationError,
  parseDesEvaluationExcelWorkbook,
} from './des-evaluaciones-excel';

describe('des-evaluaciones Excel import', () => {
  const context: DesEvaluationExcelContext = {
    positions: ['ANALISTA', 'Jefe del departamento de Infraestructura'],
    scenarios: [{
      key: 'BOSS_TO_EMPLOYEE',
      names: ['BOSS_TO_EMPLOYEE', 'Jefe a colaborador'],
    }],
    scales: [{
      id: 1,
      code: 'CUMPLIMIENTO_1_5',
      name: 'Cumplimiento 1 a 5',
      levels: ['No cumple', 'Bajo', 'Parcial', 'Esperado', 'Supera'],
    }],
    defaultScaleId: 1,
    translate: (key, params) => `${key}:${JSON.stringify(params ?? {})}`,
  };

  function validRows(): Array<Record<string, string | number>> {
    return [
      buildRow('OBJETIVOS', 'Objetivos', 45, 'METAS', 'Metas', 'Cumple sus metas'),
      buildRow('COMPETENCIAS', 'Competencias', 35, 'COMUNICACION', 'Comunicación', 'Comunica con claridad'),
      buildRow('VALORES', 'Valores', 20, 'INTEGRIDAD', 'Integridad', 'Actúa con integridad'),
    ];
  }

  function buildRow(
    dimensionCode: string,
    dimension: string,
    dimensionWeight: number,
    criterionCode: string,
    criterion: string,
    item: string
  ): Record<string, string | number> {
    return {
      [DES_EVALUATION_EXCEL_HEADERS.scenario]: 'Jefe a colaborador',
      [DES_EVALUATION_EXCEL_HEADERS.scenarioWeight]: 100,
      [DES_EVALUATION_EXCEL_HEADERS.dimensionCode]: dimensionCode,
      [DES_EVALUATION_EXCEL_HEADERS.dimensionName]: dimension,
      [DES_EVALUATION_EXCEL_HEADERS.dimensionDescription]: `${dimension} descripción`,
      [DES_EVALUATION_EXCEL_HEADERS.dimensionWeight]: dimensionWeight,
      [DES_EVALUATION_EXCEL_HEADERS.criterionCode]: criterionCode,
      [DES_EVALUATION_EXCEL_HEADERS.criterionName]: criterion,
      [DES_EVALUATION_EXCEL_HEADERS.criterionDescription]: `${criterion} descripción`,
      [DES_EVALUATION_EXCEL_HEADERS.criterionWeight]: 100,
      [DES_EVALUATION_EXCEL_HEADERS.requiredRatingLevel]: 4,
      [DES_EVALUATION_EXCEL_HEADERS.itemCode]: `${criterionCode}_1`,
      [DES_EVALUATION_EXCEL_HEADERS.itemText]: item,
      [DES_EVALUATION_EXCEL_HEADERS.itemType]: 'Likert de 5 niveles',
      [DES_EVALUATION_EXCEL_HEADERS.scale]: 'CUMPLIMIENTO_1_5',
      [DES_EVALUATION_EXCEL_HEADERS.options]: '',
    };
  }

  function workbook(rows: Array<Record<string, string | number>>, sheet = 'ANALISTA') {
    const result = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(result, XLSX.utils.json_to_sheet(rows), sheet);
    return result;
  }

  it('loads a valid workbook with the three expected dimensions', () => {
    const result = parseDesEvaluationExcelWorkbook(workbook(validRows()), context);

    expect(result.positions).toEqual(['ANALISTA']);
    expect(result.dimensionCount).toBe(3);
    expect(result.criterionCount).toBe(3);
    expect(result.itemCount).toBe(3);
  });

  it('preserves open questions without a scale or Likert options', () => {
    const rows = validRows();
    rows[0][DES_EVALUATION_EXCEL_HEADERS.itemType] = 'Pregunta abierta';
    rows[0][DES_EVALUATION_EXCEL_HEADERS.scale] = '';
    rows[0][DES_EVALUATION_EXCEL_HEADERS.options] = '';

    const result = parseDesEvaluationExcelWorkbook(workbook(rows), context);
    const openQuestion = result.rows[0];

    expect(openQuestion.itemType).toBe('ABIERTA');
    expect(openQuestion.scaleId).toBeNull();
    expect(openQuestion.options).toEqual([]);
  });

  it('rejects a position that does not exist in the organization', () => {
    expect(() => parseDesEvaluationExcelWorkbook(
      workbook(validRows(), 'PUESTO INEXISTENTE'),
      context
    )).toThrowError(DesEvaluationExcelValidationError);
  });

  it('uses the position column when the full position does not fit in the sheet name', () => {
    const position = 'Jefe del departamento de Infraestructura';
    const rows = validRows().map((row) => ({
      ...row,
      [DES_EVALUATION_EXCEL_HEADERS.position]: position,
    }));

    const result = parseDesEvaluationExcelWorkbook(
      workbook(rows, 'Jefe depto Infraestructura'),
      context
    );

    expect(result.positions).toEqual([position]);
  });

  it('rejects unsupported item types and invalid dimension totals', () => {
    const rows = validRows();
    rows[0][DES_EVALUATION_EXCEL_HEADERS.itemType] = 'Selección múltiple';
    rows[2][DES_EVALUATION_EXCEL_HEADERS.dimensionWeight] = 10;

    try {
      parseDesEvaluationExcelWorkbook(workbook(rows), context);
      fail('The workbook should have been rejected.');
    } catch (error) {
      expect(error).toBeInstanceOf(DesEvaluationExcelValidationError);
      const validation = error as DesEvaluationExcelValidationError;
      expect(validation.errors.some((message) => message.startsWith('INVALID_ITEM_TYPE'))).toBeTrue();
      expect(validation.errors.some((message) => message.startsWith('DIMENSION_TOTAL'))).toBeTrue();
    }
  });

  it('enforces demo limits before returning imported rows', () => {
    const demoContext: DesEvaluationExcelContext = {
      ...context,
      demoLimits: {
        dimensions: 2,
        criteriaPerDimension: 2,
        itemsPerCriterion: 3,
      },
    };

    try {
      parseDesEvaluationExcelWorkbook(workbook(validRows()), demoContext);
      fail('The workbook should have been rejected.');
    } catch (error) {
      const validation = error as DesEvaluationExcelValidationError;
      expect(validation.errors.some((message) => message.startsWith('DEMO_DIMENSION_LIMIT'))).toBeTrue();
    }
  });

  it('rejects decimal required levels and options that differ from the selected scale', () => {
    const rows = validRows();
    rows[0][DES_EVALUATION_EXCEL_HEADERS.requiredRatingLevel] = 4.5;
    rows[1][DES_EVALUATION_EXCEL_HEADERS.options] = 'Nunca | A veces | Siempre | Casi siempre | Siempre';

    try {
      parseDesEvaluationExcelWorkbook(workbook(rows), context);
      fail('The workbook should have been rejected.');
    } catch (error) {
      const validation = error as DesEvaluationExcelValidationError;
      expect(validation.errors.some((message) => message.startsWith('INVALID_REQUIRED_LEVEL'))).toBeTrue();
      expect(validation.errors.some((message) => message.startsWith('INVALID_OPTIONS'))).toBeTrue();
    }
  });
});
