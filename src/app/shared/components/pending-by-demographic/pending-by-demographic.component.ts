import { Component, Input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import {
  NgApexchartsModule,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexDataLabels,
  ApexGrid,
  ApexTooltip,
  ApexTitleSubtitle
} from 'ng-apexcharts';

export interface PendingRow {
  idCampoDemografico: number;
  campo: string;
  valor: string;
  total_en_campo: number;
  pendientes: number;
  contestadas: number;
  pct_pendientes: number;   // 0..100
  pct_contestadas: number;  // 0..100
}

type StackedOpts = {
  series: { name: string; data: number[] }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-pending-by-demographic',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSelectModule, MatFormFieldModule, MatOptionModule, NgApexchartsModule],
  templateUrl: './pending-by-demographic.component.html',
  styleUrls: ['./pending-by-demographic.component.scss']
})
export class PendingByDemographicComponent {
  private _rows = signal<PendingRow[]>([]);
  @Input() set rows(v: PendingRow[]) {
    this._rows.set(v ?? []);
    this.ensureSelectedCampo();
  }
  get rows() { return this._rows(); }

  selectedCampo = signal<string | null>(null);

  // ✅ Lista única de campos conservando el ORDEN que llega del SP
  campos = computed(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const r of this.rows) {
      if (!seen.has(r.campo)) {
        seen.add(r.campo);
        out.push(r.campo);
      }
    }
    return out;
  });

  // ✅ Agrupa por campo sin reordenar; respeta el orden del SP
  byCampo = computed(() => {
    const m = new Map<string, PendingRow[]>();
    for (const r of this.rows) {
      if (!m.has(r.campo)) m.set(r.campo, []);
      m.get(r.campo)!.push(r); // sin .sort()
    }
    return m;
  });

  stackedOptions = signal<Partial<StackedOpts>>({});

  constructor() {
    effect(() => {
      const campo = this.selectedCampo();
      const groups = this.byCampo();

      if (!campo || !groups.has(campo)) {
        this.stackedOptions.set({});
        return;
      }

      const list = groups.get(campo)!;
      const categories = list.map(x => x.valor);
      const totales   = list.map(x => Number(x.total_en_campo));
      const pendCnt   = list.map(x => Number(x.pendientes));
      const contCnt   = list.map(x => Number(x.contestadas));

      this.stackedOptions.set({
        chart: {
          type: 'bar',
          stacked: true,
          stackType: '100%',
          height: Math.max(320, 50 + categories.length * 36),
          toolbar: this.buildToolbar(`pendientes-demograficos-${campo}`)
        },
        plotOptions: { bar: { horizontal: true, barHeight: '70%' } },

        // Las categorías van en xaxis (aunque sea horizontal)
        xaxis: {
          categories,
          max: 100,
          tickAmount: 5,
          labels: { formatter: (val) => `${round2n(val)}%` }
        },

        // yaxis numérico (0..100); sin categories
        yaxis: {
          labels: {
            maxWidth: 240,
            formatter: (val: number): string => {
              const s = String(val as any);
              return s.length > 32 ? s.slice(0, 32) + '…' : s;
            },
            style: { fontSize: '12px' }
          }
        },

        legend: { position: 'bottom' },
        stroke: { width: 1 },
        grid: { strokeDashArray: 3 },
        title: { text: `Pendientes por valor — ${campo}` },

        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (val, opts) => {
              const si = opts.seriesIndex;
              const di = opts.dataPointIndex;
              const pct = round2n(val);
              if (si === 0) return `${pct}%  (${pendCnt[di]}/${totales[di]}) pendientes`;
              return `${pct}%  (${contCnt[di]}/${totales[di]}) contestadas`;
            }
          }
        },

        dataLabels: {
          enabled: true,
          style: { fontSize: '11px' },
          formatter: (val, opts) => {
            const si = opts.seriesIndex;
            const di = opts.dataPointIndex;
            const pct = round2n(val);
            return si === 0
              ? `Pend ${pct}% (${pendCnt[di]}/${totales[di]})`
              : `Cont ${pct}% (${contCnt[di]}/${totales[di]})`;
          }
        },

        series: [
          { name: 'Pendientes %',  data: list.map(x => round2n(x.pct_pendientes)) },
          { name: 'Contestadas %', data: list.map(x => round2n(x.pct_contestadas)) },
        ]
      });
    });
  }

  private buildToolbar(baseName: string) {
    const filename = this.sanitizeFileName(baseName);
    return {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
      export: {
        svg: { filename },
        png: { filename },
        csv: {
          filename,
          columnDelimiter: ',',
          headerCategory: 'Categoria',
          headerValue: 'Valor',
        },
      },
    };
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

  ensureSelectedCampo() {
    const cs = this.campos();
    if (!this.selectedCampo() && cs.length) this.selectedCampo.set(cs[0]);
    if (cs.length === 0) this.selectedCampo.set(null);
  }
}

/* Helpers */
function toNumber(x: string | number | number[] | null | undefined): number {
  if (Array.isArray(x)) return Number(x[0]);
  const n = Number(x ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function round2n(x: string | number | number[] | null | undefined): number {
  const v = toNumber(x);
  return Math.round((v + Number.EPSILON) * 100) / 100;
}
