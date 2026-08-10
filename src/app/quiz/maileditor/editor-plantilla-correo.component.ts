import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxEditorModule, Toolbar, Editor, toHTML, parseContent  } from 'ngx-editor';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import Swal from 'sweetalert2';
import { HTML } from 'ngx-editor/lib/trustedTypesUtil';
import { MatButtonModule } from '@angular/material/button';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-editors',
    templateUrl: './editor-plantilla-correo.component.html',
    styleUrls: ['./editor-plantilla-correo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
      FormsModule,ReactiveFormsModule,
      BreadcrumbComponent, NgxEditorModule, MatFormFieldModule, MatSelectModule,CommonModule,
      MatDividerModule,MatIconModule,MatButtonModule
    ]
})
export class EditorPlantillaCorreoComponent implements OnInit, OnDestroy { 

  constructor(private organizacionService: OrganizacionService, private authService: AuthService,
    private router: Router
   ) {
    //constructor
  }

  public idOrganization =  0;
  public nombreOrganizacion = '';
  public idFlujo =  0;
  public nombreFlujo = ''; 
  public isButtonDisabled = true;
  public dataSourceOrganizations:any = [];
  public dataSourceClimas:any = [];
  public html = '';
  accessToSave = true;
  private selectedOrganizationSubscription?: Subscription;

  readonly variables = [
    { label: 'Nombre del empleado', token: '{{DATOS["nombre_empleado"]}}' },
    //{ label: 'Apellidos del empleado',              token: '{{DATOS[apellido_empleado]}}' },
    { label: 'Teléfono del empleado',              token: '{{DATOS["telefono_empleado"]}}' },
    { label: 'Correo del empleado',              token: '{{DATOS["correo_empleado"]}}' },
    { label: 'Nombre de la organización', token: '{{DATOS["nombre_organizacion"]}}' },
    { label: 'Nombre del clima',              token: '{{DATOS["nombre_clima"]}}' },
    { label: 'URL Encuesta',              token: '{{DATOS["url_encuesta"]}}' },
    //{ label: 'Nombre del empleado', token: '{{DATOS["nombre_empleado"]}}' },

    
    

  ];

  colorPresets = ['red', '#FF0000', 'rgb(255, 0, 0)'];
  editor?: Editor;
  

  toolbar: Toolbar = [
    ['undo','redo'],
    ['bold', 'italic'],
    ['underline', 'strike'],
    
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image','outdent','indent','format_clear','horizontal_rule'],
   
    ['subscript','superscript', 'text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify']
  ];

   existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
    }
      
    ngOnInit() {
    
      const stored = sessionStorage.getItem('routes');

      if (stored) {
        const routes: RouteInfo[] = JSON.parse(stored);
        //console.log('RUTAS DESDE sessionStorage:: ', routes);
  
        //buscar path
        const found = this.existsRoute(routes, '/quiz/editor');
        //console.log(found);
  
        if(!found){
          this.router.navigate(['/authentication/page404']);
        }
  
      }

      this.editor =  new Editor({
        linkValidationPattern: '',
        inputRules: true, 
      });
      
      this.editor.valueChanges.subscribe(doc => {
        this.html = toHTML(doc, this.editor?.schema); 
       //console.log('HTML 👉', this.html);
      });

      this.editor.valueChanges.subscribe();

      if(this.authService.currentUserValue?.roles[0].roleName !== 'admin') {

        //validar permisos de acciones
        const permisionsave = this.authService.currentUserValue?.permissions.
          find((p: { ActionCode: string; }) => p.ActionCode === 'guardarplantillas');

        /**/
        if(permisionsave){
          this.accessToSave = true;
        }else{
          this.accessToSave = false;
        }

      }

      this.setupSelectedOrganizationListener();
  }; 

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.idOrganization = 0;
        this.nombreOrganizacion = '';
        this.dataSourceOrganizations = [];
        this.dataSourceClimas = [];
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.idOrganization === organization.Id) {
        this.nombreOrganizacion = organization.Nombre;
        return;
      }

      this.onOrganizationChange(organization.Id);
    });
  }

  getOrganizationById(idOrganization:any): void {
    this.organizacionService.getOrganizationById(idOrganization)
        .then((response:any) => {
          ////console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;

          this.idOrganization = idOrganization;
          this.dataSourceClimas = [];
          this.nombreOrganizacion = 'cargando..'
          this.getFlujosPlantilla();

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  insertToken(token: string): void {
    this.editor?.commands
      .insertText(token)       // agrega texto “tal cual”
      .focus()
      .exec();
  };

  saveTemplate(): void {

   //console.log('idOrg: ', this.idOrganization);
   //console.log('idFlujo: ', this.idFlujo);
   //console.log('html: ', this.html.length);
    
    const flujo = this.dataSourceClimas.find((c: { IdFlujo: number; }) => c.IdFlujo === this.idFlujo);
    this.nombreFlujo = flujo.NombreFlujo;

    if(this.idOrganization > 0 && this.idFlujo > 0 && this.html.length > 0){
      const send_data:any = {
        "IdOrganizacion": this.idOrganization,
        "IdFlujo": this.idFlujo,            
        "Canal": "EMAIL",
        "TituloPlantilla": 'plantilla__' + this.nombreFlujo,
        "HtmlPlantilla": this.html,
        "Estado": 1
      }
  
      this.organizacionService.saveNewTemplate(send_data)
          .then((response:any) => {
           //console.log('Respuesta guardado plantilla:', JSON.stringify(response.data));
            
            if(response.data.message === 'Plantilla guardada correctamente'){
              this.getFlujosPlantilla();
              Swal.fire({
                title: 'Realizado',
                text: response.data.message,
                icon: 'success',
              }); 
            } else {
              Swal.fire({
                title: 'Error',
                text:
                'Ocurrió un error al insertar la plantilla. ' + response.data,
                icon: 'error',
              }); 
            }
  
              
  
          })
          .catch((error:any) => {
            //console.error('Error al obtener organizaciones:', error);
            Swal.fire({
              title: 'Error',
              text:
              'Ocurrió un error al insertar la plantilla. ' + error,
              icon: 'error',
            }); 
          });
    }else{
      Swal.fire({
        title: 'Advertencia',
        text:
        'Faltan campos!',
        icon: 'warning',
      }); 
    }

    

    


  };

  onOrganizationChange(selectedId: number) {
   //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    
    

    if(selectedId > 0){
      //this.editor?.setContent('');
      this.idOrganization = selectedId;
      this.dataSourceClimas = [];
      this.nombreOrganizacion = 'cargando..'
      this.getFlujosPlantilla();

    }
    
  }

  onClimaChange(selectedId: number) {
   //console.log('Se seleccionó el clima con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    this.idFlujo = selectedId;
  
    const clima  = this.dataSourceClimas.find((c: { IdFlujo: number; }) => c.IdFlujo === this.idFlujo);
  

    this.html = clima.PlantillaHtml;

    const html_: HTML = this.html;

    this.editor?.setContent(html_);

    
  }

  getOrganizations(): void {
    this.organizacionService.getOrganizations()
        .then((response:any) => {
         //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getFlujosPlantilla(): void {

    this.organizacionService.getFlujosPlantilla(this.idOrganization)
        .then((response:any) => {
         //console.log('Flujos Plantillas:', JSON.stringify(response.data));
          
          this.dataSourceClimas = response.data.data;
          var org = this.dataSourceOrganizations.find((o: { Id: number; }) => o.Id === this.idOrganization);
          this.nombreOrganizacion = org.Nombre;

        })
        .catch((error:any) => {
          console.error('Error al obtener los flujos plantillas:', error);
        });
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
    this.editor?.destroy();
  }
}
