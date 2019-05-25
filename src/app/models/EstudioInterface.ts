export interface Estudio {
  id?: string;
  titulo?: string;
  grado?: string;
  institucion?: string;
  paisInstitucion?: string;
  area?: string;
  fecha?: firebase.firestore.Timestamp;
  idMiembro?: string;
}
