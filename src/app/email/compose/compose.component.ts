import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import grapesjs, { Editor as GjsEditor } from 'grapesjs';
import newsletterPreset from 'grapesjs-preset-newsletter';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import es from 'grapesjs/locale/es.mjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogSaveEmailTemplateComponent } from '../dialogs/DialogSaveEmailTemplateComponent';
import { MatChipsModule } from '@angular/material/chips';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core';
import { Router } from '@angular/router';


import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { relativeTimeThreshold } from 'moment';

type ToTarget = 'correo' | 'pendiente_llenar' | 'encuestas_completadas' | 'todos_activos';
type OrganizationOption = { Id: number; Nombre: string };

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
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [BreadcrumbComponent, FormsModule, MatChipsModule, ReactiveFormsModule,
    MatButtonModule, MatInputModule, TranslateModule, MatDialogModule, MatIconModule,
    MatFormFieldModule, CommonModule, MatProgressSpinnerModule, MatSelectModule],
})
export class ComposeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gjsHost', { static: true }) gjsHost!: ElementRef<HTMLDivElement>;


  toOptions: { value: ToTarget; label: string }[] = [
    { value: 'correo', label: 'Correo' },
    { value: 'todos_activos', label: 'Todos los empleados' },
    { value: 'pendiente_llenar', label: 'Pendientes llenar' },
    { value: 'encuestas_completadas', label: 'Encuestas completadas' },
  ];

  toTargetsCtrl = new FormControl<ToTarget[]>([], { nonNullable: true });

  organizationCtrl = new FormControl<OrganizationOption | null>(null);
  secondaryListCtrl = new FormControl<number | null>(null);
  secondaryListOptions: Array<{ id: number; nombre: string }> = [];

  emailManualCtrl = new FormControl<string>('', {
    nonNullable: true,
    validators: []
  });

  subjectManualCtrl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  private gjs?: GjsEditor;

  // Para ver/exportar (debug o para enviar al backend)
  exportedHtml = '';
  langStoreValue?: string;

  public loading = false;
  public destinatarioIndividual = '';
  public nombreOrganizacion = '';
  public nombreClima = '';
  public asuntoIndividual = '';

  public accessToFilter = true;
  public accessToExport = true;

  public dataSourceClimas: any = [];

  public idFlujo = 0;
  public nombreFlujo = '';

  public idOrganization = 0;
  public loadingOrganizations = false;
  public loadingClimas = false;
  public dataSourceOrganizations: any = [];

  private validateEmailList = (control: AbstractControl): ValidationErrors | null => {
    const raw = String(control.value ?? '').trim();
    if (!raw) {
      return null;
    }

    const emails = raw.split(',').map((email) => email.trim());

    // Detecta comas dobles o coma final/inicial.
    if (emails.some((email) => !email)) {
      return { emailList: true };
    }

    const hasInvalidEmail = emails.some((email) => Validators.email({ value: email } as AbstractControl) !== null);
    return hasInvalidEmail ? { emailList: true } : null;
  };

  constructor(private languageService: LanguageService, private translate: TranslateService,
    public dialog: MatDialog, private authService: AuthService, private router: Router,
    private organizationService: OrganizacionService,) {

    this.toTargetsCtrl.valueChanges.subscribe((vals) => {
      const hasCorreo = (vals || []).includes('correo');

      if (hasCorreo) {
        this.emailManualCtrl.setValidators([Validators.required, this.validateEmailList]);
      }
      else {
        this.emailManualCtrl.clearValidators();
        this.emailManualCtrl.setValue('');
      }

      this.emailManualCtrl.updateValueAndValidity({ emitEvent: false });

    });





  }

  isCorreoSelected(): boolean {
    return this.toTargetsCtrl.value.includes('correo');
  }

  isPendientesSelected(): boolean {
    return this.toTargetsCtrl.value.includes('pendiente_llenar');
  }

  isCompletadasSelected(): boolean {
    return this.toTargetsCtrl.value.includes('encuestas_completadas');
  }

   isTodosActivosSelected(): boolean {
    return this.toTargetsCtrl.value.includes('todos_activos');
  }

  hasSelectedClima(): boolean {
    return this.idFlujo > 0;
  }

  hasSelectedOrganization(): boolean {
    return this.idOrganization > 0;
  }

  canSaveTemplate(): boolean {
    return this.hasSelectedOrganization() && this.hasSelectedClima();
  }

  isToTargetDisabled(target: ToTarget): boolean {
    if (target === 'todos_activos' && !this.hasSelectedOrganization()) {
      return true;
    }

    const requiresClima = target === 'pendiente_llenar' || target === 'encuestas_completadas';
    return requiresClima && !this.hasSelectedClima();
  }

  private clearClimaDependentTargets(): void {
    const rawValue = this.toTargetsCtrl.value as ToTarget[] | ToTarget | null;
    const current = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];
    const filtered = current.filter(
      (target) => target !== 'pendiente_llenar' && target !== 'encuestas_completadas',
    );

    if (filtered.length !== current.length) {
      this.toTargetsCtrl.setValue(filtered);
    }
  }

  private resetSelectedClima(): void {
    this.idFlujo = 0;
    this.nombreFlujo = '';
    this.clearClimaDependentTargets();
  }

  removeToTarget(val: ToTarget) {
    const current = this.toTargetsCtrl.value || [];
    this.toTargetsCtrl.setValue(current.filter(x => x !== val));
  }

  getToLabel(val: ToTarget): string {
    return this.toOptions.find(o => o.value === val)?.label ?? val;
  }

  ngAfterViewInit(): void {
    this.initGrapes();
    this.registerCustomBlocks();
    this.loadStarterTemplate();

    this.gjs?.I18n.setLocale('es');
    this.gjs?.render();



  }


  existsRoute(routes: RouteInfo[], target: string): boolean {
    return routes.some(route =>
      route.path === target ||
      this.existsRoute(route.submenu, target)
    );
  }

  ngOnInit(): void {

    //this.getEmailTemplatesByOrg();

    console.log('CURRENT USER DESDE COMPOSE:: ', this.authService.currentUserValue);

    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
      console.log('RUTAS DESDE COMPOSE:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/email/compose');
      console.log(found);

      if (!found) {
        this.router.navigate(['/authentication/page404']);
      }

    }



    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;

    //console.log('this.langStoreValue dialogformitem:: ', this.langStoreValue);

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    if (this.authService.currentUserValue?.roles[0].roleName === 'admin') {
      this.getOrganizations();
    }
    else {

      //validar permisos de acciones
      const permisoexport = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'exportdash');
      const permisofilter = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'filterdash');

      //console.log('permisofilter',permisofilter);
      /**/
      if (permisoexport) {
        this.accessToExport = true;
        //this.btnDisabled = false;
      } else {
        this.accessToExport = false;
        //this.btnDisabled = true;
      }

      if (permisofilter) {
        this.accessToFilter = true;
        //this.btnDisabled = false;
      } else {
        this.accessToFilter = false;
        //this.btnDisabled = true;
      }

      this.getOrganizationById(this.authService.currentUserValue?.idOrganization);

      


    }


  }

  getEmailTemplatesByOrg(): void {
    
    const dataSend = {IdOrganizacion: this.idOrganization, SoloActivas: true }

    this.organizationService.obtenerPlantillasCorreoOrg(dataSend).then((respons:any)=>{
      console.log('respons:: ', respons.data.data);
      if(respons.data.data) {

        //agregar aquí la lógica para pintar..
        this.registerDynamicCustomBlocks(respons.data.data);

      }
    }).catch((err:any)=>{
      Swal.fire('Error', 'Ocurrió un error al obtener las plantillas. ' + 'error: ' + err);
    })

    
  
  }

  getEmailTemplatesByFlujo(): void {
    
    const dataSend = {IdFlujo: this.idFlujo, SoloActivas: true }

    this.organizationService.obtenerPlantillasCorreoByFlujo(dataSend).then((respons:any)=>{
      console.log('respons:: ', respons.data.data);
      if(respons.data.data) {

        this.registerDynamicCustomBlocks(respons.data.data);

      }
    }).catch((err:any)=>{
      Swal.fire('Error', 'Ocurrió un error al obtener las plantillas. ' + 'error: ' + err);
    })

    
  
  }

   

  getOrganizations(): void {

    this.loadingOrganizations = true;

    this.organizationService.getOrganizations()
      .then((response: any) => {
        //console.log('Organizacionesxx:', JSON.stringify(response.data));

        this.dataSourceOrganizations = response.data;

        this.loadingOrganizations = false;

      })
      .catch((error: any) => {
        console.error('Error al obtener organizaciones:', error);
        this.loadingOrganizations = false;
      });


  }


  getOrganizationById(idOrganization: any): void {
    this.loadingOrganizations = true;
    this.organizationService.getOrganizationById(idOrganization)
      .then((response: any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));

        this.dataSourceOrganizations = response.data;

        this.idOrganization = idOrganization;
        this.dataSourceClimas = [];
        this.resetSelectedClima();
        this.nombreOrganizacion = 'cargando..'
        this.loadingOrganizations = false;
        this.getFlujosLista();

      })
      .catch((error: any) => {
        console.error('Error al obtener organizaciones:', error);
        this.loadingOrganizations = false;
      });
  }

  getFlujosLista(): void {

    this.loadingClimas = true;

    this.organizationService.getFlujosLista(this.idOrganization)
      .then((response: any) => {
        ////console.log('Flujos Plantillas:', JSON.stringify(response.data));

        this.dataSourceClimas = response.data.data;
        var org = this.dataSourceOrganizations.find((o: { Id: number; }) => o.Id === this.idOrganization);
        this.nombreOrganizacion = org.Nombre;

        this.loadingClimas = false;

      })
      .catch((error: any) => {
        console.error('Error al obtener los flujos:', error);
        this.loadingClimas = false;
      });
  };

  onClimaChange(selectedId: number) {
    if (!selectedId) {
      this.resetSelectedClima();
      return;
    }

    this.idFlujo = selectedId;

    const clima = this.dataSourceClimas.find((c: { Id: number; }) => c.Id === this.idFlujo);

    console.log('clima:: ', clima);
    this.nombreFlujo = clima?.Nombre ?? '';

    this.getEmailTemplatesByFlujo();

    if (!clima) {
      this.resetSelectedClima();
    }

  };

  ngOnDestroy(): void {
    // Destruye el editor correctamente
    this.gjs?.destroy();
  }

  private initGrapes(): void {
    this.gjs = grapesjs.init({
      container: this.gjsHost.nativeElement,
      height: '700px',
      width: 'auto',
      storageManager: false,
      plugins: [newsletterPreset, this.grapesSpanishOverridesPlugin()],

      i18n: {
        locale: 'es',
        detectLocale: false,      // <-- evita que el navegador lo pise
        localeFallback: 'en',
        messages: { es },         // <-- carga el paquete completo
      },
    });

    // Si quieres verificar:
    console.log('Grapes locale:', this.gjs.I18n.getLocale());
  }

  private grapesSpanishOverridesPlugin() {
    return (editor: GjsEditor) => {
      editor.I18n.addMessages({
        es: {
          styleManager: {
            empty: 'Selecciona un elemento para editar estilos',
            sectors: {
              general: 'General',
              layout: 'Diseño',
              typography: 'Tipografía',
              decorations: 'Decoración',
              extra: 'Extra',
              dimension: 'Dimensión',
            },
            properties: {
              'font-family': 'Fuente',
              'font-size': 'Tamaño',
              'font-weight': 'Grosor',
              color: 'Color',
              'background-color': 'Color de fondo',
              margin: 'Margen',
              padding: 'Relleno',
              border: 'Borde',
              'border-radius': 'Radio de borde',
              width: 'Ancho',
              height: 'Alto',
              'border-collapse': 'Colapso de borde',
            },
          },

          traitManager: {
            empty: 'Selecciona un elemento para editar propiedades',
            label: 'Propiedades',
          },

          layerManager: {
            label: 'Capas',
            empty: 'No hay capas',
          },

          selectorManager: {
            label: 'Clases',
            empty: 'Selecciona un elemento para ver clases',
          },
        },
      });
    };
  }


  private registerCustomBlocks(): void {
    if (!this.gjs) return;

    const bm = this.gjs.BlockManager;

    // Card (tabla simple, “email friendly”)
    bm.add('email-full-card', {
      label: 'Invitación Encuesta',
      category: 'Plantillas Clima',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-envelope-open-text" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html> 
          <html lang="es">
            <head>
                <meta charset="utf-8" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Invitación a encuesta</title>
                <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } @media (max-width: 600px) { .container { width: 100% !important; } .px { padding-left: 20px !important; padding-right: 20px !important; } .btnWrap { width: 100% !important; } } </style>
            </head>
            <body style="margin:0; padding:0; background:#f8f5ee;">
                <div style="display:none; max-height:0; overflow:hidden; opacity:0;"> Invitación a completar la encuesta. Tu participación es importante. </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
                  <tbody>
                      <tr>
                        <td align="center" style="padding:24px;">
                            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                              <tbody>
                                  <tr>
                                    <td style="background:#0d6efd; padding:22px 24px;"></td>
                                  </tr>
                                  <tr>
                                    <td class="px" style="padding:28px 32px 18px 32px;">
                                        <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;"> Hola 👋 </h1>
                                        <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;"> Has sido invitado(a) a participar en la encuesta de Clima Organizacional: <br /> <strong style="color:#111827;">“”</strong> </p>
                                        <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;"> Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. <br /> <strong style="color:#111827;">¡Gracias por tu tiempo!</strong> </p>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap" style="margin:14px auto 14px auto;">
                                          <tbody>
                                              <tr>
                                                <td align="center" bgcolor="#0d6efd" style="border-radius:10px;"> <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; color:#ffffff; padding:14px 34px; line-height:1; border-radius:10px;"> Comenzar encuesta </a> </td>
                                              </tr>
                                          </tbody>
                                        </table>
                                        <p style="margin:10px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:13px; line-height:1.5; color:#6b7280; text-align:center;"> Si el botón no funciona, copia y pega este enlace en tu navegador: <br /> <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;"> {{DATOS["url_encuesta"]}} </a> </p>
                                        <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />
                                        <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;"> Atentamente, <br /> <strong style="color:#111827;">Equipo de Just-Link</strong> </p>
                                        <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;"> Por favor, no reenvíes este correo. El enlace es único para tu participación. </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                                        <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;"> © Just-Link </p>
                                    </td>
                                  </tr>
                              </tbody>
                            </table>
                            <div style="height:24px; line-height:24px; font-size:24px;">‌</div>
                        </td>
                      </tr>
                  </tbody>
                </table>
            </body>
          </html>
      `.trim(),
    });

    bm.add('email-recordatorio-card', {
      label: 'Recordatorio Encuesta',
      category: 'Plantillas Clima',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-bell" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Recordatorio de encuesta</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
              @media (max-width: 600px) {
                .container { width: 100% !important; }
                .px { padding-left: 20px !important; padding-right: 20px !important; }
                .btnWrap { width: 100% !important; }
              }
            </style>
          </head>

          <body style="margin:0; padding:0; background:#f8f5ee;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
              Recordatorio: aún tienes pendiente completar la encuesta «Encuesta».
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
              <tbody>
                <tr>
                  <td align="center" style="padding:24px;">

                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container"
                      style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                      <tbody>

                        <tr>
                          <td style="background:#0d6efd; padding:22px 24px;"></td>
                        </tr>

                        <tr>
                          <td class="px" style="padding:28px 32px 18px 32px;">

                            <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;">
                              Hola 👋
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Este es un recordatorio amable: aún tienes pendiente completar la encuesta de Clima Organizacional
                          
                             
                            </p>

                            <p style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Tu participación es muy importante para mejorar. Completarla toma solo unos minutos.
                            </p>

                            <!-- Opcional: fecha límite (elimínalo si no usas esa variable) -->
                            <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              <strong style="color:#111827;">Fecha límite:</strong> [fecha]
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap"
                              style="margin:14px auto 14px auto;">
                              <tbody>
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:10px;">
                                    <a href='{{DATOS["url_encuesta"]}}' target="_blank"
                                    style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;
                                            font-size:16px; font-weight:700; text-decoration:none; color:#ffffff;
                                            background-color:#18B3B3; padding:14px 34px; line-height:1.2; border-radius:10px;">
                                    Continuar / completar encuesta
                                  </a>

                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <p style="margin:10px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:13px; line-height:1.5; color:#6b7280; text-align:center;">
                              Si el botón no funciona, copia y pega este enlace en tu navegador:
                              <br />
                              <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;">
                                {{DATOS["url_encuesta"]}}
                              </a>
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                            <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              Gracias por tu tiempo,
                              <br />
                              <strong style="color:#111827;">Equipo de Just-Link</strong>
                            </p>

                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;">
                              Por favor, no reenvíes este correo. El enlace es único para tu participación.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;">
                              © Just-Link
                            </p>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div style="height:24px; line-height:24px; font-size:24px;">‌</div>

                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>

      `.trim(),
    });

    bm.add('email-agradecimiento-card', {
      label: 'Agradecimiento Encuesta',
      category: 'Plantillas Clima',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-heart" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Gracias por completar la encuesta</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
              @media (max-width: 600px) {
                .container { width: 100% !important; }
                .px { padding-left: 20px !important; padding-right: 20px !important; }
              }
            </style>
          </head>

          <body style="margin:0; padding:0; background:#f8f5ee;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
              Gracias por completar la encuesta. Tu opinión es muy valiosa para nosotros.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
              <tbody>
                <tr>
                  <td align="center" style="padding:24px;">

                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container"
                      style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                      <tbody>

                        <tr>
                          <td style="background:#18B3B3; padding:22px 24px;"></td>
                        </tr>

                        <tr>
                          <td class="px" style="padding:28px 32px 18px 32px;">

                            <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;">
                              ¡Gracias por participar! 🙌
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Hemos recibido tu respuesta a la encuesta de Clima Organizacional.
                            </p>

                            <p style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Tu opinión es fundamental para identificar oportunidades de mejora y construir un mejor lugar de trabajo para todos.
                            </p>

                            <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              <strong style="color:#111827;">Apreciamos tu tiempo y compromiso.</strong>
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                            <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              Atentamente,
                              <br />
                              <strong style="color:#111827;">Equipo de Just-Link</strong>
                            </p>

                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;">
                              Este correo es informativo, no requiere respuesta.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;">
                              © Just-Link
                            </p>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div style="height:24px; line-height:24px; font-size:24px;">‌</div>

                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
      `.trim(),
    });

    bm.add('email-desempeno-invitacion-card', {
      label: 'Invitación Evaluación',
      category: 'Plantillas Desempeño',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-chart-line" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Invitación a evaluación de desempeño</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
              @media (max-width: 600px) {
                .container { width: 100% !important; }
                .px { padding-left: 20px !important; padding-right: 20px !important; }
                .btnWrap { width: 100% !important; }
              }
            </style>
          </head>

          <body style="margin:0; padding:0; background:#f8f5ee;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
              Invitación a completar la evaluación de desempeño. Tu participación es importante.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
              <tbody>
                <tr>
                  <td align="center" style="padding:24px;">

                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container"
                      style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                      <tbody>

                        <tr>
                          <td style="background:#0d6efd; padding:22px 24px;"></td>
                        </tr>

                        <tr>
                          <td class="px" style="padding:28px 32px 18px 32px;">

                            <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;">
                              Hola 👋
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Has sido invitado(a) a completar tu evaluación de desempeño.
                            </p>

                            <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Tu retroalimentación es valiosa para tu desarrollo profesional y para fortalecer al equipo.
                              <br />
                              <strong style="color:#111827;">¡Gracias por tu participación!</strong>
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap"
                              style="margin:14px auto 14px auto;">
                              <tbody>
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:10px;">
                                    <a href='{{DATOS["url_encuesta"]}}' target="_blank"
                                      style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; color:#ffffff; padding:14px 34px; line-height:1; border-radius:10px;">
                                      Comenzar evaluación
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <p style="margin:10px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:13px; line-height:1.5; color:#6b7280; text-align:center;">
                              Si el botón no funciona, copia y pega este enlace en tu navegador:
                              <br />
                              <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;">
                                {{DATOS["url_encuesta"]}}
                              </a>
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                            <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              Atentamente,
                              <br />
                              <strong style="color:#111827;">Equipo de Just-Link</strong>
                            </p>

                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;">
                              Por favor, no reenvíes este correo. El enlace es único para tu participación.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;">
                              © Just-Link
                            </p>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div style="height:24px; line-height:24px; font-size:24px;">‌</div>

                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
      `.trim(),
    });

    bm.add('email-desempeno-recordatorio-card', {
      label: 'Recordatorio Evaluación',
      category: 'Plantillas Desempeño',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-bell" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Recordatorio de evaluación de desempeño</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
              @media (max-width: 600px) {
                .container { width: 100% !important; }
                .px { padding-left: 20px !important; padding-right: 20px !important; }
                .btnWrap { width: 100% !important; }
              }
            </style>
          </head>

          <body style="margin:0; padding:0; background:#f8f5ee;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
              Recordatorio: aún tienes pendiente completar tu evaluación de desempeño.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
              <tbody>
                <tr>
                  <td align="center" style="padding:24px;">

                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container"
                      style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                      <tbody>

                        <tr>
                          <td style="background:#0d6efd; padding:22px 24px;"></td>
                        </tr>

                        <tr>
                          <td class="px" style="padding:28px 32px 18px 32px;">

                            <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;">
                              Hola 👋
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Te recordamos que aún tienes pendiente completar tu evaluación de desempeño.
                            </p>

                            <p style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Completarla toma solo unos minutos y es clave para el seguimiento de tu desarrollo.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap"
                              style="margin:14px auto 14px auto;">
                              <tbody>
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:10px;">
                                    <a href='{{DATOS["url_encuesta"]}}' target="_blank"
                                      style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; color:#ffffff; background-color:#18B3B3; padding:14px 34px; line-height:1.2; border-radius:10px;">
                                      Continuar evaluación
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <p style="margin:10px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:13px; line-height:1.5; color:#6b7280; text-align:center;">
                              Si el botón no funciona, copia y pega este enlace en tu navegador:
                              <br />
                              <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;">
                                {{DATOS["url_encuesta"]}}
                              </a>
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                            <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              Gracias por tu tiempo,
                              <br />
                              <strong style="color:#111827;">Equipo de Just-Link</strong>
                            </p>

                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;">
                              Este enlace es personal. Te recomendamos no compartirlo.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;">
                              © Just-Link
                            </p>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div style="height:24px; line-height:24px; font-size:24px;">‌</div>

                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
      `.trim(),
    });

    bm.add('email-desempeno-agradecimiento-card', {
      label: 'Agradecimiento Evaluación',
      category: 'Plantillas Desempeño',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-heart" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html>
          <html lang="es">
          <head>
            <meta charset="utf-8" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Gracias por completar tu evaluación de desempeño</title>
            <style>
              * { box-sizing: border-box; }
              body { margin: 0; padding: 0; }
              @media (max-width: 600px) {
                .container { width: 100% !important; }
                .px { padding-left: 20px !important; padding-right: 20px !important; }
              }
            </style>
          </head>

          <body style="margin:0; padding:0; background:#f8f5ee;">
            <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
              Gracias por completar tu evaluación de desempeño.
            </div>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;">
              <tbody>
                <tr>
                  <td align="center" style="padding:24px;">

                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container"
                      style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);">
                      <tbody>

                        <tr>
                          <td style="background:#18B3B3; padding:22px 24px;"></td>
                        </tr>

                        <tr>
                          <td class="px" style="padding:28px 32px 18px 32px;">

                            <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;">
                              ¡Gracias por completar tu evaluación! 🙌
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Hemos recibido correctamente tus respuestas de evaluación de desempeño.
                            </p>

                            <p style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Tu participación contribuye al crecimiento profesional y a la mejora continua del equipo.
                            </p>

                            <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              <strong style="color:#111827;">Agradecemos tu tiempo y compromiso.</strong>
                            </p>

                            <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" />

                            <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              Atentamente,
                              <br />
                              <strong style="color:#111827;">Equipo de Just-Link</strong>
                            </p>

                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;">
                              Este correo es informativo, no requiere respuesta.
                            </p>

                          </td>
                        </tr>

                        <tr>
                          <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;">
                            <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;">
                              © Just-Link
                            </p>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                    <div style="height:24px; line-height:24px; font-size:24px;">‌</div>

                  </td>
                </tr>
              </tbody>
            </table>
          </body>
          </html>
      `.trim(),
    });

    bm.add('email-encuesta-link', {
      label: 'Link Encuesta',
      category: 'Elementos Encuesta',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-link" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
         <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;">
                                {{DATOS["url_encuesta"]}}
                              </a>
      `.trim(),
    });

    bm.add('email-encuesta-button', {
      label: 'Botón Encuesta',
      category: 'Elementos Encuesta',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      media: `<i class="fas fa-hand-pointer" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
         <table role='presentation' cellspacing='0' cellpadding='0' border='0' style='margin:0; padding:0;'>
          <tr>
            <td align='center' style='padding:12px;'>
              <a href='{{DATOS["url_encuesta"]}}'
                style='display:inline-block; font-family: Arial, sans-serif; font-size:14px;
                        text-decoration:none; padding:12px 18px; border-radius:10px;
                        background:#2563eb; color:#ffffff;'>
                Ir a la encuesta
              </a>
           </td>
          </tr>
        </table>
      `.trim(),
    });

    // Card (tabla simple, “email friendly”)
    /*
    bm.add('email-card', {
      label: 'Card',
      category: 'Elementos Clima',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
       media: `<i class="fas fa-address-card" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0; padding:0;">
        <tr>
          <td align="center" style="padding:16px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
              <tr>
                <td style="padding:20px; font-family: Arial, sans-serif;">
                  <h2 style="margin:0 0 10px 0; font-size:18px; line-height:1.2;">Título de la card</h2>
                  <p style="margin:0; font-size:14px; line-height:1.5; color:#374151;">
                    Texto descriptivo de la card. Compatible con clientes de correo (estructura por tablas).
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      `.trim(),
    });
    */

    // Botón (tabla, clickable, sin depender de CSS complejo)
    bm.add('email-button', {
      label: 'Botón',
      category: 'Plantillas',
      media: `<i class="fas fa-address-card" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0; padding:0;">
          <tr>
            <td align="center" style="padding:12px 0;">
              <a href="https://example.com"
                style="display:inline-block; font-family: Arial, sans-serif; font-size:14px;
                        text-decoration:none; padding:12px 18px; border-radius:10px;
                        background:#2563eb; color:#ffffff;">
                Llamado a la acción
              </a>
           </td>
          </tr>
        </table>
      `.trim(),
    });
  }
  
  private registerDynamicCustomBlocks(templates:any): void {
    if (!this.gjs) return;

    const bm = this.gjs.BlockManager;

    templates.forEach((template:any) => {
        bm.add(template.Code, {
        label: template.Nombre,
        category: 'Guardadas',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        media: `<i class="fas fa-window-maximize" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
        content: template.HtmlBody.trim(),
      });
    });

  }

  private loadStarterTemplate(): void {
    if (!this.gjs) return;

    this.gjs.setComponents(`
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0; padding:0;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px;">
              <tr>
                <td style="font-family: Arial, sans-serif;">
                  <h1 style="margin:0 0 12px 0; font-size:22px;">Hola</h1>
                  <p style="margin:0; font-size:14px; line-height:1.5; color:#374151;">
                    Arrastra bloques como Card y Botón desde el panel de bloques.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim());
  }

  // ===== Guardar/Cargar =====

  saveTemplate(): void {

    if (!this.canSaveTemplate()) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar una organización y un clima para guardar la plantilla.',
        icon: 'error',
      });
      return;
    }

    if (!this.gjs) return;

    // 1) HTML + CSS
    const html = this.gjs.getHtml();
    const css = this.gjs?.getCss() ?? '';

    // 2) Project JSON (permite re-editar tal cual)
    //const project = this.gjs.getProjectData();

    // Ejemplo: guardar en localStorage (en prod, manda a tu API)
    //localStorage.setItem('email_tpl_html', html);
    //localStorage.setItem('email_tpl_css', css);
    //localStorage.setItem('email_tpl_project', JSON.stringify(project));

    // Para ver rápido
    this.exportedHtml = this.buildEmailHtml(html, css);

    //API

    //{ TemplateId, IdOrganizacion, Nombre, Asunto, HtmlBody, IsActive, User }

    const dialogRef = this.dialog.open(DialogSaveEmailTemplateComponent, {
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      panelClass: 'dlg-save-template',

      data: {
        TemplateId: 0,
        IdOrganizacion: this.idOrganization,
        IdFlujo: this.idFlujo,
        Nombre: '',
        Asunto: this.subjectManualCtrl.getRawValue().trim(),
        IsActive: true,
        HtmlBody: this.exportedHtml, 
        showHtmlPreview: true
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.hasSelectedClima()) {
        this.getEmailTemplatesByFlujo();
      }
    });
  };

  loadTemplate(): void {
    if (!this.gjs) return;

    const projectRaw = localStorage.getItem('email_tpl_project');
    if (projectRaw) {
      const project = JSON.parse(projectRaw);
      this.gjs.loadProjectData(project);
      return;
    }





    // fallback: solo HTML/CSS
    const html = localStorage.getItem('email_tpl_html') ?? '';
    const css = localStorage.getItem('email_tpl_css') ?? '';
    if (html) this.gjs.setComponents(html);
    if (css) this.gjs.setStyle(css);
  }


  onOrganizationChange(selectedOrganization: OrganizationOption | null) {
    if (!selectedOrganization) {
      return;
    }

    console.log(selectedOrganization.Nombre);

    this.idOrganization = selectedOrganization.Id;
    this.nombreOrganizacion = selectedOrganization.Nombre;
    this.resetSelectedClima();

    this.getFlujosLista();

    //this.getEmailTemplatesByOrg();

    //this.getComponentesDinamicosOrg();
  }

  sendMail(): void {

    console.log('Sending..');

    if(this.isPendientesSelected()) {
      console.log('pendientes de contestar..');

      Swal.fire({
        title: 'Enviar correo',
        html: `Esta acción enviará correos a <strong>todos los empleados de ${this.nombreOrganizacion} que ya tinenen ecuesta creada y aun no han contestado la encuesta.</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, enviar correos',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (!result.isConfirmed) {
          return;
        }

        this.loading = true;

        //validar que se haya seleccionado clima
      console.log(this.nombreFlujo, this.idFlujo);

      if (this.idFlujo === 0) {
        Swal.fire('Error', 'Debe seleccionar una Organización y un Clima para envío grupal.', 'error');
        return;
      }

      if (!this.gjs) {
        this.loading = false;
        return;
      }

      // 1) HTML + CSS
      const html = this.gjs.getHtml();
      const css = this.gjs?.getCss() ?? '';
      this.exportedHtml = this.buildEmailHtml(html, css);

      const p = this.exportedHtml.replaceAll('&quot;', '"');



      console.log('plantilla:: ', p);

      const datass:any = {
                          IdFlujo: this.idFlujo,
                          NombreClima: this.nombreFlujo,
                          NombreOrg: this.nombreOrganizacion,
                          Plantilla: p,
                          Asunto: this.subjectManualCtrl.value.trim()
                         }

      this.organizationService.enviarCorreosPendienteClima(datass).then((res:any)=>{

        if(res){
          console.log('res:: ', res.data);
          if(res.data.message === 'success') {
            Swal.fire('Realizado','Se enviaron ' + res.data.data.length + ' correos.','success');
          }
          else {
            Swal.fire('Algo anda mal','No fue posible enviar los correos. Intente de nuevo mas tarde.','error');
          }
        }

      }).catch((err:any)=>{

        console.error(err);

      });
      


    });

      


    }

    else if(this.isCompletadasSelected()) {
      console.log('comtestadas..');

      //validar que se haya seleccionado clima
      console.log(this.nombreFlujo, this.idFlujo);

      if (this.idFlujo === 0) {
        Swal.fire('Error', 'Debe seleccionar una Organización y un Clima para envío grupal.', 'error');
        return;
      }

     if (!this.gjs) {
        this.loading = false;
        return;
      }

      // 1) HTML + CSS
      const html = this.gjs.getHtml();
      const css = this.gjs?.getCss() ?? '';
      this.exportedHtml = this.buildEmailHtml(html, css);

      const p = this.exportedHtml.replaceAll('&quot;', '"');



      console.log('plantilla:: ', p);

      const datass:any = {
                          IdFlujo: this.idFlujo,
                          NombreClima: this.nombreFlujo,
                          NombreOrg: this.nombreOrganizacion,
                          Plantilla: p,
                          Asunto: this.subjectManualCtrl.value.trim()
                         }

      this.organizationService.enviarCorreosCompletadosClima(datass).then((res:any)=>{

        if(res){
          console.log('res:: ', res.data);
        }

      }).catch((err:any)=>{

        console.error(err);

      })


    }

    else if(this.isTodosActivosSelected()) {
      console.log('todos activos..');

      //validar que se haya seleccionado clima
      console.log(this.nombreFlujo, this.idFlujo);

      if (this.idFlujo === 0) {
        Swal.fire('Error', 'Debe seleccionar una Organización para el envío.', 'error');
        return;
      }

     if (!this.gjs) {
        this.loading = false;
        return;
      }

      // 1) HTML + CSS
      const html = this.gjs.getHtml();
      const css = this.gjs?.getCss() ?? '';
      this.exportedHtml = this.buildEmailHtml(html, css);

      const p = this.exportedHtml.replaceAll('&quot;', '"');



      console.log('plantilla:: ', p);

      const datass:any = {
                          IdFlujo: this.idFlujo,
                          NombreClima: this.nombreFlujo,
                          NombreOrg: this.nombreOrganizacion,
                          Plantilla: p,
                          Asunto: this.subjectManualCtrl.value.trim()
                         }

      this.organizationService.enviarCorreosTodosActivos(datass).then((res:any)=>{

        if(res){
          console.log('res:: ', res.data);
        }

      }).catch((err:any)=>{

        console.error(err);

      })


    }

    else if(this.isCorreoSelected()) {

      const destinatarios = this.emailManualCtrl.getRawValue()
      .split(',')
      .map((email) => email.trim())
      .filter((email) => !!email);

    if (!destinatarios.length || this.emailManualCtrl.invalid) {
      this.emailManualCtrl.markAsTouched();
      this.emailManualCtrl.updateValueAndValidity({ emitEvent: false });
      Swal.fire({
        title: 'Correos inválidos',
        text: 'Revise el listado de correos antes de enviar.',
        icon: 'error',
      });
      return;
      }

      const DATOS: any = {
        "nombre_empleado": '',
        "telefono_empleado": '',
        "correo_empleado": this.destinatarioIndividual,
        "nombre_organizacion": this.nombreOrganizacion,
        "nombre_clima": this.nombreFlujo,
        "url_encuesta": ''
      };
      

      Swal.fire({
        title: 'Enviar correo',
        html: `Esta acción enviará correo a <strong>${destinatarios.length}</strong> destinatario(s):<br><small>${destinatarios.join(', ')}</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Sí, enviar correo',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (!result.isConfirmed) {
          return;
        }

        this.loading = true;

        try {
          if (!this.gjs) {
            this.loading = false;
            return;
          }

          // 1) HTML + CSS
          const html = this.gjs.getHtml();
          const css = this.gjs?.getCss() ?? '';
          this.exportedHtml = this.buildEmailHtml(html, css);

          const p = this.exportedHtml.replaceAll('&quot;', '"');
          const asunto = this.subjectManualCtrl.value.trim();

          const resultados = await Promise.all(
            destinatarios.map((destinatario) => {

              const htmlFinal = renderizarPlantilla(p, {
                ...DATOS,
                correo_empleado: destinatario,
              });

              const mailBody = {
                "destinatario": destinatario,
                "asunto": asunto,
                "mensajeHtml": htmlFinal,
                "IdFlujo": 75, //corregir
                "IdEmpleado": 3166, //corregir
              };

              return this.organizationService.enviarCorreoIndividual(mailBody)
                .then((resp: any) => ({
                  destinatario,
                  ok: resp?.data?.message === 'Correo CPANEL enviado correctamente',
                  message: resp?.data?.message ?? 'Sin mensaje de respuesta',
                }))
                .catch((err: any) => ({
                  destinatario,
                  ok: false,
                  message: err?.message ?? String(err),
                }));
            })
          );

          const exitosos = resultados.filter((x) => x.ok);
          const fallidos = resultados.filter((x) => !x.ok);

          if (!fallidos.length) {
            Swal.fire({
              title: 'Enviado',
              text: `Se enviaron ${exitosos.length} correo(s) con éxito.`,
              icon: 'success',
            });
          } else if (!exitosos.length) {
            Swal.fire({
              title: 'Algo anda mal..',
              html: `No fue posible enviar los correos.<br><small>${fallidos.map((f) => `${f.destinatario}: ${f.message}`).join('<br>')}</small>`,
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Envío parcial',
              html: `Se enviaron ${exitosos.length} de ${destinatarios.length} correos.<br><small>Fallidos: ${fallidos.map((f) => f.destinatario).join(', ')}</small>`,
              icon: 'warning',
            });
          }
        } catch (err: any) {
          Swal.fire({
            title: 'Ocurrió un error',
            text: err?.message ?? String(err),
            icon: 'error',
          });
        } finally {
          this.loading = false;
        }


      });



    }



    
  }

  // ===== Export para email =====

  exportEmailHtml(): void {
    if (!this.gjs) return;

    const html = this.gjs.getHtml();
    const css = this.gjs.getCss() ?? '';

    // Nota: esto NO “inlinea” CSS (lo ideal para email es inlinear).
    // Pero te deja un HTML completo con <style> y listo para que tu backend lo inlinee.
    this.exportedHtml = this.buildEmailHtml(html, css);

    // Aquí normalmente harías: POST a tu backend para inline + enviar
    // this.http.post('/api/email/render', { html, css, project: this.gjs.getProjectData() })
  }

  private buildEmailHtml(bodyHtml: string, css: string): string {
    return `<!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${css}</style>
    </head>
    <body style="margin:0;padding:0;">
    ${bodyHtml}
    </body>
    </html>`;
  }
}
