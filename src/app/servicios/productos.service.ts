import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Capitulo } from '../models/CapituloInterface';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    private filePath: string = 'productos/';
    private uploadTask: firebase.storage.UploadTask;
    constructor(public db: AngularFirestore) { }

    obtenerProductosMiembro(idMiembro) {
        return this.db.collection('productos', ref => ref.where(
            'colaboradores', 'array-contains', idMiembro
        )).snapshotChanges();
    }

    obtenerProductos() {
        return this.db.collection('productos').snapshotChanges();
    }

    obtenerProducto(idProducto) {
        return this.db.collection('productos').doc(idProducto).snapshotChanges();
    }

    agregarProducto(producto) {
        return this.db.collection('productos').add(producto);
    }

    modificarProducto(producto) {
        return this.db.doc('productos/' + producto.id).set(producto);
    }

    eliminarProducto(idProducto) {
        return this.db.doc('productos/' + idProducto).delete();
    }

    subirArchivo(upload: File, producto) {
        let refAlmacenamiento = firebase.storage().ref();
        let progreso: number;
        this.uploadTask = refAlmacenamiento.child(`${this.filePath}/${producto.id}/`).put(upload);
        this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            (error) => {
                console.log(error)
            },
            () => {
                this.db.collection('productos/' + producto.id).add(upload);
            }
        );
    }

}