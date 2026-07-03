import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface DesOrganizationOption {
  Id: number;
  Nombre: string;
}

interface DesScaleListItem {
  IdEscala: number;
  IdOrganizacion: number | null;
  Nombre: string;
  TipoEscala: string;
  Activo: boolean;
  FechaCreacion: string | null;
  TotalNiveles: number | null;
}

interface DesScaleDetailItem {
  IdEscalaDetalle: number | null;
  IdEscala: number | null;
  Descripcion: string;
  Valor: number | null;
  Orden: number | null;
}

@Component({
  selector: 'app-des-escalas',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './des-escalas.component.html',
  styles: [`
    .scale-row-clickable {
      cursor: pointer;
    }

    .scale-row-selected td {
      background: rgba(59, 130, 246, 0.08);
    }

    .scale-empty {
      padding: 1.5rem;
      text-align: center;
      color: #64748b;
    }

    .scale-detail-table th,
    .scale-detail-table td {
      vertical-align: middle;
    }

    .scale-detail-table .mat-mdc-form-field {
      width: 100%;
    }

    .scale-panel-note {
      color: #64748b;
      font-size: 0.9rem;
    }

    .scale-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  `],
})
export class DesEscalasComponent implements OnInit {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.BIBLIOTECA.LIST.ESCALAS';
  readonly scaleTypeOptions = [
    { value: 'GENERAL', labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.TYPES.GENERAL' },
    { value: 'COMPETENCIAS', labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.TYPES.COMPETENCIAS' },
    { value: 'VALORES', labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.TYPES.VALORES' },
    { value: 'OBJETIVOS', labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.TYPES.OBJETIVOS' },
  ];
  readonly activeFilterOptions = [
    { value: true, labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.FILTER_ACTIVE' },
    { value: false, labelKey: 'DESEMPENO_MENUITEMS.ESCALAS.FILTER_INACTIVE' },
  ];
  public escalaForm: FormGroup;
  public dataSourceOrganizations: DesOrganizationOption[] = [];
  public dataSourceScales: DesScaleListItem[] = [];
  public displayedColumns: string[] = ['Nombre', 'TipoEscala', 'Activo', 'TotalNiveles', 'Acciones'];
  public selectedOrganizationId: number | null = null;
  public selectedActiveFilter = true;
  public selectedScaleId: number | null = null;
  public isLoadingOrganizations = false;
  public isLoadingScales = false;
  public isLoadingScaleDetail = false;
  public isSavingScale = false;

  constructor(
    private fb: FormBuilder,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.escalaForm = this.createForm();
  }

  ngOnInit(): void {
    this.resetForm();
    this.loadOrganizations();
  }

  get breadcrumbItems(): string[] {
    return [
      this.t('DESEMPENO_MENUITEMS.ESCALAS.BREADCRUMB_HOME'),
      this.t(this.breadcrumbTitleKey),
    ];
  }

  get hasSelectedOrganization(): boolean {
    return !!this.selectedOrganizationId;
  }

  get isEditing(): boolean {
    return this.selectedScaleId !== null;
  }

  get detailArray(): FormArray {
    return this.escalaForm.get('Detalle') as FormArray;
  }

  get detailControls(): FormGroup[] {
    return this.detailArray.controls as FormGroup[];
  }

  private createForm(): FormGroup {
    return this.fb.group({
      Nombre: ['', Validators.required],
      TipoEscala: ['GENERAL', Validators.required],
      Activo: [true],
      Detalle: this.fb.array([]),
    });
  }

  private createDetailGroup(item?: Partial<DesScaleDetailItem>): FormGroup {
    return this.fb.group({
      IdEscalaDetalle: [item?.IdEscalaDetalle ?? null],
      IdEscala: [item?.IdEscala ?? null],
      Orden: [
        item?.Orden ?? this.getNextDetailOrder(),
        [Validators.required],
      ],
      Valor: [
        item?.Valor ?? this.getNextDetailOrder(),
        [Validators.required],
      ],
      Descripcion: [item?.Descripcion ?? '', Validators.required],
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

  private extractScaleDetailCollection(payload: any): any[] {
    if (Array.isArray(payload?.detalle)) {
      return payload.detalle;
    }

    if (Array.isArray(payload?.Detalle)) {
      return payload.Detalle;
    }

    return [];
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

  private getErrorMessage(error: any): string {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.UNEXPECTED_ERROR')
    );
  }

  private getUsuarioAccion(): string {
    return this.authService.currentUserValue?.username || 'system';
  }

  private t(key: string, params?: Record<string, any>): string {
    return this.translate.instant(key, params);
  }

  private normalizeScaleType(value: any): string {
    const normalizedType = String(value ?? '').trim().toUpperCase();
    const validTypes = this.scaleTypeOptions.map((item) => item.value);
    return validTypes.includes(normalizedType) ? normalizedType : 'GENERAL';
  }

  private normalizeOrganization(item: any): DesOrganizationOption {
    return {
      Id: Number(item?.Id ?? item?.id ?? item?.IdOrganizacion ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private normalizeScale(item: any): DesScaleListItem {
    const inlineDetailCount = Array.isArray(item?.Detalle)
      ? item.Detalle.length
      : Array.isArray(item?.detalle)
        ? item.detalle.length
        : null;

    return {
      IdEscala: Number(item?.IdEscala ?? item?.idEscala ?? item?.Id ?? item?.id ?? 0),
      IdOrganizacion: this.toPositiveInteger(item?.IdOrganizacion ?? item?.idOrganizacion),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
      TipoEscala: this.normalizeScaleType(item?.TipoEscala ?? item?.tipoEscala),
      Activo: this.normalizeBoolean(item?.Activo ?? item?.activo ?? item?.Estado ?? item?.estado),
      FechaCreacion: item?.FechaCreacion ?? item?.fechaCreacion ?? null,
      TotalNiveles:
        this.toPositiveInteger(
          item?.TotalNiveles ??
          item?.totalNiveles ??
          item?.CantidadNiveles ??
          item?.cantidadNiveles ??
          item?.TotalDetalle ??
          item?.totalDetalle
        ) ?? inlineDetailCount,
    };
  }

  private normalizeScaleDetail(item: any): DesScaleDetailItem {
    return {
      IdEscalaDetalle: this.toPositiveInteger(item?.IdEscalaDetalle ?? item?.idEscalaDetalle),
      IdEscala: this.toPositiveInteger(item?.IdEscala ?? item?.idEscala),
      Descripcion: String(item?.Descripcion ?? item?.descripcion ?? '').trim(),
      Valor: item?.Valor === null || item?.valor === null
        ? null
        : Number(item?.Valor ?? item?.valor ?? 0),
      Orden: item?.Orden === null || item?.orden === null
        ? null
        : Number(item?.Orden ?? item?.orden ?? 0),
    };
  }

  private patchFormWithScale(scale: DesScaleListItem): void {
    this.escalaForm.patchValue(
      {
        Nombre: scale.Nombre,
        TipoEscala: scale.TipoEscala,
        Activo: scale.Activo,
      },
      { emitEvent: false }
    );
    this.escalaForm.get('Activo')?.disable({ emitEvent: false });
  }

  private setDetailRows(items: DesScaleDetailItem[]): void {
    while (this.detailArray.length > 0) {
      this.detailArray.removeAt(0);
    }

    items.forEach((item) => this.detailArray.push(this.createDetailGroup(item)));
  }

  private getNextDetailOrder(): number {
    const values = this.detailArray.controls
      .map((control) => Number(control.get('Orden')?.value ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);

    return values.length > 0 ? Math.max(...values) + 1 : 1;
  }

  private buildCreatePayload(): any {
    const formValue = this.escalaForm.getRawValue();
    return {
      idOrganizacion: this.selectedOrganizationId,
      nombre: String(formValue.Nombre ?? '').trim(),
      tipoEscala: this.normalizeScaleType(formValue.TipoEscala),
      activo: !!formValue.Activo,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private getDetailDraftRows(): DesScaleDetailItem[] {
    return this.detailArray.controls.map((control) => ({
      IdEscalaDetalle: this.toPositiveInteger(control.get('IdEscalaDetalle')?.value),
      IdEscala: this.toPositiveInteger(control.get('IdEscala')?.value),
      Orden: control.get('Orden')?.value === null || control.get('Orden')?.value === ''
        ? null
        : Number(control.get('Orden')?.value),
      Valor: control.get('Valor')?.value === null || control.get('Valor')?.value === ''
        ? null
        : Number(control.get('Valor')?.value),
      Descripcion: String(control.get('Descripcion')?.value ?? '').trim(),
    }));
  }

  private buildUpdatePayload(): any {
    const detail = this.detailArray.controls.map((control) => ({
      valor: Number(control.get('Valor')?.value),
      descripcion: String(control.get('Descripcion')?.value ?? '').trim(),
      orden: Number(control.get('Orden')?.value),
    }));

    return {
      detalle: detail,
      nombre: String(this.escalaForm.get('Nombre')?.value ?? '').trim(),
      tipoEscala: this.normalizeScaleType(this.escalaForm.get('TipoEscala')?.value),
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private resolveScaleId(response: any): number | null {
    const payload = this.extractObject(response);
    const candidates = [
      payload?.idEscala,
      payload?.IdEscala,
      payload?.escala?.idEscala,
      payload?.escala?.IdEscala,
      payload?.scale?.idEscala,
      payload?.scale?.IdEscala,
    ];

    for (const candidate of candidates) {
      const value = this.toPositiveInteger(candidate);

      if (value) {
        return value;
      }
    }

    return null;
  }

  private findScaleIdInList(payload: any): number | null {
    const matches = this.dataSourceScales
      .filter((item) =>
        item.IdOrganizacion === this.selectedOrganizationId &&
        item.Nombre.trim().toLowerCase() === String(payload.nombre ?? '').trim().toLowerCase() &&
        item.TipoEscala === this.normalizeScaleType(payload.tipoEscala) &&
        item.Activo === !!payload.activo
      )
      .sort((first, second) => second.IdEscala - first.IdEscala);

    return matches[0]?.IdEscala ?? null;
  }

  private syncScaleInList(scale: DesScaleListItem, detailCount: number | null): void {
    const index = this.dataSourceScales.findIndex((item) => item.IdEscala === scale.IdEscala);

    if (index >= 0) {
      this.dataSourceScales[index] = {
        ...this.dataSourceScales[index],
        ...scale,
        TotalNiveles: detailCount ?? this.dataSourceScales[index].TotalNiveles,
      };
      this.dataSourceScales = [...this.dataSourceScales];
    }
  }

  private clearDuplicateErrors(): void {
    this.detailArray.controls.forEach((control) => {
      ['Orden', 'Valor'].forEach((field) => {
        const fieldControl = control.get(field);

        if (!fieldControl?.errors?.['duplicate']) {
          return;
        }

        const nextErrors = { ...(fieldControl.errors ?? {}) };
        delete nextErrors['duplicate'];
        fieldControl.setErrors(Object.keys(nextErrors).length > 0 ? nextErrors : null);
      });
    });
  }

  private addDuplicateError(control: AbstractControl | null): void {
    if (!control) {
      return;
    }

    control.setErrors({
      ...(control.errors ?? {}),
      duplicate: true,
    });
    control.markAsTouched();
  }

  private validateDetailBeforeSave(): boolean {
    this.clearDuplicateErrors();

    if (this.detailArray.length === 0) {
      return true;
    }

    this.detailArray.markAllAsTouched();

    if (this.detailArray.invalid) {
      Swal.fire({
        title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.DETAIL_INVALID_TITLE'),
        text: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.DETAIL_INVALID_REQUIRED'),
        icon: 'warning',
      });
      return false;
    }

    const valueMap = new Map<string, AbstractControl[]>();
    const orderMap = new Map<string, AbstractControl[]>();

    this.detailArray.controls.forEach((control) => {
      const valorKey = String(control.get('Valor')?.value ?? '').trim();
      const ordenKey = String(control.get('Orden')?.value ?? '').trim();

      if (!valueMap.has(valorKey)) {
        valueMap.set(valorKey, []);
      }
      valueMap.get(valorKey)?.push(control.get('Valor') as AbstractControl);

      if (!orderMap.has(ordenKey)) {
        orderMap.set(ordenKey, []);
      }
      orderMap.get(ordenKey)?.push(control.get('Orden') as AbstractControl);
    });

    let hasDuplicates = false;

    valueMap.forEach((controls) => {
      if (controls.length > 1) {
        hasDuplicates = true;
        controls.forEach((control) => this.addDuplicateError(control));
      }
    });

    orderMap.forEach((controls) => {
      if (controls.length > 1) {
        hasDuplicates = true;
        controls.forEach((control) => this.addDuplicateError(control));
      }
    });

    if (hasDuplicates) {
      Swal.fire({
        title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.DETAIL_INVALID_TITLE'),
        text: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.DETAIL_INVALID_DUPLICATE'),
        icon: 'warning',
      });
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.selectedScaleId = null;
    this.escalaForm.get('Activo')?.enable({ emitEvent: false });
    this.escalaForm.reset(
      {
        Nombre: '',
        TipoEscala: 'GENERAL',
        Activo: true,
      },
      { emitEvent: false }
    );
    this.setDetailRows([]);
    this.escalaForm.markAsPristine();
    this.escalaForm.markAsUntouched();
  }

  loadOrganizations(): void {
    this.isLoadingOrganizations = true;

    this.organizacionService.getDesempenoOrganizations()
      .then((response: any) => {
        this.dataSourceOrganizations = this.extractCollection(response)
          .map((item) => this.normalizeOrganization(item))
          .filter((item) => item.Id > 0 && item.Nombre.length > 0);

        if (this.dataSourceOrganizations.length > 0) {
          this.selectedOrganizationId = this.dataSourceOrganizations[0].Id;
          this.loadScales();
        }
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.LOAD_ORGS_ERROR_TITLE'),
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isLoadingOrganizations = false;
      });
  }

  loadScales(): void {
    if (!this.selectedOrganizationId) {
      this.dataSourceScales = [];
      this.resetForm();
      return;
    }

    this.isLoadingScales = true;
    const currentSelectedId = this.selectedScaleId;

    this.organizacionService.getDesempenoScales({
      idOrganizacion: this.selectedOrganizationId,
      activo: this.selectedActiveFilter,
    })
      .then((response: any) => {
        this.dataSourceScales = this.extractCollection(response)
          .map((item) => this.normalizeScale(item))
          .sort((first, second) => second.IdEscala - first.IdEscala);

        if (
          currentSelectedId &&
          !this.dataSourceScales.some((item) => item.IdEscala === currentSelectedId)
        ) {
          this.resetForm();
        }
      })
      .catch((error: any) => {
        console.error(error);
        this.dataSourceScales = [];
        Swal.fire({
          title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.LOAD_LIST_ERROR_TITLE'),
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isLoadingScales = false;
      });
  }

  startCreate(): void {
    this.resetForm();
  }

  onOrganizationChange(value: any): void {
    this.selectedOrganizationId = this.toPositiveInteger(value);
    this.resetForm();
    this.loadScales();
  }

  onActiveFilterChange(value: any): void {
    this.selectedActiveFilter = this.normalizeBoolean(value);
    this.resetForm();
    this.loadScales();
  }

  loadScale(id: number): void {
    this.isLoadingScaleDetail = true;

    this.organizacionService.getDesempenoScaleById(id)
      .then((response: any) => {
        const payload = this.extractObject(response);
        const scale = this.normalizeScale(payload?.escala ?? payload?.Escala ?? payload?.scale ?? payload);
        const detail = this.extractScaleDetailCollection(payload)
          .map((item) => this.normalizeScaleDetail(item))
          .sort((first, second) => (first.Orden ?? 0) - (second.Orden ?? 0));

        this.selectedScaleId = scale.IdEscala;
        this.patchFormWithScale(scale);
        this.setDetailRows(detail);
        this.syncScaleInList(scale, detail.length);
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.LOAD_SCALE_ERROR_TITLE'),
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isLoadingScaleDetail = false;
      });
  }

  onSubmitScale(): void {
    if (!this.selectedOrganizationId) {
      Swal.fire({
        title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.ORG_REQUIRED_TITLE'),
        text: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.ORG_REQUIRED_TEXT'),
        icon: 'warning',
      });
      return;
    }

    if (this.escalaForm.get('Nombre')?.invalid || this.escalaForm.get('TipoEscala')?.invalid) {
      this.escalaForm.get('Nombre')?.markAsTouched();
      this.escalaForm.get('TipoEscala')?.markAsTouched();
      Swal.fire({
        title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.FORM_INVALID_TITLE'),
        text: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.FORM_INVALID_TEXT'),
        icon: 'warning',
      });
      return;
    }

    if (!this.validateDetailBeforeSave()) {
      return;
    }

    const wasEditing = this.isEditing;
    const targetId = this.selectedScaleId;
    const createPayload = this.buildCreatePayload();
    const updatePayload = this.buildUpdatePayload();

    this.isSavingScale = true;
    const request = wasEditing && targetId
      ? this.organizacionService.updateDesempenoScale(targetId, updatePayload)
      : this.organizacionService.saveDesempenoScale(createPayload);

    request
      .then(async (response: any) => {
        this.selectedActiveFilter = !!createPayload.activo;
        await this.loadScalesAsync();

        let nextId = wasEditing ? targetId : this.resolveScaleId(response);

        if (!nextId) {
          nextId = this.findScaleIdInList(createPayload);
        }

        if (!wasEditing && nextId && updatePayload.detalle.length > 0) {
          await this.organizacionService.updateDesempenoScale(nextId, updatePayload);
          await this.loadScalesAsync();
        }

        if (nextId) {
          await this.loadScaleAsync(nextId);
        }

        Swal.fire({
          title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.DONE_TITLE'),
          text: wasEditing
            ? this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.UPDATED_SUCCESS')
            : this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.CREATED_SUCCESS'),
          icon: 'success',
        });
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: this.t('DESEMPENO_MENUITEMS.ESCALAS.MESSAGES.SAVE_ERROR_TITLE'),
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isSavingScale = false;
      });
  }

  private loadScalesAsync(): Promise<void> {
    return new Promise((resolve) => {
      this.loadScales();
      const wait = window.setInterval(() => {
        if (!this.isLoadingScales) {
          window.clearInterval(wait);
          resolve();
        }
      }, 50);
    });
  }

  private loadScaleAsync(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.loadScale(id);
      const wait = window.setInterval(() => {
        if (!this.isLoadingScaleDetail) {
          window.clearInterval(wait);
          resolve();
        }
      }, 50);
    });
  }

  addDetailRow(): void {
    this.detailArray.push(this.createDetailGroup());
  }

  removeDetailRow(index: number): void {
    this.detailArray.removeAt(index);
  }

  isSelectedScale(item: DesScaleListItem): boolean {
    return item.IdEscala === this.selectedScaleId;
  }

  getScaleTypeLabel(type: string): string {
    const option = this.scaleTypeOptions.find((item) => item.value === type);
    return option ? this.t(option.labelKey) : type;
  }

  getStatusLabel(value: boolean): string {
    return value
      ? this.t('DESEMPENO_MENUITEMS.ESCALAS.ACTIVE_STATUS')
      : this.t('DESEMPENO_MENUITEMS.ESCALAS.INACTIVE_STATUS');
  }

  getLevelCountLabel(item: DesScaleListItem): string {
    return item.TotalNiveles !== null ? String(item.TotalNiveles) : '-';
  }
}
