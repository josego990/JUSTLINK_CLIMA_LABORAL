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
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
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
import { Field, Serie, SeriesDataSend } from '../models/quiz-models';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-dialogitemform',
  templateUrl: './dialogformserie.component.html',
  imports: [

    MatDialogModule,
    MatTableModule,
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
export class DialogformSerieComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  ELEMENT_DATA: Serie[] = [];
  NUMBER_DATA  = 0;
  ID_FLUJO = 0;

  REQUEST_DATA: SeriesDataSend = {
    series: [...this.ELEMENT_DATA],
    ponderation_rest: this.NUMBER_DATA,
    ponderation_total: this.NUMBER_DATA,
    idFlujo: this.ID_FLUJO
  };



  seriesData = this.ELEMENT_DATA;
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

  constructor(private fb: UntypedFormBuilder,
    private organizacionService: OrganizacionService,
    public dialogRef: MatDialogRef<DialogformSerieComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
    public data: any, private _snackBar: MatSnackBar ) {
      
      this.options_context = [];
      this.idFlujo = data.idFlujo;
      this.data_request = data;
      this.seriesData = data.series;
      this.ponderacion_rest = data.ponderation_rest;
      this.ponderacion = data.ponderation_total;

     //console.log('this.data_request:', this.data_request);

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
    //this.dialog.getDialogById('dialogserie')?.close();
    this.dialogRef.close(true);
  }

  deleteItem(item: any): void {
    const index = this.dataSource.indexOf(item);

    if (index !== -1) {
      this.dataSource.splice(index, 1);
      // Actualiza la fuente de datos
      this.dataSource = [...this.dataSource];

      this.ponderacion_rest = this.ponderacion_rest + parseInt(item.score, 10);

      this.showNotification(
        'bg-red',
        'Se ha eliminado el Item!',
        'bottom',
        'right'
      );
    }
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

  guardaSerie(){
   //console.log('guardaSerie');

   //console.log('this.ponderacion_rest:', this.ponderacion_rest);


    if(this.addSerieForm.valid) {
      this.loading = true;
      const count = this.seriesData.length + 1;
      const fields: Field[] = []; 

      const serie: Serie = {
        'Id': 0,
        'id_flujo': this.idFlujo,
        'value': 'serie_' + this.seriesData.length, 
        'label': this.addSerieForm.controls['iname'].value, 
        'desc': this.addSerieForm.controls['idesc'].value,
        'fields': fields, 
        'score': 0}

      const newFactor = {
        "IdFlujo": this.idFlujo, 
        "Clave"  : 'serie_' + this.seriesData.length, 
        "Etiqueta": this.addSerieForm.controls['iname'].value, 
        "Descripcion": this.addSerieForm.controls['idesc'].value, 
        "Puntaje": 0
      }


      this.organizacionService.saveNewFactor(newFactor).then((resulte: any) => {
       //console.log('RESULTADO DE GUARDADO DE FACTOR:: ', resulte);



        if(resulte.data.message === 'Factor insertado correctamente') {
          
          serie.Id = resulte.data.newId;
          
          this.seriesData.push(serie);
          
          this.seriesData = [...this.seriesData];
          this.loading = false;
          this.showNotification(
            'bg-green',
            resulte.data.message,
            'bottom',
            'right'
          );
          
          this.addSerieForm.reset();

        }else{
          this.loading = false;
          this.showNotification(
            'bg-red',
            'Ocurrió un error al guardar el nuevo Factor',
            'bottom',
            'right'
          );
        }

       
      }).catch((err)=> {
        this.loading = false;
        this.showNotification(
          'bg-red',
          'Ocurrió un error al guardar el nuevo Factor. Error: ' + err,
          'bottom',
          'right'
        );
      
      });


    
      //this.ponderacion_rest = this.ponderacion_rest - this.addSerieForm.controls['iscore'].value;
      //this.data_request.ponderation_rest = this.ponderacion_rest;
      //this.data_request = {...this.data_request};


      //console.log('this.ponderacion_rest:', this.ponderacion_rest);

    }
    else {
      //console.log('form is not valid');
    }


  }


}

