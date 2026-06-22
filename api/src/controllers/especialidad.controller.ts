import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { especialidadService } from '../services/especialidad.service';

export class EspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await especialidadService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const id = parseInt(rawId ?? '', 10);
        if (isNaN(id)) {
            return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
        }

        const especialidad = await especialidadService.obtenerPorId(id);
        if (!especialidad) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Especialidad no encontrada" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: especialidad });
    };
}