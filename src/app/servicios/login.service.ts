import { Injectable } from '@angular/core';
import { MiembroService } from '../servicios/miembro.service';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/switchMap'

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

  private usuario: Observable<Usuario>
  constructor(
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    //// Get auth data, then get firestore user document || null
    /*  this.usuario = this.afsAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<Usuario>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      )*/
  }

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
