const express = require('express');
const pool = require('../../connection');
const router = express.Router();

/* **Agregar un nuevo comodín a una ruleta** */
router.post('/add', async (req, res) => {
    const { id_ruletas, texto_comodin } = req.body;

    if (!id_ruletas || !texto_comodin) {
        return res.status(400).json({ error: 'Faltan datos para agregar el comodín' });
    }

    try {
        // Verificar si la ruleta existe
        const ruletaExist = await pool.query('SELECT id_ruletas FROM ruletas WHERE id_ruletas = $1', [id_ruletas]);
        if (ruletaExist.rowCount === 0) {
            return res.status(400).json({ error: 'El ID de la ruleta no existe' });
        }

        // Insertar el comodín en la base de datos
        const newComodin = await pool.query(
            'INSERT INTO ruleta_comodin_detalle (id_ruletas, texto_comodin) VALUES ($1, $2) RETURNING *',
            [id_ruletas, texto_comodin]
        );

        res.status(201).json(newComodin.rows[0]);
    } catch (err) {
        console.error('Error al agregar el comodín:', err);
        res.status(500).json({ error: 'Error al agregar el comodín' });
    }
});

/**Obtener un comodín por su ID (`id_ruleta_comodin_detalle`)** */
router.get('/getById', async (req, res) => {
    const { id_ruleta_comodin_detalle } = req.body;

    if (!id_ruleta_comodin_detalle) {
        return res.status(400).json({ error: 'Falta el ID del comodín para buscar' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM ruleta_comodin_detalle WHERE id_ruleta_comodin_detalle = $1',
            [id_ruleta_comodin_detalle]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Comodín no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el comodín:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/* **Actualizar un comodín de la ruleta** */
router.put('/update', async (req, res) => {
    const { id_ruleta_comodin_detalle, texto_comodin } = req.body;

    if (!id_ruleta_comodin_detalle || !texto_comodin) {
        return res.status(400).json({ error: 'Faltan datos para actualizar el comodín' });
    }

    try {
        // Verificar si el comodín existe
        const comodinExist = await pool.query(
            'SELECT id_ruleta_comodin_detalle FROM ruleta_comodin_detalle WHERE id_ruleta_comodin_detalle = $1',
            [id_ruleta_comodin_detalle]
        );

        if (comodinExist.rowCount === 0) {
            return res.status(404).json({ error: 'El comodín no existe' });
        }

        // Actualizar el comodín
        await pool.query(
            'UPDATE ruleta_comodin_detalle SET texto_comodin = $1 WHERE id_ruleta_comodin_detalle = $2',
            [texto_comodin, id_ruleta_comodin_detalle]
        );

        res.status(200).json({ message: 'Comodín actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el comodín:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Eliminar un comodín de la ruleta** */
router.delete('/delete', async (req, res) => {
    const { id_ruleta_comodin_detalle } = req.body;

    if (!id_ruleta_comodin_detalle) {
        return res.status(400).json({ error: 'Falta el ID del comodín para eliminar' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM ruleta_comodin_detalle WHERE id_ruleta_comodin_detalle = $1 RETURNING *',
            [id_ruleta_comodin_detalle]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'El comodín no existe' });
        }

        res.status(200).json({ message: 'Comodín eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el comodín:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
