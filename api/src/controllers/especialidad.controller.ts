import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { especialidadService } from '../services/especialidad.service'; // Asegúrate de que apunte bien
import { parseId } from "../utils/parse-id";

export class EspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await especialidadService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const especialidad = await especialidadService.obtenerPorId(id);
        if (!especialidad) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Especialidad no encontrada" });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: especialidad });
    };

    cambiarEstado = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const resultado = await especialidadService.cambiarEstado(id);
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado
        });
    };
}