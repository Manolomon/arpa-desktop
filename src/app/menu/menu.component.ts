import { Component, OnInit } from '@angular/core';
import { Miembro } from '../models/MiembroInterface';
import { LoginService } from '../servicios/login.service';
import { MiembroService } from '../servicios/miembro.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private correo: string;
  private ventana: string;
  public miembro: Miembro = {
    id: '',
    nombre: '',
    correo: ',',
    rol: '',
  }
  constructor(
    private loginServicio: LoginService,
    private miembroService: MiembroService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.correo = this.loginServicio.getUsuario().email;
    var miembroTemp: Miembro = {
      id: '',
      nombre: '',
      correo: ',',
      rol: '',
    };
    this.miembroService.obtenerMiembro(this.correo).then(function (doc) {
      console.log(doc.docs[0].data());
      let temporal = doc.docs[0].data();
      miembroTemp.id = doc.docs[0].ref.id;
      miembroTemp.correo = temporal.correo;
      miembroTemp.nombre = temporal.nombre;
      miembroTemp.rol = temporal.rol;
    });
    this.ventana = 'productos';
    this.miembro = miembroTemp;
    console.log("Tu gfa");
    console.log(this.miembro);
  }

  public irAVentana(ventana: string): void {
    this.ventana = ventana;
  }

  public onCerrarSesion(): void {
    if (confirm("Desea cerrar la sesion?")) {
      console.log(this.loginServicio.getUsuario());
      this.loginServicio.cerrarSesion();
      this.router.navigate(['login']);
    }
  }

}
