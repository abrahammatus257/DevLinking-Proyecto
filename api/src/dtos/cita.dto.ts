import { z } from "zod";

export const createCitaSchema = z.object({
    fechaCita: z.string().datetime({ message: "Formato de fecha de cita inválido (Debe ser ISO string)." }),
    horaInicio: z.string().datetime({ message: "Formato de hora de inicio inválido (Debe ser ISO string)." }),
    horaFinalizacion: z.string().datetime().optional().nullable(),
    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]),
    descripcion: z.string().trim().max(500).optional().nullable(),
    monto: z.number().positive({ message: "El monto debe ser un número positivo." }),
    clienteId: z.number().int().positive(),
    profesionalId: z.number().int().positive(),
    servicioId: z.number().int().positive(),
});

export const updateCitaSchema = createCitaSchema.partial();

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;