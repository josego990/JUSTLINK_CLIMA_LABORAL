import { DOCUMENT, CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

type DistItem = { Valor: number; Conteo: number; Porcentaje: number };
type SliderPiePoint = { name: string; value: number };

export interface SliderQuestionRow {
  idGranFactor: number;
  etiquetaGranFactor: string;
  idFactor: number;
  factor: string;
  idPregunta: number;
  pregunta: string;
  rangoMin: number;
  rangoMax: number;
  total_respuestas: number;
  promedio: number;
  distribucionJSON: string;
  pieSeries?: SliderPiePoint[];
}

type SliderQuestionCard = SliderQuestionRow & {
  chartId: string;
  distribution: DistItem[];
  pieData: SliderPiePoint[];
  chartOptions: Partial<RangeDonutChartOptions>;
};

type SliderFactorGroup = {
  factor: string;
  questions: SliderQuestionCard[];
};

type RangeDonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-slider-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgApexchartsModule,
  ],
  templateUrl: './slider-table.component.html',
  styleUrls: ['./slider-table.component.scss'],
})
export class SliderTableComponent {
  @Input() fixedRange?: [number, number];
  @Input() accessToExport = false;

  private _rows: SliderQuestionRow[] = [];
  groupedRows: SliderFactorGroup[] = [];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @Input() set rows(v: SliderQuestionRow[]) {
    this._rows = v ?? [];
    this.recompute();
  }
  get rows() {
    return this._rows;
  }

  pct(n: number): number {
    return Math.round((Number(n ?? 0) + Number.EPSILON) * 100) / 100;
  }

  getBarColor(pct: number): string {
    if (pct >= 45) return '#2a9d8f';
    if (pct >= 25) return '#f4a261';
    return '#355070';
  }

  getExportChartId(row: SliderQuestionCard): string {
    return row.chartId;
  }

  exportDistributionCsv(row: SliderQuestionCard): void {
    if (!this.accessToExport) {
      return;
    }

    this.exportCsvFile(
      `rangos-${row.factor}-${row.idPregunta}`,
      ['Valor', 'Respuestas', 'Porcentaje'],
      row.distribution.map((item) => [item.Valor, item.Conteo, this.pct(item.Porcentaje)])
    );
  }

  exportChartSvg(containerId: string, filenameBase: string): void {
    if (!this.accessToExport) {
      return;
    }

    const serialized = this.getSerializedSvg(containerId);
    if (!serialized) {
      return;
    }

    this.downloadBlob(
      new Blob([serialized.markup], { type: 'image/svg+xml;charset=utf-8' }),
      `${this.getExportFileName(filenameBase)}.svg`
    );
  }

  async exportChartPng(containerId: string, filenameBase: string): Promise<void> {
    if (!this.accessToExport) {
      return;
    }

    const serialized = this.getSerializedSvg(containerId);
    if (!serialized) {
      return;
    }

    const svgBlob = new Blob([serialized.markup], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const canvas = this.document.createElement('canvas');
          canvas.width = serialized.width;
          canvas.height = serialized.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('No se pudo crear el contexto del canvas.'));
            return;
          }

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('No se pudo generar la imagen PNG.'));
              return;
            }

            this.downloadBlob(blob, `${this.getExportFileName(filenameBase)}.png`);
            resolve();
          }, 'image/png');
        };
        image.onerror = () => reject(new Error('No se pudo renderizar el SVG para exportación.'));
        image.src = svgUrl;
      });
    } catch (error) {
      console.error('Error al exportar PNG:', error);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  private recompute(): void {
    const groups = new Map<string, SliderQuestionCard[]>();

    for (const row of this.rows) {
      const factor = String(row.factor ?? '').trim() || 'Sin factor';
      const questionCard: SliderQuestionCard = {
        ...row,
        chartId: `slider-pie-chart-${row.idPregunta}`,
        distribution: this.buildDistribution(row),
        pieData: this.buildPieSeries(row),
        chartOptions: {},
      };

      questionCard.chartOptions = this.buildChartOptions(questionCard);

      if (!groups.has(factor)) {
        groups.set(factor, []);
      }
      groups.get(factor)!.push(questionCard);
    }

    this.groupedRows = Array.from(groups.entries()).map(([factor, questions]) => ({
      factor,
      questions,
    }));
  }

  private buildDistribution(row: SliderQuestionRow): DistItem[] {
    const parsed = safeParseJSON<DistItem[]>(row.distribucionJSON) ?? [];
    const distMap = new Map<number, DistItem>();
    parsed.forEach((item) => {
      distMap.set(Number(item.Valor), {
        Valor: Number(item.Valor),
        Conteo: Number(item.Conteo ?? 0),
        Porcentaje: Number(item.Porcentaje ?? 0),
      });
    });

    const [start, end] = this.getRangeBounds(row);
    const distribution: DistItem[] = [];

    for (let value = start; value <= end; value += 1) {
      distribution.push(
        distMap.get(value) ?? {
          Valor: value,
          Conteo: 0,
          Porcentaje: 0,
        }
      );
    }

    return distribution;
  }

  private buildPieSeries(row: SliderQuestionRow): SliderPiePoint[] {
    if (Array.isArray(row.pieSeries) && row.pieSeries.length > 0) {
      return row.pieSeries.map((item) => ({
        name: String(item.name),
        value: Number(item.value ?? 0),
      }));
    }

    return this.buildDistribution(row)
      .filter((item) => item.Conteo > 0 || item.Porcentaje > 0)
      .map((item) => ({
        name: String(item.Valor),
        value: this.pct(item.Porcentaje),
      }));
  }

  private buildChartOptions(row: SliderQuestionCard): Partial<RangeDonutChartOptions> {
    const colors = this.buildRangeColors(row.distribution.length);

    return {
      series: row.pieData.map((item) => item.value),
      labels: row.pieData.map((item) => `Valor ${item.name}`),
      chart: {
        type: 'donut',
        height: 320,
        toolbar: { show: false },
      },
      colors,
      stroke: {
        width: 2,
        colors: ['#ffffff'],
      },
      dataLabels: {
        enabled: true,
        formatter: (value: number) => (value >= 8 ? `${this.pct(value)}%` : ''),
        style: {
          fontSize: '12px',
          fontWeight: '700',
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '12px',
        horizontalAlign: 'center',
        itemMargin: {
          horizontal: 10,
          vertical: 4,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 18,
                color: '#64748b',
              },
              value: {
                show: true,
                offsetY: -14,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                formatter: () => `${row.promedio.toFixed(2)}`,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Promedio',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: '600',
                formatter: () => `${row.promedio.toFixed(2)}`,
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number, opts?: { seriesIndex?: number }) => {
            const index = opts?.seriesIndex ?? 0;
            const item = row.distribution[index];
            const count = item?.Conteo ?? 0;
            return `${this.pct(value)}% (${count} respuestas)`;
          },
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            chart: {
              height: 280,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  private buildRangeColors(count: number): string[] {
    if (count <= 0) {
      return ['#355070'];
    }

    if (count === 1) {
      return ['#355070'];
    }

    const startHue = 14;
    const endHue = 168;
    return Array.from({ length: count }, (_, index) => {
      const ratio = index / Math.max(count - 1, 1);
      const hue = Math.round(startHue + (endHue - startHue) * ratio);
      return `hsl(${hue} 62% 52%)`;
    });
  }

  private getRangeBounds(row: SliderQuestionRow): [number, number] {
    if (this.fixedRange) {
      return this.fixedRange;
    }

    return [Number(row.rangoMin ?? 0), Number(row.rangoMax ?? 0)];
  }

  private getSerializedSvg(containerId: string): { markup: string; width: number; height: number } | null {
    const svg = this.document.getElementById(containerId)?.querySelector('svg');
    if (!svg) {
      return null;
    }

    const clone = svg.cloneNode(true) as SVGSVGElement;
    const bounds = svg.getBoundingClientRect();
    const viewBox = clone.viewBox?.baseVal;
    const attrWidth = parseFloat(clone.getAttribute('width') || '0') || 0;
    const attrHeight = parseFloat(clone.getAttribute('height') || '0') || 0;
    const width = Math.max(Math.round(bounds.width || 0), Math.round(viewBox?.width || 0), attrWidth, 1);
    const height = Math.max(Math.round(bounds.height || 0), Math.round(viewBox?.height || 0), attrHeight, 1);

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    clone.setAttribute('width', `${width}`);
    clone.setAttribute('height', `${height}`);
    if (!clone.getAttribute('viewBox')) {
      clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    return {
      markup: new XMLSerializer().serializeToString(clone),
      width,
      height,
    };
  }

  private exportCsvFile(
    filenameBase: string,
    headers: string[],
    rows: Array<Array<string | number | null | undefined>>
  ): void {
    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => this.csvEscape(value)).join(','))
      .join('\r\n');

    this.downloadBlob(
      new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }),
      `${this.getExportFileName(filenameBase)}.csv`
    );
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private getExportFileName(chartName: string): string {
    return this.sanitizeFileName(chartName || 'grafica');
  }

  private sanitizeFileName(value: string): string {
    const normalized = (value || 'grafica')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return normalized || 'grafica';
  }

  private csvEscape(value: string | number | null | undefined): string {
    const text = value == null ? '' : String(value);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }
}

function safeParseJSON<T>(value: unknown): T | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
