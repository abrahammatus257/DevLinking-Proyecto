import { Categoria } from './categoria.model';
import { Profesional, Tecnologia, Especialidad, Modalidad } from './profesional.model';
import { Estado } from './usuario.model';

export interface Servicio {
    id: number;
    nombre: string;
    descripcion?: string | null;
    imagenPortada: string;
    precio: string | number;
    duracionEstimada: number;
    modalidad: Modalidad;
    estado: Estado;
    categoriaId: number;
    profesionalId: number;
    categoria: Categoria;
    profesional: Profesional;
    tecnologias: { tecnologia: Tecnologia }[];
    especialidades: { especialidad: Especialidad }[];
    createdAt: string;
    updatedAt: string;
}

export interface ServicioCreateDto {
    nombre: string;
    descripcion: string;
    precio: number;
    duracionEstimada: number;
    modalidad: Modalidad;
    categoriaId: number;
    profesionalId: number;
    tecnologiaIds: number[];
    especialidadIds: number[];
    imagenPortada?: string;
}

export interface ServicioUpdateDto extends Partial<ServicioCreateDto> {
    estado?: Estado;
}

export interface ServicioFormModel {
    nombre: string;
    descripcion: string;
    precio: number;
    duracionEstimada: number;
    modalidad: Modalidad;
    categoriaId: string;
    profesionalId: string;
    tecnologiaIds: number[];
    especialidadIds: number[];
    imagenPortada: string;
    estado: Estado;
}