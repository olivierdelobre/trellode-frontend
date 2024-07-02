import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from "jwt-decode";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private authService: AuthService) {
  
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log("route="+this.router.url);
        //console.log("error="+JSON.stringify(error));
        if (error.status === 401 || error.status === 403) {
          console.log("route in error");
          // save the requested URL
          if (!this.router.url.startsWith('/login')) {
            localStorage.setItem(environment.settings.redirect_login, this.router.url);
          }

          // if there's a 401/403, it means token is invalid/removed/expired, so we can try to refresh token
          if (localStorage.getItem(environment.settings.token_name+".refresh")) {
            //console.log("refresh token");
            let jwt;
            this.authService.getTokenFromRefreshToken().subscribe({
              next: (data: any) => {
                if (!data.access_token || data.access_token == 'undefined') {
                  return;
                }
                localStorage.setItem(environment.settings.token_name, data.access_token);
                localStorage.setItem(environment.settings.token_name+".refresh", data.refresh_token);
              },
              error: (error) => {
                console.log('ResponseInterceptor: error getting token from refresh token');
              },
              complete: () => {}
            });
          }
          else {
            // just redirect to login
            //console.log("redirect to login");
            this.router.navigate(['/login']);
          }
        }
        return throwError(error);
      })
    );
  }
}