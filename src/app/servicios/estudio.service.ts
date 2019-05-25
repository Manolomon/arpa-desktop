import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class EstudioService {

    constructor(public db: AngularFirestore) { }

    obtenerEstudiosMiembro(idMiembro) {
        return this.db.collection('estudios').ref.where("idMiembro", "==", idMiembro).get();
    }

    obtenerEstudios() {
        return this.db.collection('estudios').ref.orderBy("titulo").get();
    }

    obtenerEstudio(idEstudio) {
        return this.db.collection('estudios').doc(idEstudio).snapshotChanges();
    }


    agregarEstudio(estudio) {
        return this.db.collection('estudios').add(estudio);
    }

    modificarEstudio(estudio) {
        return this.db.doc('estudios/' + estudio.id).set(estudio);
    }

}
