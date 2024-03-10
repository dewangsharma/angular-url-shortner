import { Injectable } from '@angular/core';
import { AuthenticationRes } from '../types/responses/authentication.res';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
 
  private userSubject: BehaviorSubject<AuthenticationRes | null>;
  public user: Observable<AuthenticationRes | null>;

  constructor(private router: Router) {
    
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  loginIsSuccess(value: AuthenticationRes): void {
    localStorage.setItem('user', JSON.stringify(value));
    this.userSubject.next(value);
  }
  
  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['user/login']);
  }
}
