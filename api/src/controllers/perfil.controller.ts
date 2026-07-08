import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { perfilService } from "../services/perfil.service";
import { parseId } from "../utils/parse-id";

export class PerfilController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const resultado = await perfilService.listar();
    return response.status(StatusCodes.OK).json({
      success: true,
      data: resultado,
    });
  };

  obtenerPorId = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const id = parseId(request.params.id);
    const perfil = await perfilService.obtenerPorId(id);

    if (!perfil) {
      return response
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Reseña no encontrada" });
    }
    return response
      .status(StatusCodes.OK)
      .json({ success: true, data: perfil });
  };

  crear = async (request: Request, response: Response) => {
    const perfil = await perfilService.crear(request.body);

    return response.status(StatusCodes.CREATED).json({
      success: true,
      data: perfil,
    });
  };
}
