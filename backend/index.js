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
app.post('/reservas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(filePath));
    //la siguiente linea crea una nueva reserva; el id data.length +1 genera un nuevo id automatico y el req.body suma todos los datos que envió el usuario
    const nuevaReserva = { id: data.length +1, ...req.body };
    data.push(nuevaReserva);
    //null 2 es para que tenga indentacion
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    //el codigo 201 es cuando se creó con exito, y devuelve la nueva reserva
    res.status(201).json(nuevaReserva);
})

//editar una reserva existente
app.put('/reservas/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(filePath));
    //busco el objeto en data que tenga el id solicitado, req.params.id contiene el id, el findIndex devuelve el numero de posicion si fue exitoso, o -1 si no lo encuentra
    const index = data.findIndex(r =>  r.id == req.params.id);
    //si no lo encuentra devuelve el mensaje de error 404 y corta la ejecucuion con return
    if (index === -1) return res.status(404).send('No Encontrada');
    data[index] = {...data[index], ...req.body };
    //sobreescribo el archivo:
    fs.write.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json(data[index]);
})

//eliminar reserva
app.delete('/reservas/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(filePath));
    //con data.filter creo un nuevo array pero sin el id al que se quiere eliminar, por eso uso !=, excluye esa reserva
    data = data.filter(r => r.id != req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.send('Reserva Eliminada');
})