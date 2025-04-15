import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import 'server-only'

const decodedKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64!, 'base64').toString('utf-8');

export const FirebaseCert = cert({
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodedKey,
  projectId: process.env.FIREBASE_PROJECT_ID
});

if (!getApps().length) {
  initializeApp({
    credential: FirebaseCert,
    //storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
}

export const db = getFirestore();