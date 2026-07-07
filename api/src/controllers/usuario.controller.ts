import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
import { parseId } from "../utils/parse-id";

export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await usuarioService.listar();
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
        const usuario = await usuarioService.obtenerPorId(id);

        if (!usuario) {
            return response
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: "Usuario no encontrado" });
        }
        return response
            .status(StatusCodes.OK)
            .json({ success: true, data: usuario });
    };

    cambiarEstado = async (request: Request, response: Response) => {
        const id = parseId(request.params.id);

        const resultado = await usuarioService.cambiarEstado(id);

        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };
}
