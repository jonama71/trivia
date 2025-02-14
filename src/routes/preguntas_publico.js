const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

// **Crear una pregunta pública con imagen**
router.post('/add', upload.single('url_img_pregunta_publico'), async (req, res) => {
    const { id_configuracion } = req.body;
    const file = req.file;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el id_configuracion para crear la pregunta' });
    }

    try {
        // Verificar si el id_configuracion existe
        const configExist = await pool.query('SELECT id_configuracion FROM configuracion_trivia WHERE id_configuracion = $1', [id_configuracion]);
        if (configExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_configuracion no existe en la tabla configuracion_trivia' });
        }

        // Subir la imagen a Firebase (si se proporciona)
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // Insertar en PostgreSQL
        const newPregunta = await pool.query(
            'INSERT INTO preguntas_publico (id_configuracion, url_img_pregunta_publico) VALUES ($1, $2) RETURNING *',
            [id_configuracion, imageUrl]
        );

        res.status(201).json(newPregunta.rows[0]);
    } catch (err) {
        console.error('Error al crear la pregunta pública:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener todas las preguntas público con el nombre de la configuración
router.get('/get', async (req, res) => {
    try {
        const query = `
            SELECT p.id_pregunta_publico, 
                   c.nombre_configuracion, 
                   p.url_img_pregunta_publico
            FROM preguntas_publico p
            JOIN configuracion_trivia c ON p.id_configuracion = c.id_configuracion;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las preguntas público:', err);
        res.status(500).json({ error: 'Error al obtener las preguntas público' });
    }
});
// **Eliminar una pregunta pública**
router.delete('/delete', async (req, res) => {
    const { id_pregunta_publico } = req.body;

    if (!id_pregunta_publico) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM preguntas_publico WHERE id_pregunta_publico = $1 RETURNING *', [id_pregunta_publico]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pregunta pública no encontrada' });
        }

        res.status(200).json({ message: 'Pregunta pública eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la pregunta pública:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// **Obtener todas las preguntas con sus respuestas**
router.get('/getWithAnswers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id_pregunta_publico, 
                p.url_img_pregunta_publico,
                r.id_respuesta_publico, 
                r.url_img_respuesta_publico
            FROM preguntas_publico p
            LEFT JOIN respuestas_publico r 
            ON p.id_pregunta_publico = r.id_pregunta_publico
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener preguntas con respuestas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.patch('/update', upload.single('url_img_pregunta_publico'), async (req, res) => {
    const { id_pregunta_publico, id_configuracion } = req.body;
    const file = req.file;

    if (!id_pregunta_publico) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta a actualizar' });
    }

    try {
        // Obtener la imagen actual si no se sube una nueva
        let imageUrl = null;

        if (file) {
            // Subir la nueva imagen a Firebase
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        } else {
            // Obtener la URL actual de la imagen
            const currentData = await pool.query(
                'SELECT url_img_pregunta_publico FROM preguntas_publico WHERE id_pregunta_publico = $1',
                [id_pregunta_publico]
            );

            if (currentData.rowCount === 0) {
                return res.status(404).json({ error: 'La pregunta no existe' });
            }

            imageUrl = currentData.rows[0].url_img_pregunta_publico;
        }

        // Realizar la actualización en PostgreSQL
        const updatedPregunta = await pool.query(
            'UPDATE preguntas_publico SET id_configuracion = COALESCE($1, id_configuracion), url_img_pregunta_publico = $2 WHERE id_pregunta_publico = $3 RETURNING *',
            [id_configuracion, imageUrl, id_pregunta_publico]
        );

        res.status(200).json(updatedPregunta.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la pregunta:', err);
        res.status(500).json({ error: 'Error al actualizar la pregunta' });
    }
});

module.exports = router;
