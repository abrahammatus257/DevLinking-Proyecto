export type Rol =
    | 'ADMIN'
    | 'CLIENTE'
    | 'PROFESIONAL';

export type Estado =
    | 'ACTIVO'
    | 'INACTIVO';

export interface Usuario {

    id: number;

    nombre_completo: string;

    correo: string;

    telefono?: string | null;

    rol: Rol;

    estado: Estado;

    fechaRegistro: string;

    createdAt: string;

    updatedAt: string;

}