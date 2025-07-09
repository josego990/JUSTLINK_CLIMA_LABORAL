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
  pct_satisfaccion: number;
  pct_insatisfaccion: number;
}

export interface ResumenFactor {
  pct_opt1: number;
  pct_opt2: number;
  pct_opt3: number;
  pct_opt4: number;
  pct_satisfaccion: number;
  pct_insatisfaccion: number;
}

export interface FactorGroup {
  preguntas: ItemTransformado[];
  resumen: ResumenFactor;
}

export interface DemograficoSeleccionado {
  nombreCampo: string;
  valoresSeleccionados: string[];
}

export interface ClimaExportData {
  [factor: string]: FactorGroup | any; // `any` para header y camposDemograficos
  header?: {
    nombre_clima: string;
    nombre_organizacion: string;
  };
  camposDemograficos?: DemograficoSeleccionado[];
}

@Injectable({ providedIn: 'root' })
export class ExcelXlsxService {
  exportar(climaData: ClimaExportData): void {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Tu App';
    workbook.created = new Date();

    // ───────────────────────────────────────────────────────────────────────────
    // 1) HOJA 1: “Clima Laboral”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet1 = workbook.addWorksheet('Clima Laboral', {
      views: [{ showGridLines: true }]
    });

    // Congelar filas 1–(4 + número de filas demográficas) → la fila 5+(demográficos) será desplazable
    const numDemo = Array.isArray(climaData.camposDemograficos)
      ? climaData.camposDemograficos.length
      : 0;
    sheet1.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 4 + numDemo,
        topLeftCell: 'A1',
        activeCell: 'A1'
      }
    ];

    // Definición de anchos de columnas A→J
    sheet1.getColumn(1).width = 40;  // A: Factor / Pregunta / Títulos / Campos demo
    sheet1.getColumn(2).width = 14;  // B: Total Desacuerdo / pct_opt4
    sheet1.getColumn(3).width = 14;  // C: Desacuerdo / pct_opt3
    sheet1.getColumn(4).width = 14;  // D: De Acuerdo / pct_opt2
    sheet1.getColumn(5).width = 14;  // E: Total Acuerdo / pct_opt1
    sheet1.getColumn(6).width = 17;  // F: Insatisfacción
    sheet1.getColumn(7).width = 17;  // G: Satisfacción
    sheet1.getColumn(8).width = 12;  // H: leyenda - primera columna
    sheet1.getColumn(9).width = 16;  // I: leyenda - segunda columna
    sheet1.getColumn(10).width = 10; // J: leyenda - tercera columna

    const encabezados = [
      'Total Desacuerdo',
      'Desacuerdo',
      'De Acuerdo',
      'Total Acuerdo',
      'Insatisfacción',
      'Satisfacción'
    ];

    const colorPorPct = (pct: number): { argb: string } => {
      if (pct >= 91) {
        return { argb: 'FF92D050' }; // Verde
      } else if (pct >= 80) {
        return { argb: 'FFFFFF00' }; // Amarillo
      } else if (pct >= 60) {
        return { argb: 'FFFFC000' }; // Naranja
      } else {
        return { argb: 'FFFF0000' }; // Rojo
      }
    };

    const colorEncabezadoPorTexto: Record<string, string> = {
      'Total Desacuerdo': 'FFFFC0CB',
      'Desacuerdo':       'FFFFC0CB',
      'De Acuerdo':       'FFC6EFCE',
      'Total Acuerdo':    'FFC6EFCE',
      'Insatisfacción':   'FFD9D9D9',
      'Satisfacion':      'FFD9D9D9',
      'Satisfación':      'FFD9D9D9'
    };

    let currentRow = 1;

    // --- 0) Header y leyenda en “Clima Laboral” ---
    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };

      // Fila 1: “Resultados Generales Clima <nombre_clima>” (A→G)
      const row1 = sheet1.getRow(currentRow);
      row1.getCell(1).value = `Resultados Generales Clima ${h.nombre_clima}`;
      sheet1.mergeCells(currentRow, 1, currentRow, 7);
      row1.getCell(1).font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
      row1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      // “Tablita” de rangos (col H→J, filas 1–4)
      const leyendaDatos = [
        ['Fortaleza',  'Total acuerdo',     '91-100'],
        ['Adecuado',   'De acuerdo',        '80-90'],
        ['Cautela',    'Desacuerdo',        '79-60'],
        ['Oportunidad','Total desacuerdo',  '59']
      ];
      const leyendaColores = ['FF92D050', 'FFFFFF00', 'FFFFC000', 'FFFF0000'];
      leyendaDatos.forEach((filaValor, idx) => {
        const numeroFilaLeyenda = 1 + idx; // 1, 2, 3, 4
        const rowLeyenda = sheet1.getRow(numeroFilaLeyenda);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = 8 + colIdx; // 8→H, 9→I, 10→J
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF000000' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: leyendaColores[idx] }
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top:    { style: 'thin' },
            left:   { style: 'thin' },
            bottom: { style: 'thin' },
            right:  { style: 'thin' }
          };
        });
      });

      currentRow++;

      // Fila 2: “Organización: <nombre_organización>” (A→G)
      const row2 = sheet1.getRow(currentRow);
      row2.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet1.mergeCells(currentRow, 1, currentRow, 7);
      row2.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      row2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      currentRow++;

      // Fila en blanco (separación)
      currentRow++;
    }

    // --- 0.b’) Campos Demográficos (si existen) ---
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo = sheet1.getRow(currentRow);
        const valores = cd.valoresSeleccionados.join(', ');
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${valores}`;
        sheet1.mergeCells(currentRow, 1, currentRow, 7);
        rowDemo.getCell(1).font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
        rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        currentRow++;
      });
      // Fila en blanco tras campos demográficos
      currentRow++;
    }

    // --- 1) Recorrer cada FactorGroup para “Clima Laboral” ---
    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen || !Array.isArray(group.preguntas)) continue;

      // 1.a) Título del factor (A→G)
      const rowTitle = sheet1.getRow(currentRow);
      rowTitle.getCell(1).value = key;
      sheet1.mergeCells(currentRow, 1, currentRow, 7);
      rowTitle.height = 20;
      rowTitle.getCell(1).font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
      rowTitle.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // azul oscuro
      };
      rowTitle.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      currentRow++;

      // 1.b) Encabezados “Resultado General” (col B→G)
      const rowHeader = sheet1.getRow(currentRow);
      rowHeader.getCell(1).value = ''; // A vacía
      encabezados.forEach((headerText, idx) => {
        const cell = rowHeader.getCell(idx + 2); // B→G
        cell.value = headerText;
        const bgColor = colorEncabezadoPorTexto[headerText] || 'FFFFFFFF';
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
      });
      currentRow++;

      // 1.c) Fila “Resultado General”
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
        r.pct_insatisfaccion,
        r.pct_satisfaccion
      ];
      valoresResumen.forEach((val, idx) => {
        const cell = rowGeneral.getCell(idx + 2); // B→G
        cell.value = val;
        cell.font = { name: 'Calibri', size: 11 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        if (idx === 5) {
          const fillColor = colorPorPct(val).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });
      currentRow++;

      // 1.d) Filas de cada pregunta
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
          q.pct_insatisfaccion,
          q.pct_satisfaccion
        ];
        valoresPregunta.forEach((val, idx) => {
          const cell = rowPreg.getCell(idx + 2); // B→G
          cell.value = val;
          cell.font = { name: 'Calibri', size: 10 };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if (idx === 5) {
            const fillColor = colorPorPct(val).argb;
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: fillColor }
            };
          }
        });
        currentRow++;
      });

      // 1.e) Fila en blanco tras cada factor
      currentRow++;
    }

    // --- 2) Resumen por Factor (A→G) al final de Hoja 1 ---
    const rowResumenTitle = sheet1.getRow(currentRow);
    rowResumenTitle.getCell(1).value = 'Resumen por Factor';
    sheet1.mergeCells(currentRow, 1, currentRow, 7);
    rowResumenTitle.height = 20;
    rowResumenTitle.getCell(1).font = { name: 'Calibri', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
    rowResumenTitle.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    rowResumenTitle.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    currentRow++;

    const rowResumenHeader = sheet1.getRow(currentRow);
    rowResumenHeader.getCell(1).value = 'Factor';
    rowResumenHeader.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    rowResumenHeader.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF95B3D7' }
    };
    rowResumenHeader.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    encabezados.forEach((headerText, idx) => {
      const cell = rowResumenHeader.getCell(idx + 2);
      cell.value = headerText;
      const bgColor = colorEncabezadoPorTexto[headerText] || 'FFFFFFFF';
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    });
    currentRow++;

    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen) continue;
      const r = group.resumen;
      const rowFactRes = sheet1.getRow(currentRow);
      rowFactRes.getCell(1).value = key;
      rowFactRes.getCell(1).font = { name: 'Calibri', size: 10 };
      rowFactRes.getCell(1).alignment = { wrapText: true, vertical: 'middle' };

      const valoresFactRes = [
        r.pct_opt4,
        r.pct_opt3,
        r.pct_opt2,
        r.pct_opt1,
        r.pct_insatisfaccion,
        r.pct_satisfaccion
      ];
      valoresFactRes.forEach((val, idx) => {
        const cell = rowFactRes.getCell(idx + 2);
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (idx === 5) {
          const fillColor = colorPorPct(val).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });
      currentRow++;
    }

    sheet1.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 2) HOJA 2: “Ranking Preguntas”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet2 = workbook.addWorksheet('Ranking Preguntas', {
      views: [{ showGridLines: true }]
    });

    // Congelar filas 1–(4 + número de demográficos) → la fila 5+(demo) será desplazable
    sheet2.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 4 + numDemo,
        topLeftCell: 'A1',
        activeCell: 'A1'
      }
    ];

    // Anchos de columnas A→L
    sheet2.getColumn(1).width = 6;   // A: Nº
    sheet2.getColumn(2).width = 40;  // B: Pregunta
    sheet2.getColumn(3).width = 14;  // C: Total Desacuerdo
    sheet2.getColumn(4).width = 14;  // D: Desacuerdo
    sheet2.getColumn(5).width = 14;  // E: De Acuerdo
    sheet2.getColumn(6).width = 14;  // F: Total Acuerdo
    sheet2.getColumn(7).width = 17;  // G: Insatisfacción
    sheet2.getColumn(8).width = 17;  // H: Satisfacción
    sheet2.getColumn(9).width = 20;  // I: FACTOR
    sheet2.getColumn(10).width = 12; // J: leyenda 1
    sheet2.getColumn(11).width = 16; // K: leyenda 2
    sheet2.getColumn(12).width = 10; // L: leyenda 3

    let row2Index = 1;

    // --- 0) Título y leyenda en “Ranking Preguntas” ---
    if (climaData.header) {
      const h = climaData.header as { nombre_clima: string; nombre_organizacion: string };

      // Fila 1: “Ranking Preguntas <nombre_clima>” (A1→H1)
      const r1 = sheet2.getRow(row2Index);
      r1.getCell(1).value = `Ranking Preguntas ${h.nombre_clima}`;
      sheet2.mergeCells(row2Index, 1, row2Index, 8);
      r1.getCell(1).font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF000000' } };
      r1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

      // “Tablita” en columnas J→L (filas 1–4)
      const leyendaDatos2 = [
        ['Fortaleza',  'Total acuerdo',     '91-100'],
        ['Adecuado',   'De acuerdo',        '80-90'],
        ['Cautela',    'Desacuerdo',        '79-60'],
        ['Oportunidad','Total desacuerdo',  '59']
      ];
      const leyendaColores2 = ['FF92D050', 'FFFFFF00', 'FFFFC000', 'FFFF0000'];
      leyendaDatos2.forEach((filaValor, idx) => {
        const numeroFilaLeyenda = 1 + idx; // 1,2,3,4
        const rowLeyenda = sheet2.getRow(numeroFilaLeyenda);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = 10 + colIdx; // 10→J, 11→K, 12→L
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF000000' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: leyendaColores2[idx] }
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top:    { style: 'thin' },
            left:   { style: 'thin' },
            bottom: { style: 'thin' },
            right:  { style: 'thin' }
          };
        });
      });

      row2Index++;

      // Fila 2: “Organización: <nombre_organización>” (A2→H2)
      const r2 = sheet2.getRow(row2Index);
      r2.getCell(1).value = `Organización: ${h.nombre_organizacion}`;
      sheet2.mergeCells(row2Index, 1, row2Index, 8);
      r2.getCell(1).font = { name: 'Calibri', size: 12, italic: true, color: { argb: 'FF333333' } };
      r2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row2Index++;

      // Fila en blanco
      row2Index++;
    }

    // --- 0.b’) Campos Demográficos (si hay) en hoja 2 ---
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo2 = sheet2.getRow(row2Index);
        const valores = cd.valoresSeleccionados.join(', ');
        rowDemo2.getCell(1).value = `${cd.nombreCampo}: ${valores}`;
        sheet2.mergeCells(row2Index, 1, row2Index, 8); // A→H
        rowDemo2.getCell(1).font = { name: 'Calibri', size: 11, color: { argb: 'FF000000' } };
        rowDemo2.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row2Index++;
      });
      // Fila en blanco
      row2Index++;
    }

    // --- 1) Aplanar preguntas para ranking ---
    interface PreguntaPlano {
      Pregunta: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt2: number;
      pct_opt1: number;
      pct_insatisfaccion: number;
      pct_satisfaccion: number;
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
          pct_insatisfaccion: q.pct_insatisfaccion,
          pct_satisfaccion: q.pct_satisfaccion,
          factor: key
        });
      });
    }
    // 2) Ordenar de menor a mayor pct_satisfacción
    todasPreguntas.sort((a, b) => a.pct_satisfaccion - b.pct_satisfaccion);

    // --- 3) Encabezados “Ranking Preguntas” (A→I) ---
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
      if (col === 3 || col === 4) {
        bgColor = 'FFFFC0CB'; // columnas C,D → rosa
      } else if (col === 5 || col === 6) {
        bgColor = 'FFC6EFCE'; // columnas E,F → verde claro
      } else if (col === 7 || col === 8) {
        bgColor = 'FFD9D9D9'; // columnas G,H → gris
      } else if (col === 9) {
        bgColor = 'FFB0A78B'; // columna I → caqui oscuro (FACTOR)
      } else {
        bgColor = 'FFCCCCCC'; // columnas A,B → gris neutro
      }
      cab.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cab.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cab.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cab.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    }

    row2Index++;

    // --- 4) Escribir cada pregunta ordenada ---
    todasPreguntas.forEach((q, idx) => {
      const rowCur = sheet2.getRow(row2Index + idx);

      // Col A: Nº
      rowCur.getCell(1).value = idx + 1;
      rowCur.getCell(1).font = { name: 'Calibri', size: 10 };
      rowCur.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      rowCur.getCell(1).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };

      // Col B: Pregunta
      rowCur.getCell(2).value = q.Pregunta;
      rowCur.getCell(2).font = { name: 'Calibri', size: 10 };
      rowCur.getCell(2).alignment = { wrapText: true, vertical: 'top' };
      rowCur.getCell(2).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };

      // Col C–H: porcentajes
      const valoresQ = [
        q.pct_opt4,           // C
        q.pct_opt3,           // D
        q.pct_opt2,           // E
        q.pct_opt1,           // F
        q.pct_insatisfaccion, // G
        q.pct_satisfaccion    // H
      ];
      valoresQ.forEach((val, colIdx) => {
        const cell = rowCur.getCell(colIdx + 3); // C→H
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        if (colIdx === 5) {
          const fillColor = colorPorPct(val).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });

      // Col I: Factor
      const fCell = rowCur.getCell(9);
      fCell.value = q.factor;
      fCell.font = { name: 'Calibri', size: 10 };
      fCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      fCell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    });

    sheet2.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 3) HOJA 3: “Resumen de Factores” (Ranking de Factores)
    // ───────────────────────────────────────────────────────────────────────────
    const sheet3 = workbook.addWorksheet('Resumen Factores', {
      views: [{ showGridLines: true }]
    });

    // Congelar filas 1–(1 + numDemo) → fila 2+numDemo será desplazable
    sheet3.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1 + numDemo,
        topLeftCell: 'A1',
        activeCell: 'A1'
      }
    ];

    // Definir anchos de columnas A→G
    sheet3.getColumn(1).width = 30;  // A: Factor
    sheet3.getColumn(2).width = 14;  // B: Total Desacuerdo
    sheet3.getColumn(3).width = 14;  // C: Desacuerdo
    sheet3.getColumn(4).width = 14;  // D: De Acuerdo
    sheet3.getColumn(5).width = 14;  // E: Total Acuerdo
    sheet3.getColumn(6).width = 17;  // F: Insatisfacción
    sheet3.getColumn(7).width = 17;  // G: Satisfacción

    let row3 = 1;

    // 3.a) Header de “Resumen de Factores”
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

      // Fila en blanco
      row3++;
    }

    // 3.b) Campos demográficos (si existen)
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo = sheet3.getRow(row3);
        const valores = cd.valoresSeleccionados.join(', ');
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${valores}`;
        sheet3.mergeCells(row3, 1, row3, 7);
        rowDemo.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row3++;
      });
      // Fila en blanco
      row3++;
    }

    // 3.c) Encabezados de tabla (A→G)
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
      let bgColor = 'FF95B3D7'; // color de encabezado (gris-azulado)
      if (col === 1) {
        bgColor = 'FF4472C4'; // Factor con fondo azul oscuro, texto blanco
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      } else {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    }
    row3++;

    // 3.d) Rellenar filas de factores ordenados por pct_satisfacción ascendente
    interface FactorPlano {
      factor: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt2: number;
      pct_opt1: number;
      pct_insatisfaccion: number;
      pct_satisfaccion: number;
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
        pct_insatisfaccion: r.pct_insatisfaccion,
        pct_satisfaccion: r.pct_satisfaccion
      });
    }
    // Orden ascendente por pct_satisfacción
    listaFactores.sort((a, b) => a.pct_satisfaccion - b.pct_satisfaccion);

    listaFactores.forEach((f, idx) => {
      const rowF = sheet3.getRow(row3 + idx);
      rowF.getCell(1).value = f.factor;
      rowF.getCell(1).font = { name: 'Calibri', size: 10 };
      rowF.getCell(1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      rowF.getCell(1).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };

      const valoresFac = [
        f.pct_opt4,
        f.pct_opt3,
        f.pct_opt2,
        f.pct_opt1,
        f.pct_insatisfaccion,
        f.pct_satisfaccion
      ];
      valoresFac.forEach((val, cIdx) => {
        const cell = rowF.getCell(cIdx + 2); // B→G
        cell.value = val;
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        if (cIdx === 5) {
          const fillColor = colorPorPct(val).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });
    });

    sheet3.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 4) HOJA 4: “Top 5 / Bottom 5 Preguntas”
    // ───────────────────────────────────────────────────────────────────────────
    const sheet4 = workbook.addWorksheet('TopBottom 5', {
      views: [{ showGridLines: true }]
    });

    // Congelar filas 1–(1 + numDemo) → fila 2+numDemo será desplazable
    sheet4.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1 + numDemo,
        topLeftCell: 'A1',
        activeCell: 'A1'
      }
    ];

    // Definir anchos de columnas A→I
    sheet4.getColumn(1).width = 6;   // A: Ranking
    sheet4.getColumn(2).width = 8;   // B: Tipo (“Peor” / “Mejor”)
    sheet4.getColumn(3).width = 40;  // C: Pregunta
    sheet4.getColumn(4).width = 20;  // D: Factor
    sheet4.getColumn(5).width = 14;  // E: Total Desacuerdo
    sheet4.getColumn(6).width = 14;  // F: Desacuerdo
    sheet4.getColumn(7).width = 14;  // G: De Acuerdo
    sheet4.getColumn(8).width = 14;  // H: Total Acuerdo
    sheet4.getColumn(9).width = 17;  // I: Insatisfacción
    sheet4.getColumn(10).width = 17; // J: Satisfacción

    let row4 = 1;

    // 4.a) Header de “TopBottom 5”
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

      // Fila en blanco
      row4++;
    }

    // 4.b) Campos demográficos (si existen)
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo4 = sheet4.getRow(row4);
        const valores = cd.valoresSeleccionados.join(', ');
        rowDemo4.getCell(1).value = `${cd.nombreCampo}: ${valores}`;
        sheet4.mergeCells(row4, 1, row4, 10);
        rowDemo4.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo4.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row4++;
      });
      // Fila en blanco
      row4++;
    }

    // 4.c) Título de sección Peor 5
    const peorTitleRow = sheet4.getRow(row4);
    peorTitleRow.getCell(1).value = 'Peor 5 Preguntas';
    sheet4.mergeCells(row4, 1, row4, 10);
    peorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    peorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    row4++;

    // 4.d) Encabezados de tabla (A→J)
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
      let bgColor = 'FF95B3D7'; // gris-azulado por defecto
      if (col === 2) {
        bgColor = 'FFD9D9D9'; // Tipo → gris
      } else if (col === 5 || col === 6) {
        bgColor = 'FFFFC0CB'; // tot desacuerdo / desacuerdo → rosa
      } else if (col === 7 || col === 8) {
        bgColor = 'FFC6EFCE'; // de acuerdo / tot acuerdo → verde claro
      } else if (col === 9 || col === 10) {
        bgColor = 'FFD9D9D9'; // insatisfacción / satisfacción → gris
      }
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    }
    row4++;

    // Extraer top/bottom 5
    const preguntasPlanas: {
      Pregunta: string;
      factor: string;
      pct_opt4: number;
      pct_opt3: number;
      pct_opt2: number;
      pct_opt1: number;
      pct_insatisfaccion: number;
      pct_satisfaccion: number;
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
          pct_insatisfaccion: q.pct_insatisfaccion,
          pct_satisfaccion: q.pct_satisfaccion
        });
      });
    }
    preguntasPlanas.sort((a, b) => a.pct_satisfaccion - b.pct_satisfaccion);

    // 4.e) Escribir Bottom 5 (peor)
    const bottom5 = preguntasPlanas.slice(0, 5);
    bottom5.forEach((q, idx) => {
      const rowPB = sheet4.getRow(row4 + idx);
      rowPB.getCell(1).value = idx + 1;       // Ranking dentro del bottom
      rowPB.getCell(2).value = 'Peor';
      rowPB.getCell(3).value = q.Pregunta;
      rowPB.getCell(4).value = q.factor;
      rowPB.getCell(5).value = q.pct_opt4;
      rowPB.getCell(6).value = q.pct_opt3;
      rowPB.getCell(7).value = q.pct_opt2;
      rowPB.getCell(8).value = q.pct_opt1;
      rowPB.getCell(9).value = q.pct_insatisfaccion;
      rowPB.getCell(10).value = q.pct_satisfaccion;

      rowPB.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        if (colNumber === 10) {
          const fillColor = colorPorPct(q.pct_satisfaccion).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });
    });
    row4 += bottom5.length + 1; // Dejar una fila en blanco tras bottom 5

    // 4.f) Título de sección “Mejor 5”
    const mejorTitleRow = sheet4.getRow(row4 - 1);
    mejorTitleRow.getCell(1).value = 'Mejor 5 Preguntas';
    sheet4.mergeCells(row4 - 1, 1, row4 - 1, 10);
    mejorTitleRow.getCell(1).font = { name: 'Calibri', size: 12, bold: true };
    mejorTitleRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };

    // Reescribir encabezados para mantenerlos a la vista si se desea (opcional)
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
      if (col === 2) {
        bgColor = 'FFD9D9D9';
      } else if (col === 5 || col === 6) {
        bgColor = 'FFFFC0CB';
      } else if (col === 7 || col === 8) {
        bgColor = 'FFC6EFCE';
      } else if (col === 9 || col === 10) {
        bgColor = 'FFD9D9D9';
      }
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    }
    row4++;

    // 4.g) Escribir Top 5 (mejores)
    const top5 = preguntasPlanas.slice(-5).reverse(); // últimos 5 invertidos
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
      rowPM.getCell(9).value = q.pct_insatisfaccion;
      rowPM.getCell(10).value = q.pct_satisfaccion;

      rowPM.eachCell({ includeEmpty: true }, (cell:any, colNumber:any) => {
        cell.font = { name: 'Calibri', size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 3 ? 'left' : 'center', wrapText: true };
        cell.border = {
          top:    { style: 'thin' },
          left:   { style: 'thin' },
          bottom: { style: 'thin' },
          right:  { style: 'thin' }
        };
        if (colNumber === 10) {
          const fillColor = colorPorPct(q.pct_satisfaccion).argb;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor }
          };
        }
      });
    });

    sheet4.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 5) HOJA 5: “Brecha Factores” (Satisfacción − Insatisfacción)
    // ───────────────────────────────────────────────────────────────────────────
    const sheet5 = workbook.addWorksheet('Brecha Factores', {
      views: [{ showGridLines: true }]
    });

    // Congelar filas 1–(1 + numDemo)
    sheet5.views = [
      {
        state: 'frozen',
        xSplit: 0,
        ySplit: 1 + numDemo,
        topLeftCell: 'A1',
        activeCell: 'A1'
      }
    ];

    // Definir anchos de columnas A→D
    sheet5.getColumn(1).width = 30; // A: Factor
    sheet5.getColumn(2).width = 17; // B: Satisfacción
    sheet5.getColumn(3).width = 17; // C: Insatisfacción
    sheet5.getColumn(4).width = 14; // D: Brecha

    let row5 = 1;

    // 5.a) Header
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

      // Fila en blanco
      row5++;
    }

    // 5.b) Campos demográficos (si existen)
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd: DemograficoSeleccionado) => {
        const rowDemo5 = sheet5.getRow(row5);
        const valores = cd.valoresSeleccionados.join(', ');
        rowDemo5.getCell(1).value = `${cd.nombreCampo}: ${valores}`;
        sheet5.mergeCells(row5, 1, row5, 4);
        rowDemo5.getCell(1).font = { name: 'Calibri', size: 11 };
        rowDemo5.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row5++;
      });
      // Fila en blanco
      row5++;
    }

    // 5.c) Encabezados (A→D)
    const header5 = sheet5.getRow(row5);
    header5.getCell(1).value = 'Factor';
    header5.getCell(2).value = 'Satisfacción';
    header5.getCell(3).value = 'Insatisfacción';
    header5.getCell(4).value = 'Brecha';

    for (let col = 1; col <= 4; col++) {
      const cell = header5.getCell(col);
      let bgColor = 'FF95B3D7'; // gris-azulado
      if (col === 1) {
        bgColor = 'FF4472C4'; // azul oscuro para Factor
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      } else {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF000000' } };
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
    }
    row5++;

    // 5.d) Rellenar filas de brecha por factor
    const brechas: {
      factor: string;
      pct_satisfaccion: number;
      pct_insatisfaccion: number;
      brecha: number;
    }[] = [];

    for (const key of Object.keys(climaData)) {
      if (key === 'header' || key === 'camposDemograficos') continue;
      const group = climaData[key] as FactorGroup;
      if (!group || !group.resumen) continue;
      const r = group.resumen;
      const b = r.pct_satisfaccion - r.pct_insatisfaccion;
      brechas.push({
        factor: key,
        pct_satisfaccion: r.pct_satisfaccion,
        pct_insatisfaccion: r.pct_insatisfaccion,
        brecha: b
      });
    }
    // Orden descendente por brecha (mayor a menor)
    brechas.sort((a, b) => b.brecha - a.brecha);

    brechas.forEach((bItem, idx) => {
      const rowB = sheet5.getRow(row5 + idx);
      rowB.getCell(1).value = bItem.factor;
      rowB.getCell(1).font = { name: 'Calibri', size: 10 };
      rowB.getCell(1).alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
      rowB.getCell(1).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };

      rowB.getCell(2).value = bItem.pct_satisfaccion;
      rowB.getCell(2).font = { name: 'Calibri', size: 10 };
      rowB.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(2).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
      const fillSat = colorPorPct(bItem.pct_satisfaccion).argb;
      rowB.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillSat }
      };

      rowB.getCell(3).value = bItem.pct_insatisfaccion;
      rowB.getCell(3).font = { name: 'Calibri', size: 10 };
      rowB.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(3).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
      const fillIns = colorPorPct(0 + bItem.pct_insatisfaccion).argb; // usa la misma lógica
      rowB.getCell(3).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: fillIns }
      };

      rowB.getCell(4).value = bItem.brecha;
      rowB.getCell(4).font = { name: 'Calibri', size: 10 };
      rowB.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
      rowB.getCell(4).border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };
      // Colorea la brecha: positivo → verde claro, negativo → rojo claro, neutro → gris
      let bgBrecha = 'FFFFFFFF';
      if (bItem.brecha > 0) {
        bgBrecha = 'FFC6EFCE'; // verde claro
      } else if (bItem.brecha < 0) {
        bgBrecha = 'FFFFC0CB'; // rojo claro
      } else {
        bgBrecha = 'FFD9D9D9'; // gris neutro
      }
      rowB.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgBrecha }
      };
    });

    sheet5.eachRow({ includeEmpty: false }, (row: any) => row.commit());


    // ───────────────────────────────────────────────────────────────────────────
    // 6) Generar y descargar el archivo “.xlsx”
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
