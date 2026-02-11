import { Component, Input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexFill,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexStroke,
  ApexGrid
} from 'ng-apexcharts';

export interface DemographicParticipationRow {
  idCampoDemografico: number;
  campo: string;
  valor: string;
  total_empleados: number;
  porcentaje: number;   // 0..100 dentro del campo
}

export type ChartOptionsDonut = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  tooltip: ApexTooltip;
};

export type ChartOptionsStacked = {
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

function toNumber(x: string | number | number[] | null | undefined): number {
  if (Array.isArray(x)) return Number(x[0]);
  const n = Number(x ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function round2n(x: string | number | number[] | null | undefined): number {
  const v = toNumber(x);
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

@Component({
  selector: 'app-demographic-participation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatSelectModule, MatFormFieldModule, MatOptionModule, MatDividerModule,
    NgApexchartsModule
  ],
  templateUrl: './demographic-participation.component.html',
  styleUrls: ['./demographic-participation.component.scss']
})
export class DemographicParticipationComponent {
  private _rows = signal<DemographicParticipationRow[]>([]);
  @Input() set rows(v: DemographicParticipationRow[]) {
    this._rows.set(v ?? []);
    this.initSelectedCampo();
  }
  get rows() { return this._rows(); }

  selectedCampo = signal<string | null>(null);

  // ✅ Campos en el mismo orden que llegan del SP (uno por primera aparición)
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

  // ✅ Agrupa por campo sin reordenar los valores
  byCampo = computed(() => {
    const map = new Map<string, DemographicParticipationRow[]>();
    for (const r of this.rows) {
      if (!map.has(r.campo)) map.set(r.campo, []);
      map.get(r.campo)!.push(r); // sin sort
    }
    return map;
  });

  donutOptions = signal<Partial<ChartOptionsDonut>>({});
  stackedOptions = signal<Partial<ChartOptionsStacked>>({});

  constructor() {
    effect(() => {
      const campo = this.selectedCampo();
      const rows = this._rows();
      const groups = this.byCampo();

      // Donut (del campo seleccionado) — respeta el orden del SP
      if (campo && groups.has(campo)) {
        const list = groups.get(campo)!;
        this.donutOptions.set({
          chart: { type: 'donut', height: 360 },
          labels: list.map(x => x.valor),
          series: list.map(x => round2n(x.porcentaje)) as ApexNonAxisChartSeries,
          title: { text: `Participación: ${campo}` },
          legend: {
            position: 'bottom',
            formatter: (s, opts) =>
              `${s} — ${round2n(opts?.w?.globals?.series?.[opts.seriesIndex])}%`
          },
          dataLabels: { enabled: true, formatter: (val) => `${round2n(val)}%` },
          tooltip: { y: { formatter: (val) => `${round2n(val)}%` } },
          responsive: [{ breakpoint: 768, options: { chart: { height: 320 }, legend: { position: 'bottom' } } }]
        });
      } else {
        this.donutOptions.set({});
      }

      // Stacked 100% (todas los campos) — respeta orden de campos y de valores por primera aparición
      if (rows.length) {
        const campos = this.campos();

        // valores en el orden en que aparecen por primera vez en 'rows'
        const seenVals = new Set<string>();
        const allValues: string[] = [];
        for (const r of rows) {
          if (!seenVals.has(r.valor)) {
            seenVals.add(r.valor);
            allValues.push(r.valor);
          }
        }

        const series = allValues.map(v => ({
          name: v,
          data: campos.map(c => {
            const item = groups.get(c)?.find(x => x.valor === v);
            return round2n(item?.porcentaje ?? 0);
          })
        }));

        this.stackedOptions.set({
          chart: { type: 'bar', stacked: true, stackType: '100%', height: 420, toolbar: { show: false } },
          plotOptions: { bar: { horizontal: true, barHeight: '80%' } },
          xaxis: { categories: campos, labels: { formatter: (val) => `${val}` } },
          yaxis: { max: 100, tickAmount: 5, labels: { formatter: (val) => `${val}%` } },
          dataLabels: { enabled: false },
          stroke: { width: 1 },
          legend: { position: 'bottom', horizontalAlign: 'center', floating: false },
          grid: { strokeDashArray: 3 },
          tooltip: { y: { formatter: (val) => `${round2n(val)}%` } },
          title: { text: 'Participación por campo demográfico (100% stacked)' },
          series
        });
      } else {
        this.stackedOptions.set({});
      }
    });
  }

  private initSelectedCampo() {
    const cs = this.campos();
    if (!this.selectedCampo() && cs.length) this.selectedCampo.set(cs[0]);
    if (cs.length === 0) this.selectedCampo.set(null);
  }
}
