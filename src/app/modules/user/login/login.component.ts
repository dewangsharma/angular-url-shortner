import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiUsers } from 'src/app/services/api.users';
import {
  BehaviorSubject,
  Subject,
  catchError,
  filter,
  finalize,
  find,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationRes } from 'src/app/types/responses/authentication.res';
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
    console.log('onInit');
    if (this.authService.user) {
      this.router.navigate(['/']);
    }

    this.data$
      .pipe(
        filter(() => !this.submitted),
        tap(() => (this.submitted = true)),
        switchMap((reqData: AuthenticationReq) =>
          this.apiUser.login(reqData).pipe(
            map((x) => {
              console.log(x);
            }),
            catchError((error) => {
              console.log(error);
              return of(error);
            }),
            finalize(() => {
              console.log('finalize inside');
              this.submitted = false;
            })
          )
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    console.log('Destroy');
    if (this.data$) this.data$.unsubscribe();
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
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
