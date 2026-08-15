import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import {
  performanceGapToPercent,
  performanceScoreToPercent,
} from '../shared/performance-score.utils';

type FollowTone = 'above' | 'expected' | 'below' | 'neutral';
type PlanStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
type PlanPriority = 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';

interface FollowOrganization {
  Id: number;
  Nombre: string;
}

interface FollowModelOption {
  id: number;
  nombre: string;
  codigo: string | null;
  raw: any;
}

interface FollowEmployeeDemographicValue {
  key: string;
  name: string;
  value: string;
}

interface FollowEmployeeDirectoryItem {
  id: number;
  organizationId: number | null;
  managerId: number | null;
  managerIds: number[];
  fullName: string;
  position: string;
  email: string | null;
  activo: boolean;
  demographics: FollowEmployeeDemographicValue[];
  raw: any;
}

interface FollowItemResult {
  key: string;
  id: number | null;
  texto: string;
  respuesta: string;
  score: number | null;
  target: number | null;
  gap: number | null;
  tone: FollowTone;
  raw: any;
}

interface FollowCriterionResult {
  key: string;
  id: number | null;
  nombre: string;
  score: number | null;
  target: number | null;
  gap: number | null;
  tone: FollowTone;
  items: FollowItemResult[];
  raw: any;
}

interface FollowDimensionResult {
  key: string;
  id: number | null;
  nombre: string;
  score: number | null;
  target: number | null;
  gap: number | null;
  tone: FollowTone;
  criterios: FollowCriterionResult[];
  raw: any;
}

interface FollowEvaluationResult {
  key: string;
  id: number | null;
  nombre: string;
  escenario: string;
  escenarioCodigo: string;
  evaluador: string;
  fechaFinalizacion: string | null;
  encuestaCount: number;
  score: number | null;
  target: number | null;
  gap: number | null;
  tone: FollowTone;
  dimensiones: FollowDimensionResult[];
  raw: any;
}

interface FollowOpportunity {
  id: string;
  employeeId: number | null;
  employeeName: string;
  position: string;
  evaluationId: number | null;
  assignmentId: number | null;
  responseId: number | null;
  responseDetailId: number | null;
  evaluatorId: number | null;
  scenarioId: number | null;
  scenarioCode: string | null;
  dimensionId: number | null;
  criterionId: number | null;
  itemId: number | null;
  evaluation: string;
  scenario: string;
  dimension: string;
  criterion: string;
  item: string;
  answer: string;
  score: number | null;
  target: number | null;
  gap: number | null;
  priority: PlanPriority;
}

interface FollowOpportunityCriterionGroup {
  key: string;
  name: string;
  opportunities: FollowOpportunity[];
}

interface FollowOpportunityDimensionGroup {
  key: string;
  name: string;
  count: number;
  criteria: FollowOpportunityCriterionGroup[];
}

interface FollowEmployeeResult {
  id: number | null;
  name: string;
  email: string | null;
  position: string;
  puestoId: number | null;
  score: number | null;
  target: number | null;
  gap: number | null;
  tone: FollowTone;
  evaluations: FollowEvaluationResult[];
  opportunities: FollowOpportunity[];
  raw: any;
}

interface FollowGroupedData {
  organizacionId: number | null;
  modeloId: number | null;
  modelo: string;
  modeloCodigo: string | null;
  fechaGeneracion: string | null;
  resumen: any;
  puestos: any[];
  employees: FollowEmployeeResult[];
}

interface ActionTask {
  id: number;
  title: string;
  responsible: string;
  responsibleEmployeeId?: number | null;
  dueDate: string;
  done: boolean;
}

interface EmployeeActionPlan {
  id: number;
  opportunityId: string | null;
  title: string;
  objective: string;
  action: string;
  responsible: string;
  responsibleEmployeeId?: number | null;
  dueDate: string;
  priority: PlanPriority;
  status: PlanStatus;
  evidence: string;
  tasks: ActionTask[];
}

interface EmployeeDetailDialogData {
  employee: FollowEmployeeResult;
  helpers: DesPlanesSeguimientoComponent;
}

interface EmployeePlansDialogData {
  employee: FollowEmployeeResult;
  plans: EmployeeActionPlan[];
  employees: FollowEmployeeDirectoryItem[];
  helpers: DesPlanesSeguimientoComponent;
}

interface ResponsiblePickerDialogData {
  employees: FollowEmployeeDirectoryItem[];
  evaluatedEmployee: FollowEmployeeResult;
  currentResponsible: string;
}

interface ResponsibleGroupingOption {
  key: string;
  label: string;
}

interface ResponsibleEmployeeGroup {
  key: string;
  title: string;
  subtitle: string;
  employees: FollowEmployeeDirectoryItem[];
}

@Component({
  selector: 'app-des-planes-seguimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './des-planes-seguimiento.component.html',
  styleUrls: ['./des-planes-seguimiento.component.scss'],
})
export class DesPlanesSeguimientoComponent implements OnDestroy, OnInit {
  public organizations: FollowOrganization[] = [];
  public models: FollowModelOption[] = [];
  public employeeDirectory: FollowEmployeeDirectoryItem[] = [];
  public selectedOrganizationId: number | null = null;
  public selectedModelId: number | null = null;
  public groupedData: FollowGroupedData | null = null;
  public expandedEmployeeKey: string | null = null;
  public searchText = '';
  public isLoadingOrganizations = false;
  public isLoadingModels = false;
  public isLoadingResults = false;
  public isSavingPlans = false;
  public employeePlansByKey = new Map<string, EmployeeActionPlan[]>();
  private selectedOrganizationSubscription?: Subscription;

  constructor(
    private organizacionService: OrganizacionService,
    private dialog: MatDialog,
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

  get selectedOrganizationName(): string {
    return this.organizations.find((item) => item.Id === this.selectedOrganizationId)?.Nombre ?? '';
  }

  get selectedModel(): FollowModelOption | null {
    return this.models.find((item) => item.id === this.selectedModelId) ?? null;
  }

  get filteredEmployees(): FollowEmployeeResult[] {
    const text = this.normalizeKey(this.searchText);
    const employees = this.groupedData?.employees ?? [];

    if (!text) {
      return employees;
    }

    return employees.filter((employee) =>
      this.normalizeKey(`${employee.name} ${employee.position} ${employee.email ?? ''}`).includes(text)
    );
  }

  get summaryCards(): Array<{ label: string; value: string; hint: string; icon: string; tone: string }> {
    const employees = this.groupedData?.employees ?? [];
    const opportunities = employees.reduce((total, employee) => total + employee.opportunities.length, 0);
    const plans = employees.reduce((total, employee) => total + this.getEmployeePlans(employee).length, 0);
    const averageScore = this.averageNumbers(employees.map((employee) => employee.score));
    const averageTarget = this.averageNumbers(employees.map((employee) => employee.target));

    return [
      {
        label: 'Empleados evaluados',
        value: String(employees.length),
        hint: `${this.getNumber(this.groupedData?.resumen, ['totalEncuestasRespondidas']) ?? 0} encuestas respondidas`,
        icon: 'groups',
        tone: 'blue',
      },
      {
        label: 'Resultado promedio',
        value: this.formatScore(averageScore),
        hint: `Exigencia promedio ${this.formatScore(averageTarget)}`,
        icon: 'bar_chart',
        tone: this.getScoreTone(averageScore),
      },
      {
        label: 'Ítems oportunidad',
        value: String(opportunities),
        hint: 'Ítems por debajo del nivel esperado',
        icon: 'priority_high',
        tone: opportunities > 0 ? 'orange' : 'green',
      },
      {
        label: 'Planes creados',
        value: String(plans),
        hint: 'Guardados en base de datos',
        icon: 'assignment_turned_in',
        tone: plans > 0 ? 'green' : 'neutral',
      },
    ];
  }

  async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;
    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.organizations = this.extractCollection(response)
        .map((item) => ({
          Id: Number(item?.Id ?? item?.id ?? item?.organizacionId ?? 0),
          Nombre: String(item?.Nombre ?? item?.nombre ?? item?.organizacion ?? '').trim(),
        }))
        .filter((item) => item.Id > 0)
        .sort((left, right) => left.Nombre.localeCompare(right.Nombre, 'es', { sensitivity: 'base' }));
    } catch (error) {
      console.error('Error al cargar organizaciones de desempeño:', error);
      Swal.fire('Planes de Acción', 'No fue posible cargar las organizaciones.', 'error');
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  async onOrganizationChange(idOrganizacion: number | null): Promise<void> {
    this.selectedOrganizationId = Number(idOrganizacion) || null;
    this.selectedModelId = null;
    this.models = [];
    this.employeeDirectory = [];
    this.groupedData = null;
    this.employeePlansByKey.clear();
    this.expandedEmployeeKey = null;

    if (this.selectedOrganizationId) {
      await this.loadModels(this.selectedOrganizationId);
    }
  }

  async loadModels(idOrganizacion: number): Promise<void> {
    this.isLoadingModels = true;
    try {
      const response = await firstValueFrom(this.organizacionService.getDesempenoModelsSelectHttp(idOrganizacion));
      this.models = this.extractCollection(response)
        .map((item, index) => this.normalizeModelOption(item, index))
        .filter((item) => item.id > 0)
        .sort((left, right) => right.id - left.id);
    } catch (error) {
      console.error('Error al cargar modelos de desempeño:', error);
      this.models = [];
      Swal.fire('Planes de Acción', 'No fue posible cargar los modelos de desempeño.', 'error');
    } finally {
      this.isLoadingModels = false;
    }
  }

  async loadEmployeeDirectory(idOrganizacion: number): Promise<void> {
    try {
      const response = await this.organizacionService.getDesempenoEmployees({
        idOrganizacion,
        activo: true,
      });
      this.employeeDirectory = this.extractCollection(response)
        .map((item) => this.normalizeDirectoryEmployee(item))
        .filter((item) => item.id > 0)
        .sort((left, right) => left.fullName.localeCompare(right.fullName, 'es', { sensitivity: 'base' }));
    } catch (error) {
      console.error('Error al cargar empleados de desempeño para planes:', error);
      this.employeeDirectory = [];
    }
  }

  async onModelChange(idModelo: number | null): Promise<void> {
    this.selectedModelId = Number(idModelo) || null;
    this.groupedData = null;
    this.employeeDirectory = [];
    this.employeePlansByKey.clear();
    this.expandedEmployeeKey = null;

    if (this.selectedOrganizationId && this.selectedModelId) {
      await this.loadGroupedResults(this.selectedOrganizationId, this.selectedModelId);
    }
  }

  async loadGroupedResults(idOrganizacion: number, idModelo: number): Promise<void> {
    this.isLoadingResults = true;
    try {
      const [response] = await Promise.all([
        this.organizacionService.getDesempenoGroupedResponsesByModel(idModelo, idOrganizacion),
        this.loadEmployeeDirectory(idOrganizacion),
      ]);
      this.groupedData = this.normalizeGroupedData(this.extractPayload(response));
      await this.loadPersistedPlans(idOrganizacion, idModelo);
    } catch (error) {
      console.error('Error al cargar respuestas agrupadas:', error);
      this.groupedData = null;
      Swal.fire('Planes de Acción', 'No fue posible cargar los resultados del modelo.', 'error');
    } finally {
      this.isLoadingResults = false;
    }
  }

  toggleEmployee(employee: FollowEmployeeResult): void {
    const key = this.getEmployeeKey(employee);
    this.expandedEmployeeKey = this.expandedEmployeeKey === key ? null : key;
  }

  isEmployeeExpanded(employee: FollowEmployeeResult): boolean {
    return this.expandedEmployeeKey === this.getEmployeeKey(employee);
  }

  openEmployeeDetail(employee: FollowEmployeeResult): void {
    this.dialog.open(DesEmployeeResultsDialogComponent, {
      width: '1180px',
      maxWidth: '96vw',
      maxHeight: '92vh',
      panelClass: 'des-follow-dialog-panel',
      data: {
        employee,
        helpers: this,
      } satisfies EmployeeDetailDialogData,
    });
  }

  openEmployeePlans(employee: FollowEmployeeResult): void {
    const dialogRef = this.dialog.open(DesEmployeeActionPlansDialogComponent, {
      width: '1590px',
      maxWidth: '99vw',
      maxHeight: '92vh',
      panelClass: ['des-follow-dialog-panel', 'des-follow-action-plan-dialog-panel'],
      data: {
        employee,
        plans: this.clonePlans(this.getEmployeePlans(employee)),
        employees: this.employeeDirectory,
        helpers: this,
      } satisfies EmployeePlansDialogData,
    });

    dialogRef.afterClosed().subscribe((plans?: EmployeeActionPlan[]) => {
      if (!Array.isArray(plans)) {
        return;
      }

      void this.saveEmployeePlans(employee, plans);
    });
  }

  getEmployeePlans(employee: FollowEmployeeResult): EmployeeActionPlan[] {
    return this.employeePlansByKey.get(this.getEmployeeKey(employee)) ?? [];
  }

  getEmployeeKey(employee: FollowEmployeeResult): string {
    return employee.id ? `emp-${employee.id}` : `emp-${this.normalizeKey(employee.name)}-${this.normalizeKey(employee.position)}`;
  }

  getTopOpportunities(employee: FollowEmployeeResult, limit = 3): FollowOpportunity[] {
    return employee.opportunities.slice(0, limit);
  }

  getEmployeeStatus(employee: FollowEmployeeResult): string {
    if (employee.score === null) return 'Sin dato';
    if (employee.score >= 4.5) return 'Sobresaliente';
    if (employee.score >= 3.5) return 'Cumple';
    if (employee.score >= 3) return 'Cumple parcial';
    return 'Atención';
  }

  getScorePercent(value: number | null): number {
    const percentage = performanceScoreToPercent(value);
    return percentage === null ? 0 : Math.max(0, Math.min(100, percentage));
  }

  getScoreTone(value: number | null): string {
    if (value === null) return 'neutral';
    if (value >= 4) return 'green';
    if (value >= 3) return 'orange';
    return 'red';
  }

  getGapTone(value: number | null): string {
    if (value === null) return 'neutral';
    if (value >= 0) return 'green';
    if (value >= -0.5) return 'orange';
    return 'red';
  }

  getToneClass(tone: FollowTone): string {
    return `tone-${tone}`;
  }

  getToneLabel(tone: FollowTone): string {
    if (tone === 'above') return 'Sobre esperado';
    if (tone === 'expected') return 'En esperado';
    if (tone === 'below') return 'Oportunidad';
    return 'Sin dato';
  }

  getPriorityClass(priority: PlanPriority): string {
    return priority.toLowerCase();
  }

  formatScore(value: number | null): string {
    return this.formatPercentageValue(performanceScoreToPercent(value));
  }

  formatGap(value: number | null): string {
    const percentage = performanceGapToPercent(value);
    if (percentage === null) return '-';
    return `${percentage > 0 ? '+' : ''}${this.formatPercentageValue(percentage)}`;
  }

  private formatPercentageValue(value: number | null): string {
    if (value === null) return '-';
    return `${this.round(value, 1).toLocaleString('es-GT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}%`;
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString('es-GT');
  }

  trackByKey(index: number, item: any): string | number {
    return item?.key ?? item?.id ?? item?.opportunityId ?? item?.title ?? index;
  }

  buildPlanFromOpportunity(opportunity: FollowOpportunity): EmployeeActionPlan {
    const due = new Date();
    due.setDate(due.getDate() + (opportunity.priority === 'ALTA' ? 30 : opportunity.priority === 'MEDIA' ? 60 : 90));

    return {
      id: -Date.now(),
      opportunityId: opportunity.id,
      title: `Plan para ${opportunity.dimension} · ${opportunity.criterion}`,
      objective: `Cerrar la brecha del ítem "${opportunity.item}" en el escenario ${opportunity.scenario}.`,
      action: `Realizar retroalimentación, definir práctica observable y dar seguimiento al resultado esperado (${this.formatScore(opportunity.target)}).`,
      responsible: 'Líder directo / RRHH',
      responsibleEmployeeId: null,
      dueDate: this.toDateInput(due),
      priority: opportunity.priority,
      status: 'PENDIENTE',
      evidence: '',
      tasks: [
        {
          id: -(Date.now() + 1),
          title: 'Sesión de retroalimentación individual',
          responsible: 'Líder directo',
          responsibleEmployeeId: null,
          dueDate: this.toDateInput(this.addDays(7)),
          done: false,
        },
        {
          id: -(Date.now() + 2),
          title: 'Definir compromiso medible y evidencia',
          responsible: 'Empleado / Líder',
          responsibleEmployeeId: null,
          dueDate: this.toDateInput(this.addDays(15)),
          done: false,
        },
        {
          id: -(Date.now() + 3),
          title: 'Revisión de avance y cierre',
          responsible: 'RRHH',
          responsibleEmployeeId: null,
          dueDate: this.toDateInput(due),
          done: false,
        },
      ],
    };
  }

  private normalizeGroupedData(rawData: any): FollowGroupedData {
    const source = this.extractPayload(rawData) ?? {};
    const puestos = this.asArray(source?.puestos ?? source?.Puestos);
    const employees = puestos
      .flatMap((puestoRaw) => this.normalizeEmployeesFromPosition(puestoRaw))
      .sort((left, right) => this.compareEmployees(left, right));

    return {
      organizacionId: this.getNumber(source, ['organizacionId', 'IdOrganizacion']),
      modeloId: this.getNumber(source, ['modeloId', 'IdModelo']) ?? this.selectedModelId,
      modelo: this.getText(source, ['modelo', 'modeloNombre', 'nombre'], this.selectedModel?.nombre ?? 'Modelo'),
      modeloCodigo: this.toOptionalText(source?.modeloCodigo ?? source?.codigo),
      fechaGeneracion: this.toOptionalText(source?.fechaGeneracion ?? source?.FechaGeneracion),
      resumen: source?.resumen ?? source?.Resumen ?? {},
      puestos,
      employees,
    };
  }

  private normalizeEmployeesFromPosition(puestoRaw: any): FollowEmployeeResult[] {
    const puestoId = this.getNumber(puestoRaw, ['puestoId', 'IdPuesto', 'idPuesto']);
    const puesto = this.getText(puestoRaw, ['puesto', 'puestoNombre', 'nombre', 'cargo'], 'Sin puesto');

    return this.asArray(puestoRaw?.empleados ?? puestoRaw?.Empleados).map((employeeRaw) => {
      const evaluations = this.groupEvaluationsByScenario(
        this.asArray(employeeRaw?.encuestas ?? employeeRaw?.Encuestas)
          .map((surveyRaw) => this.normalizeEvaluation(surveyRaw))
      );
      const score = this.averageNumbers(evaluations.map((evaluation) => evaluation.score));
      const target = this.averageNumbers(evaluations.map((evaluation) => evaluation.target));
      const gap = this.calculateGap(score, target);
      const employee: FollowEmployeeResult = {
        id: this.getNumber(employeeRaw, ['empleadoId', 'IdEmpleado', 'idEmpleado']),
        name: this.getText(employeeRaw, ['empleado', 'empleadoNombre', 'nombre', 'evaluado'], 'Empleado'),
        email: this.toOptionalText(employeeRaw?.email ?? employeeRaw?.Email),
        position: this.getText(employeeRaw, ['cargo', 'puesto', 'puestoNombre'], puesto),
        puestoId,
        score,
        target,
        gap,
        tone: this.getDetailTone(score, target),
        evaluations,
        opportunities: [],
        raw: employeeRaw,
      };

      employee.opportunities = this.buildEmployeeOpportunities(employee);
      return employee;
    });
  }

  private normalizeEvaluation(surveyRaw: any): FollowEvaluationResult {
    const dimensiones = this.asArray(surveyRaw?.dimensiones ?? surveyRaw?.Dimensiones)
      .map((dimensionRaw) => this.normalizeDimension(dimensionRaw));
    const score = this.weightedAverage(dimensiones.map((dimension) => ({
      value: dimension.score,
      weight: this.getNumber(dimension.raw, ['ponderacion', 'Ponderacion']),
    })));
    const target = this.weightedAverage(dimensiones.map((dimension) => ({
      value: dimension.target,
      weight: this.getNumber(dimension.raw, ['ponderacion', 'Ponderacion']),
    })));
    const gap = this.calculateGap(score, target);

    return {
      key: this.buildKey('evaluation', [
        this.getNumber(surveyRaw, ['evaluacionId', 'IdEvaluacion']),
        this.getText(surveyRaw, ['escenarioCodigo', 'codigoEscenario', 'escenario', 'escenarioNombre'], 'escenario'),
      ]),
      id: this.getNumber(surveyRaw, ['evaluacionId', 'IdEvaluacion']),
      nombre: this.getText(surveyRaw, ['evaluacion', 'nombre', 'evaluacionNombre'], 'Evaluación de desempeño'),
      escenario: this.getText(surveyRaw, ['escenario', 'escenarioNombre', 'nombreEscenario', 'escenarioCodigo'], 'Escenario'),
      escenarioCodigo: this.getText(surveyRaw, ['escenarioCodigo', 'codigoEscenario'], ''),
      evaluador: this.getText(surveyRaw, ['evaluador', 'Evaluador', 'evaluadorNombre'], surveyRaw?.esAnonima ? 'Anónimo' : '-'),
      fechaFinalizacion: this.toOptionalText(surveyRaw?.fechaFinalizacion ?? surveyRaw?.FechaFinalizacion ?? surveyRaw?.fechaRespuesta),
      encuestaCount: 1,
      score,
      target,
      gap,
      tone: this.getDetailTone(score, target),
      dimensiones,
      raw: surveyRaw,
    };
  }

  private groupEvaluationsByScenario(evaluations: FollowEvaluationResult[]): FollowEvaluationResult[] {
    const groups = new Map<string, FollowEvaluationResult[]>();

    evaluations.forEach((evaluation) => {
      const key = evaluation.escenarioCodigo
        ? this.normalizeKey(evaluation.escenarioCodigo)
        : this.normalizeKey(evaluation.escenario);
      const safeKey = key || `ESCENARIO_${groups.size + 1}`;
      groups.set(safeKey, [...(groups.get(safeKey) ?? []), evaluation]);
    });

    return Array.from(groups.entries()).map(([key, group]) => this.aggregateScenarioGroup(key, group));
  }

  private aggregateScenarioGroup(key: string, evaluations: FollowEvaluationResult[]): FollowEvaluationResult {
    if (evaluations.length === 1) {
      const single = evaluations[0];
      return {
        ...single,
        key: `scenario-${key}`,
        nombre: single.escenario,
      };
    }

    const dimensiones = this.aggregateDimensions(evaluations.flatMap((evaluation) => evaluation.dimensiones));
    const score = this.weightedAverage(dimensiones.map((dimension) => ({
      value: dimension.score,
      weight: this.getNumber(dimension.raw, ['ponderacion', 'Ponderacion']),
    })));
    const target = this.weightedAverage(dimensiones.map((dimension) => ({
      value: dimension.target,
      weight: this.getNumber(dimension.raw, ['ponderacion', 'Ponderacion']),
    })));
    const gap = this.calculateGap(score, target);
    const evaluators = this.uniqueTexts(evaluations.map((evaluation) => evaluation.evaluador));
    const latestDate = this.latestDate(evaluations.map((evaluation) => evaluation.fechaFinalizacion));
    const first = evaluations[0];

    return {
      key: `scenario-${key}`,
      id: first.id,
      nombre: first.escenario,
      escenario: first.escenario,
      escenarioCodigo: first.escenarioCodigo,
      evaluador: evaluators.length > 1 ? `${evaluators.length} evaluadores` : evaluators[0] ?? '-',
      fechaFinalizacion: latestDate,
      encuestaCount: evaluations.length,
      score,
      target,
      gap,
      tone: this.getDetailTone(score, target),
      dimensiones,
      raw: {
        escenario: first.escenario,
        escenarioCodigo: first.escenarioCodigo,
        evaluaciones: evaluations,
      },
    };
  }

  private aggregateDimensions(rows: FollowDimensionResult[]): FollowDimensionResult[] {
    const groups = new Map<string, FollowDimensionResult[]>();
    rows.forEach((row) => {
      const key = this.buildKey('dimension', [row.id, row.nombre]);
      groups.set(key, [...(groups.get(key) ?? []), row]);
    });

    return Array.from(groups.entries()).map(([key, group]) => {
      const first = group[0];
      const criterios = this.aggregateCriteria(group.flatMap((dimension) => dimension.criterios));
      const score = this.weightedAverage(criterios.map((criterion) => ({
        value: criterion.score,
        weight: this.getNumber(criterion.raw, ['ponderacion', 'Ponderacion']),
      })));
      const target = this.weightedAverage(criterios.map((criterion) => ({
        value: criterion.target,
        weight: this.getNumber(criterion.raw, ['ponderacion', 'Ponderacion']),
      })));
      const gap = this.calculateGap(score, target);

      return {
        key,
        id: first.id,
        nombre: first.nombre,
        score,
        target,
        gap,
        tone: this.getDetailTone(score, target),
        criterios,
        raw: {
          ...(first.raw ?? {}),
          ponderacion: this.getNumber(first.raw, ['ponderacion', 'Ponderacion']),
          dimensiones: group,
        },
      };
    });
  }

  private aggregateCriteria(rows: FollowCriterionResult[]): FollowCriterionResult[] {
    const groups = new Map<string, FollowCriterionResult[]>();
    rows.forEach((row) => {
      const key = this.buildKey('criterion', [row.id, row.nombre]);
      groups.set(key, [...(groups.get(key) ?? []), row]);
    });

    return Array.from(groups.entries()).map(([key, group]) => {
      const first = group[0];
      const items = this.aggregateItems(group.flatMap((criterion) => criterion.items));
      const score = this.averageNumbers(items.map((item) => item.score));
      const target = this.averageNumbers(items.map((item) => item.target)) ?? first.target;
      const gap = this.calculateGap(score, target);

      return {
        key,
        id: first.id,
        nombre: first.nombre,
        score,
        target,
        gap,
        tone: this.getDetailTone(score, target),
        items,
        raw: {
          ...(first.raw ?? {}),
          ponderacion: this.getNumber(first.raw, ['ponderacion', 'Ponderacion']),
          criterios: group,
        },
      };
    });
  }

  private aggregateItems(rows: FollowItemResult[]): FollowItemResult[] {
    const groups = new Map<string, FollowItemResult[]>();
    rows.forEach((row) => {
      const key = this.buildKey('item', [row.id, row.texto]);
      groups.set(key, [...(groups.get(key) ?? []), row]);
    });

    return Array.from(groups.entries()).map(([key, group]) => {
      const first = group[0];
      const score = this.averageNumbers(group.map((item) => item.score));
      const target = this.averageNumbers(group.map((item) => item.target));
      const gap = this.calculateGap(score, target);
      const responseCount = group.filter((item) => item.score !== null).length;

      return {
        key,
        id: first.id,
        texto: first.texto,
        respuesta: responseCount > 1
          ? `Promedio ${this.formatScore(score)} · ${responseCount} respuestas`
          : first.respuesta,
        score,
        target,
        gap,
        tone: this.getDetailTone(score, target),
        raw: {
          ...(first.raw ?? {}),
          respuestasAgrupadas: group,
        },
      };
    });
  }

  private normalizeDimension(dimensionRaw: any): FollowDimensionResult {
    const criterios = this.asArray(dimensionRaw?.criterios ?? dimensionRaw?.Criterios)
      .map((criterionRaw) => this.normalizeCriterion(criterionRaw));
    const score = this.weightedAverage(criterios.map((criterion) => ({
      value: criterion.score,
      weight: this.getNumber(criterion.raw, ['ponderacion', 'Ponderacion']),
    })));
    const target = this.weightedAverage(criterios.map((criterion) => ({
      value: criterion.target,
      weight: this.getNumber(criterion.raw, ['ponderacion', 'Ponderacion']),
    })));
    const gap = this.calculateGap(score, target);

    return {
      key: this.buildKey('dimension', [
        this.getNumber(dimensionRaw, ['dimensionId', 'IdModeloDimension', 'idDimension']),
        this.getText(dimensionRaw, ['dimension', 'dimensionNombre', 'nombre'], 'Dimensión'),
      ]),
      id: this.getNumber(dimensionRaw, ['dimensionId', 'IdModeloDimension', 'idDimension']),
      nombre: this.getText(dimensionRaw, ['dimension', 'dimensionNombre', 'nombre'], 'Dimensión'),
      score,
      target,
      gap,
      tone: this.getDetailTone(score, target),
      criterios,
      raw: dimensionRaw,
    };
  }

  private normalizeCriterion(criterionRaw: any): FollowCriterionResult {
    const items = this.asArray(criterionRaw?.items ?? criterionRaw?.Items)
      .map((itemRaw) => this.normalizeItem(itemRaw, this.getNumber(criterionRaw, ['nivelExigencia', 'NivelExigencia'])));
    const score = this.averageNumbers(items.map((item) => item.score));
    const target = this.getNumber(criterionRaw, ['nivelExigencia', 'NivelExigencia']);
    const gap = this.calculateGap(score, target);

    return {
      key: this.buildKey('criterion', [
        this.getNumber(criterionRaw, ['criterioId', 'IdCriterioEvaluacion', 'idCriterio']),
        this.getText(criterionRaw, ['criterio', 'criterioNombre', 'nombre'], 'Criterio'),
      ]),
      id: this.getNumber(criterionRaw, ['criterioId', 'IdCriterioEvaluacion', 'idCriterio']),
      nombre: this.getText(criterionRaw, ['criterio', 'criterioNombre', 'nombre'], 'Criterio'),
      score,
      target,
      gap,
      tone: this.getDetailTone(score, target),
      items,
      raw: criterionRaw,
    };
  }

  private normalizeItem(itemRaw: any, criterionTarget: number | null): FollowItemResult {
    const noAplica = this.toBoolean(itemRaw?.noAplica ?? itemRaw?.NoAplica, false);
    const score = noAplica ? null : this.getNumber(itemRaw, ['escalaValor', 'EscalaValor', 'valorNumero', 'ValorNumero', 'valor', 'Valor', 'calificacion', 'resultado']);
    const target = this.getNumber(itemRaw, ['nivelExigencia', 'NivelExigencia', 'nivelEsperado']) ?? criterionTarget;
    const gap = this.calculateGap(score, target);
    const label = this.getText(itemRaw, ['escalaEtiqueta', 'EscalaEtiqueta', 'etiqueta', 'respuesta', 'valorTexto', 'ValorTexto'], '');

    return {
      key: this.buildKey('item', [
        this.getNumber(itemRaw, ['itemId', 'IdItemEvaluativo', 'idItem']),
        this.getText(itemRaw, ['texto', 'itemTexto', 'pregunta', 'nombre', 'itemCodigo'], 'Ítem evaluativo'),
      ]),
      id: this.getNumber(itemRaw, ['itemId', 'IdItemEvaluativo', 'idItem']),
      texto: this.getText(itemRaw, ['texto', 'itemTexto', 'pregunta', 'nombre', 'itemCodigo'], 'Ítem evaluativo'),
      respuesta: noAplica ? 'No aplica' : (score !== null && label ? `${this.formatScore(score)} · ${label}` : label || this.formatScore(score)),
      score,
      target,
      gap,
      tone: this.getDetailTone(score, target),
      raw: itemRaw,
    };
  }

  private buildEmployeeOpportunities(employee: FollowEmployeeResult): FollowOpportunity[] {
    const rows: FollowOpportunity[] = [];

    employee.evaluations.forEach((evaluation) => {
      evaluation.dimensiones.forEach((dimension) => {
        dimension.criterios.forEach((criterion) => {
          criterion.items
            .filter((item) => item.tone === 'below')
            .forEach((item) => {
              rows.push({
                id: [
                  employee.id ?? this.normalizeKey(employee.name),
                  evaluation.id ?? this.normalizeKey(evaluation.nombre),
                  evaluation.escenarioCodigo || this.normalizeKey(evaluation.escenario),
                  dimension.id ?? this.normalizeKey(dimension.nombre),
                  criterion.id ?? this.normalizeKey(criterion.nombre),
                  item.id ?? this.normalizeKey(item.texto),
                ].join('|'),
                employeeId: employee.id,
                employeeName: employee.name,
                position: employee.position,
                evaluationId: evaluation.id,
                assignmentId: this.getNumber(evaluation.raw, ['asignacionId', 'IdAsignacion']),
                responseId: this.getNumber(evaluation.raw, ['respuestaId', 'IdRespuesta']),
                responseDetailId: this.getNumber(item.raw, ['respuestaDetalleId', 'IdRespuestaDetalle']),
                evaluatorId: this.getNumber(evaluation.raw, ['evaluadorId', 'IdEvaluador', 'empleadoEvaluadorId']),
                scenarioId: this.getNumber(evaluation.raw, ['escenarioId', 'IdEscenario']),
                scenarioCode: evaluation.escenarioCodigo || null,
                dimensionId: dimension.id,
                criterionId: criterion.id,
                itemId: item.id,
                evaluation: evaluation.nombre,
                scenario: evaluation.escenario,
                dimension: dimension.nombre,
                criterion: criterion.nombre,
                item: item.texto,
                answer: item.respuesta,
                score: item.score,
                target: item.target,
                gap: item.gap,
                priority: this.getPriority(item.gap),
              });
            });
        });
      });
    });

    return rows.sort((left, right) =>
      (left.gap ?? 0) - (right.gap ?? 0) ||
      this.priorityWeight(right.priority) - this.priorityWeight(left.priority)
    );
  }

  private normalizeModelOption(item: any, index: number): FollowModelOption {
    const id = this.getNumber(item, ['id', 'Id', 'modeloId', 'IdModelo']) ?? index + 1;

    return {
      id,
      nombre: this.getText(item, ['nombre', 'Nombre', 'modelo', 'modeloNombre'], `Modelo ${id}`),
      codigo: this.toOptionalText(item?.codigo ?? item?.Codigo ?? item?.modeloCodigo),
      raw: item,
    };
  }

  private normalizeDirectoryEmployee(item: any): FollowEmployeeDirectoryItem {
    const names = String(item?.Nombres ?? item?.nombres ?? '').trim();
    const lastNames = String(item?.Apellidos ?? item?.apellidos ?? '').trim();
    const managerIds = this.normalizeDirectoryEmployeeManagerIds(item);
    const fullName = this.getText(
      {
        ...item,
        fullName: `${names} ${lastNames}`.trim(),
      },
      ['fullName', 'nombreCompleto', 'empleado', 'nombre'],
      'Empleado'
    );

    return {
      id: Number(item?.IdEmpleado ?? item?.idEmpleado ?? item?.Id ?? item?.id ?? 0),
      organizationId: this.getNumber(item, ['IdOrganizacion', 'idOrganizacion']),
      managerId: managerIds[0] ?? null,
      managerIds,
      fullName,
      position: this.getText(item, ['Cargo', 'cargo', 'Puesto', 'puesto', 'Posicion', 'posicion'], 'Sin puesto'),
      email: this.toOptionalText(item?.Email ?? item?.email),
      activo: this.toBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado, true),
      demographics: this.extractDirectoryEmployeeDemographics(item),
      raw: item,
    };
  }

  private extractDirectoryEmployeeDemographics(item: any): FollowEmployeeDemographicValue[] {
    const source =
      item?.camposDemograficos ??
      item?.CamposDemograficos ??
      item?.demograficos ??
      item?.Demograficos ??
      item?.valoresDemograficos ??
      item?.ValoresDemograficos;
    const rows = this.asArray(source);
    const seen = new Set<string>();

    return rows
      .map((row, index) => {
        const id = this.getNumber(row, ['id', 'Id', 'IdCampoDemografico', 'idCampoDemografico']);
        const name = this.getText(
          row,
          ['nombre', 'Nombre', 'nombreCampo', 'NombreCampo', 'campo', 'Campo', 'codigo', 'Codigo'],
          ''
        );
        const rawValue =
          row?.valor ??
          row?.Valor ??
          row?.value ??
          row?.Value ??
          row?.descripcion ??
          row?.Descripcion;
        const value = this.toOptionalText(rawValue) ?? 'Sin valor';
        const key = this.normalizeKey(`${id ?? index}-${name || 'campo'}`);

        return {
          key,
          name: name || `Campo ${index + 1}`,
          value,
        };
      })
      .filter((item) => {
        if (!item.key || seen.has(item.key)) {
          return false;
        }

        seen.add(item.key);
        return true;
      });
  }

  private normalizeDirectoryEmployeeManagerIds(item: any): number[] {
    const candidates = [
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
      item?.IdEmpleadoJefe,
      item?.idEmpleadoJefe,
      item?.IdJefe,
      item?.idJefe,
      item?.IdJefeEmpleado,
      item?.idJefeEmpleado,
    ];

    for (const candidate of candidates) {
      const ids = this.toPositiveIntegerList(candidate);
      if (ids.length > 0) {
        return ids;
      }
    }

    return [];
  }

  private getPriority(gap: number | null): PlanPriority {
    if (gap !== null && gap <= -1) return 'ALTA';
    if (gap !== null && gap <= -0.5) return 'MEDIA';
    return 'BAJA';
  }

  private priorityWeight(priority: PlanPriority): number {
    if (priority === 'CRITICA') return 4;
    if (priority === 'ALTA') return 3;
    if (priority === 'MEDIA') return 2;
    return 1;
  }

  private getDetailTone(score: number | null, target: number | null): FollowTone {
    const gap = this.calculateGap(score, target);
    if (gap === null) return 'neutral';
    if (gap > 0.15) return 'above';
    if (gap >= -0.15) return 'expected';
    return 'below';
  }

  private calculateGap(score: number | null, target: number | null): number | null {
    if (score === null || target === null) return null;
    return score - target;
  }

  private weightedAverage(rows: Array<{ value: number | null; weight: number | null }>): number | null {
    const valid = rows.filter((row): row is { value: number; weight: number | null } => row.value !== null);
    if (!valid.length) return null;

    const totalWeight = valid.reduce((total, row) => total + (row.weight && row.weight > 0 ? row.weight : 0), 0);
    if (totalWeight <= 0) {
      return this.averageNumbers(valid.map((row) => row.value));
    }

    return valid.reduce((total, row) => total + row.value * (row.weight && row.weight > 0 ? row.weight : 0), 0) / totalWeight;
  }

  private averageNumbers(values: Array<number | null | undefined>): number | null {
    const numbers = values.filter((value): value is number => Number.isFinite(Number(value)));
    if (!numbers.length) return null;
    return numbers.reduce((total, value) => total + value, 0) / numbers.length;
  }

  private uniqueTexts(values: Array<string | null | undefined>): string[] {
    return Array.from(new Set(
      values
        .map((value) => String(value ?? '').trim())
        .filter((value) => value && value !== '-')
    ));
  }

  private latestDate(values: Array<string | null | undefined>): string | null {
    const validDates = values
      .map((value) => value ? new Date(value) : null)
      .filter((date): date is Date => !!date && !Number.isNaN(date.getTime()))
      .sort((left, right) => right.getTime() - left.getTime());

    if (validDates.length) {
      return validDates[0].toISOString();
    }

    return values.find((value) => !!value) ?? null;
  }

  private buildKey(scope: string, parts: Array<string | number | null | undefined>): string {
    const normalized = parts
      .map((part) => part === null || part === undefined ? '' : String(part))
      .filter((part) => part.trim() !== '')
      .map((part) => this.normalizeKey(part))
      .filter(Boolean)
      .join('-');

    return `${scope}-${normalized || 'sin-id'}`;
  }

  private compareEmployees(left: FollowEmployeeResult, right: FollowEmployeeResult): number {
    const positionCompare = left.position.localeCompare(right.position, 'es', { sensitivity: 'base' });
    if (positionCompare !== 0) return positionCompare;
    return left.name.localeCompare(right.name, 'es', { sensitivity: 'base' });
  }

  private async loadPersistedPlans(idOrganizacion: number, idModelo: number): Promise<void> {
    this.employeePlansByKey.clear();
    try {
      const response = await this.organizacionService.getDesempenoActionPlans(idOrganizacion, idModelo, {
        soloActivos: true,
      });
      const plans = this.extractCollection(response)
        .map((item) => this.normalizePersistedActionPlan(item))
        .filter((item): item is { employeeKey: string; plan: EmployeeActionPlan } => !!item);

      plans.forEach(({ employeeKey, plan }) => {
        this.employeePlansByKey.set(employeeKey, [
          ...(this.employeePlansByKey.get(employeeKey) ?? []),
          plan,
        ]);
      });
    } catch (error) {
      console.error('Error al cargar planes de acción persistidos:', error);
      this.employeePlansByKey.clear();
      Swal.fire('Planes de Acción', 'No fue posible cargar los planes guardados.', 'warning');
    }
  }

  private normalizePersistedActionPlan(raw: any): { employeeKey: string; plan: EmployeeActionPlan } | null {
    const id = this.getNumber(raw, ['id', 'idPlanAccion', 'IdPlanAccion']);
    if (!id) {
      return null;
    }

    const empleadoEvaluado = raw?.empleadoEvaluado ?? raw?.EmpleadoEvaluado ?? {};
    const employeeId =
      this.getNumber(empleadoEvaluado, ['id', 'empleadoId', 'IdEmpleado']) ??
      this.getNumber(raw, ['empleadoEvaluadoId', 'IdEmpleadoEvaluado']);
    const employee = this.groupedData?.employees.find((item) => item.id === employeeId) ?? null;
    const employeeKey = employee
      ? this.getEmployeeKey(employee)
      : employeeId
        ? `emp-${employeeId}`
        : `emp-${this.normalizeKey(this.getText(empleadoEvaluado, ['nombre', 'Nombre'], 'sin-empleado'))}`;
    const opportunityKey = this.toOptionalText(raw?.oportunidadKey ?? raw?.opportunityKey ?? raw?.OpportunityKey);

    return {
      employeeKey,
      plan: {
        id,
        opportunityId: opportunityKey,
        title: this.getText(raw, ['titulo', 'Titulo', 'title'], 'Plan de acción'),
        objective: this.toOptionalText(raw?.objetivo ?? raw?.Objetivo) ?? '',
        action: this.toOptionalText(raw?.accion ?? raw?.accionRecomendada ?? raw?.AccionRecomendada) ?? '',
        responsible: this.toOptionalText(raw?.responsable ?? raw?.ResponsableNombre) ?? 'Pendiente',
        responsibleEmployeeId: this.getNumber(raw, ['responsableEmpleadoId', 'responsableId', 'idResponsable', 'IdResponsable']),
        dueDate: this.toDateInputValue(raw?.fechaCompromiso ?? raw?.FechaCompromiso),
        priority: this.normalizePlanPriority(raw?.prioridad ?? raw?.Prioridad ?? raw?.oportunidad?.prioridad),
        status: this.normalizePlanStatus(raw?.estado ?? raw?.estadoPlanCodigo ?? raw?.EstadoPlanCodigo),
        evidence: this.toOptionalText(raw?.evidencia ?? raw?.Evidencia) ?? '',
        tasks: this.asArray(raw?.tareas ?? raw?.Tareas)
          .map((task, index) => this.normalizePersistedTask(task, index)),
      },
    };
  }

  private normalizePersistedTask(raw: any, index: number): ActionTask {
    return {
      id: this.getNumber(raw, ['id', 'idPlanAccionTarea', 'IdPlanAccionTarea']) ?? -(index + 1),
      title: this.getText(raw, ['titulo', 'Titulo', 'title'], 'Tarea'),
      responsible: this.toOptionalText(raw?.responsable ?? raw?.ResponsableNombre) ?? 'Pendiente',
      responsibleEmployeeId: this.getNumber(raw, ['responsableEmpleadoId', 'responsableId', 'idResponsable', 'IdResponsable']),
      dueDate: this.toDateInputValue(raw?.fechaCompromiso ?? raw?.FechaCompromiso),
      done: this.toBoolean(raw?.completada ?? raw?.Completada ?? raw?.done, false),
    };
  }

  private async saveEmployeePlans(employee: FollowEmployeeResult, plans: EmployeeActionPlan[]): Promise<void> {
    if (this.isSavingPlans) {
      return;
    }

    const idOrganizacion = this.selectedOrganizationId;
    const idModelo = this.selectedModelId;
    const empleadoEvaluadoId = employee.id;

    if (!idOrganizacion || !idModelo || !empleadoEvaluadoId) {
      Swal.fire('Planes de Acción', 'No se pudo identificar organización, modelo o empleado evaluado.', 'error');
      return;
    }

    const employeeKey = this.getEmployeeKey(employee);
    const previousPlans = this.clonePlans(this.getEmployeePlans(employee));
    this.employeePlansByKey.set(employeeKey, this.clonePlans(plans));
    this.isSavingPlans = true;

    Swal.fire({
      title: 'Guardando planes de acción',
      text: 'Estamos registrando los planes en la base de datos.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const removedPlanIds = this.getRemovedPersistedPlanIds(previousPlans, plans);
      await Promise.all(
        removedPlanIds.map((planId) =>
          this.organizacionService.deleteDesempenoActionPlan(planId, idOrganizacion, false)
        )
      );

      for (const plan of plans) {
        const payload = this.buildActionPlanPayload(employee, plan, idOrganizacion, idModelo);
        await this.organizacionService.saveDesempenoActionPlan(payload, this.getPersistedPlanId(plan));
      }

      await this.loadPersistedPlans(idOrganizacion, idModelo);
      Swal.fire('Planes de Acción', 'Planes guardados correctamente.', 'success');
    } catch (error) {
      console.error('Error al guardar planes de acción:', error);
      this.employeePlansByKey.set(employeeKey, previousPlans);
      Swal.fire(
        'Planes de Acción',
        this.getRequestErrorMessage(error, 'No fue posible guardar los planes de acción.'),
        'error'
      );
    } finally {
      this.isSavingPlans = false;
    }
  }

  private buildActionPlanPayload(
    employee: FollowEmployeeResult,
    plan: EmployeeActionPlan,
    idOrganizacion: number,
    idModelo: number,
  ): Record<string, any> {
    const opportunity = this.findEmployeeOpportunity(employee, plan.opportunityId);

    return {
      organizacionId: idOrganizacion,
      modeloId: idModelo,
      empleadoEvaluadoId: employee.id,
      opportunityKey: plan.opportunityId ?? `manual|${employee.id}|${this.normalizeKey(plan.title)}`,
      evaluacionId: opportunity?.evaluationId ?? null,
      asignacionId: opportunity?.assignmentId ?? null,
      respuestaId: opportunity?.responseId ?? null,
      respuestaDetalleId: opportunity?.responseDetailId ?? null,
      empleadoEvaluadorId: opportunity?.evaluatorId ?? null,
      escenarioId: opportunity?.scenarioId ?? null,
      escenarioCodigo: opportunity?.scenarioCode ?? null,
      escenarioNombre: opportunity?.scenario ?? null,
      modeloDimensionId: opportunity?.dimensionId ?? null,
      dimensionNombre: opportunity?.dimension ?? null,
      criterioEvaluacionId: opportunity?.criterionId ?? null,
      criterioNombre: opportunity?.criterion ?? null,
      itemEvaluativoId: opportunity?.itemId ?? null,
      itemTexto: opportunity?.item ?? null,
      respuestaTexto: opportunity?.answer ?? null,
      resultado: opportunity?.score ?? null,
      nivelEsperado: opportunity?.target ?? null,
      brecha: opportunity?.gap ?? null,
      prioridad: plan.priority,
      estadoOportunidadCodigo: plan.status === 'CANCELADO' ? 'DESCARTADA' : 'EN_PLAN',
      titulo: plan.title,
      objetivo: plan.objective,
      accionRecomendada: plan.action,
      responsableId: plan.responsibleEmployeeId ?? null,
      responsableNombre: plan.responsible || null,
      fechaCompromiso: plan.dueDate || null,
      estadoPlanCodigo: plan.status,
      evidencia: plan.evidence,
      tareas: plan.tasks.map((task, index) => ({
        ...(this.getPersistedTaskId(task) ? { id: this.getPersistedTaskId(task) } : {}),
        titulo: task.title,
        responsableId: task.responsibleEmployeeId ?? null,
        responsableNombre: task.responsible || null,
        fechaCompromiso: task.dueDate || null,
        completada: task.done,
        orden: index + 1,
      })),
    };
  }

  private findEmployeeOpportunity(employee: FollowEmployeeResult, opportunityId: string | null): FollowOpportunity | null {
    if (!opportunityId) {
      return null;
    }

    return employee.opportunities.find((opportunity) => opportunity.id === opportunityId) ?? null;
  }

  private getRemovedPersistedPlanIds(previousPlans: EmployeeActionPlan[], currentPlans: EmployeeActionPlan[]): number[] {
    const currentIds = new Set(
      currentPlans
        .map((plan) => this.getPersistedPlanId(plan))
        .filter((id): id is number => !!id)
    );

    return previousPlans
      .map((plan) => this.getPersistedPlanId(plan))
      .filter((id): id is number => !!id && !currentIds.has(id));
  }

  private getPersistedPlanId(plan: EmployeeActionPlan): number | null {
    return Number.isInteger(plan.id) && plan.id > 0 ? plan.id : null;
  }

  private getPersistedTaskId(task: ActionTask): number | null {
    return Number.isInteger(task.id) && task.id > 0 ? task.id : null;
  }

  private normalizePlanStatus(value: any): PlanStatus {
    const code = this.normalizeKey(String(value ?? ''));
    if (['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'].includes(code)) {
      return code as PlanStatus;
    }

    return 'PENDIENTE';
  }

  private normalizePlanPriority(value: any): PlanPriority {
    const code = this.normalizeKey(String(value ?? ''));
    if (['CRITICA', 'ALTA', 'MEDIA', 'BAJA'].includes(code)) {
      return code as PlanPriority;
    }

    return 'MEDIA';
  }

  private toDateInputValue(value: any): string {
    const text = this.toOptionalText(value);
    if (!text) {
      return '';
    }

    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }

    return text.slice(0, 10);
  }

  private getRequestErrorMessage(error: any, fallback: string): string {
    return (
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.error?.message ??
      error?.message ??
      fallback
    );
  }

  private clonePlans(plans: EmployeeActionPlan[]): EmployeeActionPlan[] {
    return JSON.parse(JSON.stringify(plans ?? []));
  }

  private addDays(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private toDateInput(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private extractCollection(response: any): any[] {
    const payload = this.extractPayload(response);
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    return [];
  }

  private extractPayload(response: any): any {
    let payload = response?.data ?? response;

    for (let guard = 0; guard < 6; guard += 1) {
      payload = this.parseJsonValue(payload);
      const jsonPayload = payload?.DataJson ?? payload?.dataJson;
      if (typeof jsonPayload === 'string') {
        payload = this.parseJsonValue(jsonPayload);
        continue;
      }

      const isWrapper = payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        Object.prototype.hasOwnProperty.call(payload, 'data') &&
        (
          Object.prototype.hasOwnProperty.call(payload, 'ok') ||
          Object.prototype.hasOwnProperty.call(payload, 'message') ||
          Object.keys(payload).length <= 3
        );

      if (isWrapper) {
        payload = payload.data;
        continue;
      }

      break;
    }

    return payload;
  }

  private parseJsonValue(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    if (!trimmed || !['{', '['].includes(trimmed[0])) {
      return value;
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  private asArray(value: any): any[] {
    const parsed = this.parseJsonValue(value);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.items)) return parsed.items;
    if (Array.isArray(parsed?.data)) return parsed.data;
    return [];
  }

  getText(item: any, keys: string[], fallback = '-'): string {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== '' && typeof value !== 'boolean') {
        return String(value).trim();
      }
    }

    return fallback;
  }

  getNumber(item: any, keys: string[]): number | null {
    for (const key of keys) {
      const value = item?.[key];
      if (value === undefined || value === null || value === '') continue;
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }

    return null;
  }

  private toPositiveIntegerList(value: any): number[] {
    if (value === undefined || value === null || value === '') {
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

      return text
        .split(/[,\s;|]+/)
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isInteger(id) && id > 0);
    }

    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? [id] : [];
  }

  private toOptionalText(value: any): string | null {
    if (value === undefined || value === null || value === '' || typeof value === 'boolean') {
      return null;
    }

    return String(value).trim();
  }

  private toBoolean(value: any, fallback = false): boolean {
    if (typeof value === 'boolean') return value;
    if (value === undefined || value === null || value === '') return fallback;
    const normalized = this.normalizeKey(String(value));
    if (['TRUE', 'SI', 'YES', 'ACTIVO', '1'].includes(normalized)) return true;
    if (['FALSE', 'NO', 'INACTIVO', '0'].includes(normalized)) return false;
    return fallback;
  }

  private normalizeKey(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }
}

@Component({
  selector: 'app-des-employee-results-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>analytics</mat-icon>
      Resultados de {{ data.employee.name }}
    </h2>

    <mat-dialog-content class="follow-dialog-content">
      <div class="dialog-hero">
        <div>
          <h3>{{ data.employee.name }}</h3>
          <p>{{ data.employee.position }} · {{ data.employee.email || 'Sin correo' }}</p>
        </div>
        <div class="dialog-score">
          <strong>{{ data.helpers.formatScore(data.employee.score) }}</strong>
          <span>Meta {{ data.helpers.formatScore(data.employee.target) }}</span>
          <em [ngClass]="data.helpers.getToneClass(data.employee.tone)">
            {{ data.helpers.getToneLabel(data.employee.tone) }}
          </em>
        </div>
      </div>

      <div class="dialog-kpis">
        <div>
          <span>Brecha</span>
          <strong [ngClass]="data.helpers.getGapTone(data.employee.gap)">
            {{ data.helpers.formatGap(data.employee.gap) }}
          </strong>
        </div>
        <div>
          <span>Escenarios</span>
          <strong>{{ data.employee.evaluations.length }}</strong>
        </div>
        <div>
          <span>Oportunidades</span>
          <strong>{{ data.employee.opportunities.length }}</strong>
        </div>
      </div>

      <section class="opportunity-summary" *ngIf="data.employee.opportunities.length">
        <h3>Ítems de oportunidad de mejora</h3>
        <article *ngFor="let opportunity of data.employee.opportunities.slice(0, 6); trackBy: data.helpers.trackByKey">
          <span class="priority-chip" [ngClass]="data.helpers.getPriorityClass(opportunity.priority)">
            {{ opportunity.priority }}
          </span>
          <div>
            <strong>{{ opportunity.dimension }} · {{ opportunity.criterion }}</strong>
            <p>{{ opportunity.item }}</p>
            <small>
              {{ opportunity.scenario }} · Resultado {{ data.helpers.formatScore(opportunity.score) }}
              / Esperado {{ data.helpers.formatScore(opportunity.target) }}
              · Brecha {{ data.helpers.formatGap(opportunity.gap) }}
            </small>
          </div>
        </article>
      </section>

      <article class="evaluation-card" *ngFor="let evaluation of data.employee.evaluations; trackBy: data.helpers.trackByKey">
        <div class="evaluation-card-header">
          <div>
            <h3>{{ evaluation.escenario }}</h3>
            <p>
              <span class="scenario-pill">{{ evaluation.encuestaCount }} {{ evaluation.encuestaCount === 1 ? 'encuesta' : 'encuestas' }}</span>
              Resultado ponderado del escenario · {{ evaluation.evaluador }}
              · Última respuesta: {{ data.helpers.formatDate(evaluation.fechaFinalizacion) }}
            </p>
          </div>
          <div class="mini-score">
            <strong>{{ data.helpers.formatScore(evaluation.score) }} / {{ data.helpers.formatScore(evaluation.target) }}</strong>
            <span [ngClass]="data.helpers.getToneClass(evaluation.tone)">
              {{ data.helpers.getToneLabel(evaluation.tone) }}
            </span>
          </div>
        </div>

        <section class="dimension-detail" *ngFor="let dimension of evaluation.dimensiones; trackBy: data.helpers.trackByKey">
          <div class="dimension-head">
            <strong>{{ dimension.nombre }}</strong>
            <span>{{ data.helpers.formatScore(dimension.score) }} / {{ data.helpers.formatScore(dimension.target) }}</span>
          </div>

          <div class="criterion-detail" *ngFor="let criterion of dimension.criterios; trackBy: data.helpers.trackByKey">
            <div class="criterion-head">
              <strong>{{ criterion.nombre }}</strong>
              <span>
                Resultado {{ data.helpers.formatScore(criterion.score) }}
                · Esperado {{ data.helpers.formatScore(criterion.target) }}
              </span>
            </div>

            <div class="item-detail" *ngFor="let item of criterion.items; trackBy: data.helpers.trackByKey">
              <p>{{ item.texto }}</p>
              <div>
                <span>{{ item.respuesta }}</span>
                <em [ngClass]="data.helpers.getToneClass(item.tone)">
                  {{ data.helpers.getToneLabel(item.tone) }}
                </em>
              </div>
            </div>
          </div>
        </section>
      </article>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-flat-button color="primary" mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./des-planes-seguimiento.component.scss'],
})
export class DesEmployeeResultsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeDetailDialogData) {}
}

@Component({
  selector: 'app-des-employee-action-plans-dialog',
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
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>assignment_turned_in</mat-icon>
      Planes de acción · {{ data.employee.name }}
    </h2>

    <mat-dialog-content class="follow-dialog-content action-plan-dialog-content">
      <div class="plan-dialog-layout">
        <aside class="opportunity-sidebar">
          <h3>Oportunidades detectadas</h3>
          <p *ngIf="!data.employee.opportunities.length">
            No se detectaron ítems por debajo del nivel esperado.
          </p>

          <section
            class="opportunity-group"
            *ngFor="let dimension of opportunityGroups; trackBy: data.helpers.trackByKey"
          >
            <div class="opportunity-dimension-head">
              <mat-icon>category</mat-icon>
              <div>
                <strong>{{ dimension.name }}</strong>
                <span>{{ dimension.count }} {{ dimension.count === 1 ? 'oportunidad' : 'oportunidades' }}</span>
              </div>
            </div>

            <div
              class="opportunity-criterion-group"
              *ngFor="let criterion of dimension.criteria; trackBy: data.helpers.trackByKey"
            >
              <div class="opportunity-criterion-head">
                <span>{{ criterion.name }}</span>
                <em>{{ criterion.opportunities.length }}</em>
              </div>

              <button
                type="button"
                *ngFor="let opportunity of criterion.opportunities; trackBy: data.helpers.trackByKey"
                [ngClass]="{
                  'is-selected': isOpportunitySelected(opportunity),
                  'is-saved': isOpportunitySaved(opportunity)
                }"
                (click)="addPlan(opportunity)"
              >
                <div class="opportunity-status-row">
                  <span class="priority-chip" [ngClass]="data.helpers.getPriorityClass(opportunity.priority)">
                    {{ opportunity.priority }}
                  </span>
                  <span class="opportunity-state-chip saved" *ngIf="isOpportunitySaved(opportunity)">
                    <mat-icon>check_circle</mat-icon>
                    Plan guardado
                  </span>
                  <span class="opportunity-state-chip selected" *ngIf="!isOpportunitySaved(opportunity) && isOpportunitySelected(opportunity)">
                    <mat-icon>radio_button_checked</mat-icon>
                    Seleccionada
                  </span>
                </div>
                <strong>{{ opportunity.scenario }}</strong>
                <small>{{ opportunity.item }}</small>
                <em>{{ data.helpers.formatGap(opportunity.gap) }}</em>
              </button>
            </div>
          </section>
        </aside>

        <section class="plan-editor-list">
          <div class="empty-plans" *ngIf="!plans.length">
            <mat-icon>playlist_add_check</mat-icon>
            <h3>Aún no hay planes</h3>
            <p>Selecciona una oportunidad de mejora para generar un plan editable.</p>
          </div>

          <mat-card
            class="editable-plan"
            *ngFor="let plan of plans; trackBy: data.helpers.trackByKey"
            [attr.data-opportunity-id]="plan.opportunityId"
            [ngClass]="{ 'is-selected-plan': isPlanSelected(plan) }"
          >
            <div class="plan-card-header">
              <div>
                <span class="priority-chip" [ngClass]="data.helpers.getPriorityClass(plan.priority)">
                  {{ plan.priority }}
                </span>
                <h3>{{ plan.title }}</h3>
                <small class="plan-opportunity-item" *ngIf="getPlanOpportunity(plan) as opportunity">
                  "{{ opportunity.item }}"
                </small>
              </div>
              <button mat-icon-button color="warn" type="button" (click)="removePlan(plan)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <div class="plan-form">
              <mat-form-field appearance="outline">
                <mat-label>Título</mat-label>
                <input matInput [(ngModel)]="plan.title">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Responsable</mat-label>
                <input
                  matInput
                  readonly
                  class="responsible-picker-input"
                  [(ngModel)]="plan.responsible"
                  (click)="openResponsiblePickerForPlan(plan)"
                >
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  aria-label="Buscar responsable"
                  (click)="openResponsiblePickerForPlan(plan); $event.stopPropagation()"
                >
                  <mat-icon>search</mat-icon>
                </button>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha compromiso</mat-label>
                <input matInput type="date" [(ngModel)]="plan.dueDate">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select [(ngModel)]="plan.status">
                  <mat-option value="PENDIENTE">Pendiente</mat-option>
                  <mat-option value="EN_PROCESO">En proceso</mat-option>
                  <mat-option value="COMPLETADO">Completado</mat-option>
                  <mat-option value="CANCELADO">Cancelado</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="wide">
                <mat-label>Objetivo</mat-label>
                <textarea matInput rows="2" [(ngModel)]="plan.objective"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="wide">
                <mat-label>Acción recomendada</mat-label>
                <textarea matInput rows="3" [(ngModel)]="plan.action"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="wide full">
                <mat-label>Evidencia / validación</mat-label>
                <textarea matInput rows="2" [(ngModel)]="plan.evidence"></textarea>
              </mat-form-field>
            </div>

            <div class="task-header">
              <h4>Tareas</h4>
              <button mat-button color="primary" type="button" (click)="addTask(plan)">
                <mat-icon>add_circle</mat-icon>
                Agregar
              </button>
            </div>

            <div class="task-editor" *ngFor="let task of plan.tasks; trackBy: data.helpers.trackByKey">
              <mat-checkbox [(ngModel)]="task.done"></mat-checkbox>
              <mat-form-field appearance="outline">
                <mat-label>Tarea</mat-label>
                <input matInput [(ngModel)]="task.title">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Responsable</mat-label>
                <input
                  matInput
                  readonly
                  class="responsible-picker-input"
                  [(ngModel)]="task.responsible"
                  (click)="openResponsiblePickerForTask(task)"
                >
                <button
                  mat-icon-button
                  matSuffix
                  type="button"
                  aria-label="Buscar responsable de tarea"
                  (click)="openResponsiblePickerForTask(task); $event.stopPropagation()"
                >
                  <mat-icon>search</mat-icon>
                </button>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Fecha</mat-label>
                <input matInput type="date" [(ngModel)]="task.dueDate">
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeTask(plan, task)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </mat-card>
        </section>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cancelar</button>
      <button mat-flat-button color="primary" type="button" (click)="save()">Guardar planes</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./des-planes-seguimiento.component.scss'],
})
export class DesEmployeeActionPlansDialogComponent {
  public plans: EmployeeActionPlan[] = [];
  public opportunityGroups: FollowOpportunityDimensionGroup[] = [];
  public savedOpportunityIds = new Set<string>();
  public selectedPlanOpportunityId: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EmployeePlansDialogData,
    private ref: MatDialogRef<DesEmployeeActionPlansDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.plans = JSON.parse(JSON.stringify(data.plans ?? []));
    this.savedOpportunityIds = new Set(
      (data.plans ?? [])
        .map((plan) => plan.opportunityId)
        .filter((id): id is string => !!id),
    );
    this.opportunityGroups = this.groupOpportunitiesByDimensionAndCriterion(data.employee.opportunities);
  }

  addPlan(opportunity: FollowOpportunity): void {
    if (!this.plans.some((plan) => plan.opportunityId === opportunity.id)) {
      this.plans = [
        this.data.helpers.buildPlanFromOpportunity(opportunity),
        ...this.plans,
      ];
    }

    this.selectedPlanOpportunityId = opportunity.id;
    this.scrollPlanIntoView(opportunity.id);
  }

  removePlan(plan: EmployeeActionPlan): void {
    this.plans = this.plans.filter((item) => item.id !== plan.id);
    if (this.selectedPlanOpportunityId === plan.opportunityId) {
      this.selectedPlanOpportunityId = null;
    }
  }

  getPlanOpportunity(plan: EmployeeActionPlan): FollowOpportunity | null {
    return this.data.employee.opportunities.find((opportunity) => opportunity.id === plan.opportunityId) ?? null;
  }

  openResponsiblePickerForPlan(plan: EmployeeActionPlan): void {
    const dialogRef = this.openResponsiblePicker(plan.responsible);

    dialogRef.afterClosed().subscribe((employee?: FollowEmployeeDirectoryItem) => {
      if (!employee) {
        return;
      }

      plan.responsible = employee.fullName;
      plan.responsibleEmployeeId = employee.id;
    });
  }

  openResponsiblePickerForTask(task: ActionTask): void {
    const dialogRef = this.openResponsiblePicker(task.responsible);

    dialogRef.afterClosed().subscribe((employee?: FollowEmployeeDirectoryItem) => {
      if (!employee) {
        return;
      }

      task.responsible = employee.fullName;
      task.responsibleEmployeeId = employee.id;
    });
  }

  isOpportunitySelected(opportunity: FollowOpportunity): boolean {
    return this.plans.some((plan) => plan.opportunityId === opportunity.id);
  }

  isOpportunitySaved(opportunity: FollowOpportunity): boolean {
    return this.savedOpportunityIds.has(opportunity.id) && this.isOpportunitySelected(opportunity);
  }

  isPlanSelected(plan: EmployeeActionPlan): boolean {
    return !!plan.opportunityId && plan.opportunityId === this.selectedPlanOpportunityId;
  }

  addTask(plan: EmployeeActionPlan): void {
    plan.tasks = [
      ...plan.tasks,
      {
        id: -Date.now(),
        title: 'Nueva tarea',
        responsible: plan.responsible || 'Pendiente',
        responsibleEmployeeId: plan.responsibleEmployeeId ?? null,
        dueDate: plan.dueDate,
        done: false,
      },
    ];
  }

  removeTask(plan: EmployeeActionPlan, task: ActionTask): void {
    plan.tasks = plan.tasks.filter((item) => item.id !== task.id);
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    this.ref.close(this.plans);
  }

  private openResponsiblePicker(currentResponsible: string): MatDialogRef<DesResponsibleEmployeePickerDialogComponent, FollowEmployeeDirectoryItem | undefined> {
    return this.dialog.open(DesResponsibleEmployeePickerDialogComponent, {
      width: '760px',
      maxWidth: '96vw',
      maxHeight: '86vh',
      panelClass: 'des-follow-dialog-panel',
      data: {
        employees: this.data.employees,
        evaluatedEmployee: this.data.employee,
        currentResponsible,
      } satisfies ResponsiblePickerDialogData,
    });
  }

  private groupOpportunitiesByDimensionAndCriterion(
    opportunities: FollowOpportunity[],
  ): FollowOpportunityDimensionGroup[] {
    const priorityWeight: Record<PlanPriority, number> = {
      CRITICA: -1,
      ALTA: 0,
      MEDIA: 1,
      BAJA: 2,
    };

    const sortedOpportunities = [...opportunities].sort((a, b) => {
      const priorityDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const gapA = Math.abs(a.gap ?? 0);
      const gapB = Math.abs(b.gap ?? 0);
      return gapB - gapA;
    });

    const dimensions = new Map<string, FollowOpportunityDimensionGroup>();

    for (const opportunity of sortedOpportunities) {
      const dimensionName = this.cleanGroupName(opportunity.dimension, 'Sin dimensión');
      const criterionName = this.cleanGroupName(opportunity.criterion, 'Sin criterio');
      const dimensionKey = this.makeGroupKey(dimensionName);
      const criterionKey = this.makeGroupKey(criterionName);

      if (!dimensions.has(dimensionKey)) {
        dimensions.set(dimensionKey, {
          key: dimensionKey,
          name: dimensionName,
          count: 0,
          criteria: [],
        });
      }

      const dimension = dimensions.get(dimensionKey)!;
      let criterion = dimension.criteria.find((item) => item.key === criterionKey);

      if (!criterion) {
        criterion = {
          key: criterionKey,
          name: criterionName,
          opportunities: [],
        };
        dimension.criteria.push(criterion);
      }

      criterion.opportunities.push(opportunity);
      dimension.count += 1;
    }

    return Array.from(dimensions.values())
      .map((dimension) => ({
        ...dimension,
        criteria: [...dimension.criteria].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private cleanGroupName(value: string, fallback: string): string {
    const text = String(value ?? '').trim();
    return text || fallback;
  }

  private makeGroupKey(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private scrollPlanIntoView(opportunityId: string): void {
    setTimeout(() => {
      const scope = document.querySelector('.des-follow-action-plan-dialog-panel') ?? document;
      const cards = Array.from(scope.querySelectorAll<HTMLElement>('.editable-plan'));
      const card = cards.find((element) => element.dataset['opportunityId'] === opportunityId);

      card?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }
}

@Component({
  selector: 'app-des-responsible-employee-picker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>person_search</mat-icon>
      Seleccionar responsable
    </h2>

    <mat-dialog-content class="responsible-picker-dialog">
      <div class="responsible-picker-toolbar">
        <mat-form-field appearance="outline" class="responsible-search">
          <mat-label>Buscar empleado</mat-label>
          <input
            matInput
            [(ngModel)]="searchText"
            placeholder="Nombre, puesto, correo o demográfico"
          >
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="responsible-group-select">
          <mat-label>Agrupar por</mat-label>
          <mat-select [(ngModel)]="selectedGroupingKey">
            <mat-option *ngFor="let option of groupingOptions" [value]="option.key">
              {{ option.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="direct-leader-note" *ngIf="directLeaderNames.length">
        <mat-icon>supervisor_account</mat-icon>
        <span>
          Líder directo:
          <strong>{{ directLeaderNames.join(', ') }}</strong>
        </span>
      </div>

      <div class="responsible-empty" *ngIf="!data.employees.length">
        <mat-icon>group_off</mat-icon>
        <h3>No hay empleados disponibles</h3>
        <p>No se pudo cargar la lista de empleados para esta organización.</p>
      </div>

      <div class="responsible-empty" *ngIf="data.employees.length && !filteredEmployees.length">
        <mat-icon>search_off</mat-icon>
        <h3>Sin resultados</h3>
        <p>Prueba con otro nombre, puesto o correo.</p>
      </div>

      <div class="responsible-limit-note" *ngIf="isResponsibleResultLimited">
        <mat-icon>filter_list</mat-icon>
        <span>
          Mostrando {{ filteredEmployees.length }} de {{ totalMatchingEmployees }} empleados.
          Usa la búsqueda para afinar la selección.
        </span>
      </div>

      <div class="responsible-list">
        <section
          class="responsible-group"
          *ngFor="let group of groupedEmployees; trackBy: trackByGroup"
        >
          <div class="responsible-group-head">
            <strong>{{ group.title }}</strong>
            <span>{{ group.subtitle }}</span>
          </div>

          <button
            type="button"
            class="responsible-employee-option"
            *ngFor="let employee of group.employees; trackBy: trackByEmployee"
            [ngClass]="{
              'is-direct-leader': isDirectLeader(employee),
              'is-current': isCurrentResponsible(employee)
            }"
            (click)="select(employee)"
          >
            <span class="responsible-tree-indent" [style.width.px]="getHierarchyIndent(employee)"></span>
            <span class="responsible-avatar">{{ getInitials(employee.fullName) }}</span>
            <span class="responsible-main">
              <strong>{{ employee.fullName }}</strong>
              <small>{{ employee.position }} · {{ employee.email || 'Sin correo' }}</small>
              <span class="responsible-demographics" *ngIf="employee.demographics.length">
                <b *ngFor="let demographic of getDemographicPreview(employee)">
                  {{ demographic.name }}: {{ demographic.value }}
                </b>
              </span>
            </span>
            <span class="responsible-badges">
              <em *ngIf="isDirectLeader(employee)">Líder directo</em>
              <i *ngIf="isCurrentResponsible(employee)">Actual</i>
            </span>
          </button>
        </section>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./des-planes-seguimiento.component.scss'],
})
export class DesResponsibleEmployeePickerDialogComponent {
  public groupingOptions: ResponsibleGroupingOption[] = [];
  public filteredEmployees: FollowEmployeeDirectoryItem[] = [];
  public groupedEmployees: ResponsibleEmployeeGroup[] = [];
  public directManagerIds: number[] = [];
  public directLeaderNames: string[] = [];
  public totalMatchingEmployees = 0;
  public isResponsibleResultLimited = false;
  private searchTextValue = '';
  private selectedGroupingKeyValue = 'HIERARCHY';
  private directManagerIdSet = new Set<number>();
  private currentResponsibleKey = '';
  private hierarchyOrderByEmployeeId = new Map<number, number>();
  private hierarchyLevelByEmployeeId = new Map<number, number>();
  private readonly maxRenderedEmployees = 350;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponsiblePickerDialogData,
    private ref: MatDialogRef<DesResponsibleEmployeePickerDialogComponent>,
  ) {
    this.currentResponsibleKey = this.normalizeKey(data.currentResponsible);
    this.rebuildHierarchyMetadata();
    this.directManagerIds = this.resolveDirectManagerIds();
    this.directManagerIdSet = new Set(this.directManagerIds);
    this.directLeaderNames = this.directManagerIds
      .map((id) => this.data.employees.find((employee) => employee.id === id)?.fullName)
      .filter((name): name is string => !!name);
    this.groupingOptions = this.buildGroupingOptions();
    this.rebuildVisibleEmployees();
  }

  get searchText(): string {
    return this.searchTextValue;
  }

  set searchText(value: string) {
    this.searchTextValue = value ?? '';
    this.rebuildVisibleEmployees();
  }

  get selectedGroupingKey(): string {
    return this.selectedGroupingKeyValue;
  }

  set selectedGroupingKey(value: string) {
    this.selectedGroupingKeyValue = value || 'HIERARCHY';
    this.rebuildVisibleEmployees();
  }

  select(employee: FollowEmployeeDirectoryItem): void {
    this.ref.close(employee);
  }

  isDirectLeader(employee: FollowEmployeeDirectoryItem): boolean {
    return this.directManagerIdSet.has(employee.id);
  }

  isCurrentResponsible(employee: FollowEmployeeDirectoryItem): boolean {
    return this.normalizeKey(employee.fullName) === this.currentResponsibleKey;
  }

  trackByGroup(index: number, group: ResponsibleEmployeeGroup): string {
    return group.key || String(index);
  }

  trackByEmployee(index: number, employee: FollowEmployeeDirectoryItem): number {
    return employee.id || index;
  }

  getHierarchyIndent(employee: FollowEmployeeDirectoryItem): number {
    return Math.min((this.hierarchyLevelByEmployeeId.get(employee.id) ?? 0) * 16, 80);
  }

  getDemographicPreview(employee: FollowEmployeeDirectoryItem): FollowEmployeeDemographicValue[] {
    return employee.demographics.slice(0, 3);
  }

  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'EM';
  }

  private resolveDirectManagerIds(): number[] {
    const evaluated = this.data.employees.find((employee) => employee.id === this.data.evaluatedEmployee.id);
    return evaluated?.managerIds ?? [];
  }

  private buildGroupingOptions(): ResponsibleGroupingOption[] {
    const demographics = new Map<string, string>();

    this.data.employees.forEach((employee) => {
      employee.demographics.forEach((demographic) => {
        if (!demographics.has(demographic.key)) {
          demographics.set(demographic.key, demographic.name);
        }
      });
    });

    return [
      { key: 'HIERARCHY', label: 'Jerarquía' },
      ...Array.from(demographics.entries())
        .sort((left, right) => left[1].localeCompare(right[1], 'es', { sensitivity: 'base' }))
        .map(([key, label]) => ({
          key: `DEMOGRAPHIC:${key}`,
          label,
        })),
    ];
  }

  private rebuildVisibleEmployees(): void {
    const matchedRows = this.filterEmployees();
    this.totalMatchingEmployees = matchedRows.length;

    const prioritizedRows = [
      ...matchedRows.filter((employee) => this.isDirectLeader(employee)),
      ...matchedRows.filter((employee) => !this.isDirectLeader(employee)),
    ];
    this.isResponsibleResultLimited = prioritizedRows.length > this.maxRenderedEmployees;
    this.filteredEmployees = prioritizedRows.slice(0, this.maxRenderedEmployees);
    this.groupedEmployees = this.buildEmployeeGroups(this.filteredEmployees);
  }

  private filterEmployees(): FollowEmployeeDirectoryItem[] {
    const text = this.normalizeKey(this.searchTextValue);

    if (!text) {
      return this.data.employees;
    }

    return this.data.employees.filter((employee) => {
      const demographics = employee.demographics
        .map((demographic) => `${demographic.name} ${demographic.value}`)
        .join(' ');

      return this.normalizeKey(`${employee.fullName} ${employee.position} ${employee.email ?? ''} ${demographics}`).includes(text);
    });
  }

  private buildEmployeeGroups(rows: FollowEmployeeDirectoryItem[]): ResponsibleEmployeeGroup[] {
    const sortedRows = this.sortEmployeesHierarchically(rows);

    if (this.selectedGroupingKeyValue === 'HIERARCHY') {
      return sortedRows.length
        ? [{
            key: 'HIERARCHY',
            title: 'Jerarquía organizacional',
            subtitle: `${sortedRows.length} ${sortedRows.length === 1 ? 'empleado' : 'empleados'}`,
            employees: sortedRows,
          }]
        : [];
    }

    const demographicKey = this.selectedGroupingKeyValue.replace(/^DEMOGRAPHIC:/, '');
    const selectedLabel = this.groupingOptions.find((option) => option.key === this.selectedGroupingKeyValue)?.label ?? 'Demográfico';
    const groups = new Map<string, ResponsibleEmployeeGroup>();

    sortedRows.forEach((employee) => {
      const demographic = employee.demographics.find((item) => item.key === demographicKey);
      const value = demographic?.value?.trim() || 'Sin valor';
      const key = this.normalizeKey(value) || 'SIN_VALOR';

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          title: value,
          subtitle: `${selectedLabel} · 0 empleados`,
          employees: [],
        });
      }

      groups.get(key)!.employees.push(employee);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        subtitle: `${selectedLabel} · ${group.employees.length} ${group.employees.length === 1 ? 'empleado' : 'empleados'}`,
      }))
      .sort((left, right) => {
        if (left.title === 'Sin valor') return 1;
        if (right.title === 'Sin valor') return -1;
        return left.title.localeCompare(right.title, 'es', { sensitivity: 'base' });
      });
  }

  private sortEmployeesHierarchically(rows: FollowEmployeeDirectoryItem[]): FollowEmployeeDirectoryItem[] {
    return [...rows].sort((left, right) => {
      const leaderDiff = Number(this.isDirectLeader(right)) - Number(this.isDirectLeader(left));
      if (leaderDiff !== 0) return leaderDiff;

      const orderDiff =
        (this.hierarchyOrderByEmployeeId.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
        (this.hierarchyOrderByEmployeeId.get(right.id) ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;

      return left.fullName.localeCompare(right.fullName, 'es', { sensitivity: 'base' });
    });
  }

  private rebuildHierarchyMetadata(): void {
    this.hierarchyOrderByEmployeeId.clear();
    this.hierarchyLevelByEmployeeId.clear();

    const employeesById = new Map(this.data.employees.map((employee) => [employee.id, employee]));
    const parentById = new Map<number, number | null>();
    const childrenByParent = new Map<number | null, FollowEmployeeDirectoryItem[]>();

    this.data.employees.forEach((employee) => {
      const managerId = employee.managerIds.find((id) => id !== employee.id && employeesById.has(id)) ?? null;
      parentById.set(employee.id, managerId);

      const children = childrenByParent.get(managerId) ?? [];
      children.push(employee);
      childrenByParent.set(managerId, children);
    });

    const sortByName = (rows: FollowEmployeeDirectoryItem[]) =>
      rows.sort((left, right) => left.fullName.localeCompare(right.fullName, 'es', { sensitivity: 'base' }));
    const visited = new Set<number>();
    let order = 0;

    const visit = (employee: FollowEmployeeDirectoryItem, level: number) => {
      if (visited.has(employee.id)) {
        return;
      }

      visited.add(employee.id);
      this.hierarchyOrderByEmployeeId.set(employee.id, order);
      this.hierarchyLevelByEmployeeId.set(employee.id, level);
      order += 1;

      sortByName([...(childrenByParent.get(employee.id) ?? [])])
        .forEach((child) => visit(child, level + 1));
    };

    sortByName([...(childrenByParent.get(null) ?? [])])
      .forEach((employee) => visit(employee, 0));

    sortByName(this.data.employees.filter((employee) => !visited.has(employee.id)))
      .forEach((employee) => visit(employee, 0));
  }

  private normalizeKey(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
}
