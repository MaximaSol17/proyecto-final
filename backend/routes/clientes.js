const express = require('express');
const router = express.Router();
const db = require('../db');

//Empiezo con el ENDOPINT REGISTRO
router.post('/registro', async (req,res) => {
    const {nombre, apellido, email, edad, telefono, contraseña } = req.body;
    const sql = 
     `INSERT INTO clientes (nombre, apellido, email, edad, telefono, contraseña)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; `
    ;


    db.query(sql, [nombre, apellido, email, edad, telefono, contraseña], (err, result) => {
        
        if(err){
            res.status(500).json({ error: err.message });
        }else {

            res.status(201).json(result.rows[0]);
        }
    });
 
});


//ENDPOINT LOGIN

router.post('/login', async (req, res) => {
    const {email, contraseña } = req.body;
    const sql =  `
    SELECT * FROM clientes 
    WHERE email = $1 AND contraseña = $2
    LIMIT 1; `;
  ;
  db.query(sql,[email, contraseña], (err,result) => {
    if(err) {
        return res.status(500).json({ error: err.message });
    }
        
    if(result.rows.length === 0 ){
        return res.status(401).json({error: 'Email o contraseña incorrectos'});
    }

    //si el login fue exitoso
    const cliente = result.rows[0];
    res.status(200).json(cliente);

  });

});

//metodo get

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM clientes';

    db.query(sql, (err,result) => {
        if(err){
            return res.status(500).json({error: err.message });
        }
        res.status(200).json(result.rows);
    });
});



//para obtener un cliente por id

router.get('/:id',(req,res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM clientes WHERE id = $1';

    db.query(sql, [id], (err, result) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        if(result.rows.length === 0) {
            return res.status(404).json({error: 'cliente no encontrado'});
        }
        res.status(200).json(result.rows[0]);
    });

});


//Para editar un cliente existente

router.put('/:id', (req,res) => {
    const { id } = req.params;
    const {nombre, apellido, email, edad, telefono, contraseña} = req.body;
    const sql = `
    UPDATE clientes
    SET nombre = $1, apellido = $2, email = $3, edad = $4, telefono = $5, contraseña = $6
    WHERE id = $7
    RETURNING *;
    `;

    db.query(sql, [nombre, apellido, email, edad, telefono, contraseña, id], (err,result) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        if(result.rows.length === 0) {
            return res.status(404).json({error: 'cliente no encontrado'});
        }
        res.status(200).json(result.rows[0]);
        
    });
   
});

//Para eliminat clientes

router.delete('/:id', (req,res) => {
    const { id } = req.params;
    const sql = 'DELETE  FROM clientes WHERE id = $1 RETURNING * ';
    db.query(sql, [id], (err,result) => {
        if (err) {
            return res.status(500).json({error: err.message});

        }
        if(result.rows.length === 0) {
            return res.status(404).json({error: 'cliente no encontrado'});
        }
        res.status(200).json({mensaje: 'Cliente eliminado con exito', cliente : result.rows[0]});
    });
    
});

module.exports = router;