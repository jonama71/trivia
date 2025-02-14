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

// **Crear una respuesta pública con imagen**
router.post('/add', upload.single('url_img_respuesta_publico'), async (req, res) => {
    const { id_configuracion, id_pregunta_publico } = req.body;
    const file = req.file;

    if (!id_configuracion || !id_pregunta_publico) {
        return res.status(400).json({ error: 'Faltan datos para crear la respuesta' });
    }

    try {
        // Verificar si el id_configuracion e id_pregunta_publico existen
        const configExist = await pool.query('SELECT id_configuracion FROM configuracion_trivia WHERE id_configuracion = $1', [id_configuracion]);
        if (configExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_configuracion no existe en la tabla configuracion_trivia' });
        }

        const preguntaExist = await pool.query('SELECT id_pregunta_publico FROM preguntas_publico WHERE id_pregunta_publico = $1', [id_pregunta_publico]);
        if (preguntaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_pregunta_publico no existe en la tabla preguntas_publico' });
        }

        // Subir la imagen a Firebase (si se proporciona)
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // Insertar en PostgreSQL
        const newRespuesta = await pool.query(
            'INSERT INTO respuestas_publico (id_configuracion, id_pregunta_publico, url_img_respuesta_publico) VALUES ($1, $2, $3) RETURNING *',
            [id_configuracion, id_pregunta_publico, imageUrl]
        );

        res.status(201).json(newRespuesta.rows[0]);
    } catch (err) {
        console.error('Error al crear la respuesta pública:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// **Eliminar una respuesta pública**
router.delete('/delete', async (req, res) => {
    const { id_respuesta_publico } = req.body;

    if (!id_respuesta_publico) {
        return res.status(400).json({ error: 'Falta el ID de la respuesta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM respuestas_publico WHERE id_respuesta_publico = $1 RETURNING *', [id_respuesta_publico]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Respuesta pública no encontrada' });
        }

        res.status(200).json({ message: 'Respuesta pública eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la respuesta pública:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.patch('/update', upload.single('url_img_respuesta_publico'), async (req, res) => {
    const { id_respuesta_publico, id_configuracion, id_pregunta_publico } = req.body;
    const file = req.file;

    if (!id_respuesta_publico) {
        return res.status(400).json({ error: 'Falta el ID de la respuesta a actualizar' });
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
                'SELECT url_img_respuesta_publico FROM respuestas_publico WHERE id_respuesta_publico = $1',
                [id_respuesta_publico]
            );

            if (currentData.rowCount === 0) {
                return res.status(404).json({ error: 'La respuesta no existe' });
            }

            imageUrl = currentData.rows[0].url_img_respuesta_publico;
        }

        // Realizar la actualización en PostgreSQL
        const updatedRespuesta = await pool.query(
            'UPDATE respuestas_publico SET id_configuracion = COALESCE($1, id_configuracion), id_pregunta_publico = COALESCE($2, id_pregunta_publico), url_img_respuesta_publico = $3 WHERE id_respuesta_publico = $4 RETURNING *',
            [id_configuracion, id_pregunta_publico, imageUrl, id_respuesta_publico]
        );

        res.status(200).json(updatedRespuesta.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la respuesta:', err);
        res.status(500).json({ error: 'Error al actualizar la respuesta' });
    }
});
// Obtener todas las respuestas con el nombre de la configuración
router.get('/get', async (req, res) => {
    try {
        const query = `
            SELECT r.id_respuesta_publico, 
                   c.nombre_configuracion, 
                   r.url_img_respuesta_publico
            FROM respuestas_publico r
            JOIN configuracion_trivia c ON r.id_configuracion = c.id_configuracion;
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las respuestas:', err);
        res.status(500).json({ error: 'Error al obtener las respuestas' });
    }
});

module.exports = router;
