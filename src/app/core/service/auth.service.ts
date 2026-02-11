import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';  // nuevo modelo

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject inicializado con null o con el valor en localStorage
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  } 

  /**
   * Llama al endpoint de login y actualiza el estado interno.
   * Retorna un Observable<User> con el objeto de sesión.
   */
  public login(user: string, pass: string): Observable<User> {
    //console.log('user enviado:: ', { user, pass });
    return this.http
      .post<{ message: string; data: User }>(
        //'https://api.justlink360.net/logni13',
        //'http://98.88.117.108:3030/logni13',
        'http://localhost:3030/logni13',
        { user, pass }
      )
      .pipe(
        map(response => response.data),
        tap(user => {
          if (user.isValid) {
            // guardar en localStorage y BehaviorSubject
            localStorage.setItem('currentUser', JSON.stringify(user));

           //console.log('user armado:: ',user);

            this.currentUserSubject.next(user);
          } else {
            // usuario inválido: limpiar estado
            this.clearCurrentUser();
          }
        }),

        catchError(err => {
          // en caso de error de red o respuesta 4xx/5xx
          this.clearCurrentUser();
          return throwError(err.error?.message || 'Login failed');
        })

      );
  }

  /**
   * Limpia el estado del usuario en memoria y storage.
   */
  public clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Termina la sesión del usuario.
   */
 public logout(): Observable<{ success: boolean }> {
    this.clearCurrentUser();
    
    return of({ success: true });

  }
}
