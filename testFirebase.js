const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "trivia-1ac56.firebasestorage.app",
});

const bucket = admin.storage().bucket();

(async () => {
    try {
        const [files] = await bucket.getFiles();
        console.log('Archivos en el bucket:', files.map(file => file.name));
    } catch (err) {
        console.error('Error al conectar con el bucket:', err.message);
    }
})();
