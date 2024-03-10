import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsNullOrEmpty } from './common.string';
import { AuthenticationRes } from '../types/responses/authentication.res';
import { AuthenticationReq } from '../types/requests/authentication.req';
import { SignupReq } from '../types/requests/signup.req';

@Injectable()
export class ApiUsers {
  constructor(private http: HttpClient) {}

  login(request: AuthenticationReq): Observable<AuthenticationRes> {
    if (
      request != null &&
      !IsNullOrEmpty(request.username) &&
      !IsNullOrEmpty(request.password)
    ) {
      const apiUrl = `${environment.apiUrl}/authentication`;
      return this.http.post<AuthenticationRes>(
        apiUrl,
        request
      );
    }
    return new Observable<never>();
  }

  signup(request: SignupReq): Observable<AuthenticationRes> {
    const apiUrl = `${environment.apiUrl}/user`;
    return this.http.post<AuthenticationRes>(apiUrl, request);
  }

  refreshToken(token: string, refreshtoken: string): Observable<AuthenticationRes> {
      const apiUrl = `${environment.apiUrl}/authentication/token`;
      return this.http.post<AuthenticationRes>(apiUrl, {token: token, refreshtoken: refreshtoken});
  }

}
