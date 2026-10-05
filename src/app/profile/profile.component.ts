import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { OrganizacionService, SelectedOrganization } from '../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { RouteInfo } from '../layout/sidebar/sidebar.metadata';

interface ProfileModuleAccess {
  title: string;
  path: string;
  category: string;
  icon: string;
}

interface ProfileActionAccess {
  code: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    BreadcrumbComponent,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class ProfileComponent implements OnDestroy, OnInit {
  private readonly profileImageBucketUrl = 'https://justlink-clima360-objects.s3.us-east-1.amazonaws.com/';
  private readonly fallbackProfileImageUrl = 'assets/images/user/usrbig3.jpg';
  private readonly destroy$ = new Subject<void>();

  userDetails: any = {};
  selectedOrganization: SelectedOrganization | null = null;
  moduleAccesses: ProfileModuleAccess[] = [];
  actionAccesses: ProfileActionAccess[] = [];
  accessSearch = '';
  loading = true;
  loadError = false;

  constructor(
    private authService: AuthService,
    private organizationService: OrganizacionService,
  ) {}

  ngOnInit(): void {
    this.organizationService.selectedOrganization$
      .pipe(takeUntil(this.destroy$))
      .subscribe((organization) => {
        this.selectedOrganization = organization;
      });

    void this.loadProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get sessionUser(): any {
    return this.authService.currentUserValue ?? {};
  }

  get displayName(): string {
    const names = this.readValue(this.userDetails, ['nombres', 'Nombres', 'firstName'])
      || this.readValue(this.sessionUser, ['nombres', 'Nombres', 'firstName']);
    const lastNames = this.readValue(this.userDetails, ['apellidos', 'Apellidos', 'lastName'])
      || this.readValue(this.sessionUser, ['apellidos', 'Apellidos', 'lastName']);
    const fullName = `${names} ${lastNames}`.trim();

    return fullName || this.username || 'Usuario';
  }

  get username(): string {
    return this.readValue(this.userDetails, ['username', 'Username', 'usuario'])
      || this.readValue(this.sessionUser, ['username', 'Username', 'usuario'])
      || '-';
  }

  get email(): string {
    return this.readValue(this.userDetails, ['email', 'Email', 'correo', 'correoElectronico'])
      || this.readValue(this.sessionUser, ['email', 'Email', 'correo'])
      || '-';
  }

  get phone(): string {
    return this.readValue(this.userDetails, ['telefono', 'Telefono', 'phone', 'phoneNumber']) || '-';
  }

  get position(): string {
    return this.readValue(this.userDetails, ['cargo', 'Cargo', 'puesto', 'position']) || '-';
  }

  get city(): string {
    return this.readValue(this.userDetails, ['ciudad', 'Ciudad', 'city']) || '-';
  }

  get organizationName(): string {
    return this.readValue(this.userDetails, [
      'organizacion',
      'Organizacion',
      'nombreOrganizacion',
      'NombreOrganizacion',
      'nombre_organizacion',
    ])
      || this.selectedOrganization?.Nombre
      || '-';
  }

  get roleNames(): string[] {
    const detailRole = this.readValue(this.userDetails, ['roleName', 'RoleName', 'rol']);
    const sessionRoles = Array.isArray(this.sessionUser?.roles)
      ? this.sessionUser.roles
        .map((role: any) => this.readValue(role, ['roleName', 'RoleName', 'nombre', 'name']))
        .filter(Boolean)
      : [];

    return [...new Set([detailRole, ...sessionRoles].filter(Boolean))];
  }

  get isActive(): boolean {
    const value = this.userDetails?.isActive
      ?? this.userDetails?.activo
      ?? this.userDetails?.Activo
      ?? this.sessionUser?.isValid;

    return value !== false && value !== 0 && String(value).toLowerCase() !== 'false';
  }

  get isAdministrator(): boolean {
    return this.roleNames.some((role) => {
      const normalized = this.normalizeSearchText(role).replace(/\s+/g, '');
      return normalized === 'admin'
        || normalized === 'superadmin'
        || normalized === 'superadministrador';
    });
  }

  get profileInitials(): string {
    return this.displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U';
  }

  get profileImageUrl(): string {
    const source = this.readValue(this.userDetails, ['imagenUrl', 'ImagenUrl', 'img', 'image'])
      || this.readValue(this.sessionUser, ['imagenUrl', 'ImagenUrl', 'img', 'image']);

    if (!source) {
      return this.fallbackProfileImageUrl;
    }

    if (/^(https?:|data:|blob:)/i.test(source)) {
      return source;
    }

    const encodedKey = source
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return `${this.profileImageBucketUrl}${encodedKey}`;
  }

  get filteredModules(): ProfileModuleAccess[] {
    const search = this.normalizeSearchText(this.accessSearch);
    if (!search) {
      return this.moduleAccesses;
    }

    return this.moduleAccesses.filter((item) =>
      this.normalizeSearchText(`${item.title} ${item.category} ${item.path}`).includes(search)
    );
  }

  get filteredActions(): ProfileActionAccess[] {
    const search = this.normalizeSearchText(this.accessSearch);
    if (!search) {
      return this.actionAccesses;
    }

    return this.actionAccesses.filter((item) =>
      this.normalizeSearchText(`${item.code} ${item.name} ${item.description}`).includes(search)
    );
  }

  async loadProfile(): Promise<void> {
    const userId = Number(this.sessionUser?.userId ?? this.sessionUser?.id);
    const roleId = Number(this.sessionUser?.roles?.[0]?.roleId);

    this.loading = true;
    this.loadError = false;
    this.actionAccesses = this.normalizePermissions(this.sessionUser?.permissions);

    const userRequest = Number.isInteger(userId) && userId > 0
      ? this.organizationService.getUserById(userId)
      : Promise.resolve(null);
    const routeRequest = this.getStoredRoutes() ?? (
      Number.isInteger(roleId) && roleId > 0
        ? this.organizationService.getMenuAccess(roleId).then((response: any) => response?.data ?? [])
        : Promise.resolve([])
    );

    const [userResult, routeResult] = await Promise.allSettled([userRequest, routeRequest]);

    if (userResult.status === 'fulfilled' && userResult.value) {
      this.userDetails = this.extractUserDetails(userResult.value);
    } else {
      this.userDetails = {};
      this.loadError = userResult.status === 'rejected';
    }

    if (routeResult.status === 'fulfilled') {
      const routes = Array.isArray(routeResult.value) ? routeResult.value : [];
      this.moduleAccesses = this.flattenRouteAccesses(routes);
    } else {
      this.moduleAccesses = [];
      this.loadError = true;
    }

    this.loading = false;
  }

  onProfileImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.includes(this.fallbackProfileImageUrl)) {
      image.src = this.fallbackProfileImageUrl;
    }
  }

  trackModule(_index: number, item: ProfileModuleAccess): string {
    return item.path || `${item.category}:${item.title}`;
  }

  trackAction(_index: number, item: ProfileActionAccess): string {
    return item.code;
  }

  private extractUserDetails(response: any): any {
    const data = response?.data?.data ?? response?.data ?? response;
    if (Array.isArray(data)) {
      return data[0] ?? {};
    }

    return data?.user ?? data?.usuario ?? data ?? {};
  }

  private getStoredRoutes(): Promise<RouteInfo[]> | null {
    try {
      const raw = sessionStorage.getItem('routes');
      const routes = raw ? JSON.parse(raw) : null;
      return Array.isArray(routes) ? Promise.resolve(routes) : null;
    } catch {
      return null;
    }
  }

  private flattenRouteAccesses(routes: RouteInfo[], parentTitle = ''): ProfileModuleAccess[] {
    const modules: ProfileModuleAccess[] = [];

    for (const route of routes ?? []) {
      const title = String(route?.title ?? '').trim();
      const category = route.groupTitle ? title : parentTitle;
      const path = this.normalizeRoutePath(route?.path);

      if (!route.groupTitle && path) {
        modules.push({
          title: title || path,
          path,
          category: parentTitle,
          icon: this.getModuleIcon(path),
        });
      }

      modules.push(...this.flattenRouteAccesses(route?.submenu ?? [], category || title || parentTitle));
    }

    const unique = new Map<string, ProfileModuleAccess>();
    for (const module of modules) {
      unique.set(module.path, module);
    }

    return [...unique.values()];
  }

  private normalizePermissions(value: any): ProfileActionAccess[] {
    if (!Array.isArray(value)) {
      return [];
    }

    const permissions = value
      .map((permission: any) => {
        const code = this.readValue(permission, ['ActionCode', 'actionCode', 'Codigo', 'codigo', 'code']);
        const name = this.readValue(permission, [
          'ActionName',
          'actionName',
          'NombreAction',
          'nombreAction',
          'Nombre',
          'nombre',
          'name',
        ]);
        const description = this.readValue(permission, [
          'Description',
          'description',
          'ActionDescription',
          'actionDescription',
          'DescripcionAction',
          'descripcionAction',
          'Descripcion',
          'descripcion',
        ]);
        const displayName = name || description || code;
        const detail = name && description && name !== description ? description : '';

        return code ? { code, name: displayName, description: detail } : null;
      })
      .filter((permission): permission is ProfileActionAccess => !!permission);

    return [...new Map(permissions.map((permission) => [permission.code, permission])).values()];
  }

  private normalizeRoutePath(value: any): string {
    const path = String(value ?? '').trim();
    if (!path || path === '/' || path.toLowerCase().startsWith('javascript:')) {
      return '';
    }

    return path.startsWith('/') ? path : `/${path}`;
  }

  private getModuleIcon(path: string): string {
    const normalized = path.toLowerCase();
    if (normalized.includes('dashboard')) return 'dashboard';
    if (normalized.includes('organization') || normalized.includes('organizacion')) return 'business';
    if (normalized.includes('employee') || normalized.includes('empleado')) return 'badge';
    if (normalized.includes('quiz') || normalized.includes('clima')) return 'groups';
    if (normalized.includes('desempeno')) return 'workspace_premium';
    if (normalized.includes('email')) return 'mail_outline';
    if (normalized.includes('secure')) return 'admin_panel_settings';
    if (normalized.includes('config')) return 'settings';
    return 'apps';
  }

  private readValue(source: any, keys: string[]): string {
    for (const key of keys) {
      const value = source?.[key];
      if (value !== null && value !== undefined && String(value).trim()) {
        return String(value).trim();
      }
    }

    return '';
  }

  private normalizeSearchText(value: string): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }
}
