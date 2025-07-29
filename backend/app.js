const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const reservasRoutes = require('./routes/reservas');
const pedidosRoutes = require('./routes/pedidos');

// Usar rutas
app.use('/clientes', clientesRoutes);
app.use('/reservas', reservasRoutes);
app.use('/pedidos', pedidosRoutes);




app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


app.get('/', (req, res) => {
  res.send('API del proyecto Bar funcionando 🍻');
});

