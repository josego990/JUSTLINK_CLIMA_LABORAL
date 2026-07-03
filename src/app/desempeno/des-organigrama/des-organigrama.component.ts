import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  Edge,
  MiniMapPosition,
  NgxGraphModule,
  NgxGraphZoomOptions,
  Node,
  Orientation,
  PanningAxis,
} from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

interface DesOrganizationOption {
  Id: number;
  Nombre: string;
}

interface OrgChartNode {
  id: string;
  idEmpleado: number | null;
  idEmpleadoJefe: number | null;
  idEmpleadosJefe: number[];
  nombreCompleto: string;
  cargo: string;
  correo: string | null;
  telefono: string | null;
  nivel: string;
  demograficos: Record<string, string | null>;
  children: OrgChartNode[];
}

interface OrgChartMetric {
  icon: string;
  label: string;
  value: number;
  accent: string;
}

interface DemographicFilterOption {
  key: string;
  distinctCount: number;
}

interface OrgGraphNodeData extends OrgChartNode {
  demographicEntries: Array<{ label: string; value: string }>;
  pathLabel: string | null;
}

@Component({
  selector: 'app-des-organigrama',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    TranslateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxGraphModule,
  ],
  templateUrl: './des-organigrama.component.html',
  styles: [`
    .card {
      min-height: calc(100vh - 136px);
      display: flex;
      flex-direction: column;
    }

    .body {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .org-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: end;
      margin-bottom: 1rem;
    }

    .org-panel {
      background: #fff;
      border: 1px solid #dde7f0;
      border-radius: 18px;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
    }

    .org-meta {
      color: #64748b;
      font-size: 0.84rem;
    }

    .org-panel {
      padding: 16px;
      margin-bottom: 1rem;
      border-color: #d8e1ea;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 10px 24px rgba(15, 23, 42, 0.05);
    }

    .org-panel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0;
      margin-top: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      background: rgba(248, 250, 252, 0.9);
    }

    .org-panel-cell {
      padding: 12px 14px;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      background: rgba(255, 255, 255, 0.75);
    }

    .org-panel-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .org-panel-role {
      color: #334155;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .org-tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .org-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      color: #1d4ed8;
      font-size: 0.76rem;
      font-weight: 600;
    }

    .org-graph-controls {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 10px;
    }

    .org-graph-controls .mat-mdc-icon-button {
      border: 1px solid #d8e1ea;
      background: rgba(255, 255, 255, 0.92);
    }

    .org-graph-controls .mat-mdc-icon-button.active {
      border-color: #60a5fa;
      background: #eff6ff;
      color: #2563eb;
    }

    .org-graph-shell {
      flex: 1;
      min-height: 680px;
      border-radius: 22px;
      border: 1px solid #dde7f0;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(34, 197, 94, 0.08), transparent 28%),
        radial-gradient(circle at top right, rgba(14, 165, 233, 0.09), transparent 26%),
        #f8fafc;
    }

    .org-graph {
      display: block;
      width: 100%;
      height: 100%;
    }

    .org-node-wrap {
      width: 100%;
      height: 100%;
      padding: 8px;
    }

    .org-node-card {
      height: 100%;
      border-radius: 18px;
      border: 1px solid #dbe3ef;
      background: #fff;
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      padding: 14px 14px 14px 16px;
      position: relative;
      overflow: hidden;
    }

    .org-node-card::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 5px;
      background: #22c55e;
    }

    .org-node-card.level-subdepartamento::before {
      background: #0ea5e9;
    }

    .org-node-card.level-area::before {
      background: #f59e0b;
    }

    .org-node-card.level-direccion::before {
      background: #8b5cf6;
    }

    .org-node-card.level-organizacion::before {
      background: #0f7abf;
    }

    .org-node-card.level-empleado::before {
      background: #64748b;
    }

    .org-node-card.selected {
      border: 2px solid #2563eb;
      background: linear-gradient(180deg, #eff6ff 0%, #ffffff 88%);
      box-shadow:
        0 0 0 4px rgba(37, 99, 235, 0.18),
        0 18px 34px rgba(37, 99, 235, 0.24),
        0 10px 22px rgba(15, 23, 42, 0.12);
    }

    .org-node-card.selected::before {
      width: 8px;
      background: #2563eb;
    }

    .org-node-card.selected::after {
      content: 'Seleccionado';
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 3px 8px;
      border-radius: 999px;
      background: #2563eb;
      color: #fff;
      font-size: 0.64rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .org-node-card.selected .org-node-name {
      color: #1d4ed8;
    }

    .org-node-name {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .org-node-role {
      color: #334155;
      font-size: 0.82rem;
      font-weight: 600;
      line-height: 1.25;
      margin-bottom: 12px;
    }

    .org-node-meta,
    .org-node-path {
      color: #64748b;
      font-size: 0.76rem;
      line-height: 1.3;
    }

    .org-empty,
    .org-loading {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #64748b;
      text-align: center;
      padding: 24px;
    }

    :host ::ng-deep ngx-graph .line {
      stroke: #94a3b8;
    }

    :host ::ng-deep ngx-graph .arrow-head {
      fill: #94a3b8;
    }

    :host ::ng-deep ngx-graph .minimap {
      background: rgba(255, 255, 255, 0.94);
      border-left: 1px solid #dde7f0;
      border-top: 1px solid #dde7f0;
    }

    @media (max-width: 991.98px) {
      .org-graph-shell {
        min-height: 620px;
      }

      .org-graph-controls {
        justify-content: flex-start;
      }
    }
  `],
})
export class DesOrganigramaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('graphViewport')
  graphViewport?: ElementRef<HTMLDivElement>;

  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.ORGANIGRAMA.TEXT';
  readonly Orientation = Orientation;
  readonly panningAxis = PanningAxis.Both;
  readonly miniMapPosition = MiniMapPosition.UpperRight;
  readonly nodeWidth = 260;
  readonly nodeHeight = 176;
  public dataSourceOrganizations: DesOrganizationOption[] = [];
  public selectedOrganizationId: number | null = null;
  public chartRoots: OrgChartNode[] = [];
  public chartMessage = '';
  public availableDemographicFilters: DemographicFilterOption[] = [];
  public pendingDemographicKeys: string[] = [];
  public appliedDemographicKeys: string[] = [];
  public graphNodes: Node[] = [];
  public graphLinks: Edge[] = [];
  public graphView: [number, number] = [1200, 760];
  public isLoadingOrganizations = false;
  public isLoadingChart = false;
  public layoutOrientation: Orientation = Orientation.LEFT_TO_RIGHT;
  public layoutSettings = this.buildLayoutSettings();
  public selectedGraphNode: Node | null = null;
  public readonly updateGraph$ = new Subject<void>();
  public readonly centerGraph$ = new Subject<void>();
  public readonly zoomToFitGraph$ = new Subject<NgxGraphZoomOptions>();
  private resizeObserver: ResizeObserver | null = null;
  private graphRefreshTimer: number | null = null;

  constructor(private organizacionService: OrganizacionService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  ngAfterViewInit(): void {
    this.bindResizeObserver();
    this.syncGraphView();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();

    if (this.graphRefreshTimer !== null) {
      window.clearTimeout(this.graphRefreshTimer);
    }

    this.updateGraph$.complete();
    this.centerGraph$.complete();
    this.zoomToFitGraph$.complete();
  }

  get hasSelectedOrganization(): boolean {
    return !!this.selectedOrganizationId;
  }

  get selectedOrganization(): DesOrganizationOption | undefined {
    return this.dataSourceOrganizations.find((item) => item.Id === this.selectedOrganizationId);
  }

  get hasChartData(): boolean {
    return this.chartRoots.length > 0;
  }

  get chartMetrics(): OrgChartMetric[] {
    const nodes = this.flattenForest(this.chartRoots);
    const employeeNodes = nodes.filter((node) => node.idEmpleado !== null);

    return [
      {
        icon: 'group',
        label: 'Colaboradores',
        value: employeeNodes.length,
        accent: '#22c55e',
      },
      {
        icon: 'lan',
        label: 'Sub departamentos',
        value: this.countNodesByLevel(nodes, 'SUB_DEPARTAMENTO'),
        accent: '#0ea5e9',
      },
      {
        icon: 'account_tree',
        label: 'Areas',
        value: this.countNodesByLevel(nodes, 'AREA'),
        accent: '#f59e0b',
      },
    ];
  }

  get selectedNodeData(): OrgGraphNodeData | null {
    const data = this.selectedGraphNode?.data;
    return data && typeof data === 'object' ? (data as OrgGraphNodeData) : null;
  }

  onOrganizationChange(value: any): void {
    this.selectedOrganizationId = this.toPositiveInteger(value);
    this.loadOrgChart();
  }

  isDemographicPending(key: string): boolean {
    return this.pendingDemographicKeys.includes(key);
  }

  toggleDemographicKey(key: string, checked: boolean): void {
    if (checked) {
      if (!this.pendingDemographicKeys.includes(key)) {
        this.pendingDemographicKeys = [...this.pendingDemographicKeys, key];
      }
      return;
    }

    this.pendingDemographicKeys = this.pendingDemographicKeys.filter((item) => item !== key);
  }

  generateOrganigram(): void {
    const availableKeys = new Set(this.availableDemographicFilters.map((item) => item.key));
    const nextKeys = this.pendingDemographicKeys.filter((key) => availableKeys.has(key));

    if (nextKeys.length === 0) {
      Swal.fire(
        'Campos requeridos',
        'Selecciona al menos un campo demográfico para usarlo en el organigrama.',
        'warning'
      );
      return;
    }

    this.appliedDemographicKeys = [...nextKeys];
    this.rebuildGraphFromTree();
    this.queueGraphRefresh(true);
  }

  setOrientation(orientation: Orientation): void {
    if (this.layoutOrientation === orientation) {
      return;
    }

    this.layoutOrientation = orientation;
    this.layoutSettings = this.buildLayoutSettings();
    this.queueGraphRefresh(true);
  }

  fitGraph(): void {
    this.zoomToFitGraph$.next({ autoCenter: true, force: true });
  }

  centerGraph(): void {
    this.centerGraph$.next();
  }

  onGraphSelect(entry: any): void {
    if (entry?.data?.nombreCompleto) {
      this.selectedGraphNode = entry as Node;
    }
  }

  getSelectedNodeSubtitle(node: OrgGraphNodeData): string {
    return node.cargo || this.getNodeCardTitle(node);
  }

  getSubordinateCount(node: OrgGraphNodeData | null | undefined): number {
    if (!node?.children?.length) {
      return 0;
    }

    return this.flattenForest(node.children).filter((child) => child.idEmpleado !== null).length;
  }

  getDirectSubordinateCount(node: OrgGraphNodeData | null | undefined): number {
    const employeeId = node?.idEmpleado;

    if (!employeeId) {
      return 0;
    }

    const nodes = this.flattenForest(this.chartRoots);
    const hasManagerData = nodes.some((item) => item.idEmpleadosJefe.length > 0);

    if (hasManagerData) {
      return nodes.filter((item) =>
        item.idEmpleado !== null &&
        item.idEmpleado !== employeeId &&
        item.idEmpleadosJefe.includes(employeeId)
      ).length;
    }

    return this.countFirstEmployeeChildren(node);
  }

  getNodeCardTitle(node: OrgGraphNodeData | null | undefined): string {
    if (!node) {
      return 'Equipo';
    }

    if (this.normalizeLevelKey(node.nivel) === 'ORGANIZACION') {
      return 'ORGANIZACION';
    }

    if (node.idEmpleado !== null && node.children.length === 0) {
      return 'EMPLEADO';
    }

    const deepestEntry = node.demographicEntries[node.demographicEntries.length - 1];
    return deepestEntry?.label || this.getLevelLabel(node.nivel);
  }

  getLevelLabel(level: string): string {
    switch (this.normalizeLevelKey(level)) {
      case 'ORGANIZACION':
        return 'Organizacion';
      case 'DIRECCION':
        return 'Direccion';
      case 'DEPARTAMENTO':
        return 'Departamento';
      case 'SUB_DEPARTAMENTO':
        return 'Sub departamento';
      case 'AREA':
        return 'Area';
      case 'EMPLEADO':
        return 'Empleado';
      default:
        return 'Equipo';
    }
  }

  getLevelClass(level: string): string {
    switch (this.normalizeLevelKey(level)) {
      case 'ORGANIZACION':
        return 'level-organizacion';
      case 'DIRECCION':
        return 'level-direccion';
      case 'SUB_DEPARTAMENTO':
        return 'level-subdepartamento';
      case 'AREA':
        return 'level-area';
      case 'EMPLEADO':
        return 'level-empleado';
      default:
        return 'level-departamento';
    }
  }

  async loadOrgChart(): Promise<void> {
    if (!this.selectedOrganization) {
      this.chartRoots = [];
      this.chartMessage = '';
      this.availableDemographicFilters = [];
      this.pendingDemographicKeys = [];
      this.appliedDemographicKeys = [];
      this.graphNodes = [];
      this.graphLinks = [];
      this.selectedGraphNode = null;
      return;
    }

    this.isLoadingChart = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganigrama(this.selectedOrganization.Id);
      const responseBody = response?.data ?? response;
      const payload = this.extractObject(response);

      this.chartRoots = this.normalizeOrgChartRoots(payload?.tree);
      this.chartMessage = String(responseBody?.message ?? '').trim();
      this.availableDemographicFilters = this.extractDemographicFilters(this.chartRoots);
      this.pendingDemographicKeys = this.availableDemographicFilters.map((item) => item.key);
      this.appliedDemographicKeys = [...this.pendingDemographicKeys];
      this.rebuildGraphFromTree();
    } catch (error) {
      console.error(error);
      this.chartRoots = [];
      this.graphNodes = [];
      this.graphLinks = [];
      this.selectedGraphNode = null;
      this.chartMessage = '';
      this.availableDemographicFilters = [];
      this.pendingDemographicKeys = [];
      this.appliedDemographicKeys = [];
      await Swal.fire(
        'No fue posible cargar el organigrama',
        'Ocurrió un problema al preparar la vista del organigrama.',
        'error'
      );
    } finally {
      this.isLoadingChart = false;
      this.queueGraphRefresh(true);
    }
  }

  private bindResizeObserver(): void {
    if (!this.graphViewport || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.syncGraphView());
    this.resizeObserver.observe(this.graphViewport.nativeElement);
  }

  private syncGraphView(): void {
    const host = this.graphViewport?.nativeElement;

    if (!host) {
      return;
    }

    const bounds = host.getBoundingClientRect();
    const nextWidth = Math.max(Math.floor(bounds.width), 960);
    const nextHeight = Math.max(Math.floor(host.clientHeight || bounds.height), 620);

    if (this.graphView[0] === nextWidth && this.graphView[1] === nextHeight) {
      return;
    }

    this.graphView = [nextWidth, nextHeight];
    this.queueGraphRefresh(true);
  }

  private queueGraphRefresh(zoomToFit = false): void {
    if (this.graphRefreshTimer !== null) {
      window.clearTimeout(this.graphRefreshTimer);
    }

    this.graphRefreshTimer = window.setTimeout(() => {
      this.updateGraph$.next();

      if (zoomToFit && this.graphNodes.length > 0) {
        this.zoomToFitGraph$.next({ autoCenter: true, force: true });
      }
    }, 50);
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

  private async loadOrganizations(): Promise<void> {
    this.isLoadingOrganizations = true;

    try {
      const response = await this.organizacionService.getDesempenoOrganizations();
      this.dataSourceOrganizations = this.extractCollection(response)
        .map((item) => this.normalizeOrganization(item))
        .filter((item) => item.Id > 0 && item.Nombre.length > 0);

      if (this.dataSourceOrganizations.length > 0) {
        this.selectedOrganizationId = this.dataSourceOrganizations[0].Id;
        await this.loadOrgChart();
      }
    } catch (error) {
      console.error(error);
      await Swal.fire(
        'No fue posible cargar las organizaciones',
        'Verifica la conexión con el backend de desempeño.',
        'error'
      );
    } finally {
      this.isLoadingOrganizations = false;
    }
  }

  private extractDemographicFilters(roots: OrgChartNode[]): DemographicFilterOption[] {
    if (roots.length === 0) {
      return [];
    }

    const valueMap = new Map<string, Set<string>>();

    this.flattenForest(roots).forEach((node) => {
      Object.entries(node.demograficos ?? {}).forEach(([key, rawValue]) => {
        const value = this.toOptionalText(rawValue);

        if (!value) {
          return;
        }

        if (!valueMap.has(key)) {
          valueMap.set(key, new Set<string>());
        }

        valueMap.get(key)?.add(value);
      });
    });

    return Array.from(valueMap.entries()).map(([key, values]) => ({
      key,
      distinctCount: values.size,
    }));
  }

  private rebuildGraphFromTree(): void {
    if (this.chartRoots.length === 0) {
      this.graphNodes = [];
      this.graphLinks = [];
      this.selectedGraphNode = null;
      return;
    }

    const previousSelectedId = this.selectedGraphNode?.id ?? null;
    const nodes: Node[] = [];
    const links: Edge[] = [];

    const visit = (current: OrgChartNode, parent: OrgChartNode | null): void => {
      const data = this.toGraphNodeData(current);
      nodes.push({
        id: data.id,
        label: data.nombreCompleto,
        data,
      });

      if (parent) {
        links.push({
          id: `${parent.id}-${current.id}`,
          source: parent.id,
          target: current.id,
        });
      }

      current.children.forEach((child) => visit(child, current));
    };

    this.chartRoots.forEach((root) => visit(root, null));

    this.graphNodes = nodes;
    this.graphLinks = links;
    this.selectedGraphNode =
      this.graphNodes.find((node) => node.id === previousSelectedId) ??
      this.graphNodes.find((node) => node.data?.idEmpleado !== null && node.data?.idEmpleado !== undefined) ??
      this.graphNodes[0] ??
      null;
  }

  private toGraphNodeData(node: OrgChartNode): OrgGraphNodeData {
    const demographicEntries = this.extractDemographicEntries(node);
    const pathLabel = demographicEntries
      .map((entry) => entry.value)
      .filter((value) => value.length > 0)
      .join(' / ');

    return {
      ...node,
      demographicEntries,
      pathLabel: pathLabel.length > 0 ? pathLabel : null,
    };
  }

  private extractDemographicEntries(node: OrgChartNode): Array<{ label: string; value: string }> {
    const values = node.demograficos ?? {};
    const preferredKeys =
      this.appliedDemographicKeys.length > 0
        ? this.appliedDemographicKeys
        : this.availableDemographicFilters.map((item) => item.key);
    const orderedKeys = preferredKeys.length > 0 ? preferredKeys : Object.keys(values);
    const usedKeys = new Set<string>();
    const entries: Array<{ label: string; value: string }> = [];

    orderedKeys.forEach((key) => {
      const value = this.toOptionalText(values[key]);

      if (value) {
        entries.push({ label: key, value });
        usedKeys.add(key);
      }
    });

    if (this.appliedDemographicKeys.length === 0) {
      Object.keys(values).forEach((key) => {
        if (usedKeys.has(key)) {
          return;
        }

        const value = this.toOptionalText(values[key]);

        if (value) {
          entries.push({ label: key, value });
        }
      });
    }

    return entries;
  }

  private buildLayoutSettings(): Record<string, any> {
    const isHorizontal = this.layoutOrientation === Orientation.LEFT_TO_RIGHT;

    return {
      orientation: this.layoutOrientation,
      rankPadding: isHorizontal ? 90 : 120,
      nodePadding: isHorizontal ? 30 : 24,
      edgePadding: 24,
      marginX: 48,
      marginY: 48,
    };
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

  private normalizeOrganization(item: any): DesOrganizationOption {
    return {
      Id: Number(item?.Id ?? item?.IdOrganizacion ?? item?.id ?? item?.idOrganizacion ?? 0),
      Nombre: String(item?.Nombre ?? item?.nombre ?? '').trim(),
    };
  }

  private normalizeOrgChartRoots(value: any): OrgChartNode[] {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeOrgChartNode(item));
    }

    if (value && typeof value === 'object') {
      return [this.normalizeOrgChartNode(value)];
    }

    return [];
  }

  private normalizeOrgChartNode(node: any): OrgChartNode {
    const managerIds = this.normalizeManagerIds(node);

    return {
      id: String(node?.id ?? node?.Id ?? `${Date.now()}-${Math.random()}`),
      idEmpleado: this.toPositiveInteger(node?.idEmpleado ?? node?.IdEmpleado),
      idEmpleadoJefe: managerIds[0] ?? null,
      idEmpleadosJefe: managerIds,
      nombreCompleto: String(node?.nombreCompleto ?? node?.NombreCompleto ?? '').trim(),
      cargo: String(node?.cargo ?? node?.Cargo ?? '').trim(),
      correo: this.toOptionalText(node?.correo ?? node?.Correo),
      telefono: this.toOptionalText(node?.telefono ?? node?.Telefono),
      nivel: String(node?.nivel ?? node?.Nivel ?? 'EQUIPO').trim(),
      demograficos: this.normalizeDemographics(node?.demograficos ?? node?.Demograficos),
      children: Array.isArray(node?.children)
        ? node.children.map((child: any) => this.normalizeOrgChartNode(child))
        : [],
    };
  }

  private normalizeManagerIds(node: any): number[] {
    const values = [
      node?.idEmpleadosJefe,
      node?.IdEmpleadosJefe,
      node?.idEmpleadoJefe,
      node?.IdEmpleadoJefe,
      node?.idJefe,
      node?.IdJefe,
      node?.idJefeEmpleado,
      node?.IdJefeEmpleado,
      node?.jefes,
      node?.Jefes,
    ];
    const managerIds = values.flatMap((value) => this.toPositiveIntegerList(value));

    return Array.from(new Set(managerIds));
  }

  private normalizeDemographics(value: any): Record<string, string | null> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return Object.entries(value).reduce<Record<string, string | null>>((accumulator, [key, rawValue]) => {
      accumulator[String(key)] = this.toOptionalText(rawValue);
      return accumulator;
    }, {});
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
      return value.flatMap((item) => this.toPositiveIntegerList(item));
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
        .map((item) => this.toPositiveInteger(item))
        .filter((item): item is number => item !== null);
    }

    const numericValue = this.toPositiveInteger(value);
    return numericValue ? [numericValue] : [];
  }

  private toOptionalText(value: any): string | null {
    const text = String(value ?? '').trim();
    return text.length > 0 ? text : null;
  }

  private normalizeLevelKey(level: string): string {
    return String(level ?? '')
      .trim()
      .toUpperCase()
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }

  private flattenTree(root: OrgChartNode): OrgChartNode[] {
    const nodes: OrgChartNode[] = [root];

    root.children.forEach((child) => {
      nodes.push(...this.flattenTree(child));
    });

    return nodes;
  }

  private flattenForest(roots: OrgChartNode[]): OrgChartNode[] {
    return roots.flatMap((root) => this.flattenTree(root));
  }

  private countFirstEmployeeChildren(node: OrgChartNode): number {
    let count = 0;

    const visit = (children: OrgChartNode[]): void => {
      children.forEach((child) => {
        if (child.idEmpleado !== null) {
          count += 1;
          return;
        }

        visit(child.children);
      });
    };

    visit(node.children);
    return count;
  }

  private countNodesByLevel(nodes: OrgChartNode[], level: string): number {
    const normalizedLevel = this.normalizeLevelKey(level);
    return nodes.filter((node) => this.normalizeLevelKey(node.nivel) === normalizedLevel).length;
  }
}
