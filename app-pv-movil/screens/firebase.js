import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { getFirestore } from 'firebase/firestore'; // Importar Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAimw7BfP5YLfq2fUHMa4RZkqWCsLToTZQ",
  authDomain: "puntosgps-b63fc.firebaseapp.com",
  projectId: "puntosgps-b63fc",
  storageBucket: "puntosgps-b63fc.firebasestorage.app",
  messagingSenderId: "471767498606",
  appId: "1:471767498606:web:fd72481dd50785c8f84b7f",
  measurementId: "G-26RFBXYL5X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Firebase Authentication con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage) // Usar AsyncStorage para persistir el estado de autenticación
});

// Inicializar Firestore
const db = getFirestore(app);

export { auth, db };
