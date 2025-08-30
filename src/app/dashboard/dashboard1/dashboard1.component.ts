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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgScrollbar } from 'ngx-scrollbar';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { InfoBox2Component } from '@shared/components/info-box2/info-box2.component';

import { InfoBoxFactorComponent } from '@shared/components/info-box-factor/info-box-factor.component';

import { MatCardModule } from '@angular/material/card';
import {
  Transaction,
  TransactionsWidgetComponent,
} from '@shared/components/transactions-widget/transactions-widget.component';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';
import {
  Project,
  ProjectStatusComponent,
} from '@shared/components/project-status/project-status.component';
import { TodoWidgetComponent } from '@shared/components/todo-widget/todo-widget.component';
import { DocumentListComponent } from '@shared/components/document-list/document-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import {
  ProgressTableFactorComponent,
  SubjectProgress,
} from '@shared/components/progress-table-factor/progress-table-factor.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgxGaugeModule } from 'ngx-gauge';
import { Color, ScaleType, BarChartModule, LineChartModule, AreaChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ExcelXlsxService } from './excel-xlsx.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '@core';
import { relativeTimeThreshold } from 'moment';

import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

type Sent = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

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


function agruparPorCampo(seleccionados: string[], campos: {
    IdCampoDemografico: number;
    NombreCampo: string;
    Valores: { Valor: string }[];
  }[]
): { 
  
  nombreCampo: string; valoresSeleccionados: string[] }[] {
  // 1) Construir un mapa de idCampo → array de valores seleccionados
  const mapa: Record<number, string[]> = {};

  seleccionados.forEach(item => {
    const [idStr, valor] = item.split('|');
    const id = parseInt(idStr, 10);
    if (!idStr || valor === undefined || isNaN(id)) {
      // Si el formato no es válido, lo ignoramos
      return;
    }
    if (!mapa[id]) {
      mapa[id] = [];
    }
    mapa[id].push(valor);
  });

  // 2) Para cada id en el mapa, buscar en "campos" el NombreCampo y devolverlo
  const resultado: { nombreCampo: string; valoresSeleccionados: string[] }[] = [];

  Object.keys(mapa).forEach(key => {
    const id = parseInt(key, 10);
    const entry = campos.find(c => c.IdCampoDemografico === id);
    if (entry) {
      // Eliminar duplicados de valores seleccionados (opcional)
      const únicos = Array.from(new Set(mapa[id]));
      resultado.push({
        nombreCampo: entry.NombreCampo,
        valoresSeleccionados: únicos
      });
    }
    // Si no se encuentra el campo en "campos", se omite
  });

  return resultado;
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
    ProgressTableFactorComponent,MatDividerModule,
    NgApexchartsModule,NgxGaugeModule,
    NgScrollbar,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTooltipModule,
    InfoBoxFactorComponent,
  
    BarChartModule, LineChartModule, AreaChartModule, PieChartModule 
  ],
})
export class Dashboard1Component implements OnInit {
  public areaChartOptions!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public earningOptions!: Partial<ChartOptions>;
  public performanceRateChartOptions!: Partial<ChartOptions>;
  
  filtrosDemograficos = '';
  filtrosGrandesFactores = '';

  langStoreValue?: string;

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
    private excel: ExcelXlsxService, private router: Router,
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
        //this.btnDisabled = false;
      }else{
        this.accessToFilter = false;
        //this.btnDisabled = true;
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
    
    

    if(selectedId > 0){
      //this.editor?.setContent('');
      this.idOrganization = selectedId;
      this.dataSourceClimas = [];
      this.nombreOrganizacion = 'cargando..'
      this.getFlujosLista();
      

    }
    
  }

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

    this.organizacionService.getFiltrosDemograficosRestrictivo(this.idOrganization, this.idFlujo, 1 )
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
    this.getMetricaPorcentajeRespuestas();
    this.getMetricaFactores();
    this.getMetricaConteoPreguntasFactores();
    this.getMetricaSatisfaccionPreguntas();
    this.getMetricaCalificacionGeneralClima();
    this.getMetricaEstadoEnvio();
    this.getMetricaCommentsia();
    this.getMetricaComments();
    this.getMetricaPrcentajeSatisfaccionFactores();


    this.getGrandesFactores();

    this.getDemograficosOrgRestrictivo();

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
    this.organizacionService.getOrganizations()
      .then((response:any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        

      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }

  getOrganizationById(idOrganization:any): void {
    this.organizacionService.getOrganizationById(idOrganization)
        .then((response:any) => {
          ////console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;

          this.idOrganization = idOrganization;
          this.dataSourceClimas = [];
          this.nombreOrganizacion = 'cargando..'
          this.getFlujosLista();
          //this.getDemograficosOrgRestrictivo();

         

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getFlujosLista(): void {

    this.organizacionService.getFlujosLista(this.idOrganization)
        .then((response:any) => {
          ////console.log('Flujos Plantillas:', JSON.stringify(response.data));
          
          this.dataSourceClimas = response.data.data;
          var org = this.dataSourceOrganizations.find((o: { Id: number; }) => o.Id === this.idOrganization);
          this.nombreOrganizacion = org.Nombre;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos:', error);
        });
  };

  //porcentaje satisfacción por factores
  getMetricaFactores(): void {

    this.metricasData = [];

    this.organizacionService.getMetricaFactores(this.idFlujo)
        .then((response:any) => {
          ////console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.metricasData = response.data.data;

          this.gMetricasData = this.groupByGranFactor(this.metricasData);

          

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
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

  getMetricaFactoresFiltradoGF(filtro:string,filtroGf:string): void {

    this.metricasData = [];

    //this.metricasData = [...this.metricasData]

    this.organizacionService.getMetricaFactoresFiltradoGF(this.idFlujo, filtro,filtroGf, this.tipoFiltro)
      .then((response:any) => {
        console.log('Metrica Factores FILTRADO GF:', response.data);
        
        this.metricasData = response.data.data;
        this.metricasData = [...this.metricasData]

        this.gMetricasData = this.groupByGranFactor(this.metricasData);

      })
      .catch((error:any) => {
        console.error('Error al obtener las métricasl:', error);
      });
  };

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
    (s, m) => s + ((m.pct_satisfaccion ?? 0) * (m.total_respuestas ?? 0)),
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

  getMetricaConteoPreguntasFactores(): void {
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

          this.barChartOptions.series = seriessx;
        
        }

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  getMetricaConteoPreguntasFactoresFiltrado(filtro:string): void {
    this.organizacionService.getMetricaConteoPreguntasFactoresFILTRADO(this.idFlujo,filtro)
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

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  getMetricaConteoPreguntasFactoresFiltradoGF(filtro:string,filtroGf:string): void {
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

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  getMetricaSatisfaccionPreguntas(): void {
  this.subjects = [];

  this.organizacionService.getMetricaSatisfaccionPreguntas(this.idFlujo)
    .then((response: any) => {

      this.metricasSatisfaccionPreguntasData = response.data.data;

      if (this.metricasSatisfaccionPreguntasData) {
        // Armado para exportación (usa la nueva transformData)
        this.resultadoParaExcel = transformData(this.metricasSatisfaccionPreguntasData);
        this.resultadoParaExcel.header = {
          nombre_clima: this.nombreFlujo,
          nombre_organizacion: this.nombreOrganizacion
        };
        this.resultadoParaExcel.camposDemograficos = this.camposDemograficosParaExcel;

        // Mapeo a la tabla (usa mean/pctFav/pctDesf/nsat)
        this.metricasSatisfaccionPreguntasData.forEach((preguntax: {
          IdPregunta: number;
          Factor: string;
          Pregunta: string;
          total_respuestas: number;
          total_opt1: number;
          total_opt2: number;
          total_opt3: number;
          total_opt4: number;
          // Nuevos campos esperados desde el SP
          pct_favorable?: number;
          pct_desfavorable?: number;
          nsat?: number;
          mean_0_100?: number;
          mean_1_4?: number;
          // Compat (si todavía llega el alias camelCase)
          pctFav?: number;
          pctDesf?: number;
          mean?: number;
          mean14?: number;
        }) => {

          // Normaliza nombres (acepta snake_case o camelCase)
          const total = Number(preguntax.total_respuestas ?? 0);
          const opt1 = Number(preguntax.total_opt1 ?? 0);
          const opt2 = Number(preguntax.total_opt2 ?? 0);
          const opt3 = Number(preguntax.total_opt3 ?? 0);
          const opt4 = Number(preguntax.total_opt4 ?? 0);

          const pctFav = preguntax.pctFav ?? preguntax.pct_favorable ??
                         this.safePct(opt1 + opt2, total);
          const pctDesf = preguntax.pctDesf ?? preguntax.pct_desfavorable ??
                          this.safePct(opt3 + opt4, total);
          const nsat = (preguntax.nsat != null)
            ? Number(preguntax.nsat)
            : this.round2(pctFav - pctDesf);

          const mean = (preguntax.mean ?? preguntax.mean_0_100) ??
            // fallback: calcula índice 0–100 a partir de conteos
            this.calcMean0to100FromCounts(opt1, opt2, opt3, opt4, total);

          const mean14 = (preguntax.mean14 ?? preguntax.mean_1_4) ??
            this.calcMean1to4FromCounts(opt1, opt2, opt3, opt4, total);

          const subj: SubjectProgress = {
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
        });

        this.subjects = [...this.subjects];
      }
    })
    .catch((error: any) => {
      console.error('Error al obtener las métricas de satisfacción:', error);
    });
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

  getMetricaSatisfaccionPreguntasFiltradoGF(filtro:string,filtroGf:string): void {

    this.subjects = [];

    this.organizacionService.getMetricaSatisfaccionPreguntasFILTRADOGF(this.idFlujo,filtro,filtroGf,this.tipoFiltro)
        .then((response: any) => {

      this.metricasSatisfaccionPreguntasData = response.data.data;

      if (this.metricasSatisfaccionPreguntasData) {
        // Armado para exportación (usa la nueva transformData)
        this.resultadoParaExcel = transformData(this.metricasSatisfaccionPreguntasData);
        this.resultadoParaExcel.header = {
          nombre_clima: this.nombreFlujo,
          nombre_organizacion: this.nombreOrganizacion
        };
        this.resultadoParaExcel.camposDemograficos = this.camposDemograficosParaExcel;

        // Mapeo a la tabla (usa mean/pctFav/pctDesf/nsat)
        this.metricasSatisfaccionPreguntasData.forEach((preguntax: {
          IdPregunta: number;
          Factor: string;
          Pregunta: string;
          total_respuestas: number;
          total_opt1: number;
          total_opt2: number;
          total_opt3: number;
          total_opt4: number;
          // Nuevos campos esperados desde el SP
          pct_favorable?: number;
          pct_desfavorable?: number;
          nsat?: number;
          mean_0_100?: number;
          mean_1_4?: number;
          // Compat (si todavía llega el alias camelCase)
          pctFav?: number;
          pctDesf?: number;
          mean?: number;
          mean14?: number;
        }) => {

          // Normaliza nombres (acepta snake_case o camelCase)
          const total = Number(preguntax.total_respuestas ?? 0);
          const opt1 = Number(preguntax.total_opt1 ?? 0);
          const opt2 = Number(preguntax.total_opt2 ?? 0);
          const opt3 = Number(preguntax.total_opt3 ?? 0);
          const opt4 = Number(preguntax.total_opt4 ?? 0);

          const pctFav = preguntax.pctFav ?? preguntax.pct_favorable ??
                         this.safePct(opt1 + opt2, total);
          const pctDesf = preguntax.pctDesf ?? preguntax.pct_desfavorable ??
                          this.safePct(opt3 + opt4, total);
          const nsat = (preguntax.nsat != null)
            ? Number(preguntax.nsat)
            : this.round2(pctFav - pctDesf);

          const mean = (preguntax.mean ?? preguntax.mean_0_100) ??
            // fallback: calcula índice 0–100 a partir de conteos
            this.calcMean0to100FromCounts(opt1, opt2, opt3, opt4, total);

          const mean14 = (preguntax.mean14 ?? preguntax.mean_1_4) ??
            this.calcMean1to4FromCounts(opt1, opt2, opt3, opt4, total);

          const subj: SubjectProgress = {
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
        });

        this.subjects = [...this.subjects];
      }
    })
    .catch((error: any) => {
      console.error('Error al obtener las métricas de satisfacción:', error);
    });
  };

  //porcentaje general
  getMetricaCalificacionGeneralClima(): void {

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

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };



  getMetricaCalificacionGeneralClimaFiltradoGF(filtro:string,filtroGf:string): void {

    this.organizacionService.getMetricaCalificacionGeneralClimaFiltradoGF(this.idFlujo,filtro,filtroGf, this.tipoFiltro)
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
           
            //this.metricasSatisfaccionGeneralData = [...this.metricasSatisfaccionGeneralData]
          }

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

  getMetricaEstadoEnvio(): void {

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

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

  getMetricaPorcentajeRespuestas(): void {

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

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
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

  
  getMetricaPorcentajeRespuestasFiltradoGF(filtro:string,filtroGf:string): void {

    this.organizacionService.getMetricaPorcentajeRespuestasFiltradoGF(this.idFlujo,filtro,filtroGf)
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

  // Asumiendo que 'metricas' es la lista con los 4 totales y % por factor.
  private construirSeries(factores:any[]): void {

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
        colors: ['#E82742', '#e89f27', '#dbee35', '#6dee24'],
      },
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
    this.organizacionService.getMetricaPorcentajeSatisfaccionFactor(this.idFlujo)
      .then((response:any) => {
        //console.log('Metrica porcentaje satisfaccion Factores:', JSON.stringify(response.data));
        const factores: any[] = response.data.data;
        this.construirSeries(factores);

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

   getMetricaPrcentajeSatisfaccionFactoresFiltrado(filtro:string): void {
    this.organizacionService.getMetricaPorcentajeSatisfaccionFactorFiltrado(this.idFlujo,filtro)
      .then((response:any) => {
        //console.log('Metrica porcentaje satisfaccion Factores:', JSON.stringify(response.data));
        const factores: any[] = response.data.data;
        this.construirSeries(factores);

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(filtro:string,filtroGf:string): void {
    this.organizacionService.getMetricaPorcentajeSatisfaccionFactorFiltradoGF(this.idFlujo,filtro,filtroGf)
      .then((response:any) => {
        //console.log('Metrica porcentaje satisfaccion Factores:', JSON.stringify(response.data));
        const factores: any[] = response.data.data;
        this.construirSeries(factores);

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  //seleccion filtros demograficos
  onSelectionChange(values: string[]): void {
    //this.filtrosChange.emit(this.buildFiltroString(values));
   //console.log('filtros:: ',values);

    var filters = '';

    this.camposDemograficosParaExcel = agruparPorCampo(values, this.campos);

    values.forEach((item:any)=>{
      filters += item + ',';

    });

    this.filtrosDemograficos = filters;

    this.getMetricaFactoresFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaConteoPreguntasFactoresFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaSatisfaccionPreguntasFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaCalificacionGeneralClimaFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaPorcentajeRespuestasFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(filters, this.filtrosGrandesFactores);
    this.getMetricaCommentsIAGF();
    this.getMetricaCommentsGF();
  };

   onGFactorChange(values: string[]): void {

    console.log(values);

    const gFactoresFiltro = values.join(',');

    this.gFactoresFiltrados = gFactoresFiltro;

    console.log('gFactoresFiltro:: ', gFactoresFiltro);

    this.filtrosGrandesFactores = gFactoresFiltro;

    /* */ 

    this.getMetricaFactoresFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaConteoPreguntasFactoresFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaSatisfaccionPreguntasFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaCalificacionGeneralClimaFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaPorcentajeRespuestasFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaPrcentajeSatisfaccionFactoresFiltradoGF(this.filtrosDemograficos,gFactoresFiltro);
    this.getMetricaCommentsIAGF();
    this.getMetricaCommentsGF();
  
  };


  onGenerateReportClick():void{
   
   //console.log('this.resultadoParaExcel:: ', this.resultadoParaExcel);

    this.excel.exportar(this.resultadoParaExcel);
  
    //this.exportarReporte();

  };

  onTipoFiltroSelected(event:MatRadioChange):void{
    console.log(event.value);

    this.tipoFiltro = event.value;

    this.getAllByFilterType();

  }

  getAllByFilterType():void{
    //satisfacción por preguntas
    this.getMetricaSatisfaccionPreguntasFiltradoGF(this.filtrosDemograficos,this.filtrosGrandesFactores);
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
