import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { Quiz, Field, Serie } from '../models/quiz-models';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
export interface ItemParams {
  id: number;
  type: string;
  name: string;
  label: string;
  required: string;
  score: string;
  options: Array<string>;
  value_correct: string;
  file_type: string;
}

@Component({
  selector: 'app-completeclima',
  templateUrl: './completeclima.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }], 
  imports: [
    BreadcrumbComponent,
    DynamicFormComponent
    

    ],

})
export class CompleteClimaComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  formConfig: Quiz = {
    id: 0,
    idOrganization: 0,
    contestadas: 1,
    totalEncuestas: 1,
    pendientes: 1,
    totalEmpleados: 1,
    avatarSrc: 'string',
    title: 'string',
    subtitle: 'string',
    imageSrc1: 'string',
    content: 'string',
    score: 0,
    completed: false,
    startDate: ' ',
    endDate: ' ',
    estado:1,
    estadoEnvio: ' ',
    tipoEvaluacion: 'string',
    granFactores:[],
    series: [],
    fields: [
   
    ],

    estadisticasEnvio: {
      total: 0,
      total_creadas: 0,
      total_enviadas: 0,
      total_iniciadas: 0,
      total_contestadas: 0,
      total_error: 0,
      total_empleados_activos: 0,
      porcentaje: 0

    }
  };

  newUserImg = 'assets/images/user/user1.jpg';

  selectedOption?: string;
  SortType = SortType;

  displayedColumns: string[] = [
    'id',
    'type',
    'name',
    'label',
    'required',
    'score',
    'value_correct',
    'file_type', 'actions'
  ];

  public DATOS:any = [
    "JUAN EL MEJOR PROGRAMADOR","CATARSYS","CLIMA DINAMICO PUTA MADRE"
  ];

  public ponderacion = 0;
  public ponderacion_rest = 0;
  public selectedFieldType = 'text';
  public qname = '';
  public qdesc = '';
  public addTextForm!: UntypedFormGroup;
  public id_card = 0;
  public title_card = '';
  public quiz: any = {
    
  };

  constructor(private fb: UntypedFormBuilder)
  {

    

  }


  public ngOnInit(): void {
    //console.log('ngOnInit()');

    this.formConfig.series = this.quiz.series;
    this.title_card = this.quiz.title;

  }




}
