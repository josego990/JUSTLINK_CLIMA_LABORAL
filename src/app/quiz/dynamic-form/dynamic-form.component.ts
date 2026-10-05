import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilderService } from '../form-builder.service';
import Swal from 'sweetalert2';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
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
    MatDialogModule, MatTableModule, MatIconModule, MatExpansionModule,
    FormsModule, ReactiveFormsModule, MatDividerModule, MatFormFieldModule,
    MatTooltipModule, MatChipsModule, MatOptionModule, MatRippleModule,
    MatProgressSpinnerModule, MatRadioModule, MatInputModule, MatSelectModule,
    CommonModule, MatButtonModule, MatCardModule, TranslateModule
  ],
  template: `
  <div class="df-body">

    <!-- Contenedor principal -->
    <div class="df-container">
      <form [formGroup]="form" novalidate>

        <!-- Gran Factores -->
       <section class="gf-card" *ngFor="let gf of formConfig!.GranFactores; trackBy: trackByIdx">
          <div class="gf-card__header" role="group" [attr.aria-label]="gf.Etiqueta">
            <div class="gf-card__accent"></div>
            <div class="gf-card__titles">
              <mat-icon aria-hidden="true">layers</mat-icon>
              <h2 class="gf-card__title">{{ gf.Etiqueta }}</h2>
              <div class="gf-card__meta">
               
              </div>
            </div>
          </div>

          <!-- Factores -->
          <div class="serie" *ngFor="let serie of gf.series; trackBy: trackByIdx">
            <mat-card class="serie-card">
              <mat-card-header class="serie-card__header">
                <mat-card-title class="serie-card__title">
                  {{ serie.label }}
                </mat-card-title>
              </mat-card-header>

              <mat-card-content class="serie-card__content">

                <!-- Preguntas -->
                <ng-container *ngFor="let field of serie.fields; let i = index; trackBy: trackByIdx">

                  <!-- TEXT -->
                  <ng-container *ngIf="field.type === 'text'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <mat-form-field appearance="outline" class="w-100">
                        <input
                          matInput
                          [formControlName]="field.name"
                          [attr.aria-label]="field.label"
                          [maxlength]="field.maxLength || 500"
                        />
                        <mat-hint align="end">
                          {{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 500 }}
                        </mat-hint>
                        <mat-error *ngIf="form.get(field.name)?.invalid">
                          {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </ng-container>

                  <!-- IATEXT -->
                  <ng-container *ngIf="field.type === 'iatext'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <mat-form-field appearance="outline" class="w-100">
                        <textarea
                          matInput
                          rows="3"
                          [formControlName]="field.name"
                          [maxlength]="field.maxLength || 800"
                        ></textarea>
                        <mat-hint align="end">
                          {{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 800 }}
                        </mat-hint>
                        <mat-error *ngIf="form.get(field.name)?.invalid">
                          {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </ng-container>


                  <!-- RADIO -->
                  <ng-container *ngIf="field.type === 'radio'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>
                      <mat-radio-group [formControlName]="field.name" class="q-radio-group">
                        <mat-radio-button *ngFor="let option of field.options; trackBy: trackByIdx"
                                          [value]="option.value" class="q-radio">
                          {{ option.label }}
                        </mat-radio-button>
                      </mat-radio-group>
                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        <mat-icon aria-hidden="true">error</mat-icon>
                        {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>

                  <!-- SLIDER -->
                  <ng-container *ngIf="field.type === 'slider'">
                    <div class="q-block slider-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <input class="q-range"
                            type="range"
                            [formControlName]="field.name"
                            [attr.min]="(field.min ?? 0)"
                            [attr.max]="(field.max ?? 100)"
                            [attr.step]="(field.step ?? 1)"
                            (input)="onSliderInput(field.name, $event)"
                            [style.background]="getRangeBackground(field.name, field.min ?? 0, field.max ?? 100)" />

                      <!-- Regla / ticks -->
                      <div class="q-ticks" [style.gridTemplateColumns]="'repeat(' + getTickCount(field) + ', 1fr)'">
                        <span *ngFor="let t of getTicks(field); let i = index"
                              class="q-tick">
                          <i class="q-tick-mark"></i>
                          <em class="q-tick-label">{{ t }}</em>
                        </span>
                      </div>

                      <div class="q-range-value" style="font-size: 20px">
                        Selección: {{ form.get(field.name)?.value ?? (field.min ?? 0) }}
                      </div>

                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>

                  <!-- SELECT (lista y lista demográfica) -->
                  <ng-container *ngIf="field.type === 'select' || field.type === 'selectdem'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>
                      <mat-radio-group [formControlName]="field.name" class="q-radio-group">
                        <mat-radio-button *ngFor="let option of field.options; trackBy: trackByIdx"
                                          [value]="option.value" class="q-radio">
                          {{ option.label }}
                        </mat-radio-button>
                      </mat-radio-group>
                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        <mat-icon aria-hidden="true">error</mat-icon>
                        {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>


                  <mat-divider class="q-divider"></mat-divider>
                </ng-container>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <div class="security-verification" *ngIf="requireTurnstile">
          <ng-content select="[security-verification]"></ng-content>
        </div>

        <!-- Barra fija de envío -->
        <div class="submit-bar">
          <div class="submit-bar__progress">
            <div class="progress-line">
              <div class="progress-line__fill" [style.width.%]="progress"></div>
            </div>
            <div class="progress-text">
              {{ progress }}% {{ 'MENUITEMS.ALONE.COMPLETED' | translate }}
            </div>
          </div>

          <button type="submit" mat-raised-button color="primary"
                  [disabled]="form.invalid || btnIsDisabled || isSubmitting || (requireTurnstile && !turnstileToken)"
                  (click)="onSubmit()">
            <mat-icon>{{ isSubmitting ? 'sync' : 'send' }}</mat-icon>
            {{ 'MENUITEMS.ALONE.SEND' | translate }}
          </button>
        </div>

      </form>
    </div>
  </div>
  `,
  styles: [`


.q-range {
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb; /* será sobrescrito por [style.background] */
  outline: none;
}

/* Thumb */
.q-range::-webkit-slider-thumb {
  appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #0d6efd;
  cursor: pointer;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(13,110,253,.2);
}
.q-range::-moz-range-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #0d6efd; border: none;
}

/* Regla / ticks */
.q-ticks {
  margin-top: 8px;
  display: grid;
  align-items: start;
}
.q-tick {
  position: relative;
  text-align: center;
}
.q-tick-mark {
  display: block;
  height: 8px;
  width: 1px;
  background: #9ca3af;
  margin: 0 auto 2px auto;
}
.q-tick-label {
  font-style: normal;
  font-size: 12px;
  color: #475569;
}

    .df-body { padding: 8px 12px 80px; background:#f7f8fa; }
    .df-container { max-width: 980px; margin: 0 auto; }
    .w-100 { width: 100%; }

    /* Card de Gran Factor */
    .gf-card { margin: 18px 0 22px; background:#fff; border:1px solid #e7eaf0; border-radius:14px; box-shadow:0 1px 6px rgba(16,24,40,.06); }
    .gf-card__header { display:flex; gap:14px; align-items:center; padding:16px 18px; border-bottom:1px solid #eef2f7; }
    .gf-card__accent { width:6px; align-self:stretch; border-radius:14px 0 0 0; background:#0d6efd; }
    .gf-card__titles { display:flex; align-items:center; gap:8px; min-width:0; }
    .gf-card__titles mat-icon { flex:0 0 auto; color:#0d6efd; }
    .gf-card__title { margin:0; font-size:1.1rem; font-weight:700; color:#1f2937; }
    .gf-card__meta { display:flex; align-items:center; gap:6px; color:#64748b; font-size:.85rem; }

    .serie { padding:14px 14px 18px; }
    .serie-card { border-radius:12px; border:1px solid #eef2f7; }
    .serie-card__header { padding:10px 16px; border-bottom:1px solid #f1f5f9; }
    .serie-card__title { font-weight:600; color:#111827; }
    .serie-card__content { padding:14px 16px 6px; }

    /* Bloque de pregunta */
    .q-block { margin:10px 0 14px; }
    .q-title { font-weight:600; color:#1f2937; margin-bottom:8px; display:flex; gap:.5rem; font-size:18px; align-items:flex-start; }
    .q-index { color:#0d6efd; }
    .q-radio-group { display:flex; flex-wrap:wrap; gap:10px 16px; }
    .q-radio ::ng-deep .mdc-form-field { align-items:center; }
    .q-error { display:flex; align-items:center; gap:6px; margin-top:6px; color:#dc2626; font-size:.9rem; }
    .q-divider { margin:12px 0; }

    /* Range estilizado */

    .q-range { width:100%; appearance:none; height:4px; border-radius:4px; background:#e5e7eb; outline:none; }
    .q-range::-webkit-slider-thumb { appearance:none; width:18px; height:18px; border-radius:50%; background:#0d6efd; cursor:pointer; box-shadow:0 0 0 2px #fff, 0 0 0 4px rgba(13,110,253,.2); }
    .q-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:#0d6efd; border:none; }
    .q-range-value { margin-top:6px; font-weight:600; color:#334155; }
    .q-range { pointer-events: auto; z-index: 1; }

    .security-verification { margin: 0 auto 10px; }

    /* Barra fija inferior */
    .submit-bar { position:fixed; left:0; right:0; bottom:0; z-index:999; display:flex; gap:16px; align-items:center; justify-content:center;
                  padding:10px 14px; background:#ffffff; border-top:1px solid #e7eaf0; box-shadow:0 -4px 10px rgba(16,24,40,.05); }
    .submit-bar__progress { display:flex; align-items:center; gap:10px; width: min(720px, 80vw); }
    .progress-line { flex:1; height:8px; background:#eef2f7; border-radius:999px; overflow:hidden; }
    .progress-line__fill { height:100%; background:#0d6efd; }
    .progress-text { min-width:120px; text-align:right; font-weight:600; color:#1f2937; }

    /* Responsivo */
    @media (max-width: 720px) {
      .df-body { padding-bottom: 92px; }
      .serie-card__content { padding:12px; }
      .q-radio-group { flex-direction:column; }
      .submit-bar { flex-direction:column; gap:8px; }
      .submit-bar__progress { width:100%; }
      .progress-text { text-align:center; }
    }

    /* Dark (si usas tema oscuro con clase en body) */
    :host-context(.dark-theme) .df-body { background:#0f1115; }
    :host-context(.dark-theme) .gf-card { background:#0f1115; border-color:#1f2937; }
    :host-context(.dark-theme) .gf-card__title, :host-context(.dark-theme) .q-title { color:#e5e7eb; }
    :host-context(.dark-theme) .serie-card { border-color:#1f2937; }
    :host-context(.dark-theme) .submit-bar { background:#0f1115; border-top-color:#1f2937; }
    :host-context(.dark-theme) .progress-line { background:#111827; }
  `]
})
export class DynamicFormComponent implements OnInit {
  @Input() formConfig!: any | null;
  @Input() idEmpleado!: number;
  @Input() idEncuestaEmpleado!: number;
  @Input() lang!: string;
  @Input() requireTurnstile = false;
  @Input() turnstileToken = '';
  @Output() turnstileResetRequested = new EventEmitter<void>();

  form!: FormGroup;
  idFlujo = 0;
  langStoreValue?: any;
  btnIsDisabled = false;
  isSubmitting = false;

  constructor(
    private formBuilderService: FormBuilderService,
    public languageService: LanguageService,
    private translate: TranslateService,
    private organizacionService: OrganizacionService
  ) {}

  ngOnInit(): void {
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe(l => this.translate.use(l));
    this.langStoreValue = this.lang;

    console.log('this.formconfig:: ', this.formConfig);

    this.form = this.formBuilderService.buildForm(this.formConfig!);
    this.idFlujo = this.formConfig!.Id;

    this.asignarIndicesGlobales();
    
  }

  /** Progreso visual de preguntas, sin controles técnicos como Turnstile. */
  get totalFields(): number {
    return this.getActiveSurveyFields().length;
  }

  get answeredCount(): number {
    return this.getActiveSurveyFields().filter((field) => this.isFieldAnswered(field)).length;
  }

  get progress(): number {
    if (!this.totalFields) return 0;
    return Math.max(0, Math.min(100, Math.round((this.answeredCount / this.totalFields) * 100)));
  }

  private getActiveSurveyFields(): any[] {
    const fields: any[] = [];
    const grandFactors = this.formConfig?.GranFactores;
    const series = Array.isArray(grandFactors) && grandFactors.length > 0
      ? grandFactors.flatMap((grandFactor: any) => grandFactor?.series ?? [])
      : this.formConfig?.series ?? [];

    for (const serie of series) {
      for (const field of serie?.fields ?? []) {
        if (
          field?.name &&
          field?.is_active !== 0 &&
          ['radio', 'text', 'iatext', 'slider', 'select', 'selectdem'].includes(field.type)
        ) {
          fields.push(field);
        }
      }
    }

    const uniqueFields = new Map<string, any>();
    fields.forEach((field) => uniqueFields.set(field.name, field));
    return Array.from(uniqueFields.values());
  }

  private isFieldAnswered(field: any): boolean {
    const control = this.form?.get(field.name);
    if (!control) {
      return false;
    }

    const value = control.value;
    if (field.type === 'slider') {
      // El slider inicia visualmente en el mínimo; solo cuenta tras interacción real.
      return control.dirty && value !== null && value !== undefined;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  trackByIdx = (_: number, __: any) => _;

  onSubmit() {
    if (this.form.invalid) {
      this.scrollToFirstInvalid();
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('MENUITEMS.DYNAMIC.INVALIDFORM'),
        text: this.translate.instant('MENUITEMS.DYNAMIC.INVALIDFORMMESSAGE'),
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    if (this.requireTurnstile && !this.turnstileToken) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('MENUITEMS.TURNSTILE.TITLE'),
        text: this.translate.instant('MENUITEMS.TURNSTILE.REQUIRED'),
      });
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    const respuestas = this.form.value;
    
    console.log('respuestas:: ', respuestas);

    const entries: [string, any][] = Object.entries(respuestas);
    const g_d: any = 
      { 
        res: [], 
        head: [{ IdEmpleado: this.idEmpleado }, { IdFlujo: this.idFlujo }],
        IdEncuestaEmpleado: this.idEncuestaEmpleado,
        Estado: 'Contestada',
        FechaInicio: null,
        FechaFinalizacion: new Date
      };

    entries.forEach(([name, valor]) => {
      console.log('name,valor: ', name + ', ' + valor);

      if(name.substring(0,6) == 'seldem'){
        const newid = this.getFieldIdByName(name);
        const tipo = name.substring(0, 6);
        g_d.res.push({ idPregunta: (newid ?? '').toString(), valor, tipo });
      }
      else{
        const newid = this.getFieldIdByName(name);
        const tipo = name.substring(0, 3);
        g_d.res.push({ idPregunta: (newid ?? '').toString(), valor, tipo });
      }

      
    });

    Swal.fire({
      title: this.translate.instant('MENUITEMS.DYNAMIC.UPLOAD'),
      html: this.translate.instant('MENUITEMS.DYNAMIC.SAVING'),
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    //console.log('LO QUE SE VA ENVIAR....', );
/*
    const datasUpdate: any = {
          IdEncuestaEmpleado: this.idEncuestaEmpleado,
          Estado: 'Contestada',
          FechaInicio: null,
          FechaFinalizacion: new Date
        };
    this.updateClimaEncuesta(datasUpdate);
*/
    this.isSubmitting = true;
    this.organizacionService.savePreguntas(g_d, this.turnstileToken).then((resilxis) => {
      if (resilxis.data.message === 'Respuestas guardadas y encuesta actualizada correctamente') {
        
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('MENUITEMS.DYNAMIC.SURVEYSUCCESS'),
          text: this.translate.instant('MENUITEMS.DYNAMIC.THANKS'),
          timer: 3000,
          showConfirmButton: false
        });
        this.btnIsDisabled = true;
        this.form.reset();
        this.form.disable();
      }
    }).catch((err) => {
      this.turnstileResetRequested.emit();
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('MENUITEMS.DYNAMIC.SURVEYERROR'),
        text: err?.response?.data?.message || err?.message || String(err),
        timer: 3000,
        showConfirmButton: false
      });
    }).finally(() => {
      this.isSubmitting = false;
    });
  }


  getRangeBackground(ctrlName: string, min: number, max: number): string {
  const val = Number(this.form.get(ctrlName)?.value ?? min);
  const pct = ((val - min) * 100) / Math.max(1, (max - min));
  // color activo y color base
  const active = '#0d6efd';
  const base = '#e5e7eb';
  return `linear-gradient(to right, ${active} 0%, ${active} ${pct}%, ${base} ${pct}%, ${base} 100%)`;
}

// cuántas marcas mostrar (una por paso, acotando para no saturar)
getTickCount(field: any): number {
  const min = Number(field.min ?? 0);
  const max = Number(field.max ?? 10);
  const step = Math.max(1, Number(field.step ?? 1));
  // máximo 20 marcas para no romper layout
  return Math.min(20, Math.floor((max - min) / step) + 1);
}

getTicks(field: any): number[] {
  const min = Number(field.min ?? 0);
  const max = Number(field.max ?? 10);
  const step = Math.max(1, Number(field.step ?? 1));
  const ticks: number[] = [];
  for (let v = min; v <= max && ticks.length < 20; v += step) ticks.push(v);
  return ticks;
}

  private scrollToFirstInvalid(): void {
    // intenta enfocar el primer control inválido
    const el = document.querySelector('.ng-invalid[formcontrolname]') as HTMLElement | null;
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
  }

  onSliderInput(ctrlName: string, ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value);
  this.form.get(ctrlName)?.setValue(v, { emitEvent: true });
}


  getFieldIdByName(targetName: any): number | undefined {
    for (const serie of this.formConfig!.series) {
      const match = serie.fields.find((field: any) => field.name === targetName);
      if (match) return match.id;
    }
    return undefined;
  }

  public updateClimaEncuesta(data: any): void {
    this.organizacionService.updateClimaEncuesta(data);
  }

  private asignarIndicesGlobales(): void {
    if (!this.formConfig?.GranFactores) return;

    let counter = 0;

    for (const gf of this.formConfig.GranFactores) {
      for (const serie of gf.series ?? []) {
        for (const field of serie.fields ?? []) {
          // Numerar solo preguntas que llevan índice visual
          if (['radio', 'text', 'iatext', 'slider', 'select', 'selectdem'].includes(field.type)) {
              counter += 1;
              field.qIndex = counter;
            }
        }
      }
    }
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
