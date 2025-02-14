const express = require('express');
const pool = require('../../connection');
const router = express.Router();

// **Agregar una nueva configuración de desafío matemático**
router.post('/add', async (req, res) => {
    const { id_desafio, nombre_configuracion } = req.body;

    if (!id_desafio || !nombre_configuracion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        // Verificar si el id_desafio existe en la tabla desafio_matematico
        const desafioExist = await pool.query('SELECT id_desafio FROM desafio_matematico WHERE id_desafio = $1', [id_desafio]);

        if (desafioExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_desafio no existe en la tabla desafio_matematico' });
        }

        const newConfig = await pool.query(
            `INSERT INTO configuracion_desafio_mate (id_desafio, nombre_configuracion) 
            VALUES ($1, $2) RETURNING *`,
            [id_desafio, nombre_configuracion]
        );

        res.status(201).json(newConfig.rows[0]);
    } catch (err) {
        console.error('Error al agregar la configuración del desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todas las configuraciones de desafíos matemáticos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.id_configuracion_desa, c.id_desafio, d.intro_video_url, d.banner_url, c.nombre_configuracion
            FROM configuracion_desafio_mate c
            JOIN desafio_matematico d ON c.id_desafio = d.id_desafio
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener configuraciones de desafíos matemáticos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una configuración de desafío por ID (Desde el Body)**
router.post('/getById', async (req, res) => {
    const { id_configuracion_desa } = req.body;

    if (!id_configuracion_desa) {
        return res.status(400).json({ error: 'Falta el ID de la configuración del desafío' });
    }

    try {
        const result = await pool.query(`
            SELECT c.id_configuracion_desa, c.id_desafio, d.intro_video_url, d.banner_url, c.nombre_configuracion
            FROM configuracion_desafio_mate c
            JOIN desafio_matematico d ON c.id_desafio = d.id_desafio
            WHERE c.id_configuracion_desa = $1
        `, [id_configuracion_desa]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración del desafío no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la configuración del desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una configuración de desafío matemático**
router.put('/update', async (req, res) => {
    const { id_configuracion_desa, nombre_configuracion } = req.body;

    if (!id_configuracion_desa || !nombre_configuracion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar' });
    }

    try {
        const configExist = await pool.query('SELECT * FROM configuracion_desafio_mate WHERE id_configuracion_desa = $1', [id_configuracion_desa]);

        if (configExist.rowCount === 0) {
            return res.status(404).json({ error: 'La configuración del desafío matemático no existe' });
        }

        await pool.query(
            `UPDATE configuracion_desafio_mate 
            SET nombre_configuracion = $1
            WHERE id_configuracion_desa = $2`,
            [nombre_configuracion, id_configuracion_desa]
        );

        res.status(200).json({ message: 'Configuración del desafío matemático actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar la configuración del desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar una configuración de desafío matemático**
router.delete('/delete', async (req, res) => {
    const { id_configuracion_desa } = req.body;

    if (!id_configuracion_desa) {
        return res.status(400).json({ error: 'Falta el ID de la configuración del desafío para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM configuracion_desafio_mate WHERE id_configuracion_desa = $1 RETURNING *', [id_configuracion_desa]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Configuración del desafío no encontrada' });
        }

        res.status(200).json({ message: 'Configuración del desafío matemático eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la configuración del desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
