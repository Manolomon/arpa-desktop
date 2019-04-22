import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { LoginService } from '../servicios/login.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';

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

  public onIniciarSesion(event): void {
    var estado: Number;
    //this.notifier.notify("info", "hola mundo");
    if (this.loginForm.valid) {
      this.loginServicio.iniciarSesion(this.email, this.password)
        .then((res) => {
          estado = 200;
          console.log(estado);
          console.log(this.loginServicio.getUsuario());
          //console.log(this.loginServicio.getUsuario());
          this.router.navigate(['gestion']);
        })
        .catch((err) => {
          console.log('err', err.message);
          estado = 405;
          this.notifier.notify("error", "Datos erróneos");
          console.log(estado);
        });
    } else {
      this.notifier.notify("error", "Campos incompletos");
    }

  }

}
