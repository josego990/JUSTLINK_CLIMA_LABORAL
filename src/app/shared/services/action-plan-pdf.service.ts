import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

type PdfColor = [number, number, number];

export interface ActionPlanPdfMetaItem {
  label: string;
  value: string | number | null | undefined;
}

export interface ActionPlanPdfTask {
  title: string;
  responsible?: string | null;
  dueDate?: string | null;
  evidence?: string | null;
  done?: boolean;
}

export interface ActionPlanPdfFollowUp {
  date?: string | null;
  author?: string | null;
  comment: string;
  progress?: string | number | null;
}

export interface ActionPlanPdfPlan {
  title: string;
  subtitle?: string | null;
  priority?: string | null;
  status?: string | null;
  progress?: string | number | null;
  owner?: string | null;
  sponsor?: string | null;
  dueDate?: string | null;
  frequency?: string | null;
  scope?: string | null;
  reason?: string | null;
  criticalQuestion?: string | null;
  objective?: string | null;
  action?: string | null;
  resources?: string | null;
  kpi?: string | null;
  validation?: string | null;
  evidence?: string | null;
  meta?: ActionPlanPdfMetaItem[];
  tasks?: ActionPlanPdfTask[];
  followUps?: ActionPlanPdfFollowUp[];
}

export interface ActionPlanPdfDocument {
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  organization?: string | null;
  context?: string | null;
  generatedAt?: string | null;
  summary?: ActionPlanPdfMetaItem[];
  plans: ActionPlanPdfPlan[];
}

@Injectable({
  providedIn: 'root',
})
export class ActionPlanPdfService {
  private readonly pageWidth = 595.28;
  private readonly pageHeight = 841.89;
  private readonly margin = 42;
  private readonly contentWidth = this.pageWidth - this.margin * 2;

  private readonly colors = {
    navy: [16, 38, 53] as PdfColor,
    navySoft: [25, 55, 73] as PdfColor,
    orange: [255, 139, 37] as PdfColor,
    orangeSoft: [255, 247, 237] as PdfColor,
    green: [22, 163, 74] as PdfColor,
    blue: [37, 99, 235] as PdfColor,
    red: [220, 38, 38] as PdfColor,
    slate: [100, 116, 139] as PdfColor,
    text: [17, 24, 39] as PdfColor,
    line: [226, 232, 240] as PdfColor,
    soft: [248, 250, 252] as PdfColor,
    white: [255, 255, 255] as PdfColor,
  };

  download(document: ActionPlanPdfDocument, fileName: string): void {
    const normalizedFileName = this.normalizeFileName(fileName);
    saveAs(this.build(document), normalizedFileName);
  }

  build(document: ActionPlanPdfDocument): Blob {
    const pages: string[][] = [];
    let commands: string[] = [];
    let y = 0;

    const cmd = (value: string) => commands.push(value);
    const rgb = (color: PdfColor) => color.map((value) => (value / 255).toFixed(3)).join(' ');
    const rect = (x: number, top: number, width: number, height: number, fill: PdfColor, stroke?: PdfColor) => {
      const bottom = this.pageHeight - top - height;
      cmd(`${rgb(fill)} rg ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`);
      if (stroke) {
        cmd(`${rgb(stroke)} RG ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S`);
      }
    };
    const line = (x1: number, top1: number, x2: number, top2: number, color: PdfColor, width = 1) => {
      cmd(`${rgb(color)} RG ${width.toFixed(2)} w ${x1.toFixed(2)} ${(this.pageHeight - top1).toFixed(2)} m ${x2.toFixed(2)} ${(this.pageHeight - top2).toFixed(2)} l S`);
    };
    const text = (
      value: string | number | null | undefined,
      x: number,
      baselineTop: number,
      size = 10,
      bold = false,
      color = this.colors.text,
    ) => {
      cmd(`${rgb(color)} rg BT /${bold ? 'F2' : 'F1'} ${size.toFixed(2)} Tf ${x.toFixed(2)} ${(this.pageHeight - baselineTop).toFixed(2)} Td (${this.escapeText(value)}) Tj ET`);
    };
    const wrapText = (value: string | number | null | undefined, maxWidth: number, size = 10): string[] => {
      const words = this.clean(value).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      const lines: string[] = [];
      let current = '';

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

      return lines.length ? lines : ['-'];
    };
    const addPage = (first = false) => {
      commands = [];
      pages.push(commands);
      rect(0, 0, this.pageWidth, this.pageHeight, this.colors.white);
      rect(0, 0, this.pageWidth, first ? 112 : 68, this.colors.navy);
      rect(0, 0, 8, first ? 112 : 68, this.colors.orange);
      text('JustLink-360', this.margin, first ? 31 : 29, first ? 13 : 11, true, this.colors.white);

      const eyebrow = this.clean(document.eyebrow || 'Action plans').toUpperCase();
      text(eyebrow, this.margin, first ? 55 : 49, first ? 8 : 7.5, true, this.colors.orange);

      if (first) {
        const titleLines = wrapText(document.title, this.contentWidth - 36, 20);
        titleLines.slice(0, 2).forEach((row, index) => {
          text(row, this.margin, 80 + index * 22, 20, true, this.colors.white);
        });
      } else {
        text(document.title, this.margin, 48, 12, true, this.colors.white);
      }

      const context = [document.organization, document.context].map((item) => this.clean(item)).filter(Boolean).join(' | ');
      if (context) {
        text(context, this.margin, first ? 104 : 62, first ? 8 : 7, false, this.colors.white);
      }

      y = first ? 136 : 92;
    };
    const ensureSpace = (height: number) => {
      if (y + height > this.pageHeight - 58) {
        addPage(false);
      }
    };
    const sectionTitle = (value: string) => {
      ensureSpace(34);
      rect(this.margin, y - 12, 4, 22, this.colors.orange);
      text(value, this.margin + 12, y, 13, true, this.colors.navy);
      y += 12;
      line(this.margin, y, this.pageWidth - this.margin, y, this.colors.line);
      y += 18;
    };
    const paragraph = (
      value: string | number | null | undefined,
      size = 9.2,
      color: PdfColor = this.colors.slate,
      indent = 0,
    ) => {
      const lines = wrapText(value, this.contentWidth - indent, size);
      lines.forEach((row) => {
        ensureSpace(size + 8);
        text(row, this.margin + indent, y, size, false, color);
        y += size + 4;
      });
    };
    const field = (label: string, value: string | number | null | undefined) => {
      if (!this.hasValue(value)) {
        return;
      }

      ensureSpace(34);
      text(label.toUpperCase(), this.margin, y, 7.4, true, this.colors.orange);
      y += 11;
      paragraph(value, 9.2, this.colors.text);
      y += 4;
    };
    const metaGrid = (items: ActionPlanPdfMetaItem[]) => {
      const visible = items.filter((item) => this.hasValue(item.value));
      if (!visible.length) {
        return;
      }

      const columns = 3;
      const gap = 8;
      const cardWidth = (this.contentWidth - gap * (columns - 1)) / columns;

      for (let index = 0; index < visible.length; index += columns) {
        const row = visible.slice(index, index + columns);
        const valueLineCounts = row.map((item) => wrapText(item.value ?? '-', cardWidth - 20, 8.6).slice(0, 2).length);
        const height = 41 + Math.max(...valueLineCounts) * 8;
        ensureSpace(height + 8);

        row.forEach((item, itemIndex) => {
          const x = this.margin + itemIndex * (cardWidth + gap);
          rect(x, y - 12, cardWidth, height, this.colors.orangeSoft, this.colors.line);
          text(item.label.toUpperCase(), x + 10, y, 6.8, true, this.colors.slate);
          wrapText(item.value ?? '-', cardWidth - 20, 8.6).slice(0, 2).forEach((rowText, rowIndex) => {
            text(rowText, x + 10, y + 14 + rowIndex * 10, 8.6, true, this.colors.text);
          });
        });

        y += height + 10;
      }
    };
    const statusColor = (value: string | number | null | undefined): PdfColor => {
      const key = this.clean(value).toUpperCase();
      if (key.includes('RIESGO') || key.includes('CRIT') || key.includes('ALTA') || key.includes('PENDING')) {
        return this.colors.red;
      }
      if (key.includes('COMPLET') || key.includes('DONE') || key.includes('BAJA')) {
        return this.colors.green;
      }
      if (key.includes('PROCESO') || key.includes('MEDIA')) {
        return this.colors.orange;
      }
      return this.colors.blue;
    };
    const planHeader = (plan: ActionPlanPdfPlan, index: number) => {
      const titleLines = wrapText(`${index + 1}. ${plan.title}`, this.contentWidth - 122, 12.4).slice(0, 3);
      const subtitleLines = this.hasValue(plan.subtitle)
        ? wrapText(plan.subtitle, this.contentWidth - 122, 8.3).slice(0, 3)
        : [];
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
    const tasks = (items: ActionPlanPdfTask[] | undefined) => {
      if (!items?.length) {
        return;
      }

      sectionTitle('Tareas y evidencias');
      items.forEach((task, taskIndex) => {
        const state = task.done ? 'Completada' : 'Pendiente';
        ensureSpace(48);
        rect(this.margin, y - 12, this.contentWidth, 38, this.colors.soft, this.colors.line);
        rect(this.margin, y - 12, 4, 38, task.done ? this.colors.green : this.colors.orange);
        text(`${taskIndex + 1}. ${task.title || 'Tarea'}`, this.margin + 13, y, 9.4, true, this.colors.text);
        const details = [
          task.responsible ? `Responsable: ${task.responsible}` : '',
          task.dueDate ? `Fecha: ${task.dueDate}` : '',
          `Estado: ${state}`,
          task.evidence ? `Evidencia: ${task.evidence}` : '',
        ].filter(Boolean).join(' | ');
        text(details, this.margin + 13, y + 14, 7.8, false, this.colors.slate);
        y += 48;
      });
    };
    const followUps = (items: ActionPlanPdfFollowUp[] | undefined) => {
      if (!items?.length) {
        return;
      }

      sectionTitle('Bitacora de avances');
      items.forEach((item) => {
        const meta = [
          item.date ? String(item.date) : '',
          item.author ? `Creado por: ${item.author}` : '',
          this.hasValue(item.progress) ? `Avance: ${item.progress}` : '',
        ].filter(Boolean).join(' | ');
        field(meta || 'Seguimiento', item.comment);
      });
    };

    addPage(true);

    if (this.hasValue(document.subtitle)) {
      paragraph(document.subtitle, 9.5, this.colors.text);
      y += 8;
    }

    metaGrid([
      ...(document.summary ?? []),
      { label: 'Generado', value: document.generatedAt || new Date().toLocaleDateString('es-GT') },
    ]);

    document.plans.forEach((plan, index) => {
      planHeader(plan, index);
      metaGrid([
        { label: 'Prioridad', value: plan.priority },
        { label: 'Estado', value: plan.status },
        { label: 'Avance', value: plan.progress },
        { label: 'Responsable', value: plan.owner },
        { label: 'Patrocinador', value: plan.sponsor },
        { label: 'Fecha limite', value: plan.dueDate },
        { label: 'Periodicidad', value: plan.frequency },
        ...(plan.meta ?? []),
      ]);
      field('Alcance', plan.scope);
      field('Motivo', plan.reason);
      field('Pregunta critica', plan.criticalQuestion);
      field('Objetivo', plan.objective);
      field('Que se hara', plan.action);
      field('Como / recursos necesarios', plan.resources);
      field('KPI / meta', plan.kpi);
      field('Validacion', plan.validation);
      field('Evidencia', plan.evidence);
      tasks(plan.tasks);
      followUps(plan.followUps);
      y += 10;
    });

    pages.forEach((page, index) => {
      commands = page;
      line(this.margin, this.pageHeight - 38, this.pageWidth - this.margin, this.pageHeight - 38, this.colors.line);
      text('Generado desde JustLink-360', this.margin, this.pageHeight - 22, 7.4, false, this.colors.slate);
      text(`Pagina ${index + 1} de ${pages.length}`, this.pageWidth - this.margin - 62, this.pageHeight - 22, 7.4, false, this.colors.slate);
    });

    return this.finalizePdf(pages);
  }

  private finalizePdf(pages: string[][]): Blob {
    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push(`<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`);
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

    pages.forEach((page, index) => {
      const pageObject = 5 + index * 2;
      const contentObject = pageObject + 1;
      const stream = page.join('\n');
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.pageWidth.toFixed(2)} ${this.pageHeight.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`);
      objects.push(`<< /Length ${this.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    });

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(this.byteLength(pdf));
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = this.byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([this.toBytes(pdf)], { type: 'application/pdf' });
  }

  private hasValue(value: string | number | null | undefined): boolean {
    return this.clean(value).trim().length > 0 && this.clean(value).trim() !== '-';
  }

  private estimateWidth(value: string, size: number): number {
    return this.clean(value).length * size * 0.48;
  }

  private clean(value: string | number | null | undefined): string {
    return String(value ?? '')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/≈/g, '~')
      .replace(/•/g, '-')
      .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '');
  }

  private escapeText(value: string | number | null | undefined): string {
    return this.clean(value)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  private byteLength(value: string): number {
    return value.length;
  }

  private toBytes(value: string): Uint8Array {
    const bytes = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) {
      bytes[index] = value.charCodeAt(index) & 0xff;
    }
    return bytes;
  }

  private normalizeFileName(value: string): string {
    const fallback = `planes-accion-${new Date().toISOString().slice(0, 10)}.pdf`;
    const cleaned = this.clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9._-]+/gi, '_')
      .replace(/^_+|_+$/g, '');

    if (!cleaned) {
      return fallback;
    }

    return cleaned.toLowerCase().endsWith('.pdf') ? cleaned : `${cleaned}.pdf`;
  }
}
