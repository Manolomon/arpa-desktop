import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Miembro } from '../models/MiembroInterface'
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class MiembroService {

  public miembro: Miembro = {
    id: '',
    correo: '',
    nombre: '',
  };

  constructor(public db: AngularFirestore) { }

  obtenerMiembros() {
    return this.db.collection("miembros").snapshotChanges();
  }
  setMiembroActivo(correo: string) {

  }

  getMiembroActivo() {
    return this.miembro;
  }

}
