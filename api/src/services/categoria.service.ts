import { prisma } from "../config/prisma";
import { CreateCategoriaDto, UpdateCategoriaDto } from "../dtos/categoria.dto";

export const categoriaService = {
  // 1. Listar todas las categorías activas
  async listar() {
    return await prisma.categoria.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
  },

  // 2. Obtener una categoría por su ID
  async obtenerPorId(id: number) {
    return await prisma.categoria.findUnique({
      where: { id },
    });
  },

  async crear(data: CreateCategoriaDto) {
    return await prisma.categoria.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: "ACTIVO",
      },
    });
  },

  async actualizar(id: number, data: UpdateCategoriaDto) {
    return await prisma.categoria.update({
      where: { id },
      data: data,
    });
  },

  async cambiarEstado(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    const nuevoEstado = categoria.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    return await prisma.categoria.update({
      where: { id },
      data: {
        estado: nuevoEstado,
      },
    });
  },
};
