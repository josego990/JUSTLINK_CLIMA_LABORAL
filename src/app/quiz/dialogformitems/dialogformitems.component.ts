import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { NgxDatablex } from './ngx-datatablex.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common'; 
import { Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, 
  FormBuilder, FormGroup, FormArray
 } from '@angular/forms';
 import {
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
import { DialogAddListItemsComponent } from '../dialogaddlistvalues/dialogaddlistitems.component';
import { DialogChangeRangeComponent } from '../dialogchangerange/dialogchangerange.component';
import { Field, Serie, SeriesDataSend, QuizBank, GFactorsDataSend } from '../models/quiz-models';
import { DialogformSerieComponent } from '../dialogformserie/dialogformserie.component';
import { DialogformGFactorComponent } from '../dialogformgfactor/dialogformgfactor.component';
import { DialogLikertPresetComponent } from '../dialoglikertpreset/dialoglikertpreset.component';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@core';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { GFactor } from '../models/quiz-models'; 

import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';


import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatTooltipModule } from '@angular/material/tooltip';
import { number } from 'echarts/core';
import { DemoLimitsService } from 'app/config/demo-limits.service';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { ClimateSurveyPreviewDialogComponent } from './climate-survey-preview-dialog.component';

export interface PreguntaField {
  Id: number;
  type: string;
  name: string;
  label: string;
  required: boolean;
  score: number;
  min: number;
  max: number;
  value_correct: string;
  is_random: boolean;
  options: any[];
  is_active: number;
}

export interface FactorSerie {
  Id: number;
  value: string;
  label: string;
  desc: string;
  score: number;
  FechaCreacion: string;
  fields: PreguntaField[];
}

export interface GranFactor {
  Id: number;
  value: string;
  label: string;
  desc: string;
  FechaCreacion: string;
  series: FactorSerie[];
}

@Component({
  selector: 'app-dialogitemform',
  templateUrl: './dialogformitems.component.html',
  styleUrls: ['./dialogformitems.component.scss'],
  imports: [
    MatDialogModule,DragDropModule,TextFieldModule,
    MatTableModule,MatCardModule,MatTooltipModule,
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
    TranslateModule,
    MatInputModule,
    JoyrideModule
],

})

export class DialogformItemsComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) tablex!: DatatableComponent;

  ELEMENT_DATA: Field[] = [];
  ELEMENT_DATA_SERIES: Serie[] = [];

  dataSource = this.ELEMENT_DATA;
  dataSourceSerie = this.ELEMENT_DATA_SERIES;
  public series: { value: string; label: string; desc: string }[] = [];
  public ponderacion = 0;

  public tipoEvaluacion = 'Likert';
  public numeroLikert = '4';

  public idFlujo = 0;
  public idFactor = 0;
    public idGFactor = 0;
  public factorName = '';
  public gfactorName = '';
  public selectedFile = {};
  public general_label = '';
  public ponderacion_rest = 0;
  public seriesx: Serie[] = [];
  public gfactorsx: GFactor[] = [];

  formByFactor: Record<number, FormGroup> = {}; 

  public gfactors_data_send: GFactorsDataSend = {
    gfactores: this.gfactorsx,
    idFlujo: this.idFlujo
  };

  public selectedGFactor = 0;
  public noUsarGranFactor = false;

  public series_data_send: SeriesDataSend = {
    series: this.seriesx,
    ponderation_rest: this.ponderacion_rest,
    ponderation_total: this.ponderacion,
    idFlujo: this.idFlujo,
    idGFactor: this.idGFactor,
    gfactores: this.gfactorsx
  };

  public workbook: any | null = null;
  public jsonDatax: any | null = null;

  loading = false;
  rows = [];
  newUserImg = 'assets/images/user/user1.jpg';
  datas: NgxDatablex[] = [];
  filteredData: NgxDatablex[] = [];
  selectedOption?: string;
  SortType = SortType;
  bankData: QuizBank[] = [];
  fieldToAddBank: Field = {
    id: 0,
    type: '',
    name: '',
    label: '',
    required: false,
    score: 0,
    min: 0,
    max: 0,
    options: [],
    value_correct: '0',
    file_type: '',
    is_random: false,
    serie: '0',
    is_active: 1
  };

  displayedColumns: string[] = [

    'gfactor',
    'serie',
    'type',
    'label',
    'activate',
    'actions',
  ];

  public options_context: {
    label: string;
    value: string;
    name: string;
    is_correct: boolean;
  }[] = [];

  public selectedFieldType = 'radio';
  public selectedSerie = 'none';

  public qname = '';
  public qdesc = '';
  public addTextForm!: UntypedFormGroup;
  public addTextFormIA!: UntypedFormGroup;
  public addFileForm!: UntypedFormGroup;
  public addTextareaForm!: UntypedFormGroup;
  public addSelectForm!: UntypedFormGroup;
  public addSelectDemForm!: UntypedFormGroup;
  public addRadioForm!: UntypedFormGroup;
  public addCheckboxesForm!: UntypedFormGroup;
  public addDateForm!: UntypedFormGroup;
  public addSliderForm!: UntypedFormGroup;
  public id_card = 0;
  public title_card = '';
  public idOrganization = 0;

  public card:any = {
    id: 0,
    avatarSrc: '',
    title: '',
    subtitle: '',
    imageSrc: '',
    content: 'y',
    score: 0,
    completed: false,
    fields: [],
    granFactores: [],
    series: [],
    idOrganization: 0
  };
  public field = {
    id_quiz: 0,
    id_item: 0,
    id_type: 0,
    type: '',
    name: '',
    label: '',
    required: false,
    score: 0,
    options: [],
    value_correct: '0',
    file_type: '',
    is_random: false,
    serie: '0',
  };

  public jsonData: any = {
    organizacion: 'exmple',
    empleados: [
      {
        nombres: 'x',
        apellidos: 'x',
        numIdentificacion: 'x',
        tipoIdentificacion: 'x',
        celular: 'x',
        email: 'e',
        cargo: '',
      },
      
    ],
  };

  accessToCreateFactor = true;
  accessToCreateQuestion = true;
  accessToActiveQuestion = true;
  accessToDeleteQuestion = true;
  accessToActiveClima = true;
  accessToDeleteClima = true;
  accessToUploadExcelClima = true;

  langStoreValue?: string;

  granFactores: any[] = []; 
  questionColumns = ['drag', 'id', 'type', 'label', 'values', 'activate', 'actions'];

  trackById = (_: number, item: any) => item?.Id;

  constructor(
    private joyrideService: JoyrideService,
    private organizacionService: OrganizacionService, private authService: AuthService,
    public dialogRef: MatDialogRef<DialogformItemsComponent>,
    private fb: UntypedFormBuilder,private languageService: LanguageService,private translate: TranslateService,
    private fbx: FormBuilder,
    private demoLimitsService: DemoLimitsService,
    public dialog: MatDialog,
    public gfactordialog: MatDialog,
    public seriedialog: MatDialog,

    public bankdialog: MatDialog,
    public fdialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {

    this.options_context = [];
    this.card = data[0];
    const granFactoresFromCard = Array.isArray(this.card?.granFactores) ? this.card.granFactores : [];
    this.card.granFactores = granFactoresFromCard;
    //this.bankData = data[1];

    this.tipoEvaluacion = this.data[0].tipoEvaluacion;

    if(this.tipoEvaluacion == 'Likert-5') {
      this.numeroLikert = '5';
    }

    console.log('this.data en dialogformitems: ', this.data);

    //magia negra ;)
    this.dataSource = granFactoresFromCard
    .flatMap((granFactor: any) =>
      (granFactor.series || []).flatMap((serie: any) =>
        (serie.fields || []).map((field: any) => ({
          ...field,
          serie: serie.label,         // Nombre del factor hijo
          granFactor: granFactor.label // También se puede agregar el nombre del gran factor
        }))
      )
    );

    this.granFactores = granFactoresFromCard;

    console.log('this.granFactores en dialogformitems: ', this.granFactores);

    this.formByFactor = {};
    this.initForms(this.granFactores);

    //console.log('Form keys:', Object.keys(this.formByFactor));

    this.series_data_send.gfactores = granFactoresFromCard; 
      
    this.idFlujo = this.card.id;
    this.idOrganization = Number(
      this.card?.idOrganization ??
      this.card?.IdOrganizacion ??
      this.organizacionService.selectedOrganizationSnapshot?.Id ??
      0
    );

    const allSeries = granFactoresFromCard

    .map((gf:any) => gf.series)
    .reduce((acc:any, curr:any) => acc.concat(curr), []);

    //this.seriesx = allSeries;
    
    this.gfactorsx = granFactoresFromCard.map((gf: any) => ({
      Id: gf.Id,
      label: gf.label,
      desc: gf.desc,
      ...gf
    }));

    this.seleccionarGranFactorGenericoPorDefecto(granFactoresFromCard);

    this.dataSourceSerie = allSeries;
    //this.seriesx = allSeries;
    this.series = allSeries;

    let pon = 0;
    this.dataSourceSerie.forEach((serie) => {
      pon += serie.score || 0;
    });

    this.ponderacion = this.card.score;

    this.ponderacion_rest = this.card.score - pon;

    this.series_data_send.series = this.seriesx;
    this.series_data_send.ponderation_rest = this.ponderacion_rest;
    this.series_data_send.ponderation_total = this.ponderacion;
    this.series_data_send.idFlujo = this.idFlujo;

    this.gfactors_data_send.idFlujo = this.idFlujo;
    this.gfactors_data_send.gfactores = this.gfactorsx;

  }

  private esGranFactorGenerico(gf: any): boolean {
    return String(gf?.label ?? '').trim().toLowerCase() === 'generico';
  }

  private seleccionarGranFactorGenericoPorDefecto(granFactores: any[]): void {
    const unicoGenerico =
      granFactores.length === 1 && this.esGranFactorGenerico(granFactores[0])
        ? granFactores[0]
        : null;

    if (!unicoGenerico) {
      return;
    }

    this.selectedGFactor = unicoGenerico.Id;
    this.idGFactor = unicoGenerico.Id;
    this.series_data_send.idGFactor = unicoGenerico.Id;
    this.gfactorName = unicoGenerico.label ?? '';
    this.seriesx = Array.isArray(unicoGenerico.series) ? unicoGenerico.series : [];
  }

  getRowsArray(idFactor: number): FormArray {
    return this.formByFactor[idFactor].get('rows') as FormArray;
  }

  getRowControlValue(idFactor: number, index: number, control: string) {
    return this.getRowsArray(idFactor).at(index).get(control)?.value;
  }

  private readonly savingQuestionLabels = new Set<number>();

  async saveQuestionDescriptionIfChanged(idPregunta: number, idFactor: number, index: number): Promise<void> {
    const labelControl = this.getRowsArray(idFactor).at(index)?.get('label');
    if (!labelControl || !labelControl.dirty || this.savingQuestionLabels.has(idPregunta)) {
      return;
    }

    const newLabel = String(labelControl.value ?? '').trim();
    const storedLabel = this.getStoredQuestionLabel(idPregunta);

    if (newLabel === storedLabel) {
      labelControl.markAsPristine();
      return;
    }

    this.savingQuestionLabels.add(idPregunta);
    try {
      const saved = await this.onCellChange(idPregunta, 'label', newLabel, idFactor);
      if (saved) {
        this.updateStoredQuestionLabel(idPregunta, newLabel);
        labelControl.markAsPristine();
      }
    } finally {
      this.savingQuestionLabels.delete(idPregunta);
    }
  }

  private getStoredQuestionLabel(idPregunta: number): string {
    for (const grandFactor of this.granFactores || []) {
      for (const factor of grandFactor?.series || []) {
        const question = (factor?.fields || []).find((field: any) => Number(field?.Id) === Number(idPregunta));
        if (question) {
          return String(question?.label ?? question?.Etiqueta ?? '').trim();
        }
      }
    }

    return '';
  }

  private updateStoredQuestionLabel(idPregunta: number, label: string): void {
    const updateQuestion = (grandFactors: any[]): void => {
      for (const grandFactor of grandFactors || []) {
        for (const factor of grandFactor?.series || []) {
          for (const question of factor?.fields || []) {
            if (Number(question?.Id) === Number(idPregunta)) {
              question.label = label;
              question.Etiqueta = label;
            }
          }
        }
      }
    };

    updateQuestion(this.granFactores);
    updateQuestion(this.gfactorsx);
  }

  async onCellChange(idPregunta: number, campo: string, valor: any, idFactor: number): Promise<boolean> {
    //console.log('CAMBIO PREGUNA?', { idPregunta, campo, valor, idFactor });
    this.loading = true;
    try {
      const respunsi: any = await this.organizacionService.updatePreguntaLabel({IdPregunta:idPregunta,Etiqueta:valor});
      if(respunsi && respunsi.data.message == 'success'){
        this.showNotification(
            'bg-red',
            'Guardado',
              
            'bottom',
            'right'
          );
        return true;
      }
      return false;
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
        text: err,
        icon: 'error'
      });
      return false;
    } finally {
      this.loading = false;
    }

    // aquí llamas tu endpoint “patch pregunta”
    // this.quizService.updatePreguntaField({ Id: idPregunta, Campo: campo, Valor: valor }).subscribe(...)
  }

  getOptionLabel(opt: any): string {
  // Ajusta estos campos según tu estructura real de options
  return (
    opt?.label ??
    opt?.Etiqueta ??
    opt?.text ??
    opt?.Nombre ??
    opt?.value ??
    opt?.Valor ??
    ''
  ).toString();
}


  getByLang(row: any, esKey: string, enKey: string): string {
    const pickedKey = this.langStoreValue === 'en' ? enKey : esKey;

    // valor elegido por idioma, con fallback a la otra clave si viene vacío/undefined
    const val =
      (row?.[pickedKey] ?? '') !== '' ? row?.[pickedKey] :
      (row?.[esKey] ?? '') !== ''    ? row?.[esKey] :
      (row?.[enKey] ?? '') !== ''    ? row?.[enKey] : '';

    return String(val ?? '').trim();
  }

  private normalizeExcelText(value: any): string {
    return String(value ?? '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }

  private getClimateSurveyWorksheet(): XLSX.WorkSheet | null {
    if (!this.workbook) {
      return null;
    }

    const sheetNames = this.workbook.SheetNames || [];
    const preferredSheet = sheetNames.find((sheetName: string) => {
      const normalizedName = this.normalizeExcelText(sheetName);
      return ['ENCUESTA', 'SURVEY', 'PREGUNTAS', 'QUESTIONS'].includes(normalizedName);
    });

    const fallbackSheet = sheetNames.find((sheetName: string) => {
      const normalizedName = this.normalizeExcelText(sheetName);
      return !['INSTRUCCIONES', 'INSTRUCTIONS', 'README', 'LEEME'].includes(normalizedName);
    });

    const selectedSheetName = preferredSheet || fallbackSheet;
    return selectedSheetName ? this.workbook.Sheets[selectedSheetName] : null;
  }

  private getClimateExcelAllowedTypesText(): string {
    const allowedTypes = this.langStoreValue === 'en'
      ? ['SURVEY', 'FACTOR', 'LIKERT', 'OPEN QUESTION', 'AI QUESTION', 'RANGE', 'LIST', 'DEMOGRAPHIC LIST']
      : ['ENCUESTA', 'FACTOR', 'LIKERT', 'PREGUNTA ABIERTA', 'PREGUNTA IA', 'RANGO', 'LISTA', 'LISTA DEMOGRAFICO'];

    return allowedTypes.map((type) => `'${type}'`).join(', ');
  }

  private normalizeClimateExcelType(value: any): string {
    const normalizedType = this.normalizeExcelText(value);

    switch (normalizedType) {
      case 'ENCUESTA':
      case 'SURVEY':
      case 'GRAN FACTOR':
      case 'MAIN FACTOR':
      case 'PRINCIPAL FACTOR':
        return 'ENCUESTA';
      case 'FACTOR':
        return 'FACTOR';
      case 'LIKERT':
        return 'LIKERT';
      case 'PREGUNTA ABIERTA':
      case 'OPEN QUESTION':
        return 'PREGUNTA ABIERTA';
      case 'PREGUNTA IA':
      case 'IA QUESTION':
      case 'AI QUESTION':
        return 'PREGUNTA IA';
      case 'RANGO':
      case 'RANGE':
        return 'RANGO';
      case 'LISTA':
      case 'LIST':
        return 'LISTA';
      case 'LISTA DEMOGRAFICO':
      case 'DEMOGRAPHIC LIST':
        return 'LISTA DEMOGRAFICO';
      default:
        return '';
    }
  }

  initForms(granFactores: any[]) {
    for (const gf of (granFactores || [])) {
      console.log('GF', gf?.Id, 'series:', gf?.series?.length);

      for (const f of (gf.series || [])) {
        console.log('  Factor', f?.Id, 'fields:', f?.fields?.length);

        this.formByFactor[f.Id] = this.fbx.group({
          rows: this.fbx.array((f.fields || []).map((q: any) =>
            this.fbx.group({ Id:[q.Id], type:[q.type], label:[q.label] })
          ))
        });
      }
    }
  }


  watchFactorChanges(idFactor: number) {    
    const rows = this.getRowsArray(idFactor);

    rows.controls.forEach((ctrl, index) => {
      ctrl.valueChanges
        .pipe(debounceTime(400))
        .subscribe(v => {
          const idPregunta = v.Id;  // viene del form
          // compara con el modelo original si quieres o envía patch directo:
          console.log('AUTO PATCH', { idFactor, idPregunta, cambios: v });
        });
    });
  }

  countQuestions(gf: any): number {
    return (gf?.series || []).reduce((acc: number, s: any) => acc + (s?.fields?.length || 0), 0);
  }

  getTotalFactorCount(): number {
    return (this.granFactores || []).reduce(
      (total: number, gf: any) => total + (Array.isArray(gf?.series) ? gf.series.length : 0),
      0,
    );
  }

  getTotalQuestionCount(): number {
    return (this.granFactores || []).reduce(
      (total: number, gf: any) => total + this.countQuestions(gf),
      0,
    );
  }

  openSurveyPreview(): void {
    const granFactores = (this.granFactores ?? []).map((survey: any) => ({
      label: String(survey?.label ?? ''),
      desc: String(survey?.desc ?? ''),
      series: (survey?.series ?? []).map((factor: any) => ({
        label: String(factor?.label ?? ''),
        desc: String(factor?.desc ?? ''),
        fields: (factor?.fields ?? [])
          .filter((question: any) => Number(question?.is_active ?? question?.isActive ?? 1) !== 0)
          .map((question: any) => ({
            type: String(question?.type ?? 'text'),
            label: String(question?.label ?? question?.name ?? ''),
            name: String(question?.name ?? ''),
            min: Number(question?.min ?? 0),
            max: Number(question?.max ?? 100),
            options: (question?.options ?? []).map((option: any, index: number) => ({
              label: String(option?.label ?? option?.name ?? option?.value ?? option ?? `Opción ${index + 1}`),
              value: String(option?.value ?? option?.label ?? option?.name ?? index + 1),
            })),
          })),
      })),
    }));

    this.dialog.open(ClimateSurveyPreviewDialogComponent, {
      width: '920px',
      maxWidth: '96vw',
      maxHeight: '86vh',
      autoFocus: false,
      restoreFocus: false,
      disableClose: false,
      panelClass: 'climate-survey-preview-dialog-panel',
      data: {
        title: this.card?.title ?? '',
        subtitle: this.card?.subtitle ?? '',
        granFactores,
      },
    });
  }

  dropGranFactor(event: CdkDragDrop<any[]>) {
    if (!event?.container?.data) return;

    moveItemInArray(this.card.granFactores, event.previousIndex, event.currentIndex);
    this.card.granFactores = [...this.card.granFactores];

    // Persistir: Orden = index+1 para cada gf.Id
    const items = this.card.granFactores.map((x:any, i:any) => ({ id: x.Id, orden: i + 1 }));
    this.updateOrdenGranFactores(items);
  }

  dropFactor(event: CdkDragDrop<any[]>, gf: any) {
    if (!gf?.series) return;

    moveItemInArray(gf.series, event.previousIndex, event.currentIndex);
    gf.series = [...gf.series];

    const items = gf.series.map((x: any, i: number) => ({ id: x.Id, orden: i + 1 }));
    this.updateOrdenFactores(gf.Id, items); // gf.Id = IdGranFactor (según tu modelo)
  }

  dropQuestion(event: CdkDragDrop<any[]>, gf: any, factor: any) {
    if (!factor?.fields) return;

    moveItemInArray(factor.fields, event.previousIndex, event.currentIndex);
    factor.fields = [...factor.fields];

    const items = factor.fields.map((x: any, i: number) => ({ id: x.Id, orden: i + 1 }));
    this.updateOrdenPreguntas(factor.Id, items); // factor.Id = IdFactor
  }


  updateOrdenGranFactores(items: {id:number, orden:number}[]) {
    // this.service.updateOrdenGranFactores({ items }).subscribe(...)
    console.log('SE DETECTO DRAG DE GRAN FACTOR');
    //console.log('idGranFactor: ', id);
    console.log('items: ', items);
    console.log()

    this.organizacionService.updateGFactorsOrder({IdFlujo: this.idFlujo, items: items}).then((resp:any)=>{
      console.log('resp:: ', resp);
    });

  }

  updateOrdenFactores(idGranFactor: number, items: {id:number, orden:number}[]) {
    // this.service.updateOrdenFactores({ idGranFactor, items }).subscribe(...)
     console.log('SE DETECTO DRAG DE FACTOR');
    console.log('idGranFactor: ', idGranFactor);
    console.log('items: ', items);

    this.organizacionService.updateFactorsOrder({IdGranFactor: idGranFactor, items}).then((resp:any)=>{
      console.log('resp:: ', resp);
    });



  }

  updateOrdenPreguntas(idFactor: number, items: {id:number, orden:number}[]) {
    // this.service.updateOrdenPreguntas({ idFactor, items }).subscribe(...)
    console.log('SE DETECTO DRAG DE PREGUNTA');
    console.log('idFactor: ', idFactor);
    console.log('items: ', items);
    
    this.organizacionService.updatePreguntasOrder({IdFactor: idFactor, items}).then((resp:any)=>{
      console.log('resp:: ', resp);
    });

  }

  startEditTour(): void {
    setTimeout(() => {
      this.joyrideService.startTour({
        steps: [
          'editClimateOverview',
          'editClimateSettings',
          'editClimateFactors',
          'editClimateQuestionBuilder',
          'editClimateQuestionList'
        ],
        showPrevButton: true,
        customTexts: {
          prev: this.translate.instant('MENUITEMS.TOUR.NAV.PREV'),
          next: this.translate.instant('MENUITEMS.TOUR.NAV.NEXT'),
          done: this.translate.instant('MENUITEMS.TOUR.NAV.DONE'),
          close: this.translate.instant('MENUITEMS.TOUR.NAV.CLOSE')
        }
      }).subscribe();
    }, 100);
  }

  public ngOnInit(): void {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;

    //console.log('this.langStoreValue dialogformitem:: ', this.langStoreValue);

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    this.options_context = [];

    this.addTextForm = this.fb.group({
     
      irequired: false,
      israndom: false,
    });

    this.addTextFormIA = this.fb.group({
     
      irequired: false,
      israndom: false, 
    });

    this.addFileForm = this.fb.group({
     
      irequired: false,
      israndom: false,
    });

    this.addDateForm = this.fb.group({
     
      irequired: false,
      israndom: false,
    });

    this.addTextareaForm = this.fb.group({
     
      irequired: false,
      israndom: false,
    });

    this.addSelectForm = this.fb.group({
     
      irequired: false,
      israndom: false,
    });

    this.addSelectDemForm = this.fb.group({
     
      iname: '',
      irequired: false,
      israndom: false,
    });

    this.addRadioForm = this.fb.group({
      
      //irequired: false,
      //israndom: false,
    });

    this.addCheckboxesForm = this.fb.group({
      
      irequired: false,
      israndom: false,
    });

    this.addSliderForm = this.fb.group({
      
      ifirstvalue: [0, [Validators.required]],
      ilastvalue: [0, [Validators.required]],
      irequired: false,
      israndom: false,
    });

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
      //this.getOrganizations();
    }
    else {

      //this.authService.currentUserValue?.permissions

      //validar permisos de acciones
      const permisioncreatefactor = this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'createfactor');

      const permisioncreatequestion= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'createquestions');

      const permisionactivequestion= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'activequestions');

      const permisiondeletequestion= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'deletequestions');

      const permisionactiveclima= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'activateclima');

      const permisiondeleteclima= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'deleteclima');

      const permisionuploadexcelclima= this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'cargaexcelclima');


      if(permisioncreatefactor){
        this.accessToCreateFactor = true;
      }else{
        this.accessToCreateFactor = false;
      }

      if(permisioncreatequestion){
        this.accessToCreateQuestion = true;
      }else{
        this.accessToCreateQuestion = false;
      }

      if(permisionactivequestion){
        this.accessToActiveQuestion = true;
      }else{
        this.accessToActiveQuestion = false;
      }

      if(permisiondeletequestion){
        this.accessToDeleteQuestion = true;
      }else{
        this.accessToDeleteQuestion = false;
      }

      if(permisionactiveclima){
        this.accessToActiveClima = true;
      }else{
        this.accessToActiveClima = false;
      }

      if(permisiondeleteclima){
        this.accessToDeleteClima = true;
      }else{
        this.accessToDeleteClima = false;
      }

      if(permisionuploadexcelclima){
        this.accessToUploadExcelClima = true;
      }else{
        this.accessToUploadExcelClima = false;
      }

    }

  }

  parseFechaManual(fechaTexto: string): string | null {
    if (!fechaTexto || typeof fechaTexto !== 'string') {
      console.warn('Fecha vacía o no es string:', fechaTexto);
      return null;
    }
  
    const partes = fechaTexto.split('/');
    if (partes.length !== 3) {
      console.warn('La fecha no tiene 3 partes:', fechaTexto);
      return null;
    }
  
    const [diaStr, mesStr, anioStr] = partes;
  
    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10) - 1;
    const anio = parseInt(anioStr, 10);
  
    const fecha = new Date(anio, mes, dia);
  
    if (isNaN(fecha.getTime())) {
      console.warn('La fecha es inválida:', fechaTexto, fecha);
      return null;
    }
  
    // Retornar formato YYYY-MM-DD
    return fecha.toISOString().split('T')[0];
  }
  
  convertExcelToJSONPreguntas13(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
        return reject('No se encontró workbook');
      }
  
      const worksheet = this.getClimateSurveyWorksheet();
      if (!worksheet) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ISSUESFIND'),
          text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.NO_SURVEY_DATA_SHEET'),
          icon: 'error',
        });
        return reject('No se encontró hoja de datos.');
      }

      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
      const preguntasJSON: any = {
        idFlujo: this.idFlujo,
        preguntas: [],
      };
  
      const errores: string[] = [];
      let currentFactorKey = 0;
      let index = 1;

      rawData.forEach((row: any, idx: number) => {
        const fila = idx + 2;
        const tipo = row.TIPO;
        const etiqueta = String(row.ETIQUETA).trim();
  
        switch(localStorage.getItem('lang')){
          case 'es':
            if (!['PRINCIPAL FACTOR', 'FACTOR', 'LIKERT', 'PREGUNTA ABIERTA', 'PREGUNTA IA'].includes(tipo)  ) {
              errores.push(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}:`  
              +this.translate.instant('MENUITEMS.QUIZ.MESSAGES.INVALIDTYPE')+ 
              
              `(${tipo}).`+ this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ONLYPERMMITED') +
              `'PRINCIPAL FACTOR', 'FACTOR', 'LIKERT', 'PREGUNTA ABIERTA', 'PREGUNTA IA'`);
              return;
            }
          break;
          case 'en':
            if (!['PRINCIPAL FACTOR', 'FACTOR', 'LIKERT', 'OPEN QUESTION', 'QUESTION IA'].includes(tipo)  ) {
              errores.push(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}:`  
              +this.translate.instant('MENUITEMS.QUIZ.MESSAGES.INVALIDTYPE')+ 
              
              `(${tipo}).`+ this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ONLYPERMMITED') +
              `'PRINCIPAL FACTOR', 'FACTOR', 'LIKERT', 'OPEN QUESTION', 'QUESTION IA'`);
              return;
            }
          break;
        };

        if (!etiqueta) {
          errores.push(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}: ` + 
          this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDISREQUIRED'));
          return;
        }
  
        if(tipo == 'PRINCIPAL FACTOR'){
          //aqui la funcionalidad nueva..
        }

        if (tipo === 'FACTOR') {
          // Registrar nuevo factor (sin validar existencia)
          const newFactor = {
            idFlujo: this.idFlujo,
            Clave: `serie_${currentFactorKey}`,
            Etiqueta: etiqueta,
            Descripcion: 'na',
            Puntaje: 0,
          };
  
          preguntasJSON.preguntas.push({ tipo: 'factor', data: newFactor });
          currentFactorKey++; // Avanzar para la siguiente clave
        } 
        else { //PREGUNTAS..
          // Agregar pregunta ligada al último factor insertado
          var tipoCampo = '';  
          var tipoAbrev = '';  

          switch(localStorage.getItem('lang')){
            case 'es':
              switch(tipo) {
              case 'LIKERT':
                tipoCampo = 'radio';
                tipoAbrev = 'rad_';
              break;
              case 'PREGUNTA ABIERTA':
                tipoCampo = 'text';
                tipoAbrev = 'txt_';
              break;
              case 'PREGUNTA IA':
                tipoCampo = 'iatext';
                tipoAbrev = 'iatxt_';
              break;
            }
           
            break;
            case 'en':
              switch(tipo) {
                case 'LIKERT':
                  tipoCampo = 'radio';
                  tipoAbrev = 'rad_';
                break;
                case 'OPEN QUESTION':
                  tipoCampo = 'text';
                  tipoAbrev = 'txt_';
                break;
                case 'QUESTION IA':
                  tipoCampo = 'iatext';
                  tipoAbrev = 'iatxt_';
                break;
              }
            break;
          };

          const pregunta = {
            IdFactor: 0, // Se actualizará en el backend luego del insert del factor
            Tipo: tipoCampo,
            NombreCampo:  tipoAbrev + index,
            Etiqueta: etiqueta,
            Obligatoria: false,
            Puntaje: 0,
            ValorCorrecto: '',
            Aleatorio: false,
            Estado: 1,
            RangoMin: 0,
            RangoMax: 0
          };
  
          preguntasJSON.preguntas.push({ tipo: 'pregunta', data: pregunta });
        }

        index++;

      });
  
      if (errores.length > 0) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ISSUESFIND'),
          html: '<pre style="text-align:left">' + errores.join('\n') + '</pre>',
          icon: 'error',
        });
        return reject('Errores de validación.');
      }
  
     //console.log('Preguntas JSON:', preguntasJSON);
      resolve(preguntasJSON);
    });
  }

  convertExcelToJSONPreguntas(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      if (!this.workbook) {
        return reject('No se encontró workbook');
      }

      const worksheet = this.getClimateSurveyWorksheet();
      if (!worksheet) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ISSUESFIND'),
          text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.NO_SURVEY_DATA_SHEET'),
          icon: 'error',
        });
        return reject('No se encontró hoja de datos.');
      }

      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const preguntasJSON: any = {
        idFlujo: this.idFlujo,
        preguntas: [],
      };

      const errores: string[] = [];
      let currentGFactorKey = 0;  // contador de gran factor
      let currentFactorKey  = 0;  // contador de factor
      let index = 1;

      // banderas de contexto
      let hasCurrentGranFactor = false;
      let hasCurrentFactor     = false;

      rawData.forEach((row: any, idx: number) => {
        const fila = idx + 2;

        const tipoOriginal = this.getByLang(row, 'TIPO',       'TYPE');
        const tipo         = this.normalizeClimateExcelType(tipoOriginal);
        const etiqueta = this.getByLang(row, 'ETIQUETA',   'LABEL');
        const desc     = this.getByLang(row, 'DESCRIPCION', 'DESCRIPTION');
        const list     = this.getByLang(row, 'OPCIONES LISTA', 'OPTIONS LIST');

        if (!tipoOriginal && !etiqueta && !desc && !list) {
          return;
        }

        if (!tipo) {
          errores.push(
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}: ` +
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.INVALIDTYPE') +
            ` (${tipoOriginal || '-'}). ` + this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ONLYPERMMITED') +
            ` ${this.getClimateExcelAllowedTypesText()}`
          );
          return;
        }

        if (!etiqueta) {
          errores.push(
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}: ` +
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDISREQUIRED')
          );
          return;
        }

        // ===== ENCUESTA (antes gran factor) =====
        if (tipo === 'ENCUESTA') {
          const newGFactor = {
            idFlujo: this.idFlujo,
            Clave: `gfac_${currentGFactorKey}`,
            Etiqueta: etiqueta,
            Descripcion: desc
          };

          preguntasJSON.preguntas.push({ tipo: 'gran_factor', data: newGFactor });

          // Actualiza contexto
          currentGFactorKey++;
          hasCurrentGranFactor = true;
          hasCurrentFactor = false; // hasta que llegue el siguiente FACTOR
          return; // siguiente fila
        }

        // ===== FACTOR =====
        if (tipo === 'FACTOR') {
          if (!hasCurrentGranFactor) {
            errores.push(
              this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}: ` +
              this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FACTOR_WITHOUT_SURVEY')
            );
            return;
          }

          const newFactor = {
            idFlujo: this.idFlujo,
            Clave: `serie_${currentFactorKey}`,
            Etiqueta: etiqueta,
            Descripcion: desc,
            Puntaje: 0,
            IdGranFactor: 0
          };

          preguntasJSON.preguntas.push({ tipo: 'factor', data: newFactor });

          currentFactorKey++;
          hasCurrentFactor = true;
          return;
        }

        // ===== PREGUNTAS (LIKERT / ABIERTA / IA) =====
        // Validar que exista FACTOR activo
        if (!hasCurrentFactor) {
          errores.push(
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ROW') + ` ${fila}: ` +
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTION_WITHOUT_FACTOR')
          );
          return;
        }

        // Mapear tipo de pregunta
        let tipoCampo = '';
        let tipoAbrev = '';

        switch (tipo) {
          case 'LIKERT':
            tipoCampo = 'radio';
            tipoAbrev = 'rad_';
            break;
          case 'PREGUNTA ABIERTA':
            tipoCampo = 'text';
            tipoAbrev = 'txt_';
            break;
          case 'PREGUNTA IA':
            tipoCampo = 'iatext';
            tipoAbrev = 'iatxt_';
            break;
          case 'RANGO':
            tipoCampo = 'slider';
            tipoAbrev = 'sld_';
            break;
          case 'LISTA':
            tipoCampo = 'select';
            tipoAbrev = 'sel_';
            break;
          case 'LISTA DEMOGRAFICO':
            tipoCampo = 'selectdem';
            tipoAbrev = 'seldem_';
            break;
        }

        const pregunta = {
          IdFactor: 0,
          Tipo: tipoCampo,
          NombreCampo: tipoAbrev + index,
          Etiqueta: etiqueta,
          Obligatoria: false,
          Puntaje: 0,
          ValorCorrecto: '',
          Aleatorio: false,
          Estado: 1,
          RangoMin: 1,
          RangoMax: 10,
          Lista: list,
          Desc: desc
        };

        preguntasJSON.preguntas.push({ tipo: 'pregunta', data: pregunta });
        index++;
      });

      if (errores.length > 0) {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ISSUESFIND'),
          html: '<pre style="text-align:left">' + errores.join('\n') + '</pre>',
          icon: 'error',
        });
        return reject('Errores de validación.');
      }

      resolve(preguntasJSON);
    });
  }

  
  
  //ARCHIVO EXCEL CARGADO
  onFileSelected(event: any): void {

   //console.log('archivo seleccionado!')

    let timerInterval: any;

    Swal.fire({
      title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.LOADINGFILESURVEY'),
      html:   ' <b></b>',
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          if (b) b.textContent = this.translate.instant('MENUITEMS.QUIZ.MESSAGES.AMOMENT');
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    const file = event.target.files[0];
    if (!file) {
      console.warn('No se seleccionó ningún archivo');
      return;
    }
  
    this.selectedFile = file;
  
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      
      if (e.target && e.target.result) {
        
        const fileData = e.target.result;
  
        if (fileData instanceof ArrayBuffer) {
          
          // A) Directamente un ArrayBuffer: parseamos con XLSX
          try {
            const wb = XLSX.read(new Uint8Array(fileData), { type: 'array' });
           //console.log('Resultado de XLSX.read =>', wb);
            this.workbook = wb;

            this.convertExcelToJSONPreguntas().then((jsonReturned) => {
             //console.log('AQUI DEBERIA DE ENVIAR LA DATA...');
             console.log('jsonReturned:: ', jsonReturned);

              const incomingQuestions = Array.isArray(jsonReturned?.preguntas)
                ? jsonReturned.preguntas.filter((item: any) => item?.tipo === 'pregunta').length
                : 0;

              if (!this.canAddQuestions(incomingQuestions)) {
                Swal.close();
                return;
              }
           
              /* */
              this.organizacionService.saveNewPreguntasExcel(jsonReturned).then((result:any) => {
               //console.log('RESULTADO DEL ENVIO BATCH: ', result);

                if(result.data.message === 'Inserción de lote completada correctamente'){
                  Swal.close();
                  
                  Swal.fire({
                    title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                    text:  this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SECCESSMESSAGE'),
                    icon: 'success',
                  });

                  this.dialogRef.close(true);

                } else {
                  if (result.data.errores && result.data.errores.length > 0) {
                    Swal.fire({
                      title: 'Error!',
                      html: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FINDERROR') + '<br><pre style="text-align:left">' + result.data.errores.join('<br>') + '</pre>',
                      icon: 'error',
                      width: 600,
                    });
                  } 
                }

                //actualizar data?
                

              }).catch((error)=> {
                Swal.fire({
                  title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
                  text:  this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERRORLOADDATA') + error,
                  icon: 'error',
                });
              });
         

            }).catch((error) => {
              console.error('Error al convertir excel a json!');
            } );
          } catch (err) {
            console.error('Error leyendo el excel:', err);
          }
        } else {
         //console.log(' B) Si el resultado es otro tipo (ej. string, Blob)');
          // B) Si el resultado es otro tipo (ej. string, Blob)
          const blob = new Blob([fileData]);
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            if (ev.target && ev.target.result) {
              const arrayBuffer = ev.target.result;
              if (arrayBuffer instanceof ArrayBuffer) {
                this.workbook = XLSX.read(new Uint8Array(arrayBuffer), {
                  type: 'array',
                });
              } else {
                console.error('Error: FileReader result is not an ArrayBuffer.');
              }
            } else {
              console.error('Error: FileReader result is null or undefined.');
            }
          };
          fileReader.readAsArrayBuffer(blob);
        }
      } else {
        console.error('Error: FileReader result is null or undefined.');
      }
    };
  
    reader.readAsArrayBuffer(file);
   //console.log('será preguntas????');
      
  }

  downloadExcelTemplate(): void {
    const url = this.langStoreValue === 'en'
      ? 'https://justlink-objects.s3.us-east-1.amazonaws.com/Template_SURVEY_FORMAT_ENGLISH.xlsx'
      : 'https://justlink-clima360-objects.s3.us-east-1.amazonaws.com/Plantilla_ENCUESTA_FORMATO_ESPANOL.xlsx';

    const filename = this.langStoreValue === 'en'
      ? 'SurveyTemplate_EN.xlsx'
      : 'PlantillaEncuesta_ES.xlsx';

    const downloadUrl = encodeURI(url);

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    if (isIOS || isSafari) {
      // algunos Safari ignoran download: abre en pestaña nueva
      window.open(downloadUrl, '_blank', 'noopener');
      return;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  onGranFactorChange(event: any): void {

  this.idGFactor = event.value;

  console.log('this.idGFactor:: ', this.idGFactor);

  this.series_data_send.idGFactor = event.value;

  const selectedGF = this.card.granFactores.find((gf: GFactor) => gf.Id === this.idGFactor);

  //console.log('comou meu llamo?.. ', selectedGF);
  this.gfactorName = selectedGF.label;

  this.seriesx = selectedGF ? selectedGF.series : [];

}

   onFactorChange(factor:any): void {
   //console.log(factor);
    this.idFactor = factor.value;


    const pregunta = this.seriesx.find(p => p.Id === factor.value);

    const label = pregunta ? pregunta.label : 'No encontrado';

    this.factorName = label;

   //console.log(this.factorName);

  }

  canEditSelectedGFactor(): boolean {
    return !!this.getSelectedGFactor();
  }

  canEditSelectedFactor(): boolean {
    return !!this.getSelectedFactor();
  }

  editSelectedGFactor(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();

    const selected = this.getSelectedGFactor();
    if (!selected) {
      return;
    }

    this.openStructureQuickEdit('survey', selected);
  }

  editSelectedFactor(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();

    const selected = this.getSelectedFactor();
    if (!selected) {
      return;
    }

    this.openStructureQuickEdit('factor', selected);
  }

  private getSelectedGFactor(): any | null {
    const selectedId = Number(this.selectedGFactor || this.idGFactor);
    if (!selectedId) {
      return null;
    }

    return (this.granFactores || []).find((gf: any) => Number(gf?.Id) === selectedId) || null;
  }

  private getSelectedFactor(): any | null {
    const selectedId = Number(this.selectedSerie === 'none' ? this.idFactor : this.selectedSerie);
    if (!selectedId) {
      return null;
    }

    return (this.seriesx || []).find((factor: any) => Number(factor?.Id) === selectedId) || null;
  }

  private async openStructureQuickEdit(type: 'survey' | 'factor', item: any): Promise<void> {
    const isSurvey = type === 'survey';
    const titleKey = isSurvey ? 'MENUITEMS.QUIZ.EDIT_SURVEY_TITLE' : 'MENUITEMS.QUIZ.EDIT_FACTOR_TITLE';
    const nameLabelKey = isSurvey ? 'MENUITEMS.QUIZ.GRANDFACTORNAME' : 'MENUITEMS.QUIZ.FACTORNAME';
    const descLabelKey = isSurvey ? 'MENUITEMS.QUIZ.GRANDFACTORDESC' : 'MENUITEMS.QUIZ.FACTORDESC';
    const duplicateKey = isSurvey ? 'MENUITEMS.QUIZ.DUPLICATE_SURVEY_NAME' : 'MENUITEMS.QUIZ.DUPLICATE_FACTOR_NAME';
    const currentName = String(item?.label ?? item?.Etiqueta ?? '').trim();
    const currentDesc = String(item?.desc ?? item?.Descripcion ?? '').trim();

    const result = await Swal.fire({
      title: this.translate.instant(titleKey),
      html: `
        <div class="quiz-structure-edit">
          <label for="structure-edit-name">${this.translate.instant(nameLabelKey)}</label>
          <input id="structure-edit-name" class="swal2-input" value="${this.escapeHtml(currentName)}" maxlength="200" autocomplete="off">
          <label for="structure-edit-desc">${this.translate.instant(descLabelKey)}</label>
          <textarea id="structure-edit-desc" class="swal2-textarea" maxlength="500">${this.escapeHtml(currentDesc)}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: this.translate.instant('MENUITEMS.QUIZ.UPDATE'),
      cancelButtonText: this.translate.instant('MENUITEMS.QUIZ.CANCEL'),
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        popup: 'quiz-structure-edit-popup',
      },
      preConfirm: async () => {
        const popup = Swal.getPopup();
        const Etiqueta = (popup?.querySelector<HTMLInputElement>('#structure-edit-name')?.value || '').trim();
        const Descripcion = (popup?.querySelector<HTMLTextAreaElement>('#structure-edit-desc')?.value || '').trim();

        if (!Etiqueta) {
          Swal.showValidationMessage(this.translate.instant('MENUITEMS.QUIZ.STRUCTURE_NAME_REQUIRED'));
          return false;
        }

        try {
          if (isSurvey) {
            await this.organizacionService.updateGFactor({
              Id: item.Id,
              IdOrganizacion: this.idOrganization,
              IdFlujo: this.idFlujo,
              Etiqueta,
              Descripcion,
            });
          } else {
            await this.organizacionService.updateFactor({
              Id: item.Id,
              IdOrganizacion: this.idOrganization,
              IdFlujo: this.idFlujo,
              IdGFactor: this.idGFactor,
              Etiqueta,
              Descripcion,
            });
          }

          return { Etiqueta, Descripcion };
        } catch (error: any) {
          const apiMessage = error?.response?.status === 409
            ? this.translate.instant(duplicateKey)
            : error?.response?.data?.message;
          Swal.showValidationMessage(apiMessage || this.translate.instant('MENUITEMS.QUIZ.UPDATE_STRUCTURE_ERROR'));
          return false;
        }
      },
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    this.applyStructureQuickEdit(type, Number(item.Id), result.value.Etiqueta, result.value.Descripcion);
    this.showNotification(
      'bg-green',
      this.translate.instant('MENUITEMS.QUIZ.UPDATE_STRUCTURE_SUCCESS'),
      'bottom',
      'right'
    );
  }

  private applyStructureQuickEdit(
    type: 'survey' | 'factor',
    itemId: number,
    label: string,
    desc: string
  ): void {
    this.granFactores = (this.granFactores || []).map((gf: any) => {
      if (type === 'survey' && Number(gf?.Id) === itemId) {
        return {
          ...gf,
          label,
          Etiqueta: label,
          desc,
          Descripcion: desc,
          series: (gf?.series || []).map((factor: any) => ({
            ...factor,
            fields: (factor?.fields || []).map((field: any) => ({
              ...field,
              granFactor: label,
            })),
          })),
        };
      }

      return {
        ...gf,
        series: (gf?.series || []).map((factor: any) => {
          if (type !== 'factor' || Number(factor?.Id) !== itemId) {
            return factor;
          }

          return {
            ...factor,
            label,
            Etiqueta: label,
            desc,
            Descripcion: desc,
            fields: (factor?.fields || []).map((field: any) => ({
              ...field,
              serie: label,
            })),
          };
        }),
      };
    });

    this.refreshClimateStructureLists();
  }

  private refreshClimateStructureLists(): void {
    this.card.granFactores = this.granFactores;
    this.series_data_send.gfactores = this.granFactores;

    this.gfactorsx = (this.granFactores || []).map((gf: any) => ({
      Id: gf.Id,
      label: gf.label,
      desc: gf.desc,
      ...gf,
    }));
    this.gfactors_data_send.gfactores = this.gfactorsx;

    const selectedGF = this.getSelectedGFactor();
    this.gfactorName = selectedGF?.label ?? '';
    this.seriesx = Array.isArray(selectedGF?.series) ? [...selectedGF.series] : [];
    this.series_data_send.series = this.seriesx;

    const selectedFactor = this.getSelectedFactor();
    this.factorName = selectedFactor?.label ?? '';

    const allSeries = (this.granFactores || []).flatMap((gf: any) => gf?.series || []);
    this.dataSourceSerie = allSeries;
    this.series = allSeries;
    this.dataSource = (this.granFactores || []).flatMap((granFactor: any) =>
      (granFactor.series || []).flatMap((serie: any) =>
        (serie.fields || []).map((field: any) => ({
          ...field,
          serie: serie.label,
          granFactor: granFactor.label,
        }))
      )
    );
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  onMenuOptionClick(opcion: string): void {
   //console.log('Opción seleccionada:', opcion);
    if(opcion === 'eliminar'){
      const clima_data = {
        idClima: this.idFlujo,
        nuevoEstado: 3
      }
      this.organizacionService.updateClima(clima_data).then((resultex)=>{
        if(resultex.data.message === 'Estado del clima actualizado correctamente.'){
          Swal.fire({
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.CLIMAUPDATED'),
            icon: 'success',
          });

          this.dialogRef.close(true);
        }
      }).catch((err)=>{
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
          text: err,
          icon: 'error',
        });
      })
    }
    else if(opcion === 'desactivar'){
      const clima_data = {
        idClima: this.idFlujo,
        nuevoEstado: 2
      }
      this.organizacionService.updateClima(clima_data).then((resultex)=>{
        if(resultex.data.message === 'Estado del clima actualizado correctamente.'){
          Swal.fire({
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.CLIMAUPDATED'),
            icon: 'success',
          });

          this.dialogRef.close(true);
        }
      }).catch((err)=>{
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
          text: err,
          icon: 'error',
        });
      })
    }
  }

  

  swalConfirma(item: any): void {
    
    Swal.fire({
      title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.YOUSURE'),
      text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.YOUSUREMESSAGE'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',       // Rojo para eliminar
      cancelButtonColor: '#3085d6',     // Azul para cancelar
      confirmButtonText: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.DELETECONFIRM'),
      cancelButtonText: this.translate.instant('MENUITEMS.QUIZ.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
       //console.log('✅ Confirmado: Eliminar pregunta');
        this.deleteItem(item);
      } else {
       //console.log('❌ Cancelado por el usuario');
      }
    });

  }

  //borrar una pregunta, cambiar solo el estado
  deleteItem(item: any): void {
    this.loading = true;

   //console.log('item',item);

    const pregunta_updata_datra = { 
      "idPregunta": item.Id, 
      "nuevoEstado": 3};

    this.organizacionService.updatePregunta(pregunta_updata_datra).then((resultix)=>{
      if(resultix?.data?.message === 'Estado de la pregunta actualizado correctamente'){

        this.removePreguntaGlobal(item.Id);
        this.ponderacion_rest = this.ponderacion_rest + (Number(item?.score) || 0);

        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
          text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.DELETEDMESSAGE'),
          icon: 'success',
        });

      } else {
        Swal.fire({
          title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
          text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.DELETEDMESSAGEERROR'),
          icon: 'error',
        });
      }
    }).catch((err)=>{
      Swal.fire({
        title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
        text:  this.translate.instant('MENUITEMS.QUIZ.MESSAGES.DELETEDMESSAGEERROR'),
        icon: 'error',
      });
    }).finally(() => {
      this.loading = false;
    });

  }

  private removePreguntaGlobal(idPregunta: number): void {
    let factorIdFound: number | null = null;
    let indexFound = -1;

    this.granFactores = (this.granFactores || []).map((gf: any) => ({
      ...gf,
      series: (gf?.series || []).map((factor: any) => {
        const fields = Array.isArray(factor?.fields) ? factor.fields : [];
        const idx = fields.findIndex((q: any) => q?.Id === idPregunta);
        if (idx === -1) {
          return factor;
        }

        factorIdFound = factor?.Id ?? null;
        indexFound = idx;

        return {
          ...factor,
          fields: fields.filter((q: any) => q?.Id !== idPregunta),
        };
      }),
    }));

    if (factorIdFound !== null && indexFound >= 0) {
      const rows = this.formByFactor?.[factorIdFound]?.get('rows') as FormArray | undefined;
      if (rows && rows.length > indexFound) {
        rows.removeAt(indexFound);
      }
    }

    this.dataSource = (this.dataSource || []).filter((x: any) => x?.Id !== idPregunta);
    this.card.granFactores = this.granFactores;
    this.series_data_send.gfactores = this.granFactores;
    this.gfactors_data_send.gfactores = this.granFactores;

    const allSeries = (this.granFactores || []).flatMap((gf: any) => gf?.series || []);
    this.dataSourceSerie = allSeries;
    this.series = allSeries;

    const selectedGF = (this.granFactores || []).find((gf: any) => gf?.Id === this.idGFactor);
    this.seriesx = Array.isArray(selectedGF?.series) ? [...selectedGF.series] : [];
    this.series_data_send.series = this.seriesx;

    this.gfactorsx = (this.granFactores || []).map((gf: any) => ({
      Id: gf.Id,
      label: gf.label,
      desc: gf.desc,
      ...gf,
    }));
    this.gfactors_data_send.gfactores = this.gfactorsx;
  }

  toggleEstado(element: any, gfId: number, fId: number): void {
    this.loading = true;

    //const index = this.dataSource.indexOf(element);

    //console.log('all stars: ', {element,gfId,fId});
    
    const gf = this.granFactores.find(g => g.Id === gfId);
    if (!gf) return;

    const factor = (gf.series || []).find((s:any) => s.Id === fId);
    if (!factor) return;

    const pregunta = (factor.fields || []).find((q:any) => q.Id === element.Id);
    if (!pregunta) return;

    const index = this.dataSource.findIndex((x:any) => x.Id === element.Id);
    

    
    //console.log('Toggle estado de:', element);
    //console.log('this.granFactores: ', this.granFactores);
    
    var nuevoEstado = false;
    var nuevoEstadoInt = 0;

    if(element.is_active === 0){
     //console.log('entre en is_active 0');
      nuevoEstado = true;
      nuevoEstadoInt = 1;
    } else if(element.is_active === 1){
     //console.log('entre en is_active');
      nuevoEstado = false;
      nuevoEstadoInt = 0;
    }

    const pregunta_updata_datra = { 
      "idPregunta": element.Id, 
      "nuevoEstado": nuevoEstadoInt
    };


    this.organizacionService.updatePregunta(pregunta_updata_datra).then((resultix)=>{

      //console.log('resultix: ', resultix);

      if(resultix.data.message === 'Estado de la pregunta actualizado correctamente'){
        //console.log('index:: ', index);

        //if (index !== -1) {
          //console.log('s index:: ', index);
          this.dataSource[index].is_active = nuevoEstadoInt;
          
          pregunta.is_active = nuevoEstadoInt;

          // Forzar actualización del dataSource
          this.dataSource = [...this.dataSource];

          //console.log('dataSource después del cambio:: ', this.dataSource);
          
        //}

        this.loading = false;

      };
    }).catch((err)=>{

      this.loading = false;

      Swal.fire({
        title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
        text: err,
        icon: 'error',
      });
    });

    

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

  saveBank(fieldType: string) {
   //console.log('addBank');

    switch (fieldType) {
      case 'text':
        if (this.addTextForm.valid) {
          this.fieldToAddBank = {
            id: parseInt(this.generarUID()),
            type: 'text',
            name: 'txt_' + this.generarUID(),
            label: this.addTextForm.value.ilabel,
            required: true,
            score: 0,
            options: [],
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: true,
            serie: this.selectedSerie,
            is_active: 1
          };

      
        } else {
         //console.log('FORM NOT VALID..');
        }
        break;
      case 'radio':
        if (this.addRadioForm.valid) {
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addRadioForm.value.irequired;
          const isrand = this.addRadioForm.value.israndom;

          this.fieldToAddBank = {
            id: itemlength,
            type: 'radio',
            name: 'rad_' + itemlength.toString(),
            label: this.addRadioForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: this.options_context,
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
            is_active: 1
          };

         
        } else {
         //console.log('FORM NOT VALID..');
        }
        break;
      case 'select':
        if (this.addSelectForm.valid) {
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addSelectForm.value.irequired;
          const isrand = this.addSelectForm.value.israndom;

          this.fieldToAddBank = {
            id: itemlength,
            type: 'select',
            name: 'sel_' + itemlength.toString(),
            label: this.addSelectForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: this.options_context,
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
            is_active: 1
          };

      
        } else {
         //console.log('FORM NOT VALID..');
        }
        break;
      case 'checkboxes':
        if (this.addCheckboxesForm.valid) {
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addCheckboxesForm.value.irequired;
          const isrand = this.addCheckboxesForm.value.israndom;

          this.fieldToAddBank = {
            id: itemlength,
            type: 'checkboxes',
            name: 'chk_' + itemlength.toString(),
            label: this.addCheckboxesForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: this.options_context,
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
            is_active: 1
          };

        
        } else {
         //console.log('FORM NOT VALID..');
        }
    }
  }

  generarUID() {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const dia = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    const segundo = fecha.getSeconds().toString().padStart(2, '0');

    const uid = `${mes}${dia}${hora}${minuto}${segundo}`;

    return uid;
  }

  private getNextQuestionSequence(): number {
    const names = new Set<string>();

    for (const gf of this.granFactores || []) {
      for (const serie of gf?.series || []) {
        for (const field of serie?.fields || []) {
          const name = String(field?.name ?? '').trim();
          if (name) {
            names.add(name);
          }
        }
      }
    }

    for (const item of this.dataSource || []) {
      const name = String(item?.name ?? '').trim();
      if (name) {
        names.add(name);
      }
    }

    let max = 0;
    for (const name of names) {
      const match = name.match(/_(\d+)$/);
      if (!match) {
        continue;
      }

      const value = Number(match[1]);
      if (!Number.isNaN(value) && value > max) {
        max = value;
      }
    }

    return max + 1;
  }

  private getCurrentQuestionsCount(): number {
    return (this.granFactores || []).reduce((granFactorTotal: number, granFactor: any) => {
      const factorQuestions = (granFactor?.series || []).reduce((factorTotal: number, factor: any) => {
        const questionCount = Array.isArray(factor?.fields) ? factor.fields.length : 0;
        return factorTotal + questionCount;
      }, 0);

      return granFactorTotal + factorQuestions;
    }, 0);
  }

  private canAddQuestions(incomingCount = 1): boolean {
    const currentCount = this.getCurrentQuestionsCount();

    if (!this.demoLimitsService.exceedsLimit(
      'maxQuestionsPerClimate',
      currentCount,
      incomingCount,
    )) {
      return true;
    }

    const limit = this.demoLimitsService.getLimit('maxQuestionsPerClimate');
    const remaining = this.demoLimitsService.getRemaining('maxQuestionsPerClimate', currentCount);
    const requestedText =
      incomingCount > 1 ? ` Intentaste agregar ${incomingCount} preguntas.` : '';

    Swal.fire({
      title: 'Limite demo alcanzado',
      text:
        `Solo se puede ingresar ${limit} preguntas en este clima demo.` +
        requestedText +
        ` Actualmente existen ${currentCount} registradas y solo quedan ${remaining} espacio(s) disponibles.`,
      icon: 'warning',
    });

    return false;
  }

  onFormTextSubmitClick() {
   //console.log('Form Values', this.addTextForm.value);

    if (this.selectedSerie === 'none') {
      alert(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.MUSTSELECTFACTOR'));
    } else {
      if (this.addTextForm.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        //console.log('valid');

        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.general_label
          )
        ) {
          this.showNotification(
            'bg-red',
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDEXIST') +
              this.general_label,
              
            'bottom',
            'right'
          );
        } else {
          // this.dataSourceSerie[0].fields.push();
          this.loading = true;

          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addTextForm.value.irequired;
          const isrand = this.addTextForm.value.israndom;

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'text',
            "NombreCampo": 'txt_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": 0,
            "RangoMax": 0,
            "Lista": "",
            "Desc": ""
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });

              var newIdInserted = responsy.data.newId;
              const newField = {
                Id: newIdInserted,
                type: 'text',
                name: 'txt_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: 0,
                max: 0,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: this.options_context ?? [],
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);

              rows.push(this.fb.group({
                Id:    [newField.Id],
                type:  [newField.type],
                label: [newField.label],
                  is_active: 1
                // agrega también todos los controles que tu fila use en el template:
                // required: [nf.required],
                // min: [nf.min],
                // max: [nf.max],
                // is_active: [nf.is_active],
                // options: [nf.options],
              }));              

               
              this.options_context = [];
            }
          }).catch((err)=>{
            this.loading = false;
            Swal.fire({
              title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
              text: err,
              icon: 'warning',
            });
          });

        };
      } else {
       //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  addPreguntaToFactor(newField: any) {
    const gfId = this.idGFactor;
    const fId  = this.idFactor;

    // Validación rápida
    const gfExists = this.granFactores?.some(g => g.Id === gfId);
    if (!gfExists) {
      console.warn('No existe GranFactor con Id:', gfId);
      return;
    }

    this.granFactores = this.granFactores.map(gf => {
      if (gf.Id !== gfId) return gf;

      return {
        ...gf,
        series: (gf.series || []).map((f:any) => {
          if (f.Id !== fId) return f;

          const fields = Array.isArray(f.fields) ? f.fields : [];

          // Inserta al final (o donde quieras)
          return {
            ...f,
            fields: [...fields, newField]
          };
        })
      };
    });
  }


  onFormTextIASubmitClick() {
   //console.log('Form Values', this.addTextFormIA.value);

    if (this.selectedSerie === 'none') {
      alert(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.MUSTSELECTFACTOR'));
    } else {
      if (this.addTextFormIA.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        //console.log('valid');

        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.general_label
          )
        ) {
          this.showNotification(
            'bg-red',
            this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDEXIST')  +
              this.general_label +
              '"',
            'bottom',
            'right'
          );
        } else {
          // this.dataSourceSerie[0].fields.push();
          this.loading = true;
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addTextFormIA.value.irequired;
          const isrand = this.addTextFormIA.value.israndom;

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'iatext',
            "NombreCampo": 'iatxt_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": 0,
            "RangoMax": 0,
            "Lista": "",
            "Desc": ""
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });
    
              var newIdInserted = responsy.data.newId;

              const newField = {
                Id: newIdInserted,
                type: 'iatext',
                name: 'iatxt_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: 0,
                max: 0,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: this.options_context ?? [],
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);
                rows.push(this.fb.group({
                  Id:    [newField.Id],
                  type:  [newField.type],
                  label: [newField.label],
                  is_active: 1
                  // agrega también todos los controles que tu fila use en el template:
                  // required: [nf.required],
                  // min: [nf.min],
                  // max: [nf.max],
                  // is_active: [nf.is_active],
                  // options: [nf.options],
                }));
              
              
              this.options_context = [];
              this.loading = false;
            }
          }).catch((err)=>{
            this.loading = false;
            Swal.fire({
              title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
              text: err,
              icon: 'warning',
            });
          });

        };
      } else {
       //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

/*
  onFormFileSubmitClick() {
    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addFileForm.valid) {
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addFileForm.value.iname
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.addFileForm.value.iname +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addFileForm.value.irequired;
          const isrand = this.addFileForm.value.israndom;

          this.dataSource.push({
            id: itemlength,
            type: 'file',
            name: 'file_' + itemlength.toString(),
            label: this.addFileForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          const serieEncontrada = this.dataSourceSerie.find(
            (serie) => serie.label  === this.selectedSerie
          );
          serieEncontrada?.fields.push({
            id: itemlength,
            type: 'file',
            name: 'file_' + itemlength.toString(),
            label: this.addFileForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          this.dataSource = [...this.dataSource];

         //console.log(this.dataSource);

          const clabel = this.addFileForm.get('ilabel');

          clabel?.setValue('');

          globalDataItems.next(this.dataSource);

          this.showNotification(
            'bg-red',
            'Se agregó un nuevo ítem',
            'bottom',
            'right'
          );
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  onFormDateSubmitClick() {
    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addDateForm.valid) {
        //console.log('valid');

        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addDateForm.value.iname
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.addDateForm.value.iname +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addDateForm.value.irequired;
          const isrand = this.addDateForm.value.israndom;

          this.dataSource.push({
            id: itemlength,
            type: 'date',
            name: 'date_' + itemlength.toString(),
            label: this.addDateForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          const serieEncontrada = this.dataSourceSerie.find(
            (serie) => serie.label  === this.selectedSerie
          );
          serieEncontrada?.fields.push({
            id: itemlength,
            type: 'date',
            name: 'date_' + itemlength.toString(),
            label: this.addDateForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          this.dataSource = [...this.dataSource];

         //console.log(this.dataSource);

          const cname = this.addDateForm.get('iname');
          const clabel = this.addDateForm.get('ilabel');

          cname?.setValue('');
          clabel?.setValue('');

          globalDataItems.next(this.dataSource);

          this.showNotification(
            'bg-red',
            'Se agregó un nuevo ítem',
            'bottom',
            'right'
          );
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  onFormTextareaSubmitClick() {
    //console.log('Form Values', this.addTextForm.value);

    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addTextareaForm.valid) {
        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addTextareaForm.value.iname
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.addTextareaForm.value.iname +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addTextareaForm.value.irequired;
          const isrand = this.addTextareaForm.value.israndom;

          this.dataSource.push({
            id: itemlength,
            type: 'textarea',
            name: 'txa_' + itemlength.toString(),
            label: this.addTextareaForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: this.addSliderForm.value.ifirstvalue,
            max: this.addSliderForm.value.ilastvalue,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          const serieEncontrada = this.dataSourceSerie.find(
            (serie) => serie.label  === this.selectedSerie
          );
          serieEncontrada?.fields.push({
            id: itemlength,
            type: 'textarea',
            name: 'txa_' + itemlength.toString(),
            label: this.addTextareaForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: [],
            min: this.addSliderForm.value.ifirstvalue,
            max: this.addSliderForm.value.ilastvalue,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          this.dataSource = [...this.dataSource];

         //console.log(this.dataSource);

          const clabel = this.addTextareaForm.get('ilabel');

          clabel?.setValue('');

          globalDataItems.next(this.dataSource);

          this.showNotification(
            'bg-red',
            'Se agregó un nuevo ítem',
            'bottom',
            'right'
          );
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  
*/
  
  //likert
  onFormRadioSubmitClick() {
   //console.log('onFormRadioSubmitClick', this.addTextForm.value);
   //console.log('SERIE SELECCIONADA:', this.selectedSerie);
    if (this.selectedSerie === 'none') {
      alert(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.MUSTSELECTFACTOR'));
    } else {
      if (this.addRadioForm.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        this.loading = true;
        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addRadioForm.value.iname
          )
        ) {
          this.loading = false;
          Swal.fire({
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.NOTPERMMITED'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDEXIST') +
              this.addRadioForm.value.iname +
              '"',
            icon: 'warning',
          });

        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addRadioForm.value.irequired;
          const isrand = this.addRadioForm.value.israndom;

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'radio',
            "NombreCampo": 'rad_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": 0,
            "RangoMax": 0,
            "Lista": "",
            "Desc": ""
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });
    
               var newIdInserted = responsy.data.newId;

              const likertLevels: 4 | 5 = this.numeroLikert === '5' ? 5 : 4;

              const newField = {
                Id: newIdInserted,
                type: 'radio',
                name: 'rad_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: 0,
                max: 0,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: this.getDefaultLikertOptions(likertLevels),
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);
                rows.push(this.fb.group({
                  Id:    [newField.Id],
                  type:  [newField.type],
                  label: [newField.label],
                  options: [newField.options],
                  is_active: 1
                  // agrega también todos los controles que tu fila use en el template:
                  // required: [nf.required],
                  // min: [nf.min],
                  // max: [nf.max],
                  // is_active: [nf.is_active],
                  // options: [nf.options],
                }));
    
           
              //const clabel = this.addRadioForm.get('ilabel');  
              //clabel?.setValue('');  
              //globalDataItems.next(this.dataSource);  
              this.options_context = [];
            }
          }).catch((err)=>{
            this.loading = false;
            Swal.fire({
              title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
              text: err,
              icon: 'error',
            });
          });

          

        }
      } else {

      }
    }

  };

  /*
  onFormCheckboxesSubmitClick() {
    //console.log('Form Values', this.addTextForm.value);
    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addCheckboxesForm.valid) {
        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addCheckboxesForm.value.iname
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.addCheckboxesForm.value.iname +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addCheckboxesForm.value.irequired;
          const isrand = this.addCheckboxesForm.value.israndom;

          const v_p = {
            id: itemlength,
            type: 'checkboxes',
            name: 'chk_' + itemlength.toString(),
            label: this.addCheckboxesForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: this.options_context,
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          };

          this.dataSource.push(v_p);

          const serieEncontrada = this.dataSourceSerie.find(
            (serie) => serie.label  === this.selectedSerie
          );
          serieEncontrada?.fields.push({
            id: itemlength,
            type: 'checkboxes',
            name: 'chk_' + itemlength.toString(),
            label: this.addCheckboxesForm.value.ilabel,
            required: isrequired,
            score: 0,
            options: this.options_context,
            min: 0,
            max: 0,
            value_correct: '1',
            file_type: '',
            is_random: isrand,
            serie: this.selectedSerie,
          });

          this.dataSource = [...this.dataSource];

         //console.log(this.dataSource);

          const clabel = this.addCheckboxesForm.get('ilabel');

          clabel?.setValue('');

          globalDataItems.next(this.dataSource);

          this.options_context = [];

          this.showNotification(
            'bg-red',
            'Se agregó un nuevo ítem',
            'bottom',
            'right'
          );
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  

  ponderacionRestValidator(control: any) {
    const enteredValue = parseFloat(control.value);
    const maxPonderacion = this.ponderacion_rest;

    if (!isNaN(enteredValue) && enteredValue > maxPonderacion) {
      return { ponderacionExcede: true };
    }

    return null;
  }
*/

  onFormSliderSubmitClick() {

    if (this.selectedSerie === 'none') {
      alert(this.translate.instant('MENUITEMS.QUIZ.MESSAGES.MUSTSELECTFACTOR'));
    } 
    else {
      if (this.addSliderForm.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        this.loading = true;
        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.addSliderForm.value.iname
          )
        ) {
          this.loading = false;
          Swal.fire({
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.NOTPERMMITED'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FIELDEXIST') +
              this.addSliderForm.value.iname +
              '"',
            icon: 'warning',
          });

        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addSliderForm.value.irequired;
          const isrand = this.addSliderForm.value.israndom;

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'slider',
            "NombreCampo": 'sld_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": this.addSliderForm.value.ifirstvalue,
            "RangoMax": this.addSliderForm.value.ilastvalue,
            "Lista": "",
            "Desc": ""
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });

             
    
              var newIdInserted = responsy.data.newId;

              const newField = {
                Id: newIdInserted,
                type: 'slider',
                name: 'sld_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: this.addSliderForm.value.ifirstvalue,
                max: this.addSliderForm.value.ilastvalue,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: [],
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);
                rows.push(this.fb.group({
                  Id:    [newField.Id],
                  type:  [newField.type],
                  label: [newField.label],
                  options: [newField.options],
                  // agrega también todos los controles que tu fila use en el template:
                  // required: [nf.required],
                   min: [newField.min],
                   max: [newField.max],
                  is_active: 1
                  // options: [nf.options],
                }));


         
              this.options_context = [];
            }
          }).catch((err)=>{
            this.loading = false;
            Swal.fire({
              title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
              text: err,
              icon: 'error',
            });
          });

          
        }
      } else {

      }
    }

  }

  onFormSelectSubmitClick() {
    //console.log('Form Values', this.addTextForm.value);

    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addSelectForm.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.general_label
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.general_label +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          this.loading = true;
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addSelectForm.value.irequired;
          const isrand = this.addSelectForm.value.israndom;

          var lista_pipe = "";

          this.options_context.forEach((option) => {
            lista_pipe += "|" + option.label; 
          });

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'select',
            "NombreCampo": 'sel_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": 0,
            "RangoMax": 0,
            "Lista": lista_pipe,
            "Desc": ""
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });

        

                 var newIdInserted = responsy.data.newId;

              const newField = {
                Id: newIdInserted,
                type: 'select',
                name: 'sel_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: 0,
                max: 0,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: this.options_context,
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);
                rows.push(this.fb.group({
                  Id:    [newField.Id],
                  type:  [newField.type],
                  label: [newField.label],
                  options: [newField.options],
                  // agrega también todos los controles que tu fila use en el template:
                  // required: [nf.required],
                   min: [newField.min],
                   max: [newField.max],
                  is_active: 1
                  // options: [nf.options],
                }));

              
              this.options_context = [];

              this.showNotification(
                'bg-red',
                'Se agregó un nuevo ítem',
                'bottom',
                'right'
              );

            }
          });

          
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }

  onFormSelectDemSubmitClick() {
    //console.log('Form Values', this.addTextForm.value);

    if (this.selectedSerie === 'none') {
      alert('Debe seleccionar un Factor para la pregunta');
    } else {
      if (this.addSelectDemForm.valid) {
        if (!this.canAddQuestions()) {
          return;
        }

        //console.log('valid');
        //validar si existe nombre del campo
        if (
          this.dataSource.some(
            (item) => item.name === this.general_label
          )
        ) {
          this.showNotification(
            'bg-red',
            'Ya existe un nombre de campo "' +
              this.general_label +
              '"',
            'bottom',
            'right'
          );
        } else {
          //if(this.ponderacion_rest)
          const itemlength = this.getNextQuestionSequence();
          const isrequired = this.addSelectDemForm.value.irequired;
          const isrand = this.addSelectDemForm.value.israndom;

          var lista_pipe = "";

          this.options_context.forEach((option) => {
            lista_pipe += "|" + option.label; 
          });

          //INSERTAR NUEVO
          const preguntame_cao = {
            "IdFactor": this.idFactor,
            "Tipo": 'selectdem',
            "NombreCampo": 'seldem_' + itemlength.toString(),
            "Etiqueta": this.general_label,
            "Obligatoria": true,
            "Puntaje": 0,
            "ValorCorrecto": false,            
            "Aleatorio": false,
            "RangoMin": 0,
            "RangoMax": 0,
            "Lista": lista_pipe,
            "Desc": this.general_label,
          }

          this.organizacionService.saveNewPregunta(preguntame_cao).then((responsy:any)=>{
           //console.log('RESPUESTA A GUARDADO DE PREGUNTA:: ', responsy);
      
            if(responsy.data.message === 'Pregunta insertada correctamente'){
              this.loading = false;
              Swal.fire({
                title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
                text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.QUESTIONADDED'),
                icon: 'success',
              });

              const v_p = {
                id: itemlength,
                granFactor: this.gfactorName,
                type: 'select',
                name: 'sel_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                options: this.options_context,
                min: 0,
                max: 0,
                value_correct: '1',
                file_type: '',
                is_random: isrand,
                serie: this.factorName,
                is_active: 1
              };

              
                 var newIdInserted = responsy.data.newId;

              const newField = {
                Id: newIdInserted,
                type: 'select',
                name: 'sel_' + itemlength.toString(),
                label: this.general_label,
                required: isrequired,
                score: 0,
                min: 0,
                max: 0,
                value_correct: '1',
                is_random: isrand,
                file_type: '',
                serie: this.factorName,
                options: this.options_context,
                is_active: 1
              };

              this.addPreguntaToFactor(newField);

              const rows = this.getRowsArray(this.idFactor);
                rows.push(this.fb.group({
                  Id:    [newField.Id],
                  type:  [newField.type],
                  label: [newField.label],
                  options: [newField.options],
                  // agrega también todos los controles que tu fila use en el template:
                  // required: [nf.required],
                   min: [newField.min],
                   max: [newField.max],
                  is_active: 1
                  // options: [nf.options],
                }));

             

              this.options_context = [];

              this.showNotification(
                'bg-red',
                'Se agregó un nuevo ítem',
                'bottom',
                'right'
              );

            }
          });

          
        }
      } else {
        //console.log('form is not valid');
      }
    }

    //this.closeDialog();
  }
  
  openValuesEditor(row: any, type: string, factorId: number, index: number) {
    // row.Id = IdPregunta
    // type = 'radio' | 'select' | 'selectdem' | 'slider'

    if (type === 'radio') {
      this.openLikertPresetDialog(row);
      return;
    }

    if (type === 'slider') {
      // abrir modal para editar min/max
      // this.openSliderDialog(row);
      console.log('Editar rango', { idPregunta: row.Id, min: row.min, max: row.max });

      this.openEditRangeValuesDialog(row);

      return;
    }

    if (type === 'select' || type === 'selectdem') {
      // abrir modal para agregar/quitar opciones
      // this.openOptionsDialog(row);
      console.log('Editar opciones', { idPregunta: row.Id, options: row.options });

      this.openAddListValuesDialog(row);

      return;
    }
  }

  private getLikertLevels(row: any): 4 | 5 {
    const configuredLevels: 4 | 5 = this.numeroLikert === '5' ? 5 : 4;
    if (configuredLevels === 5) {
      return 5;
    }

    const fromOptions = Array.isArray(row?.options) ? row.options.length : 0;
    if (fromOptions === 4 || fromOptions === 5) {
      return fromOptions as 4 | 5;
    }

    return configuredLevels;
  }

  private openLikertPresetDialog(row: any): void {
    const niveles = this.getLikertLevels(row);

    const dialogRef = this.dialog.open(DialogLikertPresetComponent, {
      width: '650px',
      disableClose: true,
      data: {
        levels: niveles,
        currentOptions: row.options || [],
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result?.options?.length) {
        return;
      }

      const opcionesNormalizadas = (result.options || []).map((opt: any, i: number) => {
        const valor = this.getLikertOptionValue(niveles, i);
        return {
          ...opt,
          value: valor,
          name: valor,
        };
      });

      const dataSend = {
        IdPregunta: row.Id,
        Opciones: opcionesNormalizadas.map((opt: any, i: number) => ({
          Valor: opt.value,
          Etiqueta: opt.label ?? '',
          Orden: i + 1,
        })),
      };

      try {
        this.loading = true;
        const resp: any = await this.organizacionService.updatePreguntaLikertOptions(dataSend);

        if (resp?.data?.message === 'success' || resp?.data?.message === 'Opciones Likert actualizadas correctamente') {
          this.syncLikertOptionsGlobal(row.Id, opcionesNormalizadas);
          this.showNotification(
            'bg-green',
            'Se actualizaron los valores Likert',
            'bottom',
            'right'
          );
          return;
        }

        this.showNotification(
          'bg-red',
          'No fue posible actualizar las opciones Likert',
          'bottom',
          'right'
        );
      } catch (err: any) {
        this.showNotification(
          'bg-red',
          'Error al actualizar opciones Likert. Error: ' + (err?.message ?? String(err)),
          'bottom',
          'right'
        );
      } finally {
        this.loading = false;
      }
    });
  }

  private getDefaultLikertOptions(levels: 4 | 5): any[] {
    const labels4 = [
      'TOTALMENTE DE ACUERDO',
      'DE ACUERDO',
      'EN DESACUERDO',
      'TOTALMENTE EN DESACUERDO',
    ];

    const labels5 = [
      'TOTALMENTE DE ACUERDO',
      'DE ACUERDO',
      'NI DE ACUERDO NI EN DESACUERDO',
      'EN DESACUERDO',
      'TOTALMENTE EN DESACUERDO',
    ];

    const labels = levels === 5 ? labels5 : labels4;

    return labels.map((label, index) => {
      const value = this.getLikertOptionValue(levels, index);
      return {
        value,
        name: value,
        label,
        is_correct: false,
      };
    });
  }

  private getLikertOptionValue(levels: 4 | 5, index: number): string {
    if (levels === 5) {
      const map5 = ['opt_1', 'opt_2', 'opt_0', 'opt_3', 'opt_4'];
      return map5[index] ?? `opt_${index + 1}`;
    }

    return `opt_${index + 1}`;
  }

  private syncLikertOptionsGlobal(idPregunta: number, opciones: any[]): void {
    const normalized = (opciones || []).map((opt: any, i: number) => ({
      value: opt?.value ?? `opt_${i + 1}`,
      name: opt?.name ?? `opt_${i + 1}`,
      label: opt?.label ?? '',
      is_correct: !!opt?.is_correct,
    }));

    for (const gf of (this.granFactores || [])) {
      for (const factor of (gf?.series || [])) {
        const pregunta = (factor?.fields || []).find((q: any) => q?.Id === idPregunta);
        if (pregunta) {
          pregunta.options = [...normalized];
        }
      }
    }

    this.card.granFactores = this.granFactores;
    this.series_data_send.gfactores = this.granFactores;
    this.gfactors_data_send.gfactores = this.granFactores;

    this.dataSource = (this.dataSource || []).map((item: any) =>
      item?.Id === idPregunta ? { ...item, options: [...normalized] } : item
    );

    const selectedGF = (this.granFactores || []).find((gf: any) => gf?.Id === this.idGFactor);
    this.seriesx = Array.isArray(selectedGF?.series) ? [...selectedGF.series] : this.seriesx;
    this.gfactorsx = (this.granFactores || []).map((gf: any) => ({
      Id: gf.Id,
      label: gf.label,
      desc: gf.desc,
      ...gf,
    }));
  }

  //abrir dialogo agregar valores lista
  openDialog(): void {
    console.log('se ha abierto el dialog y el valor de options_context es: ', this.options_context);

    this.dialog.open(DialogSelectItemsComponent, {
      width: '500px',
      data: this.options_context,
    });

  }

  openAddListValuesDialog(data:any): void {
    console.log('se ha abierto el dialog y el valor de data es: ', data);

    var options_context_data: {
      label: string;
      value: string;
      name: string;
      is_correct: boolean;
    }[] = data.options;

    this.dialog.open(DialogAddListItemsComponent, {
      width: '500px',
      data: {options:options_context_data,idPregunta:data.Id },
    });

  }

  openEditRangeValuesDialog(data:any): void {
    //console.log('se ha abierto el dialog y el valor de data es: ', data);

   

    this.dialog.open(DialogChangeRangeComponent, {
      width: '500px',
      data: data,
    });

  }


  

  closeDialog(): void {
    console.log('se ha cerrado el dialog y el valor de options_context es: ', this.options_context);
    this.options_context = [];
    //this.dialog.closeAll();
    this.dialogRef.close(true);
  }


  //DIALOGO AGREGARE FACTORES / SERIES
  openDialogSerie(data_sent: SeriesDataSend): void {
    
    console.log('series_data_send::', this.series_data_send);

    const dialogRef = this.seriedialog.open(DialogformSerieComponent, {
      id: 'dialogserie',
      width: '50%',
      disableClose: true,
      data: data_sent,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.created && result?.factor) {
        this.syncAfterSerieDialog(result.factor, result.idGFactor);
      }
    });
  }

  private syncAfterSerieDialog(createdFactor?: Serie, createdGFactorId?: number): void {
    const updatedGranFactores = Array.isArray(this.series_data_send.gfactores)
      ? this.series_data_send.gfactores
      : [];

    this.card.granFactores = updatedGranFactores;
    this.granFactores = updatedGranFactores;

    this.gfactorsx = updatedGranFactores.map((gf: any) => ({
      Id: gf.Id,
      label: gf.label,
      desc: gf.desc,
      ...gf,
    }));
    this.gfactors_data_send.gfactores = this.gfactorsx;

    const selectedGFactorId = createdGFactorId || this.series_data_send.idGFactor || this.idGFactor;
    if (selectedGFactorId) {
      this.selectedGFactor = selectedGFactorId;
      this.idGFactor = selectedGFactorId;
      this.series_data_send.idGFactor = selectedGFactorId;

      const selectedGF = updatedGranFactores.find((gf: any) => gf.Id === selectedGFactorId);
      this.gfactorName = selectedGF?.label ?? '';
      this.seriesx = Array.isArray(selectedGF?.series) ? [...selectedGF.series] : [];
    } else {
      this.seleccionarGranFactorGenericoPorDefecto(updatedGranFactores);
    }

    const allSeries = updatedGranFactores.flatMap((gf: any) => gf.series || []);
    this.dataSourceSerie = allSeries;
    this.series = allSeries;
    this.series_data_send.series = this.seriesx;

    if (createdFactor?.Id) {
      this.idFactor = createdFactor.Id;
      (this as any).selectedSerie = createdFactor.Id;
      this.factorName = createdFactor.label ?? '';
    }

    this.formByFactor = {};
    this.initForms(this.granFactores);
  }

  openDialogGFactor(gfactors_data_send: GFactorsDataSend): void {
    
    const dialogRef = this.gfactordialog.open(DialogformGFactorComponent, {
      id: 'dialoggfactor',
      width: '50%',
      disableClose: true,
      data: gfactors_data_send,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.created && result?.gfactor) {
        this.series_data_send.gfactores = Array.isArray(this.gfactors_data_send.gfactores)
          ? this.gfactors_data_send.gfactores
          : [];
        this.series_data_send.idGFactor = result.gfactor.Id;
        this.syncAfterSerieDialog(undefined, result.gfactor.Id);
        (this as any).selectedSerie = 'none';
        this.idFactor = 0;
        this.factorName = '';
      }
    });
  }
  
  


}
