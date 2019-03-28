export interface Capitulo {
  id?: string;
  titulo?: string;
  estado?: string;
  tipo?: string;
  consideradoPCA?: boolean;
  year?: number;
  editorial?: string;
  isbn?: string;
  numEdicion?: number;
  paginaInicio?: number;
  paginaFinal?: number;
  pais?: string;
  proposito?: string;
  tituloLibro?: string;
  lineaGeneracion?: string;
  colaboradores: string[];

}