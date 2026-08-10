import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  DesempenoAnswer,
  DesempenoAnswerPayload,
  DesempenoEvaluationCriterion,
  DesempenoEvaluationDimension,
  DesempenoEvaluationForm,
  DesempenoEvaluationItem,
} from '../completedesempenoalone.models';

interface ItemContext {
  dimension: DesempenoEvaluationDimension;
  criterion: DesempenoEvaluationCriterion;
  item: DesempenoEvaluationItem;
  index: number;
}

@Component({
  selector: 'app-dynamic-desempeno-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './dynamic-desempeno-form.component.html',
  styleUrls: ['./dynamic-desempeno-form.component.scss'],
})
export class DynamicDesempenoFormComponent implements OnChanges {
  @Input({ required: true }) evaluation!: DesempenoEvaluationForm;
  @Input() disabled = false;
  @Input() isSavingDraft = false;
  @Input() isFinalizing = false;
  @Input() canFinalize = true;
  @Output() draftSaveRequested = new EventEmitter<DesempenoAnswerPayload>();
  @Output() finalizeRequested = new EventEmitter<DesempenoAnswerPayload>();

  form = new FormGroup<Record<string, FormControl<unknown>>>({});
  itemContexts: ItemContext[] = [];
  submitted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evaluation']?.currentValue) {
      this.buildForm();
      return;
    }

    if (changes['disabled']) {
      this.applyDisabledState();
    }
  }

  get totalItems(): number {
    return this.itemContexts.length;
  }

  get answeredItems(): number {
    return this.itemContexts.filter(({ item }) => this.hasAnswer(item)).length;
  }

  get progress(): number {
    return this.totalItems
      ? Math.round((this.answeredItems / this.totalItems) * 100)
      : 0;
  }

  get unansweredRequiredCount(): number {
    return this.itemContexts.filter(
      ({ item }) => item.requerido && !this.hasAnswer(item)
    ).length;
  }

  controlName(item: DesempenoEvaluationItem): string {
    return `item_${item.id}`;
  }

  noApplyControlName(item: DesempenoEvaluationItem): string {
    return `item_${item.id}_no_aplica`;
  }

  questionIndex(item: DesempenoEvaluationItem): number {
    return this.itemContexts.findIndex((context) => context.item.id === item.id) + 1;
  }

  getControl(item: DesempenoEvaluationItem): FormControl<unknown> | null {
    return this.form.get(this.controlName(item)) as FormControl<unknown> | null;
  }

  isInvalid(item: DesempenoEvaluationItem): boolean {
    const control = this.getControl(item);
    return !!control?.invalid && (this.submitted || control.touched);
  }

  shouldShowText(item: DesempenoEvaluationItem): boolean {
    return item.permiteTexto || item.tipoItemCodigo === 'ABIERTA';
  }

  shouldShowNumber(item: DesempenoEvaluationItem): boolean {
    return item.tipoItemCodigo === 'NUMERICA';
  }

  shouldShowMultiple(item: DesempenoEvaluationItem): boolean {
    return item.permiteSeleccionMultiple || item.tipoItemCodigo === 'OPCION_MULTIPLE';
  }

  shouldShowSingle(item: DesempenoEvaluationItem): boolean {
    return item.usaEscala && !this.shouldShowMultiple(item);
  }

  toggleNoApply(item: DesempenoEvaluationItem, checked: boolean): void {
    if (this.disabled) {
      return;
    }

    const control = this.getControl(item);
    if (!control) {
      return;
    }

    if (checked) {
      control.reset(null);
      control.disable();
    } else {
      control.enable();
    }

    control.updateValueAndValidity();
  }

  saveDraft(): void {
    if (this.disabled || this.isSavingDraft || this.isFinalizing) {
      return;
    }

    this.draftSaveRequested.emit(this.buildPayload());
  }

  finalize(): void {
    if (
      this.disabled ||
      this.isSavingDraft ||
      this.isFinalizing ||
      !this.canFinalize
    ) {
      return;
    }

    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.scrollToFirstInvalid();
      return;
    }

    this.finalizeRequested.emit(this.buildPayload());
  }

  trackById(_index: number, value: { id: number }): number {
    return value.id;
  }

  private buildForm(): void {
    const controls: Record<string, FormControl<unknown>> = {};
    this.itemContexts = [];
    let index = 0;

    this.evaluation.dimensiones
      .slice()
      .sort((left, right) => left.orden - right.orden)
      .forEach((dimension) => {
        dimension.criterios
          .slice()
          .sort((left, right) => left.orden - right.orden)
          .forEach((criterion) => {
            criterion.items
              .slice()
              .sort((left, right) => left.orden - right.orden)
              .forEach((item) => {
                index += 1;
                const validators = item.requerido ? [Validators.required] : [];
                controls[this.controlName(item)] = new FormControl<unknown>(
                  this.shouldShowMultiple(item) ? [] : null,
                  validators
                );

                if (item.permiteNoAplica) {
                  controls[this.noApplyControlName(item)] =
                    new FormControl<boolean>(false, { nonNullable: true });
                }

                this.itemContexts.push({ dimension, criterion, item, index });
              });
          });
      });

    this.form = new FormGroup(controls);
    this.submitted = false;
    this.applyDisabledState();
  }

  private hasAnswer(item: DesempenoEvaluationItem): boolean {
    const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
    if (noApply) {
      return true;
    }

    const value = this.getControl(item)?.value;
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  private buildPayload(): DesempenoAnswerPayload {
    return {
      respuestas: this.itemContexts.map((context) => this.buildAnswer(context)),
    };
  }

  private buildAnswer({ item }: ItemContext): DesempenoAnswer {
    const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
    const value = noApply ? null : this.getControl(item)?.value;
    const optionIds = Array.isArray(value)
      ? value.map(Number).filter((optionId) => Number.isFinite(optionId))
      : [];
    const selectedOptionId = Number(value);
    const hasSelectedOption = Number.isFinite(selectedOptionId) && selectedOptionId > 0;
    const textValue = typeof value === 'string' ? value.trim() : '';
    const numericValue = value === null || value === undefined || value === ''
      ? null
      : Number(value);

    return {
      itemId: item.id,
      escalaValorId: !noApply && this.shouldShowSingle(item) && hasSelectedOption
        ? selectedOptionId
        : null,
      valorNumero: !noApply &&
        this.shouldShowNumber(item) &&
        Number.isFinite(numericValue)
          ? numericValue
          : null,
      valorTexto: !noApply && this.shouldShowText(item) && textValue
        ? textValue
        : null,
      noAplica: noApply,
      opcionIds: !noApply && this.shouldShowMultiple(item) ? optionIds : [],
    };
  }

  private applyDisabledState(): void {
    if (this.disabled) {
      this.form.disable({ emitEvent: false });
      return;
    }

    this.form.enable({ emitEvent: false });

    for (const { item } of this.itemContexts) {
      const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
      if (noApply) {
        this.getControl(item)?.disable({ emitEvent: false });
      }
    }
  }

  private scrollToFirstInvalid(): void {
    const invalidElement = document.querySelector(
      '.performance-question.is-invalid'
    ) as HTMLElement | null;

    invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
