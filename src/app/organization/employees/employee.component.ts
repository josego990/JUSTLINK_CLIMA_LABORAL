import { Component, OnInit, TemplateRef } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { CommonModule, DatePipe } from '@angular/common'; 
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule,
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
import { DemoLimitsService } from 'app/config/demo-limits.service';
import {
  EmployeeManagerSelectDialogComponent,
  EmployeeManagerSelection,
  getEmployeeOptionFullName,
  getEmployeeOptionId,
  getEmployeeOptionManagerId,
  normalizeEmployeeManagerId,
} from './employee-manager-select-dialog.component';
import {
  buildFullPhoneNumber,
  DEFAULT_PHONE_COUNTRY_ISO,
  getPhoneCountryByIso,
  getPhoneCountryDisplayName,
  getPhoneDigitsRangeLabel,
  isPhoneLengthValid,
  MAX_PHONE_LOCAL_DIGITS,
  normalizeLocalPhoneNumber,
  normalizePhoneDigits,
  PHONE_COUNTRY_OPTIONS,
  PhoneCountryOption,
} from '@shared/phone-country.utils';
import {
  MatDialog,
  //MatDialogRef,
} from "@angular/material/dialog";

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
      'Cargo',
      'cargo',
      'Position',
      'position',
      'Celular',
      'Email',
      'TipoEnvioEncuesta',
      'FechaRegistro',
      'estado',
      'Estado',
      'ESTADO',
      'activo',
      'Activo',
      'ACTIVO',
      'status',
      'Status',
      'STATUS',
      'NombreJefe',
      'IdEmpleadoJefe',
      'idEmpleadoJefe',
      'IdJefe',
      'idJefe',
      'employeeManagerOptions'
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
  private employeeDialogRef?: MatDialogRef<unknown>;
  readonly phoneCountries = PHONE_COUNTRY_OPTIONS;
  readonly maxPhoneLocalDigits = MAX_PHONE_LOCAL_DIGITS;

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
  public selectedManagerName = '';

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
    'Cargo',
    //'NumeroIdentificacion',
    //'TipoIdentificacion',
    'Celular',
    'Email',
    //'Cargo',
    //'FechaIngreso',
    'estado',
    'NombreJefe',
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
    private demoLimitsService: DemoLimitsService,
    
  ) {
    // Inicializamos el formulario y definimos validaciones:
    this.employeeForm = this.fb.group({
      IdOrganizacion: [{ value: this.idOrganization, disabled: true }],
      Nombres: ['', Validators.required],
      Apellidos: ['', Validators.required],
      Cargo: ['', Validators.required],
      PhoneCountryIso: [DEFAULT_PHONE_COUNTRY_ISO],
      Celular: [''],
      Email: ['', Validators.email],
      IdEmpleadoJefe: [null],
      TipoEnvioEncuesta: [0]
    });

    this.applyPhoneControlValidation(this.employeeForm);
  }

  

  existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
  }

  get selectedPhoneCountry(): PhoneCountryOption | undefined {
    return getPhoneCountryByIso(this.employeeForm.get('PhoneCountryIso')?.value);
  }

  get phoneDigitsHint(): string {
    return this.selectedPhoneCountry
      ? getPhoneDigitsRangeLabel(this.selectedPhoneCountry)
      : `${this.maxPhoneLocalDigits}`;
  }

  get phonePreview(): string {
    return buildFullPhoneNumber(
      this.employeeForm.get('PhoneCountryIso')?.value,
      this.employeeForm.get('Celular')?.value,
    );
  }

  getPhoneCountryLabel(country: PhoneCountryOption | undefined): string {
    return getPhoneCountryDisplayName(country, this.getCurrentLanguage());
  }

  onPhoneCountryChange(): void {
    this.normalizePhoneControlValue(this.employeeForm);
    this.applyPhoneControlValidation(this.employeeForm);
  }

  onPhoneInput(): void {
    this.normalizePhoneControlValue(this.employeeForm);
    this.applyPhoneControlValidation(this.employeeForm);
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
      this.langStoreValue = lang;
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

  private getCurrentLanguage(): string {
    return this.translate.currentLang || this.langStoreValue || localStorage.getItem('lang') || 'es';
  }

  private normalizePhoneControlValue(form: UntypedFormGroup): void {
    const phoneControl = form.get('Celular');

    if (!phoneControl) {
      return;
    }

    const country = getPhoneCountryByIso(form.get('PhoneCountryIso')?.value);
    const normalizedValue = normalizeLocalPhoneNumber(phoneControl.value, country);

    if (normalizedValue !== phoneControl.value) {
      phoneControl.setValue(normalizedValue, { emitEvent: false });
    }
  }

  private setCustomControlError(
    control: AbstractControl | null,
    errorKey: string,
    shouldSet: boolean,
  ): void {
    if (!control) {
      return;
    }

    const currentErrors = { ...(control.errors ?? {}) };

    if (shouldSet) {
      currentErrors[errorKey] = true;
    } else {
      delete currentErrors[errorKey];
    }

    control.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
  }

  private applyPhoneControlValidation(form: UntypedFormGroup): boolean {
    const phoneControl = form.get('Celular');
    const countryControl = form.get('PhoneCountryIso');

    if (!phoneControl || !countryControl) {
      return true;
    }

    const phoneDigits = normalizePhoneDigits(phoneControl.value);
    const country = getPhoneCountryByIso(countryControl.value);
    const hasPhoneValue = phoneDigits.length > 0;

    this.setCustomControlError(
      countryControl,
      'phoneCountryRequired',
      hasPhoneValue && !country,
    );

    this.setCustomControlError(
      phoneControl,
      'phoneLength',
      hasPhoneValue && !!country && !isPhoneLengthValid(phoneDigits, country),
    );

    return !countryControl.hasError('phoneCountryRequired') && !phoneControl.hasError('phoneLength');
  }

  private getPhoneValidationMessage(form: UntypedFormGroup): string | null {
    const countryControl = form.get('PhoneCountryIso');
    const selectedCountry = getPhoneCountryByIso(countryControl?.value);

    if (countryControl?.hasError('phoneCountryRequired')) {
      return this.translate.instant('MENUITEMS.EMPLOYEE.PHONECOUNTRYREQUIRED');
    }

    if (form.get('Celular')?.hasError('phoneLength')) {
      return this.translate.instant('MENUITEMS.EMPLOYEE.PHONEDIGITS', {
        digits: selectedCountry ? getPhoneDigitsRangeLabel(selectedCountry) : this.maxPhoneLocalDigits,
        country: this.getPhoneCountryLabel(selectedCountry),
      });
    }

    return null;
  }

  getEmployeeManagerDisplay(employee: any): string {
    const managerName = String(employee?.NombreJefe ?? employee?.nombreJefe ?? '').trim();

    if (managerName) {
      return managerName;
    }

    return this.getManagerNameById(getEmployeeOptionManagerId(employee)) || '-';
  }

  isEmployeeActive(employeeOrStatus: any): boolean {
    const status = typeof employeeOrStatus === 'object' && employeeOrStatus !== null
      ? employeeOrStatus.estado ??
        employeeOrStatus.Estado ??
        employeeOrStatus.activo ??
        employeeOrStatus.Activo
      : employeeOrStatus;

    if (typeof status === 'string') {
      const normalizedStatus = status.trim().toLowerCase();
      return normalizedStatus === '1' || normalizedStatus === 'true' || normalizedStatus === 'activo';
    }

    return status === 1 || status === true;
  }

  getEmployeeStatusLabel(employee: any): string {
    return this.isEmployeeActive(employee) ? 'Activo' : 'Inactivo';
  }

  private getManagerNameById(managerId: number | null): string {
    if (!managerId) {
      return '';
    }

    const manager = this.dataSourceEmployees.find(
      (employee: any) => getEmployeeOptionId(employee) === managerId
    );

    return getEmployeeOptionFullName(manager);
  }

  private syncSelectedManagerName(): void {
    const managerId = normalizeEmployeeManagerId(this.employeeForm.get('IdEmpleadoJefe')?.value);
    this.selectedManagerName = this.getManagerNameById(managerId);
  }

  private getLoadedEmployeeManagerOptions(): any[] {
    return Array.isArray(this.dataSourceEmployees) ? this.dataSourceEmployees : [];
  }

  openManagerDialog(): void {
    const dialogRef = this.dialogItemModel.open<
      EmployeeManagerSelectDialogComponent,
      {
        employees: any[];
        selectedManagerId: number | null;
        excludedEmployeeId: number | null;
      },
      EmployeeManagerSelection
    >(EmployeeManagerSelectDialogComponent, {
      width: '860px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        employees: this.getLoadedEmployeeManagerOptions(),
        selectedManagerId: normalizeEmployeeManagerId(this.employeeForm.get('IdEmpleadoJefe')?.value),
        excludedEmployeeId: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) {
        return;
      }

      this.employeeForm.get('IdEmpleadoJefe')?.setValue(result.id);
      this.selectedManagerName = result.employee ? getEmployeeOptionFullName(result.employee) : '';
    });
  }

  private buildEmployeePayload(): any {
    const rawValue = this.employeeForm.getRawValue();
    const {
      IdOrganizacion: _idOrganizacion,
      PhoneCountryIso,
      IdEmpleadoJefe,
      ...employeeData
    } = rawValue;

    return {
      idOrganizacion: this.idOrganization,
      ...employeeData,
      IdEmpleadoJefe: normalizeEmployeeManagerId(IdEmpleadoJefe),
      Celular: buildFullPhoneNumber(PhoneCountryIso, rawValue.Celular),
    };
  }

  private resetEmployeeForm(): void {
    const resetValue: Record<string, unknown> = {
      IdOrganizacion: this.idOrganization,
      Nombres: '',
      Apellidos: '',
      Cargo: '',
      PhoneCountryIso: DEFAULT_PHONE_COUNTRY_ISO,
      Celular: '',
      Email: '',
      IdEmpleadoJefe: null,
      TipoEnvioEncuesta: 0,
    };

    this.camposDemograficosOrganizacion.forEach((field) => {
      resetValue[field.NombreCampo] = '';
    });

    this.employeeForm.reset(resetValue);
    this.employeeForm.get('IdOrganizacion')?.disable({ emitEvent: false });
    this.selectedManagerName = '';
    this.applyPhoneControlValidation(this.employeeForm);
  }

  onOrganizationChange(selectedId: number) {
   //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    
    if(selectedId > 0){
      this.idOrganization = selectedId;
      this.employeeForm.get('IdOrganizacion')?.setValue(selectedId);
      this.employeeForm.get('IdEmpleadoJefe')?.setValue(null);
      this.selectedManagerName = '';
      this.getEmployeesByOrg();
      this.getDemograficos();
      this.isButtonDisabled = false;
      

    }
    
  }

  openEmployeeDialog(template: TemplateRef<unknown>): void {
    if (!this.idOrganization) {
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.VERIFY'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.SELECTORGANIZATION'),
        icon: 'warning',
      });
      return;
    }

    this.resetEmployeeForm();
    this.employeeDialogRef = this.dialogItemModel.open(template, {
      width: '920px',
      maxWidth: '95vw',
      autoFocus: false,
      disableClose: true,
      panelClass: 'employee-create-dialog',
    });

    this.employeeDialogRef.afterClosed().subscribe(() => {
      this.resetEmployeeForm();
      this.employeeDialogRef = undefined;
    });
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
          this.employeeForm.get('IdOrganizacion')?.setValue(idOrganization);
       

          this.getEmployeesByOrg();
          this.getDemograficos();
         

        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  baseColumns: string[] = [];

  private normalizeEmployeeColumnKey(value: any): string {
    return String(value ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private getEmployeeBaseColumns(): string[] {
    return [
      'Id',
      'IdOrganizacion',
      'Nombres',
      'Apellidos',
      'Cargo',
      'Celular',
      'Email',
      'TipoEnvioEncuesta',
      'FechaRegistro',
      'estado',
      'NombreJefe',
    ];
  }

  private getHiddenEmployeeColumnKeys(): Set<string> {
    return new Set([
      ...this.getEmployeeBaseColumns(),
      'Estado',
      'ESTADO',
      'activo',
      'Activo',
      'ACTIVO',
      'status',
      'Status',
      'STATUS',
      'IdEmpleadoJefe',
      'idEmpleadoJefe',
      'IdJefe',
      'idJefe',
      'IdJefeEmpleado',
      'idJefeEmpleado',
    ].map((column) => this.normalizeEmployeeColumnKey(column)));
  }

  private getDemographicFieldName(field: any): string {
    return String(
      field?.NombreCampo ??
      field?.nombreCampo ??
      field?.Nombre ??
      field?.nombre ??
      field?.Campo ??
      field?.campo ??
      ''
    ).trim();
  }

  private getEmployeeKeys(): string[] {
    const keys = new Set<string>();

    this.dataSourceEmployees.forEach((employee: any) => {
      Object.keys(employee ?? {}).forEach((key) => keys.add(key));
    });

    return Array.from(keys);
  }

  private getOrderedDynamicEmployeeColumns(employeeKeys: string[]): string[] {
    const hiddenColumnKeys = this.getHiddenEmployeeColumnKeys();
    const availableKeyByNormalizedName = new Map<string, string>();

    employeeKeys.forEach((key) => {
      const normalizedKey = this.normalizeEmployeeColumnKey(key);

      if (!hiddenColumnKeys.has(normalizedKey) && !availableKeyByNormalizedName.has(normalizedKey)) {
        availableKeyByNormalizedName.set(normalizedKey, key);
      }
    });

    const demographicColumnNames = this.camposDemograficosOrganizacion
      .map((field) => this.getDemographicFieldName(field))
      .filter((fieldName) => fieldName.length > 0);

    if (demographicColumnNames.length === 0) {
      return employeeKeys.filter((key) => !hiddenColumnKeys.has(this.normalizeEmployeeColumnKey(key)));
    }

    const orderedColumns: string[] = [];
    const usedColumns = new Set<string>();

    demographicColumnNames.forEach((fieldName) => {
      const employeeKey = availableKeyByNormalizedName.get(this.normalizeEmployeeColumnKey(fieldName));

      if (employeeKey && !usedColumns.has(employeeKey)) {
        orderedColumns.push(employeeKey);
        usedColumns.add(employeeKey);
      }
    });

    return orderedColumns;
  }

  private refreshEmployeeTableColumns(): void {
    if (this.dataSourceEmployees.length === 0) {
      this.baseColumns = [];
      this.camposDinamicos = [];
      this.displayedColumns = [];
      return;
    }

    const employeeKeys = this.getEmployeeKeys();

    this.baseColumns = this.getEmployeeBaseColumns();
    this.camposDinamicos = this.getOrderedDynamicEmployeeColumns(employeeKeys);
    this.displayedColumns = [
      ...this.baseColumns,
      ...this.camposDinamicos,
      'Editar',
      'Borrar',
    ];

    console.log('CAMPOS DINAMICOS ENCONTRADOS:: ', this.camposDinamicos);
  }


  getEmployeesByOrg(): void {
  this.organizacionService.getEmployees(this.idOrganization)
    .then((response: any) => {
      this.dataSourceEmployees = response.data || [];
      this.refreshEmployeeTableColumns();
      this.syncSelectedManagerName();
    })
    .catch((error: any) => {
      console.error('Error al obtener empleados:', error);
    });
}

  private getCurrentEmployeesCount(): number {
    return Array.isArray(this.dataSourceEmployees) ? this.dataSourceEmployees.length : 0;
  }

  private showEmployeeLimitReachedMessage(incomingCount = 1): void {
    const limit = this.demoLimitsService.getLimit('maxEmployeesPerOrganization');
    const currentCount = this.getCurrentEmployeesCount();
    const remaining = this.demoLimitsService.getRemaining(
      'maxEmployeesPerOrganization',
      currentCount,
    );
    const requestedText =
      incomingCount > 1 ? ` Intentaste ingresar ${incomingCount} empleados.` : '';
    const remainingText =
      currentCount > 0
        ? ` Actualmente hay ${currentCount} registrados y solo quedan ${remaining} espacio(s) disponibles.`
        : '';

    Swal.fire({
      title: 'Limite demo alcanzado',
      text:
        `Solo se puede ingresar ${limit} empleados en esta demo.` +
        requestedText +
        remainingText,
      icon: 'warning',
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
    this.normalizePhoneControlValue(this.employeeForm);
    this.applyPhoneControlValidation(this.employeeForm);

    if (this.employeeForm.valid) {
      if (this.demoLimitsService.exceedsLimit(
        'maxEmployeesPerOrganization',
        this.getCurrentEmployeesCount(),
      )) {
        this.showEmployeeLimitReachedMessage();
        return;
      }

      const reordered = this.buildEmployeePayload();
      
      this.organizacionService.saveNewEmployee(reordered)
        .then((response:any) => {
         //console.log('Empleado creada?:', response.data);
          this.resetEmployeeForm();
          this.getEmployeesByOrg();
          this.employeeDialogRef?.close(true);
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
      this.employeeForm.markAllAsTouched();
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.VERIFY'),
        text: this.getPhoneValidationMessage(this.employeeForm) || this.translate.instant('MENUITEMS.EMPLOYEE.INVALIDFORM'),
        icon: 'warning',
      });
    }
  }

  deleteItem(item:any){
   //console.log('DELETE ITEM:: ', item);
    

    if (this.isEmployeeActive(item)) {
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
   
    const dialogData = {
      ...item,
      camposDemograficos: this.camposDemograficosOrganizacion,
      IdOrganizacion: this.idOrganization,
      employeeManagerOptions: this.getLoadedEmployeeManagerOptions(),
    };

    console.log('this.camposDemograficosOrganizacion:: ', this.camposDemograficosOrganizacion);

    const dialogRef = this.dialogItemModel.open(DialogformEditEmployeeComponent, {
      width:  '95vw',
      maxWidth: '95vw',    
      height: 'auto',  
      disableClose: true,
      data: dialogData
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

  private getExcelCellText(row: any, headers: string[]): string {
    for (const header of headers) {
      const value = row?.[header];

      if (value !== undefined && value !== null) {
        return String(value).trim();
      }
    }

    return '';
  }

  private normalizeEmployeeCodeKey(value: any): string {
    return String(value ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  private sortEmployeesForManagerUpload<T extends { codigo?: string; codigoJefe?: string }>(employees: T[]): T[] {
    const employeesByCode = new Map<string, T>();

    employees.forEach((employee) => {
      const codeKey = this.normalizeEmployeeCodeKey(employee.codigo);

      if (codeKey && !employeesByCode.has(codeKey)) {
        employeesByCode.set(codeKey, employee);
      }
    });

    const indegree = new Map<T, number>();
    const dependentsByManagerCode = new Map<string, T[]>();

    employees.forEach((employee) => {
      indegree.set(employee, 0);

      const managerCodeKey = this.normalizeEmployeeCodeKey(employee.codigoJefe);

      if (!managerCodeKey || !employeesByCode.has(managerCodeKey)) {
        return;
      }

      indegree.set(employee, (indegree.get(employee) ?? 0) + 1);
      const dependents = dependentsByManagerCode.get(managerCodeKey) ?? [];
      dependents.push(employee);
      dependentsByManagerCode.set(managerCodeKey, dependents);
    });

    const queue = employees.filter((employee) => (indegree.get(employee) ?? 0) === 0);
    const orderedEmployees: T[] = [];

    while (queue.length > 0) {
      const employee = queue.shift() as T;
      orderedEmployees.push(employee);

      const codeKey = this.normalizeEmployeeCodeKey(employee.codigo);
      const dependents = dependentsByManagerCode.get(codeKey) ?? [];

      dependents.forEach((dependent) => {
        const nextDegree = (indegree.get(dependent) ?? 0) - 1;
        indegree.set(dependent, nextDegree);

        if (nextDegree === 0) {
          queue.push(dependent);
        }
      });
    }

    return orderedEmployees.length === employees.length ? orderedEmployees : employees;
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
        'TIPO_ENVIO_ENCUESTA',
        'CARGO',
        'CODIGO',
        'CODIGO_JEFE',
        'CODE',
        'EMPLOYEE_CODE',
        'MANAGER_CODE',
        'BOSS_CODE',
        'SUPERVISOR_CODE'
      ];
  
      // Detectar los campos demográficos
      const camposDemograficosDetectados = headers.filter(h => !camposFijos.includes(h.toUpperCase()));
  
     //console.log('camposDemograficosDetectados', camposDemograficosDetectados);

      // Guardar los campos demográficos únicos en el JSON
      excel_empleados.camposDemograficos = camposDemograficosDetectados;
  
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;

      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      const codigoRegex = /^[A-Za-z0-9._-]+$/;
      const codigosVistos = new Map<string, number>();
  
      rawData.forEach((t: any, idx: number) => {
        const filaExcel = idx + 2;
  
        const nombres = String(t.NOMBRES ?? '').trim();
        const apellidos = String(t.APELLIDOS ?? '').trim();
        const telefono = String(t.TELEFONO ?? '').trim();
        const email = String(t.EMAIL ?? '').trim();

        const tipoEnvioEncuesta = String(t.TIPO_ENVIO_ENCUESTA ?? 0);

        const cargo = String(t.CARGO ?? '').trim();
        const codigo = this.getExcelCellText(t, ['CODIGO', 'CODE', 'EMPLOYEE_CODE']);
        const codigoJefe = this.getExcelCellText(t, ['CODIGO_JEFE', 'MANAGER_CODE', 'BOSS_CODE', 'SUPERVISOR_CODE']);
        const codigoKey = this.normalizeEmployeeCodeKey(codigo);
        const codigoJefeKey = this.normalizeEmployeeCodeKey(codigoJefe);
  
        if (!nombres) errores.push(`Fila ${filaExcel}: El campo NOMBRES es obligatorio.`);
        else if (!nameRegex.test(nombres)) errores.push(`Fila ${filaExcel}: NOMBRES contiene caracteres no permitidos.`);
  
        /*
        if (!apellidos) errores.push(`Fila ${filaExcel}: El campo APELLIDOS es obligatorio.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: APELLIDOS contiene caracteres no permitidos.`);
        */
       
        if (!telefono) errores.push(`Fila ${filaExcel}: El campo TELEFONO es obligatorio.`);
        else if (!isValidPhoneE164(telefono)) errores.push(`Fila ${filaExcel}: TELEFONO debe ser un numero valido. Puedes incluir el prefijo internacional.`);

        if (!email) errores.push(`Fila ${filaExcel}: El campo EMAIL es obligatorio.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        if (!['CORREO', 'WHATSAPP', 'NINGUNO', 'CORREO Y WHATSAPP'].includes(tipoEnvioEncuesta)) {
          errores.push(`Fila ${filaExcel}: TIPO_ENVIO_ENCUESTA puede ser: 'CORREO', 'WHATSAPP', 'NINGUNO', 'CORREO Y WHATSAPP'.`);
        }

        if (!cargo) errores.push(`Fila ${filaExcel}: El campo CARGO es obligatorio.`);

        if (!codigo) {
          errores.push(`Fila ${filaExcel}: El campo CODIGO es obligatorio.`);
        } else if (!codigoRegex.test(codigo)) {
          errores.push(`Fila ${filaExcel}: CODIGO solo puede contener letras, numeros, punto, guion o guion bajo.`);
        } else if (codigosVistos.has(codigoKey)) {
          errores.push(`Fila ${filaExcel}: CODIGO duplicado. Ya fue usado en la fila ${codigosVistos.get(codigoKey)}.`);
        } else {
          codigosVistos.set(codigoKey, filaExcel);
        }

        if (codigoJefe && !codigoRegex.test(codigoJefe)) {
          errores.push(`Fila ${filaExcel}: CODIGO_JEFE solo puede contener letras, numeros, punto, guion o guion bajo.`);
        }

        if (codigoJefeKey && codigoKey && codigoJefeKey === codigoKey) {
          errores.push(`Fila ${filaExcel}: CODIGO_JEFE no puede ser igual a CODIGO.`);
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
            cargo,
            codigo,
            codigoJefe,
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
  
      excel_empleados.empleados = this.sortEmployeesForManagerUpload(excel_empleados.empleados);
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
        'SEND_SURVEY_TYPE',
        'POSITION',
        'CODE',
        'EMPLOYEE_CODE',
        'MANAGER_CODE',
        'BOSS_CODE',
        'SUPERVISOR_CODE',
        'CODIGO',
        'CODIGO_JEFE'
      ];
  
      // Detectar los campos demográficos
      const camposDemograficosDetectados = headers.filter(h => !camposFijos.includes(h.toUpperCase()));
  
     //console.log('camposDemograficosDetectados', camposDemograficosDetectados);

      // Guardar los campos demográficos únicos en el JSON
      excel_empleados.camposDemograficos = camposDemograficosDetectados;
  
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/;

      //const phoneRegex = /^[0-9]{14}$/;
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      const codigoRegex = /^[A-Za-z0-9._-]+$/;
      const codigosVistos = new Map<string, number>();
  
      rawData.forEach((t: any, idx: number) => {
        const filaExcel = idx + 2;
  
        const nombres = String(t.FIRST_NAME ?? '').trim();
        const apellidos = String(t.LAST_NAME ?? '').trim();
        const telefono = String(t.CELL_PHONE ?? '').trim();
        const email = String(t.EMAIL ?? '').trim();
        const tipoEnvioEncuesta = String(t.SEND_SURVEY_TYPE ?? 0);
        const position = String(t.POSITION ?? '').trim();
        const codigo = this.getExcelCellText(t, ['CODE', 'EMPLOYEE_CODE', 'CODIGO']);
        const codigoJefe = this.getExcelCellText(t, ['MANAGER_CODE', 'BOSS_CODE', 'SUPERVISOR_CODE', 'CODIGO_JEFE']);
        const codigoKey = this.normalizeEmployeeCodeKey(codigo);
        const codigoJefeKey = this.normalizeEmployeeCodeKey(codigoJefe);
  
        if (!nombres) errores.push(`Row ${filaExcel}: FIRST_NAME field is required.`);
        else if (!nameRegex.test(nombres)) errores.push(`Fila ${filaExcel}: FIRST_NAME contains invalid characters.`);
  
        if (!apellidos) errores.push(`Row ${filaExcel}: LAST_NAME field is required.`);
        else if (!nameRegex.test(apellidos)) errores.push(`Fila ${filaExcel}: LAST_NAME contains invalid characters.`);
  
        if (!telefono) {
          errores.push(`Row ${filaExcel}: CELL_PHONE field is required.`);
        } else if (!isValidPhoneE164(telefono)) {
          errores.push(`Row ${filaExcel}: CELL_PHONE must be a valid number. You can include the international prefix.`);
        }
  
        if (!email) errores.push(`Row ${filaExcel}: EMAIL field is required.`);
        else if (!emailRegex.test(email)) errores.push(`Fila ${filaExcel}: EMAIL tiene un formato inválido.`);
  
        if (!['EMAIL', 'WHATSAPP', 'NOTHING', 'EMAIL AND WHATSAPP'].includes(tipoEnvioEncuesta)) {
          errores.push(`Row ${filaExcel}: SEND_SURVEY_TYPE can be: 'EMAIL', 'EMAIL AND WHATSAPP', 'WHATSAPP', 'NOTHING'.`);
        }

        if (!position) errores.push(`Row ${filaExcel}: POSITION field is required.`);

        if (!codigo) {
          errores.push(`Row ${filaExcel}: CODE field is required.`);
        } else if (!codigoRegex.test(codigo)) {
          errores.push(`Row ${filaExcel}: CODE can only contain letters, numbers, dot, dash or underscore.`);
        } else if (codigosVistos.has(codigoKey)) {
          errores.push(`Row ${filaExcel}: duplicated CODE. It was already used in row ${codigosVistos.get(codigoKey)}.`);
        } else {
          codigosVistos.set(codigoKey, filaExcel);
        }

        if (codigoJefe && !codigoRegex.test(codigoJefe)) {
          errores.push(`Row ${filaExcel}: MANAGER_CODE can only contain letters, numbers, dot, dash or underscore.`);
        }

        if (codigoJefeKey && codigoKey && codigoJefeKey === codigoKey) {
          errores.push(`Row ${filaExcel}: MANAGER_CODE cannot be equal to CODE.`);
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
            position,
            codigo,
            codigoJefe,
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
  
      excel_empleados.empleados = this.sortEmployeesForManagerUpload(excel_empleados.empleados);
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

  private async uploadEmployeesExcel(originalData: any) {
    console.log('entra en upload..');

    const empleados: any[] = originalData?.empleados ?? [];
    const total = empleados.length;
    console.log('total empleados:', total);

    if (!total) {
      await Swal.fire(
        this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        this.translate.instant('MENUITEMS.EMPLOYEE.NOEMPLOYEESTOUPLOAD') || 'No hay empleados para subir.',
        'info'
      );
      return;
    }

    Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.UPLOADMESSAGE'),
      html: this.translate.instant('MENUITEMS.EMPLOYEE.PROCESSMESSAGE'),
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const payload = {
        idOrganizacion: originalData.idOrganizacion,
        camposDemograficos: originalData.camposDemograficos,
        empleados,
      };

      console.log('payload (size): ', payload.empleados.length);

      const result: any = await this.organizacionService.saveNewEmployeesExcel(payload);
      const ok = result?.data?.message === 'Proceso finalizado';
      const erroresServidor: string[] = result?.data?.errores ?? [];

      Swal.close();

      if (!ok || erroresServidor.length) {
        await Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
          html:
            `${this.translate.instant('MENUITEMS.EMPLOYEE.ERRFOUNDINSERT')}<br>` +
            `<pre style="text-align:left;white-space:pre-wrap;max-height:50vh;overflow:auto">` +
            (erroresServidor.length
              ? erroresServidor.join('\n')
              : 'Respuesta inesperada del servidor.') +
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
    } catch (e: any) {
      Swal.close();

      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        html:
          `${this.translate.instant('MENUITEMS.EMPLOYEE.ERRUPLOADDATA')}<br>` +
          `<pre style="text-align:left;white-space:pre-wrap;max-height:50vh;overflow:auto">` +
          (e?.response?.data?.error ?? e?.response?.data?.message ?? e?.message ?? e) +
          `</pre>`,
        icon: 'error',
        width: 700,
      });
    } finally {
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
                const employeesToUpload = Array.isArray(this.jsonData?.empleados)
                  ? this.jsonData.empleados.length
                  : 0;

                if (this.demoLimitsService.exceedsLimit(
                  'maxEmployeesPerOrganization',
                  this.getCurrentEmployeesCount(),
                  employeesToUpload,
                )) {
                  Swal.close();
                  this.showEmployeeLimitReachedMessage(employeesToUpload);
                  return;
                }

                await this.uploadEmployeesExcel(this.jsonData);

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
        const fixedControls = new Set([
          'IdOrganizacion',
          'Nombres',
          'Apellidos',
          'Cargo',
          'PhoneCountryIso',
          'Celular',
          'Email',
          'IdEmpleadoJefe',
          'TipoEnvioEncuesta',
        ]);

        Object.keys(this.employeeForm.controls).forEach((controlName) => {
          if (!fixedControls.has(controlName)) {
            this.employeeForm.removeControl(controlName);
          }
        });

        this.camposDemograficosOrganizacion = response.data || [];
  
       //console.log('SUERO ANTI PEPINILLO:: ', response.data);

        // Agregar los campos demográficos al formulario reactivo
        this.camposDemograficosOrganizacion.forEach(field => {
          if (this.employeeForm.get(field.NombreCampo)) {
            this.employeeForm.get(field.NombreCampo)?.setValue('');
          } else {
            this.employeeForm.addControl(field.NombreCampo, new UntypedFormControl(''));
          }
        });

        this.refreshEmployeeTableColumns();
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
