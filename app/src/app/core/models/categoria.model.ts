import { Estado } from './usuario.model';

export interface Categoria {

  id: number;

  nombre: string;

  descripcion?: string | null;

  estado: Estado;

  createdAt: string;

  updatedAt: string;

}