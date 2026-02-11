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
import { FormBuilder, FormGroup, Validators, FormsModule,
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

  public dataSourceCountries:any = [];
 
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


     
     this.employeeFormX = this.fb.group({
        IdEmpleado: [{ value: this.data.Id, disabled: true }],
        Nombres: [this.data.Nombres, Validators.required],
        Apellidos: [this.data.Apellidos, Validators.required],
        
        Celular: [this.data.Celular],
        Email: [this.data.Email, Validators.email],
        
        TipoEnvioEncuesta: [this.data.tipoEnvioEncuesta]
      });


  }

  public ngOnInit(): void {


     this.employeeFormX = this.fb.group({
      
        IdEmpleado: [{ value: this.data.Id, disabled: true }],
        Nombres: [this.data.Nombres, Validators.required],
        Apellidos: [this.data.Apellidos, Validators.required],
        
        Celular: [this.data.Celular],
        Email: [this.data.Email, Validators.email],
        
        TipoEnvioEncuesta: [this.data.tipoEnvioEncuesta]
      });

       this.buildDemographicControlsFromData(this.data);

    this.options_context = [];

    this.addSerieForm = this.fb.group({

      iname: ['',
      [Validators.required]
    ],
      idesc: ['',
        [Validators.required]
      ],            
    });

    this.getCountries();

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
  if (this.employeeFormX.invalid) return;

  try {
    this.isSaving = true;

    // getRawValue para incluir controles deshabilitados (si los hay)
    const payload = {
      ...this.employeeFormX.getRawValue(),
      IdEmpleado: this.data.Id,
      IdOrganizacion: this.data.IdOrganizacion,
    };

    // (opcional) deshabilitar el form mientras guarda
    this.employeeFormX.disable({ emitEvent: false });

    const updateRes: any = await this.organizacionService.updateEmployee(payload);

    if (updateRes?.data?.message === 'Empleado actualizado exitosamente') {
      this.showNotification('#fefefe', 'Se actualizó el empleado correctamente!');
      // cerrar dialog si quieres:
      // this.dialogRef.close(true);
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

  onCountryChange(selectedId: number) {
    //console.log('Se seleccionó el pais con Id:', selectedId);

    const selectedCountry = this.dataSourceCountries.find((pais:any) => pais.Id  === selectedId);

    if(selectedCountry){
      
      console.log('pais:: ', selectedCountry);

    }
    
  }

  getCountries(): void {
    this.organizacionService.getCountries()
        .then((response:any) => {
         //console.log('Countries:', JSON.stringify(response.data));
          
          this.dataSourceCountries = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener Countries:', error);
        });
  }

 

  buildDemographicControlsFromData(data: any) {
    if (!data || !this.employeeFormX) return;

    // 1) Campos fijos que NO son demográficos
    const fixed = new Set<string>([
      'Id',
      'IdOrganizacion',
      'Nombres',
      'Apellidos',
      'Celular',
      'Email',
      'TipoEnvioEncuesta',
      'tipoEnvioEncuesta',    // por si llega en minúscula
      'FechaRegistro',        // usualmente no editable
      'estado'
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
    this.employeeFormX.patchValue({
      IdOrganizacion: data.IdOrganizacion ?? this.employeeFormX.getRawValue().IdOrganizacion,
      Nombres: data.Nombres,
      Apellidos: data.Apellidos,
      Celular: data.Celular,
      Email: data.Email,
      TipoEnvioEncuesta: data.TipoEnvioEncuesta ?? data.tipoEnvioEncuesta ?? 0,
      estado: data.estado
    }, { emitEvent: false });
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

