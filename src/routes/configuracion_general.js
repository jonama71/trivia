const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Agregar una nueva configuración**
router.post('/add', async (req, res) => {
    const { nombre_configuracion } = req.body;

    if (!nombre_configuracion) {
        return res.status(400).json({ error: 'Falta el nombre de la configuración' });
    }

    try {
        const newConfig = await pool.query(
            'INSERT INTO configuracion_general (nombre_configuracion) VALUES ($1) RETURNING *',
            [nombre_configuracion]
        );
        res.status(201).json(newConfig.rows[0]);
    } catch (err) {
        console.error('Error al agregar configuración:', err);
        res.status(500).json({ error: 'Error al agregar configuración' });
    }
});

// **Obtener todas las configuraciones**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM configuracion_general');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener configuraciones:', err);
        res.status(500).json({ error: 'Error al obtener configuraciones' });
    }
});

// **Obtener configuración por ID (mediante Body)**
router.get('/getById', async (req, res) => {
    const { id_configuracion } = req.body;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el ID de la configuración' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM configuracion_general WHERE id_configuracion = $1',
            [id_configuracion]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener configuración:', err);
        res.status(500).json({ error: 'Error al obtener configuración' });
    }
});

// **Actualizar una configuración**
router.put('/update', async (req, res) => {
    const { id_configuracion, nombre_configuracion } = req.body;

    if (!id_configuracion || !nombre_configuracion) {
        return res.status(400).json({ error: 'Faltan datos para actualizar' });
    }

    try {
        const updatedConfig = await pool.query(
            'UPDATE configuracion_general SET nombre_configuracion = $1 WHERE id_configuracion = $2 RETURNING *',
            [nombre_configuracion, id_configuracion]
        );

        if (updatedConfig.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        res.status(200).json(updatedConfig.rows[0]);
    } catch (err) {
        console.error('Error al actualizar configuración:', err);
        res.status(500).json({ error: 'Error al actualizar configuración' });
    }
});

// **Eliminar una configuración**
router.delete('/delete', async (req, res) => {
    const { id_configuracion } = req.body;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el ID de la configuración para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM configuracion_general WHERE id_configuracion = $1 RETURNING *',
            [id_configuracion]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración no encontrada' });
        }

        res.status(200).json({ message: 'Configuración eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar configuración:', err);
        res.status(500).json({ error: 'Error al eliminar configuración' });
    }
});

module.exports = router;
