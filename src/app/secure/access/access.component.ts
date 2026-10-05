import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '@core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { RouteInfo } from '../../layout/sidebar/sidebar.metadata';
import {
  OrganizacionService,
  SelectedOrganization,
} from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from '../../core/service/language.service';
import { DialogformComponent } from './dialogform/dialogform.component';

interface PermissionAccessView {
  menuId: number;
  menuName: string;
  actionId: number;
  actionCode: string;
  actionName: string;
  actionDescription: string;
  hasAccess: 0 | 1;
  saving: boolean;
}

interface MenuAccessGroupView {
  menuId: number;
  menuName: string;
  accesses: PermissionAccessView[];
}

interface RoleAccessView {
  roleId: number;
  roleName: string;
  description: string;
  accesses: PermissionAccessView[];
  menuGroups: MenuAccessGroupView[];
  readOnly: boolean;
}

@Component({
  selector: 'app-crear-organizacion',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    BreadcrumbComponent,
    JoyrideModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
})
export class AccessComponent implements OnDestroy, OnInit {
  rolesAccess: RoleAccessView[] = [];
  isLoadingRoles = false;
  accessSearch = '';
  organizationName = '';

  private readonly subscriptions = new Subscription();
  private rolesAccessRequestId = 0;
  private activeOrganizationId = 0;
  private isSystemAdministrator = false;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private organizationService: OrganizacionService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private joyrideService: JoyrideService,
  ) {}

  ngOnInit(): void {
    if (!this.userCanOpenPage()) {
      void this.router.navigate(['/authentication/page404']);
      return;
    }

    const language = localStorage.getItem('lang') || 'es';
    this.languageService.setLanguage(language);
    this.translate.use(language);

    this.subscriptions.add(
      this.languageService.getLanguageChangeSubject().subscribe((lang) => {
        this.translate.use(lang);
      })
    );

    const roleName = String(this.authService.currentUserValue?.roles?.[0]?.roleName ?? '');
    this.isSystemAdministrator = roleName.toLocaleLowerCase() === 'admin';

    this.subscriptions.add(
      this.organizationService.selectedOrganization$.subscribe((organization) => {
        this.handleOrganizationChange(organization);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get totalRoles(): number {
    return this.rolesAccess.length;
  }

  get totalPermissions(): number {
    return this.rolesAccess.reduce((total, role) => total + role.accesses.length, 0);
  }

  get enabledPermissions(): number {
    return this.rolesAccess.reduce(
      (total, role) => total + role.accesses.filter((access) => access.hasAccess === 1).length,
      0
    );
  }

  get filteredRoles(): RoleAccessView[] {
    const search = this.normalizeSearchText(this.accessSearch);
    if (!search) {
      return this.rolesAccess;
    }

    return this.rolesAccess
      .map((role) => {
        const roleMatches = this.matchesSearch(`${role.roleName} ${role.description}`, search);
        const menuGroups = roleMatches
          ? role.menuGroups
          : role.menuGroups
            .map((group) => {
              const menuMatches = this.matchesSearch(group.menuName, search);
              const accesses = menuMatches
                ? group.accesses
                : group.accesses.filter((access) => this.matchesSearch(
                  `${access.actionName} ${access.actionDescription} ${access.actionCode}`,
                  search
                ));

              return { ...group, accesses };
            })
            .filter((group) => group.accesses.length > 0);

        return { ...role, menuGroups };
      })
      .filter((role) => role.menuGroups.length > 0);
  }

  startAccessTour(): void {
    setTimeout(() => {
      const candidates = [
        'roleAccessOverview',
        'roleAccessSummary',
        'roleAccessStatuses',
        'roleAccessRoles',
      ];
      const steps = candidates.filter((step) =>
        document.querySelector(`[joyrideStep="${step}"]`)
      );

      this.joyrideService.startTour({
        steps,
        showPrevButton: true,
        customTexts: {
          prev: this.translate.instant('MENUITEMS.TOUR.NAV.PREV'),
          next: this.translate.instant('MENUITEMS.TOUR.NAV.NEXT'),
          done: this.translate.instant('MENUITEMS.TOUR.NAV.DONE'),
          close: this.translate.instant('MENUITEMS.TOUR.NAV.CLOSE'),
        },
      }).subscribe();
    }, 100);
  }

  refreshRoles(): void {
    if (this.activeOrganizationId > 0) {
      this.loadRoles(this.activeOrganizationId, true);
    }
  }

  openDialogNewRol(): void {
    const selectedOrganization = this.getSelectedOrganization();
    if (!selectedOrganization?.Id) {
      void Swal.fire(
        this.translate.instant('MENUITEMS.SECURE.ROLE_ORGANIZATION_REQUIRED_TITLE'),
        this.translate.instant('MENUITEMS.SECURE.ROLE_ORGANIZATION_REQUIRED_TEXT'),
        'warning'
      );
      return;
    }

    const dialogRef = this.dialog.open(DialogformComponent, {
      width: '720px',
      maxWidth: '95vw',
      height: 'auto',
      disableClose: false,
      autoFocus: false,
      data: {
        idOrganization: selectedOrganization.Id,
        organizationName: selectedOrganization.Nombre,
      },
    });

    this.subscriptions.add(
      dialogRef.afterClosed().subscribe((created) => {
        if (created === true) {
          this.loadRoles(selectedOrganization.Id, true);
        }
      })
    );
  }

  async onToggleAccess(
    role: RoleAccessView,
    access: PermissionAccessView,
    granted: boolean,
  ): Promise<void> {
    if (role.readOnly || access.saving) {
      return;
    }

    const previousValue = access.hasAccess;
    access.hasAccess = granted ? 1 : 0;
    access.saving = true;

    try {
      await this.organizationService.updateRoleAccess({
        roleId: role.roleId,
        actionId: access.actionId,
        granted,
      });
      this.showNotification(
        'snackbar-success',
        this.translate.instant('MENUITEMS.SECURE.ROLE_ACCESS_PAGE.UPDATE_SUCCESS'),
        'bottom',
        'center'
      );
    } catch (error) {
      access.hasAccess = previousValue;
      console.error('Error al actualizar el acceso del rol:', error);
      this.showNotification(
        'snackbar-danger',
        this.translate.instant('MENUITEMS.SECURE.ROLE_ACCESS_PAGE.UPDATE_ERROR'),
        'bottom',
        'center'
      );
    } finally {
      access.saving = false;
    }
  }

  getRoleEnabledCount(role: RoleAccessView): number {
    return role.accesses.filter((access) => access.hasAccess === 1).length;
  }

  getGroupEnabledCount(group: MenuAccessGroupView): number {
    return group.accesses.filter((access) => access.hasAccess === 1).length;
  }

  getDisplayText(value: string): string {
    return this.translateValue(value);
  }

  trackRole(_index: number, role: RoleAccessView): number {
    return role.roleId;
  }

  trackMenu(_index: number, group: MenuAccessGroupView): string {
    return `${group.menuId}:${group.menuName}`;
  }

  trackAccess(_index: number, access: PermissionAccessView): number {
    return access.actionId;
  }

  private handleOrganizationChange(organization: SelectedOrganization | null): void {
    const fallbackOrganizationId = Number(this.authService.currentUserValue?.idOrganization);
    const organizationId = Number(organization?.Id ?? fallbackOrganizationId);

    this.organizationName = String(
      organization?.Nombre
      ?? this.organizationService.selectedOrganizationSnapshot?.Nombre
      ?? ''
    ).trim();

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      ++this.rolesAccessRequestId;
      this.activeOrganizationId = 0;
      this.rolesAccess = [];
      this.isLoadingRoles = false;
      return;
    }

    if (organizationId === this.activeOrganizationId && this.rolesAccess.length > 0) {
      return;
    }

    this.loadRoles(organizationId);
  }

  private loadRoles(organizationId: number, force = false): void {
    if (!force && organizationId === this.activeOrganizationId && this.isLoadingRoles) {
      return;
    }

    const requestId = ++this.rolesAccessRequestId;
    this.activeOrganizationId = organizationId;
    this.rolesAccess = [];
    this.isLoadingRoles = true;

    const request = this.isSystemAdministrator
      ? this.organizationService.getRolesAccess(organizationId)
      : this.organizationService.getRolesAccessByIdOrg(organizationId);

    request
      .then((response: any) => {
        if (requestId !== this.rolesAccessRequestId) {
          return;
        }

        const responseData = response?.data?.data ?? response?.data ?? [];
        this.rolesAccess = this.normalizeRoles(responseData);
      })
      .catch((error: any) => {
        if (requestId !== this.rolesAccessRequestId) {
          return;
        }

        this.rolesAccess = [];
        console.error('Error al obtener roles y accesos:', error);
        this.showNotification(
          'snackbar-danger',
          this.translate.instant('MENUITEMS.SECURE.ROLE_ACCESS_PAGE.LOAD_ERROR'),
          'bottom',
          'center'
        );
      })
      .finally(() => {
        if (requestId === this.rolesAccessRequestId) {
          this.isLoadingRoles = false;
        }
      });
  }

  private normalizeRoles(value: any): RoleAccessView[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((role: any) => {
      const accesses = this.normalizeAccesses(role?.accesses ?? role?.Accesses ?? []);
      const roleName = String(role?.roleName ?? role?.RoleName ?? role?.Nombre ?? '').trim();

      return {
        roleId: Number(role?.RoleId ?? role?.roleId ?? role?.Id ?? role?.id ?? 0),
        roleName,
        description: String(role?.Description ?? role?.description ?? role?.Descripcion ?? '').trim(),
        accesses,
        menuGroups: this.groupAccessesByMenu(accesses),
        readOnly: roleName.toLocaleLowerCase() === 'admin',
      };
    });
  }

  private normalizeAccesses(value: any): PermissionAccessView[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((access: any) => ({
      menuId: Number(access?.MenuId ?? access?.menuId ?? 0),
      menuName: String(
        access?.menuName
        ?? access?.MenuName
        ?? 'MENUITEMS.SECURE.ROLE_ACCESS_PAGE.UNASSIGNED_MENU'
      ).trim(),
      actionId: Number(access?.ActionId ?? access?.actionId ?? 0),
      actionCode: String(access?.actionCode ?? access?.ActionCode ?? '').trim(),
      actionName: String(access?.actionName ?? access?.ActionName ?? '').trim(),
      actionDescription: String(
        access?.actionDescription
        ?? access?.ActionDescription
        ?? access?.Description
        ?? ''
      ).trim(),
      hasAccess: Number(access?.hasAccess ?? access?.HasAccess ?? 0) === 1 ? 1 : 0,
      saving: false,
    }));
  }

  private groupAccessesByMenu(accesses: PermissionAccessView[]): MenuAccessGroupView[] {
    const groups = new Map<string, MenuAccessGroupView>();

    for (const access of accesses) {
      const key = access.menuId > 0
        ? `id:${access.menuId}`
        : `name:${access.menuName.toLocaleLowerCase()}`;
      const group = groups.get(key) ?? {
        menuId: access.menuId,
        menuName: access.menuName,
        accesses: [],
      };

      group.accesses.push(access);
      groups.set(key, group);
    }

    return [...groups.values()].sort((left, right) => {
      if (left.menuId > 0 && right.menuId > 0) {
        return left.menuId - right.menuId;
      }
      return this.translateValue(left.menuName).localeCompare(this.translateValue(right.menuName));
    });
  }

  private matchesSearch(value: string, search: string): boolean {
    const translatedParts = value
      .split(/\s+/)
      .map((part) => this.translateValue(part))
      .join(' ');

    return this.normalizeSearchText(`${value} ${translatedParts}`).includes(search);
  }

  private translateValue(value: string): string {
    const source = String(value ?? '').trim();
    if (!source) {
      return '';
    }

    const translated = String(this.translate.instant(source) ?? source).trim();
    if (translated && translated !== source) {
      return translated;
    }

    if (!source.includes('.')) {
      return source;
    }

    const lastSegment = source.split('.').pop() ?? source;
    const readable = lastSegment
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLocaleLowerCase();

    return readable.charAt(0).toLocaleUpperCase() + readable.slice(1);
  }

  private normalizeSearchText(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private getSelectedOrganization(): SelectedOrganization | null {
    const selected = this.organizationService.selectedOrganizationSnapshot;
    if (selected?.Id) {
      return selected;
    }

    const organizationId = Number(this.authService.currentUserValue?.idOrganization);
    return organizationId > 0
      ? { Id: organizationId, Nombre: this.organizationName }
      : null;
  }

  private userCanOpenPage(): boolean {
    const stored = sessionStorage.getItem('routes');
    if (!stored) {
      return true;
    }

    try {
      const routes = JSON.parse(stored) as RouteInfo[];
      return this.existsRoute(routes, '/secure/access');
    } catch {
      return false;
    }
  }

  private existsRoute(routes: RouteInfo[] = [], target: string): boolean {
    return routes.some((route) =>
      route.path === target || this.existsRoute(route.submenu ?? [], target)
    );
  }

  private showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition,
  ): void {
    this.snackBar.open(text, '', {
      duration: 2200,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
