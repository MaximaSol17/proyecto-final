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
    contraseña varchar(10) not null
);

Create table menu (
    id serial primary key,
    nombre varchar(100) not null,
    descripcion varchar(100) not null,
    precio int not null,
    tipo varchar(100) not null,
    disponible bool not null, 
    pedidos int
);

create table pedidos (
    id serial primary key,
    reserva_id int REFERENCES reservas (id),
    producto_id int REFERENCES menu (id)
);

insert into clientes (nombre, apellido, email, edad, telefono, contraseña) values 
('Adriana', 'Lopez', 'adrilopez@gmail.com', 37, 1123457654, 'mamaypapa'), 
('Matias', 'Cerviño', 'matiascer@gmail.com', 23, 1156789008, 'holasoyyo');

insert into reservas (cliente_id, fecha_reserva, hora, cantidad_personas, estado) values 
(1, '2025-08-20', '20:30', 4, 'confirmado'), 
(2, '2025-07-25', '21:00', 2, 'pendiente');

insert into menu (nombre, descripcion, precio, tipo, disponible, pedidos) values 
('Daikiri', 'elaborado con ron blanco, jugo de lima y azucar', 6100, 'coctel', true, 1),
('Tequila Sunshine', 'elaborado con tequila, creme de cassis, jugo de lima y agua con gas', 6500, 'coctel', true, 1),
('Margarita', 'eladorado con tequila, triple seco y jugo de limon', 6500, 'coctel', true, 1),
('Piña colada', 'elaborado piña, crema de coco y ron', 5500, 'coctel', true, 1),
('Manhattan', 'elaborado con whiskey y vermut rojo', 7000, 'coctel', true, 1),
('Vino rojo', 'elaborado con uvas tintas', 7000, 'Vino', true, 1),
('Vino rosado', 'elaborado con uvas rosadas', 8000, 'vino', true, 1),
('Vino blanco', 'elaborado con blancas florales y frutales', 6600, 'vino', true, 1),
('Merlot', 'elaborado con uva merlot originaria de Francia', 10500, 'vino', true, 1);
