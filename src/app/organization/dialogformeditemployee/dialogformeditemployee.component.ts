import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,UntypedFormBuilder,
 } from '@angular/forms';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatCardModule } from '@angular/material/card';
import { OrganizacionService } from '../services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import {
  EmployeeManagerSelectDialogComponent,
  EmployeeManagerSelection,
  getEmployeeOptionFullName,
  getEmployeeOptionId,
  getEmployeeOptionManagerId,
  normalizeEmployeeManagerId,
} from '../employees/employee-manager-select-dialog.component';
@Component({
  selector: 'app-dialogformeditemployee',
  templateUrl: './dialogformeditemployee.component.html',
  imports: [

    MatDialogModule,MatCardModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,TranslateModule,
    MatRippleModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    
    MatInputModule
],
  
})






export class DialogformEditEmployeeComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  public employeeFormX: FormGroup;
  readonly phoneCountries = PHONE_COUNTRY_OPTIONS;
  readonly maxPhoneLocalDigits = MAX_PHONE_LOCAL_DIGITS;
  
  NUMBER_DATA  = 0;
  ID_FLUJO = 0;
  ID_GFACTOR = 0;

  camposDemograficosOrganizacion: any[] = [];

  loading: boolean = false;

  PONDERATION_DATA = 0;
  public ponderacion_rest= this.PONDERATION_DATA;
  public ponderacion = this.PONDERATION_DATA;

  rows = [];
  selectedOption?: string;
  SortType = SortType;

  displayedColumns: string[] = [
    'id',
    'type',
    'label',
    'required',
    'is_random',
    'score',
    'value_correct',
    'file_type', 'actions'
  ];

  public options_context: { label: string; value: string; name: string; is_correct: boolean }[] = [];
  isSaving = false;
  public selectedFieldType = 'text';
  public addSerieForm!: UntypedFormGroup;
  public selectedManagerName = '';
 
  public id_card = 0;
  public title_card = '';
  public idGFactor = 0;

  public card = {
    "id": 0,
    "avatarSrc": "",
    "title": "",
    "subtitle": "",
    "imageSrc": "",
    "content": "y",
    "score": 0,
    "completed": false,
    "fields": []
    };
  public field = {
    "id_quiz": 0,
    "id_item": 0,
    "id_type": 0,
    "type": "",
    "name": "",
    "label": "",
    "required": false,
    "score": 0,
    "options": [],
    "value_correct": "0",
    "file_type": "",
    "is_random": false,
    "serie": "0"
  };

  

  constructor(private fb: UntypedFormBuilder,
    private organizacionService: OrganizacionService,
    public dialogRef: MatDialogRef<DialogformEditEmployeeComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
    public data: any, private _snackBar: MatSnackBar,
    private languageService: LanguageService,private translate: TranslateService,
  
      ) {
      
      this.options_context = [];


      console.log('dasssss:: ',data);


     this.employeeFormX = this.createEmployeeForm(this.data);


  }

  public ngOnInit(): void {


	     this.employeeFormX = this.createEmployeeForm(this.data);

	       this.buildDemographicControlsFromData(this.data);
       this.syncSelectedManagerName();

    this.options_context = [];

    this.addSerieForm = this.fb.group({

      iname: ['',
      [Validators.required]
    ],
      idesc: ['',
        [Validators.required]
      ],            
    });

  }

  get selectedPhoneCountry(): PhoneCountryOption | undefined {
    return getPhoneCountryByIso(this.employeeFormX.get('PhoneCountryIso')?.value);
  }

  get phoneDigitsHint(): string {
    return this.selectedPhoneCountry
      ? getPhoneDigitsRangeLabel(this.selectedPhoneCountry)
      : `${this.maxPhoneLocalDigits}`;
  }

  get phonePreview(): string {
    return buildFullPhoneNumber(
      this.employeeFormX.get('PhoneCountryIso')?.value,
      this.employeeFormX.get('Celular')?.value,
    );
  }

  getPhoneCountryLabel(country: PhoneCountryOption | undefined): string {
    return getPhoneCountryDisplayName(
      country,
      this.translate.currentLang || localStorage.getItem('lang') || 'es',
    );
  }

  onPhoneCountryChange(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
  }

  onPhoneInput(): void {
    this.normalizePhoneControlValue();
    this.applyPhoneControlValidation();
  }

  private createEmployeeForm(data: any): FormGroup {
    const parsedPhone = splitPhoneNumberByCountry(data?.Celular, DEFAULT_PHONE_COUNTRY_ISO);

    const form = this.fb.group({
      IdEmpleado: [{ value: data?.Id, disabled: true }],
      Nombres: [data?.Nombres ?? '', Validators.required],
      Apellidos: [data?.Apellidos ?? '', Validators.required],
      Cargo: [
        data?.Cargo ?? data?.cargo ?? data?.Position ?? data?.position ?? '',
        Validators.required,
      ],
      PhoneCountryIso: [parsedPhone.countryIso],
      Celular: [parsedPhone.localNumber],
      Email: [data?.Email ?? '', Validators.email],
      IdEmpleadoJefe: [getEmployeeOptionManagerId(data)],
      TipoEnvioEncuesta: [data?.TipoEnvioEncuesta ?? data?.tipoEnvioEncuesta ?? 0],
    });

    this.applyPhoneControlValidation(form);

    return form;
  }

  private normalizePhoneControlValue(form: FormGroup = this.employeeFormX): void {
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

  private applyPhoneControlValidation(form: FormGroup = this.employeeFormX): boolean {
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

  get hasManagerOptions(): boolean {
    return this.getManagerOptions().length > 0;
  }

  private getManagerOptions(): any[] {
    if (Array.isArray(this.data?.employeeManagerOptions)) {
      return this.data.employeeManagerOptions;
    }

    if (Array.isArray(this.data?.employees)) {
      return this.data.employees;
    }

    return [];
  }

  private getManagerNameById(managerId: number | null): string {
    if (!managerId) {
      return '';
    }

    const manager = this.getManagerOptions().find(
      (employee: any) => getEmployeeOptionId(employee) === managerId
    );

    return getEmployeeOptionFullName(manager);
  }

  private syncSelectedManagerName(): void {
    const managerId = normalizeEmployeeManagerId(this.employeeFormX.get('IdEmpleadoJefe')?.value);
    this.selectedManagerName =
      this.getManagerNameById(managerId) ||
      String(this.data?.NombreJefe ?? this.data?.nombreJefe ?? '').trim();
  }

  openManagerDialog(): void {
    const dialogRef = this.dialog.open<
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
        employees: this.getManagerOptions(),
        selectedManagerId: normalizeEmployeeManagerId(this.employeeFormX.get('IdEmpleadoJefe')?.value),
        excludedEmployeeId: getEmployeeOptionId(this.data),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) {
        return;
      }

      this.employeeFormX.get('IdEmpleadoJefe')?.setValue(result.id);
      this.selectedManagerName = result.employee ? getEmployeeOptionFullName(result.employee) : '';
    });
  }

  private buildUpdatePayload(): any {
    const rawValue = this.employeeFormX.getRawValue();
    const { PhoneCountryIso, IdEmpleadoJefe, ...employeeData } = rawValue;

    return {
      ...employeeData,
      IdEmpleado: this.data.Id,
      IdOrganizacion: this.data.IdOrganizacion,
      IdEmpleadoJefe: normalizeEmployeeManagerId(IdEmpleadoJefe),
      Celular: buildFullPhoneNumber(PhoneCountryIso, rawValue.Celular),
    };
  }

  ponderacionRestValidator(control: any) {
    const enteredValue = parseFloat(control.value);
    const maxPonderacion = this.ponderacion_rest;

    if (!isNaN(enteredValue) && enteredValue > maxPonderacion) {
      return { 'ponderacionExcede': true };
    }

    return null;
  }

  closeDialog(): void {
    //this.dialog.getDialogById('dialogserie')?.close();
    this.dialogRef.close(true);
  }

 onSubmit():void{
    console.log(this.employeeFormX.value);
    if(this.employeeFormX.valid){
      this.updateEmpleado();
    }
  }

  async updateEmpleado(): Promise<void> {
  this.normalizePhoneControlValue();
  this.applyPhoneControlValidation();

  if (this.employeeFormX.invalid) {
    this.employeeFormX.markAllAsTouched();
    return;
  }

  try {
    this.isSaving = true;

    const payload = this.buildUpdatePayload();

    // (opcional) deshabilitar el form mientras guarda
    this.employeeFormX.disable({ emitEvent: false });

    const updateRes: any = await this.organizacionService.updateEmployee(payload);

    if (updateRes?.data?.message === 'Empleado actualizado exitosamente') {
      this.showNotification('#fefefe', 'Se actualizó el empleado correctamente!');
      this.dialogRef.close(true);
    } else {
      // mensaje genérico
      this.showNotification('#ffdddd', 'No se pudo actualizar el empleado.');
    }
  } catch (err) {
    console.error('updateEmpleado error:', err);
    this.showNotification('#ffdddd', 'Error actualizando empleado.');
  } finally {
    this.isSaving = false;
    this.employeeFormX.enable({ emitEvent: false });
  }
}

  buildDemographicControlsFromData(data: any) {
    if (!data || !this.employeeFormX) return;

    // 1) Campos fijos que NO son demográficos
    const fixed = new Set<string>([
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
      'IdEmpleadoJefe',
      'idEmpleadoJefe',
      'IdJefe',
      'idJefe',
      'NombreJefe',
      'nombreJefe',
      'TipoEnvioEncuesta',
      'tipoEnvioEncuesta',    // por si llega en minúscula
      'FechaRegistro',        // usualmente no editable
      'estado',
      'camposDemograficos',
      'camposDemograficosOrganizacion',
      'employeeManagerOptions',
    ]);

    // 2) Limpia controles demográficos anteriores si reusas el mismo form para otro empleado (opcional)
    this.camposDemograficosOrganizacion.forEach(f =>
      this.employeeFormX.contains(f.NombreCampo) && this.employeeFormX.removeControl(f.NombreCampo)
    );
    this.camposDemograficosOrganizacion = [];

    // 3) Detecta dinámicos y guárdalos
    const dinamicos = Object.keys(data).filter(k => !fixed.has(k));

    this.camposDemograficosOrganizacion = dinamicos.map(k => ({
      NombreCampo: k,
      Valor: data[k] ?? null
    }));

    // 4) Crea/actualiza los FormControl para cada dinámico
    this.camposDemograficosOrganizacion.forEach(field => {
      const value = field.Valor;
      if (this.employeeFormX.contains(field.NombreCampo)) {
        this.employeeFormX.get(field.NombreCampo)?.setValue(value);
      } else {
        this.employeeFormX.addControl(field.NombreCampo, this.fb.control(value));
      }
    });

    // 5) Asegura los fijos (por si la fuente trae may/min)
    const parsedPhone = splitPhoneNumberByCountry(data.Celular, DEFAULT_PHONE_COUNTRY_ISO);

    this.employeeFormX.patchValue({
      IdOrganizacion: data.IdOrganizacion ?? this.employeeFormX.getRawValue().IdOrganizacion,
      Nombres: data.Nombres,
      Apellidos: data.Apellidos,
      Cargo: data.Cargo ?? data.cargo ?? data.Position ?? data.position ?? '',
      PhoneCountryIso: parsedPhone.countryIso,
      Celular: parsedPhone.localNumber,
      Email: data.Email,
      IdEmpleadoJefe: getEmployeeOptionManagerId(data),
      TipoEnvioEncuesta: data.TipoEnvioEncuesta ?? data.tipoEnvioEncuesta ?? 0,
      estado: data.estado
    }, { emitEvent: false });

    this.syncSelectedManagerName();
    this.applyPhoneControlValidation();
  }


  showNotification(
    colorName: string,
    text: string
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
     
      panelClass: colorName,
    });
  }




}

