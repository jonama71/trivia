const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();
const path = require('path');

// Configurar multer para manejar archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10 MB por imagen
});

// **Subir hasta 200 Preguntas con Respuestas Correctas**
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

            // Subir imagen de pregunta con nombre estructurado
            const preguntaFileName = `pregunta_${uniqueId}${path.extname(preguntasFiles[i].originalname)}`;
            const preguntaImgUrl = await uploadToFirebase(
                preguntasFiles[i].buffer, preguntaFileName, preguntasFiles[i].mimetype
            );

            // Guardar pregunta en PostgreSQL
            const newPregunta = await pool.query(
                'INSERT INTO preguntas_desafio (id_configuracion_desa, url_img_pregunta) VALUES ($1, $2) RETURNING id_pregunta_desafio',
                [id_configuracion_desa, preguntaImgUrl]
            );

            const preguntaId = newPregunta.rows[0].id_pregunta_desafio;
            preguntasIds.push(preguntaId);

            // Subir imagen de respuesta con el mismo identificador
            const respuestaFileName = `respuesta_${uniqueId}${path.extname(respuestasFiles[i].originalname)}`;
            const respuestaImgUrl = await uploadToFirebase(
                respuestasFiles[i].buffer, respuestaFileName, respuestasFiles[i].mimetype
            );

            // Guardar respuesta en PostgreSQL
            await pool.query(
                'UPDATE preguntas_desafio SET respuesta_correcta_url = $1 WHERE id_pregunta_desafio = $2',
                [respuestaImgUrl, preguntaId]
            );
        }

        res.status(201).json({ message: 'Subida exitosa', preguntasIds });
    } catch (err) {
        console.error('Error al subir preguntas y respuestas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
