import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplace estos valores con el firebaseConfig de su proyecto
// (Consola de Firebase → Configuración del proyecto → Tus apps → Web)
const firebaseConfig = {
  apiKey: "AIzaSyBH948Mplayt8TAIiCGmsdOh92rwtGo-kA",
  authDomain: "tiendavirtualkristing.firebaseapp.com",
  projectId: "tiendavirtualkristing",
  storageBucket: "tiendavirtualkristing.firebasestorage.app",
  messagingSenderId: "829396083823",
  appId: "1:829396083823:web:214ac8c1dfddb7253cd99a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
