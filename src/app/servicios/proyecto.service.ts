import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(public db: AngularFirestore) { }

  obtenerProyectosMiembro(idMiembro) {
    return this.db.collection('proyectos', ref => ref.where(
      'creador', 'array-contains', idMiembro
    )).snapshotChanges();
  }

  obtenerParticipaciones(idMiembro) {
    return this.db.collection('proyectos', ref => ref.where(
      'colaboradores', 'array-contains', idMiembro
    )).snapshotChanges();
  }

  obtenerProyectos() {
    var docRefs: any[];
    docRefs = [];
    return this.db.collection('proyectos').ref.orderBy("titulo").get();
  }

  obtenerProyecto(idProyecto) {
    return this.db.collection('proyectos').doc(idProyecto).snapshotChanges();
  }


  agregarProyecto(proyecto) {
    return this.db.collection('proyectos').add(proyecto);
  }

  modificarProyecto(proyecto) {
    return this.db.doc('proyectos/' + proyecto.id).set(proyecto);
  }

  eliminarProyecto(idProyecto) {
    return this.db.doc('proyectos/' + idProyecto).delete();
  }

}
