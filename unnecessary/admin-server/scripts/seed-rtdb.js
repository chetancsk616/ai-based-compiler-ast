/*
 * Seed Firebase Realtime Database with questions and logic JSON.
 * Requires a service account credential (provide via FIREBASE_SERVICE_ACCOUNT_BASE64 or GOOGLE_APPLICATION_CREDENTIALS).
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const admin = require('firebase-admin');

function getCredentials() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (base64) {
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json);
  }

  if (credsPath) {
    const absPath = path.isAbsolute(credsPath)
      ? credsPath
      : path.join(process.cwd(), credsPath);
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  }

  throw new Error(
    'Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const credential = admin.credential.cert(getCredentials());
  const databaseURL =
    process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseURL) {
    throw new Error('FIREBASE_DATABASE_URL is required for Realtime Database.');
  }

  return admin.initializeApp({ credential, databaseURL });
}

function loadQuestions() {
  const questionsPath = path.resolve(
    __dirname,
    '..',
    '..',
    'client',
    'src',
    'questions.json'
  );
  const { questions } = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  const byId = {};
  for (const q of questions) {
    byId[String(q.id)] = q;
  }
  return byId;
}

function loadLogic() {
  const logicDir = path.resolve(__dirname, '..', 'logic');
  const indexPath = path.join(logicDir, 'index.json');
  const logicIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  const detail = {};
  const files = fs.readdirSync(logicDir).filter((f) => f.match(/^Q\d{3}\.json$/));
  for (const file of files) {
    const id = file.replace('.json', '');
    const fullPath = path.join(logicDir, file);
    detail[id] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  }

  return { logicIndex, logicDetail: detail };
}

async function main() {
  try {
    initFirebase();
    const db = admin.database();

    const questions = loadQuestions();
    const { logicIndex, logicDetail } = loadLogic();

    await db.ref().update({
      questions,
      logicIndex,
      logicDetail,
    });

    console.log('Realtime Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed Realtime Database:', err.message);
    process.exit(1);
  }
}

main();
