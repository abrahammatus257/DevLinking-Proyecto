-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `rol` ENUM('ADMIN', 'CLIENTE', 'PROFESIONAL') NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fechaRegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    INDEX `usuarios_correo_idx`(`correo`),
    INDEX `usuarios_rol_idx`(`rol`),
    INDEX `usuarios_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles_profesionales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tituloProfesional` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `annosExperiencia` INTEGER NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `provincia` VARCHAR(100) NOT NULL,
    `canton` VARCHAR(100) NOT NULL,
    `distrito` VARCHAR(100) NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `imagenPerfil` VARCHAR(255) NOT NULL DEFAULT 'profile-not-found.jpg',
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `perfiles_profesionales_usuarioId_key`(`usuarioId`),
    INDEX `perfiles_profesionales_disponible_idx`(`disponible`),
    INDEX `perfiles_profesionales_modalidad_idx`(`modalidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categorias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `especialidades_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnologias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `imagen` VARCHAR(255) NOT NULL DEFAULT 'technology-not-found.jpg',
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tecnologias_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesional_especialidad` (
    `profesionalId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`profesionalId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesional_tecnologia` (
    `profesionalId` INTEGER NOT NULL,
    `tecnologiaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`profesionalId`, `tecnologiaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `imagenPortada` VARCHAR(255) NOT NULL DEFAULT 'service-not-found.jpg',
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracionEstimada` INTEGER NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `categoriaId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `servicios_categoriaId_idx`(`categoriaId`),
    INDEX `servicios_profesionalId_idx`(`profesionalId`),
    INDEX `servicios_estado_idx`(`estado`),
    INDEX `servicios_modalidad_idx`(`modalidad`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_especialidad` (
    `servicioId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`servicioId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_tecnologia` (
    `servicioId` INTEGER NOT NULL,
    `tecnologiaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`servicioId`, `tecnologiaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaCita` DATETIME(3) NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `horaFinalizacion` DATETIME(3) NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTA') NOT NULL,
    `descripcion` VARCHAR(500) NULL,
    `comentarioProfesional` VARCHAR(500) NULL,
    `motivoCancelacion` VARCHAR(500) NULL,
    `estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `monto` DECIMAL(10, 2) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `citas_clienteId_idx`(`clienteId`),
    INDEX `citas_profesionalId_idx`(`profesionalId`),
    INDEX `citas_servicioId_idx`(`servicioId`),
    INDEX `citas_estado_idx`(`estado`),
    INDEX `citas_fechaCita_idx`(`fechaCita`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `puntuacion` INTEGER NOT NULL,
    `comentario` VARCHAR(500) NULL,
    `citaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resenas_citaId_key`(`citaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfiles_profesionales` ADD CONSTRAINT `perfiles_profesionales_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidad` ADD CONSTRAINT `profesional_especialidad_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `perfiles_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidad` ADD CONSTRAINT `profesional_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_tecnologia` ADD CONSTRAINT `profesional_tecnologia_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `perfiles_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_tecnologia` ADD CONSTRAINT `profesional_tecnologia_tecnologiaId_fkey` FOREIGN KEY (`tecnologiaId`) REFERENCES `tecnologias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `perfiles_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_tecnologia` ADD CONSTRAINT `servicio_tecnologia_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_tecnologia` ADD CONSTRAINT `servicio_tecnologia_tecnologiaId_fkey` FOREIGN KEY (`tecnologiaId`) REFERENCES `tecnologias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `perfiles_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `citas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_profesionalId_fkey` FOREIGN KEY (`profesionalId`) REFERENCES `perfiles_profesionales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
