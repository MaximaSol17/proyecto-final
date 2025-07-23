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
    pedidos int REFERENCES reservas (id)
);

insert into clientes (nombre, apellido, email, edad, telefono, contraseña) values 
('Adriana', 'Lopez', 'adrilopez@gmail.com', 37, 1123457654, 'mamaypapa'), 
('Matias', 'Cerviño', 'matiascer@gmail.com', 23, 1156789008, 'holasoyyo');

insert into reservas (cliente_id, fecha_reserva, hora, cantidad_personas, estado) values 
(2, '12-08-2025', '20:30', 4, 'confirmado'), 
(3, '25-07-2025', '21:00', 2, 'pendiente');

insert into menu (nombre, descripcion, precio, tipo, disponible, pedidos) values 
('Fernet', 'bebida alcohólica elaborada con 70% coca-cola y 30% fernet', 5000, 'bebida alcohólica', 'si', 1);
/*NO LO AGREGUÉ*/