import { Router } from "express";
import { TecnologiaController } from "../controllers/tecnologia.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware"; // Ajustá esta ruta a tu middleware real

export class TecnologiaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new TecnologiaController();

        router.get('/', asyncHandler(controller.listar));
        router.get('/:id', asyncHandler(controller.obtenerPorId));

        return router;
    }
}