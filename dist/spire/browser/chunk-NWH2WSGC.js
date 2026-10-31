import {
  require_FileSaver_min,
  require_exceljs_min
} from "./chunk-KKRFUJ7O.js";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BHZ7HWLX.js";
import {
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/dashboard/dashboard1/excel-xlsx.service.ts
var ExcelJS = __toESM(require_exceljs_min());
var import_file_saver = __toESM(require_FileSaver_min());
var ExcelXlsxService = class _ExcelXlsxService {
  exportarEncuestasEnvio(data) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Tu App";
    workbook.created = /* @__PURE__ */ new Date();
    const worksheet = workbook.addWorksheet(data.sheetName || "Envio encuestas", {
      views: [{ showGridLines: true }]
    });
    const columns = data.columns ?? [];
    const rows = data.rows ?? [];
    const totalColumns = Math.max(columns.length, 1);
    columns.forEach((column, index) => {
      const excelColumn = worksheet.getColumn(index + 1);
      excelColumn.key = column.key;
      excelColumn.width = column.width ?? (column.dynamic ? 22 : 18);
    });
    const mergeAcross = (rowNumber) => {
      worksheet.mergeCells(rowNumber, 1, rowNumber, totalColumns);
    };
    mergeAcross(1);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = data.title || "Reporte de envio de encuestas";
    titleCell.font = { bold: true, size: 16, color: { argb: "FF0F172A" } };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };
    mergeAcross(2);
    const subtitleCell = worksheet.getCell(2, 1);
    subtitleCell.value = data.subtitle || "";
    subtitleCell.font = { size: 11, color: { argb: "FF475569" } };
    subtitleCell.alignment = { vertical: "middle", horizontal: "left" };
    mergeAcross(3);
    const filtersCell = worksheet.getCell(3, 1);
    filtersCell.value = (data.filters ?? []).filter(Boolean).join(" | ");
    filtersCell.font = { size: 10, color: { argb: "FF64748B" }, italic: true };
    filtersCell.alignment = { vertical: "middle", horizontal: "left" };
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(columns.map((column) => column.header));
    headerRow.height = 24;
    headerRow.eachCell((cell, colNumber) => {
      const column = columns[colNumber - 1];
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: column?.dynamic ? "FF9CA3AF" : "FF1D4ED8" }
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } }
      };
    });
    rows.forEach((rowData, rowIndex) => {
      const row = worksheet.addRow(columns.map((column) => rowData[column.key] ?? "-"));
      row.eachCell((cell, colNumber) => {
        const column = columns[colNumber - 1];
        cell.alignment = {
          vertical: "middle",
          horizontal: colNumber <= 2 ? "left" : "center",
          wrapText: true
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } }
        };
        if (column?.dynamic) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rowIndex % 2 === 0 ? "FFF8FAFC" : "FFF3F4F6" }
          };
        }
      });
    });
    worksheet.autoFilter = {
      from: { row: headerRow.number, column: 1 },
      to: { row: headerRow.number, column: totalColumns }
    };
    worksheet.views = [{ state: "frozen", ySplit: headerRow.number }];
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      (0, import_file_saver.saveAs)(blob, data.fileName || "EnvioEncuestas.xlsx");
    }).catch((error) => {
      console.error("Error al exportar Excel de envio de encuestas:", error);
    });
  }
  exportar(climaData) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Tu App";
    workbook.created = /* @__PURE__ */ new Date();
    const colorPorPct = (pct) => {
      if (pct >= 91)
        return { argb: "FF29B6F6" };
      if (pct >= 80)
        return { argb: "FF92D050" };
      if (pct >= 60)
        return { argb: "FFFFC000" };
      return { argb: "FFFF0000" };
    };
    const colorPorPctInverso = (pct) => colorPorPct(100 - pct);
    const colorNps = (nps) => {
      if (nps >= 50)
        return { argb: "FF92D050" };
      if (nps >= 0)
        return { argb: "FFFFFF99" };
      return { argb: "FFFFC7CE" };
    };
    const colorRangeValueHeader = (value) => {
      if (value >= 1 && value <= 6)
        return "FFFFC7CE";
      if (value >= 7 && value <= 8)
        return "FFFFEB9C";
      if (value >= 9 && value <= 10)
        return "FFC6EFCE";
      return "FFD9E2F3";
    };
    const parseRangeDistribution = (raw) => {
      let parsed = [];
      if (Array.isArray(raw)) {
        parsed = raw;
      } else if (typeof raw === "string" && raw.trim() !== "") {
        try {
          const asJson = JSON.parse(raw);
          parsed = Array.isArray(asJson) ? asJson : [];
        } catch {
          parsed = [];
        }
      }
      return parsed.map((item) => ({
        Valor: Number(item?.Valor ?? 0),
        Conteo: Number(item?.Conteo ?? 0),
        Porcentaje: Number(item?.Porcentaje ?? 0)
      })).filter((item) => Number.isFinite(item.Valor)).sort((a, b) => a.Valor - b.Valor);
    };
    const buildRangeNpsSummary = (distribution, totalResponses) => {
      const normalizedTotal = totalResponses > 0 ? totalResponses : distribution.reduce((total, item) => total + Number(item.Conteo ?? 0), 0);
      const sumCounts = (from, to) => distribution.filter((item) => item.Valor >= from && item.Valor <= to).reduce((total, item) => total + Number(item.Conteo ?? 0), 0);
      const toPct = (count) => normalizedTotal > 0 ? Math.round((count / normalizedTotal * 100 + Number.EPSILON) * 100) / 100 : 0;
      const detractorsCount = sumCounts(1, 6);
      const passivesCount = sumCounts(7, 8);
      const promotersCount = sumCounts(9, 10);
      const detractorsPct = toPct(detractorsCount);
      const passivesPct = toPct(passivesCount);
      const promotersPct = toPct(promotersCount);
      return {
        detractorsCount,
        detractorsPct,
        passivesCount,
        passivesPct,
        promotersCount,
        promotersPct,
        nps: Math.round((promotersPct - detractorsPct + Number.EPSILON) * 100) / 100
      };
    };
    const hasNeutralLikert = (() => {
      const cg = climaData?.calificacionGeneral;
      if (cg && (cg.total_opt0 !== void 0 || cg.pct_opt0 !== void 0)) {
        return true;
      }
      const tieneNeutroEnGrupo = (group) => {
        if (!group)
          return false;
        if (group.resumen && group.resumen.pct_opt0 !== void 0)
          return true;
        return Array.isArray(group.preguntas) && group.preguntas.some((q) => q.pct_opt0 !== void 0);
      };
      if (climaData.granFactores) {
        for (const gfKey of Object.keys(climaData.granFactores)) {
          const gf = climaData.granFactores[gfKey];
          if (gf?.resumen?.pct_opt0 !== void 0)
            return true;
          for (const factorKey of Object.keys(gf?.factores ?? {})) {
            if (tieneNeutroEnGrupo(gf.factores[factorKey]))
              return true;
          }
        }
      }
      for (const key of Object.keys(climaData)) {
        if (["header", "camposDemograficos", "granFactores", "preguntasAbiertas", "calificacionGeneral"].includes(key))
          continue;
        const group = climaData[key];
        if (tieneNeutroEnGrupo(group))
          return true;
      }
      return false;
    })();
    const likertHeaders = hasNeutralLikert ? ["Totalmente Desacuerdo", "En Desacuerdo", "Neutro", "De Acuerdo", "Totalmente de Acuerdo"] : ["Totalmente Desacuerdo", "En Desacuerdo", "De Acuerdo", "Totalmente de Acuerdo"];
    const getLikertValues = (item) => {
      if (hasNeutralLikert) {
        return [item.pct_opt4, item.pct_opt3, item.pct_opt0 ?? 0, item.pct_opt2, item.pct_opt1];
      }
      return [item.pct_opt4, item.pct_opt3, item.pct_opt2, item.pct_opt1];
    };
    const colorHeaderLikert = (headerText) => {
      if (headerText === "Neutro")
        return "FFD9D9D9";
      if (headerText === "Totalmente Desacuerdo" || headerText === "En Desacuerdo")
        return "FFFFC0CB";
      if (headerText === "Insatisfacci\xF3n" || headerText === "Satisfacci\xF3n")
        return "FFD9D9D9";
      return "FFC6EFCE";
    };
    {
      const cg = climaData?.calificacionGeneral;
      if (cg) {
        const sheet0 = workbook.addWorksheet("Calificaci\xF3n General", {
          views: [{ showGridLines: true }]
        });
        sheet0.getColumn(1).width = 30;
        sheet0.getColumn(2).width = 20;
        sheet0.getColumn(3).width = 20;
        sheet0.getColumn(4).width = 20;
        let r0 = 1;
        if (climaData.header) {
          const h = climaData.header;
          const t = sheet0.getRow(r0);
          t.getCell(1).value = `Calificaci\xF3n General \u2022 ${h.nombre_clima}`;
          sheet0.mergeCells(r0, 1, r0, 4);
          t.getCell(1).font = { name: "Calibri", size: 16, bold: true };
          t.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
          r0++;
          const o = sheet0.getRow(r0);
          o.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
          sheet0.mergeCells(r0, 1, r0, 4);
          o.getCell(1).font = { name: "Calibri", size: 12, italic: true, color: { argb: "FF333333" } };
          o.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
          r0 += 2;
        }
        if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
          climaData.camposDemograficos.forEach((cd) => {
            const row = sheet0.getRow(r0++);
            row.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
            sheet0.mergeCells(r0 - 1, 1, r0 - 1, 4);
            row.getCell(1).font = { name: "Calibri", size: 11 };
            row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          });
          r0++;
        }
        sheet0.mergeCells(r0, 1, r0 + 2, 4);
        const big = sheet0.getCell(r0, 1);
        big.value = Number(cg.pct_top2) / 100;
        big.numFmt = "0.0%";
        big.font = { name: "Calibri", size: 28, bold: true, color: { argb: "FF000000" } };
        big.alignment = { horizontal: "center", vertical: "middle" };
        big.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(Number(cg.pct_top2)) };
        big.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        const lbl = sheet0.getRow(r0 + 3);
        sheet0.mergeCells(r0 + 3, 1, r0 + 3, 4);
        lbl.getCell(1).value = "Satisfacci\xF3n (Top-2)";
        lbl.getCell(1).font = { name: "Calibri", size: 12, bold: true };
        lbl.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        r0 += 5;
        const metricsHeader = sheet0.getRow(r0);
        metricsHeader.getCell(1).value = "M\xE9trica";
        metricsHeader.getCell(2).value = "Valor";
        for (let c = 1; c <= 2; c++) {
          const cell = metricsHeader.getCell(c);
          cell.font = { name: "Calibri", size: 11, bold: true };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF95B3D7" } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }
        r0++;
        const metrics = [
          ["% Satisfacci\xF3n (Top-2)", cg.pct_top2, "pct"],
          ["% Insatisfacci\xF3n (Bottom-2)", cg.pct_desfavorable, "pct"],
          ["NSAT", cg.nsat, "num"],
          ["% General", cg.pct_general, "pct"],
          ["Total respuestas", cg.total_respuestas, "int"],
          ["Media (1\u20134)", cg.mean_1_4, "num"]
        ];
        metrics.forEach((m, i) => {
          const row = sheet0.getRow(r0 + i);
          row.getCell(1).value = m[0];
          row.getCell(1).font = { name: "Calibri", size: 10 };
          row.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          row.getCell(1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          const valCell = row.getCell(2);
          if (m[2] === "pct") {
            valCell.value = Number(m[1]) / 100;
            valCell.numFmt = "0.0%";
          } else if (m[2] === "int") {
            valCell.value = Number(m[1]);
            valCell.numFmt = "0";
          } else {
            valCell.value = Number(m[1]);
            valCell.numFmt = "0.00";
          }
          valCell.font = { name: "Calibri", size: 10 };
          valCell.alignment = { horizontal: "center", vertical: "middle" };
          valCell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          if (m[0].startsWith("% Satisfacci\xF3n")) {
            valCell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(Number(cg.pct_top2)) };
          } else if (m[0].startsWith("% Insatisfacci\xF3n")) {
            valCell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(Number(cg.pct_desfavorable)) };
          }
        });
        sheet0.eachRow({ includeEmpty: false }, (row) => row.commit());
      }
    }
    const sheet1 = workbook.addWorksheet("Clima Laboral", {
      views: [{ showGridLines: true }]
    });
    const sheet1MainEndCol = hasNeutralLikert ? 8 : 7;
    const sheet1LegendStartCol = sheet1MainEndCol + 1;
    const encabezados = [...likertHeaders, "Insatisfacci\xF3n", "Satisfacci\xF3n"];
    sheet1.getColumn(1).width = 40;
    likertHeaders.forEach((_, idx) => {
      sheet1.getColumn(2 + idx).width = 14;
    });
    sheet1.getColumn(2 + likertHeaders.length).width = 17;
    sheet1.getColumn(3 + likertHeaders.length).width = 17;
    sheet1.getColumn(sheet1LegendStartCol).width = 12;
    sheet1.getColumn(sheet1LegendStartCol + 1).width = 16;
    sheet1.getColumn(sheet1LegendStartCol + 2).width = 10;
    const colorEncabezadoPorTexto = {};
    encabezados.forEach((headerText) => {
      colorEncabezadoPorTexto[headerText] = colorHeaderLikert(headerText);
    });
    let currentRow = 1;
    if (climaData.header) {
      const h = climaData.header;
      const row1 = sheet1.getRow(currentRow);
      row1.getCell(1).value = `Resultados Generales Clima ${h.nombre_clima}`;
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      row1.getCell(1).font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF000000" } };
      row1.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      const leyendaDatos = [
        ["Fortaleza", "Totalmente de Acuerdo", "91-100"],
        ["Adecuado", "De acuerdo", "80-90"],
        ["Cautela", "En Desacuerdo", "79-60"],
        ["Oportunidad", "Totalmente en desacuerdo", "59"]
      ];
      const leyendaColores = ["FF29B6F6", "FF92D050", "FFFFC000", "FFFF0000"];
      leyendaDatos.forEach((filaValor, idx) => {
        const rowLeyenda = sheet1.getRow(1 + idx);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = sheet1LegendStartCol + colIdx;
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: leyendaColores[idx] } };
          cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
      });
      currentRow++;
      const row2 = sheet1.getRow(currentRow);
      row2.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      row2.getCell(1).font = { name: "Calibri", size: 12, italic: true, color: { argb: "FF333333" } };
      row2.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;
      currentRow++;
    }
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd) => {
        const rowDemo = sheet1.getRow(currentRow);
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
        sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
        rowDemo.getCell(1).font = { name: "Calibri", size: 11, color: { argb: "FF000000" } };
        rowDemo.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        currentRow++;
      });
      currentRow++;
    }
    const factorEntries = [];
    const granFactores = climaData.granFactores;
    if (granFactores && Object.keys(granFactores).length) {
      for (const gfKey of Object.keys(granFactores)) {
        const gf = granFactores[gfKey];
        for (const factorKey of Object.keys(gf.factores)) {
          const group = gf.factores[factorKey];
          if (!group || !group.resumen || !Array.isArray(group.preguntas))
            continue;
          factorEntries.push({ granFactor: gfKey, factorKey, group });
        }
      }
    } else {
      for (const key of Object.keys(climaData)) {
        if (["header", "camposDemograficos", "granFactores"].includes(key))
          continue;
        const group = climaData[key];
        if (!group || !group.resumen || !Array.isArray(group.preguntas))
          continue;
        factorEntries.push({ granFactor: void 0, factorKey: key, group });
      }
    }
    let currentGranFactor;
    for (const entry of factorEntries) {
      const { granFactor, factorKey, group } = entry;
      if (granFactor && granFactor !== currentGranFactor) {
        const rowGF = sheet1.getRow(currentRow);
        rowGF.getCell(1).value = granFactor;
        sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
        rowGF.height = 22;
        rowGF.getCell(1).font = {
          name: "Calibri",
          size: 14,
          bold: true,
          color: { argb: "FF000000" }
        };
        rowGF.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE2EFDA" }
          // verde muy clarito, cámbialo si quieres
        };
        rowGF.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        currentRow++;
        currentGranFactor = granFactor;
      }
      const rowTitle = sheet1.getRow(currentRow);
      rowTitle.getCell(1).value = factorKey;
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      rowTitle.height = 20;
      rowTitle.getCell(1).font = {
        name: "Calibri",
        size: 13,
        bold: true,
        color: { argb: "FFFFFFFF" }
      };
      rowTitle.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" }
      };
      rowTitle.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
      currentRow++;
      const rowHeader = sheet1.getRow(currentRow);
      rowHeader.getCell(1).value = "";
      encabezados.forEach((headerText, idx) => {
        const cell = rowHeader.getCell(idx + 2);
        cell.value = headerText;
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colorEncabezadoPorTexto[headerText] || "FFFFFFFF" }
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
      currentRow++;
      const r = group.resumen;
      const rowGeneral = sheet1.getRow(currentRow);
      rowGeneral.getCell(1).value = "Resultado General";
      rowGeneral.getCell(1).font = { name: "Calibri", size: 11, bold: true };
      rowGeneral.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
      const valoresResumen = [...getLikertValues(r), r.pctDesf, r.pctFav];
      valoresResumen.forEach((val, idx) => {
        const cell = rowGeneral.getCell(idx + 2);
        cell.value = val;
        cell.font = { name: "Calibri", size: 11 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
        if (idx === valoresResumen.length - 2) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: colorPorPctInverso(val)
          };
        } else if (idx === valoresResumen.length - 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: colorPorPct(val)
          };
        }
      });
      currentRow++;
      group.preguntas.forEach((q) => {
        const rowPreg = sheet1.getRow(currentRow);
        rowPreg.getCell(1).value = q.Pregunta;
        rowPreg.getCell(1).font = { name: "Calibri", size: 10 };
        rowPreg.getCell(1).alignment = { wrapText: true, vertical: "top" };
        const valoresPregunta = [...getLikertValues(q), q.pctDesf, q.pctFav];
        valoresPregunta.forEach((val, idx) => {
          const cell = rowPreg.getCell(idx + 2);
          cell.value = val;
          cell.font = { name: "Calibri", size: 10 };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          if (idx === valoresPregunta.length - 2) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: colorPorPctInverso(val)
            };
          } else if (idx === valoresPregunta.length - 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: colorPorPct(val)
            };
          }
        });
        currentRow++;
      });
      currentRow++;
    }
    const rowResumenTitle = sheet1.getRow(currentRow);
    rowResumenTitle.getCell(1).value = "Resumen por Factor";
    sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
    rowResumenTitle.height = 20;
    rowResumenTitle.getCell(1).font = {
      name: "Calibri",
      size: 13,
      bold: true,
      color: { argb: "FFFFFFFF" }
    };
    rowResumenTitle.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" }
    };
    rowResumenTitle.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    currentRow++;
    const rowResumenHeader = sheet1.getRow(currentRow);
    rowResumenHeader.getCell(1).value = "Factor";
    rowResumenHeader.getCell(1).font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" }
    };
    rowResumenHeader.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF95B3D7" }
    };
    rowResumenHeader.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    encabezados.forEach((headerText, idx) => {
      const cell = rowResumenHeader.getCell(idx + 2);
      cell.value = headerText;
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colorEncabezadoPorTexto[headerText] || "FFFFFFFF" }
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
    currentRow++;
    currentGranFactor = void 0;
    for (const entry of factorEntries) {
      const { granFactor, factorKey, group } = entry;
      const r = group.resumen;
      if (granFactor && granFactor !== currentGranFactor) {
        const gfRow = sheet1.getRow(currentRow);
        gfRow.getCell(1).value = granFactor;
        sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
        gfRow.height = 18;
        gfRow.getCell(1).font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: "FF000000" }
        };
        gfRow.getCell(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE2EFDA" }
        };
        gfRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        currentRow++;
        currentGranFactor = granFactor;
      }
      const rowFactRes = sheet1.getRow(currentRow);
      rowFactRes.getCell(1).value = factorKey;
      rowFactRes.getCell(1).font = { name: "Calibri", size: 10 };
      rowFactRes.getCell(1).alignment = { wrapText: true, vertical: "middle" };
      const valoresFactRes = [...getLikertValues(r), r.pctDesf, r.pctFav];
      valoresFactRes.forEach((val, idx) => {
        const cell = rowFactRes.getCell(idx + 2);
        cell.value = val;
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        if (idx === valoresFactRes.length - 2) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: colorPorPctInverso(val)
          };
        } else if (idx === valoresFactRes.length - 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: colorPorPct(val)
          };
        }
      });
      currentRow++;
    }
    sheet1.eachRow({ includeEmpty: false }, (row) => row.commit());
    if (climaData.granFactores) {
      currentRow++;
      const rowGFTitle = sheet1.getRow(currentRow);
      rowGFTitle.getCell(1).value = "Resumen por Gran Factor";
      sheet1.mergeCells(currentRow, 1, currentRow, sheet1MainEndCol);
      rowGFTitle.height = 20;
      rowGFTitle.getCell(1).font = {
        name: "Calibri",
        size: 13,
        bold: true,
        color: { argb: "FFFFFFFF" }
      };
      rowGFTitle.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" }
      };
      rowGFTitle.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;
      const rowGFHeader = sheet1.getRow(currentRow);
      rowGFHeader.getCell(1).value = "Gran Factor";
      rowGFHeader.getCell(1).font = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: "FFFFFFFF" }
      };
      rowGFHeader.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF95B3D7" }
      };
      rowGFHeader.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      encabezados.forEach((headerText, idx) => {
        const cell = rowGFHeader.getCell(idx + 2);
        cell.value = headerText;
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: "FF000000" }
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colorEncabezadoPorTexto[headerText] || "FFFFFFFF" }
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
      currentRow++;
      for (const gfKey of Object.keys(climaData.granFactores)) {
        const gf = climaData.granFactores[gfKey];
        const rGF = gf.resumen;
        const rowGF = sheet1.getRow(currentRow);
        rowGF.getCell(1).value = gfKey;
        rowGF.getCell(1).font = { name: "Calibri", size: 10 };
        rowGF.getCell(1).alignment = { wrapText: true, vertical: "middle" };
        const valoresGF = [...getLikertValues(rGF), rGF.pctDesf, rGF.pctFav];
        valoresGF.forEach((val, idx) => {
          const cell = rowGF.getCell(idx + 2);
          cell.value = val;
          cell.font = { name: "Calibri", size: 10 };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          if (idx === valoresGF.length - 2) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: colorPorPctInverso(val)
            };
          } else if (idx === valoresGF.length - 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: colorPorPct(val)
            };
          }
        });
        currentRow++;
      }
    }
    const sheet2 = workbook.addWorksheet("Ranking Preguntas", {
      views: [{ showGridLines: true }]
    });
    const sheet2LikertStartCol = 3;
    const sheet2InsatCol = sheet2LikertStartCol + likertHeaders.length;
    const sheet2SatCol = sheet2InsatCol + 1;
    const sheet2FactorCol = sheet2SatCol + 1;
    const sheet2MainEndCol = sheet2FactorCol;
    const sheet2LegendStartCol = sheet2MainEndCol + 1;
    sheet2.getColumn(1).width = 6;
    sheet2.getColumn(2).width = 40;
    likertHeaders.forEach((_, idx) => {
      sheet2.getColumn(sheet2LikertStartCol + idx).width = 14;
    });
    sheet2.getColumn(sheet2InsatCol).width = 17;
    sheet2.getColumn(sheet2SatCol).width = 17;
    sheet2.getColumn(sheet2FactorCol).width = 20;
    sheet2.getColumn(sheet2LegendStartCol).width = 12;
    sheet2.getColumn(sheet2LegendStartCol + 1).width = 16;
    sheet2.getColumn(sheet2LegendStartCol + 2).width = 10;
    let row2Index = 1;
    if (climaData.header) {
      const h = climaData.header;
      const r1 = sheet2.getRow(row2Index);
      r1.getCell(1).value = `Ranking Preguntas ${h.nombre_clima}`;
      sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
      r1.getCell(1).font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF000000" } };
      r1.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      const leyendaDatos2 = [
        ["Fortaleza", "Total acuerdo", "91-100"],
        ["Adecuado", "De acuerdo", "80-90"],
        ["Cautela", "Desacuerdo", "79-60"],
        ["Oportunidad", "Total desacuerdo", "59"]
      ];
      const leyendaColores2 = ["FF29B6F6", "FF92D050", "FFFFC000", "FFFF0000"];
      leyendaDatos2.forEach((filaValor, idx) => {
        const rowLeyenda = sheet2.getRow(1 + idx);
        filaValor.forEach((textoCelda, colIdx) => {
          const col = sheet2LegendStartCol + colIdx;
          const cell = rowLeyenda.getCell(col);
          cell.value = textoCelda;
          cell.font = { name: "Calibri", size: 9, bold: true, color: { argb: "FF000000" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: leyendaColores2[idx] } };
          cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
      });
      row2Index++;
      const r2 = sheet2.getRow(row2Index);
      r2.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
      sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
      r2.getCell(1).font = { name: "Calibri", size: 12, italic: true, color: { argb: "FF333333" } };
      r2.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row2Index++;
      row2Index++;
    }
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd) => {
        const rowDemo2 = sheet2.getRow(row2Index);
        rowDemo2.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
        sheet2.mergeCells(row2Index, 1, row2Index, sheet2MainEndCol);
        rowDemo2.getCell(1).font = { name: "Calibri", size: 11, color: { argb: "FF000000" } };
        rowDemo2.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row2Index++;
      });
      row2Index++;
    }
    const todasPreguntas = [];
    for (const key of Object.keys(climaData)) {
      if (key === "header" || key === "camposDemograficos")
        continue;
      const group = climaData[key];
      if (!group || !group.resumen || !Array.isArray(group.preguntas))
        continue;
      group.preguntas.forEach((q) => {
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
    todasPreguntas.sort((a, b) => a.pctFav - b.pctFav);
    const headerRowIndex = row2Index;
    const headerRow = sheet2.getRow(headerRowIndex);
    headerRow.getCell(1).value = "N\xBA";
    headerRow.getCell(2).value = "Pregunta";
    likertHeaders.forEach((headerText, idx) => {
      headerRow.getCell(sheet2LikertStartCol + idx).value = headerText;
    });
    headerRow.getCell(sheet2InsatCol).value = "Insatisfacci\xF3n";
    headerRow.getCell(sheet2SatCol).value = "Satisfacci\xF3n";
    headerRow.getCell(sheet2FactorCol).value = "FACTOR";
    for (let col = 1; col <= sheet2FactorCol; col++) {
      const cab = headerRow.getCell(col);
      let bgColor = "FFFFFFFF";
      if (col >= sheet2LikertStartCol && col < sheet2InsatCol) {
        bgColor = colorHeaderLikert(String(headerRow.getCell(col).value ?? ""));
      } else if (col === sheet2InsatCol || col === sheet2SatCol) {
        bgColor = "FFD9D9D9";
      } else if (col === sheet2FactorCol) {
        bgColor = "FFB0A78B";
      } else {
        bgColor = "FFCCCCCC";
      }
      cab.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      cab.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cab.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cab.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }
    row2Index++;
    todasPreguntas.forEach((q, idx) => {
      const rowCur = sheet2.getRow(row2Index + idx);
      rowCur.getCell(1).value = idx + 1;
      rowCur.getCell(2).value = q.Pregunta;
      const valoresQ = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresQ.forEach((val, colIdx) => {
        const cell = rowCur.getCell(sheet2LikertStartCol + colIdx);
        cell.value = val;
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (colIdx === valoresQ.length - 2) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(val) };
        } else if (colIdx === valoresQ.length - 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(val) };
        }
      });
      const fCell = rowCur.getCell(sheet2FactorCol);
      fCell.value = q.factor;
      fCell.font = { name: "Calibri", size: 10 };
      fCell.alignment = { wrapText: true, vertical: "middle", horizontal: "left" };
      fCell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });
    sheet2.eachRow({ includeEmpty: false }, (row) => row.commit());
    const sheet3 = workbook.addWorksheet("Resumen Factores", { views: [{ showGridLines: true }] });
    const sheet3LikertStartCol = 2;
    const sheet3InsatCol = sheet3LikertStartCol + likertHeaders.length;
    const sheet3SatCol = sheet3InsatCol + 1;
    const sheet3MainEndCol = sheet3SatCol;
    sheet3.getColumn(1).width = 30;
    likertHeaders.forEach((_, idx) => {
      sheet3.getColumn(sheet3LikertStartCol + idx).width = 14;
    });
    sheet3.getColumn(sheet3InsatCol).width = 17;
    sheet3.getColumn(sheet3SatCol).width = 17;
    let row3 = 1;
    if (climaData.header) {
      const h = climaData.header;
      const titleRow = sheet3.getRow(row3);
      titleRow.getCell(1).value = `Resumen de Factores ${h.nombre_clima}`;
      sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
      titleRow.getCell(1).font = { name: "Calibri", size: 14, bold: true };
      titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row3++;
      const orgRow = sheet3.getRow(row3);
      orgRow.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
      sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
      orgRow.getCell(1).font = { name: "Calibri", size: 12, italic: true };
      orgRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row3++;
      row3++;
    }
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd) => {
        const rowDemo = sheet3.getRow(row3);
        rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
        sheet3.mergeCells(row3, 1, row3, sheet3MainEndCol);
        rowDemo.getCell(1).font = { name: "Calibri", size: 11 };
        rowDemo.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row3++;
      });
      row3++;
    }
    const header3 = sheet3.getRow(row3);
    header3.getCell(1).value = "Factor";
    likertHeaders.forEach((headerText, idx) => {
      header3.getCell(sheet3LikertStartCol + idx).value = headerText;
    });
    header3.getCell(sheet3InsatCol).value = "Insatisfacci\xF3n";
    header3.getCell(sheet3SatCol).value = "Satisfacci\xF3n";
    for (let col = 1; col <= sheet3MainEndCol; col++) {
      const cell = header3.getCell(col);
      let bgColor = "FF95B3D7";
      if (col === 1) {
        bgColor = "FF4472C4";
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      } else if (col >= sheet3LikertStartCol && col < sheet3InsatCol) {
        bgColor = colorHeaderLikert(String(header3.getCell(col).value ?? ""));
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      } else if (col === sheet3InsatCol || col === sheet3SatCol) {
        bgColor = "FFD9D9D9";
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      } else {
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }
    row3++;
    const listaFactores = [];
    for (const key of Object.keys(climaData)) {
      if (key === "header" || key === "camposDemograficos")
        continue;
      const group = climaData[key];
      if (!group || !group.resumen)
        continue;
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
    listaFactores.sort((a, b) => a.pctFav - b.pctFav);
    listaFactores.forEach((f, idx) => {
      const rowF = sheet3.getRow(row3 + idx);
      rowF.getCell(1).value = f.factor;
      rowF.getCell(1).font = { name: "Calibri", size: 10 };
      rowF.getCell(1).alignment = { wrapText: true, vertical: "middle", horizontal: "left" };
      rowF.getCell(1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      const valoresFac = [...getLikertValues(f), f.pctDesf, f.pctFav];
      valoresFac.forEach((val, cIdx) => {
        const cell = rowF.getCell(sheet3LikertStartCol + cIdx);
        cell.value = val;
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (cIdx === valoresFac.length - 2) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(val) };
        } else if (cIdx === valoresFac.length - 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(val) };
        }
      });
    });
    sheet3.eachRow({ includeEmpty: false }, (row) => row.commit());
    const sheet4 = workbook.addWorksheet("TopBottom 5", { views: [{ showGridLines: true }] });
    const sheet4LikertStartCol = 5;
    const sheet4InsatCol = sheet4LikertStartCol + likertHeaders.length;
    const sheet4SatCol = sheet4InsatCol + 1;
    const sheet4MainEndCol = sheet4SatCol;
    sheet4.getColumn(1).width = 6;
    sheet4.getColumn(2).width = 8;
    sheet4.getColumn(3).width = 40;
    sheet4.getColumn(4).width = 20;
    likertHeaders.forEach((_, idx) => {
      sheet4.getColumn(sheet4LikertStartCol + idx).width = 14;
    });
    sheet4.getColumn(sheet4InsatCol).width = 17;
    sheet4.getColumn(sheet4SatCol).width = 17;
    let row4 = 1;
    if (climaData.header) {
      const h = climaData.header;
      const titleRow4 = sheet4.getRow(row4);
      titleRow4.getCell(1).value = `Top/Bottom 5 Preguntas ${h.nombre_clima}`;
      sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
      titleRow4.getCell(1).font = { name: "Calibri", size: 14, bold: true };
      titleRow4.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row4++;
      const orgRow4 = sheet4.getRow(row4);
      orgRow4.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
      sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
      orgRow4.getCell(1).font = { name: "Calibri", size: 12, italic: true };
      orgRow4.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row4++;
      row4++;
    }
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd) => {
        const rowDemo4 = sheet4.getRow(row4);
        rowDemo4.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
        sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
        rowDemo4.getCell(1).font = { name: "Calibri", size: 11 };
        rowDemo4.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row4++;
      });
      row4++;
    }
    const peorTitleRow = sheet4.getRow(row4);
    peorTitleRow.getCell(1).value = "Peor 5 Preguntas";
    sheet4.mergeCells(row4, 1, row4, sheet4MainEndCol);
    peorTitleRow.getCell(1).font = { name: "Calibri", size: 12, bold: true };
    peorTitleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    row4++;
    const header4 = sheet4.getRow(row4);
    header4.getCell(1).value = "Ranking";
    header4.getCell(2).value = "Tipo";
    header4.getCell(3).value = "Pregunta";
    header4.getCell(4).value = "Factor";
    likertHeaders.forEach((headerText, idx) => {
      header4.getCell(sheet4LikertStartCol + idx).value = headerText;
    });
    header4.getCell(sheet4InsatCol).value = "Insatisfacci\xF3n";
    header4.getCell(sheet4SatCol).value = "Satisfacci\xF3n";
    for (let col = 1; col <= sheet4MainEndCol; col++) {
      const cell = header4.getCell(col);
      let bgColor = "FF95B3D7";
      if (col === 2)
        bgColor = "FFD9D9D9";
      else if (col >= sheet4LikertStartCol && col < sheet4InsatCol)
        bgColor = colorHeaderLikert(String(header4.getCell(col).value ?? ""));
      else if (col === sheet4InsatCol || col === sheet4SatCol)
        bgColor = "FFD9D9D9";
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }
    row4++;
    const preguntasPlanas = [];
    for (const key of Object.keys(climaData)) {
      if (key === "header" || key === "camposDemograficos")
        continue;
      const group = climaData[key];
      if (!group || !group.resumen || !Array.isArray(group.preguntas))
        continue;
      group.preguntas.forEach((q) => {
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
    const bottom5 = preguntasPlanas.slice(0, 5);
    bottom5.forEach((q, idx) => {
      const rowPB = sheet4.getRow(row4 + idx);
      rowPB.getCell(1).value = idx + 1;
      rowPB.getCell(2).value = "Peor";
      rowPB.getCell(3).value = q.Pregunta;
      rowPB.getCell(4).value = q.factor;
      const valoresBottom = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresBottom.forEach((val, idxVal) => {
        rowPB.getCell(sheet4LikertStartCol + idxVal).value = val;
      });
      rowPB.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = { vertical: "middle", horizontal: colNumber === 3 ? "left" : "center", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (colNumber === sheet4InsatCol) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(q.pctDesf) };
        } else if (colNumber === sheet4SatCol) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(q.pctFav) };
        }
      });
    });
    row4 += bottom5.length + 1;
    const mejorTitleRow = sheet4.getRow(row4 - 1);
    mejorTitleRow.getCell(1).value = "Mejor 5 Preguntas";
    sheet4.mergeCells(row4 - 1, 1, row4 - 1, sheet4MainEndCol);
    mejorTitleRow.getCell(1).font = { name: "Calibri", size: 12, bold: true };
    mejorTitleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    const header4b = sheet4.getRow(row4);
    header4b.getCell(1).value = "Ranking";
    header4b.getCell(2).value = "Tipo";
    header4b.getCell(3).value = "Pregunta";
    header4b.getCell(4).value = "Factor";
    likertHeaders.forEach((headerText, idx) => {
      header4b.getCell(sheet4LikertStartCol + idx).value = headerText;
    });
    header4b.getCell(sheet4InsatCol).value = "Insatisfacci\xF3n";
    header4b.getCell(sheet4SatCol).value = "Satisfacci\xF3n";
    for (let col = 1; col <= sheet4MainEndCol; col++) {
      const cell = header4b.getCell(col);
      let bgColor = "FF95B3D7";
      if (col === 2)
        bgColor = "FFD9D9D9";
      else if (col >= sheet4LikertStartCol && col < sheet4InsatCol)
        bgColor = colorHeaderLikert(String(header4b.getCell(col).value ?? ""));
      else if (col === sheet4InsatCol || col === sheet4SatCol)
        bgColor = "FFD9D9D9";
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }
    row4++;
    const top5 = preguntasPlanas.slice(-5).reverse();
    top5.forEach((q, idx) => {
      const rowPM = sheet4.getRow(row4 + idx);
      rowPM.getCell(1).value = idx + 1;
      rowPM.getCell(2).value = "Mejor";
      rowPM.getCell(3).value = q.Pregunta;
      rowPM.getCell(4).value = q.factor;
      const valoresTop = [...getLikertValues(q), q.pctDesf, q.pctFav];
      valoresTop.forEach((val, idxVal) => {
        rowPM.getCell(sheet4LikertStartCol + idxVal).value = val;
      });
      rowPM.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: "Calibri", size: 10 };
        cell.alignment = { vertical: "middle", horizontal: colNumber === 3 ? "left" : "center", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (colNumber === sheet4InsatCol) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(q.pctDesf) };
        } else if (colNumber === sheet4SatCol) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(q.pctFav) };
        }
      });
    });
    sheet4.eachRow({ includeEmpty: false }, (row) => row.commit());
    const sheet5 = workbook.addWorksheet("Brecha Factores", { views: [{ showGridLines: true }] });
    sheet5.getColumn(1).width = 30;
    sheet5.getColumn(2).width = 17;
    sheet5.getColumn(3).width = 17;
    sheet5.getColumn(4).width = 14;
    let row5 = 1;
    if (climaData.header) {
      const h = climaData.header;
      const titleRow5 = sheet5.getRow(row5);
      titleRow5.getCell(1).value = `Brecha Factores ${h.nombre_clima}`;
      sheet5.mergeCells(row5, 1, row5, 4);
      titleRow5.getCell(1).font = { name: "Calibri", size: 14, bold: true };
      titleRow5.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row5++;
      const orgRow5 = sheet5.getRow(row5);
      orgRow5.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
      sheet5.mergeCells(row5, 1, row5, 4);
      orgRow5.getCell(1).font = { name: "Calibri", size: 12, italic: true };
      orgRow5.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      row5++;
      row5++;
    }
    if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
      climaData.camposDemograficos.forEach((cd) => {
        const rowDemo5 = sheet5.getRow(row5);
        rowDemo5.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
        sheet5.mergeCells(row5, 1, row5, 4);
        rowDemo5.getCell(1).font = { name: "Calibri", size: 11 };
        rowDemo5.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row5++;
      });
      row5++;
    }
    const header5 = sheet5.getRow(row5);
    header5.getCell(1).value = "Factor";
    header5.getCell(2).value = "Satisfacci\xF3n";
    header5.getCell(3).value = "Insatisfacci\xF3n";
    header5.getCell(4).value = "Brecha";
    for (let col = 1; col <= 4; col++) {
      const cell = header5.getCell(col);
      let bgColor = "FF95B3D7";
      if (col === 1) {
        bgColor = "FF4472C4";
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      } else {
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
      }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgColor } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    }
    row5++;
    const brechas = [];
    for (const key of Object.keys(climaData)) {
      if (key === "header" || key === "camposDemograficos")
        continue;
      const group = climaData[key];
      if (!group || !group.resumen)
        continue;
      const r = group.resumen;
      brechas.push({
        factor: key,
        pctFav: r.pctFav,
        pctDesf: r.pctDesf,
        brecha: r.pctFav - r.pctDesf
      });
    }
    brechas.sort((a, b) => b.brecha - a.brecha);
    brechas.forEach((bItem, idx) => {
      const rowB = sheet5.getRow(row5 + idx);
      rowB.getCell(1).value = bItem.factor;
      rowB.getCell(1).font = { name: "Calibri", size: 10 };
      rowB.getCell(1).alignment = { wrapText: true, vertical: "middle", horizontal: "left" };
      rowB.getCell(1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      rowB.getCell(2).value = bItem.pctFav;
      rowB.getCell(2).font = { name: "Calibri", size: 10 };
      rowB.getCell(2).alignment = { horizontal: "center", vertical: "middle" };
      rowB.getCell(2).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      rowB.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: colorPorPct(bItem.pctFav) };
      rowB.getCell(3).value = bItem.pctDesf;
      rowB.getCell(3).font = { name: "Calibri", size: 10 };
      rowB.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
      rowB.getCell(3).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      rowB.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: colorPorPctInverso(bItem.pctDesf) };
      rowB.getCell(4).value = bItem.brecha;
      rowB.getCell(4).font = { name: "Calibri", size: 10 };
      rowB.getCell(4).alignment = { horizontal: "center", vertical: "middle" };
      rowB.getCell(4).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      let bgBrecha = "FFD9D9D9";
      if (bItem.brecha > 0)
        bgBrecha = "FFC6EFCE";
      if (bItem.brecha < 0)
        bgBrecha = "FFFFC0CB";
      rowB.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgBrecha } };
    });
    sheet5.eachRow({ includeEmpty: false }, (row) => row.commit());
    const preguntasRangoRaw = Array.isArray(climaData.preguntasRango) ? climaData.preguntasRango : [];
    if (preguntasRangoRaw.length > 0) {
      const preguntasRango = preguntasRangoRaw.map((item) => {
        const distribution = parseRangeDistribution(item.distribucionJSON);
        const totalResponses = Number(item.total_respuestas ?? 0) > 0 ? Number(item.total_respuestas) : distribution.reduce((total, value) => total + Number(value.Conteo ?? 0), 0);
        return {
          etiquetaGranFactor: String(item.etiquetaGranFactor ?? "Sin gran factor").trim() || "Sin gran factor",
          factor: String(item.factor ?? "Sin factor").trim() || "Sin factor",
          idPregunta: Number(item.idPregunta ?? 0),
          pregunta: String(item.pregunta ?? "").trim(),
          rangoMin: Number(item.rangoMin ?? 0),
          rangoMax: Number(item.rangoMax ?? 0),
          totalResponses,
          promedio: Number(item.promedio ?? 0),
          distribution,
          distributionMap: new Map(distribution.map((value) => [value.Valor, value])),
          nps: buildRangeNpsSummary(distribution, totalResponses)
        };
      }).sort((a, b) => {
        const byGranFactor = a.etiquetaGranFactor.localeCompare(b.etiquetaGranFactor, "es", { sensitivity: "base" });
        if (byGranFactor !== 0)
          return byGranFactor;
        const byFactor = a.factor.localeCompare(b.factor, "es", { sensitivity: "base" });
        if (byFactor !== 0)
          return byFactor;
        return a.idPregunta - b.idPregunta;
      });
      const rangeValues = Array.from(new Set(preguntasRango.flatMap((item) => item.distribution.map((value) => value.Valor)))).sort((a, b) => a - b);
      const sheetRange = workbook.addWorksheet("Rangos y NPS", {
        views: [{ showGridLines: true }]
      });
      sheetRange.getColumn(1).width = 22;
      sheetRange.getColumn(2).width = 24;
      sheetRange.getColumn(3).width = 48;
      sheetRange.getColumn(4).width = 14;
      sheetRange.getColumn(5).width = 14;
      sheetRange.getColumn(6).width = 12;
      rangeValues.forEach((_, index) => {
        sheetRange.getColumn(7 + index).width = 10;
      });
      const detailMetricsStartCol = 7 + rangeValues.length;
      sheetRange.getColumn(detailMetricsStartCol).width = 14;
      sheetRange.getColumn(detailMetricsStartCol + 1).width = 12;
      sheetRange.getColumn(detailMetricsStartCol + 2).width = 14;
      sheetRange.getColumn(detailMetricsStartCol + 3).width = 12;
      let rowRange = 1;
      if (climaData.header) {
        const h = climaData.header;
        const titleRow = sheetRange.getRow(rowRange);
        titleRow.getCell(1).value = `Resultados de Rangos y NPS \u2022 ${h.nombre_clima}`;
        sheetRange.mergeCells(rowRange, 1, rowRange, detailMetricsStartCol + 3);
        titleRow.getCell(1).font = { name: "Calibri", size: 14, bold: true };
        titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        rowRange++;
        const orgRow = sheetRange.getRow(rowRange);
        orgRow.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
        sheetRange.mergeCells(rowRange, 1, rowRange, detailMetricsStartCol + 3);
        orgRow.getCell(1).font = { name: "Calibri", size: 12, italic: true };
        orgRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        rowRange += 2;
      }
      if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
        climaData.camposDemograficos.forEach((cd) => {
          const rowDemo = sheetRange.getRow(rowRange);
          rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
          sheetRange.mergeCells(rowRange, 1, rowRange, detailMetricsStartCol + 3);
          rowDemo.getCell(1).font = { name: "Calibri", size: 11 };
          rowDemo.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          rowRange++;
        });
        rowRange++;
      }
      const summaryTitleRow = sheetRange.getRow(rowRange);
      summaryTitleRow.getCell(1).value = "Resumen Ejecutivo por Pregunta";
      sheetRange.mergeCells(rowRange, 1, rowRange, 10);
      summaryTitleRow.getCell(1).font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
      summaryTitleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
      summaryTitleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
      rowRange++;
      const summaryHeader = sheetRange.getRow(rowRange);
      const summaryHeaders = [
        "Gran Factor",
        "Factor",
        "Pregunta",
        "Rango",
        "Total respuestas",
        "Promedio",
        "Detractores %",
        "Pasivos %",
        "Promotores %",
        "NPS"
      ];
      summaryHeaders.forEach((label, index) => {
        const cell = summaryHeader.getCell(index + 1);
        cell.value = label;
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: index < 3 ? "FFFFFFFF" : "FF000000" }
        };
        let fill = "FF95B3D7";
        if (index < 3)
          fill = "FF4472C4";
        if (index === 6)
          fill = "FFFFC7CE";
        if (index === 7)
          fill = "FFFFEB9C";
        if (index === 8)
          fill = "FFC6EFCE";
        if (index === 9)
          fill = "FFD9EAD3";
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      rowRange++;
      preguntasRango.forEach((item, index) => {
        const row = sheetRange.getRow(rowRange + index);
        row.getCell(1).value = item.etiquetaGranFactor;
        row.getCell(2).value = item.factor;
        row.getCell(3).value = item.pregunta;
        row.getCell(4).value = `${item.rangoMin}-${item.rangoMax}`;
        row.getCell(5).value = item.totalResponses;
        row.getCell(6).value = item.promedio;
        row.getCell(6).numFmt = "0.00";
        row.getCell(7).value = item.nps.detractorsPct;
        row.getCell(7).numFmt = "0.00";
        row.getCell(8).value = item.nps.passivesPct;
        row.getCell(8).numFmt = "0.00";
        row.getCell(9).value = item.nps.promotersPct;
        row.getCell(9).numFmt = "0.00";
        row.getCell(10).value = item.nps.nps;
        row.getCell(10).numFmt = "0.00";
        for (let col = 1; col <= 10; col++) {
          const cell = row.getCell(col);
          cell.font = { name: "Calibri", size: 10 };
          cell.alignment = {
            horizontal: col <= 3 ? "left" : "center",
            vertical: "middle",
            wrapText: col === 3
          };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }
        row.getCell(7).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFEBEE" } };
        row.getCell(8).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF8E1" } };
        row.getCell(9).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } };
        row.getCell(10).fill = { type: "pattern", pattern: "solid", fgColor: colorNps(item.nps.nps) };
      });
      rowRange += preguntasRango.length + 2;
      const detailTitleRow = sheetRange.getRow(rowRange);
      detailTitleRow.getCell(1).value = "Distribuci\xF3n Detallada por Valor";
      sheetRange.mergeCells(rowRange, 1, rowRange, detailMetricsStartCol + 3);
      detailTitleRow.getCell(1).font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
      detailTitleRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF5B9BD5" } };
      detailTitleRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
      rowRange++;
      const detailHeader = sheetRange.getRow(rowRange);
      const baseHeaders = ["Gran Factor", "Factor", "Pregunta", "Rango", "Total respuestas", "Promedio"];
      baseHeaders.forEach((label, index) => {
        const cell = detailHeader.getCell(index + 1);
        cell.value = label;
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: index < 3 ? "FFFFFFFF" : "FF000000" }
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index < 3 ? "FF4472C4" : "FF95B3D7" }
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      rangeValues.forEach((value, index) => {
        const cell = detailHeader.getCell(7 + index);
        cell.value = String(value);
        cell.font = { name: "Calibri", size: 11, bold: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorRangeValueHeader(value) } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      ["Detractores %", "Pasivos %", "Promotores %", "NPS"].forEach((label, index) => {
        const cell = detailHeader.getCell(detailMetricsStartCol + index);
        cell.value = label;
        cell.font = { name: "Calibri", size: 11, bold: true };
        let fill = "FFD9EAD3";
        if (index === 0)
          fill = "FFFFC7CE";
        if (index === 1)
          fill = "FFFFEB9C";
        if (index === 2)
          fill = "FFC6EFCE";
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      rowRange++;
      preguntasRango.forEach((item, index) => {
        const row = sheetRange.getRow(rowRange + index);
        row.getCell(1).value = item.etiquetaGranFactor;
        row.getCell(2).value = item.factor;
        row.getCell(3).value = item.pregunta;
        row.getCell(4).value = `${item.rangoMin}-${item.rangoMax}`;
        row.getCell(5).value = item.totalResponses;
        row.getCell(6).value = item.promedio;
        row.getCell(6).numFmt = "0.00";
        rangeValues.forEach((value, valueIndex) => {
          const pctValue = Number(item.distributionMap.get(value)?.Porcentaje ?? 0);
          const cell = row.getCell(7 + valueIndex);
          cell.value = pctValue;
          cell.numFmt = "0.00";
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorRangeValueHeader(value) } };
          cell.font = { name: "Calibri", size: 10 };
        });
        row.getCell(detailMetricsStartCol).value = item.nps.detractorsPct;
        row.getCell(detailMetricsStartCol).numFmt = "0.00";
        row.getCell(detailMetricsStartCol + 1).value = item.nps.passivesPct;
        row.getCell(detailMetricsStartCol + 1).numFmt = "0.00";
        row.getCell(detailMetricsStartCol + 2).value = item.nps.promotersPct;
        row.getCell(detailMetricsStartCol + 2).numFmt = "0.00";
        row.getCell(detailMetricsStartCol + 3).value = item.nps.nps;
        row.getCell(detailMetricsStartCol + 3).numFmt = "0.00";
        for (let col = 1; col <= detailMetricsStartCol + 3; col++) {
          const cell = row.getCell(col);
          cell.font = { name: "Calibri", size: 10 };
          if (col <= 6) {
            cell.alignment = {
              horizontal: col <= 3 ? "left" : "center",
              vertical: "middle",
              wrapText: col === 3
            };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          }
        }
        row.getCell(detailMetricsStartCol).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFEBEE" } };
        row.getCell(detailMetricsStartCol + 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF8E1" } };
        row.getCell(detailMetricsStartCol + 2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } };
        row.getCell(detailMetricsStartCol + 3).fill = { type: "pattern", pattern: "solid", fgColor: colorNps(item.nps.nps) };
        row.getCell(detailMetricsStartCol).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(detailMetricsStartCol + 1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(detailMetricsStartCol + 2).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        row.getCell(detailMetricsStartCol + 3).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      sheetRange.eachRow({ includeEmpty: false }, (row) => row.commit());
    }
    const preguntasListaRaw = Array.isArray(climaData.respuestasTipoLista) ? climaData.respuestasTipoLista : [];
    const respuestasLista = preguntasListaRaw.flatMap((item) => {
      const opciones = Array.isArray(item.opciones) ? item.opciones : [];
      const totalRespuestasInformado = Number(item.totalRespuestas ?? 0);
      const totalRespuestas = totalRespuestasInformado > 0 ? totalRespuestasInformado : opciones.reduce((total, opcion) => total + Number(opcion?.conteo ?? 0), 0);
      return opciones.map((opcion, optionIndex) => ({
        idGranFactor: Number(item.idGranFactor ?? 0),
        etiquetaGranFactor: String(item.etiquetaGranFactor ?? "General").trim() || "General",
        idFactor: Number(item.idFactor ?? 0),
        factor: String(item.factor ?? "Sin factor").trim() || "Sin factor",
        idPregunta: Number(item.idPregunta ?? 0),
        pregunta: String(item.pregunta ?? "").trim(),
        totalOpciones: Number(item.totalOpciones ?? opciones.length),
        totalRespuestas,
        idOpcion: Number(opcion?.idOpcion ?? 0),
        valor: String(opcion?.valor ?? "").trim(),
        etiqueta: String(opcion?.etiqueta ?? opcion?.valor ?? "Sin etiqueta").trim() || "Sin etiqueta",
        conteo: Math.max(0, Number(opcion?.conteo ?? 0) || 0),
        porcentaje: Math.max(0, Math.min(100, Number(opcion?.porcentaje ?? 0) || 0)),
        optionIndex
      }));
    }).sort((a, b) => {
      const byGranFactor = a.etiquetaGranFactor.localeCompare(b.etiquetaGranFactor, "es", { sensitivity: "base" });
      if (byGranFactor !== 0)
        return byGranFactor;
      const byFactor = a.factor.localeCompare(b.factor, "es", { sensitivity: "base" });
      if (byFactor !== 0)
        return byFactor;
      if (a.idPregunta !== b.idPregunta)
        return a.idPregunta - b.idPregunta;
      return a.optionIndex - b.optionIndex;
    });
    if (respuestasLista.length > 0) {
      const sheetList = workbook.addWorksheet("Respuestas de selecci\xF3n", {
        views: [{ showGridLines: true }]
      });
      const totalColumns = 13;
      const optionColors = [
        "FFDDEBF7",
        "FFE2F0D9",
        "FFFCE4D6",
        "FFE4DFEC",
        "FFFFF2CC",
        "FFDDEBF7"
      ];
      [14, 22, 12, 24, 12, 52, 12, 20, 28, 12, 14, 16, 14].forEach((width, index) => {
        sheetList.getColumn(index + 1).width = width;
      });
      let rowList = 1;
      if (climaData.header) {
        const h = climaData.header;
        const titleRow = sheetList.getRow(rowList);
        titleRow.getCell(1).value = `Respuestas de preguntas de selecci\xF3n \u2022 ${h.nombre_clima}`;
        sheetList.mergeCells(rowList, 1, rowList, totalColumns);
        titleRow.getCell(1).font = { name: "Calibri", size: 14, bold: true };
        titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        rowList++;
        const orgRow = sheetList.getRow(rowList);
        orgRow.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
        sheetList.mergeCells(rowList, 1, rowList, totalColumns);
        orgRow.getCell(1).font = { name: "Calibri", size: 12, italic: true };
        orgRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        rowList += 2;
      }
      if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
        climaData.camposDemograficos.forEach((cd) => {
          const rowDemo = sheetList.getRow(rowList);
          rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
          sheetList.mergeCells(rowList, 1, rowList, totalColumns);
          rowDemo.getCell(1).font = { name: "Calibri", size: 11 };
          rowDemo.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          rowList++;
        });
        rowList++;
      }
      const headerRowNumber = rowList;
      const headerRow2 = sheetList.getRow(rowList);
      [
        "Id Gran Factor",
        "Gran Factor",
        "Id Factor",
        "Factor",
        "Id Pregunta",
        "Pregunta",
        "Id Opci\xF3n",
        "Valor",
        "Etiqueta",
        "Conteo",
        "Porcentaje",
        "Total respuestas",
        "Total opciones"
      ].forEach((label, index) => {
        const cell = headerRow2.getCell(index + 1);
        cell.value = label;
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      headerRow2.height = 28;
      rowList++;
      respuestasLista.forEach((item, index) => {
        const row = sheetList.getRow(rowList + index);
        row.getCell(1).value = item.idGranFactor || "";
        row.getCell(2).value = item.etiquetaGranFactor;
        row.getCell(3).value = item.idFactor || "";
        row.getCell(4).value = item.factor;
        row.getCell(5).value = item.idPregunta || "";
        row.getCell(6).value = item.pregunta;
        row.getCell(7).value = item.idOpcion || "";
        row.getCell(8).value = item.valor;
        row.getCell(9).value = item.etiqueta;
        row.getCell(10).value = item.conteo;
        row.getCell(11).value = item.porcentaje / 100;
        row.getCell(11).numFmt = "0.00%";
        row.getCell(12).value = item.totalRespuestas;
        row.getCell(13).value = item.totalOpciones;
        for (let col = 1; col <= totalColumns; col++) {
          const cell = row.getCell(col);
          cell.font = { name: "Calibri", size: 10 };
          cell.alignment = {
            horizontal: [2, 4, 6, 8, 9].includes(col) ? "left" : "center",
            vertical: "middle",
            wrapText: [2, 4, 6, 8, 9].includes(col)
          };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
          if (col >= 7 && col <= 11) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: optionColors[item.optionIndex % optionColors.length] }
            };
          }
        }
      });
      sheetList.autoFilter = {
        from: { row: headerRowNumber, column: 1 },
        to: { row: headerRowNumber, column: totalColumns }
      };
      sheetList.views = [{ state: "frozen", ySplit: headerRowNumber, showGridLines: true }];
      sheetList.eachRow({ includeEmpty: false }, (row) => row.commit());
    }
    const preguntasAbiertasRaw = Array.isArray(climaData.preguntasAbiertas) ? climaData.preguntasAbiertas : [];
    if (preguntasAbiertasRaw.length > 0) {
      const sheet6 = workbook.addWorksheet("Preguntas Abiertas", {
        views: [{ showGridLines: true }]
      });
      sheet6.getColumn(1).width = 12;
      sheet6.getColumn(2).width = 55;
      sheet6.getColumn(3).width = 12;
      sheet6.getColumn(4).width = 85;
      sheet6.getColumn(5).width = 22;
      let row6 = 1;
      if (climaData.header) {
        const h = climaData.header;
        const titleRow = sheet6.getRow(row6);
        titleRow.getCell(1).value = `Preguntas Abiertas \u2022 ${h.nombre_clima}`;
        sheet6.mergeCells(row6, 1, row6, 5);
        titleRow.getCell(1).font = { name: "Calibri", size: 14, bold: true };
        titleRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        row6++;
        const orgRow = sheet6.getRow(row6);
        orgRow.getCell(1).value = `Organizaci\xF3n: ${h.nombre_organizacion}`;
        sheet6.mergeCells(row6, 1, row6, 5);
        orgRow.getCell(1).font = { name: "Calibri", size: 12, italic: true };
        orgRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
        row6++;
        row6++;
      }
      if (Array.isArray(climaData.camposDemograficos) && climaData.camposDemograficos.length > 0) {
        climaData.camposDemograficos.forEach((cd) => {
          const rowDemo = sheet6.getRow(row6);
          rowDemo.getCell(1).value = `${cd.nombreCampo}: ${cd.valoresSeleccionados.join(", ")}`;
          sheet6.mergeCells(row6, 1, row6, 5);
          rowDemo.getCell(1).font = { name: "Calibri", size: 11 };
          rowDemo.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
          row6++;
        });
        row6++;
      }
      const parseComentarios = (raw) => {
        if (Array.isArray(raw))
          return raw;
        if (typeof raw === "string" && raw.trim() !== "") {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };
      const formatFecha = (value) => {
        if (!value)
          return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
          return String(value);
        const pad = (n) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };
      const abiertasNormalizadas = preguntasAbiertasRaw.map((item) => ({
        Factor: String(item?.Factor ?? "Sin factor").trim() || "Sin factor",
        IdPregunta: Number(item?.IdPregunta ?? 0),
        Pregunta: String(item?.Pregunta ?? "").trim(),
        Comentarios: parseComentarios(item?.ComentariosJSON)
      })).sort((a, b) => {
        const byFactor = a.Factor.localeCompare(b.Factor, "es", { sensitivity: "base" });
        if (byFactor !== 0)
          return byFactor;
        return (a.IdPregunta || 0) - (b.IdPregunta || 0);
      });
      const porFactor = /* @__PURE__ */ new Map();
      abiertasNormalizadas.forEach((item) => {
        if (!porFactor.has(item.Factor)) {
          porFactor.set(item.Factor, []);
        }
        porFactor.get(item.Factor).push(item);
      });
      for (const [factor, preguntas] of porFactor.entries()) {
        const factorRow = sheet6.getRow(row6);
        factorRow.getCell(1).value = factor;
        sheet6.mergeCells(row6, 1, row6, 5);
        factorRow.getCell(1).font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
        factorRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
        factorRow.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
        row6++;
        const head = sheet6.getRow(row6);
        head.getCell(1).value = "IdPregunta";
        head.getCell(2).value = "Pregunta";
        head.getCell(3).value = "IdRespuesta";
        head.getCell(4).value = "Comentario";
        head.getCell(5).value = "FechaRespuesta";
        for (let c = 1; c <= 5; c++) {
          const cell = head.getCell(c);
          cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF000000" } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }
        row6++;
        preguntas.forEach((pregunta) => {
          const comentarios = pregunta.Comentarios.length > 0 ? pregunta.Comentarios : [{ IdRespuesta: void 0, Comentario: "", FechaRespuesta: "" }];
          comentarios.forEach((cmt) => {
            const row = sheet6.getRow(row6);
            row.getCell(1).value = pregunta.IdPregunta || "";
            row.getCell(2).value = pregunta.Pregunta || "";
            row.getCell(3).value = cmt?.IdRespuesta ?? "";
            row.getCell(4).value = cmt?.Comentario ?? "";
            row.getCell(5).value = formatFecha(cmt?.FechaRespuesta);
            for (let col = 1; col <= 5; col++) {
              const cell = row.getCell(col);
              cell.font = { name: "Calibri", size: 10 };
              cell.alignment = {
                horizontal: col === 2 || col === 4 ? "left" : "center",
                vertical: "top",
                wrapText: col === 2 || col === 4
              };
              cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
            }
            row6++;
          });
        });
        row6++;
      }
      sheet6.eachRow({ includeEmpty: false }, (row) => row.commit());
    }
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      (0, import_file_saver.saveAs)(blob, "ClimaLaboral_ReportesCompletos.xlsx");
    }).catch((err) => {
      console.error("Error generando el Excel con ExcelJS:", err);
    });
  }
  static {
    this.\u0275fac = function ExcelXlsxService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ExcelXlsxService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ExcelXlsxService, factory: _ExcelXlsxService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ExcelXlsxService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ExcelXlsxService
};
//# sourceMappingURL=chunk-NWH2WSGC.js.map
