import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { resenaService } from '../services/resena.service';
import { parseId } from "../utils/parse-id";

export class ResenaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await resenaService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const resena = await resenaService.obtenerPorId(id);
        
        if (!resena) {
            return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Reseña no encontrada" });
        }
        return response.status(StatusCodes.OK).json({ success: true, data: resena });
    };
}