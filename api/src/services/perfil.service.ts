import { prisma } from "../config/prisma";

export const perfilService = {
    // 1. Listar todos los perfiles profesionales activos/disponibles
    async listar() {
        return await prisma.perfilProfesional.findMany({
            where: {
                disponible: true
            },
            include: {
                usuario: {
                    select: {
                        nombre_completo: true,
                        correo: true,
                        telefono: true
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
                annosExperiencia: "desc"
            }
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
                        telefono: true
                    }
                },
                especialidades: {
                    include: {
                        especialidad: {
                            select: { nombre: true }
                        }
                    }
                },
                tecnologias: {
                    include: {
                        tecnologia: {
                            select: { nombre: true }
                        }
                    }
                },
                servicios: true // Muestra los servicios que ofrece este profesional específico
            }
        });
    }
};