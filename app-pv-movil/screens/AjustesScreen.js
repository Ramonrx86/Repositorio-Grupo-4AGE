import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [displayedFontSize, setDisplayedFontSize] = useState(fontSize);  // Estado temporal
  const [highContrast, setHighContrast] = useState(false);
  const [notificationsSound, setNotificationsSound] = useState(false);  // Notificaciones sonoras
  const [notificationsVibration, setNotificationsVibration] = useState(false);  // Vibración

  const disabledStyle = notificationsEnabled ? {} : { opacity: 0.5 };
  const disabledSwitch = notificationsEnabled ? {} : { disabled: true };

  return (
    <LinearGradient
      colors={darkMode ? ['#232526', '#414345'] : ['#a8e6cf', '#dcedc1']}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Ajustes de Tema Oscuro/Claro */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tema oscuro / claro</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => setDarkMode(value)}
            thumbColor={darkMode ? '#fff' : '#007AFF'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Ajustes de Alto Contraste */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Alto contraste</Text>
          <Switch
            value={highContrast}
            onValueChange={(value) => setHighContrast(value)}
            thumbColor={highContrast ? '#000' : '#007AFF'}
            trackColor={{ false: '#767577', true: '#ffeb3b' }}
          />
        </View>

        {/* Ajustes de Notificaciones */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            thumbColor={darkMode ? '#fff' : '#007AFF'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Notificaciones Sonoras */}
        <View style={[styles.settingRow, disabledStyle]}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Sonido de notificaciones</Text>
          <Switch
            value={notificationsSound}
            onValueChange={(value) => setNotificationsSound(value)}
            thumbColor={darkMode ? '#fff' : '#007AFF'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            {...disabledSwitch}
          />
        </View>

        {/* Vibración en Notificaciones */}
        <View style={[styles.settingRow, disabledStyle]}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Vibración en notificaciones</Text>
          <Switch
            value={notificationsVibration}
            onValueChange={(value) => setNotificationsVibration(value)}
            thumbColor={darkMode ? '#fff' : '#007AFF'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            {...disabledSwitch}
          />
        </View>

        {/* Ajustes de Tamaño de Letras */}
        <View style={styles.sliderContainer}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tamaño de letras</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={30}
            step={2}  // Incremento de 2 para 10 niveles
            value={fontSize}
            onValueChange={(value) => setDisplayedFontSize(value)}  // Actualiza el estado temporal mientras se desliza
            onSlidingComplete={(value) => setFontSize(value)}  // Ajusta el tamaño final al completar
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor={darkMode ? '#fff' : '#000'}
            thumbTintColor="#007AFF"
          />
          <Text style={{ fontSize: displayedFontSize, color: darkMode ? '#fff' : '#000' }}>Aa</Text>
        </View>

        {/* Sección de Información adicional */}
        <View style={styles.infoSection}>
          <Button title="Acerca de la App" onPress={() => navigation.navigate('AboutApp')} />
          <View style={styles.buttonSpacing} />
          <Button title="Términos y Condiciones" onPress={() => navigation.navigate('TermsConditions')} />
          <View style={styles.buttonSpacing} />
          <Button title="contacto" onPress={() => navigation.navigate('contacto')} />
          <View style={styles.buttonSpacing} />
          <Button title="Ayuda" onPress={() => navigation.navigate('Help')} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 40,  // Para permitir espacio para deslizar al final
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  sliderContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  infoSection: {
    marginTop: 30,
  },
  buttonSpacing: {
    marginBottom: 10, // Espacio entre los botones
  }
});
