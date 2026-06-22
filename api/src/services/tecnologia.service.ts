import { prisma } from "../config/prisma";

export const tecnologiaService = {
    // Listar todas las tecnologías activas
    async listar() {
        return await prisma.tecnologia.findMany({
            where: { estado: "ACTIVO" },
            orderBy: { nombre: "asc" }
        });
    },

    // Obtener tecnología por ID
    async obtenerPorId(id: number) {
        return await prisma.tecnologia.findUnique({
            where: { id }
        });
    }
};