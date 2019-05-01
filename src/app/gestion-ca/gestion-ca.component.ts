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
  private integrantes: Miembro[] = [];
  private mostrarCard : boolean = false;
  private integranteSeleccionado : Miembro;
  
  constructor(
    private router: Router,
    private loginServicio: LoginService,
    private miembroService: MiembroService,
  ) { }

  ngOnInit() {
    this.miembroService.obtenerMiembros().subscribe(datos => {
      this.integrantes = [];
      for (let dato of datos) {
        var integrante: Miembro = {
          id: '',
          nombre: '',
          correo: '',
          rol: '',
        };
        let temporal: any = (dato.payload.doc.data());
        console.log(temporal);
        integrante.nombre = temporal.nombre;
        integrante.correo = temporal.correo;
        integrante.rol = temporal.rol;
        integrante.id = dato.payload.doc.ref.id;
        console.log(integrante);
        this.integrantes.push(integrante);
      }
    });
  }

  public clickMiembro(integrante: Miembro) {
    this.mostrarCard = true;
    this.integranteSeleccionado = integrante;
  }

  public onCerrarSesion() {
    if (confirm("Desea cerrar la sesion?")) {
      console.log(this.loginServicio.getUsuario());
      this.loginServicio.cerrarSesion();
      this.router.navigate(['login']);
    }
  }

}
