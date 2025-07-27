const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const path = require('path');

const app = express();
const PORT = 3000;

const db = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'breakingbar',
  database: 'reservas',
  port: 5432,
});

db.connect();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

//obtengo los pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pedidos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//obtener el pedido por id
app.get('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//crear un nuevo pedido
app.post('/pedidos', async (req, res) => {
    const { reserva_id, nombre_producto, descripcion, precio, cantidad } = req.body;

    if  (!reserva_id || !nombre_producto || !precio || !cantidad) {
        return res.status(400).json({ error: 'Completa los campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO pedidos (reserva_id, nombre_producto, descripcion, precio, cantidad)
            VALUES ($1, $2, $3, $4 $5) RETURNING *`,
            [reserva_id, nombre_producto, descripcion, precio, cantidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//actualizo el pedido
app.put('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const { reserva_id, nombre_producto, descripcion, precio, cantidad } = req.body;

    try {
        const result = await db.query(
            `UPDATE pedidos SET reserva_id = $1, nombre_producto = $2, desripcion = $3, precio = $4, cantidad = $5 WHERE id = $6 RETURNING *`,
            [reserva_id, nombre_producto, descripcion, precio, cantidad, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el pedido' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Eliminar un pedido
app.delete('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM pedidos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró el pedido' });
        }
        res.json({ message: 'El pedido ha sido eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//health ruta
app.get('/', (req, res) => {
    res.send('API de pedidos corriendo con exito');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


