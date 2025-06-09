import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { CanActivateGuard, CanMatchGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/auth.public-guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m=>m.AuthModule),
    canActivate: [PublicGuard],
  },
  {
    path: 'enterprises',
    loadChildren: () => import('./enterprises/enterprises.module').then(m=>m.EnterprisesModule),
    canMatch: [CanMatchGuard],
    canActivate: [CanActivateGuard],
  },
  {
    path: '404',
    component: Error404PageComponent,
  },
  {
    path: '',
    redirectTo: 'enterprises',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: Error404PageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
