import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsNullOrEmpty } from './common.string';
import { AuthenticationRes } from '../types/responses/authentication.res';
import { AuthenticationReq } from '../types/requests/authentication.req';

@Injectable()
export class ApiUsers {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  login$ = this.login; 

  login(request: AuthenticationReq): Observable<AuthenticationRes> {
    if (
      request != null &&
      !IsNullOrEmpty(request.username) &&
      !IsNullOrEmpty(request.password)
    ) {
      const apiUrl = `${environment.apiUrl}/authentication`;
      return this.http.post<AuthenticationRes>(
        apiUrl,
        request,
        this.httpOptions
      );
    }
    console.log('failed');
    return new Observable<never>;
  }
}
