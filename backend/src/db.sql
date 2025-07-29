Create table reservas (
    id serial primary key,
    cliente_id int REFERENCES clientes (id),
    fecha_reserva date not null,
    hora time not null,
    cantidad_personas int not null,
    estado varchar(100) not null
);

Create table clientes (
    id serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    email varchar(100) not null,
    edad int not null,
    telefono int not null,
    contraseña varchar(50) not null
);

Create table pedidos (
    id serial primary key,
    reserva_id int REFERENCES reservas (id),
    nombre_producto varchar(100) not null,
    descripcion TEXT,
    precio int not null,
    cantidad int not null
);

insert into clientes (nombre, apellido, email, edad, telefono, contraseña) values 
('Adriana', 'Lopez', 'adrilopez@gmail.com', 37, 1123457654, 'mamaypapa'), 
('Matias', 'Cerviño', 'matiascer@gmail.com', 23, 1156789008, 'holasoyyo'),
('Lucía', 'Fernández', 'lucia.fernandez@gmail.com', 29, 1167891234, 'clave123'),
('Joaquín', 'Pérez', 'joaquinp@hotmail.com', 34, 1145678910, 'mi_perro123'),
('Camila', 'Rodríguez', 'camirodri@yahoo.com', 26, 1176543210, 'camipass'),
('Nahuel', 'Gómez', 'nahuelgomez@gmail.com', 40, 1133445566, 'nahuel2023'),
('Valentina', 'Martínez', 'valen.martinez@gmail.com', 31, 1199887766, '123valen'),
('Bruno', 'Sánchez', 'brunosan@hotmail.com', 22, 1155997788, 'bruno_pw'),
('Sofía', 'Álvarez', 'sofiaa@gmail.com', 36, 1177123445, 'sofiasegura'),
('admin', 'admin', 'admin@bar.com', 99, 1122334455, 'admin');

insert into reservas (cliente_id, fecha_reserva, hora, cantidad_personas, estado) values 
(1, '2025-08-20', '20:30', 4, 'confirmado'), 
(2, '2025-07-25', '21:00', 2, 'pendiente'),
(3, '2025-07-26', '20:30', 2, 'confirmada'),
(4, '2025-07-27', '21:00', 4, 'pendiente'),
(5, '2025-07-28', '19:45', 3, 'confirmada'),
(6, '2025-07-29', '22:00', 2, 'cancelada'),
(7, '2025-07-30', '20:00', 5, 'confirmada'),
(8, '2025-07-31', '21:15', 2, 'pendiente'),
(9, '2025-08-01', '19:30', 1, 'confirmada');

insert into pedidos (reserva_id, nombre_producto, descripcion, precio, cantidad) values 
(1, 'Daikiri', 'elaborado con ron blanco, jugo de lima y azucar', 6100, 1),
(2, 'Tequila Sunshine', 'elaborado con tequila, creme de cassis, jugo de lima y agua con gas', 6500, 1),
(3, 'Margarita', 'eladorado con tequila, triple seco y jugo de limon', 6500, 1),
(4, 'Piña colada', 'elaborado piña, crema de coco y ron', 5500, 1),
(5, 'Manhattan', 'elaborado con whiskey y vermut rojo', 7000, 1),
(6, 'Vino rojo', 'elaborado con uvas tintas', 7000, 1),
(7, 'Vino rosado', 'elaborado con uvas rosadas', 8000, 1),
(8, 'Vino blanco', 'elaborado con blancas florales y frutales', 6600, 1),
(9, 'Merlot', 'elaborado con uva merlot originaria de Francia', 10500, 1);
