import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder,
 } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  //MatDialogRef,
} from "@angular/material/dialog";
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { DialogformComponent } from "../dialogform/dialogform.component";
import { DialogformSerieComponent } from "../dialogformserie/dialogformserie.component";
import { DialogformItemsComponent } from "../dialogformitems/dialogformitems.component";
import { DialogformSendComponent } from "../dialogformsend/dialogformsend.component";
import { DialogDynamicFormComponent } from "../dialogdynamicform/dialogdynamicform.component";

import { MatFormFieldModule } from '@angular/material/form-field';


import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule, MatChipListbox } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { globalData } from "../global-data";
import { globalDataItems } from "../global-data-items";
//import { Item } from "../dynamic-form/item_model";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {EstadisticasEnvio, Quiz, QuizBank} from "../models/quiz-models";

import { OrganizacionService } from '../../organization/services/organizacion.service';
import Swal from "sweetalert2";
import { RouteInfo } from "app/layout/sidebar/sidebar.metadata";
import { Router } from '@angular/router';

import { AuthService } from '@core';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 

import { JoyrideService } from 'ngx-joyride';
import { JoyrideModule } from 'ngx-joyride';

function toArray<T = any>(v: T | T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : (v != null ? [v] : []);
}

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrl:"./create.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    JoyrideModule,
    BreadcrumbComponent,TranslateModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatOptionModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule
    

    ],


})
export class CreateComponent implements OnInit {

  closeResult = "";
  id_quiz_context = 0;
  loading = false;

  cardsData: Quiz[] = [
  

    
    
  ];

  BankData: QuizBank[] = [
    {"category": "Matemáticas",
        "unit": 3,
        "fields": []
    },
      
  ];

  //simpleDialog?: MatDialogRef<SimpleDialogComponent>;
  public qname?: string = "cadejo";
  public qdesc?: string = "Deo";
  public addCusForm?: UntypedFormGroup;
  quizName?: string;
  quizDesc?: string;
  dialogConfig?: MatDialogConfig;
  public idOrganizacion: number = 1;
  accessToCreate = true;
  accessToEdit = true;
  accessToSend = true;
  accessToDeleteFactor = true;
  
   langStoreValue?: string;

  constructor(
    private joyrideService: JoyrideService,
    private organizacionService: OrganizacionService,private router: Router, private authService: AuthService,
    private dialogModel: MatDialog, //dialog para agregar quiz
    private dialogSerieModel: MatDialog, //dialog para agregar serie
    private dialogItemModel: MatDialog, //dialog agregar ítems    
    private fb: UntypedFormBuilder, // private modalService: NgbModal
    private _snackBar: MatSnackBar, private languageService: LanguageService,private translate: TranslateService,
  ) {}

   startTour() {
    //console.log('entra pálido...');

    setTimeout(() => {
      this.joyrideService.startTour({
        steps: ['step1', 'step2', 'step3', 'step4', 'step5'],
        showPrevButton: true,
         customTexts: {
            prev: 'Anterior',
            next: 'Siguiente',
            done: 'Finalizar',
            close: 'Cerrar'
          }
      }).subscribe({
        complete: () => console.log('✅ Tour finalizado'),
        error: (err) => console.error('❌ Error en el tour:', err)
      });
    }, 100); // Pequeña pausa para esperar al renderizado final
  }

  ngAfterViewInit() {
    const step1 = document.querySelector('[joyrideStep="step1"]');
    console.log('step1 en DOM:', !!step1);
  }



  ngOnInit() {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    console.log('this.langStoreValue quiz:: ', this.langStoreValue);
    
    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
     //console.log('RUTAS DESDE sessionStorage:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/quiz/create');
     //console.log(found);

      if(!found){
        this.router.navigate(['/authentication/page404']);
      }

    }
    
    this.addCusForm = this.fb.group({
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
      score: 0
    });

    globalData.subscribe(data => {
      //console.log("Received data in CreateComponent:", data);
      if(data) {
        const quiz = data[0];
        quiz.id = this.cardsData.length+1;
        this.cardsData.push(quiz);

       //console.log("Se ingreso el item?:", this.cardsData);

      }

    });

    globalDataItems.subscribe(data => {
      if(data) {
        //console.log("Received data in CreateComponent:", data);
        this.cardsData[this.id_quiz_context].fields = data;
        //console.log(this.cardsData);
      }

    });


    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
        this.getClimasLista();
    }
    else {

      console.log('PERMISOS:: ',  this.authService.currentUserValue?.permissions);

      //validar permisos de acciones
      const permisioncreate = this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'createclima');
      
      const permisionedit = this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'editclima');
     
      const permisionsend = this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'sendclima');

      const permisiondeletefactor = this.authService.currentUserValue?.permissions.
        find((p: { ActionCode: string; }) => p.ActionCode === 'deletefactor'); 

      /*  */
      if(permisioncreate){
        this.accessToCreate = true;
      }else{
        this.accessToCreate = false;
      }

      if(permisionedit){
        this.accessToEdit = true;
      }else{
        this.accessToEdit = false;
      }

      if(permisionsend){
        console.log('sí hay permisos de envío, el botón debería mostrarse---...');
        this.accessToSend = true;
      }else{
        this.accessToSend = false;
      }

      if(permisiondeletefactor){
        this.accessToDeleteFactor= true;
      }else{
        this.accessToDeleteFactor = false;
      }

      
    


      this.getClimasListaById(this.authService.currentUserValue?.idOrganization);
    }

    //this.getClimasLista();

  }

  getTooltipText(factor: any): string {
    const preguntas = (factor.fields || [])
      .map((q: any, i: number) => `${i + 1}. ${q.label}`)
      .join('\n');

    return preguntas || 'Sin preguntas';
  }
  
  public getClimasLista():void {
    this.loading = true;
    this.organizacionService.getClimas(this.idOrganizacion).then((lista_climas)=> {
       //console.log('CLIMAS:: ', lista_climas.data);
        const climas = lista_climas.data;
        //crear nuevo clima
        if(climas){this.cardsData = []}
        climas.forEach((clima: 
            {
                Id: number;
                IdOrganizacion: number;
                NombreOrganizacion: string;
                nombre_organizacion_oficial: string;
                Nombre: string;
                Objetivo: string;
                FechaInicio: string; // o Date, si lo conviertes luego
                FechaFin: string;    // o Date, igual que arriba
                Frecuencia: string;
                MetodoAplicacion: string;
                EstimadoMinutos: number;
                Anonimato: boolean;
                FechaCreacion: string; // o Date
                Imagen1Src: string;
                Estado: number;
                granFactores: any;
                series: any;
                estado_envio: string;
                estadisticas_envio: EstadisticasEnvio | string;
            })  => {

            const quiz: Quiz = {
                id: clima.Id,
                idOrganization: clima.IdOrganizacion,
                contestadas: 0,
                totalEncuestas: 0,
                pendientes: 0,
                totalEmpleados: 0,
                avatarSrc: clima.Imagen1Src,
                title: clima.Nombre,
                subtitle: clima.nombre_organizacion_oficial,
                imageSrc1: '',
                content: clima.Objetivo,
                score : 0,
                completed : false,
                startDate: '',
                endDate: '',
                estado: 1,
                granFactores: clima.granFactores,
                series: clima.series,
                tipoEvaluacion: clima.MetodoAplicacion,
                fields: [],
                estadoEnvio: clima.estado_envio,
                estadisticasEnvio: typeof clima.estadisticas_envio === 'string'
                ? JSON.parse(clima.estadisticas_envio)
                : clima.estadisticas_envio
              }

              this.cardsData.push(quiz);
        });
        this.loading = false;
      }).catch((err)=> {
        console.error(err);
        this.loading = false;
      })
  }

  public getClimasListaById(idOrganizacion:any):void {
    this.loading = true;
    this.organizacionService.getClimasById(idOrganizacion).then((lista_climas:any)=> {
       //console.log('CLIMAS:: ', lista_climas.data);
        const climas = lista_climas.data;
        //crear nuevo clima
        if(climas){this.cardsData = []}
        climas.forEach((clima: 
            {
                Id: number;
                IdOrganizacion: number;
                NombreOrganizacion: string;
                nombre_organizacion_oficial: string;
                Nombre: string;
                Objetivo: string;
                FechaInicio: string; // o Date, si lo conviertes luego
                FechaFin: string;    // o Date, igual que arriba
                Frecuencia: string;
                MetodoAplicacion: string;
                EstimadoMinutos: number;
                Anonimato: boolean;
                FechaCreacion: string; // o Date
                Imagen1Src: string;
                Estado: number;
                tipoEvaluacion: string;
                granFactores: any;
                series: any;
                estado_envio: string;
                estadisticas_envio: EstadisticasEnvio | string;
            })  => {

            const quiz: Quiz = {
                id: clima.Id,
                idOrganization: clima.IdOrganizacion,
                contestadas: 0,
                totalEncuestas: 0,
                pendientes: 0,
                totalEmpleados: 0,
                avatarSrc: clima.Imagen1Src,
                title: clima.Nombre,
                subtitle: clima.nombre_organizacion_oficial,
                imageSrc1: '',
                content: clima.Objetivo,
                score : 0,
                completed : false,
                startDate: '',
                endDate: '',
                estado: 1,
                granFactores:clima.granFactores,
                series: clima.series,
                tipoEvaluacion: clima.MetodoAplicacion,
                fields: [],
                estadoEnvio: clima.estado_envio,
                estadisticasEnvio: typeof clima.estadisticas_envio === 'string'
                ? JSON.parse(clima.estadisticas_envio)
                : clima.estadisticas_envio
              }

              this.cardsData.push(quiz);
        });
        this.loading = false;
      }).catch((err)=> {
        console.error(err);
        this.loading = false;
      })
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

  getPorcentajeCompletado(card: any): number {
    const creadas = card.estadisticasEnvio?.total_creadas || 0;
    const contestadas = card.estadisticasEnvio?.total_contestadas || 0;
  
    if (creadas === 0) return 0;
  
    return Math.round((contestadas / creadas) * 100);
  }
  
  public deleteFactor(factor: any): boolean {
   //console.log('FUNCIONA EL CLICK?:: ', factor);
    this.loading = true;

    this.organizacionService.deleteFactor(factor.Id).then((resutadi: any)=>{
      if(resutadi.data.message === 'Factor eliminado correctamente'){          
        Swal.fire({
          title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.SUCCESS'),
          text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.DELETEDFACTOR'),
          icon: 'success',
        }); 

        this.getClimasLista();
          
      } else {
          this.loading = false;
      }                
    }).catch((err)=>{              
      this.loading = false;        
      Swal.fire({
        title: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FACTORWARNING'),
        text: this.translate.instant('MENUITEMS.QUIZ.MESSAGES.FACTORWARNINGMESSAGE'),
        icon: 'warning',
      });
    })
    return true;
  }
  

  existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
  }
    
  verDetalles(card: Quiz) {
    // Lógica para manejar el evento de "Detalles" para la tarjeta específica
   //console.log("Ver detalles:", card);

    this.openDialogDynmicForm(card);

  }

  editarQuiz(card: Quiz) {
    // Lógica para manejar el evento de "Tomar prueba" para la tarjeta específica
    //console.log("Tomar prueba:", card);

    this.openDialogItems(card);

  }

  adminEnvioQuizDialog(card: Quiz) {

    this.id_quiz_context = this.cardsData.indexOf(card);
  
    const dialogRef = this.dialogItemModel.open(DialogformSendComponent, {
      // anchura y altura relativas al viewport
      width:  '95vw',
      maxWidth: '95vw',      
      height: 'auto',         
      disableClose: true,
      data: card,
      
    });
  
    // ✅ Escuchar el cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
            this.getClimasLista();
          }
          else {        
            this.getClimasListaById(this.authService.currentUserValue?.idOrganization);
          }
      }
    });

  }

  //DIALOGO NUEVO CLIMA
  openDialog(): void {
    const dialogRef = this.dialogModel.open(DialogformComponent, {
      width:  '95vw',
      maxWidth: '95vw',      // ⚠️ anula el 80 vw por defecto
      height: 'auto', 
        disableClose: true,
        data: this.BankData
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
           //console.log('SE HA OBTENIDO EL EVENTO DE CIERRE DEL DIALOG');
            
          if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
              this.getClimasLista();
          }
          else {

        
            this.getClimasListaById(this.authService.currentUserValue?.idOrganization);
          }


        }
      });
    
  }

  //DIALOGO MODIFICAR CLIMA
  openDialogItems(card: Quiz): void {
    this.id_quiz_context = this.cardsData.indexOf(card);
  
    const dialogRef = this.dialogItemModel.open(DialogformItemsComponent, {
      width:  '95vw',
      maxWidth: '95vw',      // ⚠️ anula el 80 vw por defecto
      height: 'auto',         // o '100vh' si quieres pantalla completa
      disableClose: true,
      data: [card]
    });
  
    // ✅ Escuchar el cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
       if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
            this.getClimasLista();
          }
          else {        
            this.getClimasListaById(this.authService.currentUserValue?.idOrganization);
          }
      }
    });
  } 
  

  openDialogSerie(card: Quiz): void {
    this.id_quiz_context = this.cardsData.indexOf(card);
    this.dialogSerieModel.open(DialogformSerieComponent, {
      width: "100%",

      disableClose: true,
      data: { card }
    });
  }

  openDialogDynmicForm(quiz: Quiz): void {
    this.id_quiz_context = this.cardsData.indexOf(quiz);
   //console.log("El quiz data: ", quiz);
    this.dialogItemModel.open(DialogDynamicFormComponent, {
      width: "100%",
      //height: "100%",
      disableClose: false,
      data: quiz
    });
  }



  //función para validar si el quiz está vigente a la fecha actual
  validarVigencia(startDate: string, endDate: string): boolean {
    // Obtener la fecha actual
    const fechaActual = new Date();

    //console.log("fechaActual: ", fechaActual);
    //const fechaActualFormateada = this.formatDateTime(fechaActual.toString());

    //const fechaActualFinal = new Date(fechaActualFormateada);

    // Convertir las fechas de cadena a objetos Date
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Verificar si la fecha actual está dentro del rango de startDate y endDate
    return startDateObj <= fechaActual && fechaActual <= endDateObj;
  }

  formatDateTime(fechaOriginal: string) {
    const fecha = new Date(fechaOriginal);

    // Restar un día a la fecha
    fecha.setUTCDate(fecha.getUTCDate() - 1);

    // Sumar 12 horas a la fecha
    fecha.setUTCHours(fecha.getUTCHours() + 12);

    const dia = fecha.getUTCDate().toString().padStart(2, "0");
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0"); // Los meses comienzan desde 0
    const anio = fecha.getUTCFullYear();
    const horas = fecha.getUTCHours().toString().padStart(2, "0");
    const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");
    const segundos = fecha.getUTCSeconds().toString().padStart(2, "0");

    return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
  }

  containQuestion(card: any): boolean {
    if (!card) return false;

    // Soporta granFactores o GranFactores
    const granFactores = toArray(card.granFactores ?? card.GranFactores);
    if (granFactores.length === 0) return false;

    // Debe existir al menos un GF con al menos una serie y al menos un field activo
    for (const gf of granFactores) {
      const series = toArray(gf?.series ?? gf?.Series);
      if (series.length === 0) continue;

      for (const serie of series) {
        const fields = toArray(serie?.fields ?? serie?.Fields)
          // cuenta solo preguntas "activas"
          .filter(f => f && (f.is_active === 1 || f.is_active === true || f.is_active === undefined));
        if (fields.length > 0) return true;
      }
    }
    return false;
  }

  

}
