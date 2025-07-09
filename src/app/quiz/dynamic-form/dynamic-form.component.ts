import { Component, Input, OnInit } from '@angular/core';
import { FormBuilderService } from '../form-builder.service';

import Swal from 'sweetalert2';
import { Quiz } from './../models/quiz-models';

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

import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { relativeTimeThreshold } from 'moment';

@Component({
  selector: 'app-dynamic-form',
  imports: [

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
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule
    

    ],
  template: `
    <div class="body"  >
      <div class="card" style="padding: 20px">
      

      <div *ngFor="let serie of formConfig!.series">
        <mat-card class="mb-4">
          <mat-card-header>
            <mat-card-title>
              Factor {{ serie.label }}
            </mat-card-title>
            <mat-card-subtitle>
              {{ serie.desc }}
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <ng-container *ngFor="let field of serie.fields; let i = index">
              <form [formGroup]="form" class="mb-3">
                <!-- Tipo Text -->
                <ng-container *ngIf="field.type === 'text'">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>{{ field.label }}</mat-label>
                    <input matInput [formControlName]="field.name" required>
                    <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                      {{ field.label }} es requerido
                    </mat-error>
                  </mat-form-field>
                </ng-container>

                <!-- Tipo Text con análisis IA -->
                <ng-container *ngIf="field.type === 'iatext'">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>{{ field.label }}</mat-label>
                    <input matInput [formControlName]="field.name" required>
                    <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                      {{ field.label }} es requerido
                    </mat-error>
                  </mat-form-field>
                </ng-container>

                <!-- Tipo Radio -->
                <ng-container  *ngIf="field.type === 'radio'">
                  <label class="d-block mb-2" style="font-size: 20px; margin-top: 20px">
                  {{ i + 1 }}.- {{ field.label }} 
                  </label>
                  <mat-radio-group [formControlName]="field.name">
                    <mat-radio-button
                      *ngFor="let option of field.options"
                      [value]="option.value"
                      class="mr-3"
                    >
                       {{ option.label }}
                    </mat-radio-button>
                  </mat-radio-group>
                  <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                    <span style="color: rgb(225, 9, 9)">Campo requerido</span>
                  </mat-error>
                </ng-container>

                 <!-- Tipo Slider -->
                <ng-container *ngIf="field.type === 'slider'">
                  <mat-label style="font-size:20px;margin-top:20px" >{{ field.label }}</mat-label>
                  <div>
                    <input style="width:100%" *ngIf="field.type === 'slider'" [formControlName]="field.name" type="range" [min]="field.min" [max]="field.max" />
                  </div>
                  <div>
                    <label style="font-size:20px" *ngIf="field.type === 'slider'">{{ form.get(field.name)?.value }}</label>
                  </div>
                  <!-- Agrega un mensaje de error si el campo es requerido -->
                  <mat-error *ngIf="form.get(field.name)?.hasError('required')">
                    {{ field.label }} es requerido
                  </mat-error>
                  <div style="background-color: cadetblue;widht:100%;height:1px" ></div>
                </ng-container>

              </form>
              <mat-divider></mat-divider>
            </ng-container>
          </mat-card-content>
        </mat-card>
      </div>

        <!-- Botón de envío -->
        <div style="margin-top:20px">
          <button type="submit" [disabled]="form.invalid" (click)="onSubmit()" mat-raised-button color="primary">
            Enviar
          </button>
        </div>
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

  form!: FormGroup;

  idFlujo = 0;

  constructor(private formBuilderService: FormBuilderService,
    private organizacionService: OrganizacionService) {}

  ngOnInit(): void {
    this.form = this.formBuilderService.buildForm(this.formConfig!);
    console.log('this.formConfig:: ', this.formConfig);
    console.log('this.idEmpleado', this.idEmpleado);
    console.log('this.idEncuestaEmpleado', this.idEncuestaEmpleado);
    this.idFlujo = this.formConfig!.Id;

    console.log('this.idFlujo', this.idFlujo);
  }

  
  onSubmit() {
    if (this.form.valid) {
      const respuestas = this.form.value;
      console.log('Respuestas del formulario:', respuestas);

      const entries: [string, string][] = Object.entries(respuestas);

      console.log(entries);

      //var global_data: any = [];

      var g_d:any = {res:[], head:[{IdEmpleado: this.idEmpleado},{IdFlujo: this.idFlujo}] }

      //g_d

      entries.forEach(e => {
        var newid = this.getFieldIdByName(e[0]);

        var tipo = e[0].substring(0,3);

        console.log(newid);

        let idp = newid?.toString() ?? '';
        g_d.res.push({ "idPregunta": idp, "valor": e[1], "tipo": tipo });


      });

      console.log('global_data', g_d);
      console.log('this.idEmpleado',this.idEmpleado);
      
      Swal.fire({
        title: 'Guardando..',
        html: 'Se están guardando los datos, por favor espera ',
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

        console.log('update antes de actualizar:: ', datasUpdate);
          this.updateClimaEncuesta(datasUpdate);

          Swal.fire({
            icon: 'success',
            title: '¡Encuesta enviada!',
            text: 'Gracias por completar la encuesta.',
            timer: 3000,
            showConfirmButton: false
          });
          this.form.disable();
        };
      }).catch((err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error al guardar las respuestas',
          text: err,
          timer: 3000,
          showConfirmButton: false
        });
      })

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, responde todas las preguntas requeridas.',
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

}
