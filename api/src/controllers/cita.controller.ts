import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { citaService } from '../services/cita.service';
import { parseId } from "../utils/parse-id";
import { createCitaSchema } from "../dtos/cita.dto";

export class CitaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await citaService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const cita = await citaService.obtenerPorId(id);

        if (!cita) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Cita no encontrada" });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: cita });
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            // Validamos el cuerpo de la petición usando el esquema de Zod corporativo
            const validacion = createCitaSchema.safeParse(request.body);

            if (!validacion.success) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Error de validación en los datos de la cita",
                });
            }

            // Pasamos los datos limpios e inferidos al servicio
            const resultado = await citaService.crear(validacion.data);

            return response.status(StatusCodes.CREATED).json({
                success: true,
                message: "Cita registrada con éxito",
                data: resultado,
            });
        } catch (error) {
            next(error);
        }
    };
}