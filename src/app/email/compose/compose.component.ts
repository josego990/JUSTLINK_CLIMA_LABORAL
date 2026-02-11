import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import grapesjs, { Editor as GjsEditor } from 'grapesjs';
import newsletterPreset from 'grapesjs-preset-newsletter';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import es from 'grapesjs/locale/es';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogSaveEmailTemplateComponent } from '../dialogs/DialogSaveEmailTemplateComponent';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';


type ToTarget = 'correo' | 'pendiente_llenar' | 'encuestas_completadas' | 'todos_activos';

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
  imports: [BreadcrumbComponent, FormsModule, MatChipsModule,ReactiveFormsModule,
    MatButtonModule, MatInputModule,TranslateModule,MatDialogModule,MatIconModule,
    MatFormFieldModule,CommonModule, MatSelectModule],
})
export class ComposeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gjsHost', { static: true }) gjsHost!: ElementRef<HTMLDivElement>;


   toOptions: { value: ToTarget; label: string }[] = [
    { value: 'correo', label: 'Correo' },
    { value: 'pendiente_llenar', label: 'Pendiente llenar' },
    { value: 'encuestas_completadas', label: 'Encuestas completadas' },
    { value: 'todos_activos', label: 'Todos los empleados activos' },
  ];

  toTargetsCtrl = new FormControl<ToTarget[]>([], { nonNullable: true });

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

  constructor(private languageService: LanguageService,private translate: TranslateService,   
              public dialog: MatDialog,
              private organizationService: OrganizacionService, ) {

    this.toTargetsCtrl.valueChanges.subscribe((vals) => {
    const hasCorreo = (vals || []).includes('correo');

    if (hasCorreo) {
      this.emailManualCtrl.setValidators([Validators.required, Validators.email]);
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

  ngOnInit():void{
    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;

    //console.log('this.langStoreValue dialogformitem:: ', this.langStoreValue);

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });
  }

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
      label: 'Full Card Invitation',
      category: 'Plantillas',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
       media: `<i class="fas fa-address-card" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
      content: `
        <!doctype html> <html lang="es"> <head> <meta charset="utf-8" /> <meta name="x-apple-disable-message-reformatting" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <title>Invitación a encuesta</title> <style> * { box-sizing: border-box; } body { margin: 0; padding: 0; } @media (max-width: 600px) { .container { width: 100% !important; } .px { padding-left: 20px !important; padding-right: 20px !important; } .btnWrap { width: 100% !important; } } </style> </head> <body style="margin:0; padding:0; background:#f8f5ee;"> <div style="display:none; max-height:0; overflow:hidden; opacity:0;"> Invitación a completar la encuesta «{{DATOS["nombre_clima"]}}». Tu participación es importante. </div> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8f5ee;"> <tbody> <tr> <td align="center" style="padding:24px;"> <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="container" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,40,.06);"> <tbody> <tr> <td style="background:#0d6efd; padding:22px 24px;"></td> </tr> <tr> <td class="px" style="padding:28px 32px 18px 32px;"> <h1 style="margin:0 0 10px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:24px; line-height:1.25; color:#111827; font-weight:800;"> Hola {{DATOS["nombre_colaborador"]}} 👋 </h1> <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;"> Has sido invitado(a) a participar en la encuesta de Clima Laboral: <br /> <strong style="color:#111827;">“{{DATOS["nombre_clima"]}}”</strong> </p> <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;"> Tu opinión nos ayuda a mejorar. Completarla toma solo unos minutos. <br /> <strong style="color:#111827;">¡Gracias por tu tiempo!</strong> </p> <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap" style="margin:14px auto 14px auto;"> <tbody> <tr> <td align="center" bgcolor="#0d6efd" style="border-radius:10px;"> <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; color:#ffffff; padding:14px 34px; line-height:1; border-radius:10px;"> Comenzar encuesta </a> </td> </tr> </tbody> </table> <p style="margin:10px 0 0 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:13px; line-height:1.5; color:#6b7280; text-align:center;"> Si el botón no funciona, copia y pega este enlace en tu navegador: <br /> <a href='{{DATOS["url_encuesta"]}}' target="_blank" style="color:#0d6efd; word-break:break-all; text-decoration:underline;"> {{DATOS["url_encuesta"]}} </a> </p> <hr style="border:none; border-top:1px solid #e5e7eb; margin:22px 0;" /> <p style="margin:0 0 6px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;"> Atentamente, <br /> <strong style="color:#111827;">Equipo de Just-Link</strong> </p> <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#6b7280;"> Por favor, no reenvíes este correo. El enlace es único para tu participación. </p> </td> </tr> <tr> <td align="center" style="padding:16px 24px; background:#ffffff; border-top:1px solid #eef2f7;"> <p style="margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:12px; line-height:1.5; color:#98a2b3;"> © Just-Link </p> </td> </tr> </tbody> </table> <div style="height:24px; line-height:24px; font-size:24px;">‌</div> </td> </tr> </tbody> </table> </body> </html>
      `.trim(),
    });

    bm.add('email-recordatorio-card', {
      label: 'Recordatorio Encuesta',
      category: 'Plantillas',
      attributes: { class: 'gjs-fonts gjs-f-b1' },
       media: `<i class="fas fa-address-card" style="font-size:40px; line-height:40px; display:inline-block;"></i>`,
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
              Recordatorio: aún tienes pendiente completar la encuesta «{{DATOS["nombre_clima"]}}».
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
                              Hola {{DATOS["nombre_colaborador"]}} 👋
                            </h1>

                            <p style="margin:0 0 14px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Este es un recordatorio amable: aún tienes pendiente completar la encuesta de Clima Laboral:
                              <br />
                              <strong style="color:#111827;">“{{DATOS["nombre_clima"]}}”</strong>
                            </p>

                            <p style="margin:0 0 16px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; line-height:1.6; color:#374151;">
                              Tu participación es muy importante para mejorar. Completarla toma solo unos minutos.
                            </p>

                            <!-- Opcional: fecha límite (elimínalo si no usas esa variable) -->
                            <p style="margin:0 0 18px 0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                              <strong style="color:#111827;">Fecha límite:</strong> {{DATOS["fecha_limite"]}}
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="btnWrap"
                              style="margin:14px auto 14px auto;">
                              <tbody>
                                <tr>
                                  <td align="center" bgcolor="#0d6efd" style="border-radius:10px;">
                                    <a href='{{DATOS["url_encuesta"]}}' target="_blank"
                                      style="display:inline-block; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; font-size:16px; font-weight:700; text-decoration:none; color:#ffffff; padding:14px 34px; line-height:1; border-radius:10px;">
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

    // Card (tabla simple, “email friendly”)
    bm.add('email-card', {
      label: 'Card',
      category: 'Plantillas',
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
    this.exportedHtml = this.buildEmailHtml(html, css );

    //API

    //{ TemplateId, IdOrganizacion, Nombre, Asunto, HtmlBody, IsActive, User }

      const dialogRef = this.dialog.open(DialogSaveEmailTemplateComponent, {
         width: '720px',
          maxWidth: '95vw',
          maxHeight: '92vh',
          panelClass: 'dlg-save-template',
        
          data: {
            TemplateId: null,
            IdOrganizacion: 1,
            Nombre: '',
            Asunto: '',
            IsActive: true,
            HtmlBody: this.exportedHtml ,        // lo que generes desde grapes
            showHtmlPreview: false
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

  sendMail(): void {
    console.log('Sending..');

      const DATOS:any = {
        "nombre_empleado": '',
        "telefono_empleado": '',
        "correo_empleado": this.destinatarioIndividual,
        "nombre_organizacion": this.nombreOrganizacion,
        "nombre_clima": this.nombreClima,                        
        "url_encuesta": ''

      };

    Swal.fire({
            title: 'Enviar encuesta individual por correo',
            html: 'Esta acción enviará correo a <strong>' + this.emailManualCtrl.getRawValue() + '</strong>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: 'gray',
            confirmButtonText: 'Sí, enviar correo',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
      
              var htmlFinal = '';
              this.loading = true;
          
              if (!this.gjs) return;

              // 1) HTML + CSS
              const html = this.gjs.getHtml();
              const css = this.gjs?.getCss() ?? '';

              this.exportedHtml = this.buildEmailHtml(html, css );

              var p = this.exportedHtml.replaceAll('&quot;','"');
              //console.log('p',p);

              htmlFinal = renderizarPlantilla(p, DATOS);
              //console.log('HTML-final default:: ', htmlFinal );

              const asunto = this.subjectManualCtrl.value.trim();
            
              const mail_body = { 
                "destinatario": this.emailManualCtrl.getRawValue(), 
                "asunto": asunto, 
                "mensajeHtml": htmlFinal,
                "IdFlujo": 75,
                "IdEmpleado": 3166,         
                };
              console.log(mail_body);
  /**/
              this.organizationService.enviarCorreoIndividual(mail_body).then((resulten:any)=>{
              
                if(resulten.data.message === 'Correo CPANEL enviado correctamente'){
    
                  Swal.fire({
                    title: 'Enviado',
                    text: 'El correo se envió con éxito.',
                    icon: 'success',
                  });
                
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

            

          };
        });
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
