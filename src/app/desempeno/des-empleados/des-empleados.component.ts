import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface DesOrganizationOption {
  Id: number;
  Nombre: string;
}

interface DesDemographicOption {
  IdCampoOpcion: number;
  Valor: string;
  Codigo: string | null;
  Etiqueta: string | null;
  Orden: number;
  activo: boolean;
}

interface DesDemographicField {
  IdCampoDemografico: number;
  IdOrganizacion: number | null;
  Nombre: string;
  Codigo: string;
  TipoDato: string;
  requerido: boolean;
  activo: boolean;
  permiteMultiples: boolean;
  options: DesDemographicOption[];
}

interface DesEmployee {
  IdEmpleado: number;
  IdOrganizacion: number | null;
  CodigoEmpleado: string | null;
  Nombres: string;
  Apellidos: string;
  Cargo: string | null;
  Telefono: string | null;
  Email: string | null;
  FechaIngreso: string | null;
  IdEmpleadoJefe: number | null;
  IdEmpleadosJefe: number[];
  activo: boolean;
  demographicValues: Record<number, any>;
}

interface ParsedExcelEmployee {
  rowNumber: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  cargo: string | null;
  telefono: string | null;
  email: string;
  fechaIngreso: string | null;
  idEmpleadoJefe: number[];
  jefeReferencia: string | null;
  demographicValues: Record<string, any>;
}

interface ExcelImportResult {
  createdCount: number;
  errors: string[];
}

interface DesEmployeeDemographicValue {
  idCampoDemografico: number;
  valor: any;
}

@Component({
  selector: 'app-des-empleados',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    BreadcrumbComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './des-empleados.component.html',
})
export class DesEmpleadosComponent implements OnDestroy, OnInit {
  @ViewChild('employeeDialogTemplate')
  employeeDialogTemplate?: TemplateRef<unknown>;

  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.EMPLEADOS.TEXT';
  readonly defaultEmployeeCode = 'xx';
  readonly baseColumns: string[] = [
    'IdEmpleado',
    'Nombres',
    'Apellidos',
    'Cargo',
    'Telefono',
    'Email',
    'NombreJefe',
    'FechaIngreso',
    'activo',
  ];
  readonly excelStaticHeaderAliases: Record<string, string[]> = {
    codigo: ['CODIGO', 'CÓDIGO', 'CODE', 'EMPLOYEE_CODE'],
    nombres: ['NOMBRES', 'NOMBRE', 'FIRST_NAME', 'NAME'],
    apellidos: ['APELLIDOS', 'APELLIDO', 'LAST_NAME', 'SURNAME'],
    cargo: ['CARGO', 'PUESTO', 'POSITION', 'JOB_TITLE', 'TITLE'],
    telefono: ['TELEFONO', 'TELÉFONO', 'PHONE', 'CELULAR', 'CELL_PHONE'],
    email: ['EMAIL', 'CORREO', 'MAIL'],
    fechaIngreso: ['FECHA_INGRESO', 'FECHA INGRESO', 'START_DATE', 'DATE_IN'],
    idEmpleadoJefe: ['ID_EMPLEADO_JEFE', 'ID JEFE', 'JEFE_ID', 'BOSS_ID'],
    jefeReferencia: ['JEFE_EMAIL', 'EMAIL_JEFE', 'JEFE_CODIGO', 'CODIGO_JEFE', 'BOSS_EMAIL', 'BOSS_CODE'],
  };

  public employeeForm: FormGroup;
  public dataSourceOrganizations: DesOrganizationOption[] = [];
  public dataSourceEmployees: DesEmployee[] = [];
  public demographicFields: DesDemographicField[] = [];
  public displayedColumns: string[] = [...this.baseColumns, 'Acciones'];
  public searchTerm = '';
  public selectedOrganizationId: number | null = null;
  public editingEmployeeId: number | null = null;
  public isLoadingOrganizations = false;
  public isLoadingEmployees = false;
  public isLoadingFields = false;
  public isSaving = false;
  public isUploadingExcel = false;
  private employeeDialogRef: MatDialogRef<unknown> | null = null;
  private selectedOrganizationSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    this.setupSelectedOrganizationListener();
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.dataSourceOrganizations = [];
        void this.onOrganizationChange(null);
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.selectedOrganizationId === organization.Id) {
        return;
      }

      void this.onOrganizationChange(organization.Id);
    });
  }

  get isEditing(): boolean {
    return this.editingEmployeeId !== null;
  }

  get hasSelectedOrganization(): boolean {
    return !!this.selectedOrganizationId;
  }

  get availableManagers(): DesEmployee[] {
    return this.dataSourceEmployees.filter((employee) => employee.IdEmpleado !== this.editingEmployeeId);
  }

  compareByNumber(left: any, right: any): boolean {
    return Number(left ?? 0) === Number(right ?? 0);
  }

  private openEmployeeDialog(): void {
    if (!this.employeeDialogTemplate) {
      return;
    }

    this.employeeDialogRef?.close();
    this.employeeDialogRef = this.dialog.open(this.employeeDialogTemplate, {
      width: '960px',
      maxWidth: '96vw',
      autoFocus: false,
      disableClose: this.isSaving,
    });

    this.employeeDialogRef.afterClosed().subscribe(() => {
      this.employeeDialogRef = null;
      if (!this.isSaving) {
        this.resetEmployeeForm();
      }
    });
  }

  openCreateDialog(): void {
    if (!this.hasSelectedOrganization) {
      Swal.fire('Organización requerida', 'Selecciona una organización para continuar.', 'warning');
      return;
    }

    this.resetEmployeeForm();
    this.openEmployeeDialog();
  }

  closeEmployeeDialog(): void {
    this.employeeDialogRef?.close();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      Nombres: ['', Validators.required],
      Apellidos: ['', Validators.required],
      Cargo: [''],
      Telefono: [''],
      Email: ['', [Validators.required, Validators.email]],
      FechaIngreso: [''],
      IdEmpleadoJefe: [[]],
    });
  }

  private extractCollection(response: any): any[] {
    const payload = response?.data ?? response;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.data?.items)) {
      return payload.data.items;
    }

    if (Array.isArray(payload?.rows)) {
      return payload.rows;
    }

    if (Array.isArray(payload?.result)) {
      return payload.result;
    }

    return [];
  }

  private extractObject(response: any): any {
    const payload = response?.data ?? response;

    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
      return payload.data;
    }

    if (payload?.result && typeof payload.result === 'object' && !Array.isArray(payload.result)) {
      return payload.result;
    }

    return payload;
  }

  private normalizeBoolean(value: any): boolean {
    if (
      value === true ||
      value === 1 ||
      value === '1' ||
      value === 'true' ||
      value === 'TRUE' ||
      value === 'Activo' ||
      value === 'ACTIVO'
    ) {
      return true;
    }

    return false;
  }

  private normalizeNullableBoolean(value: any): boolean | null {
    if (
      value === true ||
      value === false ||
      value === 1 ||
      value === 0 ||
      value === '1' ||
      value === '0' ||
      value === 'true' ||
      value === 'false' ||
      value === 'TRUE' ||
      value === 'FALSE'
    ) {
      return this.normalizeBoolean(value);
    }

    return null;
  }

  private toPositiveInteger(value: any): number | null {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      return null;
    }

    return numericValue;
  }

  private toOptionalText(value: any): string | null {
    const text = String(value ?? '').trim();
    return text.length > 0 ? text : null;
  }

  private toPositiveIntegerList(value: any): number[] {
    if (value === null || value === undefined || value === '') {
      return [];
    }

    const rawValues = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? this.splitMultipleValues(value)
        : [value];

    const ids = rawValues
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return this.toPositiveInteger(
            item?.IdEmpleado ??
            item?.idEmpleado ??
            item?.IdEmpleadoJefe ??
            item?.idEmpleadoJefe ??
            item?.Id ??
            item?.id
          );
        }

        return this.toPositiveInteger(item);
      })
      .filter((item): item is number => item !== null);

    return Array.from(new Set(ids));
  }

  private getUsuarioAccion(): string {
    return this.authService.currentUserValue?.username || 'system';
  }

  private getErrorMessage(error: any): string {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Ocurrió un error inesperado.'
    );
  }

  private normalizeLookupKey(value: any): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }

  private normalizeOrganization(item: any): DesOrganizationOption {
    return {
      Id: Number(item?.Id ?? item?.id ?? item?.IdOrganizacion ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private normalizeOption(item: any): DesDemographicOption {
    return {
      IdCampoOpcion: Number(
        item?.IdCampoOpcion ?? item?.idCampoOpcion ?? item?.IdOpcion ?? item?.idOpcion ?? item?.Id ?? item?.id ?? 0
      ),
      Valor: String(item?.Valor ?? item?.valor ?? item?.Nombre ?? item?.nombre ?? '').trim(),
      Codigo: this.toOptionalText(item?.Codigo ?? item?.codigo),
      Etiqueta: this.toOptionalText(item?.Etiqueta ?? item?.etiqueta),
      Orden: Number(item?.Orden ?? item?.orden ?? 1) || 1,
      activo: this.normalizeBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado),
    };
  }

  private normalizeField(item: any): DesDemographicField {
    return {
      IdCampoDemografico: Number(
        item?.IdCampoDemografico ?? item?.idCampoDemografico ?? item?.Id ?? item?.id ?? 0
      ),
      IdOrganizacion: this.toPositiveInteger(item?.IdOrganizacion ?? item?.idOrganizacion),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
      Codigo: String(item?.Codigo ?? item?.codigo ?? item?.Clave ?? item?.clave ?? '').trim(),
      TipoDato: String(item?.TipoDato ?? item?.tipoDato ?? 'TEXTO').trim().toUpperCase(),
      requerido: this.normalizeBoolean(
        item?.requerido ?? item?.Requerido ?? item?.EsObligatorio ?? item?.esObligatorio
      ),
      activo: this.normalizeBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado),
      permiteMultiples: this.normalizeBoolean(
        item?.permiteMultiples ?? item?.PermiteMultiples ?? item?.EsMultiple ?? item?.esMultiple
      ),
      options: [],
    };
  }

  private normalizeEmployee(item: any, demographicValues: Record<number, any> = {}): DesEmployee {
    const managerIds = this.normalizeEmployeeManagerIds(item);

    return {
      IdEmpleado: Number(item?.IdEmpleado ?? item?.idEmpleado ?? item?.Id ?? item?.id ?? 0),
      IdOrganizacion: this.toPositiveInteger(item?.IdOrganizacion ?? item?.idOrganizacion),
      CodigoEmpleado: this.toOptionalText(item?.CodigoEmpleado ?? item?.codigoEmpleado ?? item?.Codigo ?? item?.codigo),
      Nombres: String(item?.Nombres ?? item?.nombres ?? '').trim(),
      Apellidos: String(item?.Apellidos ?? item?.apellidos ?? '').trim(),
      Cargo: this.toOptionalText(item?.Cargo ?? item?.cargo ?? item?.Puesto ?? item?.puesto ?? item?.Posicion ?? item?.posicion),
      Telefono: this.toOptionalText(item?.Telefono ?? item?.telefono ?? item?.Celular ?? item?.celular),
      Email: this.toOptionalText(item?.Email ?? item?.email),
      FechaIngreso: this.normalizeDateText(item?.FechaIngreso ?? item?.fechaIngreso),
      IdEmpleadoJefe: managerIds[0] ?? null,
      IdEmpleadosJefe: managerIds,
      activo: this.normalizeBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado),
      demographicValues,
    };
  }

  private normalizeEmployeeManagerIds(item: any): number[] {
    const candidates = [
      item?.IdEmpleadosJefe,
      item?.idEmpleadosJefe,
      item?.IdsEmpleadosJefe,
      item?.idsEmpleadosJefe,
      item?.IdsEmpleadoJefe,
      item?.idsEmpleadoJefe,
      item?.EmpleadosJefe,
      item?.empleadosJefe,
      item?.Jefes,
      item?.jefes,
      item?.IdEmpleadoJefe,
      item?.idEmpleadoJefe,
    ];

    for (const candidate of candidates) {
      const ids = this.toPositiveIntegerList(candidate);

      if (ids.length > 0) {
        return ids;
      }
    }

    return [];
  }

  private extractEmployeeObject(payload: any): any {
    if (payload?.empleado && typeof payload.empleado === 'object') {
      return payload.empleado;
    }

    if (payload?.item && typeof payload.item === 'object') {
      return payload.item;
    }

    if (payload?.employee && typeof payload.employee === 'object') {
      return payload.employee;
    }

    return payload;
  }

  private extractEmployeeId(response: any): number | null {
    const payload = this.extractEmployeeObject(this.extractObject(response));

    return this.toPositiveInteger(
      payload?.IdEmpleado ?? payload?.idEmpleado ?? payload?.Id ?? payload?.id
    );
  }

  getFieldControlName(field: DesDemographicField): string {
    return `demo_${field.IdCampoDemografico}`;
  }

  getFieldColumnKey(field: DesDemographicField): string {
    return this.getFieldControlName(field);
  }

  private getFieldDefaultValue(field: DesDemographicField): any {
    if (field.TipoDato === 'LISTA' && field.permiteMultiples) {
      return [];
    }

    if (field.TipoDato === 'BOOLEANO') {
      return null;
    }

    return '';
  }

  private normalizeDateText(value: any): string | null {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();

      if (!trimmed) {
        return null;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
      }

      const parsedDate = new Date(trimmed);
      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().slice(0, 10);
      }
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10);
    }

    return null;
  }

  private normalizeFieldValueForControl(field: DesDemographicField, value: any): any {
    if (field.TipoDato === 'LISTA' && field.permiteMultiples) {
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
      }

      const text = String(value ?? '').trim();
      return text ? this.splitMultipleValues(text) : [];
    }

    if (field.TipoDato === 'BOOLEANO') {
      return this.normalizeNullableBoolean(value);
    }

    if (field.TipoDato === 'NUMERO') {
      if (value === null || value === undefined || value === '') {
        return '';
      }

      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : '';
    }

    if (field.TipoDato === 'FECHA') {
      return this.normalizeDateText(value) ?? '';
    }

    return String(value ?? '').trim();
  }

  private buildDynamicControl(field: DesDemographicField, value?: any): FormControl {
    const validators = field.requerido ? [Validators.required] : [];
    return this.fb.control(this.normalizeFieldValueForControl(field, value), validators);
  }

  private syncDynamicControls(values?: Record<number, any>): void {
    const requiredControls = new Set<string>();

    this.demographicFields.forEach((field) => {
      const controlName = this.getFieldControlName(field);
      const controlValue =
        values && Object.prototype.hasOwnProperty.call(values, field.IdCampoDemografico)
          ? values[field.IdCampoDemografico]
          : this.getFieldDefaultValue(field);

      requiredControls.add(controlName);

      if (this.employeeForm.contains(controlName)) {
        const control = this.employeeForm.get(controlName);
        control?.setValidators(field.requerido ? [Validators.required] : []);
        control?.setValue(this.normalizeFieldValueForControl(field, controlValue), { emitEvent: false });
        control?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.employeeForm.addControl(controlName, this.buildDynamicControl(field, controlValue));
      }
    });

    Object.keys(this.employeeForm.controls)
      .filter((controlName) => controlName.startsWith('demo_') && !requiredControls.has(controlName))
      .forEach((controlName) => this.employeeForm.removeControl(controlName));
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = [
      ...this.baseColumns,
      ...this.demographicFields.map((field) => this.getFieldColumnKey(field)),
      'Acciones',
    ];
  }

  private async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.dataSourceOrganizations = this.extractCollection(response)
        .map((item) => this.normalizeOrganization(item))
        .filter((organization) => organization.Id > 0);

      if (!this.selectedOrganizationId && this.dataSourceOrganizations.length > 0) {
        await this.onOrganizationChange(this.dataSourceOrganizations[0].Id);
      }
    } catch (error) {
      console.error('Error al obtener organizaciones de desempeño:', error);
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  private async loadFieldOptions(field: DesDemographicField): Promise<DesDemographicOption[]> {
    if (field.TipoDato !== 'LISTA') {
      return [];
    }

    const response = await this.organizacionService.getDesempenoCampoDemograficoOpciones(field.IdCampoDemografico);

    return this.extractCollection(response)
      .map((item) => this.normalizeOption(item))
      .filter((option) => option.activo);
  }

  private async loadDemographicFields(): Promise<void> {
    if (!this.selectedOrganizationId) {
      this.demographicFields = [];
      this.syncDynamicControls();
      this.updateDisplayedColumns();
      return;
    }

    this.isLoadingFields = true;

    try {
      const response = await this.organizacionService.getDesempenoCamposDemograficos({
        idOrganizacion: this.selectedOrganizationId,
      });

      const fields = this.extractCollection(response)
        .map((item) => this.normalizeField(item))
        .filter((field) => field.IdCampoDemografico > 0 && field.activo);

      await Promise.all(
        fields.map(async (field) => {
          field.options = await this.loadFieldOptions(field);
        })
      );

      this.demographicFields = fields;
      this.syncDynamicControls();
      this.updateDisplayedColumns();
    } catch (error) {
      console.error('Error al obtener campos demográficos de desempeño:', error);
      this.demographicFields = [];
      this.syncDynamicControls();
      this.updateDisplayedColumns();
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isLoadingFields = false;
    }
  }

  private getDemographicValueCandidates(payload: any): any[] {
    const candidates = [
      payload?.valoresDemograficos,
      payload?.ValoresDemograficos,
      payload?.camposDemograficos,
      payload?.CamposDemograficos,
      payload?.demograficos,
      payload?.Demograficos,
      payload?.empleado?.valoresDemograficos,
      payload?.empleado?.camposDemograficos,
      payload?.employee?.valoresDemograficos,
      payload?.employee?.camposDemograficos,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  private resolveFieldFromDynamicEntry(item: any): DesDemographicField | undefined {
    const fieldId = this.toPositiveInteger(item?.IdCampoDemografico ?? item?.idCampoDemografico);
    if (fieldId) {
      return this.demographicFields.find((field) => field.IdCampoDemografico === fieldId);
    }

    const possibleName = this.normalizeLookupKey(
      item?.Nombre ?? item?.nombre ?? item?.NombreCampo ?? item?.nombreCampo ?? item?.Codigo ?? item?.codigo
    );

    return this.demographicFields.find(
      (field) =>
        this.normalizeLookupKey(field.Nombre) === possibleName ||
        this.normalizeLookupKey(field.Codigo) === possibleName
    );
  }

  private getOptionLabelById(field: DesDemographicField, optionId: any): string | null {
    const normalizedOptionId = this.toPositiveInteger(optionId);

    if (!normalizedOptionId) {
      return null;
    }

    const option = field.options.find((item) => item.IdCampoOpcion === normalizedOptionId);
    return option?.Valor ?? option?.Etiqueta ?? null;
  }

  private extractDynamicEntryValue(field: DesDemographicField, item: any): any {
    const explicitValue = item?.valor ?? item?.Valor ?? item?.valorTexto ?? item?.ValorTexto;
    if (explicitValue !== undefined && explicitValue !== null && explicitValue !== '') {
      return explicitValue;
    }

    if (item?.ValorNumero !== undefined && item?.ValorNumero !== null) {
      return item.ValorNumero;
    }

    if (item?.valorNumero !== undefined && item?.valorNumero !== null) {
      return item.valorNumero;
    }

    if (item?.ValorFecha) {
      return item.ValorFecha;
    }

    if (item?.valorFecha) {
      return item.valorFecha;
    }

    if (item?.ValorBooleano !== undefined && item?.ValorBooleano !== null) {
      return item.ValorBooleano;
    }

    if (item?.valorBooleano !== undefined && item?.valorBooleano !== null) {
      return item.valorBooleano;
    }

    if (item?.EtiquetaOpcion || item?.etiquetaOpcion || item?.NombreOpcion || item?.nombreOpcion) {
      return item?.EtiquetaOpcion ?? item?.etiquetaOpcion ?? item?.NombreOpcion ?? item?.nombreOpcion;
    }

    const optionLabel = this.getOptionLabelById(field, item?.IdCampoOpcion ?? item?.idCampoOpcion);
    if (optionLabel) {
      return optionLabel;
    }

    return null;
  }

  private extractDemographicValueMap(payload: any): Record<number, any> {
    const demographicValues: Record<number, any> = {};

    this.getDemographicValueCandidates(payload).forEach((item) => {
      const field = this.resolveFieldFromDynamicEntry(item);

      if (!field) {
        return;
      }

      const rawValue = this.extractDynamicEntryValue(field, item);
      const normalizedValue = this.normalizeFieldValueForControl(field, rawValue);

      if (field.TipoDato === 'LISTA' && field.permiteMultiples && Array.isArray(normalizedValue)) {
        demographicValues[field.IdCampoDemografico] = normalizedValue;
        return;
      }

      if (normalizedValue !== '' && normalizedValue !== null && normalizedValue !== undefined) {
        demographicValues[field.IdCampoDemografico] = normalizedValue;
      }
    });

    this.demographicFields.forEach((field) => {
      const byName = payload?.[field.Nombre];
      const byCode = payload?.[field.Codigo];

      if (byName !== undefined) {
        demographicValues[field.IdCampoDemografico] = this.normalizeFieldValueForControl(field, byName);
      } else if (byCode !== undefined) {
        demographicValues[field.IdCampoDemografico] = this.normalizeFieldValueForControl(field, byCode);
      }
    });

    return demographicValues;
  }

  private async loadEmployeeDetail(id: number): Promise<DesEmployee> {
    const response = await this.organizacionService.getDesempenoEmployeeById(id);
    const payload = this.extractObject(response);
    const employeeData = this.extractEmployeeObject(payload);
    const dynamicValues = this.extractDemographicValueMap(payload);

    return this.normalizeEmployee(employeeData, dynamicValues);
  }

  private async loadEmployees(): Promise<void> {
    if (!this.selectedOrganizationId) {
      this.dataSourceEmployees = [];
      return;
    }

    this.isLoadingEmployees = true;

    try {
      const params: Record<string, any> = {
        idOrganizacion: this.selectedOrganizationId,
      };

      const search = String(this.searchTerm ?? '').trim();
      if (search) {
        params['buscar'] = search;
      }

      const response = await this.organizacionService.getDesempenoEmployees(params);
      const employees = this.extractCollection(response).map((item) =>
        this.normalizeEmployee(item, this.extractDemographicValueMap(item))
      );

      if (employees.length === 0) {
        this.dataSourceEmployees = [];
        return;
      }

      this.dataSourceEmployees = employees;
    } catch (error) {
      console.error('Error al obtener empleados de desempeño:', error);
      this.dataSourceEmployees = [];
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isLoadingEmployees = false;
    }
  }

  private patchFormWithEmployee(employee: DesEmployee): void {
    this.editingEmployeeId = employee.IdEmpleado;
    this.syncDynamicControls(employee.demographicValues);
    this.employeeForm.patchValue(
      {
        Nombres: employee.Nombres,
        Apellidos: employee.Apellidos,
        Cargo: employee.Cargo ?? '',
        Telefono: employee.Telefono ?? '',
        Email: employee.Email ?? '',
        FechaIngreso: employee.FechaIngreso ?? '',
        IdEmpleadoJefe: employee.IdEmpleadosJefe,
      },
      { emitEvent: false }
    );
    this.employeeForm.markAsPristine();
  }

  private hasMeaningfulValue(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  }

  private splitMultipleValues(value: string): string[] {
    return value
      .split(/[|;,]/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private normalizeOutgoingDemographicValue(field: DesDemographicField, value: any): any {
    if (!this.hasMeaningfulValue(value)) {
      return null;
    }

    if (field.TipoDato === 'LISTA' && field.permiteMultiples) {
      const multipleValues = Array.isArray(value) ? value : this.splitMultipleValues(String(value));
      return multipleValues.join(' | ');
    }

    if (field.TipoDato === 'NUMERO') {
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : null;
    }

    if (field.TipoDato === 'BOOLEANO') {
      return this.normalizeNullableBoolean(value);
    }

    if (field.TipoDato === 'FECHA') {
      return this.normalizeDateText(value);
    }

    return String(value ?? '').trim();
  }

  private buildFormDemographicEntries(): DesEmployeeDemographicValue[] {
    const rawValue = this.employeeForm.getRawValue();

    return this.demographicFields
      .map((field) => {
        const normalizedValue = this.normalizeOutgoingDemographicValue(
          field,
          rawValue[this.getFieldControlName(field)]
        );

        if (!this.hasMeaningfulValue(normalizedValue)) {
          return null;
        }

        return {
          idCampoDemografico: field.IdCampoDemografico,
          valor: normalizedValue,
        };
      })
      .filter((item): item is DesEmployeeDemographicValue => item !== null);
  }

  private buildStaticCreatePayload(): any {
    const rawValue = this.employeeForm.getRawValue();
    const camposDemograficos = this.buildFormDemographicEntries();
    const managerIds = this.getSelectedManagerIds(rawValue.IdEmpleadoJefe);

    return {
      idOrganizacion: this.selectedOrganizationId,
      codigo: this.defaultEmployeeCode,
      nombres: String(rawValue.Nombres ?? '').trim(),
      apellidos: String(rawValue.Apellidos ?? '').trim(),
      cargo: this.toOptionalText(rawValue.Cargo),
      telefono: this.toOptionalText(rawValue.Telefono),
      email: String(rawValue.Email ?? '').trim(),
      fechaIngreso: this.normalizeDateText(rawValue.FechaIngreso),
      idEmpleadoJefe: managerIds,
      ['camposDemograficos']: camposDemograficos,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private buildStaticUpdatePayload(): any {
    const rawValue = this.employeeForm.getRawValue();
    const camposDemograficos = this.buildFormDemographicEntries();
    const managerIds = this.getSelectedManagerIds(rawValue.IdEmpleadoJefe);

    return {
      idEmpleado: this.editingEmployeeId,
      codigo: this.defaultEmployeeCode,
      nombres: String(rawValue.Nombres ?? '').trim(),
      apellidos: String(rawValue.Apellidos ?? '').trim(),
      cargo: this.toOptionalText(rawValue.Cargo),
      telefono: this.toOptionalText(rawValue.Telefono),
      email: String(rawValue.Email ?? '').trim(),
      fechaIngreso: this.normalizeDateText(rawValue.FechaIngreso),
      idEmpleadoJefe: managerIds,
      ['camposDemograficos']: camposDemograficos,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private getSelectedManagerIds(value: any): number[] {
    return this.toPositiveIntegerList(value)
      .filter((managerId) => managerId !== this.editingEmployeeId);
  }

  private buildFieldCode(baseLabel: string, usedCodes: Set<string>): string {
    const baseCode = this.normalizeLookupKey(baseLabel).slice(0, 20) || 'CAMPO';
    let nextCode = baseCode;
    let suffix = 1;

    while (usedCodes.has(nextCode)) {
      const suffixText = `${suffix}`;
      nextCode = `${baseCode.slice(0, Math.max(1, 20 - suffixText.length))}${suffixText}`;
      suffix += 1;
    }

    usedCodes.add(nextCode);
    return nextCode;
  }

  private resolveStaticHeaderKey(header: string): string | null {
    const normalizedHeader = this.normalizeLookupKey(header);

    for (const [propertyKey, aliases] of Object.entries(this.excelStaticHeaderAliases)) {
      if (aliases.some((alias) => this.normalizeLookupKey(alias) === normalizedHeader)) {
        return propertyKey;
      }
    }

    return null;
  }

  private normalizeExcelDateValue(value: any): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (parsed) {
        return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
      }
    }

    return this.normalizeDateText(value);
  }

  private mapExcelRowToEmployee(
    row: Record<string, any>,
    headers: string[],
    rowNumber: number
  ): ParsedExcelEmployee {
    const parsedEmployee: ParsedExcelEmployee = {
      rowNumber,
      codigo: '',
      nombres: '',
      apellidos: '',
      cargo: null,
      telefono: null,
      email: '',
      fechaIngreso: null,
      idEmpleadoJefe: [],
      jefeReferencia: null,
      demographicValues: {},
    };

    headers.forEach((header) => {
      const value = row[header];
      const staticKey = this.resolveStaticHeaderKey(header);

      if (!staticKey) {
        parsedEmployee.demographicValues[header] = value;
        return;
      }

      switch (staticKey) {
        case 'codigo':
          parsedEmployee.codigo = String(value ?? '').trim();
          break;
        case 'nombres':
          parsedEmployee.nombres = String(value ?? '').trim();
          break;
        case 'apellidos':
          parsedEmployee.apellidos = String(value ?? '').trim();
          break;
        case 'cargo':
          parsedEmployee.cargo = this.toOptionalText(value);
          break;
        case 'telefono':
          parsedEmployee.telefono = this.toOptionalText(value);
          break;
        case 'email':
          parsedEmployee.email = String(value ?? '').trim();
          break;
        case 'fechaIngreso':
          parsedEmployee.fechaIngreso = this.normalizeExcelDateValue(value);
          break;
        case 'idEmpleadoJefe':
          parsedEmployee.idEmpleadoJefe = this.toPositiveIntegerList(value);
          break;
        case 'jefeReferencia':
          parsedEmployee.jefeReferencia = this.toOptionalText(value);
          break;
        default:
          break;
      }
    });

    return parsedEmployee;
  }

  private parseExcelWorkbook(workbook: XLSX.WorkBook): ParsedExcelEmployee[] {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

    if (rawRows.length === 0) {
      throw new Error('El archivo Excel no contiene filas válidas.');
    }

    const headers = Object.keys(rawRows[0] ?? {});
    if (headers.length === 0) {
      throw new Error('El archivo Excel no contiene encabezados válidos.');
    }

    const errors: string[] = [];
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    const parsedRows = rawRows.map((row, index) =>
      this.mapExcelRowToEmployee(row, headers, index + 2)
    );

    parsedRows.forEach((parsedEmployee) => {
      if (!parsedEmployee.nombres) {
        errors.push(`Fila ${parsedEmployee.rowNumber}: los nombres son obligatorios.`);
      }

      if (!parsedEmployee.apellidos) {
        errors.push(`Fila ${parsedEmployee.rowNumber}: los apellidos son obligatorios.`);
      }

      if (!parsedEmployee.email) {
        errors.push(`Fila ${parsedEmployee.rowNumber}: el correo es obligatorio.`);
      } else if (!emailRegex.test(parsedEmployee.email)) {
        errors.push(`Fila ${parsedEmployee.rowNumber}: el correo no tiene un formato válido.`);
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return parsedRows;
  }

  private async readWorkbook(file: File): Promise<XLSX.WorkBook> {
    const arrayBuffer = await file.arrayBuffer();
    return XLSX.read(arrayBuffer, { type: 'array' });
  }

  private async ensureDemographicFieldsForHeaders(headers: string[]): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    const cleanedHeaders = headers
      .map((header) => String(header ?? '').trim())
      .filter((header) => header.length > 0);

    if (cleanedHeaders.length === 0) {
      return;
    }

    const existingFieldsMap = new Map<string, DesDemographicField>();
    const usedCodes = new Set<string>();

    this.demographicFields.forEach((field) => {
      existingFieldsMap.set(this.normalizeLookupKey(field.Nombre), field);
      existingFieldsMap.set(this.normalizeLookupKey(field.Codigo), field);
      usedCodes.add(this.normalizeLookupKey(field.Codigo));
    });

    let createdAnyField = false;

    for (const header of cleanedHeaders) {
      const lookupKey = this.normalizeLookupKey(header);

      if (existingFieldsMap.has(lookupKey)) {
        continue;
      }

      const payload = {
        idOrganizacion: this.selectedOrganizationId,
        nombre: header,
        clave: this.buildFieldCode(header, usedCodes),
        tipoDato: 'TEXTO',
        requerido: false,
        activo: true,
        permiteMultiples: false,
        usuarioAccion: this.getUsuarioAccion(),
      };

      await this.organizacionService.saveDesempenoCampoDemografico(payload);
      createdAnyField = true;
    }

    if (createdAnyField) {
      await this.loadDemographicFields();
    }
  }

  private async ensureListFieldOptions(records: ParsedExcelEmployee[]): Promise<void> {
    for (const field of this.demographicFields.filter((item) => item.TipoDato === 'LISTA')) {
      const seenValues = new Set(
        field.options.map((option) => this.normalizeLookupKey(option.Valor || option.Etiqueta))
      );
      let nextOrder =
        field.options.length > 0
          ? Math.max(...field.options.map((option) => option.Orden || 1)) + 1
          : 1;
      let createdAnyOption = false;

      records.forEach((record) => {
        const rawValue = record.demographicValues[field.Nombre] ?? record.demographicValues[field.Codigo];
        const values = field.permiteMultiples
          ? this.splitMultipleValues(String(rawValue ?? ''))
          : [String(rawValue ?? '').trim()];

        values
          .map((value) => value.trim())
          .filter((value) => value.length > 0)
          .forEach((value) => {
            const normalizedValue = this.normalizeLookupKey(value);
            if (!normalizedValue || seenValues.has(normalizedValue)) {
              return;
            }

            seenValues.add(normalizedValue);
            field.options.push({
              IdCampoOpcion: 0,
              Valor: value,
              Codigo: normalizedValue.slice(0, 20),
              Etiqueta: value,
              Orden: nextOrder,
              activo: true,
            });
            nextOrder += 1;
            createdAnyOption = true;
          });
      });

      if (!createdAnyOption) {
        continue;
      }

      for (const option of field.options.filter((item) => item.IdCampoOpcion === 0)) {
        const response = await this.organizacionService.saveDesempenoCampoDemograficoOpcion(
          field.IdCampoDemografico,
          {
            codigo: option.Codigo,
            valor: option.Valor,
            etiqueta: option.Etiqueta,
            orden: option.Orden,
            activo: true,
            usuarioAccion: this.getUsuarioAccion(),
          }
        );

        const savedOption = this.normalizeOption(this.extractObject(response));
        option.IdCampoOpcion = savedOption.IdCampoOpcion;
      }
    }
  }

  private buildExcelCreatePayload(record: ParsedExcelEmployee): any {
    const camposDemograficos = this.buildExcelDemographicEntries(record);

    return {
      idOrganizacion: this.selectedOrganizationId,
      codigo: this.defaultEmployeeCode,
      nombres: record.nombres,
      apellidos: record.apellidos,
      cargo: record.cargo,
      telefono: record.telefono,
      email: record.email,
      fechaIngreso: record.fechaIngreso,
      idEmpleadoJefe: [],
      ['camposDemograficos']: camposDemograficos,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private buildExcelUpdatePayload(
    employeeId: number,
    record: ParsedExcelEmployee,
    managerIds: number[]
  ): any {
    const camposDemograficos = this.buildExcelDemographicEntries(record);

    return {
      idEmpleado: employeeId,
      codigo: this.defaultEmployeeCode,
      nombres: record.nombres,
      apellidos: record.apellidos,
      cargo: record.cargo,
      telefono: record.telefono,
      email: record.email,
      fechaIngreso: record.fechaIngreso,
      idEmpleadoJefe: managerIds,
      ['camposDemograficos']: camposDemograficos,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private resolveFieldFromHeader(header: string): DesDemographicField | undefined {
    const lookupKey = this.normalizeLookupKey(header);

    return this.demographicFields.find(
      (field) =>
        this.normalizeLookupKey(field.Nombre) === lookupKey ||
        this.normalizeLookupKey(field.Codigo) === lookupKey
    );
  }

  private buildExcelDemographicEntries(record: ParsedExcelEmployee): DesEmployeeDemographicValue[] {
    return Object.entries(record.demographicValues)
      .map(([header, rawValue]) => {
        const field = this.resolveFieldFromHeader(header);

        if (!field) {
          return null;
        }

        const normalizedValue = this.normalizeOutgoingDemographicValue(
          field,
          field.permiteMultiples ? this.splitMultipleValues(String(rawValue ?? '')) : rawValue
        );

        if (!this.hasMeaningfulValue(normalizedValue)) {
          return null;
        }

        return {
          idCampoDemografico: field.IdCampoDemografico,
          valor: normalizedValue,
        };
      })
      .filter((item): item is DesEmployeeDemographicValue => item !== null);
  }

  private resolveManagerIds(record: ParsedExcelEmployee, employees: DesEmployee[]): number[] {
    const resolvedIds = new Set<number>(record.idEmpleadoJefe);

    const managerReference = this.toOptionalText(record.jefeReferencia);
    if (!managerReference) {
      return Array.from(resolvedIds);
    }

    this.splitMultipleValues(managerReference).forEach((reference) => {
      const lookupKey = this.normalizeLookupKey(reference);
      const manager = employees.find(
        (employee) =>
          this.normalizeLookupKey(employee.CodigoEmpleado) === lookupKey ||
          this.normalizeLookupKey(employee.Email) === lookupKey ||
          this.normalizeLookupKey(employee.IdEmpleado) === lookupKey
      );

      if (!manager) {
        throw new Error(`No se encontró el jefe '${reference}' en la organización seleccionada.`);
      }

      resolvedIds.add(manager.IdEmpleado);
    });

    return Array.from(resolvedIds);
  }

  private async importEmployeesFromExcel(records: ParsedExcelEmployee[]): Promise<ExcelImportResult> {
    const errors: string[] = [];
    const importedEmployees: Array<{
      employeeId: number;
      record: ParsedExcelEmployee;
    }> = [];
    const knownEmployees: DesEmployee[] = [...this.dataSourceEmployees];

    for (const record of records) {
      try {
        const response = await this.organizacionService.saveDesempenoEmployee(
          this.buildExcelCreatePayload(record)
        );
        const employeeId = this.extractEmployeeId(response);

        if (!employeeId) {
          throw new Error('No fue posible obtener el ID del empleado creado.');
        }

        importedEmployees.push({ employeeId, record });
        knownEmployees.push({
          IdEmpleado: employeeId,
          IdOrganizacion: this.selectedOrganizationId,
          CodigoEmpleado: record.codigo,
          Nombres: record.nombres,
          Apellidos: record.apellidos,
          Cargo: record.cargo,
          Telefono: record.telefono,
          Email: record.email,
          FechaIngreso: record.fechaIngreso,
          IdEmpleadoJefe: null,
          IdEmpleadosJefe: [],
          activo: true,
          demographicValues: {},
        });
      } catch (error) {
        errors.push(`Fila ${record.rowNumber}: ${this.getErrorMessage(error)}`);
      }
    }

    for (const imported of importedEmployees) {
      try {
        const managerIds = this.resolveManagerIds(
          imported.record,
          knownEmployees.filter((employee) => employee.IdEmpleado !== imported.employeeId)
        );

        await this.organizacionService.updateDesempenoEmployee(
          imported.employeeId,
          this.buildExcelUpdatePayload(imported.employeeId, imported.record, managerIds)
        );
      } catch (error) {
        errors.push(`Fila ${imported.record.rowNumber}: ${this.getErrorMessage(error)}`);
      }
    }

    return {
      createdCount: importedEmployees.length,
      errors,
    };
  }

  async onOrganizationChange(selectedId: number | null): Promise<void> {
    this.selectedOrganizationId = this.toPositiveInteger(selectedId);
    this.editingEmployeeId = null;
    this.dataSourceEmployees = [];
    this.searchTerm = '';
    this.closeEmployeeDialog();

    if (!this.selectedOrganizationId) {
      this.demographicFields = [];
      this.syncDynamicControls();
      this.updateDisplayedColumns();
      this.resetEmployeeForm();
      return;
    }

    await this.loadDemographicFields();
    await this.loadEmployees();
    this.resetEmployeeForm();
  }

  async refreshEmployees(): Promise<void> {
    await this.loadEmployees();
  }

  async startEdit(employee: DesEmployee): Promise<void> {
    if (!this.hasSelectedOrganization) {
      return;
    }

    try {
      const detailedEmployee = await this.loadEmployeeDetail(employee.IdEmpleado);
      this.patchFormWithEmployee({
        ...employee,
        ...detailedEmployee,
        IdEmpleadoJefe: detailedEmployee.IdEmpleadoJefe ?? employee.IdEmpleadoJefe,
        IdEmpleadosJefe: detailedEmployee.IdEmpleadosJefe.length > 0
          ? detailedEmployee.IdEmpleadosJefe
          : employee.IdEmpleadosJefe,
        demographicValues: {
          ...employee.demographicValues,
          ...detailedEmployee.demographicValues,
        },
      });
    } catch (error) {
      console.warn('No se pudo cargar el detalle del empleado, se usará la fila actual.', error);
      this.patchFormWithEmployee(employee);
    }

    this.openEmployeeDialog();
  }

  resetEmployeeForm(): void {
    this.editingEmployeeId = null;
    this.employeeForm.reset({
      Nombres: '',
      Apellidos: '',
      Cargo: '',
      Telefono: '',
      Email: '',
      FechaIngreso: '',
      IdEmpleadoJefe: [],
    });
    this.syncDynamicControls();
    this.employeeForm.markAsPristine();
  }

  async onSubmit(): Promise<void> {
    if (!this.selectedOrganizationId) {
      Swal.fire('Organización requerida', 'Selecciona una organización para continuar.', 'warning');
      return;
    }

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      Swal.fire('Formulario inválido', 'Revisa los campos obligatorios antes de guardar.', 'warning');
      return;
    }

    this.isSaving = true;

    try {
      const wasEditing = this.isEditing;
      let employeeId = this.editingEmployeeId;

      if (wasEditing && employeeId) {
        await this.organizacionService.updateDesempenoEmployee(employeeId, this.buildStaticUpdatePayload());
      } else {
        const response = await this.organizacionService.saveDesempenoEmployee(this.buildStaticCreatePayload());
        employeeId = this.extractEmployeeId(response);

        if (!employeeId) {
          throw new Error('No fue posible obtener el ID del empleado guardado.');
        }
      }

      await this.loadEmployees();
      this.resetEmployeeForm();
      this.employeeDialogRef?.close(true);

      Swal.fire(
        'Realizado',
        wasEditing ? 'El empleado se actualizó correctamente.' : 'El empleado se creó correctamente.',
        'success'
      );
    } catch (error) {
      console.error('Error al guardar empleado de desempeño:', error);
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isSaving = false;
    }
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  getManagerName(employee: DesEmployee): string {
    const managerIds = employee.IdEmpleadosJefe.length > 0
      ? employee.IdEmpleadosJefe
      : this.toPositiveIntegerList(employee.IdEmpleadoJefe);

    if (managerIds.length === 0) {
      return '-';
    }

    return managerIds
      .map((managerId) => {
        const manager = this.dataSourceEmployees.find((item) => item.IdEmpleado === managerId);
        return manager ? `${manager.Nombres} ${manager.Apellidos}`.trim() : `${managerId}`;
      })
      .join(', ');
  }

  getEmployeeDemographicValue(employee: DesEmployee, field: DesDemographicField): string {
    const value = employee.demographicValues[field.IdCampoDemografico];

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  getFieldOptions(field: DesDemographicField): DesDemographicOption[] {
    return field.options.filter((option) => option.activo);
  }

  trackByFieldId(_: number, field: DesDemographicField): number {
    return field.IdCampoDemografico;
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    if (!this.selectedOrganizationId) {
      Swal.fire('Organización requerida', 'Selecciona una organización antes de importar.', 'warning');
      input.value = '';
      return;
    }

    this.isUploadingExcel = true;

    try {
      const workbook = await this.readWorkbook(file);
      const records = this.parseExcelWorkbook(workbook);
      const demographicHeaders = Array.from(
        new Set(
          records.flatMap((record) =>
            Object.keys(record.demographicValues)
              .map((header) => String(header ?? '').trim())
              .filter((header) => header.length > 0)
          )
        )
      );

      await this.ensureDemographicFieldsForHeaders(demographicHeaders);
      await this.ensureListFieldOptions(records);

      const importResult = await this.importEmployeesFromExcel(records);

      await this.loadDemographicFields();
      await this.loadEmployees();

      if (importResult.errors.length > 0) {
        await Swal.fire({
          title: 'Importación finalizada con observaciones',
          html:
            `Se procesaron ${importResult.createdCount} empleados.<br><br>` +
            `<pre style="text-align:left;white-space:pre-wrap;max-height:45vh;overflow:auto">${importResult.errors.join('\n')}</pre>`,
          icon: 'warning',
          width: 720,
        });
      } else {
        await Swal.fire(
          'Importación completada',
          `Se cargaron ${importResult.createdCount} empleados correctamente.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error al importar empleados desde Excel:', error);
      await Swal.fire({
        title: 'Error en la importación',
        html: `<pre style="text-align:left;white-space:pre-wrap">${this.getErrorMessage(error)}</pre>`,
        icon: 'error',
        width: 720,
      });
    } finally {
      this.isUploadingExcel = false;
      input.value = '';
    }
  }
}
