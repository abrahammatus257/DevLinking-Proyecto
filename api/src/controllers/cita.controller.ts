import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { citaService } from '../services/cita.service';
import { parseId } from "../utils/parse-id";

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
}