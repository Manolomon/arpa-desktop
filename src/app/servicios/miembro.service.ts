import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Miembro } from '../models/MiembroInterface'
import { AngularFireAuth } from '@angular/fire/auth';
import { Admin } from '@angular/fire/es2015/'
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: "root"
})
export class MiembroService {

  public miembroDocRef : DocumentReference;
  public miembro: Miembro = {
    id: '',
    correo: '',
    nombre: '',
  };
  private dictionary : Array<String>;

  constructor(
    public db: AngularFirestore,
    private afsAuth: AngularFireAuth
  ) { }

  obtenerMiembros() {
    return this.db.collection("miembros").ref.orderBy("nombre").get();
  }

  obtenerMiembro(correo: string) {
    return this.db.collection("miembros").ref.where("correo", "==", correo).limit(1).get();
  }

  registrarMiembro(nombre: string, correo: string, rol: string) {
    var dbTemp = this.db;
    var config = {
      apiKey: "AIzaSyB8U1sGZ0nv84GoFy68BUYg9qxIjOc7dwM",
      authDomain: "arpa-desktop.firebaseapp.com",
      databaseURL: "https://arpa-desktop.firebaseio.com"
    };
    var segundaConexion = firebase.initializeApp(config, "Secundiaria");
    var caracteres : String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPWRSTUVWXYZ0123456789";
    this.dictionary = caracteres.split("");
    var passGenerada = "";
    for (var i = 0; i < 6; i++) {
      passGenerada += this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    }
    console.log(passGenerada);
    segundaConexion.auth().createUserWithEmailAndPassword(correo, passGenerada).then(function(firebaseUser) {
      console.log("User " + firebaseUser.user.uid + " created successfully!");
      dbTemp.collection("miembros").doc(firebaseUser.user.uid).set({
        nombre: nombre,
        correo: correo,
        rol: rol
      });
      segundaConexion.auth().signOut();
    }).catch(function(error) {
      console.log(error);
    });
    return passGenerada;
  }

  setMiembroActivo(idMiembro : string) {
    this.miembroDocRef = this.db.collection("miembros").doc(idMiembro).ref;
  }

  getMiembroActivo() {
    return this.miembroDocRef;
  }

}
