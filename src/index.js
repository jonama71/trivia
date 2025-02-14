require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');  // ✅ Importar cors
const app = express();

// 📌 Configurar CORS para permitir peticiones desde Angular
app.use(cors());
app.use(express.json()); // ✅ Necesario para recibir JSON en las peticiones

// Importación de rutas
const areasRoutes = require('./routes/areas'); // Rutas desde src/routes
const institucionesRoutes = require('./routes/instituciones');
const moduloRoutes = require('./routes/modulo');
const sorteosRoutes = require('./routes/sorteos');
const sorteoDesafioRoutes = require('./routes/sorteo_desafio');
const sorteoTriviaRoutes = require('./routes/sorteo_trivia');
const triviaRoutes = require('./routes/trivia');
const confgTriviaRoutes = require('./routes/configuracion_trivia');
const respuestasPublicoRoutes = require('./routes/respuestas_publico');
const preguntasPublicoRoutes = require('./routes/preguntas_publico');
const videosTriviaRoutes = require('./routes/videos_trivia');
const videosTriviaComodinRoutes = require('./routes/videos_trivia_comodin');
const efectosEspecialesRoutes = require('./routes/efectos_especiales');
const preguntasAreaRoutes = require('./routes/preguntas_area');
const respuestasAreaRoutes = require('./routes/respuestas_area');
const explicacionesAreaRoutes = require('./routes/explicaciones_area');
const ruletasRoutes = require('./routes/ruletas');
const ruletaComodinRoutes = require('./routes/ruleta_comodin_detalle');
const ruletaAreaRoutes = require('./routes/ruleta_area_detalles');
const ruletaTurnoRoutes = require('./routes/ruleta_turno_detalle');
const estadoPartidaRoutes = require('./routes/estado_partida');
const desafioMatematicoRoutes = require('./routes/desafio_matematico');
const confDesafioMatematicoRoutes = require('./routes/configuracion_desafio_mate');
const preguntasDesafioRoutes = require('./routes/preguntas_desafio');
const videosDesMateRoutes = require('./routes/videos_desafio_mate');
const ruletaDesafioRoutes = require('./routes/ruleta_desafio');
const configuracionGeneralRoutes = require('./routes/configuracion_general');
const paginaPrincipalRoutes = require('./routes/pagina_principal');
const relojRoutes = require('./routes/reloj');
const publicidadRoutes = require('./routes/publicidad');
const videosRoutes = require('./routes/videos');




app.use(express.json()); // Middleware para procesar JSON

// Configuracion de rutas
app.use('/api/areas', areasRoutes); // Rutas para áreas
app.use('/api/instituciones', institucionesRoutes);
app.use('/api/modulo', moduloRoutes);
app.use('/api/sorteos', sorteosRoutes);
app.use('/api/sorteo_trivia', sorteoTriviaRoutes);
app.use('/api/sorteo_desafio', sorteoDesafioRoutes);
app.use('/api/trivia', triviaRoutes);
app.use('/api/configuracion_trivia', confgTriviaRoutes);
app.use('/api/respuestas_publico', respuestasPublicoRoutes);
app.use('/api/preguntas_publico', preguntasPublicoRoutes);
app.use('/api/videos_trivia', videosTriviaRoutes);
app.use('/api/videos_trivia_comodin', videosTriviaComodinRoutes);
app.use('/api/efectos_especiales', efectosEspecialesRoutes);
app.use('/api/preguntas_area', preguntasAreaRoutes);
app.use('/api/respuestas_area', respuestasAreaRoutes);
app.use('/api/explicaciones_area', explicacionesAreaRoutes);
app.use('/api/ruletas', ruletasRoutes);
app.use('/api/ruleta_comodin_detalle', ruletaComodinRoutes);
app.use('/api/ruleta_area_detalles', ruletaAreaRoutes);
app.use('/api/ruleta_turno_detalle', ruletaTurnoRoutes);
app.use('/api/estado_partida', estadoPartidaRoutes);
app.use('/api/desafio_matematico', desafioMatematicoRoutes);
app.use('/api/configuracion_desafio_mate', confDesafioMatematicoRoutes);
app.use('/api/preguntas_desafio', preguntasDesafioRoutes);
app.use('/api/videos_desafio_mate', videosDesMateRoutes);
app.use('/api/ruleta_desafio', ruletaDesafioRoutes);
app.use('/api/configuracion_general', configuracionGeneralRoutes);
app.use('/api/pagina_principal', paginaPrincipalRoutes);
app.use('/api/reloj', relojRoutes);
app.use('/api/publicidad', publicidadRoutes);
app.use('/api/videos', videosRoutes);



// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
