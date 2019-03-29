export interface MemoriaInterface {
  titulo?: string;
  fechaRegistro?: any;
  estado?: string;
  consideradoParaCA?: boolean;
  evidencia?: File;
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
