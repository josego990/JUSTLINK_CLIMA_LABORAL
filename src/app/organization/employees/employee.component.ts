import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { AuthService } from '@core';
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

type EmployeeExcelImportAction = {
  rowNumber: number;
  payload: Record<string, any>;
  employeeCodeKey: string;
  managerCodeKey: string;
  managerId: number | null;
};

type EmployeeExcelImportPlan = {
  creates: EmployeeExcelImportAction[];
  updates: EmployeeExcelImportAction[];
  unchanged: number;
  resolvedEmployeeIdsByCode: Map<string, number>;
};

type PreparedEmployeeExcelRow = {
  row: any;
  rowNumber: number;
  employeeCodeKey: string;
  managerCodeKey: string;
  existingEmployee: any | null;
  existingEmployeeId: number | null;
};

export function buildDemographicList(
  data: Record<string, any>,
  opts?: { fixedKeys?: string[]; tailN?: number }
  ): CampoDemo[] {

    console.log('data en buildDemographicList: ',data);

    const defaultFixed = [
      'Id',
      'IdOrganizacion',
      'NombreOrganizacion',
      'nombreOrganizacion',
      'Organizacion',
      'organizacion',
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
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatPaginatorModule
],
  
})





export class CrearEmpleadosComponent implements OnDestroy, OnInit {
  public employeeForm: UntypedFormGroup;
  public dialogRef?: MatDialogRef<CrearEmpleadosComponent> 
  private employeeDialogRef?: MatDialogRef<unknown>;
  readonly phoneCountries = PHONE_COUNTRY_OPTIONS;
  readonly maxPhoneLocalDigits = MAX_PHONE_LOCAL_DIGITS;

  public dataSourceOrganizations:any = [];
  public dataSourceEmployees:any = [];
  public pagedEmployees: any[] = [];
  public employeePageIndex = 0;
  public employeePageSize = 25;
  public readonly employeePageSizeOptions = [10, 25, 50, 100];
  private allEmployees: any[] = [];
  public cargoOptions: string[] = [];
  public filteredCargoOptions: string[] = [];
  public demographicOptionsByField: Record<string, string[]> = {};
  public filteredDemographicOptionsByField: Record<string, string[]> = {};
  public employeeSearchTerm = '';
  public selectedPositionFilters: string[] = [];
  public selectedDemographicFilters: Record<string, string[]> = {};
  public showOnlyActiveEmployees = true;
  public selectedEmployeeIds = new Set<number>();
  public bulkEmployeeSendType: number | null = null;
  public isLoadingEmployees = false;
  public isProcessingBulkEmployeeAction = false;
  public isExportingEmployees = false;
  public idOrganization =  0;
  file: File | null = null;
  public selectedFile = {};
  public isButtonDisabled: boolean = true;
  public btnDisabled: boolean = false;
  public isSavingNewEmployee = false;
  camposDinamicos: string[] = [];
  camposDemograficosOrganizacion: any[] = [];
  langStoreValue?: string;
  public workbook: any | null = null;
  public jsonDatax: any | null = null;
  public selectedManagerName = '';
  private selectedOrganizationSubscription?: Subscription;
  private cargoValueSubscription?: Subscription;
  private demographicValueSubscriptions: Subscription[] = [];

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
    'Seleccionar',
    'Id',
    'DatosContacto',
    'TipoEnvioEncuesta',
    'estado',
    'NombreJefe',
    'Editar',
    'Borrar',
  ];

  //accesos
  accessToUploadExcelEmployee = true;
  accessToDownloadExcelEmployee = true;


  constructor(private languageService: LanguageService,private translate: TranslateService,
    private fb: FormBuilder, private router: Router, private authService: AuthService,
    private organizacionService: OrganizacionService, private dialogItemModel: MatDialog, 
    private demoLimitsService: DemoLimitsService,
    
  ) {

     console.log('configs: ', this.configs);
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
    this.cargoValueSubscription = this.employeeForm.get('Cargo')?.valueChanges.subscribe((value) => {
      this.updateFilteredCargoOptions(value);
    });
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
    if(this.authService.currentUserValue?.roles[0].roleName !== 'admin') {

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
    }

    this.setupSelectedOrganizationListener();

  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
    this.cargoValueSubscription?.unsubscribe();
    this.clearDemographicValueSubscriptions();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.dataSourceOrganizations = [];
        this.idOrganization = 0;
        this.employeeForm.get('IdOrganizacion')?.setValue(null);
        this.dataSourceEmployees = [];
        this.pagedEmployees = [];
        this.allEmployees = [];
        this.resetEmployeeFilters(false);
        this.refreshCargoOptions();
        this.clearDemographicAutocompleteOptions();
        this.camposDemograficosOrganizacion = [];
        this.isLoadingEmployees = false;
        this.isButtonDisabled = true;
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.idOrganization === organization.Id) {
        return;
      }

      this.onOrganizationChange(organization.Id);
    });
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

  getEmployeeSendTypeLabel(value: unknown): string {
    const translationKeyByType: Record<number, string> = {
      0: 'MENUITEMS.EMPLOYEE.SENDTYPENONE',
      1: 'MENUITEMS.EMPLOYEE.SENDTYPEEMAIL',
      2: 'MENUITEMS.EMPLOYEE.SENDTYPEWHATSAPP',
      3: 'MENUITEMS.EMPLOYEE.SENDTYPEBOTH',
    };

    return this.translate.instant(
      translationKeyByType[Number(value)] ?? translationKeyByType[0]
    );
  }

  getEmployeeTableFullName(employee: any): string {
    const fullName = getEmployeeOptionFullName(employee);

    if (fullName) {
      return fullName;
    }

    return [employee?.Nombres, employee?.Apellidos]
      .filter((value) => String(value ?? '').trim())
      .join(' ')
      .trim() || `Empleado #${employee?.Id ?? ''}`;
  }

  getEmployeeTableCargo(employee: any): string {
    return this.getEmployeeCargoValue(employee);
  }

  getEmployeeTablePhone(employee: any): string {
    return String(
      employee?.Celular ??
      employee?.celular ??
      employee?.Telefono ??
      employee?.telefono ??
      employee?.Phone ??
      employee?.phone ??
      ''
    ).trim();
  }

  getEmployeeTableEmail(employee: any): string {
    return String(
      employee?.Email ??
      employee?.email ??
      employee?.Correo ??
      employee?.correo ??
      ''
    ).trim();
  }

  getEmployeeTableDemographicValue(employee: any, fieldName: string): string {
    return this.getEmployeeDemographicValue(employee, fieldName);
  }

  get selectedEmployeeCount(): number {
    return this.selectedEmployeeIds.size;
  }

  get selectedActiveEmployeeCount(): number {
    return this.getSelectedEmployees().filter((employee) => this.isEmployeeActive(employee)).length;
  }

  get selectedInactiveEmployeeCount(): number {
    return this.getSelectedEmployees().filter((employee) => !this.isEmployeeActive(employee)).length;
  }

  get areAllVisibleEmployeesSelected(): boolean {
    return this.pagedEmployees.length > 0 && this.pagedEmployees.every((employee: any) =>
      this.selectedEmployeeIds.has(this.getEmployeeId(employee))
    );
  }

  get areSomeVisibleEmployeesSelected(): boolean {
    return !this.areAllVisibleEmployeesSelected && this.pagedEmployees.some((employee: any) =>
      this.selectedEmployeeIds.has(this.getEmployeeId(employee))
    );
  }

  isEmployeeSelected(employee: any): boolean {
    return this.selectedEmployeeIds.has(this.getEmployeeId(employee));
  }

  toggleEmployeeSelection(employee: any, checked: boolean): void {
    const employeeId = this.getEmployeeId(employee);

    if (!employeeId) {
      return;
    }

    const nextSelection = new Set(this.selectedEmployeeIds);
    checked ? nextSelection.add(employeeId) : nextSelection.delete(employeeId);
    this.selectedEmployeeIds = nextSelection;
  }

  toggleVisibleEmployeeSelection(checked: boolean): void {
    const nextSelection = new Set(this.selectedEmployeeIds);

    this.pagedEmployees.forEach((employee: any) => {
      const employeeId = this.getEmployeeId(employee);

      if (!employeeId) {
        return;
      }

      checked ? nextSelection.add(employeeId) : nextSelection.delete(employeeId);
    });

    this.selectedEmployeeIds = nextSelection;
  }

  clearEmployeeSelection(): void {
    this.selectedEmployeeIds = new Set<number>();
    this.bulkEmployeeSendType = null;
  }

  async bulkDeactivateSelectedEmployees(): Promise<void> {
    await this.processSelectedEmployeesByStatus(true);
  }

  async bulkActivateSelectedEmployees(): Promise<void> {
    await this.processSelectedEmployeesByStatus(false);
  }

  async bulkUpdateSelectedEmployeeSendType(): Promise<void> {
    if (this.isProcessingBulkEmployeeAction) {
      return;
    }

    if (this.bulkEmployeeSendType === null) {
      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDREQUIREDTITLE'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDREQUIRED'),
        icon: 'info',
      });
      return;
    }

    const sendType = Number(this.bulkEmployeeSendType);
    const selectedEmployees = this.getSelectedEmployees();
    const targetEmployees = selectedEmployees.filter((employee) =>
      Number(employee?.TipoEnvioEncuesta ?? employee?.tipoEnvioEncuesta ?? 0) !== sendType
    );

    if (targetEmployees.length === 0) {
      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDUNCHANGEDTITLE'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDUNCHANGED'),
        icon: 'info',
      });
      return;
    }

    const sendTypeLabel = this.getEmployeeSendTypeLabel(sendType);
    const confirmation = await Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDCONFIRMTITLE'),
      html: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDCONFIRMTEXT', {
        type: `<b>${sendTypeLabel}</b>`,
        count: `<b>${targetEmployees.length}</b>`,
      }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDCONFIRM'),
      cancelButtonText: this.translate.instant('MENUITEMS.EMPLOYEE.CANCEL'),
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    const employeeIds = targetEmployees
      .map((employee) => this.getEmployeeId(employee))
      .filter((employeeId) => employeeId > 0);

    this.isProcessingBulkEmployeeAction = true;
    Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDPROGRESS'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response: any = await this.organizacionService.updateEmployeesSendType(
        this.idOrganization,
        employeeIds,
        sendType,
      );
      const updatedCount = Number(response?.data?.data?.actualizados ?? employeeIds.length);

      this.allEmployees.forEach((employee) => {
        if (employeeIds.includes(this.getEmployeeId(employee))) {
          employee.TipoEnvioEncuesta = sendType;
        }
      });

      Swal.close();
      this.clearEmployeeSelection();
      this.getEmployeesByOrg();

      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDSUCCESS', {
          count: updatedCount,
        }),
        icon: 'success',
      });
    } catch (error: any) {
      Swal.close();
      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        text: error?.response?.data?.message
          || this.translate.instant('MENUITEMS.EMPLOYEE.BULKSENDERROR'),
        icon: 'error',
      });
    } finally {
      this.isProcessingBulkEmployeeAction = false;
    }
  }

  private getManagerNameById(managerId: number | null): string {
    if (!managerId) {
      return '';
    }

    const manager = this.allEmployees.find(
      (employee: any) => getEmployeeOptionId(employee) === managerId
    );

    return getEmployeeOptionFullName(manager);
  }

  private syncSelectedManagerName(): void {
    const managerId = normalizeEmployeeManagerId(this.employeeForm.get('IdEmpleadoJefe')?.value);
    this.selectedManagerName = this.getManagerNameById(managerId);
  }

  private getLoadedEmployeeManagerOptions(): any[] {
    return Array.isArray(this.allEmployees) ? this.allEmployees : [];
  }

  private normalizeCargoSearchValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  }

  private getEmployeeCargoValue(employee: any): string {
    return String(
      employee?.Cargo ??
      employee?.cargo ??
      employee?.Puesto ??
      employee?.puesto ??
      employee?.Position ??
      employee?.position ??
      ''
    )
      .replace(/\s+/g, ' ')
      .trim();
  }

  private refreshCargoOptions(): void {
    const cargosByKey = new Map<string, string>();

    this.getLoadedEmployeeManagerOptions().forEach((employee: any) => {
      const cargo = this.getEmployeeCargoValue(employee);

      if (!cargo) {
        return;
      }

      const normalizedCargo = this.normalizeCargoSearchValue(cargo);

      if (!cargosByKey.has(normalizedCargo)) {
        cargosByKey.set(normalizedCargo, cargo);
      }
    });

    this.cargoOptions = Array.from(cargosByKey.values()).sort((current, next) =>
      current.localeCompare(next, 'es', { sensitivity: 'base' })
    );
    this.updateFilteredCargoOptions(this.employeeForm.get('Cargo')?.value);
  }

  private updateFilteredCargoOptions(value: any): void {
    const normalizedSearch = this.normalizeCargoSearchValue(String(value ?? '').trim());

    this.filteredCargoOptions = normalizedSearch
      ? this.cargoOptions.filter((cargo) => this.normalizeCargoSearchValue(cargo).includes(normalizedSearch))
      : [...this.cargoOptions];
  }

  private clearDemographicValueSubscriptions(): void {
    this.demographicValueSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.demographicValueSubscriptions = [];
  }

  private clearDemographicAutocompleteOptions(): void {
    this.clearDemographicValueSubscriptions();
    this.demographicOptionsByField = {};
    this.filteredDemographicOptionsByField = {};
  }

  getDemographicFieldControlName(field: any): string {
    return this.getDemographicFieldName(field);
  }

  getFilteredDemographicOptions(field: any): string[] {
    const fieldName = this.getDemographicFieldControlName(field);
    return this.filteredDemographicOptionsByField[fieldName] ?? [];
  }

  private getEmployeeDemographicValue(employee: any, fieldName: string): string {
    const normalizedFieldName = this.normalizeEmployeeColumnKey(fieldName);
    const matchingKey = Object.keys(employee ?? {}).find(
      (key) => this.normalizeEmployeeColumnKey(key) === normalizedFieldName
    );
    const value = matchingKey ? employee?.[matchingKey] : employee?.[fieldName];

    return String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private updateFilteredDemographicOptions(fieldName: string, value: any): void {
    const normalizedSearch = this.normalizeCargoSearchValue(String(value ?? '').trim());
    const options = this.demographicOptionsByField[fieldName] ?? [];

    this.filteredDemographicOptionsByField = {
      ...this.filteredDemographicOptionsByField,
      [fieldName]: normalizedSearch
        ? options.filter((option) => this.normalizeCargoSearchValue(option).includes(normalizedSearch))
        : [...options],
    };
  }

  private updateAllFilteredDemographicOptions(): void {
    this.camposDemograficosOrganizacion.forEach((field) => {
      const fieldName = this.getDemographicFieldControlName(field);

      if (!fieldName) {
        return;
      }

      this.updateFilteredDemographicOptions(fieldName, this.employeeForm.get(fieldName)?.value);
    });
  }

  private refreshDemographicOptions(): void {
    const optionsByField: Record<string, string[]> = {};

    this.camposDemograficosOrganizacion.forEach((field) => {
      const fieldName = this.getDemographicFieldControlName(field);

      if (!fieldName) {
        return;
      }

      const valuesByKey = new Map<string, string>();

      this.getLoadedEmployeeManagerOptions().forEach((employee) => {
        const value = this.getEmployeeDemographicValue(employee, fieldName);

        if (!value) {
          return;
        }

        const normalizedValue = this.normalizeCargoSearchValue(value);

        if (!valuesByKey.has(normalizedValue)) {
          valuesByKey.set(normalizedValue, value);
        }
      });

      optionsByField[fieldName] = Array.from(valuesByKey.values()).sort((current, next) =>
        current.localeCompare(next, 'es', { sensitivity: 'base' })
      );
    });

    this.demographicOptionsByField = optionsByField;
    this.updateAllFilteredDemographicOptions();
  }

  onEmployeeSearchChange(value: string): void {
    this.employeeSearchTerm = value;
    this.applyEmployeeFilters();
  }

  onPositionFiltersChange(values: string[]): void {
    this.selectedPositionFilters = Array.isArray(values) ? values : [];
    this.applyEmployeeFilters();
  }

  onDemographicFiltersChange(fieldName: string, values: string[]): void {
    this.selectedDemographicFilters = {
      ...this.selectedDemographicFilters,
      [fieldName]: Array.isArray(values) ? values : [],
    };
    this.applyEmployeeFilters();
  }

  onShowOnlyActiveEmployeesChange(checked: boolean): void {
    this.showOnlyActiveEmployees = checked;
    this.applyEmployeeFilters();
  }

  onEmployeePageChange(event: PageEvent): void {
    this.employeePageIndex = event.pageIndex;
    this.employeePageSize = event.pageSize;
    this.refreshEmployeePage();
  }

  getEmployeeDemographicFilterOptions(fieldName: string): string[] {
    const normalizedFieldName = this.normalizeEmployeeColumnKey(fieldName);
    const optionKey = Object.keys(this.demographicOptionsByField).find(
      (key) => this.normalizeEmployeeColumnKey(key) === normalizedFieldName
    );

    return optionKey ? this.demographicOptionsByField[optionKey] ?? [] : [];
  }

  getSelectedEmployeeDemographicFilters(fieldName: string): string[] {
    return this.selectedDemographicFilters[fieldName] ?? [];
  }

  clearEmployeeSearch(): void {
    this.employeeSearchTerm = '';
    this.applyEmployeeFilters();
  }

  clearEmployeeFilters(): void {
    this.resetEmployeeFilters();
  }

  hasActiveEmployeeFilters(): boolean {
    return !!this.employeeSearchTerm.trim() ||
      this.selectedPositionFilters.length > 0 ||
      Object.values(this.selectedDemographicFilters).some((values) => values.length > 0) ||
      !this.showOnlyActiveEmployees;
  }

  get visibleEmployeeCount(): number {
    return this.dataSourceEmployees.length;
  }

  get totalEmployeeCount(): number {
    return this.allEmployees.length;
  }

  private resetEmployeeFilters(applyFilters = true): void {
    this.employeeSearchTerm = '';
    this.selectedPositionFilters = [];
    this.selectedDemographicFilters = {};
    this.showOnlyActiveEmployees = true;

    if (applyFilters) {
      this.applyEmployeeFilters();
    }
  }

  private getEmployeeNameSearchValue(employee: any): string {
    return this.normalizeCargoSearchValue([
      employee?.Nombres ?? employee?.nombres ?? '',
      employee?.Apellidos ?? employee?.apellidos ?? '',
      employee?.NombreCompleto ?? employee?.nombreCompleto ?? '',
    ].join(' '));
  }

  private matchesEmployeePositionFilter(employee: any): boolean {
    if (this.selectedPositionFilters.length === 0) {
      return true;
    }

    const employeePosition = this.normalizeCargoSearchValue(this.getEmployeeCargoValue(employee));
    return this.selectedPositionFilters.some(
      (position) => this.normalizeCargoSearchValue(position) === employeePosition
    );
  }

  private matchesEmployeeDemographicFilters(employee: any): boolean {
    return Object.entries(this.selectedDemographicFilters).every(([fieldName, selectedValues]) => {
      if (!selectedValues.length) {
        return true;
      }

      const employeeValue = this.normalizeCargoSearchValue(
        this.getEmployeeDemographicValue(employee, fieldName)
      );

      return selectedValues.some(
        (selectedValue) => this.normalizeCargoSearchValue(selectedValue) === employeeValue
      );
    });
  }

  private applyEmployeeFilters(): void {
    const normalizedSearch = this.normalizeCargoSearchValue(this.employeeSearchTerm.trim());

    this.dataSourceEmployees = this.allEmployees.filter((employee) => {
      const matchesName = !normalizedSearch ||
        this.getEmployeeNameSearchValue(employee).includes(normalizedSearch);

      return (!this.showOnlyActiveEmployees || this.isEmployeeActive(employee)) &&
        matchesName &&
        this.matchesEmployeePositionFilter(employee) &&
        this.matchesEmployeeDemographicFilters(employee);
    });

    this.refreshEmployeePage(true);
  }

  private refreshEmployeePage(resetPage = false): void {
    if (resetPage) {
      this.employeePageIndex = 0;
    }

    const pageSize = Math.max(1, Number(this.employeePageSize) || 25);
    const lastPageIndex = Math.max(0, Math.ceil(this.dataSourceEmployees.length / pageSize) - 1);
    this.employeePageIndex = Math.min(this.employeePageIndex, lastPageIndex);

    const start = this.employeePageIndex * pageSize;
    this.pagedEmployees = this.dataSourceEmployees.slice(start, start + pageSize);
  }

  private setupDemographicAutocompleteControls(): void {
    this.clearDemographicValueSubscriptions();

    this.camposDemograficosOrganizacion.forEach((field) => {
      const fieldName = this.getDemographicFieldControlName(field);
      const control = this.employeeForm.get(fieldName);

      if (!fieldName || !control) {
        return;
      }

      const subscription = control.valueChanges.subscribe((value) => {
        this.updateFilteredDemographicOptions(fieldName, value);
      });

      this.demographicValueSubscriptions.push(subscription);
    });

    this.refreshDemographicOptions();
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

      const managerControl = this.employeeForm.get('IdEmpleadoJefe');

      managerControl?.setValue(result.id);
      managerControl?.markAsDirty();
      managerControl?.updateValueAndValidity({ emitEvent: false });
      this.selectedManagerName = result.employee ? getEmployeeOptionFullName(result.employee) : '';
    });
  }

  private getSelectedOrganizationId(): number {
    const organizationId = Number(
      this.organizacionService.selectedOrganizationSnapshot?.Id ??
      this.idOrganization ??
      this.employeeForm.getRawValue()?.IdOrganizacion
    );

    return Number.isFinite(organizationId) && organizationId > 0 ? organizationId : 0;
  }

  private buildEmployeePayload(): any {
    const rawValue = this.employeeForm.getRawValue();
    const selectedOrganizationId = this.getSelectedOrganizationId();
    const {
      IdOrganizacion: _idOrganizacion,
      PhoneCountryIso,
      IdEmpleadoJefe,
      ...employeeData
    } = rawValue;

    const normalizedManagerId = normalizeEmployeeManagerId(IdEmpleadoJefe);

    return {
      IdOrganizacion: selectedOrganizationId,
      idOrganizacion: selectedOrganizationId,
      ...employeeData,
      IdEmpleadoJefe: normalizedManagerId,
      idEmpleadoJefe: normalizedManagerId,
      IdJefe: normalizedManagerId,
      idJefe: normalizedManagerId,
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
      this.allEmployees = [];
      this.dataSourceEmployees = [];
      this.pagedEmployees = [];
      this.employeePageIndex = 0;
      this.resetEmployeeFilters(false);
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
      width: '1196px',
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
      'Seleccionar',
      'Id',
      'DatosContacto',
      'TipoEnvioEncuesta',
      'estado',
      'NombreJefe',
    ];
  }

  private getHiddenEmployeeColumnKeys(): Set<string> {
    return new Set([
      ...this.getEmployeeBaseColumns(),
      'IdOrganizacion',
      'Nombres',
      'Apellidos',
      'Cargo',
      'Celular',
      'Email',
      'FechaRegistro',
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
      'NombreOrganizacion',
      'nombreOrganizacion',
      'Organizacion',
      'organizacion',
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

    this.allEmployees.forEach((employee: any) => {
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
    if (this.allEmployees.length === 0) {
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
    const requestedOrganizationId = this.idOrganization;

    if (!requestedOrganizationId) {
      this.isLoadingEmployees = false;
      this.clearEmployeeSelection();
      return;
    }

    this.isLoadingEmployees = true;
    this.clearEmployeeSelection();

    this.organizacionService.getEmployees(requestedOrganizationId)
      .then((response: any) => {
        if (this.idOrganization !== requestedOrganizationId) {
          return;
        }

        this.allEmployees = Array.isArray(response.data) ? response.data : [];
        this.refreshCargoOptions();
        this.refreshDemographicOptions();
        this.refreshEmployeeTableColumns();
        this.applyEmployeeFilters();
        this.syncSelectedManagerName();
      })
      .catch((error: any) => {
        if (this.idOrganization !== requestedOrganizationId) {
          return;
        }

        console.error('Error al obtener empleados:', error);
        this.allEmployees = [];
        this.dataSourceEmployees = [];
        this.pagedEmployees = [];
        this.employeePageIndex = 0;
        this.refreshEmployeeTableColumns();
      })
      .finally(() => {
        if (this.idOrganization === requestedOrganizationId) {
          this.isLoadingEmployees = false;
        }
      });
  }

  private getCurrentEmployeesCount(): number {
    return this.allEmployees.length;
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

  private getEmployeeId(employee: any): number {
    const employeeId = Number(employee?.Id ?? employee?.id ?? employee?.IdEmpleado ?? employee?.idEmpleado ?? 0);
    return Number.isInteger(employeeId) && employeeId > 0 ? employeeId : 0;
  }

  private getSelectedEmployees(): any[] {
    return this.allEmployees.filter((employee: any) =>
      this.selectedEmployeeIds.has(this.getEmployeeId(employee))
    );
  }

  private async processSelectedEmployeesByStatus(activeStatus: boolean): Promise<void> {
    if (this.isProcessingBulkEmployeeAction) {
      return;
    }

    const selectedEmployees = this.getSelectedEmployees();
    const targetEmployees = selectedEmployees.filter((employee) => this.isEmployeeActive(employee) === activeStatus);
    const actionLabel = activeStatus ? 'desactivar' : 'activar';

    if (targetEmployees.length === 0) {
      await Swal.fire({
        title: 'Sin empleados aplicables',
        text: `No hay empleados ${activeStatus ? 'activos' : 'inactivos'} seleccionados para ${actionLabel}.`,
        icon: 'info',
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: `¿${activeStatus ? 'Desactivar' : 'Activar'} empleados?`,
      html: `Se aplicará esta acción a <b>${targetEmployees.length}</b> empleado(s) seleccionado(s). Los demás conservarán su estado actual.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: activeStatus ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    this.isProcessingBulkEmployeeAction = true;
    let successCount = 0;
    const failedEmployees: string[] = [];

    Swal.fire({
      title: `${activeStatus ? 'Desactivando' : 'Activando'} empleados`,
      html: this.buildBulkEmployeeProgressHtml(0, targetEmployees.length, actionLabel),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      for (let index = 0; index < targetEmployees.length; index += 1) {
        const employee = targetEmployees[index];
        const employeeId = this.getEmployeeId(employee);

        try {
          if (activeStatus) {
            await this.organizacionService.deleteEmployee(employeeId);
          } else {
            await this.organizacionService.activeEmployee(employeeId);
          }
          successCount += 1;
        } catch (error) {
          console.error(`No fue posible ${actionLabel} el empleado ${employeeId}:`, error);
          failedEmployees.push(this.getBulkEmployeeDisplayName(employee));
        }

        Swal.update({
          html: this.buildBulkEmployeeProgressHtml(index + 1, targetEmployees.length, actionLabel),
        });
      }
    } finally {
      this.isProcessingBulkEmployeeAction = false;
      Swal.close();
    }

    this.clearEmployeeSelection();
    this.getEmployeesByOrg();

    await Swal.fire({
      title: 'Proceso finalizado',
      html: failedEmployees.length === 0
        ? `Se lograron ${actionLabel} <b>${successCount}</b> empleado(s).`
        : `Se lograron ${actionLabel} <b>${successCount}</b> empleado(s).<br><br>No fue posible procesar: ${failedEmployees.join(', ')}.`,
      icon: failedEmployees.length === 0 ? 'success' : 'warning',
    });
  }

  private buildBulkEmployeeProgressHtml(completed: number, total: number, actionLabel: string): string {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
      <div style="font-size:14px;color:#475569;margin-bottom:10px">${completed} de ${total} empleados procesados para ${actionLabel}.</div>
      <div style="height:10px;border-radius:999px;overflow:hidden;background:#e2e8f0">
        <div style="width:${percentage}%;height:100%;border-radius:inherit;background:#2563eb;transition:width .2s ease"></div>
      </div>
      <div style="margin-top:8px;font-size:12px;color:#64748b">${percentage}% completado</div>`;
  }

  private getBulkEmployeeDisplayName(employee: any): string {
    return String(
      employee?.NombreCompleto ??
      employee?.nombreCompleto ??
      `${employee?.Nombres ?? employee?.nombres ?? ''} ${employee?.Apellidos ?? employee?.apellidos ?? ''}`
    ).trim() || `Empleado #${this.getEmployeeId(employee)}`;
  }

  // Enviar datos al servicio:
  onSubmit(): void {
    if (this.isSavingNewEmployee) {
      return;
    }

    this.normalizePhoneControlValue(this.employeeForm);
    this.applyPhoneControlValidation(this.employeeForm);

    if (this.employeeForm.valid) {
      const selectedOrganizationId = this.getSelectedOrganizationId();

      if (!selectedOrganizationId) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.VERIFY'),
          text: this.translate.instant('MENUITEMS.EMPLOYEE.SELECTORGANIZATION'),
          icon: 'warning',
        });
        return;
      }

      this.idOrganization = selectedOrganizationId;
      this.employeeForm.get('IdOrganizacion')?.setValue(selectedOrganizationId);

      if (this.demoLimitsService.exceedsLimit(
        'maxEmployeesPerOrganization',
        this.getCurrentEmployeesCount(),
      )) {
        this.showEmployeeLimitReachedMessage();
        return;
      }

      const reordered = this.buildEmployeePayload();
      this.isSavingNewEmployee = true;
      
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
          const errorMessage = error?.response?.data?.error ?? error?.message ?? error;
          console.error('Error al crear empleado:', errorMessage);
          Swal.fire({
            title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
            text: this.translate.instant('MENUITEMS.EMPLOYEE.ERRCREATEEMPLOYEE') + ' Error: ' + errorMessage,
            icon: 'error',
          });
        })
        .finally(() => {
          this.isSavingNewEmployee = false;
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
      NombreOrganizacion: this.dataSourceOrganizations[0]?.Nombre,
      employeeManagerOptions: this.getLoadedEmployeeManagerOptions(),
    };

    console.log('this.camposDemograficosOrganizacion:: ', this.camposDemograficosOrganizacion);

    const dialogRef = this.dialogItemModel.open(DialogformEditEmployeeComponent, {
      width:  '1196px',
      maxWidth: '95vw',    
      height: 'auto',  
      disableClose: true,
      autoFocus: false,
      panelClass: 'employee-edit-dialog-panel',
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

  private normalizeExcelManagerCode(value: any): string {
    const managerCode = String(value ?? '').trim();
    return this.normalizeEmployeeCodeKey(managerCode) === '0' ? '' : managerCode;
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

  private getEmployeeImportWorksheet(): XLSX.WorkSheet | null {
    if (!this.workbook?.SheetNames?.length) {
      return null;
    }

    const normalizeSheetName = (sheetName: string) => String(sheetName ?? '').trim().toUpperCase();
    const preferredSheetName = this.workbook.SheetNames.find((sheetName: string) =>
      ['EMPLEADOS', 'EMPLOYEES'].includes(normalizeSheetName(sheetName))
    );
    const fallbackSheetName = this.workbook.SheetNames.find(
      (sheetName: string) => !['INSTRUCCIONES', 'INSTRUCTIONS'].includes(normalizeSheetName(sheetName))
    );
    const employeeSheetName = preferredSheetName ?? fallbackSheetName;

    return employeeSheetName ? this.workbook.Sheets[employeeSheetName] ?? null : null;
  }

  convertExcelToJSON() {
   
   if(this.langStoreValue == 'es'){
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
       //console.log('NO WORKBOOK?');
        return reject('No se encontró workbook');
      }
  
      const worksheet = this.getEmployeeImportWorksheet();

      if (!worksheet) {
        return reject('No se encontro la hoja EMPLEADOS en el archivo Excel.');
      }

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
        const codigoJefe = this.normalizeExcelManagerCode(
          this.getExcelCellText(t, ['CODIGO_JEFE', 'MANAGER_CODE', 'BOSS_CODE', 'SUPERVISOR_CODE'])
        );
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
        } else if (codigoKey !== '0' && codigosVistos.has(codigoKey)) {
          errores.push(`Fila ${filaExcel}: CODIGO duplicado. Ya fue usado en la fila ${codigosVistos.get(codigoKey)}.`);
        } else if (codigoKey !== '0') {
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
            filaExcel,
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
  
      const worksheet = this.getEmployeeImportWorksheet();

      if (!worksheet) {
        return reject('The EMPLOYEES worksheet was not found in the Excel file.');
      }

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
        const codigoJefe = this.normalizeExcelManagerCode(
          this.getExcelCellText(t, ['MANAGER_CODE', 'BOSS_CODE', 'SUPERVISOR_CODE', 'CODIGO_JEFE'])
        );
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
        } else if (codigoKey !== '0' && codigosVistos.has(codigoKey)) {
          errores.push(`Row ${filaExcel}: duplicated CODE. It was already used in row ${codigosVistos.get(codigoKey)}.`);
        } else if (codigoKey !== '0') {
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
            filaExcel,
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

  private getEmployeeImportTranslation(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(`MENUITEMS.EMPLOYEE.${key}`, params);
  }

  private normalizeEmployeeImportValue(value: any, ignoreCase = false): string {
    const normalizedValue = String(value ?? '').replace(/\s+/g, ' ').trim();
    return ignoreCase ? normalizedValue.toLocaleLowerCase() : normalizedValue;
  }

  private getEmployeeImportSendType(value: any): number {
    const normalizedValue = this.normalizeEmployeeCodeKey(value);

    if (normalizedValue === '1' || normalizedValue === 'CORREO' || normalizedValue === 'MAIL' || normalizedValue === 'EMAIL') {
      return 1;
    }

    if (normalizedValue === '2' || normalizedValue === 'WHATSAPP') {
      return 2;
    }

    if (
      normalizedValue === '3' ||
      normalizedValue === 'CORREO Y WHATSAPP' ||
      normalizedValue === 'MAIL & WHATSAPP' ||
      normalizedValue === 'EMAIL AND WHATSAPP'
    ) {
      return 3;
    }

    return 0;
  }

  private getEmployeeImportEmail(employee: any): string {
    return this.normalizeEmployeeImportValue(
      employee?.Email ?? employee?.email ?? employee?.Correo ?? employee?.correo,
      true
    );
  }

  private getEmployeeImportDemographicNames(): Map<string, string> {
    const demographicNames = new Map<string, string>();

    this.camposDemograficosOrganizacion.forEach((field) => {
      const fieldName = this.getDemographicFieldName(field);

      if (fieldName) {
        demographicNames.set(this.normalizeEmployeeColumnKey(fieldName), fieldName);
      }
    });

    // Dynamic columns come from the loaded employee rows, so they cannot define
    // an empty organization's demographic schema.
    (this.allEmployees.length > 0 ? this.camposDinamicos : []).forEach((fieldName) => {
      const normalizedFieldName = this.normalizeEmployeeColumnKey(fieldName);

      if (fieldName && !demographicNames.has(normalizedFieldName)) {
        demographicNames.set(normalizedFieldName, fieldName);
      }
    });

    return demographicNames;
  }

  private getCanonicalEmployeeImportDemographics(
    demographics: Record<string, any> | null | undefined,
    demographicNames: Map<string, string>
  ): Record<string, string> {
    const canonicalDemographics: Record<string, string> = {};

    Object.entries(demographics ?? {}).forEach(([fieldName, value]) => {
      const canonicalFieldName = demographicNames.get(this.normalizeEmployeeColumnKey(fieldName));

      if (canonicalFieldName) {
        canonicalDemographics[canonicalFieldName] = this.normalizeEmployeeImportValue(value);
      }
    });

    return canonicalDemographics;
  }

  private buildEmployeeImportPayload(
    row: any,
    managerId: number | null,
    demographics: Record<string, string>
  ): Record<string, any> {
    const cargo = this.normalizeEmployeeImportValue(row?.cargo ?? row?.position);
    const payload = {
      IdOrganizacion: this.idOrganization,
      idOrganizacion: this.idOrganization,
      Nombres: this.normalizeEmployeeImportValue(row?.nombres),
      Apellidos: this.normalizeEmployeeImportValue(row?.apellidos),
      Celular: this.normalizeEmployeeImportValue(row?.celular),
      Email: this.normalizeEmployeeImportValue(row?.email),
      Cargo: cargo,
      TipoEnvioEncuesta: this.getEmployeeImportSendType(row?.tipoEnvioEncuesta),
      IdEmpleadoJefe: managerId,
      idEmpleadoJefe: managerId,
      IdJefe: managerId,
      idJefe: managerId,
      ...demographics,
    };

    return payload;
  }

  private employeeImportPayloadHasChanges(
    existingEmployee: any,
    payload: Record<string, any>,
    importedDemographicNames: string[]
  ): boolean {
    const fixedValuesChanged =
      this.normalizeEmployeeImportValue(existingEmployee?.Nombres ?? existingEmployee?.nombres) !== payload['Nombres'] ||
      this.normalizeEmployeeImportValue(existingEmployee?.Apellidos ?? existingEmployee?.apellidos) !== payload['Apellidos'] ||
      this.normalizeEmployeeImportValue(existingEmployee?.Celular ?? existingEmployee?.celular) !== payload['Celular'] ||
      this.normalizeEmployeeImportValue(existingEmployee?.Email ?? existingEmployee?.email, true) !==
        this.normalizeEmployeeImportValue(payload['Email'], true) ||
      this.normalizeEmployeeImportValue(this.getEmployeeCargoValue(existingEmployee)) !== payload['Cargo'] ||
      this.getEmployeeImportSendType(existingEmployee?.TipoEnvioEncuesta ?? existingEmployee?.tipoEnvioEncuesta) !==
        payload['TipoEnvioEncuesta'] ||
      getEmployeeOptionManagerId(existingEmployee) !== normalizeEmployeeManagerId(payload['IdEmpleadoJefe']);

    if (fixedValuesChanged) {
      return true;
    }

    return importedDemographicNames.some(
      (fieldName) =>
        this.normalizeEmployeeImportValue(this.getEmployeeDemographicValue(existingEmployee, fieldName)) !==
        this.normalizeEmployeeImportValue(payload[fieldName])
    );
  }

  private employeeImportIdentityMatches(existingEmployee: any, row: any): boolean {
    const existingFirstName = this.normalizeEmployeeImportValue(
      existingEmployee?.Nombres ?? existingEmployee?.nombres,
      true
    );
    const existingLastName = this.normalizeEmployeeImportValue(
      existingEmployee?.Apellidos ?? existingEmployee?.apellidos,
      true
    );
    const importedFirstName = this.normalizeEmployeeImportValue(row?.nombres, true);
    const importedLastName = this.normalizeEmployeeImportValue(row?.apellidos, true);

    return !!importedFirstName &&
      importedFirstName === existingFirstName &&
      importedLastName === existingLastName;
  }

  private setEmployeeImportManagerId(
    payload: Record<string, any>,
    managerId: number | null
  ): Record<string, any> {
    return {
      ...payload,
      IdEmpleadoJefe: managerId,
      idEmpleadoJefe: managerId,
      IdJefe: managerId,
      idJefe: managerId,
    };
  }

  private prepareEmployeeExcelImport(
    originalData: any,
    allowNewDemographicFields = false
  ): EmployeeExcelImportPlan {
    const rows: any[] = Array.isArray(originalData?.empleados) ? originalData.empleados : [];
    const errors: string[] = [];
    const employeesById = new Map<number, any>();
    const employeesByEmail = new Map<string, any[]>();
    const demographicNames = this.getEmployeeImportDemographicNames();
    const importedDemographicColumns: string[] = Array.isArray(originalData?.camposDemograficos)
      ? originalData.camposDemograficos
      : [];

    this.allEmployees.forEach((employee) => {
      const employeeId = getEmployeeOptionId(employee);
      const email = this.getEmployeeImportEmail(employee);

      if (employeeId) {
        employeesById.set(employeeId, employee);
      }

      if (email) {
        const matchingEmployees = employeesByEmail.get(email) ?? [];
        matchingEmployees.push(employee);
        employeesByEmail.set(email, matchingEmployees);
      }
    });

    const unknownDemographicColumns = importedDemographicColumns.filter(
      (fieldName) => !demographicNames.has(this.normalizeEmployeeColumnKey(fieldName))
    );

    if (unknownDemographicColumns.length && !allowNewDemographicFields) {
      errors.push(this.getEmployeeImportTranslation('IMPORTUNKNOWNDEMOGRAPHICS', {
        fields: unknownDemographicColumns.join(', '),
      }));
    }

    const seenImportedEmails = new Map<string, number>();
    const seenImportedCodes = new Map<string, number>();
    const seenResolvedEmployeeIds = new Map<number, number>();
    const preparedRows: PreparedEmployeeExcelRow[] = [];
    const preparedRowsByCode = new Map<string, PreparedEmployeeExcelRow>();
    const resolvedEmployeeIdsByCode = new Map<string, number>();
    const plan: EmployeeExcelImportPlan = {
      creates: [],
      updates: [],
      unchanged: 0,
      resolvedEmployeeIdsByCode,
    };

    rows.forEach((row, index) => {
      const rowNumber = Number(row?.filaExcel) || index + 2;
      const rawEmployeeCode = this.normalizeEmployeeImportValue(row?.codigo);
      const normalizedEmployeeCode = this.normalizeEmployeeCodeKey(rawEmployeeCode);
      const employeeCodeKey = normalizedEmployeeCode === '0' ? '' : normalizedEmployeeCode;
      const normalizedManagerCode = this.normalizeEmployeeCodeKey(row?.codigoJefe);
      const managerCodeKey = normalizedManagerCode === '0' ? '' : normalizedManagerCode;
      const email = this.normalizeEmployeeImportValue(row?.email, true);

      if (!rawEmployeeCode) {
        errors.push(this.getEmployeeImportTranslation('IMPORTINVALIDCODE', {
          row: rowNumber,
          code: rawEmployeeCode,
        }));
        return;
      }

      if (employeeCodeKey) {
        const previousCodeRow = seenImportedCodes.get(employeeCodeKey);

        if (previousCodeRow) {
          errors.push(this.getEmployeeImportTranslation('IMPORTDUPLICATECODEFILE', {
            row: rowNumber,
            code: rawEmployeeCode,
            previousRow: previousCodeRow,
          }));
          return;
        }

        seenImportedCodes.set(employeeCodeKey, rowNumber);
      }

      const previousEmailRow = seenImportedEmails.get(email);

      if (email && previousEmailRow) {
        errors.push(this.getEmployeeImportTranslation('IMPORTDUPLICATEEMAILFILE', {
          row: rowNumber,
          email,
          previousRow: previousEmailRow,
        }));
        return;
      }

      if (email) {
        seenImportedEmails.set(email, rowNumber);
      }

      const emailMatches = employeesByEmail.get(email) ?? [];

      if (emailMatches.length > 1) {
        errors.push(this.getEmployeeImportTranslation('IMPORTAMBIGUOUSEMAIL', {
          row: rowNumber,
          email,
        }));
        return;
      }

      const employeeByEmail = emailMatches[0] ?? null;
      const numericEmployeeCode = /^\d+$/.test(rawEmployeeCode) ? Number(rawEmployeeCode) : 0;
      const employeeById = numericEmployeeCode > 0 ? employeesById.get(numericEmployeeCode) ?? null : null;
      const emailEmployeeId = getEmployeeOptionId(employeeByEmail);
      const codeEmployeeId = getEmployeeOptionId(employeeById);

      if (emailEmployeeId && codeEmployeeId && emailEmployeeId !== codeEmployeeId) {
        errors.push(this.getEmployeeImportTranslation('IMPORTCODEEMAILCONFLICT', {
          row: rowNumber,
          code: rawEmployeeCode,
          email,
        }));
        return;
      }

      const existingEmployee = employeeByEmail ?? (
        employeeById && this.employeeImportIdentityMatches(employeeById, row) ? employeeById : null
      );
      const existingEmployeeId = getEmployeeOptionId(existingEmployee) ?? null;

      if (existingEmployeeId) {
        const previousEmployeeRow = seenResolvedEmployeeIds.get(existingEmployeeId);

        if (previousEmployeeRow) {
          errors.push(this.getEmployeeImportTranslation('IMPORTDUPLICATEEMPLOYEE', {
            row: rowNumber,
            previousRow: previousEmployeeRow,
            code: existingEmployeeId,
          }));
          return;
        }

        seenResolvedEmployeeIds.set(existingEmployeeId, rowNumber);

        if (employeeCodeKey) {
          resolvedEmployeeIdsByCode.set(employeeCodeKey, existingEmployeeId);
        }
      }

      const preparedRow: PreparedEmployeeExcelRow = {
        row,
        rowNumber,
        employeeCodeKey,
        managerCodeKey,
        existingEmployee,
        existingEmployeeId,
      };

      preparedRows.push(preparedRow);

      if (employeeCodeKey) {
        preparedRowsByCode.set(employeeCodeKey, preparedRow);
      }
    });

    preparedRows.forEach((preparedRow) => {
      const {
        row,
        rowNumber,
        employeeCodeKey,
        managerCodeKey,
        existingEmployee,
        existingEmployeeId,
      } = preparedRow;

      if (managerCodeKey && managerCodeKey === employeeCodeKey) {
        errors.push(this.getEmployeeImportTranslation('IMPORTSELFASMANAGER', {
          row: rowNumber,
          code: row?.codigo,
        }));
        return;
      }

      let managerId = managerCodeKey ? resolvedEmployeeIdsByCode.get(managerCodeKey) ?? null : null;

      if (managerCodeKey && !preparedRowsByCode.has(managerCodeKey) && managerId === null) {
        const numericManagerCode = /^\d+$/.test(managerCodeKey) ? Number(managerCodeKey) : 0;
        managerId = numericManagerCode > 0 && employeesById.has(numericManagerCode)
          ? numericManagerCode
          : null;

        if (managerId === null) {
          errors.push(this.getEmployeeImportTranslation('IMPORTMANAGERNOTFOUND', {
            row: rowNumber,
            code: row?.codigoJefe,
          }));
          return;
        }
      }

      const importedDemographics = this.getCanonicalEmployeeImportDemographics(
        row?.demograficos,
        demographicNames
      );
      const actionBase = {
        rowNumber,
        employeeCodeKey,
        managerCodeKey,
        managerId,
      };

      if (existingEmployee && existingEmployeeId) {
        const payload = {
          ...this.buildEmployeeImportPayload(row, managerId, importedDemographics),
          IdEmpleado: existingEmployeeId,
        };
        const hasPendingManager = !!managerCodeKey && managerId === null;

        if (
          hasPendingManager ||
          this.employeeImportPayloadHasChanges(existingEmployee, payload, Object.keys(importedDemographics))
        ) {
          plan.updates.push({ ...actionBase, payload });
        } else {
          plan.unchanged += 1;
        }

        return;
      }

      const newEmployeeDemographics: Record<string, string> = {};

      demographicNames.forEach((fieldName) => {
        newEmployeeDemographics[fieldName] = importedDemographics[fieldName] ?? '';
      });

      plan.creates.push({
        ...actionBase,
        payload: this.buildEmployeeImportPayload(row, managerId, newEmployeeDemographics),
      });
    });

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    return plan;
  }

  private getNewEmployeeImportDemographicFields(originalData: any): string[] {
    const knownFields = this.getEmployeeImportDemographicNames();
    const seenFields = new Set<string>();
    const importedFields = Array.isArray(originalData?.camposDemograficos)
      ? originalData.camposDemograficos
      : [];

    return importedFields.filter((rawFieldName: any) => {
      const fieldName = String(rawFieldName ?? '').trim();
      const normalizedFieldName = this.normalizeEmployeeColumnKey(fieldName);

      if (!fieldName || !normalizedFieldName || seenFields.has(normalizedFieldName)) {
        return false;
      }

      seenFields.add(normalizedFieldName);
      return !knownFields.has(normalizedFieldName);
    }).map((fieldName: any) => String(fieldName).trim());
  }

  private async createEmployeeImportDemographicFields(fieldNames: string[]): Promise<void> {
    for (const fieldName of fieldNames) {
      await this.organizacionService.saveNewDemografico(
        { NombreCampo: fieldName },
        this.idOrganization
      );

      this.camposDemograficosOrganizacion = [
        ...this.camposDemograficosOrganizacion,
        { NombreCampo: fieldName },
      ];
    }
  }

  private getEmployeeImportApiError(error: any): string {
    return String(
      error?.response?.data?.error ??
      error?.response?.data?.message ??
      error?.message ??
      error
    );
  }

  private escapeEmployeeImportHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private updateEmployeeImportProgress(completed: number, total: number): void {
    const normalizedTotal = Math.max(0, total);
    const normalizedCompleted = Math.min(Math.max(0, completed), normalizedTotal);
    const percentage = normalizedTotal > 0
      ? Math.round((normalizedCompleted / normalizedTotal) * 100)
      : 100;
    const progressText = this.escapeEmployeeImportHtml(
      this.getEmployeeImportTranslation('IMPORTPROGRESS', {
        completed: normalizedCompleted,
        total: normalizedTotal,
      })
    );

    Swal.update({
      html: `
        <div class="employee-import-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percentage}">
          <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:10px;color:#536579;font-size:14px;">
            <span>${progressText}</span>
            <strong style="color:#17324d;white-space:nowrap;">${percentage}%</strong>
          </div>
          <div style="height:8px;overflow:hidden;border-radius:999px;background:#e7eef4;">
            <div style="height:100%;width:${percentage}%;border-radius:inherit;background:#0b76c5;transition:width .2s ease;"></div>
          </div>
        </div>`,
    });
  }

  private async uploadEmployeesExcel(originalData: any): Promise<void> {
    const employees: any[] = Array.isArray(originalData?.empleados) ? originalData.empleados : [];

    if (!employees.length) {
      Swal.close();
      await Swal.fire(
        this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        this.getEmployeeImportTranslation('NOEMPLOYEESTOUPLOAD'),
        'info'
      );
      return;
    }

    let importPlan: EmployeeExcelImportPlan;
    const newDemographicFields = this.getNewEmployeeImportDemographicFields(originalData);

    try {
      // Validate employees first without rejecting demographic columns that will be
      // created as part of this same import.
      const preflightPlan = this.prepareEmployeeExcelImport(originalData, true);

      if (this.demoLimitsService.exceedsLimit(
        'maxEmployeesPerOrganization',
        this.getCurrentEmployeesCount(),
        preflightPlan.creates.length,
      )) {
        Swal.close();
        this.showEmployeeLimitReachedMessage(preflightPlan.creates.length);
        return;
      }

      if (this.demoLimitsService.exceedsLimit(
        'maxDemographicsPerOrganization',
        this.camposDemograficosOrganizacion.length,
        newDemographicFields.length,
      )) {
        Swal.close();
        await Swal.fire({
          title: 'Limite demo alcanzado',
          text:
            `Solo se pueden ingresar ${this.demoLimitsService.getLimit('maxDemographicsPerOrganization')} campos demograficos en esta demo.`,
          icon: 'warning',
        });
        return;
      }

      if (newDemographicFields.length) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.UPLOADMESSAGE'),
          html: this.translate.instant('MENUITEMS.EMPLOYEE.PROCESSMESSAGE'),
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });
        await this.createEmployeeImportDemographicFields(newDemographicFields);
      }

      // Rebuild the plan after the new demographic fields are available, so their
      // values are included in the employee create and update payloads.
      importPlan = this.prepareEmployeeExcelImport(originalData);
    } catch (error: any) {
      Swal.close();
      await Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.VERIFY'),
        html:
          `<pre style="text-align:left;white-space:pre-wrap;max-height:50vh;overflow:auto">` +
          this.escapeEmployeeImportHtml(this.getEmployeeImportApiError(error)) +
          `</pre>`,
        icon: 'warning',
        width: 760,
      });
      return;
    }

    if (this.demoLimitsService.exceedsLimit(
      'maxEmployeesPerOrganization',
      this.getCurrentEmployeesCount(),
      importPlan.creates.length,
    )) {
      Swal.close();
      this.showEmployeeLimitReachedMessage(importPlan.creates.length);
      return;
    }

    Swal.fire({
      title: this.translate.instant('MENUITEMS.EMPLOYEE.UPLOADMESSAGE'),
      html: this.translate.instant('MENUITEMS.EMPLOYEE.PROCESSMESSAGE'),
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    let created = 0;
    let updated = 0;
    let processed = 0;
    const totalToProcess = importPlan.creates.length + importPlan.updates.length;
    const processingErrors: string[] = [];
    const resolvedEmployeeIdsByCode = new Map(importPlan.resolvedEmployeeIdsByCode);
    const resolveManagerId = (action: EmployeeExcelImportAction): number | null => {
      if (!action.managerCodeKey) {
        return action.managerId;
      }

      return resolvedEmployeeIdsByCode.get(action.managerCodeKey) ?? action.managerId;
    };

    try {
      this.updateEmployeeImportProgress(processed, totalToProcess);
      const pendingCreates = [...importPlan.creates];

      while (pendingCreates.length > 0) {
        let processedAnyEmployee = false;

        for (let index = pendingCreates.length - 1; index >= 0; index -= 1) {
          const action = pendingCreates[index];
          const managerId = resolveManagerId(action);

          if (action.managerCodeKey && managerId === null) {
            continue;
          }

          pendingCreates.splice(index, 1);
          processedAnyEmployee = true;

          try {
            const payload = this.setEmployeeImportManagerId(action.payload, managerId);
            const response: any = await this.organizacionService.saveNewEmployee(payload);
            const newEmployeeId = Number(response?.data?.newId);

            if (
              response?.data?.message !== 'Empleado insertado exitosamente' ||
              !Number.isInteger(newEmployeeId) ||
              newEmployeeId <= 0
            ) {
              throw new Error(response?.data?.message || 'Respuesta inesperada del servidor.');
            }

            if (action.employeeCodeKey) {
              resolvedEmployeeIdsByCode.set(action.employeeCodeKey, newEmployeeId);
            }

            created += 1;
          } catch (error) {
            processingErrors.push(
              this.getEmployeeImportTranslation('IMPORTROWERROR', {
                row: action.rowNumber,
                error: this.getEmployeeImportApiError(error),
              })
            );
          } finally {
            processed += 1;
            this.updateEmployeeImportProgress(processed, totalToProcess);
          }
        }

        if (!processedAnyEmployee) {
          pendingCreates.forEach((action) => {
            processingErrors.push(
              this.getEmployeeImportTranslation('IMPORTMANAGERDEPENDENCYFAILED', {
                row: action.rowNumber,
                code: action.managerCodeKey,
              })
            );
          });
          processed += pendingCreates.length;
          this.updateEmployeeImportProgress(processed, totalToProcess);
          break;
        }
      }

      for (const action of importPlan.updates) {
        const managerId = resolveManagerId(action);

        if (action.managerCodeKey && managerId === null) {
          processingErrors.push(
            this.getEmployeeImportTranslation('IMPORTMANAGERDEPENDENCYFAILED', {
              row: action.rowNumber,
              code: action.managerCodeKey,
            })
          );
          processed += 1;
          this.updateEmployeeImportProgress(processed, totalToProcess);
          continue;
        }

        try {
          const payload = this.setEmployeeImportManagerId(action.payload, managerId);
          const response: any = await this.organizacionService.updateEmployee(payload);

          if (response?.data?.message !== 'Empleado actualizado exitosamente') {
            throw new Error(response?.data?.message || 'Respuesta inesperada del servidor.');
          }

          updated += 1;
        } catch (error) {
          processingErrors.push(
            this.getEmployeeImportTranslation('IMPORTROWERROR', {
              row: action.rowNumber,
              error: this.getEmployeeImportApiError(error),
              })
            );
        } finally {
          processed += 1;
          this.updateEmployeeImportProgress(processed, totalToProcess);
        }
      }

      Swal.close();

      const summary = this.getEmployeeImportTranslation('IMPORTSUMMARY', {
        created,
        updated,
        unchanged: importPlan.unchanged,
      });

      if (processingErrors.length) {
        await Swal.fire({
          title: this.getEmployeeImportTranslation('IMPORTPARTIAL'),
          html:
            `<p>${this.escapeEmployeeImportHtml(summary)}</p>` +
            `<pre style="text-align:left;white-space:pre-wrap;max-height:50vh;overflow:auto">` +
            this.escapeEmployeeImportHtml(processingErrors.join('\n')) +
            `</pre>`,
          icon: 'warning',
          width: 760,
        });
      } else {
        await Swal.fire({
          title: this.translate.instant('MENUITEMS.EMPLOYEE.SUCCESS'),
          text: summary,
          icon: 'success',
        });
      }
    } finally {
      this.getEmployeesByOrg();
      this.getDemograficos();
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
        this.clearDemographicValueSubscriptions();

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
          const fieldName = this.getDemographicFieldControlName(field);

          if (!fieldName) {
            return;
          }

          if (this.employeeForm.get(fieldName)) {
            this.employeeForm.get(fieldName)?.setValue('');
          } else {
            this.employeeForm.addControl(fieldName, new UntypedFormControl(''));
          }
        });

        this.setupDemographicAutocompleteControls();
        this.refreshEmployeeTableColumns();
      })
      .catch((error: any) => {
        console.error('Error al obtener demográficos:', error);
      });
  }

  private getEmployeeExportValue(employee: any, keys: string[]): string {
    for (const key of keys) {
      const value = employee?.[key];

      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim();
      }
    }

    return '';
  }

  private getEmployeeSendTypeForExport(employee: any): string {
    const sendType = this.getEmployeeExportValue(employee, [
      'TipoEnvioEncuesta',
      'tipoEnvioEncuesta',
      'TipoEnvio',
      'tipoEnvio',
    ]);
    const normalizedSendType = this.normalizeEmployeeCodeKey(sendType);

    if (normalizedSendType === '1' || normalizedSendType === 'CORREO' || normalizedSendType === 'MAIL' || normalizedSendType === 'EMAIL') {
      return 'CORREO';
    }

    if (normalizedSendType === '2' || normalizedSendType === 'WHATSAPP') {
      return 'WHATSAPP';
    }

    if (
      normalizedSendType === '3' ||
      normalizedSendType === 'CORREO Y WHATSAPP' ||
      normalizedSendType === 'MAIL & WHATSAPP' ||
      normalizedSendType === 'EMAIL AND WHATSAPP'
    ) {
      return 'CORREO Y WHATSAPP';
    }

    return 'NINGUNO';
  }

  private getEmployeeExportDemographicColumns(): string[] {
    const columnsByKey = new Map<string, string>();

    this.camposDinamicos.forEach((fieldName) => {
      columnsByKey.set(this.normalizeEmployeeColumnKey(fieldName), fieldName);
    });

    this.camposDemograficosOrganizacion.forEach((field) => {
      const fieldName = this.getDemographicFieldName(field);
      const normalizedFieldName = this.normalizeEmployeeColumnKey(fieldName);

      if (fieldName && !columnsByKey.has(normalizedFieldName)) {
        columnsByKey.set(normalizedFieldName, fieldName);
      }
    });

    return Array.from(columnsByKey.values());
  }

  private getEmployeeExportFileName(): string {
    const organizationName = String(
      this.dataSourceOrganizations[0]?.Nombre ??
      this.dataSourceOrganizations[0]?.nombre ??
      'Organizacion'
    )
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'Organizacion';
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');
    const dateTime = [
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`,
    ].join('_');

    return `Empleados_${organizationName}_${dateTime}.xlsx`;
  }

  downloadExcelEmployeeTemplate(): void {
    const templateEs = this.confslist.find(
      (config: any) => config.Nombre === 'TEMPLATE_EXCEL_EMP_SPANISH'
    );
    const templateEn = this.confslist.find(
      (config: any) => config.Nombre === 'TEMPLATE_EXCEL_EMP_ENG'
    );
    const template = this.langStoreValue === 'en' ? templateEn : templateEs;

    if (!template?.Valor) {
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.TEMPLATEDOWNLOADERROR'),
        icon: 'error',
      });
      return;
    }

    const url = this.s3objectsServer + template.Valor;
    const filename = this.langStoreValue === 'en'
      ? 'EmployeeTemplate_EN.xlsx'
      : 'PlantillaEmpleado_ES.xlsx';
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  async downloadVisibleEmployeesExcel(): Promise<void> {
    if (this.isExportingEmployees || this.dataSourceEmployees.length === 0) {
      return;
    }

    this.isExportingEmployees = true;
    const employeesToExport = [...this.dataSourceEmployees];

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('EMPLEADOS');

      const fixedHeaders = [
        'NOMBRES',
        'APELLIDOS',
        'TELEFONO',
        'EMAIL',
        'TIPO_ENVIO_ENCUESTA',
        'CARGO',
        'CODIGO',
        'CODIGO_JEFE',
      ];
      const demographicHeaders = this.getEmployeeExportDemographicColumns();
      const headers = [...fixedHeaders, ...demographicHeaders];

      const headerRow = worksheet.getRow(1);
      headers.forEach((header, index) => {
        headerRow.getCell(index + 1).value = header;
      });

      employeesToExport.forEach((employee: any) => {
        const employeeId = getEmployeeOptionId(employee) ?? 0;
        const managerId = getEmployeeOptionManagerId(employee) ?? 0;

        worksheet.addRow([
          this.getEmployeeExportValue(employee, ['Nombres', 'nombres']),
          this.getEmployeeExportValue(employee, ['Apellidos', 'apellidos']),
          this.getEmployeeExportValue(employee, ['Celular', 'celular', 'Telefono', 'telefono']),
          this.getEmployeeExportValue(employee, ['Email', 'email', 'Correo', 'correo']),
          this.getEmployeeSendTypeForExport(employee),
          this.getEmployeeCargoValue(employee),
          employeeId,
          managerId,
          ...demographicHeaders.map((fieldName) => this.getEmployeeDemographicValue(employee, fieldName)),
        ]);
      });

      if (worksheet.actualRowCount - 1 !== employeesToExport.length) {
        throw new Error('La cantidad de empleados exportados no coincide con la tabla visible.');
      }

      headerRow.height = 28;
      headerRow.eachCell((cell, columnNumber) => {
        const isDemographic = columnNumber > fixedHeaders.length;
        cell.font = {
          bold: true,
          color: { argb: isDemographic ? 'FF234760' : 'FFFFFFFF' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isDemographic ? 'FFDDEDF8' : 'FF294F63' },
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3DEE8' } },
          left: { style: 'thin', color: { argb: 'FFD3DEE8' } },
          bottom: { style: 'thin', color: { argb: 'FFD3DEE8' } },
          right: { style: 'thin', color: { argb: 'FFD3DEE8' } },
        };
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
          return;
        }

        row.height = 22;
        row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
          const isDemographic = columnNumber > fixedHeaders.length;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isDemographic ? 'FFF1F7FC' : 'FFFFFFFF' },
          };
          cell.alignment = { vertical: 'middle', wrapText: false };
          cell.border = {
            bottom: { style: 'hair', color: { argb: 'FFE3EAF1' } },
          };
        });
      });

      const fixedWidths = [22, 22, 18, 32, 24, 26, 14, 16];
      headers.forEach((_header, index) => {
        worksheet.getColumn(index + 1).width = index < fixedWidths.length ? fixedWidths[index] : 22;
      });

      worksheet.views = [{ state: 'frozen', ySplit: 1 }];
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: Math.max(1, worksheet.rowCount), column: headers.length },
      };
      workbook.creator = 'Just-Link 360';
      workbook.modified = new Date();

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        this.getEmployeeExportFileName()
      );
    } catch (error) {
      console.error('Error al generar el archivo Excel de empleados:', error);
      Swal.fire({
        title: this.translate.instant('MENUITEMS.EMPLOYEE.SOMEWRONG'),
        text: this.translate.instant('MENUITEMS.EMPLOYEE.EXCELDOWNLOADERROR'),
        icon: 'error',
      });
    } finally {
      this.isExportingEmployees = false;
    }
  }
  
 
}

