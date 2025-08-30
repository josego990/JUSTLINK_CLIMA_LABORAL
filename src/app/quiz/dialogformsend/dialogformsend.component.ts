import { Serie } from '../models/quiz-models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { globalData } from '../global-data';
import { Quiz, QuizBank, Field } from '../models/quiz-models';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,UntypedFormBuilder,
 } from '@angular/forms';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { relativeTimeThreshold } from 'moment';



function renderizarPlantilla(
  plantilla: string,
  datos: Record<string, any>
  ): string {
   //console.log('Renderizando.. ', datos);
  // Expresión regular que captura el nombre de la propiedad entre comillas:
  const patron = /{{\s*DATOS\["([^"]+)"\]\s*}}/g;

  return plantilla.replace(patron, (_match, propiedad) => {
    // Si existe datos[propiedad], lo inserta; si no, deja cadena vacía.
    return datos[propiedad] != null ? datos[propiedad] : '';
  });
}

@Component({
  selector: 'app-dialogformsend',
  templateUrl: './dialogformsend.component.html',
  styleUrls: ['./dialogformsend.component.scss'],
  imports: [
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRippleModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    
    MatInputModule
  ]
})




// Aquí se crea el nuevo quiz
export class DialogformSendComponent implements OnInit {

  public idOrganization =  0;
  public organizationName = '';
  public dataSourceOrganizations:any = [];

  cardsData: Quiz[] = [];

  public categories = [{}];
  public selectedCategory = '';
  public selectedUnits = '';
  categoriesList: string[] = [];
  bankData: QuizBank[] = [];
  currentCard: Quiz;
  unitList: string[] = [];
  totalQuestionsSelected = 0;

  public qname = '';
  public qdesc = '';
  public addSendForm!: UntypedFormGroup;

  public selectedFieldType = '1'
  public loading = false;
  public tableDataSource = [] as any;
  displayedColumns: string[] = [
   
    "IdEmpleado",
    "Empleado",
    "Email",
    "Celular",
    "TipoEnvioEncuesta",
    "EstadoEncuesta",
    "FechaEnvio",
    "FechaInicio",
    "FechaFinalizacion",
    "RespuestaEnvio",
    "CodigoEncuestaEmpleado",
    "Reenvio"
  ];

 

  constructor(
    private fb: UntypedFormBuilder, 
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogformSendComponent>,
    private organizacionService: OrganizacionService,
    @Inject(MAT_DIALOG_DATA) public dataRecibida: Quiz,
    ) {
     //console.log('dataRecibeDialog::', dataRecibida );

      this.currentCard = dataRecibida;

    }

  public ngOnInit(): void {
   
    this.obtenerEncuestasEmpleados();

  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  crearEncuestas(): void{
    Swal.fire({
      title: 'Crear Encuestas',
      text: 'Esto creará las encuestas por empleados de la organización que estén activos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',       
      cancelButtonColor: '#3085d6',     
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
       //console.log('✅ Confirmado: Crear encuestas');
        this.organizacionService.crearEnvioEncuesta(this.currentCard.id).then((resulx) => {

          if(resulx.data.message === 'Envío de encuestas creado correctamente'){
            Swal.fire({
              title: 'Realizado',
              text: 'Encuestas creadas correctamente',
              icon: 'success',
            });

            this.currentCard.estadoEnvio = 'Creado';
            
            this.loading = false;

            this.obtenerEncuestasEmpleados();
          }
    
        }).catch((err)=>{
          Swal.fire({
              title: 'Ocurrió un error',
              text: err,
              icon: 'error',
            });
            this.loading = false;
        })
      } else {
       //console.log('❌ Cancelado por el usuario');

      }
    });

    
  }

  //enviar todas las encuestas..
  async enviarTodas(): Promise<void> {
    const confirmado = await Swal.fire({
      title: 'Enviar Encuestas',
      text: 'Esto enviará las encuestas pendientes de envío a todos los empleados activos. ¿Desea proceder?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, enviar todo', 
      cancelButtonText: 'Cancelar'
    }).then(r => r.isConfirmed);
  
    if (!confirmado) { return; }
  
    this.loading = true;
  
    try {

     //console.log(this.tableDataSource);

      for (const element of this.tableDataSource) {

        if(element.EstadoEncuesta === 'Creado'){

          if(element.TipoEnvioEncuesta == 1) {    //correo

            var plantilla_con_variables = '';
            var htmlFinal = '';
            const DATOS:any = {
              "nombre_empleado": element.Empleado,
              "telefono_empleado": element.Celular,
              "correo_empleado": element.Email,
              "nombre_organizacion": this.dataRecibida.subtitle,
              "nombre_clima": this.dataRecibida.title,
                             //http://localhost:4200
              "url_encuesta": 'https://d38he5chu19bcx.cloudfront.net/#/completeclima/completeclimaalone?key=' + element.CodigoEncuestaEmpleado
        
            };

           //console.log('ENTRA A ENVIAR CORREO.. element:', element);
            
            //obtener plantilla..
            this.organizacionService.getFlujoPlantilla(this.dataRecibida.id).then((resilix) => {
            
           //console.log('resilix:: ', resilix.data[0]);

            if(resilix.data[0]){
              plantilla_con_variables = resilix.data[0].CuerpoHtml;

              var p = plantilla_con_variables.replaceAll('&quot;','"');
             //console.log('p',p);
              htmlFinal = renderizarPlantilla(p, DATOS);

             //console.log('htmlFinal:: ', htmlFinal);

            }else{
             //console.log('creo que entó a undefined!'); //plantilla genérica
              plantilla_con_variables = '<h5>👋 Hola <strong>{{DATOS["nombre_empleado"]}},</strong></h5><p></p><h6>Has sido invitado completar la encuesta del Clima Laboral <em><strong>“{{DATOS["nombre_clima"]}}”</strong></em></h6><p></p><h6>🕓 Agradecemos de antemano el tiempo que te tomes en llenarla.</h6><p></p><p>🚀 <a href="{{DATOS[&quot;url_encuesta&quot;]}}" title="{{DATOS[&quot;url_encuesta&quot;]}}" target="_blank">LINK DE LA ENCUESTA</a></p><p></p><p>Atentamente el equipo de Just-Link.</p><p></p><p></p>';
              
              var p = plantilla_con_variables.replaceAll('&quot;','"');
             //console.log('p',p);

              htmlFinal = renderizarPlantilla(p, DATOS);
             //console.log('HTML-final default:: ', htmlFinal );
            };

            const mail_body = { "destinatario": element.Email, 
              "asunto": "Encuesta Clima Laboral", 
              "mensajeHtml": htmlFinal,
              "IdFlujo": this.dataRecibida.id,
              "IdEmpleado": element.IdEmpleado,         
             };
            
            this.organizacionService.sendEmail(mail_body).then((resulten)=>{
            
             //console.log('resultado enviado mail:: ', resulten);

              if(resulten.data.message === 'Correo enviado correctamente'){
    
               //console.log('ENTRA TIO==???:: ', resulten);

                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : element.IdEmpleado,
                  Estado          : 'Enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Correcto'
                };
          
                this.organizacionService.updateEncuestaEmpleado(updateData).then((resultenx)=>{
                  element.RespuestaEnvio = 'Correcto';
    
                 
                  
                }).catch((err)=>{
                  console.error(err);
                  
                })
    
                
              } else {
               //console.log('Error de envío a: ', );
              }
              
              this.loading = false;
            }).catch((err)=>{
              console.error('Error de envío: ', err );
            });
            
          }).catch((err) =>{
            console.error(err)
          });
          
          }
  
          else if(element.TipoEnvioEncuesta == 2) { //whatsapp
           //console.log('ENTRA A ENVIAR WHATSAPP.. element:', element);
            //Cuerpecito del mensaje
            const whatsappBody: any = {
              "to": "502" + element.Celular,
              "employe_name": element.Empleado,
              "organization_name": this.dataRecibida.subtitle,
              "clima_code": element.CodigoEncuestaEmpleado,
              "clima_name": this.dataRecibida.title,
              "IdFlujo": this.dataRecibida.id,
              "IdEmpleado": element.IdEmpleado, 
            }          
      
            //Espera a que se envíe el mensaje carnal
            this.organizacionService.sendWhatsappMessage(whatsappBody).then((resilex)=>{
              if (resilex.data.message !== 'Mensaje enviado correctamente') {
                element.RespuestaEnvio = 'Error al enviar el mensaje';
                
                //Actualizar registro en BD
                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : element.IdEmpleado,
                  Estado          : 'Enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Correcto'
                };
          
                this.organizacionService.updateEncuestaEmpleado(updateData);
                element.RespuestaEnvio = 'Correcto';
                  
              } 
              else {
                element.RespuestaEnvio = 'Error al enviar el mensaje';                
                //Actualizar registro en BD
                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : element.IdEmpleado,
                  Estado          : 'No enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Error'
                };
          
                this.organizacionService.updateEncuestaEmpleado(updateData);
                element.RespuestaEnvio = 'Error';
              }
            }).catch((err)=>{
             //console.log(err);

              element.RespuestaEnvio = 'Error al enviar el mensaje';
                
                //Actualizar registro en BD
                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : element.IdEmpleado,
                  Estado          : 'No enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Error'
                };
          
                this.organizacionService.updateEncuestaEmpleado(updateData);
                element.RespuestaEnvio = 'Error';
            });
      
            
      
            
          }
          
        }
      };

 
      const upd_data = {
        IdFlujo: this.currentCard.id,
        Estado: 2
      };

      this.organizacionService.updateEncuestaEncabezado(upd_data).then((resulixis)=>{
       //console.log('resultixis:: ', resulixis);
        this.currentCard.estadoEnvio = 'Enviado';
      }).catch((errr)=>{
        console.error(errr);
      });            

      Swal.fire('Proceso terminado', 'Todos los envíos se procesaron.', 'success');

    } catch (err) {
      console.error(err);
      Swal.fire('Error', String(err), 'error');
    } finally {
      this.loading = false;
     //console.log('obteniendo encuestas en finally..');
      this.obtenerEncuestasEmpleados();
    }
  }

 
  async swalCrearEncuesta(item: any): Promise<void> {

   //console.log(item);
    
    Swal.fire({
      title: 'Crear encuesta individual',
      html: 'Esta acción creará la encuesta al empleado <strong>' + item.Empleado + '</strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray',
      confirmButtonText: 'Sí, crear encuesta',
      cancelButtonText: 'Cancelar'

    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;


       //console.log('varela::', item);

        const sendData:any = {
          IdFlujo: this.currentCard.id,
          IdEmpleado: item.IdEmpleado 
        }

        this.organizacionService.crearEnvioEncuestaIndividual(sendData).then((resulx) => {

          if(resulx.data.message === 'Envío individual preparado correctamente'){
            Swal.fire({
              title: 'Realizado',
              text: 'Encuestas creadas correctamente',
              icon: 'success',
            });

            this.currentCard.estadoEnvio = 'Creado';
            
            this.loading = false;
            this.obtenerEncuestasEmpleados();
          }
    
        }).catch((err)=>{
          Swal.fire({
              title: 'Ocurrió un error',
              text: err,
              icon: 'error',
            });
            this.loading = false;
        })

        

      } else {
       //console.log('❌ Cancelado por el usuario');
      }
    });

    }

  //envío encuesta individual
  swalConfirmaEnvio(item: any): void {
    
   //console.log(item);

    const DATOS:any = {
      "nombre_empleado": item.Empleado,
      "telefono_empleado": item.Celular,
      "correo_empleado": item.Email,
      "nombre_organizacion": this.dataRecibida.subtitle,
      "nombre_clima": this.dataRecibida.title,
                     //http://localhost:4200
      "url_encuesta": 'https://d38he5chu19bcx.cloudfront.net/#/completeclima/completeclimaalone?key=' + item.CodigoEncuestaEmpleado

    };
    
    if(item.TipoEnvioEncuesta == 1) {

      Swal.fire({
        title: 'Enviar encuesta individual por correo',
        html: 'Esta acción enviará la encuesta por correo al empleado <strong>' + item.Empleado + '</strong>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, enviar correo',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          var plantilla_con_variables = '';
          var htmlFinal = '';
          this.loading = true;
         //console.log('✅ Confirmado: Enviar encuesta individual');
  
          //obtener plantilla..
          this.organizacionService.getFlujoPlantilla(this.dataRecibida.id).then((resilix) => {
            
           //console.log('resilix:: ', resilix.data[0]);

            if(resilix.data[0]){
              plantilla_con_variables = resilix.data[0].CuerpoHtml;

              var p = plantilla_con_variables.replaceAll('&quot;','"');
             //console.log('p',p);
              htmlFinal = renderizarPlantilla(p, DATOS);

             //console.log('htmlFinal:: ', htmlFinal);

            }else{
             //console.log('creo que entó a undefined!'); //plantilla genérica
              plantilla_con_variables = '<h5>👋 Hola <strong>{{DATOS["nombre_empleado"]}},</strong></h5><p></p><h6>Has sido invitado completar la encuesta del Clima Laboral <em><strong>“{{DATOS["nombre_clima"]}}”</strong></em></h6><p></p><h6>🕓 Agradecemos de antemano el tiempo que te tomes en llenarla.</h6><p></p><p>🚀 <a href="{{DATOS[&quot;url_encuesta&quot;]}}" title="{{DATOS[&quot;url_encuesta&quot;]}}" target="_blank">LINK DE LA ENCUESTA</a></p><p></p><p>Atentamente el equipo de Just-Link.</p><p></p><p></p>';
              
              var p = plantilla_con_variables.replaceAll('&quot;','"');
             //console.log('p',p);

              htmlFinal = renderizarPlantilla(p, DATOS);
             //console.log('HTML-final default:: ', htmlFinal );
            };

            const mail_body = { "destinatario": item.Email, 
              "asunto": "Encuesta Clima Laboral", 
              "mensajeHtml": htmlFinal,
              "IdFlujo": this.dataRecibida.id,
              "IdEmpleado": item.IdEmpleado,         
             };
            
            this.organizacionService.sendEmail(mail_body).then((resulten)=>{
            
              if(resulten.data.message === 'Correo enviado correctamente'){
    
           
                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : item.IdEmpleado,
                  Estado          : 'Enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Correcto'
                };
          
                this.organizacionService.updateEncuestaEmpleado(updateData).then((resultenx)=>{
                  item.RespuestaEnvio = 'Correcto';
    
                  Swal.fire({
                    title: 'Realizado',
                    text: resulten.data.message,
                    icon: 'success',
                  });
                  
                }).catch((err)=>{
                  console.error(err);
                  Swal.fire({
                    title: 'Algo anda mal..',
                    text: 'No fue posible enviar el correo. ERROR: ' + err,
                    icon: 'error',
                  });
                })
    
                
              } else {
                Swal.fire({
                  title: 'Algo anda mal..',
                  text: 'No fue posible enviar el correo. Mensaje: ' + resulten.data.message,
                  icon: 'error',
                });
              }
              
              this.loading = false;
            }).catch((err)=>{
              Swal.fire({
              title: 'Ocurrió un error',
              text: err,
              icon: 'error',
            });
            this.loading = false;
            });
            
          }).catch((err) =>{
            Swal.fire({
              title: 'Error',
              text: err,
              icon: 'error',
            });
          });
        
        } else {
         //console.log('❌ Cancelado por el usuario');
        }
      });

    }
    else if(item.TipoEnvioEncuesta == 2){ //WHATSAPP

      Swal.fire({
        title: 'Enviar encuesta individual por Whatsapp',
        html: 'Esta acción enviará la encuesta por Whatsap al empleado <strong>' + item.Empleado + '</strong>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, enviar Whatsapp',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
         //console.log('✅ Confirmado: Enviar encuesta individual por Whatsapp');
  
          //Cuerpecito del mensaje
          const whatsappBody: any = {
            "to": "502" + item.Celular,
            "employe_name": item.Empleado,
            "organization_name": this.dataRecibida.subtitle,
            "clima_code": item.CodigoEncuestaEmpleado,
            "clima_name": this.dataRecibida.title,
            "IdFlujo": this.dataRecibida.id,
            "IdEmpleado": item.IdEmpleado,
          }          
    
          //Espera a que se envíe el mensaje carnal
          this.organizacionService.sendWhatsappMessage(whatsappBody).then((resiltixx)=>{
           
            if (resiltixx) {
                //console.log('whatsapp resiltixx:: ', resiltixx);

              if(resiltixx.data.messages[0].message_status == 'accepted'){
                //Actualizar registro en BD
                const updateData = {
                  Id              : 0,
                  IdFlujo         : this.dataRecibida.id,
                  IdEmpleado      : item.IdEmpleado,
                  Estado          : 'Enviado',
                  FechaEnvio      : new Date().toISOString().slice(0,19).replace('T',' '),
                  FechaInicio     : null,
                  FechaFinalizacion: null,
                  Eliminada       : 0,
                  RespuestaEnvio  : 'Correcto'
                };
        
                this.organizacionService.updateEncuestaEmpleado(updateData);
                item.RespuestaEnvio = 'Correcto';  
                this.loading = false;

                Swal.fire({
                  title: 'Realizado',
                  text: 'Se envió el mensaje exitósamente.',
                  icon: 'success',
                });
            }
                  
            }
            else {
              item.RespuestaEnvio = 'Error al enviar el mensaje';  
              this.loading = false;
              Swal.fire({
                title: 'Algo anda mal..',
                text: 'No fue posible enviar el mensaje.',
                icon: 'error',
              });
            }
      
            

          }).catch((err)=>{
            console.error(err);
            Swal.fire({
              title: 'Ocurrió un error',
              text: err,
              icon: 'error',
            });

            this.loading = false;
          });
    
          
  
        } else {
         //console.log('❌ Cancelado por el usuario');
        }
      });

    }

    
    
  
  }
  
  //crea las encuestas
  enviarEncuestas(): void{
    this.loading = true;
    this.organizacionService.crearEnvioEncuesta(this.currentCard.id).then((resulx) => {

      if(resulx.data.message === 'Envío de encuestas creado correctamente'){
        Swal.fire({
          title: 'Realizado',
          text: resulx.data.message,
          icon: 'success',
        });
        this.loading = false;
      }

    }).catch((err)=>{
      Swal.fire({
          title: 'Ocurrió un error',
          text: err,
          icon: 'error',
        });
        this.loading = false;
    })
  }

  obtenerEncuestasEmpleados(): void {
    console.log('entra en obtener encuestas empleados:: ', this.dataRecibida.id);
    this.loading = true;
    this.dataRecibida.id;

    this.organizacionService.getEncuestasFlujo(this.dataRecibida.id).then((resultix)=>{
     console.log('resultix encuestas empleados:: ', resultix);
      if(resultix.data){
        this.tableDataSource = resultix.data;
        this.loading = false;
      }
    }).catch((err)=>{
      console.error(err);
      this.loading = false;
    });
  }

  reenviarEncuestas(): void{
    
  }

  toggleEstado(element: any): void {

  }

  

  convertirFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth es 0-based
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
  
    return `${dia}-${mes}-${año} ${horas}:${minutos}`;
  }

  getTipoEnvioTexto(tipo: number): string {
    switch (tipo) {
      case 1:
        return 'Correo';
      case 2:
        return 'Whatsapp';
      case 3:
        return 'Ninguno';
      default:
        return 'Desconocido';
    }
  }
  
  
 
}
