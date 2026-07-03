import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { SKIP_SESSION_VALIDATION } from "./session-validation.context";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const skipSessionValidation = request.context.get(SKIP_SESSION_VALIDATION);

    return next.handle(request).pipe(
      catchError((err) => {
        if (skipSessionValidation) {
          return throwError(() => err);
        }

        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logoutAndRedirect();
        }

        const error = err.error?.message || err.statusText;
        return throwError(() => error);
      })
    );
  }
}
