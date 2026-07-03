import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { AuthService } from "../service/auth.service";
import { SKIP_SESSION_VALIDATION } from "./session-validation.context";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.context.get(SKIP_SESSION_VALIDATION)) {
      return next.handle(request);
    }

    // add authorization header with jwt token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
      if (this.authenticationService.isTokenExpired(currentUser.token)) {
        this.authenticationService.logoutAndRedirect();
        return throwError(() => new Error('SESSION_EXPIRED'));
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request);
  }
}
