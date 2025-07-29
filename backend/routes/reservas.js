const express = require('express');

const router = express.Router();

const db = require('../db');




//sigue template Reservas
//para que lea la lista completa de reservas//
router.get('/', (req, res) => {
    db.query('SELECT * FROM reservas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.rows);
    });
});

//para pedir una reserva por su id//
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM reservas WHERE id = $1';
    db.query(sql, [id], (err,results) => {
        if (err)return res.status(500).json({ error: err.message });
        if (results.rows.length === 0) {
            res.status(404).send('Reserva no encontrada');
        } else {
            res.json(results[0]);
        }
    });
});

//obtiene solo las reservas del cliente que inicio sesion
router.get('/cliente/:cliente_id', (req, res) => {
    const cliente_id = req.params.cliente_id;
    const sql = 'SELECT * FROM reservas WHERE cliente_id = $1';

    db.query(sql, [cliente_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.rows);
    });
});

//recibe y guarda una nueva reserva en reservas.json//
router.post('/', (req, res) => {
    const { nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id } = req.body;
    const sql = `
      INSERT INTO reservas (nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    db.query(sql, [nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json(results.rows[0]);
        } 
    });
});

//editar una reserva existente
router.put('/:id', (req, res) => {
   const id = req.params.id;
   const { nombre_cliente, fecha_reserva, hora, cantidad_personas, estado } = req.body;

   const query = `
    UPDATE reservas
    SET nombre_cliente = $1, fecha_reserva = $2, hora = $3, cantidad_personas = $4, estado = $5
    WHERE id = $6
    RETURNING *
    `;

    db.query(
        query,
        [nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, id],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar la reserva:', err);
                res.status(500).send('Error al actualizar');
            } else if (result.rowCount === 0) {
                res.status(404).send('Reserva no encontrada');
            } else {
                res.send('Reserva actualizada correctamente');
            }
        }    
    );
});

//eliminar reserva
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM reservas WHERE id = $1';

  db.query(query, [id], (err, results) => {
    if (err) {
        console.error('Erorr al eliminar la reserva', err);
        res.status(500).send('Error al eliminar');
    } else if (results.rowCount === 0) {
        res.status(404).send('Reserva no encontrada');
    } else {
        res.send('Reserva eliminada correctamente');
    }
  });
});

module.exports = router;