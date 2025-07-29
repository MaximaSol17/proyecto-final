const express = require('express');
const router = express.Router();
const db = require('../db');



//obtengo los pedidos
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pedidos ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//obtener el pedido por id
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
    const { reserva_id, nombre_producto, descripcion, precio, cantidad } = req.body;

    if  (!reserva_id || !nombre_producto || !precio || !cantidad) {
        return res.status(400).json({ error: 'Completa los campos obligatorios' });
    }

    try {
        const result = await db.query(
            `INSERT INTO pedidos (reserva_id, nombre_producto, descripcion, precio, cantidad)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [reserva_id, nombre_producto, descripcion, precio, cantidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//actualizo el pedido
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { reserva_id, nombre_producto, descripcion, precio, cantidad } = req.body;

    try {
        const result = await db.query(
            `UPDATE pedidos SET reserva_id = $1, nombre_producto = $2, descripcion = $3, precio = $4, cantidad = $5 WHERE id = $6 RETURNING *`,
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
router.delete('/:id', async (req, res) => {
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
router.get('/health', (req, res) => {
    res.send('API de pedidos corriendo con exito');
});


module.exports = router;