const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Agregar una nueva ruleta**
router.post('/add', async (req, res) => {
    const { id_configuracion, tipo_ruleta, tiempo } = req.body;

    if (!id_configuracion || !tipo_ruleta || tiempo === undefined) {
        return res.status(400).json({ error: 'Faltan datos para agregar la ruleta' });
    }

    // Convertir segundos a formato HH:MM:SS
    const tiempoFormato = new Date(tiempo * 1000).toISOString().substr(11, 8); // Convierte segundos a "HH:MM:SS"

    try {
        // Verificar si el id_configuracion existe
        const configExists = await pool.query('SELECT id_configuracion FROM configuracion_trivia WHERE id_configuracion = $1', [id_configuracion]);
        if (configExists.rowCount === 0) {
            return res.status(400).json({ error: 'El id_configuracion no existe en la tabla configuracion_trivia' });
        }

        // Insertar la ruleta
        const newRuleta = await pool.query(
            'INSERT INTO ruletas (id_configuracion, tipo_ruleta, tiempo) VALUES ($1, $2, $3) RETURNING *',
            [id_configuracion, tipo_ruleta, tiempoFormato]
        );

        res.status(201).json(newRuleta.rows[0]);
    } catch (err) {
        console.error('Error al agregar la ruleta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// **Obtener todas las ruletas con el nombre de la configuración**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id_ruletas, c.nombre_configuracion, r.tipo_ruleta, r.tiempo
            FROM ruletas r
            JOIN configuracion_trivia c ON r.id_configuracion = c.id_configuracion
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener ruletas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una ruleta por ID mediante Body**
router.get('/getById', async (req, res) => {
    const { id_ruletas } = req.body;

    if (!id_ruletas) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta para buscar' });
    }

    try {
        const result = await pool.query(`
            SELECT 
                r.id_ruletas, 
                c.nombre_configuracion AS configuracion, 
                r.tipo_ruleta, 
                r.tiempo 
            FROM ruletas r
            INNER JOIN configuracion_trivia c ON r.id_configuracion = c.id_configuracion
            WHERE r.id_ruletas = $1
        `, [id_ruletas]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ruleta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la ruleta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una ruleta (tipo y/o tiempo)**
router.put('/update', async (req, res) => {
    const { id_ruletas, tipo_ruleta, tiempo } = req.body;

    if (!id_ruletas) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta para actualizar' });
    }

    try {
        // Verificar si la ruleta existe
        const ruletaExists = await pool.query('SELECT id_ruletas FROM ruletas WHERE id_ruletas = $1', [id_ruletas]);
        if (ruletaExists.rowCount === 0) {
            return res.status(404).json({ error: 'La ruleta no existe' });
        }

        // Convertir segundos a formato TIME si se proporciona un nuevo tiempo
        let tiempoFormato = null;
        if (tiempo !== undefined) {
            tiempoFormato = new Date(tiempo * 1000).toISOString().substr(11, 8);
        }

        // Construir la consulta de actualización dinámicamente
        let updateFields = [];
        let values = [];
        let paramIndex = 1;

        if (tipo_ruleta) {
            updateFields.push(`tipo_ruleta = $${paramIndex++}`);
            values.push(tipo_ruleta);
        }

        if (tiempoFormato) {
            updateFields.push(`tiempo = $${paramIndex++}`);
            values.push(tiempoFormato);
        }

        values.push(id_ruletas);

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
        }

        const updateQuery = `UPDATE ruletas SET ${updateFields.join(', ')} WHERE id_ruletas = $${paramIndex}`;
        await pool.query(updateQuery, values);

        res.status(200).json({ message: 'Ruleta actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la ruleta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// **Eliminar una ruleta por ID**
router.delete('/delete', async (req, res) => {
    const { id_ruletas } = req.body;

    if (!id_ruletas) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM ruletas WHERE id_ruletas = $1 RETURNING *', [id_ruletas]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ruleta no encontrada' });
        }

        res.status(200).json({ message: 'Ruleta eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la ruleta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
