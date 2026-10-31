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
    :host {
      --jl-navy: #112d40;
      --jl-navy-soft: #173d56;
      --jl-orange: #f58b2a;
      --jl-orange-strong: #d97018;
      --jl-orange-soft: #fff0df;
      --jl-cream: #fffaf4;
      --jl-surface: #fffdf9;
      --jl-border: #eadfce;
      --jl-border-strong: #dec9ae;
      --jl-text: #1f3748;
      --jl-muted: #6e7d87;
      --jl-danger: #c03945;
      display: block;
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);
    }

    .df-body {
      padding: 6px 12px 92px;
      background: transparent;
    }

    .df-container {
      max-width: 1080px;
      margin: 0 auto;
    }

    .w-100 {
      width: 100%;
    }

    .gf-card {
      position: relative;
      overflow: hidden;
      margin: 18px 0 22px;
      border: 1px solid var(--jl-border);
      border-radius: 8px;
      background: var(--jl-surface);
      box-shadow: 0 10px 26px rgba(18, 43, 61, 0.07);
    }

    .gf-card__header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      border-bottom: 1px solid #efe2d3;
      background: linear-gradient(90deg, #fff4e6 0%, #fffdf9 100%);
    }

    .gf-card__accent {
      align-self: stretch;
      width: 5px;
      min-height: 42px;
      border-radius: 6px;
      background: var(--jl-orange);
      box-shadow: 0 0 0 4px rgba(245, 139, 42, 0.12);
    }

    .gf-card__titles {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 10px;
    }

    .gf-card__titles mat-icon {
      display: inline-grid;
      flex: 0 0 auto;
      width: 32px;
      height: 32px;
      place-items: center;
      color: var(--jl-orange-strong);
      border-radius: 6px;
      background: var(--jl-orange-soft);
      font-family: "Material Icons" !important;
      font-size: 20px;
      line-height: 32px;
    }

    .gf-card__title {
      overflow-wrap: anywhere;
      margin: 0;
      color: var(--jl-navy);
      font-size: 1.12rem;
      font-weight: 780;
      line-height: 1.2;
    }

    .gf-card__meta {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--jl-muted);
      font-size: 0.85rem;
    }

    .serie {
      padding: 14px 16px 18px;
    }

    .serie-card {
      overflow: hidden;
      border: 1px solid #eadfce;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: none;
    }

    .serie-card__header {
      padding: 12px 16px;
      border-bottom: 1px solid #f0e6da;
      background: #fffaf4;
    }

    .serie-card__title {
      color: var(--jl-navy);
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;
      font-size: 1rem;
      font-weight: 750;
      line-height: 1.25;
    }

    .serie-card__content {
      padding: 16px 18px 8px;
    }

    .q-block {
      margin: 10px 0 16px;
    }

    .q-title {
      display: flex;
      align-items: flex-start;
      gap: 0.55rem;
      margin-bottom: 12px;
      color: var(--jl-text);
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;
      font-size: 17px;
      font-weight: 720;
      line-height: 1.35;
    }

    .q-index {
      flex: 0 0 auto;
      color: var(--jl-orange-strong);
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;
      font-weight: 820;
    }

    .q-radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
    }

    .q-radio {
      --mdc-radio-selected-icon-color: var(--jl-orange-strong);
      --mdc-radio-selected-hover-icon-color: var(--jl-orange-strong);
      --mdc-radio-selected-focus-icon-color: var(--jl-orange-strong);
      --mdc-radio-selected-pressed-icon-color: var(--jl-orange-strong);
      --mdc-radio-unselected-hover-icon-color: var(--jl-navy);
      color: #3e5361;
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);
    }

    .q-radio ::ng-deep .mdc-form-field {
      align-items: center;
    }

    :host ::ng-deep .q-radio .mdc-form-field,
    :host ::ng-deep .q-radio .mdc-label,
    :host ::ng-deep .gf-card__title,
    :host ::ng-deep .serie-card__title,
    :host ::ng-deep .mat-mdc-card-title,
    :host ::ng-deep .mat-mdc-card-subtitle,
    :host ::ng-deep .mat-mdc-card-content,
    :host ::ng-deep .mat-mdc-card-content *,
    :host ::ng-deep .q-title,
    :host ::ng-deep .q-title *,
    :host ::ng-deep .q-index,
    :host ::ng-deep .mat-mdc-radio-button .mdc-form-field,
    :host ::ng-deep .mat-mdc-radio-button .mdc-label,
    :host ::ng-deep .mat-mdc-form-field,
    :host ::ng-deep .mat-mdc-input-element,
    :host ::ng-deep .mat-mdc-select-value,
    :host ::ng-deep .mdc-button__label {
      font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;
    }

    .q-error {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      color: var(--jl-danger);
      font-size: 0.9rem;
      font-weight: 650;
    }

    .q-error mat-icon {
      display: none;
      width: 19px;
      height: 19px;
      font-size: 19px;
    }

    .q-divider {
      margin: 14px 0;
      border-top-color: #efe2d3;
    }

    .q-range {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 6px;
      border-radius: 999px;
      appearance: none;
      background: #f1e4d5;
      outline: none;
      pointer-events: auto;
    }

    .q-range::-webkit-slider-thumb {
      width: 19px;
      height: 19px;
      cursor: pointer;
      border-radius: 50%;
      appearance: none;
      background: var(--jl-orange);
      box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);
    }

    .q-range::-moz-range-thumb {
      width: 19px;
      height: 19px;
      cursor: pointer;
      border: none;
      border-radius: 50%;
      background: var(--jl-orange);
      box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);
    }

    .q-ticks {
      display: grid;
      align-items: start;
      margin-top: 10px;
    }

    .q-tick {
      position: relative;
      text-align: center;
    }

    .q-tick-mark {
      display: block;
      width: 1px;
      height: 8px;
      margin: 0 auto 3px;
      background: #d2c1ad;
    }

    .q-tick-label {
      color: #6e7d87;
      font-size: 12px;
      font-style: normal;
    }

    .q-range-value {
      margin-top: 8px;
      color: var(--jl-navy);
      font-weight: 700;
    }

    .security-verification {
      max-width: 1080px;
      margin: 2px auto 12px;
      padding: 14px 16px;
      border: 1px solid var(--jl-border);
      border-radius: 8px;
      background: rgba(255, 253, 249, 0.9);
      box-shadow: 0 8px 20px rgba(18, 43, 61, 0.045);
    }

    .submit-bar {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 12px 16px;
      border-top: 1px solid var(--jl-border);
      background: rgba(255, 250, 244, 0.96);
      box-shadow: 0 -10px 28px rgba(18, 43, 61, 0.1);
      backdrop-filter: blur(12px);
    }

    .submit-bar__progress {
      display: flex;
      align-items: center;
      gap: 12px;
      width: min(720px, 78vw);
    }

    .progress-line {
      flex: 1;
      height: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: #f2e4d3;
    }

    .progress-line__fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--jl-orange) 0%, #ffb052 100%);
    }

    .progress-text {
      min-width: 122px;
      color: var(--jl-navy);
      font-weight: 760;
      text-align: right;
    }

    :host ::ng-deep .mat-mdc-form-field {
      --mdc-outlined-text-field-outline-color: #dac7af;
      --mdc-outlined-text-field-hover-outline-color: #bb9165;
      --mdc-outlined-text-field-focus-outline-color: var(--jl-orange-strong);
      --mdc-outlined-text-field-focus-label-text-color: var(--jl-orange-strong);
      --mat-form-field-focus-select-arrow-color: var(--jl-orange-strong);
    }

    :host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary {
      min-height: 42px;
      padding: 0 22px;
      color: var(--jl-navy);
      border-radius: 6px;
      background-color: var(--jl-orange);
      box-shadow: 0 7px 16px rgba(217, 112, 24, 0.18);
      font-weight: 760;
    }

    :host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary:hover:not(:disabled) {
      background-color: var(--jl-orange-strong);
    }

    :host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary:disabled {
      color: #8e958f;
      background-color: #ece5dd;
      box-shadow: none;
    }

    @media (max-width: 720px) {
      .df-body {
        padding: 4px 10px 118px;
      }

      .gf-card__header,
      .serie-card__content {
        padding: 14px;
      }

      .serie {
        padding: 12px;
      }

      .q-radio-group {
        flex-direction: column;
        gap: 8px;
      }

      .submit-bar {
        flex-direction: column;
        gap: 9px;
      }

      .submit-bar__progress {
        width: 100%;
      }

      .progress-text {
        min-width: auto;
        text-align: center;
      }
    }

    :host-context(.dark),
    :host-context(.dark-theme) {
      --jl-navy: #e1e8ee;
      --jl-navy-soft: #cbd5df;
      --jl-surface: #171d25;
      --jl-border: #354452;
      --jl-border-strong: #465564;
      --jl-text: #e1e8ee;
      --jl-muted: #9cabb7;
    }

    :host-context(.dark) .gf-card,
    :host-context(.dark-theme) .gf-card,
    :host-context(.dark) .serie-card,
    :host-context(.dark-theme) .serie-card {
      border-color: #354452;
      background: #171d25;
    }

    :host-context(.dark) .gf-card__header,
    :host-context(.dark-theme) .gf-card__header,
    :host-context(.dark) .serie-card__header,
    :host-context(.dark-theme) .serie-card__header {
      border-color: #354452;
      background: #202832;
    }

    :host-context(.dark) .gf-card__title,
    :host-context(.dark-theme) .gf-card__title,
    :host-context(.dark) .serie-card__title,
    :host-context(.dark-theme) .serie-card__title,
    :host-context(.dark) .q-title,
    :host-context(.dark-theme) .q-title,
    :host-context(.dark) .progress-text,
    :host-context(.dark-theme) .progress-text,
    :host-context(.dark) .q-range-value,
    :host-context(.dark-theme) .q-range-value {
      color: #e1e8ee;
    }

    :host-context(.dark) .q-radio,
    :host-context(.dark-theme) .q-radio,
    :host-context(.dark) .q-tick-label,
    :host-context(.dark-theme) .q-tick-label {
      color: #c7d1da;
    }

    :host-context(.dark) .q-divider,
    :host-context(.dark-theme) .q-divider {
      border-top-color: #354452;
    }

    :host-context(.dark) .security-verification,
    :host-context(.dark-theme) .security-verification,
    :host-context(.dark) .submit-bar,
    :host-context(.dark-theme) .submit-bar {
      border-color: #354452;
      background: rgba(17, 24, 32, 0.96);
    }

    :host-context(.dark) .progress-line,
    :host-context(.dark-theme) .progress-line {
      background: #29323c;
    }
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
  const active = '#f58b2a';
  const base = '#f2e4d3';
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
