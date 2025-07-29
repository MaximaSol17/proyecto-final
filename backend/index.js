const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const archivoPedidos = path.join(__dirname, 'pedidos.json');


app.use(cors());
app.use(bodyParser.json());


app.get('/api/pedidos', (req, res) => {
    const pedidos = JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8'));
    res.json(pedidos);
});


app.post('/api/pedidos', (req, res) => {
    const nuevoPedido = req.body;

    if (!nuevoPedido.nombre_producto || !nuevoPedido.precio) {
        return res.status(400).json({error: 'Faltan campos requeridos' });
    }

    const pedidos = JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8'));
    nuevoPedido.id = Date.now();
    pedidos.push(nuevoPedido);

    fs.writeFileSync(archivoPedidos, JSON.stringify(pedidos, null, 2));

    res.status(201).json(nuevoPedido);
});