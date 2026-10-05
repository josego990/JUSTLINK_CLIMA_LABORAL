import { Serie } from '../models/quiz-models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { globalData } from '../global-data';
import { Quiz, QuizBank, Field } from '../models/quiz-models';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { ExcelXlsxService } from '../../dashboard/dashboard1/excel-xlsx.service';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { DemoLimitsService } from '../../config/demo-limits.service';
import { LanguageService } from '../../core/service/language.service';



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
    
    MatInputModule,
    MatTooltipModule,
    TranslateModule,
    JoyrideModule
  ]
})




// Aquí se crea el nuevo quiz
export class DialogformSendComponent implements OnInit {

  readonly baseDisplayedColumns = [
    'IdEmpleado',
    'Empleado',
    'Email',
    'Celular',
    'TipoEnvioEncuesta',
    'EstadoEncuesta',
    'FechaEnvio',
    'FechaInicio',
    'FechaFinalizacion',
    'RespuestaEnvio',
    'CodigoEncuestaEmpleado'
  ];

  readonly hiddenDisplayedColumns = new Set(['FechaInicio']);
  readonly trailingDisplayedColumns = ['Reenvio'];

  readonly estadoSummaryCards = [
    { key: 'Contestada', labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.SUMMARY_ANSWERED' },
    { key: 'Enviado', labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.SUMMARY_SENT' },
    { key: 'Iniciada', labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.SUMMARY_STARTED' },
    { key: 'Creado', labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.SUMMARY_CREATED' }
  ];

  readonly tipoEnvioFilterOptions = [
    { value: 1, labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.EMAIL_CHANNEL' },
    { value: 2, labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.WHATSAPP_CHANNEL' },
    { value: 3, labelKey: 'MENUITEMS.TOUR.SEND_CLIMATE.EMAIL_WHATSAPP_CHANNEL' }
  ];

  readonly baseEstadoFilterOptions = [
    'Contestada',
    'Enviado',
    'Iniciada',
    'Creado',
    'No enviado',
    'Sin encuesta'
  ];

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

  public idFlujo = 0;

  public selectedFieldType = '1'
  public loading = false;
  public tableDataSource = [] as any[];
  public filteredTableDataSource = [] as any[];
  public dynamicDemographicColumns = [] as string[];
  public showDynamicDemographicColumns = true;
  public selectedTipoEnvioFilter: number | 'ALL' = 'ALL';
  public selectedEstadoFilter = 'ALL';
  public estadoFilterOptions = [...this.baseEstadoFilterOptions];
  displayedColumns: string[] = [
    ...this.baseDisplayedColumns.filter((column) => !this.hiddenDisplayedColumns.has(column)),
    ...this.trailingDisplayedColumns
  ];

 

  constructor(
    private joyrideService: JoyrideService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogformSendComponent>,
    private organizacionService: OrganizacionService,
    private excelXlsxService: ExcelXlsxService,
    private demoLimitsService: DemoLimitsService,
    @Inject(MAT_DIALOG_DATA) public dataRecibida: Quiz,
    ) {
     console.log('dataRecibeDialog::', dataRecibida );

      this.currentCard = dataRecibida;
      this.idFlujo = dataRecibida.id;
    }

  startSendTour(): void {
    setTimeout(() => {
      const candidates = [
        'sendClimateOverview',
        'sendClimateActions',
        'sendClimateSummary',
        'sendClimateFilters',
        'sendClimateTable'
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

  public ngOnInit(): void {
    const activeLanguage = localStorage.getItem('lang') || this.translate.currentLang || 'en';
    this.translate.use(activeLanguage);
    this.languageService.getLanguageChangeSubject().subscribe((lang) => {
      this.translate.use(lang);
    });

    this.obtenerEncuestasEmpleados();

  }

  get isDemoClimateBulkSendBlocked(): boolean {
    return this.demoLimitsService.isDemoModeActive() &&
      !this.tableDataSource.some(
        (item) => this.normalizeEstadoEncuesta(item?.EstadoEncuesta) === 'Creado'
      );
  }

  get isDemoClimateResendBlocked(): boolean {
    return this.demoLimitsService.isDemoModeActive() &&
      this.tableDataSource.some((item) => this.isClimateSurveyAlreadySent(item));
  }

  isDemoClimateSurveyResendBlocked(item: any): boolean {
    return this.demoLimitsService.isDemoModeActive() &&
      this.isClimateSurveyAlreadySent(item);
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  crearEncuestas(): void{
    Swal.fire({
      title: this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.ASSIGN_DIALOG_TITLE'),
      text: this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.ASSIGN_DIALOG_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',       
      cancelButtonColor: '#3085d6',     
      confirmButtonText: this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.ASSIGN_CONFIRM'),
      cancelButtonText: this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.ASSIGN_CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
       //console.log('✅ Confirmado: Crear encuestas');
        this.organizacionService.crearEnvioEncuesta(this.currentCard.id).then((resulx) => {

          if(resulx.data.message === 'Envío de encuestas creado correctamente'){
            Swal.fire({
              title: this.sendText('SUCCESS_TITLE'),
              text: this.sendText('ASSIGN_SUCCESS'),
              icon: 'success',
            });

            this.currentCard.estadoEnvio = 'Creado';
            
            this.loading = false;

            this.obtenerEncuestasEmpleados();
          }
    
        }).catch((err)=>{
          Swal.fire({
              title: this.sendText('ERROR_TITLE'),
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
    if (this.isDemoClimateBulkSendBlocked) {
      await this.showDemoClimateResendBlocked();
      return;
    }

    try {
      // Validar que la encuesta tenga preguntas antes de enviar
      const resultadopreguntas: any = await this.organizacionService.obtenerTotalPreguntasActivasClima({ idFlujo: this.idFlujo });
      const totalPreguntas = this.obtenerTotalPreguntasDesdeRespuesta(resultadopreguntas);

      if (!resultadopreguntas?.data) {
        await Swal.fire(this.sendText('ERROR'), this.sendText('QUESTIONS_UNAVAILABLE'), 'error');
        return;
      }

      if (totalPreguntas <= 0) {
        await Swal.fire(this.sendText('ERROR'), this.sendText('NO_QUESTIONS'), 'error');
        return;
      }
    } catch (err: any) {
      console.error(err);
      await Swal.fire(this.sendText('SOMETHING_WRONG_TITLE'), this.sendText('QUESTIONS_ERROR', { error: err }), 'error');
      return;
    }

    const confirmado = await Swal.fire({
      title: this.sendText('SEND_ALL_TITLE'),
      text: this.sendText('SEND_ALL_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray',
      confirmButtonText: this.sendText('SEND_ALL_CONFIRM'),
      cancelButtonText: this.sendText('ASSIGN_CANCEL')
    }).then((r) => r.isConfirmed);

    if (!confirmado) return;

    this.loading = true;

    let okCount = 0;
    let errCount = 0;
    const logs: Array<{idEmpleado:number; canal:'email'|'whatsapp'|'ambos'; ok:boolean; msg:string}> = [];

    try {
      for (const element of this.tableDataSource) {
        // Solo envía los que están creados/pendientes
        if (element?.EstadoEncuesta !== 'Creado') continue;

        let okItem = false;
        let canal: 'email' | 'whatsapp' | 'ambos' = 'email';
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
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta = okItem ? 'Correcto' : 'Error';
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
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

            const res = await this.organizacionService.sendWhatsappMessageProd(wBody);
            const waResult = this.validarRespuestaWhatsapp(res);
            okItem = waResult.ok;
            msgFinal = waResult.status || waResult.detalle || 'Sin mensaje';
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta = okItem ? 'Correcto' : 'Error';
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
          }
          else if (element.TipoEnvioEncuesta == 3) { // AMBOS
            canal = 'ambos';

            const htmlFinal = await this.prepararHtmlCorreo(element);

            let asunto = "Encuesta Clima Organizacional";
            if(this.dataRecibida.idOrganization == 25){
              asunto = "Encuesta de clima laboral 2025: Colegios APDE";
            }

            const emailBody = {
              destinatario: element.Email,
              asunto: asunto,
              mensajeHtml: htmlFinal,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const wBody = {
              to: element.Celular,
              employe_name: element.Empleado,
              organization_name: this.dataRecibida.subtitle,
              clima_code: element.CodigoEncuestaEmpleado,
              clima_name: this.dataRecibida.title,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const [correoRes, waRes] = await Promise.allSettled([
              this.organizacionService.sendEmail(emailBody),
              this.organizacionService.sendWhatsappMessageProd(wBody),
            ]);

            let correoOk = false;
            let waOk = false;
            let correoMsg = '';
            let waMsg = '';

            if (correoRes.status === 'fulfilled') {
              correoMsg = correoRes.value?.data?.message ?? '';
              correoOk = this.esOk(correoMsg);
            } else {
              correoMsg = String(correoRes.reason);
            }

            if (waRes.status === 'fulfilled') {
              const waResult = this.validarRespuestaWhatsapp(waRes.value);
              waMsg = waResult.status || waResult.detalle || '';
              waOk = waResult.ok;
            } else {
              waMsg = String(waRes.reason);
            }

            okItem = correoOk || waOk;
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta =
              (correoOk && waOk)
                ? 'Correcto'
                : okItem
                  ? `Parcial: correo=${correoOk ? 'OK' : 'FAIL'}; whatsapp=${waOk ? 'OK' : 'FAIL'}`
                  : 'Error';

            msgFinal = `correo=${correoMsg || 'sin detalle'} | whatsapp=${waMsg || 'sin detalle'}`;
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
          }
        } catch (err: any) {
          okItem = false;
          msgFinal = (err?.message || String(err) || 'Error desconocido');
          await this.registrarEnvio(element, 'No enviado', 'Error');
          element.RespuestaEnvio = 'Error';
          element.EstadoEncuesta = 'No enviado';
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
      const title = errCount === 0 ? this.sendText('PROCESS_SUCCESS') :
                    okCount === 0 ? this.sendText('PROCESS_WITHOUT_SUCCESS') :
                    this.sendText('PROCESS_PARTIAL');
      const icon  = errCount === 0 ? 'success' :
                    okCount === 0 ? 'error'   : 'warning';

      await Swal.fire({
        icon,
        title,
        html: `
          <div style="text-align:left">
            <div><strong>${this.sendText('PROCESSED_TOTAL')}:</strong> ${total}</div>
            <div style="color:#16a34a"><strong>${this.sendText('SUCCESSFUL_TOTAL')}:</strong> ${okCount}</div>
            <div style="color:#dc2626"><strong>${this.sendText('ERROR_TOTAL')}:</strong> ${errCount}</div>
          </div>
        `
      });

      // (Opcional) si quieres ver los mensajes individuales:
      // console.table(logs);

    } catch (err: any) {
      console.error(err);
      await Swal.fire(this.sendText('ERROR'), String(err), 'error');
    } finally {
      this.loading = false;
      this.obtenerEncuestasEmpleados();
    }
  }

  async enviarTodasPendientes(): Promise<void> {
    if (this.isDemoClimateResendBlocked) {
      await this.showDemoClimateResendBlocked();
      return;
    }

    try {
      // Validar que la encuesta tenga preguntas antes de enviar
      const resultadopreguntas: any = await this.organizacionService.obtenerTotalPreguntasActivasClima({ idFlujo: this.idFlujo });
      const totalPreguntas = this.obtenerTotalPreguntasDesdeRespuesta(resultadopreguntas);

      if (!resultadopreguntas?.data) {
        await Swal.fire(this.sendText('ERROR'), this.sendText('QUESTIONS_UNAVAILABLE'), 'error');
        return;
      }

      if (totalPreguntas <= 0) {
        await Swal.fire(this.sendText('ERROR'), this.sendText('NO_QUESTIONS'), 'error');
        return;
      }

    } 
    catch (err: any) {
      console.error(err);
      await Swal.fire(this.sendText('SOMETHING_WRONG_TITLE'), this.sendText('QUESTIONS_ERROR', { error: err }), 'error');
      return;
    }

    const confirmado = await Swal.fire({
      title: this.sendText('SEND_INCOMPLETE_TITLE'),
      text: this.sendText('SEND_INCOMPLETE_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray',
      confirmButtonText: this.sendText('SEND_INCOMPLETE_CONFIRM'),
      cancelButtonText: this.sendText('ASSIGN_CANCEL')
    }).then((r) => r.isConfirmed);

    if (!confirmado) return;

    this.loading = true;

    let okCount = 0;
    let errCount = 0;
    const logs: Array<{idEmpleado:number; canal:'email'|'whatsapp'|'ambos'; ok:boolean; msg:string}> = [];

    try {
      for (const element of this.tableDataSource) {

        // Solo envía los que están creados, enviados y diferente de 
        if (element?.EstadoEncuesta === 'Contestada' || element?.EstadoEncuesta === 'Sin encuesta') continue;

        let okItem = false;
        let canal: 'email' | 'whatsapp' | 'ambos' = 'email';
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
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta = okItem ? 'Correcto' : 'Error';
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
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

            const res = await this.organizacionService.sendWhatsappMessageProd(wBody);
            const waResult = this.validarRespuestaWhatsapp(res);
            okItem = waResult.ok;
            msgFinal = waResult.status || waResult.detalle || 'Sin mensaje';
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta = okItem ? 'Correcto' : 'Error';
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
          }
          else if (element.TipoEnvioEncuesta == 3) { // AMBOS
            canal = 'ambos';

            const htmlFinal = await this.prepararHtmlCorreo(element);

            let asunto = "Encuesta Clima Organizacional";
            if(this.dataRecibida.idOrganization == 25){
              asunto = "Encuesta de clima laboral 2025: Colegios APDE";
            }

            const emailBody = {
              destinatario: element.Email,
              asunto: asunto,
              mensajeHtml: htmlFinal,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const wBody = {
              to: element.Celular,
              employe_name: element.Empleado,
              organization_name: this.dataRecibida.subtitle,
              clima_code: element.CodigoEncuestaEmpleado,
              clima_name: this.dataRecibida.title,
              IdFlujo: this.dataRecibida.id,
              IdEmpleado: element.IdEmpleado
            };

            const [correoRes, waRes] = await Promise.allSettled([
              this.organizacionService.sendEmail(emailBody),
              this.organizacionService.sendWhatsappMessageProd(wBody),
            ]);

            let correoOk = false;
            let waOk = false;
            let correoMsg = '';
            let waMsg = '';

            if (correoRes.status === 'fulfilled') {
              correoMsg = correoRes.value?.data?.message ?? '';
              correoOk = this.esOk(correoMsg);
            } else {
              correoMsg = String(correoRes.reason);
            }

            if (waRes.status === 'fulfilled') {
              const waResult = this.validarRespuestaWhatsapp(waRes.value);
              waMsg = waResult.status || waResult.detalle || '';
              waOk = waResult.ok;
            } else {
              waMsg = String(waRes.reason);
            }

            okItem = correoOk || waOk;
            const estado = okItem ? 'Enviado' : 'No enviado';
            const respuesta =
              (correoOk && waOk)
                ? 'Correcto'
                : okItem
                  ? `Parcial: correo=${correoOk ? 'OK' : 'FAIL'}; whatsapp=${waOk ? 'OK' : 'FAIL'}`
                  : 'Error';

            msgFinal = `correo=${correoMsg || 'sin detalle'} | whatsapp=${waMsg || 'sin detalle'}`;
            await this.registrarEnvio(element, estado, respuesta);
            element.RespuestaEnvio = respuesta;
            element.EstadoEncuesta = estado;
          }
        } catch (err: any) {
          okItem = false;
          msgFinal = (err?.message || String(err) || 'Error desconocido');
          await this.registrarEnvio(element, 'No enviado', 'Error');
          element.RespuestaEnvio = 'Error';
          element.EstadoEncuesta = 'No enviado';
        }

        logs.push({ idEmpleado: element.IdEmpleado, canal, ok: okItem, msg: msgFinal });
        okItem ? okCount++ : errCount++;
      }

      // Actualiza encabezado general (si aplica)
      try {
        await this.organizacionService.updateEncuestaEncabezado({ IdFlujo: this.currentCard.id, Estado: 2 });
        this.currentCard.estadoEnvio = 'Re enviado';
      } catch (_) { /* opcional: log */ }

      // Resumen final
      const total = okCount + errCount;
      const title = errCount === 0 ? this.sendText('PROCESS_SUCCESS') :
                    okCount === 0 ? this.sendText('PROCESS_WITHOUT_SUCCESS') :
                    this.sendText('PROCESS_PARTIAL');
      const icon  = errCount === 0 ? 'success' :
                    okCount === 0 ? 'error'   : 'warning';

      await Swal.fire({
        icon,
        title,
        html: `
          <div style="text-align:left">
            <div><strong>${this.sendText('PROCESSED_TOTAL')}:</strong> ${total}</div>
            <div style="color:#16a34a"><strong>${this.sendText('SUCCESSFUL_TOTAL')}:</strong> ${okCount}</div>
            <div style="color:#dc2626"><strong>${this.sendText('ERROR_TOTAL')}:</strong> ${errCount}</div>
          </div>
        `
      });

      // (Opcional) si quieres ver los mensajes individuales:
      // console.table(logs);

    } catch (err: any) {
      console.error(err);
      await Swal.fire(this.sendText('ERROR'), String(err), 'error');
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

  private validarRespuestaWhatsapp(response: any): { ok: boolean; status: string; detalle: string } {
    const payload = response?.data && typeof response.data === 'object' ? response.data : response;
    const messagingProduct = (payload?.messaging_product ?? '').toString().toLowerCase();
    const contact = payload?.contacts?.[0] ?? null;
    const message = payload?.messages?.[0] ?? null;
    const status = (message?.message_status ?? '').toString();

    const ok =
      messagingProduct === 'whatsapp' &&
      status.toLowerCase() === 'accepted' &&
      Boolean(contact?.wa_id || contact?.input) &&
      Boolean(message?.id);

    if (ok) {
      return { ok: true, status, detalle: '' };
    }

    const errores: string[] = [];
    if (messagingProduct !== 'whatsapp') errores.push('messaging_product inválido');
    if (!contact?.wa_id && !contact?.input) errores.push('contacto no retornado');
    if (!message?.id) errores.push('id de mensaje no retornado');
    if (!status) {
      errores.push('message_status vacío');
    } else if (status.toLowerCase() !== 'accepted') {
      errores.push(`message_status=${status}`);
    }

    return {
      ok: false,
      status,
      detalle: errores.join(', ') || 'Respuesta de WhatsApp inválida'
    };
  }
  

  private obtenerTotalPreguntasDesdeRespuesta(response: any): number {
    const raw =
      response?.data?.data?.totalPreguntas ??
      response?.data?.totalPreguntas ??
      response?.totalPreguntas;

    const total = Number(raw);
    return Number.isFinite(total) ? total : 0;
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
      plantilla = '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>{{DATOS["nombre_organizacion"]}}</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';
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
private async registrarEnvio(element: any, estado: 'Enviado'|'No enviado', respuesta: string): Promise<void> {
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
      title: this.sendText('ASSIGN_INDIVIDUAL_TITLE'),
      html: this.sendText('ASSIGN_INDIVIDUAL_TEXT', { employee: item.Empleado }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray',
      confirmButtonText: this.sendText('ASSIGN_INDIVIDUAL_CONFIRM'),
      cancelButtonText: this.sendText('ASSIGN_CANCEL')

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
              title: this.sendText('SUCCESS_TITLE'),
              text: this.sendText('ASSIGN_SUCCESS'),
              icon: 'success',
            });

            this.currentCard.estadoEnvio = 'Creado';
            
            this.loading = false;
            this.obtenerEncuestasEmpleados();
          }
    
        }).catch((err)=>{
          Swal.fire({
              title: this.sendText('ERROR_TITLE'),
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
    if (this.isDemoClimateSurveyResendBlocked(item)) {
      void this.showDemoClimateResendBlocked();
      return;
    }
    
    //validar que la encuesta tenga preguntas antes de enviar
    this.organizacionService.obtenerTotalPreguntasActivasClima(
      {'idFlujo':this.idFlujo} ).then((resultadopreguntas:any)=>{

      if(resultadopreguntas.data) {
        const totalPreguntas = this.obtenerTotalPreguntasDesdeRespuesta(resultadopreguntas);
        console.log('CUANTAS PREGUNTAS HAY? ', totalPreguntas, resultadopreguntas.data);

        if(totalPreguntas > 0) {
          //proceder..
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
              title: this.sendText('SEND_EMAIL_TITLE'),
              html: this.sendText('SEND_EMAIL_TEXT', { employee: item.Empleado }),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: 'green',
              cancelButtonColor: 'gray',
              confirmButtonText: this.sendText('SEND_EMAIL_CONFIRM'),
              cancelButtonText: this.sendText('ASSIGN_CANCEL')

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

                  } else {
                  //console.log('creo que entó a undefined!'); //plantilla genérica
                    plantilla_con_variables = //cambiar esta plantilla 
                    '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>{{DATOS["nombre_organizacion"]}}</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link360</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';
                    
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
                        item.EstadoEncuesta = 'Enviado';
                        item.FechaEnvio = updateData.FechaEnvio;
                        this.refreshFilteredTable();
          
                        Swal.fire({
                          title: this.sendText('SUCCESS_TITLE'),
                          text: resulten.data.message,
                          icon: 'success',
                        });
                        
                      }).catch((err)=>{
                        console.error(err);
                        Swal.fire({
                          title: this.sendText('SOMETHING_WRONG_TITLE'),
                          text: this.sendText('EMAIL_SEND_ERROR', { error: err }),
                          icon: 'error',
                        });
                      })
          
                      
                    } else {
                      Swal.fire({
                        title: this.sendText('SOMETHING_WRONG_TITLE'),
                        text: this.sendText('EMAIL_SEND_MESSAGE', { message: resulten.data.message }),
                        icon: 'error',
                      });
                    }
                    
                    this.loading = false;
                  }).catch((err)=>{
                    Swal.fire({
                    title: this.sendText('ERROR_TITLE'),
                    text: err,
                    icon: 'error',
                  });
                  this.loading = false;
                  });

                  
                }).catch((err) =>{
                  Swal.fire({
                    title: this.sendText('ERROR'),
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
              title: this.sendText('SEND_WHATSAPP_TITLE'),
              html: this.sendText('SEND_WHATSAPP_TEXT', { employee: item.Empleado }),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: 'green',
              cancelButtonColor: 'gray',
              confirmButtonText: this.sendText('SEND_WHATSAPP_CONFIRM'),
              cancelButtonText: this.sendText('ASSIGN_CANCEL')
            }).then((result) => {
              if (result.isConfirmed) {
                this.loading = true;
              //console.log('✅ Confirmado: Enviar encuesta individual por Whatsapp');
        
                //Cuerpecito del mensaje
                const whatsappBody: any = {
                  "to": item.Celular,
                  "employe_name": item.Empleado,
                  "organization_name": this.dataRecibida.subtitle,
                  "clima_code": item.CodigoEncuestaEmpleado,
                  "clima_name": this.dataRecibida.title,
                  "IdFlujo": this.dataRecibida.id,
                  "IdEmpleado": item.IdEmpleado,
                }          
          
                //Espera a que se envíe el mensaje carnal
                this.organizacionService.sendWhatsappMessageProd(whatsappBody).then((resiltixx)=>{
                  const waResult = this.validarRespuestaWhatsapp(resiltixx);

                  if (waResult.ok) {
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
                    item.EstadoEncuesta = 'Enviado';
                    item.FechaEnvio = updateData.FechaEnvio;
                    this.refreshFilteredTable();
                    this.loading = false;

                    Swal.fire({
                      title: this.sendText('SUCCESS_TITLE'),
                      text: this.sendText('MESSAGE_SENT_SUCCESS'),
                      icon: 'success',
                    });
                  } else {
                    item.RespuestaEnvio = 'Error al enviar el mensaje';
                    this.loading = false;
                    Swal.fire({
                      title: this.sendText('SOMETHING_WRONG_TITLE'),
                      text: this.sendText('MESSAGE_SEND_ERROR', { detail: waResult.detalle || waResult.status || this.sendText('NO_DETAIL') }),
                      icon: 'error',
                    });
                  }

                }).catch((err)=>{
                  console.error(err);
                  Swal.fire({
                    title: this.sendText('ERROR_TITLE'),
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
              title: this.sendText('SEND_BOTH_TITLE'),
              html: this.sendText('SEND_BOTH_TEXT', { employee: item.Empleado }),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: 'green',
              cancelButtonColor: 'gray',
              confirmButtonText: this.sendText('SEND_BOTH_CONFIRM'),
              cancelButtonText: this.sendText('ASSIGN_CANCEL')
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
                  plantilla_con_variables = '<head><meta charset="utf-8"><meta name="x-apple-disable-message-reformatting"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Invitación a encuesta</title><style>@media (max-width:600px){.container{width:100%!important}.px{padding-left:20px!important;padding-right:20px!important}.btn{width:100%!important}}@media (prefers-color-scheme: dark){body,.wrapper{background:#0f1115!important}.card{background:#171a21!important}.text{color:#e8eaf0!important}.muted{color:#a7b0c0!important}.btn a{color:#0f1115!important}}</style></head><body style="margin:0;padding:0;background:#f4f6f8;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante.</div><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" class="wrapper" style="background:#f4f6f8;"><tr><td align="center" style="padding:24px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.06);"><tr><td align="center" style="background:#0d6efd;padding:20px 24px;"></td></tr><tr><td class="px" style="padding:32px;"><h1 class="text" style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#1f2937;">Estimado colaborador:</h1><p class="text" style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Has sido invitado a participar en la <br><strong style="font-size:17px;">“{{DATOS["nombre_clima"]}}”</strong></p><p class="text" style="margin:0 0 24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;line-height:1.6;color:#374151;">Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. ¡Gracias por tu tiempo!</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btn" style="margin:0 auto 16px auto;"><tr><td align="center" bgcolor="#0d6efd" style="border-radius:10px;"><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="display:inline-block;background:#0d6efd;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:16px;font-weight:600;line-height:48px;padding:0 28px;border-radius:10px;">Comenzar encuesta</a></td></tr></table><p class="muted" style="margin:8px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b7280;text-align:center;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="{{DATOS["url_encuesta"]}}" target="_blank" style="color:#0d6efd;word-break:break-all;text-decoration:underline;">{{DATOS["url_encuesta"]}}</a></p><hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;"><p class="text" style="margin:0 0 6px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">Atentamente,<br><strong>{{DATOS["nombre_organizacion"]}}</strong></p><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b7280;">Por favor, no reenvíes este correo. El enlace es único para tu participación.</p></td></tr><tr><td align="center" style="padding:16px 24px;background:#ffffff;border-top:1px solid #eef2f7;"><p class="muted" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.5;color:#98a2b3;">© Just-Link</p></td></tr></table><div style="height:24px;line-height:24px;font-size:24px;">&zwnj;</div></td></tr></table></body>';
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
                  this.organizacionService.sendWhatsappMessageProd(whatsappBody),
                ]);

                // Evaluar CORREO
                let correoOk = false;
                let correoMsg = '';

                if (correoRes.status === 'fulfilled') {
                  correoMsg = correoRes.value?.data?.message || '';
                  correoOk = this.esOk(correoMsg);
                } else {
                  correoMsg = String(correoRes.reason);
                }

                // Evaluar WHATSAPP
                let waOk = false;
                let waMsg = '';

                if (waRes.status === 'fulfilled') {
                  const waResult = this.validarRespuestaWhatsapp(waRes.value);
                  waMsg = waResult.status || waResult.detalle || '';
                  waOk = waResult.ok;
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
                  Estado: (correoOk || waOk) ? 'Enviado' : 'No enviado',
                  FechaEnvio: new Date().toISOString().slice(0, 19).replace('T', ' '),
                  FechaInicio: null,
                  FechaFinalizacion: null,
                  Eliminada: 0,
                  RespuestaEnvio: respuestaEnvio
                };

                await this.organizacionService.updateEncuestaEmpleado(updateData);
                item.RespuestaEnvio = respuestaEnvio;
                item.EstadoEncuesta = updateData.Estado;
                item.FechaEnvio = updateData.FechaEnvio;
                this.refreshFilteredTable();

                // =========================
                // 5) FEEDBACK UI
                // =========================
                if (correoOk && waOk) {
                  Swal.fire({
                    title: this.sendText('SUCCESS_TITLE'),
                    text: this.sendText('BOTH_SENT_SUCCESS'),
                    icon: 'success',
                  });
                } else if (correoOk || waOk) {
                  Swal.fire({
                    title: this.sendText('PARTIAL_SEND_TITLE'),
                    html:
                      `${correoOk
                        ? this.sendText('EMAIL_SENT_HTML')
                        : this.sendText('EMAIL_FAILED_HTML', { detail: correoMsg || this.sendText('NO_DETAIL') })}` +
                      `${waOk
                        ? this.sendText('WHATSAPP_SENT_HTML')
                        : this.sendText('WHATSAPP_FAILED_HTML', { detail: waMsg || this.sendText('NO_DETAIL') })}`,
                    icon: 'warning',
                  });
                } else {
                  Swal.fire({
                    title: this.sendText('SOMETHING_WRONG_TITLE'),
                    text: this.sendText('BOTH_SEND_ERROR'),
                    icon: 'error',
                  });
                }

              } catch (err) {
                console.error(err);
                Swal.fire({
                  title: this.sendText('ERROR_TITLE'),
                  text: String(err),
                  icon: 'error',
                });
              } finally {
                this.loading = false;
              }
            });
          }


        }
         else {
          Swal.fire(this.sendText('ERROR'), this.sendText('NO_QUESTIONS'), 'error');
        }
      } 
      else {
        Swal.fire(this.sendText('ERROR'), this.sendText('QUESTIONS_UNAVAILABLE'), 'error');
      }

    }).catch((err:any)=>{
      Swal.fire(this.sendText('SOMETHING_WRONG_TITLE'), this.sendText('QUESTIONS_ERROR', { error: err }), 'error');
    });


   

  }
  
  //crea las encuestas.#
  /*
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
  */

  obtenerEncuestasEmpleados(): void {
    console.log('entra en obtener encuestas empleados:: ', this.dataRecibida.id);
    this.loading = true;
    this.dataRecibida.id;

    this.organizacionService.getEncuestasFlujo(this.dataRecibida.id).then((resultix)=>{
     console.log('resultix encuestas empleados:: ', resultix);
      this.tableDataSource = Array.isArray(resultix.data) ? resultix.data : [];
      this.dynamicDemographicColumns = this.getDynamicDemographicColumns(this.tableDataSource);
      this.updateDisplayedColumns();
      this.updateEstadoFilterOptions();
      this.refreshFilteredTable();
      this.loading = false;
    }).catch((err)=>{
      console.error(err);
      this.tableDataSource = [];
      this.filteredTableDataSource = [];
      this.dynamicDemographicColumns = [];
      this.updateDisplayedColumns();
      this.loading = false;
    });
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
        return this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.EMAIL_CHANNEL');
      case 2:
        return this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.WHATSAPP_CHANNEL');
      case 3:
        return this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.EMAIL_WHATSAPP_CHANNEL');
      default:
        return this.translate.instant('MENUITEMS.TOUR.SEND_CLIMATE.UNKNOWN');
    }
  }

  private sendText(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(`MENUITEMS.TOUR.SEND_CLIMATE.${key}`, params);
  }

  getEstadoTexto(estado: string | null | undefined): string {
    const normalized = this.normalizeEstadoEncuesta(estado);
    const statusKeyByValue: Record<string, string> = {
      'contestada': 'STATUS_ANSWERED',
      'completada': 'STATUS_COMPLETED',
      'enviado': 'STATUS_SENT',
      're enviado': 'STATUS_RESENT',
      'reenviado': 'STATUS_RESENT',
      'iniciada': 'STATUS_STARTED',
      'creado': 'STATUS_CREATED',
      'no enviado': 'STATUS_NOT_SENT',
      'sin encuesta': 'STATUS_NO_SURVEY',
      'no procesado': 'STATUS_NOT_PROCESSED'
    };
    const key = statusKeyByValue[normalized.toLowerCase()];
    return key
      ? this.translate.instant(`MENUITEMS.TOUR.SEND_CLIMATE.${key}`)
      : normalized;
  }

  setTipoEnvioFilter(tipo: number | 'ALL'): void {
    this.selectedTipoEnvioFilter = tipo;
    this.refreshFilteredTable();
  }

  setEstadoFilter(estado: string): void {
    this.selectedEstadoFilter = estado;
    this.refreshFilteredTable();
  }

  descargarExcel(): void {
    if (!this.filteredTableDataSource.length) {
      Swal.fire({
        title: this.sendText('NO_EXPORT_DATA_TITLE'),
        text: this.sendText('NO_EXPORT_DATA_TEXT'),
        icon: 'info',
      });
      return;
    }

    const exportColumns = [
      { key: 'IdEmpleado', header: 'ID', width: 12 },
      { key: 'Empleado', header: 'Empleado', width: 28 },
      { key: 'Email', header: 'Correo', width: 30 },
      { key: 'Celular', header: 'Celular', width: 16 },
      { key: 'TipoEnvioEncuesta', header: 'Tipo envio', width: 20 },
      { key: 'EstadoEncuesta', header: 'Estado encuesta', width: 18 },
      { key: 'FechaEnvio', header: 'Fecha enviado', width: 20 },
      { key: 'FechaInicio', header: 'Fecha inicio', width: 20 },
      { key: 'FechaFinalizacion', header: 'Fecha finalizado', width: 20 },
      { key: 'RespuestaEnvio', header: 'Respuesta envio', width: 20 },
      { key: 'CodigoEncuestaEmpleado', header: 'Codigo encuesta', width: 22 },
      ...this.dynamicDemographicColumns.map((column) => ({
        key: column,
        header: column,
        width: 22,
        dynamic: true,
      })),
    ];

    const rows = this.filteredTableDataSource.map((item) => {
      const row: Record<string, unknown> = {
        IdEmpleado: item.IdEmpleado ?? '-',
        Empleado: this.formatDynamicColumnValue(item.Empleado),
        Email: this.formatDynamicColumnValue(item.Email),
        Celular: this.formatDynamicColumnValue(item.Celular),
        TipoEnvioEncuesta: this.getTipoEnvioTexto(Number(item.TipoEnvioEncuesta)),
        EstadoEncuesta: this.normalizeEstadoEncuesta(item.EstadoEncuesta),
        FechaEnvio: item.FechaEnvio ? this.convertirFecha(item.FechaEnvio) : '-',
        FechaInicio: item.FechaInicio ? this.convertirFecha(item.FechaInicio) : '-',
        FechaFinalizacion: item.FechaFinalizacion ? this.convertirFecha(item.FechaFinalizacion) : '-',
        RespuestaEnvio: this.formatDynamicColumnValue(item.RespuestaEnvio),
        CodigoEncuestaEmpleado: this.formatDynamicColumnValue(item.CodigoEncuestaEmpleado),
      };

      for (const column of this.dynamicDemographicColumns) {
        row[column] = this.formatDynamicColumnValue(item[column]);
      }

      return row;
    });

    const filtroTipo = this.selectedTipoEnvioFilter === 'ALL'
      ? 'Todos'
      : this.getTipoEnvioTexto(Number(this.selectedTipoEnvioFilter));

    const filtroEstado = this.selectedEstadoFilter === 'ALL'
      ? 'Todos'
      : this.selectedEstadoFilter;

    const fileSafeTitle = (this.currentCard?.title || 'Envio_Encuestas')
      .replace(/[^a-zA-Z0-9-_]+/g, '_')
      .replace(/_+/g, '_');

    this.excelXlsxService.exportarEncuestasEnvio({
      title: `Envio de encuestas - ${this.currentCard?.title || 'Sin nombre'}`,
      subtitle: `Organizacion: ${this.dataRecibida?.subtitle || 'Sin nombre'} | Registros exportados: ${rows.length}`,
      filters: [
        `Filtro tipo envio: ${filtroTipo}`,
        `Filtro estado: ${filtroEstado}`,
      ],
      columns: exportColumns,
      rows,
      fileName: `${fileSafeTitle}_EnvioEncuestas.xlsx`,
      sheetName: 'Envio encuestas',
    });
  }

  toggleDynamicDemographicColumns(): void {
    this.showDynamicDemographicColumns = !this.showDynamicDemographicColumns;
    this.updateDisplayedColumns();
  }

  getEstadoTotal(estado: string): number {
    return this.tableDataSource.filter((item) => this.matchesEstadoFilter(item, estado)).length;
  }

  getTipoEnvioTotal(tipo: number): number {
    return this.tableDataSource.filter((item) => Number(item?.TipoEnvioEncuesta) === tipo).length;
  }

  getEstadoBadgeClass(estado: string | null | undefined): string {
    switch (this.normalizeEstadoEncuesta(estado)) {
      case 'Contestada':
        return 'status-badge--contestada';
      case 'Enviado':
        return 'status-badge--enviado';
      case 'Iniciada':
        return 'status-badge--iniciada';
      case 'Creado':
        return 'status-badge--creado';
      case 'No enviado':
        return 'status-badge--no-enviado';
      case 'Sin encuesta':
        return 'status-badge--sin-encuesta';
      default:
        return 'status-badge--neutral';
    }
  }

  normalizeEstadoEncuesta(estado: string | null | undefined): string {
    const normalized = (estado ?? '').toString().trim();
    return normalized || 'Sin encuesta';
  }

  private isClimateSurveyAlreadySent(item: any): boolean {
    const status = this.normalizeEstadoEncuesta(item?.EstadoEncuesta).toLowerCase();
    return [
      'enviado',
      're enviado',
      'reenviado',
      'iniciada',
      'contestada',
      'completada',
    ].includes(status);
  }

  private async showDemoClimateResendBlocked(): Promise<void> {
    await Swal.fire({
      title: this.sendText('RESEND_UNAVAILABLE_TITLE'),
      text: this.sendText('RESEND_UNAVAILABLE_TEXT'),
      icon: 'info',
    });
  }

  formatDynamicColumnValue(value: unknown): string {
    const normalized = value == null ? '' : String(value).trim();
    return normalized || '-';
  }

  private refreshFilteredTable(): void {
    this.filteredTableDataSource = this.tableDataSource.filter((item) => {
      const matchesTipo = this.selectedTipoEnvioFilter === 'ALL'
        ? true
        : Number(item?.TipoEnvioEncuesta) === this.selectedTipoEnvioFilter;
      const matchesEstado = this.selectedEstadoFilter === 'ALL'
        ? true
        : this.matchesEstadoFilter(item, this.selectedEstadoFilter);

      return matchesTipo && matchesEstado;
    });
  }

  private matchesEstadoFilter(item: any, estado: string): boolean {
    if (estado === 'No enviado') {
      return this.isRespuestaEnvioEmpty(item);
    }

    return this.normalizeEstadoEncuesta(item?.EstadoEncuesta) === estado;
  }

  private isRespuestaEnvioEmpty(item: any): boolean {
    return !String(item?.RespuestaEnvio ?? '').trim();
  }

  private updateEstadoFilterOptions(): void {
    const dynamicStates = this.tableDataSource
      .map((item) => this.normalizeEstadoEncuesta(item?.EstadoEncuesta))
      .filter((estado, index, arr) => estado && arr.indexOf(estado) === index);

    this.estadoFilterOptions = [
      ...this.baseEstadoFilterOptions.filter((estado, index, arr) => arr.indexOf(estado) === index),
      ...dynamicStates.filter((estado) => !this.baseEstadoFilterOptions.includes(estado))
    ];

    if (this.selectedEstadoFilter !== 'ALL' && !this.estadoFilterOptions.includes(this.selectedEstadoFilter)) {
      this.selectedEstadoFilter = 'ALL';
    }
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = [
      ...this.baseDisplayedColumns.filter((column) => !this.hiddenDisplayedColumns.has(column)),
      ...(this.showDynamicDemographicColumns ? this.dynamicDemographicColumns : []),
      ...this.trailingDisplayedColumns
    ];
  }

  private getDynamicDemographicColumns(rows: any[]): string[] {
    const dynamicColumns: string[] = [];
    const knownColumns = new Set(this.baseDisplayedColumns);

    for (const row of rows) {
      for (const key of Object.keys(row ?? {})) {
        if (knownColumns.has(key) || dynamicColumns.includes(key)) {
          continue;
        }

        dynamicColumns.push(key);
      }
    }

    return dynamicColumns;
  }
  
  
 
}
