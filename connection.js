require('dotenv').config(); // Cargar variables desde .env
const { Pool } = require('pg'); // Cliente PostgreSQL

// Configuración del pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Verificar conexión
pool.connect()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch((err) => console.error('Error al conectar a la base de datos:', err));

module.exports = pool; // Exportar el pool para usarlo en otros módulos
