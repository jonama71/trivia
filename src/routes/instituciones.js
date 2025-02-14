const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Crear una institución**
router.post('/add', async (req, res) => {
    const { nombre_institucion } = req.body;

    if (!nombre_institucion) {
        return res.status(400).json({ error: 'Falta el nombre de la institución' });
    }

    try {
        const newInstitucion = await pool.query(
            'INSERT INTO instituciones (nombre_institucion) VALUES ($1) RETURNING *',
            [nombre_institucion]
        );
        res.status(201).json(newInstitucion.rows[0]);
    } catch (err) {
        console.error('Error al crear la institución:', err);
        res.status(500).json({ error: 'Error al crear la institución' });
    }
});

// **Obtener todas las instituciones**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM instituciones');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las instituciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una institución por ID desde el Body con GET**
router.get('/getById', async (req, res) => {
    const { id_institucion } = req.body;

    if (!id_institucion) {
        return res.status(400).json({ error: 'Falta el ID de la institución' });
    }

    try {
        const result = await pool.query('SELECT * FROM instituciones WHERE id_institucion = $1', [id_institucion]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la institución:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una institución**
router.put('/update', async (req, res) => {
    const { id_institucion, nombre_institucion } = req.body;

    if (!id_institucion || !nombre_institucion) {
        return res.status(400).json({ error: 'Faltan datos para actualizar la institución' });
    }

    try {
        const updatedInstitucion = await pool.query(
            'UPDATE instituciones SET nombre_institucion = $1 WHERE id_institucion = $2 RETURNING *',
            [nombre_institucion, id_institucion]
        );

        if (updatedInstitucion.rowCount === 0) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }

        res.status(200).json(updatedInstitucion.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la institución:', err);
        res.status(500).json({ error: 'Error al actualizar la institución' });
    }
});

// **Eliminar una institución desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_institucion } = req.body;

    if (!id_institucion) {
        return res.status(400).json({ error: 'Falta el ID de la institución para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM instituciones WHERE id_institucion = $1 RETURNING *', [id_institucion]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Institución no encontrada' });
        }

        res.status(200).json({ message: 'Institución eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la institución:', err);
        res.status(500).json({ error: 'Error al eliminar la institución' });
    }
});

module.exports = router;
