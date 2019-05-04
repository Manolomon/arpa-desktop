import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from '../app/productos/productos.component';
import { LoginComponent } from '../app/login/login.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { GestionCaComponent } from './gestion-ca/gestion-ca.component';
import { MenuComponent } from './menu/menu.component';
import { AuthGuardService as AuthGuard } from '../app/servicios/auth-guard.service';

const routes: Routes = [
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'proyectos',
    component: ProyectosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gestion',
    component: GestionCaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
