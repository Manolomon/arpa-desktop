import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductosComponent } from '../app/productos/productos.component';
import { LoginComponent } from '../app/login/login.component';

const routes: Routes = [
  { path: 'productos/app-productos', component: ProductosComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
