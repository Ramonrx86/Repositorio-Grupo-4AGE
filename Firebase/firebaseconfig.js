// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAjAOfZggHwQcmIg2i993-w2cQ3FCuTUrI",
  authDomain: "pruebas-afd27.firebaseapp.com",
  projectId: "pruebas-afd27",
  storageBucket: "pruebas-afd27.appspot.com", // Cambié el dominio incorrecto
  messagingSenderId: "822219643086",
  appId: "1:822219643086:web:530577f886267f43d0589f",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios adicionales
export const db = getFirestore(app); // Firestore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Autenticación
});
