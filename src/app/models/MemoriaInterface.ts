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
  colaboradores?: string[];
  registrado?: firebase.firestore.Timestamp;
  evidencia?: string;
}
