const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar videos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50 MB
});

// 📌 **Crear un nuevo video de trivia comodín**
router.post('/add', upload.single('url_video_trivia_comodin'), async (req, res) => {
    const { id_configuracion, nombre_video_trivia_comodin } = req.body;
    const file = req.file;

    if (!id_configuracion || !nombre_video_trivia_comodin || !file) {
        return res.status(400).json({ error: 'Faltan datos o el video para subir' });
    }

    try {
        // Subir el video a Firebase y obtener la URL pública
        const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL con la fecha de subida
        const newVideo = await pool.query(
            'INSERT INTO videos_trivia_comodin (id_configuracion, nombre_video_trivia_comodin, url_video_trivia_comodin, fecha_subida) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [id_configuracion, nombre_video_trivia_comodin, videoUrl]
        );

        res.status(201).json(newVideo.rows[0]);
    } catch (err) {
        console.error('Error al subir el video de trivia comodín:', err);
        res.status(500).json({ error: 'Error al subir el video' });
    }
});

// 📌 **Obtener todos los videos de trivia comodín con nombre de configuración**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT vtc.id_video_trivia_comodin, 
                   ct.nombre_configuracion, 
                   vtc.nombre_video_trivia_comodin, 
                   vtc.url_video_trivia_comodin, 
                   vtc.fecha_subida
            FROM videos_trivia_comodin vtc
            JOIN configuracion_trivia ct ON vtc.id_configuracion = ct.id_configuracion
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los videos de trivia comodín:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 📌 **Obtener un video específico desde el Body usando el id_configuracion**
router.get('/getByConfig', async (req, res) => {
    const { id_configuracion } = req.body;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el ID de configuración' });
    }

    try {
        const result = await pool.query(`
            SELECT vtc.id_video_trivia_comodin, 
                   ct.nombre_configuracion, 
                   vtc.nombre_video_trivia_comodin, 
                   vtc.url_video_trivia_comodin, 
                   vtc.fecha_subida
            FROM videos_trivia_comodin vtc
            JOIN configuracion_trivia ct ON vtc.id_configuracion = ct.id_configuracion
            WHERE vtc.id_configuracion = $1
        `, [id_configuracion]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron videos para esta configuración' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los videos de trivia comodín:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 📌 **Actualizar un video de trivia comodín**
router.patch('/update', upload.single('url_video_trivia_comodin'), async (req, res) => {
    const { id_video_trivia_comodin, id_configuracion, nombre_video_trivia_comodin } = req.body;
    const file = req.file;

    if (!id_video_trivia_comodin) {
        return res.status(400).json({ error: 'Falta el ID del video para actualizar' });
    }

    try {
        // Verificar si el video existe
        const videoExist = await pool.query('SELECT * FROM videos_trivia_comodin WHERE id_video_trivia_comodin = $1', [id_video_trivia_comodin]);
        if (videoExist.rowCount === 0) {
            return res.status(404).json({ error: 'El video no existe' });
        }

        let updateFields = [];
        let values = [];

        if (id_configuracion) {
            updateFields.push('id_configuracion = $' + (values.length + 1));
            values.push(id_configuracion);
        }

        if (nombre_video_trivia_comodin) {
            updateFields.push('nombre_video_trivia_comodin = $' + (values.length + 1));
            values.push(nombre_video_trivia_comodin);
        }

        if (file) {
            const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
            updateFields.push('url_video_trivia_comodin = $' + (values.length + 1));
            values.push(videoUrl);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id_video_trivia_comodin);
        const query = `UPDATE videos_trivia_comodin SET ${updateFields.join(', ')} WHERE id_video_trivia_comodin = $${values.length} RETURNING *`;

        const updatedVideo = await pool.query(query, values);

        res.status(200).json(updatedVideo.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el video:', err);
        res.status(500).json({ error: 'Error al actualizar el video' });
    }
});

// 📌 **Eliminar un video de trivia comodín**
router.delete('/delete', async (req, res) => {
    const { id_video_trivia_comodin } = req.body;

    if (!id_video_trivia_comodin) {
        return res.status(400).json({ error: 'Falta el ID del video para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM videos_trivia_comodin WHERE id_video_trivia_comodin = $1 RETURNING *', [id_video_trivia_comodin]);
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
