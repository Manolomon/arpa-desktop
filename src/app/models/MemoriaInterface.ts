export interface Memoria {
  id?: string;
  titulo?: string;
  tipo?: string;
  estado?: string;
  consideradoPCA?: boolean;
  autor?: string;
  ciudad?: string;
  fechaPublicacion?: firebase.firestore.Timestamp;
  nombreCongreso?: string;
  lineaGeneracion?: string;
  paginaInicio?: number;
  paginaFin?: number;
  pais?: string;
  proposito?: string;
  colaboradores?: firebase.firestore.DocumentReference[];
  registrado?: firebase.firestore.Timestamp;
  evidencia?: string;
  colaboradoresExternos?: string[];
}
