import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from '../app/productos/productos.component';
import { LoginComponent } from '../app/login/login.component';
import { ProyectosComponent } from './proyectos/proyectos.component';
import { GestionCaComponent } from './gestion-ca/gestion-ca.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'proyectos', component: ProyectosComponent },
  { path: 'gestion', component: GestionCaComponent },
  { path: 'menu', component: MenuComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
