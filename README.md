-Estructura de la base de datos

-Backend

-Setupear el Frontend

pedidos
-id
-reserva_id
-nombre_producto
-descripcion
-precio
-cantidad

-estructura de la tabla

CREATE TABLE pedidos
(
    id SERIAL PRIMARY KEY,
    reserva_id INT REFERENCES reservas(id),
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL
);