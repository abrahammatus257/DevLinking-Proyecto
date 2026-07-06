import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class ServicioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ServicioController(); // <-- Instancia la nueva clase

        router.get('/', asyncHandler(controller.listar));
        router.get('/:id', asyncHandler(controller.obtenerPorId));

        return router;
    }
}