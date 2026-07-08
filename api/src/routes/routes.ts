import { Router } from "express";
import { CategoriaRoutes } from "./categoria.routes"; // Asegurate de que la ruta apunte bien a tu archivo de categorías
import { ServicioRoutes } from "./servicio.routes";
import { TecnologiaRoutes } from "./tecnologia.routes";
import { EspecialidadRoutes } from "./especialidad.routes";
import { PerfilRoutes } from "./perfil.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { CitaRoutes } from "./cita.routes";       
import { ResenaRoutes } from "./resena.routes";
import { ImageRoutes } from "./image.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        
        // ---- Agregar las rutas de DevLinking ----
        router.use("/categoria", CategoriaRoutes.routes);
        router.use("/servicio", ServicioRoutes.routes);
        router.use("/tecnologia", TecnologiaRoutes.routes);
        router.use("/especialidad", EspecialidadRoutes.routes);
        router.use("/perfil", PerfilRoutes.routes);
        router.use("/usuario", UsuarioRoutes.routes); 
        router.use("/cita", CitaRoutes.routes);       
        router.use("/resena", ResenaRoutes.routes);
        router.use("/image", ImageRoutes.routes);
        // Conforme hagás los demás CRUDS (Servicios, Citas, etc.), los vas metiendo aquí abajo igual que la profe:
        // router.use("/servicio", ServicioRoutes.routes);

        return router;
    }
}