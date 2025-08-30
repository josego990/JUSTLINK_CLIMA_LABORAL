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
    "Id": 65,
    "IdOrganizacion": 4,
    "NombreOrganizacion": "CATAR-SYS",
    "nombre_organizacion_oficial": "CATAR-SYS",
    "Nombre": "TRANSLATE TO LOAD FILE TEST",
    "Objetivo": "A test to validate translates on climate excel files upload.",
    "FechaInicio": "2025-01-01",
    "FechaFin": "2025-01-01",
    "Frecuencia": "ANUAL",
    "MetodoAplicacion": "Likert",
    "EstimadoMinutos": 60,
    "Anonimato": true,
    "FechaCreacion": "2025-07-18T06:25:19.590",
    "Imagen1Src": "asdf",
    "Imagen2Src": "",
    "Estado": 1,
    "estado_envio": "Creado",
    "estadisticas_envio": "{\"total\":7,\"total_creadas\":0,\"total_enviadas\":7,\"total_iniciadas\":0,\"total_contestadas\":7,\"total_error\":0,\"porcentaje\":100.0,\"total_empleados_activos\":31}",
    "granFactores": [
      {
        "Id": 1,
        "value": "gfactor_1",
        "label": "Gran Factor 1",
        "desc": "Primer gran factor solo para empleados del interior.",
        "FechaCreacion": "2025-08-05T03:30:25.237",
        "series": [
          {
            "Id": 149,
            "value": "serie_0",
            "label": "FUNCTIONALITY",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-07-18T06:51:24.967",
            "fields": [
              {
                "Id": 556,
                "type": "radio",
                "name": "rad_2",
                "label": "The system covers all the tasks I need to perform in my daily work.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 557,
                "type": "radio",
                "name": "rad_3",
                "label": "The available features behave exactly as described in the documentation.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 558,
                "type": "radio",
                "name": "rad_4",
                "label": "I can complete my processes without having to resort to alternative solutions or \"shortcuts.\"",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 559,
                "type": "radio",
                "name": "rad_5",
                "label": "Integration between the different modules or screens is smooth and consistent.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 560,
                "type": "radio",
                "name": "rad_6",
                "label": "Updates provide useful improvements without removing features I use.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 561,
                "type": "iatext",
                "name": "iatxt_7",
                "label": "Write a personal comment about the FUNCTIONALITY of the system.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [],
                "is_active": 1
              }
            ]
          },
          {
            "Id": 150,
            "value": "serie_1",
            "label": "RELIABILITY",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-07-18T06:51:26.610",
            "fields": [
              {
                "Id": 562,
                "type": "radio",
                "name": "rad_9",
                "label": "The application rarely crashes or encounters critical errors.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 563,
                "type": "radio",
                "name": "rad_10",
                "label": "The data I enter is saved correctly without loss or corruption.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 564,
                "type": "radio",
                "name": "rad_11",
                "label": "When a failure occurs, the system recovers the information or resumes operation without issues.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 565,
                "type": "radio",
                "name": "rad_12",
                "label": "he system's response speed remains stable even during peak hours.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 566,
                "type": "radio",
                "name": "rad_13",
                "label": "Notifications or error messages are clear and allow me to continue working quickly.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 567,
                "type": "iatext",
                "name": "iatxt_14",
                "label": "Write a personal comment about the RELIABILITY of the system.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [],
                "is_active": 1
              }
            ]
          }
        ]
      },
      {
        "Id": 2,
        "value": "gfactor_2",
        "label": "Gran Factor 2",
        "desc": "Segundo gran factor para todos los empleados.",
        "FechaCreacion": "2025-08-05T03:31:19.973",
        "series": [
          {
            "Id": 151,
            "value": "serie_2",
            "label": "USABILITY",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-07-18T06:51:28.193",
            "fields": [
              {
                "Id": 568,
                "type": "radio",
                "name": "rad_16",
                "label": "The interface is intuitive and I can find the options I need without difficulty.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 569,
                "type": "radio",
                "name": "rad_17",
                "label": "Texts, icons, and buttons are clear and understandable.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 570,
                "type": "radio",
                "name": "rad_18",
                "label": "It is easy to learn how to use the system without extensive training.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 571,
                "type": "radio",
                "name": "rad_19",
                "label": "Workflows require the minimum number of steps possible to complete a task.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              },
              {
                "Id": 572,
                "type": "radio",
                "name": "rad_20",
                "label": "I can customize the view (e.g., filters or columns) according to my preferences without complications.",
                "required": false,
                "score": 0,
                "min": 0,
                "max": 0,
                "value_correct": "",
                "is_random": false,
                "file_type": "",
                "serie": "",
                "options": [
                  {
                    "value": "opt_1",
                    "label": "TOTALMENTE DE ACUERDO",
                    "name": "opt_1",
                    "is_correct": false
                  },
                  {
                    "value": "opt_2",
                    "label": "DE ACUERDO",
                    "name": "opt_2",
                    "is_correct": false
                  },
                  {
                    "value": "opt_3",
                    "label": "EN DESACUERDO",
                    "name": "opt_3",
                    "is_correct": false
                  },
                  {
                    "value": "opt_4",
                    "label": "TOTALMENTE EN DESACUERDO",
                    "name": "opt_4",
                    "is_correct": false
                  }
                ],
                "is_active": 1
              }
            ]
          }
        ]
      }
    ]
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
