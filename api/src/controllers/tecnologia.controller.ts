import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { tecnologiaService } from '../services/tecnologia.service';

export class TecnologiaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await tecnologiaService.listar();
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

        const tecnologia = await tecnologiaService.obtenerPorId(id);
        if (!tecnologia) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Tecnología no encontrada" });
        }

        return response.status(StatusCodes.OK).json({ success: true, data: tecnologia });
    };
}