import { prisma } from "../config/prisma";
import { CreateCitaDto } from "../dtos/cita.dto";

export const citaService = {
    async listar() {
        return await prisma.cita.findMany({
            include: {
                cliente: { select: { nombre_completo: true, correo: true } },
                profesional: {
                    select: {
                        id: true,
                        tituloProfesional: true,
                        usuario: { select: { nombre_completo: true } }
                    }
                },
                servicio: { select: { nombre: true, precio: true } }
            },
            orderBy: { fechaCita: "desc" }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: { select: { nombre_completo: true, correo: true, telefono: true } },
                profesional: {
                    include: {
                        usuario: { select: { nombre_completo: true, correo: true } }
                    }
                },
                servicio: true,
                reseña: true
            }
        });
    },

    async crear(data: CreateCitaDto) {

        // 1. Validar que el cliente exista y esté ACTIVO
        const clienteExiste = await prisma.usuario.findUnique({
            where: { id: data.clienteId }
        });
        if (!clienteExiste || clienteExiste.estado !== "ACTIVO") {
            throw new Error("El cliente seleccionado no existe o no se encuentra activo.");
        }

        // 2. Validar que el perfil profesional exista
        const profesionalExiste = await prisma.perfilProfesional.findUnique({
            where: { id: data.profesionalId }
        });
        if (!profesionalExiste) {
            throw new Error("El profesional seleccionado no existe en el sistema.");
        }

        // 3. Validar que el servicio exista y esté disponible para ese profesional
        const servicioExiste = await prisma.servicio.findUnique({
            where: { id: data.servicioId }
        });
        if (!servicioExiste || servicioExiste.estado !== "ACTIVO") {
            throw new Error("El servicio seleccionado no está disponible o está inactivo.");
        }
        
        if (servicioExiste.profesionalId !== data.profesionalId) {
            throw new Error("El servicio seleccionado no corresponde al profesional asignado.");
        }

        // Obtener el valor numérico base
        const montoBase = data.monto ?? servicioExiste.precio;


        return await prisma.cita.create({
            data: {

                fechaCita: new Date(data.fechaCita),
                horaInicio: new Date(data.horaInicio),
                horaFinalizacion: data.horaFinalizacion ? new Date(data.horaFinalizacion) : null,
                
                modalidad: data.modalidad,

                descripcion: data.descripcion ? data.descripcion.trim() : null,

                monto: montoBase.toString(), 
                
                clienteId: data.clienteId,
                profesionalId: data.profesionalId,
                servicioId: data.servicioId,
                
                estado: "PENDIENTE" 
            },
            include: {
                cliente: { select: { nombre_completo: true } },
                servicio: { select: { nombre: true } }
            }
        });
    }
};