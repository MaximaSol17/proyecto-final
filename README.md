# proyecto-final
sitio web de compra de entradas de eventos en linea




Reservas
-id
-cliente_id
-fecha_reserva
-hora
-cantidad_personas
-estado

Clientes
-id
-nombre
-apellido
-email
-edad
-contraseña

Menu
-id
-nombre
-descripcion
-precio
-tipo
-disponible


-Estructura de la base de datos:

Create table reservas {

    id serial primary key,
    cliente_id int,
    fecha_reserva varchar(100),
    hora varchar(100),
    cantidad_personas int,
    estado varchar(100),

}

Create table clientes {
    id serial primary key,
    nombre varchar(100),
    apellido varchar(100),
    email varchar(100),
    edad int,
    telefono int,
}

Create table menu {
    id serial primary key,
    nombre varchar(100),
    descripcion varchar(100),
    precio int,
    tipo varchar(100),
    disponible bool,
}