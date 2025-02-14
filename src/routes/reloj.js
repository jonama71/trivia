const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Agregar un nuevo reloj en formato HH:MM:SS**
router.post('/add', async (req, res) => {
    const { id_configuracion, tiempo } = req.body;

    if (!id_configuracion || !tiempo) {
        return res.status(400).json({ error: 'Faltan datos para crear el reloj' });
    }

    try {
        // 🔹 Guardamos el tiempo en formato `HH:MM:SS`
        const formattedTime = `${tiempo}`;

        const newReloj = await pool.query(
            'INSERT INTO reloj (id_configuracion, tiempo) VALUES ($1, $2) RETURNING *',
            [id_configuracion, formattedTime]
        );

        res.status(201).json(newReloj.rows[0]);
    } catch (err) {
        console.error('Error al agregar reloj:', err);
        res.status(500).json({ error: 'Error al agregar reloj' });
    }
});

// **Obtener el ÚLTIMO reloj guardado con tiempo en formato HH:MM:SS**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id_reloj, c.nombre_configuracion, 
            TO_CHAR(r.tiempo, 'HH24:MI:SS') AS tiempo
            FROM reloj r
            JOIN configuracion_general c ON r.id_configuracion = c.id_configuracion
            WHERE c.nombre_configuracion = 'configurar_reloj_espera'
            ORDER BY r.id_reloj DESC
            LIMIT 1;  -- 🔹 Solo devuelve el último registro guardado
        `);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No hay relojes guardados' });
        }

        res.status(200).json(result.rows[0]); // 🔹 Enviar solo el último registro
    } catch (err) {
        console.error('Error al obtener reloj:', err);
        res.status(500).json({ error: 'Error al obtener reloj' });
    }
});

// **Obtener un reloj por ID con formato HH:MM:SS**
router.get('/getById', async (req, res) => {
    const { id_reloj } = req.body;

    if (!id_reloj) {
        return res.status(400).json({ error: 'Falta el ID del reloj' });
    }

    try {
        const result = await pool.query(`
            SELECT r.id_reloj, c.nombre_configuracion, 
            TO_CHAR(r.tiempo, 'HH24:MI:SS') AS tiempo
            FROM reloj r
            JOIN configuracion_general c ON r.id_configuracion = c.id_configuracion
            WHERE r.id_reloj = $1
        `, [id_reloj]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Reloj no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener reloj:', err);
        res.status(500).json({ error: 'Error al obtener reloj' });
    }
});

// **Actualizar un reloj**
router.put('/update', async (req, res) => {
    const { id_reloj, id_configuracion, tiempo } = req.body;

    if (!id_reloj || !id_configuracion || !tiempo) {
        return res.status(400).json({ error: 'Faltan datos para actualizar' });
    }

    try {
        const formattedTime = `${tiempo}`; // Mantiene el formato HH:MM:SS

        const updatedReloj = await pool.query(
            'UPDATE reloj SET id_configuracion = $1, tiempo = $2 WHERE id_reloj = $3 RETURNING *',
            [id_configuracion, formattedTime, id_reloj]
        );

        if (updatedReloj.rowCount === 0) {
            return res.status(404).json({ error: 'Reloj no encontrado' });
        }

        res.status(200).json(updatedReloj.rows[0]);
    } catch (err) {
        console.error('Error al actualizar reloj:', err);
        res.status(500).json({ error: 'Error al actualizar reloj' });
    }
});

// **Eliminar un reloj**
router.delete('/delete', async (req, res) => {
    const { id_reloj } = req.body;

    if (!id_reloj) {
        return res.status(400).json({ error: 'Falta el ID del reloj para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM reloj WHERE id_reloj = $1 RETURNING *',
            [id_reloj]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Reloj no encontrado' });
        }

        res.status(200).json({ message: 'Reloj eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar reloj:', err);
        res.status(500).json({ error: 'Error al eliminar reloj' });
    }
});

module.exports = router;
