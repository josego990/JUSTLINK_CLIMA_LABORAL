import { Serie } from './../models/quiz-models';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,UntypedFormBuilder,
 } from '@angular/forms';
import { globalData } from '../global-data';
import { Quiz, QuizBank, Field, EstadisticasEnvio } from '../models/quiz-models';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { create } from 'd3';
import { COMMA } from '@angular/cdk/keycodes';
import { dy } from '@fullcalendar/core/internal-common';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@core';

@Component({
  selector: 'app-dialogform',
  standalone: true, 
  templateUrl: './dialogform.component.html',
  styleUrls: ['./dialogform.component.scss'],
  imports: [

    MatDialogModule,
    MatTableModule,
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
export class DialogformComponent implements OnInit {

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

  public qname = '';
  public qdesc = '';
  public addCusForm!: UntypedFormGroup;
  public addBankForm!: UntypedFormGroup;
  public selectedFieldType = '1'

  constructor(
    private fb: UntypedFormBuilder, 
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogformComponent>, 
    private organizacionService: OrganizacionService, private authService: AuthService,

    @Inject(MAT_DIALOG_DATA) public data: QuizBank[],
    ) {
     //console.log('data:', data );

      this.bankData = data;

      this.getCategoriesDistinctList();


    }

  public ngOnInit(): void {

    

    this.addCusForm = this.fb.group({
      IdOrganization: [this.idOrganization, Validators.required],
      IdProof: ["1", Validators.required],
      quizName: [this.qname, [Validators.required]],
      quizDesc: [this.qdesc, [Validators.required]],
      urlImg: [null],
      //score: 100,
      //startDate: '',
      //endDate: '',
      MetodoAplicacion: ['1', Validators.required],
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

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
      this.getOrganizations();
    }
    else {
      this.getOrganizationById(this.authService.currentUserValue?.idOrganization);
    }

    
  }

  getOrganizations(): void {
    this.organizacionService.getOrganizations()
        .then((response:any) => {
         //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getOrganizationById(idOrganization:any): void {

    //console.log('idOrganization', idOrganization);

    this.organizacionService.getOrganizationById(idOrganization)
      .then((response:any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        this.idOrganization = idOrganization;
      


        this.addCusForm.patchValue({ IdOrganization: idOrganization });
        //this.addCusForm.patchValue({ IdProof: "1" });
        

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

  //nuevo quiz / encuesta
  onSubmitClick() {

    if(this.addCusForm.valid){
     //console.log('Form Values', this.addCusForm.value);
      
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
        imageSrc1: this.addCusForm.value.urlImg,
        content: this.addCusForm.value.quizDesc,
        score : this.addCusForm.value.score,
        completed : false,
        startDate: '01/01/2025',
        endDate: '01/01/2025',
        estado:1,
        series: [],
        fields: [],
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
     //console.log('nuevo quiz armado::', quiz);
      /** */

      this.organizacionService.saveNewClima(quiz).then((amber:any) => {
       //console.log('RESULTADO saveNewClima:: ', amber);
        //OBTENER DE NUEVO EL LISTADO DE CLIMAS
        // ✅ Cerramos el diálogo y devolvemos un valor de éxito

        if(amber.data.message === 'Flujo creado exitosamente'){
          Swal.fire({
            title: 'Realizado',
            text: amber.data.message,
            icon: 'success',
          });
          this.dialogRef.close(true);
        }else{
          Swal.fire({
            title: 'Algo anda mal',
            text: 'Ha ocurrido un error al crear el nuevo Clima',
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

  onSubmitBankClick() {

    if(this.addBankForm.valid) {

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
        score : this.addBankForm.value.score,
        completed : false,
        startDate: this.addBankForm.value.startDatex,
        endDate: this.addBankForm.value.endDatex,
        estado:1,
        series: [],
        fields: [],
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
