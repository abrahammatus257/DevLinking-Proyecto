import { prisma } from "../config/prisma";

import { CreateProfesionalDto } from "../dtos/profesional.dto";

export const perfilService = {
  // 1. Listar todos los perfiles profesionales activos/disponibles
  async listar() {
    return await prisma.perfilProfesional.findMany({
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            correo: true,
            telefono: true,
          },
        },
        tecnologias: {
          include: {
            tecnologia: {
              select: {
                nombre: true,
                imagen: true,
              },
            },
          },
        },
      },
      orderBy: {
        annosExperiencia: "desc",
      },
    });
  },

  // 2. Obtener un perfil específico por su ID detallado
  async obtenerPorId(id: number) {
    return await prisma.perfilProfesional.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            correo: true,
            telefono: true,
          },
        },
        especialidades: {
          include: {
            especialidad: {
              select: { nombre: true },
            },
          },
        },
        tecnologias: {
          include: {
            tecnologia: {
              select: {
                nombre: true,
                imagen: true,
              },
            },
          },
        },
        servicios: true, // Muestra los servicios que ofrece este profesional específico
      },
    });
  },

  async crear(data: CreateProfesionalDto) {
    return await prisma.perfilProfesional.create({
      data: {
        tituloProfesional: data.tituloProfesional,

        descripcion: data.descripcion,

        annosExperiencia: data.annosExperiencia,

        modalidad: data.modalidad,

        provincia: data.provincia,

        canton: data.canton,

        distrito: data.distrito,

        tarifaBase: data.tarifaBase,

        disponible: data.disponible,

        imagenPerfil: data.imagenPerfil,

        usuarioId: data.usuarioId,

        tecnologias: {
          create: data.tecnologiaIds.map((tecnologiaId) => ({
            tecnologiaId,
          })),
        },

        especialidades: {
          create: data.especialidadIds.map((especialidadId) => ({
            especialidadId,
          })),
        },
      },

      include: {
        tecnologias: true,

        especialidades: true,
      },
    });
  },
};
