import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  Edge,
  MiniMapPosition,
  NgxGraphModule,
  Node,
  Orientation,
  PanningAxis,
} from '@swimlane/ngx-graph';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { DemoLimitsService } from '../../config/demo-limits.service';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import {
  DES_EVALUATION_EXCEL_HEADERS,
  DesEvaluationExcelImport,
  DesEvaluationExcelRow,
  DesEvaluationExcelScenarioKey,
  DesEvaluationExcelValidationError,
  parseDesEvaluationExcelWorkbook,
} from './des-evaluaciones-excel';

interface DesEvaluationOrganization {
  Id: number;
  Nombre: string;
}

interface DesEvaluationDemographicField {
  id: number;
  name: string;
  code: string;
  type: string;
}

interface DesEvaluationEmployee {
  id: number;
  organizationId: number | null;
  positionId: number | null;
  managerId: number | null;
  managerIds: number[];
  fullName: string;
  cargo: string | null;
  email: string | null;
  phone: string | null;
  preferredSendType: DesEvaluationSendType | null;
  activo: boolean;
  demographicValues: Record<string, string>;
}

type DesEvaluationScenarioKey = 'BOSS_TO_EMPLOYEE' | 'EMPLOYEE_TO_BOSS' | 'SELF' | 'PEER';
type DesEvaluationQuestionPositionScope = 'ALL' | 'SELECTED';

interface DesEvaluationQuestion {
  id: number;
  backendId?: number;
  code?: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
  scaleId?: number | null;
  scenarioKeys?: DesEvaluationScenarioKey[];
  positionScope?: DesEvaluationQuestionPositionScope;
  positions?: string[];
}

interface DesEvaluationFactor {
  id: number;
  backendId?: number;
  code?: string;
  summaryQuestionCount?: number;
  name: string;
  description: string;
  weight: number;
  requiredRatingLevel?: number;
  defaultQuestionType: string;
  questions: DesEvaluationQuestion[];
  scenarioKeys?: DesEvaluationScenarioKey[];
  positionScope?: DesEvaluationQuestionPositionScope;
  positions?: string[];
}

interface DesEvaluationBigFactor {
  id: number;
  backendId?: number;
  code?: string;
  name: string;
  description: string;
  weight: number;
  factors: DesEvaluationFactor[];
}

interface DesEvaluationFactorSummary {
  key: string;
  name: string;
  questionCount: number;
}

interface DesEvaluationParticipantFilter {
  fieldName: string;
  selectedValues: string[];
}

interface DesEvaluationParticipants {
  onlyActive: boolean;
  positions: string[];
  evaluatorOnlyPositions: string[];
  employeeIds: number[];
  demographicFilters: DesEvaluationParticipantFilter[];
  notes: string;
}

interface DesEvaluationPeriod {
  name: string;
  startDate: string;
  endDate: string;
  state: string;
}

interface DesEvaluationStats {
  total: number;
  total_enviadas: number;
  total_iniciadas: number;
  total_contestadas: number;
  total_error: number;
  total_empleados_activos: number;
  porcentaje: number;
}

interface DesEvaluationScenario {
  id: number;
  backendId?: number;
  key?: DesEvaluationScenarioKey;
  name: string;
  weight: number;
  active: boolean;
}

interface DesEvaluationPositionScenario {
  position: string;
  scenarios: DesEvaluationScenario[];
}

interface DesEvaluationScenarioOption {
  key: DesEvaluationScenarioKey;
  name: string;
  weight: number;
}

interface DesEvaluationCard {
  id: number;
  organizationId: number;
  modelCode?: string;
  modelVersion?: number;
  modelTypeId?: number;
  modelStateId?: number;
  calculationMethodId?: number;
  minimumAnonymousResponses?: number;
  name: string;
  description: string;
  avatarSrc: string;
  status: string;
  modelName: string;
  modelType: string;
  modelState: string;
  scaleId: number;
  scaleLabel: string;
  useWeighting: boolean;
  useAnonymity: boolean;
  surveyType: string;
  bigFactors: DesEvaluationBigFactor[];
  period: DesEvaluationPeriod;
  participants: DesEvaluationParticipants;
  scenarios: DesEvaluationScenario[];
  positionScenarios: DesEvaluationPositionScenario[];
  openQuestionExamples: string[];
  stats: DesEvaluationStats;
}

interface ScaleOption {
  id: number;
  code?: string;
  name?: string;
  nameKey?: string;
  type: string;
  levels: Array<{ id?: number; value: number; label?: string; labelKey?: string }>;
}

interface ModelCatalogOption {
  id: number;
  name?: string;
  nameKey?: string;
  description?: string;
  descriptionKey?: string;
  type: string;
  typeId?: number;
  scaleId: number;
  useWeighting: boolean;
  useAnonymity: boolean;
}

interface DesEvaluationCatalogOption {
  id: number;
  code: string;
  name: string;
  active: boolean;
  order: number;
  [key: string]: any;
}

interface DesEvaluationPositionOption {
  id: number;
  organizationId: number;
  code: string | null;
  name: string;
  active: boolean;
  totalEmployees: number;
}

interface BigFactorDraft {
  name: string;
  description: string;
  weight: number;
}

interface FactorDraft {
  name: string;
  description: string;
  weight: number;
  requiredRatingLevel: number;
  defaultQuestionType: string;
}

interface QuestionDraft {
  label: string;
  type: string;
  optionsText: string;
  scenarioKeys: DesEvaluationScenarioKey[];
  positionScope: DesEvaluationQuestionPositionScope;
  positions: string[];
}

interface DesEvaluationLikertPreset {
  key: string;
  title: string;
  labels: string[];
}

type DesEvaluationDuplicateType = 'CRITERION' | 'ITEM';

interface DesEvaluationDuplicateContext {
  type: DesEvaluationDuplicateType;
  bigFactorIndex: number;
  factorIndex: number;
  questionIndex: number | null;
  sourcePosition: string;
  scenarioKey: DesEvaluationScenarioKey;
}

type DesEvaluationSendType = 'NINGUNO' | 'CORREO' | 'WHATSAPP' | 'AMBOS';
type DesEvaluationSendStatus =
  | 'CREADO'
  | 'ENVIADO'
  | 'INICIADO'
  | 'ERROR'
  | 'PENDIENTE'
  | 'RESPONDIDO'
  | 'COMPLETADO';

interface DesEvaluationSendProgress {
  total: number;
  started: number;
  answered: number;
  percent: number;
}

interface DesEvaluationSendAssignment {
  id: number;
  evaluator: DesEvaluationEmployee;
  evaluateeIds: number[];
  hierarchyLevel: number;
  sendType: DesEvaluationSendType;
  sendStatus: DesEvaluationSendStatus;
  lastSent: string | null;
  persistedEvaluateeIds: number[];
  sendRecordIds: number[];
  surveySends: DesEvaluationSurveySendRecord[];
  isCreating: boolean;
  isSending: boolean;
}

interface DesEvaluationSurveySendRecord {
  id: number;
  modelId: number;
  evaluatorId: number;
  evaluateeId: number;
  status: DesEvaluationSendStatus;
  surveyCode: string | null;
  date: string | null;
  startedDate: string | null;
  finishedDate: string | null;
}

interface DesEvaluationDiagramNodeData {
  employeeId: number;
  fullName: string;
  initials: string;
  position: string | null;
  email: string | null;
  isEvaluator: boolean;
  isEvaluatee: boolean;
  hasSelfEvaluation: boolean;
  evaluatesCount: number;
  evaluatedByCount: number;
  scenarioKeys: DesEvaluationScenarioKey[];
}

interface DesEvaluationDiagramRelationData {
  id: string;
  sourceId: number;
  targetId: number;
  sourceName: string;
  targetName: string;
  sourcePosition: string | null;
  targetPosition: string | null;
  scenarioKeys: DesEvaluationScenarioKey[];
  bidirectional: boolean;
}

interface DesEvaluationDiagramSummary {
  evaluators: number;
  evaluatees: number;
  assignments: number;
  selfEvaluations: number;
  bidirectionalRelations: number;
}

interface DesEvaluationExcelImportSummary {
  positions: number;
  scenarios: number;
  omittedScenarios: number;
  dimensions: number;
  criteria: number;
  items: number;
  skipped: number;
  fileName: string;
}

interface DesEvaluationExcelMergeStats {
  positionsAdded: number;
  scenariosAdded: number;
  dimensionsAdded: number;
  criteriaAdded: number;
  itemsAdded: number;
  positionsSkipped: number;
  scenariosSkipped: number;
  dimensionsSkipped: number;
  criteriaSkipped: number;
  itemsSkipped: number;
}

interface DesEvaluationExcelMergeResult {
  evaluation: DesEvaluationCard;
  stats: DesEvaluationExcelMergeStats;
}

interface DesEvaluationExcelApplicabilityResult {
  imported: DesEvaluationExcelImport;
  warnings: string[];
  omittedScenarios: number;
  recalculatedWeights: boolean;
}

@Component({
  selector: 'app-des-evaluaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    NgxGraphModule,
  ],
  templateUrl: './des-evaluaciones.component.html',
  styleUrls: ['./des-evaluaciones.component.scss'],
})
export class DesEvaluacionesComponent implements OnDestroy, OnInit {
  @ViewChild('editorDialogTemplate') editorDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('sendDialogTemplate') sendDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('performanceEmailPreviewDialogTemplate')
  performanceEmailPreviewDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('modelDialogTemplate') modelDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('duplicateModelDialogTemplate') duplicateModelDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('modelCatalogSearchDialogTemplate') modelCatalogSearchDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('participantPositionsDialogTemplate') participantPositionsDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('bigFactorDialogTemplate') bigFactorDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('factorDialogTemplate') factorDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('questionDialogTemplate') questionDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('questionValuesDialogTemplate') questionValuesDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('duplicatePositionsDialogTemplate') duplicatePositionsDialogTemplate?: TemplateRef<unknown>;

  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.EVALUACIONES.TEXT';
  public scaleOptions: ScaleOption[] = [
    {
      id: 1,
      nameKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5',
      type: 'GENERAL',
      levels: [
        { value: 1, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5_LEVELS.BELOW_MUCH' },
        { value: 2, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5_LEVELS.BELOW' },
        { value: 3, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5_LEVELS.EXPECTED' },
        { value: 4, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5_LEVELS.ABOVE' },
        { value: 5, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.LIKERT_1_5_LEVELS.EXCEPTIONAL' },
      ],
    },
    {
      id: 2,
      nameKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4',
      type: 'COMPETENCIAS',
      levels: [
        { value: 0, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4_LEVELS.NOT_OBSERVED' },
        { value: 1, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4_LEVELS.INITIAL' },
        { value: 2, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4_LEVELS.IN_DEVELOPMENT' },
        { value: 3, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4_LEVELS.EXPECTED' },
        { value: 4, labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCALES.BEHAVIORAL_0_4_LEVELS.OUTSTANDING' },
      ],
    },
  ];
  public modelCatalog: ModelCatalogOption[] = [
    {
      id: 101,
      nameKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG.MANAGERIAL_360',
      descriptionKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG_DESCRIPTIONS.MANAGERIAL_360',
      type: '360',
      scaleId: 1,
      useWeighting: true,
      useAnonymity: true,
    },
    {
      id: 102,
      nameKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG.OPERATIVE',
      descriptionKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG_DESCRIPTIONS.OPERATIVE',
      type: '180',
      scaleId: 1,
      useWeighting: true,
      useAnonymity: true,
    },
    {
      id: 103,
      nameKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG.SELF_OBJECTIVES',
      descriptionKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_CATALOG_DESCRIPTIONS.SELF_OBJECTIVES',
      type: 'AUTOEVALUACION',
      scaleId: 1,
      useWeighting: true,
      useAnonymity: false,
    },
  ];
  public surveyTypes = ['360', '180', '90', 'AUTOEVALUACION', 'MIXTA'];
  public questionTypes: Array<{ value: string; label?: string; labelKey?: string }> = [
    { value: 'LIKERT_1_5', labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.QUESTION_TYPES.LIKERT_1_5' },
    { value: 'ABIERTA', labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.QUESTION_TYPES.ABIERTA' },
    { value: 'SELECCION_UNICA', labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.QUESTION_TYPES.SELECCION_UNICA' },
    { value: 'SELECCION_MULTIPLE', labelKey: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.QUESTION_TYPES.SELECCION_MULTIPLE' },
  ];
  readonly questionLikertPresets: DesEvaluationLikertPreset[] = [
    {
      key: 'compliance_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.COMPLIANCE',
      labels: [
        'No cumple',
        'Cumple en nivel bajo',
        'Cumple parcialmente',
        'Cumple lo esperado',
        'Supera lo esperado',
      ],
    },
    {
      key: 'agreement_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.AGREEMENT',
      labels: [
        'Totalmente de acuerdo',
        'De acuerdo',
        'Ni de acuerdo ni en desacuerdo',
        'En desacuerdo',
        'Totalmente en desacuerdo',
      ],
    },
    {
      key: 'satisfaction_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.SATISFACTION',
      labels: ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy insatisfecho'],
    },
    {
      key: 'frequency_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.FREQUENCY',
      labels: ['Siempre', 'Casi siempre', 'A veces', 'Casi nunca', 'Nunca'],
    },
    {
      key: 'importance_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.IMPORTANCE',
      labels: ['Muy importante', 'Importante', 'Neutral', 'Poco importante', 'Nada importante'],
    },
    {
      key: 'quality_5',
      title: 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.QUALITY',
      labels: ['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala'],
    },
  ];
  public modelStates = ['ACTIVO', 'BORRADOR', 'INACTIVO'];
  readonly sendTypeOptions: Array<{ value: DesEvaluationSendType; icon: string }> = [
    { value: 'NINGUNO', icon: 'block' },
    { value: 'CORREO', icon: 'mail' },
    { value: 'WHATSAPP', icon: 'chat' },
    { value: 'AMBOS', icon: 'send' },
  ];

  public organizations: DesEvaluationOrganization[] = [];
  public employees: DesEvaluationEmployee[] = [];
  public availablePositions: string[] = [];
  public demographicFields: DesEvaluationDemographicField[] = [];
  public demographicValueOptions: Record<string, string[]> = {};
  public positionOptions: DesEvaluationPositionOption[] = [];
  public modelTypeOptions: DesEvaluationCatalogOption[] = [];
  public modelStateOptions: DesEvaluationCatalogOption[] = [];
  public evaluationStateOptions: DesEvaluationCatalogOption[] = [];
  public itemTypeOptions: DesEvaluationCatalogOption[] = [];
  public scenarioCatalogOptions: DesEvaluationCatalogOption[] = [];
  public calculationMethodOptions: DesEvaluationCatalogOption[] = [];
  public evaluations: DesEvaluationCard[] = [];
  public selectedOrganizationId: number | null = null;
  public isLoadingOrganizations = false;
  public isLoadingEmployees = false;
  public isLoadingDemographics = false;
  public isLoadingCatalogs = false;
  public isLoadingModels = false;
  public isLoadingSendDialog = false;
  public isLoadingModelDiagram = false;
  public isCreatingSendAssignments = false;
  public isSavingModel = false;
  public isImportingModelExcel = false;
  public modelExcelImportSummary: DesEvaluationExcelImportSummary | null = null;
  public editingEvaluation: DesEvaluationCard | null = null;
  public sendPreviewEvaluation: DesEvaluationCard | null = null;
  public sendAssignments: DesEvaluationSendAssignment[] = [];
  public performanceEmailHtml: SafeHtml | null = null;
  public modelPreviewEvaluation: DesEvaluationCard | null = null;
  public duplicateModelSource: DesEvaluationCard | null = null;
  public duplicateModelName = '';
  public isDuplicatingModel = false;
  public modelDiagramAssignments: DesEvaluationSendAssignment[] = [];
  public modelDiagramNodes: Node[] = [];
  public modelDiagramLinks: Edge[] = [];
  public modelDiagramRelations: DesEvaluationDiagramRelationData[] = [];
  public selectedModelDiagramNode: Node | null = null;
  public modelDiagramSummary: DesEvaluationDiagramSummary = {
    evaluators: 0,
    evaluatees: 0,
    assignments: 0,
    selfEvaluations: 0,
    bidirectionalRelations: 0,
  };
  public draftEvaluation: DesEvaluationCard | null = null;
  public activeEditorTabIndex = 0;
  public selectedModelCatalogId: number | null = null;
  public modelCatalogSearchTerm = '';
  public bigFactorDraft: BigFactorDraft = this.createEmptyBigFactorDraft();
  public factorDraft: FactorDraft = this.createEmptyFactorDraft();
  public questionDraft: QuestionDraft = this.createEmptyQuestionDraft();
  public participantPositionSearchTerm = '';
  public participantEmployeeSearchTerm = '';
  public questionPositionSearchTerm = '';
  public filteredQuestionPositions: string[] = [];
  public questionScenarioOptions: Array<{ key: DesEvaluationScenarioKey; label: string }> = [];
  public questionScenarioCoverage: Array<{
    key: DesEvaluationScenarioKey;
    label: string;
    count: number;
  }> = [];
  public selectedQuestionLikertPresetKey = 'compliance_5';
  public questionOptionsSummary = '';
  public duplicateContext: DesEvaluationDuplicateContext | null = null;
  public duplicatePositionSearchTerm = '';
  public selectedDuplicatePositions: string[] = [];
  public modelDiagramView: [number, number] = [
    this.getModelDiagramViewportWidth(),
    this.getModelDiagramViewportHeight(),
  ];
  readonly modelDiagramNodeWidth = 320;
  readonly modelDiagramNodeHeight = 160;
  readonly modelDiagramPanningAxis = PanningAxis.Both;
  readonly modelDiagramMiniMapPosition = MiniMapPosition.UpperRight;
  readonly modelDiagramLayoutSettings = {
    orientation: Orientation.LEFT_TO_RIGHT,
    rankPadding: 120,
    nodePadding: 34,
    edgePadding: 28,
    marginX: 48,
    marginY: 40,
  };

  private editorDialogRef: MatDialogRef<unknown> | null = null;
  public questionValuesDialogRef: MatDialogRef<unknown> | null = null;
  public modelCatalogDialogRef: MatDialogRef<unknown> | null = null;
  public duplicateModelDialogRef: MatDialogRef<unknown> | null = null;
  public duplicatePositionsDialogRef: MatDialogRef<unknown> | null = null;
  public nestedDialogRef: MatDialogRef<unknown> | null = null;
  public editBigFactorIndex: number | null = null;
  public editFactorContext: {
    bigFactorIndex: number;
    factorIndex: number | null;
    position: string | null;
    scenarioKey: DesEvaluationScenarioKey | null;
  } | null = null;
  public editQuestionContext: {
    bigFactorIndex: number;
    factorIndex: number;
    questionIndex: number | null;
    position: string | null;
    scenarioKey: DesEvaluationScenarioKey | null;
  } | null = null;
  private localIdSequence = 1000;
  private organizationLoadSequence = 0;
  private modelLoadSequence = 0;
  private selectedOrganizationSubscription?: Subscription;

  constructor(
    private dialog: MatDialog,
    private organizacionService: OrganizacionService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private demoLimitsService: DemoLimitsService,
  ) {}

  ngOnInit(): void {
    this.setupSelectedOrganizationListener();
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.organizations = [];
        void this.onOrganizationChange(null);
        return;
      }

      this.organizations = [organization];

      if (this.selectedOrganizationId === organization.Id) {
        return;
      }

      void this.onOrganizationChange(organization.Id);
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncModelDiagramViewport();
  }

  get hasSelectedOrganization(): boolean {
    return this.selectedOrganizationId !== null;
  }

  get isDemoPerformanceModelLimitReached(): boolean {
    return this.demoLimitsService.isDemoModeActive() &&
      this.demoLimitsService.getRemaining(
        'maxPerformanceModelsPerOrganization',
        this.visibleEvaluations.length
      ) === 0;
  }

  get demoPerformanceModelLimit(): number {
    return this.demoLimitsService.getLimit('maxPerformanceModelsPerOrganization');
  }

  get isDemoPerformanceDimensionLimitReached(): boolean {
    return !!this.draftEvaluation &&
      this.demoLimitsService.isDemoModeActive() &&
      this.demoLimitsService.getRemaining(
        'maxPerformanceDimensionsPerModel',
        this.draftEvaluation.bigFactors.length
      ) === 0;
  }

  isDemoPerformanceCriteriaLimitReached(
    dimension: DesEvaluationBigFactor,
    position: string | null,
    scenarioKey: DesEvaluationScenarioKey | null
  ): boolean {
    if (!this.demoLimitsService.isDemoModeActive()) {
      return false;
    }

    const currentCount = position && scenarioKey
      ? this.getFactorsForPositionAndScenario(dimension, position, scenarioKey).length
      : this.getDistinctFactorSummaries(dimension).length;

    return this.demoLimitsService.exceedsLimit(
      'maxPerformanceCriteriaPerDimension',
      currentCount
    );
  }

  isDemoPerformanceItemLimitReached(
    criterion: DesEvaluationFactor,
    position: string | null,
    scenarioKey: DesEvaluationScenarioKey | null
  ): boolean {
    if (!this.demoLimitsService.isDemoModeActive()) {
      return false;
    }

    const currentCount = position && scenarioKey
      ? this.getQuestionsForPositionAndScenario(criterion, position, scenarioKey).length
      : criterion.questions.length;

    return this.demoLimitsService.exceedsLimit(
      'maxPerformanceItemsPerCriterion',
      currentCount
    );
  }

  get breadcrumbItems(): string[] {
    return [
      this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.BREADCRUMB_HOME'),
      this.t(this.breadcrumbTitleKey),
    ];
  }

  get visibleEvaluations(): DesEvaluationCard[] {
    if (!this.selectedOrganizationId) {
      return [];
    }

    return this.evaluations.filter((item) => item.organizationId === this.selectedOrganizationId);
  }

  get currentOrganizationName(): string {
    const organization = this.organizations.find((item) => item.Id === this.selectedOrganizationId);
    return organization?.Nombre ?? this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.NO_ORGANIZATION');
  }

  get selectedScale(): ScaleOption | null {
    if (!this.draftEvaluation) {
      return null;
    }

    return this.getScaleById(this.draftEvaluation.scaleId);
  }

  get bigFactorWeightTotal(): number {
    return this.getBigFactorWeightTotal(this.draftEvaluation);
  }

  get scenarioWeightTotal(): number {
    return this.draftEvaluation?.scenarios.filter((scenario) => scenario.active !== false).reduce(
      (total, scenario) => total + (Number(scenario.weight) || 0),
      0
    ) ?? 0;
  }

  async onOrganizationChange(organizationId: number | null): Promise<void> {
    const selectedOrganizationId = this.toPositiveInteger(organizationId);
    const loadSequence = ++this.organizationLoadSequence;
    this.modelLoadSequence++;

    this.selectedOrganizationId = selectedOrganizationId;
    this.employees = [];
    this.demographicFields = [];
    this.demographicValueOptions = {};
    this.positionOptions = [];
    this.evaluations = [];

    if (!selectedOrganizationId) {
      return;
    }

    await Promise.all([
      this.loadEmployees(selectedOrganizationId),
      this.loadDemographicFields(selectedOrganizationId),
      this.loadCatalogs(selectedOrganizationId),
    ]);

    if (
      loadSequence !== this.organizationLoadSequence ||
      this.selectedOrganizationId !== selectedOrganizationId
    ) {
      return;
    }

    if (this.demographicFields.length === 0) {
      this.demographicFields = this.buildDemographicFieldsFromEmployees();
      this.rebuildDemographicValueOptions();
    }

    await this.loadModels(selectedOrganizationId);
  }

  async openCreateDialog(): Promise<void> {
    if (!this.selectedOrganizationId) {
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.ORG_REQUIRED_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.ORG_REQUIRED_TEXT'),
        'warning'
      );
      return;
    }

    if (this.isDemoPerformanceModelLimitReached) {
      await this.showDemoLimitMessage(
        'DEMO_MODEL_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceModelsPerOrganization')
      );
      return;
    }

    this.editingEvaluation = null;
    this.activeEditorTabIndex = 0;
    this.selectedModelCatalogId = null;
    this.modelCatalogSearchTerm = '';
    this.modelExcelImportSummary = null;
    this.draftEvaluation = this.createBlankEvaluation(this.selectedOrganizationId);
    this.refreshQuestionScenarioState();
    this.openEditorDialog();
  }

  async openEditDialog(card: DesEvaluationCard): Promise<void> {
    const organizationId = this.selectedOrganizationId;
    if (!organizationId) {
      return;
    }

    this.isLoadingModels = true;

    try {
      const response = await this.organizacionService.getDesempenoModelById(
        card.id,
        organizationId
      );
      const detail = this.extractPayload(response);
      const normalizedCard = this.normalizeModelDetail(detail);

      this.editingEvaluation = normalizedCard;
      this.activeEditorTabIndex = 0;
      this.modelExcelImportSummary = null;
      this.draftEvaluation = this.cloneEvaluation(this.ensureDraftFilters(normalizedCard));
      this.draftEvaluation.scenarios = this.buildScenariosForType(
        this.draftEvaluation.modelType,
        this.draftEvaluation.scenarios
      );
      this.normalizeEvaluationQuestionScopes(this.draftEvaluation);
      this.ensurePositionScenarioConfigs(this.draftEvaluation);
      this.refreshQuestionScenarioState();
      this.syncParticipantEmployeeSelectionWithCriteria();
      this.selectedModelCatalogId =
        this.findModelCatalogByName(normalizedCard.modelName)?.id ?? null;
      this.modelCatalogSearchTerm = '';
      this.openEditorDialog();
    } catch (error) {
      console.error('Error al cargar el modelo de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isLoadingModels = false;
    }
  }

  async openSendDialog(card: DesEvaluationCard): Promise<void> {
    const organizationId = this.selectedOrganizationId;
    if (!this.sendDialogTemplate || !organizationId || this.isLoadingSendDialog) {
      return;
    }

    this.isLoadingSendDialog = true;

    try {
      const response = await this.organizacionService.getDesempenoModelById(
        card.id,
        organizationId
      );

      if (this.selectedOrganizationId !== organizationId) {
        return;
      }

      const evaluation = this.normalizeModelDetail(this.extractPayload(response));
      this.sendPreviewEvaluation = evaluation;
      this.sendAssignments = this.buildSendAssignments(evaluation);
      await this.loadExistingSurveySendsForAssignments(evaluation.id);

      const dialogRef = this.dialog.open(this.sendDialogTemplate, {
        width: '2163px',
        maxWidth: '99vw',
        maxHeight: '92vh',
        autoFocus: false,
        panelClass: 'des-evaluaciones-dialog-panel',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.sendPreviewEvaluation = null;
        this.sendAssignments = [];
      });
    } catch (error) {
      console.error('Error al cargar el modelo para los envíos:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isLoadingSendDialog = false;
    }
  }

  async openModelDialog(card: DesEvaluationCard): Promise<void> {
    const organizationId = this.selectedOrganizationId;
    if (!this.modelDialogTemplate || !organizationId || this.isLoadingModelDiagram) {
      return;
    }

    this.isLoadingModelDiagram = true;

    try {
      const response = await this.organizacionService.getDesempenoModelById(
        card.id,
        organizationId
      );

      if (this.selectedOrganizationId !== organizationId) {
        return;
      }

      const evaluation = this.normalizeModelDetail(this.extractPayload(response));
      this.modelPreviewEvaluation = evaluation;
      this.rebuildModelDiagram(evaluation);
      this.syncModelDiagramViewport();

      const dialogRef = this.dialog.open(this.modelDialogTemplate, {
        width: 'calc(100vw - 10px)',
        maxWidth: 'calc(100vw - 10px)',
        maxHeight: 'calc(100vh - 10px)',
        autoFocus: false,
        panelClass: 'des-evaluaciones-dialog-panel',
      });

      dialogRef.afterClosed().subscribe(() => {
        this.clearModelDiagram();
      });
    } catch (error) {
      console.error('Error al cargar el diagrama del modelo de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isLoadingModelDiagram = false;
    }
  }

  async openDuplicateModelDialog(card: DesEvaluationCard): Promise<void> {
    if (!this.duplicateModelDialogTemplate || !this.selectedOrganizationId) {
      return;
    }

    if (this.isDemoPerformanceModelLimitReached) {
      await this.showDemoLimitMessage(
        'DEMO_MODEL_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceModelsPerOrganization')
      );
      return;
    }

    this.duplicateModelSource = card;
    this.duplicateModelName = this.getSuggestedDuplicateModelName(card.name);
    this.duplicateModelDialogRef?.close();
    this.duplicateModelDialogRef = this.dialog.open(this.duplicateModelDialogTemplate, {
      width: '560px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });

    this.duplicateModelDialogRef.afterClosed().subscribe(() => {
      if (!this.isDuplicatingModel) {
        this.resetDuplicateModelDialog();
      }
    });
  }

  get duplicateModelNameErrorKey(): string | null {
    const name = this.duplicateModelName.trim();
    if (!name) {
      return 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_NAME_REQUIRED';
    }
    if (name.length > 200) {
      return 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_NAME_TOO_LONG';
    }
    if (this.modelNameExists(name)) {
      return 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_NAME_EXISTS';
    }
    return null;
  }

  async duplicateSelectedModel(): Promise<void> {
    const source = this.duplicateModelSource;
    const organizationId = this.selectedOrganizationId;
    const name = this.duplicateModelName.trim();
    if (
      !source ||
      !organizationId ||
      this.isDuplicatingModel ||
      this.duplicateModelNameErrorKey
    ) {
      return;
    }

    this.isDuplicatingModel = true;

    try {
      await this.organizacionService.duplicateDesempenoModel(source.id, {
        organizacionId: organizationId,
        codigo: this.buildDuplicateModelCode(name),
        nombre: name,
        version: Math.max(1, Number(source.modelVersion) || 1),
      });

      this.duplicateModelDialogRef?.close();
      this.resetDuplicateModelDialog();

      if (this.selectedOrganizationId === organizationId) {
        await this.loadModels(organizationId, false);
      }

      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_SUCCESS_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_SUCCESS_TEXT', { name }),
        'success'
      );
    } catch (error) {
      console.error('Error al duplicar el modelo de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isDuplicatingModel = false;
    }
  }

  closeEditorDialog(): void {
    this.editorDialogRef?.close();
  }

  async saveDraftEvaluation(): Promise<void> {
    if (!this.draftEvaluation || !this.selectedOrganizationId || this.isSavingModel) {
      return;
    }

    this.draftEvaluation.useWeighting = true;
    this.draftEvaluation.useAnonymity = true;
    this.ensurePositionScenarioConfigs(this.draftEvaluation);

    if (!this.editingEvaluation && this.isDemoPerformanceModelLimitReached) {
      await this.showDemoLimitMessage(
        'DEMO_MODEL_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceModelsPerOrganization')
      );
      return;
    }

    const demoLimitViolation = this.findDemoPerformanceLimitViolation(this.draftEvaluation);
    if (demoLimitViolation) {
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_LIMIT_TITLE'),
        this.t(
          `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.${demoLimitViolation.textKey}`,
          demoLimitViolation.params
        ),
        'warning'
      );
      this.activeEditorTabIndex = demoLimitViolation.tabIndex;
      return;
    }

    if (!this.hasRequiredModelGeneralData(this.draftEvaluation)) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.GENERAL_DATA_REQUIRED_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.GENERAL_DATA_REQUIRED_TEXT'),
        'warning'
      );
      this.activeEditorTabIndex = 0;
      return;
    }

    if (
      !this.draftEvaluation.period.startDate ||
      !this.draftEvaluation.period.endDate
    ) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DATES_REQUIRED_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DATES_REQUIRED_TEXT'),
        'warning'
      );
      this.activeEditorTabIndex = 0;
      return;
    }

    let unresolvedPosition = this.draftEvaluation.participants.positions.find(
      (position) => this.getPositionId(position) <= 0
    );
    if (unresolvedPosition) {
      await this.refreshPositionOptions(this.selectedOrganizationId);
      unresolvedPosition = this.draftEvaluation.participants.positions.find(
        (position) => this.getPositionId(position) <= 0
      );
    }
    if (unresolvedPosition) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.POSITION_CATALOG_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.POSITION_CATALOG_TEXT', {
          position: unresolvedPosition,
        }),
        'warning'
      );
      this.activeEditorTabIndex = 1;
      return;
    }

    if (
      this.draftEvaluation.period.endDate <
      this.draftEvaluation.period.startDate
    ) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DATE_RANGE_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DATE_RANGE_TEXT'),
        'warning'
      );
      this.activeEditorTabIndex = 0;
      return;
    }

    if (
      this.draftEvaluation.useWeighting &&
      this.draftEvaluation.bigFactors.length > 0 &&
      !this.isWeightTotalComplete(this.bigFactorWeightTotal)
    ) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DIMENSION_WEIGHT_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DIMENSION_WEIGHT_TEXT'),
        'warning'
      );
      this.activeEditorTabIndex = 0;
      return;
    }

    const invalidFactorGroup = this.findInvalidFactorWeightGroup(this.draftEvaluation);
    if (invalidFactorGroup) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.COMPETENCY_WEIGHT_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.COMPETENCY_WEIGHT_TEXT', {
          dimension: invalidFactorGroup,
        }),
        'warning'
      );
      this.activeEditorTabIndex = 2;
      return;
    }

    const invalidScenarioPosition = this.findInvalidPositionScenarioWeightGroup(
      this.draftEvaluation
    );
    if (invalidScenarioPosition) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SCENARIO_WEIGHT_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SCENARIO_WEIGHT_TEXT_BY_POSITION', {
          position: invalidScenarioPosition,
        }),
        'warning'
      );
      this.activeEditorTabIndex = 1;
      return;
    }

    const finalCard = this.prepareEvaluationSnapshot(this.draftEvaluation);
    const payload = this.buildModelPayload(finalCard);
    const editingId = this.editingEvaluation?.id ?? null;

    this.isSavingModel = true;

    try {
      if (editingId) {
        await this.organizacionService.updateDesempenoModel(editingId, payload);
      } else {
        await this.organizacionService.saveDesempenoModel(payload);
      }

      this.editorDialogRef?.close();
      await this.loadModels(this.selectedOrganizationId, false);

      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SAVE_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SAVE_TEXT'),
        'success'
      );
    } catch (error) {
      console.error('Error al guardar el modelo de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SAVE_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SAVE_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isSavingModel = false;
    }
  }

  downloadModelExcelTemplate(): void {
    if (!this.draftEvaluation) {
      return;
    }

    const workbook = XLSX.utils.book_new();
    const scenarioDefinition = this.getScenarioDefinitions(this.draftEvaluation.modelType)[0];
    const scenarioKey = scenarioDefinition?.key ?? 'BOSS_TO_EMPLOYEE';
    const scenarioName = this.getQuestionScenarioLabel(scenarioKey);
    const scale = this.getScaleById(this.draftEvaluation.scaleId) ?? this.getDefaultScale();
    const scaleName = scale ? this.getScaleLabel(scale.id) : 'Predeterminada';
    const scaleOptions = scale?.levels.map((level) => this.getScaleLevelLabel(level)) ?? [];
    const position = this.getModelExcelTemplatePosition();
    const headers = Object.values(DES_EVALUATION_EXCEL_HEADERS);
    const rows = this.buildModelExcelTemplateRows(
      position,
      scenarioName,
      scaleName,
      scaleOptions
    );
    const instructions = [
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_TITLE')],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_SHEET')],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_POSITION')],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_TYPES')],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_WEIGHTS')],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.README_ATOMIC')],
      [],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.AVAILABLE_SCENARIOS')],
      ...this.getScenarioDefinitions(this.draftEvaluation.modelType).map((scenario) => [
        `${scenario.key}: ${this.getQuestionScenarioLabel(scenario.key)}`,
      ]),
      [],
      [this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.AVAILABLE_SCALES')],
      ...this.scaleOptions.map((item) => [`${item.code ?? item.id}: ${this.getScaleLabel(item.id)}`]),
    ];
    const readmeSheet = XLSX.utils.aoa_to_sheet(instructions);
    readmeSheet['!cols'] = [{ wch: 110 }];
    XLSX.utils.book_append_sheet(workbook, readmeSheet, 'LEEME');

    const dataSheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    dataSheet['!cols'] = headers.map((header) => ({
      wch: Math.min(54, Math.max(18, header.length + 2)),
    }));
    dataSheet['!autofilter'] = { ref: dataSheet['!ref'] ?? `A1:P${rows.length + 1}` };
    XLSX.utils.book_append_sheet(
      workbook,
      dataSheet,
      this.getModelExcelWorksheetName(position)
    );

    XLSX.writeFile(workbook, 'Plantilla_Evaluacion_Desempeno.xlsx');
  }

  async onModelExcelSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !this.draftEvaluation || this.isImportingModelExcel) {
      return;
    }

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      await this.showModelExcelErrors([
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_VALIDATIONS.INVALID_FILE'),
      ]);
      input.value = '';
      return;
    }

    this.isImportingModelExcel = true;

    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const imported = parseDesEvaluationExcelWorkbook(
        workbook,
        this.buildModelExcelContext()
      );
      const applicabilityCandidate = this.buildDraftEvaluationFromExcel(imported).evaluation;
      const applicability = this.filterInapplicableModelExcelScenarios(
        imported,
        applicabilityCandidate
      );
      const applicableImport = applicability.imported;
      const mergeResult = this.buildDraftEvaluationFromExcel(applicableImport);
      const candidate = mergeResult.evaluation;

      const combinedDemoViolation = this.findDemoPerformanceLimitViolation(candidate);
      if (combinedDemoViolation) {
        throw new DesEvaluationExcelValidationError([
          this.t(
            `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.${combinedDemoViolation.textKey}`,
            combinedDemoViolation.params
          ),
        ]);
      }

      this.draftEvaluation = candidate;
      const skipped =
        mergeResult.stats.positionsSkipped +
        mergeResult.stats.scenariosSkipped +
        mergeResult.stats.dimensionsSkipped +
        mergeResult.stats.criteriaSkipped +
        mergeResult.stats.itemsSkipped;
      this.modelExcelImportSummary = {
        positions: imported.positions.length,
        scenarios: applicableImport.scenarioCount,
        omittedScenarios: applicability.omittedScenarios,
        dimensions: mergeResult.stats.dimensionsAdded,
        criteria: mergeResult.stats.criteriaAdded,
        items: mergeResult.stats.itemsAdded,
        skipped,
        fileName: file.name,
      };
      this.activeEditorTabIndex = 1;
      this.refreshQuestionScenarioState();
      this.syncParticipantEmployeeSelectionWithCriteria();

      const successText = this.t(
        'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.SUCCESS_TEXT',
        {
          positions: imported.positions.length,
          dimensions: mergeResult.stats.dimensionsAdded,
          criteria: mergeResult.stats.criteriaAdded,
          items: mergeResult.stats.itemsAdded,
          skipped,
        }
      );

      if (applicability.warnings.length > 0) {
        const warningItems = applicability.warnings
          .map((warning) => `<li>${this.escapeHtml(warning)}</li>`)
          .join('');
        const weightsMessage = applicability.recalculatedWeights
          ? `<p>${this.escapeHtml(this.t(
              'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.WEIGHTS_RECALCULATED'
            ))}</p>`
          : '';

        await Swal.fire({
          title: this.t(
            'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.SUCCESS_WITH_WARNINGS_TITLE'
          ),
          html: `
            <p>${this.escapeHtml(successText)}</p>
            <p>${this.escapeHtml(this.t(
              'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.OMITTED_SCENARIOS_WARNING'
            ))}</p>
            <div class="excel-import-error-list"><ol>${warningItems}</ol></div>
            ${weightsMessage}
          `,
          icon: 'warning',
          width: 820,
        });
      } else {
        await Swal.fire(
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.SUCCESS_TITLE'),
          successText,
          mergeResult.stats.itemsAdded > 0 ||
            mergeResult.stats.criteriaAdded > 0 ||
            mergeResult.stats.dimensionsAdded > 0
            ? 'success'
            : 'info'
        );
      }
    } catch (error) {
      const errors = error instanceof DesEvaluationExcelValidationError
        ? error.errors
        : [this.getApiErrorMessage(
            error,
            this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.UNEXPECTED_ERROR')
          )];
      await this.showModelExcelErrors(errors);
    } finally {
      this.isImportingModelExcel = false;
      input.value = '';
    }
  }

  private buildModelExcelContext() {
    const scenarioAliases: Record<DesEvaluationExcelScenarioKey, string[]> = {
      BOSS_TO_EMPLOYEE: [
        'Jefe a colaborador',
        'Jefe a empleado',
        'Descendente',
        'Manager to employee',
      ],
      EMPLOYEE_TO_BOSS: [
        'Colaborador a jefe',
        'Empleado a jefe',
        'Ascendente',
        'Employee to manager',
      ],
      SELF: ['Autoevaluación', 'Autoevaluacion', 'Self assessment'],
      PEER: ['Pares', 'Entre pares', 'Peer assessment'],
    };
    const allowedScenarioKeys = new Set(
      this.getScenarioDefinitions(this.draftEvaluation?.modelType ?? '360')
        .map((scenario) => scenario.key)
    );
    const demoLimits = this.demoLimitsService.isDemoModeActive()
      ? {
          dimensions: this.demoLimitsService.getLimit('maxPerformanceDimensionsPerModel'),
          criteriaPerDimension: this.demoLimitsService.getLimit('maxPerformanceCriteriaPerDimension'),
          itemsPerCriterion: this.demoLimitsService.getLimit('maxPerformanceItemsPerCriterion'),
        }
      : undefined;

    return {
      positions: this.getExcelImportPositionNames(),
      scenarios: Array.from(allowedScenarioKeys).map((key) => {
        const catalog = this.scenarioCatalogOptions.find(
          (scenario) => this.toScenarioKey(scenario.code) === key
        );
        return {
          key,
          names: [
            key,
            catalog?.code ?? '',
            catalog?.name ?? '',
            this.getQuestionScenarioLabel(key),
            ...scenarioAliases[key],
          ].filter((name) => !!name),
        };
      }),
      scales: this.scaleOptions.map((scale) => ({
        id: scale.id,
        code: scale.code,
        name: this.getScaleLabel(scale.id),
        levels: scale.levels.map((level) => this.getScaleLevelLabel(level)),
      })),
      defaultScaleId: this.draftEvaluation?.scaleId ?? 0,
      demoLimits,
      translate: (key: string, params?: Record<string, unknown>) => this.t(
        `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_VALIDATIONS.${key}`,
        params
      ),
    };
  }

  private buildDraftEvaluationFromExcel(
    imported: DesEvaluationExcelImport
  ): DesEvaluationExcelMergeResult {
    const candidate = this.cloneEvaluation(this.draftEvaluation!);
    const stats: DesEvaluationExcelMergeStats = {
      positionsAdded: 0,
      scenariosAdded: 0,
      dimensionsAdded: 0,
      criteriaAdded: 0,
      itemsAdded: 0,
      positionsSkipped: 0,
      scenariosSkipped: 0,
      dimensionsSkipped: 0,
      criteriaSkipped: 0,
      itemsSkipped: 0,
    };
    const previousMatchedEmployeeIds = this.getMatchedEmployees(candidate)
      .map((employee) => employee.id);
    const positionsByKey = new Map(
      candidate.participants.positions.map((position) => [
        this.normalizeSearchText(position),
        position,
      ])
    );
    const addedPositionKeys = new Set<string>();

    imported.positions.forEach((position) => {
      const positionKey = this.normalizeSearchText(position);
      if (positionsByKey.has(positionKey)) {
        stats.positionsSkipped++;
        return;
      }

      positionsByKey.set(positionKey, position);
      addedPositionKeys.add(positionKey);
      stats.positionsAdded++;
    });
    candidate.participants.positions = Array.from(positionsByKey.values());

    const selectedEmployeeIds = new Set([
      ...previousMatchedEmployeeIds,
      ...candidate.participants.employeeIds,
    ]);
    this.employees
      .filter((employee) =>
        (!candidate.participants.onlyActive || employee.activo) &&
        !!employee.cargo &&
        addedPositionKeys.has(this.normalizeSearchText(employee.cargo))
      )
      .forEach((employee) => selectedEmployeeIds.add(employee.id));
    candidate.participants.employeeIds = this.orderParticipantEmployeeIds(selectedEmployeeIds);

    const dimensions = new Map<string, DesEvaluationBigFactor>();
    const criteria = new Map<string, DesEvaluationFactor>();
    const processedDimensions = new Set<string>();
    const processedCriteria = new Set<string>();

    imported.rows.forEach((row) => {
      const importedItemType = this.toFrontendItemTypeCode(row.itemType);
      const dimensionKey = this.getExcelEntityKey(row.dimensionCode, row.dimensionName);
      let dimension = dimensions.get(dimensionKey);
      if (!dimension) {
        dimension = this.findExcelDimension(candidate, row);
        if (!dimension) {
          dimension = {
            id: this.generateId(),
            code: row.dimensionCode ?? undefined,
            name: row.dimensionName,
            description: row.dimensionDescription,
            weight: row.dimensionWeight,
            factors: [],
          };
          candidate.bigFactors.push(dimension);
          stats.dimensionsAdded++;
        } else if (!processedDimensions.has(dimensionKey)) {
          stats.dimensionsSkipped++;
        }
        dimensions.set(dimensionKey, dimension);
        processedDimensions.add(dimensionKey);
      }

      const criterionKey = [
        this.normalizeSearchText(row.position),
        row.scenarioKey,
        dimensionKey,
        this.getExcelEntityKey(row.criterionCode, row.criterionName),
      ].join('|');
      let criterion = criteria.get(criterionKey);
      if (!criterion) {
        criterion = this.findExcelCriterion(dimension, row);
        if (!criterion) {
          criterion = {
            id: this.generateId(),
            code: row.criterionCode ?? undefined,
            name: row.criterionName,
            description: row.criterionDescription,
            weight: row.criterionWeight,
            requiredRatingLevel: row.requiredRatingLevel,
            defaultQuestionType: importedItemType,
            questions: [],
            scenarioKeys: [row.scenarioKey],
            positionScope: 'SELECTED',
            positions: [row.position],
          };
          dimension.factors.push(criterion);
          stats.criteriaAdded++;
        } else if (!processedCriteria.has(criterionKey)) {
          stats.criteriaSkipped++;
        }
        criteria.set(criterionKey, criterion);
        processedCriteria.add(criterionKey);
      }

      if (this.hasExcelQuestion(criterion, row)) {
        stats.itemsSkipped++;
        return;
      }

      criterion.questions.push({
        id: this.generateId(),
        code: row.itemCode ?? undefined,
        label: row.itemText,
        type: importedItemType,
        required: true,
        options: importedItemType === 'ABIERTA' ? [] : [...row.options],
        scaleId: importedItemType === 'ABIERTA' ? null : row.scaleId,
        scenarioKeys: [row.scenarioKey],
        positionScope: 'SELECTED',
        positions: [row.position],
      });
      stats.itemsAdded++;
    });

    const baseScenarios = this.buildScenariosForType(
      candidate.modelType,
      candidate.scenarios
    );
    const importedScenarios = new Map<string, DesEvaluationExcelRow>();
    imported.rows.forEach((row) => {
      importedScenarios.set(
        `${this.normalizeSearchText(row.position)}|${row.scenarioKey}`,
        row
      );
    });

    const currentPositionConfigs = new Map(
      candidate.positionScenarios.map((positionConfig) => [
        this.normalizeSearchText(positionConfig.position),
        positionConfig,
      ])
    );
    importedScenarios.forEach((row, scenarioKey) => {
      const [positionKey] = scenarioKey.split('|');
      const currentScenario = currentPositionConfigs
        .get(positionKey)
        ?.scenarios.find((scenario) => scenario.key === row.scenarioKey);

      if (currentScenario && currentScenario.active !== false) {
        stats.scenariosSkipped++;
      } else {
        stats.scenariosAdded++;
      }
    });

    candidate.scenarios = baseScenarios;
    candidate.positionScenarios = candidate.participants.positions.map((position) => ({
      position,
      scenarios: baseScenarios.map((scenario) => {
        const currentScenario = currentPositionConfigs
          .get(this.normalizeSearchText(position))
          ?.scenarios.find((item) => item.key === scenario.key);
        const importedScenario = scenario.key
          ? importedScenarios.get(
              `${this.normalizeSearchText(position)}|${scenario.key}`
            )
          : null;
        const preserveCurrent = !!currentScenario && currentScenario.active !== false;

        return {
          ...scenario,
          id: currentScenario?.id ?? this.generateId(),
          backendId: currentScenario?.backendId,
          name: currentScenario?.name || scenario.name,
          weight: preserveCurrent
            ? Number(currentScenario?.weight) || 0
            : importedScenario?.scenarioWeight ?? Number(currentScenario?.weight) ?? 0,
          active: preserveCurrent || !!importedScenario,
        };
      }),
    }));
    this.ensurePositionScenarioConfigs(candidate);
    this.syncGlobalScenariosFromPositionConfigs(candidate);
    candidate.stats = this.buildStats(candidate, {
      total_enviadas: 0,
      total_iniciadas: 0,
      total_contestadas: 0,
      total_error: 0,
    });

    return { evaluation: candidate, stats };
  }

  private getExcelEntityKey(code: string | null, name: string): string {
    return this.normalizeSearchText(code || name);
  }

  private excelEntityMatches(
    existingCode: string | undefined,
    existingName: string,
    importedCode: string | null,
    importedName: string
  ): boolean {
    const existingCodeKey = this.normalizeSearchText(existingCode ?? '');
    const importedCodeKey = this.normalizeSearchText(importedCode ?? '');

    return (
      !!existingCodeKey &&
      !!importedCodeKey &&
      existingCodeKey === importedCodeKey
    ) || this.normalizeSearchText(existingName) === this.normalizeSearchText(importedName);
  }

  private findExcelDimension(
    evaluation: DesEvaluationCard,
    row: DesEvaluationExcelRow
  ): DesEvaluationBigFactor | undefined {
    return evaluation.bigFactors.find((dimension) =>
      this.excelEntityMatches(
        dimension.code,
        dimension.name,
        row.dimensionCode,
        row.dimensionName
      )
    );
  }

  private findExcelCriterion(
    dimension: DesEvaluationBigFactor,
    row: DesEvaluationExcelRow
  ): DesEvaluationFactor | undefined {
    return this.getFactorsForPositionAndScenario(
      dimension,
      row.position,
      row.scenarioKey
    )
      .map(({ factor }) => factor)
      .find((factor) =>
        this.excelEntityMatches(
          factor.code,
          factor.name,
          row.criterionCode,
          row.criterionName
        )
      );
  }

  private hasExcelQuestion(
    criterion: DesEvaluationFactor,
    row: DesEvaluationExcelRow
  ): boolean {
    const importedCode = this.normalizeSearchText(row.itemCode ?? '');
    const importedText = this.normalizeSearchText(row.itemText);

    return this.getQuestionsForPositionAndScenario(
      criterion,
      row.position,
      row.scenarioKey
    ).some(({ question }) => {
      const existingCode = this.normalizeSearchText(question.code ?? '');
      const sameCode = !!importedCode && !!existingCode && importedCode === existingCode;
      const sameTextAndType =
        this.normalizeSearchText(question.label) === importedText &&
        this.toFrontendItemTypeCode(question.type) ===
          this.toFrontendItemTypeCode(row.itemType);

      return sameCode || sameTextAndType;
    });
  }

  private filterInapplicableModelExcelScenarios(
    imported: DesEvaluationExcelImport,
    candidate: DesEvaluationCard
  ): DesEvaluationExcelApplicabilityResult {
    const warnings: string[] = [];
    const checked = new Set<string>();
    const omittedScenarioKeys = new Set<string>();
    const affectedPositions = new Set<string>();

    imported.rows.forEach((row) => {
      const positionKey = this.normalizeSearchText(row.position);
      const key = `${positionKey}|${row.scenarioKey}`;
      if (checked.has(key)) {
        return;
      }
      checked.add(key);

      if (!this.isPositionScenarioStructurallyApplicable(
        row.position,
        row.scenarioKey,
        candidate
      )) {
        omittedScenarioKeys.add(key);
        affectedPositions.add(positionKey);
        warnings.push(this.t(
          'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_VALIDATIONS.SCENARIO_NOT_APPLICABLE',
          {
            sheet: row.sheetName,
            position: row.position,
            scenario: this.getQuestionScenarioLabel(row.scenarioKey),
          }
        ));
      }
    });

    if (omittedScenarioKeys.size === 0) {
      return {
        imported,
        warnings,
        omittedScenarios: 0,
        recalculatedWeights: false,
      };
    }

    const applicableRows = imported.rows.filter((row) => !omittedScenarioKeys.has(
      `${this.normalizeSearchText(row.position)}|${row.scenarioKey}`
    ));
    const normalizedRows = this.normalizeApplicableExcelScenarioWeights(
      applicableRows,
      affectedPositions
    );

    return {
      imported: this.buildModelExcelImportSummary(normalizedRows, imported.positions),
      warnings,
      omittedScenarios: omittedScenarioKeys.size,
      recalculatedWeights: normalizedRows.some((row) =>
        affectedPositions.has(this.normalizeSearchText(row.position))
      ),
    };
  }

  private normalizeApplicableExcelScenarioWeights(
    rows: DesEvaluationExcelRow[],
    affectedPositions: Set<string>
  ): DesEvaluationExcelRow[] {
    const weightsByScenario = new Map<string, number>();
    const scenarioKeysByPosition = new Map<string, string[]>();

    rows.forEach((row) => {
      const positionKey = this.normalizeSearchText(row.position);
      if (!affectedPositions.has(positionKey)) {
        return;
      }

      const scenarioKey = `${positionKey}|${row.scenarioKey}`;
      weightsByScenario.set(scenarioKey, row.scenarioWeight);
      const scenarioKeys = scenarioKeysByPosition.get(positionKey) ?? [];
      if (!scenarioKeys.includes(scenarioKey)) {
        scenarioKeys.push(scenarioKey);
        scenarioKeysByPosition.set(positionKey, scenarioKeys);
      }
    });

    const normalizedWeights = new Map<string, number>();
    scenarioKeysByPosition.forEach((scenarioKeys) => {
      const total = scenarioKeys.reduce(
        (sum, scenarioKey) => sum + (weightsByScenario.get(scenarioKey) ?? 0),
        0
      );
      let assigned = 0;

      scenarioKeys.forEach((scenarioKey, index) => {
        const isLast = index === scenarioKeys.length - 1;
        const rawWeight = total > 0
          ? ((weightsByScenario.get(scenarioKey) ?? 0) / total) * 100
          : 100 / scenarioKeys.length;
        const weight = isLast
          ? Number((100 - assigned).toFixed(2))
          : Number(rawWeight.toFixed(2));
        normalizedWeights.set(scenarioKey, weight);
        assigned += weight;
      });
    });

    return rows.map((row) => {
      const scenarioKey = `${this.normalizeSearchText(row.position)}|${row.scenarioKey}`;
      const scenarioWeight = normalizedWeights.get(scenarioKey);
      return scenarioWeight === undefined ? row : { ...row, scenarioWeight };
    });
  }

  private buildModelExcelImportSummary(
    rows: DesEvaluationExcelRow[],
    importedPositions?: string[]
  ): DesEvaluationExcelImport {
    const positions = Array.from(new Set(
      importedPositions ?? rows.map((row) => row.position)
    ));
    const scenarios = new Set(rows.map((row) =>
      `${this.normalizeSearchText(row.position)}|${row.scenarioKey}`
    ));
    const dimensions = new Set(rows.map((row) =>
      this.normalizeSearchText(row.dimensionCode || row.dimensionName)
    ));
    const criteria = new Set(rows.map((row) => [
      this.normalizeSearchText(row.position),
      row.scenarioKey,
      this.normalizeSearchText(row.dimensionCode || row.dimensionName),
      this.normalizeSearchText(row.criterionCode || row.criterionName),
    ].join('|')));

    return {
      rows,
      positions,
      scenarioCount: scenarios.size,
      dimensionCount: dimensions.size,
      criterionCount: criteria.size,
      itemCount: rows.length,
    };
  }

  private buildModelExcelTemplateRows(
    position: string,
    scenario: string,
    scale: string,
    scaleOptions: string[]
  ): Array<Record<string, string | number>> {
    const definitions = [
      {
        dimensionCode: 'OBJETIVOS',
        dimensionName: 'Objetivos',
        dimensionDescription: 'Cumplimiento de metas y entregables acordados.',
        dimensionWeight: 45,
        criterionCode: 'CUMPLIMIENTO_ENTREGAS',
        criterionName: 'Cumplimiento y tiempos de entrega',
        criterionDescription: 'Evalúa oportunidad, calidad y cumplimiento de compromisos.',
        items: [
          ['OBJ_ENTREGA_TIEMPO', 'Entrega su trabajo a tiempo o antes de lo planificado', 'Likert de 5 niveles'],
          ['OBJ_MEJORA', '¿Qué podría mejorar para alcanzar sus objetivos?', 'Pregunta abierta'],
        ],
      },
      {
        dimensionCode: 'COMPETENCIAS',
        dimensionName: 'Competencias',
        dimensionDescription: 'Habilidades observables para desempeñar el puesto.',
        dimensionWeight: 35,
        criterionCode: 'COMUNICACION_COLABORACION',
        criterionName: 'Comunicación y colaboración',
        criterionDescription: 'Evalúa comunicación efectiva y trabajo con otras personas.',
        items: [
          ['COM_COMUNICA_CLARO', 'Comunica sus ideas de forma clara y oportuna', 'Likert de 5 niveles'],
          ['COM_APOYA_EQUIPO', 'Colabora activamente con su equipo para resolver problemas', 'Likert de 5 niveles'],
        ],
      },
      {
        dimensionCode: 'VALORES',
        dimensionName: 'Valores',
        dimensionDescription: 'Conductas alineadas con los valores de la organización.',
        dimensionWeight: 20,
        criterionCode: 'INTEGRIDAD_RESPONSABILIDAD',
        criterionName: 'Integridad y responsabilidad',
        criterionDescription: 'Evalúa conducta ética y responsabilidad sobre los resultados.',
        items: [
          ['VAL_ASUME_RESPONSABILIDAD', 'Asume responsabilidad por sus decisiones y resultados', 'Likert de 5 niveles'],
          ['VAL_CONDUCTA', 'Describa una conducta destacable observada', 'Pregunta abierta'],
        ],
      },
    ];

    return definitions.flatMap((definition) =>
      definition.items.map(([itemCode, itemText, itemType]) => ({
        [DES_EVALUATION_EXCEL_HEADERS.position]: position,
        [DES_EVALUATION_EXCEL_HEADERS.scenario]: scenario,
        [DES_EVALUATION_EXCEL_HEADERS.scenarioWeight]: 100,
        [DES_EVALUATION_EXCEL_HEADERS.dimensionCode]: definition.dimensionCode,
        [DES_EVALUATION_EXCEL_HEADERS.dimensionName]: definition.dimensionName,
        [DES_EVALUATION_EXCEL_HEADERS.dimensionDescription]: definition.dimensionDescription,
        [DES_EVALUATION_EXCEL_HEADERS.dimensionWeight]: definition.dimensionWeight,
        [DES_EVALUATION_EXCEL_HEADERS.criterionCode]: definition.criterionCode,
        [DES_EVALUATION_EXCEL_HEADERS.criterionName]: definition.criterionName,
        [DES_EVALUATION_EXCEL_HEADERS.criterionDescription]: definition.criterionDescription,
        [DES_EVALUATION_EXCEL_HEADERS.criterionWeight]: 100,
        [DES_EVALUATION_EXCEL_HEADERS.requiredRatingLevel]: 4,
        [DES_EVALUATION_EXCEL_HEADERS.itemCode]: itemCode,
        [DES_EVALUATION_EXCEL_HEADERS.itemText]: itemText,
        [DES_EVALUATION_EXCEL_HEADERS.itemType]: itemType,
        [DES_EVALUATION_EXCEL_HEADERS.scale]: itemType === 'Likert de 5 niveles' ? scale : '',
        [DES_EVALUATION_EXCEL_HEADERS.options]: itemType === 'Likert de 5 niveles'
          ? scaleOptions.join(' | ')
          : '',
      }))
    );
  }

  private getModelExcelTemplatePosition(): string {
    const selectedPositions = this.draftEvaluation?.participants.positions ?? [];
    const candidates = [
      ...selectedPositions,
      ...this.positionOptions.filter((position) => position.active).map((position) => position.name),
    ];
    const validPosition = candidates.find((position) => !!position);

    return validPosition ?? 'NOMBRE_PUESTO_EXISTENTE';
  }

  private getExcelImportPositionNames(): string[] {
    const names = [
      ...this.positionOptions
        .filter((position) => position.active)
        .map((position) => position.name),
      ...(this.draftEvaluation?.participants.positions ?? []),
      ...this.availablePositions,
      ...this.employees.map((employee) => employee.cargo).filter(
        (position): position is string => !!position
      ),
    ];
    const unique = new Map<string, string>();

    names.forEach((position) => {
      const normalized = this.normalizeSearchText(position);
      if (normalized && !unique.has(normalized)) {
        unique.set(normalized, position.trim());
      }
    });

    return Array.from(unique.values());
  }

  private getModelExcelWorksheetName(position: string): string {
    const sanitized = position
      .replace(/[\\/?*\[\]:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return (sanitized || 'PUESTO').slice(0, 31);
  }

  private async showModelExcelErrors(errors: string[]): Promise<void> {
    const safeErrors = errors
      .map((error) => `<li>${this.escapeHtml(error)}</li>`)
      .join('');
    await Swal.fire({
      title: this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.EXCEL_IMPORT.ERROR_TITLE'),
      html: `<div class="excel-import-error-list"><ol>${safeErrors}</ol></div>`,
      icon: 'error',
      width: 820,
    });
  }

  onModelCatalogNameChange(value: string): void {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.modelName = value;
    this.selectedModelCatalogId = this.findModelCatalogByName(value)?.id ?? null;
  }

  openModelCatalogSearchDialog(): void {
    if (!this.draftEvaluation || !this.modelCatalogSearchDialogTemplate) {
      return;
    }

    this.modelCatalogSearchTerm = this.draftEvaluation.modelName ?? '';
    this.modelCatalogDialogRef?.close();
    this.modelCatalogDialogRef = this.dialog.open(this.modelCatalogSearchDialogTemplate, {
      width: '760px',
      maxWidth: '94vw',
      maxHeight: '86vh',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });

    this.modelCatalogDialogRef.afterClosed().subscribe(() => {
      this.modelCatalogDialogRef = null;
    });
  }

  getFilteredModelCatalog(): ModelCatalogOption[] {
    const search = this.normalizeSearchText(this.modelCatalogSearchTerm);

    if (!search) {
      return this.modelCatalog;
    }

    return this.modelCatalog.filter((option) => {
      const values = [
        this.getModelCatalogName(option),
        this.getModelCatalogDescription(option),
        this.getSurveyTypeLabel(option.type),
        option.type,
      ];

      return values.some((value) => this.normalizeSearchText(value).includes(search));
    });
  }

  getModelCatalogDescription(option: ModelCatalogOption): string {
    return option.description ??
      this.translateKeyOrFallback(option.descriptionKey ?? '', '');
  }

  async selectModelCatalogModel(option: ModelCatalogOption): Promise<void> {
    await this.applyModelCatalog(option.id);
    this.modelCatalogDialogRef?.close();
  }

  async applyModelCatalog(optionId: number | null): Promise<void> {
    if (!this.draftEvaluation || !optionId) {
      return;
    }

    const option = this.modelCatalog.find((item) => item.id === optionId);
    if (!option) {
      return;
    }

    this.selectedModelCatalogId = optionId;
    this.draftEvaluation.modelName = this.getModelCatalogName(option);
    this.draftEvaluation.modelType = option.type;
    this.draftEvaluation.modelTypeId =
      option.typeId ??
      this.modelTypeOptions.find((item) => item.code === option.type)?.id;
    this.draftEvaluation.scaleId = this.getScaleById(option.scaleId)
      ? option.scaleId
      : this.getDefaultScale()?.id ?? this.draftEvaluation.scaleId;
    this.draftEvaluation.scaleLabel = this.getScaleLabel(this.draftEvaluation.scaleId);
    this.draftEvaluation.useWeighting = option.useWeighting;
    this.draftEvaluation.useAnonymity = option.useAnonymity;
    this.draftEvaluation.surveyType = option.type;
    this.draftEvaluation.scenarios = await this.loadScenariosForType(option.type);
    this.draftEvaluation.positionScenarios = [];
    this.normalizeEvaluationQuestionScopes(this.draftEvaluation);
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
    this.refreshQuestionScenarioState();
  }

  async onSurveyTypeChange(type: string): Promise<void> {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.modelType = type;
    this.draftEvaluation.modelTypeId =
      this.modelTypeOptions.find((item) => item.code === type)?.id;
    this.draftEvaluation.surveyType = type;
    this.draftEvaluation.scenarios = await this.loadScenariosForType(
      type,
      this.draftEvaluation.scenarios
    );
    this.draftEvaluation.positionScenarios = [];
    this.normalizeEvaluationQuestionScopes(this.draftEvaluation);
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
    this.refreshQuestionScenarioState();
  }

  openBigFactorDialog(index?: number): void {
    if (!this.draftEvaluation) {
      return;
    }

    if (typeof index !== 'number' && this.isDemoPerformanceDimensionLimitReached) {
      void this.showDemoLimitMessage(
        'DEMO_DIMENSION_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceDimensionsPerModel')
      );
      return;
    }

    const bigFactor = typeof index === 'number' ? this.draftEvaluation.bigFactors[index] : null;
    this.editBigFactorIndex = typeof index === 'number' ? index : null;
    this.bigFactorDraft = bigFactor
      ? {
          name: bigFactor.name,
          description: bigFactor.description,
          weight: bigFactor.weight,
        }
      : this.createEmptyBigFactorDraft();

    this.nestedDialogRef = this.dialog.open(this.bigFactorDialogTemplate!, {
      width: '520px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });
  }

  saveBigFactorDialog(): void {
    if (!this.draftEvaluation) {
      return;
    }

    if (this.editBigFactorIndex === null && this.isDemoPerformanceDimensionLimitReached) {
      void this.showDemoLimitMessage(
        'DEMO_DIMENSION_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceDimensionsPerModel')
      );
      return;
    }

    if (!this.bigFactorDraft.name.trim()) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DIMENSION_NAME_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DIMENSION_NAME_TEXT'),
        'warning'
      );
      return;
    }

    const nextFactor: DesEvaluationBigFactor = {
      id: this.editBigFactorIndex !== null
        ? this.draftEvaluation.bigFactors[this.editBigFactorIndex].id
        : this.generateId(),
      name: this.bigFactorDraft.name.trim(),
      description: this.bigFactorDraft.description.trim(),
      weight: Number(this.bigFactorDraft.weight) || 0,
      factors:
        this.editBigFactorIndex !== null
          ? this.draftEvaluation.bigFactors[this.editBigFactorIndex].factors
          : [],
    };

    if (this.editBigFactorIndex !== null) {
      this.draftEvaluation.bigFactors[this.editBigFactorIndex] = nextFactor;
    } else {
      this.draftEvaluation.bigFactors.push(nextFactor);
    }

    this.nestedDialogRef?.close();
  }

  removeBigFactor(index: number): void {
    this.draftEvaluation?.bigFactors.splice(index, 1);
  }

  openFactorDialog(
    bigFactorIndex: number,
    factorIndex?: number | null,
    position?: string,
    scenarioKey?: DesEvaluationScenarioKey
  ): void {
    if (!this.draftEvaluation) {
      return;
    }

    const currentFactor =
      typeof factorIndex === 'number'
        ? this.draftEvaluation.bigFactors[bigFactorIndex]?.factors[factorIndex] ?? null
        : null;
    const contextPosition =
      position ??
      (currentFactor ? this.normalizeFactorPositions(currentFactor)[0] : null) ??
      null;
    const contextScenarioKey =
      scenarioKey ??
      (currentFactor ? this.normalizeFactorScenarioKeys(currentFactor, this.draftEvaluation.modelType)[0] : null) ??
      null;

    const bigFactor = this.draftEvaluation.bigFactors[bigFactorIndex];
    if (
      typeof factorIndex !== 'number' &&
      bigFactor &&
      this.isDemoPerformanceCriteriaLimitReached(
        bigFactor,
        contextPosition,
        contextScenarioKey
      )
    ) {
      void this.showDemoLimitMessage(
        'DEMO_CRITERIA_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceCriteriaPerDimension'),
        { dimension: bigFactor.name }
      );
      return;
    }

    this.editFactorContext = {
      bigFactorIndex,
      factorIndex: typeof factorIndex === 'number' ? factorIndex : null,
      position: contextPosition,
      scenarioKey: contextScenarioKey,
    };

    this.factorDraft = currentFactor
      ? {
          name: currentFactor.name,
          description: currentFactor.description,
          weight: currentFactor.weight,
          requiredRatingLevel: this.getFactorRequiredRatingLevel(currentFactor),
          defaultQuestionType: currentFactor.defaultQuestionType,
        }
      : {
          ...this.createEmptyFactorDraft(),
          weight: this.getSuggestedFactorWeight(
            bigFactorIndex,
            contextPosition,
            contextScenarioKey
          ),
        };

    this.nestedDialogRef = this.dialog.open(this.factorDialogTemplate!, {
      width: '560px',
      maxWidth: '94vw',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });
  }

  saveFactorDialog(): void {
    if (!this.draftEvaluation || !this.editFactorContext) {
      return;
    }

    if (!this.factorDraft.name.trim()) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.COMPETENCY_NAME_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.COMPETENCY_NAME_TEXT'),
        'warning'
      );
      return;
    }

    const bigFactor = this.draftEvaluation.bigFactors[this.editFactorContext.bigFactorIndex];
    if (!bigFactor) {
      return;
    }
    const currentFactor =
      this.editFactorContext.factorIndex !== null
        ? bigFactor.factors[this.editFactorContext.factorIndex] ?? null
        : null;
    const contextPosition = this.editFactorContext.position;
    const contextScenarioKey = this.editFactorContext.scenarioKey;

    if (
      this.editFactorContext.factorIndex === null &&
      this.isDemoPerformanceCriteriaLimitReached(
        bigFactor,
        contextPosition,
        contextScenarioKey
      )
    ) {
      void this.showDemoLimitMessage(
        'DEMO_CRITERIA_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceCriteriaPerDimension'),
        { dimension: bigFactor.name }
      );
      return;
    }

    const factor: DesEvaluationFactor = {
      id:
        currentFactor
          ? currentFactor.id
          : this.generateId(),
      name: this.factorDraft.name.trim(),
      description: this.factorDraft.description.trim(),
      weight: Number(this.factorDraft.weight) || 0,
      requiredRatingLevel: this.normalizeRequiredRatingLevel(this.factorDraft.requiredRatingLevel),
      defaultQuestionType: this.factorDraft.defaultQuestionType,
      questions: currentFactor
        ? currentFactor.questions.map((question) => ({
          ...question,
          required: true,
          options: [...question.options],
          scenarioKeys: contextScenarioKey ? [contextScenarioKey] : question.scenarioKeys,
          positionScope: contextPosition ? 'SELECTED' : question.positionScope,
          positions: contextPosition ? [contextPosition] : question.positions,
        }))
        : [],
      scenarioKeys: contextScenarioKey ? [contextScenarioKey] : [],
      positionScope: contextPosition ? 'SELECTED' : 'ALL',
      positions: contextPosition ? [contextPosition] : [],
    };

    if (this.editFactorContext.factorIndex !== null && currentFactor) {
      bigFactor.factors[this.editFactorContext.factorIndex] = factor;
    } else {
      bigFactor.factors.push(factor);
    }

    this.nestedDialogRef?.close();
  }

  removeFactor(bigFactorIndex: number, factorIndex: number): void {
    this.draftEvaluation?.bigFactors[bigFactorIndex]?.factors.splice(factorIndex, 1);
  }

  removeFactorForPosition(
    bigFactorIndex: number,
    factorIndex: number,
    _position: string,
    _scenarioKey?: DesEvaluationScenarioKey
  ): void {
    if (!this.draftEvaluation) {
      return;
    }

    const factors = this.draftEvaluation.bigFactors[bigFactorIndex]?.factors;
    const factor = factors?.[factorIndex];

    if (!factors || !factor) {
      return;
    }

    factors.splice(factorIndex, 1);
  }

  openQuestionDialog(
    bigFactorIndex: number,
    factorIndex: number,
    questionIndex?: number | null,
    position?: string,
    scenarioKey?: DesEvaluationScenarioKey
  ): void {
    if (!this.draftEvaluation) {
      return;
    }

    const currentQuestion =
      typeof questionIndex === 'number'
        ? this.draftEvaluation.bigFactors[bigFactorIndex]?.factors[factorIndex]?.questions[questionIndex] ?? null
        : null;
    const contextPosition =
      position ??
      (currentQuestion ? this.normalizeQuestionPositions(currentQuestion)[0] : null) ??
      null;
    const contextScenarioKey =
      scenarioKey ??
      (currentQuestion
        ? this.normalizeQuestionScenarioKeys(currentQuestion, this.draftEvaluation.modelType)[0]
        : null) ??
      null;

    const factor = this.draftEvaluation.bigFactors[bigFactorIndex]?.factors[factorIndex];
    if (
      typeof questionIndex !== 'number' &&
      factor &&
      this.isDemoPerformanceItemLimitReached(factor, contextPosition, contextScenarioKey)
    ) {
      void this.showDemoLimitMessage(
        'DEMO_ITEM_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceItemsPerCriterion'),
        { criterion: factor.name }
      );
      return;
    }

    this.editQuestionContext = {
      bigFactorIndex,
      factorIndex,
      questionIndex: typeof questionIndex === 'number' ? questionIndex : null,
      position: contextPosition,
      scenarioKey: contextScenarioKey,
    };

    this.questionDraft = currentQuestion
      ? {
          label: currentQuestion.label,
          type: currentQuestion.type,
          optionsText: currentQuestion.options.join('\n'),
          scenarioKeys: contextScenarioKey ? [contextScenarioKey] : [],
          positionScope: contextPosition ? 'SELECTED' : 'ALL',
          positions: contextPosition ? [contextPosition] : [],
        }
      : this.createEmptyQuestionDraft();
    this.ensureQuestionLikertOptions();
    this.refreshQuestionOptionsSummary();
    this.questionPositionSearchTerm = '';
    this.filteredQuestionPositions = this.availablePositions;
    this.refreshQuestionScenarioState();

    this.nestedDialogRef = this.dialog.open(this.questionDialogTemplate!, {
      width: '820px',
      maxWidth: '94vw',
      maxHeight: '88vh',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });
  }

  saveQuestionDialog(): void {
    if (!this.draftEvaluation || !this.editQuestionContext) {
      return;
    }

    if (!this.questionDraft.label.trim()) {
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.QUESTION_REQUIRED_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.QUESTION_REQUIRED_TEXT'),
        'warning'
      );
      return;
    }

    const factor = this.draftEvaluation.bigFactors[this.editQuestionContext.bigFactorIndex]
      ?.factors[this.editQuestionContext.factorIndex];
    if (!factor) {
      return;
    }

    if (
      this.editQuestionContext.questionIndex === null &&
      this.isDemoPerformanceItemLimitReached(
        factor,
        this.editQuestionContext.position,
        this.editQuestionContext.scenarioKey
      )
    ) {
      void this.showDemoLimitMessage(
        'DEMO_ITEM_LIMIT_TEXT',
        this.demoLimitsService.getLimit('maxPerformanceItemsPerCriterion'),
        { criterion: factor.name }
      );
      return;
    }

    const options = this.questionDraft.optionsText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const question: DesEvaluationQuestion = {
      id:
        this.editQuestionContext.questionIndex !== null
          ? factor.questions[this.editQuestionContext.questionIndex].id
          : this.generateId(),
      label: this.questionDraft.label.trim(),
      type: this.questionDraft.type,
      required: true,
      options,
      scenarioKeys: this.editQuestionContext.scenarioKey
        ? [this.editQuestionContext.scenarioKey]
        : [],
      positionScope: this.editQuestionContext.position ? 'SELECTED' : 'ALL',
      positions: this.editQuestionContext.position ? [this.editQuestionContext.position] : [],
    };

    if (this.editQuestionContext.questionIndex !== null) {
      factor.questions[this.editQuestionContext.questionIndex] = question;
    } else {
      factor.questions.push(question);
    }

    this.refreshQuestionScenarioState();
    this.nestedDialogRef?.close();
  }

  removeQuestion(bigFactorIndex: number, factorIndex: number, questionIndex: number): void {
    this.draftEvaluation?.bigFactors[bigFactorIndex]?.factors[factorIndex]?.questions.splice(questionIndex, 1);
    this.refreshQuestionScenarioState();
  }

  removeQuestionForPosition(
    bigFactorIndex: number,
    factorIndex: number,
    questionIndex: number,
    _position: string,
    _scenarioKey?: DesEvaluationScenarioKey
  ): void {
    if (!this.draftEvaluation) {
      return;
    }

    const questions = this.draftEvaluation.bigFactors[bigFactorIndex]?.factors[factorIndex]?.questions;
    const question = questions?.[questionIndex];

    if (!questions || !question) {
      return;
    }

    questions.splice(questionIndex, 1);

    this.refreshQuestionScenarioState();
  }

  openDuplicateCriterionDialog(
    bigFactorIndex: number,
    factorIndex: number,
    sourcePosition: string,
    scenarioKey: DesEvaluationScenarioKey
  ): void {
    this.openDuplicatePositionsDialog({
      type: 'CRITERION',
      bigFactorIndex,
      factorIndex,
      questionIndex: null,
      sourcePosition,
      scenarioKey,
    });
  }

  openDuplicateItemDialog(
    bigFactorIndex: number,
    factorIndex: number,
    questionIndex: number,
    sourcePosition: string,
    scenarioKey: DesEvaluationScenarioKey
  ): void {
    this.openDuplicatePositionsDialog({
      type: 'ITEM',
      bigFactorIndex,
      factorIndex,
      questionIndex,
      sourcePosition,
      scenarioKey,
    });
  }

  getFilteredDuplicatePositions(): string[] {
    if (!this.draftEvaluation || !this.duplicateContext) {
      return [];
    }

    const search = this.normalizeSearchText(this.duplicatePositionSearchTerm);
    return this.draftEvaluation.participants.positions.filter(
      (position) =>
        position !== this.duplicateContext?.sourcePosition &&
        !this.isPositionEvaluatorOnly(position) &&
        this.isPositionScenarioApplicable(position, this.duplicateContext?.scenarioKey ?? 'BOSS_TO_EMPLOYEE') &&
        (!search || this.normalizeSearchText(position).includes(search))
    );
  }

  isDuplicatePositionSelected(position: string): boolean {
    return this.selectedDuplicatePositions.includes(position);
  }

  toggleDuplicatePosition(position: string): void {
    if (this.isDuplicateTargetUnavailable(position)) {
      return;
    }

    this.setDuplicatePositionSelected(position, !this.isDuplicatePositionSelected(position));
  }

  setDuplicatePositionSelected(position: string, selected: boolean): void {
    if (this.isDuplicateTargetUnavailable(position)) {
      return;
    }

    const selectedPositions = new Set(this.selectedDuplicatePositions);
    selected ? selectedPositions.add(position) : selectedPositions.delete(position);
    const participantPositions = this.draftEvaluation?.participants.positions ?? [];
    this.selectedDuplicatePositions = participantPositions.filter((item) => selectedPositions.has(item));
  }

  selectAllFilteredDuplicatePositions(): void {
    const selectedPositions = new Set([
      ...this.selectedDuplicatePositions,
      ...this.getFilteredDuplicatePositions().filter(
        (position) => !this.isDuplicateTargetUnavailable(position)
      ),
    ]);
    const participantPositions = this.draftEvaluation?.participants.positions ?? [];
    this.selectedDuplicatePositions = participantPositions.filter((item) => selectedPositions.has(item));
  }

  clearDuplicatePositions(): void {
    this.selectedDuplicatePositions = [];
  }

  isDuplicateTargetUnavailable(position: string): boolean {
    const statusKey = this.getDuplicateTargetStatusKey(position);
    return statusKey === 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_ALREADY_HAS_CRITERION' ||
      statusKey === 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_ALREADY_HAS_ITEM';
  }

  getDuplicateTargetStatusKey(position: string): string | null {
    if (!this.draftEvaluation || !this.duplicateContext) {
      return null;
    }

    const duplicateContext = this.duplicateContext;
    const dimension = this.draftEvaluation.bigFactors[duplicateContext.bigFactorIndex];
    const sourceFactor = dimension?.factors[duplicateContext.factorIndex];
    if (!dimension || !sourceFactor) {
      return null;
    }

    const targetFactor = this.findEquivalentFactorForPosition(
      dimension,
      sourceFactor,
      position,
      duplicateContext.scenarioKey
    );
    if (duplicateContext.type === 'CRITERION') {
      return targetFactor
        ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_ALREADY_HAS_CRITERION'
        : null;
    }

    if (!targetFactor) {
      return 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_WILL_CREATE_CRITERION';
    }

    const sourceQuestion = duplicateContext.questionIndex !== null
      ? sourceFactor.questions[duplicateContext.questionIndex]
      : null;

    return sourceQuestion && this.hasEquivalentQuestionForPosition(targetFactor, sourceQuestion, position)
      ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_ALREADY_HAS_ITEM'
      : null;
  }

  applyPositionDuplication(): void {
    if (
      !this.draftEvaluation ||
      !this.duplicateContext ||
      this.selectedDuplicatePositions.length === 0
    ) {
      return;
    }

    const duplicateContext = this.duplicateContext;
    const dimension = this.draftEvaluation.bigFactors[duplicateContext.bigFactorIndex];
    const sourceFactor = dimension?.factors[duplicateContext.factorIndex];
    if (!dimension || !sourceFactor) {
      return;
    }

    let copiedCount = 0;
    let skippedCount = 0;

    this.selectedDuplicatePositions.forEach((targetPosition) => {
      if (!this.isPositionScenarioApplicable(targetPosition, duplicateContext.scenarioKey, this.draftEvaluation)) {
        skippedCount++;
        return;
      }

      if (duplicateContext.type === 'CRITERION') {
        if (this.findEquivalentFactorForPosition(
          dimension,
          sourceFactor,
          targetPosition,
          duplicateContext.scenarioKey
        )) {
          skippedCount++;
          return;
        }

        if (this.isDemoPerformanceCriteriaLimitReached(
          dimension,
          targetPosition,
          duplicateContext.scenarioKey
        )) {
          skippedCount++;
          return;
        }

        dimension.factors.push(
          this.cloneFactorFromSourcePosition(
            sourceFactor,
            duplicateContext.sourcePosition,
            targetPosition,
            duplicateContext.scenarioKey
          )
        );
        copiedCount++;
        return;
      }

      const sourceQuestion = duplicateContext.questionIndex !== null
        ? sourceFactor.questions[duplicateContext.questionIndex]
        : null;
      if (!sourceQuestion) {
        skippedCount++;
        return;
      }

      let targetFactor = this.findEquivalentFactorForPosition(
        dimension,
        sourceFactor,
        targetPosition,
        duplicateContext.scenarioKey
      );

      if (!targetFactor) {
        if (this.isDemoPerformanceCriteriaLimitReached(
          dimension,
          targetPosition,
          duplicateContext.scenarioKey
        )) {
          skippedCount++;
          return;
        }

        targetFactor = this.cloneFactorShellForPosition(
          sourceFactor,
          targetPosition,
          duplicateContext.scenarioKey
        );
        dimension.factors.push(targetFactor);
      }

      if (this.hasEquivalentQuestionForPosition(targetFactor, sourceQuestion, targetPosition)) {
        skippedCount++;
        return;
      }

      if (this.isDemoPerformanceItemLimitReached(
        targetFactor,
        targetPosition,
        duplicateContext.scenarioKey
      )) {
        skippedCount++;
        return;
      }

      targetFactor.questions.push(
        this.cloneQuestionForPositionTarget(
          sourceQuestion,
          targetPosition,
          duplicateContext.scenarioKey
        )
      );
      copiedCount++;
    });

    this.refreshQuestionScenarioState();
    this.duplicatePositionsDialogRef?.close();

    Swal.fire(
      this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_RESULT_TITLE'),
      this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_RESULT_TEXT', {
        copied: copiedCount,
        skipped: skippedCount,
      }),
      copiedCount > 0 ? 'success' : 'info'
    );
  }

  getQuestionsForPosition(
    factor: DesEvaluationFactor,
    position: string
  ): Array<{ question: DesEvaluationQuestion; index: number }> {
    return factor.questions
      .map((question, index) => ({ question, index }))
      .filter(({ question }) =>
        question.positionScope !== 'SELECTED' ||
        this.normalizeQuestionPositions(question).includes(position)
      );
  }

  getFactorsForPosition(
    bigFactor: DesEvaluationBigFactor,
    position: string
  ): Array<{ factor: DesEvaluationFactor; index: number }> {
    return bigFactor.factors
      .map((factor, index) => ({ factor, index }))
      .filter(({ factor }) =>
        factor.positionScope !== 'SELECTED' ||
        this.normalizeFactorPositions(factor).includes(position)
      );
  }

  getFactorsForPositionAndScenario(
    bigFactor: DesEvaluationBigFactor,
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): Array<{ factor: DesEvaluationFactor; index: number }> {
    const evaluationType = this.draftEvaluation?.modelType ?? '360';

    return this.getFactorsForPosition(bigFactor, position).filter(({ factor }) =>
      this.normalizeFactorScenarioKeys(factor, evaluationType).includes(scenarioKey)
    );
  }

  getQuestionsForPositionAndScenario(
    factor: DesEvaluationFactor,
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): Array<{ question: DesEvaluationQuestion; index: number }> {
    const evaluationType = this.draftEvaluation?.modelType ?? '360';

    return this.getQuestionsForPosition(factor, position).filter(({ question }) =>
      this.normalizeQuestionScenarioKeys(question, evaluationType).includes(scenarioKey)
    );
  }

  getEvaluationScenarioOptions(
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): DesEvaluationScenarioOption[] {
    if (!evaluation) {
      return [];
    }

    const definitions = this.getScenarioDefinitions(evaluation.modelType);
    const activePositionScenarioKeys = new Set<DesEvaluationScenarioKey>();

    if (evaluation.participants.positions.length > 0) {
      evaluation.participants.positions.forEach((position) => {
        this.getActivePositionScenarios(position, evaluation).forEach((scenario) => {
          if (scenario.key) {
            activePositionScenarioKeys.add(scenario.key);
          }
        });
      });
    }

    return definitions
      .map((definition, index) => {
        const configuredScenario = evaluation.scenarios.find(
          (scenario) => scenario.key === definition.key
        ) ?? evaluation.scenarios[index];

        return {
          key: definition.key,
          name: this.getQuestionScenarioLabel(definition.key),
          weight: Number(configuredScenario?.weight ?? definition.weight) || 0,
          active: configuredScenario?.active !== false,
        };
      })
      .filter((scenario) =>
        evaluation.participants.positions.length > 0
          ? activePositionScenarioKeys.has(scenario.key)
          : scenario.active
      )
      .map(({ active: _active, ...scenario }) => scenario);
  }

  getPositionScenarioOptions(
    position: string,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): DesEvaluationScenario[] {
    if (!evaluation) {
      return [];
    }

    const configuredPosition = (evaluation.positionScenarios ?? [])
      .find((item) => item.position === position);
    const configuredByKey = new Map(
      (configuredPosition?.scenarios ?? [])
        .filter((scenario) => !!scenario.key)
        .map((scenario) => [scenario.key as DesEvaluationScenarioKey, scenario])
    );

    return this.buildScenariosForType(evaluation.modelType, evaluation.scenarios).map((scenario) => {
      const configuredScenario = scenario.key ? configuredByKey.get(scenario.key) : null;

      return configuredScenario
        ? {
            ...scenario,
            id: configuredScenario.id ?? scenario.id,
            backendId: configuredScenario.backendId ?? scenario.backendId,
            name: configuredScenario.name || scenario.name,
            weight: Number(configuredScenario.weight ?? scenario.weight) || 0,
            active: configuredScenario.active !== false,
          }
        : { ...scenario };
    });
  }

  getActivePositionScenarios(
    position: string,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): DesEvaluationScenario[] {
    return this.getPositionScenarioOptions(position, evaluation)
      .filter((scenario) =>
        !!scenario.key &&
        scenario.active !== false &&
        this.isPositionScenarioStructurallyApplicable(position, scenario.key, evaluation)
      );
  }

  trackByEvaluationScenario(
    _index: number,
    scenario: DesEvaluationScenarioOption | DesEvaluationScenario
  ): DesEvaluationScenarioKey {
    return scenario.key ?? this.toScenarioKey(scenario.name) ?? 'BOSS_TO_EMPLOYEE';
  }

  isPositionScenarioSelected(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): boolean {
    if (!scenarioKey) {
      return false;
    }

    const scenario = this.getPositionScenarioOptions(position, evaluation)
      .find((item) => item.key === scenarioKey);

    return scenario?.active !== false;
  }

  setPositionScenarioSelected(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    selected: boolean
  ): void {
    if (!this.draftEvaluation || !scenarioKey) {
      return;
    }

    this.ensurePositionScenarioConfigs(this.draftEvaluation);
    const positionConfig = this.draftEvaluation.positionScenarios
      .find((item) => item.position === position);
    const scenario = positionConfig?.scenarios.find((item) => item.key === scenarioKey);

    if (!scenario) {
      return;
    }

    scenario.active = selected &&
      this.isPositionScenarioStructurallyApplicable(position, scenarioKey, this.draftEvaluation);
    this.syncGlobalScenariosFromPositionConfigs(this.draftEvaluation);
  }

  setPositionScenarioWeight(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    value: unknown
  ): void {
    if (!this.draftEvaluation || !scenarioKey) {
      return;
    }

    this.ensurePositionScenarioConfigs(this.draftEvaluation);
    const positionConfig = this.draftEvaluation.positionScenarios
      .find((item) => item.position === position);
    const scenario = positionConfig?.scenarios.find((item) => item.key === scenarioKey);

    if (!scenario) {
      return;
    }

    scenario.weight = Math.max(0, Math.min(100, Number(value) || 0));
    this.syncGlobalScenariosFromPositionConfigs(this.draftEvaluation);
  }

  getPositionScenarioWeightTotal(
    position: string,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): number {
    return this.getActivePositionScenarios(position, evaluation).reduce(
      (total, scenario) => total + (Number(scenario.weight) || 0),
      0
    );
  }

  getPositionScenarioWeight(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): number {
    if (!scenarioKey) {
      return 0;
    }

    const positionScenario = this.getPositionScenarioOptions(position, evaluation)
      .find((scenario) => scenario.key === scenarioKey);

    if (positionScenario) {
      return Number(positionScenario.weight) || 0;
    }

    const globalScenario = this.getEvaluationScenarioOptions(evaluation)
      .find((scenario) => scenario.key === scenarioKey);

    return Number(globalScenario?.weight) || 0;
  }

  getPositionQuestionCount(position: string): number {
    if (!this.draftEvaluation) {
      return 0;
    }

    return this.draftEvaluation.bigFactors.reduce(
      (total, bigFactor) =>
        total +
        this.getFactorsForPosition(bigFactor, position).reduce(
          (factorTotal, item) =>
            factorTotal + this.getQuestionsForPosition(item.factor, position).length,
          0
        ),
      0
    );
  }

  getPositionScenarioQuestionCount(
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): number {
    if (!this.draftEvaluation || !this.isPositionScenarioApplicable(position, scenarioKey)) {
      return 0;
    }

    return this.draftEvaluation.bigFactors.reduce(
      (total, bigFactor) =>
        total +
        this.getFactorsForPositionAndScenario(bigFactor, position, scenarioKey).reduce(
          (factorTotal, { factor }) =>
            factorTotal +
            this.getQuestionsForPositionAndScenario(factor, position, scenarioKey).length,
          0
        ),
      0
    );
  }

  isPositionScenarioApplicable(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): boolean {
    if (!scenarioKey) {
      return false;
    }

    return this.isPositionScenarioStructurallyApplicable(position, scenarioKey, evaluation) &&
      this.isPositionScenarioSelected(position, scenarioKey, evaluation);
  }

  isPositionScenarioStructurallyApplicable(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): boolean {
    if (!scenarioKey || !evaluation || this.isPositionEvaluatorOnly(position, evaluation)) {
      return false;
    }

    const population = this.getMatchedEmployees(evaluation);
    const positionEmployees = this.getPositionParticipants(position, population);

    if (scenarioKey === 'BOSS_TO_EMPLOYEE') {
      return positionEmployees.some((employee) =>
        this.getDirectManagers(employee, population).length > 0
      );
    }

    if (scenarioKey !== 'EMPLOYEE_TO_BOSS') {
      return true;
    }

    return positionEmployees.some((employee) =>
      this.getDirectReports(employee, population).length > 0
    );
  }

  isPositionAutomaticallyEvaluatorOnly(
    position: string,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): boolean {
    if (!evaluation || this.normalizeKey(evaluation.modelType) !== '90') {
      return false;
    }

    const population = this.getMatchedEmployees(evaluation);
    const positionEmployees = this.getPositionParticipants(position, population);

    return positionEmployees.length > 0 && !positionEmployees.some((employee) =>
      this.getDirectManagers(employee, population).length > 0
    );
  }

  isPositionEvaluatorOnly(
    position: string,
    evaluation: DesEvaluationCard | null = this.draftEvaluation
  ): boolean {
    return (evaluation?.participants.evaluatorOnlyPositions?.includes(position) ?? false) ||
      this.isPositionAutomaticallyEvaluatorOnly(position, evaluation);
  }

  setPositionEvaluatorOnly(
    position: string,
    evaluatorOnly: boolean,
    panel?: MatExpansionPanel
  ): void {
    if (!this.draftEvaluation) {
      return;
    }

    if (!evaluatorOnly && this.isPositionAutomaticallyEvaluatorOnly(position)) {
      return;
    }

    const evaluatorOnlyPositions = new Set(
      this.draftEvaluation.participants.evaluatorOnlyPositions ?? []
    );
    evaluatorOnly
      ? evaluatorOnlyPositions.add(position)
      : evaluatorOnlyPositions.delete(position);

    this.draftEvaluation.participants.evaluatorOnlyPositions =
      this.draftEvaluation.participants.positions.filter((item) =>
        evaluatorOnlyPositions.has(item)
      );
    this.ensurePositionScenarioConfigs(this.draftEvaluation);

    if (evaluatorOnly && panel) {
      panel.close();
    }
  }

  trackByPositionQuestion(
    _index: number,
    item: { question: DesEvaluationQuestion; index: number }
  ): number {
    return item.question.id;
  }

  trackByPositionFactor(
    _index: number,
    item: { factor: DesEvaluationFactor; index: number }
  ): number {
    return item.factor.id;
  }

  getScaleLabel(scaleId: number): string {
    const option = this.getScaleById(scaleId);
    if (!option) {
      return this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.UNDEFINED_SCALE');
    }

    return option.name ??
      this.translateKeyOrFallback(option.nameKey ?? '', String(option.code ?? option.id));
  }

  getScaleLevelLabel(level: ScaleOption['levels'][number]): string {
    return level.label ??
      this.translateKeyOrFallback(level.labelKey ?? '', String(level.value));
  }

  getQuestionTypeLabel(type: string): string {
    const option = this.questionTypes.find((item) => item.value === type);
    return option
      ? option.label ?? this.translateKeyOrFallback(option.labelKey ?? '', type)
      : type;
  }

  getFactorQuestionTypeSummary(
    factor: DesEvaluationFactor,
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined
  ): string {
    if (!scenarioKey) {
      return this.getQuestionTypeLabel(
        this.toFrontendItemTypeCode(factor.defaultQuestionType)
      );
    }

    const questionTypes = Array.from(new Set(
      this.getQuestionsForPositionAndScenario(factor, position, scenarioKey)
        .map(({ question }) => this.toFrontendItemTypeCode(question.type))
    ));
    const effectiveTypes = questionTypes.length > 0
      ? questionTypes
      : [this.toFrontendItemTypeCode(factor.defaultQuestionType)];

    return effectiveTypes.map((type) => this.getQuestionTypeLabel(type)).join(' · ');
  }

  onQuestionTypeChange(type: string): void {
    this.questionDraft.type = type;
    this.ensureQuestionLikertOptions();
    this.refreshQuestionOptionsSummary();
  }

  openQuestionValuesDialog(): void {
    if (
      this.questionDraft.type !== 'LIKERT_1_5' ||
      !this.questionValuesDialogTemplate
    ) {
      return;
    }

    this.selectedQuestionLikertPresetKey =
      this.matchQuestionLikertPreset(this.getQuestionDraftOptions()) ??
      this.questionLikertPresets[0].key;

    this.questionValuesDialogRef = this.dialog.open(this.questionValuesDialogTemplate, {
      width: '680px',
      maxWidth: '94vw',
      maxHeight: '86vh',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });

    this.questionValuesDialogRef.afterClosed().subscribe(() => {
      this.questionValuesDialogRef = null;
    });
  }

  applyQuestionLikertPreset(): void {
    const preset = this.questionLikertPresets.find(
      (item) => item.key === this.selectedQuestionLikertPresetKey
    );

    if (!preset) {
      return;
    }

    this.questionDraft.optionsText = preset.labels.join('\n');
    this.refreshQuestionOptionsSummary();
    this.questionValuesDialogRef?.close();
  }

  trackByPresetKey(_index: number, preset: DesEvaluationLikertPreset): string {
    return preset.key;
  }

  getQuestionScenarioLabel(key: DesEvaluationScenarioKey): string {
    return this.translateKeyOrFallback(
      `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCENARIOS.${key}`,
      key
    );
  }

  isQuestionScenarioSelected(key: DesEvaluationScenarioKey): boolean {
    return this.questionDraft.scenarioKeys.includes(key);
  }

  setQuestionScenarioSelected(key: DesEvaluationScenarioKey, selected: boolean): void {
    const selectedKeys = new Set(this.questionDraft.scenarioKeys);
    selected ? selectedKeys.add(key) : selectedKeys.delete(key);
    const validOrder = this.questionScenarioOptions.map((scenario) => scenario.key);

    this.questionDraft.scenarioKeys = validOrder.filter((scenarioKey) => selectedKeys.has(scenarioKey));
  }

  onQuestionPositionSearchChange(value: string): void {
    this.questionPositionSearchTerm = value;
    const search = this.normalizeSearchText(value);
    this.filteredQuestionPositions = search
      ? this.availablePositions.filter((position) => this.normalizeSearchText(position).includes(search))
      : this.availablePositions;
  }

  isQuestionPositionSelected(position: string): boolean {
    return this.questionDraft.positions.includes(position);
  }

  setQuestionPositionSelected(position: string, selected: boolean): void {
    const selectedPositions = new Set(this.questionDraft.positions);
    selected ? selectedPositions.add(position) : selectedPositions.delete(position);
    const orderedAvailablePositions = this.availablePositions.filter((item) => selectedPositions.delete(item));
    this.questionDraft.positions = [...orderedAvailablePositions, ...Array.from(selectedPositions)];
  }

  clearQuestionPositionSearch(): void {
    this.onQuestionPositionSearchChange('');
  }

  onQuestionPositionScopeChange(scope: DesEvaluationQuestionPositionScope): void {
    this.questionDraft.positionScope = scope;

    if (scope === 'ALL') {
      this.questionDraft.positions = [];
      this.questionPositionSearchTerm = '';
      this.filteredQuestionPositions = this.availablePositions;
    }
  }

  getQuestionScenarioSummary(question: DesEvaluationQuestion): string[] {
    return this.normalizeQuestionScenarioKeys(question, this.draftEvaluation?.modelType ?? '360')
      .map((key) => this.getQuestionScenarioLabel(key));
  }

  getQuestionPositionSummary(question: DesEvaluationQuestion): string {
    const positions = this.normalizeQuestionPositions(question);

    if (question.positionScope !== 'SELECTED' || positions.length === 0) {
      return this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.ALL_POSITIONS');
    }

    if (positions.length <= 2) {
      return positions.join(', ');
    }

    return this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.POSITIONS_SUMMARY', {
      positions: positions.slice(0, 2).join(', '),
      count: positions.length - 2,
    });
  }

  getQuestionLikertStatementType(question: DesEvaluationQuestion): string | null {
    if (question.type !== 'LIKERT_1_5') {
      return null;
    }

    const presetKey = this.matchQuestionLikertPreset(question.options ?? []);
    const preset = this.questionLikertPresets.find((item) => item.key === presetKey);
    const presetName = preset
      ? this.t(preset.title)
      : this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.LIKERT_PRESETS.CUSTOM');

    return this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.STATEMENT_TYPE_VALUE', {
      type: presetName,
    });
  }

  trackByScenarioKey(_index: number, scenario: { key: DesEvaluationScenarioKey }): DesEvaluationScenarioKey {
    return scenario.key;
  }

  getSurveyTypeLabel(type: string): string {
    return this.translateKeyOrFallback(
      `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SURVEY_TYPES.${this.normalizeKey(type)}`,
      type
    );
  }

  getModelStateLabel(state: string): string {
    return this.translateKeyOrFallback(
      `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MODEL_STATES.${this.normalizeKey(state)}`,
      state
    );
  }

  getPeriodStateLabel(state: string): string {
    return this.translateKeyOrFallback(
      `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.PERIOD_STATES.${this.normalizeKey(state)}`,
      state
    );
  }

  getModelCatalogName(option: ModelCatalogOption): string {
    return option.name ??
      this.translateKeyOrFallback(option.nameKey ?? '', option.type);
  }

  setPeriodStartDate(value: unknown): void {
    if (!this.draftEvaluation) {
      return;
    }

    const startDate = this.normalizeDateInput(value);
    this.draftEvaluation.period.startDate = startDate;

    if (
      startDate &&
      (
        !this.draftEvaluation.period.endDate ||
        this.draftEvaluation.period.endDate < startDate
      )
    ) {
      this.draftEvaluation.period.endDate = this.addDaysToInputDate(startDate, 15);
    }
  }

  setPeriodEndDate(value: unknown): void {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.period.endDate = this.normalizeDateInput(value);
  }

  getBigFactorQuestionCount(bigFactor: DesEvaluationBigFactor): number {
    return this.getDistinctFactorSummaries(bigFactor).reduce(
      (total, factor) => total + factor.questionCount,
      0
    );
  }

  getDistinctFactorSummaries(
    bigFactor: DesEvaluationBigFactor
  ): DesEvaluationFactorSummary[] {
    const summaries = new Map<
      string,
      { name: string; questionKeys: Set<string>; summaryQuestionCount: number }
    >();

    bigFactor.factors.forEach((factor) => {
      const factorKey = this.normalizeSearchText(factor.name) || `factor-${factor.id}`;
      const current = summaries.get(factorKey) ?? {
        name: factor.name,
        questionKeys: new Set<string>(),
        summaryQuestionCount: 0,
      };

      factor.questions.forEach((question) => {
        const questionKey =
          `${this.normalizeSearchText(question.label)}|${question.type}` ||
          `question-${question.id}`;
        current.questionKeys.add(questionKey);
      });
      current.summaryQuestionCount = Math.max(
        current.summaryQuestionCount,
        factor.summaryQuestionCount ?? 0
      );
      summaries.set(factorKey, current);
    });

    return Array.from(summaries.entries()).map(([key, summary]) => ({
      key,
      name: summary.name,
      questionCount: Math.max(summary.questionKeys.size, summary.summaryQuestionCount),
    }));
  }

  trackByFactorSummary(
    _index: number,
    factor: DesEvaluationFactorSummary
  ): string {
    return factor.key;
  }

  getFactorWeightTotal(
    bigFactor: DesEvaluationBigFactor,
    position?: string,
    scenarioKey?: DesEvaluationScenarioKey
  ): number {
    const factors = position && scenarioKey
      ? this.getFactorsForPositionAndScenario(bigFactor, position, scenarioKey)
        .map((item) => item.factor)
      : position
        ? this.getFactorsForPosition(bigFactor, position).map((item) => item.factor)
        : bigFactor.factors;

    return factors.reduce((total, factor) => total + (Number(factor.weight) || 0), 0);
  }

  isWeightTotalComplete(total: number): boolean {
    return Math.abs((Number(total) || 0) - 100) <= 0.01;
  }

  isPositionWeightIncomplete(position: string): boolean {
    const evaluation = this.draftEvaluation;
    if (!evaluation || this.isPositionEvaluatorOnly(position, evaluation)) {
      return false;
    }

    const activeScenarios = this.getActivePositionScenarios(position, evaluation);
    if (
      activeScenarios.length === 0 ||
      !this.isWeightTotalComplete(this.getPositionScenarioWeightTotal(position, evaluation))
    ) {
      return true;
    }

    if (
      evaluation.bigFactors.length > 0 &&
      !this.isWeightTotalComplete(this.getBigFactorWeightTotal(evaluation))
    ) {
      return true;
    }

    return activeScenarios.some((scenario) =>
      !!scenario.key && this.hasIncompleteFactorWeights(position, scenario.key, evaluation)
    );
  }

  isScenarioWeightIncomplete(
    position: string,
    scenarioKey: DesEvaluationScenarioKey | undefined
  ): boolean {
    const evaluation = this.draftEvaluation;
    if (
      !evaluation ||
      !scenarioKey ||
      !this.isPositionScenarioApplicable(position, scenarioKey, evaluation)
    ) {
      return false;
    }

    return !this.isWeightTotalComplete(
      this.getPositionScenarioWeightTotal(position, evaluation)
    ) || (
      evaluation.bigFactors.length > 0 &&
      !this.isWeightTotalComplete(this.getBigFactorWeightTotal(evaluation))
    ) || this.hasIncompleteFactorWeights(position, scenarioKey, evaluation);
  }

  private hasIncompleteFactorWeights(
    position: string,
    scenarioKey: DesEvaluationScenarioKey,
    evaluation: DesEvaluationCard
  ): boolean {
    return evaluation.bigFactors.some((bigFactor) => {
      const factors = this.getFactorsForPositionAndScenario(
        bigFactor,
        position,
        scenarioKey
      );

      return factors.length > 0 &&
        !this.isWeightTotalComplete(this.getFactorWeightTotal(
          bigFactor,
          position,
          scenarioKey
        ));
    });
  }

  private getSuggestedFactorWeight(
    bigFactorIndex: number,
    position: string | null,
    scenarioKey: DesEvaluationScenarioKey | null
  ): number {
    const bigFactor = this.draftEvaluation?.bigFactors[bigFactorIndex];
    if (!bigFactor) {
      return 100;
    }

    const currentTotal = this.getFactorWeightTotal(
      bigFactor,
      position ?? undefined,
      scenarioKey ?? undefined
    );
    return Math.min(100, Math.max(0, 100 - currentTotal));
  }

  getFactorRequiredRatingLevel(factor: DesEvaluationFactor): number {
    return this.normalizeRequiredRatingLevel(factor.requiredRatingLevel);
  }

  getBigFactorWeightTotal(evaluation: DesEvaluationCard | null): number {
    if (!evaluation) {
      return 0;
    }

    return evaluation.bigFactors.reduce((total, item) => total + (Number(item.weight) || 0), 0);
  }

  openParticipantPositionsDialog(): void {
    if (!this.draftEvaluation || !this.participantPositionsDialogTemplate) {
      return;
    }

    this.participantPositionSearchTerm = '';
    this.nestedDialogRef = this.dialog.open(this.participantPositionsDialogTemplate, {
      width: '820px',
      maxWidth: '94vw',
      maxHeight: '86vh',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });
  }

  getFilteredParticipantPositions(): string[] {
    const search = this.normalizeSearchText(this.participantPositionSearchTerm);

    if (!search) {
      return this.availablePositions;
    }

    return this.availablePositions.filter((position) => this.normalizeSearchText(position).includes(search));
  }

  getFilteredParticipantEmployees(): DesEvaluationEmployee[] {
    const search = this.normalizeSearchText(this.participantEmployeeSearchTerm);
    const candidateEmployees = this.getParticipantCandidateEmployees(this.draftEvaluation);

    if (!search) {
      return candidateEmployees;
    }

    return candidateEmployees.filter((employee) =>
      this.normalizeSearchText([
        employee.fullName,
        employee.cargo,
        employee.email,
        ...Object.values(employee.demographicValues),
      ].join(' ')).includes(search)
    );
  }

  isParticipantPositionSelected(position: string): boolean {
    return this.draftEvaluation?.participants.positions.includes(position) ?? false;
  }

  toggleParticipantPosition(position: string): void {
    this.setParticipantPositionSelected(position, !this.isParticipantPositionSelected(position));
  }

  setParticipantPositionSelected(position: string, selected: boolean): void {
    if (!this.draftEvaluation) {
      return;
    }

    const selectedPositions = new Set(this.draftEvaluation.participants.positions);
    selected ? selectedPositions.add(position) : selectedPositions.delete(position);

    this.draftEvaluation.participants.positions = this.availablePositions.filter((item) => selectedPositions.has(item));
    this.pruneEvaluatorOnlyPositions(this.draftEvaluation);
    this.selectParticipantEmployeesFromSelectedPositions();
  }

  selectAllFilteredParticipantPositions(): void {
    if (!this.draftEvaluation) {
      return;
    }

    const selectedPositions = new Set([
      ...this.draftEvaluation.participants.positions,
      ...this.getFilteredParticipantPositions(),
    ]);

    this.draftEvaluation.participants.positions = this.availablePositions.filter((item) => selectedPositions.has(item));
    this.pruneEvaluatorOnlyPositions(this.draftEvaluation);
    this.selectParticipantEmployeesFromSelectedPositions();
  }

  clearParticipantPositions(): void {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.participants.positions = [];
    this.draftEvaluation.participants.evaluatorOnlyPositions = [];
    this.draftEvaluation.positionScenarios = [];
    this.selectParticipantEmployeesFromSelectedPositions();
  }

  removeParticipantPosition(position: string): void {
    this.setParticipantPositionSelected(position, false);
  }

  isParticipantEmployeeSelected(employeeId: number): boolean {
    return this.draftEvaluation?.participants.employeeIds.includes(employeeId) ?? false;
  }

  toggleParticipantEmployee(employee: DesEvaluationEmployee): void {
    this.setParticipantEmployeeSelected(employee.id, !this.isParticipantEmployeeSelected(employee.id));
  }

  setParticipantEmployeeSelected(employeeId: number, selected: boolean): void {
    if (!this.draftEvaluation) {
      return;
    }

    const selectedEmployeeIds = new Set(this.draftEvaluation.participants.employeeIds);
    selected ? selectedEmployeeIds.add(employeeId) : selectedEmployeeIds.delete(employeeId);

    this.draftEvaluation.participants.employeeIds = this.orderParticipantEmployeeIds(selectedEmployeeIds);
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
  }

  selectAllFilteredParticipantEmployees(): void {
    if (!this.draftEvaluation) {
      return;
    }

    const selectedEmployeeIds = new Set([
      ...this.draftEvaluation.participants.employeeIds,
      ...this.getFilteredParticipantEmployees().map((employee) => employee.id),
    ]);

    this.draftEvaluation.participants.employeeIds = this.orderParticipantEmployeeIds(selectedEmployeeIds);
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
  }

  clearParticipantEmployees(): void {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.participants.employeeIds = [];
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
  }

  syncParticipantEmployeeSelectionWithCriteria(): void {
    if (!this.draftEvaluation || this.draftEvaluation.participants.employeeIds.length === 0) {
      return;
    }

    const candidateIds = new Set(this.getParticipantCandidateEmployees(this.draftEvaluation).map((employee) => employee.id));
    this.draftEvaluation.participants.employeeIds = this.orderParticipantEmployeeIds(
      this.draftEvaluation.participants.employeeIds.filter((employeeId) => candidateIds.has(employeeId))
    );
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
  }

  private selectParticipantEmployeesFromSelectedPositions(): void {
    if (!this.draftEvaluation) {
      return;
    }

    if (this.draftEvaluation.participants.positions.length === 0) {
      this.draftEvaluation.participants.employeeIds = [];
      return;
    }

    this.draftEvaluation.participants.employeeIds = this.getParticipantCandidateEmployees(this.draftEvaluation)
      .map((employee) => employee.id);
    this.ensurePositionScenarioConfigs(this.draftEvaluation);
  }

  trackByPosition(_index: number, position: string): string {
    return position;
  }

  getMatchedEmployeesPreview(evaluation: DesEvaluationCard | null): DesEvaluationEmployee[] {
    return this.getMatchedEmployees(evaluation).slice(0, 6);
  }

  getSendSummaryTotal(): number {
    return this.sendAssignments.length;
  }

  getSendSummaryAssigned(): number {
    return this.sendAssignments.reduce((total, item) => total + item.evaluateeIds.length, 0);
  }

  isDemoPerformanceResendBlocked(assignment: DesEvaluationSendAssignment): boolean {
    if (!this.demoLimitsService.isDemoModeActive()) {
      return false;
    }

    const sentStatuses: DesEvaluationSendStatus[] = [
      'ENVIADO',
      'INICIADO',
      'RESPONDIDO',
      'COMPLETADO',
    ];

    return sentStatuses.includes(assignment.sendStatus) ||
      assignment.surveySends.some((record) => sentStatuses.includes(record.status));
  }

  get selectedModelDiagramNodeData(): DesEvaluationDiagramNodeData | null {
    const data = this.selectedModelDiagramNode?.data;
    return data && typeof data === 'object'
      ? data as DesEvaluationDiagramNodeData
      : null;
  }

  selectModelDiagramNode(node: Node): void {
    this.selectedModelDiagramNode = node;
  }

  getModelDiagramNodeClass(node: Node): string[] {
    const data = node.data as DesEvaluationDiagramNodeData | undefined;
    return [
      this.selectedModelDiagramNode?.id === node.id ? 'selected' : '',
      data?.isEvaluator ? 'is-evaluator' : '',
      data?.isEvaluatee ? 'is-evaluatee' : '',
      data?.hasSelfEvaluation ? 'has-self-evaluation' : '',
    ].filter(Boolean);
  }

  getModelDiagramLinkClass(link: Edge): string[] {
    const data = link.data as DesEvaluationDiagramRelationData | undefined;
    return [
      'model-diagram-edge',
      data?.bidirectional ? 'is-bidirectional' : 'is-directional',
    ];
  }

  getModelDiagramScenarioLabels(
    keys: DesEvaluationScenarioKey[] | undefined,
  ): string {
    const scenarioKeys = keys ?? [];
    if (scenarioKeys.length === 0) {
      return '-';
    }

    return scenarioKeys
      .map((key) => this.getQuestionScenarioLabel(key))
      .join(' · ');
  }

  private syncModelDiagramViewport(): void {
    const nextView: [number, number] = [
      this.getModelDiagramViewportWidth(),
      this.getModelDiagramViewportHeight(),
    ];

    if (
      this.modelDiagramView[0] === nextView[0] &&
      this.modelDiagramView[1] === nextView[1]
    ) {
      return;
    }

    this.modelDiagramView = nextView;
  }

  private getModelDiagramViewportWidth(): number {
    if (typeof window === 'undefined') {
      return 1240;
    }

    const viewportWidth = Math.floor(window.innerWidth);
    const reservedWidth = viewportWidth > 992 ? 410 : 70;
    const minimumWidth = viewportWidth > 992 ? 1240 : 960;

    return Math.max(minimumWidth, viewportWidth - reservedWidth);
  }

  private getModelDiagramViewportHeight(): number {
    if (typeof window === 'undefined') {
      return 620;
    }

    const viewportHeight = Math.floor(window.innerHeight);
    return Math.max(520, viewportHeight - 312);
  }

  trackByDiagramRelation(
    _index: number,
    item: DesEvaluationDiagramRelationData
  ): string {
    return item.id;
  }

  getSendAssignmentEvaluateeOptions(assignment: DesEvaluationSendAssignment): DesEvaluationEmployee[] {
    const matchedEmployees = this.getHierarchyEvaluateesForEvaluator(this.sendPreviewEvaluation, assignment.evaluator);
    const selectedIds = new Set(assignment.evaluateeIds);
    const options = new Map<number, DesEvaluationEmployee>();

    matchedEmployees.forEach((employee) => options.set(employee.id, employee));
    selectedIds.forEach((employeeId) => {
      const employee = this.employees.find((item) => item.id === employeeId);

      if (employee) {
        options.set(employee.id, employee);
      }
    });

    return Array.from(options.values());
  }

  getSendEmployeeName(employeeId: number): string {
    return this.employees.find((employee) => employee.id === employeeId)?.fullName ?? `#${employeeId}`;
  }

  getSendEvaluateeOptionLabel(
    assignment: DesEvaluationSendAssignment,
    evaluatee: DesEvaluationEmployee
  ): string {
    if (!this.sendPreviewEvaluation) {
      return evaluatee.fullName;
    }

    const scenario = this.getEvaluationScenarioForPair(
      this.sendPreviewEvaluation,
      assignment.evaluator,
      evaluatee
    );
    const scenarioLabel = this.getQuestionScenarioLabel(scenario).toUpperCase();

    return `${evaluatee.fullName} (${scenarioLabel})`;
  }

  getSendTypeLabel(type: DesEvaluationSendType): string {
    return this.translateKeyOrFallback(`DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SEND_TYPES.${type}`, type);
  }

  getSendStatusLabel(status: DesEvaluationSendStatus): string {
    return this.translateKeyOrFallback(`DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SEND_STATUSES.${status}`, status);
  }

  getSendStatusClass(status: DesEvaluationSendStatus): string {
    if (status === 'ENVIADO' || status === 'RESPONDIDO' || status === 'COMPLETADO') {
      return 'send-status-ok';
    }
    if (status === 'INICIADO') return 'send-status-warn';
    if (status === 'ERROR') return 'send-status-error';
    if (status === 'PENDIENTE') return 'send-status-warn';
    return 'send-status-draft';
  }

  getSendResponseStatus(
    assignment: DesEvaluationSendAssignment
  ): DesEvaluationSendStatus | null {
    const progress = this.getSendResponseProgress(assignment);

    if (progress.total === 0 || progress.started === 0) {
      return null;
    }

    return progress.answered >= progress.total ? 'COMPLETADO' : 'INICIADO';
  }

  getSendResponseProgress(
    assignment: DesEvaluationSendAssignment
  ): DesEvaluationSendProgress {
    const recordsByEvaluatee = new Map(
      assignment.surveySends.map((record) => [record.evaluateeId, record])
    );
    const selectedRecords = assignment.evaluateeIds
      .map((evaluateeId) => recordsByEvaluatee.get(evaluateeId))
      .filter((record): record is DesEvaluationSurveySendRecord => !!record);
    const total = assignment.evaluateeIds.length;
    const answered = selectedRecords.filter((record) =>
      this.isAnsweredSurveySend(record)
    ).length;
    const started = selectedRecords.filter((record) =>
      this.isStartedSurveySend(record)
    ).length;

    return {
      total,
      started,
      answered,
      percent: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }

  async markSendAssignmentsCreated(): Promise<void> {
    const evaluation = this.sendPreviewEvaluation;
    if (!evaluation || this.isCreatingSendAssignments) {
      return;
    }

    this.isCreatingSendAssignments = true;
    let created = 0;
    let existing = 0;
    let failed = 0;

    try {
      for (const assignment of this.sendAssignments) {
        assignment.isCreating = true;

        try {
          const result = await this.createMissingSurveySends(assignment, evaluation.id);
          created += result.created;
          existing += result.existing;
        } catch (error) {
          failed += 1;
          console.error(
            `Error al crear los envíos del empleado ${assignment.evaluator.id}:`,
            error
          );
        } finally {
          assignment.isCreating = false;
        }
      }

      const titleKey = failed > 0
        ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_PARTIAL_TITLE'
        : 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_SUCCESS_TITLE';
      const textKey = failed > 0
        ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_PARTIAL_TEXT'
        : 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_SUCCESS_TEXT';

      await Swal.fire(
        this.t(titleKey),
        this.t(textKey, { created, existing, failed }),
        failed > 0 ? 'warning' : 'success'
      );
    } finally {
      this.isCreatingSendAssignments = false;
    }
  }

  async createSurveySendsForAssignment(
    assignment: DesEvaluationSendAssignment
  ): Promise<void> {
    const evaluation = this.sendPreviewEvaluation;
    if (!evaluation || assignment.isCreating || this.isCreatingSendAssignments) {
      return;
    }

    assignment.isCreating = true;

    try {
      const result = await this.createMissingSurveySends(assignment, evaluation.id);
      const messageKey = result.created > 0
        ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_SUCCESS_TEXT'
        : 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_ALREADY_EXISTS_TEXT';

      await Swal.fire(
        this.t(
          result.created > 0
            ? 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_SUCCESS_TITLE'
            : 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_ALREADY_EXISTS_TITLE'
        ),
        this.t(messageKey, {
          created: result.created,
          existing: result.existing,
          failed: 0,
        }),
        'success'
      );
    } catch (error) {
      console.error(
        `Error al crear los envíos del empleado ${assignment.evaluator.id}:`,
        error
      );
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_CREATE_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      assignment.isCreating = false;
    }
  }

  async previewPerformanceEmail(
    assignment: DesEvaluationSendAssignment
  ): Promise<void> {
    const evaluation = this.sendPreviewEvaluation;
    const organizationId = this.selectedOrganizationId ?? evaluation?.organizationId;

    if (
      !evaluation ||
      !organizationId ||
      !this.performanceEmailPreviewDialogTemplate
    ) {
      return;
    }

    try {
      await this.refreshAssignmentSendState(assignment, evaluation.id, true);
    } catch (error) {
      console.error(
        `No se pudieron refrescar los envíos del empleado ${assignment.evaluator.id}:`,
        error
      );
    }

    const payload = this.buildPerformanceEmailPayload(
      evaluation,
      assignment,
      organizationId
    );
    this.performanceEmailHtml = this.sanitizer.bypassSecurityTrustHtml(
      String(payload['mensajeHtml'] ?? '')
    );

    const dialogRef = this.dialog.open(this.performanceEmailPreviewDialogTemplate, {
      width: '920px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'des-evaluaciones-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.performanceEmailHtml = null;
    });
  }

  async sendPerformanceEmail(
    assignment: DesEvaluationSendAssignment
  ): Promise<void> {
    const evaluation = this.sendPreviewEvaluation;
    const organizationId = this.selectedOrganizationId ?? evaluation?.organizationId;

    if (!evaluation || !organizationId || assignment.isSending) {
      return;
    }

    if (this.isDemoPerformanceResendBlocked(assignment)) {
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_RESEND_BLOCKED_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_RESEND_BLOCKED_TEXT'),
        'info'
      );
      return;
    }

    if (!assignment.evaluator.email) {
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_MISSING_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_MISSING_TEXT'),
        'warning'
      );
      return;
    }

    assignment.isSending = true;

    try {
      await this.refreshAssignmentSendState(assignment, evaluation.id, true);
      if (this.isDemoPerformanceResendBlocked(assignment)) {
        await Swal.fire(
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_RESEND_BLOCKED_TITLE'),
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_RESEND_BLOCKED_TEXT'),
          'info'
        );
        return;
      }

      const payload = this.buildPerformanceEmailPayload(
        evaluation,
        assignment,
        organizationId
      );
      const response = await this.organizacionService.sendDesempenoEmail(payload);
      const responsePayload = response?.data ?? response;

      if (responsePayload?.ok === false) {
        throw responsePayload;
      }

      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_SUCCESS_TITLE'),
        String(
          responsePayload?.message ??
          responsePayload?.mensaje ??
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_SUCCESS_TEXT')
        ),
        'success'
      );

      try {
        await this.refreshAssignmentSendState(assignment, evaluation.id, true);
      } catch (error) {
        console.error('El correo se envió, pero no fue posible refrescar su estado:', error);
      }
    } catch (error) {
      console.error(
        `Error al enviar el correo de desempeño al empleado ${assignment.evaluator.id}:`,
        error
      );
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.SEND_EMAIL_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      assignment.isSending = false;
    }
  }

  getStatusClass(status: string): string {
    const normalized = this.normalizeKey(status);
    if (normalized.includes('PUBLICADA') || normalized.includes('EN_CURSO')) {
      return 'status-ok';
    }
    if (normalized.includes('CERRADA')) {
      return 'status-warn';
    }
    return 'status-draft';
  }

  getDemographicValues(fieldName: string): string[] {
    return this.demographicValueOptions[fieldName] ?? [];
  }

  onParticipantOnlyActiveChange(onlyActive: boolean): void {
    if (!this.draftEvaluation) {
      return;
    }

    this.draftEvaluation.participants.onlyActive = onlyActive;
    this.selectParticipantEmployeesFromSelectedPositions();
  }

  getDraftPreviewJson(): string {
    return JSON.stringify(
      this.draftEvaluation ? this.buildModelPayload(this.draftEvaluation) : {},
      null,
      2
    );
  }

  getSendPreviewJson(): string {
    return JSON.stringify(this.buildSendPreviewJson(this.sendPreviewEvaluation), null, 2);
  }

  trackByAnyId(index: number, item: any): number {
    return Number(item?.id ?? item?.Id ?? index);
  }

  private openEditorDialog(): void {
    if (!this.editorDialogTemplate) {
      return;
    }

    try {
      this.editorDialogRef?.close();
      this.editorDialogRef = this.dialog.open(this.editorDialogTemplate, {
        width: '96vw',
        maxWidth: '1280px',
        maxHeight: '92vh',
        autoFocus: false,
        disableClose: false,
        panelClass: 'des-evaluaciones-dialog-panel',
      });

      this.editorDialogRef.afterClosed().subscribe(() => {
        this.editorDialogRef = null;
        this.editingEvaluation = null;
        this.draftEvaluation = null;
        this.activeEditorTabIndex = 0;
      });
    } catch (error) {
      console.error('Error al abrir el dialog de evaluación:', error);
      this.dialog.closeAll();
      this.editorDialogRef = null;
      this.editingEvaluation = null;
      this.draftEvaluation = null;
      this.activeEditorTabIndex = 0;
      void Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODEL_ERROR_TEXT'),
        'error'
      );
    }
  }

  private async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.organizations = this.extractCollection(response)
        .map((item) => this.normalizeOrganization(item))
        .filter((item) => item.Id > 0);

      if (this.organizations.length > 0 && !this.selectedOrganizationId) {
        await this.onOrganizationChange(this.organizations[0].Id);
      }
    } catch (error) {
      console.error('Error al cargar organizaciones de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_ORGS_ERROR_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_ORGS_ERROR_TEXT'),
        'error'
      );
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  private async loadEmployees(organizationId: number): Promise<void> {
    this.isLoadingEmployees = true;

    try {
      const response = await this.organizacionService.getDesempenoEmployees({
        idOrganizacion: organizationId,
        activo: true,
      });

      this.employees = this.extractCollection(response)
        .map((item) => this.normalizeEmployee(item))
        .filter((item) => item.id > 0);

      this.positionOptions = this.mergePositionOptions(
        this.positionOptions,
        this.getEmployeePositionOptions(organizationId)
      );
      this.rebuildAvailablePositions();
      this.rebuildDemographicValueOptions();
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      this.employees = [];
      this.rebuildAvailablePositions();
      this.rebuildDemographicValueOptions();
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_EMPLOYEES_ERROR_TITLE'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_EMPLOYEES_ERROR_TEXT'),
        'error'
      );
    } finally {
      this.isLoadingEmployees = false;
    }
  }

  private async loadDemographicFields(organizationId: number): Promise<void> {
    this.isLoadingDemographics = true;

    try {
      const response = await this.organizacionService.getDesempenoCamposDemograficos({
        idOrganizacion: organizationId,
        activo: true,
      });

      const fields = this.extractCollection(response)
        .map((item) => this.normalizeDemographicField(item))
        .filter((item) => item.id > 0);

      this.demographicFields = fields.length > 0 ? fields : this.buildDemographicFieldsFromEmployees();
      this.rebuildDemographicValueOptions();
    } catch (error) {
      console.error('Error al cargar campos demográficos:', error);
      this.demographicFields = this.buildDemographicFieldsFromEmployees();
      this.rebuildDemographicValueOptions();
    } finally {
      this.isLoadingDemographics = false;
    }
  }

  private async loadCatalogs(organizationId: number): Promise<void> {
    this.isLoadingCatalogs = true;

    try {
      const response = await this.organizacionService.getDesempenoCatalogs({
        idOrganizacion: organizationId,
        soloActivos: true,
        incluirPuestos: true,
        incluirValoresEscala: true,
      });
      const catalogs = this.extractPayload(response) ?? {};

      this.modelTypeOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'tiposModelo')
      );
      this.modelStateOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'estadosModelo')
      );
      this.evaluationStateOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'estadosEvaluacion')
      );
      this.itemTypeOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'tiposItem')
      );
      this.scenarioCatalogOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'escenarios')
      );
      this.calculationMethodOptions = this.normalizeCatalogOptions(
        this.getPayloadProperty(catalogs, 'metodosCalculo')
      );
      this.positionOptions = this.mergePositionOptions(
        this.normalizePositionOptions(
          this.getPayloadProperty(catalogs, 'puestos'),
          organizationId
        ),
        this.getEmployeePositionOptions(organizationId)
      );

      const apiScales = this.normalizeScaleOptions(
        this.getPayloadProperty(catalogs, 'escalas')
      );
      if (apiScales.length > 0) {
        this.scaleOptions = apiScales;
      }

      if (this.modelTypeOptions.length > 0) {
        this.surveyTypes = this.modelTypeOptions.map((item) => item.code);
      }

      if (this.modelStateOptions.length > 0) {
        this.modelStates = this.modelStateOptions.map((item) => item.code);
      }

      if (this.itemTypeOptions.length > 0) {
        this.questionTypes = this.itemTypeOptions.map((item) => ({
          value: this.toFrontendItemTypeCode(item.code),
          label: item.name,
        }));
      }

      await this.refreshPositionOptions(organizationId);
    } catch (error) {
      console.error('Error al cargar catálogos de desempeño:', error);
      await Swal.fire(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_CATALOGS_ERROR_TITLE'),
        this.getApiErrorMessage(
          error,
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_CATALOGS_ERROR_TEXT')
        ),
        'error'
      );
    } finally {
      this.isLoadingCatalogs = false;
    }
  }

  private async loadModels(organizationId: number, showError = true): Promise<void> {
    const loadSequence = ++this.modelLoadSequence;
    this.isLoadingModels = true;

    try {
      const response = await this.organizacionService.getDesempenoModels(organizationId, {
        pagina: 1,
        limite: 100,
      });

      if (
        loadSequence !== this.modelLoadSequence ||
        this.selectedOrganizationId !== organizationId
      ) {
        return;
      }

      this.evaluations = this.extractCollection(response)
        .map((item) => this.normalizeModelSummary(item))
        .filter((item) => item.id > 0 && item.organizationId === organizationId)
        .sort((left, right) => right.id - left.id);
    } catch (error) {
      console.error('Error al cargar modelos de desempeño:', error);

      if (
        loadSequence !== this.modelLoadSequence ||
        this.selectedOrganizationId !== organizationId
      ) {
        return;
      }

      this.evaluations = [];

      if (showError) {
        await Swal.fire(
          this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODELS_ERROR_TITLE'),
          this.getApiErrorMessage(
            error,
            this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.LOAD_MODELS_ERROR_TEXT')
          ),
          'error'
        );
      }
    } finally {
      if (loadSequence === this.modelLoadSequence) {
        this.isLoadingModels = false;
      }
    }
  }

  private async loadScenariosForType(
    type: string,
    currentScenarios: DesEvaluationScenario[] = []
  ): Promise<DesEvaluationScenario[]> {
    try {
      const response = await this.organizacionService.getDesempenoModelTypeScenarios(type);
      const rows = this.extractCollection(response);
      const currentByKey = new Map(
        currentScenarios
          .filter((scenario) => !!scenario.key)
          .map((scenario) => [scenario.key as DesEvaluationScenarioKey, scenario])
      );
      const apiKeys = rows
        .map((row) => this.toScenarioKey(row?.codigo ?? row?.Codigo))
        .filter((key): key is DesEvaluationScenarioKey => !!key);
      const canPreserveCurrent =
        currentScenarios.length === apiKeys.length &&
        apiKeys.every((key) => currentByKey.has(key));

      if (rows.length === 0) {
        return this.buildScenariosForType(type, currentScenarios);
      }

      return rows
        .map<DesEvaluationScenario | null>((row) => {
          const key = this.toScenarioKey(row?.codigo ?? row?.Codigo);
          if (!key) {
            return null;
          }

          const current = canPreserveCurrent ? currentByKey.get(key) : null;
          const catalog = this.scenarioCatalogOptions.find((item) => item.code === key);
          const scenarioId = Number(row?.id ?? row?.Id ?? catalog?.id ?? 0);

          return {
            id: scenarioId || this.generateId(),
            backendId: current?.backendId,
            key,
            name: String(row?.nombre ?? row?.Nombre ?? catalog?.name ?? this.getQuestionScenarioLabel(key)),
            weight: Number(
              current?.weight ??
              row?.ponderacionPredeterminada ??
              row?.PonderacionPredeterminada ??
              0
            ),
            active: current?.active ??
              this.normalizeBoolean(
                row?.activoPredeterminado ?? row?.ActivoPredeterminado ?? true
              ),
          } satisfies DesEvaluationScenario;
        })
        .filter((item): item is DesEvaluationScenario => !!item);
    } catch (error) {
      console.error(`Error al cargar escenarios para el modelo ${type}:`, error);
      return this.buildScenariosForType(type, currentScenarios);
    }
  }

  private normalizeCatalogOptions(value: any): DesEvaluationCatalogOption[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => ({
        ...item,
        id: Number(item?.id ?? item?.Id ?? 0),
        code: String(item?.codigo ?? item?.Codigo ?? '').trim().toUpperCase(),
        name: String(item?.nombre ?? item?.Nombre ?? '').trim(),
        active: item?.activo === undefined && item?.Activo === undefined
          ? true
          : this.normalizeBoolean(item?.activo ?? item?.Activo),
        order: Number(item?.orden ?? item?.Orden ?? 0),
      }))
      .filter((item) => item.id > 0 && !!item.code)
      .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name));
  }

  private normalizePositionOptions(
    value: any,
    organizationId: number
  ): DesEvaluationPositionOption[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => ({
        id: Number(item?.id ?? item?.Id ?? item?.puestoId ?? item?.IdPuesto ?? 0),
        organizationId: Number(
          item?.organizacionId ?? item?.IdOrganizacion ?? organizationId
        ),
        code: this.toOptionalText(item?.codigo ?? item?.Codigo),
        name: String(item?.nombre ?? item?.Nombre ?? item?.puesto ?? item?.Puesto ?? '').trim(),
        active: item?.activo === undefined && item?.Activo === undefined
          ? true
          : this.normalizeBoolean(item?.activo ?? item?.Activo),
        totalEmployees: Number(item?.totalEmpleados ?? item?.TotalEmpleados ?? 0),
      }))
      .filter((item) => item.id > 0 && !!item.name)
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  private async refreshPositionOptions(organizationId: number): Promise<void> {
    try {
      const response = await this.organizacionService.getDesempenoPositions({
        idOrganizacion: organizationId,
        soloActivos: true,
      });
      const endpointPositions = this.normalizePositionOptions(
        this.extractCollection(response),
        organizationId
      );

      this.positionOptions = this.mergePositionOptions(
        this.positionOptions,
        endpointPositions,
        this.getEmployeePositionOptions(organizationId)
      );
      this.rebuildAvailablePositions();
    } catch (error) {
      console.warn('No se pudo refrescar el catálogo de puestos de desempeño:', error);
      this.positionOptions = this.mergePositionOptions(
        this.positionOptions,
        this.getEmployeePositionOptions(organizationId)
      );
      this.rebuildAvailablePositions();
    }
  }

  private mergePositionOptions(
    ...collections: DesEvaluationPositionOption[][]
  ): DesEvaluationPositionOption[] {
    const positionsByName = new Map<string, DesEvaluationPositionOption>();

    collections.flat().forEach((position) => {
      const key = this.normalizeSearchText(position.name);
      if (!key || position.id <= 0) {
        return;
      }

      const current = positionsByName.get(key);
      positionsByName.set(key, current
        ? {
            ...current,
            ...position,
            code: position.code ?? current.code,
            totalEmployees: Math.max(current.totalEmployees, position.totalEmployees),
          }
        : position);
    });

    return Array.from(positionsByName.values())
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  private getEmployeePositionOptions(
    organizationId: number
  ): DesEvaluationPositionOption[] {
    return this.employees
      .filter((employee) => employee.positionId && employee.cargo)
      .map((employee) => ({
        id: employee.positionId as number,
        organizationId: employee.organizationId ?? organizationId,
        code: null,
        name: employee.cargo as string,
        active: employee.activo,
        totalEmployees: 1,
      }));
  }

  private normalizeScaleOptions(value: any): ScaleOption[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => {
        const levelsSource = item?.valores ?? item?.Valores ?? item?.levels ?? [];
        const levels = Array.isArray(levelsSource)
          ? levelsSource
              .map((level: any) => ({
                id: Number(level?.id ?? level?.Id ?? level?.idEscalaValor ?? level?.IdEscalaValor ?? 0) || undefined,
                value: Number(level?.valor ?? level?.Valor ?? level?.value ?? 0),
                label: String(level?.etiqueta ?? level?.Etiqueta ?? level?.label ?? '').trim(),
                order: Number(level?.orden ?? level?.Orden ?? 0),
              }))
              .sort((left: any, right: any) => left.order - right.order || left.value - right.value)
              .map(({ order: _order, ...level }: any) => level)
          : [];

        return {
          id: Number(item?.id ?? item?.Id ?? item?.idEscala ?? item?.IdEscala ?? 0),
          code: String(item?.codigo ?? item?.Codigo ?? '').trim().toUpperCase(),
          name: String(item?.nombre ?? item?.Nombre ?? '').trim(),
          type: String(item?.tipo ?? item?.Tipo ?? 'GENERAL').trim().toUpperCase(),
          levels,
        } satisfies ScaleOption;
      })
      .filter((item) => item.id > 0)
      .sort((left, right) => {
        const leftDefault = left.code === 'CUMPLIMIENTO_1_5' ? 0 : 1;
        const rightDefault = right.code === 'CUMPLIMIENTO_1_5' ? 0 : 1;
        return leftDefault - rightDefault || String(left.name).localeCompare(String(right.name));
      });
  }

  private extractCollection(response: any): any[] {
    const payload = this.extractPayload(response);

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.rows)) return payload.rows;
    if (Array.isArray(payload?.result)) return payload.result;
    if (Array.isArray(payload?.envios)) return payload.envios;
    return [];
  }

  private extractPayload(response: any): any {
    let payload = response?.data ?? response;

    if (
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      Object.prototype.hasOwnProperty.call(payload, 'data')
    ) {
      payload = payload.data;
    }

    const jsonPayload = payload?.DataJson ?? payload?.dataJson;
    if (typeof jsonPayload === 'string') {
      try {
        return JSON.parse(jsonPayload);
      } catch {
        return payload;
      }
    }

    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload);
      } catch {
        return payload;
      }
    }

    return payload;
  }

  private getPayloadProperty(source: any, propertyName: string): any {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
      return undefined;
    }

    const expected = propertyName.toLocaleLowerCase();
    const key = Object.keys(source).find(
      (candidate) => candidate.toLocaleLowerCase() === expected
    );

    return key ? source[key] : undefined;
  }

  private normalizeArrayValue(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim()) {
      try {
        return this.normalizeArrayValue(JSON.parse(value));
      } catch {
        return [];
      }
    }

    if (Array.isArray(value?.data)) {
      return value.data;
    }

    if (Array.isArray(value?.items)) {
      return value.items;
    }

    return [];
  }

  private normalizeOrganization(item: any): DesEvaluationOrganization {
    return {
      Id: Number(item?.Id ?? item?.id ?? item?.IdOrganizacion ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private normalizeEmployee(item: any): DesEvaluationEmployee {
    const names = String(item?.Nombres ?? item?.nombres ?? '').trim();
    const lastNames = String(item?.Apellidos ?? item?.apellidos ?? '').trim();
    const managerIds = this.normalizeEmployeeManagerIds(item);

    return {
      id: Number(item?.IdEmpleado ?? item?.idEmpleado ?? item?.Id ?? item?.id ?? 0),
      organizationId: this.toPositiveInteger(item?.IdOrganizacion ?? item?.idOrganizacion),
      positionId: this.toPositiveInteger(
        item?.IdPuesto ?? item?.idPuesto ?? item?.PuestoId ?? item?.puestoId
      ),
      managerId: managerIds[0] ?? null,
      managerIds,
      fullName: `${names} ${lastNames}`.trim(),
      cargo: this.toOptionalText(item?.Cargo ?? item?.cargo ?? item?.Puesto ?? item?.puesto ?? item?.Posicion ?? item?.posicion),
      email: this.toOptionalText(item?.Email ?? item?.email),
      phone: this.toOptionalText(
        item?.Celular ?? item?.celular ?? item?.Telefono ?? item?.telefono
      ),
      preferredSendType: this.normalizeEmployeeSendType(
        item?.TipoEnvioEncuesta ??
        item?.tipoEnvioEncuesta ??
        item?.TIPO_ENVIO_ENCUESTA ??
        item?.SendSurveyType ??
        item?.sendSurveyType
      ),
      activo: this.normalizeBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado),
      demographicValues: this.extractEmployeeDemographicValues(item),
    };
  }

  private normalizeEmployeeSendType(value: unknown): DesEvaluationSendType | null {
    const numericValue = Number(value);
    if (numericValue === 0 && value !== null && value !== undefined && value !== '') {
      return 'NINGUNO';
    }
    if (numericValue === 1) return 'CORREO';
    if (numericValue === 2) return 'WHATSAPP';
    if (numericValue === 3) return 'AMBOS';

    const normalizedValue = this.normalizeKey(String(value ?? ''));
    if (['NINGUNO', 'NOTHING', 'NONE'].includes(normalizedValue)) return 'NINGUNO';
    if (['CORREO', 'EMAIL'].includes(normalizedValue)) return 'CORREO';
    if (normalizedValue === 'WHATSAPP') return 'WHATSAPP';
    if (
      [
        'AMBOS',
        'CORREO_Y_WHATSAPP',
        'CORREO_WHATSAPP',
        'EMAIL_AND_WHATSAPP',
        'EMAIL_WHATSAPP',
      ].includes(normalizedValue)
    ) {
      return 'AMBOS';
    }

    return null;
  }

  private normalizeEmployeeManagerIds(item: any): number[] {
    const directManagerCandidates = [
      item?.IdEmpleadoJefe,
      item?.idEmpleadoJefe,
      item?.IdJefe,
      item?.idJefe,
      item?.IdJefeEmpleado,
      item?.idJefeEmpleado,
    ];
    const hierarchyManagerCandidates = [
      item?.IdEmpleadosJefe,
      item?.idEmpleadosJefe,
      item?.IdsEmpleadosJefe,
      item?.idsEmpleadosJefe,
      item?.IdsEmpleadoJefe,
      item?.idsEmpleadoJefe,
      item?.EmpleadosJefe,
      item?.empleadosJefe,
      item?.Jefes,
      item?.jefes,
    ];

    for (const candidate of directManagerCandidates) {
      const ids = this.toPositiveIntegerList(candidate);

      if (ids.length > 0) {
        return ids;
      }
    }

    for (const candidate of hierarchyManagerCandidates) {
      const ids = this.toPositiveIntegerList(candidate);

      if (ids.length > 0) {
        return ids;
      }
    }

    return [];
  }

  private extractEmployeeDemographicValues(item: any): Record<string, string> {
    const result: Record<string, string> = {};
    const rawCollection = Array.isArray(item?.camposDemograficos)
      ? item.camposDemograficos
      : Array.isArray(item?.CamposDemograficos)
        ? item.CamposDemograficos
        : [];

    rawCollection.forEach((entry: any) => {
      const key = String(entry?.nombre ?? entry?.Nombre ?? entry?.codigo ?? entry?.Codigo ?? '').trim();
      const value = this.normalizeDemographicValue(entry);
      if (key && value) {
        result[key] = value;
      }
    });

    return result;
  }

  private normalizeDemographicValue(entry: any): string {
    const directValue = this.toOptionalText(entry?.valor ?? entry?.Valor ?? entry?.valorTexto ?? entry?.ValorTexto);
    if (directValue) return directValue;

    const optionValue = this.toOptionalText(entry?.valorOpcion ?? entry?.ValorOpcion);
    if (optionValue) return optionValue;

    const numberValue = entry?.valorNumero ?? entry?.ValorNumero;
    if (numberValue !== null && numberValue !== undefined && numberValue !== '') {
      return String(numberValue);
    }

    const dateValue = this.toOptionalText(entry?.valorFecha ?? entry?.ValorFecha);
    if (dateValue) return dateValue;

    if (entry?.valorBooleano !== undefined || entry?.ValorBooleano !== undefined) {
      return this.normalizeBoolean(entry?.valorBooleano ?? entry?.ValorBooleano)
        ? this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.YES')
        : this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.NO');
    }

    return '';
  }

  private normalizeDemographicField(item: any): DesEvaluationDemographicField {
    return {
      id: Number(item?.IdCampoDemografico ?? item?.idCampoDemografico ?? item?.Id ?? item?.id ?? 0),
      name: String(item?.Nombre ?? item?.nombre ?? '').trim(),
      code: String(item?.Codigo ?? item?.codigo ?? item?.Clave ?? item?.clave ?? '').trim(),
      type: String(item?.TipoDato ?? item?.tipoDato ?? 'TEXTO').trim().toUpperCase(),
    };
  }

  private normalizeModelSummary(item: any): DesEvaluationCard {
    const card = this.normalizeModelDetail(item);
    const container = item?.modelo ?? item?.Modelo ?? item?.model ?? item;
    const dimensionsSource =
      container?.dimensiones ??
      container?.Dimensiones ??
      item?.dimensiones ??
      item?.Dimensiones;
    const summaryDimensions = this.normalizeModelDimensions(dimensionsSource, true);

    if (summaryDimensions.length > 0) {
      card.bigFactors = summaryDimensions;
    }

    return card;
  }

  private normalizeModelDetail(value: any): DesEvaluationCard {
    const container = value?.modelo ?? value?.Modelo ?? value?.model ?? value;
    const typeSource = container?.tipoModelo ?? container?.TipoModelo ?? {};
    const stateSource = container?.estado ?? container?.Estado ?? container?.estadoModelo ?? {};
    const modelType = String(
      typeSource?.codigo ??
      typeSource?.Codigo ??
      container?.tipoModeloCodigo ??
      container?.TipoModeloCodigo ??
      container?.tipoCodigo ??
      container?.TipoCodigo ??
      container?.tipo ??
      container?.Tipo ??
      '360'
    ).trim().toUpperCase();
    const modelState = String(
      stateSource?.codigo ??
      stateSource?.Codigo ??
      container?.estadoCodigo ??
      container?.EstadoCodigo ??
      container?.estado ??
      container?.Estado ??
      'BORRADOR'
    ).trim().toUpperCase();
    const organizationId = Number(
      container?.organizacionId ??
      container?.IdOrganizacion ??
      value?.organizacionId ??
      value?.IdOrganizacion ??
      this.selectedOrganizationId ??
      0
    );
    const scaleId = Number(
      container?.escalaPredeterminadaId ??
      container?.IdEscalaPredeterminada ??
      container?.escala?.id ??
      container?.Escala?.Id ??
      this.getDefaultScale()?.id ??
      0
    );
    const dimensionsSource =
      container?.dimensiones ??
      container?.Dimensiones ??
      value?.dimensiones ??
      value?.Dimensiones ??
      [];
    const positionsSource =
      container?.puestos ??
      container?.Puestos ??
      value?.puestos ??
      value?.Puestos ??
      [];
    const scenariosSource =
      container?.escenarios ??
      container?.Escenarios ??
      value?.escenarios ??
      value?.Escenarios ??
      [];
    const specificEmployeeIds = this.extractSpecificEmployeeIds(container, value);

    const bigFactors = this.normalizeModelDimensions(dimensionsSource);
    const scenarios = this.normalizeModelScenarios(scenariosSource, modelType);
    const participantPositions: string[] = [];
    const evaluatorOnlyPositions: string[] = [];
    const positionScenarioConfigs: DesEvaluationPositionScenario[] = [];

    if (Array.isArray(positionsSource)) {
      positionsSource.forEach((positionEntry: any) => {
        const positionSource =
          positionEntry?.puesto ?? positionEntry?.Puesto ?? positionEntry?.position ?? positionEntry;
        const positionName = String(
          positionSource?.nombre ??
          positionSource?.Nombre ??
          positionEntry?.puestoNombre ??
          positionEntry?.PuestoNombre ??
          ''
        ).trim();

        if (!positionName) {
          return;
        }

        participantPositions.push(positionName);
        if (this.normalizeBoolean(positionEntry?.soloEvaluador ?? positionEntry?.SoloEvaluador)) {
          evaluatorOnlyPositions.push(positionName);
        }

        const positionScenariosSource =
          positionEntry?.escenarios ??
          positionEntry?.Escenarios ??
          positionEntry?.modelosEscenario;

        if (!Array.isArray(positionScenariosSource)) {
          return;
        }

        const positionScenarios = positionScenariosSource;
        const configuredPositionScenarios: DesEvaluationScenario[] = [];

        positionScenarios.forEach((positionScenario: any) => {
          const scenarioSource =
            positionScenario?.escenario ??
            positionScenario?.Escenario ??
            positionScenario;
          const scenarioKey = this.toScenarioKey(
            scenarioSource?.codigo ??
            scenarioSource?.Codigo ??
            positionScenario?.escenarioCodigo ??
            positionScenario?.EscenarioCodigo
          );

          if (!scenarioKey) {
            return;
          }

          const modelScenario = scenarios.find((scenario) => scenario.key === scenarioKey);
          const catalog = this.scenarioCatalogOptions.find((option) => option.code === scenarioKey);
          configuredPositionScenarios.push({
            id: this.toPositiveInteger(
              positionScenario?.escenarioId ??
              positionScenario?.IdEscenario ??
              scenarioSource?.id ??
              scenarioSource?.Id ??
              catalog?.id ??
              modelScenario?.id
            ) ?? this.generateId(),
            backendId: this.toPositiveInteger(
              positionScenario?.id ??
              positionScenario?.Id ??
              positionScenario?.idModeloPuestoEscenario ??
              positionScenario?.IdModeloPuestoEscenario
            ) ?? modelScenario?.backendId,
            key: scenarioKey,
            name: String(
              scenarioSource?.nombre ??
              scenarioSource?.Nombre ??
              catalog?.name ??
              modelScenario?.name ??
              this.getQuestionScenarioLabel(scenarioKey)
            ),
            weight: Number(
              positionScenario?.ponderacion ??
              positionScenario?.Ponderacion ??
              modelScenario?.weight ??
              0
            ),
            active: positionScenario?.activo === undefined && positionScenario?.Activo === undefined
              ? true
              : this.normalizeBoolean(positionScenario?.activo ?? positionScenario?.Activo),
          });

          this.normalizeCriteriaGroups(positionScenario).forEach((group) => {
            const dimension = this.findOrCreateModelDimension(bigFactors, group.dimension);

            group.criteria.forEach((criterion: any, criterionIndex: number) => {
              const items =
                criterion?.items ??
                criterion?.Items ??
                criterion?.itemsEvaluativos ??
                criterion?.ItemsEvaluativos ??
                [];
              const criterionScaleId = this.toPositiveInteger(
                criterion?.escalaPredeterminadaId ??
                criterion?.IdEscalaPredeterminada ??
                criterion?.escalaId ??
                criterion?.IdEscala
              );
              const factor: DesEvaluationFactor = {
                id: Number(
                  criterion?.id ??
                  criterion?.Id ??
                  criterion?.idCriterioEvaluacion ??
                  criterion?.IdCriterioEvaluacion ??
                  this.generateId()
                ),
                backendId: this.toPositiveInteger(
                  criterion?.id ??
                  criterion?.Id ??
                  criterion?.idCriterioEvaluacion ??
                  criterion?.IdCriterioEvaluacion
                ) ?? undefined,
                code: this.toOptionalText(criterion?.codigo ?? criterion?.Codigo) ?? undefined,
                name: String(criterion?.nombre ?? criterion?.Nombre ?? '').trim(),
                description: String(criterion?.descripcion ?? criterion?.Descripcion ?? '').trim(),
                weight: Number(criterion?.ponderacion ?? criterion?.Ponderacion ?? 0),
                requiredRatingLevel: this.normalizeRequiredRatingLevel(
                  criterion?.nivelExigencia ?? criterion?.NivelExigencia
                ),
                defaultQuestionType: this.resolveFrontendItemTypeCode(
                  criterion?.tipoItemPredeterminado?.codigo ??
                  criterion?.TipoItemPredeterminado?.Codigo ??
                  criterion?.tipoItemPredeterminadoCodigo ??
                  criterion?.TipoItemPredeterminadoCodigo,
                  criterion?.tipoItemPredeterminado?.id ??
                  criterion?.TipoItemPredeterminado?.Id ??
                  criterion?.tipoItemPredeterminadoId ??
                  criterion?.TipoItemPredeterminadoId ??
                  criterion?.IdTipoItemPredeterminado
                ),
                questions: Array.isArray(items)
                  ? items.map((item: any, itemIndex: number) =>
                      this.normalizeModelQuestion(
                        item,
                        criterionScaleId ?? scaleId,
                        positionName,
                        scenarioKey,
                        itemIndex
                      )
                    )
                  : [],
                scenarioKeys: [scenarioKey],
                positionScope: 'SELECTED',
                positions: [positionName],
              };

              if (!factor.name) {
                factor.name = `${this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.COMPETENCIES')} ${criterionIndex + 1}`;
              }

              dimension.factors.push(factor);
            });
          });
        });

        positionScenarioConfigs.push({
          position: positionName,
          scenarios: configuredPositionScenarios,
        });
      });
    }

    const name = String(container?.nombre ?? container?.Nombre ?? '').trim();
    const card: DesEvaluationCard = {
      id: Number(container?.id ?? container?.Id ?? container?.idModelo ?? container?.IdModelo ?? 0),
      organizationId,
      modelCode: this.toOptionalText(container?.codigo ?? container?.Codigo) ?? undefined,
      modelVersion: Number(container?.version ?? container?.Version ?? 1),
      modelTypeId: this.toPositiveInteger(
        typeSource?.id ??
        typeSource?.Id ??
        container?.tipoModeloId ??
        container?.TipoModeloId ??
        container?.IdTipoModelo
      ) ?? undefined,
      modelStateId: this.toPositiveInteger(
        stateSource?.id ?? stateSource?.Id ?? container?.estadoModeloId ?? container?.IdEstadoModelo
      ) ?? undefined,
      calculationMethodId: this.toPositiveInteger(
        container?.metodoCalculoId ??
        container?.IdMetodoCalculo ??
        container?.metodoCalculo?.id ??
        container?.MetodoCalculo?.Id
      ) ?? undefined,
      minimumAnonymousResponses: Number(
        container?.minimoRespuestasAnonimas ?? container?.MinimoRespuestasAnonimas ?? 3
      ),
      name,
      description: String(container?.descripcion ?? container?.Descripcion ?? '').trim(),
      avatarSrc: 'assets/images/user/user1.jpg',
      status: modelState,
      modelName: String(
        typeSource?.nombre ??
        typeSource?.Nombre ??
        container?.tipoModeloNombre ??
        container?.TipoModeloNombre ??
        this.modelTypeOptions.find((item) => item.code === modelType)?.name ??
        modelType
      ),
      modelType,
      modelState,
      scaleId,
      scaleLabel: this.getScaleLabel(scaleId),
      useWeighting: this.normalizeBoolean(
        container?.usaPonderacion ?? container?.UsaPonderacion ?? true
      ),
      useAnonymity: this.normalizeBoolean(
        container?.usaAnonimato ?? container?.UsaAnonimato ?? true
      ),
      surveyType: modelType,
      bigFactors,
      period: {
        name,
        startDate: this.normalizeDateInput(
          container?.fechaInicio ??
          container?.FechaInicio ??
          value?.fechaInicio ??
          value?.FechaInicio
        ),
        endDate: this.normalizeDateInput(
          container?.fechaCierre ??
          container?.FechaCierre ??
          value?.fechaCierre ??
          value?.FechaCierre
        ),
        state: modelState,
      },
      participants: {
        onlyActive: true,
        positions: this.sortPositionsByHierarchy(Array.from(new Set(participantPositions))),
        evaluatorOnlyPositions: Array.from(new Set(evaluatorOnlyPositions)),
        employeeIds: this.orderParticipantEmployeeIds(specificEmployeeIds),
        demographicFilters: [],
        notes: '',
      },
      scenarios,
      positionScenarios: positionScenarioConfigs,
      openQuestionExamples: [],
      stats: this.normalizeModelStats(container),
    };

    this.ensurePositionScenarioConfigs(card);

    if (card.stats.total_empleados_activos === 0 && card.participants.positions.length > 0) {
      card.stats = this.buildStats(card);
    }

    return card;
  }

  private normalizeModelDimensions(
    value: any,
    includeSummaryCriteria = false
  ): DesEvaluationBigFactor[] {
    const dimensions = this.normalizeArrayValue(value);
    if (dimensions.length === 0) {
      return [];
    }

    return dimensions.map((item, index) => {
      const backendId = this.toPositiveInteger(
        item?.id ?? item?.Id ?? item?.idModeloDimension ?? item?.IdModeloDimension
      );
      const criteria = includeSummaryCriteria
        ? this.normalizeArrayValue(
            item?.criterios ??
            item?.Criterios ??
            item?.criteriosEvaluacion ??
            item?.CriteriosEvaluacion
          ).map((criterion, criterionIndex) =>
            this.normalizeModelSummaryCriterion(criterion, criterionIndex)
          )
        : [];

      return {
        id: backendId ?? this.generateId(),
        backendId: backendId ?? undefined,
        code: this.toOptionalText(item?.codigo ?? item?.Codigo) ?? undefined,
        name: String(item?.nombre ?? item?.Nombre ?? `Dimensión ${index + 1}`).trim(),
        description: String(item?.descripcion ?? item?.Descripcion ?? '').trim(),
        weight: Number(item?.ponderacion ?? item?.Ponderacion ?? 0),
        factors: criteria,
      };
    });
  }

  private normalizeModelSummaryCriterion(
    criterion: any,
    index: number
  ): DesEvaluationFactor {
    const backendId = this.toPositiveInteger(
      criterion?.id ??
      criterion?.Id ??
      criterion?.idCriterioEvaluacion ??
      criterion?.IdCriterioEvaluacion
    );
    const items = this.normalizeArrayValue(
      criterion?.items ??
      criterion?.Items ??
      criterion?.itemsEvaluativos ??
      criterion?.ItemsEvaluativos
    );
    const totalItems = Number(
      criterion?.totalItems ??
      criterion?.TotalItems ??
      criterion?.cantidadItems ??
      criterion?.CantidadItems ??
      criterion?.totalPreguntas ??
      criterion?.TotalPreguntas ??
      items.length
    );

    return {
      id: backendId ?? this.generateId(),
      backendId: backendId ?? undefined,
      code: this.toOptionalText(criterion?.codigo ?? criterion?.Codigo) ?? undefined,
      summaryQuestionCount: Number.isFinite(totalItems) ? totalItems : items.length,
      name: String(
        criterion?.nombre ??
        criterion?.Nombre ??
        `${this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.COMPETENCIES')} ${index + 1}`
      ).trim(),
      description: String(criterion?.descripcion ?? criterion?.Descripcion ?? '').trim(),
      weight: Number(criterion?.ponderacion ?? criterion?.Ponderacion ?? 0),
      requiredRatingLevel: this.normalizeRequiredRatingLevel(
        criterion?.nivelExigencia ?? criterion?.NivelExigencia
      ),
      defaultQuestionType: this.resolveFrontendItemTypeCode(
        criterion?.tipoItemPredeterminadoCodigo ??
        criterion?.TipoItemPredeterminadoCodigo,
        criterion?.tipoItemPredeterminadoId ??
        criterion?.TipoItemPredeterminadoId ??
        criterion?.IdTipoItemPredeterminado
      ),
      questions: items.map((item, itemIndex) => ({
        id: Number(
          item?.id ??
          item?.Id ??
          item?.idItemEvaluativo ??
          item?.IdItemEvaluativo ??
          this.generateId()
        ),
        label: String(
          item?.texto ??
          item?.Texto ??
          item?.label ??
          `Ítem ${itemIndex + 1}`
        ).trim(),
        type: this.resolveFrontendItemTypeCode(
          item?.tipoItemCodigo ??
          item?.TipoItemCodigo ??
          item?.tipo ??
          item?.Tipo,
          item?.tipoItemId ??
          item?.TipoItemId ??
          item?.IdTipoItem
        ),
        required: true,
        options: [],
      })),
    };
  }

  private normalizeModelScenarios(
    value: any,
    modelType: string
  ): DesEvaluationScenario[] {
    if (!Array.isArray(value) || value.length === 0) {
      return this.buildScenariosForType(modelType);
    }

    return value
      .map<DesEvaluationScenario | null>((item: any) => {
        const scenarioSource = item?.escenario ?? item?.Escenario ?? item;
        const key = this.toScenarioKey(
          scenarioSource?.codigo ??
          scenarioSource?.Codigo ??
          item?.escenarioCodigo ??
          item?.EscenarioCodigo
        );

        if (!key) {
          return null;
        }

        const catalog = this.scenarioCatalogOptions.find((option) => option.code === key);
        const backendId = this.toPositiveInteger(
          item?.id ?? item?.Id ?? item?.idModeloEscenario ?? item?.IdModeloEscenario
        );

        return {
          id: Number(
            item?.escenarioId ??
            item?.IdEscenario ??
            scenarioSource?.id ??
            scenarioSource?.Id ??
            catalog?.id ??
            this.generateId()
          ),
          backendId: backendId ?? undefined,
          key,
          name: String(
            scenarioSource?.nombre ??
            scenarioSource?.Nombre ??
            catalog?.name ??
            this.getQuestionScenarioLabel(key)
          ),
          weight: Number(item?.ponderacion ?? item?.Ponderacion ?? 0),
          active: item?.activo === undefined && item?.Activo === undefined
            ? true
            : this.normalizeBoolean(item?.activo ?? item?.Activo),
        } satisfies DesEvaluationScenario;
      })
      .filter((item): item is DesEvaluationScenario => !!item);
  }

  private normalizeCriteriaGroups(
    positionScenario: any
  ): Array<{ dimension: any; criteria: any[] }> {
    const explicitGroups =
      positionScenario?.criteriosPorDimension ??
      positionScenario?.CriteriosPorDimension;

    if (Array.isArray(explicitGroups)) {
      return explicitGroups.map((group) => ({
        dimension: group?.dimension ?? group?.Dimension ?? group,
        criteria: Array.isArray(group?.criterios ?? group?.Criterios)
          ? group?.criterios ?? group?.Criterios
          : [],
      }));
    }

    const dimensions = positionScenario?.dimensiones ?? positionScenario?.Dimensiones;
    if (Array.isArray(dimensions)) {
      return dimensions.map((dimension) => ({
        dimension,
        criteria: Array.isArray(
          dimension?.criterios ??
          dimension?.Criterios ??
          dimension?.criteriosEvaluacion ??
          dimension?.CriteriosEvaluacion
        )
          ? dimension?.criterios ??
            dimension?.Criterios ??
            dimension?.criteriosEvaluacion ??
            dimension?.CriteriosEvaluacion
          : [],
      }));
    }

    return [];
  }

  private findOrCreateModelDimension(
    dimensions: DesEvaluationBigFactor[],
    source: any
  ): DesEvaluationBigFactor {
    const id = this.toPositiveInteger(
      source?.id ??
      source?.Id ??
      source?.dimensionId ??
      source?.DimensionId ??
      source?.idModeloDimension ??
      source?.IdModeloDimension
    );
    const code = this.toOptionalText(
      source?.codigo ?? source?.Codigo ?? source?.dimensionCodigo ?? source?.DimensionCodigo
    );
    const name = this.toOptionalText(
      source?.nombre ?? source?.Nombre ?? source?.dimensionNombre ?? source?.DimensionNombre
    );
    const found = dimensions.find((dimension) =>
      (!!id && dimension.backendId === id) ||
      (!!code && this.normalizeKey(dimension.code ?? '') === this.normalizeKey(code)) ||
      (!!name && this.normalizeKey(dimension.name) === this.normalizeKey(name))
    );

    if (found) {
      return found;
    }

    const dimension: DesEvaluationBigFactor = {
      id: id ?? this.generateId(),
      backendId: id ?? undefined,
      code: code ?? undefined,
      name: name ?? `Dimensión ${dimensions.length + 1}`,
      description: String(source?.descripcion ?? source?.Descripcion ?? '').trim(),
      weight: Number(source?.ponderacion ?? source?.Ponderacion ?? 0),
      factors: [],
    };
    dimensions.push(dimension);
    return dimension;
  }

  private normalizeModelQuestion(
    item: any,
    fallbackScaleId: number,
    positionName: string,
    scenarioKey: DesEvaluationScenarioKey,
    index: number
  ): DesEvaluationQuestion {
    const backendId = this.toPositiveInteger(
      item?.id ?? item?.Id ?? item?.idItemEvaluativo ?? item?.IdItemEvaluativo
    );
    const questionType = this.resolveFrontendItemTypeCode(
      item?.tipoItem?.codigo ??
      item?.TipoItem?.Codigo ??
      item?.tipoItemCodigo ??
      item?.TipoItemCodigo ??
      item?.tipo ??
      item?.Tipo,
      item?.tipoItem?.id ??
      item?.TipoItem?.Id ??
      item?.tipoItemId ??
      item?.TipoItemId ??
      item?.IdTipoItem
    );
    const scaleId = this.toPositiveInteger(
      item?.escalaId ??
      item?.IdEscala ??
      item?.escala?.id ??
      item?.Escala?.Id ??
      fallbackScaleId
    );
    const optionsSource =
      item?.opciones ??
      item?.Opciones ??
      item?.escala?.valores ??
      item?.Escala?.Valores ??
      [];
    let options = Array.isArray(optionsSource)
      ? optionsSource
          .map((option: any) =>
            typeof option === 'string'
              ? option.trim()
              : String(option?.etiqueta ?? option?.Etiqueta ?? option?.label ?? '').trim()
          )
          .filter((option: string) => !!option)
      : [];

    if (questionType === 'ABIERTA') {
      options = [];
    } else if (options.length === 0 && scaleId) {
      options = this.getScaleById(scaleId)?.levels
        .map((level) => level.label ?? this.translateKeyOrFallback(level.labelKey ?? '', ''))
        .filter((label) => !!label) ?? [];
    }

    return {
      id: backendId ?? this.generateId(),
      backendId: backendId ?? undefined,
      code: this.toOptionalText(item?.codigo ?? item?.Codigo) ?? undefined,
      label: String(item?.texto ?? item?.Texto ?? item?.label ?? `Ítem ${index + 1}`).trim(),
      type: questionType,
      required: true,
      options,
      scaleId: questionType === 'ABIERTA' ? null : scaleId,
      scenarioKeys: [scenarioKey],
      positionScope: 'SELECTED',
      positions: [positionName],
    };
  }

  private normalizeModelStats(source: any): DesEvaluationStats {
    const total = Number(
      source?.totalParticipantes ??
      source?.TotalParticipantes ??
      source?.total ??
      source?.Total ??
      0
    );
    const answered = Number(
      source?.respondidas ??
      source?.Respondidas ??
      source?.totalContestadas ??
      source?.TotalContestadas ??
      0
    );

    return {
      total,
      total_enviadas: Number(source?.enviadas ?? source?.Enviadas ?? 0),
      total_iniciadas: Number(source?.enProceso ?? source?.EnProceso ?? 0),
      total_contestadas: answered,
      total_error: Number(source?.erroresEnvio ?? source?.ErroresEnvio ?? 0),
      total_empleados_activos: total,
      porcentaje: Number(
        source?.porcentajeAvance ??
        source?.PorcentajeAvance ??
        (total > 0 ? Math.round((answered / total) * 100) : 0)
      ),
    };
  }

  private extractSpecificEmployeeIds(container: any, value: any): number[] {
    const participants =
      container?.participantes ??
      container?.Participantes ??
      value?.participantes ??
      value?.Participantes ??
      {};
    const candidates = [
      container?.empleadosEspecificosIds,
      container?.EmpleadosEspecificosIds,
      value?.empleadosEspecificosIds,
      value?.EmpleadosEspecificosIds,
      container?.empleadosEspecificos,
      container?.EmpleadosEspecificos,
      value?.empleadosEspecificos,
      value?.EmpleadosEspecificos,
      participants?.empleadosEspecificosIds,
      participants?.EmpleadosEspecificosIds,
      participants?.employeeIds,
      participants?.EmployeeIds,
      participants?.empleadoIds,
      participants?.EmpleadoIds,
      participants?.empleados,
      participants?.Empleados,
    ];

    return this.orderParticipantEmployeeIds(
      Array.from(new Set(candidates.flatMap((candidate) =>
        this.toPositiveIntegerList(candidate)
      )))
    );
  }

  private buildDemographicFieldsFromEmployees(): DesEvaluationDemographicField[] {
    const names = Array.from(new Set(this.employees.flatMap((employee) => Object.keys(employee.demographicValues))));

    return names.map((name, index) => ({
      id: index + 1,
      name,
      code: this.normalizeKey(name),
      type: 'TEXTO',
    }));
  }

  private rebuildDemographicValueOptions(): void {
    const options: Record<string, string[]> = {};

    this.demographicFields.forEach((field) => {
      options[field.name] = [];
    });

    this.employees.forEach((employee) => {
      Object.entries(employee.demographicValues).forEach(([key, value]) => {
        if (!value) return;
        if (!options[key]) options[key] = [];
        if (!options[key].includes(value)) options[key].push(value);
      });
    });

    Object.keys(options).forEach((key) => {
      options[key] = options[key].sort((left, right) => left.localeCompare(right));
    });

    this.demographicValueOptions = options;
  }

  private rebuildAvailablePositions(): void {
    const positions = Array.from(
      new Set(
        [
          ...this.positionOptions.map((position) => position.name),
          ...this.employees.map((employee) => employee.cargo),
        ]
          .filter((value): value is string => !!value)
      )
    );

    this.availablePositions = this.sortPositionsByHierarchy(positions);
  }

  private sortPositionsByHierarchy(positions: string[]): string[] {
    const uniquePositions = Array.from(
      new Set(
        positions
          .map((position) => String(position ?? '').trim())
          .filter((position) => position.length > 0)
      )
    );
    const orderedEmployees = this.sortEmployeesByHierarchy(this.employees);
    const hierarchyLevels = this.buildEmployeeHierarchyLevels(this.employees);
    const hierarchyIndex = this.buildHierarchyIndex(this.employees);
    const positionOrder = new Map<string, {
      minLevel: number;
      firstEmployeeOrder: number;
      hasDirectReports: boolean;
    }>();

    orderedEmployees.forEach((employee, employeeOrder) => {
      if (!employee.cargo) {
        return;
      }

      const positionKey = this.normalizeSearchText(employee.cargo);
      const current = positionOrder.get(positionKey);
      const employeeLevel = hierarchyLevels.get(employee.id) ?? Number.MAX_SAFE_INTEGER;
      const hasDirectReports = (hierarchyIndex.childrenByManagerId.get(employee.id) ?? []).length > 0;

      positionOrder.set(positionKey, {
        minLevel: Math.min(current?.minLevel ?? Number.MAX_SAFE_INTEGER, employeeLevel),
        firstEmployeeOrder: Math.min(current?.firstEmployeeOrder ?? Number.MAX_SAFE_INTEGER, employeeOrder),
        hasDirectReports: (current?.hasDirectReports ?? false) || hasDirectReports,
      });
    });

    return uniquePositions.sort((left, right) => {
      const leftOrder = positionOrder.get(this.normalizeSearchText(left));
      const rightOrder = positionOrder.get(this.normalizeSearchText(right));
      const leftLevel = leftOrder?.minLevel ?? Number.MAX_SAFE_INTEGER;
      const rightLevel = rightOrder?.minLevel ?? Number.MAX_SAFE_INTEGER;

      if (leftLevel !== rightLevel) {
        return leftLevel - rightLevel;
      }

      if ((leftOrder?.hasDirectReports ?? false) !== (rightOrder?.hasDirectReports ?? false)) {
        return leftOrder?.hasDirectReports ? -1 : 1;
      }

      const leftEmployeeOrder = leftOrder?.firstEmployeeOrder ?? Number.MAX_SAFE_INTEGER;
      const rightEmployeeOrder = rightOrder?.firstEmployeeOrder ?? Number.MAX_SAFE_INTEGER;

      if (leftEmployeeOrder !== rightEmployeeOrder) {
        return leftEmployeeOrder - rightEmployeeOrder;
      }

      return left.localeCompare(right);
    });
  }

  private findModelCatalogByName(value: string | null | undefined): ModelCatalogOption | null {
    const normalized = this.normalizeSearchText(value ?? '');
    if (!normalized) {
      return null;
    }

    return this.modelCatalog.find((option) =>
      this.normalizeSearchText(this.getModelCatalogName(option)) === normalized
    ) ?? null;
  }

  private formatDateForInput(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDaysToInputDate(value: string, days: number): string {
    const baseDate = this.toNativeDate(value) ?? new Date();
    baseDate.setDate(baseDate.getDate() + days);
    return this.formatDateForInput(baseDate);
  }

  private toNativeDate(value: string | null | undefined): Date | null {
    const normalized = this.normalizeDateInput(value);
    if (!normalized) {
      return null;
    }

    const [year, month, day] = normalized.split('-').map((item) => Number(item));
    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  private createBlankEvaluation(organizationId: number): DesEvaluationCard {
    const defaultScale = this.getDefaultScale();
    const defaultType = this.surveyTypes[0] ?? '360';
    const today = this.formatDateForInput(new Date());
    const closingDate = this.addDaysToInputDate(today, 15);
    const defaultState =
      this.modelStateOptions.find((item) => item.code === 'BORRADOR') ??
      this.modelStateOptions[0];
    const defaultMethod =
      this.calculationMethodOptions.find((item) => item.code === 'PROMEDIO_PONDERADO') ??
      this.calculationMethodOptions[0];
    const name = this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_NEW_NAME', {
      year: new Date().getFullYear(),
    });

    return {
      id: this.generateId(),
      organizationId,
      modelVersion: 1,
      modelTypeId: this.modelTypeOptions.find((item) => item.code === defaultType)?.id,
      modelStateId: defaultState?.id,
      calculationMethodId: defaultMethod?.id,
      minimumAnonymousResponses: 3,
      name,
      description: this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_DESCRIPTION'),
      avatarSrc: 'assets/images/user/user1.jpg',
      status: 'CONFIGURACION',
      modelName: name,
      modelType: defaultType,
      modelState: defaultState?.code ?? 'BORRADOR',
      scaleId: defaultScale?.id ?? this.scaleOptions[0]?.id ?? 0,
      scaleLabel: this.getScaleLabel(defaultScale?.id ?? this.scaleOptions[0]?.id ?? 0),
      useWeighting: true,
      useAnonymity: true,
      surveyType: defaultType,
      bigFactors: this.buildDefaultBigFactors(),
      period: {
        name,
        startDate: today,
        endDate: closingDate,
        state: 'CONFIGURACION',
      },
      participants: {
        onlyActive: true,
        positions: [],
        evaluatorOnlyPositions: [],
        employeeIds: [],
        demographicFilters: [],
        notes: '',
      },
      scenarios: this.buildScenariosForType(defaultType),
      positionScenarios: [],
      openQuestionExamples: [
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.OPEN_QUESTIONS.STRENGTHS'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.OPEN_QUESTIONS.IMPROVEMENTS'),
      ],
      stats: {
        total: 0,
        total_enviadas: 0,
        total_iniciadas: 0,
        total_contestadas: 0,
        total_error: 0,
        total_empleados_activos: 0,
        porcentaje: 0,
      },
    };
  }

  private buildScenariosForType(
    type: string,
    currentScenarios: DesEvaluationScenario[] = []
  ): DesEvaluationScenario[] {
    const scenarioDefinitions = this.getScenarioDefinitions(type);
    const currentByName = new Map(
      currentScenarios.map((scenario) => [this.normalizeKey(scenario.name), scenario])
    );
    const currentByKey = new Map(
      currentScenarios
        .filter((scenario) => !!scenario.key)
        .map((scenario) => [scenario.key as DesEvaluationScenarioKey, scenario])
    );
    const canPreserveWeights =
      currentScenarios.length === scenarioDefinitions.length &&
      scenarioDefinitions.every((definition) => currentByName.has(this.normalizeKey(this.t(definition.nameKey))));

    return scenarioDefinitions.map((definition) => {
      const name = this.t(definition.nameKey);
      const catalog = this.scenarioCatalogOptions.find((item) => item.code === definition.key);
      const currentScenario = canPreserveWeights
        ? currentByKey.get(definition.key) ?? currentByName.get(this.normalizeKey(name))
        : null;

      return {
        id: currentScenario?.id ?? catalog?.id ?? this.generateId(),
        backendId: currentScenario?.backendId,
        key: definition.key,
        name: catalog?.name ?? name,
        weight: currentScenario?.weight ?? definition.weight,
        active: currentScenario?.active !== false,
      };
    });
  }

  private getScenarioDefinitions(
    type: string
  ): Array<{ key: DesEvaluationScenarioKey; nameKey: string; weight: number }> {
    const scenarioKey = 'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.SCENARIOS';

    switch (this.normalizeKey(type)) {
      case '90':
        return [
          { key: 'BOSS_TO_EMPLOYEE', nameKey: `${scenarioKey}.BOSS_TO_EMPLOYEE`, weight: 100 },
        ];
      case '180':
        return [
          { key: 'BOSS_TO_EMPLOYEE', nameKey: `${scenarioKey}.BOSS_TO_EMPLOYEE`, weight: 50 },
          { key: 'EMPLOYEE_TO_BOSS', nameKey: `${scenarioKey}.EMPLOYEE_TO_BOSS`, weight: 50 },
        ];
      case 'AUTOEVALUACION':
        return [
          { key: 'SELF', nameKey: `${scenarioKey}.SELF`, weight: 100 },
        ];
      case '360':
      case 'MIXTA':
      default:
        return [
          { key: 'BOSS_TO_EMPLOYEE', nameKey: `${scenarioKey}.BOSS_TO_EMPLOYEE`, weight: 25 },
          { key: 'EMPLOYEE_TO_BOSS', nameKey: `${scenarioKey}.EMPLOYEE_TO_BOSS`, weight: 25 },
          { key: 'SELF', nameKey: `${scenarioKey}.SELF`, weight: 25 },
          { key: 'PEER', nameKey: `${scenarioKey}.PEER`, weight: 25 },
        ];
    }
  }

  private buildDefaultBigFactors(): DesEvaluationBigFactor[] {
    return [
      this.createBigFactorTemplate(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.OBJECTIVES.NAME'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.OBJECTIVES.DESCRIPTION'),
        45
      ),
      this.createBigFactorTemplate(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.COMPETENCIES.NAME'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.COMPETENCIES.DESCRIPTION'),
        35
      ),
      this.createBigFactorTemplate(
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.VALUES.NAME'),
        this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DEFAULT_BIG_FACTORS.VALUES.DESCRIPTION'),
        20
      ),
     
    ];
  }

  private createBigFactorTemplate(name: string, description: string, weight: number): DesEvaluationBigFactor {
    return {
      id: this.generateId(),
      name,
      description,
      weight,
      factors: [],
    };
  }

  private createEmptyBigFactorDraft(): BigFactorDraft {
    return { name: '', description: '', weight: 0 };
  }

  private createEmptyFactorDraft(): FactorDraft {
    return {
      name: '',
      description: '',
      weight: 0,
      requiredRatingLevel: 3,
      defaultQuestionType: 'LIKERT_1_5',
    };
  }

  private createEmptyQuestionDraft(): QuestionDraft {
    const evaluationType = this.draftEvaluation?.modelType ?? this.draftEvaluation?.surveyType ?? '360';

    return {
      label: '',
      type: 'LIKERT_1_5',
      optionsText: this.questionLikertPresets[0].labels.join('\n'),
      scenarioKeys: this.getScenarioDefinitions(evaluationType).map((scenario) => scenario.key),
      positionScope: 'ALL',
      positions: [],
    };
  }

  private refreshQuestionScenarioState(): void {
    const evaluationType = this.draftEvaluation?.modelType ?? this.draftEvaluation?.surveyType ?? '360';
    const questions = this.draftEvaluation
      ? this.getAllEvaluationQuestions(this.draftEvaluation)
      : [];

    this.questionScenarioOptions = this.getScenarioDefinitions(evaluationType).map((scenario) => ({
      key: scenario.key,
      label: this.getQuestionScenarioLabel(scenario.key),
    }));
    this.questionScenarioCoverage = this.questionScenarioOptions.map((scenario) => ({
      ...scenario,
      count: questions.filter((question) =>
        this.normalizeQuestionScenarioKeys(question, evaluationType).includes(scenario.key)
      ).length,
    }));
  }

  private ensureQuestionLikertOptions(): void {
    if (
      this.questionDraft.type === 'LIKERT_1_5' &&
      this.getQuestionDraftOptions().length === 0
    ) {
      this.questionDraft.optionsText = this.questionLikertPresets[0].labels.join('\n');
    }
  }

  private refreshQuestionOptionsSummary(): void {
    const options = this.getQuestionDraftOptions();

    if (this.questionDraft.type !== 'LIKERT_1_5') {
      this.questionOptionsSummary = '';
      return;
    }

    const presetKey = this.matchQuestionLikertPreset(options);
    const preset = this.questionLikertPresets.find((item) => item.key === presetKey);
    this.questionOptionsSummary = preset
      ? `${this.t(preset.title)}: ${options.join(' | ')}`
      : options.join(' | ');
  }

  private getQuestionDraftOptions(): string[] {
    return this.questionDraft.optionsText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private matchQuestionLikertPreset(options: string[]): string | null {
    const normalizedOptions = options.map((item) => this.normalizeSearchText(item));

    const preset = this.questionLikertPresets.find((item) => {
      const normalizedLabels = item.labels.map((label) => this.normalizeSearchText(label));

      return (
        normalizedLabels.length === normalizedOptions.length &&
        normalizedLabels.every((label, index) => label === normalizedOptions[index])
      );
    });

    return preset?.key ?? null;
  }

  private normalizeEvaluationQuestionScopes(evaluation: DesEvaluationCard): void {
    evaluation.bigFactors.forEach((bigFactor) => {
      const normalizedFactors: DesEvaluationFactor[] = [];

      bigFactor.factors.forEach((factor) => {
        factor.requiredRatingLevel = this.normalizeRequiredRatingLevel(factor.requiredRatingLevel);
        const positions = factor.positionScope === 'SELECTED'
          ? this.normalizeFactorPositions(factor)
          : [...evaluation.participants.positions];
        const targetPositions = positions.length > 0 ? positions : [null];
        const scenarioKeys = this.normalizeFactorScenarioKeys(factor, evaluation.modelType);
        const usedQuestionIds = new Set<number>();
        let factorCopyIndex = 0;

        targetPositions.forEach((position) => {
          scenarioKeys.forEach((scenarioKey) => {
            const questions = factor.questions
              .filter((question) => {
                const appliesToPosition =
                  !position ||
                  question.positionScope !== 'SELECTED' ||
                  this.normalizeQuestionPositions(question).includes(position);
                const appliesToScenario = this.normalizeQuestionScenarioKeys(
                  question,
                  evaluation.modelType
                ).includes(scenarioKey);

                return appliesToPosition && appliesToScenario;
              })
              .map((question) => {
                const preserveId = !usedQuestionIds.has(question.id);
                usedQuestionIds.add(question.id);

                return {
                  ...question,
                  id: preserveId ? question.id : this.generateId(),
                  backendId: preserveId ? question.backendId : undefined,
                  required: true,
                  options: [...question.options],
                  scenarioKeys: [scenarioKey],
                  positionScope: position ? 'SELECTED' as DesEvaluationQuestionPositionScope : 'ALL',
                  positions: position ? [position] : [],
                };
              });

            normalizedFactors.push({
              ...factor,
              id: factorCopyIndex === 0 ? factor.id : this.generateId(),
              backendId: factorCopyIndex === 0 ? factor.backendId : undefined,
              requiredRatingLevel: this.normalizeRequiredRatingLevel(
                factor.requiredRatingLevel
              ),
              questions,
              scenarioKeys: [scenarioKey],
              positionScope: position ? 'SELECTED' : 'ALL',
              positions: position ? [position] : [],
            });
            factorCopyIndex++;
          });
        });
      });

      bigFactor.factors = normalizedFactors;
    });

    this.getAllEvaluationQuestions(evaluation).forEach((question) => {
      question.required = true;
      if (question.type === 'LIKERT_1_5' && question.options.length === 0) {
        question.options = [...this.questionLikertPresets[0].labels];
      }
      question.scenarioKeys = this.normalizeQuestionScenarioKeys(question, evaluation.modelType);
      question.positionScope = question.positionScope === 'SELECTED' ? 'SELECTED' : 'ALL';
      question.positions = question.positionScope === 'SELECTED'
        ? this.normalizeQuestionPositions(question)
        : [];
    });
  }

  private normalizeFactorScenarioKeys(
    factor: DesEvaluationFactor,
    evaluationType: string
  ): DesEvaluationScenarioKey[] {
    const validKeys = this.getScenarioDefinitions(evaluationType).map(
      (scenario) => scenario.key
    );
    const configuredKeys = (factor.scenarioKeys ?? []).filter(
      (key): key is DesEvaluationScenarioKey => validKeys.includes(key)
    );
    const questionKeys = factor.questions.flatMap((question) =>
      this.normalizeQuestionScenarioKeys(question, evaluationType)
    );
    const selectedKeys = new Set(
      configuredKeys.length > 0 ? configuredKeys : questionKeys
    );
    const normalizedKeys = validKeys.filter((key) => selectedKeys.has(key));

    return normalizedKeys.length > 0 ? normalizedKeys : validKeys;
  }

  private openDuplicatePositionsDialog(context: DesEvaluationDuplicateContext): void {
    if (
      !this.draftEvaluation ||
      !this.duplicatePositionsDialogTemplate ||
      this.draftEvaluation.participants.positions.length < 2
    ) {
      return;
    }

    this.duplicateContext = context;
    this.duplicatePositionSearchTerm = '';
    this.selectedDuplicatePositions = [];
    this.duplicatePositionsDialogRef = this.dialog.open(
      this.duplicatePositionsDialogTemplate,
      {
        width: '760px',
        maxWidth: '94vw',
        maxHeight: '86vh',
        autoFocus: false,
        panelClass: 'des-evaluaciones-dialog-panel',
      }
    );

    this.duplicatePositionsDialogRef.afterClosed().subscribe(() => {
      this.duplicatePositionsDialogRef = null;
      this.duplicateContext = null;
      this.duplicatePositionSearchTerm = '';
      this.selectedDuplicatePositions = [];
    });
  }

  private findEquivalentFactorForPosition(
    dimension: DesEvaluationBigFactor,
    sourceFactor: DesEvaluationFactor,
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): DesEvaluationFactor | null {
    const sourceName = this.normalizeSearchText(sourceFactor.name);

    return this.getFactorsForPositionAndScenario(dimension, position, scenarioKey)
      .map(({ factor }) => factor)
      .find((factor) => this.normalizeSearchText(factor.name) === sourceName) ?? null;
  }

  private hasEquivalentQuestionForPosition(
    factor: DesEvaluationFactor,
    sourceQuestion: DesEvaluationQuestion,
    position: string
  ): boolean {
    const sourceLabel = this.normalizeSearchText(sourceQuestion.label);

    return this.getQuestionsForPosition(factor, position).some(
      ({ question }) =>
        this.normalizeSearchText(question.label) === sourceLabel &&
        question.type === sourceQuestion.type
    );
  }

  private cloneQuestionForPositionTarget(
    question: DesEvaluationQuestion,
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): DesEvaluationQuestion {
    return {
      ...question,
      id: this.generateId(),
      backendId: undefined,
      required: true,
      options: [...question.options],
      scenarioKeys: [scenarioKey],
      positionScope: 'SELECTED',
      positions: [position],
    };
  }

  private cloneFactorShellForPosition(
    factor: DesEvaluationFactor,
    position: string,
    scenarioKey: DesEvaluationScenarioKey
  ): DesEvaluationFactor {
    return {
      ...factor,
      id: this.generateId(),
      backendId: undefined,
      requiredRatingLevel: this.getFactorRequiredRatingLevel(factor),
      questions: [],
      scenarioKeys: [scenarioKey],
      positionScope: 'SELECTED',
      positions: [position],
    };
  }

  private cloneFactorFromSourcePosition(
    factor: DesEvaluationFactor,
    sourcePosition: string,
    targetPosition: string,
    scenarioKey: DesEvaluationScenarioKey
  ): DesEvaluationFactor {
    return {
      ...this.cloneFactorShellForPosition(factor, targetPosition, scenarioKey),
      questions: this.getQuestionsForPositionAndScenario(
        factor,
        sourcePosition,
        scenarioKey
      ).map(({ question }) =>
        this.cloneQuestionForPositionTarget(question, targetPosition, scenarioKey)
      ),
    };
  }

  private cloneQuestionsForPosition(
    factor: DesEvaluationFactor,
    position: string,
    preserveIds: boolean
  ): DesEvaluationQuestion[] {
    const evaluationType = this.draftEvaluation?.modelType ?? '360';

    return this.getQuestionsForPosition(factor, position).map(({ question }) => ({
      ...question,
      id: preserveIds ? question.id : this.generateId(),
      backendId: preserveIds ? question.backendId : undefined,
      required: true,
      options: [...question.options],
      scenarioKeys: [...this.normalizeQuestionScenarioKeys(question, evaluationType)],
      positionScope: 'SELECTED',
      positions: [position],
    }));
  }

  private cloneFactorForPosition(
    factor: DesEvaluationFactor,
    position: string
  ): DesEvaluationFactor {
    return {
      ...factor,
      id: this.generateId(),
      backendId: undefined,
      questions: this.cloneQuestionsForPosition(factor, position, false),
      positionScope: 'SELECTED',
      positions: [position],
    };
  }

  private factorBelongsOnlyToPosition(
    factor: DesEvaluationFactor,
    position: string
  ): boolean {
    const positions = this.normalizeFactorPositions(factor);

    return factor.positionScope === 'SELECTED' &&
      positions.length === 1 &&
      positions[0] === position;
  }

  private getFactorApplicablePositions(
    factor: DesEvaluationFactor,
    evaluation: DesEvaluationCard
  ): string[] {
    return factor.positionScope === 'SELECTED'
      ? this.normalizeFactorPositions(factor)
      : [...evaluation.participants.positions];
  }

  private normalizeFactorPositions(factor: DesEvaluationFactor): string[] {
    return Array.from(
      new Set(
        (factor.positions ?? [])
          .map((position) => String(position).trim())
          .filter((position) => position.length > 0)
      )
    );
  }

  private normalizeQuestionScenarioKeys(
    question: DesEvaluationQuestion,
    evaluationType: string
  ): DesEvaluationScenarioKey[] {
    const validKeys = this.getScenarioDefinitions(evaluationType).map((scenario) => scenario.key);
    const selectedKeys = new Set(
      (question.scenarioKeys ?? []).filter((key): key is DesEvaluationScenarioKey => validKeys.includes(key))
    );
    const normalizedKeys = validKeys.filter((key) => selectedKeys.has(key));

    return normalizedKeys.length > 0 ? normalizedKeys : validKeys;
  }

  private normalizeQuestionPositions(question: DesEvaluationQuestion): string[] {
    return Array.from(
      new Set(
        (question.positions ?? [])
          .map((position) => String(position).trim())
          .filter((position) => position.length > 0)
      )
    );
  }

  private getAllEvaluationQuestions(evaluation: DesEvaluationCard): DesEvaluationQuestion[] {
    return evaluation.bigFactors.flatMap((bigFactor) =>
      bigFactor.factors.flatMap((factor) => factor.questions)
    );
  }

  private buildStats(
    evaluation: DesEvaluationCard,
    overrides?: Partial<DesEvaluationStats>,
  ): DesEvaluationStats {
    const matchedEmployees = this.getMatchedEmployees(evaluation);
    const total = matchedEmployees.length;
    const totalContested = Math.min(overrides?.total_contestadas ?? Math.round(total * 0.4), total);
    const totalStarted = Math.min(overrides?.total_iniciadas ?? Math.max(totalContested, Math.round(total * 0.55)), total);
    const totalSent = Math.min(overrides?.total_enviadas ?? total, total);
    const totalError = Math.min(overrides?.total_error ?? 0, total);

    return {
      total,
      total_enviadas: totalSent,
      total_iniciadas: totalStarted,
      total_contestadas: totalContested,
      total_error: totalError,
      total_empleados_activos: matchedEmployees.filter((employee) => employee.activo).length,
      porcentaje: total > 0 ? Math.round((totalContested / total) * 100) : 0,
    };
  }

  private getMatchedEmployees(evaluation: DesEvaluationCard | null): DesEvaluationEmployee[] {
    if (!evaluation) {
      return [];
    }

    const candidateEmployees = this.getParticipantCandidateEmployees(evaluation);

    if (evaluation.participants.employeeIds.length === 0) {
      return candidateEmployees;
    }

    const selectedEmployeeIds = new Set(evaluation.participants.employeeIds);
    return candidateEmployees.filter((employee) => selectedEmployeeIds.has(employee.id));
  }

  private getParticipantCandidateEmployees(evaluation: DesEvaluationCard | null): DesEvaluationEmployee[] {
    if (!evaluation) {
      return [];
    }

    const baseEmployees = this.employees.filter((employee) => !evaluation.participants.onlyActive || employee.activo);

    if (evaluation.participants.positions.length === 0) {
      return [];
    }

    return baseEmployees.filter((employee) => this.employeeMatchesAnyParticipantCriteria(employee, evaluation));
  }

  private employeeMatchesAnyParticipantCriteria(
    employee: DesEvaluationEmployee,
    evaluation: DesEvaluationCard
  ): boolean {
    if (!employee.cargo) {
      return false;
    }

    const employeePosition = this.normalizeSearchText(employee.cargo);
    return evaluation.participants.positions.some(
      (position) => this.normalizeSearchText(position) === employeePosition
    );
  }

  private ensureDraftFilters(card: DesEvaluationCard): DesEvaluationCard {
    const draft = this.cloneEvaluation(card);
    draft.participants.demographicFilters = [];
    draft.participants.notes = '';
    this.pruneEvaluatorOnlyPositions(draft);

    return draft;
  }

  private pruneEvaluatorOnlyPositions(evaluation: DesEvaluationCard): void {
    const selectedPositions = new Set(evaluation.participants.positions);
    evaluation.participants.evaluatorOnlyPositions = (
      evaluation.participants.evaluatorOnlyPositions ?? []
    ).filter((position) => selectedPositions.has(position));
    evaluation.positionScenarios = (evaluation.positionScenarios ?? [])
      .filter((item) => selectedPositions.has(item.position));
    this.ensurePositionScenarioConfigs(evaluation);
  }

  private ensurePositionScenarioConfigs(evaluation: DesEvaluationCard): void {
    const currentByPosition = new Map(
      (evaluation.positionScenarios ?? []).map((item) => [item.position, item])
    );
    const baseScenarios = this.buildScenariosForType(
      evaluation.modelType,
      evaluation.scenarios
    );

    evaluation.positionScenarios = evaluation.participants.positions.map((position) => {
      const current = currentByPosition.get(position);
      const currentByKey = new Map(
        (current?.scenarios ?? [])
          .filter((scenario) => !!scenario.key)
          .map((scenario) => [scenario.key as DesEvaluationScenarioKey, scenario])
      );

      return {
        position,
        scenarios: baseScenarios.map((baseScenario) => {
          const configuredScenario = baseScenario.key
            ? currentByKey.get(baseScenario.key)
            : null;
          const active = current
            ? !!configuredScenario && configuredScenario.active !== false
            : baseScenario.active !== false;

          return {
            ...baseScenario,
            id: configuredScenario?.id ?? baseScenario.id,
            backendId: configuredScenario?.backendId ?? baseScenario.backendId,
            name: configuredScenario?.name || baseScenario.name,
            weight: Number(configuredScenario?.weight ?? baseScenario.weight) || 0,
            active,
          };
        }),
      };
    });

    evaluation.positionScenarios.forEach((positionConfig) => {
      const isEvaluatorOnly = this.isPositionEvaluatorOnly(positionConfig.position, evaluation);

      positionConfig.scenarios.forEach((scenario) => {
        if (
          !scenario.key ||
          isEvaluatorOnly ||
          !this.isPositionScenarioStructurallyApplicable(
            positionConfig.position,
            scenario.key,
            evaluation
          )
        ) {
          scenario.active = false;
        } else if (
          this.normalizeKey(evaluation.modelType) === '90' &&
          scenario.key === 'BOSS_TO_EMPLOYEE'
        ) {
          scenario.active = true;
        }
      });
    });

    this.syncGlobalScenariosFromPositionConfigs(evaluation);
  }

  private syncGlobalScenariosFromPositionConfigs(evaluation: DesEvaluationCard): void {
    if (evaluation.participants.positions.length === 0) {
      return;
    }

    const weightByKey = new Map<DesEvaluationScenarioKey, number>();
    let contributingPositions = 0;

    evaluation.positionScenarios.forEach((positionConfig) => {
      if (this.isPositionEvaluatorOnly(positionConfig.position, evaluation)) {
        return;
      }

      let positionHasActiveScenarios = false;
      positionConfig.scenarios.forEach((scenario) => {
        if (
          scenario.key &&
          scenario.active !== false &&
          this.isPositionScenarioStructurallyApplicable(
            positionConfig.position,
            scenario.key,
            evaluation
          )
        ) {
          positionHasActiveScenarios = true;
          weightByKey.set(
            scenario.key,
            (weightByKey.get(scenario.key) ?? 0) + (Number(scenario.weight) || 0)
          );
        }
      });

      if (positionHasActiveScenarios) {
        contributingPositions++;
      }
    });

    const globalScenarios = this.buildScenariosForType(
      evaluation.modelType,
      evaluation.scenarios
    ).map((scenario) => {
      const totalWeight = scenario.key ? weightByKey.get(scenario.key) : undefined;
      const active = totalWeight !== undefined && contributingPositions > 0;

      return {
        ...scenario,
        weight: active
          ? Math.round(((totalWeight ?? 0) / contributingPositions) * 100) / 100
          : 0,
        active,
      };
    });

    const activeScenarios = globalScenarios.filter((scenario) => scenario.active);
    const roundedTotal = activeScenarios.reduce(
      (total, scenario) => total + scenario.weight,
      0
    );
    const lastScenario = activeScenarios[activeScenarios.length - 1];
    if (lastScenario && Math.abs(roundedTotal - 100) <= 0.05) {
      lastScenario.weight = Math.round((lastScenario.weight + 100 - roundedTotal) * 100) / 100;
    }

    evaluation.scenarios = globalScenarios;
  }

  private prepareEvaluationSnapshot(evaluation: DesEvaluationCard): DesEvaluationCard {
    const snapshot = this.cloneEvaluation(evaluation);

    this.normalizeEvaluationQuestionScopes(snapshot);
    this.pruneEvaluatorOnlyPositions(snapshot);
    this.ensurePositionScenarioConfigs(snapshot);
    snapshot.organizationId = this.selectedOrganizationId ?? snapshot.organizationId;
    snapshot.scaleLabel = this.getScaleLabel(snapshot.scaleId);
    snapshot.surveyType = snapshot.modelType;
    snapshot.useWeighting = true;
    snapshot.useAnonymity = true;
    snapshot.bigFactors.forEach((dimension) => {
      dimension.weight = Number(dimension.weight) || 0;
      dimension.factors.forEach((criterion) => {
        criterion.weight = Number(criterion.weight) || 0;
        criterion.requiredRatingLevel = this.normalizeRequiredRatingLevel(
          criterion.requiredRatingLevel
        );
      });
    });
    snapshot.scenarios.forEach((scenario) => {
      scenario.weight = Number(scenario.weight) || 0;
      scenario.active = scenario.active !== false;
    });

    return snapshot;
  }

  private buildModelPayload(evaluation: DesEvaluationCard): any {
    const modelTypeId =
      this.modelTypeOptions.find((item) => item.code === evaluation.modelType)?.id ??
      evaluation.modelTypeId ??
      0;
    const modelStateId =
      this.modelStateOptions.find((item) => item.code === evaluation.modelState)?.id ??
      evaluation.modelStateId ??
      this.modelStateOptions.find((item) => item.code === 'BORRADOR')?.id ??
      0;
    const calculationMethodId =
      evaluation.calculationMethodId ??
      this.calculationMethodOptions.find((item) => item.code === 'PROMEDIO_PONDERADO')?.id ??
      this.calculationMethodOptions[0]?.id ??
      0;
    this.ensurePositionScenarioConfigs(evaluation);
    const modelScenarios = this.buildScenariosForType(evaluation.modelType, evaluation.scenarios);
    const activeScenarioByKey = new Map<DesEvaluationScenarioKey, DesEvaluationScenario>();

    if (evaluation.participants.positions.length > 0) {
      evaluation.participants.positions.forEach((position) => {
        this.getActivePositionScenarios(position, evaluation).forEach((scenario) => {
          if (scenario.key && !activeScenarioByKey.has(scenario.key)) {
            activeScenarioByKey.set(scenario.key, scenario);
          }
        });
      });
    } else {
      modelScenarios
        .filter((scenario) => scenario.key && scenario.active !== false)
        .forEach((scenario) => activeScenarioByKey.set(scenario.key as DesEvaluationScenarioKey, scenario));
    }

    return {
      organizacionId: evaluation.organizationId,
      codigo: evaluation.modelCode ?? this.buildEntityCode('MOD', evaluation.name),
      version: evaluation.modelVersion ?? 1,
      nombre: evaluation.name.trim(),
      catalogoModeloNombre: evaluation.name.trim(),
      descripcion: evaluation.description.trim() || null,
      fechaInicio: evaluation.period.startDate,
      fechaCierre: evaluation.period.endDate,
      empleadosEspecificosIds: this.orderParticipantEmployeeIds(
        evaluation.participants.employeeIds
      ),
      tipoModeloId: modelTypeId,
      estadoModeloId: modelStateId,
      escalaPredeterminadaId: evaluation.scaleId,
      metodoCalculoId: calculationMethodId,
      usaPonderacion: true,
      usaAnonimato: true,
      minimoRespuestasAnonimas: evaluation.minimumAnonymousResponses ?? 3,
      dimensiones: evaluation.bigFactors.map((dimension, dimensionIndex) => ({
        ...(dimension.backendId ? { id: dimension.backendId } : {}),
        codigo: dimension.code ?? this.buildEntityCode('DIM', dimension.name),
        nombre: dimension.name.trim(),
        descripcion: dimension.description.trim() || null,
        ponderacion: Number(dimension.weight) || 0,
        orden: dimensionIndex + 1,
      })),
      escenarios: modelScenarios.map((scenario, scenarioIndex) => {
        const activeScenario = scenario.key
          ? activeScenarioByKey.get(scenario.key)
          : null;

        return {
          ...(scenario.backendId ? { id: scenario.backendId } : {}),
          escenarioId: this.getScenarioCatalogId(scenario),
          ponderacion: Number(activeScenario?.weight ?? scenario.weight) || 0,
          esAnonimo: evaluation.useAnonymity,
          minimoRespuestasAnonimas: evaluation.useAnonymity
            ? evaluation.minimumAnonymousResponses ?? 3
            : null,
          orden: scenarioIndex + 1,
          activo: !!activeScenario,
        };
      }),
      puestos: evaluation.participants.positions.map((position, positionIndex) => {
        const onlyEvaluator = this.isPositionEvaluatorOnly(position, evaluation);
        const positionScenarios = this.getActivePositionScenarios(position, evaluation);

        return {
          puestoId: this.getPositionId(position),
          soloEvaluador: onlyEvaluator,
          orden: positionIndex + 1,
          escenarios: onlyEvaluator
            ? []
            : positionScenarios.map((scenario, scenarioIndex) => ({
                escenarioId: this.getScenarioCatalogId(scenario),
                ponderacion: Number(scenario.weight) || 0,
                orden: scenarioIndex + 1,
                activo: true,
                criteriosPorDimension: evaluation.bigFactors.map((dimension) => ({
                  ...(dimension.backendId ? { dimensionId: dimension.backendId } : {}),
                  dimensionCodigo: dimension.code ?? this.buildEntityCode('DIM', dimension.name),
                  criterios: this.getFactorsForPositionAndScenario(
                    dimension,
                    position,
                    scenario.key ?? 'BOSS_TO_EMPLOYEE'
                  ).map(({ factor }, criterionIndex) => {
                    const factorScaleId = this.resolveFactorScaleId(factor, evaluation.scaleId);

                    return {
                      ...(factor.backendId ? { id: factor.backendId } : {}),
                      codigo: factor.code ?? this.buildEntityCode('CRI', factor.name),
                      nombre: factor.name.trim(),
                      descripcion: factor.description.trim() || null,
                      ponderacion: Number(factor.weight) || 0,
                      nivelExigencia: this.getFactorRequiredRatingLevel(factor),
                      tipoItemPredeterminadoId: this.getItemTypeId(factor.defaultQuestionType),
                      escalaPredeterminadaId: factorScaleId,
                      orden: criterionIndex + 1,
                      items: this.getQuestionsForPositionAndScenario(
                        factor,
                        position,
                        scenario.key ?? 'BOSS_TO_EMPLOYEE'
                      ).map(({ question }, questionIndex) => ({
                        ...(question.backendId ? { id: question.backendId } : {}),
                        codigo: question.code ??
                          this.buildEntityCode(`ITE${questionIndex + 1}`, question.label),
                        texto: question.label.trim(),
                        tipoItemId: this.getItemTypeId(question.type),
                        escalaId: this.resolveQuestionScaleId(
                          question,
                          factorScaleId,
                          evaluation.scaleId
                        ),
                        requerido: true,
                        permiteNoAplica: false,
                        orden: questionIndex + 1,
                      })),
                    };
                  }),
                })),
              })),
        };
      }),
    };
  }

  private buildEvaluationJson(evaluation: DesEvaluationCard | null): any {
    if (!evaluation) {
      return {};
    }

    return {
      evaluacion: {
        id: evaluation.id,
        organizacionId: evaluation.organizationId,
        nombre: evaluation.name,
        descripcion: evaluation.description,
        estado: this.getPeriodStateLabel(evaluation.status),
      },
      catalogoModelo: {
        nombre: evaluation.modelName,
        tipo: this.getSurveyTypeLabel(evaluation.modelType),
        estado: this.getModelStateLabel(evaluation.modelState),
        escala: this.getScaleLabel(evaluation.scaleId),
        usaPonderacion: 1,
        usaAnonimato: 1,
        tipoEncuesta: this.getSurveyTypeLabel(evaluation.modelType),
      },
      dimensiones: evaluation.bigFactors.map((bigFactor) => ({
        nombre: bigFactor.name,
        descripcion: bigFactor.description,
        ponderacion: Number(bigFactor.weight) || 0,
      })),
      modelosPorPuesto: evaluation.participants.positions.map((position) => ({
        puesto: position,
        soloEvaluador: this.isPositionEvaluatorOnly(position, evaluation),
        escenarios: this.isPositionEvaluatorOnly(position, evaluation)
          ? []
          : this.getActivePositionScenarios(position, evaluation)
            .map((scenario) => {
              const scenarioKey = scenario.key ?? 'BOSS_TO_EMPLOYEE';

              return {
                clave: scenarioKey,
                nombre: scenario.name,
                ponderacion: scenario.weight,
                dimensiones: evaluation.bigFactors.map((bigFactor) => ({
                  nombre: bigFactor.name,
                  descripcion: bigFactor.description,
                  ponderacion: Number(bigFactor.weight) || 0,
                  criteriosEvaluacion: this.getFactorsForPositionAndScenario(
                    bigFactor,
                    position,
                    scenarioKey
                  ).map(({ factor }) => ({
                    nombre: factor.name,
                    descripcion: factor.description,
                    ponderacion: Number(factor.weight) || 0,
                    nivelExigencia: this.getFactorRequiredRatingLevel(factor),
                    tipoItemEvaluativoPredeterminado: factor.defaultQuestionType,
                    itemsEvaluativos: this.getQuestionsForPositionAndScenario(
                      factor,
                      position,
                      scenarioKey
                    ).map(({ question }) => ({
                      texto: question.label,
                      tipo: question.type,
                      requerido: true,
                      opciones: question.options,
                    })),
                  })),
                })),
              };
            }),
      })),
      escenariosPorPuesto: evaluation.participants.positions.map((position) => ({
        puesto: position,
        soloEvaluador: this.isPositionEvaluatorOnly(position, evaluation),
        totalPonderacion: this.isPositionEvaluatorOnly(position, evaluation)
          ? 0
          : this.getPositionScenarioWeightTotal(position, evaluation),
        escenarios: this.getPositionScenarioOptions(position, evaluation).map((scenario) => ({
          clave: scenario.key,
          nombre: scenario.name,
          ponderacion: Number(scenario.weight) || 0,
          activo: scenario.active !== false &&
            !!scenario.key &&
            this.isPositionScenarioStructurallyApplicable(position, scenario.key, evaluation),
          aplica: !!scenario.key &&
            this.isPositionScenarioStructurallyApplicable(position, scenario.key, evaluation),
        })),
      })),
      perspectivas: evaluation.scenarios.map((scenario) => ({
        clave: scenario.key,
        nombre: scenario.name,
        ponderacion: Number(scenario.weight) || 0,
        activo: scenario.active !== false,
      })),
      fechasEvaluacion: {
        fechaInicio: evaluation.period.startDate,
        fechaCierre: evaluation.period.endDate,
      },
      participantes: {
        soloActivos: evaluation.participants.onlyActive,
        puestos: evaluation.participants.positions,
        puestosSoloEvaluadores: evaluation.participants.positions.filter((position) =>
          this.isPositionEvaluatorOnly(position, evaluation)
        ),
        empleados: this.employees
          .filter((employee) => evaluation.participants.employeeIds.includes(employee.id))
          .map((employee) => ({
            id: employee.id,
            nombre: employee.fullName,
            cargo: employee.cargo,
          })),
        demograficos: evaluation.participants.demographicFilters
          .filter((filter) => filter.selectedValues.length > 0)
          .map((filter) => ({
            campo: filter.fieldName,
            valores: filter.selectedValues,
          })),
      },
      itemsEvaluativosAbiertosEjemplo: evaluation.openQuestionExamples,
      muestraColaboradores: this.getMatchedEmployeesPreview(evaluation).map((employee) => ({
        id: employee.id,
        nombre: employee.fullName,
        cargo: employee.cargo,
        correo: employee.email,
        demograficos: employee.demographicValues,
      })),
    };
  }

  private buildPerformanceEmailPayload(
    evaluation: DesEvaluationCard,
    assignment: DesEvaluationSendAssignment,
    organizationId: number
  ): Record<string, unknown> {
    const sendsByEvaluateeId = new Map(
      assignment.surveySends.map((send) => [send.evaluateeId, send])
    );
    const evaluations = assignment.evaluateeIds.map((evaluateeId) => {
      const employee = this.employees.find((item) => item.id === evaluateeId);
      const send = sendsByEvaluateeId.get(evaluateeId);
      const surveyCode = send?.surveyCode ?? null;
      const scenarioCode = employee
        ? this.getEvaluationScenarioForPair(
            evaluation,
            assignment.evaluator,
            employee
          )
        : null;
      const scenario = scenarioCode
        ? evaluation.scenarios.find((item) => item.key === scenarioCode)
        : null;
      const scenarioId = scenarioCode
        ? this.scenarioCatalogOptions.find((item) => item.code === scenarioCode)?.id ??
          (scenario ? this.getScenarioCatalogId(scenario) : 0)
        : 0;
      const surveyUrl = surveyCode
        ? `https://justlink360.net/#/completeclima/completedesempenoalone?key=${encodeURIComponent(surveyCode)}&id_emp=${encodeURIComponent(assignment.evaluator.id)}`
        : null;

      return {
        empleadoId: evaluateeId,
        nombreEmpleado: employee?.fullName ?? `#${evaluateeId}`,
        escenarioId: scenarioId,
        escenarioCodigo: scenarioCode,
        escenarioNombre: scenarioCode
          ? this.getQuestionScenarioLabel(scenarioCode)
          : null,
        codigoEncuestaEmpleado: surveyCode,
        urlEncuesta: surveyUrl,
      };
    });
    const evaluationListHtml = evaluations
      .map((item) => {
        const employeeName = this.escapeHtml(item.nombreEmpleado);
        const surveyUrl = item.urlEncuesta
          ? this.escapeHtml(item.urlEncuesta)
          : '';
        const link = surveyUrl
          ? `<a href="${surveyUrl}" target="_blank" style="color:#2563eb;word-break:break-all;text-decoration:underline;">${surveyUrl}</a>`
          : '<span style="color:#b42318;">Enlace aún no disponible</span>';

        return `
          <li style="margin:0 0 16px 0;">
            <strong style="display:block;margin-bottom:4px;color:#1f2937;">${employeeName}</strong>
            ${link}
          </li>`;
      })
      .join('');
    const template = this.getPerformanceEmailTemplate();
    const htmlFinal = this.renderPerformanceEmailTemplate(template, {
      nombre_receptor: this.escapeHtml(assignment.evaluator.fullName),
      nombre_evaluacion: this.escapeHtml(evaluation.name),
      fecha_cierre: this.escapeHtml(
        this.formatPerformanceClosingDate(evaluation.period.endDate)
      ),
      lista_evaluaciones: evaluationListHtml,
    });

    return {
      destinatario: assignment.evaluator.email,
      asunto: `Evaluaciones de desempeño asignadas - ${evaluation.name}`,
      mensajeHtml: htmlFinal,
      organizationId,
      IdModelo: evaluation.id,
      IdEmpleado: assignment.evaluator.id,
      evaluaciones: evaluations,
    };
  }

  private getPerformanceEmailTemplate(): string {
    return `
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Evaluaciones de desempeño asignadas</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f6f8;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
            Tienes evaluaciones de desempeño asignadas.
          </div>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f4f6f8;">
            <tr>
              <td align="center" style="padding:24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="620" style="width:100%;max-width:620px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(16,24,40,.08);">
                  <tr>
                    <td style="height:8px;background:#2563eb;"></td>
                  </tr>
                  <tr>
                    <td style="padding:32px;font-family:Arial,sans-serif;color:#374151;">
                      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.35;color:#1f2937;">
                        Evaluaciones de desempeño asignadas
                      </h1>
                      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                        Hola <strong>{{DATOS["nombre_receptor"]}}</strong>,
                      </p>
                      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                        Amablemente te informamos que tienes evaluaciones asignadas correspondientes a
                        <strong>{{DATOS["nombre_evaluacion"]}}</strong>.
                      </p>
                      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
                        La fecha límite para completarlas es el
                        <strong>{{DATOS["fecha_cierre"]}}</strong>.
                      </p>
                      <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">
                        Empleados a evaluar:
                      </p>
                      <ol style="margin:0 0 24px;padding-left:24px;font-size:15px;line-height:1.5;">
                        {{DATOS["lista_evaluaciones"]}}
                      </ol>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#667085;">
                        Gracias por dedicar el tiempo necesario y responder con objetividad.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:16px 24px;border-top:1px solid #eef2f7;font-family:Arial,sans-serif;font-size:12px;color:#98a2b3;">
                      Just-Link
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`;
  }

  private renderPerformanceEmailTemplate(
    template: string,
    data: Record<string, string>
  ): string {
    const pattern = /{{\s*DATOS\["([^"]+)"\]\s*}}/g;
    return template.replace(pattern, (_match, property: string) => data[property] ?? '');
  }

  private formatPerformanceClosingDate(value: string): string {
    if (!value) {
      return 'Sin fecha definida';
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('es-GT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private async loadExistingSurveySendsForAssignments(modelId: number): Promise<void> {
    await Promise.all(
      this.sendAssignments.map(async (assignment) => {
        try {
          await this.refreshAssignmentSendState(assignment, modelId);
        } catch (error) {
          console.error(
            `Error al consultar los envíos del empleado ${assignment.evaluator.id}:`,
            error
          );
          assignment.sendStatus = 'PENDIENTE';
          assignment.persistedEvaluateeIds = [];
          assignment.sendRecordIds = [];
          assignment.surveySends = [];
          assignment.lastSent = null;
        }
      })
    );
  }

  private async createMissingSurveySends(
    assignment: DesEvaluationSendAssignment,
    modelId: number
  ): Promise<{ created: number; existing: number }> {
    await this.refreshAssignmentSendState(assignment, modelId);

    const persistedIds = new Set(assignment.persistedEvaluateeIds);
    const missingEvaluateeIds = assignment.evaluateeIds.filter(
      (employeeId) => !persistedIds.has(employeeId)
    );
    const existing = assignment.evaluateeIds.length - missingEvaluateeIds.length;

    if (missingEvaluateeIds.length === 0) {
      return { created: 0, existing };
    }

    const organizationId =
      this.selectedOrganizationId ??
      this.sendPreviewEvaluation?.organizationId ??
      assignment.evaluator.organizationId;

    if (!organizationId) {
      throw new Error('No se encontró la organización seleccionada para crear los envíos.');
    }

    const response = await this.organizacionService.createDesempenoIndividualSurveySend({
      organizationId,
      IdModelo: modelId,
      IdEmpleado: assignment.evaluator.id,
      Estado: 'CREADO',
      IdsEmpleadosEnviar: missingEvaluateeIds,
    });
    const responsePayload = this.extractPayload(response);
    const createdRecords = this.extractCollection(response)
      .map((item) =>
        this.normalizeSurveySendRecord(item, modelId, assignment.evaluator.id)
      )
      .filter((item) => item.evaluateeId > 0);
    const responseTotal = Number(responsePayload?.total);
    const created = Number.isFinite(responseTotal)
      ? responseTotal
      : createdRecords.length || missingEvaluateeIds.length;

    if (createdRecords.length > 0) {
      this.applySurveySendRecordsToAssignment(
        assignment,
        [...assignment.surveySends, ...createdRecords]
      );
    } else {
      assignment.persistedEvaluateeIds = Array.from(
        new Set([...assignment.persistedEvaluateeIds, ...missingEvaluateeIds])
      );
      assignment.sendStatus = 'CREADO';
    }

    try {
      await this.refreshAssignmentSendState(assignment, modelId, true);
    } catch (error) {
      console.error(
        `Los envíos del empleado ${assignment.evaluator.id} se crearon, pero no se pudieron refrescar:`,
        error
      );
    }

    return { created, existing };
  }

  private async refreshAssignmentSendState(
    assignment: DesEvaluationSendAssignment,
    modelId: number,
    preserveCurrentStateWhenEmpty = false
  ): Promise<void> {
    const records = await this.getSurveySendRecords(modelId, assignment.evaluator.id);
    if (records.length > 0 || !preserveCurrentStateWhenEmpty) {
      this.applySurveySendRecordsToAssignment(assignment, records);
    }
  }

  private async getSurveySendRecords(
    modelId: number,
    evaluatorId: number
  ): Promise<DesEvaluationSurveySendRecord[]> {
    let response: any;
    const organizationId =
      this.selectedOrganizationId ?? this.sendPreviewEvaluation?.organizationId;

    if (!organizationId) {
      throw new Error('No se encontró la organización seleccionada para consultar los envíos.');
    }

    try {
      response = await this.organizacionService.getDesempenoSurveySends(
        modelId,
        evaluatorId,
        organizationId
      );
    } catch (error: any) {
      if (Number(error?.response?.status) === 404) {
        return [];
      }
      throw error;
    }

    const records = this.extractCollection(response)
      .map((item) => this.normalizeSurveySendRecord(item, modelId, evaluatorId))
      .filter((item) => item.id > 0 || item.evaluateeId > 0);

    const detailedRecords = await Promise.all(
      records.map(async (record) => {
        if (!record.id) {
          return record;
        }

        try {
          const detailResponse =
            await this.organizacionService.getDesempenoSurveySendById(record.id);
          const detailPayload = this.extractPayload(detailResponse);
          const detail = Array.isArray(detailPayload) ? detailPayload[0] : detailPayload;

          return this.normalizeSurveySendRecord(
            detail ? { ...record, ...detail } : record,
            modelId,
            evaluatorId
          );
        } catch (error) {
          console.error(`Error al consultar el detalle del envío ${record.id}:`, error);
          return record;
        }
      })
    );

    return detailedRecords.filter((record) => record.evaluateeId > 0);
  }

  private normalizeSurveySendRecord(
    item: any,
    modelId: number,
    evaluatorId: number
  ): DesEvaluationSurveySendRecord {
    return {
      id: Number(
        item?.id ??
        item?.Id ??
        item?.idEnvioEncuesta ??
        item?.IdEnvioEncuesta ??
        0
      ),
      modelId: Number(item?.modeloId ?? item?.IdModelo ?? item?.modelId ?? modelId),
      evaluatorId: Number(
        item?.empleadoId ?? item?.IdEmpleado ?? item?.evaluatorId ?? evaluatorId
      ),
      evaluateeId: Number(
        item?.empleadoEnviarId ??
        item?.IdEmpleadoEnviar ??
        item?.idEmpleadoEnviar ??
        item?.EmpleadoEnviarId ??
        item?.evaluateeId ??
        0
      ),
      status: this.normalizeSurveySendStatus(
        item?.estado ?? item?.Estado ?? item?.status
      ),
      surveyCode: this.toOptionalText(
        item?.codigoEncuestaEmpleado ??
        item?.CodigoEncuestaEmpleado ??
        item?.surveyCode
      ),
      date: this.formatSurveySendDate(
        item?.fechaEnvio ??
        item?.FechaEnvio ??
        item?.fechaModificacion ??
        item?.FechaModificacion ??
        item?.fechaCreacion ??
        item?.FechaCreacion ??
        item?.date
      ),
      startedDate: this.formatSurveySendDate(
        item?.fechaInicio ??
        item?.FechaInicio ??
        item?.startedDate
      ),
      finishedDate: this.formatSurveySendDate(
        item?.fechaFinalizacion ??
        item?.FechaFinalizacion ??
        item?.finishedDate
      ),
    };
  }

  private normalizeSurveySendStatus(value: unknown): DesEvaluationSendStatus {
    const status = this.normalizeKey(String(value ?? ''));

    if (status.includes('ERROR') || status.includes('FALL')) return 'ERROR';
    if (status.includes('COMPLET') || status.includes('FINALIZ')) return 'COMPLETADO';
    if (status.includes('CONTEST')) return 'RESPONDIDO';
    if (status.includes('RESPOND')) return 'RESPONDIDO';
    if (status.includes('INICI')) return 'INICIADO';
    if (status.includes('ENVIAD')) return 'ENVIADO';
    if (status.includes('PENDIENT')) return 'PENDIENTE';
    return 'CREADO';
  }

  private formatSurveySendDate(value: unknown): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
  }

  private applySurveySendRecordsToAssignment(
    assignment: DesEvaluationSendAssignment,
    records: DesEvaluationSurveySendRecord[]
  ): void {
    const latestByEvaluateeId = new Map<number, DesEvaluationSurveySendRecord>();

    records.forEach((record) => {
      const current = latestByEvaluateeId.get(record.evaluateeId);
      if (!current || record.id >= current.id) {
        latestByEvaluateeId.set(record.evaluateeId, record);
      }
    });

    const persistedRecords = Array.from(latestByEvaluateeId.values());
    const selectedIds = new Set(assignment.evaluateeIds);
    const selectedRecords = persistedRecords.filter((record) =>
      selectedIds.has(record.evaluateeId)
    );
    const statuses = selectedRecords.map((record) => record.status);

    assignment.persistedEvaluateeIds = persistedRecords.map(
      (record) => record.evaluateeId
    );
    assignment.sendRecordIds = persistedRecords
      .map((record) => record.id)
      .filter((id) => id > 0);
    assignment.surveySends = persistedRecords;
    assignment.lastSent =
      [...selectedRecords]
        .sort((left, right) => right.id - left.id)
        .find((record) => !!record.date)?.date ?? null;

    if (assignment.evaluateeIds.length === 0) {
      assignment.sendStatus = 'PENDIENTE';
    } else if (selectedRecords.length < assignment.evaluateeIds.length) {
      assignment.sendStatus = 'PENDIENTE';
    } else if (statuses.some((status) => status === 'ERROR')) {
      assignment.sendStatus = 'ERROR';
    } else if (statuses.every((status) => status === 'COMPLETADO')) {
      assignment.sendStatus = 'COMPLETADO';
    } else if (
      statuses.every((status) => status === 'RESPONDIDO' || status === 'COMPLETADO')
    ) {
      assignment.sendStatus = 'RESPONDIDO';
    } else if (
      statuses.every((status) =>
        status === 'ENVIADO' ||
        status === 'INICIADO' ||
        status === 'RESPONDIDO' ||
        status === 'COMPLETADO'
      )
    ) {
      assignment.sendStatus = 'ENVIADO';
    } else if (statuses.length > 0) {
      assignment.sendStatus = 'CREADO';
    } else {
      assignment.sendStatus = 'PENDIENTE';
    }
  }

  private isAnsweredSurveySend(record: DesEvaluationSurveySendRecord): boolean {
    return (
      record.status === 'RESPONDIDO' ||
      record.status === 'COMPLETADO' ||
      !!record.finishedDate
    );
  }

  private isStartedSurveySend(record: DesEvaluationSurveySendRecord): boolean {
    return (
      this.isAnsweredSurveySend(record) ||
      record.status === 'INICIADO' ||
      !!record.startedDate
    );
  }

  private buildSendPreviewJson(evaluation: DesEvaluationCard | null): any {
    if (!evaluation) {
      return {};
    }

    const assignments = this.sendAssignments.length > 0
      ? this.sendAssignments
      : this.buildSendAssignments(evaluation).slice(0, 6);

    return {
      evaluacionId: evaluation.id,
      nombreEvaluacion: evaluation.name,
      organizacionId: evaluation.organizationId,
      fechasEvaluacion: {
        fechaInicio: evaluation.period.startDate,
        fechaCierre: evaluation.period.endDate,
      },
      escala: {
        id: evaluation.scaleId,
        nombre: evaluation.scaleLabel,
        niveles:
          this.getScaleById(evaluation.scaleId)?.levels.map((level) => ({
            value: level.value,
            label: this.getScaleLevelLabel(level),
          })) ?? [],
      },
      asignacionesEjemplo: assignments.map((assignment) => ({
        idEvaluador: assignment.evaluator.id,
        evaluador: assignment.evaluator.fullName,
        correo: assignment.evaluator.email,
        demograficos: assignment.evaluator.demographicValues,
        tipoEnvio: assignment.sendType,
        estadoEnvio: assignment.sendStatus,
        totalAEvaluar: assignment.evaluateeIds.length,
        evaluados: assignment.evaluateeIds.map((employeeId) => {
          const evaluatee = this.employees.find((employee) => employee.id === employeeId);
          const scenarioKey = evaluatee
            ? this.getEvaluationScenarioForPair(evaluation, assignment.evaluator, evaluatee)
            : null;
          const evaluativeItems = evaluatee && scenarioKey
            ? this.getApplicableQuestionsForPair(evaluation, evaluatee, scenarioKey)
            : [];

          return {
            idEmpleado: employeeId,
            nombre: evaluatee?.fullName ?? `#${employeeId}`,
            puesto: evaluatee?.cargo ?? null,
            escenario: scenarioKey
              ? {
                  clave: scenarioKey,
                  nombre: this.getQuestionScenarioLabel(scenarioKey),
                }
              : null,
            totalItemsEvaluativos: evaluativeItems.length,
            itemsEvaluativos: evaluativeItems,
          };
        }),
      })),
    };
  }

  private buildSendAssignments(evaluation: DesEvaluationCard): DesEvaluationSendAssignment[] {
    const population = this.getEvaluationHierarchyPopulation(evaluation);
    const hierarchyLevels = this.buildEmployeeHierarchyLevels(population);

    return population
      .map((evaluator) => ({
        evaluator,
        evaluatees: this.getHierarchyEvaluateesForEvaluator(evaluation, evaluator, population),
      }))
      .filter((assignment) => assignment.evaluatees.length > 0)
      .map((assignment) => ({
        id: this.generateId(),
        evaluator: assignment.evaluator,
        evaluateeIds: assignment.evaluatees.map((employee) => employee.id),
        hierarchyLevel: hierarchyLevels.get(assignment.evaluator.id) ?? 0,
        sendType: assignment.evaluator.preferredSendType ??
          (assignment.evaluator.email ? 'CORREO' : 'WHATSAPP'),
        sendStatus: 'PENDIENTE',
        lastSent: null,
        persistedEvaluateeIds: [],
        sendRecordIds: [],
        surveySends: [],
        isCreating: false,
        isSending: false,
      }));
  }

  private rebuildModelDiagram(evaluation: DesEvaluationCard): void {
    const assignments = this.buildSendAssignments(evaluation);
    const population = this.getEvaluationHierarchyPopulation(evaluation);
    const employeesById = new Map(population.map((employee) => [employee.id, employee]));
    const nodeDataById = new Map<number, DesEvaluationDiagramNodeData>();
    const directedRelations = new Map<string, {
      sourceId: number;
      targetId: number;
      scenarioKeys: Set<DesEvaluationScenarioKey>;
    }>();
    const evaluateeIds = new Set<number>();
    let assignmentCount = 0;
    let selfEvaluationCount = 0;

    const ensureNode = (employee: DesEvaluationEmployee): DesEvaluationDiagramNodeData => {
      const current = nodeDataById.get(employee.id);
      if (current) {
        return current;
      }

      const data: DesEvaluationDiagramNodeData = {
        employeeId: employee.id,
        fullName: employee.fullName,
        initials: this.getEmployeeInitials(employee.fullName),
        position: employee.cargo,
        email: employee.email,
        isEvaluator: false,
        isEvaluatee: false,
        hasSelfEvaluation: false,
        evaluatesCount: 0,
        evaluatedByCount: 0,
        scenarioKeys: [],
      };

      nodeDataById.set(employee.id, data);
      return data;
    };

    const addScenarioToNode = (
      data: DesEvaluationDiagramNodeData,
      scenarioKey: DesEvaluationScenarioKey
    ): void => {
      if (!data.scenarioKeys.includes(scenarioKey)) {
        data.scenarioKeys.push(scenarioKey);
      }
    };

    assignments.forEach((assignment) => {
      const evaluatorData = ensureNode(assignment.evaluator);
      evaluatorData.isEvaluator = true;

      assignment.evaluateeIds.forEach((evaluateeId) => {
        const evaluatee = employeesById.get(evaluateeId) ??
          this.employees.find((employee) => employee.id === evaluateeId);

        if (!evaluatee) {
          return;
        }

        const evaluateeData = ensureNode(evaluatee);
        const scenarioKey = this.getEvaluationScenarioForPair(
          evaluation,
          assignment.evaluator,
          evaluatee
        );

        assignmentCount += 1;
        evaluateeIds.add(evaluatee.id);
        evaluatorData.evaluatesCount += 1;
        evaluateeData.evaluatedByCount += 1;
        evaluateeData.isEvaluatee = true;
        addScenarioToNode(evaluatorData, scenarioKey);
        addScenarioToNode(evaluateeData, scenarioKey);

        if (assignment.evaluator.id === evaluatee.id) {
          evaluatorData.hasSelfEvaluation = true;
          selfEvaluationCount += 1;
          return;
        }

        const relationKey = `${assignment.evaluator.id}->${evaluatee.id}`;
        const relation = directedRelations.get(relationKey) ?? {
          sourceId: assignment.evaluator.id,
          targetId: evaluatee.id,
          scenarioKeys: new Set<DesEvaluationScenarioKey>(),
        };
        relation.scenarioKeys.add(scenarioKey);
        directedRelations.set(relationKey, relation);
      });
    });

    const processedRelations = new Set<string>();
    const relations: DesEvaluationDiagramRelationData[] = [];

    directedRelations.forEach((relation, key) => {
      if (processedRelations.has(key)) {
        return;
      }

      const reverseKey = `${relation.targetId}->${relation.sourceId}`;
      const reverseRelation = directedRelations.get(reverseKey);
      const scenarioKeys = new Set<DesEvaluationScenarioKey>(relation.scenarioKeys);

      if (reverseRelation) {
        reverseRelation.scenarioKeys.forEach((scenarioKey) => scenarioKeys.add(scenarioKey));
      }

      let sourceId = relation.sourceId;
      let targetId = relation.targetId;

      if (reverseRelation) {
        const sourceEmployee = employeesById.get(sourceId);
        if (sourceEmployee?.managerId === targetId) {
          sourceId = relation.targetId;
          targetId = relation.sourceId;
        }
      }

      const source = nodeDataById.get(sourceId);
      const target = nodeDataById.get(targetId);

      if (!source || !target) {
        processedRelations.add(key);
        processedRelations.add(reverseKey);
        return;
      }

      relations.push({
        id: `diagram-relation-${sourceId}-${targetId}`,
        sourceId,
        targetId,
        sourceName: source.fullName,
        targetName: target.fullName,
        sourcePosition: source.position,
        targetPosition: target.position,
        scenarioKeys: Array.from(scenarioKeys),
        bidirectional: !!reverseRelation,
      });

      processedRelations.add(key);
      processedRelations.add(reverseKey);
    });

    this.modelDiagramAssignments = assignments;
    this.modelDiagramRelations = relations;
    this.modelDiagramNodes = Array.from(nodeDataById.values()).map((data) => ({
      id: `employee-${data.employeeId}`,
      label: data.fullName,
      data,
    }));
    this.modelDiagramLinks = relations.map((relation) => ({
      id: relation.id,
      source: `employee-${relation.sourceId}`,
      target: `employee-${relation.targetId}`,
      label: this.getModelDiagramScenarioLabels(relation.scenarioKeys),
      data: relation,
    }));
    this.selectedModelDiagramNode =
      this.modelDiagramNodes.find((node) => (node.data as DesEvaluationDiagramNodeData).isEvaluator) ??
      this.modelDiagramNodes[0] ??
      null;
    this.modelDiagramSummary = {
      evaluators: assignments.length,
      evaluatees: evaluateeIds.size,
      assignments: assignmentCount,
      selfEvaluations: selfEvaluationCount,
      bidirectionalRelations: relations.filter((relation) => relation.bidirectional).length,
    };
  }

  private clearModelDiagram(): void {
    this.modelPreviewEvaluation = null;
    this.modelDiagramAssignments = [];
    this.modelDiagramNodes = [];
    this.modelDiagramLinks = [];
    this.modelDiagramRelations = [];
    this.selectedModelDiagramNode = null;
    this.modelDiagramSummary = {
      evaluators: 0,
      evaluatees: 0,
      assignments: 0,
      selfEvaluations: 0,
      bidirectionalRelations: 0,
    };
  }

  private getEmployeeInitials(fullName: string): string {
    const initials = fullName
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || 'NA';
  }

  private getEvaluationHierarchyPopulation(evaluation: DesEvaluationCard | null): DesEvaluationEmployee[] {
    if (!evaluation) {
      return [];
    }

    return this.sortEmployeesByHierarchy(this.getMatchedEmployees(evaluation));
  }

  private sortEmployeesByHierarchy(employees: DesEvaluationEmployee[]): DesEvaluationEmployee[] {
    const hierarchyIndex = this.buildHierarchyIndex(employees);
    const ordered: DesEvaluationEmployee[] = [];
    const visited = new Set<number>();

    const visit = (employee: DesEvaluationEmployee): void => {
      if (visited.has(employee.id)) {
        return;
      }

      visited.add(employee.id);
      ordered.push(employee);
      this.sortEmployeesByName(hierarchyIndex.childrenByManagerId.get(employee.id) ?? []).forEach(visit);
    };

    this.sortEmployeesByName(hierarchyIndex.roots).forEach(visit);
    this.sortEmployeesByName(employees).forEach(visit);

    return ordered;
  }

  private buildEmployeeHierarchyLevels(employees: DesEvaluationEmployee[]): Map<number, number> {
    const hierarchyIndex = this.buildHierarchyIndex(employees);
    const levels = new Map<number, number>();
    const visited = new Set<number>();

    const visit = (employee: DesEvaluationEmployee, level: number): void => {
      if (visited.has(employee.id)) {
        return;
      }

      visited.add(employee.id);
      levels.set(employee.id, level);
      this.sortEmployeesByName(hierarchyIndex.childrenByManagerId.get(employee.id) ?? []).forEach((child) => {
        visit(child, level + 1);
      });
    };

    this.sortEmployeesByName(hierarchyIndex.roots).forEach((employee) => visit(employee, 0));
    this.sortEmployeesByName(employees).forEach((employee) => visit(employee, 0));

    return levels;
  }

  private buildHierarchyIndex(employees: DesEvaluationEmployee[]): {
    childrenByManagerId: Map<number, DesEvaluationEmployee[]>;
    roots: DesEvaluationEmployee[];
  } {
    const employeeIds = new Set(employees.map((employee) => employee.id));
    const childrenByManagerId = new Map<number, DesEvaluationEmployee[]>();
    const roots: DesEvaluationEmployee[] = [];

    employees.forEach((employee) => {
      const managerIdInPopulation =
        employee.managerId && employeeIds.has(employee.managerId)
          ? employee.managerId
          : null;

      if (!managerIdInPopulation) {
        roots.push(employee);
        return;
      }

      const children = childrenByManagerId.get(managerIdInPopulation) ?? [];
      children.push(employee);
      childrenByManagerId.set(managerIdInPopulation, children);
    });

    return { childrenByManagerId, roots };
  }

  private sortEmployeesByName(employees: DesEvaluationEmployee[]): DesEvaluationEmployee[] {
    return [...employees].sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  private orderParticipantEmployeeIds(employeeIds: Iterable<number>): number[] {
    const selectedIds = new Set(
      Array.from(employeeIds)
        .map((employeeId) => Number(employeeId))
        .filter((employeeId) => Number.isInteger(employeeId) && employeeId > 0)
    );
    const orderedIds = this.employees
      .filter((employee) => selectedIds.delete(employee.id))
      .map((employee) => employee.id);

    return [...orderedIds, ...Array.from(selectedIds)];
  }

  private getHierarchyEvaluateesForEvaluator(
    evaluation: DesEvaluationCard | null,
    evaluator: DesEvaluationEmployee,
    currentPopulation?: DesEvaluationEmployee[]
  ): DesEvaluationEmployee[] {
    const population = currentPopulation ?? this.getEvaluationHierarchyPopulation(evaluation);
    const employeesById = new Map(population.map((employee) => [employee.id, employee]));
    const evaluateeIds = this.getHierarchyEvaluateeIds(evaluation, evaluator, population);

    return evaluateeIds
      .map((employeeId) => employeesById.get(employeeId))
      .filter((employee): employee is DesEvaluationEmployee => !!employee);
  }

  private getEvaluationScenarioForPair(
    evaluation: DesEvaluationCard,
    evaluator: DesEvaluationEmployee,
    evaluatee: DesEvaluationEmployee
  ): DesEvaluationScenarioKey {
    if (evaluator.id === evaluatee.id) {
      return 'SELF';
    }

    if (evaluatee.managerId === evaluator.id) {
      return 'BOSS_TO_EMPLOYEE';
    }

    if (evaluator.managerId === evaluatee.id) {
      return 'EMPLOYEE_TO_BOSS';
    }

    if (
      evaluator.managerId !== null &&
      evaluator.managerId === evaluatee.managerId
    ) {
      return 'PEER';
    }

    return (evaluatee.cargo
      ? this.getActivePositionScenarios(evaluatee.cargo, evaluation)[0]?.key
      : null) ??
      this.getEvaluationScenarioOptions(evaluation)[0]?.key
      ?? 'BOSS_TO_EMPLOYEE';
  }

  private getApplicableQuestionsForPair(
    evaluation: DesEvaluationCard,
    evaluatee: DesEvaluationEmployee,
    scenarioKey: DesEvaluationScenarioKey
  ): Array<{
    id: number;
    dimension: string;
    criterioEvaluacion: string;
    nivelExigencia: number;
    texto: string;
    tipo: string;
    requerido: boolean;
    opciones: string[];
  }> {
    return evaluation.bigFactors.flatMap((bigFactor) =>
      bigFactor.factors.flatMap((factor) => {
        const factorAppliesToPosition =
          factor.positionScope !== 'SELECTED' ||
          (!!evaluatee.cargo && this.normalizeFactorPositions(factor).includes(evaluatee.cargo));

        if (!factorAppliesToPosition) {
          return [];
        }

        return factor.questions
          .filter((question) => {
            const appliesToScenario = this.normalizeQuestionScenarioKeys(question, evaluation.modelType)
              .includes(scenarioKey);
            const appliesToPosition =
              question.positionScope !== 'SELECTED' ||
              (!!evaluatee.cargo && this.normalizeQuestionPositions(question).includes(evaluatee.cargo));

            return appliesToScenario && appliesToPosition;
          })
          .map((question) => ({
            id: question.id,
            dimension: bigFactor.name,
            criterioEvaluacion: factor.name,
            nivelExigencia: this.getFactorRequiredRatingLevel(factor),
            texto: question.label,
            tipo: question.type,
            requerido: true,
            opciones: question.options,
          }));
      })
    );
  }

  private getHierarchyEvaluateeIds(
    evaluation: DesEvaluationCard | null,
    evaluator: DesEvaluationEmployee,
    population: DesEvaluationEmployee[]
  ): number[] {
    const evaluateeIds = new Set<number>();
    const addDirectReports = () => this.getDirectReports(evaluator, population).forEach((employee) => evaluateeIds.add(employee.id));
    const addManagers = () => this.getDirectManagers(evaluator, population).forEach((employee) => evaluateeIds.add(employee.id));
    const addSelf = () => evaluateeIds.add(evaluator.id);
    const addPeers = () => this.getPeerEmployees(evaluator, population).forEach((employee) => evaluateeIds.add(employee.id));

    this.applyScenarioBasedAssignments(
      evaluation,
      addDirectReports,
      addManagers,
      addSelf,
      addPeers
    );

    const employeesById = new Map(population.map((employee) => [employee.id, employee]));

    return Array.from(evaluateeIds).filter((employeeId) => {
      const employee = employeesById.get(employeeId);
      if (!employee?.cargo || this.isPositionEvaluatorOnly(employee.cargo, evaluation)) {
        return false;
      }

      const scenarioKey = evaluation
        ? this.getEvaluationScenarioForPair(evaluation, evaluator, employee)
        : null;

      return !!scenarioKey &&
        this.isPositionScenarioApplicable(employee.cargo, scenarioKey, evaluation);
    });
  }

  private applyScenarioBasedAssignments(
    evaluation: DesEvaluationCard | null,
    addDirectReports: () => void,
    addManagers: () => void,
    addSelf: () => void,
    addPeers: () => void
  ): void {
    const scenarioKeys = new Set(
      this.getEvaluationScenarioOptions(evaluation).map((scenario) => scenario.key)
    );

    if (scenarioKeys.has('BOSS_TO_EMPLOYEE')) {
      addDirectReports();
    }

    if (scenarioKeys.has('EMPLOYEE_TO_BOSS')) {
      addManagers();
    }

    if (scenarioKeys.has('SELF')) {
      addSelf();
    }

    if (scenarioKeys.has('PEER')) {
      addPeers();
    }
  }

  private getDirectReports(manager: DesEvaluationEmployee, population: DesEvaluationEmployee[]): DesEvaluationEmployee[] {
    return population
      .filter((employee) => employee.id !== manager.id && employee.managerId === manager.id)
      .sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  private getDirectManagers(employee: DesEvaluationEmployee, population: DesEvaluationEmployee[]): DesEvaluationEmployee[] {
    const populationById = new Map(population.map((item) => [item.id, item]));
    const managerIds = employee.managerIds.length > 0
      ? employee.managerIds
      : employee.managerId
        ? [employee.managerId]
        : [];

    return managerIds
      .map((managerId) => populationById.get(managerId))
      .filter((manager): manager is DesEvaluationEmployee => !!manager && manager.id !== employee.id);
  }

  private getPositionParticipants(
    position: string,
    population: DesEvaluationEmployee[]
  ): DesEvaluationEmployee[] {
    const normalizedPosition = this.normalizeSearchText(position);

    return population.filter((employee) =>
      !!employee.cargo && this.normalizeSearchText(employee.cargo) === normalizedPosition
    );
  }

  private getPeerEmployees(employee: DesEvaluationEmployee, population: DesEvaluationEmployee[]): DesEvaluationEmployee[] {
    if (!employee.managerId) {
      return [];
    }

    return population
      .filter((peer) =>
        peer.id !== employee.id &&
        peer.managerId === employee.managerId
      )
      .sort((left, right) => left.fullName.localeCompare(right.fullName));
  }

  private findInvalidPositionScenarioWeightGroup(evaluation: DesEvaluationCard): string | null {
    if (evaluation.participants.positions.length === 0) {
      return null;
    }

    for (const position of evaluation.participants.positions) {
      if (this.isPositionEvaluatorOnly(position, evaluation)) {
        continue;
      }

      const activeScenarios = this.getActivePositionScenarios(position, evaluation);
      if (
        activeScenarios.length === 0 ||
        !this.isWeightTotalComplete(this.getPositionScenarioWeightTotal(position, evaluation))
      ) {
        return position;
      }
    }

    return null;
  }

  private findDemoPerformanceLimitViolation(
    evaluation: DesEvaluationCard
  ): { textKey: string; params: Record<string, unknown>; tabIndex: number } | null {
    if (!this.demoLimitsService.isDemoModeActive()) {
      return null;
    }

    const dimensionLimit = this.demoLimitsService.getLimit(
      'maxPerformanceDimensionsPerModel'
    );
    if (evaluation.bigFactors.length > dimensionLimit) {
      return {
        textKey: 'DEMO_DIMENSION_LIMIT_TEXT',
        params: { limit: dimensionLimit },
        tabIndex: 0,
      };
    }

    const criterionLimit = this.demoLimitsService.getLimit(
      'maxPerformanceCriteriaPerDimension'
    );
    const itemLimit = this.demoLimitsService.getLimit(
      'maxPerformanceItemsPerCriterion'
    );
    const positions = evaluation.participants.positions.filter(
      (position) => !this.isPositionEvaluatorOnly(position, evaluation)
    );

    if (positions.length === 0) {
      for (const dimension of evaluation.bigFactors) {
        if (this.getDistinctFactorSummaries(dimension).length > criterionLimit) {
          return {
            textKey: 'DEMO_CRITERIA_LIMIT_TEXT',
            params: { limit: criterionLimit, dimension: dimension.name },
            tabIndex: 2,
          };
        }

        const invalidCriterion = dimension.factors.find(
          (criterion) => criterion.questions.length > itemLimit
        );
        if (invalidCriterion) {
          return {
            textKey: 'DEMO_ITEM_LIMIT_TEXT',
            params: { limit: itemLimit, criterion: invalidCriterion.name },
            tabIndex: 2,
          };
        }
      }

      return null;
    }

    for (const position of positions) {
      for (const scenario of this.getEvaluationScenarioOptions(evaluation)) {
        if (!this.isPositionScenarioApplicable(position, scenario.key, evaluation)) {
          continue;
        }

        for (const dimension of evaluation.bigFactors) {
          const criteria = this.getFactorsForPositionAndScenario(
            dimension,
            position,
            scenario.key
          );
          if (criteria.length > criterionLimit) {
            return {
              textKey: 'DEMO_CRITERIA_LIMIT_TEXT',
              params: { limit: criterionLimit, dimension: dimension.name },
              tabIndex: 2,
            };
          }

          for (const { factor: criterion } of criteria) {
            const itemCount = this.getQuestionsForPositionAndScenario(
              criterion,
              position,
              scenario.key
            ).length;
            if (itemCount > itemLimit) {
              return {
                textKey: 'DEMO_ITEM_LIMIT_TEXT',
                params: { limit: itemLimit, criterion: criterion.name },
                tabIndex: 2,
              };
            }
          }
        }
      }
    }

    return null;
  }

  private async showDemoLimitMessage(
    textKey: string,
    limit: number,
    params: Record<string, unknown> = {}
  ): Promise<void> {
    await Swal.fire(
      this.t('DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.DEMO_LIMIT_TITLE'),
      this.t(
        `DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.MESSAGES.${textKey}`,
        { ...params, limit }
      ),
      'warning'
    );
  }

  private hasRequiredModelGeneralData(evaluation: DesEvaluationCard): boolean {
    return !!(
      evaluation.name.trim() &&
      evaluation.description.trim() &&
      evaluation.modelType &&
      evaluation.modelState &&
      Number(evaluation.scaleId) > 0
    );
  }

  private findInvalidFactorWeightGroup(evaluation: DesEvaluationCard): string | null {
    if (evaluation.participants.positions.length > 0) {
      for (const position of evaluation.participants.positions) {
        if (this.isPositionEvaluatorOnly(position, evaluation)) {
          continue;
        }

        for (const scenario of this.getEvaluationScenarioOptions(evaluation)) {
          if (!this.isPositionScenarioApplicable(position, scenario.key, evaluation)) {
            continue;
          }

          for (const bigFactor of evaluation.bigFactors) {
            const factors = this.getFactorsForPositionAndScenario(
              bigFactor,
              position,
              scenario.key
            );

            if (factors.length === 0) {
              continue;
            }

            if (!this.isWeightTotalComplete(
              this.getFactorWeightTotal(bigFactor, position, scenario.key)
            )) {
              return `${bigFactor.name} (${position} - ${scenario.name})`;
            }
          }
        }
      }

      return null;
    }

    for (const bigFactor of evaluation.bigFactors) {
      if (bigFactor.factors.length === 0) {
        continue;
      }

      if (!this.isWeightTotalComplete(this.getFactorWeightTotal(bigFactor))) {
        return bigFactor.name;
      }
    }

    return null;
  }

  private getDefaultScale(): ScaleOption | null {
    return this.scaleOptions.find((item) => item.code === 'CUMPLIMIENTO_1_5') ??
      this.scaleOptions[0] ??
      null;
  }

  private toScenarioKey(value: any): DesEvaluationScenarioKey | null {
    const key = this.normalizeKey(String(value ?? ''));
    return ['BOSS_TO_EMPLOYEE', 'EMPLOYEE_TO_BOSS', 'SELF', 'PEER'].includes(key)
      ? key as DesEvaluationScenarioKey
      : null;
  }

  private toFrontendItemTypeCode(value: any): string {
    const code = this.normalizeKey(String(value ?? 'LIKERT_1_5'));
    if (
      ['ABIERTA', 'PREGUNTA_ABIERTA', 'RESPUESTA_ABIERTA', 'TEXTO_ABIERTO', 'OPEN', 'OPEN_QUESTION']
        .includes(code)
    ) {
      return 'ABIERTA';
    }
    if (code === 'OPCION_UNICA') return 'SELECCION_UNICA';
    if (code === 'OPCION_MULTIPLE') return 'SELECCION_MULTIPLE';
    return code;
  }

  private resolveFrontendItemTypeCode(
    codeValue: unknown,
    idValue: unknown,
    fallback = 'LIKERT_1_5'
  ): string {
    const rawCode = this.toOptionalText(codeValue);
    const numericCodeId = rawCode && /^\d+$/.test(rawCode)
      ? this.toPositiveInteger(rawCode)
      : null;
    const itemTypeId = this.toPositiveInteger(idValue) ?? numericCodeId;

    if (itemTypeId) {
      const catalogItem = this.itemTypeOptions.find((item) => item.id === itemTypeId);
      if (catalogItem?.code) {
        return this.toFrontendItemTypeCode(catalogItem.code);
      }
    }

    return rawCode && !numericCodeId
      ? this.toFrontendItemTypeCode(rawCode)
      : this.toFrontendItemTypeCode(fallback);
  }

  private toBackendItemTypeCode(value: any): string {
    const code = this.toFrontendItemTypeCode(value);
    if (code === 'ABIERTA') return 'ABIERTA';
    if (code === 'SELECCION_UNICA') return 'OPCION_UNICA';
    if (code === 'SELECCION_MULTIPLE') return 'OPCION_MULTIPLE';
    return code;
  }

  private getItemTypeId(type: string): number {
    const backendCode = this.toBackendItemTypeCode(type);
    const exactMatch = this.itemTypeOptions.find((item) => item.code === backendCode);
    if (exactMatch) {
      return exactMatch.id;
    }

    const capabilityMatch = this.itemTypeOptions.find((item) => {
      const usesScale = this.normalizeBoolean(item['usaEscala'] ?? item['UsaEscala']);
      const allowsText = this.normalizeBoolean(item['permiteTexto'] ?? item['PermiteTexto']);
      return backendCode === 'ABIERTA'
        ? allowsText && !usesScale
        : backendCode === 'LIKERT_1_5' && usesScale;
    });

    return capabilityMatch?.id ?? 0;
  }

  private getScenarioCatalogId(scenario: DesEvaluationScenario): number {
    const key = scenario.key ?? this.toScenarioKey(scenario.name);
    return this.scenarioCatalogOptions.find((item) => item.code === key)?.id ??
      scenario.id ??
      0;
  }

  private getPositionId(positionName: string): number {
    const normalizedName = this.normalizeKey(positionName);
    const catalogPositionId = this.positionOptions.find(
      (position) => this.normalizeKey(position.name) === normalizedName
    )?.id;

    if (catalogPositionId) {
      return catalogPositionId;
    }

    return this.employees.find(
      (employee) => employee.positionId && this.normalizeKey(employee.cargo ?? '') === normalizedName
    )?.positionId ?? 0;
  }

  private resolveFactorScaleId(
    factor: DesEvaluationFactor,
    fallbackScaleId: number
  ): number | null {
    const firstQuestionWithScale = factor.questions.find((question) => !!question.scaleId);
    if (firstQuestionWithScale?.scaleId) {
      return firstQuestionWithScale.scaleId;
    }

    const typeOption = this.itemTypeOptions.find(
      (item) => item.code === this.toBackendItemTypeCode(factor.defaultQuestionType)
    );
    return typeOption?.['usaEscala'] === false ? null : fallbackScaleId;
  }

  private resolveQuestionScaleId(
    question: DesEvaluationQuestion,
    factorScaleId: number | null,
    fallbackScaleId: number
  ): number | null {
    if (this.toBackendItemTypeCode(question.type) === 'ABIERTA') {
      return null;
    }

    const typeOption = this.itemTypeOptions.find(
      (item) => item.code === this.toBackendItemTypeCode(question.type)
    );
    if (typeOption?.['usaEscala'] === false) {
      return null;
    }

    if (question.scaleId) {
      return question.scaleId;
    }

    const matchedScale = this.scaleOptions.find((scale) => {
      const labels = scale.levels.map((level) =>
        this.normalizeSearchText(this.getScaleLevelLabel(level))
      );
      const questionOptions = question.options.map((option) =>
        this.normalizeSearchText(option)
      );

      return labels.length === questionOptions.length &&
        labels.every((label, index) => label === questionOptions[index]);
    });

    return matchedScale?.id ?? factorScaleId ?? fallbackScaleId;
  }

  private buildEntityCode(prefix: string, value: string): string {
    const normalizedPrefix = this.normalizeKey(prefix).slice(0, 8) || 'DES';
    const normalizedValue = this.normalizeKey(value).slice(0, 50 - normalizedPrefix.length - 1);
    return `${normalizedPrefix}_${normalizedValue || 'ITEM'}`.slice(0, 50);
  }

  private getSuggestedDuplicateModelName(sourceName: string): string {
    const copySuffix = this.t(
      'DESEMPENO_MENUITEMS.EVALUACIONES_PAGE.DUPLICATE_MODEL_COPY_SUFFIX'
    );
    let copyNumber = 1;

    while (true) {
      const suffix = copyNumber === 1
        ? ` - ${copySuffix}`
        : ` - ${copySuffix} ${copyNumber}`;
      const candidate = `${sourceName.slice(0, Math.max(1, 200 - suffix.length))}${suffix}`;
      if (!this.modelNameExists(candidate)) {
        return candidate;
      }
      copyNumber++;
    }
  }

  private modelNameExists(name: string): boolean {
    const normalizedName = this.normalizeSearchText(name);
    return this.visibleEvaluations.some(
      (evaluation) => this.normalizeSearchText(evaluation.name) === normalizedName
    );
  }

  private buildDuplicateModelCode(name: string): string {
    const uniqueSuffix = `_C${Date.now().toString(36).toUpperCase()}`;
    const baseCode = this.buildEntityCode('MOD', name);
    return `${baseCode.slice(0, 50 - uniqueSuffix.length)}${uniqueSuffix}`;
  }

  private resetDuplicateModelDialog(): void {
    this.duplicateModelDialogRef = null;
    this.duplicateModelSource = null;
    this.duplicateModelName = '';
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    const data = error?.response?.data ?? error?.error ?? error;
    const details = Array.isArray(data?.details)
      ? data.details
          .map((detail: any) => detail?.mensaje ?? detail?.message ?? detail)
          .filter((detail: any) => !!detail)
          .join('\n')
      : '';

    return details || data?.message || data?.mensaje || error?.message || fallback;
  }

  private getScaleById(scaleId: number): ScaleOption | null {
    return this.scaleOptions.find((item) => item.id === scaleId) ?? null;
  }

  private cloneEvaluation(card: DesEvaluationCard): DesEvaluationCard {
    return JSON.parse(JSON.stringify(card)) as DesEvaluationCard;
  }

  private generateId(): number {
    this.localIdSequence += 1;
    return this.localIdSequence;
  }

  private normalizeRequiredRatingLevel(value: unknown): number {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 3;
    }

    const boundedValue = Math.min(5, Math.max(1, numericValue));
    return Math.round((boundedValue + Number.EPSILON) * 100) / 100;
  }

  private normalizeBoolean(value: any): boolean {
    return value === true || value === 1 || value === '1' || value === 'true' || value === 'TRUE';
  }

  private toPositiveInteger(value: any): number | null {
    const numericValue = Number(value);
    if (!Number.isInteger(numericValue) || numericValue <= 0) {
      return null;
    }
    return numericValue;
  }

  private toPositiveIntegerList(value: any): number[] {
    if (value === null || value === undefined || value === '') {
      return [];
    }

    if (Array.isArray(value)) {
      return Array.from(new Set(value.flatMap((item) => this.toPositiveIntegerList(item))));
    }

    if (typeof value === 'object') {
      return this.toPositiveIntegerList(
        value?.IdEmpleado ??
        value?.idEmpleado ??
        value?.IdEmpleadoJefe ??
        value?.idEmpleadoJefe ??
        value?.IdJefe ??
        value?.idJefe ??
        value?.Id ??
        value?.id
      );
    }

    if (typeof value === 'string') {
      const text = value.trim();

      if (!text) {
        return [];
      }

      if (text.startsWith('[') && text.endsWith(']')) {
        try {
          return this.toPositiveIntegerList(JSON.parse(text));
        } catch {
          return [];
        }
      }

      return Array.from(new Set(
        text
          .split(/[,\s;|]+/)
          .map((item) => this.toPositiveInteger(item))
          .filter((item): item is number => item !== null)
      ));
    }

    const numericValue = this.toPositiveInteger(value);
    return numericValue ? [numericValue] : [];
  }

  private toOptionalText(value: any): string | null {
    const text = String(value ?? '').trim();
    return text.length > 0 ? text : null;
  }

  private normalizeDateInput(value: any): string {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? '' : this.formatDateForInput(value);
    }

    if (value && typeof value === 'object') {
      if (typeof value.format === 'function') {
        const formatted = String(value.format('YYYY-MM-DD') ?? '').trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
          return formatted;
        }
      }

      if (typeof value.toDate === 'function') {
        const dateValue = value.toDate();
        if (dateValue instanceof Date && !Number.isNaN(dateValue.getTime())) {
          return this.formatDateForInput(dateValue);
        }
      }
    }

    const text = String(value ?? '').trim();
    if (!text) {
      return '';
    }

    const isoDateMatch = text.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoDateMatch) {
      return isoDateMatch[1];
    }

    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizeKey(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }

  private normalizeSearchText(value: any): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private t(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  private translateKeyOrFallback(key: string, fallback: string): string {
    const translated = this.t(key);
    return translated !== key ? translated : fallback;
  }
}
