import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@core/service/language.service';
import { rowsAnimation, TableExportUtil } from '@shared';
import { HttpClient } from '@angular/common/http';

// Dialogs (crea estos dos dentro de ./dialogs/)
import { FormDialogComponent as ConfigFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { OrganizacionService } from 'app/organization/services/organizacion.service';

// Modelo simple de Config
export interface ConfigModel {
  IdConfig: number;
  Nombre: string;
  Valor: string;
  Descripcion: string;
  Estado: boolean;
}


@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrl:'./config.component.scss',
  providers: [DatePipe],
  animations: [rowsAnimation],
  standalone: true,
  imports: [
    // shared
    BreadcrumbComponent,
    FeatherIconsComponent,
    TranslateModule,
    // angular/material
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,

    MatOptionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class ConfigsComponent implements OnInit, OnDestroy {
  langStoreValue?: string;
  readonly configDisclaimer = 'Advertencia: cambiar estas variables o valores puede hacer que el sistema falle o deje de funcionar correctamente.';

  // Definición de columnas (show/hide + tipos)
  columnDefinitions = [
  { def: 'select',        label: 'Checkbox',   type: 'check',     visible: true,  width: '48px' },
  { def: 'IdConfig',      label: 'ID',         type: 'number',    visible: true,  width: '90px' },
  { def: 'Nombre',        label: 'Nombre',     type: 'text',      visible: true,  width: '18%' },
  { def: 'Valor',         label: 'Valor',      type: 'text',      visible: true,  width: '36%' },
  { def: 'Descripcion',   label: 'Descripción',type: 'text',      visible: true,  width: '26%' },
  { def: 'Estado',        label: 'Activo',     type: 'boolean',   visible: true,  width: '90px' },
  { def: 'actions',       label: 'Acciones',   type: 'actionBtn', visible: true,  width: '110px' },
];
  dataSource:any = new MatTableDataSource<ConfigModel>([]);
  selection = new SelectionModel<ConfigModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    { title: 'Table', items: ['Home', 'ORGANIZACION'], active: 'Configs' },
  ];

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private organizationService: OrganizacionService,
  ) {}

  ngOnInit(): void {
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((lang) => this.translate.use(lang));

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data
  loadData(): void {
  this.isLoading = true;

  this.organizationService.getConfigs()
    .then((resp) => {
      const rows = resp?.data ?? [];
      // Normaliza keys y fuerza boolean en Estado
      const normalized = rows.map((x: any) => ({
        IdConfig:      x.IdConfig ?? x.idConfig ?? x.id ?? 0,
        Nombre:        x.Nombre   ?? x.nombre,
        Valor:         x.Valor    ?? x.valor,
        Descripcion:   x.Descripcion ?? x.descripcion ?? '',
        Estado:        this.isTrue(x.Estado ?? x.estado), // <-- clave
        FechaCreacion: x.FechaCreacion ?? x.fechaCreacion ?? x.createdAt ?? null,
      }));

      // DEBUG opcional: ver qué llega
      console.table(normalized.map((r:any) => ({ Id: r.IdConfig, Estado: r.Estado, tipo: typeof r.Estado })));

      this.dataSource.data = normalized;
      this.refreshTable();

      this.dataSource.filterPredicate = (row:any, filter:any) => {
        const acc = `${row.IdConfig}|${row.Nombre}|${row.Valor}|${row.Descripcion}|${row.Estado ? 'true' : 'false'}`;
        return acc.toLowerCase().includes(filter);
      };

      this.isLoading = false;
    })
    .catch((err) => {
      console.error(err);
      this.isLoading = false;
    });
}

  private isTrue(val: any): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'si' || v === 'sí';
  }
  return !!val;
}

  refresh(): void {
    this.loadData();
  }

  // Tabla
  refreshTable(): void {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter((c) => c.visible).map((c) => c.def);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Selección
  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row:any) => this.selection.select(row));
  }

  removeSelectedRows(): void {
    const total = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter((x:any) => !this.selection.selected.includes(x));
    this.selection.clear();
    this.showNotification('snackbar-danger', `${total} configuración(es) eliminada(s)`, 'bottom', 'center');
  }

  // CRUD
  addNew(): void {
    this.openDialog('add');
  }

  editCall(row: ConfigModel): void {
    this.openDialog('edit', row);
  }



  openDialog(action: 'add' | 'edit', data?: ConfigModel): void {
    const varDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    const dialogRef = this.dialog.open(ConfigFormDialogComponent, {
      width: '70vw',
      maxWidth: '100vw',
      data: { config: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: ConfigModel | null) => {
      if (!result) return;

      if (action === 'add') {
        this.dataSource.data = [result, ...this.dataSource.data];
      } else {
        const idx = this.dataSource.data.findIndex((r:any) => r.IdConfig === result.IdConfig);
        if (idx !== -1) this.dataSource.data[idx] = result;
      }

      this.dataSource._updateChangeSubscription();

      this.showNotification(
        action === 'add' ? 'snackbar-success' : 'black',
        action === 'add' ? 'Configuración creada' : 'Configuración actualizada',
        'bottom',
        'center'
      );

      this.refresh();

    });
    
  }

  // Export
  exportExcel(): void {
    const exportData = this.dataSource.filteredData.map((x:any) => ({
      ID: x.IdConfig,
      Nombre: x.Nombre,
      Valor: x.Valor,
      Descripción: x.Descripcion,
      Activo: x.Estado ? 'Sí' : 'No'
     
    }));
    TableExportUtil.exportToExcel(exportData, 'Configs');
  }

  // Context menu
  onContextMenu(event: MouseEvent, item: ConfigModel): void {
    event.preventDefault();
    this.contextMenuPosition = { x: `${event.clientX}px`, y: `${event.clientY}px` };
    if (this.contextMenu) {
      (this.contextMenu as any).menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  // Snackbar
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
