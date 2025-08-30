import { Component, Input, OnInit } from '@angular/core';
import { FormBuilderService } from '../form-builder.service';

import Swal from 'sweetalert2';

import { FormGroup, FormsModule,
  ReactiveFormsModule,
 } from '@angular/forms';
import {
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizacionService } from 'app/organization/services/organizacion.service';

import { LanguageService } from '@core'; 
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-dynamic-form',
  imports: [

    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,TranslateModule,
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
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule
    

    ],
  template: `
    <div class="body">
  <div class="card" style="padding: 20px">

    <!-- Un único form para todo -->
    <form [formGroup]="form">

      <!-- 🔹 Iteramos Gran Factores -->
      <div *ngFor="let gf of formConfig!.GranFactores">
        <!-- Título del Gran Factor -->
        <h2 style="margin: 20px 0; font-weight: 600;">
          {{ gf.Etiqueta }}
        </h2>

        <!-- 🔹 Iteramos Factores (series) -->
        <div *ngFor="let serie of gf.series">
          <mat-card class="mb-4">
            <mat-card-header>
              <mat-card-title>
                Factor {{ serie.label }}
              </mat-card-title>
            </mat-card-header>

            <mat-card-content>
              <!-- 🔹 Iteramos Preguntas (fields) -->
              <ng-container *ngFor="let field of serie.fields; let i = index">

                <!-- Tipo Text -->
                <ng-container *ngIf="field.type === 'text'">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>{{ field.label }}</mat-label>
                    <input matInput [formControlName]="field.name" required>
                    <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                      {{ field.label }} {{'MENUITEMS.ALONE.REQUIRED' | translate}}
                    </mat-error>
                  </mat-form-field>
                </ng-container>

                <!-- Tipo Text con análisis IA -->
                <ng-container *ngIf="field.type === 'iatext'">
                  <mat-form-field appearance="outline" class="w-100" style="margin-top:10px">
                    <mat-label>{{ field.label }}</mat-label>
                    <input matInput [formControlName]="field.name" required>
                    <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                      {{ field.label }} {{'MENUITEMS.ALONE.REQUIRED' | translate}}
                    </mat-error>
                  </mat-form-field>
                </ng-container>

                <!-- Tipo Radio -->
                <ng-container *ngIf="field.type === 'radio'">
                  <label class="d-block mb-2" style="font-size: 20px; margin-top: 20px">
                    {{ i + 1 }}.- {{ field.label }}
                  </label>
                  <mat-radio-group [formControlName]="field.name">
                    <mat-radio-button
                      *ngFor="let option of field.options"
                      [value]="option.value"
                      class="mr-3">
                      {{ option.label }}
                    </mat-radio-button>
                  </mat-radio-group>
                  <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                    <span style="color: rgb(225, 9, 9)">
                      {{'MENUITEMS.ALONE.REQUIRED' | translate}}
                    </span>
                  </mat-error>
                </ng-container>

                <!-- Tipo Slider -->
                <ng-container *ngIf="field.type === 'slider'">
                  <mat-label style="font-size:20px;margin-top:20px">{{ field.label }}</mat-label>
                  <div>
                    <input style="width:100%"
                           [formControlName]="field.name"
                           type="range"
                           [min]="field.min"
                           [max]="field.max" />
                  </div>
                  <div>
                    <label style="font-size:20px">{{ form.get(field.name)?.value }}</label>
                  </div>
                  <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                    {{ field.label }} {{'MENUITEMS.ALONE.REQUIRED' | translate}}
                  </mat-error>
                  <div style="background-color: cadetblue;width:100%;height:1px"></div>
                </ng-container>

                <mat-divider></mat-divider>
              </ng-container>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Botón de envío -->
      <div style="margin-top:20px">
        <button type="submit"
                [disabled]="form.invalid"
                (click)="onSubmit()"
                mat-raised-button
                color="primary">
          {{'MENUITEMS.ALONE.SEND' | translate}}
        </button>
      </div>
    </form>
  </div>
</div>





  `,
  styles: [`
    .card {
      padding: 20px;
    }
    .body {
      margin: 10px;
    }
    mat-form-field {
      width: 100%;
    }
    mat-radio-group {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class DynamicFormComponent implements OnInit {

  @Input() formConfig!: any | null;
  @Input() idEmpleado!: number;
  @Input() idEncuestaEmpleado!: number;
  @Input() lang!: string;

  form!: FormGroup;

  idFlujo = 0;

  langStoreValue?: any;

  constructor(private formBuilderService: FormBuilderService,
    public languageService: LanguageService, 
    private translate: TranslateService,
    private organizacionService: OrganizacionService) {}

  ngOnInit(): void {

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    //console.log('this.langStoreValue:: ', this.langStoreValue);
    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    this.langStoreValue = this.lang;

    console.log('this.lang', this.lang);
    if(this.lang === "en"){
      //this.translateRadioOptionLabels(this.formConfig, 'es');
    }
    //

    this.form = this.formBuilderService.buildForm(this.formConfig!);
    console.log('this.formConfig:: ', this.formConfig);
   //console.log('this.idEmpleado', this.idEmpleado);
   //console.log('this.idEncuestaEmpleado', this.idEncuestaEmpleado);
    this.idFlujo = this.formConfig!.Id;

   //console.log('this.idFlujo', this.idFlujo);
  }

  translateRadioOptionLabels(config: any, lang: string): void {
    this.lang = lang;
    this.langStoreValue = this.lang;

    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    //console.log('this.langStoreValue:: ', this.langStoreValue);
    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    const translationMap: { [key: string]: string } = {
      'TOTALMENTE DE ACUERDO': 'TOTALLY AGREE',
      'DE ACUERDO': 'AGREE',
      'EN DESACUERDO': 'DISAGREE',
      'TOTALMENTE EN DESACUERDO': 'TOTALLY DISAGREE'
    };

    const reverseMap = Object.fromEntries(
      Object.entries(translationMap).map(([es, en]) => [en.toUpperCase(), es])
    );

    if (!config?.fields) return;

    config.fields.forEach((field: any) => {
      if (field.type === 'radio' && Array.isArray(field.options)) {
        field.options.forEach((option: any) => {
          const label = option.label?.trim().toUpperCase();

          if (lang === 'en' && translationMap[label]) {
            option.label = translationMap[label];
          } else if (lang === 'es' && reverseMap[label]) {
            option.label = reverseMap[label];
          }
        });
      }
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      const respuestas = this.form.value;
     //console.log('Respuestas del formulario:', respuestas);

      const entries: [string, string][] = Object.entries(respuestas);

     //console.log(entries);

      //var global_data: any = [];

      var g_d:any = {res:[], head:[{IdEmpleado: this.idEmpleado},{IdFlujo: this.idFlujo}] }

      //g_d

      entries.forEach(e => {
        var newid = this.getFieldIdByName(e[0]);

        var tipo = e[0].substring(0,3);

       //console.log(newid);

        let idp = newid?.toString() ?? '';
        g_d.res.push({ "idPregunta": idp, "valor": e[1], "tipo": tipo });


      });

     //console.log('global_data', g_d);
     //console.log('this.idEmpleado',this.idEmpleado);
      
      Swal.fire({
        title: this.translate.instant('MENUITEMS.DYNAMIC.UPLOAD'),
        html: this.translate.instant('MENUITEMS.DYNAMIC.SAVING'),
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
          
        }
      });

      this.organizacionService.savePreguntas(g_d).then((resilxis)=>{

        if(resilxis.data.message === 'Respuestas guardadas correctamente'){
          const datasUpdate: any = {
            "IdEncuestaEmpleado": this.idEncuestaEmpleado,
            "Estado": 'Contestada',
            "FechaInicio": null,
            "FechaFinalizacion": new Date
        };

       //console.log('update antes de actualizar:: ', datasUpdate);
          this.updateClimaEncuesta(datasUpdate);

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('MENUITEMS.DYNAMIC.SURVEYSUCCESS'),
            text: this.translate.instant('MENUITEMS.DYNAMIC.THANKS'),
            timer: 3000,
            showConfirmButton: false
          });
          this.form.disable();
        };
      }).catch((err)=>{
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('MENUITEMS.DYNAMIC.SURVEYERROR'),
          text: err,
          timer: 3000,
          showConfirmButton: false
        });
      })

    } else {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('MENUITEMS.DYNAMIC.INVALIDFORM'),
        text: this.translate.instant('MENUITEMS.DYNAMIC.INVALIDFORMMESSAGE'),
        timer: 3000,
        showConfirmButton: false
      });
    }
  }


  getFieldIdByName( targetName: any ): number | undefined {

    for (const serie of this.formConfig!.series) {
      const match = serie.fields.find((field:any) => field.name === targetName);
      if (match) {
        return match.id;
      }
    }
    return undefined;
  }

  public updateClimaEncuesta(data:any): void {
        

    this.organizacionService.updateClimaEncuesta(data);
  }

  getSeriesGroupedByGranFactor() {
  if (!this.formConfig?.series) return [];

  const grupos: { idGranFactor: number; etiqueta: string; series: any[] }[] = [];

  this.formConfig.series.forEach((serie: any) => {
    let grupo = grupos.find(g => g.idGranFactor === serie.IdGranFactor);
    if (!grupo) {
      grupo = { idGranFactor: serie.IdGranFactor, etiqueta: serie.Etiqueta, series: [] };
      grupos.push(grupo);
    }
    grupo.series.push(serie);
  });

  return grupos;
}


}
