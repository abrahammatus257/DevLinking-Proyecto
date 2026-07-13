import { prisma } from "../config/prisma";

export const especialidadService = {

async listar() {
        return await prisma.especialidad.findMany({
            orderBy: { nombre: "asc" }
        });
    },

    // Obtener por ID
    async obtenerPorId(id: number) {
        return await prisma.especialidad.findUnique({
            where: { id }
        });
    },


    async cambiarEstado(id: number) {
        const especialidad = await prisma.especialidad.findUnique({
            where: { id },
        });

        if (!especialidad) {
            throw new Error("Especialidad no encontrada");
        }

        const nuevoEstado = especialidad.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";

        return await prisma.especialidad.update({
            where: { id },
            data: { estado: nuevoEstado },
        });
    },
};