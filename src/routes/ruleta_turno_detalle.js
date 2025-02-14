const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// 📌 Configurar multer para manejar archivos (imágenes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

/** 📌 **Agregar un nuevo detalle de ruleta de turno** */
router.post('/add', upload.single('url_logo'), async (req, res) => {
    const { id_ruletas, texto } = req.body;
    const file = req.file;

    if (!id_ruletas || !texto || !file) {
        return res.status(400).json({ error: 'Faltan datos o la imagen para agregar el detalle de ruleta' });
    }

    try {
        // Verificar si la ruleta existe
        const ruletaExist = await pool.query('SELECT id_ruletas FROM ruletas WHERE id_ruletas = $1', [id_ruletas]);
        if (ruletaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El ID de la ruleta no existe' });
        }

        // Subir imagen a Firebase y obtener URL
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL
        const newDetalle = await pool.query(
            'INSERT INTO ruleta_turno_detalle (id_ruletas, texto, url_logo) VALUES ($1, $2, $3) RETURNING *',
            [id_ruletas, texto, imageUrl]
        );

        res.status(201).json(newDetalle.rows[0]);
    } catch (err) {
        console.error('Error al agregar el detalle de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Obtener todos los detalles de ruleta de turno** */
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.id_ruleta_turno_detalle, d.id_ruletas, r.tipo_ruleta, d.texto, d.url_logo 
            FROM ruleta_turno_detalle d
            JOIN ruletas r ON d.id_ruletas = r.id_ruletas
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los detalles de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Obtener un detalle de ruleta de turno por ID (desde el Body)** */
router.get('/getById', async (req, res) => {
    const { id_ruleta_turno_detalle } = req.body;

    if (!id_ruleta_turno_detalle) {
        return res.status(400).json({ error: 'Falta el ID del detalle de ruleta para buscar' });
    }

    try {
        const result = await pool.query(`
            SELECT d.id_ruleta_turno_detalle, d.id_ruletas, r.tipo_ruleta, d.texto, d.url_logo 
            FROM ruleta_turno_detalle d
            JOIN ruletas r ON d.id_ruletas = r.id_ruletas
            WHERE d.id_ruleta_turno_detalle = $1
        `, [id_ruleta_turno_detalle]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Detalle de ruleta no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener detalle de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Actualizar un detalle de ruleta de turno (Texto y/o Imagen)** */
router.put('/update', upload.single('url_logo'), async (req, res) => {
    const { id_ruleta_turno_detalle, id_ruletas, texto } = req.body;
    const file = req.file;

    if (!id_ruleta_turno_detalle) {
        return res.status(400).json({ error: 'Falta el ID del detalle de ruleta para actualizar' });
    }

    try {
        // Verificar si el detalle existe
        const detalleExist = await pool.query(
            'SELECT * FROM ruleta_turno_detalle WHERE id_ruleta_turno_detalle = $1',
            [id_ruleta_turno_detalle]
        );

        if (detalleExist.rowCount === 0) {
            return res.status(404).json({ error: 'El detalle de ruleta no existe' });
        }

        let imageUrl = detalleExist.rows[0].url_logo; // Mantener la imagen actual por defecto

        // Si se sube una nueva imagen, actualizarla en Firebase y guardar el nuevo URL
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        }

        // Actualizar en PostgreSQL
        await pool.query(
            'UPDATE ruleta_turno_detalle SET id_ruletas = $1, texto = $2, url_logo = $3 WHERE id_ruleta_turno_detalle = $4',
            [id_ruletas || detalleExist.rows[0].id_ruletas, texto || detalleExist.rows[0].texto, imageUrl, id_ruleta_turno_detalle]
        );

        res.status(200).json({ message: 'Detalle de ruleta actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el detalle de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Eliminar un detalle de ruleta de turno** */
router.delete('/delete', async (req, res) => {
    const { id_ruleta_turno_detalle } = req.body;

    if (!id_ruleta_turno_detalle) {
        return res.status(400).json({ error: 'Falta el ID del detalle de ruleta para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM ruleta_turno_detalle WHERE id_ruleta_turno_detalle = $1 RETURNING *',
            [id_ruleta_turno_detalle]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Detalle de ruleta no encontrado' });
        }

        res.status(200).json({ message: 'Detalle de ruleta eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el detalle de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
/* **Obtener todos los detalles de ruleta de turno (GET sin ID)** */
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.id_ruleta_turno_detalle, d.id_ruletas, r.tipo_ruleta, d.texto, d.url_logo 
            FROM ruleta_turno_detalle d
            JOIN ruletas r ON d.id_ruletas = r.id_ruletas
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los detalles de ruleta de turno:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
