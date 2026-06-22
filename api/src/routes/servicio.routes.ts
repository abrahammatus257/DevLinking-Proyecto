import { Router } from "express";
import { servicioController } from "../controllers/servicio.controller";

const router = Router();

router.get("/", servicioController.listar);
router.get("/:id", servicioController.obtenerPorId);

export const ServicioRoutes = { routes: router };