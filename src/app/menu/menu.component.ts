import { Component, OnInit } from '@angular/core';
import { Miembro } from '../models/MiembroInterface';
import { LoginService } from '../servicios/login.service';
import { MiembroService } from '../servicios/miembro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { DialogoComponent } from 'src/app/dialogo/dialogo.component';

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
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.correo = this.loginServicio.getUsuario().email;
    var miembroTemp: Miembro = {
      id: '',
      nombre: '',
      correo: ',',
      rol: '',
    };
    this.miembroService.obtenerMiembro(this.correo).then(function(doc) {
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
    var resultado: boolean;
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: "¿Está seguro que desea cerrar su sesión?",
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.loginServicio.cerrarSesion();
        this.router.navigate(['login']);
      }
    });
  }

}
