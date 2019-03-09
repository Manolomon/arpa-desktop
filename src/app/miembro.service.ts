import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Miembro } from 'src/app/miembro.model';

@Injectable({
  providedIn: 'root'
})
export class MiembroService {

  constructor(private firestore: AngularFirestore) { }

  getMiembros() {
    return this.firestore.collection('miembro').snapshotChanges();
  }

  crearMiembro(miembro: Miembro) {
    return this.firestore.collection('miembro').add(miembro);
  }

  actualizarMiembro(miembro: Miembro) {
    delete miembro.id;
    return this.firestore.doc('miembro/' + miembro.id).update(miembro);
  }

  eliminarMiembro(miembroId: string) {
    this.firestore.doc('miembro/' + miembroId).delete();
  }
}
