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

import { globalDataItems } from '../global-data-items';
import { DialogSelectItemsComponent } from '../dialogselectitems/dialogselectitems.component';
import { Field, Serie, SeriesDataSend, GFactor, GFactorsDataSend } from '../models/quiz-models';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 


@Component({
  selector: 'app-dialoggfactorform',
  templateUrl: './dialogformgfactor.component.html',
  imports: [

    MatDialogModule,
    MatTableModule,TranslateModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRippleModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    
    MatInputModule
],
  
})
export class DialogformGFactorComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  ELEMENT_DATA: GFactor[] = [];

  NUMBER_DATA  = 0;
  ID_FLUJO = 0;
  ID_GFACTOR = 0;

  REQUEST_DATA: GFactorsDataSend = {
    gfactores: [...this.ELEMENT_DATA],
    idFlujo: this.ID_FLUJO
  };

  gfactoresData = this.ELEMENT_DATA;
  data_request = this.REQUEST_DATA;
  idFlujo = 0;
  dataSource = this.ELEMENT_DATA;
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
 
  public id_card = 0;
  public title_card = '';

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

  langStoreValue?: string;

  constructor(private fb: UntypedFormBuilder,
    private languageService: LanguageService,private translate: TranslateService,
    private organizacionService: OrganizacionService,
    public dialogRef: MatDialogRef<DialogformGFactorComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
    public data: any, private _snackBar: MatSnackBar ) {
      
      console.log('pcta:: ', data);

      this.options_context = [];
      this.idFlujo = data.idFlujo;
      this.data_request = data;
      this.gfactoresData = data.gfactores;
      this.ponderacion_rest = data.ponderation_rest;
      this.ponderacion = data.ponderation_total;

     //console.log('this.data_request:', this.data_request);

  }

  public ngOnInit(): void {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;

    console.log('this.langStoreValue dialogformitem:: ', this.langStoreValue);

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

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

  //validar los valores para esta función JJG 06012024
  ponderacionRestValidator(control: any) {
    const enteredValue = parseFloat(control.value);
    const maxPonderacion = this.ponderacion_rest;

    if (!isNaN(enteredValue) && enteredValue > maxPonderacion) {
      return { 'ponderacionExcede': true };
    }

    return null;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  async guardaGFactor(): Promise<void> {

    if (!this.addSerieForm.valid || this.loading) {
      return;
    }

    this.loading = true;

    try {
      const series: Serie[] = []; 

      const gfactor: GFactor = {
        'Id': 0,
        'id_flujo': this.idFlujo,
        'value': 'gfactor_' + this.gfactoresData.length,  
        'label': this.addSerieForm.controls['iname'].value, 
        'desc': this.addSerieForm.controls['idesc'].value,
        'series': series
      }
     
      const newFactor = {
        'Id': 0,
        "IdFlujo": this.idFlujo, 
        "Clave"  : 'gfactor_' + this.gfactoresData.length, 
        "Etiqueta": this.addSerieForm.controls['iname'].value, 
        "Descripcion": this.addSerieForm.controls['idesc'].value
      }

      const result: any = await this.organizacionService.saveNewGFactor(newFactor);
      if (result?.data?.message !== 'Factor insertado correctamente') {
        throw new Error(this.translate.instant('MENUITEMS.QUIZ.GFINSERTERROR'));
      }

      gfactor.Id = result.data.newId;
      this.gfactoresData = [...(this.gfactoresData || []), gfactor];
      this.data.gfactores = this.gfactoresData;

      this.showNotification(
        'bg-green',
        this.translate.instant('MENUITEMS.QUIZ.GFINSERTSUCCESS'),
        'bottom',
        'right'
      );

      this.dialogRef.close({ created: true, gfactor });
    } catch (error: any) {
      this.showNotification(
        'bg-red',
        `${this.translate.instant('MENUITEMS.QUIZ.GFINSERTERROR')} ${error?.message ?? error}`,
        'bottom',
        'right'
      );
    } finally {
      this.loading = false;
    }
  }


}

