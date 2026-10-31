import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ClimateSurveyPreviewData {
  title: string;
  subtitle?: string;
  granFactores: any[];
}

@Component({
  selector: 'app-climate-survey-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <section class="survey-preview">
      <header class="survey-preview__header">
        <div class="survey-preview__title">
          <span class="survey-preview__icon"><mat-icon>visibility</mat-icon></span>
          <div><span>Vista previa</span><h2>{{ data.title || 'Encuesta de clima' }}</h2><p *ngIf="data.subtitle">{{ data.subtitle }}</p></div>
        </div>
        <button mat-icon-button mat-dialog-close aria-label="Cerrar vista previa"><mat-icon>close</mat-icon></button>
      </header>
      <main class="survey-preview__body" *ngIf="surveys.length; else emptyPreview">
        <section class="preview-intro"><mat-icon>assignment</mat-icon><div><strong>Tu opinión es importante</strong><span>Selecciona la respuesta que mejor represente tu experiencia.</span></div></section>
        <section class="survey-block" *ngFor="let survey of surveys; let surveyIndex = index">
          <div class="survey-block__heading"><span>{{ surveyIndex + 1 }}</span><div><h3>{{ survey.label || 'Encuesta' }}</h3><p *ngIf="survey.desc">{{ survey.desc }}</p></div></div>
          <article class="factor-block" *ngFor="let factor of survey.series || []">
            <div class="factor-block__heading"><h4>{{ factor.label || 'Factor de encuesta' }}</h4><p *ngIf="factor.desc">{{ factor.desc }}</p></div>
            <div class="question-card" *ngFor="let question of activeQuestions(factor); let questionIndex = index">
              <div class="question-card__label"><span>{{ questionIndex + 1 }}</span><p>{{ question.label || question.name || 'Pregunta sin texto' }}</p></div>
              <ng-container [ngSwitch]="question.type">
                <div *ngSwitchCase="'radio'" class="likert-preview"><span *ngFor="let option of getOptions(question)"><i></i>{{ option.label }}</span></div>
                <div *ngSwitchCase="'select'" class="select-preview">Selecciona una opción <mat-icon>expand_more</mat-icon></div>
                <div *ngSwitchCase="'selectdem'" class="select-preview">Selecciona una opción <mat-icon>expand_more</mat-icon></div>
                <div *ngSwitchCase="'text'" class="textarea-preview">Escribe tu respuesta</div>
                <div *ngSwitchCase="'iatext'" class="textarea-preview">Escribe tu respuesta</div>
                <div *ngSwitchCase="'slider'" class="range-preview"><span class="range-preview__track"></span><span>{{ question.min || 0 }} - {{ question.max || 100 }}</span></div>
                <div *ngSwitchDefault class="text-preview">Escribe tu respuesta</div>
              </ng-container>
            </div>
          </article>
        </section>
      </main>
      <ng-template #emptyPreview><main class="survey-preview__empty"><mat-icon>quiz</mat-icon><h3>Aún no hay preguntas para mostrar</h3><p>Agrega preguntas a los factores de encuesta para visualizar esta vista previa.</p></main></ng-template>
      <footer class="survey-preview__footer"><button mat-stroked-button mat-dialog-close>Cerrar vista previa</button></footer>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    ::ng-deep .climate-survey-preview-dialog-panel .mat-mdc-dialog-surface {
      overflow: hidden;
      border: 1px solid var(--jl-border, #eadfce);
      border-radius: 8px;
      background: var(--jl-surface, #fffdf9);
      box-shadow: 0 18px 42px rgba(18, 43, 61, 0.18);
    }

    .survey-preview {
      --preview-navy: var(--jl-navy, #112d40);
      --preview-text: var(--jl-text, #1f3748);
      --preview-muted: var(--jl-muted, #6e7d87);
      --preview-orange: var(--jl-orange, #f58b2a);
      --preview-orange-strong: var(--jl-orange-strong, #d97018);
      --preview-orange-soft: var(--jl-orange-soft, #fff0df);
      --preview-cream: var(--jl-cream, #fffaf4);
      --preview-surface: var(--jl-surface, #fffdf9);
      --preview-border: var(--jl-border, #eadfce);
      --preview-border-strong: var(--jl-border-strong, #dec9ae);
      display: flex;
      min-width: min(860px, 94vw);
      max-height: 86vh;
      flex-direction: column;
      background: var(--preview-cream);
      color: var(--preview-text);
    }

    .survey-preview__header {
      display: flex;
      flex: 0 0 56px;
      height: 56px;
      align-items: center;
      justify-content: space-between;
      padding: 7px 14px;
      border-bottom: 1px solid var(--preview-border);
      background: linear-gradient(90deg, #fff7ee 0%, var(--preview-surface) 78%);
    }

    .survey-preview__title {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 10px;
    }

    .survey-preview__icon {
      display: flex;
      width: 34px;
      height: 34px;
      align-items: center;
      justify-content: center;
      border-radius: 7px;
      background: var(--preview-orange-soft);
      color: var(--preview-orange-strong);
    }

    .survey-preview__icon mat-icon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }

    .survey-preview__title span:not(.survey-preview__icon) {
      display: block;
      color: var(--preview-orange-strong);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .survey-preview__title h2 {
      margin: 1px 0;
      color: var(--preview-navy);
      font-size: 1rem;
      line-height: 1.2;
    }

    .survey-preview__title p {
      overflow: hidden;
      margin: 2px 0 0;
      color: var(--preview-muted);
      font-size: 0.74rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .survey-preview__header button {
      color: var(--preview-navy);
    }

    .survey-preview__header button:hover {
      background: var(--preview-orange-soft);
      color: var(--preview-orange-strong);
    }

    .survey-preview__body {
      overflow: auto;
      padding: 16px;
      background: var(--preview-cream);
    }

    .preview-intro {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding: 11px 13px;
      border: 1px solid var(--preview-border);
      border-left: 3px solid var(--preview-orange);
      background: var(--preview-surface);
    }

    .preview-intro mat-icon {
      color: var(--preview-orange-strong);
    }

    .preview-intro strong,
    .preview-intro span {
      display: block;
    }

    .preview-intro strong {
      color: var(--preview-navy);
      font-size: 0.84rem;
    }

    .preview-intro span {
      margin-top: 2px;
      color: var(--preview-muted);
      font-size: 0.75rem;
    }

    .survey-block {
      overflow: hidden;
      margin-bottom: 14px;
      border: 1px solid var(--preview-border);
      border-radius: 8px;
      background: var(--preview-surface);
      box-shadow: 0 2px 8px rgba(18, 43, 61, 0.04);
    }

    .survey-block__heading {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--preview-border);
      background: #fff7ee;
    }

    .survey-block__heading > span {
      display: flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--preview-orange-soft);
      color: var(--preview-orange-strong);
      font-size: 0.78rem;
      font-weight: 800;
    }

    .survey-block h3,
    .factor-block h4 {
      margin: 0;
      color: var(--preview-navy);
    }

    .survey-block h3 {
      font-size: 0.94rem;
    }

    .survey-block__heading p,
    .factor-block__heading p {
      margin: 3px 0 0;
      color: var(--preview-muted);
      font-size: 0.75rem;
    }

    .factor-block {
      padding: 14px;
      border-bottom: 1px solid #f0e4d6;
    }

    .factor-block:last-child {
      border-bottom: 0;
    }

    .factor-block h4 {
      font-size: 0.84rem;
    }

    .question-card {
      margin-top: 10px;
      padding: 12px;
      border: 1px solid var(--preview-border);
      border-radius: 7px;
      background: #ffffff;
    }

    .question-card__label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .question-card__label span {
      display: flex;
      flex: 0 0 21px;
      width: 21px;
      height: 21px;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--preview-orange-soft);
      color: var(--preview-orange-strong);
      font-size: 0.69rem;
      font-weight: 800;
    }

    .question-card__label p {
      margin: 1px 0 10px;
      color: var(--preview-navy);
      font-size: 0.83rem;
      font-weight: 650;
      line-height: 1.42;
    }

    .likert-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 18px;
    }

    .likert-preview span {
      display: flex;
      align-items: center;
      gap: 5px;
      color: var(--preview-text);
      font-size: 0.76rem;
    }

    .likert-preview i {
      width: 14px;
      height: 14px;
      border: 1px solid #c89460;
      border-radius: 50%;
      background: #fffaf4;
    }

    .select-preview,
    .text-preview,
    .textarea-preview {
      display: flex;
      width: 100%;
      max-width: 650px;
      min-height: 37px;
      align-items: center;
      justify-content: space-between;
      padding: 8px 9px;
      border: 1px solid var(--preview-border-strong);
      border-radius: 5px;
      background: var(--preview-surface);
      color: var(--preview-muted);
      font-size: 0.8rem;
    }

    .textarea-preview {
      min-height: 78px;
      align-items: flex-start;
    }

    .select-preview {
      max-width: 420px;
    }

    .select-preview mat-icon {
      width: 18px;
      height: 18px;
      color: var(--preview-orange-strong);
      font-size: 18px;
    }

    .range-preview {
      display: flex;
      max-width: 460px;
      align-items: center;
      gap: 12px;
    }

    .range-preview__track {
      display: block;
      flex: 1;
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--preview-orange) 0 46%, #f2e3d0 46%);
    }

    .range-preview span:last-child {
      color: var(--preview-muted);
      font-size: 0.72rem;
      white-space: nowrap;
    }

    .survey-preview__empty {
      display: flex;
      min-height: 270px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 30px;
      background: var(--preview-surface);
      text-align: center;
    }

    .survey-preview__empty mat-icon {
      width: 34px;
      height: 34px;
      color: var(--preview-orange-strong);
      font-size: 34px;
    }

    .survey-preview__empty h3 {
      margin: 12px 0 4px;
      color: var(--preview-navy);
      font-size: 1rem;
    }

    .survey-preview__empty p {
      max-width: 420px;
      margin: 0;
      color: var(--preview-muted);
      font-size: 0.8rem;
    }

    .survey-preview__footer {
      display: flex;
      flex: 0 0 52px;
      justify-content: flex-end;
      padding: 8px 14px;
      border-top: 1px solid var(--preview-border);
      background: var(--preview-surface);
    }

    .survey-preview__footer button {
      border-color: var(--preview-border-strong);
      border-radius: 6px;
      color: var(--preview-navy);
    }

    .survey-preview__footer button:hover {
      border-color: var(--preview-orange);
      background: var(--preview-orange-soft);
      color: var(--preview-orange-strong);
    }

    @media (max-width: 700px) {
      .survey-preview {
        min-width: 0;
      }

      .survey-preview__body {
        padding: 10px;
      }

      .likert-preview {
        display: grid;
        grid-template-columns: 1fr;
      }

      .survey-preview__title p {
        max-width: 190px;
      }

      .factor-block {
        padding: 11px;
      }

      .question-card {
        padding: 10px;
      }
    }

    :host-context(.dark) .survey-preview,
    :host-context(.dark-theme) .survey-preview {
      --preview-navy: #eef4fb;
      --preview-text: #e8eff6;
      --preview-muted: #9aa8bc;
      --preview-orange: #8fc7f1;
      --preview-orange-strong: #8fc7f1;
      --preview-orange-soft: #26364a;
      --preview-cream: #141b26;
      --preview-surface: #1a2330;
      --preview-border: #34445a;
      --preview-border-strong: #41536b;
      background: #141b26;
      color: #e8eff6;
    }

    :host-context(.dark) .survey-preview__header,
    :host-context(.dark-theme) .survey-preview__header {
      background: #1d2938;
      border-color: #33445a;
    }

    :host-context(.dark) .survey-preview__body,
    :host-context(.dark-theme) .survey-preview__body {
      background: #141b26;
    }

    :host-context(.dark) .survey-block__heading,
    :host-context(.dark-theme) .survey-block__heading {
      background: #202c3b;
    }

    :host-context(.dark) .question-card,
    :host-context(.dark-theme) .question-card,
    :host-context(.dark) .text-preview,
    :host-context(.dark-theme) .text-preview,
    :host-context(.dark) .textarea-preview,
    :host-context(.dark-theme) .textarea-preview,
    :host-context(.dark) .select-preview,
    :host-context(.dark-theme) .select-preview {
      background: #111822;
      border-color: #41536b;
      color: #edf4fb;
    }
  `],
})
export class ClimateSurveyPreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ClimateSurveyPreviewData) {}
  get surveys(): any[] { return (this.data?.granFactores ?? []).filter((survey) => this.activeQuestionsInSurvey(survey).length > 0); }
  activeQuestions(factor: any): any[] { return (factor?.fields ?? []).filter((question: any) => Number(question?.is_active ?? question?.isActive ?? 1) !== 0); }
  getOptions(question: any): Array<{ label: string; value: string }> { return (question?.options ?? []).map((option: any, index: number) => ({ label: String(option?.label ?? option?.name ?? option?.value ?? option ?? `Opción ${index + 1}`), value: String(option?.value ?? option?.label ?? option?.name ?? index + 1) })); }
  private activeQuestionsInSurvey(survey: any): any[] { return (survey?.series ?? []).flatMap((factor: any) => this.activeQuestions(factor)); }
}
