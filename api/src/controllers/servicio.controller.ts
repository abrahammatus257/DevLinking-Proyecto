import { Request, Response, NextFunction } from "express";
import { servicioService } from "../services/servicio.service";

export const servicioController = {
    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const servicios = await servicioService.listar();
            res.json({
                success: true,
                data: servicios
            });
        } catch (error) {
            next(error);
        }
    },

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            const servicio = await servicioService.obtenerPorId(id);

            if (!servicio) {
                return res.status(404).json({
                    success: false,
                    message: "Servicio no encontrado"
                });
            }

            res.json({
                success: true,
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    }
};