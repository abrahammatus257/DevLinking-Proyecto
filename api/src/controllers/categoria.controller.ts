import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { categoriaService } from "../services/categoria.service";
import { sendSuccess } from "../utils/http-response";
import { parseId } from "../utils/parse-id";

export class CategoriaController {

    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resultado = await categoriaService.listar();
        return response.status(StatusCodes.OK).json({
            success: true,
            data: resultado,
        });
    };

    // 2. Obtener por ID usando parseId
    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);

        const categoria = await categoriaService.obtenerPorId(id);
        if (!categoria) {
            return response.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }

        return response.status(StatusCodes.OK).json({
            success: true,
            data: categoria
        });
    };

    // 3. Crear usando sendSuccess con StatusCodes.CREATED
    crear = async (request: Request, response: Response, next: NextFunction) => {
        const categoria = await categoriaService.crear(request.body);
        return sendSuccess(
            response,
            categoria,
            "Categoría creada correctamente",
            StatusCodes.CREATED
        );
    };

    // 4. Actualizar usando sendSuccess
    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const categoria = await categoriaService.actualizar(id, request.body);
        return sendSuccess(
            response,
            categoria,
            "Categoría actualizada correctamente"
        );
    };

    cambiarEstado = async (
        request: Request,
        response: Response
    ) => {

        const id = parseId(
            request.params.id
        );

        const resultado =
            await categoriaService
                .cambiarEstado(id);

        return response
            .status(StatusCodes.OK)
            .json({
                success: true,
                data: resultado
            });

    };
}