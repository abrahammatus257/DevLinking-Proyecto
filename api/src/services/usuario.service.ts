import { prisma } from "../config/prisma";

export const usuarioService = {
  async listar() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nombre_completo: true,
        correo: true,
        telefono: true,
        rol: true,
        estado: true,
        fechaRegistro: true,
      },
      orderBy: { nombre_completo: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre_completo: true,
        correo: true,
        telefono: true,
        rol: true,
        estado: true,
        perfilProfesional: true,
      },
    });
  },

  async cambiarEstado(id: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const nuevoEstado = usuario.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    return await prisma.usuario.update({
      where: { id },

      data: {
        estado: nuevoEstado,
      },
    });
  },

  async listarProfesionalesDisponibles() {
    return await prisma.usuario.findMany({
      where: {
        rol: "PROFESIONAL",
        perfilProfesional: null,
      },
      select: {
        id: true,
        nombre_completo: true,
        correo: true,
      },
      orderBy: {
        nombre_completo: "asc",
      },
    });
  },
};
