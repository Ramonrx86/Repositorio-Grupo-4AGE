import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function TerminosCScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Términos y condiciones</Text>

        <Text style={styles.sectionTitle}>1. Aceptación</Text>
        <Text style={styles.text}>
          Al usar esta aplicación, aceptas estos Términos y Condiciones. Si no estás de acuerdo, por favor, no utilices la app.
        </Text>

        <Text style={styles.sectionTitle}>2. Uso de la Aplicación</Text>
        <Text style={styles.text}>
          La app está diseñada para ayudar en la gestión de residuos. El uso es personal y no comercial.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacidad</Text>
        <Text style={styles.text}>
          La app puede solicitar información personal para gestionar tus solicitudes. Tus datos serán tratados de acuerdo
          con la Ley de Protección de Datos Personales N°19.628 y no se compartirán con terceros sin tu consentimiento.
        </Text>

        <Text style={styles.sectionTitle}>4. Geolocalización</Text>
        <Text style={styles.text}>
          La app utiliza tu ubicación para mostrarte puntos verdes cercanos. Puedes desactivar esta función en cualquier
          momento desde los ajustes de tu dispositivo.
        </Text>

        <Text style={styles.sectionTitle}>5. Responsabilidad</Text>
        <Text style={styles.text}>
          No garantizamos que la app esté siempre disponible o libre de errores. El uso de la app es bajo tu propio riesgo.
        </Text>

        <Text style={styles.sectionTitle}>6. Actualizaciones</Text>
        <Text style={styles.text}>
          Nos reservamos el derecho de modificar estos términos. Revisa esta sección periódicamente para estar al tanto de los cambios.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#41a3ff',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#41a3ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#41a3ff',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
});
