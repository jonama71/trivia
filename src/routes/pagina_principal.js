const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar imágenes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

// **Agregar una nueva página principal con imagen de fondo**
router.post('/add', upload.single('fondo'), async (req, res) => {
    const { id_configuracion } = req.body;
    const file = req.file;

    if (!id_configuracion || !file) {
        return res.status(400).json({ error: 'Faltan datos o imagen para crear la página principal' });
    }

    try {
        // Subir la imagen a Firebase y obtener la URL
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL
        const newPage = await pool.query(
            'INSERT INTO pagina_principal (id_configuracion, url_fondo_principal) VALUES ($1, $2) RETURNING *',
            [id_configuracion, imageUrl]
        );

        res.status(201).json(newPage.rows[0]);
    } catch (err) {
        console.error('Error al agregar página principal:', err);
        res.status(500).json({ error: 'Error al agregar página principal' });
    }
});

// **Obtener todas las páginas principales**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.id_pagina, c.nombre_configuracion, p.url_fondo_principal
            FROM pagina_principal p
            JOIN configuracion_general c ON p.id_configuracion = c.id_configuracion
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener páginas principales:', err);
        res.status(500).json({ error: 'Error al obtener páginas principales' });
    }
});

// **Obtener una página principal por ID (mediante Body)**
router.get('/getById', async (req, res) => {
    const { id_pagina } = req.body;

    if (!id_pagina) {
        return res.status(400).json({ error: 'Falta el ID de la página principal' });
    }

    try {
        const result = await pool.query(`
            SELECT p.id_pagina, c.nombre_configuracion, p.url_fondo_principal
            FROM pagina_principal p
            JOIN configuracion_general c ON p.id_configuracion = c.id_configuracion
            WHERE p.id_pagina = $1
        `, [id_pagina]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Página principal no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener página principal:', err);
        res.status(500).json({ error: 'Error al obtener página principal' });
    }
});

// **Actualizar una página principal (imagen de fondo opcional)**
router.put('/update', upload.single('fondo'), async (req, res) => {
    const { id_pagina, id_configuracion } = req.body;
    const file = req.file;

    if (!id_pagina || !id_configuracion) {
        return res.status(400).json({ error: 'Faltan datos para actualizar' });
    }

    try {
        let updateQuery = 'UPDATE pagina_principal SET id_configuracion = $1';
        let queryParams = [id_configuracion, id_pagina];

        // Si se sube una nueva imagen, actualizarla en Firebase y en la base de datos
        if (file) {
            const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
            updateQuery += ', url_fondo_principal = $2 WHERE id_pagina = $3 RETURNING *';
            queryParams = [id_configuracion, imageUrl, id_pagina];
        } else {
            updateQuery += ' WHERE id_pagina = $2 RETURNING *';
        }

        const updatedPage = await pool.query(updateQuery, queryParams);

        if (updatedPage.rowCount === 0) {
            return res.status(404).json({ error: 'Página principal no encontrada' });
        }

        res.status(200).json(updatedPage.rows[0]);
    } catch (err) {
        console.error('Error al actualizar página principal:', err);
        res.status(500).json({ error: 'Error al actualizar página principal' });
    }
});

// **Eliminar una página principal**
router.delete('/delete', async (req, res) => {
    const { id_pagina } = req.body;

    if (!id_pagina) {
        return res.status(400).json({ error: 'Falta el ID de la página principal para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM pagina_principal WHERE id_pagina = $1 RETURNING *',
            [id_pagina]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Página principal no encontrada' });
        }

        res.status(200).json({ message: 'Página principal eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar página principal:', err);
        res.status(500).json({ error: 'Error al eliminar página principal' });
    }
});

module.exports = router;
