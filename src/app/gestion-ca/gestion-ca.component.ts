import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../servicios/login.service';
import { MiembroService } from '../servicios/miembro.service';
import { Miembro } from '../models/MiembroInterface'

@Component({
  selector: 'app-gestion-ca',
  templateUrl: './gestion-ca.component.html',
  styleUrls: ['./gestion-ca.component.scss']
})
export class GestionCaComponent implements OnInit {

  private correo: string;
  private miembro: Miembro = {
    id: '',
    nombre: '',
    correo: '',
  }
  constructor(
    private router: Router,
    private loginServicio: LoginService,
    private miembroService: MiembroService,
  ) { }

  ngOnInit() {
  }

  public onCerrarSesion() {
    if (confirm("Desea cerrar la sesion?")) {
      console.log(this.loginServicio.getUsuario());
      this.loginServicio.cerrarSesion();
      this.router.navigate(['login']);
    }
  }

}
