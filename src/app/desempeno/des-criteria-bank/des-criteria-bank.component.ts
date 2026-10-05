import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import {
  CriteriaBankExcelValidationError,
  parseCriteriaBankWorkbook,
} from './criteria-bank-excel';
import {
  CriteriaBankCriterion,
  CriteriaBankImportCriterion,
  CriteriaBankImportResult,
  CriteriaBankListResponse,
  CriteriaBankQuestion,
  CriteriaBankQuestionType,
} from './criteria-bank.models';

interface CriteriaBankImportSummary {
  newCriteria: number;
  mergedCriteria: number;
  newQuestions: number;
  skippedQuestions: number;
}

@Component({
  selector: 'app-des-criteria-bank',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './des-criteria-bank.component.html',
  styleUrls: ['./des-criteria-bank.component.scss'],
})
export class DesCriteriaBankComponent implements OnInit, OnDestroy {
  @ViewChild('criterionDialogTemplate') criterionDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('importPreviewDialogTemplate') importPreviewDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('guideDialogTemplate') guideDialogTemplate?: TemplateRef<unknown>;

  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.CRITERIA_BANK.TEXT';
  readonly breadcrumbItems = ['Home', 'Desempeño', 'Biblioteca'];
  readonly questionTypeOptions: Array<{ value: CriteriaBankQuestionType; labelKey: string }> = [
    { value: 'LIKERT_1_5', labelKey: 'DESEMPENO_MENUITEMS.CRITERIA_BANK.TYPES.LIKERT' },
    { value: 'ABIERTA', labelKey: 'DESEMPENO_MENUITEMS.CRITERIA_BANK.TYPES.OPEN' },
  ];
  readonly tagSeparatorKeysCodes: number[] = [ENTER, COMMA];

  public criteria: CriteriaBankCriterion[] = [];
  public selectedOrganizationId: number | null = null;
  public selectedOrganizationName = '';
  public searchTerm = '';
  public selectedDimension = 'ALL';
  public selectedQuestionType = 'ALL';
  public selectedTags: string[] = [];
  public pageIndex = 0;
  public pageSize = 8;
  public isLoading = false;
  public isImporting = false;
  public isSaving = false;
  public editingCriterionId: string | null = null;
  public pendingImport: CriteriaBankImportResult | null = null;
  public pendingImportSummary: CriteriaBankImportSummary | null = null;
  public pendingImportFileName = '';
  public criterionForm: FormGroup;

  private selectedOrganizationSubscription?: Subscription;
  private criterionDialogRef?: MatDialogRef<unknown>;
  private importDialogRef?: MatDialogRef<unknown>;
  private criteriaLoadSequence = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly organizationService: OrganizacionService,
    private readonly translate: TranslateService,
  ) {
    this.criterionForm = this.createCriterionForm();
  }

  ngOnInit(): void {
    this.selectedOrganizationSubscription = this.organizationService.selectedOrganization$.subscribe(
      (organization) => {
        this.selectedOrganizationId = organization?.Id ?? null;
        this.selectedOrganizationName = organization?.Nombre ?? '';
        this.resetFilters();
        void this.loadCriteria();
      }
    );
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
    this.criterionDialogRef?.close();
    this.importDialogRef?.close();
  }

  get hasSelectedOrganization(): boolean {
    return !!this.selectedOrganizationId;
  }

  get questions(): FormArray {
    return this.criterionForm.get('questions') as FormArray;
  }

  get isEditing(): boolean {
    return !!this.editingCriterionId;
  }

  get availableDimensions(): string[] {
    return this.uniqueSorted(
      this.criteria.map((criterion) => criterion.suggestedDimension).filter(Boolean)
    );
  }

  get availableTags(): string[] {
    return this.uniqueSorted(this.criteria.flatMap((criterion) => criterion.tags));
  }

  get totalQuestions(): number {
    return this.criteria.reduce((total, criterion) => total + criterion.questions.length, 0);
  }

  get likertQuestionCount(): number {
    return this.criteria.reduce(
      (total, criterion) => total + criterion.questions.filter((question) => question.type === 'LIKERT_1_5').length,
      0
    );
  }

  get openQuestionCount(): number {
    return this.totalQuestions - this.likertQuestionCount;
  }

  get activeCriterionCount(): number {
    return this.criteria.filter((criterion) => criterion.active).length;
  }

  get formTags(): string[] {
    return this.parseTags(this.criterionForm.get('tagsText')?.value ?? '');
  }

  get filteredCriteria(): CriteriaBankCriterion[] {
    const search = this.normalize(this.searchTerm);
    return this.criteria.filter((criterion) => {
      const matchesSearch = !search || this.normalize([
        criterion.code,
        criterion.name,
        criterion.description,
        criterion.suggestedDimension,
        ...criterion.tags,
        ...criterion.questions.map((question) => question.text),
      ].join(' ')).includes(search);
      const matchesDimension = this.selectedDimension === 'ALL' ||
        criterion.suggestedDimension === this.selectedDimension;
      const matchesType = this.selectedQuestionType === 'ALL' ||
        criterion.questions.some((question) => question.type === this.selectedQuestionType);
      const matchesTags = this.selectedTags.length === 0 ||
        this.selectedTags.every((tag) => criterion.tags.includes(tag));
      return matchesSearch && matchesDimension && matchesType && matchesTags;
    });
  }

  get visibleCriteria(): CriteriaBankCriterion[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredCriteria.slice(start, start + this.pageSize);
  }

  onFilterChange(): void {
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedDimension = 'ALL';
    this.selectedQuestionType = 'ALL';
    this.selectedTags = [];
    this.pageIndex = 0;
  }

  openCreateDialog(): void {
    if (!this.hasSelectedOrganization || !this.criterionDialogTemplate) {
      return;
    }

    this.editingCriterionId = null;
    this.criterionForm = this.createCriterionForm();
    this.addQuestion();
    this.openCriterionDialog();
  }

  openEditDialog(criterion: CriteriaBankCriterion): void {
    if (!this.criterionDialogTemplate) {
      return;
    }

    this.editingCriterionId = criterion.id;
    this.criterionForm = this.createCriterionForm();
    this.criterionForm.patchValue({
      code: criterion.code,
      name: criterion.name,
      description: criterion.description,
      suggestedDimension: criterion.suggestedDimension,
      requiredLevel: criterion.requiredLevel,
      tagsText: criterion.tags.join(', '),
      active: criterion.active,
    });
    criterion.questions.forEach((question) => this.addQuestion(question));
    this.openCriterionDialog();
  }

  addQuestion(question?: CriteriaBankQuestion): void {
    this.questions.push(this.fb.group({
      id: [question?.id ?? this.createId()],
      text: [question?.text ?? '', [Validators.required, Validators.maxLength(1000)]],
      type: [question?.type ?? 'LIKERT_1_5', Validators.required],
      suggestedScale: [question?.suggestedScale ?? 'Cumplimiento'],
    }));
  }

  removeQuestion(index: number): void {
    if (this.questions.length <= 1) {
      return;
    }
    this.questions.removeAt(index);
  }

  onQuestionTypeChange(index: number, type: CriteriaBankQuestionType): void {
    const question = this.questions.at(index);
    question.patchValue({
      suggestedScale: type === 'ABIERTA' ? '' : question.get('suggestedScale')?.value || 'Cumplimiento',
    }, { emitEvent: false });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const tag = this.normalizeTag(value);

    if (tag) {
      const tags = this.uniqueSorted([...this.formTags, tag]);
      this.criterionForm.get('tagsText')?.setValue(tags.join(', '));
      this.criterionForm.get('tagsText')?.markAsDirty();
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = this.normalizeTag(tag);
    const tags = this.formTags.filter((current) => current !== normalizedTag);
    this.criterionForm.get('tagsText')?.setValue(tags.join(', '));
    this.criterionForm.get('tagsText')?.markAsDirty();
  }

  async saveCriterion(): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    this.criterionForm.markAllAsTouched();
    if (this.criterionForm.invalid) {
      await Swal.fire({
        icon: 'warning',
        title: this.t('MESSAGES.INVALID_TITLE'),
        text: this.t('MESSAGES.INVALID_TEXT'),
      });
      return;
    }

    const value = this.criterionForm.getRawValue();
    const code = String(value.code || this.createCode(value.name)).trim().toUpperCase();
    const duplicateCriterion = this.criteria.find((criterion) =>
      criterion.id !== this.editingCriterionId &&
      (this.normalize(criterion.code) === this.normalize(code) ||
        (this.normalize(criterion.name) === this.normalize(value.name) &&
          this.normalize(criterion.suggestedDimension) === this.normalize(value.suggestedDimension)))
    );

    if (duplicateCriterion) {
      await Swal.fire({
        icon: 'warning',
        title: this.t('MESSAGES.DUPLICATE_TITLE'),
        text: this.t('MESSAGES.DUPLICATE_TEXT'),
      });
      return;
    }

    const normalizedQuestions = value.questions.map((question: any) => ({
      id: String(question.id || this.createId()),
      text: String(question.text ?? '').trim(),
      type: question.type as CriteriaBankQuestionType,
      suggestedScale: question.type === 'ABIERTA'
        ? null
        : String(question.suggestedScale || 'Cumplimiento').trim(),
    })) as CriteriaBankQuestion[];
    const duplicateQuestion = normalizedQuestions.find((question, index) =>
      normalizedQuestions.some((other, otherIndex) =>
        index !== otherIndex && this.normalize(question.text) === this.normalize(other.text)
      )
    );

    if (duplicateQuestion) {
      await Swal.fire({
        icon: 'warning',
        title: this.t('MESSAGES.REPEATED_QUESTION_TITLE'),
        text: this.t('MESSAGES.REPEATED_QUESTION_TEXT'),
      });
      return;
    }

    const existing = this.criteria.find((criterion) => criterion.id === this.editingCriterionId);
    const criterion = {
      organizationId: this.selectedOrganizationId,
      code,
      name: String(value.name).trim(),
      description: String(value.description ?? '').trim(),
      suggestedDimension: String(value.suggestedDimension ?? '').trim(),
      requiredLevel: Number(value.requiredLevel),
      tags: this.parseTags(value.tagsText),
      active: !!value.active,
      questions: normalizedQuestions.map((question, index) => ({
        ...this.toApiQuestion(question),
        order: index + 1,
        active: question.active !== false,
        required: question.required !== false,
      })),
    };

    this.isSaving = true;
    try {
      const response = await this.organizationService.saveDesempenoCriteriaBankCriterion(
        criterion,
        existing?.id ?? null
      );
      const saved = this.normalizeCriteriaBankCriterion(response?.data?.data);
      if (saved) {
        this.criteria = existing
          ? this.criteria.map((item) => item.id === existing.id ? saved : item)
          : [saved, ...this.criteria];
        this.criteria = this.sortCriteria(this.criteria);
      } else {
        await this.loadCriteria();
      }
      this.criterionDialogRef?.close();

      await Swal.fire({
        icon: 'success',
        title: this.t(existing ? 'MESSAGES.UPDATED_TITLE' : 'MESSAGES.CREATED_TITLE'),
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: this.t('MESSAGES.ERROR_TITLE'),
        text: this.getApiErrorMessage(error, this.t('MESSAGES.ERROR_TEXT')),
      });
    } finally {
      this.isSaving = false;
    }
  }

  async deleteCriterion(criterion: CriteriaBankCriterion): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: this.t('MESSAGES.DELETE_TITLE'),
      text: this.translate.instant('DESEMPENO_MENUITEMS.CRITERIA_BANK.MESSAGES.DELETE_TEXT', {
        name: criterion.name,
      }),
      showCancelButton: true,
      confirmButtonText: this.t('MESSAGES.DELETE_CONFIRM'),
      cancelButtonText: this.t('CANCEL'),
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) {
      return;
    }

    this.isSaving = true;
    try {
      await this.organizationService.deleteDesempenoCriteriaBankCriterion(
        criterion.id,
        this.selectedOrganizationId!
      );
      this.criteria = this.criteria.filter((item) => item.id !== criterion.id);
      this.ensureValidPage();
      await Swal.fire({
        icon: 'success',
        title: this.t('MESSAGES.DELETED_TITLE'),
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: this.t('MESSAGES.ERROR_TITLE'),
        text: this.getApiErrorMessage(error, this.t('MESSAGES.ERROR_TEXT')),
      });
    } finally {
      this.isSaving = false;
    }
  }

  async toggleCriterionStatus(criterion: CriteriaBankCriterion): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    const previous = this.criteria;
    const updated = { ...criterion, active: !criterion.active, updatedAt: new Date().toISOString() };
    this.criteria = this.criteria.map((item) => item.id === criterion.id ? updated : item);
    try {
      await this.organizationService.updateDesempenoCriteriaBankCriterionStatus(
        criterion.id,
        this.selectedOrganizationId,
        updated.active
      );
    } catch (error) {
      this.criteria = previous;
      await Swal.fire({
        icon: 'error',
        title: this.t('MESSAGES.ERROR_TITLE'),
        text: this.getApiErrorMessage(error, this.t('MESSAGES.ERROR_TEXT')),
      });
    }
  }

  openGuide(): void {
    if (!this.guideDialogTemplate) {
      return;
    }
    this.dialog.open(this.guideDialogTemplate, {
      width: 'min(720px, 94vw)',
      maxWidth: '94vw',
      autoFocus: false,
    });
  }

  async onExcelSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }
    if (!/\.xlsx$/i.test(file.name)) {
      await Swal.fire({
        icon: 'warning',
        title: this.t('IMPORT.INVALID_FILE_TITLE'),
        text: this.t('IMPORT.INVALID_FILE_TEXT'),
      });
      return;
    }

    this.isImporting = true;
    try {
      const parsed = await parseCriteriaBankWorkbook(await file.arrayBuffer());
      const conflicts = this.getImportConflicts(parsed.criteria);
      if (conflicts.length > 0) {
        throw new CriteriaBankExcelValidationError(conflicts);
      }

      this.pendingImport = parsed;
      this.pendingImportSummary = this.buildImportSummary(parsed.criteria);
      this.pendingImportFileName = file.name;
      this.openImportPreviewDialog();
    } catch (error) {
      const messages = error instanceof CriteriaBankExcelValidationError
        ? error.errors
        : [this.t('IMPORT.UNEXPECTED_ERROR')];
      await Swal.fire({
        icon: 'error',
        title: this.t('IMPORT.ERROR_TITLE'),
        html: `<div class="text-start"><ul>${messages
          .slice(0, 20)
          .map((message) => `<li>${this.escapeHtml(message)}</li>`)
          .join('')}</ul>${messages.length > 20 ? `<p>+${messages.length - 20}</p>` : ''}</div>`,
      });
    } finally {
      this.isImporting = false;
    }
  }

  async confirmImport(): Promise<void> {
    if (!this.pendingImport || !this.selectedOrganizationId) {
      return;
    }

    const summary = this.pendingImportSummary;
    this.isImporting = true;
    try {
      await this.organizationService.importDesempenoCriteriaBank({
        organizationId: this.selectedOrganizationId,
        criteria: this.pendingImport.criteria.map((criterion) => ({
          code: criterion.code,
          name: criterion.name,
          description: criterion.description,
          suggestedDimension: criterion.suggestedDimension,
          requiredLevel: criterion.requiredLevel,
          active: true,
          tags: criterion.tags,
          questions: criterion.questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            suggestedScale: question.type === 'ABIERTA' ? null : question.suggestedScale || 'Cumplimiento',
            required: true,
            order: index + 1,
            active: true,
          })),
        })),
      });
      this.importDialogRef?.close();
      this.pendingImport = null;
      this.pendingImportSummary = null;
      await this.loadCriteria();

      void Swal.fire({
        icon: 'success',
        title: this.t('IMPORT.SUCCESS_TITLE'),
        text: this.translate.instant('DESEMPENO_MENUITEMS.CRITERIA_BANK.IMPORT.SUCCESS_TEXT', {
          criteria: summary?.newCriteria ?? 0,
          questions: summary?.newQuestions ?? 0,
        }),
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: this.t('IMPORT.ERROR_TITLE'),
        text: this.getApiErrorMessage(error, this.t('IMPORT.UNEXPECTED_ERROR')),
      });
    } finally {
      this.isImporting = false;
    }
  }

  async downloadTemplate(): Promise<void> {
    const english = String(this.translate.currentLang || '').toLowerCase().startsWith('en');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Just-Link 360';
    workbook.created = new Date();

    const instructions = workbook.addWorksheet(english ? 'INSTRUCTIONS' : 'INSTRUCCIONES', {
      views: [{ showGridLines: false }],
    });
    const instructionRows = english
      ? [
          ['CRITERIA AND QUESTION BANK TEMPLATE'],
          ['Purpose', 'Load reusable criteria and questions. This file does not assign positions, scenarios, or weights.'],
          ['Data sheet', 'Complete one row per question in the CRITERIA_BANK sheet.'],
          ['Multiple questions', 'Repeat the criterion data in each row. Rows with the same code are grouped automatically.'],
          ['Criterion code', 'Optional but recommended. It must identify only one criterion.'],
          ['Required level', 'Integer from 1 to 100. If left blank, 80 is used.'],
          ['Tags', 'Separate tags with commas, for example: accounting, finance, leadership.'],
          ['Question type', 'Use only 5-level Likert or Open question.'],
          ['Suggested scale', 'Only applies to Likert questions. The default value is Compliance.'],
          ['Important', 'Do not rename the headers. The importer validates the entire file before adding data.'],
        ]
      : [
          ['PLANTILLA DE BANCO DE CRITERIOS Y PREGUNTAS'],
          ['Objetivo', 'Cargar criterios y preguntas reutilizables. Este archivo no asigna puestos, escenarios ni ponderaciones.'],
          ['Hoja de datos', 'Complete una fila por pregunta en la hoja BANCO_CRITERIOS.'],
          ['Varias preguntas', 'Repita los datos del criterio en cada fila. Las filas con el mismo código se agrupan automáticamente.'],
          ['Código del criterio', 'Es opcional pero recomendado. Debe identificar únicamente a un criterio.'],
          ['Nivel de exigencia', 'Número entero de 1 a 100. Si se deja vacío se utilizará 80.'],
          ['Etiquetas', 'Sepárelas con comas, por ejemplo: contabilidad, finanzas, liderazgo.'],
          ['Tipo de pregunta', 'Use únicamente Likert de 5 niveles o Pregunta abierta.'],
          ['Escala sugerida', 'Solo aplica a preguntas Likert. El valor por defecto es Cumplimiento.'],
          ['Importante', 'No cambie los encabezados. El sistema valida el archivo completo antes de agregar datos.'],
        ];
    instructions.addRows(instructionRows);
    instructions.mergeCells('A1:B1');
    instructions.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    instructions.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF123B53' } };
    instructions.getCell('A1').alignment = { vertical: 'middle' };
    instructions.getRow(1).height = 30;
    instructions.getColumn(1).width = 26;
    instructions.getColumn(2).width = 105;
    instructions.eachRow((row, index) => {
      if (index > 1) {
        row.getCell(1).font = { bold: true, color: { argb: 'FF1E3A4C' } };
        row.alignment = { vertical: 'top', wrapText: true };
        row.height = 34;
      }
    });

    const sheet = workbook.addWorksheet(english ? 'CRITERIA_BANK' : 'BANCO_CRITERIOS', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });
    const headers = english
      ? ['CRITERION_CODE', 'CRITERION *', 'CRITERION_DESCRIPTION', 'SUGGESTED_DIMENSION', 'REQUIRED_LEVEL (%)', 'TAGS', 'QUESTION *', 'QUESTION_TYPE *', 'SUGGESTED_SCALE']
      : ['CODIGO_CRITERIO', 'CRITERIO *', 'DESCRIPCION_CRITERIO', 'DIMENSION_SUGERIDA', 'NIVEL_EXIGENCIA (%)', 'ETIQUETAS', 'PREGUNTA *', 'TIPO_PREGUNTA *', 'ESCALA_SUGERIDA'];
    sheet.addRow(headers);
    const samples = english
      ? [
          ['CRT_GOAL_FULFILLMENT', 'Goal fulfillment', 'Measures timely delivery of assigned goals.', 'Objectives', 80, 'results, productivity', 'Meets the goals agreed for the evaluation period.', '5-level Likert', 'Compliance'],
          ['CRT_GOAL_FULFILLMENT', 'Goal fulfillment', 'Measures timely delivery of assigned goals.', 'Objectives', 80, 'results, productivity', 'What support would help improve goal fulfillment?', 'Open question', ''],
          ['CRT_EFFECTIVE_COMMUNICATION', 'Effective communication', 'Assesses clarity, listening, and timely communication.', 'Competencies', 80, 'communication, leadership', 'Communicates relevant information clearly and on time.', '5-level Likert', 'Compliance'],
          ['CRT_INTEGRITY', 'Integrity', 'Assesses consistency between actions and organizational values.', 'Values', 90, 'ethics, values', 'Acts transparently and consistently in daily decisions.', '5-level Likert', 'Compliance'],
        ]
      : [
          ['CRT_CUMPLIMIENTO_OBJETIVOS', 'Cumplimiento de objetivos', 'Mide la entrega oportuna de los objetivos asignados.', 'Objetivos', 80, 'resultados, productividad', 'Cumple los objetivos acordados para el período de evaluación.', 'Likert de 5 niveles', 'Cumplimiento'],
          ['CRT_CUMPLIMIENTO_OBJETIVOS', 'Cumplimiento de objetivos', 'Mide la entrega oportuna de los objetivos asignados.', 'Objetivos', 80, 'resultados, productividad', '¿Qué apoyo ayudaría a mejorar el cumplimiento de los objetivos?', 'Pregunta abierta', ''],
          ['CRT_COMUNICACION_EFECTIVA', 'Comunicación efectiva', 'Evalúa claridad, escucha y comunicación oportuna.', 'Competencias', 80, 'comunicación, liderazgo', 'Comunica información relevante de forma clara y oportuna.', 'Likert de 5 niveles', 'Cumplimiento'],
          ['CRT_INTEGRIDAD', 'Integridad', 'Evalúa la coherencia entre las acciones y los valores organizacionales.', 'Valores', 90, 'ética, valores', 'Actúa de forma transparente y coherente en sus decisiones diarias.', 'Likert de 5 niveles', 'Cumplimiento'],
        ];
    sheet.addRows(samples);
    sheet.autoFilter = { from: 'A1', to: 'I1' };
    sheet.columns = [18, 30, 44, 23, 20, 30, 62, 23, 22].map((width) => ({ width }));
    sheet.getRow(1).height = 32;
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF123B53' } };
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = this.excelCellBorder();
    });
    for (let row = 2; row <= 500; row += 1) {
      sheet.getCell(row, 5).dataValidation = {
        type: 'whole', operator: 'between', formulae: [1, 100], allowBlank: true,
        showErrorMessage: true, errorTitle: english ? 'Invalid value' : 'Valor inválido',
        error: english ? 'Enter an integer from 1 to 100.' : 'Ingrese un número entero de 1 a 100.',
      };
      sheet.getCell(row, 8).dataValidation = {
        type: 'list', allowBlank: false,
        formulae: [english ? '"5-level Likert,Open question"' : '"Likert de 5 niveles,Pregunta abierta"'],
      };
      for (let column = 1; column <= 9; column += 1) {
        const cell = sheet.getCell(row, column);
        cell.alignment = { vertical: 'top', wrapText: true };
        cell.border = this.excelCellBorder();
        if (row <= samples.length + 1) {
          cell.fill = {
            type: 'pattern', pattern: 'solid',
            fgColor: { argb: row % 2 === 0 ? 'FFF2F6F8' : 'FFFFFFFF' },
          };
        }
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      english ? 'Performance_Criteria_Bank_Template.xlsx' : 'Plantilla_Banco_Criterios_Desempeno.xlsx'
    );
  }

  getQuestionTypeLabel(type: CriteriaBankQuestionType): string {
    const option = this.questionTypeOptions.find((item) => item.value === type);
    return option ? this.translate.instant(option.labelKey) : type;
  }

  trackByCriterion(_index: number, criterion: CriteriaBankCriterion): string {
    return criterion.id;
  }

  trackByQuestion(_index: number, question: CriteriaBankQuestion): string {
    return question.id;
  }

  private createCriterionForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      suggestedDimension: ['', [Validators.maxLength(150)]],
      requiredLevel: [80, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)]],
      tagsText: ['', [Validators.maxLength(500)]],
      active: [true],
      questions: this.fb.array([]),
    });
  }

  private openCriterionDialog(): void {
    this.criterionDialogRef = this.dialog.open(this.criterionDialogTemplate!, {
      width: 'min(1040px, 96vw)',
      maxWidth: '96vw',
      maxHeight: '92vh',
      autoFocus: false,
      disableClose: this.isSaving,
      panelClass: 'criteria-bank-editor-dialog',
    });
  }

  private openImportPreviewDialog(): void {
    if (!this.importPreviewDialogTemplate) {
      return;
    }
    this.importDialogRef = this.dialog.open(this.importPreviewDialogTemplate, {
      width: 'min(960px, 96vw)',
      maxWidth: '96vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'criteria-bank-import-dialog',
    });
  }

  private async loadCriteria(): Promise<void> {
    this.criteria = [];
    if (!this.selectedOrganizationId) {
      return;
    }

    const sequence = ++this.criteriaLoadSequence;
    this.isLoading = true;
    try {
      this.criteria = await this.fetchAllCriteria(false);
    } catch (error) {
      console.error('No fue posible cargar el banco de criterios:', error);
      this.criteria = [];
      await Swal.fire({
        icon: 'error',
        title: this.t('MESSAGES.LOAD_ERROR_TITLE'),
        text: this.getApiErrorMessage(error, this.t('MESSAGES.LOAD_ERROR_TEXT')),
      });
    } finally {
      if (sequence === this.criteriaLoadSequence) {
        this.isLoading = false;
      }
    }
  }

  private async fetchAllCriteria(activeOnly: boolean): Promise<CriteriaBankCriterion[]> {
    if (!this.selectedOrganizationId) {
      return [];
    }

    const pageSize = 100;
    let page = 1;
    let totalPages = 1;
    const items: CriteriaBankCriterion[] = [];

    do {
      const response = await this.organizationService.getDesempenoCriteriaBank(
        this.selectedOrganizationId,
        { activeOnly, page, pageSize }
      );
      const data = response?.data?.data as CriteriaBankListResponse | undefined;
      items.push(...this.normalizeCriteriaBankItems(data?.items ?? []));
      totalPages = Math.max(1, Number(data?.pagination?.totalPages ?? 1));
      page += 1;
    } while (page <= totalPages);

    return this.sortCriteria(items);
  }

  private normalizeCriteriaBankItems(items: CriteriaBankCriterion[]): CriteriaBankCriterion[] {
    return (items ?? [])
      .map((item) => this.normalizeCriteriaBankCriterion(item))
      .filter((item): item is CriteriaBankCriterion => !!item);
  }

  private normalizeCriteriaBankCriterion(item: any): CriteriaBankCriterion | null {
    const id = item?.id ?? item?.IdBancoCriterio;
    if (id == null) {
      return null;
    }

    return {
      id: String(id),
      organizationId: Number(item.organizationId ?? item.IdOrganizacion ?? this.selectedOrganizationId ?? 0),
      code: String(item.code ?? item.codigo ?? item.Codigo ?? ''),
      name: String(item.name ?? item.nombre ?? item.Nombre ?? ''),
      description: String(item.description ?? item.descripcion ?? item.Descripcion ?? ''),
      suggestedDimension: String(item.suggestedDimension ?? item.dimensionSugerida ?? item.DimensionSugerida ?? ''),
      requiredLevel: Number(item.requiredLevel ?? item.nivelExigenciaPct ?? item.NivelExigenciaPct ?? 80),
      tags: this.parseTags(Array.isArray(item.tags) ? item.tags.join(',') : item.tags ?? ''),
      active: item.active ?? item.activo ?? item.Activo ?? true,
      questions: Array.isArray(item.questions)
        ? item.questions.map((question: any, index: number) => ({
            id: String(question.id ?? question.IdBancoPregunta ?? this.createId()),
            code: question.code ?? question.codigo ?? question.Codigo ?? null,
            text: String(question.text ?? question.texto ?? question.Texto ?? ''),
            type: (question.type ?? question.tipo ?? question.TipoItemCodigo ?? 'LIKERT_1_5') as CriteriaBankQuestionType,
            suggestedScaleId: question.suggestedScaleId ?? question.idEscalaSugerida ?? null,
            suggestedScaleCode: question.suggestedScaleCode ?? question.escalaSugeridaCodigo ?? null,
            suggestedScale: question.suggestedScale ?? question.escalaSugerida ?? (question.type === 'ABIERTA' ? null : 'Cumplimiento'),
            required: question.required ?? question.requerida ?? true,
            order: Number(question.order ?? question.orden ?? index + 1),
            active: question.active ?? question.activo ?? true,
          }))
        : [],
      createdAt: String(item.createdAt ?? item.fechaCreacion ?? ''),
      updatedAt: String(item.updatedAt ?? item.fechaModificacion ?? ''),
    };
  }

  private sortCriteria(items: CriteriaBankCriterion[]): CriteriaBankCriterion[] {
    return [...items].sort((left, right) =>
      String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')) ||
      left.name.localeCompare(right.name, 'es', { sensitivity: 'base' })
    );
  }

  private toApiQuestion(question: CriteriaBankQuestion): Record<string, unknown> {
    const numericId = Number(question.id);
    return {
      ...(Number.isInteger(numericId) && numericId > 0 ? { id: numericId } : {}),
      ...(question.code ? { code: question.code } : {}),
      text: question.text,
      type: question.type,
      suggestedScaleId: question.type === 'ABIERTA' ? null : question.suggestedScaleId ?? null,
      suggestedScaleCode: question.type === 'ABIERTA' ? null : question.suggestedScaleCode ?? null,
      suggestedScale: question.type === 'ABIERTA' ? null : question.suggestedScale || 'Cumplimiento',
    };
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    return String(
      error?.response?.data?.message ??
      error?.response?.data?.error?.message ??
      error?.error?.message ??
      error?.message ??
      fallback
    );
  }

  private getImportConflicts(criteria: CriteriaBankImportCriterion[]): string[] {
    const conflicts: string[] = [];
    criteria.forEach((incoming) => {
      const byCode = this.criteria.find(
        (criterion) => this.normalize(criterion.code) === this.normalize(incoming.code)
      );
      if (byCode && this.normalize(byCode.name) !== this.normalize(incoming.name)) {
        conflicts.push(
          `El código ${incoming.code} ya pertenece al criterio "${byCode.name}" y no puede asignarse a "${incoming.name}".`
        );
      }
    });
    return conflicts;
  }

  private buildImportSummary(criteria: CriteriaBankImportCriterion[]): CriteriaBankImportSummary {
    return criteria.reduce<CriteriaBankImportSummary>((summary, incoming) => {
      const existing = this.criteria.find((criterion) => this.matchesImportCriterion(criterion, incoming));
      if (!existing) {
        summary.newCriteria += 1;
        summary.newQuestions += incoming.questions.length;
        return summary;
      }

      summary.mergedCriteria += 1;
      incoming.questions.forEach((question) => {
        const duplicate = existing.questions.some(
          (current) => this.normalize(current.text) === this.normalize(question.text)
        );
        duplicate ? summary.skippedQuestions += 1 : summary.newQuestions += 1;
      });
      return summary;
    }, { newCriteria: 0, mergedCriteria: 0, newQuestions: 0, skippedQuestions: 0 });
  }

  private matchesImportCriterion(
    criterion: CriteriaBankCriterion,
    incoming: CriteriaBankImportCriterion
  ): boolean {
    return this.normalize(criterion.code) === this.normalize(incoming.code) ||
      (this.normalize(criterion.name) === this.normalize(incoming.name) &&
        this.normalize(criterion.suggestedDimension) === this.normalize(incoming.suggestedDimension));
  }

  private ensureValidPage(): void {
    const lastPage = Math.max(0, Math.ceil(this.filteredCriteria.length / this.pageSize) - 1);
    this.pageIndex = Math.min(this.pageIndex, lastPage);
  }

  private parseTags(value: string): string[] {
    return this.uniqueSorted(
      String(value ?? '')
        .split(/[,;|]/)
        .map((tag) => this.normalizeTag(tag))
        .filter(Boolean)
    );
  }

  private normalizeTag(value: string): string {
    return String(value ?? '')
      .trim()
      .replace(/^#+/, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private uniqueSorted(values: string[]): string[] {
    const map = new Map<string, string>();
    values.forEach((value) => {
      const clean = String(value ?? '').trim();
      const key = this.normalize(clean);
      if (key && !map.has(key)) {
        map.set(key, clean);
      }
    });
    return Array.from(map.values()).sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }));
  }

  private createCode(value: string): string {
    const normalized = this.normalize(value).replace(/\s+/g, '_').slice(0, 32);
    return `CRT_${normalized || 'CRITERIO'}`;
  }

  private createId(): string {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private normalize(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]+/g, ' ')
      .trim()
      .toUpperCase();
  }

  private excelCellBorder(): Partial<ExcelJS.Borders> {
    const border: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FFD5DEE5' } };
    return { top: border, left: border, bottom: border, right: border };
  }

  private escapeHtml(value: string): string {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private t(key: string): string {
    return this.translate.instant(`DESEMPENO_MENUITEMS.CRITERIA_BANK.${key}`);
  }
}
