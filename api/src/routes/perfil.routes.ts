import { Router } from "express";
import { PerfilController } from "../controllers/perfil.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class PerfilRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PerfilController();

    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", asyncHandler(controller.crear));
    router.put("/:id", asyncHandler(controller.actualizar));
    
    return router;
  }
}
