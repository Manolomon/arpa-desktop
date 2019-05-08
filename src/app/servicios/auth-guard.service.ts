import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { MiembroService } from '../servicios/miembro.service';
import { Miembro } from '../models/MiembroInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  path: import("@angular/router").ActivatedRouteSnapshot[];
  route: import("@angular/router").ActivatedRouteSnapshot;

  private miembro: Miembro = {
    id: '',
    nombre: '',
    correo: ',',
    rol: '',
  }

  constructor(private loginService: LoginService, private router: Router, private miembroService: MiembroService) { }

  canActivate(): boolean {
    if (!this.loginService.isLogged()) {
      this.router.navigate(['login']);
      return false;
    }
    console.log('Puede acceder');
    return true;
  }
}
