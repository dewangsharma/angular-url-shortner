import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsNullOrEmpty } from './common.string';
import { AuthenticationRes } from '../types/responses/authentication.res';
import { AuthenticationReq } from '../types/requests/authentication.req';
import { SignupReq } from '../types/requests/signup.req';
import { SignupRes } from '../types/responses/singup.res';
import { UrlGenerateReq } from '../types/requests/url-generate.req';
import { UrlRes } from '../types/responses/url.res';

@Injectable()
export class ApiUrls {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getall():Observable<UrlRes[]>{
    const apiUrl = `${environment.apiUrl}/url`;
    return this.http.get<UrlRes[]>(apiUrl);
  }

  generate(request: UrlGenerateReq ): Observable<UrlRes>{
    const apiUrl = `${environment.apiUrl}/url`;
      return this.http.post<UrlRes>(
        apiUrl,
        request,
        this.httpOptions
      );
  }
}
