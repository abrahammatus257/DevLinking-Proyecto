import { prisma } from "../config/prisma";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";

export const servicioService = {
    // 1. Listar todos los servicios activos con sus relaciones
   // 1. Listar todos los servicios con sus relaciones (Eliminado el filtro hardcoded de estado)
async listar() {
    return await prisma.servicio.findMany({
        include: {
            categoria: true, // <--- Traemos todo el objeto completo para asegurar los IDs
            profesional: {
                select: {
                    tituloProfesional: true,
                    usuario: {
                        select: { nombre_completo: true }
                    }
                }
            },
            tecnologias: {
                include: {
                    tecnologia: {
                        select: { nombre: true }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
},

    async obtenerPorId(id: number) {
    return await prisma.servicio.findUnique({
        where: { id },
        include: {
            categoria: true,
            profesional: {
                include: {
                    usuario: {
                        select: { nombre_completo: true }
                    }
                }
            },
            tecnologias: {
                include: {
                    tecnologia: true
                }
            },
            especialidades: {
                include: {
                    especialidad: true
                }
            }
        }
    });
},

    async crear(data: CreateServicioDto) {
        return await prisma.servicio.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracionEstimada: data.duracionEstimada,
                modalidad: data.modalidad,
                categoriaId: data.categoriaId,
                profesionalId: data.profesionalId,
                imagenPortada: data.imagenPortada,
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

    async actualizar(id: number, data: UpdateServicioDto) {
        // Borramos las relaciones viejas
        await prisma.servicioTecnologia.deleteMany({
            where: { servicioId: id },
        });
        await prisma.servicioEspecialidad.deleteMany({
            where: { servicioId: id },
        });

        return await prisma.servicio.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracionEstimada: data.duracionEstimada,
                modalidad: data.modalidad,
                categoriaId: data.categoriaId,
                profesionalId: data.profesionalId,
                imagenPortada: data.imagenPortada,
                tecnologias: {
                    create: (data.tecnologiaIds ?? []).map((tecnologiaId) => ({
                        tecnologiaId,
                    })),
                },
                especialidades: {
                    create: (data.especialidadIds ?? []).map((especialidadId) => ({
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

    async cambiarEstado(id: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id },
        });

        if (!servicio) {
            throw new Error("Servicio no encontrado");
        }

        const nuevoEstado = servicio.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

        return await prisma.servicio.update({
            where: { id },
            data: {
                estado: nuevoEstado,
            },
        });
    },
};