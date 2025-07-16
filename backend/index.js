const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const filePath = path.join(__dirname, 'data', 'reservas.json');

//para que lea la lista completa de reservas//
//req es la solicitud, res es la respuesta///
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

//recibe y guarda una nueva reserva en reservas.json//
//uso el metodo POST para que se ejecute cuando alguien envíe datos desde el formulario//
app.post('/reservas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(filePath));
    //la siguiente linea crea una nueva reserva; el id data.length +1 genera un nuevo id automatico y el req.body suma todos los datos que envió el usuario
    const nuevaReserva = { id: data.length +1, ...req.body };
    //agrego la reserva:
    data.push(nuevaReserva);
    //null 2 es para que tenga indentacion
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    //el codigo 201 es cuando se creó con exito, y devuelve la nueva reserva
    res.status(201).json(nuevaReserva);
})


