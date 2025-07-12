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

@Component({
  selector: 'app-employee-organizacion',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

  imports: [
    BreadcrumbComponent,TranslateModule,
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
    'Acciones'
  ];



  constructor(private languageService: LanguageService,private translate: TranslateService,
    private fb: FormBuilder, private router: Router, private authService: AuthService,
    private organizacionService: OrganizacionService,
    
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

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    //this.getOrganizations();
    //this.getEmployeesByOrg();

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
      this.getOrganizations();
    }
    else {

    //validar permisos de acciones
    const permisoexport = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'exportdash');
    const permisofilter = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === '"filterdash"');

    //console.log('permisoexport',permisoexport);

    /*
    if(permisoexport){
      this.accessToExport = true;
      this.btnDisabled = false;
    }else{
      this.accessToExport = false;
      this.btnDisabled = true;
    }

    if(permisofilter){
      this.accessToFilter = true;
      //this.btnDisabled = false;
    }else{
      this.accessToFilter = false;
      //this.btnDisabled = true;
    }
    */

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

  getEmployeesByOrg(): void {
    this.organizacionService.getEmployees(this.idOrganization)
      .then((response: any) => {
        this.dataSourceEmployees = response.data;

       //console.log('EMPLOYEES BY ORG:: ', response.data);
       //console.log('this.dataSourceEmployees:: ', this.dataSourceEmployees)
        if (this.dataSourceEmployees.length > 0) {
          const todasLasClaves = Object.keys(this.dataSourceEmployees[0]);
          const columnasFijas = [
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

            
            'TipoEnvioEncuesta', 
            'FechaRegistro', 
            'estado',
            'Acciones'
          ];
  
          // Detectar las columnas demográficas
          this.camposDinamicos = todasLasClaves.filter(col => !columnasFijas.includes(col));
  
          // Insertar las columnas demográficas justo antes de "Acciones"
          this.displayedColumns = columnasFijas.filter(col => col !== 'Acciones')
            .concat(this.camposDinamicos)
            .concat('Acciones');
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
  
  convertExcelToJSON_sin_demograficos() {
   //console.log('this.workbook ', this.workbook);
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
       //console.log('NO WORKBOOK?');
        return reject('No se encontró workbook');
      }
  
      const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
      this.jsonDatax = XLSX.utils.sheet_to_json(worksheet);
  
      const excel_empleados: any = {
        idOrganizacion: this.idOrganization,
        empleados: [],
      };
  
      // Expresiones regulares para validación
      const nameRegex = /^[A-Za-z ]+$/;
      const phoneRegex = /^[0-9]{8}$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  
      const errores: string[] = [];
  
      this.jsonDatax.forEach((t: any, idx: number) => {
        const filaExcel = idx + 2;
  
        const nombres = String(t.NOMBRES ?? '').trim();
        const apellidos = String(t.APELLIDOS ?? '').trim();
        const telefono = String(t.TELEFONO ?? '').trim();
        const email = String(t.EMAIL ?? '').trim();
  
        const numIdentificacion = String(t.IDENTIFICACION ?? 'NA').trim();
        const tipoIdentificacion = String(t.TIPO_IDENTIFICACION ?? 'NA').trim();
        const cargo = String(t.CARGO ?? 'SIN CARGO').trim();
        let fechaIngreso: string | null = null;
        
       //console.log('capullo: ', t.FECHA_INGRESO);

        if (t.FECHA_INGRESO) {
          try {
            fechaIngreso = this.parseFechaManual(t.FECHA_INGRESO);
          } catch (err) {
            errores.push(`Fila ${filaExcel}: FECHA_INGRESO tiene un formato incorrecto.`);
          }
        }

        const tipoEnvioEncuesta = Number(t.TIPO_ENVIO_ENCUESTA ?? 0);
  
        // Validaciones
        if (!nombres) errores.push(`Fila ${filaExcel}: El campo NOMBRES es obligatorio.`);
        else if (!nameRegex.test(nombres)) errores.push(`Fila ${filaExcel}: NOMBRES contiene caracteres no permitidos.`);
  
        if (!apellidos) errores.push(`Fila ${filaExcel}: El campo APELLIDOS es obligatorio.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: APELLIDOS contiene caracteres no permitidos.`);
  
        if (!telefono) errores.push(`Fila ${filaExcel}: El campo TELEFONO es obligatorio.`);
        else if (!phoneRegex.test(telefono)) errores.push(`Fila ${filaExcel}: TELEFONO debe tener 8 dígitos numéricos.`);
  
        if (!email) errores.push(`Fila ${filaExcel}: El campo EMAIL es obligatorio.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        if (!numIdentificacion) errores.push(`Fila ${filaExcel}: El campo NUMERO_IDENTIFICACION es obligatorio.`);
        if (!tipoIdentificacion) errores.push(`Fila ${filaExcel}: El campo TIPO_IDENTIFICACION es obligatorio.`);
  
        if (!cargo) errores.push(`Fila ${filaExcel}: El campo CARGO es obligatorio.`);
  
        // Validar que la fecha esté presente y tenga el formato esperado
        const regexFecha = /^\d{2}\/\d{2}\/\d{4}$/; // Ej: 20/03/2025
       //console.log('fechaIngresox',fechaIngreso);
        if (!fechaIngreso) {
          errores.push(`Fila ${filaExcel}: FECHA_INGRESO está vacía o tiene formato inválido (DD/MM/YYYY).`);
        }

  
        if (![0, 1, 2].includes(tipoEnvioEncuesta)) {
          errores.push(`Fila ${filaExcel}: TIPO_ENVIO_ENCUESTA debe ser 0, 1 o 2.`);
        }
  
        // Si no hubo errores en esta fila, se agrega
        if (errores.length === 0 || errores.filter(e => e.includes(`Fila ${filaExcel}`)).length === 0) {
          excel_empleados.empleados.push({
            nombres,
            apellidos,
            numIdentificacion,
            tipoIdentificacion,
            celular: telefono,
            email,
            cargo,
            fechaIngreso,
            tipoEnvioEncuesta,
          });
        }
      });
  
      if (errores.length > 0) {
        errores.forEach((err) => console.error(err));
        Swal.fire({
          title: 'Error!',
          html: 'Se encontraron errores en el archivo Excel:<br><pre style="text-align:left">' + errores.join('<br>') + '</pre>',
          icon: 'error',
          width: 600,
        });
        return reject('Errores de validación.');
      }
  
      this.jsonData = excel_empleados;
     //console.log('this.jsonData:: ', this.jsonData);
      resolve('success');
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
  }
  
  convertExcelToJSON() {
   //console.log('this.workbook ', this.workbook);
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
        //'IDENTIFICACION',
        //'TIPO_IDENTIFICACION', 
        //'CARGO', 
        //'FECHA_INGRESO', 
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
  
        if (!apellidos) errores.push(`Fila ${filaExcel}: El campo APELLIDOS es obligatorio.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: APELLIDOS contiene caracteres no permitidos.`);
  
        if (!telefono) errores.push(`Fila ${filaExcel}: El campo TELEFONO es obligatorio.`);
        else if (!phoneRegex.test(telefono)) errores.push(`Fila ${filaExcel}: TELEFONO debe tener 8 dígitos numéricos.`);
  
        if (!email) errores.push(`Fila ${filaExcel}: El campo EMAIL es obligatorio.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        /*
        if (!numIdentificacion) errores.push(`Fila ${filaExcel}: El campo NUMERO_IDENTIFICACION es obligatorio.`);
        if (!tipoIdentificacion) errores.push(`Fila ${filaExcel}: El campo TIPO_IDENTIFICACION es obligatorio.`);
        if (!cargo) errores.push(`Fila ${filaExcel}: El campo CARGO es obligatorio.`);
  
        if (!fechaIngreso) {
          errores.push(`Fila ${filaExcel}: FECHA_INGRESO está vacía o tiene formato inválido (DD/MM/YYYY).`);
        }
  */
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
            //numIdentificacion,
            //tipoIdentificacion,
            celular: telefono,
            email,
            //cargo,
            //fechaIngreso,
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
     //console.log('this.jsonData:: ', this.jsonData);
      resolve('success');
    }).catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
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

            this.convertExcelToJSON().then(() => {
             //console.log('AQUI DEBERIA DE ENVIAR LA DATA...');
              this.organizacionService.saveNewEmployeesExcel(this.jsonData).then((result:any) => {
               //console.log('RESULTADO DEL ENVIO BATCH: ', result);

                if(result.data.message === 'Empleados insertados exitosamente'){
                  //Swal.close();
                  
                  Swal.fire({
                    title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
                    text: this.translate.instant('MENUITEMS.EMPLOYEE.FINISHMSGB'),
                    icon: 'success',
                  });
                } else {
                  if (result.data.errores && result.data.errores.length > 0) {
                    Swal.fire({
                      title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
                      html: this.translate.instant('MENUITEMS.EMPLOYEE.ERRFOUNDINSERT')+'<br><pre style="text-align:left">' + result.data.errores.join('<br>') + '</pre>',
                      icon: 'error',
                      width: 600,
                    });
                  } else {
                    Swal.fire(this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'), 
                      this.translate.instant('MENUITEMS.EMPLOYEE.EMPLOYEINSERTSUCCESS'), 
                      'success');
                  }
                }
                this.getEmployeesByOrg();
              }).catch((error)=> {
                Swal.fire({
                  title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
                  text: this.translate.instant('MENUITEMS.EMPLOYEE.ERRUPLOADDATA') + error,
                  icon: 'error',
                });
              }) 
            }).catch((error) => {
              console.error('Error al convertir excel a json!');
            } );
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
  
 
}
