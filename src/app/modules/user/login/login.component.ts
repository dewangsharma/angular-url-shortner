import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiUsers } from 'src/app/services/api.users';
import {
  Subject,
  catchError,
  filter,
  finalize,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationReq } from 'src/app/types/requests/authentication.req';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  //#region "form"
  submitted = false;
  validation = {
    username: { minLength: 6, maxLength: 50, lengthMessage: '' },
    password: { minLength: 6, maxLength: 50, lengthMessage: '' },
  };

  loginForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.username.minLength),
        Validators.maxLength(this.validation.username.maxLength),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.password.minLength),
        Validators.maxLength(this.validation.password.maxLength),
      ],
    ],
    remember: [''],
  });

  get formControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  //#endregion

  data$ = new Subject<AuthenticationReq>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiUser: ApiUsers,
    private authService: AuthService
  ) {
    this.validation.username.lengthMessage = `Username's min-length is ${this.validation.username.minLength} and max-length is ${this.validation.username.maxLength}.`;
    this.validation.username.lengthMessage = `Password's min-length is ${this.validation.password.minLength} and max-length is ${this.validation.password.maxLength}.`;
  }

  ngOnInit(): void {
    if (this.authService.user) {
      this.router.navigate(['/']);
    }
    this.data$
      .pipe(
        filter(() => !this.submitted),
        tap(() => (this.submitted = true)),
        switchMap((reqData: AuthenticationReq) =>
          this.apiUser.login(reqData).pipe(
            map((res) => {
              this.authService.loginIsSuccess(res);
              this.router.navigate(['/']);
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
  }

  ngOnDestroy(): void {
    if (this.data$) this.data$.unsubscribe();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.data$.next({
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    });
  }
}
