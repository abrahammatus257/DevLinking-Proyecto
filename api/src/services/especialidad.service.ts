import { prisma } from "../config/prisma";

export const especialidadService = {
    // Listar todas las especialidades activas
    async listar() {
        return await prisma.especialidad.findMany({
            where: { estado: "ACTIVO" },
            orderBy: { nombre: "asc" }
        });
    },

    // Obtener por ID
    async obtenerPorId(id: number) {
        return await prisma.especialidad.findUnique({
            where: { id }
        });
    }
};