import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioService } from "../services/servicio.service";
import { parseId } from "../utils/parse-id";

export class ServicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await servicioService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.obtenerPorId(id);
        
        if (!servicio) {
            return response.status(StatusCodes.NOT_FOUND).json({ 
                success: false, 
                message: "Servicio no encontrado" 
            });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: servicio });
    };
}