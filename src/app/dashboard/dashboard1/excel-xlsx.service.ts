// excel-xlsx.service.ts
import { Injectable } from '@angular/core';
// @ts-ignore: import de la build “browser” de ExcelJS
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';

export interface ItemTransformado {
  Pregunta: string;
  pct_opt1: number;
  pct_opt2: number;
  pct_opt0?: number;
  pct_opt3: number;
  pct_opt4: number;
  // NUEVO esquema:
  pctFav: number;      // %Favorable (Top-2)
  pctDesf: number;     // %Desfavorable (Bottom-2)
  // (opcionales por si los traes en el transformData)
  nsat?: number;
  mean?: number;
}

export interface ResumenFactor {
  pct_opt1: number;
  pct_opt2: number;
  pct_opt0?: number;
  pct_opt3: number;
  pct_opt4: number;
  // NUEVO esquema:
  pctFav: number;      // %Favorable (Top-2)
  pctDesf: number;     // %Desfavorable (Bottom-2)
  // (opcionales)
  nsat?: number;
  mean?: number;
}

export interface FactorGroup {
  preguntas: ItemTransformado[];
  resumen: ResumenFactor;
}

export interface DemograficoSeleccionado {
  nombreCampo: string;
  valoresSeleccionados: string[];
}

export interface GranFactorGroup {
  resumen: ResumenFactor;
  factores: Record<string, FactorGroup>;
}

export interface PreguntaAbiertaComentario {
  IdRespuesta?: number;
  Comentario?: string;
  FechaRespuesta?: string;
}

export interface PreguntaAbiertaExport {
  IdFactor?: number;
  Factor?: string;
  IdPregunta?: number;
  Pregunta?: string;
  ComentariosJSON?: string | PreguntaAbiertaComentario[];
}

export interface ClimaExportData {
  [factor: string]: FactorGroup | any;
  header?: {
    nombre_clima: string;
    nombre_organizacion: string;
  };
  camposDemograficos?: DemograficoSeleccionado[];

  // NUEVO
  granFactores?: Record<string, GranFactorGroup>;
  preguntasAbiertas?: PreguntaAbiertaExport[];
}

@Injectable({ providedIn: 'root' })
export class ExcelXlsxService {
  exportar(climaData: ClimaExportData): void {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Tu App';
    workbook.created = new Date();

     const colorPorPct = (pct: number): { argb: string } => {
      if (pct >= 91) return { argb: 'FF92D050' }; // Verde
      if (pct >= 80) return { argb: 'FFFFFF00' }; // Amarillo
      if (pct >= 60) return { argb: 'FFFFC000' }; // Naranja
      return { argb: 'FFFF0000' };                // Rojo
    };

    const hasNeutralLikert = (() => {
      const cg = (climaData as any)?.calificacionGeneral;
      if (cg && (cg.total_opt0 !== undefined || cg.pct_opt0 !== undefined)) {
        return true;
      }

      const tieneNeutroEnGrupo = (group: FactorGroup | undefined): boolean => {
        if (!group) return false;
        if (group.resumen && group.resumen.pct_opt0 !== undefined) return true;
        return Array.isArray(group.preguntas) && group.preguntas.some((q: ItemTransformado) => q.pct_opt0 !== undefined);
      };

      if (climaData.granFactores) {
        for (const gfKey of Object.keys(climaData.granFactores)) {
          const gf = climaData.granFactores[gfKey];
          if (gf?.resumen?.pct_opt0 !== undefined) return true;
          for (const factorKey of Object.keys(gf?.factores ?? {})) {
            if (tieneNeutroEnGrupo(gf.factores[factorKey])) return true;
          }
        }
      }

      for (const key of Object.keys(climaData)) {
        if (['header', 'camposDemograficos', 'granFactores', 'preguntasAbiertas', 'calificacionGeneral'].includes(key)) continue;
        const group = climaData[key] as FactorGroup;
        if (tieneNeutroEnGrupo(group)) return true;
      }

      return false;
    })();

    const likertHeaders = hasNeutralLikert
      ? ['Totalmente Desacuerdo', 'En Desacuerdo', 'Neutro', 'De Acuerdo', 'Totalmente de Acuerdo']
      : ['Totalmente Desacuerdo', 'En Desacuerdo', 'De Acuerdo', 'Totalmente de Acuerdo'];

    const getLikertValues = (item: {
      pct_opt4: number;
      pct_opt3: number;
      pct_opt2: number;
      pct_opt1: number;
      pct_opt0?: number;
    }): number[] => {
      if (hasNeutralLikert) {
        return [item.pct_opt4, item.pct_opt3, item.pct_opt0 ?? 0, item.pct_opt2, item.pct_opt1];
      }
      return [item.pct_opt4, item.pct_opt3, item.pct_opt2, item.pct_opt1];
    };

    const colorHeaderLikert = (headerText: string): string => {
      if (headerText === 'Neutro') return 'FFD9D9D9';
      if (headerText === 'Totalmente Desacuerdo' || headerText === 'En Desacuerdo') return 'FFFFC0CB';
      if (headerText === 'Insatisfacción' || headerText === 'Satisfacción') return 'FFD9D9D9';
      return 'FFC6EFCE';
    };

    // ───────────────────────────────────────────────────────────────────────────
// 0) HOJA 0: “Calificación General”  (antes de todas las demás)
// ───────────────────────────────────────────────────────────────────────────
{
  const cg = (climaData as any)?.calificacionGeneral;
  if (cg) {
    const sheet0 = workbook.addWorksheet('Calificación General', {
      views: [{ showGridLines: true }]
    });

    // ancho de columnas
    sheet0.getColumn(1).width = 30;  // títulos
    sheet0.getColumn(2).width = 20;  // valores
    sheet0.getColumn(3).width = 20;
    sheet0.getColumn(4).width = 20;

    let r0 = 1;

    // Encabezado
    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };

      const t = sheet0.getRow(r0);
      t.getCell(1).value = `Calificación General • ${h.nombre_clima}`;
      sheet0.mergeCells(r0, 1, r0, 4);
      t.getCell(1).font = { name: 'Calibri', size: 16, bold: true };
      t.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      r0++;

      const o = sheet0.getRow(r0);
      o.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet0.mergeCells(r0, 1, r0, 4);
      o.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      o.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      r0 += 2; // separación
    }

    // Chips demográficos seleccionados (si existen)
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: any) => {
        const row = sheet0.getRow(r0++);
        row.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet0.mergeCells(r0 - 1, 1, r0 - 1, 4);
        row.getCell(1).font = { name: 'Calibri', size: 11 };
        row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      });
      r0++; // separación
    }

    // Tarjeta grande con la calificación (Top-2)
    sheet0.mergeCells(r0, 1, r0 + 2, 4);
    const big = sheet0.getCell(r0, 1);
    big.value = Number(cg.pct_top2) / 100; // mostrar como %
    big.numFmt = '0.0%';
    big.font = { name: 'Calibri', size: 28, bold: true, color: { argb: 'FF000000' } };
    big.alignment = { horizontal: 'center', vertical: 'middle' };
    big.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(Number(cg.pct_top2)) as any };
    big.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

    const lbl = sheet0.getRow(r0 + 3);
    sheet0.mergeCells(r0 + 3, 1, r0 + 3, 4);
    lbl.getCell(1).value = 'Satisfacción (Top-2)';
    lbl.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    lbl.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    r0 += 5;

    // Tabla de métricas rápidas
    const metricsHeader = sheet0.getRow(r0);
    metricsHeader.getCell(1).value = 'Métrica';
    metricsHeader.getCell(2).value = 'Valor';
    for (let c = 1; c <= 2; c++) {
      const cell = metricsHeader.getCell(c);
      cell.font = { name: 'Calibri', size: 11, bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF95B3D7' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    r0++;

    type M = [string, any, 'pct' | 'int' | 'num'];
    const metrics: M[] = [
      ['% Favorable (Top-2)', cg.pct_top2, 'pct'],
      ['% Desfavorable (Bottom-2)', cg.pct_desfavorable, 'pct'],
      ['NSAT', cg.nsat, 'num'],
      ['% General', cg.pct_general, 'pct'],
      ['Total respuestas', cg.total_respuestas, 'int'],
      ['Media (1–4)', cg.mean_1_4, 'num']
    ];

    metrics.forEach((m, i) => {
      const row = sheet0.getRow(r0 + i);
      row.getCell(1).value = m[0];
      row.getCell(1).font = { name: 'Calibri', size: 10 };
      row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell(1).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

      const valCell = row.getCell(2);
      if (m[2] === 'pct') {
        valCell.value = Number(m[1]) / 100;
        valCell.numFmt = '0.0%';
      } else if (m[2] === 'int') {
        valCell.value = Number(m[1]);
        valCell.numFmt = '0';
      } else {
        valCell.value = Number(m[1]);
        valCell.numFmt = '0.00';
      }
      valCell.font = { name: 'Calibri', size: 10 };
      valCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valCell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      if (m[0].startsWith('% Favorable')) {
        valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(Number(cg.pct_top2)) as any };
      }
    });

    sheet0.eachRow({ includeEmpty: false }, (row: any) => row.commit());
  }
}


    // ───────────────────────────────────────────────────────────────────────────
    // 1) HOJA 1: “Clima Laboral”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet1 = workbook.addWorksheet('Clima Laboral', {
      views: [{ showGridLines: true }]
    });

    const sheet1MainEndCol = hasNeutralLikert ? 8 : 7;
    const sheet1LegendStartCol = sheet1MainEndCol + 1;
    const encabezados = [...likertHeaders, 'Insatisfacción', 'Satisfacción'];

    sheet1.getColumn(1).width = 40;  // A: Factor/Pregunta/etc.
    likertHeaders.forEach((_, idx) => {
      sheet1.getColumn(2 + idx).width = 14; // opciones Likert
    });
    sheet1.getColumn(2 + likertHeaders.length).width = 17; // Insatisfacción
    sheet1.getColumn(3 + likertHeaders.length).width = 17; // Satisfacción
    sheet1.getColumn(sheet1LegendStartCol).width = 12;     // leyenda 1
    sheet1.getColumn(sheet1LegendStartCol + 1).width = 16; // leyenda 2
    sheet1.getColumn(sheet1LegendStartCol + 2).width = 10; // leyenda 3

    const colorEncabezadoPorTexto: Record<string, string> = {};
    encabezados.forEach((headerText) => {
      colorEncabezadoPorTexto[headerText] = colorHeaderLikert(headerText);
    });

    let currentRow = 1;

    // --- Header y leyenda Hoja 1 ---
    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };

      const row1 = sheet1.getRow(currentRow);
      row1.getCell(1).value = `Resultados Generales Clima ${h.nombre_clima}`;
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      row1.getCell(1).font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
      row1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      const leyendaDatos = [
        ['Fortaleza',  'Totalmente de Acuerdo',     '91-100'],
        ['Adecuado',   'De acuerdo',        '80-90'],
        ['Cautela',    'En Desacuerdo',        '79-60'],
        ['Oportunidad','Totalmente en desacuerdo',  '59']
      ];
      const leyendaColores = ['FF92D050', 'FFFFFF00', 'FFFFC000', 'FFFF0000'];
      leyendaDatos.forEach((filaValor, idx) => {
        const rowLeyenda = sheet1.getRow(1 + idx);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = sheet1LegendStartCol + colIdx;
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF000000' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: leyendaColores[idx] } };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        });
      });

      currentRow++;

      const row2 = sheet1.getRow(currentRow);
      row2.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      row2.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      row2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      currentRow++;

      currentRow++; // separación
    }

    // Campos Demográficos (si hay)
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo = sheet1.getRow(currentRow);
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
        rowDemo.getCell(1).font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
        rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        currentRow++;
      });
      currentRow++; // separación
    }

    // Lista ordenada de factores con su Gran Factor
    type FactorEntry = {
      granFactor?: string;
      factorKey: string;
      group: FactorGroup;
    };

    const factorEntries: FactorEntry[] = [];

    const granFactores = climaData.granFactores as Record<string, GranFactorGroup> | undefined;

    if (granFactores && Object.keys(granFactores).length) {
      // Recorremos primero la estructura de Gran Factores
      for (const gfKey of Object.keys(granFactores)) {
        const gf = granFactores[gfKey];
        for (const factorKey of Object.keys(gf.factores)) {
          const group = gf.factores[factorKey];
          if (!group || !group.resumen || !Array.isArray(group.preguntas)) continue;
          factorEntries.push({ granFactor: gfKey, factorKey, group });
        }
      }
    } else {
      // Compatibilidad: sin granFactores, se recorre como antes
      for (const key of Object.keys(climaData)) {
        if (['header', 'camposDemograficos', 'granFactores'].includes(key)) continue;
        const group = climaData[key] as FactorGroup;
        if (!group || !group.resumen || !Array.isArray(group.preguntas)) continue;
        factorEntries.push({ granFactor: undefined, factorKey: key, group });
      }
    }

    // --- Recorrer Factores (Hoja 1) ---
   
    // --- Recorrer Factores (Hoja 1) AGRUPADOS por Gran Factor ---
let currentGranFactor: string | undefined;

for (const entry of factorEntries) {
  const { granFactor, factorKey, group } = entry;

  // Si cambia el Gran Factor, insertamos una fila de título de Gran Factor
  if (granFactor && granFactor !== currentGranFactor) {
    const rowGF = sheet1.getRow(currentRow);
    rowGF.getCell(1).value = granFactor;
    sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
    rowGF.height = 22;
    rowGF.getCell(1).font = {
      name: 'Calibri',
      size: 14,
      bold: true,
      color: { argb: 'FF000000' }
    };
    rowGF.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' } // verde muy clarito, cámbialo si quieres
    };
    rowGF.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    currentRow++;
    currentGranFactor = granFactor;
  }

  // Título del factor (igual que antes)
  const rowTitle = sheet1.getRow(currentRow);
  rowTitle.getCell(1).value = factorKey;
  sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
  rowTitle.height = 20;
  rowTitle.getCell(1).font = {
    name: 'Calibri',
    size: 13,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  rowTitle.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  rowTitle.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
  currentRow++;

  // Encabezados (B→G)
  const rowHeader = sheet1.getRow(currentRow);
  rowHeader.getCell(1).value = '';
  encabezados.forEach((headerText, idx) => {
    const cell = rowHeader.getCell(idx + 2);
    cell.value = headerText;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorEncabezadoPorTexto[headerText] || 'FFFFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  currentRow++;

  // Resultado General del factor
  const r = group.resumen;
  const rowGeneral = sheet1.getRow(currentRow);
  rowGeneral.getCell(1).value = 'Resultado General';
  rowGeneral.getCell(1).font = { name: 'Calibri', size: 11, bold: true };
  rowGeneral.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

  const valoresResumen = [...getLikertValues(r), r.pctDesf, r.pctFav];
  valoresResumen.forEach((val, idx) => {
    const cell = rowGeneral.getCell(idx + 2);
    cell.value = val;
    cell.font = { name: 'Calibri', size: 11 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    if (idx === valoresResumen.length - 1) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: colorPorPct(val)
      };
    }
  });
  currentRow++;

  // Filas por Pregunta
  group.preguntas.forEach((q: ItemTransformado) => {
    const rowPreg = sheet1.getRow(currentRow);
    rowPreg.getCell(1).value = q.Pregunta;
    rowPreg.getCell(1).font = { name: 'Calibri', size: 10 };
    rowPreg.getCell(1).alignment = { wrapText: true, vertical: 'top' };

    const valoresPregunta = [...getLikertValues(q), q.pctDesf, q.pctFav];
    valoresPregunta.forEach((val, idx) => {
      const cell = rowPreg.getCell(idx + 2);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx === valoresPregunta.length - 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: colorPorPct(val)
        };
      }
    });
    currentRow++;
  });

  currentRow++; // separación entre factores
}

   // Resumen por Factor (Hoja 1)
const rowResumenTitle = sheet1.getRow(currentRow);
rowResumenTitle.getCell(1).value = 'Resumen por Factor';
sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
rowResumenTitle.height = 20;
rowResumenTitle.getCell(1).font = {
  name: 'Calibri',
  size: 13,
  bold: true,
  color: { argb: 'FFFFFFFF' }
};
rowResumenTitle.getCell(1).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF4472C4' }
};
rowResumenTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
currentRow++;

const rowResumenHeader = sheet1.getRow(currentRow);
rowResumenHeader.getCell(1).value = 'Factor';
rowResumenHeader.getCell(1).font = {
  name: 'Calibri',
  size: 11,
  bold: true,
  color: { argb: 'FFFFFFFF' }
};
rowResumenHeader.getCell(1).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF95B3D7' }
};
rowResumenHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

encabezados.forEach((headerText, idx) => {
  const cell = rowResumenHeader.getCell(idx + 2);
  cell.value = headerText;
  cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorEncabezadoPorTexto[headerText] || 'FFFFFFFF' }
  };
  cell.alignment = { horizontal: 'center', vertical: 'middle' };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
});
currentRow++;

// Recorrer factorEntries agrupando por Gran Factor
currentGranFactor = undefined;

for (const entry of factorEntries) {
  const { granFactor, factorKey, group } = entry;
  const r = group.resumen;

  // Fila separadora por Gran Factor
  if (granFactor && granFactor !== currentGranFactor) {
    const gfRow = sheet1.getRow(currentRow);
    gfRow.getCell(1).value = granFactor;
    sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
    gfRow.height = 18;
    gfRow.getCell(1).font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FF000000' }
    };
    gfRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' }
    };
    gfRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    currentRow++;
    currentGranFactor = granFactor;
  }

  const rowFactRes = sheet1.getRow(currentRow);
  rowFactRes.getCell(1).value = factorKey;
  rowFactRes.getCell(1).font = { name: 'Calibri', size: 10 };
  rowFactRes.getCell(1).alignment = { wrapText: true, vertical: 'middle' };

  const valoresFactRes = [...getLikertValues(r), r.pctDesf, r.pctFav];
  valoresFactRes.forEach((val, idx) => {
    const cell = rowFactRes.getCell(idx + 2);
    cell.value = val;
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (idx === valoresFactRes.length - 1) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: colorPorPct(val)
      };
    }
  });
  currentRow++;
}

    sheet1.eachRow({ includeEmpty: false }, (row: any) => row.commit());

    // ───────────────────────────────────────────────
// Resumen por Gran Factor (Hoja 1)
// ───────────────────────────────────────────────
if (climaData.granFactores) {
  currentRow++; // separación

  const rowGFTitle = sheet1.getRow(currentRow);
  rowGFTitle.getCell(1).value = 'Resumen por Gran Factor';
  sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
  rowGFTitle.height = 20;
  rowGFTitle.getCell(1).font = {
    name: 'Calibri',
    size: 13,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  rowGFTitle.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  rowGFTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  currentRow++;

  const rowGFHeader = sheet1.getRow(currentRow);
  rowGFHeader.getCell(1).value = 'Gran Factor';
  rowGFHeader.getCell(1).font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  rowGFHeader.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF95B3D7' }
  };
  rowGFHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

  // mismas columnas B→G con tus encabezados
  encabezados.forEach((headerText, idx) => {
    const cell = rowGFHeader.getCell(idx + 2);
    cell.value = headerText;
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FF000000' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorEncabezadoPorTexto[headerText] || 'FFFFFFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  currentRow++;

  for (const gfKey of Object.keys(climaData.granFactores)) {
    const gf = climaData.granFactores[gfKey];
    const rGF = gf.resumen;

    const rowGF = sheet1.getRow(currentRow);
    rowGF.getCell(1).value = gfKey;
    rowGF.getCell(1).font = { name: 'Calibri', size: 10 };
    rowGF.getCell(1).alignment = { wrapText: true, vertical: 'middle' };

    const valoresGF = [...getLikertValues(rGF), rGF.pctDesf, rGF.pctFav];

    valoresGF.forEach((val, idx) => {
      const cell = rowGF.getCell(idx + 2);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx === valoresGF.length - 1) {
        // mismo helper que ya usas arriba
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: colorPorPct(val)
        };
      }
    });

    currentRow++;
  }
}


    // ───────────────────────────────────────────────────────────────────────────
    // 2) HOJA 2: “Ranking Preguntas”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet2 = workbook.addWorksheet('Ranking Preguntas', {
      views: [{ showGridLines: true }]
    });

    const sheet2LikertStartCol = 3;
    const sheet2InsatCol = sheet2LikertStartCol + likertHeaders.length;
    const sheet2SatCol = sheet2InsatCol + 1;
    const sheet2FactorCol = sheet2SatCol + 1;
    const sheet2MainEndCol = sheet2FactorCol;
    const sheet2LegendStartCol = sheet2MainEndCol + 1;

    sheet2.getColumn(1).width = 6;   // Nº
    sheet2.getColumn(2).width = 40;  // Pregunta
    likertHeaders.forEach((_, idx) => {
      sheet2.getColumn(sheet2LikertStartCol + idx).width = 14; // opciones Likert
    });
    sheet2.getColumn(sheet2InsatCol).width = 17;           // Insatisfacción
    sheet2.getColumn(sheet2SatCol).width = 17;             // Satisfacción
    sheet2.getColumn(sheet2FactorCol).width = 20;          // Factor
    sheet2.getColumn(sheet2LegendStartCol).width = 12;     // leyenda 1
    sheet2.getColumn(sheet2LegendStartCol + 1).width = 16; // leyenda 2
    sheet2.getColumn(sheet2LegendStartCol + 2).width = 10; // leyenda 3

    let row2Index = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const r1 = sheet2.getRow(row2Index);
      r1.getCell(1).value = `Ranking Preguntas ${h.nombre_clima}`;
      sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
      r1.getCell(1).font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
      r1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      const leyendaDatos2 = [
        ['Fortaleza',  'Total acuerdo',     '91-100'],
        ['Adecuado',   'De acuerdo',        '80-90'],
        ['Cautela',    'Desacuerdo',        '79-60'],
        ['Oportunidad','Total desacuerdo',  '59']
      ];
      const leyendaColores2 = ['FF92D050', 'FFFFFF00', 'FFFFC000', 'FFFF0000'];
      leyendaDatos2.forEach((filaValor, idx) => {
        const rowLeyenda = sheet2.getRow(1 + idx);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = sheet2LegendStartCol + colIdx;
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF000000' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: leyendaColores2[idx] } };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        });
      });

      row2Index++;
      const r2 = sheet2.getRow(row2Index);
      r2.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
      r2.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      r2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row2Index++;
      row2Index++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo2 = sheet2.getRow(row2Index);
        rowDemo2.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
        rowDemo2.getCell(1).font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
        rowDemo2.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row2Index++;
      });
      row2Index++; // separación
    }

    interface PreguntaPlano {
      Pregunta: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt0?: number;
      pct_opt2: number;
      pct_opt1: number;
      pctDesf: number; // ← nuevo
      pctFav: number;  // ← nuevo
      factor: string;
    }
    const todasPreguntas: PreguntaPlano[] = [];
    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen || !Array.isArray(group.preguntas)) continue;
      group.preguntas.forEach((q: ItemTransformado) => {
        todasPreguntas.push({
          Pregunta: q.Pregunta,
          pct_opt4: q.pct_opt4,
          pct_opt3: q.pct_opt3,
          pct_opt0: q.pct_opt0,
          pct_opt2: q.pct_opt2,
          pct_opt1: q.pct_opt1,
          pctDesf: q.pctDesf,
          pctFav: q.pctFav,
          factor: key
        });
      });
    }
    // Orden de menor a mayor %Favorable
    todasPreguntas.sort((a, b) => a.pctFav - b.pctFav);

    // Encabezados
    const headerRowIndex = row2Index;
    const headerRow = sheet2.getRow(headerRowIndex);
    headerRow.getCell(1).value = 'Nº';
    headerRow.getCell(2).value = 'Pregunta';
    likertHeaders.forEach((headerText, idx) => {
      headerRow.getCell(sheet2LikertStartCol + idx).value = headerText;
    });
    headerRow.getCell(sheet2InsatCol).value = 'Insatisfacción';
    headerRow.getCell(sheet2SatCol).value = 'Satisfacción';
    headerRow.getCell(sheet2FactorCol).value = 'FACTOR';
    for (let col = 1; col <= sheet2FactorCol; col++) {
      const cab = headerRow.getCell(col);
      let bgColor = 'FFFFFFFF';
      if (col >= sheet2LikertStartCol && col < sheet2InsatCol) {
        bgColor = colorHeaderLikert(String(headerRow.getCell(col).value ?? ''));
      } else if (col === sheet2InsatCol || col === sheet2SatCol) {
        bgColor = 'FFD9D9D9';
      } else if (col === sheet2FactorCol) {
        bgColor = 'FFB0A78B';
      } else {
        bgColor = 'FFCCCCCC';
      }
      cab.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cab.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cab.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cab.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    row2Index++;

    // Escribir filas
    todasPreguntas.forEach((q, idx) => {
      const rowCur = sheet2.getRow(row2Index + idx);
      rowCur.getCell(1).value = idx + 1;
      rowCur.getCell(2).value = q.Pregunta;
      const valoresQ = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresQ.forEach((val, colIdx) => {
        const cell = rowCur.getCell(sheet2LikertStartCol + colIdx);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colIdx === valoresQ.length - 1) { // Satisfacción (pctFav) con color
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(val) };
        }
      });
      const fCell = rowCur.getCell(sheet2FactorCol);
      fCell.value = q.factor;
      fCell.font = { name: 'Calibri', size: 10 };
      fCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      fCell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    });

    sheet2.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 3) HOJA 3: “Resumen Factores”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet3 = workbook.addWorksheet('Resumen Factores', { views: [{ showGridLines: true }] });

    const sheet3LikertStartCol = 2;
    const sheet3InsatCol = sheet3LikertStartCol + likertHeaders.length;
    const sheet3SatCol = sheet3InsatCol + 1;
    const sheet3MainEndCol = sheet3SatCol;

    sheet3.getColumn(1).width = 30;  // Factor
    likertHeaders.forEach((_, idx) => {
      sheet3.getColumn(sheet3LikertStartCol + idx).width = 14;
    });
    sheet3.getColumn(sheet3InsatCol).width = 17; // Insatisfacción
    sheet3.getColumn(sheet3SatCol).width = 17;   // Satisfacción

    let row3 = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const titleRow = sheet3.getRow(row3);
      titleRow.getCell(1).value = `Resumen de Factores ${h.nombre_clima}`;
      sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
      titleRow.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
      titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row3++;

      const orgRow = sheet3.getRow(row3);
      orgRow.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
      orgRow.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
      orgRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row3++;
      row3++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo = sheet3.getRow(row3);
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
        rowDemo.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row3++;
      });
      row3++; // separación
    }

    const header3 = sheet3.getRow(row3);
    header3.getCell(1).value = 'Factor';
    likertHeaders.forEach((headerText, idx) => {
      header3.getCell(sheet3LikertStartCol + idx).value = headerText;
    });
    header3.getCell(sheet3InsatCol).value = 'Insatisfacción';
    header3.getCell(sheet3SatCol).value = 'Satisfacción';
    for (let col = 1; col <= sheet3MainEndCol; col++) {
      const cell = header3.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 1) {
        bgColor = 'FF4472C4';
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      } else if (col >= sheet3LikertStartCol && col < sheet3InsatCol) {
        bgColor = colorHeaderLikert(String(header3.getCell(col).value ?? ''));
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      } else if (col === sheet3InsatCol || col === sheet3SatCol) {
        bgColor = 'FFD9D9D9';
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      } else {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    row3++;

    interface FactorPlano {
      factor: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt0?: number;
      pct_opt2: number;
      pct_opt1: number;
      pctDesf: number;
      pctFav: number;
    }
    const listaFactores: FactorPlano[] = [];
    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen) continue;
      const r = group.resumen;
      listaFactores.push({
        factor: key,
        pct_opt4: r.pct_opt4,
        pct_opt3: r.pct_opt3,
        pct_opt0: r.pct_opt0,
        pct_opt2: r.pct_opt2,
        pct_opt1: r.pct_opt1,
        pctDesf: r.pctDesf,
        pctFav: r.pctFav
      });
    }
    // Orden por %Favorable ascendente
    listaFactores.sort((a, b) => a.pctFav - b.pctFav);

    listaFactores.forEach((f, idx) => {
      const rowF = sheet3.getRow(row3 + idx);
      rowF.getCell(1).value = f.factor;
      rowF.getCell(1).font = { name: 'Calibri', size: 10 };
      rowF.getCell(1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      rowF.getCell(1).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

      const valoresFac = [...getLikertValues(f), f.pctDesf, f.pctFav];
      valoresFac.forEach((val, cIdx) => {
        const cell = rowF.getCell(sheet3LikertStartCol + cIdx);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (cIdx === valoresFac.length - 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(val) };
        }
      });
    });

    sheet3.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 4) HOJA 4: “TopBottom 5”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet4 = workbook.addWorksheet('TopBottom 5', { views: [{ showGridLines: true }] });

    const sheet4LikertStartCol = 5;
    const sheet4InsatCol = sheet4LikertStartCol + likertHeaders.length;
    const sheet4SatCol = sheet4InsatCol + 1;
    const sheet4MainEndCol = sheet4SatCol;

    sheet4.getColumn(1).width = 6;   // Ranking
    sheet4.getColumn(2).width = 8;   // Tipo
    sheet4.getColumn(3).width = 40;  // Pregunta
    sheet4.getColumn(4).width = 20;  // Factor
    likertHeaders.forEach((_, idx) => {
      sheet4.getColumn(sheet4LikertStartCol + idx).width = 14;
    });
    sheet4.getColumn(sheet4InsatCol).width = 17; // Insatisfacción
    sheet4.getColumn(sheet4SatCol).width = 17;   // Satisfacción

    let row4 = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const titleRow4 = sheet4.getRow(row4);
      titleRow4.getCell(1).value = `Top/Bottom 5 Preguntas ${h.nombre_clima}`;
      sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
      titleRow4.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
      titleRow4.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row4++;

      const orgRow4 = sheet4.getRow(row4);
      orgRow4.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
      orgRow4.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
      orgRow4.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row4++;
      row4++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo4 = sheet4.getRow(row4);
        rowDemo4.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
        rowDemo4.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo4.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row4++;
      });
      row4++; // separación
    }

    // Título “Peor 5”
    const peorTitleRow = sheet4.getRow(row4);
    peorTitleRow.getCell(1).value = 'Peor 5 Preguntas';
    sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
    peorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    peorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    row4++;

    // Encabezados
    const header4 = sheet4.getRow(row4);
    header4.getCell(1).value = 'Ranking';
    header4.getCell(2).value = 'Tipo';
    header4.getCell(3).value = 'Pregunta';
    header4.getCell(4).value = 'Factor';
    likertHeaders.forEach((headerText, idx) => {
      header4.getCell(sheet4LikertStartCol + idx).value = headerText;
    });
    header4.getCell(sheet4InsatCol).value = 'Insatisfacción';
    header4.getCell(sheet4SatCol).value = 'Satisfacción';
    for (let col = 1; col <= sheet4MainEndCol; col++) {
      const cell = header4.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 2) bgColor = 'FFD9D9D9';
      else if (col >= sheet4LikertStartCol && col < sheet4InsatCol) bgColor = colorHeaderLikert(String(header4.getCell(col).value ?? ''));
      else if (col === sheet4InsatCol || col === sheet4SatCol) bgColor = 'FFD9D9D9';
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    row4++;

    // Extraer y ordenar por %Favorable
    const preguntasPlanas: {
      Pregunta: string;
      factor: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt0?: number;
      pct_opt2: number;
      pct_opt1: number;
      pctDesf: number;
      pctFav: number;
    }[] = [];
    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen || !Array.isArray(group.preguntas)) continue;
      group.preguntas.forEach((q: ItemTransformado) => {
        preguntasPlanas.push({
          Pregunta: q.Pregunta,
          factor: key,
          pct_opt4: q.pct_opt4,
          pct_opt3: q.pct_opt3,
          pct_opt0: q.pct_opt0,
          pct_opt2: q.pct_opt2,
          pct_opt1: q.pct_opt1,
          pctDesf: q.pctDesf,
          pctFav: q.pctFav
        });
      });
    }
    preguntasPlanas.sort((a, b) => a.pctFav - b.pctFav);

    // Bottom 5 (peores %Favorable)
    const bottom5 = preguntasPlanas.slice(0, 5);
    bottom5.forEach((q, idx) => {
      const rowPB = sheet4.getRow(row4 + idx);
      rowPB.getCell(1).value = idx + 1;
      rowPB.getCell(2).value = 'Peor';
      rowPB.getCell(3).value = q.Pregunta;
      rowPB.getCell(4).value = q.factor;
      const valoresBottom = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresBottom.forEach((val, idxVal) => {
        rowPB.getCell(sheet4LikertStartCol + idxVal).value = val;
      });

      rowPB.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colNumber === sheet4SatCol) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(q.pctFav) };
        }
      });
    });
    row4 += bottom5.length + 1;

    // Título “Mejor 5”
    const mejorTitleRow = sheet4.getRow(row4 - 1);
    mejorTitleRow.getCell(1).value = 'Mejor 5 Preguntas';
    sheet4.mergeCells(row4 - 1, 1, row4 - 1, sheet4MainEndCol);
    mejorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    mejorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

    // Reencabezado (opcional)
    const header4b = sheet4.getRow(row4);
    header4b.getCell(1).value = 'Ranking';
    header4b.getCell(2).value = 'Tipo';
    header4b.getCell(3).value = 'Pregunta';
    header4b.getCell(4).value = 'Factor';
    likertHeaders.forEach((headerText, idx) => {
      header4b.getCell(sheet4LikertStartCol + idx).value = headerText;
    });
    header4b.getCell(sheet4InsatCol).value = 'Insatisfacción';
    header4b.getCell(sheet4SatCol).value = 'Satisfacción';
    for (let col = 1; col <= sheet4MainEndCol; col++) {
      const cell = header4b.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 2) bgColor = 'FFD9D9D9';
      else if (col >= sheet4LikertStartCol && col < sheet4InsatCol) bgColor = colorHeaderLikert(String(header4b.getCell(col).value ?? ''));
      else if (col === sheet4InsatCol || col === sheet4SatCol) bgColor = 'FFD9D9D9';
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    row4++;

    // Top 5 (mejores %Favorable)
    const top5 = preguntasPlanas.slice(-5).reverse();
    top5.forEach((q, idx) => {
      const rowPM = sheet4.getRow(row4 + idx);
      rowPM.getCell(1).value = idx + 1;
      rowPM.getCell(2).value = 'Mejor';
      rowPM.getCell(3).value = q.Pregunta;
      rowPM.getCell(4).value = q.factor;
      const valoresTop = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresTop.forEach((val, idxVal) => {
        rowPM.getCell(sheet4LikertStartCol + idxVal).value = val;
      });

      rowPM.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colNumber === sheet4SatCol) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(q.pctFav) };
        }
      });
    });

    sheet4.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 5) HOJA 5: “Brecha Factores” (Satisfacción − Insatisfacción)
    // ───────────────────────────────────────────────────────────────────────────
    const sheet5 = workbook.addWorksheet('Brecha Factores', { views: [{ showGridLines: true }] });

    sheet5.getColumn(1).width = 30; // Factor
    sheet5.getColumn(2).width = 17; // Satisfacción (pctFav)
    sheet5.getColumn(3).width = 17; // Insatisfacción (pctDesf)
    sheet5.getColumn(4).width = 14; // Brecha

    let row5 = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const titleRow5 = sheet5.getRow(row5);
      titleRow5.getCell(1).value = `Brecha Factores ${h.nombre_clima}`;
      sheet5.mergeCells(row5, 1, row5, 4);
      titleRow5.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
      titleRow5.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row5++;

      const orgRow5 = sheet5.getRow(row5);
      orgRow5.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet5.mergeCells(row5, 1, row5, 4);
      orgRow5.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
      orgRow5.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row5++;
      row5++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo5 = sheet5.getRow(row5);
        rowDemo5.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet5.mergeCells(row5, 1, row5, 4);
        rowDemo5.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo5.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row5++;
      });
      row5++; // separación
    }

    const header5 = sheet5.getRow(row5);
    header5.getCell(1).value = 'Factor';
    header5.getCell(2).value = 'Satisfacción';
    header5.getCell(3).value = 'Insatisfacción';
    header5.getCell(4).value = 'Brecha';
    for (let col = 1; col <= 4; col++) {
      const cell = header5.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 1) {
        bgColor = 'FF4472C4';
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      } else {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
    }
    row5++;

    const brechas: { factor: string; pctFav: number; pctDesf: number; brecha: number; }[] = [];
    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen) continue;
      const r = group.resumen;
      brechas.push({
        factor: key,
        pctFav: r.pctFav,
        pctDesf: r.pctDesf,
        brecha: r.pctFav - r.pctDesf
      });
    }
    // Orden descendente por brecha
    brechas.sort((a, b) => b.brecha - a.brecha);

    brechas.forEach((bItem, idx) => {
      const rowB = sheet5.getRow(row5 + idx);
      rowB.getCell(1).value = bItem.factor;
      rowB.getCell(1).font = { name: 'Calibri', size: 10 };
      rowB.getCell(1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      rowB.getCell(1).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };

      rowB.getCell(2).value = bItem.pctFav;
      rowB.getCell(2).font = { name: 'Calibri', size: 10 };
      rowB.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(2).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      rowB.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(bItem.pctFav) };

      rowB.getCell(3).value = bItem.pctDesf;
      rowB.getCell(3).font = { name: 'Calibri', size: 10 };
      rowB.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(3).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      rowB.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(bItem.pctDesf) };

      rowB.getCell(4).value = bItem.brecha;
      rowB.getCell(4).font = { name: 'Calibri', size: 10 };
      rowB.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(4).border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
      let bgBrecha = 'FFD9D9D9';
      if (bItem.brecha > 0) bgBrecha = 'FFC6EFCE'; // verde claro
      if (bItem.brecha < 0) bgBrecha = 'FFFFC0CB'; // rojo claro
      rowB.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgBrecha } as any };
    });

    sheet5.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 6) HOJA 6: “Preguntas Abiertas” (agrupadas por Factor)
    // ───────────────────────────────────────────────────────────────────────────
    const preguntasAbiertasRaw = Array.isArray(climaData.preguntasAbiertas)
      ? climaData.preguntasAbiertas
      : [];

    if (preguntasAbiertasRaw.length > 0) {
      const sheet6 = workbook.addWorksheet('Preguntas Abiertas', {
        views: [{ showGridLines: true }]
      });

      sheet6.getColumn(1).width = 12; // IdPregunta
      sheet6.getColumn(2).width = 55; // Pregunta
      sheet6.getColumn(3).width = 12; // IdRespuesta
      sheet6.getColumn(4).width = 85; // Comentario
      sheet6.getColumn(5).width = 22; // FechaRespuesta

      let row6 = 1;

      if (climaData.header) {
        const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
        const titleRow = sheet6.getRow(row6);
        titleRow.getCell(1).value = `Preguntas Abiertas • ${h.nombre_clima}`;
        sheet6.mergeCells(row6, 1, row6, 5);
        titleRow.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
        titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        row6++;

        const orgRow = sheet6.getRow(row6);
        orgRow.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
        sheet6.mergeCells(row6, 1, row6, 5);
        orgRow.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
        orgRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        row6++;
        row6++;
      }

      if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
        climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
          const rowDemo = sheet6.getRow(row6);
          rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
          sheet6.mergeCells(row6, 1, row6, 5);
          rowDemo.getCell(1).font = { name: 'Calibri', size: 11 };
          rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
          row6++;
        });
        row6++;
      }

      const parseComentarios = (raw: any): PreguntaAbiertaComentario[] => {
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string' && raw.trim() !== '') {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      const formatFecha = (value: any): string => {
        if (!value) return '';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

      const abiertasNormalizadas = preguntasAbiertasRaw
        .map((item: PreguntaAbiertaExport) => ({
          Factor: String(item?.Factor ?? 'Sin factor').trim() || 'Sin factor',
          IdPregunta: Number(item?.IdPregunta ?? 0),
          Pregunta: String(item?.Pregunta ?? '').trim(),
          Comentarios: parseComentarios(item?.ComentariosJSON),
        }))
        .sort((a, b) => {
          const byFactor = a.Factor.localeCompare(b.Factor, 'es', { sensitivity: 'base' });
          if (byFactor !== 0) return byFactor;
          return (a.IdPregunta || 0) - (b.IdPregunta || 0);
        });

      const porFactor = new Map<string, Array<{
        Factor: string;
        IdPregunta: number;
        Pregunta: string;
        Comentarios: PreguntaAbiertaComentario[];
      }>>();

      abiertasNormalizadas.forEach((item) => {
        if (!porFactor.has(item.Factor)) {
          porFactor.set(item.Factor, []);
        }
        porFactor.get(item.Factor)!.push(item);
      });

      for (const [factor, preguntas] of porFactor.entries()) {
        const factorRow = sheet6.getRow(row6);
        factorRow.getCell(1).value = factor;
        sheet6.mergeCells(row6, 1, row6, 5);
        factorRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
        factorRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        factorRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row6++;

        const head = sheet6.getRow(row6);
        head.getCell(1).value = 'IdPregunta';
        head.getCell(2).value = 'Pregunta';
        head.getCell(3).value = 'IdRespuesta';
        head.getCell(4).value = 'Comentario';
        head.getCell(5).value = 'FechaRespuesta';
        for (let c = 1; c <= 5; c++) {
          const cell = head.getCell(c);
          cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        }
        row6++;

        preguntas.forEach((pregunta) => {
          const comentarios = pregunta.Comentarios.length > 0
            ? pregunta.Comentarios
            : [{ IdRespuesta: undefined, Comentario: '', FechaRespuesta: '' }];

          comentarios.forEach((cmt) => {
            const row = sheet6.getRow(row6);
            row.getCell(1).value = pregunta.IdPregunta || '';
            row.getCell(2).value = pregunta.Pregunta || '';
            row.getCell(3).value = cmt?.IdRespuesta ?? '';
            row.getCell(4).value = cmt?.Comentario ?? '';
            row.getCell(5).value = formatFecha(cmt?.FechaRespuesta);

            for (let col = 1; col <= 5; col++) {
              const cell = row.getCell(col);
              cell.font = { name: 'Calibri', size: 10 };
              cell.alignment = {
                horizontal: col === 2 || col === 4 ? 'left' : 'center',
                vertical: 'top',
                wrapText: col === 2 || col === 4
              };
              cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
            }
            row6++;
          });
        });

        row6++;
      }

      sheet6.eachRow({ includeEmpty: false }, (row: any) => row.commit());
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 7) Generar y descargar
    // ───────────────────────────────────────────────────────────────────────────
    workbook.xlsx
      .writeBuffer()
      .then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, 'ClimaLaboral_ReportesCompletos.xlsx');
      })
      .catch((err: any) => {
        console.error('Error generando el Excel con ExcelJS:', err);
      });
  }
}
