const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar imágenes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
});

// **Agregar una ruleta de desafío**
router.post('/add', upload.single('logo'), async (req, res) => {
    const { id_configuracion_desa, texto, tiempo } = req.body;
    const file = req.file;

    if (!id_configuracion_desa || !texto || !tiempo || !file) {
        return res.status(400).json({ error: 'Faltan datos o el logo' });
    }

    try {
        // Subir logo a Firebase y obtener la URL
        const logoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Guardar en PostgreSQL con tiempo en segundos
        const newRuleta = await pool.query(
            'INSERT INTO ruleta_desafio (id_configuracion_desa, texto, url_logo, tiempo) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_configuracion_desa, texto, logoUrl, parseInt(tiempo, 10)]
        );

        res.status(201).json(newRuleta.rows[0]);
    } catch (err) {
        console.error('Error al agregar la ruleta de desafío:', err);
        res.status(500).json({ error: 'Error al agregar la ruleta' });
    }
});

// **Obtener todas las ruletas de desafío**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.id_ruleta_desafio, c.nombre_configuracion, r.texto, r.url_logo, r.tiempo
            FROM ruleta_desafio r
            JOIN configuracion_desafio_mate c ON r.id_configuracion_desa = c.id_configuracion_desa
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener ruletas:', err);
        res.status(500).json({ error: 'Error al obtener ruletas' });
    }
});

// **Obtener una ruleta por ID (mediante Body)**
router.post('/getById', async (req, res) => {
    const { id_ruleta_desafio } = req.body;

    if (!id_ruleta_desafio) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta' });
    }

    try {
        const result = await pool.query(`
            SELECT r.id_ruleta_desafio, c.nombre_configuracion, r.texto, r.url_logo, r.tiempo
            FROM ruleta_desafio r
            JOIN configuracion_desafio_mate c ON r.id_configuracion_desa = c.id_configuracion_desa
            WHERE r.id_ruleta_desafio = $1
        `, [id_ruleta_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ruleta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener la ruleta:', err);
        res.status(500).json({ error: 'Error al obtener la ruleta' });
    }
});

// **Actualizar una ruleta (puede actualizar solo texto, solo logo, solo tiempo o los 3)**
router.put('/update', upload.single('logo'), async (req, res) => {
    const { id_ruleta_desafio, texto, tiempo } = req.body;
    const file = req.file;

    if (!id_ruleta_desafio) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta para actualizar' });
    }

    try {
        let updateFields = [];
        let updateValues = [];
        let index = 1;

        if (texto) {
            updateFields.push(`texto = $${index++}`);
            updateValues.push(texto);
        }

        if (tiempo) {
            updateFields.push(`tiempo = $${index++}`);
            updateValues.push(parseInt(tiempo, 10));
        }

        if (file) {
            const logoUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
            updateFields.push(`url_logo = $${index++}`);
            updateValues.push(logoUrl);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
        }

        updateValues.push(id_ruleta_desafio);

        const query = `UPDATE ruleta_desafio SET ${updateFields.join(', ')} WHERE id_ruleta_desafio = $${index} RETURNING *`;
        const updatedRuleta = await pool.query(query, updateValues);

        res.status(200).json(updatedRuleta.rows[0]);
    } catch (err) {
        console.error('Error al actualizar la ruleta:', err);
        res.status(500).json({ error: 'Error al actualizar la ruleta' });
    }
});

// **Eliminar una ruleta**
router.delete('/delete', async (req, res) => {
    const { id_ruleta_desafio } = req.body;

    if (!id_ruleta_desafio) {
        return res.status(400).json({ error: 'Falta el ID de la ruleta para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM ruleta_desafio WHERE id_ruleta_desafio = $1 RETURNING *', [id_ruleta_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Ruleta no encontrada' });
        }

        res.status(200).json({ message: 'Ruleta eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar la ruleta:', err);
        res.status(500).json({ error: 'Error al eliminar la ruleta' });
    }
});

module.exports = router;
