const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
});

// **Crear un sorteo de desafío con imagen**
router.post('/add', upload.single('url_img_fondo_desafio'), async (req, res) => {
    const { id_sorteos, id_institucion, cantidad_rectangulos } = req.body;
    const file = req.file;

    if (!id_sorteos || !id_institucion || !cantidad_rectangulos || !file) {
        return res.status(400).json({ error: 'Faltan datos o la imagen para crear el sorteo de desafío' });
    }

    try {
        // Verificar si el id_sorteos existe en la tabla sorteos
        const sorteosExist = await pool.query('SELECT id_sorteos FROM sorteos WHERE id_sorteos = $1', [id_sorteos]);
        if (sorteosExist.rowCount === 0) {
            return res.status(400).json({ error: 'El id_sorteos no existe en la tabla sorteos' });
        }

        // Subir la imagen a Firebase y obtener la URL pública
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        
        // Insertar en PostgreSQL
        const newSorteoDesafio = await pool.query(
            'INSERT INTO sorteo_desafio (id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_desafio) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_sorteos, id_institucion, cantidad_rectangulos, imageUrl]
        );
        res.status(201).json(newSorteoDesafio.rows[0]);
    } catch (err) {
        console.error('Error al crear el sorteo de desafío:', err);
        res.status(500).json({ error: 'Error al crear el sorteo de desafío' });
    }
});

// **Obtener todos los sorteos de desafío**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sorteo_desafio');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los sorteos de desafío:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar un sorteo de desafío desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_sorteo_desafio } = req.body;

    if (!id_sorteo_desafio) {
        return res.status(400).json({ error: 'Falta el ID del sorteo de desafío para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM sorteo_desafio WHERE id_sorteo_desafio = $1 RETURNING *', [id_sorteo_desafio]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Sorteo de desafío no encontrado' });
        }

        res.status(200).json({ message: 'Sorteo de desafío eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el sorteo de desafío:', err);
        res.status(500).json({ error: 'Error al eliminar el sorteo de desafío' });
    }
});

module.exports = router;
