// firebase.js (or similar)
const admin = require('firebase-admin');
const serviceAccount = require("../../config/firebaseAdminKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'telekom-f3eb5.appspot.com',
});

module.exports = admin;
