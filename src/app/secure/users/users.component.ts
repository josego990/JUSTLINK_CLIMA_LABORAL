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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-advance-table',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
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
  private readonly profileImageBucketUrl =
    'https://justlink-clima360-objects.s3.us-east-1.amazonaws.com/';
  private readonly fallbackProfileImageUrl = 'assets/images/user/usrbig3.jpg';
  private profileImageCacheVersion = Date.now();
  langStoreValue?: string;
  columnDefinitions = [
  { def: 'imagenUrl',     label: 'Imagen',        type: 'image',       visible: true },
  { def: 'id',            label: 'User ID',       type: 'number',      visible: false },
  { def: 'username',      label: 'Username',      type: 'text',        visible: true },
  { def: 'email',         label: 'Email',         type: 'email',       visible: true },
  { def: 'isActive',      label: 'Active',        type: 'boolean',     visible: false },
  { def: 'createdAt',     label: 'Creado el',     type: 'datetime',    visible: false },
  { def: 'nombres',       label: 'Nombres',       type: 'text',        visible: true },
  { def: 'apellidos',     label: 'Apellidos',     type: 'text',        visible: true },
  { def: 'telefono',      label: 'Teléfono',      type: 'phone',       visible: true },
  { def: 'cargo',         label: 'Cargo',         type: 'text',        visible: true },
  { def: 'organizacion',  label: 'Organización',  type: 'text',        visible: true },
  { def: 'genero',        label: 'Género',        type: 'text',        visible: true },
  { def: 'ciudad',        label: 'Ciudad',        type: 'text',        visible: false },
  //{ def: 'roleId',        label: 'Role ID',       type: 'number',      visible: false },
  { def: 'roleName',      label: 'Rol',           type: 'text',        visible: true },
  { def: 'actions',       label: 'Actions',       type: 'actionBtn',   visible: true },
];

  dataSource = new MatTableDataSource<UserModel>([]);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();
  private usersRequestId = 0;

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
    public dialog: MatDialog,
    public advanceTableService: AdvanceTableService,
    private snackBar: MatSnackBar,
    private router: Router,
    private organizationService: OrganizacionService,
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
    this.languageService.getLanguageChangeSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.translate.use(lang));

    this.organizationService.selectedOrganization$
      .pipe(takeUntil(this.destroy$))
      .subscribe((organization) => {
        const organizationId = Number(organization?.Id);

        if (Number.isInteger(organizationId) && organizationId > 0) {
          this.loadData(organizationId);
          return;
        }

        ++this.usersRequestId;
        this.dataSource.data = [];
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    const organizationId = this.getSelectedOrganizationId();
    if (organizationId > 0) {
      this.loadData(organizationId);
    }
  }

  getProfileImageUrl(fileName: string | null | undefined): string {
    const normalizedFileName = String(fileName ?? '').trim();
    if (!normalizedFileName) {
      return this.fallbackProfileImageUrl;
    }

    const encodedKey = normalizedFileName
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return `${this.profileImageBucketUrl}${encodedKey}?v=${this.profileImageCacheVersion}`;
  }

  onProfileImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith(this.fallbackProfileImageUrl)) {
      image.src = this.fallbackProfileImageUrl;
    }
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
    //console.log('ROW::', row);
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: UserModel) {
    const selectedOrganization = this.organizationService.selectedOrganizationSnapshot;
    const organizationId = this.getSelectedOrganizationId();

    if (organizationId <= 0) {
      void Swal.fire(
        this.translate.instant('MENUITEMS.USERS.ORGANIZATION_REQUIRED_TITLE'),
        this.translate.instant('MENUITEMS.USERS.ORGANIZATION_REQUIRED_TEXT'),
        'warning'
      );
      return;
    }

    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '1040px',
      maxWidth: '96vw',
      maxHeight: '92vh',
      panelClass: 'user-form-dialog-panel',
      data: {
        user: data,
        action,
        idOrganization: organizationId,
        organizationName: selectedOrganization?.Nombre ?? data?.organizacion ?? '',
      },
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
          action === 'add'
            ? 'Usuario creado correctamente.'
            : 'Usuario actualizado correctamente.',
          'bottom',
          'center'
        );
        
        this.loadData(organizationId);
      }
    });
  }

  private getSelectedOrganizationId(): number {
    const organizationId = Number(
      this.organizationService.selectedOrganizationSnapshot?.Id
    );

    return Number.isInteger(organizationId) && organizationId > 0
      ? organizationId
      : 0;
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

  loadData(idOrganization: number) {
    const requestId = ++this.usersRequestId;
    this.dataSource.data = [];
    this.isLoading = true;

    this.advanceTableService.getAllAdvanceTables(idOrganization).subscribe({
      next: (data) => {
        if (requestId !== this.usersRequestId) {
          return;
        }

        this.profileImageCacheVersion = Date.now();
        this.dataSource.data = Array.isArray(data) ? data : [];
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: UserModel,
          filter: string
        ) =>
          Object.values(data).some((value) =>
            String(value ?? '').toLowerCase().includes(filter)
          );
        this.isLoading = false;
      },
      error: (err) => {
        if (requestId !== this.usersRequestId) {
          return;
        }

        console.error(err);
        this.dataSource.data = [];
        this.isLoading = false;
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
