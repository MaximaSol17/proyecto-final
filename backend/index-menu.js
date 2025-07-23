//obtengo los productos de menu
app.get('/menu', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM menu ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//agregar productos al menu
app.post('/menu', async (req, res) => {
    const { nombre, descripcion, precio, tipo, disponible, reserva_id } = req.body
    try {
        const result = await db.query(
            `INSERT INTO menu (nombre, descripcion, precio, tipo, disponible, reserva_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `,
            [nombre, descripcion, precio, tipo, disponible, reserva_id]
        );
        res. status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//editar pedido
app.put('/pedidos/:id', async (req, res) => {
    const id = req.params.id;
    const { producto_id } = req.body;
    try {
        //primero verifico si el producto ya lo tiene el cliente
        const menuItem = await db.query('SELECT * FROM menu WHERE cliente_id = $1 AND reserva_id IN (SELECT ID FROM reservas WHERE cliente_id = $2)', [id, cliente_id]);
        if (menuItem.rows.length === 0) {
            return res.status(403).json({ error: "No puedes editar este item" });
        }

        //si tiene el item
        const result = await db.query(
            `UPDATE pedidos SET producto_id = $1 WHERE id = $2 RETURNING *`,
            [producto_id, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//eliminar producto si le pertenece
app.delete('/menu/:id', async(req, res) => {
    const id = req.params.id;
    const { cliente_id } = req.body;
    try {
        const menuItem = await db.query('SELECT * FROM menu WHERE id = $1 AND reserva_id IN (SELECT id FROM reservas WHERE cliente_id = $2)', [id, cliente_id]);

        if (menuItem.rows.length === 0) {
            return res.status(403).json({ error: "No puedes eliminar este producto" });
        }

        await db.query('DELETE FROM menu WHERE id = $1', [id]);
        res.json({ message: 'El producto ha sido eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//obtener producto por id
app.get('/menu/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM menu id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Ese producto no existe' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

