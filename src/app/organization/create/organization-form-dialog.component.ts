import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { OrganizacionService } from '../services/organizacion.service';
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
  splitPhoneNumberByCountry,
} from '../../shared/phone-country.utils';

export interface OrganizationFormDialogData {
  mode: 'create' | 'edit';
  organization?: any;
}

export interface OrganizationFormDialogResult {
  saved: boolean;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-organization-form-dialog',
  templateUrl: './organization-form-dialog.component.html',
  styleUrls: ['./organization-form-dialog.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class OrganizationFormDialogComponent implements OnInit {
  public readonly organizationForm: FormGroup;
  public readonly phoneCountries = PHONE_COUNTRY_OPTIONS;
  public readonly maxPhoneLocalDigits = MAX_PHONE_LOCAL_DIGITS;
  public countries: any[] = [];
  public isLoadingCountries = false;
  public isSaving = false;
  public errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizacionService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<OrganizationFormDialogComponent, OrganizationFormDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationFormDialogData,
  ) {
    const organization = data?.organization ?? {};
    const phoneParts = splitPhoneNumberByCountry(
      organization.Telefono,
      DEFAULT_PHONE_COUNTRY_ISO,
    );

    this.organizationForm = this.fb.group({
      IdPais: [organization.IdPais ?? null, Validators.required],
      PhoneCountryIso: [phoneParts.countryIso, Validators.required],
      Nombre: [organization.Nombre ?? '', [Validators.required, Validators.maxLength(180)]],
      RazonSocial: [organization.RazonSocial ?? '', Validators.maxLength(220)],
      NIT: [organization.NIT ?? '', [Validators.required, Validators.maxLength(50)]],
      Direccion: [organization.Direccion ?? '', Validators.maxLength(300)],
      Telefono: [phoneParts.localNumber],
      CorreoContacto: [organization.CorreoContacto ?? '', [Validators.email, Validators.maxLength(180)]],
      RepresentanteLegal: [organization.RepresentanteLegal ?? '', Validators.maxLength(180)],
      SectorIndustria: [organization.SectorIndustria ?? '', Validators.maxLength(160)],
      NumeroEmpleados: [organization.NumeroEmpleados ?? 0, Validators.min(0)],
    });

    this.applyPhoneControlValidation();
  }

  public ngOnInit(): void {
    this.loadCountries();
  }

  public get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  public get selectedPhoneCountry(): PhoneCountryOption | undefined {
    return getPhoneCountryByIso(this.organizationForm.get('PhoneCountryIso')?.value);
  }

  public get phoneDigitsHint(): string {
    return this.selectedPhoneCountry
      ? getPhoneDigitsRangeLabel(this.selectedPhoneCountry)
      : `${this.maxPhoneLocalDigits}`;
  }

  public get phonePreview(): string {
    return buildFullPhoneNumber(
      this.organizationForm.get('PhoneCountryIso')?.value,
      this.organizationForm.get('Telefono')?.value,
    );
  }

  public getPhoneCountryLabel(country: PhoneCountryOption | undefined): string {
    return getPhoneCountryDisplayName(
      country,
      this.translate.currentLang || localStorage.getItem('lang') || 'es',
    );
  }

  public onPhoneCountryChange(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
    this.syncCountryIdFromPhoneCountry();
  }

  public onPhoneInput(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
  }

  public close(): void {
    if (!this.isSaving) {
      this.dialogRef.close({ saved: false, mode: this.data.mode });
    }
  }

  public save(): void {
    if (this.isSaving) {
      return;
    }

    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
    this.syncCountryIdFromPhoneCountry();

    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    const rawValue = this.organizationForm.getRawValue();
    const { PhoneCountryIso, ...formValue } = rawValue;
    formValue.Telefono = buildFullPhoneNumber(PhoneCountryIso, rawValue.Telefono);
    const payload = this.isEditMode
      ? { ...formValue, Id: this.data.organization?.Id }
      : formValue;
    const request = this.isEditMode
      ? this.organizationService.updateOrganization(payload)
      : this.organizationService.saveNewOrganization(payload);

    request
      .then(() => {
        this.organizationService.notifyOrganizationsChanged();
        this.dialogRef.close({ saved: true, mode: this.data.mode });
      })
      .catch((error: any) => {
        console.error('Error al guardar la organización:', error);
        this.errorMessage = error?.response?.data?.message
          || this.translate.instant('MENUITEMS.ORGANIZATION.SAVEERROR');
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  public hasError(controlName: string, errorName: string): boolean {
    const control = this.organizationForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  private loadCountries(): void {
    this.isLoadingCountries = true;
    this.organizationService.getCountries()
      .then((response: any) => {
        this.countries = Array.isArray(response?.data) ? response.data : [];
        this.syncPhoneCountryFromOrganizationCountry();
        this.syncCountryIdFromPhoneCountry();
      })
      .catch((error: any) => {
        console.error('Error al obtener países:', error);
        this.errorMessage = this.translate.instant('MENUITEMS.ORGANIZATION.COUNTRIESERROR');
      })
      .finally(() => {
        this.isLoadingCountries = false;
      });
  }

  private normalizePhoneControlValue(): void {
    const phoneControl = this.organizationForm.get('Telefono');
    if (!phoneControl) {
      return;
    }

    const normalizedValue = normalizeLocalPhoneNumber(
      phoneControl.value,
      this.selectedPhoneCountry,
    );

    if (normalizedValue !== phoneControl.value) {
      phoneControl.setValue(normalizedValue, { emitEvent: false });
    }
  }

  private applyPhoneControlValidation(): boolean {
    const phoneControl = this.organizationForm.get('Telefono');
    const countryControl = this.organizationForm.get('PhoneCountryIso');

    if (!phoneControl || !countryControl) {
      return true;
    }

    const phoneDigits = normalizePhoneDigits(phoneControl.value);
    const hasPhoneValue = phoneDigits.length > 0;

    this.setCustomControlError(
      countryControl,
      'phoneCountryRequired',
      hasPhoneValue && !this.selectedPhoneCountry,
    );
    this.setCustomControlError(
      phoneControl,
      'phoneLength',
      hasPhoneValue
        && !!this.selectedPhoneCountry
        && !isPhoneLengthValid(phoneDigits, this.selectedPhoneCountry),
    );

    return !countryControl.hasError('phoneCountryRequired')
      && !phoneControl.hasError('phoneLength');
  }

  private setCustomControlError(
    control: AbstractControl | null,
    errorKey: string,
    shouldSet: boolean,
  ): void {
    if (!control) {
      return;
    }

    const errors = { ...(control.errors ?? {}) };
    if (shouldSet) {
      errors[errorKey] = true;
    } else {
      delete errors[errorKey];
    }
    control.setErrors(Object.keys(errors).length ? errors : null);
  }

  private syncPhoneCountryFromOrganizationCountry(): void {
    if (this.organizationForm.get('Telefono')?.value) {
      return;
    }

    const organizationCountryId = Number(this.organizationForm.get('IdPais')?.value);
    const organizationCountry = this.countries.find(
      (country) => Number(country?.Id) === organizationCountryId,
    );
    const phoneCountry = this.findPhoneCountryForCatalogCountry(organizationCountry);

    if (phoneCountry) {
      this.organizationForm.get('PhoneCountryIso')?.setValue(phoneCountry.isoCode);
    }
  }

  private syncCountryIdFromPhoneCountry(): void {
    const selectedCountry = this.selectedPhoneCountry;
    if (!selectedCountry || !this.countries.length) {
      return;
    }

    const catalogCountry = this.countries.find((country) =>
      this.countryMatchesPhoneCountry(country, selectedCountry)
    );

    if (catalogCountry?.Id !== undefined && catalogCountry?.Id !== null) {
      this.organizationForm.get('IdPais')?.setValue(catalogCountry.Id);
    }
  }

  private findPhoneCountryForCatalogCountry(country: any): PhoneCountryOption | undefined {
    return this.phoneCountries.find((phoneCountry) =>
      this.countryMatchesPhoneCountry(country, phoneCountry)
    );
  }

  private countryMatchesPhoneCountry(country: any, phoneCountry: PhoneCountryOption): boolean {
    if (!country) {
      return false;
    }

    const catalogIso = String(
      country?.IsoCode
      ?? country?.ISO
      ?? country?.CodigoIso
      ?? country?.CodigoISO
      ?? country?.Codigo
      ?? country?.Abreviatura
      ?? '',
    ).trim().toUpperCase();

    if (catalogIso && catalogIso === phoneCountry.isoCode) {
      return true;
    }

    const catalogName = this.normalizeCountryName(country?.Nombre ?? country?.nombre);
    return catalogName === this.normalizeCountryName(phoneCountry.nameEs)
      || catalogName === this.normalizeCountryName(phoneCountry.nameEn);
  }

  private normalizeCountryName(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }
}
