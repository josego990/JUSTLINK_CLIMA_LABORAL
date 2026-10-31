import {
  require_FileSaver_min
} from "./chunk-KKRFUJ7O.js";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BHZ7HWLX.js";
import {
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/shared/services/action-plan-pdf.service.ts
var import_file_saver = __toESM(require_FileSaver_min());
var ActionPlanPdfService = class _ActionPlanPdfService {
  constructor() {
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.margin = 42;
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.colors = {
      navy: [16, 38, 53],
      navySoft: [25, 55, 73],
      orange: [255, 139, 37],
      orangeSoft: [255, 247, 237],
      green: [22, 163, 74],
      blue: [37, 99, 235],
      red: [220, 38, 38],
      slate: [100, 116, 139],
      text: [17, 24, 39],
      line: [226, 232, 240],
      soft: [248, 250, 252],
      white: [255, 255, 255]
    };
  }
  download(document, fileName) {
    const normalizedFileName = this.normalizeFileName(fileName);
    (0, import_file_saver.saveAs)(this.build(document), normalizedFileName);
  }
  build(document) {
    const pages = [];
    let commands = [];
    let y = 0;
    const cmd = (value) => commands.push(value);
    const rgb = (color) => color.map((value) => (value / 255).toFixed(3)).join(" ");
    const rect = (x, top, width, height, fill, stroke) => {
      const bottom = this.pageHeight - top - height;
      cmd(`${rgb(fill)} rg ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`);
      if (stroke) {
        cmd(`${rgb(stroke)} RG ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S`);
      }
    };
    const line = (x1, top1, x2, top2, color, width = 1) => {
      cmd(`${rgb(color)} RG ${width.toFixed(2)} w ${x1.toFixed(2)} ${(this.pageHeight - top1).toFixed(2)} m ${x2.toFixed(2)} ${(this.pageHeight - top2).toFixed(2)} l S`);
    };
    const text = (value, x, baselineTop, size = 10, bold = false, color = this.colors.text) => {
      cmd(`${rgb(color)} rg BT /${bold ? "F2" : "F1"} ${size.toFixed(2)} Tf ${x.toFixed(2)} ${(this.pageHeight - baselineTop).toFixed(2)} Td (${this.escapeText(value)}) Tj ET`);
    };
    const wrapText = (value, maxWidth, size = 10) => {
      const words = this.clean(value).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
      const lines = [];
      let current = "";
      words.forEach((word) => {
        const candidate = current ? `${current} ${word}` : word;
        if (this.estimateWidth(candidate, size) <= maxWidth || !current) {
          current = candidate;
          return;
        }
        lines.push(current);
        current = word;
      });
      if (current) {
        lines.push(current);
      }
      return lines.length ? lines : ["-"];
    };
    const addPage = (first = false) => {
      commands = [];
      pages.push(commands);
      rect(0, 0, this.pageWidth, this.pageHeight, this.colors.white);
      rect(0, 0, this.pageWidth, first ? 112 : 68, this.colors.navy);
      rect(0, 0, 8, first ? 112 : 68, this.colors.orange);
      text("JustLink-360", this.margin, first ? 31 : 29, first ? 13 : 11, true, this.colors.white);
      const eyebrow = this.clean(document.eyebrow || "Action plans").toUpperCase();
      text(eyebrow, this.margin, first ? 55 : 49, first ? 8 : 7.5, true, this.colors.orange);
      if (first) {
        const titleLines = wrapText(document.title, this.contentWidth - 36, 20);
        titleLines.slice(0, 2).forEach((row, index) => {
          text(row, this.margin, 80 + index * 22, 20, true, this.colors.white);
        });
      } else {
        text(document.title, this.margin, 48, 12, true, this.colors.white);
      }
      const context = [document.organization, document.context].map((item) => this.clean(item)).filter(Boolean).join(" | ");
      if (context) {
        text(context, this.margin, first ? 104 : 62, first ? 8 : 7, false, this.colors.white);
      }
      y = first ? 136 : 92;
    };
    const ensureSpace = (height) => {
      if (y + height > this.pageHeight - 58) {
        addPage(false);
      }
    };
    const sectionTitle = (value) => {
      ensureSpace(34);
      rect(this.margin, y - 12, 4, 22, this.colors.orange);
      text(value, this.margin + 12, y, 13, true, this.colors.navy);
      y += 12;
      line(this.margin, y, this.pageWidth - this.margin, y, this.colors.line);
      y += 18;
    };
    const paragraph = (value, size = 9.2, color = this.colors.slate, indent = 0) => {
      const lines = wrapText(value, this.contentWidth - indent, size);
      lines.forEach((row) => {
        ensureSpace(size + 8);
        text(row, this.margin + indent, y, size, false, color);
        y += size + 4;
      });
    };
    const field = (label, value) => {
      if (!this.hasValue(value)) {
        return;
      }
      ensureSpace(34);
      text(label.toUpperCase(), this.margin, y, 7.4, true, this.colors.orange);
      y += 11;
      paragraph(value, 9.2, this.colors.text);
      y += 4;
    };
    const metaGrid = (items) => {
      const visible = items.filter((item) => this.hasValue(item.value));
      if (!visible.length) {
        return;
      }
      const columns = 3;
      const gap = 8;
      const cardWidth = (this.contentWidth - gap * (columns - 1)) / columns;
      for (let index = 0; index < visible.length; index += columns) {
        const row = visible.slice(index, index + columns);
        const valueLineCounts = row.map((item) => wrapText(item.value ?? "-", cardWidth - 20, 8.6).slice(0, 2).length);
        const height = 41 + Math.max(...valueLineCounts) * 8;
        ensureSpace(height + 8);
        row.forEach((item, itemIndex) => {
          const x = this.margin + itemIndex * (cardWidth + gap);
          rect(x, y - 12, cardWidth, height, this.colors.orangeSoft, this.colors.line);
          text(item.label.toUpperCase(), x + 10, y, 6.8, true, this.colors.slate);
          wrapText(item.value ?? "-", cardWidth - 20, 8.6).slice(0, 2).forEach((rowText, rowIndex) => {
            text(rowText, x + 10, y + 14 + rowIndex * 10, 8.6, true, this.colors.text);
          });
        });
        y += height + 10;
      }
    };
    const statusColor = (value) => {
      const key = this.clean(value).toUpperCase();
      if (key.includes("RIESGO") || key.includes("CRIT") || key.includes("ALTA") || key.includes("PENDING")) {
        return this.colors.red;
      }
      if (key.includes("COMPLET") || key.includes("DONE") || key.includes("BAJA")) {
        return this.colors.green;
      }
      if (key.includes("PROCESO") || key.includes("MEDIA")) {
        return this.colors.orange;
      }
      return this.colors.blue;
    };
    const planHeader = (plan, index) => {
      const titleLines = wrapText(`${index + 1}. ${plan.title}`, this.contentWidth - 122, 12.4).slice(0, 3);
      const subtitleLines = this.hasValue(plan.subtitle) ? wrapText(plan.subtitle, this.contentWidth - 122, 8.3).slice(0, 3) : [];
      const height = 32 + titleLines.length * 14 + subtitleLines.length * 10;
      ensureSpace(height + 12);
      rect(this.margin, y - 14, this.contentWidth, height, this.colors.soft, this.colors.line);
      rect(this.margin, y - 14, 5, height, statusColor(plan.priority || plan.status));
      titleLines.forEach((row, rowIndex) => {
        text(row, this.margin + 15, y + rowIndex * 14, 12.4, true, this.colors.navy);
      });
      subtitleLines.forEach((row, rowIndex) => {
        text(row, this.margin + 15, y + titleLines.length * 14 + rowIndex * 10 + 2, 8.3, false, this.colors.slate);
      });
      if (this.hasValue(plan.progress)) {
        text(String(plan.progress), this.pageWidth - this.margin - 72, y + 3, 15, true, this.colors.blue);
      }
      if (this.hasValue(plan.status)) {
        text(String(plan.status), this.pageWidth - this.margin - 92, y + 22, 7.4, true, statusColor(plan.status));
      }
      y += height + 13;
    };
    const tasks = (items) => {
      if (!items?.length) {
        return;
      }
      sectionTitle("Tareas y evidencias");
      items.forEach((task, taskIndex) => {
        const state = task.done ? "Completada" : "Pendiente";
        ensureSpace(48);
        rect(this.margin, y - 12, this.contentWidth, 38, this.colors.soft, this.colors.line);
        rect(this.margin, y - 12, 4, 38, task.done ? this.colors.green : this.colors.orange);
        text(`${taskIndex + 1}. ${task.title || "Tarea"}`, this.margin + 13, y, 9.4, true, this.colors.text);
        const details = [
          task.responsible ? `Responsable: ${task.responsible}` : "",
          task.dueDate ? `Fecha: ${task.dueDate}` : "",
          `Estado: ${state}`,
          task.evidence ? `Evidencia: ${task.evidence}` : ""
        ].filter(Boolean).join(" | ");
        text(details, this.margin + 13, y + 14, 7.8, false, this.colors.slate);
        y += 48;
      });
    };
    const followUps = (items) => {
      if (!items?.length) {
        return;
      }
      sectionTitle("Bitacora de avances");
      items.forEach((item) => {
        const meta = [
          item.date ? String(item.date) : "",
          item.author ? `Creado por: ${item.author}` : "",
          this.hasValue(item.progress) ? `Avance: ${item.progress}` : ""
        ].filter(Boolean).join(" | ");
        field(meta || "Seguimiento", item.comment);
      });
    };
    addPage(true);
    if (this.hasValue(document.subtitle)) {
      paragraph(document.subtitle, 9.5, this.colors.text);
      y += 8;
    }
    metaGrid([
      ...document.summary ?? [],
      { label: "Generado", value: document.generatedAt || (/* @__PURE__ */ new Date()).toLocaleDateString("es-GT") }
    ]);
    document.plans.forEach((plan, index) => {
      planHeader(plan, index);
      metaGrid([
        { label: "Prioridad", value: plan.priority },
        { label: "Estado", value: plan.status },
        { label: "Avance", value: plan.progress },
        { label: "Responsable", value: plan.owner },
        { label: "Patrocinador", value: plan.sponsor },
        { label: "Fecha limite", value: plan.dueDate },
        { label: "Periodicidad", value: plan.frequency },
        ...plan.meta ?? []
      ]);
      field("Alcance", plan.scope);
      field("Motivo", plan.reason);
      field("Pregunta critica", plan.criticalQuestion);
      field("Objetivo", plan.objective);
      field("Que se hara", plan.action);
      field("Como / recursos necesarios", plan.resources);
      field("KPI / meta", plan.kpi);
      field("Validacion", plan.validation);
      field("Evidencia", plan.evidence);
      tasks(plan.tasks);
      followUps(plan.followUps);
      y += 10;
    });
    pages.forEach((page, index) => {
      commands = page;
      line(this.margin, this.pageHeight - 38, this.pageWidth - this.margin, this.pageHeight - 38, this.colors.line);
      text("Generado desde JustLink-360", this.margin, this.pageHeight - 22, 7.4, false, this.colors.slate);
      text(`Pagina ${index + 1} de ${pages.length}`, this.pageWidth - this.margin - 62, this.pageHeight - 22, 7.4, false, this.colors.slate);
    });
    return this.finalizePdf(pages);
  }
  finalizePdf(pages) {
    const objects = [];
    objects.push("<< /Type /Catalog /Pages 2 0 R >>");
    objects.push(`<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`);
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
    pages.forEach((page, index) => {
      const pageObject = 5 + index * 2;
      const contentObject = pageObject + 1;
      const stream = page.join("\n");
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.pageWidth.toFixed(2)} ${this.pageHeight.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`);
      objects.push(`<< /Length ${this.byteLength(stream)} >>
stream
${stream}
endstream`);
    });
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(this.byteLength(pdf));
      pdf += `${index + 1} 0 obj
${object}
endobj
`;
    });
    const xrefOffset = this.byteLength(pdf);
    pdf += `xref
0 ${objects.length + 1}
`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n 
`;
    });
    pdf += `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;
    return new Blob([this.toBytes(pdf)], { type: "application/pdf" });
  }
  hasValue(value) {
    return this.clean(value).trim().length > 0 && this.clean(value).trim() !== "-";
  }
  estimateWidth(value, size) {
    return this.clean(value).length * size * 0.48;
  }
  clean(value) {
    return String(value ?? "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/≈/g, "~").replace(/•/g, "-").replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "");
  }
  escapeText(value) {
    return this.clean(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }
  byteLength(value) {
    return value.length;
  }
  toBytes(value) {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) {
      bytes[index] = value.charCodeAt(index) & 255;
    }
    return bytes;
  }
  normalizeFileName(value) {
    const fallback = `planes-accion-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`;
    const cleaned = this.clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9._-]+/gi, "_").replace(/^_+|_+$/g, "");
    if (!cleaned) {
      return fallback;
    }
    return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
  }
  static {
    this.\u0275fac = function ActionPlanPdfService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ActionPlanPdfService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ActionPlanPdfService, factory: _ActionPlanPdfService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActionPlanPdfService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  ActionPlanPdfService
};
//# sourceMappingURL=chunk-PRNVHU2H.js.map
