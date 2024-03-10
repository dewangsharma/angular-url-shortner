import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ApiUrls } from 'src/app/services/api.urls';
import { ApiUsers } from 'src/app/services/api.users';
import { AuthService } from 'src/app/services/auth.service';
import { UrlGenerateReq } from 'src/app/types/requests/url-generate.req';
import { UrlRes } from 'src/app/types/responses/url.res';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  //#region "form"
  submitted = false;
  validation = {
    url: { minLength: 6, maxLength: 50, lengthMessage: '' },
  };

  urlForm = this.fb.group({
    url: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.url.minLength),
        Validators.maxLength(this.validation.url.maxLength),
      ],
    ],
  });
  get formControl(): { [key: string]: AbstractControl } {
    return this.urlForm.controls;
  }

  //#endregion
  private urlSubject = new Subject<void>();
  private urlGenerateSubject = new Subject<UrlGenerateReq>();
  appLink: string = `${environment.apiUrl}/url`;
  urls$ = new Observable<UrlRes[]>();

  constructor(
    private fb: FormBuilder,
    private apiUrl: ApiUrls,
    private apiUser: ApiUsers,
    private authService: AuthService
  ) {
    
    this.validation.url.lengthMessage = `Url's min-length is ${this.validation.url.minLength} and max-length is ${this.validation.url.maxLength}.`;

    this.urlGenerateSubject
      .pipe(
        filter(() => !this.submitted),
        tap(() => (this.submitted = true)),
        switchMap((reqData: UrlGenerateReq) =>
          this.apiUrl.generate(reqData).pipe(
            map((res) => {
              console.log(res);
            }),
            catchError((error) => {
              return of(error);
            }),
            finalize(() => {
              this.submitted = false;
            })
          )
        )
      )
      .subscribe();

    this.urls$ = this.urlSubject.pipe(
      switchMap(() =>
        this.apiUrl.getall()
      )
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.urlSubject.next();
    }, 100);
  }

  ngOnDestroy(): void {
    // Unsubscribe all
  }

  refresh(): void {
    this.urlSubject.next();
  }

  onSubmit(): void {
    if (this.urlForm.invalid) {
      return;
    }
    this.urlGenerateSubject.next({
      actual: this.urlForm.value.url!,
      shortened: '',
    });
  }
}
