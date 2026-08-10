import { Serie } from './../models/quiz-models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup,UntypedFormBuilder,
 } from '@angular/forms';
import { globalData } from '../global-data';
import { Quiz, QuizBank, Field } from '../models/quiz-models';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { DemoLimitsService } from 'app/config/demo-limits.service';
import { Subscription } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dialogform',
  standalone: true, 
  templateUrl: './dialogform.component.html',
  styleUrls: ['./dialogform.component.scss'],
  imports: [

    MatDialogModule, TranslateModule,
    MatTableModule, MatProgressSpinnerModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,

    

    ],
})
// Aquí se crea el nuevo quiz
export class DialogformComponent implements OnDestroy, OnInit {

  public idOrganization =  1;
  public organizationName = '';
  public dataSourceOrganizations:any = [];

  cardsData: Quiz[] = [];

  public categories = [{}];
  public selectedCategory = '';
  public selectedUnits = '';
  categoriesList: string[] = [];
  bankData: QuizBank[] = [];
  unitList: string[] = [];
  totalQuestionsSelected = 0;
  public metodoAplicacion = 0;

  public qname = '';
  public qdesc = '';
  public addCusForm!: UntypedFormGroup;
  public addBankForm!: UntypedFormGroup;
  public selectedFieldType = '1'
  langStoreValue?: string;

  loadingOrganizations = false;
  private selectedOrganizationSubscription?: Subscription;

  url: string | null = null;
    fileName = '';

  fileChange = false;
   formFileData = new FormData();

  

  constructor(
    private fb: UntypedFormBuilder, private languageService: LanguageService,private translate: TranslateService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogformComponent>, 
    private organizacionService: OrganizacionService, private authService: AuthService,
    private demoLimitsService: DemoLimitsService,

    @Inject(MAT_DIALOG_DATA) public data: QuizBank[],
    ) {
     //console.log('data:', data );

      this.bankData = data;

      this.getCategoriesDistinctList();


    }

  public ngOnInit(): void {

    this.url = 'https://justlink-objects.s3.us-east-1.amazonaws.com/';

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });
    

    this.addCusForm = this.fb.group({
      IdOrganization: [this.idOrganization, Validators.required],
      IdProof: [1, Validators.required],
      quizName: [this.qname, [Validators.required]],
      quizDesc: [this.qdesc, [Validators.required]],
      //urlImg: [null],
      //score: 100,
      //startDate: '',
      //endDate: '',
      MetodoAplicacion: [1, Validators.required],
      //Frecuencia: ['', Validators.required],
      //EstimadoMinutos: [null, [Validators.required, Validators.min(1)]],
      //Anonimato: [false]
    }); 

    this.addBankForm = this.fb.group({
      IdProof: null,
      quizName: [
        this.qname,
        [Validators.required],
      ],
      quizDesc: [
        this.qdesc,
        [Validators.required],
      ],
      urlImg: [null, [Validators.required]],
      score: 100,
      startDatex: ['', [Validators.required]],
      endDatex: ['', [Validators.required]],
      category: ['', [Validators.required]],
      totalQuestions: [0, [Validators.required , this.questionRestValidator.bind(this)]],
      units: [0, [Validators.required]],
    });

    this.setupSelectedOrganizationListener();

    
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.idOrganization = 0;
        this.organizationName = '';
        this.dataSourceOrganizations = [];
        this.addCusForm.patchValue({ IdOrganization: null });
        return;
      }

      this.dataSourceOrganizations = [organization];
      this.idOrganization = organization.Id;
      this.organizationName = organization.Nombre;
      this.addCusForm.patchValue({ IdOrganization: organization.Id });
    });
  }

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) { return; }

    const file = input.files[0];

    /* 1) Vista previa (lo que ya haces) */
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.url = reader.result as string;
      //this.userForm.patchValue({ imagenUrl: this.url });
    };

    /* 2) Envío al backend */
    const formData = new FormData();
    // El nombre **file** debe coincidir con .array('file', 1) en tu ruta Express
    formData.append('file', file, file.name);

    this.fileName = file.name;

    this.formFileData = formData;
    
    this.fileChange = true;

  }

  getOrganizations(): void {

    this.loadingOrganizations = true;

    this.organizacionService.getOrganizations()
        .then((response:any) => {
         //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
          this.loadingOrganizations = false;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
          
        });
  }

  getOrganizationById(idOrganization:any): void {

    //console.log('idOrganization', idOrganization);

    this.loadingOrganizations = true;

    this.organizacionService.getOrganizationById(idOrganization)
      .then((response:any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        this.idOrganization = idOrganization;
      


        this.addCusForm.patchValue({ IdOrganization: idOrganization });
        //this.addCusForm.patchValue({ IdProof: "1" });
        this.loadingOrganizations = false;
        

      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }

  getCategoriesDistinctList() {
    
    this.bankData.forEach(element => {
      if(!this.categoriesList.includes(element.category)) {
        this.categoriesList.push(element.category);
      }
    });

   //console.log('this.categoriesList',this.categoriesList);
    
  }

  questionRestValidator(control: any) {
    const enteredValue = parseFloat(control.value);
    const maxQuestions = this.totalQuestionsSelected;

   //console.log('enteredValue',enteredValue);
   //console.log('maxQuestions',maxQuestions);

    if (!isNaN(enteredValue) && enteredValue > maxQuestions) {
      return { 'preguntasExcede': true };
    }

    return null;
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  categoryChange(){
    
    this.unitList = [];

    this.bankData.forEach(element => {
      if(element.category == this.selectedCategory) {
        this.unitList.push(element.unit + " (" + element.fields.length.toString() + " preguntas)");
      }
    });

  }

  onOrganizationChange(event: any) {
   //console.log('Se seleccionó el evento:', event);
    // Aquí haces lo que necesites con el ID
    const selectedText = event.source.selected.viewValue;

   //console.log('selectedTex:: ', selectedText);

    if(event.value > 0){
      this.idOrganization = event.value;      
      this.organizationName = selectedText;
    }
    
  }

  unitsChange() {
    const totalPreguntasDisponibles = this.sumarValoresNumericos(this.selectedUnits.toString());
    this.totalQuestionsSelected = totalPreguntasDisponibles;
   //console.log('Preguntas:',this.totalQuestionsSelected);
  }

  onTypeChange(selected: number){
    const selectedType = Number(selected);
    console.log('selected:: ', selectedType);
    this.metodoAplicacion = selectedType;
    console.log(this.metodoAplicacion);
  }

  private async canCreateClimateInDemo(): Promise<boolean> {
    const climateLimit = this.demoLimitsService.getLimit('maxClimatesPerOrganization');

    try {
      const response: any = await this.organizacionService.getClimasById(this.idOrganization);
      const currentClimates = Array.isArray(response?.data) ? response.data.length : 0;

      if (this.demoLimitsService.exceedsLimit('maxClimatesPerOrganization', currentClimates)) {
        await Swal.fire({
          title: 'Limite demo alcanzado',
          text:
            `Solo se puede ingresar ${climateLimit} clima en esta demo.` +
            ` Actualmente existen ${currentClimates} registrados para esta organizacion.`,
          icon: 'warning',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al validar limite demo de climas:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No fue posible validar el limite demo de climas. Intente nuevamente.',
        icon: 'error',
      });
      return false;
    }
  }

  //nuevo quiz / encuesta
  async onSubmitClick() {

    if(this.addCusForm.valid){
      if (!(await this.canCreateClimateInDemo())) {
        return;
      }

     console.log('Form Values', this.addCusForm.value);
      const tipoEvaluacion = Number(this.addCusForm.get('IdProof')?.value ?? 1);
      
      const quiz: Quiz = {
        id: 0,
        idOrganization: this.idOrganization,
        contestadas: 0,
        totalEncuestas: 0,
        pendientes: 0,
        totalEmpleados: 0,
        avatarSrc: this.addCusForm.value.urlImg,
        title: this.addCusForm.value.quizName,
        subtitle: this.organizationName,
        imageSrc1: this.fileName,
        content: this.addCusForm.value.quizDesc,
        score : this.addCusForm.value.score,
        completed : false,
        startDate: '01/01/2025',
        endDate: '01/01/2025',
        estado: 1,
        granFactores: [],
        series: [],
        fields: [],
        tipoEvaluacion: this.metodoAplicacion.toString(),
        estadoEnvio: '',
        estadisticasEnvio: {
          total: 0,
          total_creadas: 0,
          total_enviadas: 0,
          total_iniciadas: 0,
          total_contestadas: 0,
          total_error: 0,
          total_empleados_activos: 0,
          porcentaje: 0
        }
      }
     console.log('nuevo quiz armado::', quiz);
      /**   */

      this.organizacionService.saveNewClima(quiz).then((amber:any) => {

        if(amber.data.message === 'Flujo creado exitosamente'){

          //GUARDAR IMAGEN
           if(this.fileChange){

            console.log('a guardar la imagen..');

            this.organizacionService.uploadFileV2(this.formFileData, (pct) => {
              void pct;
              // console.log('Subiendo archivo:', pct + '%');
            })
            .then(() => console.log('Archivo subido'))
            .catch(err => {
              console.error(err); 
              //this.loading = false;  
            });
          }

          Swal.fire({
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.SUCCESS'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.CLIMATECREATED'),
            icon: 'success',
          });
          this.dialogRef.close(true);
        }else{
          Swal.fire({         
            title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.ERROR'),
            text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.CLIMATECREATEDERROR'),
            icon: 'error',
          });
        }
      
      }).catch((err) => {
        console.error('ERROR AL GUARDAR NUEVO CLIMA!:: ', err);
      });
    
      //this.cardsData.push(quiz);

      //globalData.next(this.cardsData);

      
    } else {
     //console.log('FALTAN CAMPOS');
    }

    

  }

  async onSubmitBankClick() {

    if(this.addBankForm.valid) {
      if (!(await this.canCreateClimateInDemo())) {
        return;
      }

      const quiz: Quiz = {
        id: 0,
        idOrganization: this.idOrganization,
        contestadas: 0,
        totalEncuestas: 0,
        pendientes: 0,
        totalEmpleados: 0,
        avatarSrc: '',
        title: this.addBankForm.value.quizName,
        subtitle: '',
        imageSrc1: this.addBankForm.value.urlImg,
        content: this.addBankForm.value.quizDesc,
        score: this.addBankForm.value.score,
        completed: false,
        startDate: this.addBankForm.value.startDatex,
        endDate: this.addBankForm.value.endDatex,
        estado: 1,
        granFactores: [],
        series: [],
        fields: [],
        estadoEnvio: '',
        tipoEvaluacion: '0',
        estadisticasEnvio: {
          total: 0,
          total_creadas: 0,
          total_enviadas: 0,
          total_iniciadas: 0,
          total_contestadas: 0,
          total_error: 0,
          total_empleados_activos: 0,
          porcentaje: 0
        },
        
      };

      const serie: Serie = {
        "Id":0,
        "id_flujo": 0,
        "value": "serie_1", 
        "label": "Serie 1", 
        "desc": "Selecciona el valor correcto en las siguientes sentencias",
        "score": this.addBankForm.value.score,"fields": []
      };

      const selectedUnitsString = this.addBankForm.value.units.toString();

      const totalPreguntasDisponibles = this.sumarValoresNumericos(selectedUnitsString);
      //console.log('totalPreguntasDisponibles',totalPreguntasDisponibles);

      if(totalPreguntasDisponibles < this.addBankForm.value.totalQuestions) {
        alert('El Número de preguntas exede el disponible');
      }
      else{
        let selectedUnits: string[] = [];
      selectedUnits = selectedUnitsString.split(/,\s*/);  
      const unitsTransformed = selectedUnits.map(unit => {
        return unit.replace(/\s/g, '').replace(/\([^)]*\)/g, '');
      });

      const dynamicFields: Field[] = this.createDynamicFields(this.addBankForm.value.totalQuestions, this.selectedCategory, unitsTransformed);
      const scorePerField = this.addBankForm.value.score / this.addBankForm.value.totalQuestions 

      dynamicFields.forEach(field => {
        field.score = scorePerField;
        serie.fields.push(field);
        quiz.fields.push(field);
      });

      quiz.series.push(serie);
    
      this.cardsData.push(quiz);

      globalData.next(this.cardsData);

      this.closeDialog();

      }

    }
    else {
     //console.log('Complete los datos..');
    }
    
  }

  createDynamicFields(totalQuestions: number, category: string, units: string[]) {

    const totalFields: Field[] = [];

    units.forEach(unit => {
      const camposATomarUnidad: Field[] = this.bankData.find(item => item.category === category && item.unit === parseInt(unit,0))?.fields || [];
      camposATomarUnidad.forEach(field => {
        totalFields.push(field);
      });
    });

    if (totalFields.length < totalQuestions) {
        console.error("No hay suficientes campos para seleccionar.");
    }

    const indicesAleatorios: number[] = [];

    while (indicesAleatorios.length < totalQuestions) {
        const indiceAleatorio = Math.floor(Math.random() * totalFields.length);
        if (!indicesAleatorios.includes(indiceAleatorio)) {
            indicesAleatorios.push(indiceAleatorio);
        }
    }

    const camposAleatorios = indicesAleatorios.map(indice => totalFields[indice]);


   //console.log('fields creados dinamicamente tío:', camposAleatorios);

    return camposAleatorios;

  }

  sumarValoresNumericos(cadena: string): number {
    // Encuentra todos los números dentro de paréntesis en la cadena usando una expresión regular
    const numerosEncontrados = cadena.match(/\((\d+)\s*preguntas\)/g);
  
    // Verifica si numerosEncontrados no es nulo antes de usar reduce
    if (numerosEncontrados !== null) {
      // Extrae los valores numéricos y suma
      const sumaTotal = numerosEncontrados.reduce((acumulador, valor) => {
        // Extrae el valor numérico dentro de los paréntesis
        const numero = parseInt(valor.match(/\((\d+)\s*preguntas\)/)![1], 10);
        return acumulador + numero;
      }, 0);
  
      return sumaTotal;
    }
  
    // Si no se encontraron números, devuelve 0 o el valor predeterminado que desees
    return 0;
  }

  formatDateTime(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);

    // Restar un día a la fecha
    fecha.setUTCDate(fecha.getUTCDate() - 1);

    // Sumar 12 horas a la fecha
    fecha.setUTCHours(fecha.getUTCHours() + 12);

    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const anio = fecha.getUTCFullYear();
    const horas = fecha.getUTCHours().toString().padStart(2, '0');
    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
    const segundos = fecha.getUTCSeconds().toString().padStart(2, '0');

   //console.log('FECHA ARMADA',`${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`);

    return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
  }

}
