import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';

let componets = [LandingComponent];
@NgModule({
  declarations: [
    LandingComponent
  ],
  exports: componets,
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
