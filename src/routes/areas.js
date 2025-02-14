const express = require('express');
const multer = require('multer');
const { uploadToFirebase } = require('../../firebase');
const { insertData, updateData, deleteData } = require('../../nosql');
const router = express.Router();
const pool = require('../../connection'); // Importa la conexión a PostgreSQL

// Configurar multer para manejar archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
});

// **Crear un área**
router.post('/add', upload.single('imagen'), async (req, res) => {
    const { nombre_area } = req.body;
    const file = req.file;

    if (!file || !nombre_area) {
        console.error('Error: Falta el nombre del área o la imagen');
        return res.status(400).json({ error: 'Falta el nombre del área o la imagen' });
    }

    try {
        // Subir la imagen a Firebase y obtener la URL pública
        const imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);

        // Insertar en PostgreSQL
        const newArea = await insertData('areas', ['nombre_area', 'img_area'], [nombre_area, imageUrl]);

        console.log(`Área creada exitosamente: ${JSON.stringify(newArea)}`); // Mensaje de éxito
        res.status(201).json(newArea);
    } catch (err) {
        console.error('Error al crear el área:', err); // Mensaje de error detallado
        res.status(500).json({ error: 'Error al crear el área' });
    }
});

// **Obtener todas las áreas**
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM areas');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener las áreas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// **Actualizar un área**
router.put('/update', upload.single('imagen'), async (req, res) => {
    const { id_area, nombre_area } = req.body;
    const file = req.file;

    if (!id_area) {
        return res.status(400).json({ error: 'Falta el ID del área' });
    }

    try {
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadToFirebase(file.buffer, file.originalname, file.mimetype);
        } else {
            const result = await pool.query('SELECT img_area FROM areas WHERE id_area = $1', [id_area]);
            if (result.rowCount > 0) {
                imageUrl = result.rows[0].img_area;
            }
        }

        const updatedFields = [];
        const updatedValues = [];
        if (nombre_area) {
            updatedFields.push('nombre_area');
            updatedValues.push(nombre_area);
        }
        if (imageUrl) {
            updatedFields.push('img_area');
            updatedValues.push(imageUrl);
        }

        if (updatedFields.length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        const setClause = updatedFields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        updatedValues.push(id_area);

        const updatedArea = await pool.query(
            `UPDATE areas SET ${setClause} WHERE id_area = $${updatedValues.length} RETURNING *`,
            updatedValues
        );

        if (updatedArea.rowCount === 0) {
            return res.status(404).json({ error: 'Área no encontrada' });
        }

        console.log(`Área actualizada exitosamente: ${JSON.stringify(updatedArea.rows[0])}`);
        res.status(200).json(updatedArea.rows[0]);
    } catch (err) {
        console.error('Error al actualizar el área:', err);
        res.status(500).json({ error: 'Error al actualizar el área' });
    }
});


// **Eliminar un área**
router.delete('/delete', async (req, res) => {
    const { id_area } = req.body;

    if (!id_area) {
        return res.status(400).json({ error: 'Falta el ID del área para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM areas WHERE id_area = $1 RETURNING *', [id_area]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Área no encontrada' });
        }

        console.log(`Área eliminada exitosamente: ${JSON.stringify(result.rows[0])}`);
        res.status(200).json({ message: 'Área eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar el área:', err);
        res.status(500).json({ error: 'Error al eliminar el área' });
    }
});

// **Obtener un área por ID**
router.get('/get/:id_area', async (req, res) => {
    const { id_area } = req.params;

    try {
        const result = await pool.query('SELECT * FROM areas WHERE id_area = $1', [id_area]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Área no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el área:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;