const admin = require('firebase-admin');

let isInitialized = false;

function initFirebase() {
    if (!isInitialized) {
        console.log('Initializing Firebase Admin...');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                storageBucket: process.env.STORAGE_BUCKET
            });
        }
        isInitialized = true;
    }
    return admin;
}

function getDb() {
    initFirebase();
    return admin.firestore();
}

module.exports = {
    get db() { return getDb(); },
    get admin() { return initFirebase(); }
};
