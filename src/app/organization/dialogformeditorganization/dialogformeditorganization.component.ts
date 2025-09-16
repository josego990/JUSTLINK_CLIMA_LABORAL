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


import { OrganizacionService } from '../services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-dialogformeditorganization',
  templateUrl: './dialogformeditorganization.component.html',
  imports: [

    MatDialogModule,
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
export class DialogformEditOrganizationComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  public orgFormX: FormGroup;
  
  NUMBER_DATA  = 0;
  ID_FLUJO = 0;
  ID_GFACTOR = 0;


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
    public dialogRef: MatDialogRef<DialogformEditOrganizationComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
    public data: any, private _snackBar: MatSnackBar,
    private languageService: LanguageService,private translate: TranslateService,
  
      ) {
      
      this.options_context = [];


      console.log(data);


      this.orgFormX = this.fb.group({
        IdPais: [data.IdPais, Validators.required],
        Nombre: [data.Nombre, Validators.required],
        RazonSocial: [data.RazonSocial],
        NIT: [data.NIT, Validators.required],
        Direccion: [data.Direccion],
        Telefono: [data.Telefono],
        CorreoContacto: [data.CorreoContacto, [Validators.email]],
        RepresentanteLegal: [data.RepresentanteLegal],
        SectorIndustria: [data.SectorIndustria],
        NumeroEmpleados: [data.NumeroEmpleados],
      });


  }

  public ngOnInit(): void {

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

  guardaOrganization(): void {
    if(this.orgFormX.valid){

      this.orgFormX.value.Id = this.data.Id;
      //save dadaxx bro
      this.organizacionService.updateOrganization(this.orgFormX.value).then((updateRes:any)=>{
        console.log('updateRes:: ' ,updateRes);
        if(updateRes.data.message == 'Organización actualizada exitosamente'){
          this.showNotification('#fefefe', 'Se actualizó correctamente!')
        }
      });

  
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

