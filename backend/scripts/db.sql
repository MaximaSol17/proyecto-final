CREATE TABLE pedidos
(
    id SERIAL PRIMARY KEY,
    reserva_id INT REFERENCES reservas(id),
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL
);