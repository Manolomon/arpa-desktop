export interface Tesis {
    id?: string;
    titulo?: string;
    estado?: string;
    tipo?: string;
    consideradoPCA?: boolean;
    fechaInicio?: firebase.firestore.Timestamp;
    fechaTermino?: firebase.firestore.Timestamp;
    grado?: string;
    numAlumnos?: number;
    registrado?: firebase.firestore.Timestamp;
    evidencia?: string;
}