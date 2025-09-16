import { Component, Input, OnInit } from '@angular/core';
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
    MatDialogModule, MatTableModule, MatIconModule, MatExpansionModule, TranslateModule,
    FormsModule, ReactiveFormsModule, MatDividerModule, MatFormFieldModule, MatCardModule,
    MatTooltipModule, MatChipsModule, MatOptionModule, MatRippleModule,
    MatProgressSpinnerModule, MatRadioModule, MatInputModule, MatSelectModule,
    CommonModule, MatButtonModule
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
                      <label class="q-title">{{ field.label }}</label>
                      <mat-form-field appearance="outline" class="w-100">
                        <input matInput [formControlName]="field.name" [attr.aria-label]="field.label"
                               [maxlength]="field.maxLength || 500">
                        <mat-hint align="end">{{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 500 }}</mat-hint>
                        <mat-error *ngIf="form.get(field.name)?.invalid">
                          {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </ng-container>

                  <!-- IATEXT (igual que text; lo separamos por si luego analizas con IA) -->
                  <ng-container *ngIf="field.type === 'iatext'">
                    <div class="q-block">
                      <label class="q-title">{{ field.label }}</label>
                      <mat-form-field appearance="outline" class="w-100">
                        <textarea matInput rows="3" [formControlName]="field.name" [maxlength]="field.maxLength || 800"></textarea>
                        <mat-hint align="end">{{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 800 }}</mat-hint>
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
                        <span class="q-index">{{ i + 1 }}.</span>
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

                  <!-- SLIDER (input range nativo con estilos) -->
                  <ng-container *ngIf="field.type === 'slider'">
                    <div class="q-block">
                      <div class="q-title">{{ field.label }}</div>
                      <input class="q-range" type="range"
                             [formControlName]="field.name"
                             [min]="field.min" [max]="field.max" [step]="field.step || 1" />
                      <div class="q-range-value">{{ form.get(field.name)?.value }}</div>
                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>

                  <mat-divider class="q-divider"></mat-divider>
                </ng-container>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

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
                  [disabled]="form.invalid || btnIsDisabled" (click)="onSubmit()">
            <mat-icon>send</mat-icon>
            {{ 'MENUITEMS.ALONE.SEND' | translate }}
          </button>
        </div>

      </form>
    </div>
  </div>
  `,
  styles: [`
    .df-body { padding: 8px 12px 80px; background:#f7f8fa; }
    .df-container { max-width: 980px; margin: 0 auto; }
    .w-100 { width: 100%; }

    /* Card de Gran Factor */
    .gf-card { margin: 18px 0 22px; background:#fff; border:1px solid #e7eaf0; border-radius:14px; box-shadow:0 1px 6px rgba(16,24,40,.06); }
    .gf-card__header { display:flex; gap:14px; align-items:center; padding:16px 18px; border-bottom:1px solid #eef2f7; }
    .gf-card__accent { width:6px; align-self:stretch; border-radius:14px 0 0 0; background:#0d6efd; }
    .gf-card__titles { display:flex; flex-direction:column; gap:4px; }
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

  form!: FormGroup;
  idFlujo = 0;
  langStoreValue?: any;
  btnIsDisabled = false;

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

    this.form = this.formBuilderService.buildForm(this.formConfig!);
    this.idFlujo = this.formConfig!.Id;
  }

  /** Progreso visual */
  get totalFields(): number { return Object.keys(this.form?.controls || {}).length; }
  get answeredCount(): number {
    const v = this.form?.value || {};
    return Object.values(v).filter(val => val !== null && val !== '' && val !== undefined).length;
  }
  get progress(): number {
    if (!this.totalFields) return 0;
    return Math.max(0, Math.min(100, Math.round((this.answeredCount / this.totalFields) * 100)));
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

    const respuestas = this.form.value;
    const entries: [string, any][] = Object.entries(respuestas);
    const g_d: any = { res: [], head: [{ IdEmpleado: this.idEmpleado }, { IdFlujo: this.idFlujo }] };

    entries.forEach(([name, valor]) => {
      const newid = this.getFieldIdByName(name);
      const tipo = name.substring(0, 3);
      g_d.res.push({ idPregunta: (newid ?? '').toString(), valor, tipo });
    });

    Swal.fire({
      title: this.translate.instant('MENUITEMS.DYNAMIC.UPLOAD'),
      html: this.translate.instant('MENUITEMS.DYNAMIC.SAVING'),
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    console.log('LO QUE SE VA ENVIAR....', );

    this.organizacionService.savePreguntas(g_d).then((resilxis) => {
      if (resilxis.data.message === 'Respuestas guardadas correctamente') {
        const datasUpdate: any = {
          IdEncuestaEmpleado: this.idEncuestaEmpleado,
          Estado: 'Contestada',
          FechaInicio: null,
          FechaFinalizacion: new Date
        };
        this.updateClimaEncuesta(datasUpdate);
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
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('MENUITEMS.DYNAMIC.SURVEYERROR'),
        text: err,
        timer: 3000,
        showConfirmButton: false
      });
    });
  }

  private scrollToFirstInvalid(): void {
    // intenta enfocar el primer control inválido
    const el = document.querySelector('.ng-invalid[formcontrolname]') as HTMLElement | null;
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus?.();
    }
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
