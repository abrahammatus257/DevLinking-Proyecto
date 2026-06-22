import { prisma } from "../config/prisma";

export const servicioService = {
    // 1. Listar todos los servicios activos con sus relaciones
    async listar() {
        return await prisma.servicio.findMany({
            where: {
                estado: "ACTIVO"
            },
            include: {
                categoria: {
                    select: { nombre: true }
                },
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

    // 2. Obtener un servicio específico por ID
    async obtenerPorId(id: number) {
        return await prisma.servicio.findUnique({
            where: { id },
            include: {
                categoria: true,
                profesional: true,
                tecnologias: {
                    include: { tecnologia: true }
                },
                especialidades: {
                    include: { especialidad: true }
                }
            }
        });
    }
};