const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar archivos de video
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50 MB
});

// **Crear un video para trivia**
router.post('/add', upload.single('url_video_trivia'), async (req, res) => {
    const { id_configuracion, nombre_video_trivia } = req.body;
    const file = req.file;

    if (!id_configuracion || !nombre_video_trivia || !file) {
        return res.status(400).json({ error: 'Faltan datos o el archivo de video' });
    }

    try {
        // Subir el video a Firebase y obtener la URL pública
        const videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Obtener la fecha y ajustar a UTC -5 (Ecuador)
        const now = new Date();
        now.setHours(now.getHours() - 5); // Ajustar manualmente la hora a Ecuador
        const fechaSubida = now.toISOString().slice(0, 19).replace("T", " "); // Convertir a formato 'YYYY-MM-DD HH:MM:SS'

        // Insertar en PostgreSQL
        const newVideo = await pool.query(
            `INSERT INTO videos_trivia (id_configuracion, nombre_video_trivia, url_video_trivia, fecha_subida) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_configuracion, nombre_video_trivia, videoUrl, fechaSubida]
        );

        res.status(201).json(newVideo.rows[0]);
    } catch (err) {
        console.error('Error al subir el video de trivia:', err);
        res.status(500).json({ error: 'Error interno al subir el video' });
    }
});

router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT vt.id_video_trivia, 
                   vt.id_configuracion, 
                   ct.nombre_configuracion, 
                   vt.nombre_video_trivia, 
                   vt.url_video_trivia, 
                   vt.fecha_subida
            FROM videos_trivia vt
            JOIN configuracion_trivia ct ON vt.id_configuracion = ct.id_configuracion
        `);
        
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los videos de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.get('/getById', async (req, res) => {
    const { id_video_trivia } = req.body;

    if (!id_video_trivia) {
        return res.status(400).json({ error: 'Falta el ID del video de trivia' });
    }

    try {
        const result = await pool.query(`
            SELECT vt.id_video_trivia, 
                   vt.id_configuracion, 
                   ct.nombre_configuracion, 
                   vt.nombre_video_trivia, 
                   vt.url_video_trivia, 
                   vt.fecha_subida
            FROM videos_trivia vt
            JOIN configuracion_trivia ct ON vt.id_configuracion = ct.id_configuracion
            WHERE vt.id_video_trivia = $1
        `, [id_video_trivia]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video de trivia no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el video de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar un video trivia**
router.patch('/update', upload.single('url_video_trivia'), async (req, res) => {
    const { id_video_trivia, id_configuracion, nombre_video_trivia } = req.body;
    const file = req.file;

    if (!id_video_trivia) {
        return res.status(400).json({ error: 'Falta el ID del video para actualizar' });
    }

    try {
        let videoUrl = null;
        if (file) {
            // Subir el nuevo video si se proporciona
            videoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // Construir la consulta dinámica para actualizar solo los campos enviados
        const fieldsToUpdate = [];
        const values = [];

        if (id_configuracion) {
            fieldsToUpdate.push('id_configuracion = $' + (values.length + 1));
            values.push(id_configuracion);
        }

        if (nombre_video_trivia) {
            fieldsToUpdate.push('nombre_video_trivia = $' + (values.length + 1));
            values.push(nombre_video_trivia);
        }

        if (videoUrl) {
            fieldsToUpdate.push('url_video_trivia = $' + (values.length + 1));
            values.push(videoUrl);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }

        values.push(id_video_trivia);
        const query = `UPDATE videos_trivia SET ${fieldsToUpdate.join(', ')} WHERE id_video_trivia = $${values.length} RETURNING *`;

        const updatedVideo = await pool.query(query, values);
        res.status(200).json(updatedVideo.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el video de trivia:', err);
        res.status(500).json({ error: 'Error interno al actualizar el video' });
    }
});

// **Eliminar un video trivia**
router.delete('/delete', async (req, res) => {
    const { id_video_trivia } = req.body;

    if (!id_video_trivia) {
        return res.status(400).json({ error: 'Falta el ID del video para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM videos_trivia WHERE id_video_trivia = $1 RETURNING *', [id_video_trivia]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        res.status(200).json({ message: 'Video eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el video de trivia:', err);
        res.status(500).json({ error: 'Error interno al eliminar el video' });
    }
});

module.exports = router;
