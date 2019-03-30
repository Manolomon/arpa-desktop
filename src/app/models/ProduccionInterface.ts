export interface Produccion {
    id?: string;
    titulo?: string;
    estado?: string;
    tipo?: string;
    consideradoPCA?: boolean;
    clasificacion?: string;
    descripcion?: string;
    fechaPublicacion?: firebase.firestore.Timestamp;
    numRegistro?: string;
    pais?: string;
    proposito?: string;
    uso?: string;
    usuario?: string;
    registrado?: firebase.firestore.Timestamp;
    evidencia?: string;
}