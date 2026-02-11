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
     console.log('dataRecibeDialog::', dataRecibida );

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

    if (!confirmado) return;

    this.loading = true;

    let okCount = 0;
    let errCount = 0;
    const logs: Array<{idEmpleado:number; canal:'email'|'whatsapp'; ok:boolean; msg:string}> = [];

    try {
      for (const element of this.tableDataSource) {
        // Solo envía los que están creados/pedientes
        if (element?.EstadoEncuesta !== 'Creado') continue;

        let okItem = false;
        let canal: 'email' | 'whatsapp' = 'email';
        let msgFinal = '';

        try {
          if (element.TipoEnvioEncuesta == 1) {
            canal = 'email';
            const htmlFinal = await this.prepararHtmlCorreo(element);

            //IDENTIFICAR ORGANIZACION PARA LOS ENVIOS
            var asunto = "Encuesta Clima Organizacional";
            if(this.dataRecibida.idOrganization == 25){
              asunto = "Encuesta de clima laboral 2025: Colegios APDE"
            }

            const body = {
              destinatario: element.Email,
              asunto: asunto,
              mensajeHtml: htmlFinal,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const res = await this.organizacionService.sendEmail(body);
            const message = res?.data?.message ?? '';
            okItem = this.esOk(message);   // 'Correo enviado correctamente', 'success', 'correcto', etc.
            msgFinal = String(message || 'Sin mensaje');
            await this.registrarEnvio(element, okItem ? 'Enviado' : 'No enviado', okItem ? 'Correcto' : 'Error');
            element.RespuestaEnvio = okItem ? 'Correcto' : 'Error';
          }
          else if (element.TipoEnvioEncuesta == 2) { //WHATSAPP
            canal = 'whatsapp';
            const wBody = {
              to: element.Celular,
              employe_name: element.Empleado,
              organization_name: this.dataRecibida.subtitle,
              clima_code: element.CodigoEncuestaEmpleado,
              clima_name: this.dataRecibida.title,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const res = await this.organizacionService.sendWhatsappMessage(wBody);
            const message = res?.data?.messages[0] ?? '';
            console.log('CAPELLAN,, ',);
            okItem = this.esOk(message.message_status);   // 'Mensaje enviado correctamente', etc.
            msgFinal = String(message || 'Sin mensaje');
            await this.registrarEnvio(element, okItem ? 'Enviado' : 'No enviado', okItem ? 'Correcto' : 'Error');
            element.RespuestaEnvio = okItem ? 'Correcto' : 'Error';
          }
        } catch (err: any) {
          okItem = false;
          msgFinal = (err?.message || String(err) || 'Error desconocido');
          await this.registrarEnvio(element, 'No enviado', 'Error');
          element.RespuestaEnvio = 'Error';
        }

        logs.push({ idEmpleado: element.IdEmpleado, canal, ok: okItem, msg: msgFinal });
        okItem ? okCount++ : errCount++;
      }

      // Actualiza encabezado general (si aplica)
      try {
        await this.organizacionService.updateEncuestaEncabezado({ IdFlujo: this.currentCard.id, Estado: 2 });
        this.currentCard.estadoEnvio = 'Enviado';
      } catch (_) { /* opcional: log */ }

      // Resumen final
      const total = okCount + errCount;
      const title = errCount === 0 ? 'Proceso exitoso' :
                    okCount === 0 ? 'Sin envíos exitosos' :
                    'Proceso parcialmente exitoso';
      const icon  = errCount === 0 ? 'success' :
                    okCount === 0 ? 'error'   : 'warning';

      await Swal.fire({
        icon,
        title,
        html: `
          <div style="text-align:left">
            <div><strong>Total procesados:</strong> ${total}</div>
            <div style="color:#16a34a"><strong>Correctos:</strong> ${okCount}</div>
            <div style="color:#dc2626"><strong>Errores:</strong> ${errCount}</div>
          </div>
        `
      });

      // (Opcional) si quieres ver los mensajes individuales:
      // console.table(logs);

    } catch (err: any) {
      console.error(err);
      await Swal.fire('Error', String(err), 'error');
    } finally {
      this.loading = false;
      this.obtenerEncuestasEmpleados();
    }
  }

  /** Determina si el mensaje del backend indica éxito */
  private esOk(message: any): boolean {
    const s = (message ?? '').toString().toLowerCase();
    return s.includes('accepted') ||
          s.includes('enviado correctamente') ||
          s.includes('success') ||
          s.includes('ok');
  }

  /** Arma el HTML del correo con plantilla (usa fallback si no hay) */
  private async prepararHtmlCorreo(element: any): Promise<string> {
    // 1) Obtener plantilla desde BD
    let plantilla = '';
    try {
      const r = await this.organizacionService.getFlujoPlantilla(this.dataRecibida.id);
      plantilla = r?.data?.[0]?.CuerpoHtml || '';
    } catch { /* sin template */ }

    // 2) Fallback minimal si no hay plantilla
    if (!plantilla) {
      plantilla = '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>Equipo de Just-Link</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';

      /*
        '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>Invitación a encuesta</title></head><body style="font-family:Arial,Helvetica,sans-serif">' +
        '<h2>Hola {{DATOS["nombre_empleado"]}}</h2>' +
        '<p>Has sido invitado(a) a la encuesta <strong>{{DATOS["nombre_clima"]}}</strong>.</p>' +
        '<p><a href="{{DATOS["url_encuesta"]}}" target="_blank">Abrir encuesta</a></p>' +
        '<p>Gracias, equipo Just-Link</p>' +
        '</body></html>';
    */
    }

  // 3) Reemplazos & render
  const p = plantilla.replaceAll('&quot;', '"');
  const DATOS: any = {
    nombre_empleado: element.Empleado,
    telefono_empleado: element.Celular,
    correo_empleado: element.Email,
    nombre_organizacion: this.dataRecibida.subtitle,
    nombre_clima: this.dataRecibida.title,
    url_encuesta:
     'https://justlink360.net/#/completeclima/completeclimaalone?key=' +
      //'http://localhost:4200/#/completeclima/completeclimaalone?key=' +
      element.CodigoEncuestaEmpleado
  };

  return renderizarPlantilla(p, DATOS);
}

/** Registra el envío por empleado en tu backend */
private async registrarEnvio(element: any, estado: 'Enviado'|'No enviado', respuesta: 'Correcto'|'Error'): Promise<void> {
  const updateData = {
    Id: 0,
    IdFlujo: this.dataRecibida.id,
    IdEmpleado: element.IdEmpleado,
    Estado: estado,
    FechaEnvio: new Date().toISOString().slice(0, 19).replace('T', ' '),
    FechaInicio: null,
    FechaFinalizacion: null,
    Eliminada: 0,
    RespuestaEnvio: respuesta
  };
  await this.organizacionService.updateEncuestaEmpleado(updateData);
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
            console.log('resulx:: ', resulx.data.message);
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
    
   console.log('demente::', item);

    const DATOS:any = {
      "nombre_empleado": item.Empleado,
      "telefono_empleado": item.Celular,
      "correo_empleado": item.Email, 
      "nombre_organizacion": this.dataRecibida.subtitle,
      "nombre_clima": this.dataRecibida.title,
                     //http://localhost:4200 https://justlink360.net
      "url_encuesta": 'https://justlink360.net/#/completeclima/completeclimaalone?key=' + item.CodigoEncuestaEmpleado

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

            } else{
             //console.log('creo que entó a undefined!'); //plantilla genérica
              plantilla_con_variables = '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>Equipo de Just-Link</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';
              
              var p = plantilla_con_variables.replaceAll('&quot;','"');
             //console.log('p',p);

              htmlFinal = renderizarPlantilla(p, DATOS);
             //console.log('HTML-final default:: ', htmlFinal );
            };

            //IDENTIFICAR ORGANIZACION PARA LOS ENVIOS
            var asunto = "Encuesta Clima Organizacional";
            if(this.dataRecibida.idOrganization == 25){
              asunto = "Encuesta de clima laboral 2025: Colegios APDE"
            }

            const mail_body = { "destinatario": item.Email, 
              "asunto": asunto, 
              "mensajeHtml": htmlFinal,
              "IdFlujo": this.dataRecibida.id,
              "IdEmpleado": item.IdEmpleado,         
             };
            

            this.organizacionService.sendEmail(mail_body).then((resulten)=>{
            
              if(resulten.data.message === 'Correo CPANEL enviado correctamente'){
    
           
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
    else if (item.TipoEnvioEncuesta == 3) { // AMBOS (CORREO + WHATSAPP) 
    // --PROBAR ESTA FUNCIONALIDAD Y REMOVER ESTE COMENTARIO

      Swal.fire({
        title: 'Enviar encuesta por Correo y Whatsapp',
        html: 'Esta acción enviará la encuesta por <strong>correo</strong> y <strong>WhatsApp</strong> al empleado <strong>' + item.Empleado + '</strong>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, enviar ambos',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        this.loading = true;

        try {
          // =========================
          // 1) ARMAR HTML DEL CORREO
          // =========================
          let plantilla_con_variables = '';
          let htmlFinal = '';

          const resilix = await this.organizacionService.getFlujoPlantilla(this.dataRecibida.id);

          if (resilix?.data?.[0]) {
            plantilla_con_variables = resilix.data[0].CuerpoHtml;
          } else {
            plantilla_con_variables = '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>Equipo de Just-Link</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';
          }

          const p = plantilla_con_variables.replaceAll('&quot;', '"');
          htmlFinal = renderizarPlantilla(p, DATOS);

          // Asunto por organización
          let asunto = "Encuesta Clima Organizacional";
          if (this.dataRecibida.idOrganization == 25) {
            asunto = "Encuesta de clima laboral 2025: Colegios APDE";
          }

          const mail_body = {
            destinatario: item.Email,
            asunto: asunto,
            mensajeHtml: htmlFinal,
            IdFlujo: this.dataRecibida.id,
            IdEmpleado: item.IdEmpleado,
          };

          // =========================
          // 2) ARMAR BODY WHATSAPP
          // =========================
          const whatsappBody: any = {
            to: "502" + item.Celular,
            employe_name: item.Empleado,
            organization_name: this.dataRecibida.subtitle,
            clima_code: item.CodigoEncuestaEmpleado,
            clima_name: this.dataRecibida.title,
            IdFlujo: this.dataRecibida.id,
            IdEmpleado: item.IdEmpleado,
          };

          // =========================
          // 3) ENVIAR AMBOS (PARALELO)
          // =========================
          const [correoRes, waRes] = await Promise.allSettled([
            this.organizacionService.sendEmail(mail_body),
            this.organizacionService.sendWhatsappMessage(whatsappBody),
          ]);

          // Evaluar CORREO
          let correoOk = false;
          let correoMsg = '';

          if (correoRes.status === 'fulfilled') {
            correoOk = correoRes.value?.data?.message === 'Correo CPANEL enviado correctamente';
            correoMsg = correoRes.value?.data?.message || '';
          } else {
            correoMsg = String(correoRes.reason);
          }

          // Evaluar WHATSAPP
          let waOk = false;
          let waMsg = '';

          if (waRes.status === 'fulfilled') {
            waOk = waRes.value?.data?.messages?.[0]?.message_status === 'accepted';
            waMsg = waRes.value?.data?.messages?.[0]?.message_status || '';
          } else {
            waMsg = String(waRes.reason);
          }

          // =========================
          // 4) ACTUALIZAR BD (1 VEZ)
          // =========================
          const respuestaEnvio =
            (correoOk && waOk)
              ? 'Correcto'
              : (correoOk || waOk)
                ? `Parcial: correo=${correoOk ? 'OK' : 'FAIL'}; whatsapp=${waOk ? 'OK' : 'FAIL'}`
                : 'Error';

          const updateData = {
            Id: 0,
            IdFlujo: this.dataRecibida.id,
            IdEmpleado: item.IdEmpleado,
            Estado: (correoOk || waOk) ? 'Enviado' : 'Error',
            FechaEnvio: new Date().toISOString().slice(0, 19).replace('T', ' '),
            FechaInicio: null,
            FechaFinalizacion: null,
            Eliminada: 0,
            RespuestaEnvio: respuestaEnvio
          };

          await this.organizacionService.updateEncuestaEmpleado(updateData);
          item.RespuestaEnvio = respuestaEnvio;

          // =========================
          // 5) FEEDBACK UI
          // =========================
          if (correoOk && waOk) {
            Swal.fire({
              title: 'Realizado',
              text: 'Se envió la encuesta por correo y WhatsApp exitosamente.',
              icon: 'success',
            });
          } else if (correoOk || waOk) {
            Swal.fire({
              title: 'Envío parcial',
              html:
                `${correoOk ? '✅ Correo enviado.<br>' : '❌ Correo falló: ' + (correoMsg || 'sin detalle') + '<br>'}` +
                `${waOk ? '✅ WhatsApp enviado.' : '❌ WhatsApp falló: ' + (waMsg || 'sin detalle')}`,
              icon: 'warning',
            });
          } else {
            Swal.fire({
              title: 'Algo anda mal..',
              text: 'No fue posible enviar por correo ni por WhatsApp.',
              icon: 'error',
            });
          }

        } catch (err) {
          console.error(err);
          Swal.fire({
            title: 'Ocurrió un error',
            text: String(err),
            icon: 'error',
          });
        } finally {
          this.loading = false;
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
