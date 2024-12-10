import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseconfig'; // Asegúrate de que la ruta sea correcta

export default function App() {
  const [userName, setUserName] = useState('Cargando...');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'usuario', 'usuarioperfil');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserName(docSnap.data().nombre);
        } else {
          console.log('No se encontró el documento.');
          setUserName('Documento no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el documento:', error);
        setUserName('Error al cargar');
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <Text style={styles.text}>Nombre: {userName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
