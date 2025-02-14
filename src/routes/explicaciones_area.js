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

// **Crear una nueva explicación**
router.post('/add', upload.single('url_img_explicacion'), async (req, res) => {
    const { id_pregunta } = req.body;
    const file = req.file;

    if (!id_pregunta || !file) {
        return res.status(400).json({ error: 'Faltan datos o imagen para crear la explicación' });
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
        const newExplicacion = await pool.query(
            'INSERT INTO explicaciones_area (id_pregunta, url_img_explicacion) VALUES ($1, $2) RETURNING *',
            [id_pregunta, imageUrl]
        );
        res.status(201).json(newExplicacion.rows[0]);
    } catch (err) {
        console.error('Error al crear la explicación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todas las explicaciones con su pregunta**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.id_explicacion, p.url_img_pregunta, e.url_img_explicacion
            FROM explicaciones_area e
            JOIN preguntas_area p ON e.id_pregunta = p.id_pregunta
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las explicaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener una explicación por ID de la pregunta**
router.get('/getByPregunta', async (req, res) => {
    const { id_pregunta } = req.body;

    if (!id_pregunta) {
        return res.status(400).json({ error: 'Falta el ID de la pregunta' });
    }

    try {
        const result = await pool.query(`
            SELECT e.id_explicacion, p.url_img_pregunta, e.url_img_explicacion
            FROM explicaciones_area e
            JOIN preguntas_area p ON e.id_pregunta = p.id_pregunta
            WHERE e.id_pregunta = $1
        `, [id_pregunta]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No hay explicaciones para esta pregunta' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener la explicación por ID de la pregunta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar una explicación**
router.put('/update', upload.single('url_img_explicacion'), async (req, res) => {
    const { id_explicacion } = req.body;
    const file = req.file;

    if (!id_explicacion) {
        return res.status(400).json({ error: 'Falta el ID de la explicación a actualizar' });
    }

    try {
        let imageUrl;
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        const updateQuery = `
            UPDATE explicaciones_area 
            SET url_img_explicacion = COALESCE($1, url_img_explicacion)
            WHERE id_explicacion = $2 RETURNING *`;

        const updatedExplicacion = await pool.query(updateQuery, [imageUrl, id_explicacion]);

        if (updatedExplicacion.rowCount === 0) {
            return res.status(404).json({ error: 'Explicación no encontrada' });
        }

        res.status(200).json(updatedExplicacion.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la explicación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar una explicación desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_explicacion } = req.body;

    if (!id_explicacion) {
        return res.status(400).json({ error: 'Falta el ID de la explicación para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM explicaciones_area WHERE id_explicacion = $1 RETURNING *', [id_explicacion]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Explicación no encontrada' });
        }

        res.status(200).json({ message: 'Explicación eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la explicación:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
