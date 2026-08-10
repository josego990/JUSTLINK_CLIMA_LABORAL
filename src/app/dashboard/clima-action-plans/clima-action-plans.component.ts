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
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import {
  DemographicFiltersDialogComponent,
  DemographicSelection,
} from '../dashboard1/dialogs/demographic-filters-dialog.component';

type ActionPlanTab = 'resumen' | 'brechas' | 'planes' | 'seguimiento' | 'plantilla';
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

interface ActionPlan {
  id: number;
  opportunityId: string;
  factor: string;
  area: string;
  sponsor: string;
  scope: string;
  reason: string;
  action: string;
  resources: string;
  kpi: string;
  owner: string;
  term: string;
  dueDate: string;
  followUpFrequency: string;
  log: string;
  validation: string;
  evidence: string;
  status: PlanStatus;
  priority: PlanPriority;
  createdAt: string;
  tasks: ActionTask[];
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
  ],
  templateUrl: './clima-action-plans.component.html',
  styleUrls: ['./clima-action-plans.component.scss'],
})
export class ClimaActionPlansComponent implements OnDestroy, OnInit {
  readonly targetScore = 80;
  readonly tabs: Array<{ id: ActionPlanTab; label: string; icon: string }> = [
    { id: 'resumen', label: 'Resumen', icon: 'dashboard' },
    { id: 'brechas', label: 'Brechas priorizadas', icon: 'priority_high' },
    { id: 'planes', label: 'Planes de acción', icon: 'assignment_turned_in' },
    { id: 'seguimiento', label: 'Seguimiento', icon: 'timeline' },
    { id: 'plantilla', label: 'Plantilla', icon: 'view_list' },
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

  rawMetrics: any = null;
  demographicTree: any = null;
  selectedFilters: DemographicSelection[] = [];
  filtrosDemograficos = '';
  filtrosGrandesFactores = '';
  tipoFiltro = 'AND';

  factorMetrics: FactorMetric[] = [];
  questionMetrics: QuestionMetric[] = [];
  opportunities: ImprovementOpportunity[] = [];
  actionPlans: ActionPlan[] = [];
  selectedOpportunityId: string | null = null;
  private selectedOrganizationSubscription?: Subscription;

  templateRows: PlanTemplateRow[] = [
    {
      factorArea: 'Clima general',
      reason: 'Compartir resultados y alinear expectativas con líderes.',
      appliesTo: 'Toda la organización',
      actions: 'Presentar hallazgos, brechas principales y acuerdos de mejora.',
      resources: 'Reuniones por área, comunicación visual y tablero de seguimiento.',
      kpi: '100% de líderes con resultados socializados y plan definido.',
      owner: 'Gerencia General / Recursos Humanos',
      term: 'Corto plazo',
      when: 'Primeras 2 semanas posteriores al cierre del clima',
      frequency: 'Semanal',
      validation: 'Acta o evidencia de socialización',
      evidence: 'Correo, minuta, presentación o captura',
    },
    {
      factorArea: 'Motivación y reconocimiento',
      reason: 'Fortalecer reconocimiento, crecimiento y sentido de avance.',
      appliesTo: 'Equipos con satisfacción baja en el factor',
      actions: 'Diseñar rituales de reconocimiento y conversaciones de desarrollo.',
      resources: 'Guías para líderes, agenda mensual y tablero de compromisos.',
      kpi: 'Incrementar satisfacción del factor al menos 8 puntos.',
      owner: 'RRHH / Líderes de área',
      term: 'Mediano plazo',
      when: '30 a 90 días',
      frequency: 'Quincenal',
      validation: 'Seguimiento de compromisos y participación',
      evidence: 'Registro de sesiones y acuerdos',
    },
    {
      factorArea: 'Comunicación',
      reason: 'Reducir ambigüedad, ruido entre áreas y falta de información.',
      appliesTo: 'Áreas impactadas',
      actions: 'Implementar reuniones cortas de alineación y canales claros.',
      resources: 'Calendario, minutas, responsables y FAQs.',
      kpi: 'Reducir desfavorabilidad del factor a menos de 20%.',
      owner: 'Líderes funcionales',
      term: 'Corto / mediano plazo',
      when: 'Inicio inmediato',
      frequency: 'Semanal',
      validation: 'Minutas y medición de pulso',
      evidence: 'Minutas, capturas y resultados de pulso',
    },
  ];

  constructor(
    private organizacionService: OrganizacionService,
    private dialog: MatDialog
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
    return this.getNumber(this.rawMetrics?.calificacionGeneral, ['pct_favorable', 'pct_top2', 'pct_general']);
  }

  get generalUnfavorable(): number | null {
    return this.getNumber(this.rawMetrics?.calificacionGeneral, ['pct_desfavorable_restrictivo', 'pct_desfavorable']);
  }

  get generalNsat(): number | null {
    return this.getNumber(this.rawMetrics?.calificacionGeneral, ['nsat']);
  }

  get totalResponses(): number | null {
    return this.getNumber(this.rawMetrics?.calificacionGeneral, ['total_respuestas']);
  }

  get criticalOpportunities(): ImprovementOpportunity[] {
    return this.opportunities.filter((item) => item.priority === 'ALTA');
  }

  get openOpportunities(): ImprovementOpportunity[] {
    const planned = new Set(this.actionPlans.map((plan) => plan.opportunityId));
    return this.opportunities.filter((item) => !planned.has(item.id));
  }

  get selectedOpportunity(): ImprovementOpportunity | null {
    return this.opportunities.find((item) => item.id === this.selectedOpportunityId) ??
      this.openOpportunities[0] ??
      this.opportunities[0] ??
      null;
  }

  get planSummary(): { total: number; completed: number; progress: number; atRisk: number; high: number } {
    const total = this.actionPlans.length;
    const completed = this.actionPlans.filter((plan) => this.getPlanProgress(plan) >= 100).length;
    const progress = total > 0
      ? this.round(this.actionPlans.reduce((sum, plan) => sum + this.getPlanProgress(plan), 0) / total, 1)
      : 0;
    const atRisk = this.actionPlans.filter((plan) => this.getEffectivePlanStatus(plan) === 'EN_RIESGO').length;
    const high = this.actionPlans.filter((plan) => plan.priority === 'ALTA').length;

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
      await Promise.all([
        this.loadDemographicFilters(),
        this.loadMetrics(),
      ]);
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
      void this.loadMetrics();
    });
  }

  clearFilters(): void {
    this.selectedFilters = [];
    this.filtrosDemograficos = '';
    void this.loadMetrics();
  }

  async loadMetrics(): Promise<void> {
    if (!this.selectedClimaId) {
      return;
    }

    this.loadingMetrics = true;
    try {
      const response = await this.organizacionService.getAllMetrics(
        this.selectedClimaId,
        this.filtrosDemograficos,
        this.filtrosGrandesFactores,
        this.tipoFiltro
      );
      this.rawMetrics = response?.data?.data ?? null;
      this.normalizeMetrics();
      this.loadStoredPlans();
    } catch (error) {
      console.error('Error al cargar métricas del clima:', error);
      Swal.fire('Planes de acción', 'No fue posible cargar las métricas del clima.', 'error');
    } finally {
      this.loadingMetrics = false;
    }
  }

  normalizeMetrics(): void {
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
    this.selectedOpportunityId = this.openOpportunities[0]?.id ?? this.opportunities[0]?.id ?? null;
  }

  createPlanFromOpportunity(opportunity: ImprovementOpportunity | null = this.selectedOpportunity): void {
    if (!opportunity) {
      Swal.fire('Planes de acción', 'No hay una brecha seleccionada para crear el plan.', 'info');
      return;
    }

    if (this.actionPlans.some((plan) => plan.opportunityId === opportunity.id)) {
      Swal.fire('Planes de acción', 'Ya existe un plan para esta brecha.', 'info');
      return;
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + this.getSuggestedDays(opportunity.priority));

    const plan: ActionPlan = {
      id: Date.now(),
      opportunityId: opportunity.id,
      factor: opportunity.factor,
      area: opportunity.area,
      sponsor: 'Recursos Humanos / Líder del área',
      scope: opportunity.scope,
      reason: opportunity.reason,
      action: opportunity.suggestedAction,
      resources: opportunity.suggestedResource,
      kpi: opportunity.suggestedKpi,
      owner: 'Pendiente asignar',
      term: opportunity.priority === 'ALTA' ? 'Corto plazo' : opportunity.priority === 'MEDIA' ? 'Mediano plazo' : 'Largo plazo',
      dueDate: this.toDateInput(dueDate),
      followUpFrequency: opportunity.priority === 'ALTA' ? 'Semanal' : 'Quincenal',
      log: '',
      validation: 'Revisión de evidencia y variación del indicador en seguimiento.',
      evidence: '',
      status: 'SIN_INICIAR',
      priority: opportunity.priority,
      createdAt: new Date().toISOString(),
      tasks: this.createDefaultTasks(opportunity, dueDate),
    };

    this.actionPlans = [plan, ...this.actionPlans];
    this.persistPlans();
    this.selectedTab = 'planes';
  }

  removePlan(plan: ActionPlan): void {
    this.actionPlans = this.actionPlans.filter((item) => item.id !== plan.id);
    this.persistPlans();
  }

  addTask(plan: ActionPlan): void {
    plan.tasks = [
      ...plan.tasks,
      {
        id: Date.now(),
        title: 'Nueva tarea',
        responsible: plan.owner || 'Pendiente',
        deliverable: 'Evidencia de ejecución',
        dueDate: plan.dueDate,
        evidence: '',
        done: false,
      },
    ];
    this.persistPlans();
  }

  removeTask(plan: ActionPlan, task: ActionTask): void {
    plan.tasks = plan.tasks.filter((item) => item.id !== task.id);
    this.persistPlans();
  }

  onPlanChanged(): void {
    this.persistPlans();
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
      SIN_INICIAR: 'Sin iniciar',
      EN_PROCESO: 'En proceso',
      EN_RIESGO: 'En riesgo',
      COMPLETADO: 'Completado',
    };
    return labels[status];
  }

  getPriorityLabel(priority: PlanPriority): string {
    const labels: Record<PlanPriority, string> = {
      ALTA: 'Alta',
      MEDIA: 'Media',
      BAJA: 'Baja',
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
    return this.opportunities.find((item) => item.id === id) ?? null;
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
      { header: 'Gran factor', key: 'granFactor', width: 22 },
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
    this.actionPlans.forEach((plan) => plans.addRow({
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
    this.actionPlans.forEach((plan) => {
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
      const shouldCreate = (score !== null && score < this.targetScore) ||
        (unfavorable !== null && unfavorable >= 25);

      if (!shouldCreate) {
        return;
      }

      const topQuestion = this.getTopQuestionForFactor(factor.idFactor);
      opportunities.push({
        id: `factor-${factor.idFactor || this.normalizeKey(factor.factor)}`,
        factor: factor.factor,
        granFactor: factor.granFactor,
        area: this.currentScopeLabel(),
        reason: this.buildFactorReason(factor, topQuestion),
        score,
        unfavorable,
        gap: this.round(Math.max(0, this.targetScore - (score ?? 0)), 1),
        priority: this.getPriority(score, unfavorable),
        scope: this.currentScopeLabel(),
        suggestedAction: this.suggestActionForFactor(factor.factor),
        suggestedResource: this.suggestResourcesForFactor(factor.factor),
        suggestedKpi: `Subir ${factor.factor} a ${this.targetScore}% de favorabilidad y reducir desfavorabilidad por debajo de 20%.`,
        source: 'factor',
      });
    });

    this.questionMetrics
      .filter((question) => (question.favorable ?? 100) < 65 || (question.desfavorable ?? 0) >= 35)
      .slice(0, 8)
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
          priority: this.getPriority(question.favorable, question.desfavorable),
          scope: this.currentScopeLabel(),
          suggestedAction: this.suggestActionForFactor(question.factor),
          suggestedResource: this.suggestResourcesForFactor(question.factor),
          suggestedKpi: `Mejorar el ítem crítico al menos 10 puntos y documentar acciones de cierre.`,
          source: 'pregunta',
        });
      });

    return opportunities
      .sort((left, right) =>
        this.priorityWeight(right.priority) - this.priorityWeight(left.priority) ||
        right.gap - left.gap ||
        this.nullLast(left.score, right.score)
      )
      .slice(0, 18);
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
    return chips.length ? chips.join(' / ') : 'Toda la organización';
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

  private loadStoredPlans(): void {
    const raw = localStorage.getItem(this.storageKey());
    if (!raw) {
      this.actionPlans = [];
      return;
    }

    try {
      this.actionPlans = JSON.parse(raw);
    } catch {
      this.actionPlans = [];
    }
  }

  private persistPlans(): void {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.actionPlans));
  }

  private storageKey(): string {
    return [
      'clima-action-plans',
      this.selectedOrganizationId ?? 'org',
      this.selectedClimaId ?? 'clima',
      this.normalizeKey(this.filtrosDemograficos || 'sin-filtro'),
    ].join(':');
  }

  private clearMetrics(): void {
    this.rawMetrics = null;
    this.factorMetrics = [];
    this.questionMetrics = [];
    this.opportunities = [];
    this.actionPlans = [];
    this.selectedOpportunityId = null;
  }

  private asArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.items)) return value.items;
    if (value && typeof value === 'object') return [value];
    return [];
  }

  private getNumber(item: any, keys: string[]): number | null {
    for (const key of keys) {
      const value = item?.[key];
      if (value === undefined || value === null || value === '') continue;
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
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
    return value === null ? '-' : `${this.round(value, 1).toLocaleString('es-GT')}%`;
  }

  formatNumber(value: number | null): string {
    return value === null ? '-' : this.round(value, 1).toLocaleString('es-GT');
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-GT');
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
}
