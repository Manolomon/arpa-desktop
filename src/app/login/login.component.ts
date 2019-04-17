import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, Form } from '@angular/forms';
import { LoginService } from '../servicios/login.service'
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private email: string;
  private password: string;
  constructor(public atAuth: AngularFireAuth, private router: Router, private loginServicio: LoginService) {
    this.email = '';
    this.password = '';
  }

  ngOnInit() {
  }

  public cerrarSesion(): void {
    this.loginServicio.cerrarSesion();
  }

  public onIniciarSesion(): void {
    this.loginServicio.iniciarSesion(this.email, this.password)
      .then((res) => {
        console.log(this.email);
        console.log(this.password)
        this.router.navigate(['productos/app-productos']);
      }).catch(err => console.log('err', err.message));
  }

}
