export type EstadoCita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'CANCELADA' | 'COMPLETADA';
export type ModalidadCita = 'VIRTUAL' | 'PRESENCIAL' | 'MIXTA';

export interface Cita {
    id: number;
    fechaCita: string;          // Llega como ISO String del API
    horaInicio: string;         // Llega como ISO String del API
    horaFinalizacion?: string | null;
    modalidad: ModalidadCita;
    descripcion?: string | null;
    comentarioProfesional?: string | null;
    motivoCancelacion?: string | null;
    estado: EstadoCita;
    monto: number;              // Mapeado desde el Decimal(10,2) del API
    clienteId: number;
    profesionalId: number;
    servicioId: number;
    createdAt: string;
    updatedAt: string;

    // Relaciones incluidas mediante el findMany/findUnique de Prisma
    cliente: {
        nombre_completo: string;
        correo: string;
        telefono?: string | null; // Incluido en el obtenerPorId
    };

    profesional: {
        id: number;
        tituloProfesional: string;
        usuario?: {
            nombre_completo: string;
            correo?: string;
        };
    };

    servicio: {
        id?: number;
        nombre: string;
        precio: number;
    };
}