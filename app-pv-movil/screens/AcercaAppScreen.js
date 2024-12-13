import React from 'react';
import Colors from './Colorstyle';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

// Componente principal que muestra la información de la app
export default function AcercaAppScreen() {
  return (
    <View style={styles.container}> {/* Contenedor principal */}
      <ScrollView contentContainerStyle={styles.scrollContent}> {/* Permite hacer scroll */}
        <Text style={styles.title}>Información de la aplicación</Text> {/* Título principal */}
        
        {/* Información estática de la app */}
        <Text style={styles.text}>Nombre de la App: Gestión de Residuos.</Text>
        <Text style={styles.text}>Versión: 1.0.0</Text>
        <Text style={styles.text}>Fabricante:</Text>
        <Text style={styles.text}>Representante Legal:</Text>
        <Text style={styles.text}>Compatibilidad: Disponible para dispositivos iOS y Android.</Text>
        <Text style={styles.text}>Privacidad: No requiere registro.</Text>
        <Text style={styles.text}>Contacto: Para consultas, contáctanos.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio
    backgroundColor: Colors.fondo, // Fondo personalizado
  },
  scrollContent: {
    padding: 20, // Espaciado dentro del ScrollView
  },
  title: {
    fontSize: 24, // Tamaño de texto grande para el título
    fontWeight: 'bold', // Negrita
    marginBottom: 10, // Espacio inferior
    color: Colors.primary, // Color personalizado
    textAlign: 'center', // Centrado
  },
  text: {
    fontSize: 16, // Tamaño de texto normal
    lineHeight: 24, // Espaciado de línea
    color: '#333', // Color gris oscuro
    marginBottom: 10, // Espacio inferior
  },
});
