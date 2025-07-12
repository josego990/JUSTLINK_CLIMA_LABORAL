import { Component, OnInit, } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormComponent } from '../quiz/dynamic-form/dynamic-form.component';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { Quiz } from 'app/quiz/models/quiz-models';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-completeclimaalone',
  templateUrl: './completeclimaalone.component.html',
  styleUrls: ['./completeclimaalone.component.scss'],
  
    imports: [
  
      DynamicFormComponent,CommonModule
      
  
      ],
})
export class CompleteclimaaloneComponent implements OnInit {
 
    public idEmpleado = 0;
    public idFlujo = 0;
    public idEncuestaEmpleado = 0;
    public nombreEmpleado = ''
    public nombreClima = '';
    public nombreOrganizacion = '';

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
  public title_card = '';
  
  public quiz: any = {};

  constructor(private fb: UntypedFormBuilder,private route: ActivatedRoute, 
    private organizacionService: OrganizacionService,)
    {
      
      
  
    }

    public ngOnInit(): void {
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
                        text: 'La encuesta ya fue respondida.',
                        timer: 3000,
                        showConfirmButton: false
                        });
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
        this.organizacionService.getPreguntasClima(this.idFlujo).then((ris)=> {
           //console.log(ris.data[0]);

            if(ris.data[0]){
               //console.log('entra risx..');
                
                this.quiz = ris.data[0];
                this.nombreClima = this.quiz.Nombre;
                this.nombreOrganizacion = this.quiz.NombreOrganizacion;
               //console.log('this.quiz::: ', this.quiz);
                this.formConfig = {
                  
                  ...this.quiz,
                  series: [...this.quiz.series],
                  // flatten de todos los fields para que formBuilderService los vea:
                  fields: this.quiz.series.reduce((all:any, serie:any) => all.concat(serie.fields), [])
                };

                  const datasUpdate: any = {
                    "IdEncuestaEmpleado": this.idEncuestaEmpleado,
                    "Estado": 'Iniciada',
                    "FechaInicio": new Date,
                    "FechaFinalizacion": null
                  };
                  this.updateClimaEncuesta(datasUpdate);
                
            }
        }).catch((err)=> {
            console.error(err);
        })
    }

    public updateClimaEncuesta(data:any): void {
        

          this.organizacionService.updateClimaEncuesta(data);
    }


}



