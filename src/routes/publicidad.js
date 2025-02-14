const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar archivos (imágenes y videos)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50MB
});

router.post('/add', upload.single('archivo'), async (req, res) => {
    const { nombre_video_foto } = req.body;
    const file = req.file;

    if (!nombre_video_foto || !file) {
        return res.status(400).json({ error: 'Faltan datos o el archivo para la publicidad' });
    }

    try {
        // Subir archivo a Firebase
        const fileUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Verificar si ya existe una publicidad con ese nombre
        const existingPublicidad = await pool.query(
            'SELECT * FROM publicidad WHERE nombre_video_foto = $1',
            [nombre_video_foto]
        );

        let result;
        if (existingPublicidad.rowCount > 0) {
            // Si ya existe, actualizar la URL del video
            result = await pool.query(
                'UPDATE publicidad SET url_video_foto = $1 WHERE nombre_video_foto = $2 RETURNING *',
                [fileUrl, nombre_video_foto]
            );
        } else {
            // Si no existe, insertar una nueva publicidad
            result = await pool.query(
                'INSERT INTO publicidad (id_configuracion, nombre_video_foto, url_video_foto) VALUES ($1, $2, $3) RETURNING *',
                [2, nombre_video_foto, fileUrl] // id_configuracion = 2 por defecto
            );
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al agregar/actualizar publicidad:', err);
        res.status(500).json({ error: 'Error al agregar/actualizar publicidad' });
    }
});

// **Obtener todas las publicidades**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.id_publicidad, c.nombre_configuracion, p.nombre_video_foto, p.url_video_foto
            FROM publicidad p
            JOIN configuracion_general c ON p.id_configuracion = c.id_configuracion
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener publicidades:', err);
        res.status(500).json({ error: 'Error al obtener publicidades' });
    }
});

// **Obtener una publicidad por ID**
router.get('/getById/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT p.id_publicidad, c.nombre_configuracion, p.nombre_video_foto, p.url_video_foto
            FROM publicidad p
            JOIN configuracion_general c ON p.id_configuracion = c.id_configuracion
            WHERE p.id_publicidad = $1
        `, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Publicidad no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener publicidad:', err);
        res.status(500).json({ error: 'Error al obtener publicidad' });
    }
});

// **Actualizar una publicidad (Imagen o Video)**
router.put('/update', upload.single('archivo'), async (req, res) => {
    let { id_publicidad, id_configuracion, nombre_video_foto } = req.body;
    const file = req.file;

    if (!id_publicidad || !nombre_video_foto) {
        return res.status(400).json({ error: 'Faltan datos para actualizar la publicidad' });
    }

    try {
        let fileUrl = null;

        // Si hay un nuevo archivo, subirlo a Firebase
        if (file) {
            fileUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // Si no se proporciona `id_configuracion`, se asigna `2` por defecto
        id_configuracion = id_configuracion || 2;

        // Actualizar publicidad en PostgreSQL
        const updatePublicidad = await pool.query(
            'UPDATE publicidad SET id_configuracion = $1, nombre_video_foto = $2, url_video_foto = COALESCE($3, url_video_foto) WHERE id_publicidad = $4 RETURNING *',
            [id_configuracion, nombre_video_foto, fileUrl, id_publicidad]
        );

        if (updatePublicidad.rowCount === 0) {
            return res.status(404).json({ error: 'Publicidad no encontrada' });
        }

        res.status(200).json(updatePublicidad.rows[0]);
    } catch (err) {
        console.error('Error al actualizar publicidad:', err);
        res.status(500).json({ error: 'Error al actualizar publicidad' });
    }
});

// **Eliminar una publicidad**
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM publicidad WHERE id_publicidad = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Publicidad no encontrada' });
        }

        res.status(200).json({ message: 'Publicidad eliminada correctamente', deletedPublicidad: result.rows[0] });
    } catch (err) {
        console.error('Error al eliminar publicidad:', err);
        res.status(500).json({ error: 'Error al eliminar publicidad' });
    }
});

module.exports = router;
