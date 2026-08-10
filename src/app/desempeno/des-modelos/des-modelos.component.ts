import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface ModelOrganization {
  id: number;
  name: string;
}

interface ModelEmployee {
  id: number;
  name: string;
  email: string | null;
  position: string;
  demographicValues: Record<string, string>;
}

interface ModelScale {
  id: number;
  name: string;
  type: string;
  totalLevels: number | null;
}

interface ModelScaleValue {
  id: number;
  value: number;
  description: string;
  order: number;
  weight: number;
}

interface BigFactor {
  id: number;
  name: string;
  enabled: boolean;
  weight: number;
}

interface Perspective {
  id: number;
  name: string;
  selected: boolean;
}

interface ScenarioPerspective {
  perspectiveId: number;
  selected: boolean;
  weight: number;
}

interface EvaluationScenario {
  id: number;
  name: string;
  perspectives: ScenarioPerspective[];
}

interface ExigencyLevel {
  id: number;
  name: string;
  from: number;
  to: number;
}

interface BehaviorItem {
  id: number;
  text: string;
  selected: boolean;
}

interface PositionFactor {
  id: number;
  name: string;
  weight: number;
  behaviors: BehaviorItem[];
}

interface PositionGreatFactor {
  bigFactorId: number;
  enabled: boolean;
  weight: number;
  factors: PositionFactor[];
}

interface PositionModel {
  position: string;
  greatFactors: PositionGreatFactor[];
}

interface EvaluatorEntry {
  id: number;
  evaluatorId: number | null;
  perspectiveId: number | null;
  weight: number;
}

interface EvaluatorAssignment {
  id: number;
  evaluatedId: number;
  entries: EvaluatorEntry[];
  draftEvaluatorId: number | null;
  draftPerspectiveId: number | null;
  draftWeight: number;
}

interface DemographicFilter {
  key: string;
  values: string[];
}

@Component({
  selector: 'app-des-modelos',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './des-modelos.component.html',
  styles: [`
    .model-shell {
      color: #6b7280;
    }

    .model-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e5e7eb;
      background: #fff;
    }

    .model-stepper {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .model-step {
      border: 1px solid #dbe2f0;
      background: #fff;
      color: #4f74df;
      border-radius: 12px;
      padding: 0.7rem 1rem;
      white-space: nowrap;
      font-weight: 600;
      transition: all 0.18s ease;
    }

    .model-step.active {
      background: #eef4ff;
      border-color: #4f74df;
      color: #2f56c8;
      box-shadow: 0 8px 18px rgba(79, 116, 223, 0.12);
    }

    .model-summary-card {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 1rem;
      background: #fff;
      height: 100%;
    }

    .model-panel {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .model-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .model-panel-body {
      padding: 1.25rem;
    }

    .model-row {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) 150px 48px;
      gap: 0.75rem;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #eef2f7;
    }

    .model-row:last-child {
      border-bottom: 0;
    }

    .model-total {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border-radius: 999px;
      padding: 0.35rem 0.75rem;
      font-weight: 700;
      background: #eef2ff;
      color: #3f5fcf;
    }

    .model-total.ok {
      background: #dcfce7;
      color: #15803d;
    }

    .model-total.warn {
      background: #fff7ed;
      color: #c2410c;
    }

    .model-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      border-radius: 999px;
      padding: 0.35rem 0.65rem;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .model-card-soft {
      border: 1px solid #dbeafe;
      background: #f8fbff;
      border-radius: 14px;
      padding: 1rem;
    }

    .model-assignment-card {
      border: 1px solid #c7edf4;
      background: #eafcff;
      border-radius: 14px;
      padding: 1rem;
      height: 100%;
    }

    .model-muted {
      color: #8b93a3;
      font-size: 0.9rem;
    }

    .model-empty {
      padding: 1.5rem;
      text-align: center;
      color: #8b93a3;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px dashed #dbe2f0;
    }

    .model-factor-box {
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .model-behavior {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-top: 1px solid #eef2f7;
    }

    @media (max-width: 768px) {
      .model-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class DesModelosComponent implements OnDestroy, OnInit {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.BIBLIOTECA.LIST.MODELOS';
  readonly steps = [
    { id: 1, label: 'Paso 1. Grandes factores' },
    { id: 2, label: 'Paso 2. Perspectivas' },
    { id: 3, label: 'Paso 3. Escalas' },
    { id: 4, label: 'Paso 4. Nivel de exigencia' },
    { id: 5, label: 'Paso 5. Puestos' },
    { id: 6, label: 'Paso 6. Evaluadores' },
  ];

  modelName = 'EJEMPLO EVALUACION DESEMPENO 2026';
  modelDate = new Date().toISOString().slice(0, 10);
  activeStep = 1;
  selectedOrganizationId: number | null = null;
  selectedScaleId: number | null = null;
  selectedPosition = '';
  selectedAssignmentPosition = '';
  selectedAssignmentDemographicKey = '';
  selectedAssignmentDemographicValue = '';
  selectedEvaluatedId: number | null = null;
  isLoadingOrganizations = false;
  isLoadingResources = false;

  organizations: ModelOrganization[] = [];
  employees: ModelEmployee[] = [];
  scales: ModelScale[] = [];
  scaleValues: ModelScaleValue[] = [];
  positions: string[] = [];
  demographicFilters: DemographicFilter[] = [];

  bigFactors: BigFactor[] = [
    { id: 1, name: 'Objetivos', enabled: true, weight: 40 },
    { id: 2, name: 'Competencias', enabled: true, weight: 40 },
    { id: 3, name: 'Valores', enabled: true, weight: 20 },
  ];

  perspectives: Perspective[] = [
    { id: 1, name: 'Jefe a colaborador', selected: true },
    { id: 2, name: 'Autoevaluacion', selected: true },
    { id: 3, name: 'Colaborador a jefe', selected: false },
    { id: 4, name: 'Par', selected: true },
  ];

  scenarios: EvaluationScenario[] = [
    {
      id: 1,
      name: 'Escenario 1',
      perspectives: [
        { perspectiveId: 1, selected: true, weight: 90 },
        { perspectiveId: 2, selected: true, weight: 10 },
        { perspectiveId: 4, selected: false, weight: 0 },
      ],
    },
    {
      id: 2,
      name: 'Escenario 2',
      perspectives: [
        { perspectiveId: 1, selected: true, weight: 50 },
        { perspectiveId: 2, selected: true, weight: 10 },
        { perspectiveId: 4, selected: true, weight: 40 },
      ],
    },
  ];

  exigencyLevels: ExigencyLevel[] = [
    { id: 1, name: 'Nivel 1', from: 0, to: 20.99 },
    { id: 2, name: 'Nivel 2', from: 21, to: 40.99 },
    { id: 3, name: 'Nivel 3', from: 41, to: 60.99 },
    { id: 4, name: 'Nivel 4', from: 61, to: 80.99 },
    { id: 5, name: 'Nivel 5', from: 81, to: 100 },
  ];

  positionModels: PositionModel[] = [];
  evaluatorAssignments: EvaluatorAssignment[] = [];

  private nextBigFactorId = 4;
  private nextScenarioId = 3;
  private nextLevelId = 6;
  private nextFactorId = 100;
  private nextBehaviorId = 1000;
  private nextAssignmentId = 1;
  private nextEvaluatorEntryId = 1;
  private selectedOrganizationSubscription?: Subscription;

  constructor(private organizacionService: OrganizacionService) {}

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

      this.organizations = [{ id: organization.Id, name: organization.Nombre }];

      if (this.selectedOrganizationId === organization.Id) {
        return;
      }

      void this.onOrganizationChange(organization.Id);
    });
  }

  get selectedOrganizationName(): string {
    return this.organizations.find((item) => item.id === this.selectedOrganizationId)?.name ?? '-';
  }

  get selectedScaleName(): string {
    return this.scales.find((item) => item.id === this.selectedScaleId)?.name ?? 'Escala demo';
  }

  get activeBigFactors(): BigFactor[] {
    return this.bigFactors.filter((item) => item.enabled);
  }

  get filteredEmployeesForAssignments(): ModelEmployee[] {
    return this.employees.filter((employee) => {
      const matchesPosition = !this.selectedAssignmentPosition || employee.position === this.selectedAssignmentPosition;
      const matchesDemographic =
        !this.selectedAssignmentDemographicKey ||
        !this.selectedAssignmentDemographicValue ||
        employee.demographicValues[this.selectedAssignmentDemographicKey] === this.selectedAssignmentDemographicValue;

      return matchesPosition && matchesDemographic;
    });
  }

  get selectedDemographicValues(): string[] {
    return this.demographicFilters.find((item) => item.key === this.selectedAssignmentDemographicKey)?.values ?? [];
  }

  get totalBigFactors(): number {
    return this.sum(this.bigFactors.filter((item) => item.enabled).map((item) => item.weight));
  }

  get totalScaleWeights(): number {
    return this.sum(this.scaleValues.map((item) => item.weight));
  }

  get exigencyCoverage(): number {
    if (this.exigencyLevels.length === 0) {
      return 0;
    }

    return Math.max(...this.exigencyLevels.map((item) => Number(item.to) || 0));
  }

  async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.organizations = this.extractCollection(response)
        .map((item) => ({
          id: Number(item?.Id ?? item?.id ?? item?.IdOrganizacion ?? item?.idOrganizacion ?? 0),
          name: String(item?.Nombre ?? item?.nombre ?? '').trim(),
        }))
        .filter((item) => item.id > 0 && item.name.length > 0);

      if (this.organizations.length > 0) {
        await this.onOrganizationChange(this.organizations[0].id);
      }
    } catch (error) {
      console.error('Error al cargar organizaciones para modelos:', error);
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  async onOrganizationChange(id: number | null): Promise<void> {
    this.selectedOrganizationId = this.toPositiveInteger(id);
    this.employees = [];
    this.positions = [];
    this.demographicFilters = [];
    this.scales = [];
    this.scaleValues = [];
    this.positionModels = [];
    this.evaluatorAssignments = [];
    this.selectedPosition = '';
    this.selectedAssignmentPosition = '';
    this.selectedAssignmentDemographicKey = '';
    this.selectedAssignmentDemographicValue = '';
    this.selectedEvaluatedId = null;

    if (!this.selectedOrganizationId) {
      return;
    }

    this.isLoadingResources = true;

    try {
      await Promise.all([
        this.loadEmployees(),
        this.loadScales(),
        this.loadDemographicFields(),
      ]);
      this.syncPositionModels();
      this.seedEvaluatorAssignments();
    } catch (error) {
      console.error('Error al cargar recursos del modelo:', error);
      Swal.fire('Error', this.getErrorMessage(error), 'error');
    } finally {
      this.isLoadingResources = false;
    }
  }

  async loadEmployees(): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    const response = await this.organizacionService.getDesempenoEmployees({
      idOrganizacion: this.selectedOrganizationId,
      activo: true,
    });

    this.employees = this.extractCollection(response)
      .map((item) => this.normalizeEmployee(item))
      .filter((item) => item.id > 0 && item.name.length > 0);

    this.positions = Array.from(
      new Set(
        this.employees
          .map((item) => item.position)
          .filter((position) => position.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b));

    if (this.positions.length === 0) {
      this.positions = ['Desarrollador', 'Analista de Red', 'Jefe de Departamento'];
    }

    this.selectedPosition = this.positions[0] ?? '';
    this.selectedAssignmentPosition = '';
    this.demographicFilters = this.buildDemographicFilters(this.employees);
    this.selectedAssignmentDemographicKey = this.demographicFilters[0]?.key ?? '';
    this.selectedAssignmentDemographicValue = '';
  }

  async loadScales(): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    const response = await this.organizacionService.getDesempenoScales({
      idOrganizacion: this.selectedOrganizationId,
      activo: true,
    });

    this.scales = this.extractCollection(response)
      .map((item) => this.normalizeScale(item))
      .filter((item) => item.id > 0);

    if (this.scales.length > 0) {
      await this.onScaleChange(this.scales[0].id);
      return;
    }

    this.selectedScaleId = null;
    this.scaleValues = this.createFallbackScaleValues();
  }

  async loadDemographicFields(): Promise<void> {
    if (!this.selectedOrganizationId) {
      return;
    }

    await this.organizacionService.getDesempenoCamposDemograficos({
      idOrganizacion: this.selectedOrganizationId,
    });
  }

  async onScaleChange(id: number | null): Promise<void> {
    this.selectedScaleId = this.toPositiveInteger(id);

    if (!this.selectedScaleId) {
      this.scaleValues = this.createFallbackScaleValues();
      return;
    }

    try {
      const response = await this.organizacionService.getDesempenoScaleById(this.selectedScaleId);
      const payload = this.extractObject(response);
      const detail = Array.isArray(payload?.detalle)
        ? payload.detalle
        : Array.isArray(payload?.Detalle)
          ? payload.Detalle
          : [];

      this.scaleValues = detail
        .map((item: any, index: number) => ({
          id: Number(item?.IdEscalaDetalle ?? item?.idEscalaDetalle ?? index + 1),
          value: Number(item?.Valor ?? item?.valor ?? index + 1),
          description: String(item?.Descripcion ?? item?.descripcion ?? '').trim(),
          order: Number(item?.Orden ?? item?.orden ?? index + 1),
          weight: this.getDefaultScaleWeight(index, detail.length),
        }))
        .sort((first: ModelScaleValue, second: ModelScaleValue) => first.order - second.order);

      if (this.scaleValues.length === 0) {
        this.scaleValues = this.createFallbackScaleValues();
      }
    } catch (error) {
      console.warn('No se pudo cargar el detalle de escala, se usara demo local.', error);
      this.scaleValues = this.createFallbackScaleValues();
    }
  }

  setStep(step: number): void {
    this.activeStep = step;
  }

  nextStep(): void {
    this.activeStep = Math.min(this.steps.length, this.activeStep + 1);
  }

  previousStep(): void {
    this.activeStep = Math.max(1, this.activeStep - 1);
  }

  addBigFactor(): void {
    this.bigFactors.push({
      id: this.nextBigFactorId++,
      name: 'Nuevo gran factor',
      enabled: true,
      weight: 0,
    });
    this.syncPositionModels();
  }

  removeBigFactor(factor: BigFactor): void {
    this.bigFactors = this.bigFactors.filter((item) => item.id !== factor.id);
    this.syncPositionModels();
  }

  onBigFactorChanged(): void {
    this.syncPositionModels();
  }

  addScenario(): void {
    this.scenarios.push({
      id: this.nextScenarioId++,
      name: `Escenario ${this.nextScenarioId - 1}`,
      perspectives: this.perspectives.map((item) => ({
        perspectiveId: item.id,
        selected: item.selected,
        weight: item.selected ? 0 : 0,
      })),
    });
  }

  removeScenario(id: number): void {
    this.scenarios = this.scenarios.filter((item) => item.id !== id);
  }

  addLevel(): void {
    const previous = this.exigencyLevels[this.exigencyLevels.length - 1];
    const nextFrom = previous ? Math.min(100, Number(previous.to) + 0.01) : 0;
    this.exigencyLevels.push({
      id: this.nextLevelId++,
      name: `Nivel ${this.nextLevelId - 1}`,
      from: Number(nextFrom.toFixed(2)),
      to: 100,
    });
  }

  removeLevel(id: number): void {
    this.exigencyLevels = this.exigencyLevels.filter((item) => item.id !== id);
  }

  getPositionModel(position: string): PositionModel | undefined {
    return this.positionModels.find((item) => item.position === position);
  }

  addPositionFactor(greatFactor: PositionGreatFactor): void {
    greatFactor.factors.push({
      id: this.nextFactorId++,
      name: 'Nuevo factor',
      weight: 0,
      behaviors: [
        {
          id: this.nextBehaviorId++,
          text: 'Describe el comportamiento esperado para este factor.',
          selected: true,
        },
      ],
    });
  }

  removePositionFactor(greatFactor: PositionGreatFactor, factorId: number): void {
    greatFactor.factors = greatFactor.factors.filter((item) => item.id !== factorId);
  }

  addBehavior(factor: PositionFactor): void {
    factor.behaviors.push({
      id: this.nextBehaviorId++,
      text: 'Nuevo comportamiento observable.',
      selected: true,
    });
  }

  removeBehavior(factor: PositionFactor, behaviorId: number): void {
    factor.behaviors = factor.behaviors.filter((item) => item.id !== behaviorId);
  }

  addEvaluatorAssignment(): void {
    if (!this.selectedEvaluatedId) {
      Swal.fire('Evaluado requerido', 'Selecciona un colaborador evaluado antes de agregarlo.', 'warning');
      return;
    }

    if (this.evaluatorAssignments.some((item) => item.evaluatedId === this.selectedEvaluatedId)) {
      Swal.fire('Ya existe', 'Ese colaborador ya esta en la configuracion de evaluadores.', 'info');
      return;
    }

    this.evaluatorAssignments.push(this.createAssignment(this.selectedEvaluatedId));
    this.selectedEvaluatedId = null;
  }

  removeEvaluatorAssignment(id: number): void {
    this.evaluatorAssignments = this.evaluatorAssignments.filter((item) => item.id !== id);
  }

  addEvaluatorEntry(assignment: EvaluatorAssignment): void {
    if (!assignment.draftEvaluatorId || !assignment.draftPerspectiveId) {
      Swal.fire('Datos requeridos', 'Selecciona evaluador y perspectiva antes de agregar.', 'warning');
      return;
    }

    assignment.entries.push({
      id: this.nextEvaluatorEntryId++,
      evaluatorId: assignment.draftEvaluatorId,
      perspectiveId: assignment.draftPerspectiveId,
      weight: assignment.draftWeight,
    });
    assignment.draftEvaluatorId = null;
    assignment.draftPerspectiveId = this.selectedPerspectives[0]?.id ?? null;
    assignment.draftWeight = 0;
  }

  removeEvaluatorEntry(assignment: EvaluatorAssignment, entryId: number): void {
    assignment.entries = assignment.entries.filter((item) => item.id !== entryId);
  }

  saveLocalModel(): void {
    Swal.fire({
      title: 'Modelo preparado',
      text: 'La configuracion quedo lista en pantalla. Cuando esten los endpoints conectamos el guardado real.',
      icon: 'success',
    });
  }

  get selectedPerspectives(): Perspective[] {
    return this.perspectives.filter((item) => item.selected);
  }

  getPerspectiveName(id: number | null): string {
    return this.perspectives.find((item) => item.id === id)?.name ?? '-';
  }

  getBigFactorName(id: number): string {
    return this.bigFactors.find((item) => item.id === id)?.name ?? 'Gran factor';
  }

  getEmployeeName(id: number | null): string {
    return this.employees.find((item) => item.id === id)?.name ?? '-';
  }

  getEmployeePosition(id: number | null): string {
    return this.employees.find((item) => item.id === id)?.position ?? '-';
  }

  getEvaluatorOptions(evaluatedId: number | null): ModelEmployee[] {
    return this.employees.filter((item) => item.id !== evaluatedId);
  }

  getScenarioTotal(scenario: EvaluationScenario): number {
    return this.sum(
      scenario.perspectives
        .filter((item) => item.selected)
        .map((item) => item.weight)
    );
  }

  getPositionGreatFactorTotal(model: PositionModel): number {
    return this.sum(model.greatFactors.filter((item) => item.enabled).map((item) => item.weight));
  }

  getFactorTotal(greatFactor: PositionGreatFactor): number {
    return this.sum(greatFactor.factors.map((item) => item.weight));
  }

  getAssignmentTotal(assignment: EvaluatorAssignment): number {
    return this.sum(assignment.entries.map((item) => item.weight));
  }

  isTotalOk(total: number): boolean {
    return Math.abs(Number(total) - 100) < 0.01;
  }

  totalClass(total: number): string {
    return this.isTotalOk(total) ? 'ok' : 'warn';
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  trackByPosition(_: number, item: PositionModel): string {
    return item.position;
  }

  private extractCollection(response: any): any[] {
    const payload = response?.data ?? response;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.items)) {
      return payload.items;
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.data?.items)) {
      return payload.data.items;
    }

    if (Array.isArray(payload?.rows)) {
      return payload.rows;
    }

    if (Array.isArray(payload?.result)) {
      return payload.result;
    }

    return [];
  }

  private extractObject(response: any): any {
    const payload = response?.data ?? response;

    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
      return payload.data;
    }

    if (payload?.result && typeof payload.result === 'object' && !Array.isArray(payload.result)) {
      return payload.result;
    }

    return payload;
  }

  private normalizeEmployee(item: any): ModelEmployee {
    const name = `${String(item?.Nombres ?? item?.nombres ?? '').trim()} ${String(item?.Apellidos ?? item?.apellidos ?? '').trim()}`.trim();

    return {
      id: Number(item?.IdEmpleado ?? item?.idEmpleado ?? item?.Id ?? item?.id ?? 0),
      name,
      email: this.toOptionalText(item?.Email ?? item?.email),
      position: this.toOptionalText(item?.Cargo ?? item?.cargo ?? item?.Puesto ?? item?.puesto) ?? 'Sin puesto',
      demographicValues: this.extractEmployeeDemographics(item),
    };
  }

  private extractEmployeeDemographics(item: any): Record<string, string> {
    const values: Record<string, string> = {};
    const candidates = [
      item?.camposDemograficos,
      item?.CamposDemograficos,
      item?.valoresDemograficos,
      item?.ValoresDemograficos,
      item?.demograficos,
      item?.Demograficos,
    ];

    candidates
      .filter((candidate) => Array.isArray(candidate))
      .flat()
      .forEach((entry: any) => {
        const key = String(
          entry?.nombre ??
          entry?.Nombre ??
          entry?.codigo ??
          entry?.Codigo ??
          entry?.idCampoDemografico ??
          entry?.IdCampoDemografico ??
          ''
        ).trim();

        const value = this.toOptionalText(
          entry?.valor ??
          entry?.Valor ??
          entry?.valorTexto ??
          entry?.ValorTexto ??
          entry?.valorNumero ??
          entry?.ValorNumero ??
          entry?.valorFecha ??
          entry?.ValorFecha ??
          entry?.valorBooleano ??
          entry?.ValorBooleano ??
          entry?.valorOpcion ??
          entry?.ValorOpcion
        );

        if (key && value) {
          values[key] = value;
        }
      });

    return values;
  }

  private normalizeScale(item: any): ModelScale {
    const inlineDetail = Array.isArray(item?.detalle)
      ? item.detalle.length
      : Array.isArray(item?.Detalle)
        ? item.Detalle.length
        : null;

    return {
      id: Number(item?.IdEscala ?? item?.idEscala ?? item?.Id ?? item?.id ?? 0),
      name: String(item?.Nombre ?? item?.nombre ?? '').trim(),
      type: String(item?.TipoEscala ?? item?.tipoEscala ?? 'GENERAL').trim(),
      totalLevels: this.toPositiveInteger(
        item?.TotalNiveles ??
        item?.totalNiveles ??
        item?.CantidadNiveles ??
        item?.cantidadNiveles ??
        inlineDetail
      ),
    };
  }

  private buildDemographicFilters(employees: ModelEmployee[]): DemographicFilter[] {
    const map = new Map<string, Set<string>>();

    employees.forEach((employee) => {
      Object.entries(employee.demographicValues).forEach(([key, value]) => {
        if (!map.has(key)) {
          map.set(key, new Set<string>());
        }
        map.get(key)?.add(value);
      });
    });

    return Array.from(map.entries())
      .map(([key, values]) => ({
        key,
        values: Array.from(values).sort((a, b) => a.localeCompare(b)),
      }))
      .filter((item) => item.values.length > 0)
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  private createFallbackScaleValues(): ModelScaleValue[] {
    return [
      { id: 1, value: 4, description: 'De manera consistente', order: 1, weight: 100 },
      { id: 2, value: 3, description: 'Frecuentemente', order: 2, weight: 75 },
      { id: 3, value: 2, description: 'Ocasionalmente', order: 3, weight: 40 },
      { id: 4, value: 1, description: 'Nunca o casi nunca', order: 4, weight: 0 },
    ];
  }

  private getDefaultScaleWeight(index: number, total: number): number {
    if (total <= 1) {
      return 100;
    }

    const step = 100 / (total - 1);
    return Number(Math.max(0, 100 - index * step).toFixed(2));
  }

  private syncPositionModels(): void {
    const positions = this.positions.length > 0 ? this.positions : ['Sin puesto'];
    const existingMap = new Map(this.positionModels.map((item) => [item.position, item]));

    this.positionModels = positions.map((position) => {
      const current = existingMap.get(position) ?? {
        position,
        greatFactors: [],
      };

      current.greatFactors = this.bigFactors.map((factor) => {
        const existing = current.greatFactors.find((item) => item.bigFactorId === factor.id);

        return existing ?? {
          bigFactorId: factor.id,
          enabled: factor.enabled,
          weight: factor.weight,
          factors: this.createDefaultPositionFactors(factor.name),
        };
      });

      return current;
    });

    if (!this.selectedPosition && this.positionModels.length > 0) {
      this.selectedPosition = this.positionModels[0].position;
    }
  }

  private createDefaultPositionFactors(bigFactorName: string): PositionFactor[] {
    const normalized = this.normalizeLookupKey(bigFactorName);

    if (normalized.includes('VALOR')) {
      return [
        this.createPositionFactor('Responsabilidad', 35, [
          'Cumple con las tareas asignadas cuando existe supervision directa y recordatorios constantes.',
          'Da seguimiento oportuno a sus compromisos y comunica bloqueos.',
        ]),
        this.createPositionFactor('Comunicacion', 35, [
          'Comparte informacion clara con su equipo y areas relacionadas.',
          'Escucha activamente y responde con respeto ante diferencias.',
        ]),
        this.createPositionFactor('Calidad', 30, [
          'Entrega resultados con orden, detalle y bajo margen de reproceso.',
        ]),
      ];
    }

    if (normalized.includes('COMPETENCIA')) {
      return [
        this.createPositionFactor('Trabajo en equipo', 50, [
          'Colabora con otros para resolver problemas de forma constructiva.',
        ]),
        this.createPositionFactor('Orientacion a resultados', 50, [
          'Prioriza actividades que impactan los objetivos del puesto.',
        ]),
      ];
    }

    return [
      this.createPositionFactor('Cumplimiento de metas', 60, [
        'Avanza sus entregables clave dentro de los tiempos acordados.',
      ]),
      this.createPositionFactor('Seguimiento', 40, [
        'Mantiene visibilidad del avance y actualiza estados oportunamente.',
      ]),
    ];
  }

  private createPositionFactor(name: string, weight: number, behaviors: string[]): PositionFactor {
    return {
      id: this.nextFactorId++,
      name,
      weight,
      behaviors: behaviors.map((text) => ({
        id: this.nextBehaviorId++,
        text,
        selected: true,
      })),
    };
  }

  private seedEvaluatorAssignments(): void {
    const employees = this.employees.slice(0, 3);
    this.evaluatorAssignments = employees.map((employee) => this.createAssignment(employee.id));
  }

  private createAssignment(evaluatedId: number): EvaluatorAssignment {
    const evaluatorOptions = this.employees.filter((employee) => employee.id !== evaluatedId);
    const mainPerspective = this.selectedPerspectives[0]?.id ?? null;
    const selfPerspective = this.perspectives.find((item) => this.normalizeLookupKey(item.name).includes('AUTO'))?.id ?? mainPerspective;
    const entries: EvaluatorEntry[] = [];

    if (evaluatorOptions[0]) {
      entries.push({
        id: this.nextEvaluatorEntryId++,
        evaluatorId: evaluatorOptions[0].id,
        perspectiveId: mainPerspective,
        weight: 90,
      });
    }

    entries.push({
      id: this.nextEvaluatorEntryId++,
      evaluatorId: evaluatedId,
      perspectiveId: selfPerspective,
      weight: evaluatorOptions[0] ? 10 : 100,
    });

    return {
      id: this.nextAssignmentId++,
      evaluatedId,
      entries,
      draftEvaluatorId: evaluatorOptions[0]?.id ?? null,
      draftPerspectiveId: mainPerspective,
      draftWeight: 0,
    };
  }

  private toOptionalText(value: any): string | null {
    const text = String(value ?? '').trim();
    return text.length > 0 ? text : null;
  }

  private toPositiveInteger(value: any): number | null {
    const numericValue = Number(value);
    return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
  }

  private normalizeLookupKey(value: any): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toUpperCase();
  }

  private sum(values: Array<number | string | null | undefined>): number {
    return Number(
      values
        .map((value) => Number(value) || 0)
        .reduce((total, value) => total + value, 0)
        .toFixed(2)
    );
  }

  private getErrorMessage(error: any): string {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Ocurrio un error inesperado.'
    );
  }
}
