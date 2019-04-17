import { Injectable } from '@angular/core';
import { MiembroService } from '../servicios/miembro.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private afsAuth: AngularFireAuth) { }

  isAuth() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  iniciarSesion(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  cerrarSesion() {
    this.afsAuth.auth.signOut();
  }
}
