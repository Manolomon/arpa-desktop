export interface Libro {
    id?: string;
    titulo?: string;
    estado?: string;
    tipo?: string;
    consideradoPCA?: boolean;
    year?: number;
    editorial?: string;
    isbn?: string;
    numEdicion?: number;
    paginas?: number;
    pais?: string;
    proposito?: string;
    ejemplares?: number;
    lineaGeneracion?: string;
    colaboradores: firebase.firestore.DocumentReference[];
    registrado?: firebase.firestore.Timestamp;
    evidencia?: string;
    colaboradoresExternos?: string[];
  }