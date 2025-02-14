const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const pool = require('../../connection');
const router = express.Router();

// Configurar multer para manejar archivos (puede ser imagen o audio)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
});

// **Crear un nuevo efecto especial**
router.post('/add', upload.single('url_efectos'), async (req, res) => {
    const { id_configuracion, nombre } = req.body;
    const file = req.file;

    if (!id_configuracion || !nombre || !file) {
        return res.status(400).json({ error: 'Faltan datos o el archivo para subir' });
    }

    try {
        // Subir el archivo a Firebase y obtener la URL pública
        const fileUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL con la fecha de subida automática
        const newEfecto = await pool.query(
            'INSERT INTO efectos_especiales (id_configuracion, nombre, url_efectos) VALUES ($1, $2, $3) RETURNING *',
            [id_configuracion, nombre, fileUrl]
        );

        res.status(201).json(newEfecto.rows[0]);
    } catch (err) {
        console.error('Error al subir el efecto especial:', err);
        res.status(500).json({ error: 'Error al subir el efecto' });
    }
});

// **Obtener todos los efectos especiales con el nombre de configuración**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT ee.id_efectos_especiales, 
                   ct.nombre_configuracion, 
                   ee.nombre, 
                   ee.url_efectos
            FROM efectos_especiales ee
            JOIN configuracion_trivia ct ON ee.id_configuracion = ct.id_configuracion
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los efectos especiales:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Obtener un efecto especial específico por id_configuracion**
router.get('/getByConfig', async (req, res) => {
    const { id_configuracion } = req.body;

    if (!id_configuracion) {
        return res.status(400).json({ error: 'Falta el ID de configuración' });
    }

    try {
        const result = await pool.query(`
            SELECT ee.id_efectos_especiales, 
                   ct.nombre_configuracion, 
                   ee.nombre, 
                   ee.url_efectos
            FROM efectos_especiales ee
            JOIN configuracion_trivia ct ON ee.id_configuracion = ct.id_configuracion
            WHERE ee.id_configuracion = $1
        `, [id_configuracion]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'No se encontraron efectos para esta configuración' });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los efectos especiales:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// **Actualizar un efecto especial**
router.patch('/update', upload.single('url_efectos'), async (req, res) => {
    const { id_efectos_especiales, id_configuracion, nombre } = req.body;
    const file = req.file;

    if (!id_efectos_especiales) {
        return res.status(400).json({ error: 'Falta el ID del efecto especial para actualizar' });
    }

    try {
        // Verificar si el efecto especial existe
        const efectoExist = await pool.query('SELECT * FROM efectos_especiales WHERE id_efectos_especiales = $1', [id_efectos_especiales]);
        if (efectoExist.rowCount === 0) {
            return res.status(404).json({ error: 'El efecto especial no existe' });
        }

        let updateFields = [];
        let values = [];

        if (id_configuracion) {
            updateFields.push('id_configuracion = $' + (values.length + 1));
            values.push(id_configuracion);
        }

        if (nombre) {
            updateFields.push('nombre = $' + (values.length + 1));
            values.push(nombre);
        }

        if (file) {
            const fileUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
            updateFields.push('url_efectos = $' + (values.length + 1));
            values.push(fileUrl);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay campos para actualizar' });
        }

        values.push(id_efectos_especiales);
        const query = `UPDATE efectos_especiales SET ${updateFields.join(', ')} WHERE id_efectos_especiales = $${values.length} RETURNING *`;

        const updatedEfecto = await pool.query(query, values);

        res.status(200).json(updatedEfecto.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el efecto especial:', err);
        res.status(500).json({ error: 'Error al actualizar el efecto' });
    }
});

//  **Eliminar un efecto especial**
router.delete('/delete', async (req, res) => {
    const { id_efectos_especiales } = req.body;

    if (!id_efectos_especiales) {
        return res.status(400).json({ error: 'Falta el ID del efecto para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM efectos_especiales WHERE id_efectos_especiales = $1 RETURNING *', [id_efectos_especiales]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Efecto especial no encontrado' });
        }

        res.status(200).json({ message: 'Efecto especial eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el efecto especial:', err);
        res.status(500).json({ error: 'Error al eliminar el efecto' });
    }
});

module.exports = router;
