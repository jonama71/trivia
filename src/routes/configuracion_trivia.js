const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Crear una configuración de trivia**
router.post('/add', async (req, res) => {
    const { id_trivia, nombre_configuracion } = req.body;

    if (!id_trivia || !nombre_configuracion) {
        return res.status(400).json({ error: 'Faltan datos para crear la configuración de trivia' });
    }

    try {
        // Verificar si el id_trivia existe en la tabla trivia
        const triviaExist = await pool.query('SELECT id_trivia FROM trivia WHERE id_trivia = $1', [id_trivia]);
        if (triviaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_trivia no existe en la tabla trivia' });
        }

        const newConfig = await pool.query(
            'INSERT INTO configuracion_trivia (id_trivia, nombre_configuracion) VALUES ($1, $2) RETURNING *',
            [id_trivia, nombre_configuracion]
        );
        res.status(201).json(newConfig.rows[0]);
    } catch (err) {
        console.error('Error al crear la configuración de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todas las configuraciones de trivia**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM configuracion_trivia');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las configuraciones de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener configuraciones por `id_trivia` desde el Body**
router.post('/getByTrivia', async (req, res) => {
    const { id_trivia } = req.body;

    if (!id_trivia) {
        return res.status(400).json({ error: 'Falta el id_trivia' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM configuracion_trivia WHERE id_trivia = $1',
            [id_trivia]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron configuraciones para esta trivia' });
        }
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener configuraciones de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una configuración de trivia**
router.patch('/update', async (req, res) => {
    const { id_configuracion, nombre_configuracion } = req.body;

    if (!id_configuracion || !nombre_configuracion) {
        return res.status(400).json({ error: 'Faltan datos para actualizar la configuración' });
    }

    try {
        const result = await pool.query(
            'UPDATE configuracion_trivia SET nombre_configuracion = $1 WHERE id_configuracion = $2 RETURNING *',
            [nombre_configuracion, id_configuracion]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }
        res.status(200).json({ message: 'Configuración actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la configuración de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar una configuración de trivia por `id_configuracion` desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_configuracion } = req.body;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el id_configuracion para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM configuracion_trivia WHERE id_configuracion = $1 RETURNING *',
            [id_configuracion]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración de trivia no encontrada' });
        }
        res.status(200).json({ message: 'Configuración eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la configuración de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
