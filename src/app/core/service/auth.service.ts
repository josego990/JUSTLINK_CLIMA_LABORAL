import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from './models/user.model';  // nuevo modelo
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static axiosInterceptorsConfigured = false;
  private tokenExpirationTimerId: ReturnType<typeof setTimeout> | null = null;

  // BehaviorSubject inicializado con null o con el valor en localStorage
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private organizationService: OrganizacionService,
    private router: Router
  ) {
    this.syncAxiosAuthorizationHeader();
    this.configureAxiosInterceptors();
    this.scheduleTokenExpirationRedirect();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  } 

  /**
   * Llama al endpoint de login y actualiza el estado interno.
   * Retorna un Observable<User> con el objeto de sesión.
   */
  public login(user: string, pass: string): Observable<User> {
    //console.log('user enviado:: ', { user, pass });
    return from(this.organizationService.login({ user, pass }))
      .pipe(
        map((response: any) => this.normalizeLoginUser(response)),
        tap((userData) => {
          if (userData.isValid && userData.token && !this.isTokenExpired(userData.token)) {
            // guardar en localStorage y BehaviorSubject
            localStorage.setItem('currentUser', JSON.stringify(userData));

           //console.log('user armado:: ',userData);

            this.currentUserSubject.next(userData);
            this.syncAxiosAuthorizationHeader();
            this.scheduleTokenExpirationRedirect();
          } else {
            // usuario inválido: limpiar estado
            this.clearCurrentUser();
          }
        }),

        catchError(err => {
          // en caso de error de red o respuesta 4xx/5xx
          this.clearCurrentUser();
          return throwError(() => err?.response?.data?.message || err?.message || 'Login failed');
        })

      );
  }

  /**
   * Limpia el estado del usuario en memoria y storage.
   */
  public clearCurrentUser(): void {
    this.clearTokenExpirationTimer();
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('routes');
    delete axios.defaults.headers.common['Authorization'];
    this.currentUserSubject.next(null);
  }

  /**
   * Termina la sesión del usuario.
   */
 public logout(): Observable<{ success: boolean }> {
    this.clearCurrentUser();
    
    return of({ success: true });

  }

  public logoutAndRedirect(): void {
    this.clearCurrentUser();
    this.router.navigate(['/authentication/signin']);
  }

  public isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;

    return !!currentUser?.token && !this.isTokenExpired(currentUser.token);
  }

  public isTokenExpired(token?: string | null): boolean {
    if (!token) {
      return true;
    }

    const payload = this.decodeJwtPayload(token);

    if (!payload) {
      return true;
    }

    if (!payload.exp) {
      return false;
    }

    return Date.now() >= payload.exp * 1000;
  }

  private configureAxiosInterceptors(): void {
    if (AuthService.axiosInterceptorsConfigured) {
      return;
    }

    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.currentUserValue?.token;

      if (!token) {
        return config;
      }

      if (this.isTokenExpired(token)) {
        this.logoutAndRedirect();
        return Promise.reject(new Error('SESSION_EXPIRED'));
      }

      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;

      return config;
    });

    axios.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logoutAndRedirect();
        }

        return Promise.reject(error);
      }
    );

    AuthService.axiosInterceptorsConfigured = true;
  }

  private syncAxiosAuthorizationHeader(): void {
    const token = this.currentUserValue?.token;

    if (token && !this.isTokenExpired(token)) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return;
    }

    delete axios.defaults.headers.common['Authorization'];
  }

  private scheduleTokenExpirationRedirect(): void {
    this.clearTokenExpirationTimer();

    const token = this.currentUserValue?.token;
    const payload = token ? this.decodeJwtPayload(token) : null;

    if (!payload?.exp) {
      return;
    }

    const millisecondsUntilExpiration = (payload.exp * 1000) - Date.now();

    if (millisecondsUntilExpiration <= 0) {
      this.logoutAndRedirect();
      return;
    }

    const maxTimeout = 2147483647;

    this.tokenExpirationTimerId = setTimeout(
      () => {
        if (millisecondsUntilExpiration > maxTimeout) {
          this.scheduleTokenExpirationRedirect();
          return;
        }

        this.logoutAndRedirect();
      },
      Math.min(millisecondsUntilExpiration, maxTimeout)
    );
  }

  private clearTokenExpirationTimer(): void {
    if (!this.tokenExpirationTimerId) {
      return;
    }

    clearTimeout(this.tokenExpirationTimerId);
    this.tokenExpirationTimerId = null;
  }

  private normalizeLoginUser(response: any): User {
    const responseBody = response?.data ?? response;
    const data = responseBody?.data ?? responseBody;
    const userData = data?.user ?? data?.usuario ?? data;
    const token = this.extractToken(responseBody, data, userData);
    const normalizedUser = {
      ...userData,
      token,
    } as User;

    if (normalizedUser.isValid && (!normalizedUser.token || this.isTokenExpired(normalizedUser.token))) {
      normalizedUser.isValid = false;
    }

    return normalizedUser;
  }

  private extractToken(...sources: any[]): string {
    for (const source of sources) {
      const token = source?.token
        ?? source?.jwt
        ?? source?.jwtToken
        ?? source?.accessToken
        ?? source?.access_token
        ?? source?.idToken
        ?? source?.Token
        ?? source?.JWT;

      if (typeof token === 'string' && token.trim()) {
        return token.trim();
      }
    }

    return '';
  }

  private decodeJwtPayload(token: string): JwtPayload | null {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    try {
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        '='
      );
      const decodedPayload = atob(paddedPayload);
      const jsonPayload = decodeURIComponent(
        decodedPayload
          .split('')
          .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );

      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }
}
