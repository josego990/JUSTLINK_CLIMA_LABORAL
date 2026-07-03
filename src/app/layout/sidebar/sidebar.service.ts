import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ConfigInfo, RouteInfo } from './sidebar.metadata';
import { AuthService } from '@core';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor(private http: HttpClient, 
    private authService: AuthService,
    private organizationService: OrganizacionService
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
        return res.data || [];
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
