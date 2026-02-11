import { Component, OnInit,  } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,
 } from '@angular/forms';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
 import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { OrganizacionService } from '../services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { MatMenuModule } from '@angular/material/menu';
import { DialogformEditEmployeeComponent } from '../dialogformeditemployee/dialogformeditemployee.component';
import {
  MatDialog,
  MatDialogConfig,
  //MatDialogRef,
} from "@angular/material/dialog";
import { relativeTimeThreshold } from 'moment';

export type CampoDemo = { NombreCampo: string; Valor: any }; 

export function buildDemographicList(
  data: Record<string, any>,
  opts?: { fixedKeys?: string[]; tailN?: number }
  ): CampoDemo[] {

    console.log('data en buildDemographicList: ',data);

    const defaultFixed = [
      'Id',
      'IdOrganizacion',
      'Nombres',
      'Apellidos',
      'Celular',
      'Email',
      'TipoEnvioEncuesta',
      'FechaRegistro',
      'estado'
    ];

    // Claves que NO deben considerarse jamás como demográficas
    const reserved = new Set<string>([
      ...(opts?.fixedKeys ?? defaultFixed),
      'camposDemograficos',
      'camposDemograficosOrganizacion'
    ]);

    const keys = Object.keys(data);

    // 1) Candidatas = no fijas, no reservadas, y con valor primitivo
    const demoKeys = keys.filter(k =>
      !reserved.has(k) &&
      (data[k] === null || typeof data[k] !== 'object') // evita arrays/objetos (como el mismo camposDemograficos)
    );

    // 2) Fallback opcional: últimos N si no detectó nada (ej: estructuras atípicas)
    const pickedKeys =
      demoKeys.length > 0 ? demoKeys : keys.slice(-(opts?.tailN ?? 4));

    // 3) Mapea a lista
    return pickedKeys.map(k => ({ NombreCampo: k, Valor: data[k] }));
  }
  const E164_DIGITS_ONLY = /^[1-9]\d{7,14}$/;

function isValidPhoneE164(value: any): boolean {
  const raw = String(value ?? '').trim();
  // Quita todo menos dígitos y '+'
  let cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.slice(1);
  return E164_DIGITS_ONLY.test(cleaned);
}

@Component({
  selector: 'app-employee-organizacion',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

  imports: [
    BreadcrumbComponent,TranslateModule,
    MatDialogModule, MatMenuModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRippleModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatInputModule
],
  
})





export class CrearEmpleadosComponent implements OnInit {
  public employeeForm: UntypedFormGroup;
  public dialogRef?: MatDialogRef<CrearEmpleadosComponent> 

  public dataSourceOrganizations:any = []; 
  public dataSourceEmployees:any = [];
  public idOrganization =  0;
  file: File | null = null;
  public selectedFile = {};
  public isButtonDisabled: boolean = true;
  public btnDisabled: boolean = false;
  camposDinamicos: string[] = [];
  camposDemograficosOrganizacion: any[] = [];
  langStoreValue?: string;
  public workbook: any | null = null;
  public jsonDatax: any | null = null;

  public s3objectsServer  = '';
  public templateExcelFileNameSpanish = '';
  public templateExcelFileNameEnglish = '';

  
  private configs:any = sessionStorage.getItem('configs');
  private confslist:any = [];

  public jsonData: any = {
    organizacion: 'exmple',
    empleados: [
      {
        nombres: 'x',
        apellidos: 'x',
        //numIdentificacion: 'x',
        //tipoIdentificacion: 'x',
        celular: 'x',
        email: 'e',
        //cargo: '',
      },
      
    ],
  };



  displayedColumns: string[] = [
    'Id',
    'IdOrganizacion',
    'Nombres',
    'Apellidos',
    //'NumeroIdentificacion',
    //'TipoIdentificacion',
    'Celular',
    'Email',
    //'Cargo',
    //'FechaIngreso',
    'estado',
    'TipoEnvioEncuesta',
    'FechaRegistro',
    'Borrar',
    'Editar'
  ];

  //accesos
  accessToUploadExcelEmployee = true;
  accessToDownloadExcelEmployee = true;


  constructor(private languageService: LanguageService,private translate: TranslateService,
    private fb: FormBuilder, private router: Router, private authService: AuthService,
    private organizacionService: OrganizacionService, private dialogItemModel: MatDialog, 
    
  ) {
    // Inicializamos el formulario y definimos validaciones:
    this.employeeForm = this.fb.group({
      IdOrganizacion: [{ value: this.idOrganization, disabled: true }],
      Nombres: ['', Validators.required],
      Apellidos: ['', Validators.required],
      
      Celular: [''],
      Email: ['', Validators.email],
      
      TipoEnvioEncuesta: [0]
    });
  }

  

  existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
  }
    
  ngOnInit() {

    //console.log('CURRENT USER DESDE EMPLOYEE:: ', this.authService.currentUserValue);
  
    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
      //console.log('RUTAS DESDE EMPLOYEE:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/organization/employee');
      //console.log(found);

      if(!found){
        this.router.navigate(['/authentication/page404']);
      }

    }

    try {
      if(this.configs){
        this.confslist = JSON.parse(this.configs);
        const c = this.confslist.find((config:any) => config.Nombre === 'ASSETS_BASE_URL');
        this.s3objectsServer = c.Valor; //+ '/';
        console.log('baseURL:: ', this.s3objectsServer);
      }
    } 
    catch(error){
      console.error(error);
    }

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    //validar primero si es admin
    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
      console.log('ES ADMIN!');
      this.getOrganizations();
    }
    else {

    //validar permisos de acciones
    const permisonDownloadExcelEmployee = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'descargaexcelempleado');
    const permisoUploadExcelEmployee = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'cargaexcelempleado');

    //console.log('permisoexport',permisoexport);

    /*    */
    if(permisonDownloadExcelEmployee){
      this.accessToDownloadExcelEmployee = true;
      this.isButtonDisabled = false;
    }else{
      this.accessToDownloadExcelEmployee = false;
      this.isButtonDisabled = true;
    }

    if(permisoUploadExcelEmployee){
      this.accessToUploadExcelEmployee = true;
      this.isButtonDisabled = false;
    }else{
      this.accessToUploadExcelEmployee = false;
      this.isButtonDisabled = true;
    }


    this.getOrganizationById(this.authService.currentUserValue?.idOrganization);
    }


  }

  onOrganizationChange(selectedId: number) {
   //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    
    if(selectedId > 0){
      this.idOrganization = selectedId;
      this.employeeForm.get('IdOrganizacion')?.setValue(selectedId);
      this.getEmployeesByOrg();
      this.getDemograficos();
      this.isButtonDisabled = false;
      

    }
    
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

  getOrganizationById(idOrganization:any): void {
    this.organizacionService.getOrganizationById(idOrganization)
        .then((response:any) => {
          ////console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;

          this.idOrganization = idOrganization;
       

          this.getEmployeesByOrg();
         

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  baseColumns: string[] = [];


  getEmployeesByOrg(): void {
  this.organizacionService.getEmployees(this.idOrganization)
    .then((response: any) => {
      this.dataSourceEmployees = response.data || [];

      if (this.dataSourceEmployees.length > 0) {
        const todasLasClaves = Object.keys(this.dataSourceEmployees[0]);

        // columnas base que quieres primero (sin acciones):
        const baseCols = [
          'Id',
          'IdOrganizacion',
          'Nombres',
          'Apellidos',
          'Celular',
          'Email',
          'TipoEnvioEncuesta',
          'FechaRegistro',
          'estado'
        ];

        // dinámicas = las que no estén en base:
        this.camposDinamicos = todasLasClaves.filter(c => !baseCols.includes(c));

        console.log('todasLasClaves:: ', todasLasClaves);
        console.log('CAMPOS DINAMICOS ENCONTRADOS:: ', this.camposDinamicos);

        this.baseColumns = baseCols;

        // Acciones al final
        this.displayedColumns = [
          ...this.baseColumns,
          ...this.camposDinamicos,
          'Editar',
          'Borrar'
        ];
      } else {
        this.baseColumns = [];
        this.camposDinamicos = [];
        this.displayedColumns = [];
      }
    })
    .catch((error: any) => {
      console.error('Error al obtener empleados:', error);
    });
}

  deleteEmployee(idEmployee:number): void {
    this.organizacionService.deleteEmployee(idEmployee)
    .then((response:any) => {
     //console.log(response);
      this.getEmployeesByOrg();
      Swal.fire({
                  title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
                  text: this.translate.instant('MENUITEMS.EMPLOYEE.INACTIVEEMPLOYEE'),
                  icon: 'success',
                });      
    })
    .catch((error:any) => {
      //console.error(this.translate.instant('MENUITEMS.EMPLOYEE.ERRDELETEEMPLOYEE'), error);
      Swal.fire({
        title: 'Error!',
        text: this.translate.instant('MENUITEMS.EMPLOYEE.ERRDELETEEMPLOYEE') + 'Error: ' + error,
        icon: 'error',
      });
    });
  }

  activeEmployee(idEmployee:number): void {
    this.organizacionService.activeEmployee(idEmployee)
    .then((response:any) => {
     //console.log(response);
      this.getEmployeesByOrg();
      Swal.fire({
                  title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
                  text: this.translate.instant('MENUITEMS.EMPLOYEE.ACTIVEEMPLOYEE'),
                  icon: 'success',
                });      
    })
    .catch((error:any) => {
      console.error('Error al activar empleado:', error);
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.ERRACTIVEEMPLOYEE') + 'Error: ' + error,
        icon: 'error',
      });
    });
  }

  // Enviar datos al servicio:
  onSubmit(): void {
    if (this.employeeForm.valid) {
      
      this.employeeForm.value.IdOrganizacion = this.idOrganization;

      const originalData = this.employeeForm.value;

      const reordered = {
        idOrganizacion: this.idOrganization,
        ...originalData
      };
      
      this.organizacionService.saveNewEmployee(reordered)
        .then((response:any) => {
         //console.log('Empleado creada?:', response.data);
          this.employeeForm.reset(); //funciona?
          this.getEmployeesByOrg();
          Swal.fire({
                      title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
                      text:  this.translate.instant('MENUITEMS.EMPLOYEE.ADDED'),
                      icon: 'success',
                    });
          //this.dialogRef?.close(response.data);
        })
        .catch((error:any) => {
          console.error('Error al crear empleado:', error.response.data.error);
          Swal.fire({
            title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
            text: this.translate.instant('MENUITEMS.EMPLOYEE.ERRCREATEEMPLOYEE') + ' Error: ' + error.response.data.error,
            icon: 'error',
          });
        });
  
    } else {
      console.warn('Formulario inválido');
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.VERIFY'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.INVALIDFORM'),
        icon: 'warning',
      });
    }
  }

  deleteItem(item:any){
   //console.log('DELETE ITEM:: ', item);
    

    if (item.estado === 1) {
      // Acción de desactivación
      this.deleteEmployee(item.Id);
    } else {
      // Acción de reactivación
      this.activeEmployee(item.Id);
    }

  }

  editItem(item:any){
   console.log('ITEM en editItem:: ', item);
    
   if(this.camposDinamicos.length > 0){
    this.camposDemograficosOrganizacion = buildDemographicList(item);
   }
   else{
    this.camposDemograficosOrganizacion = [];
   }
   
    item.camposDemograficos = this.camposDemograficosOrganizacion;
    item.IdOrganizacion = this.idOrganization;

    console.log('this.camposDemograficosOrganizacion:: ', this.camposDemograficosOrganizacion);

    const dialogRef = this.dialogItemModel.open(DialogformEditEmployeeComponent, {
      width:  '95vw',
      maxWidth: '95vw',    
      height: 'auto',  
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
    
        this.getEmployeesByOrg();
     
    });

  }

  


  //separar los demograficos


  parseFechaManual(fechaTexto: string): string | null {
    if (!fechaTexto || typeof fechaTexto !== 'string') {
      console.warn('Fecha vacía o no es string:', fechaTexto);
      return null;
    }
  
    const partes = fechaTexto.split('/');
    if (partes.length !== 3) {
      console.warn('La fecha no tiene 3 partes:', fechaTexto);
      return null;
    }
  
    const [diaStr, mesStr, anioStr] = partes;
  
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10) - 1;
    const anio = parseInt(anioStr, 10);
  
    const fecha = new Date(anio, mes, dia);
  
    if (isNaN(fecha.getTime())) {
      console.warn('La fecha es inválida:', fechaTexto, fecha);
      return null;
    }
  
    // Retornar formato YYYY-MM-DD
    return fecha.toISOString().split('T')[0];
  }
  
  convertExcelToJSON() {
   
   if(this.langStoreValue == 'es'){
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
       //console.log('NO WORKBOOK?');
        return reject('No se encontró workbook');
      }
  
      const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
      const excel_empleados: any = {
        idOrganizacion: this.idOrganization,
        empleados: [],
        camposDemograficos: [], // Aquí se guardan los campos detectados
      };
  
      const errores: string[] = [];
  
      if (rawData.length === 0 || typeof rawData[0] !== 'object' || rawData[0] === null) {
        return reject('El archivo Excel no contiene encabezados válidos.');
      }
      
      const headers = Object.keys(rawData[0] as object); // <- Ya está garantizado como objeto aquí
  
      // Campos fijos que no son considerados demográficos
      const camposFijos = [
        'NOMBRES', 
        'APELLIDOS', 
        'TELEFONO', 
        'EMAIL', 
        'TIPO_ENVIO_ENCUESTA'
      ];
  
      // Detectar los campos demográficos
      const camposDemograficosDetectados = headers.filter(h => !camposFijos.includes(h.toUpperCase()));
  
     //console.log('camposDemograficosDetectados', camposDemograficosDetectados);

      // Guardar los campos demográficos únicos en el JSON
      excel_empleados.camposDemograficos = camposDemograficosDetectados;
  
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;

      const phoneRegex = /^[0-9]{8}$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  
      rawData.forEach((t: any, idx: number) => {
        const filaExcel = idx + 2;
  
        const nombres = String(t.NOMBRES ?? '').trim();
        const apellidos = String(t.APELLIDOS ?? '').trim();
        const telefono = String(t.TELEFONO ?? '').trim();
        const email = String(t.EMAIL ?? '').trim();

        const tipoEnvioEncuesta = String(t.TIPO_ENVIO_ENCUESTA ?? 0);
  
        if (!nombres) errores.push(`Fila ${filaExcel}: El campo NOMBRES es obligatorio.`);
        else if (!nameRegex.test(nombres)) errores.push(`Fila ${filaExcel}: NOMBRES contiene caracteres no permitidos.`);
  
        /*
        if (!apellidos) errores.push(`Fila ${filaExcel}: El campo APELLIDOS es obligatorio.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: APELLIDOS contiene caracteres no permitidos.`);
        */
       
        if (!telefono) errores.push(`Fila ${filaExcel}: El campo TELEFONO es obligatorio.`);
        else if (!isValidPhoneE164(telefono)) errores.push(`Fila ${filaExcel}: TELEFONO debe tener 8 dígitos numéricos.`);

        if (!email) errores.push(`Fila ${filaExcel}: El campo EMAIL es obligatorio.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        if (!['CORREO', 'WHATSAPP', 'NINGUNO'].includes(tipoEnvioEncuesta)) {
          errores.push(`Fila ${filaExcel}: TIPO_ENVIO_ENCUESTA puede ser: 'CORREO', 'WHATSAPP', 'NINGUNO'.`);
        }
  
        const valoresDemograficos: any = {};
  
        camposDemograficosDetectados.forEach((campo) => {
          const valor = t[campo] !== undefined && t[campo] !== null ? String(t[campo]).trim() : '';
          valoresDemograficos[campo] = valor;
        });
  
        if (errores.filter(e => e.includes(`Fila ${filaExcel}`)).length === 0) {
          excel_empleados.empleados.push({
            nombres,
            apellidos,
            celular: telefono,
            email,
            tipoEnvioEncuesta,
            demograficos: valoresDemograficos,
          });
        }
      });
  
      if (errores.length > 0) {
        errores.forEach((err) => console.error(err));
        Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
          html: this.translate.instant('MENUITEMS.EMPLOYEE.EXCELERROR') + '<br><pre style="text-align:left">' + errores.join('<br>') + '</pre>',
          icon: 'error',
          width: 600,
        });
        return reject(errores);
      }
  
      this.jsonData = excel_empleados;
     //console.log('this.jsonData:: ', this.jsonData);
      resolve('success');
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
   } 
   else if(this.langStoreValue == 'en'){
    console.log('ENTRA EN INGLES PACHECO..');
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
       //console.log('NO WORKBOOK?');
        return reject('No se encontró workbook');
      }
  
      const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
      const excel_empleados: any = {
        idOrganizacion: this.idOrganization,
        empleados: [],
        camposDemograficos: [], // Aquí se guardan los campos detectados
      };
  
      const errores: string[] = [];
  
      if (rawData.length === 0 || typeof rawData[0] !== 'object' || rawData[0] === null) {
        return reject('El archivo Excel no contiene encabezados válidos.');
      }
      
      const headers = Object.keys(rawData[0] as object); // <- Ya está garantizado como objeto aquí
  
      // Campos fijos que no son considerados demográficos
      const camposFijos = [
        'FIRST_NAME', 
        'LAST_NAME', 
        'CELL_PHONE', 
        'EMAIL', 
        'SEND_SURVEY_TYPE'
      ];
  
      // Detectar los campos demográficos
      const camposDemograficosDetectados = headers.filter(h => !camposFijos.includes(h.toUpperCase()));
  
     //console.log('camposDemograficosDetectados', camposDemograficosDetectados);

      // Guardar los campos demográficos únicos en el JSON
      excel_empleados.camposDemograficos = camposDemograficosDetectados;
  
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;

      //const phoneRegex = /^[0-9]{14}$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  
      rawData.forEach((t: any, idx: number) => {
        const filaExcel = idx + 2;
  
        const nombres = String(t.FIRST_NAME ?? '').trim();
        const apellidos = String(t.LAST_NAME ?? '').trim();
        const telefono = String(t.CELL_PHONE ?? '').trim();
        const email = String(t.EMAIL ?? '').trim();
        const tipoEnvioEncuesta = String(t.SEND_SURVEY_TYPE ?? 0);
  
        if (!nombres) errores.push(`Row ${filaExcel}: FIRST_NAME field is required.`);
        else if (!nameRegex.test(nombres)) errores.push(`Fila ${filaExcel}: FIRST_NAME contains invalid characters.`);
  
        if (!apellidos) errores.push(`Row ${filaExcel}: LAST_NAME field is required.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: LAST_NAME contains invalid characters.`);
  
        if (!telefono) {
          errores.push(`Row ${filaExcel}: CELL_PHONE field is required.`);
        } else if (!isValidPhoneE164(telefono)) {
          errores.push(`Row ${filaExcel}: CELL_PHONE contains invalid characters.`);
        }
  
        if (!email) errores.push(`Row ${filaExcel}: EMAIL field is required.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        if (!['EMAIL', 'WHATSAPP', 'NOTHING'].includes(tipoEnvioEncuesta)) {
          errores.push(`Row ${filaExcel}: SEND_SURVEY_TYPE can be: 'EMAIL', 'WHATSAPP', 'NOTHING'.`);
        }
  
        const valoresDemograficos: any = {};
  
        camposDemograficosDetectados.forEach((campo) => {
          const valor = t[campo] !== undefined && t[campo] !== null ? String(t[campo]).trim() : '';
          valoresDemograficos[campo] = valor;
        });
  
        if (errores.filter(e => e.includes(`Row ${filaExcel}`)).length === 0) {
          excel_empleados.empleados.push({
            nombres,
            apellidos,
            celular: telefono,
            email,
            tipoEnvioEncuesta,
            demograficos: valoresDemograficos,
          });
        }
      });
  
      if (errores.length > 0) {
        errores.forEach((err) => console.error(err));
        Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
          html: this.translate.instant('MENUITEMS.EMPLOYEE.EXCELERROR') + '<br><pre style="text-align:left">' + errores.join('<br>') + '</pre>',
          icon: 'error',
          width: 600,
        });
        return reject('Errores de validación.');
      }
  
      this.jsonData = excel_empleados;

      resolve('success');
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
   }
   
   else{
    return new Promise((resolve, reject) => {
      return reject('no language selected?');
    })
  }
   
   


  }

  chunkArray<T>(arr: T[], size: number): T[][];
  chunkArray<T>(arr: T[], size: number) {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  private async uploadEmployeesInBatches(originalData: any, batchSize = 50) {
    console.log('entra en upload..');

    const empleados: any[] = originalData?.empleados ?? [];
    const total = empleados.length;
    console.log('total empleados:', total, 'batchSize:', batchSize);

    if (!total) {
      await Swal.fire(
        this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        this.translate.instant('MENUITEMS.EMPLOYEE.NOEMPLOYEESTOUPLOAD') || 'No hay empleados para subir.',
        'info'
      );
      return;
    }

    const chunks = this.chunkArray(empleados, batchSize);
    console.log('chunks:', chunks.length, 'items por chunk (1ro):', chunks[0]?.length);

    const erroresGlobales: string[] = [];
    let subidosOk = 0;

    // IMPORTANTE: NO usar await aquí
    Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.UPLOADMESSAGE'),
      html: `${this.translate.instant('MENUITEMS.EMPLOYEE.PROCESSMESSAGE')} 0 / ${chunks.length}`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      for (let i = 0; i < chunks.length; i++) {
        console.log('entra en for.. i=', i);
        const payload = {
          idOrganizacion: originalData.idOrganizacion,
          camposDemograficos: originalData.camposDemograficos,
          empleados: chunks[i]
        };

        console.log('payload (size): ', payload.empleados.length);

        try {
          const result: any = await this.organizacionService.saveNewEmployeesExcel(payload);
          const ok = result?.data?.message === 'Proceso finalizado';

          if (ok) {
            subidosOk += chunks[i].length;
          } else {
            const errs: string[] = result?.data?.errores ?? [];
            if (errs.length) {
              erroresGlobales.push(
                `Lote ${i + 1}/${chunks.length} (${chunks[i].length} empleados):`,
                ...errs
              );
            } else {
              erroresGlobales.push(
                `Lote ${i + 1}/${chunks.length} (${chunks[i].length} empleados): respuesta inesperada del servidor.`
              );
            }
          }
        } catch (e: any) {
          erroresGlobales.push(
            `Lote ${i + 1}/${chunks.length} (${chunks[i].length} empleados): ${e?.message ?? e}`
          );
        }

        // Actualizar progreso
        Swal.update({
          html: `${this.translate.instant('MENUITEMS.EMPLOYEE.SENDINGBATCHES')} ${i + 1} / ${chunks.length}`
        });
      }

      // Resultado final
      if (erroresGlobales.length) {
        await Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
          html:
            `${this.translate.instant('MENUITEMS.EMPLOYEE.ERRFOUNDINSERT')}<br>` +
            `<pre style="text-align:left;white-space:pre-wrap;max-height:50vh;overflow:auto">` +
            erroresGlobales.join('\n') +
            `</pre>`,
          icon: 'error',
          width: 700
        });
      } else {
        await Swal.fire(
          this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
          this.translate.instant('MENUITEMS.EMPLOYEE.EMPLOYEINSERTSUCCESS'),
          'success'
        );
      }
    } finally {
      // Asegura cerrar el modal de carga incluso si hubo errores
      Swal.close();
      // Refrescar lista
      this.getEmployeesByOrg();
    }
  }

  
  onFileSelected(event: any): void {
    let timerInterval: any;

    Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.UPLOADMESSAGE'),
      html: this.translate.instant('MENUITEMS.EMPLOYEE.PROCESSMESSAGE') + '<b></b>',
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (b) b.textContent = `..`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    // 1. Obtenemos el archivo del input <input type="file">
    const file = event.target.files[0];
    if (!file) {
      console.warn('No se seleccionó ningún archivo');
      return;
    }
  
    // 2. Guardamos la referencia si quieres (similar a this.selectedFile)
    this.selectedFile = file;
  
    // 3. Reutilizamos la lógica de lectura (FileReader)
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      
      if (e.target && e.target.result) {
        
        const fileData = e.target.result;
  
        if (fileData instanceof ArrayBuffer) {
          
          // A) Directamente un ArrayBuffer: parseamos con XLSX
          try {
            const wb = XLSX.read(new Uint8Array(fileData), { type: 'array' });
           //console.log('Resultado de XLSX.read =>', wb);
            this.workbook = wb;

            this.convertExcelToJSON()
              .then(async () => {
                console.log('this.jsonData: ', this.jsonData);
                // Envía en lotes de 50 (puedes ajustar a 100, etc.)
                await this.uploadEmployeesInBatches(this.jsonData, 50);

              })
              .catch((error) => {
                console.error('Error al convertir excel a json!', error);
                Swal.fire({
                  title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
                  html:
                    this.translate.instant('MENUITEMS.EMPLOYEE.ERRFOUNDINSERT') +
                    '<br><pre style="text-align:left">' +
                    (error?.toString?.() ?? error) +
                    '</pre>',
                  icon: 'error',
                  width: 600
                });
              });
          } catch (err) {
            console.error('Error leyendo el excel:', err);
          }
        } else {
         //console.log(' B) Si el resultado es otro tipo (ej. string, Blob)');
          // B) Si el resultado es otro tipo (ej. string, Blob)
          const blob = new Blob([fileData]);
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            if (ev.target && ev.target.result) {
              const arrayBuffer = ev.target.result;
              if (arrayBuffer instanceof ArrayBuffer) {
                this.workbook = XLSX.read(new Uint8Array(arrayBuffer), {
                  type: 'array',
                });
              } else {
                console.error('Error: FileReader result is not an ArrayBuffer.');
              }
            } else {
              console.error('Error: FileReader result is null or undefined.');
            }
          };
          fileReader.readAsArrayBuffer(blob);
        }
      } else {
        console.error('Error: FileReader result is null or undefined.');
      }
    };
  
    reader.readAsArrayBuffer(file);
   //console.log('será????');
    
  }

  getDemograficos(): void {
    this.organizacionService.getDemograficos(this.idOrganization)
      .then((response: any) => {
        this.camposDemograficosOrganizacion = response.data;
  
       //console.log('SUERO ANTI PEPINILLO:: ', response.data);

        // Agregar los campos demográficos al formulario reactivo
        this.camposDemograficosOrganizacion.forEach(field => {
          this.employeeForm.addControl(field.NombreCampo, new UntypedFormControl(''));
        });
      })
      .catch((error: any) => {
        console.error('Error al obtener demográficos:', error);
      });
  }

  downloadExcelEmployeeTemplate(): void {
    const url = this.langStoreValue === 'en'
      ? this.s3objectsServer + 'Template_EMPLOYEE_FORMAT_ENGLISH.xlsx'
      : this.s3objectsServer + 'Plantilla_EMPLEADO_FORMATO_ESPANOL.xlsx';

    const filename = this.langStoreValue === 'en'
      ? 'EmployeeTemplate_EN.xlsx'
      : 'PlantillaEmpleado_ES.xlsx';

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;          // sugiere nombre de archivo
    a.rel = 'noopener';             // seguridad
    document.body.appendChild(a);
    a.click();
    a.remove();                      // limpio
  }
  
 
}
