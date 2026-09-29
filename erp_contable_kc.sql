-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-09-2026 a las 17:15:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `erp_contable_kc`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `rfc` varchar(13) NOT NULL,
  `tipo` enum('Cliente','Proveedor') NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`id`, `nombre`, `rfc`, `tipo`, `email`, `telefono`, `fecha_creacion`) VALUES
(1, 'Kevyn Camacaro', 'CAMK202610010', 'Cliente', 'kevyncamacaro1@gmail.com', NULL, '2026-09-29 14:18:47'),
(2, 'Proveedor Global', 'PGL987654XYZ', 'Proveedor', 'ventas@global.com', NULL, '2026-09-29 14:18:47'),
(3, 'Distribuidora Los Andes C.A.', 'DLA2026100101', 'Cliente', 'ventas@andes.com', '0412-1234567', '2026-09-29 14:52:14'),
(5, 'Distribuidora Los Andes C.A.', 'DLA2026100102', 'Cliente', 'ventas@losandes.com', '0412-1234567', '2026-09-29 15:13:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `concepto` varchar(200) NOT NULL,
  `tipo` enum('Ingreso','Egreso') NOT NULL,
  `monto` decimal(10,2) NOT NULL CHECK (`monto` > 0),
  `fecha` date NOT NULL,
  `contacto_id` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `concepto`, `tipo`, `monto`, `fecha`, `contacto_id`, `fecha_creacion`) VALUES
(1, 'Ajuste inicial Cédula: V-30895463', 'Ingreso', 1500.00, '2026-09-15', 1, '2026-09-29 14:18:47'),
(2, 'Compra de insumos', 'Egreso', 450.50, '2026-09-16', 2, '2026-09-29 14:18:47'),
(3, 'Ajuste inicial Cédula: V-12345678', 'Ingreso', 2500.00, '2026-10-01', 1, '2026-09-29 14:52:48'),
(4, 'Ajuste inicial Cédula: V-30895463', 'Ingreso', 2500.00, '2026-10-01', 1, '2026-09-29 14:53:02');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfc` (`rfc`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacto_id` (`contacto_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`contacto_id`) REFERENCES `contactos` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
