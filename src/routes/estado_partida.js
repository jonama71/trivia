const express = require('express');
const pool = require('../../connection');
const router = express.Router();

/** 📌 **Crear un estado de partida** */
router.post('/add', async (req, res) => {
    const { id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul } = req.body;

    if (!id_ruleta_turno_detalle || !id_equipo_rojo || !id_equipo_azul) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        const newEstado = await pool.query(
            `INSERT INTO estado_partida 
            (id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul, contador_preguntas, puntos_equipo_rojo, puntos_equipo_azul) 
            VALUES ($1, $2, $3, 0, 0, 0) 
            RETURNING *`,
            [id_ruleta_turno_detalle, id_equipo_rojo, id_equipo_azul]
        );

        res.status(201).json(newEstado.rows[0]);
    } catch (err) {
        console.error('Error al agregar el estado de la partida:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Obtener todos los estados de partida** */
router.get('/get', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.id_estado, e.id_ruleta_turno_detalle, r.texto AS ruleta, 
                   e.id_equipo_rojo, e.id_equipo_azul, 
                   e.contador_preguntas, e.puntos_equipo_rojo, e.puntos_equipo_azul
            FROM estado_partida e
            JOIN ruleta_turno_detalle r ON e.id_ruleta_turno_detalle = r.id_ruleta_turno_detalle
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los estados de partida:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Obtener estado de partida por ID (Desde el Body)** */
router.post('/getById', async (req, res) => {
    const { id_estado } = req.body;

    if (!id_estado) {
        return res.status(400).json({ error: 'Falta el ID del estado de partida para buscar' });
    }

    try {
        const result = await pool.query(`
            SELECT e.id_estado, e.id_ruleta_turno_detalle, r.texto AS ruleta, 
                   e.id_equipo_rojo, e.id_equipo_azul, 
                   e.contador_preguntas, e.puntos_equipo_rojo, e.puntos_equipo_azul
            FROM estado_partida e
            JOIN ruleta_turno_detalle r ON e.id_ruleta_turno_detalle = r.id_ruleta_turno_detalle
            WHERE e.id_estado = $1
        `, [id_estado]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Estado de partida no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener el estado de partida:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Actualizar puntos y contador de preguntas** */
router.put('/update', async (req, res) => {
    const { id_estado, contador_preguntas, puntos_equipo_rojo, puntos_equipo_azul } = req.body;

    if (!id_estado) {
        return res.status(400).json({ error: 'Falta el ID del estado de partida para actualizar' });
    }

    try {
        // Obtener datos actuales
        const estadoExist = await pool.query('SELECT * FROM estado_partida WHERE id_estado = $1', [id_estado]);

        if (estadoExist.rowCount === 0) {
            return res.status(404).json({ error: 'El estado de partida no existe' });
        }

        // Mantener valores actuales si no se envían nuevos valores
        const newContador = contador_preguntas !== undefined ? contador_preguntas : estadoExist.rows[0].contador_preguntas;
        const newPuntosRojo = puntos_equipo_rojo !== undefined ? puntos_equipo_rojo : estadoExist.rows[0].puntos_equipo_rojo;
        const newPuntosAzul = puntos_equipo_azul !== undefined ? puntos_equipo_azul : estadoExist.rows[0].puntos_equipo_azul;

        await pool.query(
            `UPDATE estado_partida 
            SET contador_preguntas = $1, puntos_equipo_rojo = $2, puntos_equipo_azul = $3 
            WHERE id_estado = $4`,
            [newContador, newPuntosRojo, newPuntosAzul, id_estado]
        );

        res.status(200).json({ message: 'Estado de partida actualizado correctamente' });
    } catch (err) {
        console.error('Error al actualizar el estado de partida:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/** 📌 **Eliminar un estado de partida** */
router.delete('/delete', async (req, res) => {
    const { id_estado } = req.body;

    if (!id_estado) {
        return res.status(400).json({ error: 'Falta el ID del estado de partida para eliminar' });
    }

    try {
        const result = await pool.query('DELETE FROM estado_partida WHERE id_estado = $1 RETURNING *', [id_estado]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Estado de partida no encontrado' });
        }

        res.status(200).json({ message: 'Estado de partida eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el estado de partida:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
