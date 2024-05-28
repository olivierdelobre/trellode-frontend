import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem(environment.settings.token_name);
        let lang = localStorage.getItem(environment.settings.lang);
        const authReq = httpRequest.clone({
            headers: httpRequest.headers
              .set('Cache-Control', 'no-cache')
              .set('Authorization', 'Bearer ' + token)
              .set('Content-Language', '' + lang)
          });
          return next.handle(authReq);
    }
}