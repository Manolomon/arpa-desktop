import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(public db: AngularFirestore) {}

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

}