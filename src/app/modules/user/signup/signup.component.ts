import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, catchError, finalize, map, of, switchMap } from 'rxjs';
import { ApiUsers } from 'src/app/services/api.users';
import { AuthService } from 'src/app/services/auth.service';
import { SignupReq } from 'src/app/types/requests/signup.req';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  //#region "form"
  submitted = false;
  validation = {
    firstname: { minLength: 1, maxLength: 50, lengthMessage: '' },
    lastname: { minLength: 6, maxLength: 50, lengthMessage: '' },
    email: { minLength: 6, maxLength: 60, lengthMessage: '' },
    password: { minLength: 6, maxLength: 50, lengthMessage: '' },
  };

  signupForm = this.fb.group({
    firstname: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.firstname.minLength),
        Validators.maxLength(this.validation.firstname.maxLength),
      ],
    ],
    lastname: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.lastname.minLength),
        Validators.maxLength(this.validation.lastname.maxLength),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validation.email.minLength),
        Validators.maxLength(this.validation.email.maxLength),
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
  });
  //#endregion

  signup$ = new Subject<SignupReq>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiUser: ApiUsers,
    private authService: AuthService
  ) {
    this.validation.firstname.lengthMessage = `Firstname's min-length is ${this.validation.firstname.minLength} and max-length is ${this.validation.firstname.maxLength}.`;
    this.validation.lastname.lengthMessage = `Lastname's min-length is ${this.validation.lastname.minLength} and max-length is ${this.validation.lastname.maxLength}.`;
    this.validation.email.lengthMessage = `Username's min-length is ${this.validation.lastname.minLength} and max-length is ${this.validation.lastname.maxLength}.`;
    this.validation.password.lengthMessage = `Password's min-length is ${this.validation.password.minLength} and max-length is ${this.validation.password.maxLength}.`;

    this.signup$
      .pipe(
        switchMap((reqData: SignupReq) =>
          this.apiUser.signup(reqData).pipe(
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

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  get formControl(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.signup$.next({
      firstname: this.signupForm.value.firstname!,
      lastname: this.signupForm.value.lastname!,
      email: this.signupForm.value.email!,
      password: this.signupForm.value.password!,
    });
  }
}
