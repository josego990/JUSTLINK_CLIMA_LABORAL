import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import {
  Edge,
  MiniMapPosition,
  NgxGraphModule,
  NgxGraphZoomOptions,
  Node,
  Orientation,
  PanningAxis,
} from '@swimlane/ngx-graph';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';

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
  values: string[];
  distinctCount: number;
}

interface OrgGraphNodeData extends OrgChartNode {
  demographicEntries: Array<{ label: string; value: string }>;
  pathLabel: string | null;
  levelClass: string;
  searchText: string;
}

@Component({
  selector: 'app-des-organigrama',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    TranslateModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
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
      margin: 0;
    }

    .org-filter-panel {
      display: grid;
      grid-template-columns: minmax(180px, auto) minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px 12px;
      padding: 7px 10px;
      margin-bottom: 8px;
      border-radius: 10px;
    }

    .org-filter-copy {
      min-width: 0;
    }

    .org-filter-title {
      margin: 0;
      font-size: 0.82rem;
      line-height: 1.2;
    }

    .org-filter-help {
      margin-top: 2px;
      font-size: 0.7rem;
      line-height: 1.2;
    }

    .org-filter-list {
      flex: initial;
      flex-wrap: nowrap;
      align-items: center;
      gap: 4px 7px;
      min-width: 0;
      padding-block: 1px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: thin;
    }

    .org-filter-item {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      height: 32px;
      min-height: 32px;
      padding: 0 7px 0 2px;
      border-radius: 6px;
    }

    :host ::ng-deep .org-filter-item .mdc-form-field {
      display: inline-flex;
      align-items: center;
      height: 32px;
      font-size: 0.76rem;
      line-height: 1.2;
    }

    :host ::ng-deep .org-filter-item .mdc-checkbox {
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      padding: 7px;
      box-sizing: border-box;
    }

    :host ::ng-deep .org-filter-item .mdc-checkbox__background {
      top: 7px;
      left: 7px;
    }

    :host ::ng-deep .org-filter-item .mat-mdc-checkbox-touch-target {
      width: 32px;
      height: 32px;
    }

    :host ::ng-deep .org-filter-item .mdc-label {
      display: inline-flex;
      align-items: center;
      line-height: 1.2;
    }

    .org-filter-count {
      display: inline-block;
      margin-left: 5px;
      line-height: 1.2;
    }

    .org-filter-actions {
      min-width: auto;
    }

    .org-filter-actions button {
      min-height: 34px;
      padding-inline: 14px;
    }

    .org-demographic-value-panel {
      display: grid;
      grid-template-columns: 270px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px 14px;
      padding: 9px 10px;
      margin-bottom: 8px;
      border: 1px solid #d8e5f1;
      border-radius: 10px;
      background: #f8fbff;
    }

    .org-demographic-value-copy {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      color: #475569;
    }

    .org-demographic-value-copy > div {
      min-width: 0;
      width: 100%;
    }

    .org-demographic-value-copy > mat-icon {
      width: 32px;
      height: 32px;
      padding: 5px;
      border-radius: 8px;
      background: #e0f2fe;
      color: #0369a1;
    }

    .org-demographic-value-copy strong,
    .org-demographic-value-copy span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .org-demographic-value-copy strong {
      color: #1e293b;
      font-size: 0.78rem;
    }

    .org-demographic-value-copy span {
      margin-top: 2px;
      font-size: 0.68rem;
      line-height: 1.25;
      overflow: visible;
      text-overflow: clip;
      white-space: normal;
    }

    .org-demographic-value-selects {
      display: flex;
      min-width: 0;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .org-demographic-value-selects .mat-mdc-form-field {
      flex: 0 0 190px;
      width: 190px;
    }

    :host ::ng-deep .org-demographic-value-selects .mat-mdc-text-field-wrapper,
    :host ::ng-deep .org-demographic-value-selects .mat-mdc-form-field-flex {
      min-height: 42px;
    }

    :host ::ng-deep .org-demographic-value-selects .mat-mdc-form-field-flex {
      align-items: center;
    }

    .org-clear-demographic-values {
      min-width: 94px;
    }

    @media (max-width: 1199.98px) {
      .org-demographic-value-panel {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .org-demographic-value-selects {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }

    .org-navigation-toolbar {
      display: grid;
      grid-template-columns: minmax(240px, 340px) minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      min-height: 58px;
      padding: 7px 9px;
      margin-bottom: 8px;
      position: relative;
      z-index: 12;
      border: 1px solid #d8e1ea;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 5px 14px rgba(15, 23, 42, 0.04);
    }

    .org-navigation-toolbar > .org-graph-controls {
      grid-column: 3;
      justify-self: end;
    }

    .org-employee-search {
      position: relative;
      width: min(440px, 100%);
    }

    .org-employee-search .mat-mdc-form-field {
      width: 100%;
    }

    :host ::ng-deep .org-employee-search .mat-mdc-text-field-wrapper,
    :host ::ng-deep .org-employee-search .mat-mdc-form-field-flex {
      height: 42px;
    }

    :host ::ng-deep .org-employee-search .mat-mdc-form-field-flex {
      align-items: center;
    }

    .org-search-results {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 310px;
      overflow-y: auto;
      padding: 6px;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
    }

    .org-search-result {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 9px 10px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: #0f172a;
      text-align: left;
      cursor: pointer;
    }

    .org-search-result:hover,
    .org-search-result:focus-visible {
      background: #eff6ff;
      outline: none;
    }

    .org-search-result mat-icon {
      color: #2563eb;
    }

    .org-search-result strong,
    .org-search-result small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .org-search-result small,
    .org-search-empty {
      color: #64748b;
    }

    .org-search-empty {
      padding: 14px;
      text-align: center;
      font-size: 0.84rem;
    }

    .org-selected-employee {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .org-selected-avatar {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 7px;
      background: #e8f1fb;
      color: #1769aa;
    }

    .org-selected-avatar mat-icon {
      width: 19px;
      height: 19px;
      font-size: 19px;
    }

    .org-selected-copy {
      min-width: 0;
    }

    .org-selected-identity {
      display: flex;
      align-items: baseline;
      gap: 7px;
      min-width: 0;
      line-height: 1.15;
    }

    .org-selected-identity strong,
    .org-selected-identity span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .org-selected-identity strong {
      flex: 0 1 auto;
      color: #172033;
      font-size: 0.82rem;
    }

    .org-selected-identity span {
      flex: 1 1 auto;
      color: #64748b;
      font-size: 0.71rem;
    }

    .org-selected-details,
    .org-selected-demographics {
      display: flex;
      align-items: center;
      gap: 4px 9px;
      min-width: 0;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: thin;
    }

    .org-selected-details {
      margin-top: 3px;
      color: #526175;
      font-size: 0.68rem;
    }

    .org-selected-details > span {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      min-width: 0;
      max-width: 190px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .org-selected-details mat-icon {
      flex: 0 0 auto;
      width: 13px;
      height: 13px;
      font-size: 13px;
      color: #64748b;
    }

    .org-selected-demographics {
      margin-top: 4px;
    }

    .org-selected-demographics > span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border: 1px solid #dbe4ee;
      border-radius: 5px;
      background: #f6f9fc;
      color: #475569;
      font-size: 0.64rem;
    }

    .org-selected-demographics b {
      color: #1769aa;
      font-weight: 800;
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

    .org-performance-notice {
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      padding: 8px 10px;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      background: #eff6ff;
      color: #334155;
    }

    .org-performance-notice > mat-icon {
      color: #2563eb;
    }

    .org-performance-notice strong,
    .org-performance-notice span {
      display: block;
    }

    .org-performance-notice strong {
      color: #1e3a8a;
      font-size: 0.78rem;
    }

    .org-performance-notice span {
      margin-top: 2px;
      font-size: 0.7rem;
      line-height: 1.3;
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
      min-height: 100%;
      border-radius: 18px;
      border: 1px solid #dbe3ef;
      background: #fff;
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      padding: 14px 14px 14px 16px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
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

    .org-node-card.direct-subordinate {
      border: 2px solid #0d9488;
      background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 88%);
      box-shadow:
        0 0 0 4px rgba(13, 148, 136, 0.14),
        0 16px 30px rgba(13, 148, 136, 0.18);
    }

    .org-node-card.direct-subordinate::before {
      width: 8px;
      background: #0d9488;
    }

    .org-node-card.direct-subordinate .org-node-name {
      color: #0f766e;
    }

    .org-node-name {
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 4px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .org-node-role {
      color: #334155;
      font-size: 0.82rem;
      font-weight: 600;
      line-height: 1.25;
      margin-bottom: 12px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .org-node-meta,
    .org-node-path {
      color: #64748b;
      font-size: 0.76rem;
      line-height: 1.3;
      overflow-wrap: anywhere;
      word-break: break-word;
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

    :host-context(.dark) .org-filter-panel,
    :host-context(.dark) .org-demographic-value-panel,
    :host-context(.dark) .org-navigation-toolbar {
      border-color: #30394a;
      background: #151a24;
      box-shadow: none;
    }

    :host-context(.dark) .org-performance-notice {
      border-color: #294566;
      background: #16263a;
      color: #b7c6d9;
    }

    :host-context(.dark) .org-performance-notice strong {
      color: #bfdbfe;
    }

    :host-context(.dark) .org-filter-item,
    :host-context(.dark) .org-selected-demographics > span {
      border-color: #354052;
      background: #1c2330;
    }

    :host-context(.dark) .org-selected-identity strong {
      color: #edf2f8;
    }

    :host-context(.dark) .org-demographic-value-copy strong {
      color: #edf2f8;
    }

    :host-context(.dark) .org-selected-identity span,
    :host-context(.dark) .org-selected-details,
    :host-context(.dark) .org-selected-details mat-icon,
    :host-context(.dark) .org-selected-demographics > span {
      color: #a9b5c7;
    }

    :host-context(.dark) .org-search-results {
      border-color: #354052;
      background: #171d27;
    }

    :host-context(.dark) .org-search-result {
      color: #edf2f8;
    }

    :host-context(.dark) .org-search-result:hover,
    :host-context(.dark) .org-search-result:focus-visible {
      background: #222b39;
    }

    @media (max-width: 991.98px) {
      .org-graph-shell {
        min-height: 620px;
      }

      .org-graph-controls {
        justify-content: flex-start;
      }

      .org-navigation-toolbar {
        align-items: stretch;
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .org-employee-search {
        width: auto;
      }

      .org-selected-employee {
        grid-column: 1 / -1;
        grid-row: 2;
      }

      .org-navigation-toolbar > .org-graph-controls {
        grid-column: 2;
      }

      .org-filter-panel {
        grid-template-columns: 1fr auto;
      }

      .org-demographic-value-panel {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .org-demographic-value-selects {
        grid-column: 1 / -1;
        grid-row: 2;
      }

      .org-filter-list {
        grid-column: 1 / -1;
        grid-row: 2;
      }
    }

    @media (max-width: 575.98px) {
      .org-navigation-toolbar,
      .org-filter-panel,
      .org-demographic-value-panel,
      .org-performance-notice {
        grid-template-columns: minmax(0, 1fr);
      }

      .org-graph-controls,
      .org-filter-actions {
        justify-content: flex-end;
      }

      .org-graph-controls,
      .org-selected-employee,
      .org-filter-list,
      .org-filter-actions,
      .org-demographic-value-selects,
      .org-clear-demographic-values {
        grid-column: 1;
        grid-row: auto;
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
  readonly nodeWidth = 320;
  public nodeHeight = 220;
  public dataSourceOrganizations: DesOrganizationOption[] = [];
  public selectedOrganizationId: number | null = null;
  public chartRoots: OrgChartNode[] = [];
  public chartMessage = '';
  public availableDemographicFilters: DemographicFilterOption[] = [];
  public pendingDemographicKeys: string[] = [];
  public appliedDemographicKeys: string[] = [];
  public demographicValueFilters: Record<string, string[]> = {};
  public graphNodes: Node[] = [];
  public graphLinks: Edge[] = [];
  public allGraphNodes: Node[] = [];
  public totalFilteredNodeCount = 0;
  public isGraphLimited = false;
  public focusedNodeId: string | null = null;
  public graphView: [number, number] = [1200, 760];
  public isLoadingOrganizations = false;
  public isLoadingChart = false;
  public employeeSearchTerm = '';
  public isEmployeeSearchOpen = false;
  public layoutOrientation: Orientation = Orientation.LEFT_TO_RIGHT;
  public layoutSettings = this.buildLayoutSettings();
  public selectedGraphNode: Node | null = null;
  public readonly centerGraph$ = new Subject<void>();
  public readonly zoomToFitGraph$ = new Subject<NgxGraphZoomOptions>();
  public readonly panToNode$ = new Subject<string>();
  public directSubordinateEmployeeIds = new Set<number>();
  public readonly maxRenderedNodes = 240;
  private readonly emptyDemographicValueFilter: string[] = [];
  private pendingZoomToFit = false;
  private pendingPanToNodeId: string | null = null;
  private selectedOrganizationSubscription?: Subscription;
  private graphResizeObserver?: ResizeObserver;
  private graphResizeFrameId: number | null = null;


   existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
    }

  constructor(private router: Router, private organizacionService: OrganizacionService) {}

  ngOnInit(): void {
    this.setupSelectedOrganizationListener();

    //validar accesos al modulo..
    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
      console.log('RUTAS DESDE sessionStorage:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/desempeno/organigrama');
      //console.log(found);

      if(!found){
        this.router.navigate(['/authentication/page404']);
      }

    }

  }

  ngAfterViewInit(): void {
    this.syncGraphView();
    this.observeGraphViewportResize();
    window.addEventListener('resize', this.handleWindowResize, { passive: true });
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
    this.graphResizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleWindowResize);

    if (this.graphResizeFrameId !== null) {
      window.cancelAnimationFrame(this.graphResizeFrameId);
      this.graphResizeFrameId = null;
    }

    this.centerGraph$.complete();
    this.zoomToFitGraph$.complete();
    this.panToNode$.complete();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.dataSourceOrganizations = [];
        this.onOrganizationChange(null);
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.selectedOrganizationId === organization.Id) {
        return;
      }

      this.onOrganizationChange(organization.Id);
    });
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

  get hasActiveDemographicValueFilters(): boolean {
    return Object.values(this.demographicValueFilters).some((values) => values.length > 0);
  }

  get chartMetrics(): OrgChartMetric[] {
    const nodes = this.getVisibleGraphNodeData();
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

  get employeeSearchResults(): Node[] {
    const search = this.normalizeSearchText(this.employeeSearchTerm);
    if (!search) {
      return [];
    }

    return this.allGraphNodes
      .filter((node) => {
        const data = node.data as OrgGraphNodeData | undefined;
        return data?.idEmpleado !== null &&
          data?.idEmpleado !== undefined &&
          data.searchText.includes(search);
      })
      .sort((left, right) =>
        String(left.data?.nombreCompleto ?? '').localeCompare(
          String(right.data?.nombreCompleto ?? ''),
          'es',
          { sensitivity: 'base' }
        )
      )
      .slice(0, 10);
  }

  get showGraphMiniMap(): boolean {
    return this.graphNodes.length > 0 && this.graphNodes.length <= 100;
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

  getDemographicValueFilter(key: string): string[] {
    return this.demographicValueFilters[key] ?? this.emptyDemographicValueFilter;
  }

  setDemographicValueFilter(key: string, values: string[] | null | undefined): void {
    const nextValues = Array.from(
      new Set((values ?? []).map((value) => this.toOptionalText(value)).filter((value): value is string => !!value))
    );

    const nextFilters = { ...this.demographicValueFilters };

    if (nextValues.length > 0) {
      nextFilters[key] = nextValues;
    } else {
      delete nextFilters[key];
    }

    this.demographicValueFilters = nextFilters;
    this.focusedNodeId = null;
    this.rebuildGraphFromTree();
    this.queueGraphRefresh(true);
  }

  clearDemographicValueFilters(): void {
    if (!this.hasActiveDemographicValueFilters) {
      return;
    }

    this.demographicValueFilters = {};
    this.focusedNodeId = null;
    this.rebuildGraphFromTree();
    this.queueGraphRefresh(true);
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
    this.focusedNodeId = null;
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
      this.selectGraphNode(entry as Node, false);
    }
  }

  onEmployeeSearchChange(): void {
    this.isEmployeeSearchOpen = this.employeeSearchTerm.trim().length > 0;
  }

  openEmployeeSearchResults(): void {
    this.isEmployeeSearchOpen = this.employeeSearchTerm.trim().length > 0;
  }

  closeEmployeeSearchResults(): void {
    this.isEmployeeSearchOpen = false;
  }

  clearEmployeeSearch(): void {
    this.employeeSearchTerm = '';
    this.isEmployeeSearchOpen = false;
  }

  selectEmployeeSearchResult(node: Node): void {
    this.employeeSearchTerm = String(node.data?.nombreCompleto ?? node.label ?? '').trim();
    this.isEmployeeSearchOpen = false;

    if (!this.graphNodes.some((graphNode) => graphNode.id === node.id)) {
      this.focusedNodeId = node.id;
      this.rebuildGraphFromTree();
      this.pendingPanToNodeId = node.id;
      this.queueGraphRefresh(true);
    }

    const visibleNode = this.graphNodes.find((graphNode) => graphNode.id === node.id) ?? node;
    this.selectGraphNode(visibleNode, this.pendingPanToNodeId === null);
  }

  showGeneralGraph(): void {
    if (!this.focusedNodeId) {
      return;
    }

    this.focusedNodeId = null;
    this.rebuildGraphFromTree();
    this.queueGraphRefresh(true);
  }

  onGraphStateChange(event: { state?: string } | null | undefined): void {
    if (event?.state !== 'output') {
      return;
    }

    if (this.pendingZoomToFit) {
      this.pendingZoomToFit = false;
      window.setTimeout(() => {
        this.zoomToFitGraph$.next({ autoCenter: true, force: true });
      });
    }

    if (this.pendingPanToNodeId) {
      const nodeId = this.pendingPanToNodeId;
      this.pendingPanToNodeId = null;
      window.setTimeout(() => this.panToNode$.next(nodeId), 60);
    }
  }

  isDirectSubordinateNode(node: Node | null | undefined): boolean {
    const employeeId = this.toPositiveInteger(node?.data?.idEmpleado);
    return employeeId !== null && this.directSubordinateEmployeeIds.has(employeeId);
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

    const nodes = this.getVisibleGraphNodeData();
    const hasManagerData = nodes.some((item) => item.idEmpleadosJefe.length > 0);

    if (hasManagerData) {
      return nodes.filter((item) =>
        item.idEmpleado !== null &&
        item.idEmpleado !== employeeId &&
        item.idEmpleadoJefe === employeeId
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
      this.demographicValueFilters = {};
      this.graphNodes = [];
      this.graphLinks = [];
      this.allGraphNodes = [];
      this.totalFilteredNodeCount = 0;
      this.isGraphLimited = false;
      this.focusedNodeId = null;
      this.selectedGraphNode = null;
      this.employeeSearchTerm = '';
      this.isEmployeeSearchOpen = false;
      this.directSubordinateEmployeeIds.clear();
      return;
    }

    this.isLoadingChart = true;
    this.employeeSearchTerm = '';
    this.isEmployeeSearchOpen = false;
    this.directSubordinateEmployeeIds.clear();

    try {
      const response = await this.organizacionService.getDesempenoOrganigrama(this.selectedOrganization.Id);
      const responseBody = response?.data ?? response;
      const payload = this.extractObject(response);

      this.chartRoots = this.normalizeOrgChartRoots(payload?.tree);
      this.chartMessage = String(responseBody?.message ?? '').trim();
      this.availableDemographicFilters = this.extractDemographicFilters(this.chartRoots);
      this.pendingDemographicKeys = this.availableDemographicFilters.map((item) => item.key);
      this.appliedDemographicKeys = [...this.pendingDemographicKeys];
      this.demographicValueFilters = {};
      this.focusedNodeId = null;
      this.rebuildGraphFromTree();
    } catch (error) {
      console.error(error);
      this.chartRoots = [];
      this.graphNodes = [];
      this.graphLinks = [];
      this.allGraphNodes = [];
      this.totalFilteredNodeCount = 0;
      this.isGraphLimited = false;
      this.focusedNodeId = null;
      this.selectedGraphNode = null;
      this.directSubordinateEmployeeIds.clear();
      this.chartMessage = '';
      this.availableDemographicFilters = [];
      this.pendingDemographicKeys = [];
      this.appliedDemographicKeys = [];
      this.demographicValueFilters = {};
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

  private syncGraphView(): boolean {
    const host = this.graphViewport?.nativeElement;

    if (!host) {
      return false;
    }

    const bounds = host.getBoundingClientRect();
    const nextWidth = Math.max(Math.floor(bounds.width), 320);
    const nextHeight = Math.max(Math.floor(host.clientHeight || bounds.height), 480);

    if (this.graphView[0] === nextWidth && this.graphView[1] === nextHeight) {
      return false;
    }

    this.graphView = [nextWidth, nextHeight];
    return true;
  }

  private handleWindowResize = (): void => {
    this.scheduleGraphViewportSync();
  };

  private observeGraphViewportResize(): void {
    const host = this.graphViewport?.nativeElement;

    if (!host || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.graphResizeObserver = new ResizeObserver(() => {
      this.scheduleGraphViewportSync();
    });
    this.graphResizeObserver.observe(host);
  }

  private scheduleGraphViewportSync(): void {
    if (this.graphResizeFrameId !== null) {
      return;
    }

    this.graphResizeFrameId = window.requestAnimationFrame(() => {
      this.graphResizeFrameId = null;

      if (!this.syncGraphView() || this.graphNodes.length === 0) {
        return;
      }

      // Recalculate the graph viewport after the layout settles, for example
      // when the sidebar changes width or the browser rotates.
      window.setTimeout(() => {
        if (this.graphNodes.length > 0 && !this.isLoadingChart) {
          this.zoomToFitGraph$.next({ autoCenter: true, force: true });
        }
      }, 0);
    });
  }

  private queueGraphRefresh(zoomToFit = false): void {
    this.pendingZoomToFit = this.pendingZoomToFit || zoomToFit;
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

    return Array.from(valueMap.entries())
      .map(([key, values]) => ({
        key,
        values: Array.from(values).sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' })),
        distinctCount: values.size,
      }))
      .sort((left, right) => left.key.localeCompare(right.key, 'es', { sensitivity: 'base' }));
  }

  private rebuildGraphFromTree(): void {
    if (this.chartRoots.length === 0) {
      this.graphNodes = [];
      this.graphLinks = [];
      this.allGraphNodes = [];
      this.totalFilteredNodeCount = 0;
      this.isGraphLimited = false;
      this.selectedGraphNode = null;
      this.directSubordinateEmployeeIds.clear();
      return;
    }

    const previousSelectedId = this.selectedGraphNode?.id ?? null;
    const allNodes: Node[] = [];
    const allLinks: Edge[] = [];
    const filteredRoots = this.getFilteredChartRoots();
    const pendingNodes = filteredRoots.map((node) => ({ node, parent: null as OrgChartNode | null }));

    while (pendingNodes.length > 0) {
      const entry = pendingNodes.shift();
      if (!entry) {
        break;
      }

      const current = entry.node;
      const parent = entry.parent;
      const data = this.toGraphNodeData(current);
      allNodes.push({
        id: data.id,
        label: data.nombreCompleto,
        data,
      });

      if (parent) {
        allLinks.push({
          id: `${parent.id}-${current.id}`,
          source: parent.id,
          target: current.id,
        });
      }

      current.children.forEach((child) => pendingNodes.push({ node: child, parent: current }));
    }

    this.allGraphNodes = allNodes;
    this.totalFilteredNodeCount = allNodes.length;
    this.nodeHeight = this.calculateNodeHeight(allNodes);

    const renderedNodeIds = this.getRenderedNodeIds(allNodes, allLinks);
    this.graphNodes = allNodes.filter((node) => renderedNodeIds.has(node.id));
    this.graphLinks = allLinks.filter((link) =>
      renderedNodeIds.has(String(link.source)) && renderedNodeIds.has(String(link.target))
    );
    this.isGraphLimited = this.graphNodes.length < allNodes.length;
    this.selectedGraphNode =
      this.graphNodes.find((node) => node.id === previousSelectedId) ??
      this.graphNodes.find((node) => node.id === this.focusedNodeId) ??
      this.graphNodes.find((node) => node.data?.idEmpleado !== null && node.data?.idEmpleado !== undefined) ??
      this.graphNodes[0] ??
      null;
    this.updateDirectSubordinateSelection();
  }

  private calculateNodeHeight(nodes: Node[]): number {
    const lineCount = (value: unknown, charactersPerLine: number): number => {
      const text = String(value ?? '').trim();
      return text.length > 0 ? Math.max(1, Math.ceil(text.length / charactersPerLine)) : 0;
    };

    const heights = nodes.map((node) => {
      const data = node.data as Partial<OrgGraphNodeData> | undefined;
      const pathLines = lineCount(data?.pathLabel, 39);
      const nameLines = lineCount(data?.nombreCompleto, 32);
      const roleLines = lineCount(data?.cargo, 36);

      // Keep enough room for the employee identifier and email even when the
      // demographic path, name, or position requires multiple lines.
      return 30 + (pathLines * 19) + (nameLines * 24) +
        (roleLines > 0 ? (roleLines * 21) + 8 : 0) + 46;
    });

    return Math.min(360, Math.max(220, Math.max(...heights, 220)));
  }

  private getRenderedNodeIds(nodes: Node[], links: Edge[]): Set<string> {
    if (nodes.length <= this.maxRenderedNodes) {
      return new Set(nodes.map((node) => node.id));
    }

    const nodeIds = new Set(nodes.map((node) => node.id));
    const parentByNode = new Map<string, string>();
    const childrenByNode = new Map<string, string[]>();

    links.forEach((link) => {
      const source = String(link.source);
      const target = String(link.target);
      parentByNode.set(target, source);
      const children = childrenByNode.get(source) ?? [];
      children.push(target);
      childrenByNode.set(source, children);
    });

    const included = new Set<string>();
    const queue: string[] = [];

    if (this.focusedNodeId && nodeIds.has(this.focusedNodeId)) {
      const path: string[] = [];
      let currentId: string | undefined = this.focusedNodeId;

      while (currentId && !path.includes(currentId)) {
        path.unshift(currentId);
        currentId = parentByNode.get(currentId);
      }

      path.forEach((id) => included.add(id));
      (childrenByNode.get(this.focusedNodeId) ?? []).forEach((childId) => queue.push(childId));
    } else {
      this.focusedNodeId = null;
      nodes
        .filter((node) => !parentByNode.has(node.id))
        .forEach((node) => queue.push(node.id));
    }

    while (queue.length > 0 && included.size < this.maxRenderedNodes) {
      const currentId = queue.shift();
      if (!currentId || included.has(currentId)) {
        continue;
      }

      included.add(currentId);
      (childrenByNode.get(currentId) ?? []).forEach((childId) => queue.push(childId));
    }

    return included;
  }

  private getFilteredChartRoots(): OrgChartNode[] {
    if (!this.hasActiveDemographicValueFilters) {
      return this.chartRoots;
    }

    const filterNode = (node: OrgChartNode): OrgChartNode | null => {
      const children = node.children
        .map((child) => filterNode(child))
        .filter((child): child is OrgChartNode => child !== null);

      if (node.idEmpleado !== null && !this.matchesDemographicValueFilters(node)) {
        return children.length > 0 ? { ...node, children } : null;
      }

      if (node.idEmpleado === null && children.length === 0) {
        return null;
      }

      return { ...node, children };
    };

    return this.chartRoots
      .map((root) => filterNode(root))
      .filter((root): root is OrgChartNode => root !== null);
  }

  private matchesDemographicValueFilters(node: OrgChartNode): boolean {
    return Object.entries(this.demographicValueFilters).every(([key, selectedValues]) => {
      if (selectedValues.length === 0) {
        return true;
      }

      const value = this.toOptionalText(node.demograficos?.[key]);
      return value !== null && selectedValues.includes(value);
    });
  }

  private selectGraphNode(node: Node, panToNode: boolean): void {
    this.selectedGraphNode = node;
    this.updateDirectSubordinateSelection();

    if (panToNode) {
      window.setTimeout(() => this.panToNode$.next(node.id), 80);
    }
  }

  private updateDirectSubordinateSelection(): void {
    this.directSubordinateEmployeeIds = this.getDirectSubordinateEmployeeIds(
      this.selectedNodeData
    );
  }

  private getDirectSubordinateEmployeeIds(
    selectedNode: OrgGraphNodeData | null
  ): Set<number> {
    const selectedEmployeeId = selectedNode?.idEmpleado;
    if (!selectedEmployeeId) {
      return new Set<number>();
    }

    const nodes = this.getVisibleGraphNodeData();
    const hasManagerData = nodes.some((node) => node.idEmpleadosJefe.length > 0);

    if (hasManagerData) {
      return new Set(
        nodes
          .filter((node) =>
            node.idEmpleado !== null &&
            node.idEmpleado !== selectedEmployeeId &&
            node.idEmpleadoJefe === selectedEmployeeId
          )
          .map((node) => node.idEmpleado as number)
      );
    }

    return new Set(this.collectFirstEmployeeDescendantIds(selectedNode.children));
  }

  private collectFirstEmployeeDescendantIds(nodes: OrgChartNode[]): number[] {
    return nodes.flatMap((node) => {
      if (node.idEmpleado !== null) {
        return [node.idEmpleado];
      }

      return this.collectFirstEmployeeDescendantIds(node.children);
    });
  }

  private getVisibleGraphNodeData(): OrgGraphNodeData[] {
    return this.graphNodes
      .map((node) => node.data)
      .filter((node): node is OrgGraphNodeData => !!node && typeof node === 'object');
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
      levelClass: this.getLevelClass(node.nivel),
      searchText: this.normalizeSearchText(`${node.nombreCompleto} ${node.cargo}`),
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
      node?.idEmpleadoJefe,
      node?.IdEmpleadoJefe,
      node?.idJefe,
      node?.IdJefe,
      node?.idJefeEmpleado,
      node?.IdJefeEmpleado,
      node?.idEmpleadosJefe,
      node?.IdEmpleadosJefe,
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

  private normalizeSearchText(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase('es');
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
