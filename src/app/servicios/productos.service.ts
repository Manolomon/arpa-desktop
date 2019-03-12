import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  obtenerProductos(idMiembro) {
      return this.db.collection('productos', ref => ref.where(
          'colaboradores', 'array-contains', idMiembro
      )).snapshotChanges(); 
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