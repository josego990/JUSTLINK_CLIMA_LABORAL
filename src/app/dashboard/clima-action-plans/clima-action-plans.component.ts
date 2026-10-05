import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import {
  DemographicFiltersDialogComponent,
  DemographicSelection,
} from '../dashboard1/dialogs/demographic-filters-dialog.component';
import {
  ActionPlanResponsible,
  ActionPlanResponsibleDialogComponent,
} from './action-plan-responsible-dialog.component';

type ActionPlanTab = 'resumen' | 'brechas' | 'demograficos' | 'planes' | 'seguimiento' | 'plantilla';
type PlanStatus = 'SIN_INICIAR' | 'EN_PROCESO' | 'EN_RIESGO' | 'COMPLETADO';
type PlanPriority = 'ALTA' | 'MEDIA' | 'BAJA';

interface ClimaOrganization {
  Id: number;
  Nombre: string;
}

interface ClimaFlow {
  Id: number;
  Nombre: string;
  Objetivo?: string;
  MetodoAplicacion?: string;
}

interface FactorMetric {
  idFactor: number;
  factor: string;
  granFactor: string;
  favorable: number | null;
  desfavorable: number | null;
  restrictivo: number | null;
  nsat: number | null;
  total: number | null;
  top1: number | null;
  bottom1: number | null;
  esOportunidad?: boolean;
  prioridadSugerida?: PlanPriority | null;
}

interface QuestionMetric {
  idPregunta: number;
  idFactor: number;
  factor: string;
  granFactor: string;
  pregunta: string;
  favorable: number | null;
  desfavorable: number | null;
  nsat: number | null;
  mean: number | null;
  total: number | null;
  esOportunidad?: boolean;
  prioridadSugerida?: PlanPriority | null;
}

interface ImprovementOpportunity {
  id: string;
  factor: string;
  granFactor: string;
  area: string;
  reason: string;
  score: number | null;
  unfavorable: number | null;
  gap: number;
  priority: PlanPriority;
  scope: string;
  suggestedAction: string;
  suggestedResource: string;
  suggestedKpi: string;
  source: 'factor' | 'pregunta' | 'general';
  segment?: string;
  criticalQuestion?: string;
  participantCount?: number;
}

interface ActionTask {
  id: number;
  title: string;
  responsible: string;
  deliverable: string;
  dueDate: string;
  evidence: string;
  done: boolean;
}

interface ActionPlanFollowUp {
  id: number;
  dateLabel: string;
  createdAt: string;
  createdBy: string;
  comment: string;
  progress: number | null;
}

interface ActionPlanEmailResult {
  sent: number;
  failed: number;
  missing: number;
}

interface ActionPlan {
  id: number;
  opportunityId: string;
  survey: string;
  factor: string;
  area: string;
  sponsor: string;
  scope: string;
  reason: string;
  criticalQuestion?: string;
  action: string;
  resources: string;
  kpi: string;
  owner: string;
  responsibleEmployeeId?: number | null;
  responsibleEmployeeIds?: number[];
  term: string;
  dueDate: string;
  followUpFrequency: string;
  sendResponsibleEmails: boolean;
  validation: string;
  evidence: string;
  status: PlanStatus;
  priority: PlanPriority;
  createdAt: string;
  tasks: ActionTask[];
  followUps: ActionPlanFollowUp[];
  demographicFilters?: DemographicSelection[];
  isPersisted?: boolean;
  isDirty?: boolean;
}

interface PlanTemplateRow {
  factorArea: string;
  reason: string;
  appliesTo: string;
  actions: string;
  resources: string;
  kpi: string;
  owner: string;
  term: string;
  when: string;
  frequency: string;
  validation: string;
  evidence: string;
}

interface MetricSummary {
  resultadoPct: number | null;
  desfavorablePct: number | null;
  nsat: number | null;
  totalRespuestas: number | null;
}

interface LikertMetricCollection {
  factors: FactorMetric[];
  questions: QuestionMetric[];
}

interface GlobalLikertCatalogs {
  surveys: Map<number, string>;
  factors: Map<number, FactorMetric>;
  questions: Map<number, QuestionMetric>;
}

@Component({
  selector: 'app-clima-action-plans',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './clima-action-plans.component.html',
  styleUrls: ['./clima-action-plans.component.scss'],
})
export class ClimaActionPlansComponent implements OnDestroy, OnInit {
  readonly targetScore = 80;
  readonly tabs: Array<{ id: ActionPlanTab; labelKey: string; icon: string }> = [
    { id: 'resumen', labelKey: 'TAB_SUMMARY', icon: 'dashboard' },
    { id: 'brechas', labelKey: 'TAB_GAPS', icon: 'priority_high' },
    { id: 'demograficos', labelKey: 'TAB_DEMOGRAPHIC_GAPS', icon: 'groups' },
    { id: 'planes', labelKey: 'TAB_PLANS', icon: 'assignment_turned_in' },
    { id: 'seguimiento', labelKey: 'TAB_FOLLOW_UP', icon: 'timeline' },
    { id: 'plantilla', labelKey: 'TAB_TEMPLATE', icon: 'view_list' },
  ];

  selectedTab: ActionPlanTab = 'resumen';
  organizations: ClimaOrganization[] = [];
  climas: ClimaFlow[] = [];
  selectedOrganizationId: number | null = null;
  selectedClimaId: number | null = null;
  selectedOrganizationName = '';
  selectedClimaName = '';
  selectedClimaObjective = '';

  loadingOrganizations = false;
  loadingClimas = false;
  loadingMetrics = false;
  loadingFilters = false;
  loadingPlans = false;

  rawMetrics: any = null;
  demographicTree: any = null;
  selectedFilters: DemographicSelection[] = [];
  filtrosDemograficos = '';
  filtrosGrandesFactores = '';
  tipoFiltro = 'AND';

  factorMetrics: FactorMetric[] = [];
  questionMetrics: QuestionMetric[] = [];
  opportunities: ImprovementOpportunity[] = [];
  demographicOpportunities: ImprovementOpportunity[] = [];
  readonly collapsedDemographicFactorIds = new Set<string>();
  actionPlans: ActionPlan[] = [];
  responsibleEmployees: ActionPlanResponsible[] = [];
  loadingResponsibleEmployees = false;
  readonly savingPlanIds = new Set<number>();
  selectedOpportunityId: string | null = null;
  private computedSummary: MetricSummary | null = null;
  private globalCatalogs: GlobalLikertCatalogs | null = null;
  private selectedOrganizationSubscription?: Subscription;

  get templateRows(): PlanTemplateRow[] {
    return [1, 2, 3].map((row) => ({
      factorArea: this.t(`TEMPLATE_ROW_${row}_FACTOR`),
      reason: this.t(`TEMPLATE_ROW_${row}_REASON`),
      appliesTo: this.t(`TEMPLATE_ROW_${row}_SCOPE`),
      actions: this.t(`TEMPLATE_ROW_${row}_ACTIONS`),
      resources: this.t(`TEMPLATE_ROW_${row}_RESOURCES`),
      kpi: this.t(`TEMPLATE_ROW_${row}_KPI`),
      owner: this.t(`TEMPLATE_ROW_${row}_OWNER`),
      term: this.t(`TEMPLATE_ROW_${row}_TERM`),
      when: this.t(`TEMPLATE_ROW_${row}_WHEN`),
      frequency: this.t(`TEMPLATE_ROW_${row}_FREQUENCY`),
      validation: this.t(`TEMPLATE_ROW_${row}_VALIDATION`),
      evidence: this.t(`TEMPLATE_ROW_${row}_EVIDENCE`),
    }));
  }

  constructor(
    private router: Router,
    private organizacionService: OrganizacionService,
    private dialog: MatDialog,
    private translate: TranslateService,
  ) {}

   existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
    }

  ngOnInit(): void {
    this.setupSelectedOrganizationListener();

    //validar accesos al modulo..
    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
      console.log('RUTAS DESDE sessionStorage:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/dashboard/planes-accion-clima');
      //console.log(found);

      if(!found){
        this.router.navigate(['/authentication/page404']);
      }

    }



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
        this.selectedOrganizationName = organization.Nombre;
        return;
      }

      void this.onOrganizationChange(organization.Id);
    });
  }

  get hasMetrics(): boolean {
    return !!this.rawMetrics;
  }

  get generalScore(): number | null {
    return this.getNumber(this.computedSummary ?? this.rawMetrics?.resumen ?? this.rawMetrics?.calificacionGeneral, [
      'resultadoPct', 'favorablePct', 'pct_favorable', 'pct_top2', 'pct_general',
    ]);
  }

  get generalUnfavorable(): number | null {
    return this.getNumber(this.computedSummary ?? this.rawMetrics?.resumen ?? this.rawMetrics?.calificacionGeneral, [
      'desfavorablePct', 'pct_desfavorable_restrictivo', 'pct_desfavorable',
    ]);
  }

  get generalNsat(): number | null {
    return this.getNumber(this.computedSummary ?? this.rawMetrics?.resumen ?? this.rawMetrics?.calificacionGeneral, ['nsat']);
  }

  get totalResponses(): number | null {
    return this.getNumber(this.computedSummary ?? this.rawMetrics?.resumen ?? this.rawMetrics?.calificacionGeneral, ['totalRespuestas', 'total_respuestas']);
  }

  get criticalOpportunities(): ImprovementOpportunity[] {
    return this.opportunities.filter((item) => item.priority === 'ALTA');
  }

  get groupedDemographicOpportunities(): Array<{
    id: string;
    label: string;
    questions: Array<{ id: string; label: string; items: ImprovementOpportunity[] }>;
  }> {
    const groups = new Map<string, {
      id: string;
      label: string;
      questions: Map<string, { id: string; label: string; items: ImprovementOpportunity[] }>;
    }>();

    this.demographicOpportunities.forEach((opportunity) => {
      const factorLabel = opportunity.factor || this.t('FACTOR_AREA');
      const factorId = `demographic-factor-${this.normalizeKey(factorLabel)}`;
      const factorGroup = groups.get(factorId) ?? {
        id: factorId,
        label: factorLabel,
        questions: new Map<string, { id: string; label: string; items: ImprovementOpportunity[] }>(),
      };

      const questionLabel = opportunity.criticalQuestion?.trim() || this.t('QUESTION_FALLBACK');
      const questionId = `${factorId}-question-${this.normalizeKey(questionLabel)}`;
      const questionGroup = factorGroup.questions.get(questionId) ?? {
        id: questionId,
        label: questionLabel,
        items: [],
      };

      questionGroup.items.push(opportunity);
      factorGroup.questions.set(questionId, questionGroup);
      groups.set(factorId, factorGroup);
    });

    return Array.from(groups.values()).map((group) => ({
      id: group.id,
      label: group.label,
      questions: Array.from(group.questions.values()),
    }));
  }

  getFactorOpportunityCount(factorGroup: {
    questions: Array<{ items: ImprovementOpportunity[] }>;
  }): number {
    return factorGroup.questions.reduce((total, question) => total + question.items.length, 0);
  }

  isDemographicFactorCollapsed(factorId: string): boolean {
    return this.collapsedDemographicFactorIds.has(factorId);
  }

  toggleDemographicFactor(factorId: string): void {
    if (this.collapsedDemographicFactorIds.has(factorId)) {
      this.collapsedDemographicFactorIds.delete(factorId);
      return;
    }

    this.collapsedDemographicFactorIds.add(factorId);
  }

  get planOpportunities(): ImprovementOpportunity[] {
    return [...this.opportunities, ...this.demographicOpportunities];
  }

  get visibleActionPlans(): ActionPlan[] {
    if (!this.selectedFilters.length) return this.actionPlans;
    const visibleOpportunityIds = new Set(this.planOpportunities.map((item) => item.id));
    return this.actionPlans.filter((plan) =>
      plan.demographicFilters?.length
        ? this.planMatchesSelectedFilters(plan)
        : visibleOpportunityIds.has(plan.opportunityId)
    );
  }

  get openOpportunities(): ImprovementOpportunity[] {
    const planned = new Set(this.visibleActionPlans.map((plan) => plan.opportunityId));
    return this.planOpportunities.filter((item) => !planned.has(item.id));
  }

  get selectedOpportunity(): ImprovementOpportunity | null {
    return this.planOpportunities.find((item) => item.id === this.selectedOpportunityId) ??
      this.openOpportunities[0] ??
      this.planOpportunities[0] ??
      null;
  }

  getOpportunitySelectionLabel(opportunity: ImprovementOpportunity): string {
    const context = opportunity.area && opportunity.area !== this.t('ENTIRE_ORGANIZATION')
      ? opportunity.area
      : opportunity.granFactor;
    const criticalQuestion = opportunity.criticalQuestion ? ` · ${opportunity.criticalQuestion}` : '';
    return `${context} · ${opportunity.factor}${criticalQuestion} · ${this.getPriorityLabel(opportunity.priority)}`;
  }

  get planSummary(): { total: number; completed: number; progress: number; atRisk: number; high: number } {
    const plans = this.visibleActionPlans;
    const total = plans.length;
    const completed = plans.filter((plan) => this.getPlanProgress(plan) >= 100).length;
    const progress = total > 0
      ? this.round(plans.reduce((sum, plan) => sum + this.getPlanProgress(plan), 0) / total, 1)
      : 0;
    const atRisk = plans.filter((plan) => this.getEffectivePlanStatus(plan) === 'EN_RIESGO').length;
    const high = plans.filter((plan) => plan.priority === 'ALTA').length;

    return { total, completed, progress, atRisk, high };
  }

  get filterChips(): Array<{ label: string; value: string }> {
    return this.selectedFilters.flatMap((filter) =>
      filter.valores.map((value) => ({
        label: filter.nombreCampo,
        value: value?.trim() ? value : '(vacío)',
      }))
    );
  }

  get groupedOpportunities(): Array<{ key: string; label: string; items: ImprovementOpportunity[] }> {
    const groups = new Map<string, { key: string; label: string; items: ImprovementOpportunity[] }>();
    this.opportunities.forEach((item) => {
      const key = item.granFactor || 'General';
      if (!groups.has(key)) {
        groups.set(key, { key, label: key, items: [] });
      }
      groups.get(key)!.items.push(item);
    });

    return Array.from(groups.values());
  }

  selectTab(tab: ActionPlanTab): void {
    this.selectedTab = tab;
  }

  async loadOrganizations(): Promise<void> {
    this.loadingOrganizations = true;
    try {
      const response = await this.organizacionService.getOrganizations();
      this.organizations = this.asArray(response?.data)
        .map((item) => ({
          Id: Number(item?.Id ?? item?.id ?? 0),
          Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
        }))
        .filter((item) => item.Id > 0);
    } catch (error) {
      console.error('Error al cargar organizaciones:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar las organizaciones.', 'error');
    } finally {
      this.loadingOrganizations = false;
    }
  }

  async loadOrganizationById(idOrganization: number): Promise<void> {
    this.loadingOrganizations = true;
    try {
      const response = await this.organizacionService.getOrganizationById(idOrganization);
      this.organizations = this.asArray(response?.data)
        .map((item) => ({
          Id: Number(item?.Id ?? item?.id ?? idOrganization),
          Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
        }))
        .filter((item) => item.Id > 0);
      this.selectedOrganizationId = idOrganization;
      await this.loadClimas(idOrganization);
    } catch (error) {
      console.error('Error al cargar organización:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar la organización.', 'error');
    } finally {
      this.loadingOrganizations = false;
    }
  }

  async onOrganizationChange(idOrganization: number | null): Promise<void> {
    this.selectedOrganizationId = Number(idOrganization) || null;
    this.selectedClimaId = null;
    this.selectedClimaName = '';
    this.selectedClimaObjective = '';
    this.climas = [];
    this.clearMetrics();

    if (this.selectedOrganizationId) {
      await this.loadClimas(this.selectedOrganizationId);
    }
  }

  async loadClimas(idOrganization: number): Promise<void> {
    this.loadingClimas = true;
    try {
      const response = await this.organizacionService.getFlujosLista(idOrganization);
      this.climas = this.asArray(response?.data?.data)
        .map((item) => ({
          Id: Number(item?.Id ?? item?.id ?? 0),
          Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
          Objetivo: item?.Objetivo,
          MetodoAplicacion: item?.MetodoAplicacion,
        }))
        .filter((item) => item.Id > 0);
      this.selectedOrganizationName = this.organizations.find((item) => item.Id === idOrganization)?.Nombre ?? '';
    } catch (error) {
      console.error('Error al cargar climas:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar los climas de la organización.', 'error');
    } finally {
      this.loadingClimas = false;
    }
  }

  async onClimaChange(idFlujo: number | null): Promise<void> {
    this.selectedClimaId = Number(idFlujo) || null;
    this.selectedFilters = [];
    this.filtrosDemograficos = '';
    this.demographicTree = null;
    this.clearMetrics();

    const clima = this.climas.find((item) => item.Id === this.selectedClimaId);
    this.selectedClimaName = clima?.Nombre ?? '';
    this.selectedClimaObjective = String(clima?.Objetivo ?? '');

    if (this.selectedClimaId) {
      await this.loadMetrics();
    }
  }

  async loadDemographicFilters(): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    this.loadingFilters = true;
    try {
      const response = await this.organizacionService.getFiltrosDemograficosArbol(this.selectedOrganizationId);
      this.demographicTree = this.extractDemographicTree(response);
    } catch (error) {
      console.error('Error al cargar filtros demográficos:', error);
      this.demographicTree = null;
    } finally {
      this.loadingFilters = false;
    }
  }

  openFilters(): void {
    if (!this.demographicTree) {
      Swal.fire('Filtros', 'No hay filtros demográficos disponibles para este clima.', 'info');
      return;
    }

    const dialogRef = this.dialog.open(DemographicFiltersDialogComponent, {
      width: '1200px',
      maxWidth: '100vw',
      maxHeight: '95vh',
      data: {
        ...this.demographicTree,
        preselected: this.selectedFilters,
      },
    });

    dialogRef.afterClosed().subscribe((result?: DemographicSelection[]) => {
      if (!result) {
        return;
      }

      this.selectedFilters = result;
      this.filtrosDemograficos = this.buildFilterString(result);
      this.normalizeMetrics();
    });
  }

  clearFilters(): void {
    this.selectedFilters = [];
    this.filtrosDemograficos = '';
    this.normalizeMetrics();
  }

  async loadMetrics(): Promise<void> {
    if (!this.selectedClimaId) {
      return;
    }

    this.loadingMetrics = true;
    try {
      const response = await this.organizacionService.getClimaActionPlanLikertResults(
        this.selectedOrganizationId!,
        this.selectedClimaId,
      );
      this.rawMetrics = response?.data?.data ?? null;
      this.globalCatalogs = null;
      this.demographicTree = this.buildDemographicTreeFromMetrics();
      this.normalizeMetrics();
      await this.loadActionPlans();
    } catch (error) {
      console.error('Error al cargar métricas del clima:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar las métricas del clima.', 'error');
    } finally {
      this.loadingMetrics = false;
    }
  }

  normalizeMetrics(): void {
    this.computedSummary = null;
    if (this.isLikertActionPlanResponse()) {
      const employees = this.getFilteredEmployees();
      const collection = this.selectedFilters.length
        ? this.aggregateEmployeeMetrics(employees)
        : this.normalizeLikertActionPlanMetrics(this.rawMetrics);

      this.factorMetrics = collection.factors
        .filter((item) => item.factor.length > 0)
        .sort((left, right) => this.nullLast(left.favorable, right.favorable));
      this.questionMetrics = collection.questions
        .filter((item) => item.pregunta.length > 0)
        .sort((left, right) => this.nullLast(left.favorable, right.favorable));
      if (this.selectedFilters.length) {
        this.computedSummary = this.calculateSummary(this.factorMetrics);
      }
      this.opportunities = this.buildOpportunities();
      this.demographicOpportunities = this.buildDemographicOpportunities();
      this.selectedOpportunityId = this.openOpportunities[0]?.id ?? this.opportunities[0]?.id ?? null;
      return;
    }

    const factorSource = this.asArray(this.rawMetrics?.porcentajeSatisfaccionPorFactor).length
      ? this.asArray(this.rawMetrics?.porcentajeSatisfaccionPorFactor)
      : this.asArray(this.rawMetrics?.satisfaccionPorPregunta);

    this.factorMetrics = factorSource
      .map((item) => this.normalizeFactorMetric(item))
      .filter((item) => item.factor.length > 0)
      .sort((left, right) => this.nullLast(left.favorable, right.favorable));

    this.questionMetrics = this.asArray(this.rawMetrics?.respuestasPorFactor)
      .map((item) => this.normalizeQuestionMetric(item))
      .filter((item) => item.pregunta.length > 0)
      .sort((left, right) => this.nullLast(left.favorable, right.favorable));

    this.opportunities = this.buildOpportunities();
    this.demographicOpportunities = [];
    this.selectedOpportunityId = this.openOpportunities[0]?.id ?? this.opportunities[0]?.id ?? null;
  }

  private isLikertActionPlanResponse(): boolean {
    return !!this.rawMetrics && (
      !!this.rawMetrics?.globales ||
      Array.isArray(this.rawMetrics?.granFactores) ||
      Array.isArray(this.rawMetrics?.empleados) ||
      this.rawMetrics?.metodoAplicacion === 'LIKERT-5'
    );
  }

  private normalizeLikertActionPlanMetrics(source: any): LikertMetricCollection {
    if (source?.globales) {
      return this.normalizeFlatGlobalMetrics(source.globales);
    }

    const factors: FactorMetric[] = [];
    const questions: QuestionMetric[] = [];

    const surveys = this.asArray(
      source?.granFactores ?? source?.GranFactores ?? source?.respuestasLikert ?? source?.RespuestasLikert ?? source?.resultadosLikert ?? source?.ResultadosLikert
    );

    surveys.forEach((survey: any) => {
      const granFactor = String(
        survey?.nombre ?? survey?.Nombre ?? survey?.etiqueta ?? survey?.Etiqueta ??
        survey?.granFactor ?? survey?.GranFactor ?? survey?.EtiquetaGranFactor ?? this.t('SURVEY_FALLBACK')
      ).trim();
      const factorItems = this.asArray(
        survey?.factores ?? survey?.Factores ?? survey?.factors ?? survey?.items ?? survey?.resultados
      );

      factorItems.forEach((item: any) => {
        const factor = this.normalizeLikertFactorMetric(item, granFactor);
        factors.push(factor);

        this.asArray(item?.preguntas ?? item?.Preguntas ?? item?.preguntasLikert ?? item?.items ?? item?.resultados)
          .forEach((question: any) => questions.push(
            this.normalizeLikertQuestionMetric(question, factor)
          ));
      });
    });

    return { factors, questions };
  }

  private normalizeFlatGlobalMetrics(globales: any): LikertMetricCollection {
    const surveyNames = new Map<number, string>();
    const factorsById = new Map<number, FactorMetric>();

    this.asArray(globales?.granFactores).forEach((survey) => {
      surveyNames.set(
        Number(this.getValue(survey, ['granFactorId', 'idGranFactor', 'id'])),
        this.getCatalogLabel(survey, ['granFactor', 'granFactorNombre', 'encuesta', 'nombre', 'etiqueta']) || this.t('SURVEY_FALLBACK'),
      );
    });

    const factors = this.asArray(globales?.factores).map((item) => {
      const surveyId = Number(this.getValue(item, ['granFactorId', 'idGranFactor']));
      const factor = this.normalizeLikertFactorMetric(item, surveyNames.get(surveyId) ?? this.t('SURVEY_FALLBACK'));
      factorsById.set(factor.idFactor, factor);
      return factor;
    });

    const questions = this.asArray(globales?.preguntas).map((item) => {
      const factorId = Number(this.getValue(item, ['factorId', 'idFactor']));
      const factor = factorsById.get(factorId) ?? {
        idFactor: factorId,
        factor: this.getCatalogLabel(item, ['factor', 'factorNombre']) || this.t('FACTOR_AREA'),
        granFactor: surveyNames.get(Number(this.getValue(item, ['granFactorId', 'idGranFactor']))) ?? this.t('SURVEY_FALLBACK'),
      } as FactorMetric;
      return this.normalizeLikertQuestionMetric(item, factor);
    });

    return { factors, questions };
  }

  private normalizeLikertFactorMetric(item: any, granFactor: string): FactorMetric {
    return {
      idFactor: Number(item?.factorId ?? item?.FactorId ?? item?.idFactor ?? item?.IdFactor ?? item?.id ?? item?.Id ?? 0),
      factor: this.getCatalogLabel(item, ['factor', 'factorNombre', 'nombre', 'etiqueta']),
      granFactor,
      favorable: this.getNumber(item, ['favorablePct', 'resultadoPct', 'pct_satisfaccion', 'pct_favorable', 'favorable_pct', 'resultado_pct']),
      desfavorable: this.getNumber(item, ['desfavorablePct', 'pct_desfavorable', 'desfavorable_pct']),
      restrictivo: this.getNumber(item, ['desfavorableRestrictivoPct', 'pct_desfavorable_restrictivo']),
      nsat: this.getNumber(item, ['nsat']),
      total: this.getNumber(item, ['totalRespuestas', 'total_respuestas', 'cantidadRespuestas']),
      top1: null,
      bottom1: null,
      esOportunidad: this.getBoolean(item, ['esOportunidad']),
      prioridadSugerida: this.normalizeSuggestedPriority(this.getValue(item, ['prioridadSugerida', 'prioridad_sugerida'])),
    };
  }

  private normalizeLikertQuestionMetric(item: any, factor: FactorMetric): QuestionMetric {
    return {
      idPregunta: Number(item?.preguntaId ?? item?.PreguntaId ?? item?.idPregunta ?? item?.IdPregunta ?? item?.id ?? item?.Id ?? 0),
      idFactor: factor.idFactor,
      factor: factor.factor,
      granFactor: factor.granFactor,
      pregunta: this.getCatalogLabel(item, ['pregunta', 'preguntaTexto', 'texto', 'nombre', 'etiqueta']),
      favorable: this.getNumber(item, ['favorablePct', 'resultadoPct', 'pct_favorable', 'favorable_pct', 'resultado_pct']),
      desfavorable: this.getNumber(item, ['desfavorablePct', 'pct_desfavorable', 'desfavorable_pct']),
      nsat: this.getNumber(item, ['nsat']),
      mean: this.getNumber(item, ['puntajePromedio', 'mean']),
      total: this.getNumber(item, ['totalRespuestas', 'total_respuestas', 'cantidadRespuestas']),
      esOportunidad: this.getBoolean(item, ['esOportunidad']),
      prioridadSugerida: this.normalizeSuggestedPriority(this.getValue(item, ['prioridadSugerida', 'prioridad_sugerida'])),
    };
  }

  private getFilteredEmployees(): any[] {
    const employees = this.asArray(this.rawMetrics?.empleados);
    if (!this.selectedFilters.length) return employees;
    return employees.filter((employee) => this.matchesSelectedDemographics(employee));
  }

  private matchesSelectedDemographics(employee: any): boolean {
    const demographics = this.getEmployeeDemographics(employee);
    return this.selectedFilters.every((filter) => {
      const selectedValues = filter.valores.map((value) => this.normalizeKey(value || '(vacío)'));
      if (!selectedValues.length) return true;
      const employeeValues = demographics.get(this.normalizeKey(filter.nombreCampo)) ?? [];
      return employeeValues.some((value) => selectedValues.includes(this.normalizeKey(value || '(vacío)')));
    });
  }

  private getEmployeeDemographics(employee: any): Map<string, string[]> {
    const demographics = new Map<string, string[]>();
    this.getEmployeeDemographicEntries(employee).forEach((item) => {
      const normalizedName = this.normalizeKey(item.campo);
      demographics.set(normalizedName, [...(demographics.get(normalizedName) ?? []), item.valor]);
    });

    return demographics;
  }

  private getEmployeeDemographicEntries(employee: any): Array<{ id: number; campo: string; valor: string }> {
    const source = employee?.demograficos ?? employee?.Demograficos ?? employee?.camposDemograficos ?? employee?.CamposDemograficos;
    if (Array.isArray(source)) {
      return source.flatMap((item) => {
        const campo = this.getCatalogLabel(item, ['campo', 'nombreCampo', 'nombre']);
        const id = Number(this.getValue(item, ['campoId', 'idCampo', 'id'])) || 0;
        const rawValues = this.getValue(item, ['valor', 'value', 'valores', 'values']);
        return (Array.isArray(rawValues) ? rawValues : [rawValues])
          .filter((value) => value !== undefined && value !== null)
          .map((value) => ({ id, campo, valor: String(value).trim() }));
      }).filter((item) => item.campo.length > 0);
    }

    return source && typeof source === 'object'
      ? Object.entries(source).flatMap(([campo, rawValue]) => (Array.isArray(rawValue) ? rawValue : [rawValue])
        .filter((value) => value !== undefined && value !== null)
        .map((value) => ({ id: 0, campo, valor: String(value).trim() })))
      : [];
  }

  private buildDemographicTreeFromMetrics(): any {
    const fieldMap = new Map<string, { id: number; campo: string }>();
    this.asArray(this.rawMetrics?.demograficosDisponibles).forEach((item) => {
      const campo = this.getCatalogLabel(item, ['campo', 'nombreCampo', 'nombre']);
      if (campo) fieldMap.set(this.normalizeKey(campo), {
        id: Number(this.getValue(item, ['campoId', 'idCampo', 'id'])) || 0,
        campo,
      });
    });

    this.getFilteredEmployees().forEach((employee) => {
      this.getEmployeeDemographicEntries(employee).forEach((entry) => {
        const key = this.normalizeKey(entry.campo);
        if (!fieldMap.has(key)) fieldMap.set(key, { id: entry.id, campo: entry.campo });
      });
    });

    const order = Array.from(fieldMap.values()).map((field, level) => ({ level, id: field.id, campo: field.campo }));
    if (!order.length) return null;

    const values: any[] = [];
    this.getFilteredEmployees().forEach((employee) => {
      const byField = new Map(this.getEmployeeDemographicEntries(employee).map((entry) => [this.normalizeKey(entry.campo), entry.valor]));
      let nodes = values;
      order.forEach((field) => {
        const value = byField.get(this.normalizeKey(field.campo)) ?? '';
        let node = nodes.find((item) => item.valor === value);
        if (!node) {
          node = { campo: field.campo, valor: value, total: 0, children: [] };
          nodes.push(node);
        }
        node.total += 1;
        nodes = node.children;
      });
    });

    return { order, rootCampoId: order[0].id, rootCampo: order[0].campo, values };
  }

  private aggregateEmployeeMetrics(employees: any[]): LikertMetricCollection {
    if (this.rawMetrics?.globales) {
      return this.aggregateNormalizedEmployeeResponses(employees);
    }

    const factorMetrics: FactorMetric[] = [];
    const questionMetrics: QuestionMetric[] = [];
    employees.forEach((employee) => {
      const collection = this.normalizeLikertActionPlanMetrics(employee);
      factorMetrics.push(...collection.factors);
      questionMetrics.push(...collection.questions);
    });

    return {
      factors: this.aggregateFactorMetrics(factorMetrics),
      questions: this.aggregateQuestionMetrics(questionMetrics),
    };
  }

  private aggregateNormalizedEmployeeResponses(employees: any[]): LikertMetricCollection {
    const catalogs = this.getGlobalCatalogs();
    const factorMetrics: FactorMetric[] = [];
    const questionMetrics: QuestionMetric[] = [];

    employees.forEach((employee) => {
      this.asArray(employee?.respuestas).forEach((answer) => {
        const questionId = Number(this.getValue(answer, ['preguntaId', 'idPregunta']));
        const factorId = Number(this.getValue(answer, ['factorId', 'idFactor']));
        const surveyId = Number(this.getValue(answer, ['granFactorId', 'idGranFactor']));
        const factor = catalogs.factors.get(factorId);
        const surveyName = catalogs.surveys.get(surveyId) ?? factor?.granFactor ?? this.t('SURVEY_FALLBACK');
        const factorName = factor?.factor ?? this.t('FACTOR_AREA');
        const responseScore = this.getNumber(answer, ['resultadoPct']) ?? this.scoreToPercent(answer?.score);
        const opportunity = this.getBoolean(answer, ['esOportunidad']) === true;
        const total = 1;

        factorMetrics.push({
          idFactor: factorId,
          factor: factorName,
          granFactor: surveyName,
          favorable: responseScore,
          desfavorable: opportunity ? 100 : 0,
          restrictivo: null,
          nsat: responseScore === null ? null : this.round(responseScore - 50, 2),
          total,
          top1: null,
          bottom1: null,
        });

        questionMetrics.push({
          idPregunta: questionId,
          idFactor: factorId,
          factor: factorName,
          granFactor: surveyName,
          pregunta: catalogs.questions.get(questionId)?.pregunta ?? this.t('QUESTION_FALLBACK'),
          favorable: responseScore,
          desfavorable: opportunity ? 100 : 0,
          nsat: responseScore === null ? null : this.round(responseScore - 50, 2),
          mean: this.getNumber(answer, ['score']),
          total,
        });
      });
    });

    return {
      factors: this.aggregateFactorMetrics(factorMetrics),
      questions: this.aggregateQuestionMetrics(questionMetrics),
    };
  }

  private getGlobalCatalogs(): GlobalLikertCatalogs {
    if (this.globalCatalogs) return this.globalCatalogs;

    const collection = this.normalizeFlatGlobalMetrics(this.rawMetrics?.globales ?? {});
    const surveys = new Map<number, string>();
    this.asArray(this.rawMetrics?.globales?.granFactores).forEach((survey) => {
      surveys.set(
        Number(this.getValue(survey, ['granFactorId', 'idGranFactor', 'id'])),
        this.getCatalogLabel(survey, ['granFactor', 'granFactorNombre', 'encuesta', 'nombre', 'etiqueta']) || this.t('SURVEY_FALLBACK'),
      );
    });
    this.globalCatalogs = {
      surveys,
      factors: new Map(collection.factors.map((factor) => [factor.idFactor, factor])),
      questions: new Map(collection.questions.map((question) => [question.idPregunta, question])),
    };
    return this.globalCatalogs;
  }

  private scoreToPercent(score: any): number | null {
    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore <= 0) return null;
    const maxScore = this.getNumber(this.rawMetrics?.escala, ['maximo', 'maxScore', 'niveles', 'cantidadNiveles']) ?? 5;
    return this.round((numericScore / maxScore) * 100, 2);
  }

  private aggregateFactorMetrics(metrics: FactorMetric[]): FactorMetric[] {
    const groups = new Map<string, FactorMetric[]>();
    metrics.forEach((metric) => {
      const key = `${this.normalizeKey(metric.granFactor)}|${metric.idFactor || this.normalizeKey(metric.factor)}`;
      groups.set(key, [...(groups.get(key) ?? []), metric]);
    });

    return Array.from(groups.values()).map((items) => {
      const first = items[0];
      return {
        ...first,
        favorable: this.weightedMetric(items, 'favorable'),
        desfavorable: this.weightedMetric(items, 'desfavorable'),
        restrictivo: this.weightedMetric(items, 'restrictivo'),
        nsat: this.weightedMetric(items, 'nsat'),
        total: items.reduce((sum, item) => sum + (item.total ?? 0), 0) || null,
        esOportunidad: undefined,
        prioridadSugerida: null,
      };
    });
  }

  private aggregateQuestionMetrics(metrics: QuestionMetric[]): QuestionMetric[] {
    const groups = new Map<string, QuestionMetric[]>();
    metrics.forEach((metric) => {
      const key = `${this.normalizeKey(metric.granFactor)}|${metric.idFactor}|${metric.idPregunta || this.normalizeKey(metric.pregunta)}`;
      groups.set(key, [...(groups.get(key) ?? []), metric]);
    });

    return Array.from(groups.values()).map((items) => {
      const first = items[0];
      return {
        ...first,
        favorable: this.weightedMetric(items, 'favorable'),
        desfavorable: this.weightedMetric(items, 'desfavorable'),
        nsat: this.weightedMetric(items, 'nsat'),
        mean: this.weightedMetric(items, 'mean'),
        total: items.reduce((sum, item) => sum + (item.total ?? 0), 0) || null,
        esOportunidad: undefined,
        prioridadSugerida: null,
      };
    });
  }

  private weightedMetric<T extends { total: number | null }>(items: T[], metric: keyof T): number | null {
    let totalWeight = 0;
    let weightedSum = 0;
    items.forEach((item: any) => {
      const value = item[metric];
      if (value === null || value === undefined || !Number.isFinite(Number(value))) return;
      const weight = item.total && item.total > 0 ? item.total : 1;
      totalWeight += weight;
      weightedSum += Number(value) * weight;
    });
    return totalWeight ? this.round(weightedSum / totalWeight, 2) : null;
  }

  private calculateSummary(factors: FactorMetric[]): MetricSummary {
    return {
      resultadoPct: this.weightedMetric(factors, 'favorable'),
      desfavorablePct: this.weightedMetric(factors, 'desfavorable'),
      nsat: this.weightedMetric(factors, 'nsat'),
      totalRespuestas: factors.reduce((sum, factor) => sum + (factor.total ?? 0), 0) || null,
    };
  }

  private buildDemographicOpportunities(): ImprovementOpportunity[] {
    const groups = new Map<string, { field: string; value: string; employees: any[] }>();
    this.getFilteredEmployees().forEach((employee) => {
      this.getEmployeeDemographics(employee).forEach((values, normalizedField) => {
        values.forEach((value) => {
          const cleanValue = value || '(vacío)';
          const key = `${normalizedField}|${this.normalizeKey(cleanValue)}`;
          const group = groups.get(key) ?? { field: normalizedField, value: cleanValue, employees: [] };
          group.employees.push(employee);
          groups.set(key, group);
        });
      });
    });

    return Array.from(groups.values()).flatMap((group) => {
      const collection = this.aggregateEmployeeMetrics(group.employees);
      const summary = this.calculateSummary(collection.factors);
      const score = summary.resultadoPct;
      const unfavorable = summary.desfavorablePct;
      if (score === null || (score >= this.targetScore && (unfavorable ?? 0) < 25)) return [];

      const fieldLabel = this.displayDemographicLabel(group.field);
      const criticalFactor = this.getMostCriticalMetric(collection.factors);
      const criticalQuestion = this.getMostCriticalMetric(collection.questions);
      const focusFactor = criticalQuestion?.factor ?? criticalFactor?.factor ?? group.value;
      const focusQuestion = criticalQuestion?.pregunta ?? '';
      return [{
        id: `demografico-${group.field}-${this.normalizeKey(group.value)}`,
        factor: focusFactor,
        granFactor: fieldLabel,
        area: `${fieldLabel}: ${group.value}`,
        reason: `${fieldLabel}: ${group.value} registra ${this.formatPercent(score)} de satisfacción y ${this.formatPercent(unfavorable)} de insatisfacción en ${group.employees.length} colaborador(es). Factor crítico: ${focusFactor}.${focusQuestion ? ` Pregunta crítica: "${focusQuestion}".` : ''}`,
        score,
        unfavorable,
        gap: this.round(Math.max(0, this.targetScore - score), 1),
        priority: this.getPriority(score, unfavorable),
        scope: `${fieldLabel}: ${group.value}`,
        suggestedAction: this.suggestActionForFactor(focusFactor),
        suggestedResource: this.suggestResourcesForFactor(focusFactor),
        suggestedKpi: `Elevar la satisfacción del segmento a ${this.targetScore}% o más.`,
        source: 'general' as const,
        segment: group.value,
        criticalQuestion: focusQuestion,
        participantCount: group.employees.length,
      }];
    }).sort((left, right) =>
      this.priorityWeight(right.priority) - this.priorityWeight(left.priority) || right.gap - left.gap
    );
  }

  private displayDemographicLabel(value: string): string {
    return value.replace(/_/g, ' ').toLocaleLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private getMostCriticalMetric<T extends { favorable: number | null; desfavorable: number | null }>(metrics: T[]): T | null {
    return [...metrics].sort((left, right) =>
      (right.desfavorable ?? 0) - (left.desfavorable ?? 0) ||
      this.nullLast(left.favorable, right.favorable)
    )[0] ?? null;
  }

  async createPlanFromOpportunity(opportunity: ImprovementOpportunity | null = this.selectedOpportunity): Promise<void> {
    if (!opportunity) {
      Swal.fire('Planes de acción', 'No hay una brecha seleccionada para crear el plan.', 'info');
      return;
    }

    if (this.actionPlans.some((plan) =>
      plan.opportunityId === opportunity.id &&
      this.filtersSignature(plan.demographicFilters ?? []) === this.filtersSignature(this.selectedFilters)
    )) {
      Swal.fire('Planes de acción', 'Ya existe un plan para esta brecha.', 'info');
      return;
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + this.getSuggestedDays(opportunity.priority));

    const plan: ActionPlan = {
      id: Date.now(),
      opportunityId: opportunity.id,
      survey: opportunity.granFactor,
      factor: opportunity.factor,
      area: opportunity.area,
      sponsor: 'Recursos Humanos / Líder del área',
      scope: opportunity.scope,
      reason: opportunity.reason,
      criticalQuestion: opportunity.criticalQuestion,
      action: opportunity.suggestedAction,
      resources: opportunity.suggestedResource,
      kpi: opportunity.suggestedKpi,
      owner: this.t('PENDING_ASSIGNMENT'),
      responsibleEmployeeId: null,
      responsibleEmployeeIds: [],
      term: opportunity.priority === 'ALTA' ? 'Corto plazo' : opportunity.priority === 'MEDIA' ? 'Mediano plazo' : 'Largo plazo',
      dueDate: this.toDateInput(dueDate),
      followUpFrequency: opportunity.priority === 'ALTA' ? 'Semanal' : 'Quincenal',
      sendResponsibleEmails: false,
      validation: 'Revisión de evidencia y variación del indicador en seguimiento.',
      evidence: '',
      status: 'SIN_INICIAR',
      priority: opportunity.priority,
      createdAt: new Date().toISOString(),
      tasks: this.createDefaultTasks(opportunity, dueDate),
      followUps: [],
      demographicFilters: this.selectedFilters,
    };

    this.actionPlans = [{ ...plan, isPersisted: false, isDirty: true }, ...this.actionPlans];
    this.selectedTab = 'planes';
  }

  async removePlan(plan: ActionPlan): Promise<void> {
    if (!this.selectedOrganizationId) return;
    if (!plan.isPersisted) {
      this.actionPlans = this.actionPlans.filter((item) => item.id !== plan.id);
      return;
    }
    try {
      await this.organizacionService.deleteClimaActionPlan(plan.id, this.selectedOrganizationId);
      this.actionPlans = this.actionPlans.filter((item) => item.id !== plan.id);
    } catch (error) {
      console.error('Error al eliminar plan de acción:', error);
      Swal.fire('Planes de acción', 'No fue posible eliminar el plan de acción.', 'error');
    }
  }

  addTask(plan: ActionPlan): void {
    const task: ActionTask = {
      id: 0,
      title: 'Nueva tarea',
      responsible: plan.owner || this.t('PENDING_ASSIGNMENT'),
      deliverable: 'Evidencia de ejecución',
      dueDate: plan.dueDate,
      evidence: '',
      done: false,
    };

    plan.tasks = [...plan.tasks, task];
    this.onPlanChanged(plan);
  }

  removeTask(plan: ActionPlan, task: ActionTask): void {
    plan.tasks = plan.tasks.filter((item) => item.id !== task.id);
    this.onPlanChanged(plan);
  }

  onPlanChanged(plan: ActionPlan): void {
    plan.isDirty = true;
  }

  async selectPlanResponsible(plan: ActionPlan): Promise<void> {
    if (!this.selectedOrganizationId) return;
    if (!this.responsibleEmployees.length) {
      await this.loadResponsibleEmployees();
    }
    if (!this.responsibleEmployees.length) return;

    const dialogRef = this.dialog.open(ActionPlanResponsibleDialogComponent, {
      width: '1480px',
      maxWidth: '98vw',
      maxHeight: '88vh',
      autoFocus: false,
      data: {
        employees: this.responsibleEmployees,
        selectedIds: plan.responsibleEmployeeIds?.length
          ? plan.responsibleEmployeeIds
          : plan.responsibleEmployeeId ? [plan.responsibleEmployeeId] : [],
      },
    });
    dialogRef.afterClosed().subscribe((employees?: ActionPlanResponsible[]) => {
      if (!employees) return;
      plan.owner = employees.map((employee) => employee.name).join(', ') || this.t('PENDING_ASSIGNMENT');
      plan.responsibleEmployeeIds = employees.map((employee) => employee.id);
      plan.responsibleEmployeeId = plan.responsibleEmployeeIds[0] ?? null;
      plan.tasks = plan.tasks.map((task) => ({
        ...task,
        responsible: plan.owner,
      }));
      this.onPlanChanged(plan);
    });
  }

  hasAssignedResponsibles(plan: ActionPlan): boolean {
    return this.getAssignedResponsibleIds(plan).length > 0;
  }

  private getAssignedResponsibleIds(plan: ActionPlan): number[] {
    const ids = [
      ...(plan.responsibleEmployeeIds ?? []),
      plan.responsibleEmployeeId,
    ]
      .map((employeeId) => Number(employeeId))
      .filter((employeeId) => Number.isFinite(employeeId) && employeeId > 0);
    return [...new Set(ids)];
  }

  private async loadResponsibleEmployees(): Promise<void> {
    if (!this.selectedOrganizationId || this.loadingResponsibleEmployees) return;
    this.loadingResponsibleEmployees = true;
    try {
      const response = await this.organizacionService.getEmployees(this.selectedOrganizationId);
      this.responsibleEmployees = this.asArray(response?.data)
        .map((employee) => this.normalizeResponsibleEmployee(employee))
        .filter((employee): employee is ActionPlanResponsible => employee !== null);
    } catch (error) {
      console.error('Error al cargar empleados responsables:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar los empleados de la organización.', 'error');
    } finally {
      this.loadingResponsibleEmployees = false;
    }
  }

  private normalizeResponsibleEmployee(employee: any): ActionPlanResponsible | null {
    const id = Number(this.getValue(employee, ['idEmpleado', 'empleadoId', 'id']));
    const firstName = this.getCatalogLabel(employee, ['nombres', 'nombre']);
    const lastName = this.getCatalogLabel(employee, ['apellidos', 'apellido']);
    const name = this.getCatalogLabel(employee, ['nombreCompleto']) || `${firstName} ${lastName}`.trim();
    if (!id || !name) return null;

    const excludedKeys = new Set([
      'id', 'idempleado', 'empleadoid', 'idorganizacion', 'nombres', 'nombre', 'apellidos', 'apellido', 'nombrecompleto',
      'cargo', 'celular', 'telefono', 'email', 'correo', 'tipioenvioencuesta', 'tipoenvioencuesta', 'fecharegistro',
      'estado', 'activo', 'nombrejefe', 'idempleadojefe', 'idjefe', 'imagen', 'imagensrc',
    ]);
    const demographics = Object.entries(employee ?? {}).reduce<Record<string, string>>((result, [key, value]) => {
      if (excludedKeys.has(this.normalizeKey(key).toLowerCase()) || value === null || value === undefined || typeof value === 'object') return result;
      const text = String(value).trim();
      if (text) result[key] = text;
      return result;
    }, {});

    return {
      id,
      name,
      cargo: this.getCatalogLabel(employee, ['cargo', 'puesto']),
      email: this.getCatalogLabel(employee, ['email', 'correo']),
      demographics,
    };
  }

  getPlanProgress(plan: ActionPlan): number {
    if (!plan.tasks.length) {
      return plan.status === 'COMPLETADO' ? 100 : 0;
    }

    return this.round((plan.tasks.filter((task) => task.done).length / plan.tasks.length) * 100, 1);
  }

  getEffectivePlanStatus(plan: ActionPlan): PlanStatus {
    const progress = this.getPlanProgress(plan);
    if (progress >= 100 || plan.status === 'COMPLETADO') {
      return 'COMPLETADO';
    }

    if (this.isPlanOverdue(plan) || plan.status === 'EN_RIESGO') {
      return 'EN_RIESGO';
    }

    if (progress > 0 || plan.status === 'EN_PROCESO') {
      return 'EN_PROCESO';
    }

    return 'SIN_INICIAR';
  }

  getStatusLabel(status: PlanStatus): string {
    const labels: Record<PlanStatus, string> = {
      SIN_INICIAR: this.t('STATUS_NOT_STARTED'),
      EN_PROCESO: this.t('STATUS_IN_PROGRESS'),
      EN_RIESGO: this.t('STATUS_AT_RISK'),
      COMPLETADO: this.t('STATUS_COMPLETED'),
    };
    return labels[status];
  }

  getPriorityLabel(priority: PlanPriority): string {
    const labels: Record<PlanPriority, string> = {
      ALTA: this.t('PRIORITY_HIGH'),
      MEDIA: this.t('PRIORITY_MEDIUM'),
      BAJA: this.t('PRIORITY_LOW'),
    };
    return labels[priority];
  }

  getPriorityClass(priority: PlanPriority): string {
    return priority.toLowerCase();
  }

  getScoreClass(value: number | null): string {
    if (value === null) return 'neutral';
    if (value >= 80) return 'good';
    if (value >= 70) return 'watch';
    if (value >= 60) return 'risk';
    return 'critical';
  }

  getStatusClass(status: PlanStatus): string {
    return status.toLowerCase().replace('_', '-');
  }

  getOpportunityById(id: string): ImprovementOpportunity | null {
    return this.planOpportunities.find((item) => item.id === id) ?? null;
  }

  getTopQuestionForFactor(factorId: number): QuestionMetric | null {
    return this.questionMetrics
      .filter((question) => question.idFactor === factorId)
      .sort((left, right) => this.nullLast(left.favorable, right.favorable))[0] ?? null;
  }

  isPlanOverdue(plan: ActionPlan): boolean {
    if (!plan.dueDate || this.getPlanProgress(plan) >= 100) {
      return false;
    }

    const due = new Date(`${plan.dueDate}T23:59:59`);
    return due.getTime() < Date.now();
  }

  async exportPlans(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'JustLink';
    workbook.created = new Date();

    const summary = workbook.addWorksheet('Resumen');
    summary.columns = [
      { header: 'Organización', key: 'organizacion', width: 30 },
      { header: 'Clima', key: 'clima', width: 34 },
      { header: 'Filtro', key: 'filtro', width: 45 },
      { header: 'Satisfacción', key: 'satisfaccion', width: 16 },
      { header: 'Desfavorable', key: 'desfavorable', width: 16 },
      { header: 'NSAT', key: 'nsat', width: 16 },
      { header: 'Planes', key: 'planes', width: 12 },
      { header: 'Progreso', key: 'progreso', width: 12 },
    ];
    summary.addRow({
      organizacion: this.selectedOrganizationName,
      clima: this.selectedClimaName,
      filtro: this.filterChips.map((chip) => `${chip.label}: ${chip.value}`).join('; ') || 'Sin filtro',
      satisfaccion: this.formatPercent(this.generalScore),
      desfavorable: this.formatPercent(this.generalUnfavorable),
      nsat: this.formatNumber(this.generalNsat),
      planes: this.planSummary.total,
      progreso: `${this.planSummary.progress}%`,
    });

    const gaps = workbook.addWorksheet('Brechas priorizadas');
    gaps.columns = [
      { header: 'Prioridad', key: 'prioridad', width: 14 },
      { header: this.t('SURVEY'), key: 'granFactor', width: 22 },
      { header: 'Factor', key: 'factor', width: 28 },
      { header: 'Área', key: 'area', width: 24 },
      { header: 'Razón', key: 'reason', width: 58 },
      { header: 'Satisfacción', key: 'score', width: 16 },
      { header: 'Desfavorable', key: 'unfavorable', width: 16 },
      { header: 'Brecha vs meta', key: 'gap', width: 16 },
    ];
    this.opportunities.forEach((item) => gaps.addRow({
      prioridad: this.getPriorityLabel(item.priority),
      granFactor: item.granFactor,
      factor: item.factor,
      area: item.area,
      reason: item.reason,
      score: this.formatPercent(item.score),
      unfavorable: this.formatPercent(item.unfavorable),
      gap: `${item.gap.toFixed(1)} pts`,
    }));

    const plans = workbook.addWorksheet('Planes de acción');
    plans.columns = [
      { header: 'Factor / Área', key: 'factor', width: 26 },
      { header: 'Razón', key: 'reason', width: 45 },
      { header: 'Aplica a', key: 'scope', width: 28 },
      { header: 'Qué - Actividades', key: 'action', width: 45 },
      { header: 'Cómo - Recursos', key: 'resources', width: 40 },
      { header: 'Meta / KPI', key: 'kpi', width: 42 },
      { header: 'Responsable', key: 'owner', width: 24 },
      { header: 'Plazo', key: 'term', width: 18 },
      { header: 'Fecha límite', key: 'dueDate', width: 16 },
      { header: 'Periodicidad', key: 'frequency', width: 18 },
      { header: 'Progreso', key: 'progress', width: 14 },
      { header: 'Estado', key: 'status', width: 16 },
      { header: 'Validación', key: 'validation', width: 35 },
      { header: 'Evidencia', key: 'evidence', width: 35 },
    ];
    this.visibleActionPlans.forEach((plan) => plans.addRow({
      factor: `${plan.factor} / ${plan.area}`,
      reason: plan.reason,
      scope: plan.scope,
      action: plan.action,
      resources: plan.resources,
      kpi: plan.kpi,
      owner: plan.owner,
      term: plan.term,
      dueDate: plan.dueDate,
      frequency: plan.followUpFrequency,
      progress: `${this.getPlanProgress(plan)}%`,
      status: this.getStatusLabel(this.getEffectivePlanStatus(plan)),
      validation: plan.validation,
      evidence: plan.evidence,
    }));

    const tasks = workbook.addWorksheet('Tareas');
    tasks.columns = [
      { header: 'Plan', key: 'plan', width: 30 },
      { header: 'Tarea', key: 'task', width: 40 },
      { header: 'Responsable', key: 'responsible', width: 24 },
      { header: 'Entregable / Evidencia', key: 'deliverable', width: 40 },
      { header: 'Fecha para completar', key: 'dueDate', width: 20 },
      { header: 'Completada', key: 'done', width: 14 },
      { header: 'Evidencia', key: 'evidence', width: 35 },
    ];
    this.visibleActionPlans.forEach((plan) => {
      plan.tasks.forEach((task) => tasks.addRow({
        plan: plan.factor,
        task: task.title,
        responsible: task.responsible,
        deliverable: task.deliverable,
        dueDate: task.dueDate,
        done: task.done ? 'Sí' : 'No',
        evidence: task.evidence,
      }));
    });

    [summary, gaps, plans, tasks].forEach((sheet) => {
      sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      sheet.views = [{ state: 'frozen', ySplit: 1 }];
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `Planes_Accion_Clima_${this.selectedOrganizationId ?? 'org'}_${this.selectedClimaId ?? 'clima'}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  }

  private normalizeFactorMetric(item: any): FactorMetric {
    return {
      idFactor: Number(item?.IdFactor ?? item?.idFactor ?? 0),
      factor: String(item?.Factor ?? item?.factor ?? 'Factor').trim(),
      granFactor: String(item?.EtiquetaGranFactor ?? item?.GranFactor ?? item?.granFactor ?? 'General').trim(),
      favorable: this.getNumber(item, ['pct_satisfaccion', 'pct_satisfaccion_equal', 'pct_favorable', 'pct_top2']),
      desfavorable: this.getNumber(item, ['pct_insatisfaccion_restrictivo', 'pct_insatisfaccion', 'pct_desfavorable', 'pct_opt3']),
      restrictivo: this.getNumber(item, ['pct_satisfaccion_restrictivo', 'pct_satisfaccion']),
      nsat: this.getNumber(item, ['nsat']),
      total: this.getNumber(item, ['total_respuestas']),
      top1: this.getNumber(item, ['pct_top1', 'pct_opt1']),
      bottom1: this.getNumber(item, ['pct_bottom1', 'pct_opt4']),
    };
  }

  private normalizeQuestionMetric(item: any): QuestionMetric {
    return {
      idPregunta: Number(item?.IdPregunta ?? item?.idPregunta ?? 0),
      idFactor: Number(item?.IdFactor ?? item?.idFactor ?? 0),
      factor: String(item?.Factor ?? item?.factor ?? 'Factor').trim(),
      granFactor: String(item?.EtiquetaGranFactor ?? item?.GranFactor ?? item?.granFactor ?? 'General').trim(),
      pregunta: String(item?.Pregunta ?? item?.pregunta ?? '').trim(),
      favorable: this.getNumber(item, ['pct_favorable', 'pct_top2', 'pctFav']),
      desfavorable: this.getNumber(item, ['pct_desfavorable', 'pctDesf']),
      nsat: this.getNumber(item, ['nsat']),
      mean: this.getNumber(item, ['mean_0_100', 'mean']),
      total: this.getNumber(item, ['total_respuestas']),
    };
  }

  private buildOpportunities(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];
    const generalScore = this.generalScore;
    const generalUnfavorable = this.generalUnfavorable;

    if (generalScore !== null && generalScore < this.targetScore) {
      opportunities.push({
        id: 'general-clima',
        factor: 'Clima general',
        granFactor: 'Organizacional',
        area: this.currentScopeLabel(),
        reason: `La satisfacción general está en ${this.formatPercent(generalScore)}, por debajo de la meta sugerida de ${this.targetScore}%.`,
        score: generalScore,
        unfavorable: generalUnfavorable,
        gap: this.round(this.targetScore - generalScore, 1),
        priority: this.getPriority(generalScore, generalUnfavorable),
        scope: this.currentScopeLabel(),
        suggestedAction: 'Socializar resultados, alinear prioridades con líderes y activar seguimiento quincenal de compromisos.',
        suggestedResource: 'Sesión ejecutiva, presentación de hallazgos, tablero de compromisos y responsables.',
        suggestedKpi: `Elevar satisfacción general a ${this.targetScore}% o más en el próximo pulso.`,
        source: 'general',
      });
    }

    this.factorMetrics.forEach((factor) => {
      const score = factor.favorable;
      const unfavorable = factor.desfavorable;
      const shouldCreate = factor.esOportunidad === true ||
        (score !== null && score < this.targetScore) ||
        (unfavorable !== null && unfavorable >= 25);

      if (!shouldCreate) {
        return;
      }

      const topQuestion = this.getTopQuestionForFactor(factor.idFactor);
      opportunities.push({
        id: `factor-${factor.idFactor || this.normalizeKey(factor.factor)}-${this.normalizeKey(factor.granFactor)}`,
        factor: factor.factor,
        granFactor: factor.granFactor,
        area: this.currentScopeLabel(),
        reason: this.buildFactorReason(factor, topQuestion),
        score,
        unfavorable,
        gap: this.round(Math.max(0, this.targetScore - (score ?? 0)), 1),
        priority: factor.prioridadSugerida ?? this.getPriority(score, unfavorable),
        scope: this.currentScopeLabel(),
        suggestedAction: this.suggestActionForFactor(factor.factor),
        suggestedResource: this.suggestResourcesForFactor(factor.factor),
        suggestedKpi: `Subir ${factor.factor} a ${this.targetScore}% de favorabilidad y reducir desfavorabilidad por debajo de 20%.`,
        source: 'factor',
        criticalQuestion: topQuestion?.pregunta,
      });
    });

    this.questionMetrics
      .filter((question) => question.esOportunidad === true ||
        (question.favorable ?? 100) < 65 || (question.desfavorable ?? 0) >= 35)
      .forEach((question) => {
        opportunities.push({
          id: `pregunta-${question.idPregunta || this.normalizeKey(question.pregunta)}`,
          factor: question.factor,
          granFactor: question.granFactor,
          area: this.currentScopeLabel(),
          reason: `Ítem crítico: "${question.pregunta}" con ${this.formatPercent(question.favorable)} de favorabilidad y ${this.formatPercent(question.desfavorable)} desfavorable.`,
          score: question.favorable,
          unfavorable: question.desfavorable,
          gap: this.round(Math.max(0, this.targetScore - (question.favorable ?? 0)), 1),
          priority: question.prioridadSugerida ?? this.getPriority(question.favorable, question.desfavorable),
          scope: this.currentScopeLabel(),
          suggestedAction: this.suggestActionForFactor(question.factor),
          suggestedResource: this.suggestResourcesForFactor(question.factor),
          suggestedKpi: `Mejorar el ítem crítico al menos 10 puntos y documentar acciones de cierre.`,
          source: 'pregunta',
          criticalQuestion: question.pregunta,
        });
      });

    return opportunities
      .sort((left, right) =>
        this.priorityWeight(right.priority) - this.priorityWeight(left.priority) ||
        right.gap - left.gap ||
        this.nullLast(left.score, right.score)
      );
  }

  private buildFactorReason(factor: FactorMetric, topQuestion: QuestionMetric | null): string {
    const parts = [
      `${factor.factor} registra ${this.formatPercent(factor.favorable)} de favorabilidad`,
      factor.desfavorable !== null ? `${this.formatPercent(factor.desfavorable)} desfavorable` : '',
      topQuestion ? `ítem más sensible: "${topQuestion.pregunta}" (${this.formatPercent(topQuestion.favorable)})` : '',
    ].filter(Boolean);

    return parts.join('; ') + '.';
  }

  private suggestActionForFactor(factorName: string): string {
    const key = this.normalizeKey(factorName);
    if (key.includes('COMUNIC')) return 'Implementar rituales de comunicación, acuerdos entre áreas y retroalimentación de mensajes clave.';
    if (key.includes('LIDER') || key.includes('GESTION')) return 'Activar sesiones de liderazgo, coaching práctico y compromisos de gestión con el equipo.';
    if (key.includes('COMPEN') || key.includes('SALAR')) return 'Revisar criterios de compensación, transparencia salarial y comunicación de beneficios.';
    if (key.includes('MOTIV') || key.includes('RECON')) return 'Diseñar prácticas de reconocimiento, conversaciones de desarrollo y seguimiento de logros.';
    if (key.includes('CONDIC')) return 'Priorizar mejoras operativas del puesto, condiciones físicas/herramientas y responsables de ejecución.';
    if (key.includes('EQUIPO')) return 'Facilitar dinámicas de colaboración, acuerdos de trabajo y seguimiento de dependencias entre áreas.';
    return 'Definir plan de cierre de brecha con responsables, tareas, evidencias y seguimiento periódico.';
  }

  private suggestResourcesForFactor(factorName: string): string {
    const key = this.normalizeKey(factorName);
    if (key.includes('COMUNIC')) return 'Calendario de reuniones, minuta estándar, canal oficial y piezas de comunicación.';
    if (key.includes('LIDER') || key.includes('GESTION')) return 'Guía de conversaciones 1:1, coaching, agenda de compromisos y tablero de seguimiento.';
    if (key.includes('COMPEN') || key.includes('SALAR')) return 'Benchmark salarial, descriptores de puesto, matriz de beneficios y comunicación formal.';
    if (key.includes('CONDIC')) return 'Inventario de necesidades, presupuesto, compras/mantenimiento y checklist de mejoras.';
    return 'Reuniones de trabajo, responsables definidos, tablero de acciones y evidencia documental.';
  }

  private createDefaultTasks(opportunity: ImprovementOpportunity, dueDate: Date): ActionTask[] {
    const first = new Date();
    first.setDate(first.getDate() + 7);
    const second = new Date();
    second.setDate(second.getDate() + 21);

    return [
      {
        id: Date.now() + 1,
        title: 'Socializar hallazgo y validar causa raíz',
        responsible: 'Líder del área / RRHH',
        deliverable: 'Minuta con causa raíz y acuerdos',
        dueDate: this.toDateInput(first),
        evidence: '',
        done: false,
      },
      {
        id: Date.now() + 2,
        title: 'Ejecutar acciones correctivas priorizadas',
        responsible: 'Responsable asignado',
        deliverable: 'Registro de actividades y participantes',
        dueDate: this.toDateInput(second),
        evidence: '',
        done: false,
      },
      {
        id: Date.now() + 3,
        title: 'Validar avance contra KPI',
        responsible: opportunity.priority === 'ALTA' ? 'Sponsor ejecutivo' : 'RRHH',
        deliverable: 'Evidencia de mejora y decisión de cierre/continuidad',
        dueDate: this.toDateInput(dueDate),
        evidence: '',
        done: false,
      },
    ];
  }

  private getPriority(score: number | null, unfavorable: number | null): PlanPriority {
    if ((score !== null && score < 60) || (unfavorable !== null && unfavorable >= 35)) return 'ALTA';
    if ((score !== null && score < 75) || (unfavorable !== null && unfavorable >= 25)) return 'MEDIA';
    return 'BAJA';
  }

  private priorityWeight(priority: PlanPriority): number {
    return priority === 'ALTA' ? 3 : priority === 'MEDIA' ? 2 : 1;
  }

  private getSuggestedDays(priority: PlanPriority): number {
    return priority === 'ALTA' ? 30 : priority === 'MEDIA' ? 60 : 90;
  }

  private currentScopeLabel(): string {
    const chips = this.filterChips.map((chip) => `${chip.label}: ${chip.value}`);
    return chips.length ? chips.join(' / ') : this.t('ENTIRE_ORGANIZATION');
  }

  private buildFilterString(filters: DemographicSelection[]): string {
    return (filters ?? [])
      .flatMap((filter) =>
        (filter.valores ?? [])
          .filter((value) => value !== null && value !== undefined)
          .map((value) => {
            const text = typeof value === 'string' ? value : String(value);
            return `${filter.idCampo}|${text.trim() === '' ? 'vacío' : text}`;
          })
      )
      .join(',');
  }

  private extractDemographicTree(response: any): any {
    const payload = response?.data?.data ?? response?.data ?? response;
    const first = Array.isArray(payload) ? payload[0] : payload;

    if (!first) {
      return null;
    }

    if (first?.order && first?.values) {
      return first;
    }

    const jsonText = typeof first === 'string'
      ? first
      : Object.values(first)[0];

    if (!jsonText) {
      return null;
    }

    return typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText;
  }

  private async loadActionPlans(): Promise<void> {
    if (!this.selectedOrganizationId || !this.selectedClimaId) {
      this.actionPlans = [];
      return;
    }

    this.loadingPlans = true;
    try {
      const response = await this.organizacionService.getClimaActionPlans(
        this.selectedOrganizationId,
        this.selectedClimaId,
      );
      const payload = this.extractApiData(response);
      const plans = Array.isArray(payload)
        ? payload
        : this.asArray(payload?.planes ?? payload?.items ?? payload);
      this.actionPlans = plans
        .map((plan) => this.normalizeApiPlan(plan))
        .filter((plan): plan is ActionPlan => !!plan);
    } catch (error) {
      console.error('Error al cargar planes de acción:', error);
      this.actionPlans = [];
      Swal.fire('Planes de acción', 'No fue posible recuperar los planes guardados.', 'error');
    } finally {
      this.loadingPlans = false;
    }
  }

  async savePlan(plan: ActionPlan): Promise<void> {
    if (this.savingPlanIds.has(plan.id)) return;
    if (!this.hasAssignedResponsibles(plan)) {
      await Swal.fire({
        title: this.t('RESPONSIBLES_REQUIRED_TITLE'),
        text: this.t('RESPONSIBLES_REQUIRED_TEXT'),
        icon: 'warning',
        confirmButtonText: this.t('ACCEPT'),
      });
      return;
    }

    const shouldSendEmails = plan.sendResponsibleEmails === true;
    const responsibleIds = this.getAssignedResponsibleIds(plan);
    let emailRecipients: ActionPlanResponsible[] = [];
    let missingEmailCount = 0;

    if (shouldSendEmails) {
      if (!responsibleIds.every((employeeId) => this.responsibleEmployees.some((employee) => employee.id === employeeId))) {
        await this.loadResponsibleEmployees();
      }

      const selectedEmployees = responsibleIds
        .map((employeeId) => this.responsibleEmployees.find((employee) => employee.id === employeeId))
        .filter((employee): employee is ActionPlanResponsible => !!employee);
      emailRecipients = selectedEmployees.filter((employee) => this.isValidEmail(employee.email));
      missingEmailCount = responsibleIds.length - emailRecipients.length;

      if (!emailRecipients.length) {
        await Swal.fire({
          title: this.t('EMAIL_RECIPIENTS_REQUIRED_TITLE'),
          text: this.t('EMAIL_RECIPIENTS_REQUIRED_TEXT'),
          icon: 'warning',
          confirmButtonText: this.t('ACCEPT'),
        });
        return;
      }
    }

    const wasPersisted = plan.isPersisted === true;
    this.savingPlanIds.add(plan.id);
    try {
      const response = await this.organizacionService.saveClimaActionPlan(
        this.toApiPlanPayload(plan),
        wasPersisted ? plan.id : null,
      );
      const savedPlan = this.normalizeApiPlan(this.extractApiData(response));
      let persistedPlan = savedPlan;
      if (savedPlan) {
        const index = this.actionPlans.findIndex((item) => item.id === plan.id);
        if (index >= 0) {
          this.actionPlans[index] = { ...savedPlan, isPersisted: true, isDirty: false };
        }
      } else {
        await this.loadActionPlans();
        persistedPlan = this.actionPlans.find((item) => item.opportunityId === plan.opportunityId) ?? null;
      }

      const savedMessage = this.extractApiMessage(response) || this.t(wasPersisted ? 'PLAN_UPDATED_SUCCESS' : 'PLAN_CREATED_SUCCESS');
      if (shouldSendEmails && persistedPlan) {
        const emailResult = await this.sendActionPlanEmails(persistedPlan, emailRecipients, missingEmailCount);
        const hasEmailWarnings = emailResult.failed > 0 || emailResult.missing > 0;
        await Swal.fire({
          title: this.t(hasEmailWarnings ? 'EMAIL_PARTIAL_TITLE' : 'EMAIL_SUCCESS_TITLE'),
          text: `${savedMessage} ${this.t(
            hasEmailWarnings ? 'EMAIL_PARTIAL_TEXT' : 'EMAIL_SUCCESS_TEXT',
            { sent: emailResult.sent, failed: emailResult.failed, missing: emailResult.missing },
          )}`,
          icon: hasEmailWarnings ? 'warning' : 'success',
          confirmButtonText: this.t('ACCEPT'),
        });
        return;
      }

      await Swal.fire({
        title: this.t(wasPersisted ? 'PLAN_UPDATED_TITLE' : 'PLAN_CREATED_TITLE'),
        text: savedMessage,
        icon: 'success',
        confirmButtonText: this.t('ACCEPT'),
      });
    } catch (error) {
      console.error('Error al guardar plan de acción:', error);
      Swal.fire('Planes de acción', 'No fue posible guardar el plan de acción.', 'error');
    } finally {
      this.savingPlanIds.delete(plan.id);
    }
  }

  private async sendActionPlanEmails(
    plan: ActionPlan,
    recipients: ActionPlanResponsible[],
    missing: number,
  ): Promise<ActionPlanEmailResult> {
    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        const payload = this.buildActionPlanEmailPayload(plan, recipient);
        const response = await this.organizacionService.sendClimaActionPlanEmail(payload);
        const responsePayload = response?.data ?? response;
        if (responsePayload?.ok === false || responsePayload?.success === false) {
          throw responsePayload;
        }
        return responsePayload;
      }),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `No fue posible enviar el plan de acción al responsable ${recipients[index]?.id}:`,
          result.reason,
        );
      }
    });

    return {
      sent: results.filter((result) => result.status === 'fulfilled').length,
      failed: results.filter((result) => result.status === 'rejected').length,
      missing,
    };
  }

  private buildActionPlanEmailPayload(
    plan: ActionPlan,
    recipient: ActionPlanResponsible,
  ): Record<string, unknown> {
    const organizationId = Number(this.selectedOrganizationId);
    const climaId = Number(this.selectedClimaId);
    const accessCode = btoa(`${recipient.id}|${climaId}|${plan.id}`);
    const portalUrl = `https://justlink360.net/#/portal-clima/planes-accion/${encodeURIComponent(accessCode)}`;
    const isEnglish = this.translate.currentLang?.toLowerCase().startsWith('en');
    const climateName = this.selectedClimaName || plan.survey || (isEnglish ? 'Workplace climate' : 'Clima laboral');
    const dueDate = this.formatDate(plan.dueDate);
    const subject = isEnglish
      ? `Assigned workplace climate action plan - ${climateName}`
      : `Plan de acción de clima asignado - ${climateName}`;
    const copy = isEnglish
      ? {
          greeting: `Hello ${recipient.name},`,
          intro: 'You have been assigned as an owner of a workplace climate action plan.',
          plan: 'Assigned plan',
          action: 'What will be done',
          dueDate: 'Due date',
          frequency: 'Follow-up frequency',
          button: 'Open action plan',
          notice: 'Use the following personal link to review activities, record evidence, and update progress.',
          disclaimer: 'This link is personal and must not be shared. The information and progress of the plan are confidential within your organization.',
        }
      : {
          greeting: `Hola ${recipient.name},`,
          intro: 'Has sido asignado como responsable de un plan de acción de clima laboral.',
          plan: 'Plan asignado',
          action: 'Qué se hará',
          dueDate: 'Fecha límite',
          frequency: 'Periodicidad de seguimiento',
          button: 'Abrir plan de acción',
          notice: 'Ingresa mediante el siguiente enlace personal para consultar las tareas, registrar evidencias y actualizar el progreso.',
          disclaimer: 'Este enlace es personal y no debe compartirse. La información y los avances del plan son confidenciales a lo interno de tu organización.',
        };
    const html = `
      <!doctype html>
      <html lang="${isEnglish ? 'en' : 'es'}">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="margin:0;background:#f3f6f8;font-family:Arial,sans-serif;color:#243746;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f8;padding:28px 12px;">
            <tr><td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #dce5ea;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#123746;padding:20px 28px;color:#ffffff;"><strong style="font-size:21px;">Just-Link 360</strong><div style="font-size:12px;color:#c8d9df;margin-top:4px;">${this.escapeHtml(climateName)}</div></td></tr>
                <tr><td style="padding:28px;">
                  <p style="font-size:18px;font-weight:700;margin:0 0 12px;">${this.escapeHtml(copy.greeting)}</p>
                  <p style="font-size:14px;line-height:1.6;margin:0 0 8px;">${this.escapeHtml(copy.intro)}</p>
                  <p style="font-size:14px;line-height:1.6;margin:0 0 22px;">${this.escapeHtml(copy.notice)}</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7fafb;border-left:4px solid #176477;margin-bottom:22px;">
                    <tr><td style="padding:16px 18px;">
                      <div style="font-size:11px;text-transform:uppercase;color:#647985;font-weight:700;">${this.escapeHtml(copy.plan)}</div>
                      <div style="font-size:18px;font-weight:700;color:#183542;margin:4px 0 13px;">${this.escapeHtml(plan.factor)}</div>
                      <div style="font-size:11px;text-transform:uppercase;color:#647985;font-weight:700;">${this.escapeHtml(copy.action)}</div>
                      <div style="font-size:13px;line-height:1.55;margin:4px 0 13px;">${this.escapeHtml(plan.action)}</div>
                      <div style="font-size:13px;"><strong>${this.escapeHtml(copy.dueDate)}:</strong> ${this.escapeHtml(dueDate)} &nbsp; <strong>${this.escapeHtml(copy.frequency)}:</strong> ${this.escapeHtml(plan.followUpFrequency || '-')}</div>
                    </td></tr>
                  </table>
                  <div style="text-align:center;margin:24px 0;"><a href="${this.escapeHtml(portalUrl)}" style="display:inline-block;background:#0866c6;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 22px;border-radius:6px;">${this.escapeHtml(copy.button)}</a></div>
                  <p style="border-top:1px solid #e2e8ec;color:#687b86;font-size:11px;line-height:1.55;margin:24px 0 0;padding-top:16px;">${this.escapeHtml(copy.disclaimer)}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>`;

    return {
      destinatario: recipient.email,
      asunto: subject,
      mensajeHtml: html,
      organizationId,
      IdModelo: plan.id,
      IdEmpleado: recipient.id,
      evaluaciones: [{
        empleadoId: recipient.id,
        nombreEmpleado: recipient.name,
        planAccionId: plan.id,
      }],
      IdFlujo: climaId,
      IdPlanAccion: plan.id,
      codigoPlanResponsable: accessCode,
      urlPlanAccion: portalUrl,
    };
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  private toApiPlanPayload(plan: ActionPlan): any {
    return {
      idOrganizacion: this.selectedOrganizationId,
      idFlujo: this.selectedClimaId,
      oportunidadId: plan.opportunityId,
      encuesta: plan.survey,
      factor: plan.factor,
      area: plan.area,
      alcance: plan.scope,
      motivo: plan.reason,
      preguntaCritica: plan.criticalQuestion ?? '',
      accion: plan.action,
      recursos: plan.resources,
      kpi: plan.kpi,
      patrocinador: plan.sponsor,
      responsableEmpleadoIds: this.getAssignedResponsibleIds(plan),
      plazo: plan.term,
      fechaLimite: plan.dueDate,
      frecuenciaSeguimiento: plan.followUpFrequency,
      validacion: plan.validation,
      evidencia: plan.evidence,
      estado: plan.status === 'EN_PROCESO' ? 'EN_PROGRESO' : plan.status,
      prioridad: plan.priority,
      filtrosDemograficos: plan.demographicFilters ?? [],
      tareas: plan.tasks.map((task) => this.toApiTaskPayload(task)),
    };
  }

  private toApiTaskPayload(task: ActionTask): any {
    return {
      ...(task.id > 0 ? { id: task.id } : {}),
      titulo: task.title,
      responsable: task.responsible,
      entregable: task.deliverable,
      fechaLimite: task.dueDate,
      evidencia: task.evidence,
      completada: task.done,
    };
  }

  private normalizeApiPlan(source: any): ActionPlan | null {
    source = source?.plan ?? source?.item ?? source;
    if (!source || typeof source !== 'object') return null;
    const id = Number(this.getValue(source, ['id', 'idPlan', 'planId']));
    if (!Number.isFinite(id) || id <= 0) return null;

    const responsibleItems = this.asArray(this.getValue(source, ['responsables', 'responsibleEmployees']));
    const responsibleEmployeeIds = responsibleItems
      .map((item) => Number(this.getValue(item, ['idEmpleado', 'empleadoId', 'id'])))
      .filter((employeeId) => Number.isFinite(employeeId) && employeeId > 0);
    const responseResponsibleIds = this.asArray(this.getValue(source, ['responsableEmpleadoIds', 'responsibleEmployeeIds']))
      .map((employeeId) => Number(employeeId))
      .filter((employeeId) => Number.isFinite(employeeId) && employeeId > 0);
    const owner = responsibleItems
      .map((item) => this.getCatalogLabel(item, ['nombreCompleto', 'nombre', 'name']))
      .filter(Boolean)
      .join(', ') || this.getCatalogLabel(source, ['responsablesTexto', 'owner', 'responsable']) || this.t('PENDING_ASSIGNMENT');

    return {
      id,
      opportunityId: this.getCatalogLabel(source, ['oportunidadId', 'opportunityId']),
      survey: this.getCatalogLabel(source, ['encuesta', 'survey']) || '-',
      factor: this.getCatalogLabel(source, ['factor']) || '-',
      area: this.getCatalogLabel(source, ['area', 'encuesta']) || '-',
      sponsor: this.getCatalogLabel(source, ['patrocinador', 'sponsor']),
      scope: this.getCatalogLabel(source, ['alcance', 'scope']),
      reason: this.getCatalogLabel(source, ['motivo', 'reason']),
      criticalQuestion: this.getCatalogLabel(source, ['preguntaCritica', 'criticalQuestion']),
      action: this.getCatalogLabel(source, ['accion', 'action']),
      resources: this.getCatalogLabel(source, ['recursos', 'resources']),
      kpi: this.getCatalogLabel(source, ['kpi']),
      owner,
      responsibleEmployeeId: (responsibleEmployeeIds[0] ?? responseResponsibleIds[0]) ?? null,
      responsibleEmployeeIds: responsibleEmployeeIds.length ? responsibleEmployeeIds : responseResponsibleIds,
      term: this.getCatalogLabel(source, ['plazo', 'term']),
      dueDate: this.normalizeApiDate(this.getValue(source, ['fechaLimite', 'dueDate'])),
      followUpFrequency: this.getCatalogLabel(source, ['frecuenciaSeguimiento', 'followUpFrequency']),
      sendResponsibleEmails: false,
      validation: this.getCatalogLabel(source, ['validacion', 'validation']),
      evidence: this.getCatalogLabel(source, ['evidencia', 'evidence']),
      status: this.normalizePlanStatus(this.getCatalogLabel(source, ['estado', 'status'])),
      priority: this.normalizeSuggestedPriority(this.getCatalogLabel(source, ['prioridad', 'priority'])) ?? 'MEDIA',
      createdAt: String(this.getValue(source, ['creadoEn', 'createdAt', 'fechaCreacion']) ?? new Date().toISOString()),
      tasks: this.asArray(this.getValue(source, ['tareas', 'tasks']))
        .map((task) => this.normalizeApiTask(task))
        .filter((task): task is ActionTask => !!task),
      followUps: this.asArray(this.getValue(source, ['seguimientos', 'followUps']))
        .map((followUp) => this.normalizeApiFollowUp(followUp))
        .filter((followUp): followUp is ActionPlanFollowUp => !!followUp)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
      demographicFilters: this.asArray(this.getValue(source, ['filtrosDemograficos', 'demographicFilters'])),
      isPersisted: true,
      isDirty: false,
    };
  }

  private normalizeApiTask(source: any): ActionTask | null {
    source = source?.tarea ?? source?.task ?? source?.item ?? source;
    if (!source || typeof source !== 'object') return null;
    const id = Number(this.getValue(source, ['id', 'idTarea', 'taskId']));
    return {
      id: Number.isFinite(id) && id > 0 ? id : 0,
      title: this.getCatalogLabel(source, ['titulo', 'title']) || 'Nueva tarea',
      responsible: this.getCatalogLabel(source, ['responsable', 'responsible']),
      deliverable: this.getCatalogLabel(source, ['entregable', 'deliverable']),
      dueDate: this.normalizeApiDate(this.getValue(source, ['fechaLimite', 'dueDate'])),
      evidence: this.getCatalogLabel(source, ['evidencia', 'evidence']),
      done: this.getBoolean(source, ['completada', 'done']) ?? false,
    };
  }

  private normalizeApiFollowUp(source: any): ActionPlanFollowUp | null {
    source = source?.seguimiento ?? source?.followUp ?? source?.item ?? source;
    if (!source || typeof source !== 'object') return null;
    const id = Number(this.getValue(source, ['id', 'idSeguimiento', 'seguimientoId']));
    if (!Number.isFinite(id) || id <= 0) return null;

    const createdAt = String(this.getValue(source, ['creadoEn', 'createdAt', 'fechaCreacion']) ?? this.getValue(source, ['fecha']) ?? '');
    return {
      id,
      dateLabel: this.formatApiDateTime(createdAt || this.getValue(source, ['fecha'])),
      createdAt,
      createdBy: this.getCatalogLabel(source, ['creadoPor', 'createdBy', 'usuarioCreador']) || 'No especificado',
      comment: this.getCatalogLabel(source, ['comentario', 'comment']) || 'Sin comentario registrado.',
      progress: this.getNumber(source, ['avancePct', 'progress', 'avance']),
    };
  }

  private extractApiData(response: any): any {
    return response?.data?.data ?? response?.data ?? response;
  }

  private extractApiMessage(response: any): string {
    return String(response?.data?.message ?? response?.message ?? '').trim();
  }

  private normalizeApiDate(value: any): string {
    if (!value) return '';
    const text = String(value);
    return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : this.toDateInput(new Date(text));
  }

  private formatApiDateTime(value: any): string {
    if (!value) return 'Fecha no especificada';
    const text = String(value).trim();
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) return text || 'Fecha no especificada';

    return new Intl.DateTimeFormat(this.getLocale(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  private normalizePlanStatus(value: string): PlanStatus {
    const status = this.normalizeKey(value);
    if (status === 'EN_PROGRESO') return 'EN_PROCESO';
    if (status === 'EN_RIESGO' || status === 'COMPLETADO') return status;
    return 'SIN_INICIAR';
  }

  private planMatchesSelectedFilters(plan: ActionPlan): boolean {
    return (plan.demographicFilters ?? []).every((planFilter) => {
      const selected = this.selectedFilters.find((filter) =>
        Number(filter.idCampo) === Number(planFilter.idCampo) ||
        this.normalizeKey(filter.nombreCampo) === this.normalizeKey(planFilter.nombreCampo)
      );
      if (!selected) return false;
      const selectedValues = selected.valores.map((value) => this.normalizeKey(value));
      return (planFilter.valores ?? []).some((value) => selectedValues.includes(this.normalizeKey(value)));
    });
  }

  private filtersSignature(filters: DemographicSelection[]): string {
    return (filters ?? [])
      .map((filter) => `${filter.idCampo}:${[...(filter.valores ?? [])].map((value) => this.normalizeKey(value)).sort().join('|')}`)
      .sort()
      .join(';');
  }

  private clearMetrics(): void {
    this.rawMetrics = null;
    this.factorMetrics = [];
    this.questionMetrics = [];
    this.opportunities = [];
    this.demographicOpportunities = [];
    this.actionPlans = [];
    this.responsibleEmployees = [];
    this.selectedOpportunityId = null;
    this.computedSummary = null;
    this.globalCatalogs = null;
  }

  private asArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.items)) return value.items;
    if (value && typeof value === 'object') return [value];
    return [];
  }

  private getNumber(item: any, keys: string[]): number | null {
    const value = this.getValue(item, keys);
    if (value !== undefined && value !== null && value !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  }

  private getBoolean(item: any, keys: string[]): boolean | undefined {
    const value = this.getValue(item, keys);
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value === 1;
      const normalized = String(value).trim().toLowerCase();
      return ['true', '1', 'si', 'sí', 'yes'].includes(normalized);
    }
    return undefined;
  }

  private getValue(item: any, keys: string[]): any {
    if (!item || typeof item !== 'object') return undefined;

    for (const key of keys) {
      if (item[key] !== undefined) return item[key];
      const matchingKey = Object.keys(item).find((itemKey) => itemKey.toLowerCase() === key.toLowerCase());
      if (matchingKey) return item[matchingKey];
    }

    return undefined;
  }

  private getCatalogLabel(item: any, keys: string[]): string {
    const value = this.getValue(item, keys);
    return value === undefined || value === null ? '' : String(value).trim();
  }

  private normalizeSuggestedPriority(value: any): PlanPriority | null {
    const normalized = this.normalizeKey(String(value ?? ''));
    if (['ALTA', 'ALTO', 'HIGH'].includes(normalized)) return 'ALTA';
    if (['MEDIA', 'MEDIO', 'MEDIUM'].includes(normalized)) return 'MEDIA';
    if (['BAJA', 'BAJO', 'LOW'].includes(normalized)) return 'BAJA';
    return null;
  }

  private nullLast(left: number | null, right: number | null): number {
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return left - right;
  }

  private normalizeKey(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private toDateInput(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  formatPercent(value: number | null): string {
    return value === null ? '-' : `${this.round(value, 1).toLocaleString(this.getLocale())}%`;
  }

  formatNumber(value: number | null): string {
    return value === null ? '-' : this.round(value, 1).toLocaleString(this.getLocale());
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(this.getLocale());
  }

  formatHighlightedReason(value: string): string {
    return this.escapeHtml(value)
      .replace(/"([^"]+)"/g, '"<strong class="reason-highlight">$1</strong>"')
      .replace(/(\d+(?:[.,]\d+)?%)/g, '<strong class="reason-highlight">$1</strong>');
  }

  round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  trackById(index: number, item: any): number | string {
    return item?.id ?? item?.Id ?? item?.idFactor ?? item?.idPregunta ?? item?.opportunityId ?? index;
  }

  private escapeHtml(value: string): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  t(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(`MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.${key}`, params);
  }

  private getLocale(): string {
    return this.translate.currentLang?.toLowerCase().startsWith('en') ? 'en-US' : 'es-GT';
  }
}
