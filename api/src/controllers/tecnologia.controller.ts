import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { tecnologiaService } from '../services/tecnologia.service';
import { parseId } from "../utils/parse-id";

export class TecnologiaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await tecnologiaService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const tecnologia = await tecnologiaService.obtenerPorId(id);
        
        if (!tecnologia) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Tecnología no encontrada" });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: tecnologia });
    };
}