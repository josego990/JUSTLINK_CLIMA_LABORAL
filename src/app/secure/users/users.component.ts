import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { rowsAnimation, TableExportUtil } from '@shared';
import { AdvanceTableService } from './users-table.service';
import { UserModel } from './users-table.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { relativeTimeThreshold } from 'moment';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';

@Component({
    selector: 'app-advance-table',
    templateUrl: './users.component.html',
    //styleUrls: ['./users.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
    animations: [rowsAnimation],
    imports: [
        BreadcrumbComponent,
        FeatherIconsComponent,TranslateModule,
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatPaginatorModule,
        DatePipe,
    ]
})
export class UsersComponent implements OnInit, OnDestroy {
  langStoreValue?: string;
  columnDefinitions = [
  { def: 'select',        label: 'Checkbox',     type: 'check',       visible: true },
  { def: 'id',            label: 'User ID',       type: 'number',      visible: false },
  { def: 'username',      label: 'Username',      type: 'text',        visible: true },
  { def: 'email',         label: 'Email',         type: 'email',       visible: true },
  { def: 'isActive',      label: 'Active',        type: 'boolean',     visible: true },
  { def: 'createdAt',     label: 'Created At',    type: 'datetime',    visible: true },
  { def: 'nombres',       label: 'Nombres',       type: 'text',        visible: true },
  { def: 'apellidos',     label: 'Apellidos',     type: 'text',        visible: true },
  { def: 'telefono',      label: 'Teléfono',      type: 'phone',       visible: true },
  { def: 'imagenUrl',     label: 'Imagen',        type: 'image',       visible: true },
  { def: 'cargo',         label: 'Cargo',         type: 'text',        visible: true },
  { def: 'organizacion',  label: 'Organización',  type: 'text',        visible: true },
  { def: 'genero',        label: 'Género',        type: 'text',        visible: true },
  { def: 'ciudad',        label: 'Ciudad',        type: 'text',        visible: true },
  //{ def: 'roleId',        label: 'Role ID',       type: 'number',      visible: false },
  { def: 'roleName',      label: 'Role Name',     type: 'text',        visible: true },
  { def: 'actions',       label: 'Actions',       type: 'actionBtn',   visible: true },
];

  dataSource = new MatTableDataSource<UserModel>([]);
  selection = new SelectionModel<UserModel>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  breadscrums = [
    {
      title: 'Table',
      items: ['Home'],
      active: 'Table',
    },
  ];

  constructor(
    private languageService: LanguageService,private translate: TranslateService,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar, private router: Router
  ) {}
  
  

existsRoute(routes: RouteInfo[], target: string): boolean {
        return routes.some(route =>
          route.path === target ||
          this.existsRoute(route.submenu, target)
        );
  }
      
  ngOnInit() {
    
      const stored = sessionStorage.getItem('routes');
      
      if (stored) {
        const routes: RouteInfo[] = JSON.parse(stored);
        //console.log('RUTAS DESDE sessionStorage:: ', routes);
  
        //buscar path
        const found = this.existsRoute(routes, '/secure/users');
        //console.log(found);
  
        if(!found){
          this.router.navigate(['/authentication/page404']);
        }
  
      }

    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: UserModel) {
    console.log('ROW::', row);
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: UserModel) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '80vw',
      maxWidth: '100vw',
      data: { user: data, action },
      direction: varDirection,
      autoFocus: false,
  });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        //this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Agragar' : 'Editar'} Registro Satisfactorio...!!!`,
          'bottom',
          'center'
        );
        this.loadData();
      }
    });
  }

  private updateRecord(updatedRecord: UserModel) {
    const index = this.dataSource.data.findIndex(
      (record) => record.id === updatedRecord.id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: UserModel) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== row.id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }
  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }

  loadData() {
    this.isLoading = true; // Start loading

    this.advanceTableService.getAllAdvanceTables().subscribe({
      next: (data) => {
        this.dataSource.data = data; // Assign the data to your data source
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: UserModel,
          filter: string
        ) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
          );
        this.isLoading = false; // Stop loading
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }

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

 exportExcel() {
  const exportData = this.dataSource.filteredData.map((x: UserModel) => ({
    'User ID':       x.id,
    Username:        x.username,
    Email:           x.email,
    'Is Active':     x.isActive ? 'Yes' : 'No',
    'Created At':    formatDate(x.createdAt, 'yyyy-MM-dd HH:mm:ss', 'en'),
    Nombres:         x.nombres,
    Apellidos:       x.apellidos,
    Telefono:        x.telefono,
    'Imagen URL':    x.imagenUrl,
    Cargo:           x.cargo,
    Organizacion:    x.organizacion,
    Genero:          x.genero,
    Ciudad:          x.ciudad,
    'Role ID':       x.roleId,
    'Role Name':     x.roleName
  }));
  TableExportUtil.exportToExcel(exportData, 'Users');
 }

  onContextMenu(event: MouseEvent, item: UserModel) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
