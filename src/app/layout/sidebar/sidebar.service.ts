import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ConfigInfo, RouteInfo } from './sidebar.metadata';
import { AuthService } from '@core';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { DemoLimitsService } from 'app/config/demo-limits.service';
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor(private http: HttpClient,
    private authService: AuthService,
    private organizationService: OrganizacionService,
    private demoLimitsService: DemoLimitsService,
  ) {}

  /**
   * Get sidebar menu items from JSON file
   * @returns Observable<RouteInfo[]>
   */
 getRouteInfo(): Observable<RouteInfo[]> {
    /**/
    const roleId = this.authService.currentUserValue?.roles[0]?.roleId;
    if (!roleId) {
      // si no hay rol, devolvemos array vacío
      return of([]);
    }

    // Convertimos el Promise en Observable
    return from(this.organizationService.getMenuAccess(roleId)).pipe(
      map(res => {
       //console.log('resulen:: ', res);
        // asumimos que la respuesta tiene shape { message, data: RouteInfo[] }
        const routes = res.data || [];
        return this.filterDemoAdminRoutes(routes);
      }),
      catchError(err => {
        console.error('Error al cargar rutas:', err);
        // en caso de fallo devolvemos un array vacío
        return of([]);
      })
    );
  /*

     
    return this.http
      .get<{ routes: RouteInfo[] }>('assets/data/routes.json')
      .pipe(map((response) => response.routes));
*/

  }

  private filterDemoAdminRoutes(routes: RouteInfo[]): RouteInfo[] {
    if (
      !this.demoLimitsService.isDemoModeActive() ||
      this.demoLimitsService.isSuperAdminRole(this.authService.currentUserValue?.roles)
    ) {
      return routes;
    }

    return routes
      .filter((route) => !this.isDemoAdminOnlyRoute(route))
      .map((route) => ({
        ...route,
        submenu: this.filterDemoAdminRoutes(route.submenu ?? []),
      }))
      .filter((route) => route.groupTitle || route.path || route.submenu.length > 0);
  }

  private isDemoAdminOnlyRoute(route: RouteInfo): boolean {
    const path = String(route.path ?? '').trim().toLowerCase();
    const title = String(route.title ?? '').trim().toUpperCase();

    return (
      path === '/organization/create' ||
      path === '/desempeno/organizaciones' ||
      path.startsWith('/secure/') ||
      title === 'MENUITEMS.SECURE.TEXT'
    );
  }

  getConfigsInfo(): Observable<ConfigInfo[]> {
    return from(this.organizationService.getConfigs()).pipe(
      map(res => {
        return res.data || [];
      }),
      catchError(err => {
        console.error('Error al cargar configs:', err);
        return of([]);
      })
    );
  }

}
