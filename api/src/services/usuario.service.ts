import { prisma } from "../config/prisma";

export const usuarioService = {
    async listar() {
        return await prisma.usuario.findMany({
            where: { estado: "ACTIVO" },
            select: {
                id: true,
                nombre_completo: true,
                correo: true,
                telefono: true,
                rol: true,
                estado: true,
                fechaRegistro: true
            },
            orderBy: { nombre_completo: "asc" }
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
                perfilProfesional: true
            }
        });
    }
};