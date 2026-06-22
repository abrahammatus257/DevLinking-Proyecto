import { prisma } from "../config/prisma";

export const citaService = {
    async listar() {
        return await prisma.cita.findMany({
            include: {
                cliente: { select: { nombre_completo: true, correo: true } },
                profesional: { select: { tituloProfesional: true } },
                servicio: { select: { nombre: true, precio: true } }
            },
            orderBy: { fechaCita: "desc" }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: { select: { nombre_completo: true, correo: true, telefono: true } },
                profesional: true,
                servicio: true,
                reseña: true
            }
        });
    }
};