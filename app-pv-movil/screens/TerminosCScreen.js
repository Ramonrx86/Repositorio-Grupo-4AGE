import React from 'react';
import { StyleSheet, Text, ScrollView, SafeAreaView, View, TouchableOpacity } from 'react-native';
import Colors from './Colorstyle'; // Archivo de colores

export default function TerminosCScreen() {
  const tips = [
    {
      title: 'Términos y condiciones de Uso',
      content: 'Al usar esta aplicación, aceptas estos Términos y Condiciones. Si no estás de acuerdo, por favor, no utilices la app.',
    },
    {
      title: 'Uso de la Aplicación',
      content: 'La app está diseñada para ayudar en la gestión de residuos. El uso es personal y no comercial.',
    },
    {
      title: 'Privacidad',
      content: 'La app puede solicitar información personal para gestionar tus solicitudes. Tus datos serán tratados de acuerdo con la Ley de Protección de Datos Personales N°19.628.',
    },
    {
      title: 'Geolocalización',
      content: 'La app utiliza tu ubicación para mostrarte puntos verdes cercanos. Puedes desactivar esta función en cualquier momento desde los ajustes de tu dispositivo.',
    },
    {
      title: 'Responsabilidad',
      content: 'No garantizamos que la app esté siempre disponible o libre de errores. El uso de la app es bajo tu propio riesgo.',
    },
    {
      title: 'Actualizaciones',
      content: 'Nos reservamos el derecho de modificar estos términos. Revisa esta sección periódicamente para estar al tanto de los cambios.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        overScrollMode="always"
      >
        <Text style={styles.title}>Términos y condiciones</Text>

        {tips.map((item, index) => (
          <TouchableOpacity key={index} activeOpacity={0.8}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.fondo,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cardContent: {
    fontSize: 16,
    color: '#666',
  },
});


