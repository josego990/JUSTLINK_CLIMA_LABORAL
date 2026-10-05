import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrganizacionService } from '../organization/services/organizacion.service';
import { TurnstileComponent } from '../shared/components/turnstile/turnstile.component';

interface ActionPlanAccessContext {
  empleadoId: number;
  climaId: number;
  planId: number;
}

interface PortalResponsible {
  id: number;
  fullName: string;
  initials: string;
  position: string;
  organization: string;
  email: string;
}

interface PortalClimate {
  id: number;
  name: string;
}

interface PortalPlan {
  id: number;
  survey: string;
  factor: string;
  area: string;
  scope: string;
  criticalQuestion: string;
  reason: string;
  action: string;
  resources: string;
  kpi: string;
  sponsor: string;
  term: string;
  dueDate: string;
  frequency: string;
  validation: string;
  priority: string;
  statusCode: string;
  statusName: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  canEdit: boolean;
}

interface PlanResponsible {
  id: number;
  fullName: string;
  position: string;
}

interface PlanTask {
  id: number;
  title: string;
  owner: string;
  deliverable: string;
  dueDate: string;
  evidence: string;
  completed: boolean;
  order: number;
  canEdit: boolean;
}

interface PlanFollowUp {
  id: number;
  date: string;
  comment: string;
  progress: number;
  createdAt: string;
}

@Component({
  selector: 'app-portal-clima-planes-accion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TurnstileComponent,
  ],
  templateUrl: './portal-clima-planes-accion.component.html',
  styleUrls: ['./portal-clima-planes-accion.component.scss'],
})
export class PortalClimaPlanesAccionComponent implements OnInit, OnDestroy {
  @ViewChild(TurnstileComponent)
  turnstileComponent?: TurnstileComponent;

  readonly context: ActionPlanAccessContext | null;
  readonly accessCode: string | null;
  responsible: PortalResponsible | null = null;
  climate: PortalClimate | null = null;
  plan: PortalPlan | null = null;
  planResponsibles: PlanResponsible[] = [];
  tasks: PlanTask[] = [];
  followUps: PlanFollowUp[] = [];
  followUpComment = '';
  isLoading = true;
  isRefreshing = false;
  isSaving = false;
  loadError = '';
  saveError = '';
  saveMessage = '';
  turnstileToken = '';

  private dataRequest?: Subscription;
  private saveRequest?: Subscription;
  private feedbackTimer?: ReturnType<typeof setTimeout>;
  private readonly changedTaskIds = new Set<number>();
  private originalBodyClassName = '';
  private readonly managedThemeClasses = ['dark', 'dark-theme', 'theme-black', 'theme-purple', 'theme-blue', 'theme-cyan', 'theme-green', 'theme-orange', 'theme-red', 'menu_dark', 'menu_light', 'logo-black', 'logo-white'];

  constructor(
    route: ActivatedRoute,
    private organizationService: OrganizacionService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) {
    const encodedContext =
      route.snapshot.paramMap.get('contexto') ??
      route.snapshot.queryParamMap.get('codigoPlanResponsable') ??
      route.snapshot.queryParamMap.get('contexto') ??
      route.snapshot.queryParamMap.get('ref');
    this.context = this.decodeContext(encodedContext);
    this.accessCode = this.context
      ? btoa(`${this.context.empleadoId}|${this.context.climaId}|${this.context.planId}`)
      : null;

    if (!encodedContext) {
      this.loadError = 'El enlace no contiene los datos necesarios para consultar el plan de acción.';
    } else if (!this.context) {
      this.loadError = 'El enlace no tiene un formato válido.';
    }
  }

  ngOnInit(): void {
    this.forceLightTheme();
    this.loadPlan();
  }

  ngOnDestroy(): void {
    this.dataRequest?.unsubscribe();
    this.saveRequest?.unsubscribe();
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.document.body.className = this.originalBodyClassName;
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get progressFromTasks(): number {
    return this.tasks.length
      ? Math.round((this.completedTasks / this.tasks.length) * 100)
      : this.plan?.progress ?? 0;
  }

  get canEdit(): boolean {
    return Boolean(this.plan?.canEdit);
  }

  get hasPendingChanges(): boolean {
    return this.changedTaskIds.size > 0 || Boolean(this.followUpComment.trim());
  }

  get planContextLabel(): string {
    return this.plan?.scope || this.plan?.area || 'Alcance general';
  }

  refreshPlan(): void {
    this.loadPlan(true);
  }

  retryLoad(): void {
    this.loadPlan();
  }

  markTaskChanged(task: PlanTask): void {
    if (!this.canEdit || !task.canEdit) {
      return;
    }

    this.changedTaskIds.add(task.id);
    this.clearSaveFeedback();
  }

  clearSaveFeedback(): void {
    this.saveMessage = '';
    this.saveError = '';
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = undefined;
    }
  }

  saveProgress(): void {
    if (!this.accessCode || !this.canEdit || this.isSaving || !this.hasPendingChanges) {
      return;
    }

    if (!this.turnstileToken) {
      this.saveError = 'Completa la verificación de seguridad antes de guardar el progreso.';
      return;
    }

    const comment = this.followUpComment.trim();
    const payload: {
      codigoPlanResponsable: string;
      tareas: Array<{ id: number; completada: boolean; evidencia: string }>;
      comentario?: string;
    } = {
      codigoPlanResponsable: this.accessCode,
      tareas: this.tasks
        .filter((task) => this.changedTaskIds.has(task.id))
        .map((task) => ({
          id: task.id,
          completada: task.completed,
          evidencia: task.evidence.trim(),
        })),
    };

    if (comment) {
      payload.comentario = comment;
    }

    this.isSaving = true;
    this.clearSaveFeedback();
    this.saveRequest?.unsubscribe();
    const request = this.organizationService
      .saveClimaActionPlanPortalProgress(payload, this.turnstileToken)
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response;
          if (response?.ok === false || !data?.plan || !data?.responsable) {
            this.saveError = response?.message || 'El servidor no devolvió el plan actualizado.';
            return;
          }

          this.applyResponse(data);
          this.followUpComment = '';
          this.changedTaskIds.clear();
          this.saveMessage = response?.message || 'El progreso fue actualizado correctamente.';
          this.scheduleFeedbackClear();
        },
        error: (error: any) => {
          this.saveError = this.getErrorMessage(
            error,
            'No fue posible guardar el progreso. Intenta nuevamente.',
          );
        },
      });

    request.add(() => {
      this.isSaving = false;
      this.resetTurnstile();
    });
    this.saveRequest = request;
  }

  trackByTaskId(_: number, task: PlanTask): number {
    return task.id;
  }

  trackByFollowUpId(_: number, followUp: PlanFollowUp): number {
    return followUp.id;
  }

  onTurnstileTokenChange(token: string): void {
    this.turnstileToken = token;
    if (token && this.saveError === 'Completa la verificación de seguridad antes de guardar el progreso.') {
      this.saveError = '';
    }
  }

  private loadPlan(refresh = false): void {
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
    this.clearSaveFeedback();
    this.dataRequest?.unsubscribe();
    const request = this.organizationService
      .getClimaActionPlanPortal(this.accessCode)
      .subscribe({
        next: (response: any) => {
          const data = response?.data ?? response;
          if (response?.ok === false || !data?.plan || !data?.responsable) {
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
            this.getErrorMessage(error, 'No fue posible consultar el plan de acción.'),
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
    const responsible = data.responsable ?? {};
    const climate = data.clima ?? {};
    const plan = data.plan ?? {};
    const fullName = String(responsible.nombreCompleto || 'Responsable del plan').trim();

    this.responsible = {
      id: this.toPositiveInteger(responsible.id),
      fullName,
      initials: String(responsible.iniciales || this.getInitials(fullName)).trim().slice(0, 3).toUpperCase(),
      position: String(responsible.cargo || 'Cargo no especificado'),
      organization: String(responsible.organizacion || 'Organización no especificada'),
      email: String(responsible.email || 'Correo no especificado'),
    };

    this.climate = {
      id: this.toPositiveInteger(climate.id, this.context?.climaId ?? 0),
      name: String(climate.nombre || 'Clima organizacional'),
    };

    this.plan = {
      id: this.toPositiveInteger(plan.id, this.context?.planId ?? 0),
      survey: String(plan.encuesta || climate.nombre || 'Clima organizacional'),
      factor: String(plan.factor || plan.area || 'Plan de acción'),
      area: String(plan.area || ''),
      scope: String(plan.alcance || ''),
      criticalQuestion: String(plan.preguntaCritica || ''),
      reason: String(plan.motivo || ''),
      action: String(plan.accion || 'Acción pendiente de definir.'),
      resources: String(plan.recursos || 'Recursos pendientes de definir.'),
      kpi: String(plan.kpi || 'Indicador pendiente de definir.'),
      sponsor: String(plan.patrocinador || 'No especificado'),
      term: String(plan.plazo || 'No especificado'),
      dueDate: this.formatDate(plan.fechaLimite),
      frequency: String(plan.frecuenciaSeguimiento || 'No especificada'),
      validation: String(plan.validacion || 'Validación pendiente de definir.'),
      priority: this.titleCase(plan.prioridad || 'MEDIA'),
      statusCode: String(plan.estadoCodigo || 'SIN_INICIAR').toUpperCase(),
      statusName: String(plan.estadoNombre || 'Sin iniciar'),
      progress: this.clampPercentage(plan.progresoPct),
      totalTasks: this.toNonNegativeInteger(plan.totalTareas),
      completedTasks: this.toNonNegativeInteger(plan.tareasCompletadas),
      canEdit: this.toBoolean(plan.puedeEditar, true),
    };

    this.planResponsibles = (Array.isArray(data.responsables) ? data.responsables : [])
      .map((item: any) => ({
        id: this.toPositiveInteger(item?.idEmpleado),
        fullName: String(item?.nombreCompleto || 'Responsable'),
        position: String(item?.cargo || 'Cargo no especificado'),
      }))
      .filter((item: PlanResponsible) => item.id > 0);

    this.tasks = (Array.isArray(data.tareas) ? data.tareas : [])
      .map((item: any, index: number) => this.mapTask(item, index))
      .filter((item: PlanTask | null): item is PlanTask => item !== null)
      .sort((left: PlanTask, right: PlanTask) => left.order - right.order || left.id - right.id);

    this.followUps = (Array.isArray(data.seguimientos) ? data.seguimientos : [])
      .map((item: any) => this.mapFollowUp(item))
      .filter((item: PlanFollowUp | null): item is PlanFollowUp => item !== null)
      .sort((left: PlanFollowUp, right: PlanFollowUp) => right.createdAt.localeCompare(left.createdAt));

    this.changedTaskIds.clear();
    this.loadError = '';
  }

  private mapTask(value: any, index: number): PlanTask | null {
    const id = this.toPositiveInteger(value?.id);
    if (!id) {
      return null;
    }

    return {
      id,
      title: String(value?.titulo || `Actividad ${index + 1}`),
      owner: String(value?.responsable || 'Responsable del plan'),
      deliverable: String(value?.entregable || ''),
      dueDate: this.formatDate(value?.fechaLimite),
      evidence: String(value?.evidencia || ''),
      completed: this.toBoolean(value?.completada),
      order: this.toNonNegativeInteger(value?.orden, index + 1),
      canEdit: this.toBoolean(value?.puedeEditar, true),
    };
  }

  private mapFollowUp(value: any): PlanFollowUp | null {
    const id = this.toPositiveInteger(value?.id);
    if (!id) {
      return null;
    }

    return {
      id,
      date: this.formatDate(value?.fecha, 'Fecha no especificada'),
      comment: String(value?.comentario || ''),
      progress: this.clampPercentage(value?.avancePct),
      createdAt: String(value?.creadoEn || value?.fecha || ''),
    };
  }

  private handleLoadError(message: string, retainCurrentData: boolean): void {
    this.loadError = message;
    if (!retainCurrentData) {
      this.responsible = null;
      this.climate = null;
      this.plan = null;
      this.planResponsibles = [];
      this.tasks = [];
      this.followUps = [];
    }
  }

  private scheduleFeedbackClear(): void {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedbackTimer = setTimeout(() => {
      this.saveMessage = '';
      this.feedbackTimer = undefined;
    }, 7000);
  }

  private resetTurnstile(): void {
    this.turnstileToken = '';
    this.turnstileComponent?.reset();
  }

  private getErrorMessage(error: any, fallback: string): string {
    return String(
      error?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      fallback,
    );
  }

  private decodeContext(encodedContext: string | null): ActionPlanAccessContext | null {
    if (!encodedContext) return null;

    try {
      const normalized = decodeURIComponent(encodedContext)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      const [employeeValue, climaValue, planValue, ...extraValues] = atob(padded).split('|');
      const empleadoId = Number(employeeValue);
      const climaId = Number(climaValue);
      const planId = Number(planValue);

      return extraValues.length === 0 && [empleadoId, climaId, planId].every((value) => Number.isInteger(value) && value > 0)
        ? { empleadoId, climaId, planId }
        : null;
    } catch {
      return null;
    }
  }

  private formatDate(value: any, fallback = 'Sin fecha límite'): string {
    if (!value) {
      return fallback;
    }

    const rawValue = String(value).trim();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
      ? new Date(`${rawValue}T12:00:00`)
      : new Date(rawValue);
    if (Number.isNaN(date.getTime())) {
      return rawValue;
    }

    return new Intl.DateTimeFormat('es-GT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  private getInitials(fullName: string): string {
    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'RP';
  }

  private titleCase(value: any): string {
    const text = String(value || '').trim().toLowerCase();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  private toPositiveInteger(value: any, fallback = 0): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private toNonNegativeInteger(value: any, fallback = 0): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
  }

  private clampPercentage(value: any, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed)
      ? Math.min(100, Math.max(0, Math.round(parsed)))
      : fallback;
  }

  private toBoolean(value: any, fallback = false): boolean {
    if (value === true || value === 1 || value === '1') {
      return true;
    }
    if (value === false || value === 0 || value === '0') {
      return false;
    }
    const normalized = String(value ?? '').trim().toLowerCase();
    if (['true', 'si', 'sí', 'yes'].includes(normalized)) {
      return true;
    }
    if (['false', 'no'].includes(normalized)) {
      return false;
    }
    return fallback;
  }

  private forceLightTheme(): void {
    this.originalBodyClassName = this.document.body.className;
    this.managedThemeClasses.forEach((className) => this.renderer.removeClass(this.document.body, className));
    this.renderer.addClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'theme-white');
    this.renderer.addClass(this.document.body, 'portal-clima-action-plan-light');
  }
}
