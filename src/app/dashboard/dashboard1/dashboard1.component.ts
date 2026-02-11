import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InfoBoxFactorComponent } from '@shared/components/info-box-factor/info-box-factor.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { ProgressTableFactorComponent, SubjectProgress } from '@shared/components/progress-table-factor/progress-table-factor.component';
import { SliderTableComponent } from '@shared/components/slider-table/slider-table.component';

import { DemographicParticipationComponent } from '@shared/components/demographic-participation/demographic-participation.component';

import { PendingByDemographicComponent } from '@shared/components/pending-by-demographic/pending-by-demographic.component';

import { MatDividerModule } from '@angular/material/divider';
import { NgxGaugeModule } from 'ngx-gauge';
import { Color, ScaleType, BarChartModule, LineChartModule, AreaChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartData, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { ExcelXlsxService } from './excel-xlsx.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';

import { AuthService } from '@core';


import { MatChipsModule } from '@angular/material/chips';

import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog } from '@angular/material/dialog';
import { DemographicFiltersDialogComponent } from './dialogs/demographic-filters-dialog.component'


type Sent = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
type Filtro = { idCampo: number; nombreCampo?: string; valores: string[] };

type DemographicSelection = { idCampo: number; nombreCampo: string; valores: string[] };
type FilterChip = { idCampo: number; nombreCampo: string; valor: string };

type Campo = {
  idCampo: number;
  nombreCampo: string;
  valores: string[];
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};

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
  // del SP: cadena JSON con [{Valor, Conteo, Porcentaje}]
  distribucionJSON: string;
}

interface ComentarioAbierto {
  IdRespuesta: number;
  Comentario: string;
  Sentiment: Sent;
  Positive?: number;
  Negative?: number;
  Neutral?: number;
  Mixxed?: number;
  FechaRespuesta?: string;
}

interface ComentarioPregunta {
  IdFactor: number;
  Factor: string;
  IdPregunta: number;
  Pregunta: string;
  ComentariosJSON: ComentarioAbierto[];
  // calculados:
  _total?: number;
  _overall?: Sent;
  _counts?: Record<Sent, number>;
}

interface Todo {
  title: string;
  done: boolean;
  priority: 'Low' | 'Normal' | 'High';
}

interface ItemOriginal {
  Factor: string;
  EtiquetaGranFactor: string;
  Pregunta: string;
  IdPregunta?: number;
  total_respuestas: number;
  total_opt1: number; // Muy de acuerdo
  total_opt2: number; // De acuerdo
  total_opt3: number; // En desacuerdo
  total_opt4: number; // Muy en desacuerdo
  // (opcionales si vinieran del SP)
  pct_favorable?: number;
  pct_desfavorable?: number;
  nsat?: number;
  mean_0_100?: number;
  mean_1_4?: number;
}

export interface ItemTransformado {
  Pregunta: string;
  pct_opt1: number;
  pct_opt2: number;
  pct_opt3: number;
  pct_opt4: number;
  // NUEVO esquema:
  pctFav: number;   // %Favorable (Top-2)
  pctDesf: number;  // %Desfavorable (Bottom-2)
  nsat?: number;    // opcional
  mean?: number;    // Índice 0–100 (opcional)
}

export interface ResumenFactor {
  pct_opt1: number;
  pct_opt2: number;
  pct_opt3: number;
  pct_opt4: number;
  // NUEVO esquema:
  pctFav: number;
  pctDesf: number;
  nsat?: number;
  mean?: number;
}

interface FactorGroup {
  preguntas: ItemTransformado[];
  resumen: ResumenFactor;
}

export type Resultado = {
  [factor: string]: {
    preguntas: ItemTransformado[];
    resumen: ResumenFactor;
  };
};

/*
export function transformData(data: ItemOriginal[]): Resultado {
  const out: Resultado = {};

  // acumuladores internos por factor (no se devuelven)
  const acc: Record<string, { t: number; o1: number; o2: number; o3: number; o4: number }> = {};

  // helpers
  const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
  const safePct = (num: number, den: number) => (den > 0 ? round2((num / den) * 100) : 0);
  const mean0to100 = (o1: number, o2: number, o3: number, o4: number, t: number) => {
    if (t <= 0) return 0;
    const sum03 = (3 * o1) + (2 * o2) + (1 * o3) + (0 * o4);
    return round2((sum03 / (3 * t)) * 100);
  };

  // 1) Recorremos cada ítem (pregunta)
  data.forEach(item => {
    const {
      Factor,
      Pregunta,
      total_respuestas: total,
      total_opt1, total_opt2, total_opt3, total_opt4
    } = item;

    // % por opción
    const pct_opt1 = safePct(total_opt1, total);
    const pct_opt2 = safePct(total_opt2, total);
    const pct_opt3 = safePct(total_opt3, total);
    const pct_opt4 = safePct(total_opt4, total);

    // % Favorable / % Desfavorable
    const pctFav  = item.pct_favorable    ?? safePct(total_opt1 + total_opt2, total);
    const pctDesf = item.pct_desfavorable ?? safePct(total_opt3 + total_opt4, total);

    const nsat = item.nsat != null ? round2(item.nsat) : round2(pctFav - pctDesf);
    const mean = item.mean_0_100 != null ? round2(item.mean_0_100)
                                         : mean0to100(total_opt1, total_opt2, total_opt3, total_opt4, total);

    const nuevo: ItemTransformado = {
      Pregunta,
      pct_opt1, pct_opt2, pct_opt3, pct_opt4,
      pctFav, pctDesf,
      nsat, mean
    };

    // Inicializa grupo si no existe
    if (!out[Factor]) {
      out[Factor] = {
        preguntas: [],
        resumen: { pct_opt1: 0, pct_opt2: 0, pct_opt3: 0, pct_opt4: 0, pctFav: 0, pctDesf: 0, nsat: 0, mean: 0 }
      };
      acc[Factor] = { t: 0, o1: 0, o2: 0, o3: 0, o4: 0 };
    }

    out[Factor].preguntas.push(nuevo);

    // acumula conteos para el resumen del factor
    acc[Factor].t  += total;
    acc[Factor].o1 += total_opt1;
    acc[Factor].o2 += total_opt2;
    acc[Factor].o3 += total_opt3;
    acc[Factor].o4 += total_opt4;
  });

  // 2) Calcula resumen por factor desde los acumulados
  Object.keys(out).forEach(factor => {
    const a = acc[factor];
    const t = a.t;
    const pct_opt1 = safePct(a.o1, t);
    const pct_opt2 = safePct(a.o2, t);
    const pct_opt3 = safePct(a.o3, t);
    const pct_opt4 = safePct(a.o4, t);
    const pctFav   = safePct(a.o1 + a.o2, t);
    const pctDesf  = safePct(a.o3 + a.o4, t);
    const nsat     = round2(pctFav - pctDesf);
    const mean     = mean0to100(a.o1, a.o2, a.o3, a.o4, t);

    out[factor].resumen = { pct_opt1, pct_opt2, pct_opt3, pct_opt4, pctFav, pctDesf, nsat, mean };
  });

  return out;
}
*/

export function transformData(data: ItemOriginal[]): Resultado {
  const out: Resultado = {} as Resultado;

  // acumuladores internos por factor (no se devuelven)
  const acc: Record<string, { t: number; o1: number; o2: number; o3: number; o4: number }> = {};

  // NUEVO: acumuladores por Gran Factor (EtiquetaGranFactor)
  const accGran: Record<string, { t: number; o1: number; o2: number; o3: number; o4: number }> = {};

  // NUEVO: relación Factor -> Gran Factor
  const factorToGran: Record<string, string> = {};

  // helpers
  const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
  const safePct = (num: number, den: number) => (den > 0 ? round2((num / den) * 100) : 0);
  const mean0to100 = (o1: number, o2: number, o3: number, o4: number, t: number) => {
    if (t <= 0) return 0;
    const sum03 = (3 * o1) + (2 * o2) + (1 * o3) + (0 * o4);
    return round2((sum03 / (3 * t)) * 100);
  };

  // 1) Recorremos cada ítem (pregunta)
  data.forEach(item => {
    const {
      Factor,
      EtiquetaGranFactor,      // <- NUEVO
      Pregunta,
      total_respuestas: total,
      total_opt1, total_opt2, total_opt3, total_opt4
    } = item;

    const granFactor = EtiquetaGranFactor ?? 'SIN_ETIQUETA';

    // Guardamos la relación Factor -> Gran Factor
    factorToGran[Factor] = granFactor;

    // % por opción
    const pct_opt1 = safePct(total_opt1, total);
    const pct_opt2 = safePct(total_opt2, total);
    const pct_opt3 = safePct(total_opt3, total);
    const pct_opt4 = safePct(total_opt4, total);

    // % Favorable / % Desfavorable
    const pctFav  = item.pct_favorable    ?? safePct(total_opt1 + total_opt2, total);
    const pctDesf = item.pct_desfavorable ?? safePct(total_opt3 + total_opt4, total);

    const nsat = item.nsat != null ? round2(item.nsat) : round2(pctFav - pctDesf);
    const mean = item.mean_0_100 != null ? round2(item.mean_0_100)
                                         : mean0to100(total_opt1, total_opt2, total_opt3, total_opt4, total);

    const nuevo: ItemTransformado = {
      Pregunta,
      pct_opt1, pct_opt2, pct_opt3, pct_opt4,
      pctFav, pctDesf,
      nsat, mean
    };

    // Inicializa grupo por Factor si no existe (igual que antes)
    if (!out[Factor]) {
      out[Factor] = {
        preguntas: [],
        resumen: {
          pct_opt1: 0, pct_opt2: 0, pct_opt3: 0, pct_opt4: 0,
          pctFav: 0, pctDesf: 0, nsat: 0, mean: 0
        }
      };
      acc[Factor] = { t: 0, o1: 0, o2: 0, o3: 0, o4: 0 };
    }

    out[Factor].preguntas.push(nuevo);

    // acumula conteos para el resumen del factor
    acc[Factor].t  += total;
    acc[Factor].o1 += total_opt1;
    acc[Factor].o2 += total_opt2;
    acc[Factor].o3 += total_opt3;
    acc[Factor].o4 += total_opt4;

    // NUEVO: acumula conteos para el resumen del Gran Factor
    if (!accGran[granFactor]) {
      accGran[granFactor] = { t: 0, o1: 0, o2: 0, o3: 0, o4: 0 };
    }
    accGran[granFactor].t  += total;
    accGran[granFactor].o1 += total_opt1;
    accGran[granFactor].o2 += total_opt2;
    accGran[granFactor].o3 += total_opt3;
    accGran[granFactor].o4 += total_opt4;
  });

  // 2) Calcula resumen por factor desde los acumulados (igual que antes)
  Object.keys(out).forEach(factor => {
    const a = acc[factor];
    const t = a.t;
    const pct_opt1 = safePct(a.o1, t);
    const pct_opt2 = safePct(a.o2, t);
    const pct_opt3 = safePct(a.o3, t);
    const pct_opt4 = safePct(a.o4, t);
    const pctFav   = safePct(a.o1 + a.o2, t);
    const pctDesf  = safePct(a.o3 + a.o4, t);
    const nsat     = round2(pctFav - pctDesf);
    const mean     = mean0to100(a.o1, a.o2, a.o3, a.o4, t);

    out[factor].resumen = { pct_opt1, pct_opt2, pct_opt3, pct_opt4, pctFav, pctDesf, nsat, mean };
  });

  // 3) NUEVO: Calcula resumen por Gran Factor y agrupa factores dentro de cada uno
  const granFactores: Record<string, {
    resumen: {
      pct_opt1: number;
      pct_opt2: number;
      pct_opt3: number;
      pct_opt4: number;
      pctFav: number;
      pctDesf: number;
      nsat: number;
      mean: number;
    };
    factores: Record<string, Resultado[keyof Resultado]>; // mismo shape que cada factor
  }> = {};

  // Resumen por Gran Factor
  Object.keys(accGran).forEach(gf => {
    const a = accGran[gf];
    const t = a.t;
    const pct_opt1 = safePct(a.o1, t);
    const pct_opt2 = safePct(a.o2, t);
    const pct_opt3 = safePct(a.o3, t);
    const pct_opt4 = safePct(a.o4, t);
    const pctFav   = safePct(a.o1 + a.o2, t);
    const pctDesf  = safePct(a.o3 + a.o4, t);
    const nsat     = round2(pctFav - pctDesf);
    const mean     = mean0to100(a.o1, a.o2, a.o3, a.o4, t);

    granFactores[gf] = {
      resumen: { pct_opt1, pct_opt2, pct_opt3, pct_opt4, pctFav, pctDesf, nsat, mean },
      factores: {}
    };
  });

  // Asignar cada Factor a su Gran Factor correspondiente
  Object.keys(out).forEach(factor => {
    const gf = factorToGran[factor] ?? 'SIN_ETIQUETA';

    if (!granFactores[gf]) {
      // por si acaso, inicializamos vacío
      granFactores[gf] = {
        resumen: {
          pct_opt1: 0, pct_opt2: 0, pct_opt3: 0, pct_opt4: 0,
          pctFav: 0, pctDesf: 0, nsat: 0, mean: 0
        },
        factores: {}
      };
    }

    granFactores[gf].factores[factor] = out[factor];
  });

  // 4) Colgamos la estructura de Gran Factores en el resultado
  (out as any).granFactores = granFactores;

  return out;
}


export function toParFiltros(campos: Campo[]): string[] {
  return campos.flatMap(c =>
    (c.valores ?? []).map(v => `${c.idCampo}|${v}`)
  );
}

type CampoViejo = {
  IdCampoDemografico: number;
  NombreCampo: string;
  Valores: { Valor: string }[];
};

type CamposViejos = CampoViejo[];

type CamposNuevos = {
  order: { level: number; id: number; campo: string }[];
  // ...rootCampoId, rootCampo, values (no los necesitamos aquí)
};

function agruparPorCampo(
  seleccionados: string[],
  meta: CamposViejos | CamposNuevos
): { nombreCampo: string; valoresSeleccionados: string[] }[] {

  // --- 1) id -> nombre (y level opcional para ordenar)
  const idToName = new Map<number, string>();
  const idToLevel = new Map<number, number>();

  const isNueva = (m: any): m is CamposNuevos => !!m && Array.isArray(m.order);

  if (isNueva(meta)) {
    meta.order.forEach(o => {
      idToName.set(o.id, o.campo);
      idToLevel.set(o.id, o.level);
    });
  } else {
    (meta as CamposViejos).forEach(c => {
      idToName.set(c.IdCampoDemografico, c.NombreCampo);
      // sin level en la estructura vieja
    });
  }

  // --- 2) Construir mapa id -> valores seleccionados
  const mapa: Record<number, string[]> = {};

  for (const item of seleccionados) {
    if (!item) continue;
    const pipe = item.indexOf('|');
    if (pipe <= 0) continue;

    const idStr = item.slice(0, pipe);
    const valorRaw = item.slice(pipe + 1);
    const id = parseInt(idStr, 10);
    const valor = valorRaw?.trim();

    if (!Number.isFinite(id) || !valor) continue;

    (mapa[id] ??= []).push(valor);
  }

  // --- 3) Armar resultado (dedupe + orden de valores)
  const resultado = Object.keys(mapa).map(k => {
    const id = parseInt(k, 10);
    const nombre = idToName.get(id) ?? `Campo ${id}`;
    const unicos = Array.from(new Set(mapa[id]))
      .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    return {
      nombreCampo: nombre,
      valoresSeleccionados: unicos,
      // guardamos level temporalmente para ordenar y luego lo quitamos
      _level: idToLevel.get(id) ?? Number.MAX_SAFE_INTEGER
    } as any;
  });

  // --- 4) Orden final: por level (si lo tenemos), si no por nombre
  resultado.sort((a: any, b: any) => {
    if (a._level !== b._level) return a._level - b._level;
    return a.nombreCampo.localeCompare(b.nombreCampo, 'es', { sensitivity: 'base' });
  });

  // quitar _level antes de devolver
  return resultado.map(({ _level, ...rest }: any) => rest);
}

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss'],
  imports: [
    BreadcrumbComponent,MatFormFieldModule,MatSelectModule,CommonModule,
    MatButtonModule,TranslateModule,MatRadioModule,
    MatMenuModule,FormsModule,MatChipsModule,
    MatIconModule,
    ProgressTableFactorComponent,MatDividerModule, SliderTableComponent,
    NgApexchartsModule,NgxGaugeModule,MatProgressSpinnerModule, DemographicParticipationComponent,
    NgScrollbar,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTooltipModule,PendingByDemographicComponent,
    InfoBoxFactorComponent,
  
    BarChartModule, LineChartModule, AreaChartModule, PieChartModule 
  ],
})

export class Dashboard1Component implements OnInit {
  selectedFilters: DemographicSelection[] = [];
  public areaChartOptions!: Partial<ChartOptions>;

  public barChartOptions: Partial<ChartOptions> = {
    chart: { type: 'bar', stacked: true, stackType: '100%', toolbar: { show: true } },
    plotOptions: { bar: { dataLabels: { position: 'top' } } },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      offsetY: -2,
      style: { fontSize: '12px' }
    },
    yaxis: {
      min: 0, max: 100,
      labels: { formatter: (val: number) => `${val}%` }
    },
    tooltip: {
      y: { formatter: (val: number) => `${val.toFixed(2)}%` }
    }
  };

  public sliderRows = [];

  public participacionRows = [];

  public rowsPendientes = [];


  public earningOptions!: Partial<ChartOptions>;
  public performanceRateChartOptions!: Partial<ChartOptions>;
  
  loadingGeneral = false;
  loadingEnvios = false;
  loadingPanorama = false;
  loadingFactores = false;
  loadingConteos = false;
  loadingPorcentajes = false;
  loadingCalificacion = false; 
  loadingOrganizations = false;
  loadingClimas = false;



  filtrosDemograficos = '';
  filtrosGrandesFactores = '';

  langStoreValue?: string;

  verde = '#21A67A';

  barChartOptions2: Partial<ChartOptions> = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '90%',     // ancho de cada columna
        dataLabels: {
          position: 'top',
               
        }
        
      }
      
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      position: 'top'
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`
      }
    },
    xaxis: {
      categories: []           // ← se cargará dinámicamente
    },
    colors: ['#1ba070', '#eb6841'] // verde / rojo
  };

  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];
  //public columnChartOptions: Partial<ChartOptions>;

  colorScheme: Color = {
    domain: ['red', 'orange', 'yellow', 'green'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  formatPercent = (value: number): string => {
    return `${value}%`;
  };

  public barChartData: ChartData<'bar'> = {
      labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
      datasets: [
        {
          data: [65, 59, 80, 81, 56, 55, 40],
          label: 'Series A',
          backgroundColor: 'rgba(109, 144, 232, 0.8)',
        },
        {
          data: [28, 48, 40, 19, 86, 27, 90],
          label: 'Series B',
          backgroundColor: 'rgba(255, 140, 96, 0.8)',
        },
      ],
  };

  guageType1 = 'full' as NgxGaugeType;
  guageType2 = 'semi' as NgxGaugeType;
  guageType3 = 'arch' as NgxGaugeType;

  public idOrganization =  0;
  public nombreOrganizacion = '';
  public idFlujo =  0;
  public nombreFlujo = ''; 
  public objetivoFlujo = '';
  public imgFlujo = '';
  public tipoFiltro = 'AND';
  selectedGFactors: number[] = [];

  public estadoEnvio = '';
  public totalCreadas = 0;
  public totalEnviadas = 0;
  public totalContestadas = 0;
  public totalEmplados = 0;
  public porcentajeEnvio = 0;
  public totalPendientes = 0;


  public isButtonDisabled = true;
  public dataSourceOrganizations:any = [];
  public dataGrandesFactores:any = [];
  public dataSourceClimas:any = [];
  public html = '';
  public metricasData:any =[];
  public commentsData:any =[];
  public commentsDataNorm:any =[];
  public metricasFactoresPreguntasData:any = [];
  public metricasSatisfaccionPreguntasData:any = [];
  public metricasSatisfaccionGeneralData:any = {};
  public camposDemograficosParaExcel:any = [];
  public resultadoParaExcel:any = [];
  public gaugeColor: string = '#FF0000';
  public btnDisabled = true;

  public accessToFilter = true;
  public accessToExport = true;
  public roleName = '';
  

  public campos:any = [
 
];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  public legendPosition: LegendPosition = LegendPosition.Right;
  timeline = true;

  showLabels = true;
  // data goes here
  public single:any = [
    
  ];
  // line chart start

  // vaericle bar chart start
  vbarxAxisLabel = 'Tipos Respuestas';
  vbaryAxisLabel = 'Porcentaje';
  // horizontal bar chart start
  hbarxAxisLabel = 'Sales';
  hbaryAxisLabel = 'Country';
  autoScale = true;
  linexAxisLabel = 'Year';
  lineyAxisLabel = 'Sales';
  // area chart
  areaxAxisLabel = 'Year';
  areayAxisLabel = 'Sales';

  gFactoresFiltrados = '';



  public seriess:any = []

  constructor(private languageService: LanguageService,private translate: TranslateService,
    private organizacionService: OrganizacionService, private authService: AuthService,
    private excel: ExcelXlsxService, private router: Router,private dialog: MatDialog
    ) {
    
    const factores = [
      
    ];


  }

    existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
    }

    ngOnInit() {

    //console.log('CURRENT USER DESDE DASHBOARD:: ', this.authService.currentUserValue);

      const stored = sessionStorage.getItem('routes');
      if (stored) {
        const routes: RouteInfo[] = JSON.parse(stored);
      console.log('RUTAS DESDE DASHBOARD:: ', routes);

        //buscar path
        const found = this.existsRoute(routes, 'dashboard/dashboard1');
      //console.log(found);

        if(!found){
          this.router.navigate(['/authentication/page404']);
        }

      }

      //jjg aquí se cambia el idioma al cargar
      this.langStoreValue = localStorage.getItem('lang') as string;
      this.languageService.setLanguage(this.langStoreValue);
      this.translate.use(this.langStoreValue);

      console.log('this.langStoreValue dash:: ', this.langStoreValue);

      //jjg aquí se maneja el cambio desde el componente header
      this.languageService.getLanguageChangeSubject().subscribe(lang => {
        this.translate.use(lang);
      });


      if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
        this.getOrganizations();
      }
      else {

        //validar permisos de acciones
        const permisoexport = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'exportdash');
        const permisofilter = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'filterdash');

        //console.log('permisofilter',permisofilter);

        if(permisoexport){
          this.accessToExport = true;
          this.btnDisabled = false;
        }else{
          this.accessToExport = false;
          this.btnDisabled = true;
        }

        if(permisofilter){
          this.accessToFilter = true;
          this.btnDisabled = false;
        }else{
          this.accessToFilter = false;
          this.btnDisabled = true;
        }

        this.getOrganizationById(this.authService.currentUserValue?.idOrganization);


      }

    

      this.chartFactores();



    }




  public subjects: SubjectProgress[] = [
    
  ];



 ///////////////////////////////////////

  onOrganizationChange(selectedId: number) {
    //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    this.selectedFilters = [];
    this.selectedGFactors = [];
    this.dataGrandesFactores = [];
    this.clearAll();

    //choripan..
 
    if(selectedId > 0){
      //this.editor?.setContent('');
      this.idOrganization = selectedId;
      this.dataSourceClimas = [];
      this.nombreOrganizacion = 'cargando..'
      this.getFlujosLista();
      

    }
    
  }

  clearAll(){


    this.single = [];
    this.metricasSatisfaccionGeneralData.pct_top2 = 0;
    this.totalCreadas = 0;            
    this.totalContestadas = 0;
    this.totalEmplados = 0;
    this.porcentajeEnvio = 0;
    this.estadoEnvio = '';
    this.totalEnviadas = 0;
    this.nombreFlujo = '';
    this.metricasData = [];
    this.gMetricasData = [];

    const categories: string[] = [];
      const seriessx: any[] = [
    ];

    this.barChartOptions = {
      ...this.barChartOptions,
      xaxis: { ...(this.barChartOptions.xaxis ?? {}), categories },
      series: seriessx
    };

    this.construirSeries([]);

    this.subjects = [];

    this.sliderRows = [];

    this.participacionRows = [];
    this.rowsPendientes = [];
      
    this.commentsDataNorm = this.enrichCommentsData([]);
  };

  getDemograficosOrg():void {
    this.organizacionService.getMetricaDemograficos(this.idOrganization).then((resulte) => {
     //console.log('DEMOGRAFICOS OBTENIDOS:: ', resulte.data.data[0]);

      if(resulte){
        const jsonText = Object.values(resulte.data.data[0])[0] as string; // primer y único valor
        const datos     = JSON.parse(jsonText);
        this.campos = datos;
       //console.log('this.campos:: ', this.campos );
      }

    }).catch((err)=>{
      console.error(err);
    })
  }

  getDemograficosOrgRestrictivo():void {

    this.organizacionService.getFiltrosDemograficosRestrictivo(this.idOrganization, this.idFlujo, 5 ) //traer de config
     .then((resulte) => {
     console.log('DEMOGRAFICOS RESTRINGIDOS OBTENIDOS:: ', resulte.data.data[0]);

      if(resulte) {
        const jsonText = Object.values(resulte.data.data[0])[0] as string; // primer y único valor
        const datos     = JSON.parse(jsonText);
        this.campos = datos;
        console.log('this.campos:: ', this.campos );
      }

    }).catch((err)=>{
      console.error(err);
    })
  }

  getDemograficosOrgArbol():void {

    this.organizacionService.getFiltrosDemograficosArbol(this.idOrganization ) //traer de config
     .then((resulte) => {
     console.log('DEMOGRAFICOS ARBOL OBTENIDOS:: ', resulte.data.data[0]);

      if(resulte) {
        const jsonText = Object.values(resulte.data.data[0])[0] as string; // primer y único valor
        const datos     = JSON.parse(jsonText);
        this.campos = datos;
        console.log('this.campos:: ', this.campos );
      }

    }).catch((err)=>{
      console.error(err);
    })
  }

  onClimaChange(selectedId: number) {

    //console.log('Se seleccionó el clima con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    this.idFlujo = selectedId;
  
    const clima  = this.dataSourceClimas.find((c: { Id: number; }) => c.Id === this.idFlujo);
    if(this.accessToExport){
      this.btnDisabled = false;
    }
    
    ////console.log('clima:: ', clima);
    this.nombreFlujo = clima.Nombre;
    this.objetivoFlujo =  clima.Objetivo;
    this.imgFlujo = clima.Imagen1Src;

    //this.getMetricaPorcentajeRespuestas();
    //this.getMetricaFactores();
    //this.getMetricaConteoPreguntasFactores();
    //this.getMetricaSatisfaccionPreguntas();
    //this.getMetricaCalificacionGeneralClima();

    this.aplicarFiltrosSecuencial('','');

    //this.getMetricaEstadoEnvio();
    // this.getMetricaCommentsia();
    //this.getMetricaComments();
    //this.getMetricaPrcentajeSatisfaccionFactores();


    this.getGrandesFactores();

    this.getDemograficosOrgArbol();

  };

 

  getGrandesFactores(): void {

    this.organizacionService.getGrandesFactores(this.idFlujo)
      .then((response:any) => {
        console.log('GrandesFactores:', JSON.stringify(response.data));
        
        this.filtrosGrandesFactores = '';

        this.dataGrandesFactores = response.data.data;

        this.selectedGFactors = this.dataGrandesFactores.map((g:any) => g.Id);

        console.log('this.dataGrandesFactores:: ', this.dataGrandesFactores);

        this.dataGrandesFactores.forEach((gf:any) => {
          this.filtrosGrandesFactores = this.filtrosGrandesFactores + gf.Id + ',';
        });

        console.log('this.filtrosGrandesFactores::: ', this.filtrosGrandesFactores);
        
      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }


  getOrganizations(): void {
    
    this.loadingOrganizations = true;

    this.organizacionService.getOrganizations()
      .then((response:any) => {
        //console.log('Organizacionesxx:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        this.loadingOrganizations = false;

      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
        this.loadingOrganizations = false;
      });

      
  }

  getOrganizationById(idOrganization:any): void {
    this.loadingOrganizations = true;
    this.organizacionService.getOrganizationById(idOrganization)
        .then((response:any) => {
          ////console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;

          this.idOrganization = idOrganization;
          this.dataSourceClimas = [];
          this.nombreOrganizacion = 'cargando..'
          this.loadingOrganizations = false;
          this.getFlujosLista(); 

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
          this.loadingOrganizations = false;
        });
  }

  getFlujosLista(): void {

    this.loadingClimas = true;

    this.organizacionService.getFlujosLista(this.idOrganization)
        .then((response:any) => {
          ////console.log('Flujos Plantillas:', JSON.stringify(response.data));
          
          this.dataSourceClimas = response.data.data;
          var org = this.dataSourceOrganizations.find((o: { Id: number; }) => o.Id === this.idOrganization);
          this.nombreOrganizacion = org.Nombre;

          this.loadingClimas = false;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos:', error);
          this.loadingClimas = false;
        });
  };

  //porcentaje satisfacción por factores
  getMetricaFactores(): void {

    this.loadingFactores = true;

    this.metricasData = [];

    this.organizacionService.getMetricaFactores(this.idFlujo)
        .then((response:any) => {
          ////console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.metricasData = response.data.data;

          this.gMetricasData = this.groupByGranFactor(this.metricasData);

          this.loadingFactores = false;
          

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
          this.loadingFactores = false;
        });
  };

  getMetricaFactoresFiltrado(filtro:string): void {

    this.organizacionService.getMetricaFactoresFiltrado(this.idFlujo, filtro)
      .then((response:any) => {
        //console.log('Metrica Factores FILTRADO:', response.data);
        
        this.metricasData = response.data.data;
        this.metricasData = [...this.metricasData]

        this.gMetricasData = this.groupByGranFactor(this.metricasData);

      })
      .catch((error:any) => {
        console.error('Error al obtener las métricasl:', error);
      });
  };

 
  async getMetricaFactoresFiltradoGF(filtro: string, filtroGf: string): Promise<void> {
    this.loadingFactores = true;
    this.metricasData = [];

    try {
      const response: any = await this.organizacionService
        .getMetricaFactoresFiltradoGF(this.idFlujo, filtro, filtroGf, this.tipoFiltro);

      console.log('Metrica Factores FILTRADO GF:', response.data);

      this.metricasData = response?.data?.data ?? [];
      this.metricasData = [...this.metricasData];

      this.gMetricasData = this.groupByGranFactor(this.metricasData);
    } catch (error) {
      console.error('Error al obtener las métricas:', error);
      throw error; // opcional: propaga para que el orquestador pueda cortar la secuencia
    } finally {
      this.loadingFactores = false;
    }
  }

  //public metricasData: any[] = []; // ya lo tienes
  public gMetricasData: Array<{ id: number; etiqueta: string; factores: any[] }> = [];

  private groupByGranFactor(list: any[]) {
    const map = new Map<number, { id: number; etiqueta: string; factores: any[] }>();
    for (const m of (list || [])) {
      const id = m.IdGranFactor ?? m.idGranFactor ?? -1;
      const etiqueta = m.EtiquetaGranFactor ?? m.etiquetaGranFactor ?? 'Gran factor';
      if (!map.has(id)) {
        map.set(id, { id, etiqueta, factores: [] });
      }
      map.get(id)!.factores.push(m);
    }
    return Array.from(map.values());
  }

  getGFPct(g: { factores?: any[] } | null | undefined): number {
    const factores = g?.factores ?? [];
    const total = factores.reduce((s, m) => s + (m.total_respuestas ?? 0), 0);
    if (total <= 0) return 0;
    const ponderado = factores.reduce(
      (s, m) => s + ((m.pct_satisfaccion_equal ?? 0) * (m.total_respuestas ?? 0)),
      0
    );
    // 2 decimales
    return Math.round((ponderado / total) * 100) / 100;
  }

  getGFColor(pct: number): string {
    return pct > 70 ? '#2ecc71' : pct >= 50 ? '#f39c12' : '#e74c3c';
  }

  getGFStyle(g: any) {
    const pct = this.getGFPct(g);
    return {
      'background-color': this.getGFColor(pct),
      color: '#fff',
      padding: '2px 8px',
      'border-radius': '999px',
      'font-weight': '600',
      'font-size': '0.85rem',
    };
  }

  getMetricaComments(): void {

    this.organizacionService.getMetricaComments(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.commentsDataNorm = response.data.data;

          this.commentsDataNorm.forEach((factor:any) => {
            factor.ComentariosJSON = JSON.parse(factor.ComentariosJSON);
          });

          this.commentsDataNorm = this.enrichCommentsData(this.commentsDataNorm);

          //console.log('commentsData ahora::' , this.commentsData);

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

  /*
  getMetricaCommentsGF(): void {

    this.commentsDataNorm = [];

    this.organizacionService.getMetricaCommentsGF(this.idFlujo, this.filtrosGrandesFactores)
        .then((response:any) => {
          //console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.commentsDataNorm = response.data.data;

          this.commentsDataNorm.forEach((factor:any) => {
            factor.ComentariosJSON = JSON.parse(factor.ComentariosJSON);
          });

          this.commentsDataNorm = this.enrichCommentsData(this.commentsDataNorm);

          //this.commentsDataNorm = [...this.commentsDataNorm];

          console.log('commentsDataNorm ahora::' , this.commentsDataNorm);

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };
  */

  get filterChips(): FilterChip[] {
    return (this.selectedFilters ?? []).flatMap(f =>
      (f.valores ?? [])
        .filter(v => v !== null && v !== undefined)
        .map(v => {
          const s = typeof v === 'string' ? v : String(v);
          const label = s.trim() === '' ? 'vacío' : s.trim();
          return { idCampo: f.idCampo, nombreCampo: f.nombreCampo, valor: label };
        })
    );
  }

  trackChip = (_: number, c: FilterChip) => `${c.idCampo}|${c.valor}`;

  async getMetricaCommentsGF(): Promise<void> {
    // (Opcional) si manejas un loader específico
    // this.loadingCommentsGF = true;

    this.commentsDataNorm = [];



    try {
      const response: any = await this.organizacionService
        .getMetricaCommentsGF(this.idFlujo, this.filtrosGrandesFactores);

      const data = response?.data?.data ?? [];

      // Parseo seguro del JSON de comentarios
      for (const factor of data) {
        const raw = factor?.ComentariosJSON;
        if (typeof raw === 'string') {
          try {
            factor.ComentariosJSON = JSON.parse(raw);
          } catch {
            factor.ComentariosJSON = []; // fallback si viene mal
          }
        } else if (!Array.isArray(raw)) {
          factor.ComentariosJSON = [];
        }
      }

      // Enriquecer estructura con tu helper
      this.commentsDataNorm = this.enrichCommentsData(data);

      // Forzar change detection (si lo necesitas)
      // this.commentsDataNorm = [...this.commentsDataNorm];

      console.log('commentsDataNorm ahora::', this.commentsDataNorm);

    } catch (error) {
      console.error('Error al obtener comentarios normales (GF):', error);
      throw error; // opcional, si deseas que interrumpa la cadena secuencial
    } finally {
      // this.loadingCommentsGF = false;
    }
  }


  getMetricaCommentsia(): void {

    this.organizacionService.getMetricaCommentsia(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.commentsData = response.data.data;

          this.commentsData.forEach((factor:any) => {
            factor.ComentariosJSON = JSON.parse(factor.ComentariosJSON);
          });

          this.commentsData = this.enrichCommentsData(this.commentsData);

          console.log('commentsData ahora::' , this.commentsData);

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };
  
  /*
  getMetricaCommentsIAGF(): void {

    this.commentsData = [];

    this.organizacionService.getMetricaCommentsIAGF(this.idFlujo, this.filtrosGrandesFactores)
        .then((response:any) => {
          //console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.commentsData = response.data.data;

          this.commentsData.forEach((factor:any) => {
            factor.ComentariosJSON = JSON.parse(factor.ComentariosJSON);
          });

          this.commentsData = this.enrichCommentsData(this.commentsData);

          //this.commentsData = [...this.commentsData];

          console.log('commentsData ahora::' , this.commentsData);

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };
  */
  async getMetricaCommentsIAGF(): Promise<void> {
  // (Opcional) si tienes un loader específico:
  // this.loadingCommentsIA = true;

  this.commentsData = [];

  try {
    const response: any = await this.organizacionService
      .getMetricaCommentsIAGF(this.idFlujo, this.filtrosGrandesFactores);

    const data = response?.data?.data ?? [];
    // Parseo seguro de ComentariosJSON por cada factor
    for (const factor of data) {
      const raw = factor?.ComentariosJSON;
      if (typeof raw === 'string') {
        try {
          factor.ComentariosJSON = JSON.parse(raw);
        } catch {
          factor.ComentariosJSON = []; // fallback si viene mal formado
        }
      } else if (!Array.isArray(raw)) {
        factor.ComentariosJSON = [];   // normaliza a array
      }
    }

    // Enriquecer/normalizar con tu helper
    this.commentsData = this.enrichCommentsData(data);

    // this.commentsData = [...this.commentsData]; // si necesitas disparar change detection manual

    console.log('commentsData ahora::', this.commentsData);

  } catch (error) {
    console.error('Error al obtener comentarios IA (GF):', error);
    throw error; // opcional: deja propagar para cortar una secuencia await
  } finally {
    // this.loadingCommentsIA = false;
  }
}

  

  getMetricaConteoPreguntasFactores(): void {

    this.loadingConteos = true;

    this.organizacionService.getMetricaConteoPreguntasFactores(this.idFlujo)
      .then((response:any) => {
        ////console.log('Metrica Preguntas Factores:', JSON.stringify(response.data));
        
        this.metricasFactoresPreguntasData = response.data.data;

        if(this.metricasFactoresPreguntasData){
          

          var seriessx:any = [
            {
              name: 'Totalmente en Desacuerdo',
              data:[],
            },
            {
              name: 'En Desacuerdo',
              data:[],
            },
            {
              name: 'De Acuerdo',
              data:[],
            },
            {
              name: 'Totalmente de Acuerdo',
              data:[],
            },
          ];
        

          this.barChartOptions.xaxis  = { categories: [] };
          

          this.metricasFactoresPreguntasData.forEach((factorx: { 
            Factor: string, total_totalmente_de_acuerdo: number, total_de_acuerdo: number, 
            total_en_desacuerdo: number, total_totalmente_en_desacuerdo: number  }) => {
            
            this.barChartOptions.xaxis?.categories.push(factorx.Factor);

            var totdeacuerdo = factorx.total_totalmente_de_acuerdo;
            var deacuerd = factorx.total_de_acuerdo;
            var desacuerd = factorx.total_en_desacuerdo;
            var totdesacuerd = factorx.total_totalmente_en_desacuerdo;

            if(this.barChartOptions.series){

              ////console.log('SOPHIE');

              seriessx[3].data.push(totdeacuerdo);
              seriessx[2].data.push(deacuerd);
              seriessx[1].data.push(desacuerd);
              seriessx[0].data.push(totdesacuerd);

            };
            
            

          });

          this.barChartOptions = {
            ...this.barChartOptions,
          
            series: seriessx,
            dataLabels: {
              enabled: true,
              formatter: (val: number) => `${val.toFixed(1)}%`,
              offsetY: -2,
              style: { fontSize: '12px', colors: ['#2b2b2b']  },
              
            },
            tooltip: { y: { formatter: (val: number) => `${val.toFixed(2)}%` } },
            yaxis: { min: 0, max: 100, labels: { formatter: (v: number) => `${v}%` } }
          };

          

        
        }

        this.loadingConteos = false;

      })
      .catch((error:any) => {
        this.loadingConteos = false;
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  /*
  getMetricaConteoPreguntasFactoresFiltradoGF(filtro:string,filtroGf:string): void {
    this.loadingConteos = true;
    this.organizacionService.getMetricaConteoPreguntasFactoresFILTRADOGF(this.idFlujo,filtro,filtroGf)
      .then((response:any) => {
        ////console.log('Metrica Preguntas Factores:', JSON.stringify(response.data));
        
        this.metricasFactoresPreguntasData = response.data.data;

        if(this.metricasFactoresPreguntasData){
          

          var seriessx:any = [
            {
              name: 'Totalmente en Desacuerdo',
              data:[],
            },
            {
              name: 'En Desacuerdo',
              data:[],
            },
            {
              name: 'De Acuerdo',
              data:[],
            },
            {
              name: 'Totalmente de Acuerdo',
              data:[],
            },
          ];
        

          this.barChartOptions.xaxis  = { categories: [] };

          this.metricasFactoresPreguntasData.forEach((factorx: { 
            Factor: string, total_totalmente_de_acuerdo: number, total_de_acuerdo: number, 
            total_en_desacuerdo: number, total_totalmente_en_desacuerdo: number  }) => {
            
            this.barChartOptions.xaxis?.categories.push(factorx.Factor);

            var totdeacuerdo = factorx.total_totalmente_de_acuerdo;
            var deacuerd = factorx.total_de_acuerdo;
            var desacuerd = factorx.total_en_desacuerdo;
            var totdesacuerd = factorx.total_totalmente_en_desacuerdo;

            if(this.barChartOptions.series){

              //console.log('SOPHIE');

              seriessx[3].data.push(totdeacuerdo);
              seriessx[2].data.push(deacuerd);
              seriessx[1].data.push(desacuerd);
              seriessx[0].data.push(totdesacuerd);

            };
            
            

          });

          this.barChartOptions.series = seriessx;
          
        
        }

        this.loadingConteos = false;

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
        this.loadingConteos = false;
      });
  };
  */

  async getMetricaConteoPreguntasFactoresFiltradoGF(filtro: string, filtroGf: string): Promise<void> {
    this.loadingConteos = true;

    try {
      const response: any = await this.organizacionService
        .getMetricaConteoPreguntasFactoresFILTRADOGF(this.idFlujo, filtro, filtroGf);

      this.metricasFactoresPreguntasData = response?.data?.data ?? [];

      // Armar categorías y series
      const categories: string[] = [];
      const seriessx: any[] = [
        { name: 'Totalmente en Desacuerdo', data: [] as number[] },
        { name: 'En Desacuerdo',            data: [] as number[] },
        { name: 'De Acuerdo',               data: [] as number[] },
        { name: 'Totalmente de Acuerdo',    data: [] as number[] },
      ];

      this.metricasFactoresPreguntasData.forEach((f: {
        Factor: string;
        total_totalmente_de_acuerdo: number | string;
        total_de_acuerdo: number | string;
        total_en_desacuerdo: number | string;
        total_totalmente_en_desacuerdo: number | string;
      }) => {
        categories.push(f.Factor);

        const totDeAcuerdo    = Number(f.total_totalmente_de_acuerdo);
        const deAcuerdo       = Number(f.total_de_acuerdo);
        const enDesacuerdo    = Number(f.total_en_desacuerdo);
        const totEnDesacuerdo = Number(f.total_totalmente_en_desacuerdo);

        // Orden consistente con la leyenda
        seriessx[3].data.push(totDeAcuerdo);
        seriessx[2].data.push(deAcuerdo);
        seriessx[1].data.push(enDesacuerdo);
        seriessx[0].data.push(totEnDesacuerdo);
      });

      // Forzar cambio de referencia para ApexCharts/Angular
      this.barChartOptions = {
        ...this.barChartOptions,
        xaxis: { ...(this.barChartOptions.xaxis ?? {}), categories },
        series: seriessx
      };

      // (Opcional) Si usas @ViewChild('chart') chart?: ChartComponent;
      // this.chart?.updateOptions({ xaxis: { categories }, series: seriessx } as any, true, true);

    } catch (error) {
      console.error('Error al obtener las métricas (conteos por factor):', error);
      throw error; // opcional, para cortar una cadena secuencial
    } finally {
      this.loadingConteos = false;
    }
  }


  openFilters() {

    
    const dlg = this.dialog.open(DemographicFiltersDialogComponent, {
      width: '1200px',   
      maxWidth: '100vw',     
      height: 'auto',
      maxHeight: '95vh',
      data: { ...this.campos,
        
        preselected: this.selectedFilters
      }
    });

    dlg.afterClosed().subscribe((result?: DemographicSelection[]) => {
      if (!result) return;
      this.selectedFilters = result;
      
      console.log('valores recibidos tío: ', result);


      const values = toParFiltros(result)

      console.log('valores convertidos tío: ', values);

      this.camposDemograficosParaExcel = agruparPorCampo(values, this.campos);
      

      const tramax = this.construirTramaFiltros(result);

      this.filtrosDemograficos = tramax;

      this.aplicarFiltrosSecuencial(tramax,this.filtrosGrandesFactores);


    });
  }

  async aplicarFiltrosSecuencial(tramax: string, filtrosGF: any) {
    try {
      //this.loading = true;

      //this.loadingFactores = true;
      //this.loadingConteos = true;
      //this.loadingCalificacion = true;
      this.loadingGeneral = true;
      //this.loadingPanorama = true;
      //this.loadingPorcentajes = true;



      this.getMetricaEstadoEnvio();
      await this.getAllMetricsAsync(tramax, filtrosGF);
      //await this.getMetricaPorcentajeRespuestasFiltradoGF(tramax, filtrosGF);
      //await this.getMetricaFactoresFiltradoGF(tramax, filtrosGF);
      //await this.getMetricaSatisfaccionPreguntasFiltradoGF(tramax, filtrosGF);
      //await this.getMetricaConteoPreguntasFactoresFiltradoGF(tramax, filtrosGF);
      //await this.getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(tramax, filtrosGF);
      //await this.getMetricaCommentsIAGF();
      
      //await this.getMetricaCommentsGF();

    } catch (err) {
      console.error('Error en ejecución secuencial:', err);
      // opcional: mostrar toast
    } finally {
      //this.loading = false;
    }
  }


  construirTramaFiltros(filtros: Filtro[]): string {
    return (filtros ?? [])
      .flatMap(f =>
        (f.valores ?? [])
          .filter(v => v !== null && v !== undefined) // permitimos ''
          .map(v => {
            const s = typeof v === 'string' ? v : String(v);
            return `${f.idCampo}|${(s.trim() === '' ? 'vacío' : s)}`;
          })
      )
      .join(',');
  }


  colorFor(v: number): string {
    if (v >= 70) return 'green';
    if (v >= 50) return 'orange';
    return 'red';
  }
  
  colorClass(v: number): string {
    return this.colorFor(v); // reutiliza
  }




  // === Helpers usados arriba ===
  round2(n: number): number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }
  safePct(num: number, den: number): number {
    return den > 0 ? this.round2((num / den) * 100) : 0;
  }
  calcMean0to100FromCounts(opt1: number, opt2: number, opt3: number, opt4: number, total: number): number {
    // Índice 0–100: (3*opt1 + 2*opt2 + 1*opt3 + 0*opt4) / (3*total) * 100
    if (total <= 0) return 0;
    const sum03 = (3 * opt1) + (2 * opt2) + (1 * opt3) + (0 * opt4);
    return this.round2((sum03 / (3 * total)) * 100);
  }
  calcMean1to4FromCounts(opt1: number, opt2: number, opt3: number, opt4: number, total: number): number {
    // media 1..4 = 1 + (sum_0_3 / total)
    if (total <= 0) return 0;
    const sum03 = (3 * opt1) + (2 * opt2) + (1 * opt3) + (0 * opt4);
    return this.round2(1 + (sum03 / total));
  }


  //porcentaje general
  getMetricaCalificacionGeneralClima(): void {

    this.loadingGeneral = true;

    this.organizacionService.getMetricaCalificacionGeneralClima(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Satisfaccion General:', JSON.stringify(response.data));
          
          if(response.data.data[0]){
                        
            this.metricasSatisfaccionGeneralData = response.data.data[0];
           
            const pct = this.metricasSatisfaccionGeneralData.pct_general;

            if (pct >= 91) {
              this.gaugeColor = '#92D050';    // verde 
            } else if (pct >= 80) {
              this.gaugeColor = '#FFFF00';    // amarillo
            } else if (pct >= 60) {
              this.gaugeColor = '#FFC000';    // naranja
            } else {
              this.gaugeColor = '#FF0000';    // rojo
            }

          }

          this.loadingGeneral = false;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
          this.loadingGeneral = false;
        });
  };



  async getMetricaCalificacionGeneralClimaFiltradoGF(filtro: string, filtroGf: string): Promise<void> {
    this.loadingGeneral = true;

    try {
      const response: any = await this.organizacionService
        .getMetricaCalificacionGeneralClimaFiltradoGF(this.idFlujo, filtro, filtroGf, this.tipoFiltro);

      const data = response?.data?.data ?? [];

      if (data.length > 0) {
        this.metricasSatisfaccionGeneralData = data[0];

        const pct = Number(this.metricasSatisfaccionGeneralData.pct_general ?? 0);

        if (pct >= 91) {
          this.gaugeColor = '#92D050'; // verde
        } else if (pct >= 80) {
          this.gaugeColor = '#FFFF00'; // amarillo
        } else if (pct >= 60) {
          this.gaugeColor = '#FFC000'; // naranja
        } else {
          this.gaugeColor = '#FF0000'; // rojo
        }
      } else {
        this.metricasSatisfaccionGeneralData = null;
        this.gaugeColor = '#ccc'; // color neutro si no hay datos
      }
    } catch (error) {
      console.error('Error al obtener la métrica de satisfacción general:', error);
      throw error; // opcional, si quieres que detenga la ejecución secuencial
    } finally {
      this.loadingGeneral = false;
    }
  }


  async getAllMetricsAsync(filtro: string, filtroGf: string): Promise<void> {

    this.clearAll();

    this.loadingGeneral = true;
    this.loadingPanorama = true;
    this.loadingFactores = true;
    this.loadingCalificacion = true;
    this.loadingConteos = true;
    //this.loadingCommentsGF = true;

    try {
      const response: any = await this.organizacionService
        .getAllMetrics(this.idFlujo, filtro, filtroGf, this.tipoFiltro);

      const data = response?.data?.data ?? [];

      console.log('DATA OBTENIDA ALL METRICS:: ', data);

      if(data.satisfaccionPorPregunta.length > 0 && data.satisfaccionPorPregunta[0].empleados_respondieron > 5) {
        
        //calificacion general  
      if (data.calificacionGeneral) {

        this.metricasSatisfaccionGeneralData = data.calificacionGeneral;

        

        const pct = Number(this.metricasSatisfaccionGeneralData.pct_top2 ?? 0);
        //console.log('porcentaje chorizo: ',  pct);

        if (pct >= 91) {
          this.gaugeColor = '#21a67a'; // verde
        } else if (pct >= 80 && pct < 91) {
          this.gaugeColor = '#FFFF00'; // amarillo
        } else if (pct >= 60 && pct < 80) {
          this.gaugeColor = '#FFC000'; // naranja
        } else {
          this.gaugeColor = '#FF0000'; // rojo
        }
      } else {
        this.metricasSatisfaccionGeneralData = null;
        this.gaugeColor = '#ccc'; // color neutro si no hay datos
      }

      //porcentajes satisfación general
      if (data.satisfaccionPorcentajes) {
        const item = data.satisfaccionPorcentajes[0];

        const single = [
          { name: 'Muy en Desacuerdo', value: Number(item.opt_4_pct ?? 0) },
          { name: 'En Desacuerdo',     value: Number(item.opt_3_pct ?? 0) },
          { name: 'De Acuerdo',     value: Number(item.opt_2_pct ?? 0) },
          { name: 'Muy de Acuerdo',    value: Number(item.opt_1_pct ?? 0) },
        ];

        this.single = [...single];
      } else {
        this.single = []; // limpia si no hay datos
      }

      //satisfaccion por factor
      this.metricasData = [];
      if(data.satisfaccionPorPregunta){
        this.metricasData = data.satisfaccionPorPregunta;
        //this.metricasData = [...this.metricasData];

        this.gMetricasData = this.groupByGranFactor(this.metricasData);
        this.metricasData = [...this.metricasData];
        
      } else {
          this.metricasData = [];
      }

      //porcentajes satisfacción por factor
      if(data.distribucionRespuestas){
        this.metricasFactoresPreguntasData = data.distribucionRespuestas;
        
        const categories: string[] = [];
        const seriessx: any[] = [
          { name: 'Muy en Desacuerdo', data: [] as number[] },
          { name: 'En Desacuerdo',            data: [] as number[] },
          { name: 'De Acuerdo',               data: [] as number[] },
          { name: 'Muy de Acuerdo',    data: [] as number[] },
        ];
        console.log('antes del forEach: ', this.metricasFactoresPreguntasData);
        this.metricasFactoresPreguntasData.forEach((f: {
          Factor: string;
          total_totalmente_de_acuerdo: number | string;
          total_de_acuerdo: number | string;
          total_en_desacuerdo: number | string;
          total_totalmente_en_desacuerdo: number | string;
        }) => {
          categories.push(f.Factor);

          const totDeAcuerdo    = Number(f.total_totalmente_de_acuerdo);
          const deAcuerdo       = Number(f.total_de_acuerdo);
          const enDesacuerdo    = Number(f.total_en_desacuerdo);
          const totEnDesacuerdo = Number(f.total_totalmente_en_desacuerdo);

          // Orden consistente con la leyenda
          seriessx[3].data.push(totDeAcuerdo);
          seriessx[2].data.push(deAcuerdo);
          seriessx[1].data.push(enDesacuerdo);
          seriessx[0].data.push(totEnDesacuerdo);
        });

        // Forzar cambio de referencia para ApexCharts/Angular
        this.barChartOptions = {
          ...this.barChartOptions,
          xaxis: { ...(this.barChartOptions.xaxis ?? {}), categories },
          series: seriessx
        };
      }

      //porcentaje satisfaccion e insatisfaccion
      if(data.porcentajeSatisfaccionPorFactor){

        const factores = data.porcentajeSatisfaccionPorFactor;

        this.construirSeries(factores);
      }

       //satisfacción por pregunta
      this.subjects = [];
      this.subjects = [...this.subjects];
      if(data.respuestasPorFactor){
        console.log('PRINCIPE DE LAS TINIEBLAS..', data.respuestasPorFactor);

        this.metricasSatisfaccionPreguntasData = data.respuestasPorFactor;
        if (this.metricasSatisfaccionPreguntasData?.length) {
          // Armado para exportación
          this.resultadoParaExcel = transformData(this.metricasSatisfaccionPreguntasData);
          
          this.resultadoParaExcel.header = {
            nombre_clima: this.nombreFlujo,
            nombre_organizacion: this.nombreOrganizacion
          };

          this.resultadoParaExcel.camposDemograficos = this.camposDemograficosParaExcel;

          this.resultadoParaExcel.calificacionGeneral = data.calificacionGeneral;

          console.log('RESULTADOS PARA EXCEL ANTES.. ', this.resultadoParaExcel);

          // Mapeo de filas
          for (const preguntax of this.metricasSatisfaccionPreguntasData as Array<{
            IdPregunta: number;
            EtiquetaGranFactor: string;
            Factor: string;
            Pregunta: string;
            total_respuestas: number;
            total_opt1: number;
            total_opt2: number;
            total_opt3: number;
            total_opt4: number;
            pct_favorable?: number;
            pct_desfavorable?: number;
            nsat?: number;
            mean_0_100?: number;
            mean_1_4?: number;
            pctFav?: number;
            pctDesf?: number;
            mean?: number;
            mean14?: number;
          }>) {

            const total = Number(preguntax.total_respuestas ?? 0);
            const opt1  = Number(preguntax.total_opt1 ?? 0);
            const opt2  = Number(preguntax.total_opt2 ?? 0);
            const opt3  = Number(preguntax.total_opt3 ?? 0);
            const opt4  = Number(preguntax.total_opt4 ?? 0);

            const pctFav = (preguntax.pctFav ?? preguntax.pct_favorable) ??
                          this.safePct(opt1 + opt2, total);
            const pctDesf = (preguntax.pctDesf ?? preguntax.pct_desfavorable) ??
                            this.safePct(opt3 + opt4, total);
            const nsat = (preguntax.nsat != null)
              ? Number(preguntax.nsat)
              : this.round2(Number(pctFav) - Number(pctDesf));

            const mean = (preguntax.mean ?? preguntax.mean_0_100) ??
              this.calcMean0to100FromCounts(opt1, opt2, opt3, opt4, total);

            const mean14 = (preguntax.mean14 ?? preguntax.mean_1_4) ??
              this.calcMean1to4FromCounts(opt1, opt2, opt3, opt4, total);

            const subj: SubjectProgress = {
              EtiquetaGranFactor: preguntax.EtiquetaGranFactor,
              subject: preguntax.Pregunta,
              factor: preguntax.Factor,
              duration: total,
              totacuerdo: opt1,
              acuerdo: opt2,
              desacuerdo: opt3,
              totdesacuerdo: opt4,
              pctFav: Number(pctFav),
              pctDesf: Number(pctDesf),
              nsat: Number(nsat),
              mean: Number(mean),
              mean14: Number(mean14)
            };

            this.subjects.push(subj);
          }

          this.subjects = [...this.subjects];

          console.log('this.subjects:: ', this.subjects);

        }

      }else{
        this.subjects = [];
        this.subjects = [...this.subjects];
      }

      //preguntas rango
      if(data.preguntasRango){
        console.log('preguntas rango: ', data.preguntasRango);
            
        this.sliderRows = (data.preguntasRango ?? []).map((r: any) => ({
          idGranFactor: r.IdGranFactor,
          etiquetaGranFactor: r.EtiquetaGranFactor,
          idFactor: r.IdFactor,
          factor: r.Factor,
          idPregunta: r.IdPregunta,
          pregunta: r.Pregunta,
          rangoMin: r.RangoMin,
          rangoMax: r.RangoMax,
          total_respuestas: r.total_respuestas,
          promedio: r.promedio,
          distribucionJSON: r.DistribucionJSON, // del SP
        }));
        
      }

      //particiación por demográfico
      if(data.participacionPorDemografico){
        this.participacionRows = (data.participacionPorDemografico ?? []).map((r: any) => ({
          idCampoDemografico: r.IdCampoDemografico,
          campo: r.Campo,                 // nombre del campo
          valor: r.Valor,
          total_empleados: r.total_empleados,
          porcentaje: r.porcentaje
        }));
      }
    
      //porcentajes pendietes por demografico
      if(data.pendientesPorValor){
        this.rowsPendientes = (data?.pendientesPorValor ?? []).map((r: any) => ({
          idCampoDemografico: r.IdCampoDemografico,
          campo: r.Campo,
          valor: r.Valor,
          total_en_campo: r.total_en_campo,
          pendientes: r.pendientes,
          contestadas: r.contestadas,
          pct_pendientes: r.pct_pendientes,
          pct_contestadas: r.pct_contestadas
        }));
      }

      //preguntas abiertas filtradas
      if(data.preguntasAbiertas){

        this.commentsDataNorm = [];

        const datax = data.preguntasAbiertas;

        console.log('pregungtas abiertax: ', datax);

        // Parseo seguro del JSON de comentarios
        for (const factor of datax) {
          const raw = factor?.ComentariosJSON;
          if (typeof raw === 'string') {
            try {
              factor.ComentariosJSON = JSON.parse(raw);
            } catch {
              factor.ComentariosJSON = []; // fallback si viene mal
            }
          } else if (!Array.isArray(raw)) {
            factor.ComentariosJSON = [];
          }
        }
        
        this.commentsDataNorm = this.enrichCommentsData(datax);

        // Forzar change detection (si lo necesitas)
        // this.commentsDataNorm = [...this.commentsDataNorm];

        console.log('commentsDataNorm ahora::', this.commentsDataNorm);


      }else{
      this.commentsDataNorm = [];
      }

      //PREGUNTAS ABIERTAS IA
      if(data.preguntasAbiertasIA){

        this.commentsData = [];

        const dataxx = data.preguntasAbiertasIA;
        // Parseo seguro de ComentariosJSON por cada factor
        for (const factor of dataxx) {
          const raw = factor?.ComentariosJSON;
          if (typeof raw === 'string') {
            try {
              factor.ComentariosJSON = JSON.parse(raw);
            } catch {
              factor.ComentariosJSON = []; // fallback si viene mal formado
            }
          } else if (!Array.isArray(raw)) {
            factor.ComentariosJSON = [];   // normaliza a array
          }
        }

        // Enriquecer/normalizar con tu helper
        this.commentsData = this.enrichCommentsData(dataxx);

        // this.commentsData = [...this.commentsData]; // si necesitas disparar change detection manual

        console.log('commentsData ahora::', this.commentsData);

      }else{
        this.commentsData = [];
      }


      }

      

    
      

    
   
      
    
  



    } catch (error) {
      console.error('Error al obtener la métrica de satisfacción general:', error);
      throw error; // opcional, si quieres que detenga la ejecución secuencial
    } finally {
      this.loadingGeneral = false;
      this.loadingPanorama = false;
      this.loadingFactores = false;
      this.loadingCalificacion = false;
      this.loadingConteos = false;
      this.loadingPorcentajes = false;
      //this.loadingCommentsGF = false;
    }
  }


  getMetricaEstadoEnvio(): void {

    this.loadingEnvios = true;

    this.organizacionService.getMetricaEstadoEnvioClima(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Estado Envío:', JSON.stringify(response.data));
          
          if(response.data.data[0]){
            this.totalCreadas = response.data.data[0].total;            
            this.totalContestadas = response.data.data[0].total_contestadas;
            this.totalEmplados = response.data.data[0].total_empleados_activos;
            this.porcentajeEnvio = response.data.data[0].porcentaje;
            this.estadoEnvio = response.data.data[0].estado_envio;
            this.totalEnviadas = response.data.data[0].total_enviadas;
          }

          this.loadingEnvios = false;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
          this.loadingEnvios = false;
        });
  };

  getMetricaPorcentajeRespuestas(): void {

    this.loadingPanorama = true;

    this.single = [];

    this.organizacionService.getMetricaPorcentajeRespuestas(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Porcentaje Respuestas:', JSON.stringify(response.data));
          
          if(response.data.data[0]){
           
            var single = [
              {
                name: 'Muy Desacuerdo',
                value: response.data.data[0].opt_4_pct,
              },
              {
                name: 'Desacuerdo',
                value: response.data.data[0].opt_3_pct,
              },
              {
                name: 'De Acuerdo',
                value: response.data.data[0].opt_2_pct,
              },
              {
                name: 'Muy Acuerdo',
                value: response.data.data[0].opt_1_pct,
              }
            ];

            this.single = [...single]; 

          }

           this.loadingPanorama = false;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
           this.loadingPanorama = false;
        });
  };

  getMetricaPorcentajeRespuestasFiltrado(filtro:string): void {

    this.organizacionService.getMetricaPorcentajeRespuestasFiltrado(this.idFlujo,filtro)
        .then((response:any) => {
          //console.log('Metrica Porcentaje Respuestas:', JSON.stringify(response.data));
          
          if(response.data.data[0]){
           
            var single = [
              {
                name: 'Muy Desacuerdo',
                value: response.data.data[0].opt_4_pct,
              },
              {
                name: 'Desacuerdo',
                value: response.data.data[0].opt_3_pct,
              },
              {
                name: 'De Acuerdo',
                value: response.data.data[0].opt_2_pct,
              },
              {
                name: 'Muy Acuerdo',
                value: response.data.data[0].opt_1_pct,
              }
            ];

            this.single = [...single]; 

          }

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

  async getMetricaPorcentajeRespuestasFiltradoGF(filtro: string, filtroGf: string): Promise<void> {
    this.loadingPanorama = true;

    try {
      const response: any = await this.organizacionService
        .getMetricaPorcentajeRespuestasFiltradoGF(this.idFlujo, filtro, filtroGf);

      const data = response?.data?.data ?? [];

      if (data.length > 0) {
        const item = data[0];

        const single = [
          { name: 'Muy Desacuerdo', value: Number(item.opt_4_pct ?? 0) },
          { name: 'Desacuerdo',     value: Number(item.opt_3_pct ?? 0) },
          { name: 'De Acuerdo',     value: Number(item.opt_2_pct ?? 0) },
          { name: 'Muy Acuerdo',    value: Number(item.opt_1_pct ?? 0) },
        ];

        this.single = [...single];
      } else {
        this.single = []; // limpia si no hay datos
      }
    } catch (error) {
      console.error('Error al obtener la métrica de porcentaje de respuestas:', error);
      throw error; // opcional: para cortar la cadena secuencial si algo falla
    } finally {
      this.loadingPanorama = false;
    }
  }



  // Asumiendo que 'metricas' es la lista con los 4 totales y % por factor.
  private construirSeries(factores:any[]): void {
    console.log('CONSTRUIR SERIES..');
    // Reiniciamos categorías y datos
    const categorias: string[]      = [];
    const satData: number[]         = [];
    const insatData: number[]       = [];

    factores.forEach(f => {
      categorias.push(f.Factor);
      satData.push(f.pct_satisfaccion);     // % de opt_1 + opt_2
      insatData.push(f.pct_insatisfaccion); // % de opt_3 + opt_4
    });

    this.barChartOptions2.series = [
      { name: 'Satisfacción',     data: satData },
      { name: 'Insatisfacción',   data: insatData }
    ];

    this.barChartOptions2.xaxis = {
      ...this.barChartOptions2.xaxis,
      categories: categorias
    };

    // Si usas un #chart ViewChild => this.chart.updateOptions(...)
    // Si NO, basta con cambiar la referencia completa:
    this.barChartOptions2 = { ...this.barChartOptions2 };
  }

  private chartFactores() {
    this.barChartOptions = {
      series: [
        {
          name: 'Totalmente de Acuerdo',
          data: [],
        },
        {
          name: 'De Acuerdo',
          data: [],
        },
        {
          name: 'En Desacuerdo',
          data: [],
        },
        {
          name: 'Totalmente en Desacuerdo',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: { colors: '#9aa0ac' },
          rotate: -25,        // opcional: rota los labels si son muy largos
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      fill: {
        opacity: 0.8,
        colors: ['#E82742', '#e89f27', '#dbee35', this.verde],
      }, //21A67A
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  getMetricaPrcentajeSatisfaccionFactores(): void {
    this.loadingPorcentajes = true;
    this.organizacionService.getMetricaPorcentajeSatisfaccionFactor(this.idFlujo)
      .then((response:any) => {
        //console.log('Metrica porcentaje satisfaccion Factores:', JSON.stringify(response.data));
        const factores: any[] = response.data.data;
        this.construirSeries(factores);
        this.loadingPorcentajes = false;
      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
        this.loadingPorcentajes = false;
      });
  };

/*
  getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(filtro:string,filtroGf:string): void {
    this.loadingPorcentajes = true;
    this.organizacionService.getMetricaPorcentajeSatisfaccionFactorFiltradoGF(this.idFlujo,filtro,filtroGf)
      .then((response:any) => {
        //console.log('Metrica porcentaje satisfaccion Factores:', JSON.stringify(response.data));
        const factores: any[] = response.data.data;
        this.construirSeries(factores);
        this.loadingPorcentajes = false;

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
        this.loadingPorcentajes = false;
      });
  };
  */

  async getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(filtro: string, filtroGf: string): Promise<void> {
  this.loadingPorcentajes = true;

  try {
    const response: any = await this.organizacionService
      .getMetricaPorcentajeSatisfaccionFactorFiltradoGF(this.idFlujo, filtro, filtroGf);

    const factores = response?.data?.data ?? [];

    this.construirSeries(factores);

  } catch (error) {
    console.error('Error al obtener la métrica de porcentaje de satisfacción por factores:', error);
    throw error;
  } finally {
    this.loadingPorcentajes = false;
  }
  }

   onGFactorChange(values: string[]): void {

    console.log(values);

    const gFactoresFiltro = values.join(',');

    this.gFactoresFiltrados = gFactoresFiltro;

    console.log('gFactoresFiltro:: ', gFactoresFiltro);

    this.filtrosGrandesFactores = gFactoresFiltro;

    /* */ 

      this.aplicarFiltrosSecuencial(this.filtrosDemograficos ,this.filtrosGrandesFactores);
  
  };


  onGenerateReportClick():void{
   
   console.log('this.resultadoParaExcel:: ', this.resultadoParaExcel);

    this.excel.exportar(this.resultadoParaExcel);
  
    //this.exportarReporte();

  };

  onTipoFiltroSelected(event:MatRadioChange):void{
    console.log(event.value);

    this.tipoFiltro = event.value;

    this.aplicarFiltrosSecuencial(this.filtrosDemograficos,this.filtrosGrandesFactores);

  }

  getAllByFilterType():void{
    //satisfacción por preguntas
    //this.getMetricaSatisfaccionPreguntasFiltradoGF(this.filtrosDemograficos,this.filtrosGrandesFactores);
    this.getMetricaCalificacionGeneralClimaFiltradoGF(this.filtrosDemograficos,this.filtrosGrandesFactores);
    this.getMetricaFactoresFiltradoGF(this.filtrosDemograficos,this.filtrosGrandesFactores);

  }

  
  private enrichCommentsData(data: ComentarioPregunta[]): ComentarioPregunta[] {
    return (data || []).map((m) => {
      const list = Array.isArray(m.ComentariosJSON) ? m.ComentariosJSON : [];
      const counts: Record<Sent, number> = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0, MIXED: 0 };
      for (const c of list) {
        const s = ((c?.Sentiment || 'MIXTO') as string).toUpperCase() as Sent;
        if (counts[s] !== undefined) counts[s]++;
      }

      const total = list.length;
      const max = Math.max(...Object.values(counts));
      const winners = (Object.entries(counts) as [Sent, number][])
        .filter(([, c]) => c === max)
        .map(([s]) => s as Sent);

      // Regla: si no hay respuestas -> NEUTRAL; si hay empate -> NEUTRAL; si hay ganador único -> ese.
      const overall: Sent =
        total === 0 ? 'MIXED' :
        winners.length > 1 ? 'MIXED' :
        winners[0];

      return { ...m, ComentariosJSON: list, _total: total, _overall: overall, _counts: counts };
    });
  }




  



















  



  ///////////////////////////////////////


  onTodoToggled(todo: any) {
    //console.log('Todo toggled:', todo);
  }

  onTodosUpdated(updatedTodos: any[]) {
    //console.log('Todos updated:', updatedTodos);
  }

}
