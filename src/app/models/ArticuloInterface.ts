export interface Articulo {
    id?: string;
    titulo?: string;
    estado?: string;
    tipo?: string;
    consideradoPCA?: boolean;
    year?: number;
    descripcion?: string;
    direccionElectronica?: string;
    editorial?: string;
    indice?: string;
    tipoArticulo?: string;
    nombreRevista?: string;
    ISSN?: string;
    paginaInicio?: number;
    paginaFin?: number;
    pais?: string;
    proposito?: string;
    volumen?: number;
    registrado?: firebase.firestore.Timestamp;
}