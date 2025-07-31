const { Client }= require('pg');


const db = new Client({
    host: 'postgres',
    user: 'postgres',
    password: 'postgres',
    database: 'proyecto_bar',
    port: 5432, 
});



db.connect((err) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err.message);
        return;
    }
    console.log('Conectado a la base de datos PostgreSQL');
});

module.exports = db;