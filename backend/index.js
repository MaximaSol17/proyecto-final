const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservas'
})

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
})

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')))

const filePath = path.join(__dirname, 'data', 'reservas.json');

//para que lea la lista completa de reservas//
app.get('/reservas', (req, res) => {
    db.query('SELECT * FROM reservas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    })
})

//para pedir una reserva por su id//
app.get('/reservas/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM reservas WHERE id = ?';
    db.query(sql, [id], (err,results) => {
        if (err)return res.status(500).json({ error: err.message });
        if (results.lengh === 0) {
            res.status(404).send('Reserva no encontrada');
        }
        else {
            res.json(results[0]);
        }
    })
})

//recibe y guarda una nueva reserva en reservas.json//
app.post('/reservas', (req, res) => {
    const { nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id } = req.body;
    const sql = `
    INSERT INTO reservas (nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, cliente_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, ...req.body });
    })
})

//editar una reserva existente
app.put('/reservas/:id', (req, res) => {
   const id = req.params.id;
   const { nombre_cliente, fecha_reserva, hora, cantidad_personas, estado } = req.body;

   const query = `
    UPDATE reservas
    SET nombre_cliente = ?, fecha_reserva = ?, hora = ?, cantidad_personas = ?, estado = ?
    WHERE id = ?
    `;

    db.query(
        query,
        [nombre_cliente, fecha_reserva, hora, cantidad_personas, estado, id],
        (err, result) => {
            if (err) {
                console.error('Error al actualizar la reserva:', err);
                res.status(500).send('Error al actualizar');
            } 
            else if (result.affectedRows === 0) {
                res.status(404).send('Reserva no encontrada');
            }
            else {
                res.send('Reserva actualizada correctamente');
            }
        }    
    );
})

//eliminar reserva
app.delete('/reservas/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM reservas WHERE id =?';

  db.query(query, [id], (err, results) => {
    if (err) {
        console.error('Erorr al eliminar la reserva', err);
        res.status(500).send('Error al eliminar');
    }
    else if (results.affectedRows === 0) {
        res.status(404).send('Reserva no encontrada');
    }
    else{
        res.send('Reserva eliminada correctamente');
    }
  })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});