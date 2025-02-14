const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Crear un sorteo con id_modulo fijo en 3**
router.post('/add', async (req, res) => {
    try {
        const newSorteo = await pool.query(
            'INSERT INTO sorteos (id_modulo) VALUES ($1) RETURNING *',
            [3] // id_modulo siempre será 3
        );
        res.status(201).json(newSorteo.rows[0]);
    } catch (err) {
        console.error('Error al crear el sorteo:', err);
        res.status(500).json({ error: 'Error al crear el sorteo' });
    }
});

// **Obtener todos los sorteos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sorteos');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los sorteos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener un sorteo por ID desde el Body con GET**
router.get('/getById', async (req, res) => {
    const { id_sorteos } = req.body;

    if (!id_sorteos) {
        return res.status(400).json({ error: 'Falta el ID del sorteo' });
    }

    try {
        const result = await pool.query('SELECT * FROM sorteos WHERE id_sorteos = $1', [id_sorteos]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el sorteo:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar un sorteo desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_sorteos } = req.body;

    if (!id_sorteos) {
        return res.status(400).json({ error: 'Falta el ID del sorteo para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM sorteos WHERE id_sorteos = $1 RETURNING *', [id_sorteos]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Sorteo no encontrado' });
        }

        res.status(200).json({ message: 'Sorteo eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el sorteo:', err);
        res.status(500).json({ error: 'Error al eliminar el sorteo' });
    }
});

module.exports = router;
