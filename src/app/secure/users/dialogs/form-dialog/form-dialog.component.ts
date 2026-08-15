import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AdvanceTableService } from '../../users-table.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UserModel } from '../../users-table.model';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import axios from 'axios';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@core';
import { TranslateModule } from '@ngx-translate/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
} from '@shared/phone-country.utils';

export interface UserDialogData {
  action: 'add' | 'edit';
  user?: UserModel;
  idOrganization: number;
  organizationName: string;
}

@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    imports: [
        MatButtonModule,TranslateModule,
        MatIconModule,
        MatDialogContent,MatDialogActions,CommonModule,
        FormsModule,MatSlideToggleModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule, MatProgressSpinnerModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        MatNativeDateModule,
        MatMomentDateModule,
        MatTooltipModule,
    ]
})
export class FormDialogComponent implements OnInit{
  private readonly profileImageBucketUrl =
    'https://justlink-clima360-objects.s3.us-east-1.amazonaws.com/';
  private readonly fallbackAvatarUrl = 'assets/images/user/usrbig3.jpg';
  private readonly profileImageCacheVersion = Date.now();
  action: string;
  dialogTitle: string;
  userForm: UntypedFormGroup;
  user: UserModel;
  url: string | null = null;

  public idOrganization =  0;
  public organizationName = '';
  roles:any = [];
  rolesLoading = false;
  changePass = false;
  readonly phoneCountries = PHONE_COUNTRY_OPTIONS;
  readonly maxPhoneLocalDigits = MAX_PHONE_LOCAL_DIGITS;
  private initialPhoneCountryIso = DEFAULT_PHONE_COUNTRY_ISO;
  private initialPhoneLocalNumber = '';

  langStoreValue?: string;

  formFileData = new FormData();
  fileName = '';

  fileChange = false;
  imageUploadError = '';

  loading = false;

  constructor(
    private languageService: LanguageService,private translate: TranslateService,
    private organizationService: OrganizacionService,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData,
    private fb: FormBuilder,
    private userService: AdvanceTableService  // asumiendo que maneja UserModel
  ) {

    this.action = data.action;
    this.idOrganization = Number(data.idOrganization ?? 0);
    this.organizationName = String(data.organizationName ?? '').trim();

    if (this.action === 'edit') { //editar

      //console.log('dataxx:: ', data);
      this.dialogTitle = 'Editar usuario';
      this.user = data.user ?? new UserModel();
     //console.log('this.user:: ', this.user);
      this.url = this.user.imagenUrl
        ? this.getStoredProfileImageUrl(this.user.imagenUrl)
        : null;
      this.fileName = this.user.imagenUrl;

    } else { //insertar nuevo

      this.dialogTitle = 'Nuevo usuario';
      this.user = new UserModel();
    }

    const parsedPhone = splitPhoneNumberByCountry(this.user.telefono);
    this.initialPhoneCountryIso = parsedPhone.countryIso;
    this.initialPhoneLocalNumber = parsedPhone.localNumber;

    this.userForm = this.createUserForm();

    if(this.action === 'add'){
      this.userForm.get('passwordPlain')?.enable();
      this.userForm.get('passwordPlainConfirm')?.enable();

      this.userForm.setValidators(
        this.matchPasswords('passwordPlain', 'passwordPlainConfirm')
      );

    }

    this.userForm.patchValue({
      roleId: this.user.roleId,
      organizacionId: this.idOrganization,
    });

   

  }
  ngOnInit(): void {

     //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    this.loadOrganizationRoles();
  }

  private loadOrganizationRoles(): void {
    this.roles = [];

    if (!Number.isInteger(this.idOrganization) || this.idOrganization <= 0) {
      return;
    }

    this.rolesLoading = true;
    this.organizationService.getRolesByIdOrg(this.idOrganization)
      .then((response) => {
        this.roles = Array.isArray(response?.data) ? response.data : [];
      })
      .catch((error) => {
        this.roles = [];
        console.error('Error al obtener roles de la organización:', error);
      })
      .finally(() => {
        this.rolesLoading = false;
      });
  }

  get selectedPhoneCountry(): PhoneCountryOption | undefined {
    return getPhoneCountryByIso(this.userForm.get('PhoneCountryIso')?.value);
  }

  get phoneDigitsHint(): string {
    return this.selectedPhoneCountry
      ? getPhoneDigitsRangeLabel(this.selectedPhoneCountry)
      : `${this.maxPhoneLocalDigits}`;
  }

  get phonePreview(): string {
    return buildFullPhoneNumber(
      this.userForm.get('PhoneCountryIso')?.value,
      this.userForm.get('telefono')?.value,
    );
  }

  getPhoneCountryLabel(country: PhoneCountryOption | undefined): string {
    const language = this.translate.currentLang || this.langStoreValue || 'es';
    return getPhoneCountryDisplayName(country, language);
  }

  onPhoneCountryChange(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
  }

  onPhoneInput(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
  }

  formControl = new UntypedFormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.formControl.hasError('required')) {
      return 'Required field';
    }
    return this.formControl.hasError('email') ? 'Not a valid email' : '';
  }

  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      userId:       [this.user.id],
      username:     [this.user.username, [Validators.required]],
      passwordPlain:        [
        {value: '', disabled: !this.changePass},
        [Validators.required, Validators.minLength(6)]
         
      ],
      passwordPlainConfirm: [
        {value: '', disabled: !this.changePass},
       [Validators.required, Validators.minLength(6)]
       
      ],
      email:        [this.user.email, [Validators.required, Validators.email]],
      nombres:      [this.user.nombres, [Validators.required]],
      apellidos:    [this.user.apellidos, [Validators.required]],
      genero:       [this.user.genero, [Validators.required]],
      //birthDate:    [formatDate(this.user.createdAt, 'dd-MM-yyyy', 'en'),[Validators.required]],
      PhoneCountryIso: [this.initialPhoneCountryIso],
      telefono:     [this.initialPhoneLocalNumber, [Validators.required]],
      imagenUrl:    [this.user.imagenUrl],
      cargo:        [this.user.cargo, [Validators.required]],
      organizacionId: [this.idOrganization, [Validators.required]],
      ciudad:       [this.user.ciudad, [Validators.required]],
      roleId:       [this.user.roleId, [Validators.required]],
      roleName:     [this.user.roleName],
      isActive:     [this.user.isActive],
      changePass:   [this.changePass]
    }, {
      validators: this.matchPasswords('passwordPlain','passwordPlainConfirm')
    });

    
    
  }

  // Validador a nivel de grupo
  private matchPasswords(
  passwordKey: string,
  confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passCtrl    = group.get(passwordKey);
      const confirmCtrl = group.get(confirmKey);

      if (!passCtrl || !confirmCtrl) return null;
      // Si alguno está deshabilitado, no aplicamos la validación de igualdad
      if (passCtrl.disabled || confirmCtrl.disabled) return null;

      return passCtrl.value === confirmCtrl.value
        ? null
        : { passwordMismatch: true };
    };
  }

  private normalizePhoneControlValue(): void {
    const phoneControl = this.userForm.get('telefono');
    const normalizedValue = normalizeLocalPhoneNumber(
      phoneControl?.value,
      this.selectedPhoneCountry,
    );

    if (phoneControl && normalizedValue !== phoneControl.value) {
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

  private applyPhoneControlValidation(): boolean {
    const phoneControl = this.userForm.get('telefono');
    const countryControl = this.userForm.get('PhoneCountryIso');
    const phoneDigits = normalizePhoneDigits(phoneControl?.value);
    const country = this.selectedPhoneCountry;
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

    return !countryControl?.hasError('phoneCountryRequired') &&
      !phoneControl?.hasError('phoneLength');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  switchChangePass(event:any):void{

    //console.log('event: ', event)
    
    if(event.checked){
      this.changePass = true;
      this.userForm.get('passwordPlain')?.enable();
      this.userForm.get('passwordPlainConfirm')?.enable();
      
      this.userForm.setValidators(
      this.matchPasswords('passwordPlain', 'passwordPlainConfirm')
      );
      

    }
    else{
      this.changePass = false;
      this.userForm.get('passwordPlain')?.disable();
      this.userForm.get('passwordPlainConfirm')?.disable();
    }

    
    
  }

  submit() {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid || this.idOrganization <= 0 || this.loading) {
      // chequea el error de mismatch
      if (this.userForm.hasError('passwordMismatch')) {
        // muestra un mensaje global o marca el campo confirm
      }
      return;
    }

    this.loading = true;
    const rawValue = this.userForm.getRawValue();
    const { PhoneCountryIso, ...formData } = rawValue;

    formData.imagenUrl = this.fileName;
    formData.organizacionId = this.idOrganization;
    formData.telefono = buildFullPhoneNumber(PhoneCountryIso, rawValue.telefono);

    const persistUser = () => {
      const request = this.action === 'edit'
        ? this.userService.updateUserTable(formData)
        : this.userService.addUserTable(formData);

      request.subscribe({
        next: (response) => this.dialogRef.close(response),
        error: (error) => {
          this.loading = false;
          console.error('User save error:', error);
        },
      });
    };

    if (!this.fileChange) {
      persistUser();
      return;
    }

    this.imageUploadError = '';
    this.uploadSelectedImage()
      .then(persistUser)
      .catch((error) => {
        this.loading = false;
        this.imageUploadError =
          'No se pudo cargar la imagen. Intenta seleccionarla nuevamente.';
        console.error('Profile image upload error:', error);
      });
  }

  private async uploadSelectedImage(): Promise<void> {
    const response = await axios.post(
      'https://api.justlink360.net/upload-file-v2',
      this.formFileData,
      { timeout: 30000 },
    );

    if (String(response.data ?? '').trim().toUpperCase() !== 'SUCCESS') {
      throw new Error('El servicio de archivos no confirmó la carga.');
    }
  }

  private getStoredProfileImageUrl(fileName: string): string {
    const encodedKey = String(fileName)
      .trim()
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return `${this.profileImageBucketUrl}${encodedKey}?v=${this.profileImageCacheVersion}`;
  }

  get avatarUrl(): string {
    if (this.url) {
      return this.url;
    }

    if (this.user.imagenUrl) {
      return this.getStoredProfileImageUrl(this.user.imagenUrl);
    }

    return this.fallbackAvatarUrl;
  }

  onAvatarError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith(this.fallbackAvatarUrl)) {
      image.src = this.fallbackAvatarUrl;
    }
  }

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) { return; }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.imageUploadError = 'Selecciona un archivo de imagen válido.';
      input.value = '';
      return;
    }

    this.imageUploadError = '';

    /* 1) Vista previa (lo que ya haces) */
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.url = reader.result as string;
      this.userForm.patchValue({ imagenUrl: this.url });
    };

    /* 2) Envío al backend */
    const formData = new FormData();
    // El nombre **file** debe coincidir con .array('file', 1) en tu ruta Express
    const safeOriginalName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    this.fileName = `user-${Date.now()}-${safeOriginalName}`;
    formData.append('file', file, this.fileName);

    this.formFileData = formData;
    
    this.fileChange = true;

  }
    

}

