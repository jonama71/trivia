const pool = require('./connection'); // Conexión a PostgreSQL

/**
 * Obtiene todos los datos de una tabla.
 * @param {string} tableName - Nombre de la tabla.
 * @returns {Promise<Array>} - Lista de filas obtenidas.
 */
const getAllData = async (tableName) => {
    try {
        const query = `SELECT * FROM ${tableName}`;
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(`Error al obtener datos de ${tableName}:`, err);
        throw err;
    }
};

/**
 * Inserta datos en una tabla.
 * @param {string} tableName - Nombre de la tabla.
 * @param {Array} columns - Columnas donde se insertarán los datos.
 * @param {Array} values - Valores a insertar.
 * @returns {Promise<Object>} - Fila insertada.
 */
const insertData = async (tableName, columns, values) => {
    try {
        const query = `
            INSERT INTO ${tableName} (${columns.join(', ')})
            VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})
            RETURNING *`;
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error(`Error al insertar datos en ${tableName}:`, err);
        throw err;
    }
};

module.exports = { getAllData, insertData };
