import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { HeaderModule } from './modules/header/header.module';
import { UserModule } from './modules/user/user.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiUsers } from './services/api.users';
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderModule,
    HomeModule,
    UserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ApiUsers
    // AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
