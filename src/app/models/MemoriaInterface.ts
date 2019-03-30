export interface MemoriaInterface {
  id?: string;
  titulo?: string;
  fechaRegistro?: firebase.firestore.Timestamp;
  estado?: string;
  consideradoParaCA?: boolean;
  evidencia?: string;
  autor?: string;
  ciudad?: string;
  fechaPublicacion?: any;
  nombreCongreso?: string;
  paginaInicio?: number;
  paginaFin?: number;
  pais?: string;
  proposito?: string;
  registrado?: firebase.firestore.Timestamp;
}
