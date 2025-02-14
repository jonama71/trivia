const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar imágenes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
});

// **Crear una nueva respuesta**
router.post('/add', upload.single('url_img_respuesta'), async (req, res) => {
    const { id_pregunta } = req.body;
    const file = req.file;

    if (!id_pregunta || !file) {
        return res.status(400).json({ error: 'Faltan datos o imagen para crear la respuesta' });
    }

    try {
        // Verificar si la pregunta existe
        const preguntaExist = await pool.query('SELECT id_pregunta FROM preguntas_area WHERE id_pregunta = $1', [id_pregunta]);
        if (preguntaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_pregunta no existe en la tabla preguntas_area' });
        }

        // Subir la imagen a Firebase
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL
        const newRespuesta = await pool.query(
            'INSERT INTO respuestas_area (id_pregunta, url_img_respuesta) VALUES ($1, $2) RETURNING *',
            [id_pregunta, imageUrl]
        );
        res.status(201).json(newRespuesta.rows[0]);
    } catch (err) {
        console.error('Error al crear la respuesta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todas las respuestas con su pregunta**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id_respuesta, p.url_img_pregunta, r.url_img_respuesta
            FROM respuestas_area r
            JOIN preguntas_area p ON r.id_pregunta = p.id_pregunta
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las respuestas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una respuesta por ID de la pregunta**
router.get('/getByPregunta', async (req, res) => {
    const { id_pregunta } = req.body;

    if (!id_pregunta) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta' });
    }

    try {
        const result = await pool.query(`
            SELECT r.id_respuesta, p.url_img_pregunta, r.url_img_respuesta
            FROM respuestas_area r
            JOIN preguntas_area p ON r.id_pregunta = p.id_pregunta
            WHERE r.id_pregunta = $1
        `, [id_pregunta]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No hay respuestas para esta pregunta' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener la respuesta por ID de la pregunta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una respuesta**
router.put('/update', upload.single('url_img_respuesta'), async (req, res) => {
    const { id_respuesta } = req.body;
    const file = req.file;

    if (!id_respuesta) {
        return res.status(400).json({ error: 'Falta el ID de la respuesta a actualizar' });
    }

    try {
        let imageUrl;
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        const updateQuery = `
            UPDATE respuestas_area 
            SET url_img_respuesta = COALESCE($1, url_img_respuesta)
            WHERE id_respuesta = $2 RETURNING *`;

        const updatedRespuesta = await pool.query(updateQuery, [imageUrl, id_respuesta]);

        if (updatedRespuesta.rowCount === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        res.status(200).json(updatedRespuesta.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la respuesta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar una respuesta desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_respuesta } = req.body;

    if (!id_respuesta) {
        return res.status(400).json({ error: 'Falta el ID de la respuesta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM respuestas_area WHERE id_respuesta = $1 RETURNING *', [id_respuesta]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Respuesta no encontrada' });
        }

        res.status(200).json({ message: 'Respuesta eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la respuesta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
