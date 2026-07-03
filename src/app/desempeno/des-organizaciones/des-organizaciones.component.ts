import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
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
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface DesOrganization {
  Id: number;
  IdPais: number | null;
  Nombre: string;
  NIT: string;
  Direccion: string | null;
  Telefono: string | null;
  CorreoContacto: string | null;
  FechaCreacion: string | null;
  estado: number;
  nombre_pais: string | null;
}

interface CountryOption {
  Id: number;
  Nombre: string;
}

@Component({
  selector: 'app-des-organizaciones',
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
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './des-organizaciones.component.html',
})
export class DesOrganizacionesComponent implements OnInit {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.ORGANIZACIONES.TEXT';
  public orgForm: FormGroup;
  public dataSourceOrganizations: DesOrganization[] = [];
  public dataSourceCountries: CountryOption[] = [];
  public displayedColumns: string[] = [
    'Id',
    'IdPais',
    'Nombre',
    'NIT',
    'Telefono',
    'CorreoContacto',
    'FechaCreacion',
    'estado',
    'Acciones',
  ];
  public isLoading = false;
  public isSaving = false;
  public editingOrganizationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private organizacionService: OrganizacionService,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.orgForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCountries();
    this.loadOrganizations();
  }

  get isEditing(): boolean {
    return this.editingOrganizationId !== null;
  }

  private createForm(): FormGroup {
    return this.fb.group({
      IdPais: [null, Validators.min(1)],
      Nombre: ['', Validators.required],
      NIT: ['', Validators.required],
      Direccion: [''],
      Telefono: [''],
      CorreoContacto: ['', Validators.email],
      estado: [1, Validators.required],
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

  private normalizeEstado(value: any): number {
    if (
      value === 0 ||
      value === false ||
      value === '0' ||
      value === 'false' ||
      value === 'FALSE' ||
      value === 'Inactivo' ||
      value === 'INACTIVO'
    ) {
      return 0;
    }

    return 1;
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

  private normalizeOrganization(item: any): DesOrganization {
    return {
      Id: Number(item?.Id ?? item?.id ?? 0),
      IdPais: this.toPositiveInteger(item?.IdPais ?? item?.idPais),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
      NIT: String(item?.NIT ?? item?.nit ?? '').trim(),
      Direccion: this.toOptionalText(item?.Direccion ?? item?.direccion),
      Telefono: this.toOptionalText(item?.Telefono ?? item?.telefono),
      CorreoContacto: this.toOptionalText(item?.CorreoContacto ?? item?.correoContacto),
      FechaCreacion: item?.FechaCreacion ?? item?.fechaCreacion ?? null,
      estado: this.normalizeEstado(item?.estado ?? item?.Estado ?? item?.activo ?? item?.Activo),
      nombre_pais: this.toOptionalText(
        item?.nombre_pais ?? item?.NombrePais ?? item?.nombrePais ?? item?.Pais ?? item?.pais
      ),
    };
  }

  private normalizeCountry(item: any): CountryOption {
    return {
      Id: Number(item?.Id ?? item?.id ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private getUsuarioAccion(): string {
    return this.authService.currentUserValue?.username || 'system';
  }

  private buildPayloadFromForm(): any {
    const formValue = this.orgForm.getRawValue();
    const payload: any = {
      idPais: this.toPositiveInteger(formValue.IdPais),
      nombre: String(formValue.Nombre ?? '').trim(),
      nit: String(formValue.NIT ?? '').trim(),
      direccion: this.toOptionalText(formValue.Direccion),
      telefono: this.toOptionalText(formValue.Telefono),
      correoContacto: this.toOptionalText(formValue.CorreoContacto),
      estado: this.normalizeEstado(formValue.estado),
      usuarioAccion: this.getUsuarioAccion(),
    };

    if (this.editingOrganizationId) {
      payload.idOrganizacion = this.editingOrganizationId;
    }

    return payload;
  }

  private buildPayloadFromItem(item: DesOrganization, nextState: number): any {
    return {
      idOrganizacion: item.Id,
      idPais: this.toPositiveInteger(item.IdPais),
      nombre: item.Nombre,
      nit: item.NIT,
      direccion: this.toOptionalText(item.Direccion),
      telefono: this.toOptionalText(item.Telefono),
      correoContacto: this.toOptionalText(item.CorreoContacto),
      estado: this.normalizeEstado(nextState),
      usuarioAccion: this.getUsuarioAccion(),
    };
  }

  private getErrorMessage(error: any): string {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Ocurrió un error inesperado.'
    );
  }

  private setDefaultCountry(): void {
    const currentCountry = this.orgForm.get('IdPais')?.value;

    if (!currentCountry && this.dataSourceCountries.length > 0 && !this.isEditing) {
      this.orgForm.patchValue({ IdPais: this.dataSourceCountries[0].Id }, { emitEvent: false });
    }
  }

  resetForm(): void {
    this.editingOrganizationId = null;
    this.orgForm.reset({
      IdPais: this.dataSourceCountries[0]?.Id ?? null,
      Nombre: '',
      NIT: '',
      Direccion: '',
      Telefono: '',
      CorreoContacto: '',
      estado: 1,
    });
    this.orgForm.markAsPristine();
    this.orgForm.markAsUntouched();
  }

  loadCountries(): void {
    this.organizacionService.getCountries()
      .then((response: any) => {
        this.dataSourceCountries = this.extractCollection(response).map((country) =>
          this.normalizeCountry(country)
        );
        this.setDefaultCountry();
      })
      .catch((error: any) => {
        console.error('Error al obtener países:', error);
      });
  }

  loadOrganizations(): void {
    this.isLoading = true;

    this.organizacionService.getDesempenoOrganizations()
      .then((response: any) => {
        this.dataSourceOrganizations = this.extractCollection(response)
          .map((organization) => this.normalizeOrganization(organization))
          .sort((first, second) => second.Id - first.Id);
      })
      .catch((error: any) => {
        console.error('Error al obtener organizaciones de desempeño:', error);
        Swal.fire({
          title: 'No se pudo cargar la información',
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getCountryName(item: DesOrganization): string {
    if (item.nombre_pais) {
      return item.nombre_pais;
    }

    return this.dataSourceCountries.find((country) => country.Id === item.IdPais)?.Nombre || '-';
  }

  getStatusLabel(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.orgForm.markAllAsTouched();
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa los campos requeridos antes de guardar.',
        icon: 'warning',
      });
      return;
    }

    this.isSaving = true;
    const payload = this.buildPayloadFromForm();
    const request = this.isEditing
      ? this.organizacionService.updateDesempenoOrganization(this.editingOrganizationId!, payload)
      : this.organizacionService.saveDesempenoOrganization(payload);

    request
      .then(() => {
        Swal.fire({
          title: 'Realizado',
          text: this.isEditing
            ? 'La organización se actualizó correctamente.'
            : 'La organización se creó correctamente.',
          icon: 'success',
        });
        this.resetForm();
        this.loadOrganizations();
      })
      .catch((error: any) => {
        console.error('Error al guardar la organización de desempeño:', error);
        Swal.fire({
          title: 'Algo salió mal',
          text: this.getErrorMessage(error),
          icon: 'error',
        });
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  startEdit(item: DesOrganization): void {
    this.editingOrganizationId = item.Id;
    this.orgForm.patchValue({
      IdPais: item.IdPais,
      Nombre: item.Nombre,
      NIT: item.NIT,
      Direccion: item.Direccion ?? '',
      Telefono: item.Telefono ?? '',
      CorreoContacto: item.CorreoContacto ?? '',
      estado: item.estado,
    });
  }

  toggleStatus(item: DesOrganization): void {
    const nextState = item.estado === 1 ? 0 : 1;
    const actionLabel = nextState === 1 ? 'activar' : 'desactivar';

    Swal.fire({
      title: `¿Deseas ${actionLabel} esta organización?`,
      text: item.Nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.organizacionService.updateDesempenoOrganization(
        item.Id,
        this.buildPayloadFromItem(item, nextState)
      )
        .then(() => {
          Swal.fire({
            title: 'Realizado',
            text:
              nextState === 1
                ? 'La organización fue activada correctamente.'
                : 'La organización fue desactivada correctamente.',
            icon: 'success',
          });

          if (this.editingOrganizationId === item.Id) {
            this.resetForm();
          }

          this.loadOrganizations();
        })
        .catch((error: any) => {
          console.error('Error al actualizar el estado de la organización:', error);
          Swal.fire({
            title: 'Algo salió mal',
            text: this.getErrorMessage(error),
            icon: 'error',
          });
        });
    });
  }
}
