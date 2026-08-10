import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface DesDemographicField {
  IdCampoDemografico: number;
  IdOrganizacion: number | null;
  Nombre: string;
  Codigo: string;
  TipoDato: string;
  requerido: boolean;
  activo: boolean;
  permiteMultiples: boolean;
  esFiltrable: boolean;
  esCampoSistema: boolean;
}

interface DesDemographicOption {
  IdCampoOpcion: number;
  Valor: string;
  Orden: number;
  activo: boolean;
}

interface DesOrganizationOption {
  Id: number;
  Nombre: string;
}

@Component({
  selector: 'app-des-campos-demograficos',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './des-campos-demograficos.component.html',
})
export class DesCamposDemograficosComponent implements OnDestroy, OnInit {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.CAMPOS_DEMOGRAFICOS.TEXT';
  readonly tipoDatoOptions = [
    { value: 'TEXTO', label: 'Texto' },
    { value: 'NUMERO', label: 'Número' },
    { value: 'FECHA', label: 'Fecha' },
    { value: 'BOOLEANO', label: 'Booleano' },
    { value: 'LISTA', label: 'Lista' },
  ];
  public campoForm: FormGroup;
  public opcionForm: FormGroup;
  public dataSourceOrganizations: DesOrganizationOption[] = [];
  public fieldsDataSource: DesDemographicField[] = [];
  public optionsDataSource: DesDemographicOption[] = [];
  public displayedColumns: string[] = [
    'IdCampoDemografico',
    'Nombre',
    'Codigo',
    'TipoDato',
    'requerido',
    'permiteMultiples',
    'activo',
    'Acciones',
  ];
  public optionDisplayedColumns: string[] = [
    'IdCampoOpcion',
    'Valor',
    'Orden',
    'activo',
    'Acciones',
  ];
  public isLoadingFields = false;
  public isLoadingOrganizations = false;
  public isSavingField = false;
  public isLoadingOptions = false;
  public isSavingOption = false;
  public editingFieldId: number | null = null;
  public editingOptionId: number | null = null;
  public selectedOptionsField: DesDemographicField | null = null;
  public selectedOrganizationId: number | null = null;
  private selectedOrganizationSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
  ) {
    this.campoForm = this.createCampoForm();
    this.opcionForm = this.createOpcionForm();
  }

  ngOnInit(): void {
    this.campoForm.get('TipoDato')?.valueChanges.subscribe((tipoDato) => {
      if (String(tipoDato ?? '').toUpperCase() !== 'LISTA') {
        this.campoForm.patchValue({ PermiteMultiples: false }, { emitEvent: false });
      }
    });

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

  get isEditingField(): boolean {
    return this.editingFieldId !== null;
  }

  get isEditingOption(): boolean {
    return this.editingOptionId !== null;
  }

  get isListTypeSelected(): boolean {
    return String(this.campoForm.get('TipoDato')?.value ?? '').toUpperCase() === 'LISTA';
  }

  get hasSelectedOrganization(): boolean {
    return !!this.selectedOrganizationId;
  }

  private createCampoForm(): FormGroup {
    return this.fb.group({
      Nombre: ['', Validators.required],
      Clave: ['', Validators.required],
      TipoDato: ['TEXTO', Validators.required],
      Requerido: [false],
      Activo: [true],
      PermiteMultiples: [false],
    });
  }

  private createOpcionForm(): FormGroup {
    return this.fb.group({
      Valor: ['', Validators.required],
      Orden: [1, [Validators.required, Validators.min(1)]],
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

  private normalizeBoolean(value: any): boolean {
    if (
      value === true ||
      value === 1 ||
      value === '1' ||
      value === 'true' ||
      value === 'TRUE' ||
      value === 'Activo' ||
      value === 'ACTIVO' ||
      value === 'Sí' ||
      value === 'SI' ||
      value === 'sí'
    ) {
      return true;
    }

    return false;
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
      'Ocurrió un error inesperado.'
    );
  }

  private getUsuarioAccion(): string {
    return this.authService.currentUserValue?.username || 'system';
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
      activo: this.normalizeBoolean(
        item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado
      ),
      permiteMultiples: this.normalizeBoolean(
        item?.permiteMultiples ?? item?.PermiteMultiples ?? item?.esMultiple ?? item?.EsMultiple
      ),
      esFiltrable: this.normalizeBoolean(item?.esFiltrable ?? item?.EsFiltrable),
      esCampoSistema: this.normalizeBoolean(item?.esCampoSistema ?? item?.EsCampoSistema),
    };
  }

  private normalizeOption(item: any): DesDemographicOption {
    return {
      IdCampoOpcion: Number(
        item?.IdCampoOpcion ?? item?.idCampoOpcion ?? item?.IdOpcion ?? item?.idOpcion ?? item?.Id ?? item?.id ?? 0
      ),
      Valor: String(item?.Valor ?? item?.valor ?? item?.Nombre ?? item?.nombre ?? '').trim(),
      Orden: Number(item?.Orden ?? item?.orden ?? 1),
      activo: this.normalizeBoolean(
        item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado
      ),
    };
  }

  private toPositiveInteger(value: any): number | null {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      return null;
    }

    return numericValue;
  }

  private normalizeOrganization(item: any): DesOrganizationOption {
    return {
      Id: Number(item?.Id ?? item?.id ?? item?.IdOrganizacion ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private buildFieldPayload(): any {
    const raw = this.campoForm.getRawValue();
    const tipoDato = String(raw.TipoDato ?? 'TEXTO').trim().toUpperCase();
    const payload: any = {
      idOrganizacion: this.selectedOrganizationId,
      nombre: String(raw.Nombre ?? '').trim(),
      clave: String(raw.Clave ?? '').trim(),
      tipoDato,
      requerido: !!raw.Requerido,
      activo: !!raw.Activo,
      permiteMultiples: tipoDato === 'LISTA' ? !!raw.PermiteMultiples : false,
      usuarioAccion: this.getUsuarioAccion(),
    };

    if (this.editingFieldId) {
      payload.idCampoDemografico = this.editingFieldId;
    }

    return payload;
  }

  private buildOptionPayload(): any {
    const raw = this.opcionForm.getRawValue();

    return {
      valor: String(raw.Valor ?? '').trim(),
      orden: Number(raw.Orden ?? 1) || 1,
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private syncSelectedOptionsField(): void {
    if (!this.selectedOptionsField) {
      return;
    }

    const updatedField = this.fieldsDataSource.find(
      (field) => field.IdCampoDemografico === this.selectedOptionsField?.IdCampoDemografico
    );

    if (!updatedField || updatedField.TipoDato !== 'LISTA') {
      this.closeOptionsPanel();
      return;
    }

    this.selectedOptionsField = updatedField;
  }

  private getNextOptionOrder(): number {
    if (this.optionsDataSource.length === 0) {
      return 1;
    }

    return Math.max(...this.optionsDataSource.map((option) => option.Orden || 1)) + 1;
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  resetCampoForm(): void {
    this.editingFieldId = null;
    this.campoForm.reset({
      Nombre: '',
      Clave: '',
      TipoDato: 'TEXTO',
      Requerido: false,
      Activo: true,
      PermiteMultiples: false,
    });
    this.campoForm.markAsPristine();
    this.campoForm.markAsUntouched();
  }

  resetOpcionForm(): void {
    this.editingOptionId = null;
    this.opcionForm.reset({
      Valor: '',
      Orden: this.getNextOptionOrder(),
    });
    this.opcionForm.markAsPristine();
    this.opcionForm.markAsUntouched();
  }

  closeOptionsPanel(): void {
    this.selectedOptionsField = null;
    this.optionsDataSource = [];
    this.resetOpcionForm();
  }

  async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.dataSourceOrganizations = this.extractCollection(response)
        .map((organization) => this.normalizeOrganization(organization))
        .sort((first, second) => first.Nombre.localeCompare(second.Nombre));

      const currentUserOrganizationId = this.toPositiveInteger(
        this.authService.currentUserValue?.idOrganization
      );

      if (
        currentUserOrganizationId &&
        this.dataSourceOrganizations.some(
          (organization) => organization.Id === currentUserOrganizationId
        )
      ) {
        this.selectedOrganizationId = currentUserOrganizationId;
      } else if (!this.selectedOrganizationId && this.dataSourceOrganizations.length > 0) {
        this.selectedOrganizationId = this.dataSourceOrganizations[0].Id;
      }

      await this.loadFields();
    } catch (error: any) {
      console.error('Error al obtener organizaciones de desempeño:', error);
      Swal.fire({
        title: 'No se pudieron cargar las organizaciones',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  async onOrganizationChange(selectedId: number | null): Promise<void> {
    this.selectedOrganizationId = this.toPositiveInteger(selectedId);
    this.closeOptionsPanel();
    this.resetCampoForm();
    await this.loadFields();
  }

  async loadFields(): Promise<void> {
    if (!this.selectedOrganizationId) {
      this.fieldsDataSource = [];
      this.closeOptionsPanel();
      return;
    }

    this.isLoadingFields = true;

    try {
      const response = await this.organizacionService.getDesempenoCamposDemograficos({
        idOrganizacion: this.selectedOrganizationId,
      });

      this.fieldsDataSource = this.extractCollection(response)
        .map((field) => this.normalizeField(field))
        .sort((first, second) => second.IdCampoDemografico - first.IdCampoDemografico);

      this.syncSelectedOptionsField();
    } catch (error: any) {
      console.error('Error al obtener campos demográficos:', error);
      Swal.fire({
        title: 'No se pudo cargar la información',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    } finally {
      this.isLoadingFields = false;
    }
  }

  async loadOptions(): Promise<void> {
    if (!this.selectedOptionsField) {
      return;
    }

    this.isLoadingOptions = true;

    try {
      const response = await this.organizacionService.getDesempenoCampoDemograficoOpciones(
        this.selectedOptionsField.IdCampoDemografico
      );

      this.optionsDataSource = this.extractCollection(response)
        .map((option) => this.normalizeOption(option))
        .sort((first, second) => first.Orden - second.Orden);

      if (!this.isEditingOption) {
        this.resetOpcionForm();
      }
    } catch (error: any) {
      console.error('Error al obtener opciones del campo demográfico:', error);
      Swal.fire({
        title: 'No se pudieron cargar las opciones',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    } finally {
      this.isLoadingOptions = false;
    }
  }

  async onSubmitField(): Promise<void> {
    if (!this.selectedOrganizationId) {
      Swal.fire({
        title: 'Organización requerida',
        text: 'Selecciona una organización antes de guardar el campo demográfico.',
        icon: 'warning',
      });
      return;
    }

    if (this.campoForm.invalid) {
      this.campoForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa los campos requeridos antes de guardar.',
        icon: 'warning',
      });
      return;
    }

    this.isSavingField = true;
    const payload = this.buildFieldPayload();

    try {
      if (this.isEditingField) {
        await this.organizacionService.updateDesempenoCampoDemografico(this.editingFieldId!, payload);
      } else {
        await this.organizacionService.saveDesempenoCampoDemografico(payload);
      }

      Swal.fire({
        title: 'Realizado',
        text: this.isEditingField
          ? 'El campo demográfico se actualizó correctamente.'
          : 'El campo demográfico se creó correctamente.',
        icon: 'success',
      });

      this.resetCampoForm();
      await this.loadFields();

      if (this.selectedOptionsField) {
        await this.loadOptions();
      }
    } catch (error: any) {
      console.error('Error al guardar el campo demográfico:', error);
      Swal.fire({
        title: 'Algo salió mal',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    } finally {
      this.isSavingField = false;
    }
  }

  startEditField(field: DesDemographicField): void {
    if (field.IdOrganizacion && field.IdOrganizacion !== this.selectedOrganizationId) {
      this.selectedOrganizationId = field.IdOrganizacion;
    }

    this.editingFieldId = field.IdCampoDemografico;
    this.campoForm.patchValue({
      Nombre: field.Nombre,
      Clave: field.Codigo,
      TipoDato: field.TipoDato,
      Requerido: field.requerido,
      Activo: field.activo,
      PermiteMultiples: field.permiteMultiples,
    });
  }

  async toggleFieldStatus(field: DesDemographicField): Promise<void> {
    const nextState = !field.activo;

    const confirmation = await Swal.fire({
      title: nextState ? '¿Activar campo?' : '¿Desactivar campo?',
      text: field.Nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await this.organizacionService.updateDesempenoCampoDemograficoEstado(
        field.IdCampoDemografico,
        { activo: nextState }
      );

      Swal.fire({
        title: 'Realizado',
        text: nextState
          ? 'El campo demográfico fue activado correctamente.'
          : 'El campo demográfico fue desactivado correctamente.',
        icon: 'success',
      });

      await this.loadFields();

      if (this.selectedOptionsField) {
        await this.loadOptions();
      }
    } catch (error: any) {
      console.error('Error al actualizar el estado del campo demográfico:', error);
      Swal.fire({
        title: 'Algo salió mal',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    }
  }

  async openOptionsPanel(field: DesDemographicField): Promise<void> {
    if (field.TipoDato !== 'LISTA') {
      Swal.fire({
        title: 'Campo no compatible',
        text: 'Solo los campos de tipo LISTA administran opciones de catálogo.',
        icon: 'info',
      });
      return;
    }

    this.selectedOptionsField = field;
    this.resetOpcionForm();
    await this.loadOptions();
  }

  startEditOption(option: DesDemographicOption): void {
    this.editingOptionId = option.IdCampoOpcion;
    this.opcionForm.patchValue({
      Valor: option.Valor,
      Orden: option.Orden,
    });
  }

  async onSubmitOption(): Promise<void> {
    if (!this.selectedOptionsField) {
      return;
    }

    if (this.opcionForm.invalid) {
      this.opcionForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa los datos de la opción antes de guardar.',
        icon: 'warning',
      });
      return;
    }

    this.isSavingOption = true;
    const payload = this.buildOptionPayload();

    try {
      if (this.isEditingOption) {
        await this.organizacionService.updateDesempenoCampoDemograficoOpcion(
          this.selectedOptionsField.IdCampoDemografico,
          this.editingOptionId!,
          payload
        );
      } else {
        await this.organizacionService.saveDesempenoCampoDemograficoOpcion(
          this.selectedOptionsField.IdCampoDemografico,
          payload
        );
      }

      Swal.fire({
        title: 'Realizado',
        text: this.isEditingOption
          ? 'La opción se actualizó correctamente.'
          : 'La opción se creó correctamente.',
        icon: 'success',
      });

      this.resetOpcionForm();
      await this.loadOptions();
    } catch (error: any) {
      console.error('Error al guardar la opción del campo demográfico:', error);
      Swal.fire({
        title: 'Algo salió mal',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    } finally {
      this.isSavingOption = false;
    }
  }

  async toggleOptionStatus(option: DesDemographicOption): Promise<void> {
    if (!this.selectedOptionsField) {
      return;
    }

    const nextState = !option.activo;
    const confirmation = await Swal.fire({
      title: nextState ? '¿Activar opción?' : '¿Desactivar opción?',
      text: option.Valor,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      await this.organizacionService.updateDesempenoCampoDemograficoOpcionEstado(
        this.selectedOptionsField.IdCampoDemografico,
        option.IdCampoOpcion,
        { activo: nextState }
      );

      Swal.fire({
        title: 'Realizado',
        text: nextState
          ? 'La opción fue activada correctamente.'
          : 'La opción fue desactivada correctamente.',
        icon: 'success',
      });

      await this.loadOptions();
    } catch (error: any) {
      console.error('Error al actualizar el estado de la opción:', error);
      Swal.fire({
        title: 'Algo salió mal',
        text: this.getErrorMessage(error),
        icon: 'error',
      });
    }
  }
}
