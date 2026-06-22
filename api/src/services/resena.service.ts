import { prisma } from "../config/prisma";

export const resenaService = {
    async listar() {
        return await prisma.reseña.findMany({
            include: {
                cliente: { select: { nombre_completo: true } },
                profesional: { select: { tituloProfesional: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.reseña.findUnique({
            where: { id },
            include: {
                cliente: { select: { nombre_completo: true } },
                profesional: { select: { tituloProfesional: true } },
                cita: true
            }
        });
    }
};