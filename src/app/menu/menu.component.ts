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
  }
  constructor(
    private loginServicio: LoginService,
    private miembroService: MiembroService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.correo = this.loginServicio.getUsuario().email;
    this.miembroService.obtenerMiembros().subscribe(datos => {
      let miembros: Array<any> = [];
      for (let i = 0; i < datos.length; i++) {
        let temporal = datos[i].payload.doc.data();
        miembros.push(temporal);
        miembros[i].id = datos[i].payload.doc.id;
      }
      for (let i = 0; i < datos.length; i++) {
        if (miembros[i].correo == this.correo) {
          this.miembro.id = miembros[i].id;
          this.miembro.correo = miembros[i].correo;
          this.miembro.nombre = miembros[i].nombre;
          break;
        }
      }
      console.log(this.miembro);
    });
  }

  public irAVentana(ventana: string): void {
    this.ventana = ventana;
  }
}