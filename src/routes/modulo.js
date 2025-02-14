const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Crear un módulo**
router.post('/add', async (req, res) => {
    const { nombre_modulo } = req.body;

    if (!nombre_modulo) {
        return res.status(400).json({ error: 'Falta el nombre del módulo' });
    }

    try {
        const newModulo = await pool.query(
            'INSERT INTO modulo (nombre_modulo) VALUES ($1) RETURNING *',
            [nombre_modulo]
        );
        res.status(201).json(newModulo.rows[0]);
    } catch (err) {
        console.error('Error al crear el módulo:', err);
        res.status(500).json({ error: 'Error al crear el módulo' });
    }
});

// **Obtener todos los módulos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM modulo');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los módulos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener un módulo por ID desde el Body con GET**
router.get('/getById', async (req, res) => {
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ error: 'Falta el ID del módulo' });
    }

    try {
        const result = await pool.query('SELECT * FROM modulo WHERE id_modulo = $1', [id_modulo]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el módulo:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar un módulo**
router.put('/update', async (req, res) => {
    const { id_modulo, nombre_modulo } = req.body;

    if (!id_modulo || !nombre_modulo) {
        return res.status(400).json({ error: 'Faltan datos para actualizar el módulo' });
    }

    try {
        const updatedModulo = await pool.query(
            'UPDATE modulo SET nombre_modulo = $1 WHERE id_modulo = $2 RETURNING *',
            [nombre_modulo, id_modulo]
        );

        if (updatedModulo.rowCount === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }

        res.status(200).json(updatedModulo.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el módulo:', err);
        res.status(500).json({ error: 'Error al actualizar el módulo' });
    }
});

// **Eliminar un módulo desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_modulo } = req.body;

    if (!id_modulo) {
        return res.status(400).json({ error: 'Falta el ID del módulo para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM modulo WHERE id_modulo = $1 RETURNING *', [id_modulo]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
        }

        res.status(200).json({ message: 'Módulo eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el módulo:', err);
        res.status(500).json({ error: 'Error al eliminar el módulo' });
    }
});

module.exports = router;