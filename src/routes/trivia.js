const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Crear una trivia (id_modulo debe ser proporcionado en el Body)**
router.post('/add', async (req, res) => {
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ error: 'Falta el id_modulo' });
    }

    try {
        const newTrivia = await pool.query(
            'INSERT INTO trivia (id_modulo) VALUES ($1) RETURNING *',
            [id_modulo]
        );
        res.status(201).json(newTrivia.rows[0]);
    } catch (err) {
        console.error('Error al crear la trivia:', err);
        res.status(500).json({ error: 'Error al crear la trivia' });
    }
});

// **Obtener todas las trivias**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trivia');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las trivias:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener trivias por módulo desde el Body**
router.post('/getByModulo', async (req, res) => {
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ error: 'Falta el id_modulo' });
    }

    try {
        const result = await pool.query('SELECT * FROM trivia WHERE id_modulo = $1', [id_modulo]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron trivias para este módulo' });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener la trivia:', err);
        res.status(500).json({ error: 'Error al obtener la trivia' });
    }
});

// **Actualizar trivias cambiando el módulo**
router.patch('/update', async (req, res) => {
    const { id_trivia, id_modulo } = req.body;

    if (!id_trivia || !id_modulo) {
        return res.status(400).json({ error: 'Faltan datos para actualizar la trivia' });
    }

    try {
        const result = await pool.query(
            'UPDATE trivia SET id_modulo = $1 WHERE id_trivia = $2 RETURNING *',
            [id_modulo, id_trivia]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Trivia no encontrada' });
        }
        res.status(200).json({ message: 'Trivia actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la trivia:', err);
        res.status(500).json({ error: 'Error al actualizar la trivia' });
    }
});

// **Eliminar trivias por módulo desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ error: 'Falta el id_modulo para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM trivia WHERE id_modulo = $1 RETURNING *', [id_modulo]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron trivias para este módulo' });
        }
        res.status(200).json({ message: 'Trivias eliminadas correctamente' });
    } catch (err) {
        console.error('Error al eliminar las trivias:', err);
        res.status(500).json({ error: 'Error al eliminar las trivias' });
    }
});

module.exports = router;
