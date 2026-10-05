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
    :host{display:block}.survey-preview{background:#f5f7fa;color:#22303b;display:flex;flex-direction:column;max-height:86vh;min-width:min(860px,94vw)}.survey-preview__header{align-items:center;background:#edf4f8;border-bottom:1px solid #d7e2e9;display:flex;flex:0 0 56px;height:56px;justify-content:space-between;padding:7px 14px}.survey-preview__title{align-items:center;display:flex;gap:10px;min-width:0}.survey-preview__icon{align-items:center;background:#dcecf3;border-radius:7px;color:#24627b;display:flex;height:34px;justify-content:center;width:34px}.survey-preview__icon mat-icon{font-size:20px;height:20px;width:20px}.survey-preview__title span:not(.survey-preview__icon){color:#587082;display:block;font-size:.7rem;font-weight:700;text-transform:uppercase}.survey-preview__title h2{font-size:1rem;line-height:1.2;margin:1px 0;color:#1f3340}.survey-preview__title p{color:#667c8b;font-size:.74rem;margin:2px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.survey-preview__body{background:#f5f7fa;overflow:auto;padding:16px}.preview-intro{align-items:center;background:#fff;border:1px solid #dbe6ed;border-left:3px solid #2e829a;display:flex;gap:10px;margin-bottom:14px;padding:11px 13px}.preview-intro mat-icon{color:#21758d}.preview-intro strong,.preview-intro span{display:block}.preview-intro strong{font-size:.84rem}.preview-intro span{color:#627583;font-size:.75rem;margin-top:2px}.survey-block{background:#fff;border:1px solid #dbe4ea;border-radius:8px;margin-bottom:14px;overflow:hidden}.survey-block__heading{align-items:center;background:#f8fafc;border-bottom:1px solid #e4eaee;display:flex;gap:10px;padding:12px 14px}.survey-block__heading>span{align-items:center;background:#e5f0f5;border-radius:50%;color:#24627b;display:flex;font-size:.78rem;font-weight:800;height:28px;justify-content:center;width:28px}.survey-block h3,.factor-block h4{color:#263b48;margin:0}.survey-block h3{font-size:.94rem}.survey-block__heading p,.factor-block__heading p{color:#6d7d89;font-size:.75rem;margin:3px 0 0}.factor-block{border-bottom:1px solid #e8edf1;padding:14px}.factor-block:last-child{border-bottom:0}.factor-block h4{font-size:.84rem}.question-card{border:1px solid #e2e9ee;border-radius:7px;margin-top:10px;padding:12px}.question-card__label{align-items:flex-start;display:flex;gap:8px}.question-card__label span{align-items:center;background:#edf3f6;border-radius:50%;color:#4a6675;display:flex;flex:0 0 21px;font-size:.69rem;font-weight:800;height:21px;justify-content:center;width:21px}.question-card__label p{font-size:.83rem;font-weight:650;line-height:1.42;margin:1px 0 10px}.likert-preview{display:flex;flex-wrap:wrap;gap:8px 18px}.likert-preview span{align-items:center;display:flex;font-size:.76rem;gap:5px}.likert-preview i{border:1px solid #8395a1;border-radius:50%;height:14px;width:14px}.select-preview,.text-preview,.textarea-preview{align-items:center;border:1px solid #cedbe3;border-radius:5px;color:#70808a;display:flex;font-size:.8rem;justify-content:space-between;max-width:650px;min-height:37px;padding:8px 9px;width:100%}.textarea-preview{align-items:flex-start;min-height:78px}.select-preview{max-width:420px}.select-preview mat-icon{font-size:18px;height:18px;width:18px}.range-preview{align-items:center;display:flex;gap:12px;max-width:460px}.range-preview__track{background:linear-gradient(90deg,#2f8299 0 46%,#dce5ea 46%);border-radius:999px;display:block;height:6px;flex:1}.range-preview span:last-child{color:#71808a;font-size:.72rem;white-space:nowrap}.survey-preview__empty{align-items:center;background:#fff;display:flex;flex-direction:column;justify-content:center;min-height:270px;padding:30px;text-align:center}.survey-preview__empty mat-icon{color:#6d8999;font-size:34px;height:34px;width:34px}.survey-preview__empty h3{font-size:1rem;margin:12px 0 4px}.survey-preview__empty p{color:#72818b;font-size:.8rem;margin:0;max-width:420px}.survey-preview__footer{background:#fff;border-top:1px solid #dfe7ec;display:flex;flex:0 0 52px;justify-content:flex-end;padding:8px 14px}@media(max-width:700px){.survey-preview{min-width:0}.survey-preview__body{padding:10px}.likert-preview{display:grid;grid-template-columns:1fr}.survey-preview__title p{max-width:190px}.factor-block{padding:11px}.question-card{padding:10px}}:host-context(.dark) .survey-preview,:host-context(.dark-theme) .survey-preview{background:#141b26;color:#e8eff6}:host-context(.dark) .survey-preview__header,:host-context(.dark-theme) .survey-preview__header{background:#1d2938;border-color:#33445a}:host-context(.dark) .survey-preview__title h2,:host-context(.dark-theme) .survey-preview__title h2,:host-context(.dark) .survey-block h3,:host-context(.dark-theme) .survey-block h3,:host-context(.dark) .factor-block h4,:host-context(.dark-theme) .factor-block h4{color:#eef4fb}:host-context(.dark) .survey-preview__body,:host-context(.dark-theme) .survey-preview__body{background:#141b26}:host-context(.dark) .survey-block,:host-context(.dark-theme) .survey-preview__empty,:host-context(.dark) .preview-intro,:host-context(.dark-theme) .survey-block,:host-context(.dark-theme) .survey-preview__empty,:host-context(.dark-theme) .preview-intro,:host-context(.dark) .survey-preview__footer,:host-context(.dark-theme) .survey-preview__footer{background:#1a2330;border-color:#34445a}:host-context(.dark) .survey-block__heading,:host-context(.dark-theme) .survey-block__heading{background:#202c3b;border-color:#34445a}:host-context(.dark) .question-card,:host-context(.dark-theme) .question-card{border-color:#34445a}:host-context(.dark) .text-preview,:host-context(.dark-theme) .text-preview,:host-context(.dark) .textarea-preview,:host-context(.dark-theme) .textarea-preview,:host-context(.dark) .select-preview,:host-context(.dark-theme) .select-preview{background:#111822;border-color:#41536b;color:#edf4fb}
  `],
})
export class ClimateSurveyPreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: ClimateSurveyPreviewData) {}
  get surveys(): any[] { return (this.data?.granFactores ?? []).filter((survey) => this.activeQuestionsInSurvey(survey).length > 0); }
  activeQuestions(factor: any): any[] { return (factor?.fields ?? []).filter((question: any) => Number(question?.is_active ?? question?.isActive ?? 1) !== 0); }
  getOptions(question: any): Array<{ label: string; value: string }> { return (question?.options ?? []).map((option: any, index: number) => ({ label: String(option?.label ?? option?.name ?? option?.value ?? option ?? `Opción ${index + 1}`), value: String(option?.value ?? option?.label ?? option?.name ?? index + 1) })); }
  private activeQuestionsInSurvey(survey: any): any[] { return (survey?.series ?? []).flatMap((factor: any) => this.activeQuestions(factor)); }
}
