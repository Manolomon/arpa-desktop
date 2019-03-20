import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { MemoriaInterface } from "../models/MemoriaInterface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MemoriaService {
  memoriaAcollection: AngularFirestoreCollection<MemoriaInterface>;
  memorias: Observable<MemoriaInterface>;
  memoriaDoc: AngularFirestoreDocument<MemoriaInterface>;

  constructor(public db: AngularFirestore) {}

  getMemorias() {
    return this.memorias;
  }
}
