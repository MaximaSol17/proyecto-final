Create table reservas (
    id serial primary key,
    cliente_id int REFERENCES clientes (id),
    fecha_reserva varchar(100) not null,
    hora varchar(100) not null,
    cantidad_personas int not null,
    estado varchar(100) not null
);

Create table clientes (
    id serial primary key,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    email varchar(100) not null,
    edad int not null,
    telefono int not null
);

Create table menu (
    id serial primary key,
    nombre varchar(100) not null,
    descripcion varchar(100) not null,
    precio int not null,
    tipo varchar(100) not null,
    disponible bool not null, 
    pedidos int REFERENCES reservas (id)
);

insert into clientes (nombre, apellido, email, edad, telefono) values 
('Adriana', 'Lopez', 'adrilopez@gmail.com', 37, 1123457654), 
('Matias', 'Cerviño', 'matiascer@gmail.com', 23, 1156789008);

insert into reservas (cliente_id, fecha_reserva, hora, cantidad_personas, estado) values 
(1, 12-08-2025, 20-30, 4, 'confirmado'), 
(2, 25-07-2025, 21-00, 2, 'pendiente');