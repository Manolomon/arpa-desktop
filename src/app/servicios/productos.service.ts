import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { ProyectoService } from '../servicios/proyecto.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private filePath: string = 'productos/';
  private uploadTask: firebase.storage.UploadTask;
  constructor(
    public db: AngularFirestore,
    private proyectoService: ProyectoService,
  ) { }

  obtenerProductosMiembro(idMiembro) {
    return this.db.collection('productos').ref.where("colaboradores", "array-contains", idMiembro).get();
  }

  obtenerProductos() {
    return this.db.collection("productos").ref.orderBy("titulo").get();
  }

  obtenerProducto(idProducto) {
    return this.db.collection('productos').doc(idProducto).snapshotChanges();
  }

  obtenerLGAC() {
    return this.db.collection('lgac').snapshotChanges();
  }

  agregarProducto(producto) {
    return this.db.collection('productos').add(producto);
  }

  modificarProducto(producto) {
    console.log(producto.id);
    return this.db.doc('productos/' + producto.id).set(producto);
  }

  eliminarProducto(idProducto) {
    return this.db.doc('productos/' + idProducto).delete();
  }

  subirArchivo(upload: File, idProducto: string, progreso: number) {
    let refAlmacenamiento = firebase.storage().ref();
    this.uploadTask = refAlmacenamiento.child(`${this.filePath}/${idProducto}/${upload.name}`).put(upload);
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        console.log(error)
      },
      () => {
        let path = 'productos/' + idProducto;
        console.log(path);
        //return this.db.collection(path).add(upload);
      }
    );
  }

  obtenerProductosCurriculum(inicio: Date, fin: Date) {
    return this.db.collection('productos').ref.where('registrado', '>=',
      firebase.firestore.Timestamp.fromDate(inicio)).where('registrado', '<=',
        firebase.firestore.Timestamp.fromDate(fin)).get();
  }

}
