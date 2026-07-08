import { z } from "zod";

export const createProfesionalSchema = z.object({
  tituloProfesional: z.string().trim().min(3).max(150),

  descripcion: z.string().trim().min(10).max(1000),

  annosExperiencia: z.number().int().min(0),

  modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTA"]),

  provincia: z.string(),

  canton: z.string(),

  distrito: z.string(),

  tarifaBase: z.number().positive(),

  disponible: z.boolean(),

  imagenPerfil: z.string().optional(),

  usuarioId: z.number().int().positive(),

  tecnologiaIds: z.array(z.number().int().positive()),

  especialidadIds: z.array(z.number().int().positive()),
});

export const updateProfesionalSchema = createProfesionalSchema.partial();

export type CreateProfesionalDto = z.infer<typeof createProfesionalSchema>;

export type UpdateProfesionalDto = z.infer<typeof updateProfesionalSchema>;
