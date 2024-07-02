import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";
import { Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AuthService {
  public loggedIn = false;
  public userinfo: any;

  private apiUrl = environment.settings.api;

  constructor(private http: HttpClient) {}

  public getTokenFromRefreshToken() {
    let url: string;
    url = environment.settings.api + '/users/token';
    let body = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', localStorage.getItem(environment.settings.token_name+".refresh")!);

    return this.http.post(url,
      body,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  public logout(): any {
    localStorage.removeItem(environment.settings.token_name);
    localStorage.removeItem(environment.settings.token_name+".refresh");
  }

  public getUserInfo(): Observable<any> {
    let root = 0;

    if (localStorage.getItem(environment.settings.token_name)) {
      let jwt = jwtDecode(localStorage.getItem(environment.settings.token_name)!);
      // check if token is expired
      if (jwt["exp"]) {
        // check jwt["exp"], which is a timestamp, is after now
        if (jwt["exp"] < Math.floor(Date.now() / 1000)) {
          console.log("JWT is expired");
          //// try to get a new token from refresh token
          //this.getTokenFromRefreshToken().subscribe({
          //  next: (data: any) => {
          //    if (!data.access_token || data.access_token == 'undefined') {
          //      return of(null);
          //    }
          //    localStorage.setItem(environment.settings.token_name, data.access_token);
          //    localStorage.setItem(environment.settings.token_name+".refresh", data.refresh_token);
          //    jwt = jwtDecode(localStorage.getItem(environment.settings.token_name)!);
          //    return this.getUserInfoFromIdp().pipe(
          //      switchMap((data: any) => {
          //          return of({name: (jwt as any)["name"], uniqueId: (jwt as any)["email"], root: data.root});
          //      })
          //    ).subscribe(() => {});
          //  },
          //  error: (error) => {
          //    console.log('error getting token from refresh token');
          //  },
          //  complete: () => {}
          //});
          
          // redirect to login
          return of(null);
        }
        else {
          console.log("JWT is NOT expired");
          // token not expired
          return of({firstname: (jwt as any)["firstname"], lastname: (jwt as any)["lastname"], email: (jwt as any)["email"], id: (jwt as any)["id"]});
        }
      }
    }
    
    return of(null);
  }

  authenticate(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/v1/users/authenticate`, { email: email, password: password });
  }
}
