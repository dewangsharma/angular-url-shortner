import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { ApiUsers } from '../services/api.users';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(private authService: AuthService, private apiUser: ApiUsers) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (this.authService.userValue && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.userValue.token}`,
        },
      });
    }
    request.headers.append('Content-Type', 'application/json');

    // return next.handle(request);

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          // !req.url.includes('auth/signin') &&
          error.status === 401
        ) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.userValue) {
        return this.apiUser
          .refreshToken(
            this.authService.userValue.token,
            this.authService.userValue.refreshToken
          )
          .pipe(
            switchMap((res) => {
              this.isRefreshing = false;
              this.authService.loginIsSuccess(res);
              return next.handle(request);
            }),
            catchError((error) => {
              this.isRefreshing = false;
              if (error.status == '403') {
                // this.eventBusService.emit(new EventData('logout', null));
                this.authService.logout();
              }

              return throwError(() => error);
            })
          );
      }
    }

    return next.handle(request);
  }
}
