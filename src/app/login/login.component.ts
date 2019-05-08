import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { LoginService } from '../servicios/login.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MiembroService } from '../servicios/miembro.service';
import { Miembro } from '../models/MiembroInterface'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private email: string;
  private password: string;
  constructor(
    private atAuth: AngularFireAuth,
    private notifier: NotifierService,
    private router: Router,
    private route: ActivatedRoute,
    private loginServicio: LoginService,
    private miembroService: MiembroService,
  ) {
    this.email = '';
    this.password = '';
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordControl: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.loginServicio.cerrarSesion();
  }

  public cerrarSesion(): void {
    if (confirm("Desea cerrar la sesion?")) {
      this.loginServicio.cerrarSesion();
    }
  }

  public async onIniciarSesion(event) {
    var estado: Number;
    //this.notifier.notify("info", "hola mundo");
    if (this.loginForm.valid) {
      var miembroTemp: Miembro = {
        id: '',
        nombre: '',
        correo: ',',
        rol: '',
      };
      await this.miembroService.obtenerMiembro(this.email)
        .then(function (doc) {
          let temporal = doc.docs[0].data();
          miembroTemp.id = doc.docs[0].ref.id;
          miembroTemp.correo = temporal.correo;
          miembroTemp.nombre = temporal.nombre;
          miembroTemp.rol = temporal.rol;
        });

      if (miembroTemp.rol != 'Colaborador') {
        this.loginServicio.iniciarSesion(this.email, this.password)
          .then((res) => {
            estado = 200;
            console.log(estado);
            this.router.navigate(['menu']);
            this.miembroService.setMiembroActivo(this.atAuth.auth.currentUser.uid);
          })
          .catch((err) => {
            console.log('err', err.message);
            estado = 405;
            this.notifier.notify("error", "Datos erróneos");
            console.log(estado);
          });
      } else {
        this.notifier.notify("warning", "Acceso denegado");
      }
    } else {
      this.notifier.notify("error", "Campos incompletos");
    }

  }

}
