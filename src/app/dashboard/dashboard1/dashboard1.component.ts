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

interface Todo {
  title: string;
  done: boolean;
  priority: 'Low' | 'Normal' | 'High';
}

interface ItemOriginal {
  IdPregunta: number;
  Factor: string;
  Pregunta: string;
  total_respuestas: number;
  total_opt1: number;
  total_opt2: number;
  total_opt3: number;
  total_opt4: number;
  pct_satisfaccion: number;
}

interface ItemTransformado extends ItemOriginal {
  pct_opt1: number;
  pct_opt2: number;
  pct_opt3: number;
  pct_opt4: number;
  pct_insatisfaccion: number;
}

interface ResumenFactor {
  total_respuestas: number;
  total_opt1: number;
  total_opt2: number;
  total_opt3: number;
  total_opt4: number;
  pct_opt1: number;
  pct_opt2: number;
  pct_opt3: number;
  pct_opt4: number;
  pct_satisfaccion: number;
  pct_insatisfaccion: number;
}

interface FactorGroup {
  preguntas: ItemTransformado[];
  resumen: ResumenFactor;
}

type Resultado = Record<string, FactorGroup>;


function transformData(data: ItemOriginal[]): Resultado {
  const out: Resultado = {};

  // 1) Recorremos cada ítem
  data.forEach(item => {
    const {
      Factor,
      total_respuestas: total,
      total_opt1,
      total_opt2,
      total_opt3,
      total_opt4,
      pct_satisfaccion
    } = item;

    // calculamos porcentajes por opción
    const pct_opt1 = parseFloat(((total_opt1 / total) * 100).toFixed(2));
    const pct_opt2 = parseFloat(((total_opt2 / total) * 100).toFixed(2));
    const pct_opt3 = parseFloat(((total_opt3 / total) * 100).toFixed(2));
    const pct_opt4 = parseFloat(((total_opt4 / total) * 100).toFixed(2));
    const pct_insatisfaccion = parseFloat((100 - pct_satisfaccion).toFixed(2));

    const nuevo: ItemTransformado = {
      ...item,
      pct_opt1,
      pct_opt2,
      pct_opt3,
      pct_opt4,
      pct_insatisfaccion
    };

    // inicializar grupo si no existe
    if (!out[Factor]) {
      out[Factor] = {
        preguntas: [],
        resumen: {
          total_respuestas: 0,
          total_opt1: 0,
          total_opt2: 0,
          total_opt3: 0,
          total_opt4: 0,
          pct_opt1: 0,
          pct_opt2: 0,
          pct_opt3: 0,
          pct_opt4: 0,
          pct_satisfaccion: 0,
          pct_insatisfaccion: 0
        }
      };
    }

    // añadir la pregunta transformada
    out[Factor].preguntas.push(nuevo);

    // acumular totales para el resumen
    const r = out[Factor].resumen;
    r.total_respuestas += total;
    r.total_opt1         += total_opt1;
    r.total_opt2         += total_opt2;
    r.total_opt3         += total_opt3;
    r.total_opt4         += total_opt4;
  });

  // 2) Calculamos los porcentajes finales por factor
  Object.values(out).forEach(({ resumen: r }) => {
    const t = r.total_respuestas;
    if (t > 0) {
      r.pct_opt1 = parseFloat(((r.total_opt1 / t) * 100).toFixed(2));
      r.pct_opt2 = parseFloat(((r.total_opt2 / t) * 100).toFixed(2));
      r.pct_opt3 = parseFloat(((r.total_opt3 / t) * 100).toFixed(2));
      r.pct_opt4 = parseFloat(((r.total_opt4 / t) * 100).toFixed(2));
      r.pct_satisfaccion    = parseFloat((((r.total_opt1 + r.total_opt2) / t) * 100).toFixed(2));
      r.pct_insatisfaccion  = parseFloat((100 - r.pct_satisfaccion).toFixed(2));
    }
  });

  return out;
};

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
    MatButtonModule,TranslateModule,
    MatMenuModule,FormsModule,
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

  public estadoEnvio = '';
  public totalCreadas = 0;
  public totalEnviadas = 0;
  public totalContestadas = 0;
  public totalEmplados = 0;
  public porcentajeEnvio = 0;
  public totalPendientes = 0;


  public isButtonDisabled = true;
  public dataSourceOrganizations:any = [];
  public dataSourceClimas:any = [];
  public html = '';
  public metricasData:any =[];
  public commentsData:any =[];
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
     //console.log('RUTAS DESDE sessionStorage:: ', routes);

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

  

    this.chart1();
    this.chart3();

    this.chart4();
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
      this.getDemograficosOrg();

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
    this.getMetricaComments();
    this.getMetricaPrcentajeSatisfaccionFactores();


   

  };

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
          this.getDemograficosOrg();

         

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

  getMetricaFactores(): void {

    this.organizacionService.getMetricaFactores(this.idFlujo)
        .then((response:any) => {
          ////console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.metricasData = response.data.data;

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

      })
      .catch((error:any) => {
        console.error('Error al obtener los flujos plantillas:', error);
      });
  };

  getMetricaComments(): void {

    this.organizacionService.getMetricaComments(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Factores:', JSON.stringify(response.data));
          
          this.commentsData = response.data.data;

          this.commentsData.forEach((factor:any) => {
            factor.ComentariosJSON = JSON.parse(factor.ComentariosJSON);
          });

          this.commentsData = [...this.commentsData];

          //console.log('commentsData ahora::' , this.commentsData);

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

  getMetricaSatisfaccionPreguntas(): void {

    this.subjects = [];

    this.organizacionService.getMetricaSatisfaccionPreguntas(this.idFlujo)
        .then((response:any) => {
          //console.log('Metrica Satisfaccion Preguntas:', JSON.stringify(response.data));
          
          this.metricasSatisfaccionPreguntasData = response.data.data;

          if(this.metricasSatisfaccionPreguntasData){
                        
            this.resultadoParaExcel = transformData(this.metricasSatisfaccionPreguntasData);

            //agregar encabezado
            this.resultadoParaExcel.header = {
              "nombre_clima": this.nombreFlujo,
              "nombre_organizacion": this.nombreOrganizacion
            }

            //agregar campos adicionales
           //console.log('this.campos:: ', this.campos);

            //var camposDem = [];

            this.resultadoParaExcel.camposDemograficos = this.camposDemograficosParaExcel;

           //console.log('resultado para excel:: ', this.resultadoParaExcel);

            this.metricasSatisfaccionPreguntasData.forEach((preguntax: { 
              Factor: string, Pregunta: string, total_respuestas: number, 
              pct_satisfaccion: number, IdPregunta: number,
              total_opt1: number,
              total_opt2: number, 
              total_opt3: number,
              total_opt4: number
            
            }) => {
              
                var subj: SubjectProgress = 
                  { subject: preguntax.Pregunta, 
                    progress: preguntax.pct_satisfaccion, 
                    duration: preguntax.total_respuestas + ' Respuestas',
                    factor: preguntax.Factor,
                    
                    totacuerdo: preguntax.total_opt1,
                    acuerdo: preguntax.total_opt2,
                    desacuerdo: preguntax.total_opt3,
                    totdesacuerdo: preguntax.total_opt4,
                  
                                    
                  };

                this.subjects.push(subj);                

            });

            this.subjects = [ ...this.subjects ];
           
          }

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

   getMetricaSatisfaccionPreguntasFiltrado(filtro:string): void {

    this.subjects = [];

    this.organizacionService.getMetricaSatisfaccionPreguntasFILTRADO(this.idFlujo,filtro)
        .then((response:any) => {
          ////console.log('Metrica Satisfaccion Preguntas:', JSON.stringify(response.data));
          
          this.metricasSatisfaccionPreguntasData = response.data.data;

          if(this.metricasSatisfaccionPreguntasData){
            
            this.resultadoParaExcel = transformData(this.metricasSatisfaccionPreguntasData);

            //agregar encabezado
            this.resultadoParaExcel.header = {
              "nombre_clima": this.nombreFlujo,
              "nombre_organizacion": this.nombreOrganizacion
            }

            //agregar campos adicionales
           //console.log('this.campos:: ', this.campos);

            //var camposDem = [];

            this.resultadoParaExcel.camposDemograficos = this.camposDemograficosParaExcel;

           //console.log('resultado para excel:: ', this.resultadoParaExcel);
            
            this.metricasSatisfaccionPreguntasData.forEach((preguntax: { 
              Factor: string, Pregunta: string, total_respuestas: number, 
              pct_satisfaccion: number, IdPregunta: number,
              total_opt1: number,
              total_opt2: number, 
              total_opt3: number,
              total_opt4: number
            
            }) => {
              
                var subj: SubjectProgress = 
                  { subject: preguntax.Pregunta, 
                    progress: preguntax.pct_satisfaccion, 
                    duration: preguntax.total_respuestas + ' Respuestas',
                    factor: preguntax.Factor,
                    
                    totacuerdo: preguntax.total_opt1,
                    acuerdo: preguntax.total_opt2,
                    desacuerdo: preguntax.total_opt3,
                    totdesacuerdo: preguntax.total_opt4,
                  
                                    
                  };

                this.subjects.push(subj);                

            });

            this.subjects = [ ...this.subjects ];
           
          }

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  };

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

  getMetricaCalificacionGeneralClimaFiltrado(filtro:string): void {

    this.organizacionService.getMetricaCalificacionGeneralClimaFiltrado(this.idFlujo,filtro)
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

  onSelectionChange(values: string[]): void {
    //this.filtrosChange.emit(this.buildFiltroString(values));
   //console.log('filtros:: ',values);

    var filters = '';



    this.camposDemograficosParaExcel = agruparPorCampo(values, this.campos);

   //console.log('this.camposDemograficosParaExcel::',this.camposDemograficosParaExcel);

    values.forEach((item:any)=>{
      filters += item + ',';

    });






    this.getMetricaFactoresFiltrado(filters);
    this.getMetricaConteoPreguntasFactoresFiltrado(filters);
    this.getMetricaSatisfaccionPreguntasFiltrado(filters);
    this.getMetricaCalificacionGeneralClimaFiltrado(filters);
    this.getMetricaPorcentajeRespuestasFiltrado(filters);
    this.getMetricaPrcentajeSatisfaccionFactoresFiltrado(filters);
  };


  onGenerateReportClick():void{
   
   //console.log('this.resultadoParaExcel:: ', this.resultadoParaExcel);

    this.excel.exportar(this.resultadoParaExcel);
  
    //this.exportarReporte();

  };























  



  ///////////////////////////////////////

  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'New Clients',
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: 'Old Clients',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4FC3F7', '#7460EE'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19',
          '2018-09-20',
          '2018-09-21',
          '2018-09-22',
          '2018-09-23',
          '2018-09-24',
          '2018-09-25',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
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

  private chart3() {
    this.earningOptions = {
      series: [
        {
          name: '2019',
          data: [15, 48, 36, 20, 40, 60, 35, 20, 16, 31, 22, 11],
        },
        {
          name: '2018',
          data: [8, 22, 60, 35, 17, 24, 48, 37, 56, 22, 32, 38],
        },
      ],
      chart: {
        height: 320,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: 'smooth',
        dashArray: [0, 8],
      },
      colors: ['#8793ea', '#4caf50'],
      fill: {
        opacity: [1, 0.5],
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: {
          style: {
            colors: '#8e8da4',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8e8da4',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      tooltip: {
        theme: 'dark',
      },
    };
  }

  private chart4() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Bill Amount',
          data: [113, 120, 130, 120, 125, 119, 126],
        },
      ],
      chart: {
        height: 360,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      colors: ['#6777EF'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Bill Amount($)',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
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
  // transactions

  transactions: Transaction[] = [
    {
      type: 'Bank Transfer',
      category: 'Bank Transfer',
      description: 'Send money',
      amount: 100.65,
      icon: 'account_balance',
      iconColor: 'green',
      textColor: 'orange',
    },
    {
      type: 'Wallet',
      category: 'Wallet',
      description: 'Wallet recharge',
      amount: 2000,
      icon: 'account_balance_wallet',
      iconColor: 'orange',
      textColor: 'green',
    },
    {
      type: 'Credit Card',
      category: 'Credit Card',
      description: 'Ordered Food',
      amount: 25.69,
      icon: 'credit_card',
      iconColor: 'purple',
      textColor: 'orange',
    },
    {
      type: 'Cash Payment',
      category: 'Cash Payment',
      description: 'Sell Stationery',
      amount: 148.47,
      icon: 'attach_money',
      iconColor: 'blue',
      textColor: 'green',
    },
    {
      type: 'Debit Card',
      category: 'Debit Card',
      description: 'ATM Withdraw',
      amount: 100.65,
      icon: 'credit_card',
      iconColor: 'red',
      textColor: 'orange',
    },
    {
      type: 'Bank Transfer',
      category: 'Bank Transfer',
      description: 'Send money',
      amount: 100.65,
      icon: 'account_balance',
      iconColor: 'green',
      textColor: 'orange',
    },
  ];

  // invoice data

  invoiceData = [
    {
      invoiceNo: '#IN7865',
      clientName: 'John Doe',
      dueDate: '12/05/2016',
      status: 'Paid',
      total: '$500',
      img: 'assets/images/user/user1.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN2301',
      clientName: 'Sarah Smith',
      dueDate: '03/31/2016',
      status: 'Not Paid',
      total: '$372',
      img: 'assets/images/user/user2.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN7239',
      clientName: 'Airi Satou',
      dueDate: '04/14/2017',
      status: 'Partially Paid',
      total: '$1038',
      img: 'assets/images/user/user3.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN1482',
      clientName: 'Angelica Ramos',
      dueDate: '08/11/2017',
      status: 'Paid',
      total: '$872',
      img: 'assets/images/user/user4.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN8526',
      clientName: 'Ashton Cox',
      dueDate: '02/15/2018',
      status: 'Not Paid',
      total: '$2398',
      img: 'assets/images/user/user5.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN2473',
      clientName: 'Cara Stevens',
      dueDate: '01/28/2017',
      status: 'Paid',
      total: '$834',
      img: 'assets/images/user/user6.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN7366',
      clientName: 'Jacob Ryan',
      dueDate: '03/11/2017',
      status: 'Partially Paid',
      total: '$147',
      img: 'assets/images/user/user7.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN5642',
      clientName: 'Emily Walker',
      dueDate: '09/12/2018',
      status: 'Paid',
      total: '$650',
      img: 'assets/images/user/user8.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN1457',
      clientName: 'Michael Brown',
      dueDate: '04/20/2019',
      status: 'Not Paid',
      total: '$1220',
      img: 'assets/images/user/user9.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN9083',
      clientName: 'Olivia Green',
      dueDate: '10/03/2020',
      status: 'Partially Paid',
      total: '$850',
      img: 'assets/images/user/user10.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN3379',
      clientName: 'David Lee',
      dueDate: '06/25/2021',
      status: 'Paid',
      total: '$1295',
      img: 'assets/images/user/user11.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
    {
      invoiceNo: '#IN9874',
      clientName: 'Sophia Johnson',
      dueDate: '01/18/2022',
      status: 'Not Paid',
      total: '$320',
      img: 'assets/images/user/user2.jpg',
      invoiceLink: '#/admin/accounts/invoice',
    },
  ];

  invoiceColumnDefinitions = [
    { def: 'invoiceNo', label: 'Invoice No', type: 'text' },
    { def: 'clientName', label: 'Client Name', type: 'text' },
    { def: 'dueDate', label: 'Due Date', type: 'date' },
    { def: 'status', label: 'Status', type: 'badge' },
    { def: 'total', label: 'Total', type: 'currency' },
    { def: 'actions', label: 'Actions', type: 'actionBtn' },
  ];

  // project status

  projects: Project[] = [
    {
      name: 'Angular App',
      progress: 90,
      progressColor: 'green-progress',
    },
    {
      name: 'Java Software',
      progress: 54,
      progressColor: 'red-progress',
    },
    {
      name: 'Html Website',
      progress: 68,
      progressColor: 'sky-progress',
    },
    {
      name: 'IOS App',
      progress: 40,
      progressColor: 'orange-progress',
    },
    {
      name: 'Python Project',
      progress: 28,
      progressColor: 'green-progress',
    },
    {
      name: 'Reactjs App',
      progress: 89,
      progressColor: 'sky-progress',
    },
    {
      name: 'Node.js API',
      progress: 75,
      progressColor: 'green-progress',
    },
    {
      name: 'Flutter App',
      progress: 56,
      progressColor: 'orange-progress',
    },
    {
      name: 'C# Application',
      progress: 63,
      progressColor: 'red-progress',
    },
    {
      name: 'JavaScript Tutorial',
      progress: 80,
      progressColor: 'sky-progress',
    },
    {
      name: 'Vue.js Project',
      progress: 45,
      progressColor: 'green-progress',
    },
  ];

  // TODO start
  tasks: Todo[] = [
    { title: 'Buy groceries', done: false, priority: 'Normal' },
    { title: 'Finish project report', done: false, priority: 'High' },
    { title: 'Clean the house', done: true, priority: 'Low' },
    { title: 'Call the bank', done: false, priority: 'Normal' },
    { title: 'Read a book', done: false, priority: 'Low' },
    { title: 'Schedule doctor appointment', done: false, priority: 'High' },
    { title: 'Prepare for presentation', done: false, priority: 'Normal' },
    { title: 'Exercise for 30 minutes', done: false, priority: 'Normal' },
    { title: 'Finish laundry', done: true, priority: 'Low' },
    { title: 'Write blog post', done: false, priority: 'High' },
    { title: 'Organize workspace', done: false, priority: 'Normal' },
    { title: 'Plan weekend trip', done: false, priority: 'High' },
    { title: 'Buy gifts for friends', done: false, priority: 'Low' },
  ];

  onTodoToggled(todo: any) {
    //console.log('Todo toggled:', todo);
  }

  onTodosUpdated(updatedTodos: any[]) {
    //console.log('Todos updated:', updatedTodos);
  }
  // TODO end

  // document list

  documentList = [
    {
      title: 'Java Programming',
      type: '.doc',
      size: 4.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
    {
      title: 'Angular Theory',
      type: '.xls',
      size: 2.5,
      icon: 'far fa-file-excel',
      iconClass: 'success-rgba text-success',
      textClass: '',
    },
    {
      title: 'Maths Sums Solution',
      type: '.pdf',
      size: 10.5,
      icon: 'far fa-file-pdf',
      iconClass: 'danger-rgba text-danger',
      textClass: '',
    },
    {
      title: 'Submit Science Journal',
      type: '.zip',
      size: 53.2,
      icon: 'far fa-file-archive',
      iconClass: 'info-rgba text-info',
      textClass: '',
    },
    {
      title: 'Marketing Instructions',
      type: '.doc',
      size: 5.3,
      icon: 'far fa-file-word',
      iconClass: 'primary-rgba text-primary',
      textClass: '',
    },
  ];

  // projects

  projectData = [
    {
      projectName: 'Project A',
      employeesTeam: [
        { name: 'John Doe', avatar: 'user1.jpg' },
        { name: 'Jane Smith', avatar: 'user2.jpg' },
        { name: 'Bob Johnson', avatar: 'user3.jpg' },
        { name: 'Alice Williams', avatar: 'user4.jpg' },
      ],
      teamLeader: 'John Doe',
      priority: 'Medium',
      openTask: 19,
      completedTask: 10,
      status: 'Pending',
      documents: 'Contract.pdf',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project B',
      employeesTeam: [
        { name: 'Sarah Smith', avatar: 'user7.jpg' },
        { name: 'Michael Johnson', avatar: 'user2.jpg' },
        { name: 'Emily Davis', avatar: 'user8.jpg' },
      ],
      teamLeader: 'Sarah Smith',
      priority: 'Low',
      openTask: 25,
      completedTask: 18,
      status: 'In Progress',
      documents: 'Proposal.pdf',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project C',
      employeesTeam: [
        { name: 'Olivia Brown', avatar: 'user9.jpg' },
        { name: 'James Lee', avatar: 'user10.jpg' },
        { name: 'Sophia Wilson', avatar: 'user11.jpg' },
      ],
      teamLeader: 'Olivia Brown',
      priority: 'High',
      openTask: 30,
      completedTask: 25,
      status: 'Completed',
      documents: 'Final_Report.pdf',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project D',
      employeesTeam: [
        { name: 'David Martinez', avatar: 'user2.jpg' },
        { name: 'Isabella Taylor', avatar: 'user8.jpg' },
        { name: 'Lucas White', avatar: 'user7.jpg' },
      ],
      teamLeader: 'David Martinez',
      priority: 'Low',
      openTask: 15,
      completedTask: 10,
      status: 'Pending',
      documents: 'Initial_Design.pdf',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project E',
      employeesTeam: [
        { name: 'Ethan Green', avatar: 'user5.jpg' },
        { name: 'Mia Clark', avatar: 'user6.jpg' },
        { name: 'Daniel Harris', avatar: 'user9.jpg' },
        { name: 'Charlotte Lewis', avatar: 'user8.jpg' },
      ],
      teamLeader: 'Ethan Green',
      priority: 'Medium',
      openTask: 40,
      completedTask: 30,
      status: 'Completed',
      documents: 'Budget_Sheet.xlsx',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project F',
      employeesTeam: [
        { name: 'Jack Robinson', avatar: 'user2.jpg' },
        { name: 'Lily Walker', avatar: 'user1.jpg' },
        { name: 'Henry Adams', avatar: 'user4.jpg' },
      ],
      teamLeader: 'Jack Robinson',
      priority: 'High',
      openTask: 12,
      completedTask: 10,
      status: 'In Progress',
      documents: 'Timeline_GanttChart.xlsx',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project G',
      employeesTeam: [
        { name: 'Ava Scott', avatar: 'user2.jpg' },
        { name: 'David Moore', avatar: 'user5.jpg' },
        { name: 'Emma Taylor', avatar: 'user4.jpg' },
        { name: 'Lucas White', avatar: 'user7.jpg' },
        { name: 'Pankaj Patel', avatar: 'user3.jpg' },
      ],
      teamLeader: 'Ava Scott',
      priority: 'Low',
      openTask: 22,
      completedTask: 14,
      status: 'Completed',
      documents: 'Research_Notes.pdf',
      actions: 'Edit, Delete',
    },
    {
      projectName: 'Project H',
      employeesTeam: [
        { name: 'Sophia Miller', avatar: 'user10.jpg' },
        { name: 'Jackson Harris', avatar: 'user11.jpg' },
        { name: 'Ella Clark', avatar: 'user2.jpg' },
      ],
      teamLeader: 'Sophia Miller',
      priority: 'High',
      openTask: 17,
      completedTask: 16,
      status: 'Completed',
      documents: 'User_Guide.pdf',
      actions: 'Edit, Delete',
    },
  ];

  projectColumnDefinitions = [
    { def: 'projectName', label: 'Project Name', type: 'text' },
    { def: 'employeesTeam', label: 'Employee Team', type: 'team' },
    { def: 'teamLeader', label: 'Team Leaders', type: 'text' },
    { def: 'priority', label: 'Priority', type: 'priority' },
    { def: 'openTask', label: 'Open Task', type: 'text' },
    { def: 'completedTask', label: 'Completed Task', type: 'text' },
    { def: 'status', label: 'Status', type: 'text' },
    { def: 'documents', label: 'Documents', type: 'file' },
    { def: 'actions', label: 'Actions', type: 'actionBtn' },
  ];
}
