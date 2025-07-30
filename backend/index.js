const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const archivoPedidos = path.join(__dirname, 'pedidos.json');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/admin', (req, res) =>
{
  res.sendFile(path.join(__dirname, '../frontend/pedidos-formulario.html'));
});

//Create
app.post('/api/pedidos', (req, res) =>
{
    const nuevoPedido = req.body;

    if (!nuevoPedido.nombre_producto || !nuevoPedido.precio)
    {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const pedidos = fs.existsSync(archivoPedidos) ? JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8')) : [];

    nuevoPedido.id = Date.now();
    pedidos.push(nuevoPedido);

    fs.writeFileSync(archivoPedidos, JSON.stringify(pedidos, null, 2));
    res.status(201).json(nuevoPedido);
});

app.get('/api/pedidos', (req, res) =>
{
    const pedidos = fs.existsSync(archivoPedidos) ? JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8')) : [];

    res.json(pedidos);
});

//Read
app.get('/api/pedidos/:id', (req, res) =>
{
    const pedidos = JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8'));
    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));

    if (!pedido)
    {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(pedido);
});

//Update
app.put('/api/pedidos/:id', (req, res) =>
{
    const pedidos = JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8'));
    const index = pedidos.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1)
    {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedidos[index] =
    {
        ...pedidos[index],
        ...req.body,
        id: pedidos[index].id
    };

    fs.writeFileSync(archivoPedidos, JSON.stringify(pedidos, null, 2));
    res.json(pedidos[index]);
});

//Delete
app.delete('/api/pedidos/:id', (req, res) =>
{
    const pedidos = JSON.parse(fs.readFileSync(archivoPedidos, 'utf-8'));
    const id = parseInt(req.params.id);

    const nuevosPedidos = pedidos.filter(p => p.id !== id);

    if (nuevosPedidos.length === pedidos.length)
    {
        return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    fs.writeFileSync(archivoPedidos, JSON.stringify(nuevosPedidos, null, 2));
    res.json({ mensaje: 'Pedido eliminado con éxito' })
});

app.listen(PORT, () =>
{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});