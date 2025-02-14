const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configuración de Multer para manejar archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } // Límite de 20 MB para videos
});

// **Crear un Desafío Matemático**
router.post('/add', upload.fields([
    { name: 'intro_video', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), async (req, res) => {
    const { id_modulo, tiempo_ruleta } = req.body;
    const introVideoFile = req.files['intro_video'] ? req.files['intro_video'][0] : null;
    const bannerFile = req.files['banner'] ? req.files['banner'][0] : null;

    if (!id_modulo || !introVideoFile || !bannerFile || !tiempo_ruleta) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        // Subir el video de introducción a Firebase
        const introVideoUrl = await uploadToFirebase(introVideoFile.buffer, introVideoFile.originalname, introVideoFile.mimetype);

        // Subir el banner a Firebase
        const bannerUrl = await uploadToFirebase(bannerFile.buffer, bannerFile.originalname, bannerFile.mimetype);

        // Insertar en la base de datos
        const newDesafio = await pool.query(
            `INSERT INTO desafio_matematico (id_modulo, intro_video_url, banner_url, tiempo_ruleta)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_modulo, introVideoUrl, bannerUrl, `${tiempo_ruleta} seconds`] // Convertir segundos a formato `time`
        );

        res.status(201).json(newDesafio.rows[0]);
    } catch (err) {
        console.error('Error al agregar el desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener todos los desafíos matemáticos**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.id_desafio, d.id_modulo, m.nombre_modulo, d.intro_video_url, d.banner_url, d.tiempo_ruleta 
            FROM desafio_matematico d
            JOIN modulo m ON d.id_modulo = m.id_modulo
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener desafíos matemáticos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener un desafío matemático por ID (Desde el Body)**
router.post('/getById', async (req, res) => {
    const { id_desafio } = req.body;

    if (!id_desafio) {
        return res.status(400).json({ error: 'Falta el ID del desafío matemático' });
    }

    try {
        const result = await pool.query(`
            SELECT d.id_desafio, d.id_modulo, m.nombre_modulo, d.intro_video_url, d.banner_url, d.tiempo_ruleta 
            FROM desafio_matematico d
            JOIN modulo m ON d.id_modulo = m.id_modulo
            WHERE d.id_desafio = $1
        `, [id_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Desafío matemático no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar un Desafío Matemático**
router.put('/update', upload.fields([
    { name: 'intro_video', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), async (req, res) => {
    const { id_desafio, id_modulo, tiempo_ruleta } = req.body;
    const introVideoFile = req.files['intro_video'] ? req.files['intro_video'][0] : null;
    const bannerFile = req.files['banner'] ? req.files['banner'][0] : null;

    if (!id_desafio) {
        return res.status(400).json({ error: 'Falta el ID del desafío matemático para actualizar' });
    }

    try {
        // Verificar si el desafío matemático existe
        const desafioExists = await pool.query('SELECT * FROM desafio_matematico WHERE id_desafio = $1', [id_desafio]);

        if (desafioExists.rowCount === 0) {
            return res.status(404).json({ error: 'El desafío matemático no existe' });
        }

        let introVideoUrl = desafioExists.rows[0].intro_video_url;
        let bannerUrl = desafioExists.rows[0].banner_url;
        let newTiempoRuleta = tiempo_ruleta || desafioExists.rows[0].tiempo_ruleta;
        let newIdModulo = id_modulo || desafioExists.rows[0].id_modulo;

        // Si se subió un nuevo video, actualizarlo
        if (introVideoFile) {
            introVideoUrl = await uploadToFirebase(introVideoFile.buffer, introVideoFile.originalname, introVideoFile.mimetype);
        }

        // Si se subió un nuevo banner, actualizarlo
        if (bannerFile) {
            bannerUrl = await uploadToFirebase(bannerFile.buffer, bannerFile.originalname, bannerFile.mimetype);
        }

        await pool.query(
            `UPDATE desafio_matematico 
            SET id_modulo = $1, intro_video_url = $2, banner_url = $3, tiempo_ruleta = $4 
            WHERE id_desafio = $5`,
            [newIdModulo, introVideoUrl, bannerUrl, `${newTiempoRuleta} seconds`, id_desafio]
        );

        res.status(200).json({ message: 'Desafío matemático actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar un desafío matemático**
router.delete('/delete', async (req, res) => {
    const { id_desafio } = req.body;

    if (!id_desafio) {
        return res.status(400).json({ error: 'Falta el ID del desafío matemático para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM desafio_matematico WHERE id_desafio = $1 RETURNING *', [id_desafio]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Desafío matemático no encontrado' });
        }

        res.status(200).json({ message: 'Desafío matemático eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el desafío matemático:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
