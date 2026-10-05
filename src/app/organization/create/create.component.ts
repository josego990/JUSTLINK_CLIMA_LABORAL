import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import Swal from 'sweetalert2';

import { LanguageService } from '../../core/service/language.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { OrganizacionService } from '../services/organizacion.service';
import {
  OrganizationFormDialogComponent,
  OrganizationFormDialogData,
  OrganizationFormDialogResult,
} from './organization-form-dialog.component';

@Component({
  selector: 'app-crear-organizacion',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class CrearOrganizacionComponent implements OnInit {
  public dataSourceOrganizations: any[] = [];
  public isLoading = false;
  public organizationSearchTerm = '';

  public readonly displayedColumns: string[] = [
    'Id',
    'Nombre',
    'IdPais',
    'NIT',
    'Telefono',
    'CorreoContacto',
    'RepresentanteLegal',
    'SectorIndustria',
    'NumeroEmpleados',
    'Acciones',
  ];

  private allOrganizations: any[] = [];
  private langStoreValue?: string;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private router: Router,
    private organizacionService: OrganizacionService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const storedRoutes = sessionStorage.getItem('routes');
    if (storedRoutes) {
      const routes: RouteInfo[] = JSON.parse(storedRoutes);
      if (!this.existsRoute(routes, '/organization/create')) {
        this.router.navigate(['/authentication/page404']);
        return;
      }
    }

    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((lang) => this.translate.use(lang));

    this.getOrganizations();
  }

  public get totalOrganizations(): number {
    return this.allOrganizations.length;
  }

  public get visibleOrganizations(): number {
    return this.dataSourceOrganizations.length;
  }

  public getOrganizations(): void {
    this.isLoading = true;
    this.organizacionService.getOrganizations()
      .then((response: any) => {
        this.allOrganizations = Array.isArray(response?.data) ? response.data : [];
        this.applyOrganizationFilter();
      })
      .catch((error: any) => {
        console.error('Error al obtener organizaciones:', error);
        this.allOrganizations = [];
        this.dataSourceOrganizations = [];
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  public onOrganizationSearchChange(value: string): void {
    this.organizationSearchTerm = value ?? '';
    this.applyOrganizationFilter();
  }

  public clearOrganizationSearch(): void {
    this.organizationSearchTerm = '';
    this.applyOrganizationFilter();
  }

  public openCreateOrganizationDialog(): void {
    this.openOrganizationDialog({ mode: 'create' });
  }

  public editItem(organization: any): void {
    this.openOrganizationDialog({ mode: 'edit', organization });
  }

  public async deleteItem(organization: any): Promise<void> {
    const organizationName = String(organization?.Nombre ?? '').trim();
    const confirmation = await Swal.fire({
      title: this.translate.instant('MENUITEMS.ORGANIZATION.DELETECONFIRMTITLE'),
      text: this.translate.instant('MENUITEMS.ORGANIZATION.DELETECONFIRMTEXT', {
        name: organizationName,
      }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('MENUITEMS.ORGANIZATION.DELETECONFIRM'),
      cancelButtonText: this.translate.instant('MENUITEMS.ORGANIZATION.CANCEL'),
      confirmButtonColor: '#c53d4a',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    this.organizacionService.deleteOrganization(Number(organization?.Id))
      .then(() => {
        this.getOrganizations();
        Swal.fire({
          title: this.translate.instant('MENUITEMS.ORGANIZATION.SUCCESS'),
          text: this.translate.instant('MENUITEMS.ORGANIZATION.ORGDELETED'),
          icon: 'success',
        });
      })
      .catch((error: any) => {
        console.error('Error al eliminar la organización:', error);
        Swal.fire({
          title: this.translate.instant('MENUITEMS.ORGANIZATION.SOMEWRONG'),
          text: this.translate.instant('MENUITEMS.ORGANIZATION.ERRDELETEORG'),
          icon: 'error',
        });
      });
  }

  public trackOrganization(_: number, organization: any): number | string {
    return organization?.Id ?? organization?.Nombre;
  }

  private openOrganizationDialog(data: OrganizationFormDialogData): void {
    const dialogRef = this.dialog.open<
      OrganizationFormDialogComponent,
      OrganizationFormDialogData,
      OrganizationFormDialogResult
    >(OrganizationFormDialogComponent, {
      width: '880px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '92dvh',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      disableClose: true,
      panelClass: 'organization-form-dialog',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.saved) {
        return;
      }

      this.getOrganizations();
      Swal.fire({
        title: this.translate.instant('MENUITEMS.ORGANIZATION.SUCCESS'),
        text: this.translate.instant(
          result.mode === 'create'
            ? 'MENUITEMS.ORGANIZATION.ORGADDSUCCESS'
            : 'MENUITEMS.ORGANIZATION.ORGUPDATEDSUCCESS'
        ),
        icon: 'success',
      });
    });
  }

  private applyOrganizationFilter(): void {
    const search = this.normalizeSearchText(this.organizationSearchTerm);
    if (!search) {
      this.dataSourceOrganizations = [...this.allOrganizations];
      return;
    }

    const searchableFields = [
      'Id',
      'Nombre',
      'nombre_pais',
      'NIT',
      'Telefono',
      'CorreoContacto',
      'RepresentanteLegal',
      'SectorIndustria',
    ];

    this.dataSourceOrganizations = this.allOrganizations.filter((organization) =>
      searchableFields.some((field) =>
        this.normalizeSearchText(organization?.[field]).includes(search)
      )
    );
  }

  private normalizeSearchText(value: unknown): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private existsRoute(routes: RouteInfo[], target: string): boolean {
    return routes.some((route) =>
      route.path === target || this.existsRoute(route.submenu ?? [], target)
    );
  }
}
