import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiUrls } from 'src/app/services/api.urls';

let componets = [LandingComponent];
@NgModule({
  declarations: [
    LandingComponent
  ],
  exports: componets,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiUrls
    // AuthService
  ],
})
export class HomeModule { }
