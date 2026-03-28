import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    let count = 0;
    for (const document of querySnapshot.docs) {
        await deleteDoc(doc(db, "products", document.id));
        count++;
    }
    console.log(`Deleted ${count} products.`);
    process.exit(0);
}

deleteAllProducts().catch(err => {
    console.error(err);
    process.exit(1);
});
