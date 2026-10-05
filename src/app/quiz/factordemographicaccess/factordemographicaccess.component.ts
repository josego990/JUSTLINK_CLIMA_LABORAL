import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '@core';
import { Subscription } from 'rxjs';


import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';


export interface ValorDemografico {
  Valor: string;
  Restringido: boolean;
  RestriccionId?: number;   // lo llenaremos cuando el backend lo devuelva o al pedirlo por keys
  _saving?: boolean;        // UI flag
}

export interface CampoDemografico {
  IdCampoDemografico: number;
  NombreCampo: string;
  TipoDato: string;
  Valores?: ValorDemografico[];
}

export interface GranFactor {
  IdGranFactor: number;
  Clave: string;
  Etiqueta: string;
  Descripcion: string;
  CamposDemograficos: CampoDemografico[];
}

export interface FlujoConfig {
  IdFlujo: number;
  GranFactores: GranFactor[];
}

@Component({
  selector: 'app-factordemographicaccess',
  templateUrl: './factordemographicaccess.component.html',
  styleUrls: ['./factordemographicaccess.component.scss'],
  imports: [
    BreadcrumbComponent,MatFormFieldModule,MatSelectModule,CommonModule,
    MatButtonModule,TranslateModule,
    MatMenuModule,FormsModule,
    MatIconModule,
    MatSlideToggleModule,MatDividerModule,
    NgApexchartsModule,NgxGaugeModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    JoyrideModule,
  
    BarChartModule, LineChartModule, AreaChartModule, PieChartModule 
  ],
})




export class FactorDemographicAccessComponent implements OnDestroy, OnInit {

  

  langStoreValue?: string;

  public idOrganization =  0;
  public nombreOrganizacion = '';
  public idFlujo =  0;
  public nombreFlujo = ''; 
  public objetivoFlujo = '';
  public imgFlujo = '';

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
  private selectedOrganizationSubscription?: Subscription;

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

  data: FlujoConfig | null = null;
  loading = false;
  loadingClimates = false;
  error: string | null = null;
  climateError: string | null = null;


  public seriess:any = []

  constructor(private languageService: LanguageService,private translate: TranslateService,
    private organizacionService: OrganizacionService, private authService: AuthService,
    private router: Router,
    private joyrideService: JoyrideService,
    private snackBar: MatSnackBar,
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
      const found = this.existsRoute(routes, 'dashboard/factordemographicaccess');
     //console.log(found);

      if(false){
        this.router.navigate(['/authentication/page404']);
      }
      
      this.data = null;

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


    if(this.authService.currentUserValue?.roles[0].roleName !== 'admin') {

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

    }

    this.setupSelectedOrganizationListener();




  }

  startAccessTour(): void {
    setTimeout(() => {
      const candidates = [
        'factorAccessOverview',
        'factorAccessClimate',
        'factorAccessSummary',
        'factorAccessStatuses',
        'factorAccessFactors'
      ];
      const steps = candidates.filter((step) =>
        document.querySelector(`[joyrideStep="${step}"]`)
      );

      this.joyrideService.startTour({
        steps,
        showPrevButton: true,
        customTexts: {
          prev: this.translate.instant('MENUITEMS.TOUR.NAV.PREV'),
          next: this.translate.instant('MENUITEMS.TOUR.NAV.NEXT'),
          done: this.translate.instant('MENUITEMS.TOUR.NAV.DONE'),
          close: this.translate.instant('MENUITEMS.TOUR.NAV.CLOSE')
        }
      }).subscribe();
    }, 100);
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.idOrganization = 0;
        this.nombreOrganizacion = '';
        this.idFlujo = 0;
        this.nombreFlujo = '';
        this.dataSourceOrganizations = [];
        this.dataSourceClimas = [];
        this.data = null;
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.idOrganization === organization.Id) {
        this.nombreOrganizacion = organization.Nombre;
        return;
      }

      this.onOrganizationChange(organization.Id);
    });
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
      this.idFlujo = 0;
      this.nombreFlujo = '';
      this.objetivoFlujo = '';
      this.imgFlujo = '';
      this.dataSourceClimas = [];
      this.nombreOrganizacion = 'cargando..'
      this.getFlujosLista();
      
      this.data = null;

    }
    
  }


  onClimaChange(selectedId: number) {

   

    //console.log('Se seleccionó el clima con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    this.idFlujo = Number(selectedId) || 0;
    this.data = null;
    this.error = null;

    if (!this.idFlujo) {
      this.nombreFlujo = '';
      this.objetivoFlujo = '';
      this.imgFlujo = '';
      return;
    }

    const clima  = this.dataSourceClimas.find((c: { Id: number; }) => c.Id === this.idFlujo);
    if(this.accessToExport){
      this.btnDisabled = false;
    }
    
    ////console.log('clima:: ', clima);
    this.nombreFlujo = clima?.Nombre ?? '';
    this.objetivoFlujo = clima?.Objetivo ?? '';
    this.imgFlujo = clima?.Imagen1Src ?? '';

    this.getFactoresAccesos();


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
          //this.getDemograficosOrgRestrictivo();

         

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getFlujosLista(): void {
    this.loadingClimates = true;
    this.climateError = null;
    this.organizacionService.getFlujosLista(this.idOrganization)
        .then((response:any) => {
          ////console.log('Flujos Plantillas:', JSON.stringify(response.data));
          
          this.dataSourceClimas = response?.data?.data ?? [];
          var org = this.dataSourceOrganizations.find((o: { Id: number; }) => o.Id === this.idOrganization);
          this.nombreOrganizacion = org?.Nombre ?? this.nombreOrganizacion;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos:', error);
          this.dataSourceClimas = [];
          this.climateError = this.translate.instant('MENUITEMS.QUIZ.FACTOR_ACCESS.CLIMATE_LOAD_ERROR');
        })
        .finally(() => {
          this.loadingClimates = false;
        });
  };

  getFactoresAccesos(): void {
    this.loading = true;
    this.error = null;
    this.organizacionService.getGFactorsAccessByIdFlujo(this.idFlujo)
        .then((response:any) => {
          ////console.log('Flujos Plantillas:', JSON.stringify(response.data));
          
          console.log(response);

          this.data = response?.data ?? null;
          
         

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos:', error);
          this.data = null;
          this.error = this.translate.instant('MENUITEMS.QUIZ.FACTOR_ACCESS.ACCESS_LOAD_ERROR');
        })
        .finally(() => {
          this.loading = false;
        });
  };















  



  ///////////////////////////////////////

  trackByGF = (_: number, gf: GranFactor) => gf.IdGranFactor;
  trackByCD = (_: number, cd: CampoDemografico) => cd.IdCampoDemografico;
  trackByVal = (_: number, v: ValorDemografico) => v.Valor;

 

  onTodosUpdated(updatedTodos: any[]) {
    //console.log('Todos updated:', updatedTodos);
  }



  getRestrCountGF(gf: GranFactor): number {
    let count = 0;
    gf.CamposDemograficos?.forEach(cd => {
      cd.Valores?.forEach(v => { if (v.Restringido) count++; });
    });
    return count;
  }

  get totalGrandFactors(): number {
    return this.data?.GranFactores?.length ?? 0;
  }

  get totalDemographicFields(): number {
    const fieldIds = new Set<number>();
    this.data?.GranFactores?.forEach((gf) => {
      gf.CamposDemograficos?.forEach((field) => fieldIds.add(field.IdCampoDemografico));
    });
    return fieldIds.size;
  }

  get totalSegmentValues(): number {
    return (this.data?.GranFactores ?? []).reduce(
      (factorTotal, gf) => factorTotal + (gf.CamposDemograficos ?? []).reduce(
        (fieldTotal, field) => fieldTotal + (field.Valores?.length ?? 0),
        0
      ),
      0
    );
  }

  get totalRestrictedValues(): number {
    return (this.data?.GranFactores ?? []).reduce(
      (total, gf) => total + this.getRestrCountGF(gf),
      0
    );
  }

  get totalAllowedValues(): number {
    return Math.max(this.totalSegmentValues - this.totalRestrictedValues, 0);
  }

  getAllowedCount(field: CampoDemografico): number {
    return (field.Valores ?? []).filter((value) => !value.Restringido).length;
  }

  getRestrictedCount(field: CampoDemografico): number {
    return (field.Valores ?? []).filter((value) => value.Restringido).length;
  }

  async onToggle(
    gf: GranFactor,
    cd: CampoDemografico,
    v: ValorDemografico,
    checked: boolean
  ) {
    if (!this.data) return;
    const previousRestricted = v.Restringido;
    v._saving = true;

    console.log('TODOS LOS VALORES::');
    console.log(JSON.stringify(gf) + ' - ' + JSON.stringify(cd) + ' - ' + JSON.stringify(v) + ' - ' + checked);

   

    try {
      if (checked) {
         var update_data = {
          "IdFlujo": this.idFlujo,
          "IdGranFactor": gf.IdGranFactor,
          "IdCampoDemografico": cd.IdCampoDemografico,
          "Valor": v.Valor,
          "Estado": 0,
          "UsuarioCreacion": "optimusPrime"
        }
        await this.organizacionService.updateGFactorsAccessByIdFlujo(update_data);
        v.Restringido = false;
       
      } else {
        var update_data = {
          "IdFlujo": this.idFlujo,
          "IdGranFactor": gf.IdGranFactor,
          "IdCampoDemografico": cd.IdCampoDemografico,
          "Valor": v.Valor,
          "Estado": 1,
          "UsuarioCreacion": "optimusPrime"
        }
        await this.organizacionService.updateGFactorsAccessByIdFlujo(update_data);

        v.Restringido = true;
      }
    } catch (e) {
      // revertir UI si falló
      v.Restringido = previousRestricted;
      console.error(e);
      this.snackBar.open(
        this.translate.instant('MENUITEMS.QUIZ.FACTOR_ACCESS.UPDATE_ERROR'),
        this.translate.instant('MENUITEMS.QUIZ.FACTOR_ACCESS.CLOSE'),
        { duration: 4500 }
      );
    } finally {
      v._saving = false;
    }
  }

}
