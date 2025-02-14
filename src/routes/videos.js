const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// ✅ Configurar multer para manejar videos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 🔹 Límite de 100MB
});

// **Agregar o Actualizar un video en la Base de Datos**
router.post('/add', upload.single('video'), async (req, res) => {
    const { nombre_video } = req.body;
    const file = req.file;
    const id_configuracion = 4; // ✅ Siempre usa id_configuracion = 4

    if (!nombre_video || !file) {
        return res.status(400).json({ error: 'Faltan datos o el video para subir' });
    }

    try {
        // Subir video a Firebase
        const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // **Verificar si ya existe un video con el mismo nombre**
        const existingVideo = await pool.query(
            'SELECT * FROM videos WHERE nombre_video = $1',
            [nombre_video]
        );

        if (existingVideo.rowCount > 0) {
            // **Si ya existe, actualizar el URL del video**
            await pool.query(
                'UPDATE videos SET url_video = $1, fecha_subida = NOW() WHERE nombre_video = $2',
                [videoUrl, nombre_video]
            );
            res.status(200).json({ message: '✅ Video actualizado correctamente', url_video: videoUrl });
        } else {
            // **Si no existe, insertarlo en la base de datos**
            const newVideo = await pool.query(
                'INSERT INTO videos (id_configuracion, nombre_video, url_video) VALUES ($1, $2, $3) RETURNING *',
                [id_configuracion, nombre_video, videoUrl]
            );
            res.status(201).json(newVideo.rows[0]);
        }
    } catch (err) {
        console.error('Error al subir video:', err);
        res.status(500).json({ error: 'Error al subir video' });
    }
});

module.exports = router;

// **✅ Obtener todos los videos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.id_video, c.nombre_configuracion, v.nombre_video, v.url_video, v.fecha_subida
            FROM videos v
            JOIN configuracion_general c ON v.id_configuracion = c.id_configuracion
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('❌ Error al obtener videos:', err);
        res.status(500).json({ error: 'Error al obtener videos' });
    }
});

// **✅ Obtener un video por ID (enviando el ID por Body)**
router.post('/getById', async (req, res) => {
    const { id_video } = req.body;

    if (!id_video) {
        return res.status(400).json({ error: 'Falta el ID del video' });
    }

    try {
        const result = await pool.query(`
            SELECT v.id_video, c.nombre_configuracion, v.nombre_video, v.url_video, v.fecha_subida
            FROM videos v
            JOIN configuracion_general c ON v.id_configuracion = c.id_configuracion
            WHERE v.id_video = $1
        `, [id_video]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error al obtener video:', err);
        res.status(500).json({ error: 'Error al obtener video' });
    }
});

// **✅ Actualizar un video (Opcionalmente se sube un nuevo video)**
router.put('/update', upload.single('video'), async (req, res) => {
    const { id_video, nombre_video } = req.body;
    const file = req.file;
    let videoUrl = null;

    if (!id_video || !nombre_video) {
        return res.status(400).json({ error: 'Faltan datos para actualizar el video' });
    }

    try {
        // 🔹 Si hay un nuevo archivo, subirlo a Firebase
        if (file) {
            videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // 🔹 Actualizar video en PostgreSQL
        const updateVideo = await pool.query(
            'UPDATE videos SET nombre_video = $1, url_video = COALESCE($2, url_video) WHERE id_video = $3 RETURNING *',
            [nombre_video, videoUrl, id_video]
        );

        if (updateVideo.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json(updateVideo.rows[0]);
    } catch (err) {
        console.error('❌ Error al actualizar video:', err);
        res.status(500).json({ error: 'Error al actualizar video' });
    }
});

// **✅ Eliminar un video**
router.delete('/delete', async (req, res) => {
    const { id_video } = req.body;

    if (!id_video) {
        return res.status(400).json({ error: 'Falta el ID del video para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM videos WHERE id_video = $1 RETURNING *',
            [id_video]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json({ message: '✅ Video eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar video:', err);
        res.status(500).json({ error: 'Error al eliminar video' });
    }
});

module.exports = router;
