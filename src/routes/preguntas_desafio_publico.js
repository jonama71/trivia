const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();
const path = require('path');

// Configurar multer para manejar imágenes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5 MB
});

// **Subir Múltiples Preguntas y Respuestas**
router.post('/add-batch', upload.fields([
    { name: 'preguntas', maxCount: 200 },
    { name: 'respuestas', maxCount: 200 }
]), async (req, res) => {
    const { id_configuracion_desa } = req.body;
    const preguntasFiles = req.files['preguntas'];
    const respuestasFiles = req.files['respuestas'];

    if (!id_configuracion_desa || !preguntasFiles || !respuestasFiles ||
        preguntasFiles.length !== respuestasFiles.length) {
        return res.status(400).json({ error: 'Faltan datos o la cantidad de archivos no coincide' });
    }

    try {
        let preguntasIds = [];

        for (let i = 0; i < preguntasFiles.length; i++) {
            // Generar identificador único basado en el índice
            const uniqueId = String(i + 1).padStart(3, '0'); // Ejemplo: 001, 002, 003...

            // Subir imagen de pregunta a Firebase
            const preguntaFileName = `pregunta_desa_${uniqueId}${path.extname(preguntasFiles[i].originalname)}`;
            const preguntaImgUrl = await uploadToFirebase(
                preguntasFiles[i].buffer, preguntaFileName, preguntasFiles[i].mimetype
            );

            // Insertar pregunta en PostgreSQL
            const newPregunta = await pool.query(
                'INSERT INTO preguntas_desafio_publico (id_configuracion_desa, url_img_pregunta) VALUES ($1, $2) RETURNING id_pregunta_desafio_publico',
                [id_configuracion_desa, preguntaImgUrl]
            );

            const preguntaId = newPregunta.rows[0].id_pregunta_desafio_publico;
            preguntasIds.push(preguntaId);

            // Subir imagen de respuesta correcta con el mismo identificador
            const respuestaFileName = `respuesta_desa_${uniqueId}${path.extname(respuestasFiles[i].originalname)}`;
            const respuestaImgUrl = await uploadToFirebase(
                respuestasFiles[i].buffer, respuestaFileName, respuestasFiles[i].mimetype
            );

            // Guardar respuesta correcta en PostgreSQL
            await pool.query(
                'UPDATE preguntas_desafio_publico SET respuesta_correcta_url = $1 WHERE id_pregunta_desafio_publico = $2',
                [respuestaImgUrl, preguntaId]
            );
        }

        res.status(201).json({ message: 'Subida exitosa', preguntasIds });
    } catch (err) {
        console.error('Error al subir preguntas y respuestas de desafío público:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// **Obtener todas las preguntas de desafío público**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.id_pregunta_desafio_publico, p.id_configuracion_desa, c.nombre_configuracion, p.url_img_pregunta, p.respuesta_correcta_url
            FROM preguntas_desafio_publico p
            JOIN configuracion_desafio_mate c ON p.id_configuracion_desa = c.id_configuracion_desa
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener preguntas de desafío público:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una pregunta de desafío público por ID (Desde el Body)**
router.post('/getById', async (req, res) => {
    const { id_pregunta_desafio_publico } = req.body;

    if (!id_pregunta_desafio_publico) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para obtener' });
    }

    try {
        const result = await pool.query(`
            SELECT p.id_pregunta_desafio_publico, p.id_configuracion_desa, c.nombre_configuracion, p.url_img_pregunta, p.respuesta_correcta_url
            FROM preguntas_desafio_publico p
            JOIN configuracion_desafio_mate c ON p.id_configuracion_desa = c.id_configuracion_desa
            WHERE p.id_pregunta_desafio_publico = $1
        `, [id_pregunta_desafio_publico]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la pregunta de desafío público:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una pregunta de desafío público**
router.put('/update', upload.fields([
    { name: 'url_img_pregunta', maxCount: 1 },
    { name: 'respuesta_correcta_url', maxCount: 1 }
]), async (req, res) => {
    const { id_pregunta_desafio_publico } = req.body;
    const preguntaFile = req.files['url_img_pregunta'] ? req.files['url_img_pregunta'][0] : null;
    const respuestaFile = req.files['respuesta_correcta_url'] ? req.files['respuesta_correcta_url'][0] : null;

    if (!id_pregunta_desafio_publico) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para actualizar' });
    }

    try {
        // Verificar si la pregunta existe
        const preguntaExists = await pool.query('SELECT * FROM preguntas_desafio_publico WHERE id_pregunta_desafio_publico = $1', [id_pregunta_desafio_publico]);

        if (preguntaExists.rowCount === 0) {
            return res.status(404).json({ error: 'La pregunta no existe' });
        }

        // Actualizar imagen de la pregunta (si se envió una nueva)
        if (preguntaFile) {
            const preguntaUrl = await uploadToFirebase(preguntaFile.buffer, preguntaFile.originalname, preguntaFile.mimetype);
            await pool.query('UPDATE preguntas_desafio_publico SET url_img_pregunta = $1 WHERE id_pregunta_desafio_publico = $2', [preguntaUrl, id_pregunta_desafio_publico]);
        }

        // Actualizar imagen de la respuesta correcta (si se envió una nueva)
        if (respuestaFile) {
            const respuestaUrl = await uploadToFirebase(respuestaFile.buffer, respuestaFile.originalname, respuestaFile.mimetype);
            await pool.query('UPDATE preguntas_desafio_publico SET respuesta_correcta_url = $1 WHERE id_pregunta_desafio_publico = $2', [respuestaUrl, id_pregunta_desafio_publico]);
        }

        res.status(200).json({ message: 'Actualización exitosa' });
    } catch (err) {
        console.error('Error al actualizar la pregunta de desafío público:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar una pregunta de desafío público**
router.delete('/delete', async (req, res) => {
    const { id_pregunta_desafio_publico } = req.body;

    if (!id_pregunta_desafio_publico) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM preguntas_desafio_publico WHERE id_pregunta_desafio_publico = $1 RETURNING *', [id_pregunta_desafio_publico]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.status(200).json({ message: 'Pregunta eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la pregunta de desafío público:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;