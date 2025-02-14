const express = require('express');
const pool = require('../../connection');
const router = express.Router();

/** 📌 **Agregar una nueva relación entre ruleta y área** */
router.post('/add', async (req, res) => {
    const { id_ruletas, id_area } = req.body;

    if (!id_ruletas || !id_area) {
        return res.status(400).json({ error: 'Faltan datos para agregar la relación' });
    }

    try {
        // Verificar si la ruleta existe
        const ruletaExist = await pool.query('SELECT id_ruletas FROM ruletas WHERE id_ruletas = $1', [id_ruletas]);
        if (ruletaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El ID de la ruleta no existe' });
        }

        // Verificar si el área existe
        const areaExist = await pool.query('SELECT id_area FROM areas WHERE id_area = $1', [id_area]);
        if (areaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El ID del área no existe' });
        }

        // Insertar la relación en la base de datos
        const newRelacion = await pool.query(
            'INSERT INTO ruleta_areas_detalles (id_ruletas, id_area) VALUES ($1, $2) RETURNING *',
            [id_ruletas, id_area]
        );

        res.status(201).json(newRelacion.rows[0]);
    } catch (err) {
        console.error('Error al agregar la relación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Obtener una relación por ID (`id_ruleta_areas_detalles`)** */
router.get('/getById', async (req, res) => {
    const { id_ruleta_areas_detalles } = req.body;

    if (!id_ruleta_areas_detalles) {
        return res.status(400).json({ error: 'Falta el ID de la relación para buscar' });
    }

    try {
        const result = await pool.query(
            `SELECT r.id_ruleta_areas_detalles, r.id_ruletas, ru.tipo_ruleta, r.id_area, a.nombre_area 
             FROM ruleta_areas_detalles r
             JOIN ruletas ru ON r.id_ruletas = ru.id_ruletas
             JOIN areas a ON r.id_area = a.id_area
             WHERE r.id_ruleta_areas_detalles = $1`,
            [id_ruleta_areas_detalles]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la relación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Actualizar la relación entre ruleta y área** */
router.put('/update', async (req, res) => {
    const { id_ruleta_areas_detalles, id_ruletas, id_area } = req.body;

    if (!id_ruleta_areas_detalles || !id_ruletas || !id_area) {
        return res.status(400).json({ error: 'Faltan datos para actualizar la relación' });
    }

    try {
        // Verificar si la relación existe
        const relacionExist = await pool.query(
            'SELECT id_ruleta_areas_detalles FROM ruleta_areas_detalles WHERE id_ruleta_areas_detalles = $1',
            [id_ruleta_areas_detalles]
        );

        if (relacionExist.rowCount === 0) {
            return res.status(404).json({ error: 'La relación no existe' });
        }

        // Actualizar la relación
        await pool.query(
            'UPDATE ruleta_areas_detalles SET id_ruletas = $1, id_area = $2 WHERE id_ruleta_areas_detalles = $3',
            [id_ruletas, id_area, id_ruleta_areas_detalles]
        );

        res.status(200).json({ message: 'Relación actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la relación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Eliminar una relación entre ruleta y área** */
router.delete('/delete', async (req, res) => {
    const { id_ruleta_areas_detalles } = req.body;

    if (!id_ruleta_areas_detalles) {
        return res.status(400).json({ error: 'Falta el ID de la relación para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM ruleta_areas_detalles WHERE id_ruleta_areas_detalles = $1 RETURNING *',
            [id_ruleta_areas_detalles]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'La relación no existe' });
        }

        res.status(200).json({ message: 'Relación eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la relación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
