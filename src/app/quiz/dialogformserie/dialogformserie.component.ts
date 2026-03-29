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
import { Field, Serie, SeriesDataSend, GFactor } from '../models/quiz-models';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 


@Component({
  selector: 'app-dialogitemform',
  templateUrl: './dialogformserie.component.html',
  imports: [

    MatDialogModule,TranslateModule,
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

  ELEMENT_DATA_GF: GFactor[] = [];

  gfactoresData = this.ELEMENT_DATA_GF;
  
  NUMBER_DATA  = 0;
  ID_FLUJO = 0;
  ID_GFACTOR = 0;

  REQUEST_DATA: SeriesDataSend = {
    series: [...this.ELEMENT_DATA],
    ponderation_rest: this.NUMBER_DATA,
    ponderation_total: this.NUMBER_DATA,
    idFlujo: this.ID_FLUJO,
    idGFactor: this.ID_GFACTOR,
    gfactores: []
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
   langStoreValue?: string;
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

  constructor(private fb: UntypedFormBuilder,private languageService: LanguageService,private translate: TranslateService,
    private organizacionService: OrganizacionService,
    public dialogRef: MatDialogRef<DialogformSerieComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA)
    public data: any, private _snackBar: MatSnackBar ) {
      
      this.options_context = [];
      this.idFlujo = data.idFlujo;
      this.data_request = data;
      this.idGFactor = data.idGFactor;

      //this.seriesData = data.series;

      this.seriesData = (data.gfactores || [])
        .flatMap((gf: any) => gf.series || []);

      this.ponderacion_rest = data.ponderation_rest;
      this.ponderacion = data.ponderation_total;

     console.log('this.data_request:', this.data_request);

     this.gfactoresData = data.gfactores;

     console.log('this.gfactoresData:: ', this.gfactoresData);

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

  async guardaSerie() {
    this.loading = true;

    if (!this.addSerieForm.valid) {
      this.loading = false;
      return;
    }

    try {
      if (this.idGFactor === 0) {
        this.idGFactor = await this.obtenerOCrearGranFactorGenerico();
      }
      this.data.idGFactor = this.idGFactor;

      const message = await this.insertarFactor(this.idGFactor);
      this.showNotification('bg-green', message, 'bottom', 'right');
      this.addSerieForm.reset();
      this.dialogRef.close(true);
      return;
    } catch (err: any) {
      const errText = err?.message ?? String(err);
      this.showNotification(
        'bg-red',
        'Ocurrió un error al guardar el nuevo Factor. Error: ' + errText,
        'bottom',
        'right'
      );
    } finally {
      this.loading = false;
    }
  }

  private async obtenerOCrearGranFactorGenerico(): Promise<number> {
    const listaGF = Array.isArray(this.data?.gfactores) ? this.data.gfactores : [];
    const gfGenerico = listaGF.find(
      (gf: any) => String(gf?.label ?? '').trim().toLowerCase() === 'generico'
    );

    if (gfGenerico?.Id) {
      this.data.idGFactor = gfGenerico.Id;
      return gfGenerico.Id;
    }

    const claveGF = 'gfactor_' + (this.gfactoresData?.length ?? 0);
    const newGFactor = {
      Id: 0,
      IdFlujo: this.idFlujo,
      Clave: claveGF,
      Etiqueta: 'generico',
      Descripcion: 'Gran factor generado automáticamente'
    };

    const resulte: any = await this.organizacionService.saveNewGFactor(newGFactor);
    if (resulte?.data?.message !== 'Factor insertado correctamente') {
      throw new Error(this.translate.instant('MENUITEMS.QUIZ.GFINSERTERROR'));
    }

    const gfactor: GFactor = {
      Id: resulte.data.newId,
      id_flujo: this.idFlujo,
      value: claveGF,
      label: 'generico',
      desc: 'Gran factor generado automáticamente',
      series: []
    };

    this.gfactoresData = [...(this.gfactoresData || []), gfactor];
    this.data.gfactores = this.gfactoresData;
    this.data.idGFactor = gfactor.Id;

    return gfactor.Id;
  }

  private async insertarFactor(idGFactor: number): Promise<string> {
    const fields: Field[] = [];
    const claveSerie = 'serie_' + this.seriesData.length;
    const etiqueta = this.addSerieForm.controls['iname'].value;
    const descripcion = this.addSerieForm.controls['idesc'].value;

    const serie: Serie = {
      Id: 0,
      id_flujo: this.idFlujo,
      value: claveSerie,
      label: etiqueta,
      desc: descripcion,
      fields,
      score: 0
    };

    const newFactor = {
      IdFlujo: this.idFlujo,
      Clave: claveSerie,
      Etiqueta: etiqueta,
      Descripcion: descripcion,
      Puntaje: 0,
      IdGFactor: idGFactor
    };

    const resulte: any = await this.organizacionService.saveNewFactor(newFactor);
    if (resulte?.data?.message !== 'Factor insertado correctamente') {
      throw new Error('Ocurrió un error al guardar el nuevo Factor');
    }

    serie.Id = resulte.data.newId;

    const targetGFactor = (this.data.gfactores || []).find((gf: any) => gf.Id === idGFactor);
    if (targetGFactor) {
      if (!Array.isArray(targetGFactor.series)) {
        targetGFactor.series = [];
      }
      targetGFactor.series.push(serie);
    }

    this.data.gfactores = [...(this.data.gfactores || [])];
    this.seriesData = (this.data.gfactores || []).flatMap((gf: any) => gf.series || []);

    return resulte.data.message;
  }


}

