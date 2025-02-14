const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();
const moment = require('moment-timezone');

// Configurar multer para manejar archivos de video
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // Límite de 100 MB por video
});

// **Agregar un video**
router.post('/add', upload.single('video'), async (req, res) => {
    const { id_configuracion_desa, nombre_video_desafio } = req.body;
    const file = req.file;

    if (!id_configuracion_desa || !nombre_video_desafio || !file) {
        return res.status(400).json({ error: 'Faltan datos o el video' });
    }

    try {
        // Subir video a Firebase y obtener la URL
        const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Guardar en PostgreSQL con fecha de subida (hora Ecuador)
        const fechaSubida = moment().tz("America/Guayaquil").format('YYYY-MM-DD HH:mm:ss');

        const newVideo = await pool.query(
            'INSERT INTO videos_desafio_mate (id_configuracion_desa, nombre_video_desafio, url_video_desafio, fecha_subida) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_configuracion_desa, nombre_video_desafio, videoUrl, fechaSubida]
        );

        res.status(201).json(newVideo.rows[0]);
    } catch (err) {
        console.error('Error al subir el video:', err);
        res.status(500).json({ error: 'Error al subir el video' });
    }
});

// **Obtener todos los videos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.id_video_desafio, c.nombre_configuracion, v.nombre_video_desafio, v.url_video_desafio, v.fecha_subida
            FROM videos_desafio_mate v
            JOIN configuracion_desafio_mate c ON v.id_configuracion_desa = c.id_configuracion_desa
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener videos:', err);
        res.status(500).json({ error: 'Error al obtener videos' });
    }
});

// **Obtener un video por ID (mediante Body)**
router.post('/getById', async (req, res) => {
    const { id_video_desafio } = req.body;

    if (!id_video_desafio) {
        return res.status(400).json({ error: 'Falta el ID del video' });
    }

    try {
        const result = await pool.query(`
            SELECT v.id_video_desafio, c.nombre_configuracion, v.nombre_video_desafio, v.url_video_desafio, v.fecha_subida
            FROM videos_desafio_mate v
            JOIN configuracion_desafio_mate c ON v.id_configuracion_desa = c.id_configuracion_desa
            WHERE v.id_video_desafio = $1
        `, [id_video_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener video:', err);
        res.status(500).json({ error: 'Error al obtener video' });
    }
});

// **Actualizar video (puede actualizar solo nombre o video)**
router.put('/update', upload.single('video'), async (req, res) => {
    const { id_video_desafio, nombre_video_desafio } = req.body;
    const file = req.file;

    if (!id_video_desafio) {
        return res.status(400).json({ error: 'Falta el ID del video para actualizar' });
    }

    try {
        let updateFields = [];
        let updateValues = [];
        let index = 1;

        if (nombre_video_desafio) {
            updateFields.push(`nombre_video_desafio = $${index++}`);
            updateValues.push(nombre_video_desafio);
        }

        if (file) {
            const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
            updateFields.push(`url_video_desafio = $${index++}`);
            updateValues.push(videoUrl);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
        }

        updateValues.push(id_video_desafio);

        const query = `UPDATE videos_desafio_mate SET ${updateFields.join(', ')} WHERE id_video_desafio = $${index} RETURNING *`;
        const updatedVideo = await pool.query(query, updateValues);

        res.status(200).json(updatedVideo.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el video:', err);
        res.status(500).json({ error: 'Error al actualizar el video' });
    }
});

// **Eliminar video**
router.delete('/delete', async (req, res) => {
    const { id_video_desafio } = req.body;

    if (!id_video_desafio) {
        return res.status(400).json({ error: 'Falta el ID del video para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM videos_desafio_mate WHERE id_video_desafio = $1 RETURNING *', [id_video_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json({ message: 'Video eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el video:', err);
        res.status(500).json({ error: 'Error al eliminar el video' });
    }
});

module.exports = router;
