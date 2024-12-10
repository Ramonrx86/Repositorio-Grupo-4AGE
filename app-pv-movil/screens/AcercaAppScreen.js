import React from 'react';
import Colors from './Colorstyle';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function AcercaAppScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Información de la aplicación</Text>

        <Text style={styles.text}>Nombre de la App: Gestión de Residuos.</Text>
        <Text style={styles.text}>Versión: 1.0.0</Text>
        <Text style={styles.text}>Fabricante:</Text>
        <Text style={styles.text}>Representante Legal:</Text>
        <Text style={styles.text}>Compatibilidad: Disponible para dispositivos móviles iOS y Android.</Text>
        <Text style={styles.text}>
          Privacidad: No requiere registro. Los datos proporcionados son utilizados únicamente para gestionar solicitudes y servicios.
        </Text>
        <Text style={styles.text}>Contacto: Para consultas o soporte, contáctanos.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondo, 

  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
});
