import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/home/landing/landing.component';
import { UserModule } from './modules/user/user.module';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [AuthGuard] },
  { path: 'user', loadChildren: () => UserModule },

  /*
  path: 'users',
        loadChildren: () => import('../modules/user/user.module')
            .then(m => m.UsersModule),
            */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
