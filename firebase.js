const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ruta al archivo de credenciales

// Inicializar Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'trivia-1ac56.firebasestorage.app' // Nombre correcto del bucket
});

// Configurar el bucket
const bucket = admin.storage().bucket();

/**
 * Sube un archivo a Firebase Storage y devuelve la URL pública.
 * @param {Buffer} fileBuffer - Contenido del archivo como Buffer.
 * @param {string} fileName - Nombre del archivo.
 * @param {string} mimeType - Tipo MIME del archivo.
 * @returns {Promise<string>} - URL pública del archivo subido.
 */
const uploadToFirebase = async (fileBuffer, fileName, mimeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const file = bucket.file(`uploads/${Date.now()}_${fileName}`);
            const stream = file.createWriteStream({
                metadata: { contentType: mimeType },
            });

            stream.on('error', (err) => {
                console.error('❌ Error al subir archivo a Firebase:', err);
                reject('Error al subir archivo a Firebase');
            });

            stream.on('finish', async () => {
                try {
                    // ✅ Hacer el archivo público
                    await file.makePublic();
                    // ✅ Obtener URL pública
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                    console.log('✅ Archivo subido correctamente:', publicUrl);
                    resolve(publicUrl);
                } catch (error) {
                    console.error('❌ Error al hacer público el archivo:', error);
                    reject('Error al hacer público el archivo');
                }
            });

            stream.end(fileBuffer);
        } catch (error) {
            console.error('❌ Error en la subida a Firebase:', error);
            reject('Error en la subida a Firebase');
        }
    });
};

module.exports = { uploadToFirebase };