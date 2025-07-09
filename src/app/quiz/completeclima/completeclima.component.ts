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
    "id": 22,
    "idOrganization": 1,
    "contestadas": 0,
    "totalEncuestas": 0,
    "pendientes": 0,
    "totalEmpleados": 0,
    "avatarSrc": "https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2021/11/ovnis.jpg?fit=1600%2C967&quality=70&strip=all&ssl=1",
    "title": "OTRO CLIMA",
    "subtitle": "JUSTLINK",
    "imageSrc1": "",
    "content": "AL SUR COMO A 10 GRADOS, DEBE SER UN SATELITE.",
    "score": 0,
    "completed": false,
    "startDate": "",
    "endDate": "",
    "estado": 1,
    "series": [
        {
            "Id": 44,
            "value": "serie_0",
            "label": "COMUNICACION ORGANIZACIONAL",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-04-28T01:45:23.393",
            "fields": [
                {
                    "Id": 96,
                    "type": "radio",
                    "name": "p_38411",
                    "label": "¿Recibes la información necesaria para realizar tu trabajo?",
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
                    "Id": 97,
                    "type": "radio",
                    "name": "p_99732",
                    "label": "¿La comunicación entre departamentos es efectiva?",
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
                    "Id": 98,
                    "type": "radio",
                    "name": "p_85842",
                    "label": "¿Tus superiores comunican claramente las expectativas?",
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
                    "Id": 99,
                    "type": "radio",
                    "name": "p_5476",
                    "label": "¿Tienes oportunidad de expresar tus ideas en tu equipo?",
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
                    "Id": 100,
                    "type": "radio",
                    "name": "p_12288",
                    "label": "¿La retroalimentación que recibes es clara y útil?",
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
        },
        {
            "Id": 45,
            "value": "serie_1",
            "label": "LIDERAZGO Y GESTION",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-04-28T01:45:23.957",
            "fields": [
                {
                    "Id": 101,
                    "type": "radio",
                    "name": "p_34083",
                    "label": "¿Tu jefe inmediato te apoya en la resolución de problemas?",
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
                    "Id": 102,
                    "type": "radio",
                    "name": "p_65378",
                    "label": "¿Recibes reconocimiento por tu trabajo?",
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
                    "Id": 103,
                    "type": "radio",
                    "name": "p_41163",
                    "label": "¿Tu líder actúa con equidad ante situaciones similares?",
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
                    "Id": 104,
                    "type": "radio",
                    "name": "p_94546",
                    "label": "¿Te sientes valorado por tu jefe inmediato?",
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
                    "Id": 105,
                    "type": "radio",
                    "name": "p_50750",
                    "label": "¿Tu supervisor da el ejemplo con su conducta?",
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
        },
        {
            "Id": 46,
            "value": "serie_2",
            "label": "CONDICIONES DEL ENTORNO LABORAL",
            "desc": "na",
            "score": 0,
            "FechaCreacion": "2025-04-28T01:45:24.497",
            "fields": [
                {
                    "Id": 106,
                    "type": "radio",
                    "name": "p_57702",
                    "label": "¿Tu espacio de trabajo es cómodo y seguro?",
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
                    "Id": 107,
                    "type": "radio",
                    "name": "p_54666",
                    "label": "¿Cuentas con los recursos necesarios para trabajar eficientemente?",
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
                    "Id": 108,
                    "type": "radio",
                    "name": "p_26455",
                    "label": "¿Las herramientas de trabajo están en buen estado?",
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
                    "Id": 109,
                    "type": "radio",
                    "name": "p_32014",
                    "label": "¿La carga de trabajo es adecuada a tus capacidades?",
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
                    "Id": 110,
                    "type": "radio",
                    "name": "p_66079",
                    "label": "¿El ambiente físico (iluminación, ruido, temperatura) es apropiado?",
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
                    "Id": 111,
                    "type": "radio",
                    "name": "p_50727",
                    "label": "PREGUNTA EXTRA!!",
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
    ],
    "fields": [],
    "estadoEnvio": "No procesado",
    "estadisticasEnvio": {
        "total": 0,
        "total_creadas": 0,
        "total_enviadas": 0,
        "total_iniciadas": 0,
        "total_contestadas": 0,
        "total_error": 0,
        "total_empleados_activos": 35
    }
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
