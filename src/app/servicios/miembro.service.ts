import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Miembro } from '../models/MiembroInterface';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { isUndefined } from 'util';

@Injectable({
  providedIn: "root"
})
export class MiembroService {

  public miembroDocRef: DocumentReference;
  public miembro: Miembro = {
    id: '',
    nombre: '',
    correo: '',
    passGenerada: '',
    facultad: '',
    institucion: '',
    puesto: '',
    rol: '',
    sni: '',
  };
  private dictionary: Array<String>;

  constructor(
    public db: AngularFirestore,
    private afsAuth: AngularFireAuth
  ) { }

  obtenerMiembros() {
    return this.db.collection("miembros").ref.orderBy("nombre").get();
  }

  obtenerMiembroId(idMiembro: string) {
    return this.db.collection("miembros").doc(idMiembro).ref;
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
    var caracteres: String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPWRSTUVWXYZ0123456789";
    this.dictionary = caracteres.split("");
    var passGenerada = "";
    for (var i = 0; i < 6; i++) {
      passGenerada += this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
    }
    console.log(passGenerada);
    segundaConexion.auth().createUserWithEmailAndPassword(correo, passGenerada).then(function (firebaseUser) {
      console.log("User " + firebaseUser.user.uid + " created successfully!");
      dbTemp.collection("miembros").doc(firebaseUser.user.uid).set({
        nombre: nombre,
        correo: correo,
        rol: rol,
        passGenerada: passGenerada.toString()
      });
      segundaConexion.auth().signOut();
    }).catch(function (error) {
      console.log(error);
    });
    return passGenerada;
  }

  degradarMiembro(idMiembro: string) {
    var docRef = this.db.collection("miembros").doc(idMiembro).ref;
    docRef.get().then(function (doc) {
      docRef.update({
        rol: "Colaborador"
      });
    });
  }

  ascenderColaborador(idMiembro: string) {
    var docRef = this.db.doc("miembros/" + idMiembro).ref.get();
    docRef.then(function (doc) {
      doc.ref.update({
        rol: "Miembro"
      });
    });
    return docRef;
  }

  setMiembroActivo(idMiembro: string) {
    this.miembroDocRef = this.db.collection("miembros").doc(idMiembro).ref;
  }

  getMiembroActivo() {
    return this.miembroDocRef;
  }

  obtenerEstudios(idMiembro) {
    return this.db.collection("miembros").doc(idMiembro).collection("estudios").ref.orderBy("titulo").get();
  }

  agregarEstudio(idMiembro, estudio) {
    return this.db.collection("miembros").doc(idMiembro).collection("estudios").add(estudio);
  }

  modificarEstudio(idMiembro, estudio) {
    return this.db.collection("miembros").doc(idMiembro).collection("estudios").doc(estudio.id).set(estudio)
  }

  eliminarEstudio(idMiembro, idEstudio) {
    return this.db.collection("miembros").doc(idMiembro).collection("estudios").doc(idEstudio).delete();
  }

  actualizarDatos(miembro) {
    this.afsAuth.auth.currentUser.updatePassword(miembro.passGenerada);
    return this.db.collection("miembros").doc(miembro.id).set({
      nombre: miembro.nombre,
      correo: miembro.correo,
      passGenerada: miembro.passGenerada,
      facultad: miembro.facultad,
      institucion: miembro.institucion,
      puesto: miembro.puesto,
      sni: miembro.sni,
      rol: miembro.rol
    });
  }

  agregarOActualizarColaboradorExterno(idMiembro, colaborador) {
    console.log(colaborador);
    if(isUndefined(colaborador.id)) {
      console.log(idMiembro);
      return this.db.collection("miembros").doc(idMiembro).collection("colaboradores").add(colaborador);
    } else {
      return this.db.collection("miembros").doc(idMiembro).collection("colaboradores").doc(colaborador.id).set(colaborador);
    }
  }

  eliminarColaboradorExterno(idMiembro, idColaborador) {
    return this.db.collection("miembros").doc(idMiembro).collection("colaboradores").doc(idColaborador).delete();
  }

  obtenerColaboradoresExternos(idMiembro) {
    return this.db.collection("miembros").doc(idMiembro).collection("colaboradores").ref.orderBy("nombre").get();
  }

}
