import { z } from "zod";

export const createServicioSchema = z.object({
    nombre: z.string().trim().min(3).max(150),
    descripcion: z.string().trim().max(500).optional(),
    precio: z.number().positive(),
    duracionEstimada: z.number().int().positive(),
    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]),
    categoriaId: z.number().int().positive(),
    profesionalId: z.number().int().positive(),
    tecnologiaIds: z.array(z.number().int().positive()).optional().default([]),
    especialidadIds: z.array(z.number().int().positive()).optional().default([]),
    imagenPortada: z.string().optional(),
});

export const updateServicioSchema = createServicioSchema.partial();

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;