const admin = require('firebase-admin');

// Point to your service account key
const serviceAccount = require('./aicompiler-45c59-firebase-adminsdk-fbsvc-cb7b106f14.json');

// TODO: paste the admin UID here
const uid = 'NbkCsVqvUkZdVbuUNiD8vqHbwkw2';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(' Admin role set for UID:', uid);
    process.exit(0);
  })
  .catch(err => {
    console.error(' Error setting admin claim:', err);
    process.exit(1);
  });
