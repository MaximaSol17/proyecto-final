const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = path.join(__dirname, 'data', 'reservas.json');

//para que lea la lista completa de reservas//
app.get('/reservas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(filePath));
    res.json(data);
})

//para pedir una reserva por su id//
app.get('/reservas/:id', (req, res) => {
    //lo que sigue, convierte el contenido del archivo de texto a un array de java usando JSON.parse// 
    const data = JSON.parse(fs.readFileSync(filePath));
    //lo siguiente, busco dentro de data que coincida el id con el valor enviado, luego uso el find para que me devuelva el primero que cumpla  //
    const reserva = data.find(r => r.id == req.params.id);
    //lo siguiente es para que si se encuentra la reserva devuelve la reserva y si no se encontro devuelve el erro 404 not found//
    reserva ? res.json(reserva) : res.status(404).send('no encontrada');
})

