import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { firstValueFrom } from 'rxjs';
// @ts-ignore: import de la build browser de ExcelJS, igual que el dashboard de climas.
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

type DesDashboardChartOptions = {
  series: ApexAxisChartSeries;
  series2: ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  fill: ApexFill;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  colors: string[];
  labels: string[];
  responsive: ApexResponsive[];
};

interface DashboardOrganization {
  Id: number;
  Nombre: string;
}

interface DashboardModelOption {
  id: number;
  nombre: string;
  codigo: string | null;
  raw: any;
}

type DrilldownMode = 'puesto' | 'escenario';
type DashboardResultsTab = 'summary' | 'employees' | 'dimensions' | 'gaps' | 'findings' | 'models';
type DetailResultTone = 'above' | 'expected' | 'below' | 'neutral';

interface DashboardResultsTabOption {
  id: DashboardResultsTab;
  label: string;
  icon: string;
}

interface DashboardEmployeeDirectoryItem {
  id: number;
  organizationId: number | null;
  managerId: number | null;
  managerIds: number[];
  fullName: string;
  position: string;
  positionKey: string;
  email: string | null;
  activo: boolean;
  raw: any;
}

interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
  icon: string;
  tone: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'neutral';
}

interface ResultSummaryCard {
  label: string;
  value: string;
  help: string;
  badge: string;
  tone: 'blue' | 'green' | 'yellow' | 'red' | 'neutral';
}

interface RecommendedAction {
  title: string;
  text: string;
  badge: string;
}

interface DesDashboardData {
  organizacionId: number | null;
  fechaGeneracion: string | null;
  resumen: Record<string, any>;
  modelos: any[];
  evaluaciones: any[];
  resultadosPorPuesto: any[];
  resultadosPorEscenario: any[];
  resultadosPorDimension: any[];
  brechasCriticas: any[];
  fortalezas: any[];
  asignacionesPorEstado: any[];
  enviosPorEstado: any[];
  empleadosEvaluados: any[];
}

interface ScenarioColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-des-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    TranslateModule,
    NgApexchartsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './des-dashboard.component.html',
  styleUrls: ['./des-dashboard.component.scss'],
})
export class DesDashboardComponent implements OnInit {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.DASHBOARD.TEXT';

  public dataSourceOrganizations: DashboardOrganization[] = [];
  public modelSelectOptions: DashboardModelOption[] = [];
  public dashboardModels: DashboardModelOption[] = [];
  public selectedOrganizationId: number | null = null;
  public selectedModelId: number | null = null;
  public selectedEvaluationId: number | null = null;
  public selectedBreakdownMode: DrilldownMode = 'puesto';
  public selectedBreakdownKey: string | null = null;
  public selectedPositionKey: string | null = null;
  public selectedEmployeeId: number | null = null;
  public expandedEmployeeRowKey: string | null = null;
  public dimensionEmployeeFilterText = '';
  public selectedResultsTab: DashboardResultsTab = 'summary';
  public readonly resultTabs: DashboardResultsTabOption[] = [
    { id: 'summary', label: 'Resumen general', icon: 'dashboard' },
    { id: 'employees', label: 'Por empleado', icon: 'groups' },
    { id: 'dimensions', label: 'Dimensiones', icon: 'donut_large' },
    { id: 'gaps', label: 'Brechas & criterios', icon: 'rule' },
    { id: 'findings', label: 'Hallazgos & pasos', icon: 'tips_and_updates' },
  
  ];
  public dashboardData: DesDashboardData | null = null;
  public groupedDashboardSource: any | null = null;
  public isLoadingOrganizations = false;
  public isLoadingModels = false;
  public isLoadingDashboard = false;
  public isLoadingEmployees = false;
  public isLoadingAiActionPlan = false;
  public isGeneratingAiActionPlan = false;
  public aiActionPlanRecord: any | null = null;
  public aiActionPlanError: string | null = null;
  public dashboardEmployees: DashboardEmployeeDirectoryItem[] = [];

  public positionChartOptions: Partial<DesDashboardChartOptions> = {};
  public scenarioChartOptions: Partial<DesDashboardChartOptions> = {};
  public dimensionChartOptions: Partial<DesDashboardChartOptions> = {};
  public assignmentStatusChartOptions: Partial<DesDashboardChartOptions> = {};
  public sendStatusChartOptions: Partial<DesDashboardChartOptions> = {};
  private dashboardLoadSequence = 0;
  private aiActionPlanLoadSequence = 0;
  private aiActionPlanLoadedKey: string | null = null;
  private groupedDashboardPayload: any | null = null;

  @HostBinding('class.dark-mode')
  get isDarkMode(): boolean {
    return this.document.body.classList.contains('dark');
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private organizacionService: OrganizacionService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    void this.loadOrganizations();
  }

  get breadcrumbItems(): string[] {
    return [
      this.t('DESEMPENO_MENUITEMS.DASHBOARD.BREADCRUMB_HOME'),
      this.t(this.breadcrumbTitleKey),
    ];
  }

  get selectedOrganizationName(): string {
    return this.dataSourceOrganizations.find((item) => item.Id === this.selectedOrganizationId)?.Nombre ?? '-';
  }

  get selectedModel(): any | null {
    const models = this.dashboardData?.modelos?.length
      ? this.dashboardData.modelos
      : this.dashboardModels;
    return models.find((item) => this.getModelId(item) === this.selectedModelId) ?? models[0] ?? null;
  }

  get availableEvaluations(): any[] {
    const evaluations = this.dashboardData?.evaluaciones ?? [];

    if (!this.selectedModelId) {
      return evaluations;
    }

    const filtered = evaluations.filter((item) => this.getEvaluationModelId(item) === this.selectedModelId);
    return filtered.length > 0 ? filtered : evaluations;
  }

  get selectedEvaluation(): any | null {
    const evaluations = this.availableEvaluations;
    return evaluations.find((item) => this.getEvaluationId(item) === this.selectedEvaluationId) ?? evaluations[0] ?? null;
  }

  get realizedEvaluations(): any[] {
    return (this.dashboardData?.evaluaciones ?? []).filter((item) => this.hasEvaluationResults(item));
  }

  get dashboardPositionOptions(): Array<{ key: string; label: string; total: number }> {
    const positions = new Map<string, { key: string; label: string; total: number }>();
    const resultPositions = this.dashboardData?.resultadosPorPuesto ?? [];

    if (resultPositions.length > 0) {
      resultPositions.forEach((position) => {
        const label = this.getText(
          position,
          ['puestoNombre', 'nombrePuesto', 'puesto', 'cargo', 'nombre', 'puestoCodigo', 'codigo'],
          'Sin puesto'
        );
        const key = this.getPositionKey(
          position?.puestoId ?? position?.IdPuesto ?? position?.idPuesto,
          label
        );

        if (!key) {
          return;
        }

        positions.set(key, {
          key,
          label,
          total: this.getNumber(position, ['empleadosEvaluados', 'empleadosConResultado', 'empleados']) ?? 0,
        });
      });

      return Array.from(positions.values())
        .sort((left, right) => left.label.localeCompare(right.label));
    }

    this.dashboardEmployees.forEach((employee) => {
      if (!employee.positionKey) {
        return;
      }

      if (!positions.has(employee.positionKey)) {
        positions.set(employee.positionKey, {
          key: employee.positionKey,
          label: employee.position,
          total: 0,
        });
      }

      positions.get(employee.positionKey)!.total += 1;
    });

    (this.dashboardData?.evaluaciones ?? []).forEach((evaluation) => {
      this.getEvaluationAssignments(evaluation).forEach((assignment) => {
        const key = this.getAssignmentPositionKey(assignment);
        const label = this.getText(assignment, ['puesto', 'puestoNombre', 'cargo'], 'Sin puesto');

        if (!key || positions.has(key)) {
          return;
        }

        positions.set(key, { key, label, total: 0 });
      });
    });

    return Array.from(positions.values())
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get employeeSummaryRows(): any[] {
    const rows = this.dashboardData?.empleadosEvaluados ?? [];
    return this.filterRowsByPosition(rows.length ? rows : this.groupedEmployeeRows);
  }

  get positionGroupRows(): any[] {
    const resultRows = this.dashboardData?.resultadosPorPuesto ?? [];
    if (resultRows.length > 0) {
      return resultRows;
    }

    const positions = new Map<string, any>();
    this.employeeSummaryRows.forEach((employee) => {
      const puestoId = this.getNumber(employee, ['puestoId', 'IdPuesto', 'idPuesto']);
      const puesto = this.getEmployeePosition(employee);
      const key = this.getPositionKey(puestoId, puesto) || puesto;

      if (!positions.has(key)) {
        positions.set(key, {
          puestoId,
          puesto,
          empleadosEvaluados: 0,
          encuestasRespondidas: 0,
          itemsRespondidos: 0,
          empleados: [],
          resultados: [],
          exigencias: [],
        });
      }

      const row = positions.get(key);
      row.empleadosEvaluados += 1;
      row.encuestasRespondidas += this.getEmployeeSurveyCount(employee);
      row.itemsRespondidos += this.getEmployeeItemCount(employee);
      row.empleados.push(employee);
      const score = this.getEmployeeScore(employee);
      const target = this.getEmployeeTarget(employee);
      if (score !== null) {
        row.resultados.push(score);
      }
      if (target !== null) {
        row.exigencias.push(target);
      }
    });

    const calculatedRows = Array.from(positions.values()).map((row) => {
      const score = this.averageNumbers(row.resultados);
      const target = this.averageNumbers(row.exigencias);
      return {
        ...row,
        calificacionPromedio: score,
        resultadoPromedio: score,
        nivelExigenciaPromedio: target,
        brechaPromedio: this.calculateGap(score, target),
        resultados: undefined,
        exigencias: undefined,
      };
    });

    if (calculatedRows.length > 0) {
      return calculatedRows;
    }

    return this.groupedPositionRows;
  }

  get employeeGroupRows(): any[] {
    const summaryRows = this.dashboardData?.empleadosEvaluados ?? [];
    const groupedRows = this.groupedEmployeeRows;
    const rows = summaryRows.length ? summaryRows : groupedRows;
    return this.sortEmployeesByHierarchy(this.filterRowsByPosition(rows));
  }

  get dimensionEmployeeRows(): any[] {
    const filter = this.normalizeKey(this.dimensionEmployeeFilterText || '');
    const rows = this.employeeGroupRows;

    if (!filter) {
      return rows;
    }

    return rows.filter((employee) => {
      const searchable = [
        this.getEmployeeName(employee),
        this.getShortEmployeeName(employee),
        this.getEmployeePosition(employee),
        this.getText(employee, ['email', 'Email'], ''),
      ].join(' ');

      return this.normalizeKey(searchable).includes(filter);
    });
  }

  get dimensionEmployeeGroups(): Array<{ key: string; puesto: string; employees: any[] }> {
    const groups = new Map<string, { key: string; puesto: string; employees: any[] }>();

    this.dimensionEmployeeRows.forEach((employee) => {
      const puesto = this.getEmployeePosition(employee);
      const key = this.getEmployeePositionKey(employee) || this.normalizeKey(puesto);

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          puesto,
          employees: [],
        });
      }

      groups.get(key)!.employees.push(employee);
    });

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        employees: [...group.employees].sort((left, right) =>
          this.getEmployeeName(left).localeCompare(this.getEmployeeName(right))
        ),
      }))
      .sort((left, right) => left.puesto.localeCompare(right.puesto));
  }

  get scenarioGroupRows(): any[] {
    const rows = this.dashboardData?.resultadosPorEscenario ?? [];
    if (rows.length > 0) {
      return rows;
    }

    const scenarios = new Map<string, any>();
    this.employeeGroupRows.forEach((employee) => {
      this.getGroupedEmployeeEvaluations(employee).forEach((survey) => {
        const key = this.getAssignmentScenarioKey(survey);
        const label = this.getAssignmentScenarioName(survey);
        if (!key && !label) {
          return;
        }

        const scenarioKey = key || this.normalizeKey(label);
        if (!scenarios.has(scenarioKey)) {
          scenarios.set(scenarioKey, {
            escenarioCodigo: scenarioKey,
            escenario: label || scenarioKey,
            empleados: new Set<number | string>(),
            encuestasRespondidas: 0,
            itemsRespondidos: 0,
          });
        }

        const row = scenarios.get(scenarioKey);
        row.empleados.add(this.getEmployeeId(employee) || this.getEmployeeName(employee));
        row.encuestasRespondidas += 1;
        row.itemsRespondidos += this.countItemsInSurvey(survey);
      });
    });

    return Array.from(scenarios.values()).map((row) => ({
      ...row,
      empleadosEvaluados: row.empleados.size,
      empleados: undefined,
    }));
  }

  get dimensionGroupRows(): any[] {
    const rows = this.dashboardData?.resultadosPorDimension ?? [];
    if (rows.length > 0) {
      return rows;
    }

    const dimensions = new Map<string, any>();
    this.employeeGroupRows.forEach((employee) => {
      this.getGroupedEmployeeEvaluations(employee).forEach((survey) => {
        this.getSurveyDimensions(survey).forEach((dimension) => {
          const key = String(
            this.getNumber(dimension, ['dimensionId', 'IdModeloDimension', 'idDimension']) ??
            this.getText(dimension, ['dimensionCodigo', 'codigo', 'dimension', 'nombre'], '')
          ).trim();

          if (!key) {
            return;
          }

          if (!dimensions.has(key)) {
            dimensions.set(key, {
              dimensionId: this.getNumber(dimension, ['dimensionId', 'IdModeloDimension', 'idDimension']),
              dimensionCodigo: this.toOptionalText(dimension?.dimensionCodigo ?? dimension?.codigo),
              dimension: this.getText(dimension, ['dimension', 'dimensionNombre', 'nombre'], 'Dimensión'),
              empleados: new Set<number | string>(),
              criteriosRespondidos: 0,
              itemsRespondidos: 0,
            });
          }

          const row = dimensions.get(key);
          row.empleados.add(this.getEmployeeId(employee) || this.getEmployeeName(employee));
          row.criteriosRespondidos += this.getCollection(dimension, ['criterios']).length;
          row.itemsRespondidos += this.getNumber(dimension, ['itemsRespondidos']) ?? this.countItemsInDimension(dimension);
        });
      });
    });

    return Array.from(dimensions.values()).map((row) => ({
      ...row,
      empleadosEvaluados: row.empleados.size,
      empleados: undefined,
    }));
  }

  get selectedBreakdownRows(): any[] {
    const evaluation = this.selectedEvaluation;
    if (!evaluation) {
      return [];
    }

    const rows = this.selectedBreakdownMode === 'puesto'
      ? this.getCollection(evaluation, ['puestos'])
      : this.getCollection(evaluation, ['escenarios']);

    if (this.selectedBreakdownMode === 'puesto' && this.selectedPositionKey) {
      return rows.filter((row) => this.getBreakdownKey(row) === this.selectedPositionKey);
    }

    return rows;
  }

  get selectedBreakdownTitle(): string {
    return this.selectedBreakdownMode === 'puesto' ? 'Puestos' : 'Escenarios';
  }

  get selectedBreakdownLabel(): string {
    if (!this.selectedBreakdownKey) {
      return 'Todos';
    }

    const selected = this.selectedBreakdownRows.find((item) => this.getBreakdownKey(item) === this.selectedBreakdownKey);
    return selected ? this.getBreakdownName(selected) : 'Seleccionado';
  }

  get selectedEvaluationEmployees(): any[] {
    const evaluation = this.selectedEvaluation;
    const employees = this.filterRowsByPosition(evaluation ? this.getCollection(evaluation, ['empleados']) : []);

    if (!this.selectedBreakdownKey) {
      return employees;
    }

    return employees.filter((employee) => {
      if (this.selectedBreakdownMode === 'puesto') {
        return this.getEmployeePositionKey(employee) === this.selectedBreakdownKey;
      }

      return this.getCollection(employee, ['escenarios'])
        .some((scenario) => this.getScenarioKey(scenario) === this.selectedBreakdownKey);
    });
  }

  get groupedPositionRows(): any[] {
    return this.getGroupedSourcePositions(this.groupedDashboardSource);
  }

  get groupedEmployeeRows(): any[] {
    return this.groupedPositionRows.flatMap((position) => {
      const puestoId = this.getNumber(position, ['puestoId', 'IdPuesto', 'idPuesto']);
      const puesto = this.getText(position, ['puesto', 'puestoNombre', 'cargo', 'nombre'], 'Sin puesto');

      return this.asArray(position?.empleados ?? position?.Empleados).map((employee) => ({
        ...employee,
        puestoId,
        puesto,
      }));
    });
  }

  get selectedEmployee(): any | null {
    const employees = this.selectedEvaluationEmployees;
    return employees.find((item) => this.getEmployeeId(item) === this.selectedEmployeeId) ?? employees[0] ?? null;
  }

  get selectedEmployeeDimensions(): any[] {
    return this.filterDetailByBreakdown(this.getCollection(this.selectedEmployee, ['dimensiones']));
  }

  get selectedEmployeeCriteria(): any[] {
    return this.filterDetailByBreakdown(this.getCollection(this.selectedEmployee, ['criterios']));
  }

  get selectedEmployeeAssignments(): any[] {
    return this.filterAssignmentsByBreakdown(this.getCollection(this.selectedEmployee, ['asignacionesRealizadas', 'asignaciones']));
  }

  get dashboardMetrics(): DashboardMetric[] {
    const resumen = this.dashboardData?.resumen ?? {};
    const hasGroupedTotals = [
      'totalEncuestasRespondidas',
      'totalEncuestasConDetalleVisible',
      'totalPuestos',
      'totalEmpleadosEvaluados',
      'totalItemsRespondidos',
    ].some((key) => this.getNumber(resumen, [key]) !== null);

    if (hasGroupedTotals) {
      return [
        {
          label: 'Total evaluaciones',
          value: this.formatInteger(this.getNumber(resumen, ['totalEvaluaciones'])),
          hint: 'Evaluaciones del modelo',
          icon: 'assignment',
          tone: 'purple',
        },
        {
          label: 'Encuestas respondidas',
          value: this.formatInteger(this.getNumber(resumen, ['totalEncuestasRespondidas'])),
          hint: 'Respuestas finalizadas',
          icon: 'task_alt',
          tone: 'green',
        },
        {
          label: 'Encuestas con detalle',
          value: this.formatInteger(this.getNumber(resumen, ['totalEncuestasConDetalleVisible'])),
          hint: 'Detalle visible',
          icon: 'visibility',
          tone: 'blue',
        },
        {
          label: 'Total puestos',
          value: this.formatInteger(this.getNumber(resumen, ['totalPuestos'])),
          hint: 'Puestos con respuesta',
          icon: 'badge',
          tone: 'orange',
        },
        {
          label: 'Empleados evaluados',
          value: this.formatInteger(this.getNumber(resumen, ['totalEmpleadosEvaluados', 'empleadosConResultado'])),
          hint: 'Personas con resultados',
          icon: 'groups',
          tone: 'blue',
        },
        {
          label: 'Ítems respondidos',
          value: this.formatInteger(this.getNumber(resumen, ['totalItemsRespondidos'])),
          hint: 'Reactivos contestados',
          icon: 'fact_check',
          tone: 'neutral',
        },
      ];
    }

    const totalModelos = this.getNumber(resumen, ['totalModelos']);
    const totalEvaluaciones = this.getNumber(resumen, ['totalEvaluaciones']);
    const totalAsignaciones = this.getNumber(resumen, ['totalAsignaciones']);
    const realizadas = this.getNumber(resumen, ['realizadas']);
    const avance = this.getNumber(resumen, ['porcentajeRealizacion', 'porcentajeAvance']);
    const calificacion = this.getNumber(resumen, ['calificacionPromedio', 'resultadoPromedio']);
    const exigencia = this.getNumber(resumen, ['nivelExigenciaPromedio']);
    const brecha = this.getNumber(resumen, ['brechaPromedio']);
    const empleadosIdentificados = this.dashboardData?.empleadosEvaluados.length || this.getNumber(resumen, ['empleadosConResultado']);

    return [
      {
        label: 'Calificación obtenida',
        value: this.formatScore(calificacion),
        hint: `Exigencia ${this.formatScore(exigencia)}`,
        icon: 'workspace_premium',
        tone: this.getScoreTone(calificacion),
      },
      {
        label: 'Avance real',
        value: this.formatPercent(avance),
        hint: `${this.formatInteger(realizadas)} de ${this.formatInteger(totalAsignaciones)} realizadas`,
        icon: 'task_alt',
        tone: 'green',
      },
      {
        label: 'Evaluaciones realizadas',
        value: this.formatInteger(this.getNumber(resumen, ['evaluacionesRealizadas'])),
        hint: `${this.formatInteger(totalEvaluaciones)} evaluaciones creadas`,
        icon: 'assignment_turned_in',
        tone: 'purple',
      },
      {
        label: 'Empleados identificados',
        value: this.formatInteger(empleadosIdentificados),
        hint: `${this.formatInteger(this.getNumber(resumen, ['totalEvaluados']))} evaluados asignados`,
        icon: 'groups',
        tone: 'blue',
      },
      {
        label: 'Modelos activos',
        value: this.formatInteger(this.getNumber(resumen, ['modelosActivos'])),
        hint: `${this.formatInteger(totalModelos)} modelos totales`,
        icon: 'inventory_2',
        tone: 'blue',
      },
      {
        label: 'Total asignaciones',
        value: this.formatInteger(totalAsignaciones),
        hint: `${this.formatInteger(realizadas)} realizadas`,
        icon: 'hub',
        tone: 'neutral',
      },
      {
        label: 'Nivel de exigencia',
        value: this.formatScore(exigencia),
        hint: 'Promedio esperado',
        icon: 'flag',
        tone: 'orange',
      },
      {
        label: 'Brecha promedio',
        value: this.formatGap(brecha),
        hint: 'Calificación menos exigencia',
        icon: 'compare_arrows',
        tone: this.getGapTone(brecha),
      },
    ];
  }

  get criticalGaps(): any[] {
    return [...(this.dashboardData?.brechasCriticas ?? [])]
      .sort((left, right) => this.nullLast(this.getNumber(left, ['brechaPromedio']), this.getNumber(right, ['brechaPromedio'])))
      .slice(0, 8);
  }

  get strengths(): any[] {
    return [...(this.dashboardData?.fortalezas ?? [])]
      .sort((left, right) => this.nullLast(this.getNumber(right, ['brechaPromedio']), this.getNumber(left, ['brechaPromedio'])))
      .slice(0, 8);
  }

  get resultSummaryCards(): ResultSummaryCard[] {
    const score = this.getDashboardTotal(['calificacionPromedio', 'resultadoPromedio']);
    const target = this.getDashboardTotal(['nivelExigenciaPromedio']);
    const gap = this.getDashboardTotal(['brechaPromedio']);
    const participation = this.getParticipationPercent() ?? 0;
    const negativeCount = this.negativeCriteriaRows.length;
    const totalEmployees = this.dashboardEmployees.length || this.employeeGroupRows.length;

    return [
      {
        label: 'Resultado promedio',
        value: this.formatScore(score),
        help: 'Escala 1-5',
        badge: this.getScoreStatus(score),
        tone: this.getResultTone(score),
      },
      {
        label: 'Avance del proceso',
        value: this.formatPercent(participation),
        help: `${this.formatInteger(this.getDashboardTotal(['realizadas', 'respondidas', 'totalEncuestasRespondidas']))} respuestas finalizadas`,
        badge: participation >= 100 ? 'Completo' : 'En proceso',
        tone: participation >= 100 ? 'green' : 'yellow',
      },
      {
        label: 'Nivel de exigencia prom.',
        value: this.formatScore(target),
        help: 'Exigencia esperada del rol',
        badge: this.getTargetStatus(target),
        tone: 'yellow',
      },
      {
        label: 'Brecha promedio',
        value: this.formatGap(gap),
        help: 'Resultado contra exigencia',
        badge: gap !== null && gap >= 0 ? 'Por encima' : 'Atención',
        tone: gap !== null && gap >= 0 ? 'green' : 'red',
      },
      {
        label: 'Brechas negativas',
        value: this.formatInteger(negativeCount),
        help: 'Criterios bajo nivel requerido',
        badge: negativeCount > 0 ? 'Atención' : 'Sin alertas',
        tone: negativeCount > 0 ? 'red' : 'green',
      },
      {
        label: 'Total empleados',
        value: this.formatInteger(totalEmployees),
        help: `${this.formatInteger(this.employeeGroupRows.length)} evaluados`,
        badge: 'Cobertura',
        tone: 'blue',
      },
    ];
  }

  get allCriteriaRows(): any[] {
    const rows = [
      ...(this.dashboardData?.brechasCriticas ?? []),
      ...(this.dashboardData?.fortalezas ?? []),
    ];
    if (rows.length === 0) {
      return this.employeeGroupRows.flatMap((employee) =>
        this.getEmployeeDimensionRows(employee).flatMap((dimension) =>
          this.getCollection(dimension, ['criterios']).map((criterion) => ({
            ...criterion,
            empleadoId: this.getEmployeeId(employee),
            empleado: this.getEmployeeName(employee),
            puesto: this.getEmployeePosition(employee),
            dimensionId: this.getNumber(dimension, ['dimensionId', 'IdModeloDimension', 'idDimension']),
            dimensionCodigo: this.toOptionalText(dimension?.dimensionCodigo ?? dimension?.codigo),
            dimension: this.getDimensionDisplayName(dimension),
          }))
        )
      );
    }
    const unique = new Map<string, any>();

    rows.forEach((row, index) => {
      const key = [
        this.getNumber(row, ['criterioId', 'IdCriterioEvaluacion']) ?? index,
        this.getText(row, ['criterioCodigo', 'criterio', 'nombre'], ''),
        this.getText(row, ['dimension', 'dimensionNombre'], ''),
        this.getText(row, ['escenarioCodigo', 'escenario'], ''),
        this.getNumber(row, ['brechaPromedio', 'brecha']) ?? '',
      ].join('|');
      unique.set(key, row);
    });

    return Array.from(unique.values());
  }

  get negativeCriteriaRows(): any[] {
    return this.allCriteriaRows
      .filter((item) => (this.getNumber(item, ['brechaPromedio', 'brecha']) ?? 0) < 0)
      .sort((left, right) => this.nullLast(this.getNumber(left, ['brechaPromedio', 'brecha']), this.getNumber(right, ['brechaPromedio', 'brecha'])));
  }

  get neutralCriteriaRows(): any[] {
    return this.allCriteriaRows
      .filter((item) => {
        const gap = this.getNumber(item, ['brechaPromedio', 'brecha']);
        return gap !== null && Math.abs(gap) < 0.01;
      });
  }

  get positiveCriteriaRows(): any[] {
    return this.allCriteriaRows
      .filter((item) => (this.getNumber(item, ['brechaPromedio', 'brecha']) ?? 0) > 0)
      .sort((left, right) => this.nullLast(this.getNumber(right, ['brechaPromedio', 'brecha']), this.getNumber(left, ['brechaPromedio', 'brecha'])));
  }

  get aiActionPlanResult(): Record<string, any> {
    const storedResult = this.getObject(this.aiActionPlanRecord?.resultado ?? this.aiActionPlanRecord?.Resultado);
    if (Object.keys(storedResult).length > 0) {
      return storedResult;
    }

    return this.isAiActionPlanPayload(this.aiActionPlanRecord)
      ? this.getObject(this.aiActionPlanRecord)
      : {};
  }

  get hasAiActionPlan(): boolean {
    return Object.keys(this.aiActionPlanResult).length > 0;
  }

  get canGenerateAiActionPlan(): boolean {
    return !!this.selectedOrganizationId &&
      !!this.selectedModelId &&
      !!this.getCachedGroupedResultsForAi() &&
      !this.isGeneratingAiActionPlan;
  }

  get aiExecutiveSummary(): string {
    return this.getText(this.aiActionPlanResult, ['resumenEjecutivo', 'ResumenEjecutivo'], '');
  }

  get aiKeyFindings(): any[] {
    return this.getCollection(this.aiActionPlanResult, ['hallazgosClave', 'HallazgosClave']);
  }

  get aiRecommendedActions(): any[] {
    return this.getCollection(this.aiActionPlanResult, ['planAccionRecomendado', 'PlanAccionRecomendado']);
  }

  get aiPositionPlans(): any[] {
    return this.getCollection(this.aiActionPlanResult, ['planesPorPuesto', 'PlanesPorPuesto']);
  }

  get aiEmployeePlans(): any[] {
    return this.getCollection(this.aiActionPlanResult, ['planesPorEmpleado', 'PlanesPorEmpleado']);
  }

  get aiActionPlanMeta(): string {
    if (!this.aiActionPlanRecord) {
      return '';
    }

    const model = this.getText(this.aiActionPlanRecord, ['modeloIA', 'ModeloIA'], '');
    const prompt = this.getText(this.aiActionPlanRecord, ['promptVersion', 'PromptVersion'], '');
    const created = this.formatDate(this.aiActionPlanRecord?.fechaCreacion ?? this.aiActionPlanRecord?.FechaCreacion);
    const cache = this.toBoolean(this.aiActionPlanRecord?.cache ?? this.aiActionPlanRecord?.Cache, false) ? 'cache' : '';

    return [model, prompt, created !== '-' ? `Generado ${created}` : '', cache].filter(Boolean).join(' · ');
  }

  get modelsWithResults(): number {
    return (this.dashboardData?.modelos ?? []).filter((model) =>
      (this.getNumber(model, ['evaluacionesRealizadas', 'realizadas', 'respondidas']) ?? 0) > 0 ||
      this.getNumber(model, ['calificacionPromedio', 'resultadoPromedio']) !== null
    ).length;
  }

  get recommendedActions(): RecommendedAction[] {
    const actions: RecommendedAction[] = [];
    const worstGap = this.negativeCriteriaRows[0];
    const bestStrength = this.positiveCriteriaRows[0];

    if (worstGap) {
      actions.push({
        title: `Atender ${this.getRankingTitle(worstGap)}`,
        text: `La dimensión ${this.getText(worstGap, ['dimension'], 'evaluada')} presenta una brecha de ${this.formatGap(this.getNumber(worstGap, ['brechaPromedio', 'brecha']))}. Conviene revisar evidencias, expectativas y compromisos con el puesto involucrado.`,
        badge: 'Prioridad alta',
      });
    }

    const lowestEmployee = [...this.employeeGroupRows]
      .sort((left, right) => this.nullLast(this.getEmployeeScore(left), this.getEmployeeScore(right)))[0];
    if (lowestEmployee) {
      actions.push({
        title: `Sesión de retroalimentación con ${this.getEmployeeName(lowestEmployee)}`,
        text: `El resultado actual es ${this.formatScore(this.getEmployeeScore(lowestEmployee))}. Recomendado revisar dimensiones con menor calificación y acordar próximos pasos medibles.`,
        badge: 'Seguimiento',
      });
    }

    if (bestStrength) {
      actions.push({
        title: `Capitalizar fortaleza: ${this.getRankingTitle(bestStrength)}`,
        text: `La brecha positiva de ${this.formatGap(this.getNumber(bestStrength, ['brechaPromedio', 'brecha']))} puede usarse como referencia interna para prácticas de desempeño.`,
        badge: 'Fortaleza',
      });
    }

    if (this.dashboardEmployees.length > this.employeeGroupRows.length) {
      actions.push({
        title: 'Ampliar cobertura de evaluación',
        text: `Hay ${this.dashboardEmployees.length - this.employeeGroupRows.length} empleados del directorio sin resultado visible en el modelo seleccionado.`,
        badge: 'Cobertura',
      });
    }

    return actions.length ? actions : [{
      title: 'Mantener seguimiento del proceso',
      text: 'No se detectan brechas negativas críticas con la información disponible. Mantén la revisión periódica de resultados y cobertura.',
      badge: 'Monitoreo',
    }];
  }

  getAiSeverityLabel(item: any): string {
    const severity = this.normalizeKey(this.getText(item, ['severidad', 'Severidad'], 'media'));
    if (severity.includes('ALTA')) return 'Alta';
    if (severity.includes('BAJA')) return 'Baja';
    return 'Media';
  }

  getAiSeverityClass(item: any): string {
    const severity = this.normalizeKey(this.getText(item, ['severidad', 'Severidad'], 'media'));
    if (severity.includes('ALTA')) return 'alert';
    if (severity.includes('BAJA')) return 'success';
    return 'warn';
  }

  getAiImpactClass(item: any): string {
    const impact = this.normalizeKey(this.getText(item, ['impactoEsperado', 'ImpactoEsperado'], 'medio'));
    if (impact.includes('ALTO')) return 'alert';
    if (impact.includes('BAJO')) return 'success';
    return 'warn';
  }

  getAiActionPriority(action: any, index: number): number {
    return this.getNumber(action, ['prioridad', 'Prioridad']) ?? index + 1;
  }

  getAiActionTitle(action: any): string {
    return this.getText(action, ['accion', 'Accion', 'title', 'titulo'], 'Acción recomendada');
  }

  getAiActionObjective(action: any): string {
    return this.getText(action, ['objetivo', 'Objetivo', 'text', 'descripcion'], '');
  }

  getAiActionOwner(action: any): string {
    return this.getText(action, ['responsableSugerido', 'ResponsableSugerido', 'responsable'], '-');
  }

  getAiActionDeadline(action: any): string {
    return this.getText(action, ['plazo', 'Plazo'], '-');
  }

  getAiActionMetric(action: any): string {
    return this.getText(action, ['indicador', 'Indicador'], '-');
  }

  getAiActionImpact(action: any): string {
    return this.getText(action, ['impactoEsperado', 'ImpactoEsperado'], 'medio');
  }

  getAiList(item: any, keys: string[]): string[] {
    return this.getCollection(item, keys)
      .map((value) => String(value ?? '').trim())
      .filter(Boolean);
  }

  downloadAiActionPlanPdf(): void {
    if (!this.hasAiActionPlan) {
      Swal.fire('PDF', 'No hay plan de acción IA para descargar.', 'warning');
      return;
    }

    try {
      const blob = this.buildAiActionPlanPdfBlob();
      const org = this.selectedOrganizationName.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
      const model = this.getModelName(this.selectedModel).replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
      saveAs(blob, `Plan_Accion_IA_${org || 'Organizacion'}_${model || 'Modelo'}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF de plan de accion IA:', error);
      Swal.fire('PDF', 'No fue posible generar el PDF del plan de acción.', 'error');
    }
  }

  getDashboardTotal(keys: string[]): number | null {
    return this.getNumber(this.dashboardData?.resumen ?? {}, keys);
  }

  getParticipationPercent(): number | null {
    const explicit = this.getDashboardTotal(['porcentajeRealizacion', 'porcentajeAvance']);
    if (explicit !== null) {
      return explicit;
    }

    const total = this.getDashboardTotal(['totalAsignaciones', 'totalEncuestasConDetalleVisible']);
    const done = this.getDashboardTotal(['realizadas', 'respondidas', 'totalEncuestasRespondidas']);
    return total && done !== null ? (done / total) * 100 : null;
  }

  getEmployeeCoveragePercent(): number | null {
    const total = this.dashboardEmployees.length || this.employeeGroupRows.length;
    return total > 0 ? (this.employeeGroupRows.length / total) * 100 : null;
  }

  getPrimaryDepartmentLabel(): string {
    const departments = this.dashboardEmployees
      .map((employee) => this.getText(employee.raw, ['DEPARTAMENTO', 'departamento'], ''))
      .filter(Boolean);

    return Array.from(new Set(departments)).slice(0, 2).join(' / ') || 'Resultados de desempeño';
  }

  getSelectedEvaluationDate(type: 'inicio' | 'cierre'): any {
    const evaluation = this.selectedEvaluation;
    return type === 'inicio'
      ? evaluation?.fechaInicio ?? evaluation?.FechaInicio ?? evaluation?.fechaInicioEvaluacion
      : evaluation?.fechaCierre ?? evaluation?.FechaCierre ?? evaluation?.fechaCierreEvaluacion;
  }

  getScorePercent(value: number | null): number {
    if (value === null) {
      return 0;
    }

    return Math.max(0, Math.min(100, (value / 5) * 100));
  }

  getScoreStatus(value: number | null): string {
    if (value === null) return 'Sin dato';
    if (value >= 4.5) return 'Sobresaliente';
    if (value >= 3.5) return 'Cumple';
    if (value >= 3) return 'Cumple parcialmente';
    return 'Atención';
  }

  getResultTone(value: number | null): ResultSummaryCard['tone'] {
    if (value === null) return 'neutral';
    if (value >= 3.5) return 'blue';
    if (value >= 3) return 'yellow';
    return 'red';
  }

  getTargetStatus(value: number | null): string {
    if (value === null) return 'Sin dato';
    if (value >= 4) return 'Alto';
    if (value >= 3) return 'Moderado';
    return 'Base';
  }

  getShortLabel(value: string, maxLength = 28): string {
    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
  }

  getShortEmployeeName(employee: any): string {
    const name = this.getEmployeeName(employee);
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length <= 2) {
      return name;
    }

    return `${parts[0]} ${parts[1]}`;
  }

  getDimensionDisplayName(dimension: any): string {
    return this.getText(dimension, ['dimension', 'dimensionNombre', 'nombre', 'dimensionCodigo'], 'Dimensión');
  }

  getEmployeeScore(employee: any): number | null {
    return this.getNumber(employee, ['calificacionPromedio', 'resultadoPromedio', 'calificacionTotal', 'resultadoTotal']) ??
      this.averageNumbers(this.getEmployeeDimensionRows(employee).map((dimension) =>
        this.getNumber(dimension, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado'])
      ));
  }

  getEmployeeTarget(employee: any): number | null {
    return this.getNumber(employee, ['nivelExigenciaPromedio', 'nivelExigenciaTotal']) ??
      this.averageNumbers(this.getEmployeeDimensionRows(employee).map((dimension) =>
        this.getNumber(dimension, ['nivelExigenciaPromedio', 'nivelExigencia'])
      ));
  }

  getEmployeeGap(employee: any): number | null {
    return this.getNumber(employee, ['brechaPromedio', 'brechaTotal']) ??
      this.calculateGap(this.getEmployeeScore(employee), this.getEmployeeTarget(employee));
  }

  getEmployeeDimensionRows(employee: any): any[] {
    const direct = this.getCollection(employee, ['dimensiones']);
    if (direct.length > 0) {
      return direct;
    }

    const fromEvaluations = this.getGroupedEmployeeEvaluations(employee)
      .flatMap((evaluation) => this.getSurveyDimensionsForDisplay(evaluation, employee));

    if (fromEvaluations.length > 0) {
      return fromEvaluations;
    }

    return [];
  }

  getEmployeeDimensionScenarioGroups(employee: any): Array<{ id: string; escenario: string; dimensiones: any[] }> {
    const evaluations = this.getGroupedEmployeeEvaluations(employee);

    if (evaluations.length > 0) {
      const groups = evaluations
        .map((evaluation, index) => ({
          id: `${this.getEmployeeRowKey(employee)}-scenario-${this.getAssignmentScenarioKey(evaluation) || index}`,
          escenario: this.getEvaluationDetailScenarioName(evaluation),
          dimensiones: this.getSurveyDimensionsForDisplay(evaluation, employee),
        }))
        .filter((group) => group.dimensiones.length > 0);

      if (groups.length > 0) {
        return groups;
      }
    }

    const fallbackGroups = new Map<string, { id: string; escenario: string; dimensiones: any[] }>();
    this.getEmployeeDimensionRows(employee).forEach((dimension) => {
      const escenario = this.getText(
        dimension,
        ['escenario', 'escenarioNombre', 'nombreEscenario', 'escenarioCodigo'],
        'Resultado consolidado'
      );
      const key = this.normalizeKey(escenario || 'Resultado consolidado');

      if (!fallbackGroups.has(key)) {
        fallbackGroups.set(key, {
          id: `${this.getEmployeeRowKey(employee)}-scenario-${key || 'general'}`,
          escenario,
          dimensiones: [],
        });
      }

      fallbackGroups.get(key)!.dimensiones.push(dimension);
    });

    return Array.from(fallbackGroups.values()).filter((group) => group.dimensiones.length > 0);
  }

  getEmployeeDimensionScore(employee: any, dimension: any): number | null {
    return this.averageNumbers(this.getEmployeeDimensionMatches(employee, dimension).map((item) =>
      this.getNumber(item, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado'])
    ));
  }

  getEmployeeDimensionTarget(employee: any, dimension: any): number | null {
    return this.averageNumbers(this.getEmployeeDimensionMatches(employee, dimension).map((item) =>
      this.getNumber(item, ['nivelExigenciaPromedio', 'nivelExigencia'])
    ));
  }

  getEmployeeDimensionToneClass(employee: any, dimension: any): string {
    return this.getDetailToneClass(
      this.getEmployeeDimensionScore(employee, dimension),
      this.getEmployeeDimensionTarget(employee, dimension)
    );
  }

  getDimensionAverageForEmployees(dimension: any, employees: any[]): number | null {
    return this.averageNumbers(employees.map((employee) => this.getEmployeeDimensionScore(employee, dimension)));
  }

  getDimensionTargetForEmployees(dimension: any, employees: any[]): number | null {
    return this.averageNumbers(employees.map((employee) => this.getEmployeeDimensionTarget(employee, dimension)));
  }

  getDimensionAverageToneClass(dimension: any, employees: any[]): string {
    return this.getDetailToneClass(
      this.getDimensionAverageForEmployees(dimension, employees),
      this.getDimensionTargetForEmployees(dimension, employees)
    );
  }

  getEmployeeInsight(employee: any): string {
    const dimensions = this.getEmployeeDimensionRows(employee);
    const weakest = [...dimensions].sort((left, right) =>
      this.nullLast(
        this.getNumber(left, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']),
        this.getNumber(right, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado'])
      )
    )[0];

    if (!weakest) {
      return 'Sin dimensiones suficientes para generar una lectura individual.';
    }

    const score = this.getNumber(weakest, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']);
    return `${this.getDimensionDisplayName(weakest)} es la dimensión con menor lectura (${this.formatScore(score)}).`;
  }

  getEmployeeRowKey(employee: any): string {
    const employeeId = this.getEmployeeId(employee);
    const positionKey = this.getEmployeePositionKey(employee);
    return employeeId > 0
      ? `employee-${employeeId}-${positionKey}`
      : `employee-${this.normalizeKey(this.getEmployeeName(employee))}-${positionKey}`;
  }

  isEmployeeExpanded(employee: any): boolean {
    return this.expandedEmployeeRowKey === this.getEmployeeRowKey(employee);
  }

  toggleEmployeeDetail(employee: any): void {
    const key = this.getEmployeeRowKey(employee);
    this.expandedEmployeeRowKey = this.expandedEmployeeRowKey === key ? null : key;
  }

  getEmployeeEvaluationDetails(employee: any): any[] {
    return this.getGroupedEmployeeEvaluations(employee)
      .filter((evaluation) => this.getEvaluationDetailDimensions(evaluation).length > 0);
  }

  getEvaluationDetailDimensions(evaluation: any): any[] {
    return this.getSurveyDimensionsForDisplay(evaluation, {
      empleadoId: this.getNumber(evaluation, ['empleadoId', 'IdEmpleado', 'evaluadoId', 'IdEvaluado']),
      empleado: this.getText(evaluation, ['empleado', 'evaluado', 'nombreEmpleado'], ''),
      puestoId: this.getNumber(evaluation, ['puestoId', 'IdPuesto', 'idPuesto']),
      puesto: this.getText(evaluation, ['puesto', 'puestoNombre', 'cargo'], ''),
    });
  }

  getCriterionDetailRows(dimension: any): any[] {
    return this.getCollection(dimension, ['criterios', 'Criterios']);
  }

  getItemDetailRows(criterion: any): any[] {
    return this.getCollection(criterion, ['items', 'Items']);
  }

  getEvaluationDetailTitle(evaluation: any): string {
    const evaluationName = this.getEvaluationName(evaluation);
    return evaluationName && evaluationName !== 'Evaluacion sin nombre'
      ? evaluationName
      : 'Evaluación de desempeño';
  }

  getEvaluationDetailScenarioName(evaluation: any): string {
    const directScenario = this.getText(
      evaluation,
      ['escenarioNombre', 'nombreEscenario', 'escenario', 'escenarioCodigo'],
      ''
    );

    if (directScenario) {
      return directScenario;
    }

    const scenario = this.getCollection(evaluation, ['escenarios', 'Escenarios'])[0];
    if (scenario) {
      return this.getText(scenario, ['escenario', 'escenarioNombre', 'nombreEscenario', 'nombre', 'codigo'], 'Escenario sin nombre');
    }

    const dimension = this.getSurveyDimensions(evaluation)[0];
    if (dimension) {
      const dimensionScenario = this.getText(dimension, ['escenario', 'escenarioNombre', 'nombreEscenario', 'escenarioCodigo'], '');
      if (dimensionScenario) {
        return dimensionScenario;
      }
    }

    return 'Escenario sin nombre';
  }

  getEvaluationEvaluatorName(evaluation: any): string {
    return this.getText(evaluation, ['evaluador', 'Evaluador', 'nombreEvaluador', 'evaluadorNombre'], '-');
  }

  getEvaluationDetailScore(evaluation: any): number | null {
    return this.getNumber(evaluation, ['calificacionTotal', 'resultadoTotal', 'calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']);
  }

  getEvaluationDetailTarget(evaluation: any): number | null {
    return this.getNumber(evaluation, ['nivelExigenciaTotal', 'nivelExigenciaPromedio', 'nivelExigencia']);
  }

  getDimensionDetailScore(dimension: any): number | null {
    return this.getNumber(dimension, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']);
  }

  getDimensionDetailTarget(dimension: any): number | null {
    return this.getNumber(dimension, ['nivelExigenciaPromedio', 'nivelExigencia']);
  }

  getCriterionDetailName(criterion: any): string {
    return this.getText(criterion, ['criterio', 'criterioNombre', 'nombreCriterio', 'nombre'], 'Criterio');
  }

  getCriterionDetailScore(criterion: any): number | null {
    return this.getNumber(criterion, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']);
  }

  getCriterionDetailTarget(criterion: any): number | null {
    return this.getNumber(criterion, ['nivelExigenciaPromedio', 'nivelExigencia']);
  }

  getItemDetailText(item: any): string {
    return this.getText(item, ['texto', 'itemTexto', 'pregunta', 'nombre', 'codigo', 'itemCodigo'], 'Ítem evaluativo');
  }

  getItemDetailScore(item: any): number | null {
    if (this.toBoolean(item?.noAplica ?? item?.NoAplica, false)) {
      return null;
    }

    return this.getNumber(item, ['escalaValor', 'EscalaValor', 'valorNumero', 'ValorNumero', 'valor', 'Valor', 'calificacion', 'resultado']);
  }

  getItemDetailAnswer(item: any): string {
    const label = this.getText(item, ['escalaEtiqueta', 'EscalaEtiqueta', 'etiqueta', 'respuesta', 'valorTexto', 'ValorTexto'], '');
    const score = this.getItemDetailScore(item);
    const noAplica = this.toBoolean(item?.noAplica ?? item?.NoAplica, false);

    if (noAplica) {
      return 'No aplica';
    }

    if (label && score !== null) {
      return `${this.formatScore(score)} · ${label}`;
    }

    return label || this.formatScore(score);
  }

  getItemDetailTarget(item: any, criterion: any, dimension?: any): number | null {
    return this.getNumber(item, ['nivelExigencia', 'NivelExigencia', 'nivelEsperado', 'NivelEsperado']) ??
      this.getCriterionDetailTarget(criterion) ??
      this.getDimensionDetailTarget(dimension);
  }

  getDetailGap(score: number | null, target: number | null): number | null {
    return this.calculateGap(score, target);
  }

  getDetailTone(score: number | null, target: number | null): DetailResultTone {
    const gap = this.calculateGap(score, target);
    if (gap === null) return 'neutral';
    if (gap > 0.15) return 'above';
    if (gap >= -0.15) return 'expected';
    return 'below';
  }

  getDetailToneClass(score: number | null, target: number | null): string {
    return `tone-${this.getDetailTone(score, target)}`;
  }

  getDetailToneLabel(score: number | null, target: number | null): string {
    const tone = this.getDetailTone(score, target);
    if (tone === 'above') return 'Sobre esperado';
    if (tone === 'expected') return 'En esperado';
    if (tone === 'below') return 'No cumple';
    return 'Sin dato';
  }

  async onOrganizationChange(organizationId: number | null): Promise<void> {
    const normalizedId = Number(organizationId);
    this.selectedOrganizationId = Number.isFinite(normalizedId) && normalizedId > 0 ? normalizedId : null;
    this.selectedModelId = null;
    this.selectedEvaluationId = null;
    this.selectedBreakdownKey = null;
    this.selectedPositionKey = null;
    this.selectedEmployeeId = null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.dashboardData = null;
    this.groupedDashboardSource = null;
    this.groupedDashboardPayload = null;
    this.dashboardEmployees = [];
    this.modelSelectOptions = [];
    this.dashboardModels = [];
    this.clearAiActionPlan();
    this.dashboardLoadSequence++;
    this.resetCharts();

    if (!this.selectedOrganizationId) {
      return;
    }

    await this.loadDashboardModels(this.selectedOrganizationId);
  }

  async onModelChange(modelId: number | null): Promise<void> {
    const normalizedId = Number(modelId);
    this.selectedModelId = Number.isFinite(normalizedId) && normalizedId > 0 ? normalizedId : null;

    if (!this.selectedOrganizationId || !this.selectedModelId) {
      this.dashboardData = null;
      this.expandedEmployeeRowKey = null;
      this.dimensionEmployeeFilterText = '';
      this.resetCharts();
      return;
    }

    await this.loadDashboard(this.selectedOrganizationId, this.selectedModelId);
    if (this.selectedResultsTab === 'findings') {
      void this.loadAiActionPlan(true);
    }
  }

  selectResultsTab(tab: DashboardResultsTab): void {
    this.selectedResultsTab = tab;

    if (tab === 'findings') {
      void this.loadAiActionPlan();
    }
  }

  onEvaluationChange(evaluationId: number | null): void {
    const normalizedId = Number(evaluationId);
    this.selectedEvaluationId = Number.isFinite(normalizedId) && normalizedId > 0 ? normalizedId : null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.resetDrilldownSelection();
  }

  onBreakdownModeChange(mode: DrilldownMode): void {
    this.selectedBreakdownMode = mode;
    this.resetDrilldownSelection();
  }

  onBreakdownSelect(row: any | null): void {
    this.selectedBreakdownKey = row ? this.getBreakdownKey(row) || null : null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.selectFirstVisibleEmployee();
  }

  onPositionFilterChange(positionKey: string | null): void {
    this.selectedPositionKey = positionKey || null;
    this.selectedBreakdownKey = this.selectedBreakdownMode === 'puesto' ? this.selectedPositionKey : null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.selectFirstVisibleEmployee();
  }

  selectEmployee(employee: any): void {
    this.selectedEmployeeId = this.getEmployeeId(employee) || null;
  }

  selectEmployeeFromSummary(employee: any): void {
    const employeeId = this.getEmployeeId(employee);
    if (!employeeId) {
      return;
    }

    const evaluationWithEmployee = (this.dashboardData?.evaluaciones ?? [])
      .find((evaluation) => this.getCollection(evaluation, ['empleados'])
        .some((item) => this.getEmployeeId(item) === employeeId));

    if (evaluationWithEmployee) {
      this.selectedModelId = this.getEvaluationModelId(evaluationWithEmployee) || this.selectedModelId;
      this.selectedEvaluationId = this.getEvaluationId(evaluationWithEmployee);
      this.selectedBreakdownKey = null;
    }

    this.selectedEmployeeId = employeeId;
  }

  async exportExcel(): Promise<void> {
    if (!this.dashboardData) {
      Swal.fire('Dashboard', 'No hay datos para exportar.', 'warning');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'JustLink';
      workbook.created = new Date();
      workbook.modified = new Date();

      const addSheet = (
        name: string,
        columns: Array<{ header: string; key: string; width?: number }>,
        rows: any[],
        decorateRow?: (row: any, rowData: any, rowNumber: number) => void,
      ) => {
        const sheet = workbook.addWorksheet(this.safeSheetName(name));
        sheet.columns = columns.map((column) => ({
          header: column.header,
          key: column.key,
          width: column.width ?? 18,
        }));
        rows.forEach((row) => sheet.addRow(row));
        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        sheet.eachRow((row: any, rowNumber: number) => {
          row.eachCell((cell: any) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
            };
            cell.alignment = { vertical: 'middle', wrapText: true };
            if (rowNumber > 1 && rowNumber % 2 === 0) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            }
          });
          if (rowNumber > 1 && decorateRow) {
            decorateRow(row, rows[rowNumber - 2], rowNumber);
          }
        });
        sheet.views = [{ state: 'frozen', ySplit: 1, showGridLines: false }];
      };

      addSheet(
        'Resumen',
        [
          { header: 'Indicador', key: 'indicador', width: 30 },
          { header: 'Valor', key: 'valor', width: 18 },
          { header: 'Detalle', key: 'detalle', width: 34 },
        ],
        this.dashboardMetrics.map((metric) => ({
          indicador: metric.label,
          valor: metric.value,
          detalle: metric.hint,
        })),
      );

      addSheet(
        'Modelos',
        [
          { header: 'Modelo', key: 'modelo', width: 36 },
          { header: 'Tipo', key: 'tipo', width: 14 },
          { header: 'Evaluaciones', key: 'evaluaciones', width: 16 },
          { header: 'Asignaciones', key: 'asignaciones', width: 16 },
          { header: 'Realizadas', key: 'realizadas', width: 16 },
          { header: 'Avance real', key: 'avance', width: 14 },
          { header: 'Calificacion', key: 'calificacion', width: 14 },
          { header: 'Exigencia', key: 'exigencia', width: 14 },
          { header: 'Brecha', key: 'brecha', width: 14 },
        ],
        this.dashboardData.modelos.map((model) => ({
          modelo: this.getModelName(model),
          tipo: this.getText(model, ['tipoModeloCodigo', 'tipoCodigo', 'tipoModelo', 'tipo']),
          evaluaciones: this.formatInteger(this.getNumber(model, ['totalEvaluaciones'])),
          asignaciones: this.formatInteger(this.getNumber(model, ['totalAsignaciones'])),
          realizadas: this.formatInteger(this.getNumber(model, ['realizadas', 'respondidas'])),
          avance: this.formatPercent(this.getNumber(model, ['porcentajeRealizacion', 'porcentajeAvance'])),
          calificacion: this.formatScore(this.getNumber(model, ['calificacionPromedio', 'resultadoPromedio'])),
          exigencia: this.formatScore(this.getNumber(model, ['nivelExigenciaPromedio'])),
          brecha: this.formatGap(this.getNumber(model, ['brechaPromedio'])),
        })),
      );

      addSheet(
        'Evaluaciones',
        [
          { header: 'Evaluacion', key: 'evaluacion', width: 38 },
          { header: 'Estado', key: 'estado', width: 18 },
          { header: 'Tiene resultados', key: 'tieneResultados', width: 18 },
          { header: 'Realizadas', key: 'realizadas', width: 14 },
          { header: 'Avance real', key: 'avance', width: 14 },
          { header: 'Calificacion', key: 'calificacion', width: 14 },
          { header: 'Exigencia', key: 'exigencia', width: 14 },
          { header: 'Brecha', key: 'brecha', width: 14 },
          { header: 'Empleados con resultado', key: 'empleados', width: 22 },
          { header: 'Puestos', key: 'puestos', width: 14 },
          { header: 'Escenarios', key: 'escenarios', width: 14 },
          { header: 'Dimensiones', key: 'dimensiones', width: 14 },
          { header: 'Criterios', key: 'criterios', width: 14 },
        ],
        this.dashboardData.evaluaciones.map((evaluation) => ({
          evaluacion: this.getEvaluationName(evaluation),
          estado: this.getText(evaluation, ['estadoNombre', 'estadoCodigo', 'estado']),
          tieneResultados: this.hasEvaluationResults(evaluation) ? 'Si' : 'No',
          realizadas: this.formatInteger(this.getEvaluationRealized(evaluation)),
          avance: this.formatPercent(this.getEvaluationProgress(evaluation)),
          calificacion: this.formatScore(this.getEvaluationScore(evaluation)),
          exigencia: this.formatScore(this.getNumber(evaluation, ['nivelExigenciaTotal', 'nivelExigenciaPromedio'])),
          brecha: this.formatGap(this.getNumber(evaluation, ['brechaTotal', 'brechaPromedio'])),
          empleados: this.formatInteger(this.getNumber(evaluation, ['empleadosConResultado'])),
          puestos: this.getCollection(evaluation, ['puestos']).length,
          escenarios: this.getCollection(evaluation, ['escenarios']).length,
          dimensiones: this.getCollection(evaluation, ['dimensiones']).length,
          criterios: this.getCollection(evaluation, ['criterios']).length,
        })),
      );

      addSheet('Resultados por puesto', this.resultColumns('Puesto'), this.dashboardData.resultadosPorPuesto.map((item) => this.toResultExportRow(item, ['puestoNombre', 'puesto', 'cargo', 'nombrePuesto', 'nombre'])));
      addSheet('Resultados por escenario', this.resultColumns('Escenario'), this.dashboardData.resultadosPorEscenario.map((item) => this.toResultExportRow(item, ['escenarioNombre', 'escenario', 'nombreEscenario', 'nombre'])));
      addSheet('Resultados por dimension', this.resultColumns('Dimension'), this.dashboardData.resultadosPorDimension.map((item) => this.toResultExportRow(item, ['dimensionNombre', 'dimension', 'nombreDimension', 'nombre'])));
      addSheet('Brechas criticas', this.rankingColumns(), this.criticalGaps.map((item) => this.toRankingExportRow(item)));
      addSheet('Fortalezas', this.rankingColumns(), this.strengths.map((item) => this.toRankingExportRow(item)));
      addSheet(
        'Empleados evaluados',
        [
          { header: 'Empleado', key: 'empleado', width: 34 },
          { header: 'Puesto', key: 'puesto', width: 28 },
          { header: 'Evaluaciones con resultado', key: 'evaluaciones', width: 24 },
          { header: 'Asignaciones realizadas', key: 'asignaciones', width: 22 },
          { header: 'Evaluadores', key: 'evaluadores', width: 38 },
          { header: 'Calificacion', key: 'calificacion', width: 16 },
          { header: 'Exigencia', key: 'exigencia', width: 16 },
          { header: 'Brecha', key: 'brecha', width: 16 },
        ],
        this.dashboardData.empleadosEvaluados.map((employee) => ({
          empleado: this.getEmployeeName(employee),
          puesto: this.getEmployeePosition(employee),
          evaluaciones: this.formatInteger(this.getNumber(employee, ['evaluacionesConResultado'])),
          asignaciones: this.getEmployeeAssignmentsCount(employee),
          evaluadores: this.getEmployeeEvaluatorsSummary(employee),
          calificacion: this.formatScore(this.getNumber(employee, ['calificacionPromedio', 'resultadoPromedio'])),
          exigencia: this.formatScore(this.getNumber(employee, ['nivelExigenciaPromedio'])),
          brecha: this.formatGap(this.getNumber(employee, ['brechaPromedio'])),
        })),
      );

      addSheet(
        'Detalle individual',
        [
          { header: 'Empleado evaluado', key: 'empleado', width: 32 },
          { header: 'Puesto', key: 'puesto', width: 34 },
          { header: 'Evaluacion', key: 'evaluacion', width: 34 },
          { header: 'Escenario', key: 'escenario', width: 24 },
          { header: 'Evaluador', key: 'evaluador', width: 32 },
          { header: 'Dimension', key: 'dimension', width: 28 },
          { header: 'Criterio', key: 'criterio', width: 30 },
          { header: 'Item evaluativo', key: 'item', width: 58 },
          { header: 'Respuesta', key: 'respuesta', width: 24 },
          { header: 'Resultado', key: 'resultado', width: 14 },
          { header: 'Nivel esperado', key: 'exigencia', width: 16 },
          { header: 'Brecha', key: 'brecha', width: 14 },
          { header: 'Estado', key: 'estado', width: 18 },
        ],
        this.buildEmployeeDetailExportRows(),
        (row, rowData) => {
          const fill = this.getExcelToneFill(rowData?.tono);
          const font = this.getExcelToneFont(rowData?.tono);
          row.getCell('estado').fill = fill;
          row.getCell('estado').font = { ...font, bold: true };
          row.getCell('resultado').font = font;
          row.getCell('brecha').font = font;
        },
      );

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `Dashboard_Desempeno_${this.selectedOrganizationName.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
      console.error('Error al exportar dashboard de desempeno:', error);
      Swal.fire('Dashboard', 'No fue posible generar el archivo Excel.', 'error');
    }
  }

  hasAxisChart(options: Partial<DesDashboardChartOptions>): boolean {
    return Array.isArray(options.series) && options.series.some((serie) => Array.isArray(serie.data) && serie.data.length > 0);
  }

  hasDonutChart(options: Partial<DesDashboardChartOptions>): boolean {
    return Array.isArray(options.series2) && options.series2.length > 0 && options.series2.some((value) => Number(value) > 0);
  }

  getRowId(item: any, index = 0): number {
    return Number(
      item?.id ??
      item?.Id ??
      item?.evaluacionId ??
      item?.IdEvaluacion ??
      item?.modeloId ??
      item?.IdModelo ??
      item?.empleadoId ??
      item?.IdEmpleado ??
      item?.evaluadoId ??
      item?.IdEvaluado ??
      index + 1
    );
  }

  getModelName(model: any): string {
    return this.getText(model, ['modeloNombre', 'nombreModelo', 'nombre', 'Nombre', 'codigo'], 'Modelo sin nombre');
  }

  getEvaluationName(evaluation: any): string {
    return this.getText(evaluation, ['evaluacionNombre', 'nombreEvaluacion', 'evaluacion', 'nombre', 'Nombre'], 'Evaluacion sin nombre');
  }

  getStatusClass(status: any): string {
    const normalized = this.normalizeKey(String(status ?? ''));
    if (normalized.includes('ERROR') || normalized.includes('CANCEL')) return 'status-error';
    if (normalized.includes('CERR') || normalized.includes('PROCESO') || normalized.includes('CURSO')) return 'status-warn';
    if (normalized.includes('ACTIVO') || normalized.includes('ENVI') || normalized.includes('RESP') || normalized.includes('CONTEST')) return 'status-ok';
    return 'status-neutral';
  }

  getPuestoTags(evaluation: any): string[] {
    return this.getCollection(evaluation, ['puestos'])
      .map((item) => this.getText(item, ['puestoNombre', 'nombrePuesto', 'puesto', 'cargo', 'nombre']))
      .filter((item) => item !== '-');
  }

  getScenarioTags(evaluation: any): string[] {
    return this.getCollection(evaluation, ['escenarios'])
      .map((item) => this.getText(item, ['escenarioNombre', 'nombreEscenario', 'escenario', 'nombre']))
      .filter((item) => item !== '-');
  }

  getDimensionTags(evaluation: any): string[] {
    return this.getCollection(evaluation, ['dimensiones'])
      .map((item) => this.getText(item, ['dimensionNombre', 'nombreDimension', 'dimension', 'nombre']))
      .filter((item) => item !== '-');
  }

  getCriteriaTags(evaluation: any): string[] {
    return this.getCollection(evaluation, ['criterios'])
      .map((item) => this.getText(item, ['criterioNombre', 'nombreCriterio', 'criterio', 'nombre']))
      .filter((item) => item !== '-');
  }

  getEvaluationScenarioColumns(evaluation: any): ScenarioColumn[] {
    const columns = new Map<string, string>();

    this.getCollection(evaluation, ['empleados']).forEach((employee) => {
      this.getCollection(employee, ['escenarios']).forEach((scenario) => {
        const key = this.getScenarioKey(scenario);
        const label = this.getText(scenario, ['escenarioNombre', 'nombreEscenario', 'escenario', 'nombre', 'codigo'], key);
        if (key) {
          columns.set(key, label);
        }
      });
    });

    if (columns.size === 0) {
      this.getCollection(evaluation, ['escenarios']).forEach((scenario) => {
        const key = this.getScenarioKey(scenario);
        const label = this.getText(scenario, ['escenarioNombre', 'nombreEscenario', 'escenario', 'nombre', 'codigo'], key);
        if (key) {
          columns.set(key, label);
        }
      });
    }

    return Array.from(columns.entries()).map(([key, label]) => ({ key, label }));
  }

  getEmployeeName(employee: any): string {
    return this.getText(employee, ['empleadoNombre', 'nombreEmpleado', 'empleado', 'evaluado', 'fullName', 'nombreCompleto', 'nombre'], 'Empleado');
  }

  getEmployeePosition(employee: any): string {
    return this.getText(employee, ['puestoNombre', 'nombrePuesto', 'puesto', 'cargo', 'position'], 'Sin puesto');
  }

  getEmployeeScenarioValue(employee: any, column: ScenarioColumn): string {
    const scenario = this.getCollection(employee, ['escenarios'])
      .find((item) => this.getScenarioKey(item) === column.key);

    if (!scenario) {
      return '-';
    }

    const result = this.formatScore(this.getNumber(scenario, ['calificacionTotal', 'calificacionPromedio', 'calificacion', 'resultadoTotal', 'resultadoPromedio', 'resultado']));
    const target = this.formatScore(this.getNumber(scenario, ['nivelExigenciaTotal', 'nivelExigenciaPromedio', 'nivelExigencia']));
    const gap = this.formatGap(this.getNumber(scenario, ['brechaTotal', 'brechaPromedio', 'brecha']));

    return `${result} / ${target} (${gap})`;
  }

  getGroupedEmployeeEvaluations(employee: any): any[] {
    const encuestas = this.asArray(employee?.encuestas ?? employee?.Encuestas);
    return encuestas.length ? encuestas : this.asArray(employee?.evaluaciones ?? employee?.Evaluaciones);
  }

  getGroupedEmployeeScenarioLabels(employee: any): string {
    const labels = new Set<string>();

    this.getGroupedEmployeeEvaluations(employee).forEach((survey) => {
      const surveyScenario = this.getAssignmentScenarioName(survey);
      if (surveyScenario && surveyScenario !== '-') {
        labels.add(surveyScenario);
      }

      this.getCollection(survey, ['escenarios']).forEach((scenario) => {
        const label = this.getText(scenario, ['escenario', 'escenarioNombre', 'nombre', 'codigo'], '');
        if (label) {
          labels.add(label);
        }
      });
    });

    return labels.size ? Array.from(labels).join(', ') : '-';
  }

  getGroupedEmployeeEvaluationLabels(employee: any): string {
    const labels = Array.from(new Set(
      this.getGroupedEmployeeEvaluations(employee)
        .map((survey) => this.getEvaluationName(survey))
        .filter((label) => label && label !== 'Evaluacion sin nombre')
    ));

    return labels.length ? labels.join(', ') : '-';
  }

  getGroupedEmployeeDimensionLabels(employee: any): string {
    const labels = new Set<string>();

    this.getGroupedEmployeeEvaluations(employee).forEach((survey) => {
      this.getCollection(survey, ['dimensiones']).forEach((dimension) => {
        const label = this.getText(dimension, ['dimension', 'dimensionNombre', 'nombre', 'codigo'], '');
        if (label) {
          labels.add(label);
        }
      });

      this.getCollection(survey, ['escenarios']).forEach((scenario) => {
        this.getCollection(scenario, ['dimensiones']).forEach((dimension) => {
          const label = this.getText(dimension, ['dimension', 'dimensionNombre', 'nombre', 'codigo'], '');
          if (label) {
            labels.add(label);
          }
        });
      });
    });

    return labels.size ? Array.from(labels).join(', ') : '-';
  }

  getPositionName(row: any): string {
    return this.getText(row, ['puesto', 'puestoNombre', 'nombrePuesto', 'cargo', 'nombre'], 'Sin puesto');
  }

  getPositionEmployeeCount(row: any): number | null {
    const explicit = this.getNumber(row, ['empleadosEvaluados', 'empleadosConResultado']);
    return explicit ?? this.asArray(row?.empleados ?? row?.Empleados).length;
  }

  getPositionSurveyCount(row: any): number | null {
    return this.getNumber(row, ['encuestasRespondidas', 'evaluaciones', 'asignacionesRealizadas', 'totalAsignacionesRealizadas']);
  }

  getPositionItemCount(row: any): number | null {
    return this.getNumber(row, ['itemsRespondidos', 'totalItemsRespondidos']);
  }

  getEmployeeSurveyCount(employee: any): number {
    return this.getNumber(employee, ['encuestasRespondidas', 'totalAsignacionesRealizadas', 'asignacionesRealizadas']) ??
      this.getGroupedEmployeeEvaluations(employee).length;
  }

  getEmployeeItemCount(employee: any): number {
    return this.getNumber(employee, ['itemsRespondidos', 'totalItemsRespondidos']) ??
      this.getGroupedEmployeeEvaluations(employee).reduce(
        (total, survey) => total + this.countItemsInSurvey(survey),
        0
      );
  }

  private countItemsInSurvey(survey: any): number {
    const directItems = this.asArray(survey?.items ?? survey?.Items);
    if (directItems.length > 0) {
      return directItems.length;
    }

    return this.getSurveyDimensions(survey)
      .reduce((dimensionTotal, dimension) => {
        return dimensionTotal + this.countItemsInDimension(dimension);
      }, 0);
  }

  private getSurveyDimensions(survey: any): any[] {
    const directDimensions = this.getCollection(survey, ['dimensiones', 'Dimensiones']);
    if (directDimensions.length > 0) {
      return directDimensions;
    }

    return this.getCollection(survey, ['escenarios', 'Escenarios'])
      .flatMap((scenario) => this.getCollection(scenario, ['dimensiones', 'Dimensiones']));
  }

  private countItemsInDimension(dimension: any): number {
    const explicit = this.getNumber(dimension, ['itemsRespondidos']);
    if (explicit !== null) {
      return explicit;
    }

    return this.getCollection(dimension, ['criterios']).reduce((total, criterion) => {
      const criterionItems = this.getNumber(criterion, ['itemsRespondidos']);
      return total + (criterionItems ?? this.getCollection(criterion, ['items']).length);
    }, 0);
  }

  getModelId(model: any): number {
    return Number(model?.modeloId ?? model?.IdModelo ?? model?.idModelo ?? model?.id ?? model?.Id ?? 0) || 0;
  }

  getEvaluationModelId(evaluation: any): number {
    return Number(evaluation?.modeloId ?? evaluation?.IdModelo ?? evaluation?.idModelo ?? 0) || 0;
  }

  getEvaluationId(evaluation: any): number {
    return Number(evaluation?.evaluacionId ?? evaluation?.IdEvaluacion ?? evaluation?.idEvaluacion ?? evaluation?.id ?? evaluation?.Id ?? 0) || 0;
  }

  getEmployeeId(employee: any): number {
    return Number(employee?.empleadoId ?? employee?.IdEmpleado ?? employee?.idEmpleado ?? employee?.evaluadoId ?? employee?.IdEvaluado ?? employee?.id ?? employee?.Id ?? 0) || 0;
  }

  hasEvaluationResults(evaluation: any): boolean {
    const explicit = evaluation?.tieneResultados ?? evaluation?.TieneResultados;

    if (typeof explicit === 'boolean') {
      return explicit;
    }

    if (explicit !== undefined && explicit !== null && explicit !== '') {
      return Number(explicit) === 1 || this.normalizeKey(String(explicit)) === 'TRUE' || this.normalizeKey(String(explicit)) === 'SI';
    }

    return (this.getEvaluationRealized(evaluation) ?? 0) > 0 ||
      (this.getNumber(evaluation, ['empleadosConResultado']) ?? 0) > 0 ||
      this.getEvaluationScore(evaluation) !== null ||
      this.getCollection(evaluation, ['empleados']).length > 0;
  }

  getEvaluationProgress(evaluation: any): number | null {
    const avance = this.getObject(evaluation?.avance ?? evaluation?.Avance);
    return this.getNumber(avance, ['porcentajeAvance', 'porcentajeRealizacion']) ??
      this.getNumber(evaluation, ['porcentajeRealizacion', 'porcentajeAvance', 'avance']);
  }

  getEvaluationRealized(evaluation: any): number | null {
    const avance = this.getObject(evaluation?.avance ?? evaluation?.Avance);
    return this.getNumber(avance, ['realizadas', 'respondidas']) ??
      this.getNumber(evaluation, ['realizadas', 'respondidas']);
  }

  getEvaluationScore(evaluation: any): number | null {
    return this.getNumber(evaluation, ['calificacionPromedio', 'resultadoTotal', 'resultadoPromedio', 'resultado']);
  }

  getModelProgress(model: any): number | null {
    return this.getNumber(model, ['porcentajeRealizacion', 'porcentajeAvance']);
  }

  getModelRealized(model: any): number | null {
    return this.getNumber(model, ['realizadas', 'respondidas']);
  }

  getBreakdownKey(row: any): string {
    if (this.selectedBreakdownMode === 'escenario') {
      return this.getScenarioKey(row);
    }

    return String(
      row?.puestoId ??
      row?.IdPuesto ??
      row?.idPuesto ??
      row?.puestoCodigo ??
      row?.codigo ??
      row?.puesto ??
      row?.nombre ??
      ''
    ).trim();
  }

  getBreakdownName(row: any): string {
    return this.selectedBreakdownMode === 'escenario'
      ? this.getText(row, ['escenarioNombre', 'nombreEscenario', 'escenario', 'nombre', 'escenarioCodigo', 'codigo'], 'Escenario')
      : this.getText(row, ['puestoNombre', 'nombrePuesto', 'puesto', 'cargo', 'nombre', 'puestoCodigo', 'codigo'], 'Puesto');
  }

  getBreakdownEmployees(row: any): string {
    return this.formatInteger(this.getNumber(row, ['empleadosEvaluados', 'empleadosConResultado', 'empleados', 'asignacionesRealizadas']));
  }

  getBreakdownScore(row: any): string {
    return this.formatScore(this.getNumber(row, ['calificacionPromedio', 'resultadoPromedio', 'resultadoTotal', 'resultado']));
  }

  getDetailScenarioLabel(item: any): string {
    return this.getText(item, ['escenarioNombre', 'nombreEscenario', 'escenario', 'escenarioCodigo'], '-');
  }

  getEmployeeSummaryEvaluations(employee: any): any[] {
    return this.getCollection(employee, ['evaluaciones']).slice(0, 3);
  }

  getEmployeeAssignmentsCount(employee: any): string {
    const total = this.getNumber(employee, ['totalAsignacionesRealizadas', 'asignacionesRealizadas']);
    return this.formatInteger(total ?? this.getCollection(employee, ['asignacionesRealizadas', 'asignaciones']).length);
  }

  getEmployeeEvaluatorsSummary(employee: any): string {
    const explicit = this.getText(employee, ['evaluadoresResumen'], '');
    if (explicit) {
      return explicit;
    }

    const evaluators = this.getCollection(employee, ['asignacionesRealizadas', 'asignaciones'])
      .map((assignment) => this.getText(assignment, ['evaluador'], ''))
      .filter(Boolean);

    return Array.from(new Set(evaluators)).join(', ') || '-';
  }

  getEvaluationAssignments(evaluation: any): any[] {
    return this.getCollection(evaluation, ['asignacionesRealizadas', 'asignaciones', 'AsignacionesRealizadas']);
  }

  getAssignmentStatus(assignment: any): string {
    return this.getText(assignment, ['estadoRespuesta', 'estadoAsignacion', 'estado'], '-');
  }

  getAssignmentDate(assignment: any): string {
    return this.formatDate(assignment?.fechaFinalizacion ?? assignment?.FechaFinalizacion ?? assignment?.fechaRespuesta ?? assignment?.FechaRespuesta);
  }

  isSelectedBreakdown(row: any): boolean {
    return !!this.selectedBreakdownKey && this.getBreakdownKey(row) === this.selectedBreakdownKey;
  }

  isSelectedEmployee(employee: any): boolean {
    const selectedEmployeeId = this.getEmployeeId(this.selectedEmployee);
    return selectedEmployeeId > 0 && this.getEmployeeId(employee) === selectedEmployeeId;
  }

  getRankingTitle(item: any): string {
    return this.getText(item, ['criterioNombre', 'nombreCriterio', 'criterio', 'nombre'], 'Criterio sin nombre');
  }

  getRankingMeta(item: any): string {
    const parts = [
      this.getText(item, ['dimensionNombre', 'nombreDimension', 'dimension'], ''),
      this.getText(item, ['puestoNombre', 'nombrePuesto', 'puesto', 'cargo'], ''),
      this.getText(item, ['escenarioNombre', 'nombreEscenario', 'escenario'], ''),
    ].filter(Boolean);

    return parts.length ? parts.join(' · ') : 'Sin detalle';
  }

  formatInteger(value: number | null): string {
    if (value === null) return '-';
    return Math.round(value).toLocaleString('es-GT');
  }

  formatPercent(value: number | null): string {
    if (value === null) return '-';
    const normalized = Math.abs(value) > 0 && Math.abs(value) <= 1 ? value * 100 : value;
    return `${this.roundTo(normalized, 1).toLocaleString('es-GT')}%`;
  }

  formatScore(value: number | null): string {
    if (value === null) return '-';
    return this.roundTo(value, 2).toLocaleString('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatGap(value: number | null): string {
    if (value === null) return '-';
    const rounded = this.roundTo(value, 2);
    const prefix = rounded > 0 ? '+' : '';
    return `${prefix}${rounded.toLocaleString('es-GT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  formatDate(value: any): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('es-GT');
  }

  trackById = (index: number, item: any): number => {
    return this.getRowId(item, index);
  };

  trackByScenario = (index: number, item: ScenarioColumn): string => {
    return item?.key ?? String(index);
  };

  private async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;
    this.dataSourceOrganizations = [];
    this.selectedOrganizationId = null;
    this.selectedModelId = null;
    this.selectedEvaluationId = null;
    this.selectedBreakdownKey = null;
    this.selectedPositionKey = null;
    this.selectedEmployeeId = null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.dashboardData = null;
    this.groupedDashboardSource = null;
    this.groupedDashboardPayload = null;
    this.dashboardEmployees = [];
    this.modelSelectOptions = [];
    this.dashboardModels = [];
    this.resetCharts();
    let initialOrganizationId: number | null = null;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.dataSourceOrganizations = this.extractCollection(response)
        .map((item) => this.normalizeOrganization(item))
        .filter((item) => item.Id > 0 && item.Nombre.length > 0);

      if (this.dataSourceOrganizations.length > 0) {
        initialOrganizationId = this.dataSourceOrganizations[0].Id;
        this.selectedOrganizationId = initialOrganizationId;
      }
    } catch (error: any) {
      console.error('Error al cargar organizaciones de desempeno:', error);
      Swal.fire(
        this.t('DESEMPENO_MENUITEMS.DASHBOARD.MESSAGES.LOAD_ORGS_ERROR_TITLE'),
        this.t('DESEMPENO_MENUITEMS.DASHBOARD.MESSAGES.LOAD_ORGS_ERROR_TEXT'),
        'error'
      );
    } finally {
      this.isLoadingOrganizations = false;
    }

    if (initialOrganizationId) {
      await this.loadDashboardModels(initialOrganizationId);
    }
  }

  private async loadDashboardModels(idOrganizacion: number): Promise<void> {
    const loadSequence = ++this.dashboardLoadSequence;
    this.isLoadingModels = true;
    this.isLoadingDashboard = false;
    this.isLoadingEmployees = false;
    this.modelSelectOptions = [];
    this.dashboardModels = [];
    this.dashboardData = null;
    this.groupedDashboardSource = null;
    this.groupedDashboardPayload = null;
    this.clearAiActionPlan();
    this.selectedModelId = null;
    this.selectedEvaluationId = null;
    this.selectedBreakdownKey = null;
    this.selectedPositionKey = null;
    this.selectedEmployeeId = null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.resetCharts();

    try {
      const response = await firstValueFrom(
        this.organizacionService.getDesempenoModelsSelectHttp(idOrganizacion)
      );

      if (
        loadSequence !== this.dashboardLoadSequence ||
        this.selectedOrganizationId !== idOrganizacion
      ) {
        return;
      }

      const models = this.extractDashboardModelItems(response)
        .map((item, index) => this.normalizeDashboardModelOption(item, index))
        .filter((model) => model.id > 0 && model.nombre.length > 0)
        .sort((left, right) => right.id - left.id);

      this.modelSelectOptions = [...models];
      this.dashboardModels = [...models];
    } catch (error) {
      if (
        loadSequence !== this.dashboardLoadSequence ||
        this.selectedOrganizationId !== idOrganizacion
      ) {
        return;
      }

      console.error('Error al cargar modelos de desempeno:', error);
      this.modelSelectOptions = [];
      this.dashboardModels = [];
      Swal.fire('Dashboard', 'No fue posible cargar los modelos de desempeño.', 'error');
    } finally {
      if (
        loadSequence === this.dashboardLoadSequence &&
        this.selectedOrganizationId === idOrganizacion
      ) {
        this.isLoadingModels = false;
        this.cdr.detectChanges();
      }
    }
  }

  private async loadDashboard(idOrganizacion: number, modeloId: number): Promise<void> {
    const loadSequence = ++this.dashboardLoadSequence;
    this.isLoadingDashboard = true;
    this.isLoadingEmployees = true;
    this.clearAiActionPlan();
    this.dashboardData = null;
    this.groupedDashboardSource = null;
    this.selectedBreakdownKey = null;
    this.selectedPositionKey = null;
    this.selectedEmployeeId = null;
    this.expandedEmployeeRowKey = null;
    this.dimensionEmployeeFilterText = '';
    this.resetCharts();
    this.cdr.detectChanges();
    let groupedPayload: any = null;

    try {
      const dashboardResponsePromise = this.organizacionService.getDesempenoDashboard(idOrganizacion)
        .catch((error) => {
          console.error('Error al cargar datos complementarios del dashboard de desempeno:', error);
          return null;
        });
      const employeesPromise = this.loadDashboardEmployees(idOrganizacion)
        .catch((error) => {
          console.error('Error al cargar empleados para dashboard de desempeno:', error);
          return [];
        });
      const groupedResponsePromise = this.organizacionService.getDesempenoGroupedResponsesByModel(
        modeloId,
        idOrganizacion
      );
      const [groupedResponse, dashboardResponse, employees] = await Promise.all([
        groupedResponsePromise,
        dashboardResponsePromise,
        employeesPromise,
      ]);

      if (
        loadSequence !== this.dashboardLoadSequence ||
        this.selectedOrganizationId !== idOrganizacion ||
        this.selectedModelId !== modeloId
      ) {
        return;
      }

      groupedPayload = this.extractPayload(groupedResponse);
      this.groupedDashboardPayload = groupedPayload;
      this.dashboardEmployees = employees;
      this.groupedDashboardSource = this.getSelectedGroupedSource(groupedPayload);
      const currentDashboard = this.normalizeDashboardData(this.extractPayload(dashboardResponse));
      const groupedDashboard = this.normalizeGroupedResponsesDashboardData(
        groupedPayload,
        currentDashboard
      );
      this.dashboardData = this.enrichDashboardData(
        this.mergeDashboardData(currentDashboard, groupedDashboard)
      );
      this.selectInitialEvaluation();
      this.resetDrilldownSelection();
      this.rebuildCharts();
      this.isLoadingDashboard = false;
      this.isLoadingEmployees = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar dashboard de desempeno:', error);
      if (loadSequence === this.dashboardLoadSequence) {
        if (groupedPayload) {
          this.groupedDashboardPayload = groupedPayload;
          this.dashboardData = this.enrichDashboardData(this.buildFallbackGroupedDashboardData(groupedPayload));
          this.selectInitialEvaluation();
          this.resetDrilldownSelection();
          this.rebuildCharts();
          this.cdr.detectChanges();
          return;
        }

        this.dashboardData = null;
        this.resetCharts();
        this.cdr.detectChanges();
        Swal.fire('Dashboard', 'No fue posible cargar la informacion del dashboard.', 'error');
      }
    } finally {
      if (loadSequence === this.dashboardLoadSequence) {
        this.isLoadingDashboard = false;
        this.isLoadingEmployees = false;
        this.cdr.detectChanges();
      }
    }
  }

  private async loadAiActionPlan(force = false): Promise<void> {
    if (!this.selectedOrganizationId || !this.selectedModelId) {
      return;
    }

    const requestKey = `${this.selectedOrganizationId}|${this.selectedModelId}`;
    if (!force && this.aiActionPlanLoadedKey === requestKey) {
      return;
    }

    const loadSequence = ++this.aiActionPlanLoadSequence;
    this.isLoadingAiActionPlan = true;
    this.aiActionPlanError = null;
    this.cdr.detectChanges();

    try {
      const response = await this.organizacionService.getDesempenoAiActionPlans(
        this.selectedOrganizationId,
        this.selectedModelId
      );

      if (
        loadSequence !== this.aiActionPlanLoadSequence ||
        requestKey !== `${this.selectedOrganizationId}|${this.selectedModelId}`
      ) {
        return;
      }

      this.aiActionPlanRecord = this.getLatestAiActionPlanRecord(response);
      this.aiActionPlanLoadedKey = requestKey;
    } catch (error) {
      if (loadSequence !== this.aiActionPlanLoadSequence) {
        return;
      }

      console.error('Error al cargar planes de accion IA de desempeno:', error);
      this.aiActionPlanRecord = null;
      this.aiActionPlanLoadedKey = requestKey;
      this.aiActionPlanError = 'No fue posible cargar el análisis IA guardado.';
    } finally {
      if (loadSequence === this.aiActionPlanLoadSequence) {
        this.isLoadingAiActionPlan = false;
        this.cdr.detectChanges();
      }
    }
  }

  async generateAiActionPlan(force = false): Promise<void> {
    if (!this.selectedOrganizationId || !this.selectedModelId) {
      Swal.fire('Análisis IA', 'Selecciona una organización y un modelo antes de generar el plan.', 'warning');
      return;
    }

    const payload = this.buildAiActionPlanRequestPayload(force);
    if (!payload['resultados']?.data) {
      Swal.fire('Análisis IA', 'No hay resultados individuales suficientes para enviar al análisis IA.', 'warning');
      return;
    }

    const requestKey = `${this.selectedOrganizationId}|${this.selectedModelId}`;
    const loadSequence = ++this.aiActionPlanLoadSequence;
    this.isGeneratingAiActionPlan = true;
    this.isLoadingAiActionPlan = false;
    this.aiActionPlanError = null;
    this.cdr.detectChanges();

    try {
      const response = await this.organizacionService.generateDesempenoAiActionPlan(payload);

      if (
        loadSequence !== this.aiActionPlanLoadSequence ||
        requestKey !== `${this.selectedOrganizationId}|${this.selectedModelId}`
      ) {
        return;
      }

      const record = this.getLatestAiActionPlanRecord(response);
      if (!record) {
        throw new Error('El endpoint no retornó un plan de acción IA válido.');
      }

      this.aiActionPlanRecord = record;
      this.aiActionPlanLoadedKey = requestKey;
      Swal.fire('Análisis IA', 'El plan de acción fue generado correctamente.', 'success');
    } catch (error) {
      if (loadSequence !== this.aiActionPlanLoadSequence) {
        return;
      }

      console.error('Error al generar planes de accion IA de desempeno:', error);
      this.aiActionPlanError = 'No fue posible generar el análisis IA.';
      Swal.fire('Análisis IA', 'No fue posible generar el plan de acción IA.', 'error');
    } finally {
      if (loadSequence === this.aiActionPlanLoadSequence) {
        this.isGeneratingAiActionPlan = false;
        this.cdr.detectChanges();
      }
    }
  }

  private buildAiActionPlanRequestPayload(force = false): Record<string, any> {
    const groupedData = this.getCachedGroupedResultsForAi();

    return {
      organizacionId: this.selectedOrganizationId,
      modeloId: this.selectedModelId,
      forzarRegeneracion: force,
      resultados: groupedData
        ? {
            ok: true,
            data: groupedData,
          }
        : null,
    };
  }

  private getCachedGroupedResultsForAi(): any | null {
    const candidate = this.groupedDashboardSource ??
      this.getSelectedGroupedSource(this.groupedDashboardPayload);

    return candidate && typeof candidate === 'object' && Object.keys(candidate).length > 0
      ? candidate
      : null;
  }

  private clearAiActionPlan(): void {
    this.aiActionPlanLoadSequence++;
    this.aiActionPlanRecord = null;
    this.aiActionPlanError = null;
    this.isLoadingAiActionPlan = false;
    this.isGeneratingAiActionPlan = false;
    this.aiActionPlanLoadedKey = null;
  }

  private getLatestAiActionPlanRecord(response: any): any | null {
    const payload = this.extractPayload(response);

    if (payload?.resultado ?? payload?.Resultado) {
      return payload;
    }

    if (this.isAiActionPlanPayload(payload)) {
      return this.wrapAiActionPlanPayload(payload);
    }

    const directItem = payload?.item ?? payload?.Item ?? payload?.plan ?? payload?.Plan;
    if (directItem?.resultado ?? directItem?.Resultado) {
      return directItem;
    }

    if (this.isAiActionPlanPayload(directItem)) {
      return this.wrapAiActionPlanPayload(directItem);
    }

    const items = this.asArray(payload?.items ?? payload?.Items ?? payload);

    if (!items.length) {
      return null;
    }

    const latest = [...items].sort((left, right) => {
      const leftTime = new Date(left?.fechaCreacion ?? left?.FechaCreacion ?? 0).getTime();
      const rightTime = new Date(right?.fechaCreacion ?? right?.FechaCreacion ?? 0).getTime();
      return (Number.isFinite(rightTime) ? rightTime : 0) - (Number.isFinite(leftTime) ? leftTime : 0);
    })[0] ?? null;

    return this.isAiActionPlanPayload(latest)
      ? this.wrapAiActionPlanPayload(latest)
      : latest;
  }

  private isAiActionPlanPayload(value: any): boolean {
    const plan = this.getObject(value);
    if (!Object.keys(plan).length) {
      return false;
    }

    return Boolean(
      this.getText(plan, ['resumenEjecutivo', 'ResumenEjecutivo'], '') ||
      this.getCollection(plan, ['hallazgosClave', 'HallazgosClave']).length ||
      this.getCollection(plan, ['planAccionRecomendado', 'PlanAccionRecomendado']).length ||
      this.getCollection(plan, ['planesPorPuesto', 'PlanesPorPuesto']).length ||
      this.getCollection(plan, ['planesPorEmpleado', 'PlanesPorEmpleado']).length
    );
  }

  private wrapAiActionPlanPayload(plan: any): any {
    const normalizedPlan = this.getObject(plan);

    return {
      ...normalizedPlan,
      resultado: normalizedPlan,
      modeloIA: normalizedPlan['modeloIA'] ?? normalizedPlan['ModeloIA'],
      promptVersion: normalizedPlan['promptVersion'] ?? normalizedPlan['PromptVersion'],
      fechaCreacion: normalizedPlan['fechaCreacion'] ?? normalizedPlan['FechaCreacion'],
      cache: normalizedPlan['cache'] ?? normalizedPlan['Cache'],
    };
  }

  private async loadDashboardEmployees(idOrganizacion: number): Promise<DashboardEmployeeDirectoryItem[]> {
    const response = await this.organizacionService.getDesempenoEmployees({
      idOrganizacion,
      activo: true,
    });

    return this.extractCollection(response)
      .map((item) => this.normalizeDashboardEmployee(item))
      .filter((employee) => employee.id > 0);
  }

  private normalizeOrganization(item: any): DashboardOrganization {
    return {
      Id: Number(item?.Id ?? item?.IdOrganizacion ?? item?.id ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private normalizeDashboardModelOption(item: any, index = 0): DashboardModelOption {
    const id = Number(
      item?.id ??
      item?.Id ??
      item?.modeloId ??
      item?.IdModelo ??
      item?.idModelo ??
      0
    ) || 0;
    const nombre = String(
      item?.nombre ??
      item?.Nombre ??
      item?.modelo ??
      item?.modeloNombre ??
      item?.codigo ??
      item?.Codigo ??
      (id ? `Modelo ${id}` : `Modelo ${index + 1}`)
    ).trim();

    return {
      id,
      nombre,
      codigo: this.toOptionalText(item?.codigo ?? item?.Codigo ?? item?.modeloCodigo),
      raw: item,
    };
  }

  private normalizeDashboardData(rawData: any): DesDashboardData {
    const data = rawData ?? {};

    return {
      organizacionId: this.getNumber(data, ['organizacionId', 'IdOrganizacion']),
      fechaGeneracion: this.toOptionalText(data?.fechaGeneracion ?? data?.FechaGeneracion),
      resumen: data?.resumen ?? data?.Resumen ?? {},
      modelos: this.asArray(data?.modelos ?? data?.Modelos),
      evaluaciones: this.asArray(data?.evaluaciones ?? data?.Evaluaciones),
      resultadosPorPuesto: this.asArray(data?.resultadosPorPuesto ?? data?.ResultadosPorPuesto),
      resultadosPorEscenario: this.asArray(data?.resultadosPorEscenario ?? data?.ResultadosPorEscenario),
      resultadosPorDimension: this.asArray(data?.resultadosPorDimension ?? data?.ResultadosPorDimension),
      brechasCriticas: this.asArray(data?.brechasCriticas ?? data?.BrechasCriticas),
      fortalezas: this.asArray(data?.fortalezas ?? data?.Fortalezas),
      asignacionesPorEstado: this.asArray(data?.asignacionesPorEstado ?? data?.AsignacionesPorEstado),
      enviosPorEstado: this.asArray(data?.enviosPorEstado ?? data?.EnviosPorEstado),
      empleadosEvaluados: this.asArray(data?.empleadosEvaluados ?? data?.EmpleadosEvaluados),
    };
  }

  private buildFallbackGroupedDashboardData(rawData: any): DesDashboardData {
    const source = this.getSelectedGroupedSource(rawData);
    const selectedModelOption = this.modelSelectOptions.find((model) => model.id === this.selectedModelId) ??
      this.dashboardModels.find((model) => model.id === this.selectedModelId);
    const modelId = this.getModelId(source) || this.selectedModelId || selectedModelOption?.id || 0;
    const modelName = this.getText(
      {
        ...source,
        nombre: selectedModelOption?.nombre,
      },
      ['modelo', 'modeloNombre', 'nombre', 'Nombre'],
      modelId ? `Modelo ${modelId}` : 'Modelo'
    );
    const puestos = this.getGroupedSourcePositions(source);
    const empleadosEvaluados = puestos.flatMap((puestoRaw) => {
      const puesto = this.getText(puestoRaw, ['puesto', 'puestoNombre', 'cargo', 'nombre'], 'Sin puesto');

      return this.asArray(puestoRaw?.empleados ?? puestoRaw?.Empleados).map((employeeRaw) => ({
        ...employeeRaw,
        puesto,
        puestoId: this.getNumber(puestoRaw, ['puestoId', 'IdPuesto', 'idPuesto']),
        evaluacionesConResultado: this.asArray(employeeRaw?.encuestas ?? employeeRaw?.Encuestas).length,
      }));
    });
    const resultadosPorPuesto = puestos.map((puestoRaw) => ({
      ...puestoRaw,
      puestoId: this.getNumber(puestoRaw, ['puestoId', 'IdPuesto', 'idPuesto']),
      puesto: this.getText(puestoRaw, ['puesto', 'puestoNombre', 'cargo', 'nombre'], 'Sin puesto'),
      empleadosEvaluados: this.getNumber(puestoRaw, ['empleadosEvaluados', 'empleados']) ??
        this.asArray(puestoRaw?.empleados ?? puestoRaw?.Empleados).length,
      encuestasRespondidas: this.getNumber(puestoRaw, ['encuestasRespondidas']),
      itemsRespondidos: this.getNumber(puestoRaw, ['itemsRespondidos']),
    }));
    const resumen = {
      ...(source?.resumen ?? {}),
      totalModelos: this.modelSelectOptions.length || this.dashboardModels.length || 1,
      modelosActivos: this.modelSelectOptions.length || this.dashboardModels.length || 1,
      totalEvaluaciones: this.getNumber(source?.resumen, ['totalEvaluaciones']) ?? 0,
      totalEncuestasRespondidas: this.getNumber(source?.resumen, ['totalEncuestasRespondidas']) ?? 0,
      totalEncuestasConDetalleVisible: this.getNumber(source?.resumen, ['totalEncuestasConDetalleVisible']) ?? 0,
      totalPuestos: puestos.length,
      empleadosConResultado: empleadosEvaluados.length,
      totalEmpleadosEvaluados: empleadosEvaluados.length,
      totalItemsRespondidos: this.getNumber(source?.resumen, ['totalItemsRespondidos']) ?? 0,
    };

    return {
      organizacionId: this.getNumber(source, ['organizacionId', 'IdOrganizacion']),
      fechaGeneracion: this.toOptionalText(source?.fechaGeneracion ?? source?.FechaGeneracion),
      resumen,
      modelos: [{
        ...(selectedModelOption?.raw ?? {}),
        id: modelId,
        modeloId: modelId,
        nombre: modelName,
        modelo: modelName,
        totalEvaluaciones: this.getNumber(resumen, ['totalEvaluaciones']) ?? 0,
        empleadosConResultado: empleadosEvaluados.length,
      }],
      evaluaciones: [],
      resultadosPorPuesto,
      resultadosPorEscenario: [],
      resultadosPorDimension: [],
      brechasCriticas: [],
      fortalezas: [],
      asignacionesPorEstado: [],
      enviosPorEstado: [],
      empleadosEvaluados,
    };
  }

  private getSelectedGroupedSource(rawData: any): any {
    const payload = this.extractPayload(rawData);
    const sourceItems = Array.isArray(payload)
      ? payload
      : [
          ...this.asArray(payload?.items ?? payload?.Items),
          ...this.asArray(payload?.modelos ?? payload?.Modelos),
          ...this.asArray(payload?.resultados ?? payload?.Resultados),
          payload ?? {},
        ];

    return sourceItems.find((item) => this.getModelId(item) === this.selectedModelId) ?? sourceItems[0] ?? {};
  }

  private normalizeGroupedResponsesDashboardData(rawData: any, currentData: DesDashboardData): DesDashboardData {
    const selectedSource = this.getSelectedGroupedSource(rawData);
    const selectedModelOption = this.modelSelectOptions.find((model) => model.id === this.selectedModelId) ??
      this.dashboardModels.find((model) => model.id === this.selectedModelId);
    const modelId = this.getModelId(selectedSource) || this.selectedModelId || selectedModelOption?.id || 0;
    const modelName = this.getText(
      {
        ...selectedSource,
        nombre: selectedModelOption?.nombre,
      },
      ['modelo', 'modeloNombre', 'nombre', 'Nombre'],
      modelId ? `Modelo ${modelId}` : 'Modelo'
    );
    const modelCode = this.toOptionalText(selectedSource?.modeloCodigo ?? selectedSource?.codigo ?? selectedModelOption?.codigo);
    const puestos = this.getGroupedSourcePositions(selectedSource);
    const positionAggregates = new Map<string, any>();
    const scenarioAggregates = new Map<string, any>();
    const dimensionAggregates = new Map<string, any>();
    const criterionAggregates = new Map<string, any>();
    const assignmentStatusAggregates = new Map<string, any>();
    const empleadosEvaluados: any[] = [];
    let totalAssignments = 0;
    let totalItems = 0;

    puestos.forEach((puestoRaw) => {
      const puestoId = this.getNumber(puestoRaw, ['puestoId', 'IdPuesto', 'idPuesto']);
      const puesto = this.getText(puestoRaw, ['puesto', 'puestoNombre', 'cargo', 'nombre'], 'Sin puesto');
      const puestoKey = this.getPositionKey(puestoId, puesto);
      const empleados = this.asArray(puestoRaw?.empleados ?? puestoRaw?.Empleados);

      empleados.forEach((empleadoRaw) => {
        const empleadoId = this.getEmployeeId(empleadoRaw);
        const empleado = this.getEmployeeName(empleadoRaw);
        const email = this.toOptionalText(empleadoRaw?.email ?? empleadoRaw?.Email);
        const employeeEvaluations: any[] = [];
        const employeeAssignments: any[] = [];
        const employeeScenarioAggregates = new Map<string, any>();
        const employeeDimensionAggregates = new Map<string, any>();
        const employeeCriterionAggregates = new Map<string, any>();
        let employeeItems = 0;

        this.asArray(empleadoRaw?.encuestas ?? empleadoRaw?.Encuestas).forEach((encuestaRaw) => {
          const evaluacionId = this.getEvaluationId(encuestaRaw);
          const evaluacion = this.getEvaluationName(encuestaRaw);
          const escenarioCodigo = this.getAssignmentScenarioKey(encuestaRaw);
          const escenario = this.getAssignmentScenarioName(encuestaRaw);
          const dimensions = this.normalizeGroupedDimensions(
            encuestaRaw,
            {
              modeloId: modelId,
              modelo: modelName,
              evaluacionId,
              evaluacion,
              empleadoId,
              empleado,
              puestoId,
              puesto,
              puestoKey,
              escenarioCodigo,
              escenario,
            }
          );
          const criteria = dimensions.flatMap((dimension) => this.getCollection(dimension, ['criterios']));
          const itemsRespondidos = criteria.reduce(
            (total, criterion) => total + (this.getNumber(criterion, ['itemsRespondidos']) ?? 0),
            0
          );
          const calificacionTotal = this.weightedAverageFromRows(dimensions, ['calificacion', 'resultado'], ['ponderacion']);
          const nivelExigenciaTotal = this.weightedAverageFromRows(dimensions, ['nivelExigencia'], ['ponderacion']);
          const brechaTotal = this.calculateGap(calificacionTotal, nivelExigenciaTotal);
          const assignment = {
            asignacionId: this.getNumber(encuestaRaw, ['asignacionId', 'IdAsignacion']),
            evaluacionId,
            evaluacion,
            modeloId: modelId,
            modelo: modelName,
            empleadoId,
            empleado,
            email,
            puestoId,
            puesto,
            puestoKey,
            escenarioId: this.getNumber(encuestaRaw, ['escenarioId', 'IdEscenario']),
            escenarioCodigo,
            escenario,
            estadoAsignacion: this.getText(encuestaRaw, ['estadoAsignacion', 'EstadoAsignacion'], '-'),
            estadoRespuesta: this.getText(encuestaRaw, ['estadoRespuesta', 'EstadoRespuesta'], '-'),
            fechaInicioRespuesta: encuestaRaw?.fechaInicioRespuesta ?? encuestaRaw?.FechaInicioRespuesta ?? null,
            fechaRespuesta: encuestaRaw?.fechaRespuesta ?? encuestaRaw?.FechaRespuesta ?? null,
            fechaFinalizacion: encuestaRaw?.fechaFinalizacion ?? encuestaRaw?.FechaFinalizacion ?? null,
            calificacion: calificacionTotal,
            resultado: calificacionTotal,
            nivelExigencia: nivelExigenciaTotal,
            brecha: brechaTotal,
          };
          const scenarioRow = {
            escenarioId: assignment.escenarioId,
            escenarioCodigo,
            escenario,
            calificacion: calificacionTotal,
            resultado: calificacionTotal,
            calificacionPromedio: calificacionTotal,
            resultadoPromedio: calificacionTotal,
            nivelExigencia: nivelExigenciaTotal,
            nivelExigenciaPromedio: nivelExigenciaTotal,
            brecha: brechaTotal,
            brechaPromedio: brechaTotal,
            empleadosEvaluados: 1,
            asignacionesRealizadas: 1,
            itemsRespondidos,
          };
          const evaluationSummary = {
            evaluacionId,
            id: evaluacionId,
            modeloId: modelId,
            modelo: modelName,
            evaluacion,
            nombre: evaluacion,
            fechaInicio: encuestaRaw?.fechaInicioEvaluacion ?? encuestaRaw?.FechaInicioEvaluacion ?? null,
            fechaCierre: encuestaRaw?.fechaCierreEvaluacion ?? encuestaRaw?.FechaCierreEvaluacion ?? null,
            tieneResultados: true,
            realizadas: 1,
            avance: {
              realizadas: 1,
              porcentajeAvance: 100,
            },
            calificacionTotal,
            resultadoTotal: calificacionTotal,
            calificacionPromedio: calificacionTotal,
            resultadoPromedio: calificacionTotal,
            nivelExigenciaTotal,
            nivelExigenciaPromedio: nivelExigenciaTotal,
            brechaTotal,
            brechaPromedio: brechaTotal,
            itemsRespondidos,
            escenarios: [scenarioRow],
            dimensiones: dimensions,
            criterios: criteria,
            asignacionesRealizadas: [assignment],
          };

          employeeEvaluations.push(evaluationSummary);
          employeeAssignments.push(assignment);
          totalAssignments += 1;
          totalItems += itemsRespondidos;
          employeeItems += itemsRespondidos;

          this.addDashboardAggregate(scenarioAggregates, escenarioCodigo, scenarioRow, calificacionTotal, nivelExigenciaTotal, empleadoId, 1, itemsRespondidos);
          this.addDashboardAggregate(employeeScenarioAggregates, escenarioCodigo, scenarioRow, calificacionTotal, nivelExigenciaTotal, empleadoId, 1, itemsRespondidos);
          this.addDashboardAggregate(assignmentStatusAggregates, assignment.estadoRespuesta || assignment.estadoAsignacion, {
            estado: assignment.estadoRespuesta || assignment.estadoAsignacion,
          }, 1, null, empleadoId, 1, 0);

          dimensions.forEach((dimension) => {
            const dimensionKey = String(dimension.dimensionId ?? dimension.dimensionCodigo ?? dimension.dimension ?? '').trim();
            this.addDashboardAggregate(dimensionAggregates, dimensionKey, dimension, dimension.calificacion, dimension.nivelExigencia, empleadoId, 1, dimension.itemsRespondidos ?? 0);
            this.addDashboardAggregate(employeeDimensionAggregates, `${escenarioCodigo}|${dimensionKey}`, dimension, dimension.calificacion, dimension.nivelExigencia, empleadoId, 1, dimension.itemsRespondidos ?? 0);
          });

          criteria.forEach((criterion) => {
            const criterionKey = [
              criterion.criterioId ?? criterion.criterioCodigo ?? criterion.criterio,
              criterion.dimensionId ?? criterion.dimensionCodigo ?? criterion.dimension,
              criterion.escenarioCodigo,
            ].join('|');
            this.addDashboardAggregate(criterionAggregates, criterionKey, criterion, criterion.calificacion, criterion.nivelExigencia, empleadoId, 1, criterion.itemsRespondidos ?? 0);
            this.addDashboardAggregate(employeeCriterionAggregates, criterionKey, criterion, criterion.calificacion, criterion.nivelExigencia, empleadoId, 1, criterion.itemsRespondidos ?? 0);
          });
        });

        const employeeScore = this.averageNumbers(employeeEvaluations.map((evaluation) => this.getNumber(evaluation, ['calificacionTotal', 'resultadoTotal'])));
        const employeeTarget = this.averageNumbers(employeeEvaluations.map((evaluation) => this.getNumber(evaluation, ['nivelExigenciaTotal'])));
        const employeeGap = this.calculateGap(employeeScore, employeeTarget);
        const employeeSummary = {
          empleadoId,
          empleado,
          email,
          puestoId,
          puesto,
          cargo: puesto,
          puestoKey,
          evaluacionesConResultado: new Set(employeeEvaluations.map((evaluation) => this.getEvaluationId(evaluation))).size,
          encuestasRespondidas: employeeEvaluations.length,
          escenariosRespondidos: this.finalizeDashboardAggregates(employeeScenarioAggregates).length,
          itemsRespondidos: employeeItems,
          asignacionesRealizadas: employeeAssignments,
          totalAsignacionesRealizadas: employeeAssignments.length,
          evaluadoresResumen: '-',
          calificacionPromedio: employeeScore,
          resultadoPromedio: employeeScore,
          calificacionTotal: employeeScore,
          resultadoTotal: employeeScore,
          nivelExigenciaPromedio: employeeTarget,
          nivelExigenciaTotal: employeeTarget,
          brechaPromedio: employeeGap,
          brechaTotal: employeeGap,
          escenarios: this.finalizeDashboardAggregates(employeeScenarioAggregates),
          dimensiones: this.finalizeDashboardAggregates(employeeDimensionAggregates),
          criterios: this.finalizeDashboardAggregates(employeeCriterionAggregates),
          evaluaciones: employeeEvaluations,
        };

        empleadosEvaluados.push(employeeSummary);
        this.addDashboardAggregate(positionAggregates, puestoKey, {
          puestoId,
          puesto,
          puestoKey,
        }, employeeScore, employeeTarget, empleadoId, employeeAssignments.length, employeeItems);
      });
    });

    const evaluaciones = this.buildGroupedEvaluationsFromEmployees(empleadosEvaluados, modelId, modelName);
    const resultadosPorPuesto = this.finalizeDashboardAggregates(positionAggregates);
    const resultadosPorEscenario = this.finalizeDashboardAggregates(scenarioAggregates);
    const resultadosPorDimension = this.finalizeDashboardAggregates(dimensionAggregates);
    const criterios = this.finalizeDashboardAggregates(criterionAggregates);
    const calificacionPromedio = this.averageNumbers(empleadosEvaluados.map((employee) => this.getNumber(employee, ['calificacionPromedio'])));
    const nivelExigenciaPromedio = this.averageNumbers(empleadosEvaluados.map((employee) => this.getNumber(employee, ['nivelExigenciaPromedio'])));
    const brechaPromedio = this.calculateGap(calificacionPromedio, nivelExigenciaPromedio);
    const currentModel = currentData.modelos.find((model) => this.getModelId(model) === modelId) ?? {};
    const totalEvaluaciones = this.getNumber(currentModel, ['totalEvaluaciones']) ??
      this.getNumber(selectedSource?.resumen, ['totalEvaluaciones']) ??
      evaluaciones.length;
    const totalEmpleados = this.getNumber(selectedSource?.resumen, ['totalEmpleadosEvaluados']) ?? empleadosEvaluados.length;
    const totalEncuestas = this.getNumber(selectedSource?.resumen, ['totalEncuestasRespondidas']) ?? totalAssignments;
    const totalItemsRespondidos = this.getNumber(selectedSource?.resumen, ['totalItemsRespondidos']) ?? totalItems;
    const totalAsignacionesDashboard = this.getNumber(currentModel, ['totalAsignaciones']) ?? totalAssignments;
    const realizadasDashboard = this.getNumber(currentModel, ['realizadas', 'respondidas']) ?? totalAssignments;
    const porcentajeRealizacionDashboard = this.getNumber(currentModel, ['porcentajeRealizacion', 'porcentajeAvance']) ??
      (totalAsignacionesDashboard > 0 ? (realizadasDashboard / totalAsignacionesDashboard) * 100 : 0);
    const selectedModel = {
      ...(selectedModelOption?.raw ?? {}),
      id: modelId,
      modeloId: modelId,
      nombre: modelName,
      modelo: modelName,
      codigo: modelCode,
      modeloCodigo: modelCode,
      version: selectedSource?.modeloVersion ?? selectedSource?.version ?? null,
      totalEvaluaciones,
      evaluacionesRealizadas: evaluaciones.filter((evaluation) => this.hasEvaluationResults(evaluation)).length,
      totalAsignaciones: totalAsignacionesDashboard,
      realizadas: realizadasDashboard,
      porcentajeRealizacion: porcentajeRealizacionDashboard,
      empleadosConResultado: totalEmpleados,
      calificacionPromedio,
      resultadoPromedio: calificacionPromedio,
      nivelExigenciaPromedio,
      brechaPromedio,
    };

    return {
      organizacionId: this.getNumber(selectedSource, ['organizacionId', 'IdOrganizacion']) ?? currentData.organizacionId,
      fechaGeneracion: this.toOptionalText(selectedSource?.fechaGeneracion ?? selectedSource?.FechaGeneracion) ?? currentData.fechaGeneracion,
      resumen: {
        ...(currentData.resumen ?? {}),
        ...(selectedSource?.resumen ?? {}),
        totalModelos: this.modelSelectOptions.length || this.dashboardModels.length || currentData.modelos.length,
        modelosActivos: this.modelSelectOptions.length || this.dashboardModels.length || this.getNumber(currentData.resumen, ['modelosActivos']) || 0,
        totalEvaluaciones,
        evaluacionesRealizadas: selectedModel.evaluacionesRealizadas,
        totalAsignaciones: totalAsignacionesDashboard,
        realizadas: realizadasDashboard,
        porcentajeRealizacion: porcentajeRealizacionDashboard,
        totalEncuestasRespondidas: totalEncuestas,
        totalEncuestasConDetalleVisible: this.getNumber(selectedSource?.resumen, ['totalEncuestasConDetalleVisible']) ?? totalEncuestas,
        totalPuestos: resultadosPorPuesto.length,
        empleadosConResultado: totalEmpleados,
        totalEmpleadosEvaluados: totalEmpleados,
        totalEvaluados: totalEmpleados,
        totalItemsRespondidos,
        calificacionPromedio,
        resultadoPromedio: calificacionPromedio,
        nivelExigenciaPromedio,
        brechaPromedio,
      },
      modelos: this.mergeDashboardModels(this.dashboardModels, currentData.modelos, [selectedModel]),
      evaluaciones,
      resultadosPorPuesto,
      resultadosPorEscenario,
      resultadosPorDimension,
      brechasCriticas: [...criterios].sort((left, right) =>
        this.nullLast(this.getNumber(left, ['brechaPromedio']), this.getNumber(right, ['brechaPromedio']))
      ),
      fortalezas: [...criterios].sort((left, right) =>
        this.nullLast(this.getNumber(right, ['brechaPromedio']), this.getNumber(left, ['brechaPromedio']))
      ),
      asignacionesPorEstado: this.finalizeStatusAggregates(assignmentStatusAggregates),
      enviosPorEstado: currentData.enviosPorEstado,
      empleadosEvaluados,
    };
  }

  private normalizeGroupedDimensions(encuesta: any, context: Record<string, any>): any[] {
    return this.asArray(encuesta?.dimensiones ?? encuesta?.Dimensiones).map((dimensionRaw) => {
      const criterios = this.asArray(dimensionRaw?.criterios ?? dimensionRaw?.Criterios).map((criterioRaw) => {
        const items = this.asArray(criterioRaw?.items ?? criterioRaw?.Items);
        const scoreValues = items
          .filter((item) => !this.toBoolean(item?.noAplica ?? item?.NoAplica, false))
          .map((item) => this.getNumber(item, ['escalaValor', 'EscalaValor', 'valor', 'Valor']))
          .filter((value): value is number => value !== null);
        const calificacion = this.averageNumbers(scoreValues);
        const nivelExigencia = this.getNumber(criterioRaw, ['nivelExigencia', 'NivelExigencia']);
        const brecha = this.calculateGap(calificacion, nivelExigencia);

        return {
          ...criterioRaw,
          ...context,
          criterioId: this.getNumber(criterioRaw, ['criterioId', 'IdCriterioEvaluacion', 'idCriterio']),
          criterioCodigo: this.toOptionalText(criterioRaw?.criterioCodigo ?? criterioRaw?.codigo),
          criterio: this.getText(criterioRaw, ['criterio', 'nombre', 'criterioNombre'], 'Criterio'),
          dimensionId: this.getNumber(dimensionRaw, ['dimensionId', 'IdModeloDimension', 'idDimension']),
          dimensionCodigo: this.toOptionalText(dimensionRaw?.dimensionCodigo ?? dimensionRaw?.codigo),
          dimension: this.getText(dimensionRaw, ['dimension', 'nombre', 'dimensionNombre'], 'Dimension'),
          ponderacion: this.getNumber(criterioRaw, ['ponderacion', 'Ponderacion']),
          nivelExigencia,
          calificacion,
          resultado: calificacion,
          calificacionPromedio: calificacion,
          resultadoPromedio: calificacion,
          brecha,
          brechaPromedio: brecha,
          itemsRespondidos: scoreValues.length || this.getNumber(criterioRaw, ['itemsRespondidos']) || 0,
          items,
        };
      });
      const calificacion = this.weightedAverageFromRows(criterios, ['calificacion', 'resultado'], ['ponderacion']);
      const nivelExigencia = this.weightedAverageFromRows(criterios, ['nivelExigencia'], ['ponderacion']);
      const brecha = this.calculateGap(calificacion, nivelExigencia);

      return {
        ...dimensionRaw,
        ...context,
        dimensionId: this.getNumber(dimensionRaw, ['dimensionId', 'IdModeloDimension', 'idDimension']),
        dimensionCodigo: this.toOptionalText(dimensionRaw?.dimensionCodigo ?? dimensionRaw?.codigo),
        dimension: this.getText(dimensionRaw, ['dimension', 'nombre', 'dimensionNombre'], 'Dimension'),
        ponderacion: this.getNumber(dimensionRaw, ['ponderacion', 'Ponderacion']),
        criteriosRespondidos: criterios.length,
        itemsRespondidos: criterios.reduce((total, criterio) => total + (this.getNumber(criterio, ['itemsRespondidos']) ?? 0), 0),
        calificacion,
        resultado: calificacion,
        calificacionPromedio: calificacion,
        resultadoPromedio: calificacion,
        nivelExigencia,
        nivelExigenciaPromedio: nivelExigencia,
        brecha,
        brechaPromedio: brecha,
        criterios,
      };
    });
  }

  private buildGroupedEvaluationsFromEmployees(empleados: any[], modelId: number, modelName: string): any[] {
    const evaluations = new Map<string, any>();

    empleados.forEach((employee) => {
      this.getCollection(employee, ['evaluaciones']).forEach((evaluationSummary) => {
        const evaluationId = this.getEvaluationId(evaluationSummary);
        const key = evaluationId ? String(evaluationId) : this.normalizeKey(this.getEvaluationName(evaluationSummary));

        if (!evaluations.has(key)) {
          evaluations.set(key, {
            evaluacionId: evaluationId,
            id: evaluationId,
            modeloId: modelId,
            modelo: modelName,
            evaluacion: this.getEvaluationName(evaluationSummary),
            nombre: this.getEvaluationName(evaluationSummary),
            fechaInicio: evaluationSummary?.fechaInicio ?? null,
            fechaCierre: evaluationSummary?.fechaCierre ?? null,
            tieneResultados: true,
            empleados: [],
            asignacionesRealizadas: [],
            positionAggregates: new Map<string, any>(),
            scenarioAggregates: new Map<string, any>(),
            dimensionAggregates: new Map<string, any>(),
            criterionAggregates: new Map<string, any>(),
          });
        }

        const bucket = evaluations.get(key);
        const employeeScore = this.getNumber(evaluationSummary, ['calificacionTotal', 'resultadoTotal']);
        const employeeTarget = this.getNumber(evaluationSummary, ['nivelExigenciaTotal']);
        bucket.empleados.push({
          ...employee,
          calificacionTotal: employeeScore,
          resultadoTotal: employeeScore,
          calificacionPromedio: employeeScore,
          resultadoPromedio: employeeScore,
          nivelExigenciaTotal: employeeTarget,
          nivelExigenciaPromedio: employeeTarget,
          brechaTotal: this.calculateGap(employeeScore, employeeTarget),
          brechaPromedio: this.calculateGap(employeeScore, employeeTarget),
          escenarios: this.getCollection(evaluationSummary, ['escenarios']),
          dimensiones: this.getCollection(evaluationSummary, ['dimensiones']),
          criterios: this.getCollection(evaluationSummary, ['criterios']),
          asignacionesRealizadas: this.getCollection(evaluationSummary, ['asignacionesRealizadas']),
        });
        bucket.asignacionesRealizadas.push(...this.getCollection(evaluationSummary, ['asignacionesRealizadas']));

        this.addDashboardAggregate(bucket.positionAggregates, this.getEmployeePositionKey(employee), {
          puestoId: employee?.puestoId,
          puesto: this.getEmployeePosition(employee),
          puestoKey: this.getEmployeePositionKey(employee),
        }, employeeScore, employeeTarget, this.getEmployeeId(employee), 1, this.getNumber(evaluationSummary, ['itemsRespondidos']) ?? 0);

        this.getCollection(evaluationSummary, ['escenarios']).forEach((scenario) => {
          this.addDashboardAggregate(bucket.scenarioAggregates, this.getScenarioKey(scenario), scenario, this.getNumber(scenario, ['calificacion', 'resultado']), this.getNumber(scenario, ['nivelExigencia']), this.getEmployeeId(employee), 1, this.getNumber(scenario, ['itemsRespondidos']) ?? 0);
        });

        this.getCollection(evaluationSummary, ['dimensiones']).forEach((dimension) => {
          const key = String(dimension.dimensionId ?? dimension.dimensionCodigo ?? dimension.dimension ?? '').trim();
          this.addDashboardAggregate(bucket.dimensionAggregates, key, dimension, this.getNumber(dimension, ['calificacion', 'resultado']), this.getNumber(dimension, ['nivelExigencia']), this.getEmployeeId(employee), 1, this.getNumber(dimension, ['itemsRespondidos']) ?? 0);
        });

        this.getCollection(evaluationSummary, ['criterios']).forEach((criterion) => {
          const key = [
            criterion.criterioId ?? criterion.criterioCodigo ?? criterion.criterio,
            criterion.dimensionId ?? criterion.dimensionCodigo ?? criterion.dimension,
            criterion.escenarioCodigo,
          ].join('|');
          this.addDashboardAggregate(bucket.criterionAggregates, key, criterion, this.getNumber(criterion, ['calificacion', 'resultado']), this.getNumber(criterion, ['nivelExigencia']), this.getEmployeeId(employee), 1, this.getNumber(criterion, ['itemsRespondidos']) ?? 0);
        });
      });
    });

    return Array.from(evaluations.values()).map((evaluation) => {
      const calificacion = this.averageNumbers(evaluation.empleados.map((employee: any) => this.getNumber(employee, ['calificacionTotal', 'resultadoTotal'])));
      const exigencia = this.averageNumbers(evaluation.empleados.map((employee: any) => this.getNumber(employee, ['nivelExigenciaTotal'])));

      return {
        ...evaluation,
        puestos: this.finalizeDashboardAggregates(evaluation.positionAggregates),
        escenarios: this.finalizeDashboardAggregates(evaluation.scenarioAggregates),
        dimensiones: this.finalizeDashboardAggregates(evaluation.dimensionAggregates),
        criterios: this.finalizeDashboardAggregates(evaluation.criterionAggregates),
        empleadosConResultado: evaluation.empleados.length,
        realizadas: evaluation.asignacionesRealizadas.length,
        avance: {
          realizadas: evaluation.asignacionesRealizadas.length,
          porcentajeAvance: evaluation.asignacionesRealizadas.length > 0 ? 100 : 0,
        },
        calificacionPromedio: calificacion,
        resultadoPromedio: calificacion,
        nivelExigenciaPromedio: exigencia,
        brechaPromedio: this.calculateGap(calificacion, exigencia),
        positionAggregates: undefined,
        scenarioAggregates: undefined,
        dimensionAggregates: undefined,
        criterionAggregates: undefined,
      };
    });
  }

  private mergeDashboardData(currentData: DesDashboardData, groupedData: DesDashboardData): DesDashboardData {
    return {
      ...currentData,
      ...groupedData,
      resumen: {
        ...(currentData.resumen ?? {}),
        ...(groupedData.resumen ?? {}),
      },
      modelos: groupedData.modelos.length ? groupedData.modelos : currentData.modelos,
      evaluaciones: groupedData.evaluaciones.length ? groupedData.evaluaciones : currentData.evaluaciones,
      resultadosPorPuesto: groupedData.resultadosPorPuesto.length ? groupedData.resultadosPorPuesto : currentData.resultadosPorPuesto,
      resultadosPorEscenario: groupedData.resultadosPorEscenario.length ? groupedData.resultadosPorEscenario : currentData.resultadosPorEscenario,
      resultadosPorDimension: groupedData.resultadosPorDimension.length ? groupedData.resultadosPorDimension : currentData.resultadosPorDimension,
      brechasCriticas: groupedData.brechasCriticas.length ? groupedData.brechasCriticas : currentData.brechasCriticas,
      fortalezas: groupedData.fortalezas.length ? groupedData.fortalezas : currentData.fortalezas,
      asignacionesPorEstado: groupedData.asignacionesPorEstado.length ? groupedData.asignacionesPorEstado : currentData.asignacionesPorEstado,
      enviosPorEstado: currentData.enviosPorEstado.length ? currentData.enviosPorEstado : groupedData.enviosPorEstado,
      empleadosEvaluados: groupedData.empleadosEvaluados.length ? groupedData.empleadosEvaluados : currentData.empleadosEvaluados,
    };
  }

  private mergeDashboardModels(
    modelOptions: DashboardModelOption[],
    currentModels: any[],
    selectedModels: any[]
  ): any[] {
    const models = new Map<number, any>();

    currentModels.forEach((model) => {
      const id = this.getModelId(model);
      if (id > 0) {
        models.set(id, model);
      }
    });

    modelOptions.forEach((model) => {
      models.set(model.id, {
        ...(models.get(model.id) ?? {}),
        ...(model.raw ?? {}),
        id: model.id,
        modeloId: model.id,
        nombre: model.nombre,
        modelo: model.nombre,
        codigo: model.codigo,
        modeloCodigo: model.codigo,
      });
    });

    selectedModels.forEach((model) => {
      const id = this.getModelId(model);
      if (id > 0) {
        models.set(id, {
          ...(models.get(id) ?? {}),
          ...model,
        });
      }
    });

    return Array.from(models.values()).sort((left, right) => this.getModelId(right) - this.getModelId(left));
  }

  private addDashboardAggregate(
    aggregates: Map<string, any>,
    key: any,
    base: Record<string, any>,
    result: number | null,
    target: number | null,
    employeeId: number | null,
    assignments = 0,
    items = 0
  ): void {
    const normalizedKey = String(key || this.normalizeKey(this.getText(base, ['nombre', 'puesto', 'escenario', 'dimension', 'criterio'], 'SIN_DATO'))).trim();
    if (!normalizedKey) {
      return;
    }

    if (!aggregates.has(normalizedKey)) {
      aggregates.set(normalizedKey, {
        ...base,
        __results: [],
        __targets: [],
        __employees: new Set<number | string>(),
        __assignments: 0,
        __items: 0,
      });
    }

    const aggregate = aggregates.get(normalizedKey);
    if (result !== null) {
      aggregate.__results.push(result);
    }
    if (target !== null) {
      aggregate.__targets.push(target);
    }
    if (employeeId) {
      aggregate.__employees.add(employeeId);
    }
    aggregate.__assignments += assignments;
    aggregate.__items += items;
  }

  private finalizeDashboardAggregates(aggregates: Map<string, any>): any[] {
    return Array.from(aggregates.values()).map((aggregate) => {
      const calificacion = this.averageNumbers(aggregate.__results ?? []);
      const exigencia = this.averageNumbers(aggregate.__targets ?? []);
      const employees = aggregate.__employees as Set<number | string> | undefined;
      const {
        __results: _results,
        __targets: _targets,
        __employees: _employees,
        __assignments: _assignments,
        __items: _items,
        ...base
      } = aggregate;

      return {
        ...base,
        calificacionPromedio: calificacion,
        resultadoPromedio: calificacion,
        calificacion: calificacion,
        resultado: calificacion,
        nivelExigenciaPromedio: exigencia,
        nivelExigencia: exigencia,
        brechaPromedio: this.calculateGap(calificacion, exigencia),
        brecha: this.calculateGap(calificacion, exigencia),
        empleadosEvaluados: employees?.size ?? this.getNumber(base, ['empleadosEvaluados']) ?? 0,
        asignacionesRealizadas: _assignments ?? this.getNumber(base, ['asignacionesRealizadas']) ?? 0,
        itemsRespondidos: _items ?? this.getNumber(base, ['itemsRespondidos']) ?? 0,
      };
    });
  }

  private finalizeStatusAggregates(aggregates: Map<string, any>): any[] {
    return Array.from(aggregates.values()).map((aggregate) => ({
      estado: this.getText(aggregate, ['estado', 'estadoCodigo', 'codigo', 'nombre'], 'Sin estado'),
      estadoCodigo: this.getText(aggregate, ['estado', 'estadoCodigo', 'codigo', 'nombre'], 'Sin estado'),
      total: aggregate.__assignments ?? 0,
    }));
  }

  private getGroupedSourcePositions(source: any): any[] {
    const payload = this.extractPayload(source) ?? {};
    const candidates = [
      payload?.puestos,
      payload?.Puestos,
      payload?.puestosEvaluados,
      payload?.PuestosEvaluados,
      payload?.resultadosPorPuesto,
      payload?.ResultadosPorPuesto,
      payload?.agrupacionesPorPuesto,
      payload?.AgrupacionesPorPuesto,
      payload?.respuestasAgrupadas,
      payload?.RespuestasAgrupadas,
      payload?.grupos,
      payload?.Grupos,
      payload?.items,
      payload?.Items,
    ];

    for (const candidate of candidates) {
      const rows = this.asArray(candidate);
      if (rows.length > 0) {
        return rows;
      }
    }

    const nestedData = payload?.data ?? payload?.Data;
    if (nestedData && nestedData !== payload) {
      const rows = this.getGroupedSourcePositions(nestedData);
      if (rows.length > 0) {
        return rows;
      }
    }

    if (this.asArray(payload?.empleados ?? payload?.Empleados).length > 0) {
      return [payload];
    }

    return [];
  }



  private normalizeDashboardEmployee(item: any): DashboardEmployeeDirectoryItem {
    const names = String(item?.Nombres ?? item?.nombres ?? '').trim();
    const lastNames = String(item?.Apellidos ?? item?.apellidos ?? '').trim();
    const managerIds = this.normalizeDashboardEmployeeManagerIds(item);
    const fullName = this.getText(
      {
        ...item,
        fullName: `${names} ${lastNames}`.trim(),
      },
      ['fullName', 'nombreCompleto', 'empleado', 'nombre'],
      'Empleado'
    );
    const position = this.getText(item, ['Cargo', 'cargo', 'Puesto', 'puesto', 'Posicion', 'posicion'], 'Sin puesto');
    const positionKey = this.getPositionKey(
      item?.IdPuesto ?? item?.idPuesto ?? item?.puestoId,
      position
    );

    return {
      id: Number(item?.IdEmpleado ?? item?.idEmpleado ?? item?.Id ?? item?.id ?? 0),
      organizationId: this.getNumber(item, ['IdOrganizacion', 'idOrganizacion']),
      managerId: managerIds[0] ?? null,
      managerIds,
      fullName,
      position,
      positionKey,
      email: this.toOptionalText(item?.Email ?? item?.email),
      activo: this.toBoolean(item?.activo ?? item?.Activo ?? item?.estado ?? item?.Estado, true),
      raw: item,
    };
  }

  private normalizeDashboardEmployeeManagerIds(item: any): number[] {
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

  private enrichDashboardData(data: DesDashboardData): DesDashboardData {
    const employeeMap = new Map<number, DashboardEmployeeDirectoryItem>();
    this.dashboardEmployees.forEach((employee) => employeeMap.set(employee.id, employee));

    const evaluaciones = data.evaluaciones.map((evaluation) => this.enrichEvaluation(evaluation, employeeMap));
    const empleadosEvaluados = data.empleadosEvaluados.length
      ? data.empleadosEvaluados.map((employee) => this.enrichEmployeeSummary(employee, employeeMap, evaluaciones))
      : this.buildEmployeeSummaryFromEvaluations(evaluaciones);

    return {
      ...data,
      evaluaciones,
      empleadosEvaluados,
    };
  }

  private enrichEvaluation(evaluation: any, employeeMap: Map<number, DashboardEmployeeDirectoryItem>): any {
    const assignments = this.getCollection(evaluation, ['asignacionesRealizadas', 'AsignacionesRealizadas'])
      .map((assignment) => this.enrichAssignment(assignment, employeeMap));
    const existingEmployees = this.getCollection(evaluation, ['empleados']);
    const existingPositions = this.getCollection(evaluation, ['puestos']);
    const existingScenarios = this.getCollection(evaluation, ['escenarios']);

    return {
      ...evaluation,
      asignacionesRealizadas: assignments,
      empleados: existingEmployees.length ? existingEmployees : this.buildEvaluationEmployeesFromAssignments(evaluation, assignments),
      puestos: existingPositions.length ? existingPositions : this.buildPositionRowsFromAssignments(assignments),
      escenarios: existingScenarios.length ? existingScenarios : this.buildScenarioRowsFromAssignments(assignments),
    };
  }

  private enrichAssignment(
    assignment: any,
    employeeMap: Map<number, DashboardEmployeeDirectoryItem>
  ): any {
    const evaluadorId = this.getNumber(assignment, ['evaluadorId', 'IdEvaluador']);
    const evaluadoId = this.getNumber(assignment, ['evaluadoId', 'IdEvaluado', 'empleadoId']);
    const evaluator = evaluadorId ? employeeMap.get(evaluadorId) : undefined;
    const evaluatee = evaluadoId ? employeeMap.get(evaluadoId) : undefined;
    const position = this.getText(
      {
        ...assignment,
        puestoEmpleado: evaluatee?.position,
      },
      ['puesto', 'puestoNombre', 'cargo', 'puestoEmpleado'],
      'Sin puesto'
    );
    const positionKey = this.getPositionKey(
      assignment?.puestoId ?? assignment?.IdPuesto ?? assignment?.idPuesto,
      position || evaluatee?.position
    );
    const scenarioKey = this.getAssignmentScenarioKey(assignment);
    const scenario = this.getAssignmentScenarioName(assignment);

    return {
      ...assignment,
      asignacionId: this.getNumber(assignment, ['asignacionId', 'IdAsignacion']) ?? null,
      evaluadorId,
      evaluador: this.getText(assignment, ['evaluador', 'Evaluador'], evaluator?.fullName ?? 'Evaluador'),
      evaluadorPuesto: evaluator?.position ?? null,
      evaluadoId,
      empleadoId: evaluadoId,
      evaluado: this.getText(assignment, ['evaluado', 'Evaluado'], evaluatee?.fullName ?? 'Empleado'),
      empleado: this.getText(assignment, ['evaluado', 'Evaluado'], evaluatee?.fullName ?? 'Empleado'),
      empleadoEmail: evaluatee?.email ?? null,
      puesto: position,
      puestoKey: positionKey,
      positionKey,
      escenario: scenario,
      escenarioKey: scenarioKey,
      escenarios: [
        {
          escenarioCodigo: scenarioKey,
          escenario: scenario,
          resultado: this.getNumber(assignment, ['resultado', 'calificacion']),
          calificacion: this.getNumber(assignment, ['calificacion', 'resultado']),
          nivelExigencia: this.getNumber(assignment, ['nivelExigencia']),
          brecha: this.getNumber(assignment, ['brecha']),
        },
      ],
    };
  }

  private buildEvaluationEmployeesFromAssignments(evaluation: any, assignments: any[]): any[] {
    const employees = new Map<string, any>();

    assignments.forEach((assignment) => {
      const employeeId = this.getEmployeeId(assignment);
      const key = employeeId ? String(employeeId) : this.normalizeKey(this.getEmployeeName(assignment));

      if (!employees.has(key)) {
        employees.set(key, {
          empleadoId: employeeId || null,
          empleado: this.getEmployeeName(assignment),
          puesto: this.getEmployeePosition(assignment),
          puestoKey: this.getEmployeePositionKey(assignment),
          evaluacionesConResultado: this.hasEvaluationResults(evaluation) ? 1 : 0,
          asignacionesRealizadas: [],
          escenarios: [],
          evaluadores: [],
        });
      }

      const employee = employees.get(key);
      employee.asignacionesRealizadas.push(assignment);

      const evaluatorName = this.getText(assignment, ['evaluador'], '');
      if (evaluatorName && !employee.evaluadores.includes(evaluatorName)) {
        employee.evaluadores.push(evaluatorName);
      }

      const scenarioKey = this.getAssignmentScenarioKey(assignment);
      if (!employee.escenarios.some((scenario: any) => this.getScenarioKey(scenario) === scenarioKey)) {
        employee.escenarios.push({
          escenarioCodigo: scenarioKey,
          escenario: this.getAssignmentScenarioName(assignment),
          resultado: this.getNumber(assignment, ['resultado', 'calificacion']),
          calificacion: this.getNumber(assignment, ['calificacion', 'resultado']),
          nivelExigencia: this.getNumber(assignment, ['nivelExigencia']),
          brecha: this.getNumber(assignment, ['brecha']),
        });
      }
    });

    return Array.from(employees.values()).map((employee) => ({
      ...employee,
      totalAsignacionesRealizadas: employee.asignacionesRealizadas.length,
      evaluadoresResumen: employee.evaluadores.join(', '),
    }));
  }

  private buildPositionRowsFromAssignments(assignments: any[]): any[] {
    const positions = new Map<string, any>();

    assignments.forEach((assignment) => {
      const key = this.getAssignmentPositionKey(assignment);
      if (!key) {
        return;
      }

      if (!positions.has(key)) {
        positions.set(key, {
          puestoId: this.getNumber(assignment, ['puestoId', 'IdPuesto']),
          puestoKey: key,
          puesto: this.getEmployeePosition(assignment),
          asignacionesRealizadas: 0,
          empleados: new Set<number | string>(),
        });
      }

      const position = positions.get(key);
      position.asignacionesRealizadas += 1;
      position.empleados.add(this.getEmployeeId(assignment) || this.getEmployeeName(assignment));
    });

    return Array.from(positions.values()).map((position) => ({
      ...position,
      empleadosEvaluados: position.empleados.size,
      empleados: undefined,
    }));
  }

  private buildScenarioRowsFromAssignments(assignments: any[]): any[] {
    const scenarios = new Map<string, any>();

    assignments.forEach((assignment) => {
      const key = this.getAssignmentScenarioKey(assignment);
      if (!key) {
        return;
      }

      if (!scenarios.has(key)) {
        scenarios.set(key, {
          escenarioCodigo: key,
          escenario: this.getAssignmentScenarioName(assignment),
          asignacionesRealizadas: 0,
          empleados: new Set<number | string>(),
        });
      }

      const scenario = scenarios.get(key);
      scenario.asignacionesRealizadas += 1;
      scenario.empleados.add(this.getEmployeeId(assignment) || this.getEmployeeName(assignment));
    });

    return Array.from(scenarios.values()).map((scenario) => ({
      ...scenario,
      empleadosEvaluados: scenario.empleados.size,
      empleados: undefined,
    }));
  }

  private enrichEmployeeSummary(
    employee: any,
    employeeMap: Map<number, DashboardEmployeeDirectoryItem>,
    evaluations: any[]
  ): any {
    const employeeId = this.getEmployeeId(employee);
    const directoryEmployee = employeeId ? employeeMap.get(employeeId) : undefined;
    const assignments = evaluations.flatMap((evaluation) =>
      this.getEvaluationAssignments(evaluation).filter((assignment) => this.getEmployeeId(assignment) === employeeId)
    );

    return {
      ...employee,
      empleadoId: employeeId,
      empleado: this.getEmployeeName(employee) || directoryEmployee?.fullName,
      puesto: this.getEmployeePosition(employee) || directoryEmployee?.position,
      puestoKey: this.getEmployeePositionKey(employee) || directoryEmployee?.positionKey,
      asignacionesRealizadas: assignments,
      totalAsignacionesRealizadas: assignments.length,
    };
  }

  private buildEmployeeSummaryFromEvaluations(evaluations: any[]): any[] {
    const employees = new Map<string, any>();

    evaluations.forEach((evaluation) => {
      this.getCollection(evaluation, ['empleados']).forEach((employee) => {
        const employeeId = this.getEmployeeId(employee);
        const key = employeeId ? String(employeeId) : this.normalizeKey(this.getEmployeeName(employee));

        if (!employees.has(key)) {
          employees.set(key, {
            empleadoId: employeeId || null,
            empleado: this.getEmployeeName(employee),
            puesto: this.getEmployeePosition(employee),
            puestoKey: this.getEmployeePositionKey(employee),
            evaluacionesConResultado: 0,
            asignacionesRealizadas: [],
            evaluaciones: [],
            evaluadores: [],
          });
        }

        const summary = employees.get(key);
        if (this.hasEvaluationResults(evaluation)) {
          summary.evaluacionesConResultado += 1;
        }

        summary.asignacionesRealizadas.push(...this.getCollection(employee, ['asignacionesRealizadas', 'asignaciones']));
        summary.evaluaciones.push({
          evaluacionId: this.getEvaluationId(evaluation),
          evaluacion: this.getEvaluationName(evaluation),
          modelo: this.getText(evaluation, ['modelo']),
          calificacionTotal: this.getNumber(employee, ['calificacionTotal', 'resultadoTotal']),
          resultadoTotal: this.getNumber(employee, ['resultadoTotal', 'calificacionTotal']),
        });

        this.getCollection(employee, ['evaluadores']).forEach((evaluator) => {
          if (!summary.evaluadores.includes(evaluator)) {
            summary.evaluadores.push(evaluator);
          }
        });
      });
    });

    return Array.from(employees.values()).map((employee) => ({
      ...employee,
      totalAsignacionesRealizadas: employee.asignacionesRealizadas.length,
      evaluadoresResumen: employee.evaluadores.join(', '),
    }));
  }

  private rebuildCharts(): void {
    const data = this.dashboardData;
    if (!data) {
      this.resetCharts();
      return;
    }

    this.positionChartOptions = this.buildComparisonBarChart(
      data.resultadosPorPuesto,
      ['puestoNombre', 'puesto', 'cargo', 'nombrePuesto', 'nombre'],
      330,
    );
    this.scenarioChartOptions = this.buildComparisonBarChart(
      data.resultadosPorEscenario,
      ['escenarioNombre', 'escenario', 'nombreEscenario', 'nombre'],
      310,
    );
    this.dimensionChartOptions = this.buildComparisonBarChart(
      data.resultadosPorDimension,
      ['dimensionNombre', 'dimension', 'nombreDimension', 'nombre'],
      310,
    );
    this.assignmentStatusChartOptions = this.buildStatusDonutChart(data.asignacionesPorEstado);
    this.sendStatusChartOptions = this.buildStatusDonutChart(data.enviosPorEstado);
  }

  private resetCharts(): void {
    this.positionChartOptions = {};
    this.scenarioChartOptions = {};
    this.dimensionChartOptions = {};
    this.assignmentStatusChartOptions = {};
    this.sendStatusChartOptions = {};
  }

  private buildComparisonBarChart(
    rows: any[],
    labelKeys: string[],
    height: number,
  ): Partial<DesDashboardChartOptions> {
    const normalizedRows = rows
      .map((item) => ({
        label: this.getText(item, labelKeys, 'Sin nombre'),
        result: this.getNumber(item, ['calificacionPromedio', 'resultadoPromedio', 'resultadoTotal', 'resultado']),
        target: this.getNumber(item, ['nivelExigenciaPromedio', 'nivelExigenciaTotal', 'nivelExigencia']),
      }))
      .filter((item) => item.label && (item.result !== null || item.target !== null));

    if (!normalizedRows.length) {
      return {};
    }

    const resultSeries = normalizedRows.map((item) => item.result ?? 0);
    const targetSeries = normalizedRows.map((item) => item.target ?? 0);
    const maxValue = Math.max(5, ...resultSeries, ...targetSeries);

    return {
      series: [
        { name: 'Calificacion promedio', data: resultSeries },
        { name: 'Nivel de exigencia', data: targetSeries },
      ],
      chart: {
        type: 'bar',
        height,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '48%',
        },
      },
      colors: ['#2563eb', '#f59e0b'],
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      tooltip: {
        y: {
          formatter: (value: number) => this.formatScore(Number(value)),
        },
      },
      xaxis: {
        categories: normalizedRows.map((item) => item.label),
        labels: {
          trim: true,
          rotate: -35,
        },
      },
      yaxis: {
        min: 0,
        max: maxValue <= 5 ? 5 : undefined,
        labels: {
          formatter: (value: number) => this.roundTo(value, 1).toString(),
        },
      },
    };
  }

  private buildStatusDonutChart(rows: any[]): Partial<DesDashboardChartOptions> {
    const normalizedRows = rows
      .map((item) => ({
        label: this.getText(item, ['estadoNombre', 'estado', 'codigo', 'nombre'], 'Sin estado'),
        total: this.getNumber(item, ['total', 'cantidad', 'valor', 'count', 'asignaciones', 'envios']),
      }))
      .filter((item) => item.total !== null && item.total > 0);

    if (!normalizedRows.length) {
      return {};
    }

    return {
      series2: normalizedRows.map((item) => item.total ?? 0),
      labels: normalizedRows.map((item) => item.label),
      chart: {
        type: 'donut',
        height: 260,
      },
      colors: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#64748b'],
      dataLabels: { enabled: true },
      legend: {
        position: 'bottom',
      },
      tooltip: {
        y: {
          formatter: (value: number) => this.formatInteger(Number(value)),
        },
      },
      responsive: [
        {
          breakpoint: 680,
          options: {
            chart: { height: 220 },
            legend: { position: 'bottom' },
          },
        },
      ],
    };
  }

  private extractCollection(response: any): any[] {
    const payload = this.extractPayload(response);

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

  private extractDashboardModelItems(response: any): any[] {
    const root = response?.data ?? response;

    if (Array.isArray(root)) {
      return root;
    }

    if (Array.isArray(root?.items)) {
      return root.items;
    }

    if (Array.isArray(root?.data?.items)) {
      return root.data.items;
    }

    if (Array.isArray(root?.data)) {
      return root.data;
    }

    return this.extractCollection(response);
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
          Object.prototype.hasOwnProperty.call(payload, 'code') ||
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

  private asArray(value: any): any[] {
    const parsed = this.parseJsonValue(value);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed?.items)) {
      return parsed.items;
    }

    if (Array.isArray(parsed?.data)) {
      return parsed.data;
    }

    return [];
  }

  getCollection(item: any, keys: string[]): any[] {
    for (const key of keys) {
      const value = this.parseJsonValue(item?.[key]);
      if (Array.isArray(value)) {
        return value;
      }
    }

    return [];
  }

  getObject(value: any): Record<string, any> {
    const parsed = this.parseJsonValue(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  }

  getText(item: any, keys: string[], fallback = '-'): string {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        if (typeof value === 'boolean') {
          continue;
        }

        return String(value).trim();
      }
    }

    return fallback;
  }

  getNumber(item: any, keys: string[]): number | null {
    for (const key of keys) {
      const value = item?.[key];
      if (value === undefined || value === null || value === '') {
        continue;
      }

      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return null;
  }

  private toPositiveInteger(value: any): number | null {
    const numericValue = Number(value);
    return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
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
    if (value === undefined || value === null) {
      return null;
    }

    const text = String(value).trim();
    return text || null;
  }

  private getScenarioKey(scenario: any): string {
    return String(
      this.toOptionalNonBooleanText(scenario?.escenarioCodigo) ??
      this.toOptionalNonBooleanText(scenario?.codigo) ??
      scenario?.escenarioId ??
      scenario?.idEscenario ??
      scenario?.IdEscenario ??
      scenario?.id ??
      scenario?.Id ??
      this.toOptionalNonBooleanText(scenario?.escenario) ??
      this.toOptionalNonBooleanText(scenario?.nombre) ??
      ''
    ).trim();
  }

  private getEmployeePositionKey(employee: any): string {
    return String(
      employee?.positionKey ??
      employee?.puestoKey ??
      employee?.puestoId ??
      employee?.IdPuesto ??
      employee?.idPuesto ??
      employee?.puestoCodigo ??
      employee?.puesto ??
      employee?.cargo ??
      ''
    ).trim();
  }

  private getAssignmentPositionKey(assignment: any): string {
    return this.getPositionKey(
      assignment?.puestoId ?? assignment?.IdPuesto ?? assignment?.idPuesto,
      this.getText(assignment, ['puesto', 'puestoNombre', 'cargo', 'position'], '')
    );
  }

  private getAssignmentScenarioKey(assignment: any): string {
    const key = this.getScenarioKey(assignment);
    if (key) {
      return key;
    }

    const scenarioName = this.getAssignmentScenarioName(assignment);
    if (scenarioName !== 'Escenario sin nombre') {
      return this.normalizeKey(scenarioName);
    }

    return String(this.getNumber(assignment, ['asignacionId', 'IdAsignacion']) ?? 'SIN_ESCENARIO');
  }

  getAssignmentScenarioName(assignment: any): string {
    return this.getText(
      assignment,
      ['escenarioNombre', 'nombreEscenario', 'escenario', 'nombre', 'escenarioCodigo', 'codigo'],
      'Escenario sin nombre'
    );
  }

  private getPositionKey(positionId: any, positionName: any): string {
    const text = this.toOptionalNonBooleanText(positionName);
    if (text) {
      return this.normalizeKey(text);
    }

    const numericId = Number(positionId);
    if (Number.isFinite(numericId) && numericId > 0) {
      return String(numericId);
    }

    return this.normalizeKey('Sin puesto');
  }

  private filterDetailByBreakdown(rows: any[]): any[] {
    if (!this.selectedBreakdownKey || this.selectedBreakdownMode === 'puesto') {
      return rows;
    }

    return rows.filter((row) => {
      const scenarioKey = this.getScenarioKey(row);
      return !scenarioKey || scenarioKey === this.selectedBreakdownKey;
    });
  }

  private filterAssignmentsByBreakdown(rows: any[]): any[] {
    return rows.filter((assignment) => {
      if (this.selectedPositionKey && this.getAssignmentPositionKey(assignment) !== this.selectedPositionKey) {
        return false;
      }

      if (!this.selectedBreakdownKey) {
        return true;
      }

      if (this.selectedBreakdownMode === 'puesto') {
        return this.getAssignmentPositionKey(assignment) === this.selectedBreakdownKey;
      }

      return this.getAssignmentScenarioKey(assignment) === this.selectedBreakdownKey;
    });
  }

  private filterRowsByPosition<T>(rows: T[]): T[] {
    if (!this.selectedPositionKey) {
      return rows;
    }

    const filtered = rows.filter((row: any) => this.getEmployeePositionKey(row) === this.selectedPositionKey);
    return filtered.length > 0 ? filtered : rows;
  }

  private sortEmployeesByHierarchy<T>(rows: T[]): T[] {
    const hierarchyOrder = this.getDashboardHierarchyOrderMap();

    return [...rows].sort((left: any, right: any) => {
      const leftId = this.getEmployeeId(left);
      const rightId = this.getEmployeeId(right);
      const leftOrder = leftId ? hierarchyOrder.get(leftId) : undefined;
      const rightOrder = rightId ? hierarchyOrder.get(rightId) : undefined;

      if (leftOrder !== undefined && rightOrder !== undefined && leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      if (leftOrder !== undefined && rightOrder === undefined) {
        return -1;
      }

      if (leftOrder === undefined && rightOrder !== undefined) {
        return 1;
      }

      return this.compareEmployeesByPositionAndName(left, right);
    });
  }

  private getDashboardHierarchyOrderMap(): Map<number, number> {
    const employeesById = new Map(this.dashboardEmployees.map((employee) => [employee.id, employee]));
    const childrenByManagerId = new Map<number, DashboardEmployeeDirectoryItem[]>();
    const roots: DashboardEmployeeDirectoryItem[] = [];

    this.dashboardEmployees.forEach((employee) => {
      const managerId = employee.managerIds.find((id) => id !== employee.id && employeesById.has(id)) ?? null;

      if (!managerId) {
        roots.push(employee);
        return;
      }

      const children = childrenByManagerId.get(managerId) ?? [];
      children.push(employee);
      childrenByManagerId.set(managerId, children);
    });

    const order = new Map<number, number>();
    const visited = new Set<number>();
    let cursor = 0;

    const compareSiblings = (left: DashboardEmployeeDirectoryItem, right: DashboardEmployeeDirectoryItem): number => {
      const leftChildren = childrenByManagerId.get(left.id)?.length ?? 0;
      const rightChildren = childrenByManagerId.get(right.id)?.length ?? 0;

      if ((leftChildren > 0) !== (rightChildren > 0)) {
        return rightChildren - leftChildren;
      }

      return this.compareEmployeesByPositionAndName(left, right);
    };

    const visit = (employee: DashboardEmployeeDirectoryItem) => {
      if (visited.has(employee.id)) {
        return;
      }

      visited.add(employee.id);
      order.set(employee.id, cursor++);

      const children = [...(childrenByManagerId.get(employee.id) ?? [])].sort(compareSiblings);
      children.forEach(visit);
    };

    roots.sort(compareSiblings).forEach(visit);
    this.dashboardEmployees
      .filter((employee) => !visited.has(employee.id))
      .sort(compareSiblings)
      .forEach(visit);

    return order;
  }

  private compareEmployeesByPositionAndName(left: any, right: any): number {
    const positionCompare = this.getEmployeePosition(left).localeCompare(
      this.getEmployeePosition(right),
      'es',
      { sensitivity: 'base' }
    );

    if (positionCompare !== 0) {
      return positionCompare;
    }

    return this.getEmployeeName(left).localeCompare(
      this.getEmployeeName(right),
      'es',
      { sensitivity: 'base' }
    );
  }

  private getSurveyDimensionsForDisplay(survey: any, employee: any): any[] {
    const dimensions = this.getSurveyDimensions(survey);
    const hasCalculatedValues = dimensions.some((dimension) =>
      this.getNumber(dimension, ['calificacionPromedio', 'resultadoPromedio', 'calificacion', 'resultado']) !== null
    );

    if (hasCalculatedValues) {
      return dimensions;
    }

    const normalized = this.normalizeGroupedDimensions(survey, {
      modeloId: this.selectedModelId,
      modelo: this.getModelName(this.selectedModel),
      evaluacionId: this.getEvaluationId(survey),
      evaluacion: this.getEvaluationName(survey),
      empleadoId: this.getEmployeeId(employee),
      empleado: this.getEmployeeName(employee),
      puestoId: this.getNumber(employee, ['puestoId', 'IdPuesto', 'idPuesto']),
      puesto: this.getEmployeePosition(employee),
      puestoKey: this.getEmployeePositionKey(employee),
      escenarioCodigo: this.getAssignmentScenarioKey(survey),
      escenario: this.getAssignmentScenarioName(survey),
    });

    return normalized.length > 0 ? normalized : dimensions;
  }

  private getEmployeeDimensionMatches(employee: any, dimension: any): any[] {
    const dimensionKey = this.getDimensionComparableKey(dimension);
    return this.getEmployeeDimensionRows(employee).filter((item) =>
      this.getDimensionComparableKey(item) === dimensionKey
    );
  }

  private getDimensionComparableKey(dimension: any): string {
    return this.normalizeKey(this.getDimensionDisplayName(dimension));
  }

  private toOptionalNonBooleanText(value: any): string | null {
    if (typeof value === 'boolean') {
      return null;
    }

    return this.toOptionalText(value);
  }

  private toBoolean(value: any, fallback = false): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (value === undefined || value === null || value === '') {
      return fallback;
    }

    const normalized = this.normalizeKey(String(value));
    if (['TRUE', 'SI', 'YES', 'ACTIVO', '1'].includes(normalized)) {
      return true;
    }

    if (['FALSE', 'NO', 'INACTIVO', '0'].includes(normalized)) {
      return false;
    }

    return fallback;
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

  private selectInitialModel(): void {
    const models = this.dashboardData?.modelos ?? [];
    const preferredModel = models.find((model) =>
      (this.getNumber(model, ['evaluacionesRealizadas']) ?? 0) > 0 ||
      this.getNumber(model, ['calificacionPromedio', 'resultadoPromedio']) !== null
    ) ?? models[0] ?? null;

    this.selectedModelId = preferredModel ? this.getModelId(preferredModel) : null;
  }

  private selectInitialEvaluation(): void {
    const evaluations = this.availableEvaluations;
    const preferredEvaluation = evaluations.find((evaluation) => this.hasEvaluationResults(evaluation)) ?? evaluations[0] ?? null;
    this.selectedEvaluationId = preferredEvaluation ? this.getEvaluationId(preferredEvaluation) : null;
  }

  private resetDrilldownSelection(): void {
    this.selectedBreakdownKey = null;
    this.expandedEmployeeRowKey = null;
    this.selectFirstVisibleEmployee();
  }

  private selectFirstVisibleEmployee(): void {
    const firstEmployee = this.selectedEvaluationEmployees[0] ?? null;
    this.selectedEmployeeId = firstEmployee ? this.getEmployeeId(firstEmployee) || null : null;
  }

  getScoreTone(value: number | null): DashboardMetric['tone'] {
    if (value === null) return 'neutral';
    if (value >= 4) return 'green';
    if (value >= 3) return 'orange';
    return 'red';
  }

  getGapTone(value: number | null): DashboardMetric['tone'] {
    if (value === null) return 'neutral';
    if (value >= 0) return 'green';
    if (value >= -0.5) return 'orange';
    return 'red';
  }

  private nullLast(left: number | null, right: number | null): number {
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return left - right;
  }

  private averageNumbers(values: Array<number | null | undefined>): number | null {
    const numbers = values.filter((value): value is number => Number.isFinite(Number(value)));
    if (numbers.length === 0) {
      return null;
    }

    return numbers.reduce((total, value) => total + value, 0) / numbers.length;
  }

  private weightedAverageFromRows(rows: any[], valueKeys: string[], weightKeys: string[]): number | null {
    const weightedRows = rows
      .map((row) => ({
        value: this.getNumber(row, valueKeys),
        weight: this.getNumber(row, weightKeys),
      }))
      .filter((row): row is { value: number; weight: number | null } => row.value !== null);
    const weightedTotal = weightedRows.reduce(
      (total, row) => total + (row.weight !== null && row.weight > 0 ? row.weight : 0),
      0
    );

    if (weightedRows.length === 0) {
      return null;
    }

    if (weightedTotal <= 0) {
      return this.averageNumbers(weightedRows.map((row) => row.value));
    }

    return weightedRows.reduce((total, row) => {
      const weight = row.weight !== null && row.weight > 0 ? row.weight : 0;
      return total + row.value * weight;
    }, 0) / weightedTotal;
  }

  private calculateGap(result: number | null, target: number | null): number | null {
    if (result === null || target === null) {
      return null;
    }

    return result - target;
  }

  private roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  private normalizeKey(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private safeSheetName(name: string): string {
    return (name || 'Hoja').replace(/[\\/?*[\]:]/g, ' ').slice(0, 31).trim() || 'Hoja';
  }

  private buildAiActionPlanPdfBlob(): Blob {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 42;
    const contentWidth = pageWidth - margin * 2;
    const pages: string[][] = [];
    let commands: string[] = [];
    let y = 0;

    const colors = {
      navy: [15, 23, 42],
      blue: [37, 99, 235],
      green: [22, 163, 74],
      orange: [245, 158, 11],
      red: [220, 38, 38],
      slate: [100, 116, 139],
      line: [226, 232, 240],
      soft: [248, 250, 252],
      white: [255, 255, 255],
      text: [15, 23, 42],
    };

    const rgb = (color: number[]) => color.map((value) => (value / 255).toFixed(3)).join(' ');
    const clean = (value: any) => String(value ?? '')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, '-')
      .replace(/≈/g, '~')
      .replace(/•/g, '-')
      .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, '');
    const escapeText = (value: any) => clean(value)
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
    const byteLength = (value: string) => value.length;
    const toBytes = (value: string) => {
      const bytes = new Uint8Array(value.length);
      for (let index = 0; index < value.length; index += 1) {
        bytes[index] = value.charCodeAt(index) & 0xff;
      }
      return bytes;
    };
    const cmd = (value: string) => commands.push(value);
    const rect = (x: number, top: number, width: number, height: number, fill: number[], stroke?: number[]) => {
      const bottom = pageHeight - top - height;
      cmd(`${rgb(fill)} rg ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`);
      if (stroke) {
        cmd(`${rgb(stroke)} RG ${x.toFixed(2)} ${bottom.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re S`);
      }
    };
    const line = (x1: number, top1: number, x2: number, top2: number, color: number[], width = 1) => {
      cmd(`${rgb(color)} RG ${width.toFixed(2)} w ${x1.toFixed(2)} ${(pageHeight - top1).toFixed(2)} m ${x2.toFixed(2)} ${(pageHeight - top2).toFixed(2)} l S`);
    };
    const text = (value: any, x: number, baselineTop: number, size = 10, bold = false, color = colors.text) => {
      cmd(`${rgb(color)} rg BT /${bold ? 'F2' : 'F1'} ${size.toFixed(2)} Tf ${x.toFixed(2)} ${(pageHeight - baselineTop).toFixed(2)} Td (${escapeText(value)}) Tj ET`);
    };
    const estimateWidth = (value: string, size: number) => clean(value).length * size * 0.48;
    const wrapText = (value: any, maxWidth: number, size = 10): string[] => {
      const words = clean(value).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
      const lines: string[] = [];
      let current = '';

      words.forEach((word) => {
        const candidate = current ? `${current} ${word}` : word;
        if (estimateWidth(candidate, size) <= maxWidth || !current) {
          current = candidate;
          return;
        }

        lines.push(current);
        current = word;
      });

      if (current) {
        lines.push(current);
      }

      return lines.length ? lines : ['-'];
    };
    const addPage = (first = false) => {
      commands = [];
      pages.push(commands);
      rect(0, 0, pageWidth, first ? 92 : 52, colors.navy);
      text('Plan de acción IA', margin, first ? 34 : 31, first ? 20 : 14, true, colors.white);
      text(
        `${this.selectedOrganizationName} · ${this.getModelName(this.selectedModel)}`,
        margin,
        first ? 58 : 48,
        first ? 10 : 8,
        false,
        colors.white
      );
      y = first ? 124 : 78;
    };
    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - 54) {
        addPage(false);
      }
    };
    const sectionTitle = (value: string) => {
      ensureSpace(34);
      text(value, margin, y, 13, true, colors.blue);
      y += 10;
      line(margin, y, pageWidth - margin, y, colors.line);
      y += 18;
    };
    const paragraph = (value: any, size = 9.5, color = colors.text, indent = 0) => {
      const lines = wrapText(value, contentWidth - indent, size);
      lines.forEach((row) => {
        ensureSpace(14);
        text(row, margin + indent, y, size, false, color);
        y += size + 4;
      });
    };
    const card = (title: string, body: string[], accent: number[] = colors.blue) => {
      const titleLines = wrapText(title, contentWidth - 28, 10.5);
      const bodyLines = body.flatMap((item) => wrapText(item, contentWidth - 28, 8.7));
      const height = 24 + titleLines.length * 13 + bodyLines.length * 12 + 10;
      ensureSpace(height);
      const startY = y - 13;
      rect(margin, startY, contentWidth, height, colors.soft, colors.line);
      rect(margin, startY, 4, height, accent);
      y += 4;
      titleLines.forEach((row) => {
        text(row, margin + 14, y, 10.5, true, colors.text);
        y += 13;
      });
      y += 2;
      bodyLines.forEach((row) => {
        text(row, margin + 14, y, 8.7, false, colors.slate);
        y += 12;
      });
      y = startY + height + 12;
    };
    const severityColor = (value: string) => {
      const key = this.normalizeKey(value);
      if (key.includes('ALTA') || key.includes('ALTO')) return colors.red;
      if (key.includes('BAJA') || key.includes('BAJO')) return colors.green;
      return colors.orange;
    };

    addPage(true);
    sectionTitle('Resumen ejecutivo');
    paragraph(this.aiExecutiveSummary || 'No se recibió resumen ejecutivo.', 9.5);

    if (this.aiKeyFindings.length) {
      sectionTitle('Hallazgos clave');
      this.aiKeyFindings.forEach((finding) => {
        const severity = this.getAiSeverityLabel(finding);
        const body = [
          `Severidad: ${severity}`,
          this.getText(finding, ['descripcion', 'Descripcion'], ''),
          this.getAiList(finding, ['puestosImpactados', 'PuestosImpactados']).length
            ? `Puestos impactados: ${this.getAiList(finding, ['puestosImpactados', 'PuestosImpactados']).join(', ')}`
            : '',
          this.getAiList(finding, ['dimensiones', 'Dimensiones']).length
            ? `Dimensiones: ${this.getAiList(finding, ['dimensiones', 'Dimensiones']).join(', ')}`
            : '',
        ].filter(Boolean);
        card(this.getText(finding, ['titulo', 'Titulo'], 'Hallazgo'), body, severityColor(severity));
      });
    }

    if (this.aiRecommendedActions.length) {
      sectionTitle('Plan de acción recomendado');
      this.aiRecommendedActions.forEach((action, index) => {
        card(
          `${this.getAiActionPriority(action, index)}. ${this.getAiActionTitle(action)}`,
          [
            `Objetivo: ${this.getAiActionObjective(action)}`,
            `Responsable: ${this.getAiActionOwner(action)}`,
            `Plazo: ${this.getAiActionDeadline(action)}`,
            `Indicador: ${this.getAiActionMetric(action)}`,
            `Impacto esperado: ${this.getAiActionImpact(action)}`,
          ],
          severityColor(this.getAiActionImpact(action))
        );
      });
    }

    const drawPlanGroup = (title: string, plans: any[], labelKeys: string[]) => {
      if (!plans.length) {
        return;
      }

      sectionTitle(title);
      plans.forEach((plan) => {
        card(
          this.getText(plan, labelKeys, title),
          [
            ...this.getAiList(plan, ['hallazgos', 'Hallazgos']).map((finding) => `Hallazgo: ${finding}`),
            ...this.getCollection(plan, ['acciones', 'Acciones']).map((action, index) =>
              `${this.getAiActionPriority(action, index)}. ${this.getAiActionTitle(action)} | ${this.getAiActionDeadline(action)} | Impacto ${this.getAiActionImpact(action)}`
            ),
          ],
          colors.blue
        );
      });
    };

    drawPlanGroup('Planes por puesto', this.aiPositionPlans, ['puesto', 'Puesto']);
    drawPlanGroup('Planes por empleado', this.aiEmployeePlans, ['empleado', 'Empleado']);

    pages.forEach((page, index) => {
      commands = page;
      line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38, colors.line);
      text(`Generado desde JustLink · ${this.formatDate(new Date())}`, margin, pageHeight - 22, 7.5, false, colors.slate);
      text(`Página ${index + 1} de ${pages.length}`, pageWidth - margin - 58, pageHeight - 22, 7.5, false, colors.slate);
    });

    const objects: string[] = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push(`<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(' ')}] /Count ${pages.length} >>`);
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

    pages.forEach((page, index) => {
      const pageObject = 5 + index * 2;
      const contentObject = pageObject + 1;
      const stream = page.join('\n');
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`);
      objects.push(`<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    });

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(byteLength(pdf));
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return new Blob([toBytes(pdf)], { type: 'application/pdf' });
  }

  private buildEmployeeDetailExportRows(): Array<Record<string, string>> {
    const employees = this.dashboardData?.empleadosEvaluados ?? [];
    const rows: Array<Record<string, string>> = [];

    employees.forEach((employee) => {
      const empleado = this.getEmployeeName(employee);
      const puesto = this.getEmployeePosition(employee);

      this.getEmployeeEvaluationDetails(employee).forEach((evaluation) => {
        const evaluacion = this.getEvaluationName(evaluation);
        const escenario = this.getEvaluationDetailScenarioName(evaluation);
        const evaluador = this.getEvaluationEvaluatorName(evaluation);
        const evaluationTarget = this.getEvaluationDetailTarget(evaluation);

        this.getEvaluationDetailDimensions(evaluation).forEach((dimension) => {
          const dimensionName = this.getDimensionDisplayName(dimension);
          const dimensionTarget = this.getDimensionDetailTarget(dimension) ?? evaluationTarget;

          this.getCriterionDetailRows(dimension).forEach((criterion) => {
            const criterio = this.getCriterionDetailName(criterion);
            const criterionTarget = this.getCriterionDetailTarget(criterion) ?? dimensionTarget;
            const items = this.getItemDetailRows(criterion);

            if (items.length === 0) {
              const score = this.getCriterionDetailScore(criterion);
              const tone = this.getDetailTone(score, criterionTarget);
              rows.push({
                empleado,
                puesto,
                evaluacion,
                escenario,
                evaluador,
                dimension: dimensionName,
                criterio,
                item: 'Sin ítems detallados',
                respuesta: '-',
                resultado: this.formatScore(score),
                exigencia: this.formatScore(criterionTarget),
                brecha: this.formatGap(this.getDetailGap(score, criterionTarget)),
                estado: this.getDetailToneLabel(score, criterionTarget),
                tono: tone,
              });
              return;
            }

            items.forEach((item) => {
              const score = this.getItemDetailScore(item);
              const target = this.getItemDetailTarget(item, criterion, dimension) ?? criterionTarget;
              const tone = this.getDetailTone(score, target);
              rows.push({
                empleado,
                puesto,
                evaluacion,
                escenario,
                evaluador,
                dimension: dimensionName,
                criterio,
                item: this.getItemDetailText(item),
                respuesta: this.getItemDetailAnswer(item),
                resultado: this.formatScore(score),
                exigencia: this.formatScore(target),
                brecha: this.formatGap(this.getDetailGap(score, target)),
                estado: this.getDetailToneLabel(score, target),
                tono: tone,
              });
            });
          });
        });
      });
    });

    return rows;
  }

  private getExcelToneFill(tone: string | null | undefined): any {
    const normalized = this.normalizeDetailTone(tone);
    const colors: Record<DetailResultTone, string> = {
      above: 'FFE8F8EE',
      expected: 'FFEFF6FF',
      below: 'FFFFEBEE',
      neutral: 'FFF1F5F9',
    };

    return { type: 'pattern', pattern: 'solid', fgColor: { argb: colors[normalized] } };
  }

  private getExcelToneFont(tone: string | null | undefined): any {
    const normalized = this.normalizeDetailTone(tone);
    const colors: Record<DetailResultTone, string> = {
      above: 'FF15803D',
      expected: 'FF1D4ED8',
      below: 'FFB91C1C',
      neutral: 'FF475569',
    };

    return { color: { argb: colors[normalized] } };
  }

  private normalizeDetailTone(tone: string | null | undefined): DetailResultTone {
    return tone === 'above' || tone === 'expected' || tone === 'below' || tone === 'neutral'
      ? tone
      : 'neutral';
  }

  private resultColumns(firstHeader: string): Array<{ header: string; key: string; width?: number }> {
    return [
      { header: firstHeader, key: 'nombre', width: 34 },
      { header: 'Calificacion', key: 'calificacion', width: 16 },
      { header: 'Exigencia', key: 'exigencia', width: 16 },
      { header: 'Brecha', key: 'brecha', width: 16 },
    ];
  }

  private rankingColumns(): Array<{ header: string; key: string; width?: number }> {
    return [
      { header: 'Criterio', key: 'criterio', width: 34 },
      { header: 'Detalle', key: 'detalle', width: 44 },
      { header: 'Calificacion', key: 'calificacion', width: 16 },
      { header: 'Exigencia', key: 'exigencia', width: 16 },
      { header: 'Brecha', key: 'brecha', width: 16 },
    ];
  }

  private toResultExportRow(item: any, labelKeys: string[]): Record<string, string> {
    return {
      nombre: this.getText(item, labelKeys),
      calificacion: this.formatScore(this.getNumber(item, ['calificacionPromedio', 'resultadoPromedio', 'resultadoTotal', 'resultado'])),
      exigencia: this.formatScore(this.getNumber(item, ['nivelExigenciaPromedio', 'nivelExigenciaTotal', 'nivelExigencia'])),
      brecha: this.formatGap(this.getNumber(item, ['brechaPromedio', 'brechaTotal', 'brecha'])),
    };
  }

  private toRankingExportRow(item: any): Record<string, string> {
    return {
      criterio: this.getRankingTitle(item),
      detalle: this.getRankingMeta(item),
      calificacion: this.formatScore(this.getNumber(item, ['calificacionPromedio', 'resultadoPromedio', 'resultadoTotal', 'resultado'])),
      exigencia: this.formatScore(this.getNumber(item, ['nivelExigenciaPromedio', 'nivelExigenciaTotal', 'nivelExigencia'])),
      brecha: this.formatGap(this.getNumber(item, ['brechaPromedio', 'brechaTotal', 'brecha'])),
    };
  }

  private t(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }
}
