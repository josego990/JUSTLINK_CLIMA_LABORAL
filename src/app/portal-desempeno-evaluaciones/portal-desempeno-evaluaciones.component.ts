import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrganizacionService } from '../organization/services/organizacion.service';

type EvaluationStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
type EvaluationFilter = 'TODAS' | 'PENDIENTES' | 'COMPLETADAS';

interface PortalAccessContext {
  empleadoId: number;
  modeloId: number;
}

interface EmployeeSummary {
  id: number;
  fullName: string;
  initials: string;
  position: string;
  organizationId: number;
  organization: string;
  email: string;
}

interface ModelSummary {
  id: number;
  code: string;
  name: string;
  version: number;
}

interface EvaluationSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  completionPercentage: number;
}

interface AssignedEvaluation {
  id: number;
  evaluationId: number;
  modelId: number;
  name: string;
  scenarioCode: string;
  scenario: string;
  evaluatedEmployeeId: number;
  evaluatedEmployee: string;
  evaluatedPosition: string;
  dueDate: string;
  status: EvaluationStatus;
  statusLabel: string;
  progress: number;
  dimensions: number;
  items: number;
  answeredItems: number;
  estimatedMinutes: number;
  accessToken: string;
  accessKey: string;
  canRespond: boolean;
}

@Component({
  selector: 'app-portal-desempeno-evaluaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './portal-desempeno-evaluaciones.component.html',
  styleUrls: ['./portal-desempeno-evaluaciones.component.scss'],
})
export class PortalDesempenoEvaluacionesComponent implements OnInit, OnDestroy {
  readonly context: PortalAccessContext | null;
  readonly accessCode: string | null;
  employee: EmployeeSummary | null = null;
  model: ModelSummary | null = null;
  summary: EvaluationSummary = this.emptySummary();
  evaluations: AssignedEvaluation[] = [];
  selectedFilter: EvaluationFilter = 'TODAS';
  isLoading = true;
  isRefreshing = false;
  loadError = '';

  private dataRequest?: Subscription;
  private originalBodyClassName = '';
  private readonly managedThemeClasses = [
    'dark',
    'dark-theme',
    'light',
    'theme-white',
    'theme-black',
    'theme-purple',
    'theme-blue',
    'theme-cyan',
    'theme-green',
    'theme-orange',
    'theme-red',
    'menu_dark',
    'menu_light',
    'logo-black',
    'logo-white',
  ];

  constructor(
    route: ActivatedRoute,
    private organizationService: OrganizacionService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    const encodedContext =
      route.snapshot.paramMap.get('contexto') ??
      route.snapshot.queryParamMap.get('codigoEncuestaEmpleado') ??
      route.snapshot.queryParamMap.get('contexto') ??
      route.snapshot.queryParamMap.get('ref');

    this.context = this.decodeContext(encodedContext);
    this.accessCode = this.context ? this.encodeContext(this.context) : null;

    if (!encodedContext) {
      this.loadError = 'El enlace no contiene el código del empleado y del modelo.';
    } else if (!this.context) {
      this.loadError = 'El código incluido en el enlace no tiene un formato válido.';
    }
  }

  ngOnInit(): void {
    this.forceLightTheme();
    this.loadEvaluationCenter();
  }

  ngOnDestroy(): void {
    this.dataRequest?.unsubscribe();
    this.document.body.className = this.originalBodyClassName;
  }

  get filteredEvaluations(): AssignedEvaluation[] {
    if (this.selectedFilter === 'PENDIENTES') {
      return this.evaluations.filter((item) => item.status !== 'COMPLETADA');
    }

    if (this.selectedFilter === 'COMPLETADAS') {
      return this.evaluations.filter((item) => item.status === 'COMPLETADA');
    }

    return this.evaluations;
  }

  get pendingCount(): number {
    return this.summary.pending;
  }

  get inProgressCount(): number {
    return this.summary.inProgress;
  }

  get completedCount(): number {
    return this.summary.completed;
  }

  get totalEvaluations(): number {
    return this.summary.total;
  }

  get completionPercentage(): number {
    return this.summary.completionPercentage;
  }

  getFilterCount(filter: EvaluationFilter): number {
    if (filter === 'PENDIENTES') {
      return this.pendingCount + this.inProgressCount;
    }
    if (filter === 'COMPLETADAS') {
      return this.completedCount;
    }
    return this.totalEvaluations;
  }

  getStatusLabel(evaluation: AssignedEvaluation): string {
    if (evaluation.statusLabel) {
      return evaluation.statusLabel;
    }

    const labels: Record<EvaluationStatus, string> = {
      PENDIENTE: 'Pendiente',
      EN_PROGRESO: 'En progreso',
      COMPLETADA: 'Completada',
    };
    return labels[evaluation.status];
  }

  getStatusIcon(status: EvaluationStatus): string {
    const icons: Record<EvaluationStatus, string> = {
      PENDIENTE: 'schedule',
      EN_PROGRESO: 'edit_note',
      COMPLETADA: 'task_alt',
    };
    return icons[status];
  }

  getActionLabel(status: EvaluationStatus): string {
    return status === 'EN_PROGRESO' ? 'Continuar evaluación' : 'Responder evaluación';
  }

  getEvaluationDateLabel(evaluation: AssignedEvaluation): string {
    return evaluation.status === 'COMPLETADA'
      ? 'Evaluación completada'
      : evaluation.dueDate;
  }

  refreshEvaluations(): void {
    this.loadEvaluationCenter(true);
  }

  retryLoad(): void {
    this.loadEvaluationCenter();
  }

  openEvaluation(evaluation: AssignedEvaluation): void {
    if (evaluation.status === 'COMPLETADA' || !evaluation.canRespond || !this.context) {
      return;
    }

    const queryParams = new URLSearchParams({
      key: evaluation.accessKey,
      id_emp: String(this.context.empleadoId),
    });

    if (evaluation.accessToken) {
      queryParams.set('token', evaluation.accessToken);
    }

    const surveyUrl =
      `https://justlink360.net/#/completeclima/completedesempenoalone?${queryParams.toString()}`;

    window.open(surveyUrl, '_blank', 'noopener,noreferrer');
  }

  trackByEvaluationId(_: number, evaluation: AssignedEvaluation): number {
    return evaluation.id;
  }

  private loadEvaluationCenter(refresh = false): void {
    if (!this.accessCode) {
      this.isLoading = false;
      return;
    }

    if (refresh) {
      if (this.isRefreshing) {
        return;
      }
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }

    this.loadError = '';
    this.dataRequest?.unsubscribe();

    const request = this.organizationService
      .getDesempenoEvaluationCenter(this.accessCode)
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response;

          if (response?.ok === false || !data?.empleado || !data?.modelo) {
            this.handleLoadError(
              response?.message || 'La respuesta del servidor no contiene datos válidos.',
              refresh,
            );
            return;
          }

          this.applyResponse(data);
        },
        error: (error: any) => {
          this.handleLoadError(
            error?.error?.message ||
              error?.message ||
              'No fue posible consultar las evaluaciones asignadas.',
            refresh,
          );
        },
      });

    request.add(() => {
      this.isLoading = false;
      this.isRefreshing = false;
    });
    this.dataRequest = request;
  }

  private applyResponse(data: any): void {
    const employee = data.empleado ?? {};
    const model = data.modelo ?? {};
    const fullName = String(
      employee.nombreCompleto ||
      [employee.nombres, employee.apellidos].filter(Boolean).join(' ') ||
      'Empleado',
    ).trim();

    this.employee = {
      id: this.toPositiveInteger(employee.id),
      fullName,
      initials: this.getInitials(fullName),
      position: String(employee.cargo || 'Cargo no especificado'),
      organizationId: this.toPositiveInteger(employee.organizacionId),
      organization: String(employee.organizacion || 'Organización no especificada'),
      email: String(employee.email || 'Correo no especificado'),
    };

    this.model = {
      id: this.toPositiveInteger(model.id),
      code: String(model.codigo || ''),
      name: String(model.nombre || 'Modelo de evaluación'),
      version: this.toNonNegativeInteger(model.version),
    };

    this.evaluations = (Array.isArray(data.evaluaciones) ? data.evaluaciones : [])
      .map((item: any) => this.mapEvaluation(item))
      .filter((item: AssignedEvaluation | null): item is AssignedEvaluation => item !== null);

    const calculatedPending = this.evaluations.filter((item) => item.status === 'PENDIENTE').length;
    const calculatedInProgress = this.evaluations.filter((item) => item.status === 'EN_PROGRESO').length;
    const calculatedCompleted = this.evaluations.filter((item) => item.status === 'COMPLETADA').length;
    const summary = data.resumen ?? {};
    const total = this.toNonNegativeInteger(summary.total, this.evaluations.length);

    this.summary = {
      total,
      pending: this.toNonNegativeInteger(summary.pendientes, calculatedPending),
      inProgress: this.toNonNegativeInteger(summary.enProgreso, calculatedInProgress),
      completed: this.toNonNegativeInteger(summary.completadas, calculatedCompleted),
      completionPercentage: this.clampPercentage(
        summary.porcentajeCompletado,
        total ? Math.round((calculatedCompleted / total) * 100) : 0,
      ),
    };
    this.loadError = '';
  }

  private mapEvaluation(value: any): AssignedEvaluation | null {
    const assignmentId = this.toPositiveInteger(value?.asignacionId);
    const evaluatedEmployeeId = this.toPositiveInteger(value?.evaluado?.id);

    if (!assignmentId || !evaluatedEmployeeId) {
      return null;
    }

    const status = this.normalizeStatus(value?.estadoCodigo);

    return {
      id: assignmentId,
      evaluationId: this.toPositiveInteger(value?.evaluacionId),
      modelId: this.toPositiveInteger(value?.modeloId, this.model?.id ?? 0),
      name: String(value?.evaluacion || this.model?.name || 'Evaluación de desempeño'),
      scenarioCode: String(value?.escenarioCodigo || ''),
      scenario: String(value?.escenario || 'Escenario de evaluación'),
      evaluatedEmployeeId,
      evaluatedEmployee: String(value?.evaluado?.nombreCompleto || 'Empleado'),
      evaluatedPosition: String(value?.evaluado?.cargo || 'Cargo no especificado'),
      dueDate: this.formatDate(value?.fechaLimite),
      status,
      statusLabel: String(value?.estadoNombre || ''),
      progress: this.clampPercentage(value?.porcentajeAvance),
      dimensions: this.toNonNegativeInteger(value?.totalDimensiones),
      items: this.toNonNegativeInteger(value?.totalItems),
      answeredItems: this.toNonNegativeInteger(value?.totalItemsRespondidos),
      estimatedMinutes: this.toNonNegativeInteger(value?.duracionEstimadaMinutos),
      accessToken: String(value?.tokenAcceso || ''),
      accessKey: this.createSurveyAccessKey(evaluatedEmployeeId, assignmentId),
      canRespond: Boolean(value?.puedeResponder) && status !== 'COMPLETADA',
    };
  }

  private handleLoadError(message: string, retainCurrentData: boolean): void {
    this.loadError = message;

    if (!retainCurrentData) {
      this.employee = null;
      this.model = null;
      this.evaluations = [];
      this.summary = this.emptySummary();
    }
  }

  private decodeContext(encodedContext: string | null): PortalAccessContext | null {
    if (!encodedContext) {
      return null;
    }

    try {
      const decodedValue = decodeURIComponent(encodedContext);
      const normalizedValue = decodedValue.replace(/-/g, '+').replace(/_/g, '/');
      const paddedValue = normalizedValue.padEnd(
        normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
        '=',
      );
      const decodedText = atob(paddedValue);
      const [employeeValue, modelValue, ...extraValues] = decodedText.split('|');
      const employeeId = Number(employeeValue);
      const modelId = Number(modelValue);

      return extraValues.length === 0 &&
        Number.isInteger(employeeId) && employeeId > 0 &&
        Number.isInteger(modelId) && modelId > 0
        ? { empleadoId: employeeId, modeloId: modelId }
        : null;
    } catch {
      return null;
    }
  }

  private encodeContext(context: PortalAccessContext): string {
    return btoa(`${context.empleadoId}|${context.modeloId}`);
  }

  private createSurveyAccessKey(evaluatedEmployeeId: number, referenceId: number): string {
    return btoa(`${evaluatedEmployeeId}|${referenceId}`)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private normalizeStatus(value: any): EvaluationStatus {
    const status = String(value || '').trim().toUpperCase();

    if (status.includes('PROGRESO') || status.includes('PROGRESS')) {
      return 'EN_PROGRESO';
    }
    if (
      status.includes('COMPLET') ||
      status.includes('FINALIZ') ||
      status.includes('RESPOND')
    ) {
      return 'COMPLETADA';
    }
    return 'PENDIENTE';
  }

  private formatDate(value: any): string {
    if (!value) {
      return 'Sin fecha límite';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return `Cierra el ${new Intl.DateTimeFormat('es-GT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)}`;
  }

  private getInitials(fullName: string): string {
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    return nameParts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'EM';
  }

  private toPositiveInteger(value: any, fallback = 0): number {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
  }

  private toNonNegativeInteger(value: any, fallback = 0): number {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : fallback;
  }

  private clampPercentage(value: any, fallback = 0): number {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue)
      ? Math.min(100, Math.max(0, Math.round(parsedValue)))
      : fallback;
  }

  private emptySummary(): EvaluationSummary {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      completionPercentage: 0,
    };
  }

  private forceLightTheme(): void {
    this.originalBodyClassName = this.document.body.className;
    this.managedThemeClasses.forEach((className) => {
      this.renderer.removeClass(this.document.body, className);
    });
    this.renderer.addClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'theme-white');
    this.renderer.addClass(this.document.body, 'portal-desempeno-light');
  }
}
