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

// **Crear un sorteo de trivia con imagen**
router.post('/add', upload.single('url_img_fondo_trivia'), async (req, res) => {
    const { id_sorteos, id_institucion, cantidad_rectangulos } = req.body;
    const file = req.file;

    if (!id_sorteos || !id_institucion || !cantidad_rectangulos || !file) {
        return res.status(400).json({ error: 'Faltan datos o la imagen para crear el sorteo de trivia' });
    }

    try {
        // Subir la imagen a Firebase y obtener la URL pública
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        
        // Insertar en PostgreSQL
        const newSorteoTrivia = await pool.query(
            'INSERT INTO sorteo_trivia (id_sorteos, id_institucion, cantidad_rectangulos, url_img_fondo_trivia) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_sorteos, id_institucion, cantidad_rectangulos, imageUrl]
        );
        res.status(201).json(newSorteoTrivia.rows[0]);
    } catch (err) {
        console.error('Error al crear el sorteo de trivia:', err);
        res.status(500).json({ error: 'Error al crear el sorteo de trivia' });
    }
});

// **Obtener todos los sorteos de trivia**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sorteo_trivia');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los sorteos de trivia:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Eliminar un sorteo de trivia desde el Body**
router.delete('/delete', async (req, res) => {
    const { id_sorteo_trivia } = req.body;

    if (!id_sorteo_trivia) {
        return res.status(400).json({ error: 'Falta el ID del sorteo de trivia para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM sorteo_trivia WHERE id_sorteo_trivia = $1 RETURNING *', [id_sorteo_trivia]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Sorteo de trivia no encontrado' });
        }

        res.status(200).json({ message: 'Sorteo de trivia eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el sorteo de trivia:', err);
        res.status(500).json({ error: 'Error al eliminar el sorteo de trivia' });
    }
});

module.exports = router;