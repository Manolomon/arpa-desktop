import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Miembro } from '../models/MiembroInterface'
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  constructor(public db: AngularFirestore) { }

  obtenerMiembros() {
    return this.db.collection("miembros").snapshotChanges();
  }

  setMiembroActivo(idMiembro : string) {
    this.miembroDocRef = this.db.collection("miembros").doc(idMiembro).ref;
  }

  getMiembroActivo() {
    return this.miembroDocRef;
  }

}
