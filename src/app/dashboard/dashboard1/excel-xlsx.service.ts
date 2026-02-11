// excel-xlsx.service.ts
import { Injectable } from '@angular/core';
// @ts-ignore: import de la build “browser” de ExcelJS
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';

export interface ItemTransformado {
  Pregunta: string;
  pct_opt1: number;
  pct_opt2: number;
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

export interface ClimaExportData {
  [factor: string]: FactorGroup | any;
  header?: {
    nombre_clima: string;
    nombre_organizacion: string;
  };
  camposDemograficos?: DemograficoSeleccionado[];

  // NUEVO
  granFactores?: Record<string, GranFactorGroup>;
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

    const numDemo0 = Array.isArray(climaData.camposDemograficos)
      ? climaData.camposDemograficos.length
      : 0;
    sheet0.views = [
      { state: 'frozen', xSplit: 0, ySplit: 4 + numDemo0, topLeftCell: 'A1', activeCell: 'A1' }
    ];

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

    const numDemo = Array.isArray(climaData.camposDemograficos)
      ? climaData.camposDemograficos.length
      : 0;
    sheet1.views = [
      { state: 'frozen', xSplit: 0, ySplit: 4 + numDemo, topLeftCell: 'A1', activeCell: 'A1' }
    ];

    // A→J
    sheet1.getColumn(1).width = 40;  // A: Factor/Pregunta/etc.
    sheet1.getColumn(2).width = 14;  // B: Total Desacuerdo / pct_opt4
    sheet1.getColumn(3).width = 14;  // C: Desacuerdo / pct_opt3
    sheet1.getColumn(4).width = 14;  // D: De Acuerdo / pct_opt2
    sheet1.getColumn(5).width = 14;  // E: Total Acuerdo / pct_opt1
    sheet1.getColumn(6).width = 17;  // F: % Desfavorable (Bottom-2) ← antes Insatisfacción
    sheet1.getColumn(7).width = 17;  // G: % Favorable (Top-2)      ← antes Satisfacción
    sheet1.getColumn(8).width = 12;  // H: leyenda 1
    sheet1.getColumn(9).width = 16;  // I: leyenda 2
    sheet1.getColumn(10).width = 10; // J: leyenda 3

    // Encabezados de columnas (mantengo textos; mapeo interno cambia)
    const encabezados = [
      'Totalmente Desacuerdo',
      'En Desacuerdo',
      'De Acuerdo',
      'Totalmente de Acuerdo',
      'Insatisfacción',  // ← ahora mapea a pctDesf
      'Satisfacción'     // ← ahora mapea a pctFav
    ];

   

    const colorEncabezadoPorTexto: Record<string, string> = {
      'Totalmente Desacuerdo': 'FFFFC0CB',
      'En Desacuerdo':       'FFFFC0CB',
      'De Acuerdo':       'FFC6EFCE',
      'Totalmente de Acuerdo':    'FFC6EFCE',
      'Insatisfacción':   'FFD9D9D9',
      'Satisfacción':     'FFD9D9D9'
    };

    let currentRow = 1;

    // --- Header y leyenda Hoja 1 ---
    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };

      const row1 = sheet1.getRow(currentRow);
      row1.getCell(1).value = `Resultados Generales Clima ${h.nombre_clima}`;
      sheet1.mergeCells(currentRow, 1, currentRow, 7);
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
          const col = 8 + colIdx; // H,I,J
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
      sheet1.mergeCells(currentRow, 1, currentRow, 7);
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
        sheet1.mergeCells(currentRow, 1, currentRow, 7);
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
    sheet1.mergeCells(currentRow, 1, currentRow, 7);
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
  sheet1.mergeCells(currentRow, 1, currentRow, 7);
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

  const valoresResumen = [
    r.pct_opt4,
    r.pct_opt3,
    r.pct_opt2,
    r.pct_opt1,
    r.pctDesf, // Insatisfacción
    r.pctFav   // Satisfacción
  ];
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
    if (idx === 5) {
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

    const valoresPregunta = [
      q.pct_opt4,
      q.pct_opt3,
      q.pct_opt2,
      q.pct_opt1,
      q.pctDesf, // Insatisfacción
      q.pctFav   // Satisfacción
    ];
    valoresPregunta.forEach((val, idx) => {
      const cell = rowPreg.getCell(idx + 2);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx === 5) {
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
sheet1.mergeCells(currentRow, 1, currentRow, 7);
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
    sheet1.mergeCells(currentRow, 1, currentRow, 7);
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

  const valoresFactRes = [
    r.pct_opt4,
    r.pct_opt3,
    r.pct_opt2,
    r.pct_opt1,
    r.pctDesf,
    r.pctFav
  ];
  valoresFactRes.forEach((val, idx) => {
    const cell = rowFactRes.getCell(idx + 2);
    cell.value = val;
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    if (idx === 5) {
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
  sheet1.mergeCells(currentRow, 1, currentRow, 7);
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

    const valoresGF = [
      rGF.pct_opt4,
      rGF.pct_opt3,
      rGF.pct_opt2,
      rGF.pct_opt1,
      rGF.pctDesf, // Insatisfacción
      rGF.pctFav   // Satisfacción
    ];

    valoresGF.forEach((val, idx) => {
      const cell = rowGF.getCell(idx + 2);
      cell.value = val;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      if (idx === 5) {
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
    sheet2.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 + numDemo, topLeftCell: 'A1', activeCell: 'A1' }];

    // A→L
    sheet2.getColumn(1).width = 6;   // Nº
    sheet2.getColumn(2).width = 40;  // Pregunta
    sheet2.getColumn(3).width = 14;  // Total Desacuerdo
    sheet2.getColumn(4).width = 14;  // Desacuerdo
    sheet2.getColumn(5).width = 14;  // De Acuerdo
    sheet2.getColumn(6).width = 14;  // Total Acuerdo
    sheet2.getColumn(7).width = 17;  // Insatisfacción (→ pctDesf)
    sheet2.getColumn(8).width = 17;  // Satisfacción  (→ pctFav)
    sheet2.getColumn(9).width = 20;  // FACTOR
    sheet2.getColumn(10).width = 12; // leyenda 1
    sheet2.getColumn(11).width = 16; // leyenda 2
    sheet2.getColumn(12).width = 10; // leyenda 3

    let row2Index = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const r1 = sheet2.getRow(row2Index);
      r1.getCell(1).value = `Ranking Preguntas ${h.nombre_clima}`;
      sheet2.mergeCells(row2Index, 1, row2Index, 8);
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
          const col = 10 + colIdx; // J,K,L
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
      sheet2.mergeCells(row2Index, 1, row2Index, 8);
      r2.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      r2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row2Index++;
      row2Index++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo2 = sheet2.getRow(row2Index);
        rowDemo2.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet2.mergeCells(row2Index, 1, row2Index, 8);
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
    headerRow.getCell(3).value = 'Total Desacuerdo';
    headerRow.getCell(4).value = 'Desacuerdo';
    headerRow.getCell(5).value = 'De Acuerdo';
    headerRow.getCell(6).value = 'Total Acuerdo';
    headerRow.getCell(7).value = 'Insatisfacción';
    headerRow.getCell(8).value = 'Satisfacción';
    headerRow.getCell(9).value = 'FACTOR';
    for (let col = 1; col <= 9; col++) {
      const cab = headerRow.getCell(col);
      let bgColor = 'FFFFFFFF';
      if (col === 3 || col === 4) bgColor = 'FFFFC0CB';
      else if (col === 5 || col === 6) bgColor = 'FFC6EFCE';
      else if (col === 7 || col === 8) bgColor = 'FFD9D9D9';
      else if (col === 9)           bgColor = 'FFB0A78B';
      else                          bgColor = 'FFCCCCCC';
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
      const valoresQ = [ q.pct_opt4, q.pct_opt3, q.pct_opt2, q.pct_opt1, q.pctDesf, q.pctFav ];
      valoresQ.forEach((val, colIdx) => {
        const cell = rowCur.getCell(colIdx + 3); // C→H
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colIdx === 5) { // Satisfacción (pctFav) con color
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(val) };
        }
      });
      const fCell = rowCur.getCell(9);
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
    sheet3.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 + numDemo, topLeftCell: 'A1', activeCell: 'A1' }];

    sheet3.getColumn(1).width = 30;  // Factor
    sheet3.getColumn(2).width = 14;  // Total Desacuerdo
    sheet3.getColumn(3).width = 14;  // Desacuerdo
    sheet3.getColumn(4).width = 14;  // De Acuerdo
    sheet3.getColumn(5).width = 14;  // Total Acuerdo
    sheet3.getColumn(6).width = 17;  // Insatisfacción (pctDesf)
    sheet3.getColumn(7).width = 17;  // Satisfacción  (pctFav)

    let row3 = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const titleRow = sheet3.getRow(row3);
      titleRow.getCell(1).value = `Resumen de Factores ${h.nombre_clima}`;
      sheet3.mergeCells(row3, 1, row3, 7);
      titleRow.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
      titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row3++;

      const orgRow = sheet3.getRow(row3);
      orgRow.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet3.mergeCells(row3, 1, row3, 7);
      orgRow.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
      orgRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row3++;
      row3++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo = sheet3.getRow(row3);
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet3.mergeCells(row3, 1, row3, 7);
        rowDemo.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row3++;
      });
      row3++; // separación
    }

    const header3 = sheet3.getRow(row3);
    header3.getCell(1).value = 'Factor';
    header3.getCell(2).value = 'Total Desacuerdo';
    header3.getCell(3).value = 'Desacuerdo';
    header3.getCell(4).value = 'De Acuerdo';
    header3.getCell(5).value = 'Total Acuerdo';
    header3.getCell(6).value = 'Insatisfacción';
    header3.getCell(7).value = 'Satisfacción';
    for (let col = 1; col <= 7; col++) {
      const cell = header3.getCell(col);
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
    row3++;

    interface FactorPlano {
      factor: string;
      pct_opt4: number;
      pct_opt3: number;
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

      const valoresFac = [ f.pct_opt4, f.pct_opt3, f.pct_opt2, f.pct_opt1, f.pctDesf, f.pctFav ];
      valoresFac.forEach((val, cIdx) => {
        const cell = rowF.getCell(cIdx + 2); // B→G
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (cIdx === 5) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(val) };
        }
      });
    });

    sheet3.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 4) HOJA 4: “TopBottom 5”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet4 = workbook.addWorksheet('TopBottom 5', { views: [{ showGridLines: true }] });
    sheet4.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 + numDemo, topLeftCell: 'A1', activeCell: 'A1' }];

    sheet4.getColumn(1).width = 6;   // Ranking
    sheet4.getColumn(2).width = 8;   // Tipo
    sheet4.getColumn(3).width = 40;  // Pregunta
    sheet4.getColumn(4).width = 20;  // Factor
    sheet4.getColumn(5).width = 14;  // Tot Desacuerdo
    sheet4.getColumn(6).width = 14;  // Desacuerdo
    sheet4.getColumn(7).width = 14;  // De Acuerdo
    sheet4.getColumn(8).width = 14;  // Tot Acuerdo
    sheet4.getColumn(9).width = 17;  // Insatisfacción (pctDesf)
    sheet4.getColumn(10).width = 17; // Satisfacción  (pctFav)

    let row4 = 1;

    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };
      const titleRow4 = sheet4.getRow(row4);
      titleRow4.getCell(1).value = `Top/Bottom 5 Preguntas ${h.nombre_clima}`;
      sheet4.mergeCells(row4, 1, row4, 10);
      titleRow4.getCell(1).font = { name: 'Calibri', size: 14, bold: true };
      titleRow4.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row4++;

      const orgRow4 = sheet4.getRow(row4);
      orgRow4.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet4.mergeCells(row4, 1, row4, 10);
      orgRow4.getCell(1).font = { name: 'Calibri', size: 12, italic: true };
      orgRow4.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row4++;
      row4++; // separación
    }

    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo4 = sheet4.getRow(row4);
        rowDemo4.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(', ')}`;
        sheet4.mergeCells(row4, 1, row4, 10);
        rowDemo4.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo4.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row4++;
      });
      row4++; // separación
    }

    // Título “Peor 5”
    const peorTitleRow = sheet4.getRow(row4);
    peorTitleRow.getCell(1).value = 'Peor 5 Preguntas';
    sheet4.mergeCells(row4, 1, row4, 10);
    peorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    peorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    row4++;

    // Encabezados
    const header4 = sheet4.getRow(row4);
    header4.getCell(1).value = 'Ranking';
    header4.getCell(2).value = 'Tipo';
    header4.getCell(3).value = 'Pregunta';
    header4.getCell(4).value = 'Factor';
    header4.getCell(5).value = 'Tot Desacuerdo';
    header4.getCell(6).value = 'Desacuerdo';
    header4.getCell(7).value = 'De Acuerdo';
    header4.getCell(8).value = 'Tot Acuerdo';
    header4.getCell(9).value = 'Insatisfacción';
    header4.getCell(10).value = 'Satisfacción';
    for (let col = 1; col <= 10; col++) {
      const cell = header4.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 2) bgColor = 'FFD9D9D9';
      else if (col === 5 || col === 6) bgColor = 'FFFFC0CB';
      else if (col === 7 || col === 8) bgColor = 'FFC6EFCE';
      else if (col === 9 || col === 10) bgColor = 'FFD9D9D9';
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
      rowPB.getCell(5).value = q.pct_opt4;
      rowPB.getCell(6).value = q.pct_opt3;
      rowPB.getCell(7).value = q.pct_opt2;
      rowPB.getCell(8).value = q.pct_opt1;
      rowPB.getCell(9).value = q.pctDesf;
      rowPB.getCell(10).value = q.pctFav;

      rowPB.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colNumber === 10) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(q.pctFav) };
        }
      });
    });
    row4 += bottom5.length + 1;

    // Título “Mejor 5”
    const mejorTitleRow = sheet4.getRow(row4 - 1);
    mejorTitleRow.getCell(1).value = 'Mejor 5 Preguntas';
    sheet4.mergeCells(row4 - 1, 1, row4 - 1, 10);
    mejorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    mejorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

    // Reencabezado (opcional)
    const header4b = sheet4.getRow(row4);
    header4b.getCell(1).value = 'Ranking';
    header4b.getCell(2).value = 'Tipo';
    header4b.getCell(3).value = 'Pregunta';
    header4b.getCell(4).value = 'Factor';
    header4b.getCell(5).value = 'Tot Desacuerdo';
    header4b.getCell(6).value = 'Desacuerdo';
    header4b.getCell(7).value = 'De Acuerdo';
    header4b.getCell(8).value = 'Tot Acuerdo';
    header4b.getCell(9).value = 'Insatisfacción';
    header4b.getCell(10).value = 'Satisfacción';
    for (let col = 1; col <= 10; col++) {
      const cell = header4b.getCell(col);
      let bgColor = 'FF95B3D7';
      if (col === 2) bgColor = 'FFD9D9D9';
      else if (col === 5 || col === 6) bgColor = 'FFFFC0CB';
      else if (col === 7 || col === 8) bgColor = 'FFC6EFCE';
      else if (col === 9 || col === 10) bgColor = 'FFD9D9D9';
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
      rowPM.getCell(5).value = q.pct_opt4;
      rowPM.getCell(6).value = q.pct_opt3;
      rowPM.getCell(7).value = q.pct_opt2;
      rowPM.getCell(8).value = q.pct_opt1;
      rowPM.getCell(9).value = q.pctDesf;
      rowPM.getCell(10).value = q.pctFav;

      rowPM.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = { top:{style:'thin'}, left:{style:'thin'}, bottom:{style:'thin'}, right:{style:'thin'} };
        if (colNumber === 10) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: colorPorPct(q.pctFav) };
        }
      });
    });

    sheet4.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 5) HOJA 5: “Brecha Factores” (Satisfacción − Insatisfacción)
    // ───────────────────────────────────────────────────────────────────────────
    const sheet5 = workbook.addWorksheet('Brecha Factores', { views: [{ showGridLines: true }] });
    sheet5.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 + numDemo, topLeftCell: 'A1', activeCell: 'A1' }];

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
    // 6) Generar y descargar
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
