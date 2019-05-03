import { Injectable } from '@angular/core';
import { MiembroService } from '../servicios/miembro.service';
import { auth } from 'firebase/app';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap, first } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/switchMap'
import { AuthGuardService } from './auth-guard.service';

interface Usuario {
  id: string;
  nombre?: string;
  correo?: string;
  password?: string;
  protoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private authState: any = null;
  private usuario: Observable<Usuario>;
  constructor(
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    //// Get auth data, then get firestore user document || null
    /*this.usuario = this.afsAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Usuario>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )*/
    this.afsAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  isAuth() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  isLogged() {
    return this.authState != null;
  }

  iniciarSesion(email: string, password: string) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(function (err) {
        console.log(err);
      });
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  /* private onLogin(email,password) {
     return this.afsAuth.auth.signInWithEmailAndPassword(email,password)
       .then((credential) => {
         this.actualizarInformacionUsuario(credential.user);
       });
   }
 
   private actualizarInformacionUsuario(user) {
     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`miembros/${user.id}`);
 
     const data: Usuario = {
       id: user.id,
       nombre: user.nombre,
       correo: user.correo,
       password: user.password,
       protoUrl: user.protoUrl,
     }
 
     return userRef.set(data, { merge: true })
 
   }
 */
  getUsuario() {
    return this.afsAuth.auth.currentUser;
  }

  cerrarSesion() {
    this.afsAuth.auth.signOut();
  }

}
