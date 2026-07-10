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

    crear = async (request: Request, response: Response) => {
        const servicio = await servicioService.crear(request.body);
        return response.status(StatusCodes.CREATED).json({
            success: true,
            data: servicio,
        });
    };

    actualizar = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.actualizar(id, request.body);

        return response.status(StatusCodes.OK).json({
            success: true,
            data: servicio,
        });
    };

    cambiarEstado = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);
        const resultado = await servicioService.cambiarEstado(id);

        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };
}