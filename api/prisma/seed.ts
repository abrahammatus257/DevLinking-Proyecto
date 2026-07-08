import { Rol, Estado, Modalidad, EstadoCita } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";

async function main() {
    console.log("Iniciando seed de DevLinking...");

    // 1. Limpieza de datos (Jerárquico de hijos a padres para no romper llaves foráneas)
    const models = [
        prisma.reseña,
        prisma.cita,
        prisma.servicioTecnologia,
        prisma.servicioEspecialidad,
        prisma.servicio,
        prisma.profesionalTecnologia,
        prisma.profesionalEspecialidad,
        prisma.perfilProfesional,
        prisma.tecnologia,
        prisma.especialidad,
        prisma.categoria,
        prisma.usuario,
    ];

    for (const model of models) {
        await (model as any).deleteMany();
    }
    console.log("🧹 Limpieza de base de datos completada.");

    // 2. Creación de datos maestros
    await prisma.categoria.createMany({
        data: [
            {
                nombre: "Desarrollo de Software",
                descripcion: "Creación de aplicaciones web, móviles y de escritorio.",
            },
            {
                nombre: "Diseño UI/UX",
                descripcion: "Diseño de interfaces y experiencia de usuario.",
            },
            {
                nombre: "Ciberseguridad",
                descripcion:
                    "Auditorías de seguridad, pentesting y protección de redes.",
            },
            {
                nombre: "Soporte Técnico",
                descripcion: "Mantenimiento de hardware y software.",
            },
        ],
    });

    await prisma.especialidad.createMany({
        data: [
            { nombre: "Desarrollo Backend" },
            { nombre: "Desarrollo Frontend" },
            { nombre: "Desarrollo Full-Stack" },
            { nombre: "Seguridad Perimetral" },
            { nombre: "Mantenimiento Preventivo" },
        ],
    });

    await prisma.tecnologia.createMany({
        data: [
            { nombre: ".NET / C#" },
            { nombre: "ASP.NET Core MVC" },
            { nombre: "SQL Server" },
            { nombre: "React" },
            { nombre: "Node.js" },
            { nombre: "Figma" },
        ],
    });

    await prisma.usuario.createMany({
        data: [
            {
                correo: "admin@devlinking.com",
                nombre_completo: "Administrador General",
                password: "hash_password",
                rol: Rol.ADMIN,
            },
            {
                correo: "cliente1@correo.com",
                nombre_completo: "Gabriel Mora",
                telefono: "8888-1111",
                password: "hash_password",
                rol: Rol.CLIENTE,
            },
            {
                correo: "cliente2@correo.com",
                nombre_completo: "Ashley Vargas",
                telefono: "8888-2222",
                password: "hash_password",
                rol: Rol.CLIENTE,
            },
            {
                correo: "profesional1@correo.com",
                nombre_completo: "Emanuel Rojas",
                telefono: "8888-3333",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
            {
                correo: "profesional2@correo.com",
                nombre_completo: "Fabián Arias",
                telefono: "8888-4444",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
            {
                correo: "profesional3@correo.com",
                nombre_completo: "María Gómez",
                telefono: "8888-5555",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
            {
                correo: "profesional4@correo.com",
                nombre_completo: "Daniel Castro",
                telefono: "8888-6666",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
            {
                correo: "profesional5@correo.com",
                nombre_completo: "Laura Solís",
                telefono: "8888-7777",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
            {
                correo: "profesional6@correo.com",
                nombre_completo: "Javier Ramírez",
                telefono: "8888-8888",
                password: "hash_password",
                rol: Rol.PROFESIONAL,
            },
        ],
    });
    console.log("📚 Datos maestros insertados.");

    // 3. Recuperar datos para mapeo indexado por propiedades únicas
    const [categorias, especialidades, tecnologias, usuarios] = await Promise.all(
        [
            prisma.categoria.findMany(),
            prisma.especialidad.findMany(),
            prisma.tecnologia.findMany(),
            prisma.usuario.findMany(),
        ],
    );

    const catMap = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]));
    const espMap = Object.fromEntries(
        especialidades.map((e) => [e.nombre, e.id]),
    );
    const techMap = Object.fromEntries(tecnologias.map((t) => [t.nombre, t.id]));
    const userMap = Object.fromEntries(usuarios.map((u) => [u.correo, u.id]));

    // 4. Creación de Perfiles y Servicios con Relaciones

    // Perfil Profesional 1 (Full-Stack / .NET)
    const perfil1 = await prisma.perfilProfesional.create({
        data: {
            tituloProfesional: "Ingeniero de Software Backend",
            descripcion:
                "Especialista en arquitectura limpia y desarrollo con tecnologías Microsoft.",
            annosExperiencia: 3,
            modalidad: Modalidad.MIXTA,
            provincia: "Alajuela",
            canton: "Alajuela",
            distrito: "San José",
            tarifaBase: 15000.0,
            usuarioId: userMap["profesional1@correo.com"],
            especialidades: {
                create: [
                    { especialidadId: espMap["Desarrollo Backend"] },
                    { especialidadId: espMap["Desarrollo Full-Stack"] },
                ],
            },
            tecnologias: {
                create: [
                    { tecnologiaId: techMap[".NET / C#"] },
                    { tecnologiaId: techMap["ASP.NET Core MVC"] },
                    { tecnologiaId: techMap["SQL Server"] },
                ],
            },
        },
    });

    // Servicio ofrecido por Perfil 1
    const servicioWeb = await prisma.servicio.create({
        data: {
            nombre: "Creación de API REST con .NET",
            descripcion:
                "Desarrollo de API robusta utilizando ASP.NET Core y SQL Server con buenas prácticas.",
            precio: 120000.0,
            duracionEstimada: 40,
            modalidad: Modalidad.VIRTUAL,
            categoriaId: catMap["Desarrollo de Software"],
            profesionalId: perfil1.id,
            especialidades: {
                create: [{ especialidadId: espMap["Desarrollo Backend"] }],
            },
            tecnologias: {
                create: [
                    { tecnologiaId: techMap[".NET / C#"] },
                    { tecnologiaId: techMap["SQL Server"] },
                ],
            },
        },
    });

    // Perfil Profesional 2 (Frontend / React)
    const perfil2 = await prisma.perfilProfesional.create({
        data: {
            tituloProfesional: "Desarrollador Frontend & UI",
            descripcion:
                "Apasionado por el diseño de interfaces limpias y desarrollo en React.",
            annosExperiencia: 2,
            modalidad: Modalidad.VIRTUAL,
            provincia: "San José",
            canton: "San José",
            distrito: "Carmen",
            tarifaBase: 12000.0,
            usuarioId: userMap["profesional2@correo.com"],
            especialidades: {
                create: [{ especialidadId: espMap["Desarrollo Frontend"] }],
            },
            tecnologias: {
                create: [
                    { tecnologiaId: techMap["React"] },
                    { tecnologiaId: techMap["Figma"] },
                ],
            },
        },
    });

    // Servicio ofrecido por Perfil 2
    const servicioLanding = await prisma.servicio.create({
        data: {
            nombre: "Diseño y Desarrollo de Landing Page",
            descripcion:
                "Diseño en Figma y posterior desarrollo en React para tu negocio.",
            precio: 85000.0,
            duracionEstimada: 20,
            modalidad: Modalidad.VIRTUAL,
            categoriaId: catMap["Diseño UI/UX"],
            profesionalId: perfil2.id,
            especialidades: {
                create: [{ especialidadId: espMap["Desarrollo Frontend"] }],
            },
            tecnologias: {
                create: [
                    { tecnologiaId: techMap["React"] },
                    { tecnologiaId: techMap["Figma"] },
                ],
            },
        },
    });
    console.log("👨‍💻 Perfiles y Servicios creados.");

    // 5. Creación de Citas (Órdenes de servicio)

    // Cita 1 - Completada (Con reseña)
    const cita1 = await prisma.cita.create({
        data: {
            fechaCita: new Date("2026-06-10T10:00:00Z"),
            horaInicio: new Date("2026-06-10T10:00:00Z"),
            horaFinalizacion: new Date("2026-06-10T11:00:00Z"),
            modalidad: Modalidad.VIRTUAL,
            descripcion: "Reunión para toma de requerimientos de la API.",
            estado: EstadoCita.COMPLETADA,
            monto: servicioWeb.precio,
            clienteId: userMap["cliente1@correo.com"],
            profesionalId: perfil1.id,
            servicioId: servicioWeb.id,
            reseña: {
                create: {
                    puntuacion: 5,
                    comentario:
                        "Excelente profesional, entendió perfectamente la arquitectura que buscábamos.",
                    clienteId: userMap["cliente1@correo.com"],
                    profesionalId: perfil1.id,
                },
            },
        },
    });

    // Cita 2 - Pendiente
    await prisma.cita.create({
        data: {
            fechaCita: new Date("2026-07-05T14:00:00Z"),
            horaInicio: new Date("2026-07-05T14:00:00Z"),
            modalidad: Modalidad.VIRTUAL,
            descripcion: "Cita inicial para revisar el boceto en Figma.",
            estado: EstadoCita.PENDIENTE,
            monto: servicioLanding.precio,
            clienteId: userMap["cliente2@correo.com"],
            profesionalId: perfil2.id,
            servicioId: servicioLanding.id,
        },
    });

    console.log("✅ Seed completado con éxito.");
}
// Esto es un comentario con el objetivo de comprobar que se sube a git.
main()
    .catch((e) => {
        console.error(" Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
