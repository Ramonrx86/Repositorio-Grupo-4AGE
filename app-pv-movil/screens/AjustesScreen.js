import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#a8e6cf', '#dcedc1']}
      style={styles.container}
    >
      {/* Ajustes de Tema Oscuro/Claro */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tema oscuro / claro</Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => setDarkMode(value)}
        />
      </View>

      {/* Ajustes de Notificaciones */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Notificaciones</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => setNotificationsEnabled(value)}
        />
      </View>

      {/* Ajustes de Tamaño de Letras */}
      <View style={styles.sliderContainer}>
        <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tamaño de letras</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={30}
          step={1}
          value={fontSize}
          onValueChange={(value) => setFontSize(value)}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor={darkMode ? '#fff' : '#000'}
          thumbTintColor="#007AFF"
        />
        <Text style={{ fontSize, color: darkMode ? '#fff' : '#000' }}>Aa</Text>
      </View>

      {/* Botones para Navegación */}
      <Pressable
        style={styles.transparentButton}
        onPress={() => navigation.navigate('./HomeScreen')}
      >
        <Text style={styles.buttonText}>Contacto</Text>
      </Pressable>

      <Pressable
        style={styles.transparentButton}
        onPress={() => navigation.navigate('./HomeScreen')}
      >
        <Text style={styles.buttonText}>Términos y condiciones</Text>
      </Pressable>

      <Pressable
        style={styles.transparentButton}
        onPress={() => navigation.navigate('./HomeScreen.js')}
      >
        <Text style={styles.buttonText}>Información de aplicación</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  sliderContainer: {
    marginVertical: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  transparentButton: {
    paddingVertical: 12,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
