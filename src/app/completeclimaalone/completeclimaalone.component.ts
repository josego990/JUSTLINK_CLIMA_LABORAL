import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormComponent } from '../quiz/dynamic-form/dynamic-form.component';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { CommonModule } from '@angular/common'; 
import { Quiz } from 'app/quiz/models/quiz-models';
import Swal from 'sweetalert2';

import { ConfigService } from '@config';
import { AuthService, LanguageService } from '@core'; 
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core'; 

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TurnstileComponent } from '../shared/components/turnstile/turnstile.component';

@Component({
  selector: 'app-completeclimaalone',
  templateUrl: './completeclimaalone.component.html',
  styleUrls: ['./completeclimaalone.component.scss'],
  
  imports: [
    CommonModule,
    DynamicFormComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    TranslateModule,
    TurnstileComponent,
  ],
})
export class CompleteclimaaloneComponent implements OnInit {
  @ViewChild(DynamicFormComponent)
  dynamicFormComponent!: DynamicFormComponent;
  @ViewChild(TurnstileComponent)
  turnstileComponent?: TurnstileComponent;
    flagvalue: string | string[] | undefined;
    countryName: string | string[] = [];
    langStoreValue?: any;
    defaultFlag?: string;

    public idEmpleado = 0;
    public idFlujo = 0;
    public idEncuestaEmpleado = 0;
    public nombreEmpleado = ''
    public nombreClima = '';
    public nombreOrganizacion = '';

    isLoadingForm = true;
    turnstileToken = '';

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
      tipoEvaluacion: 'string',
      estado:1,
      estadoEnvio: ' ',
      granFactores: [],
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
  public title_card = '';
  
  public quiz: any = {};

  constructor(private fb: UntypedFormBuilder,private route: ActivatedRoute, 
    private organizacionService: OrganizacionService,

    private configService: ConfigService,
    private authService: AuthService,

    public languageService: LanguageService, private translate: TranslateService,
  )
    {
      
      
  
    }

     listLang = [
      { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
      { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
      
    ];

    public ngOnInit(): void {

      this.languageService.setLanguage(this.langStoreValue);
      this.translate.use(this.langStoreValue);

      //jjg aquí se maneja el cambio desde el componente header
      this.languageService.getLanguageChangeSubject().subscribe(lang => {
        this.translate.use(lang);
      });

      //this.setLanguage('Spanish','es', 'assets/images/flags/spain.jpg');

      this.countryName = 'Spanish';
      this.flagvalue = 'assets/images/flags/spain.jpg';
      this.langStoreValue = 'es';
      this.languageService.setLanguage('es');

      //console.log('ngOnInit()');
      const codigo = this.route.snapshot.queryParamMap.get('key');

     //console.log('key:', codigo);

      //decode base64 codigo here..
      if(codigo){
        const decode_key = atob(codigo);
       //console.log('decode_key = ', decode_key);

        const empleadoFlujo : string[] = decode_key.split('|');

        this.idEmpleado = +empleadoFlujo[0];
       
        this.idFlujo = +empleadoFlujo[1];

       //console.log(this.idEmpleado);
       //console.log(this.idFlujo);

        this.organizacionService.getEmpleadoInfo(this.idEmpleado).then((resulte)=>{
           //console.log('datos empleado:: ', resulte.data);
            this.nombreEmpleado = resulte.data.Nombres;
        }).catch((err)=>{});

        const climaInfo: any = {
            "IdFlujo": this.idFlujo,
            "IdEmpleado": this.idEmpleado
        }    

        this.organizacionService.getClimaInfo(climaInfo).then((resulsi)=>{
           //console.log('resulsi.data::', resulsi.data);

            if(resulsi.data.Estado){
               //console.log('entra resulse..', resulsi.data.Estado);
                if(resulsi.data.Estado !== 'Contestada') {
                    this.idEncuestaEmpleado = resulsi.data.Id;
                    this.getClima();

                } else {
                  Swal.fire({
                      icon: 'warning',
                      title: 'Aviso',
                      text: this.translate.instant('MENUITEMS.ALONE.NOTVALID'),
                      timer: 3000,
                      showConfirmButton: false
                    });
                  
                    this.isLoadingForm = false;
                }
            }

        }).catch((err)=>{
           //console.log('error garrafal!');
        })


        

      }
      

      
      this.title_card = this.quiz.title;
      //this.formConfig.series = this.quiz.series;
    }

    public getClima(): void {

      this.organizacionService.getPreguntasClimaGF(this.idFlujo, this.idEmpleado).then((ris) => {
      
        if (ris.data[0]) {
          this.quiz = ris.data[0];
          this.nombreClima = this.quiz.Nombre;
          this.nombreOrganizacion = this.quiz.nombre_organizacion_oficial;

          console.log('this.quiz::: ', this.quiz);

          // 🔹 aplanamos todos los series de todos los GranFactores
          const allSeries = this.quiz.GranFactores.reduce(
            (acc: any[], gf: any) => acc.concat(gf.series || []),
            []
          );

          // 🔹 aplanamos todos los fields de todos los series
          const allFields = allSeries.reduce(
            (acc: any[], serie: any) => acc.concat(serie.fields || []),
            []
          );

          this.formConfig = {
            ...this.quiz,
            GranFactores: this.quiz.GranFactores, // mantenemos la jerarquía para la vista
            series: allSeries,                    // por compatibilidad si en algún lado sigues usando series planas
            fields: allFields                     // flatten para que el FormBuilderService genere los controles
          };

          this.isLoadingForm = false;

          // Actualizar estado de encuesta
          const datasUpdate: any = {
            "IdEncuestaEmpleado": this.idEncuestaEmpleado,
            "Estado": 'Iniciada',
            "FechaInicio": new Date(),
            "FechaFinalizacion": null
          };
          this.updateClimaEncuesta(datasUpdate);
        }
      }).catch((err) => {
        console.error(err);
      });
    }


    public updateClimaEncuesta(data:any): void {
        

          this.organizacionService.updateClimaEncuesta(data);
    }

    setLanguage(text: string, lang: string, flag: string) {

      console.log('text: ' + text + ' lang: ' + lang + ' flag: ' + flag);
      this.countryName = text;
      this.flagvalue = flag;
      this.langStoreValue = lang;
      this.languageService.setLanguage(lang);
      
      if (lang) {
        this.dynamicFormComponent.translateRadioOptionLabels(this.dynamicFormComponent.formConfig, lang);
      }

    }

    onTurnstileTokenChange(token: string): void {
      this.turnstileToken = token;
    }

    resetTurnstile(): void {
      this.turnstileToken = '';
      this.turnstileComponent?.reset();
    }


}

