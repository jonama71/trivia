const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// **Configurar Multer para subir hasta 200 archivos**
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5 MB por archivo
});

// **Subir Preguntas, Respuestas y Explicaciones con Límite Flexible (hasta 200)**
router.post('/add-batch', upload.fields([
    { name: 'preguntas', maxCount: 200 },
    { name: 'respuestas', maxCount: 200 },
    { name: 'explicaciones', maxCount: 200 }
]), async (req, res) => {
    const { id_area } = req.body;
    const preguntasFiles = req.files['preguntas'] || [];
    const respuestasFiles = req.files['respuestas'] || [];
    const explicacionesFiles = req.files['explicaciones'] || [];

    if (!id_area || preguntasFiles.length === 0 ||
        preguntasFiles.length !== respuestasFiles.length ||
        preguntasFiles.length !== explicacionesFiles.length) {
        return res.status(400).json({ 
            error: 'Faltan datos o la cantidad de archivos no coincide. Asegúrate de subir el mismo número de preguntas, respuestas y explicaciones.' 
        });
    }

    try {
        // **Verificar si el id_area existe antes de continuar**
        const areaExists = await pool.query('SELECT id_area FROM areas WHERE id_area = $1', [id_area]);

        if (areaExists.rowCount === 0) {
            return res.status(400).json({ error: `El id_area ${id_area} no existe en la tabla areas` });
        }

        let preguntasIds = [];

        for (let i = 0; i < preguntasFiles.length; i++) {
            const uniqueId = String(i + 1).padStart(3, '0');

            const preguntaFileName = `pregunta_${uniqueId}${path.extname(preguntasFiles[i].originalname)}`;
            const preguntaImgUrl = await uploadToFirebase(
                preguntasFiles[i].buffer, preguntaFileName, preguntasFiles[i].mimetype
            );

            const newPregunta = await pool.query(
                'INSERT INTO preguntas_area (id_area, url_img_pregunta) VALUES ($1, $2) RETURNING id_pregunta',
                [id_area, preguntaImgUrl]
            );

            const preguntaId = newPregunta.rows[0].id_pregunta;
            preguntasIds.push(preguntaId);

            const respuestaFileName = `respuesta_${uniqueId}${path.extname(respuestasFiles[i].originalname)}`;
            const respuestaImgUrl = await uploadToFirebase(
                respuestasFiles[i].buffer, respuestaFileName, respuestasFiles[i].mimetype
            );

            await pool.query(
                'INSERT INTO respuestas_area (id_pregunta, url_img_respuesta) VALUES ($1, $2)',
                [preguntaId, respuestaImgUrl]
            );

            const explicacionFileName = `explicacion_${uniqueId}${path.extname(explicacionesFiles[i].originalname)}`;
            const explicacionImgUrl = await uploadToFirebase(
                explicacionesFiles[i].buffer, explicacionFileName, explicacionesFiles[i].mimetype
            );

            await pool.query(
                'INSERT INTO explicaciones_area (id_pregunta, url_img_explicacion) VALUES ($1, $2)',
                [preguntaId, explicacionImgUrl]
            );
        }

        res.status(201).json({ message: 'Subida exitosa', preguntasIds });
    } catch (err) {
        console.error('Error al subir preguntas, respuestas y explicaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todas las preguntas con respuestas y explicaciones**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id_pregunta, p.url_img_pregunta AS pregunta, 
                r.url_img_respuesta AS respuesta, 
                e.url_img_explicacion AS explicacion
            FROM preguntas_area p
            LEFT JOIN respuestas_area r ON p.id_pregunta = r.id_pregunta
            LEFT JOIN explicaciones_area e ON p.id_pregunta = e.id_pregunta
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener preguntas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una pregunta con su respuesta y explicación**
router.get('/get/:id_pregunta', async (req, res) => {
    const { id_pregunta } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                p.id_pregunta, p.url_img_pregunta AS pregunta, 
                r.url_img_respuesta AS respuesta, 
                e.url_img_explicacion AS explicacion
            FROM preguntas_area p
            LEFT JOIN respuestas_area r ON p.id_pregunta = r.id_pregunta
            LEFT JOIN explicaciones_area e ON p.id_pregunta = e.id_pregunta
            WHERE p.id_pregunta = $1
        `, [id_pregunta]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener pregunta:', err);
        res.status(500).json({ error: 'Error al obtener pregunta' });
    }
});

// **Eliminar una pregunta con su respuesta y explicación**
router.delete('/delete-all', async (req, res) => {
    const { id_pregunta } = req.body;

    if (!id_pregunta) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para eliminar' });
    }

    try {
        await pool.query('DELETE FROM respuestas_area WHERE id_pregunta = $1', [id_pregunta]);
        await pool.query('DELETE FROM explicaciones_area WHERE id_pregunta = $1', [id_pregunta]);
        const result = await pool.query('DELETE FROM preguntas_area WHERE id_pregunta = $1 RETURNING *', [id_pregunta]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        res.status(200).json({ message: 'Pregunta y su contenido eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar:', err);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

//actualizar
router.put('/update', upload.fields([
    { name: 'pregunta', maxCount: 1 },
    { name: 'respuesta', maxCount: 1 },
    { name: 'explicacion', maxCount: 1 }
]), async (req, res) => {
    const { id_pregunta } = req.body;
    const preguntaFile = req.files['pregunta'] ? req.files['pregunta'][0] : null;
    const respuestaFile = req.files['respuesta'] ? req.files['respuesta'][0] : null;
    const explicacionFile = req.files['explicacion'] ? req.files['explicacion'][0] : null;

    if (!id_pregunta) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para actualizar' });
    }

    try {
        // Verificar si la pregunta existe
        const preguntaExists = await pool.query('SELECT id_pregunta FROM preguntas_area WHERE id_pregunta = $1', [id_pregunta]);

        if (preguntaExists.rowCount === 0) {
            return res.status(404).json({ error: 'La pregunta no existe' });
        }

        // Actualizar Pregunta (si se envió una nueva imagen)
        if (preguntaFile) {
            const preguntaUrl = await uploadToFirebase(preguntaFile.buffer, preguntaFile.originalname, preguntaFile.mimetype);
            await pool.query('UPDATE preguntas_area SET url_img_pregunta = $1 WHERE id_pregunta = $2', [preguntaUrl, id_pregunta]);
        }

        // Actualizar Respuesta (si se envió una nueva imagen)
        if (respuestaFile) {
            const respuestaUrl = await uploadToFirebase(respuestaFile.buffer, respuestaFile.originalname, respuestaFile.mimetype);
            await pool.query('UPDATE respuestas_area SET url_img_respuesta = $1 WHERE id_pregunta = $2', [respuestaUrl, id_pregunta]);
        }

        // Actualizar Explicación (si se envió una nueva imagen)
        if (explicacionFile) {
            const explicacionUrl = await uploadToFirebase(explicacionFile.buffer, explicacionFile.originalname, explicacionFile.mimetype);
            await pool.query('UPDATE explicaciones_area SET url_img_explicacion = $1 WHERE id_pregunta = $2', [explicacionUrl, id_pregunta]);
        }

        res.status(200).json({ message: 'Actualización exitosa' });
    } catch (err) {
        console.error('Error al actualizar:', err);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

module.exports = router;