export type Modalidad =
  | 'VIRTUAL'
  | 'PRESENCIAL'
  | 'MIXTA';

export interface Tecnologia {

  id: number;

  nombre: string;

  imagen: string;

}

export interface ProfesionalTecnologia {

  profesionalId: number;

  tecnologiaId: number;

  tecnologia: Tecnologia;

}

export interface Profesional {

  id: number;

  tituloProfesional: string;

  descripcion?: string | null;

  annosExperiencia: number;

  modalidad: Modalidad;

  provincia: string;

  canton: string;

  distrito: string;

  tarifaBase: number;

  disponible: boolean;

  imagenPerfil: string;

  usuarioId: number;

  usuario: {

    nombre_completo: string;

    correo: string;

    telefono?: string | null;

  };

  tecnologias: ProfesionalTecnologia[];
  especialidades: ProfesionalEspecialidad[];

}

export interface Especialidad {

  id: number;

  nombre: string;

}

export interface ProfesionalEspecialidad {

  profesionalId: number;

  especialidadId: number;

  especialidad: Especialidad;

}

export interface ProfesionalFormModel {

  tituloProfesional: string;

  descripcion: string;

  annosExperiencia: number;

  modalidad: Modalidad;

  provincia: string;

  canton: string;

  distrito: string;

  tarifaBase: number;

  disponible: boolean;

  imagenPerfil: string;

  usuarioId: string;

  tecnologiaIds: number[];

  especialidadIds: number[];

}

export interface ProfesionalCreateDto {

  tituloProfesional: string;

  descripcion: string;

  annosExperiencia: number;

  modalidad: Modalidad;

  provincia: string;

  canton: string;

  distrito: string;

  tarifaBase: number;

  disponible: boolean;

  imagenPerfil: string;

  usuarioId: number;

  tecnologiaIds: number[];

  especialidadIds: number[];

}

export interface ProfesionalUpdateDto {

  tituloProfesional?: string;

  descripcion?: string;

  annosExperiencia?: number;

  modalidad?: Modalidad;

  provincia?: string;

  canton?: string;

  distrito?: string;

  tarifaBase?: number;

  disponible?: boolean;

  imagenPerfil?: string;

  usuarioId?: number;

  tecnologiaIds?: number[];

  especialidadIds?: number[];

}

