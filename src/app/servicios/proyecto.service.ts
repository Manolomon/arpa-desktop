import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(public db: AngularFirestore) { }

  public eliminarProyecto(idProyecto) {
    return this.db.doc('proyectos/' + idProyecto).delete();
  }

}