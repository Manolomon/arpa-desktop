export interface Proyecto {
  id?: string;
  nombre?: string;
  consideradoPCA?: boolean;
  fechaInicio?: firebase.firestore.Timestamp;
  fechaTentativaFin?: firebase.firestore.Timestamp;
  actividadesRealizadas?: string;
  descripcion?: string;
  idCreador?: string;
  productos?: firebase.firestore.DocumentReference[];
}
