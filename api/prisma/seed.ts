import { Rol, Estado, Modalidad, EstadoCita } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";

async function main() {
    console.log("Iniciando seed de DevLinking");

    // 1. Limpieza de datos (Jerárquico para no romper llaves foráneas)
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
    console.log("Limpieza de base de datos completada.");

    // 2. Creación de Categorías (5 requeridas: activas e inactivas)
    await prisma.categoria.createMany({
        data: [
            { nombre: "Desarrollo de Software", descripcion: "Creación de aplicaciones web y móviles.", estado: Estado.ACTIVO },
            { nombre: "Diseño UI/UX", descripcion: "Diseño de interfaces y experiencia de usuario.", estado: Estado.ACTIVO },
            { nombre: "Ciberseguridad", descripcion: "Auditorías de seguridad y pentesting.", estado: Estado.ACTIVO },
            { nombre: "Soporte Técnico", descripcion: "Mantenimiento de hardware y software.", estado: Estado.ACTIVO },
            { nombre: "Cloud Computing", descripcion: "Infraestructura AWS, Azure y DevOps.", estado: Estado.INACTIVO }, // Requisito inactiva
        ],
    });

    // 3. Creación de Especialidades (8 requeridas: activas e inactivas)
    await prisma.especialidad.createMany({
        data: [
            { nombre: "Desarrollo Backend", estado: Estado.ACTIVO },
            { nombre: "Desarrollo Frontend", estado: Estado.ACTIVO },
            { nombre: "Desarrollo Full-Stack", estado: Estado.ACTIVO },
            { nombre: "Seguridad Perimetral", estado: Estado.ACTIVO },
            { nombre: "Mantenimiento Preventivo", estado: Estado.ACTIVO },
            { nombre: "Arquitectura Cloud", estado: Estado.ACTIVO },
            { nombre: "Diseño de Interiores UI", estado: Estado.ACTIVO },
            { nombre: "Auditoría de Sistemas", estado: Estado.INACTIVO },
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
            { nombre: "Docker" },
        ],
    });

    // 5. Creación de Usuarios (Mínimo 8 requeridos entre Admin, Clientes y Profesionales)
    await prisma.usuario.createMany({
        data: [
            { correo: "admin@devlinking.com", nombre_completo: "Administrador General", password: "hash_password", rol: Rol.ADMIN, estado: Estado.ACTIVO },
            { correo: "cliente1@correo.com", nombre_completo: "Gabriel Mora", telefono: "8888-1111", password: "hash_password", rol: Rol.CLIENTE, estado: Estado.ACTIVO },
            { correo: "cliente2@correo.com", nombre_completo: "Ashley Vargas", telefono: "8888-2222", password: "hash_password", rol: Rol.CLIENTE, estado: Estado.ACTIVO },
            { correo: "cliente3@correo.com", nombre_completo: "Carlos Alvarado", telefono: "8888-9999", password: "hash_password", rol: Rol.CLIENTE, estado: Estado.ACTIVO },
            { correo: "profesional1@correo.com", nombre_completo: "Emanuel Rojas", telefono: "8888-3333", password: "hash_password", rol: Rol.PROFESIONAL, estado: Estado.ACTIVO },
            { correo: "profesional2@correo.com", nombre_completo: "Fabián Arias", telefono: "8888-4444", password: "hash_password", rol: Rol.PROFESIONAL, estado: Estado.ACTIVO },
            { correo: "profesional3@correo.com", nombre_completo: "María Gómez", telefono: "8888-5555", password: "hash_password", rol: Rol.PROFESIONAL, estado: Estado.ACTIVO },
            { correo: "profesional4@correo.com", nombre_completo: "Daniel Castro", telefono: "8888-6666", password: "hash_password", rol: Rol.PROFESIONAL, estado: Estado.ACTIVO },
            { correo: "profesional5@correo.com", nombre_completo: "Laura Solís", telefono: "8888-7777", password: "hash_password", rol: Rol.PROFESIONAL, estado: Estado.ACTIVO },
        ],
    });
    console.log(" Datos maestros (Categorías, Especialidades, Usuarios) insertados.");


    const [categorias, especialidades, tecnologias, usuarios] = await Promise.all([
        prisma.categoria.findMany(),
        prisma.especialidad.findMany(),
        prisma.tecnologia.findMany(),
        prisma.usuario.findMany(),
    ]);

    const catMap = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]));
    const espMap = Object.fromEntries(especialidades.map((e) => [e.nombre, e.id]));
    const techMap = Object.fromEntries(tecnologias.map((t) => [t.nombre, t.id]));
    const userMap = Object.fromEntries(usuarios.map((u) => [u.correo, u.id]));

    const perfilesData = [
        { email: "profesional1@correo.com", titulo: "Ingeniero Backend .NET", exp: 5, mod: Modalidad.MIXTA, prov: "Alajuela", cant: "Alajuela", dist: "San José", tarifa: 15000, disp: true, esps: ["Desarrollo Backend", "Desarrollo Full-Stack"], techs: [".NET / C#", "SQL Server"] },
        { email: "profesional2@correo.com", titulo: "Desarrollador Frontend & UI", exp: 3, mod: Modalidad.VIRTUAL, prov: "San José", cant: "San José", dist: "Carmen", tarifa: 12000, disp: true, esps: ["Desarrollo Frontend"], techs: ["React", "Figma"] },
        { email: "profesional3@correo.com", titulo: "Consultor de Ciberseguridad", exp: 6, mod: Modalidad.PRESENCIAL, prov: "Heredia", cant: "Heredia", dist: "Mercedes", tarifa: 25000, disp: true, esps: ["Seguridad Perimetral"], techs: ["Docker"] },
        { email: "profesional4@correo.com", titulo: "Técnico de Soporte TI", exp: 2, mod: Modalidad.PRESENCIAL, prov: "Cartago", cant: "Cartago", dist: "Oriental", tarifa: 10000, disp: true, esps: ["Mantenimiento Preventivo"], techs: [] },
        { email: "profesional5@correo.com", titulo: "Arquitecto Cloud Senior", exp: 8, mod: Modalidad.MIXTA, prov: "San José", cant: "Escazú", dist: "Escazú", tarifa: 35000, disp: false, esps: ["Arquitectura Cloud"], techs: ["Docker", "Node.js"] }, // No disponible
    ];

    const perfilesCreados: any[] = [];
    for (const p of perfilesData) {
        const perf = await prisma.perfilProfesional.create({
            data: {
                tituloProfesional: p.titulo,
                descripcion: `Perfil profesional experto enfocado en la excelencia de servicios TI.`,
                annosExperiencia: p.exp,
                modalidad: p.mod,
                provincia: p.prov,
                canton: p.cant,
                distrito: p.dist,
                tarifaBase: p.tarifa,
                disponible: p.disp,
                usuarioId: userMap[p.email],
                especialidades: { create: p.esps.map(e => ({ especialidadId: espMap[e] })) },
                tecnologias: { create: p.techs.map(t => ({ tecnologiaId: techMap[t] })) }
            }
        });
        perfilesCreados.push(perf);
    }
    console.log(" 5 Perfiles Profesionales creados exitosamente.");

    // 7. Creación de Servicios 
    const serviciosData = [
        { nombre: "API REST con .NET Core", precio: 120000, duracion: 40, mod: Modalidad.VIRTUAL, cat: "Desarrollo de Software", perfIdx: 0, esp: "Desarrollo Backend", techs: [".NET / C#", "SQL Server"], est: Estado.ACTIVO },
        { nombre: "Microservicios en C#", precio: 180000, duracion: 60, mod: Modalidad.MIXTA, cat: "Desarrollo de Software", perfIdx: 0, esp: "Desarrollo Backend", techs: [".NET / C#"], est: Estado.ACTIVO },
        { nombre: "Diseño y Desarrollo de Landing Page", precio: 85000, duracion: 20, mod: Modalidad.VIRTUAL, cat: "Diseño UI/UX", perfIdx: 1, esp: "Desarrollo Frontend", techs: ["React", "Figma"], est: Estado.ACTIVO },
        { nombre: "Prototipado de App Móvil", precio: 50000, duracion: 15, mod: Modalidad.VIRTUAL, cat: "Diseño UI/UX", perfIdx: 1, esp: "Diseño de Interiores UI", techs: ["Figma"], est: Estado.ACTIVO },
        { nombre: "Auditoría de Redes Corporativas", precio: 250000, duracion: 30, mod: Modalidad.PRESENCIAL, cat: "Ciberseguridad", perfIdx: 2, esp: "Seguridad Perimetral", techs: ["Docker"], est: Estado.ACTIVO },
        { nombre: "Configuración de Firewall Lógico", precio: 95000, duracion: 10, mod: Modalidad.VIRTUAL, cat: "Ciberseguridad", perfIdx: 2, esp: "Seguridad Perimetral", techs: [], est: Estado.ACTIVO },
        { nombre: "Mantenimiento de Servidores Físicos", precio: 45000, duracion: 8, mod: Modalidad.PRESENCIAL, cat: "Soporte Técnico", perfIdx: 3, esp: "Mantenimiento Preventivo", techs: [], est: Estado.ACTIVO },
        { nombre: "Migración Básica a AWS cloud", precio: 300000, duracion: 80, mod: Modalidad.MIXTA, cat: "Desarrollo de Software", perfIdx: 4, esp: "Arquitectura Cloud", techs: ["Docker"], est: Estado.ACTIVO },
        { nombre: "Estructura Web Legacy", precio: 60000, duracion: 12, mod: Modalidad.VIRTUAL, cat: "Desarrollo de Software", perfIdx: 1, esp: "Desarrollo Frontend", techs: ["React"], est: Estado.INACTIVO }, // Inactivo
        { nombre: "Limpieza de Virus y Malware", precio: 25000, duracion: 4, mod: Modalidad.PRESENCIAL, cat: "Soporte Técnico", perfIdx: 3, esp: "Mantenimiento Preventivo", techs: [], est: Estado.INACTIVO }  // Inactivo
    ];

    const serviciosCreados: any[] = [];
    for (const s of serviciosData) {
        const serv = await prisma.servicio.create({
            data: {
                nombre: s.nombre,
                descripcion: `Servicio especializado de ${s.nombre} bajo estándares de calidad óptimos.`,
                precio: s.precio,
                duracionEstimada: s.duracion,
                modalidad: s.mod,
                estado: s.est,
                categoriaId: catMap[s.cat],
                profesionalId: perfilesCreados[s.perfIdx].id,
                especialidades: { create: [{ especialidadId: espMap[s.esp] }] },
                tecnologias: { create: s.techs.map(t => ({ tecnologiaId: techMap[t] })) }
            }
        });
        serviciosCreados.push(serv);
    }
    console.log("10 Servicios creados (activos e inactivos).");

    // 8. Creación de Citas
    const citasFechas = [
        "2026-07-15T09:00:00Z", "2026-07-16T10:30:00Z", "2026-07-17T14:00:00Z",
        "2026-07-20T08:00:00Z", "2026-07-21T11:00:00Z", "2026-07-22T15:00:00Z",
        "2026-07-25T09:00:00Z", "2026-07-26T13:00:00Z", "2026-07-27T10:00:00Z",
        "2026-07-28T16:00:00Z", "2026-08-01T11:30:00Z", "2026-08-02T14:00:00Z"
    ];

    for (let i = 0; i < 12; i++) {
        // Rotación de clientes, profesionales y servicios para cumplir variabilidad de la rúbrica
        const clieEmail = i % 3 === 0 ? "cliente1@correo.com" : i % 3 === 1 ? "cliente2@correo.com" : "cliente3@correo.com";
        const servIdx = i % 8; 
        const targetServicio = serviciosCreados[servIdx];
        const fechaBase = new Date(citasFechas[i]);
        const fechaFin = new Date(fechaBase.getTime() + (60 * 60 * 1000));

        await prisma.cita.create({
            data: {
                fechaCita: fechaBase,
                horaInicio: fechaBase,
                horaFinalizacion: fechaFin,
                modalidad: i % 2 === 0 ? Modalidad.VIRTUAL : Modalidad.PRESENCIAL, // Mezcla requerida
                descripcion: `Sesión de requerimientos y alineación para el servicio #${servIdx + 1}.`,
                estado: EstadoCita.PENDIENTE, // Estado base mandatorio
                monto: targetServicio.precio,
                clienteId: userMap[clieEmail],
                profesionalId: targetServicio.profesionalId,
                servicioId: targetServicio.id,
            },
        });
    }

    console.log(" Seed finalizado con éxito: Todo mapeado y listo para evaluación.");
}

main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });