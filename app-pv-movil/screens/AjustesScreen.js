import React, { useState, useEffect } from 'react';
import Colors from './Colorstyle';
import { View, Text, Switch, StyleSheet, Dimensions, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [displayedFontSize, setDisplayedFontSize] = useState(fontSize);
  const [highContrast, setHighContrast] = useState(false);
  const [notificationsSound, setNotificationsSound] = useState(false);
  const [notificationsVibration, setNotificationsVibration] = useState(false);

  const [primaryColor, setPrimaryColor] = useState(Colors.primary);

  useEffect(() => {
    // Cambiar el color primario cuando cambie el tema
    if (darkMode) {
      setPrimaryColor('#fff000'); // Color para tema oscuro
    } else {
      setPrimaryColor('#11a3ff'); // Color para tema claro
    }
  }, [darkMode]); // El efecto se ejecutará cada vez que cambie darkMode

  const disabledStyle = notificationsEnabled ? {} : { opacity: 0.5 };
  const disabledSwitch = notificationsEnabled ? {} : { disabled: true };

  const handleSave = () => {
    alert('Configuraciones guardadas!');
  };

  return (
    <LinearGradient
      colors={darkMode ? ['#232526', '#414345'] : ['#f5f5f5', '#f5f5f5']}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Ajustes de Tema Oscuro/Claro */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tema oscuro / claro</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => setDarkMode(value)}
            thumbColor={darkMode ? '#fff' : primaryColor}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Ajustes de Alto Contraste */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Alto contraste</Text>
          <Switch
            value={highContrast}
            onValueChange={(value) => setHighContrast(value)}
            thumbColor={highContrast ? '#000' : primaryColor}
            trackColor={{ false: '#767577', true: '#ffeb3b' }}
          />
        </View>

        {/* Ajustes de Notificaciones */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            thumbColor={darkMode ? '#fff' : primaryColor}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {/* Notificaciones Sonoras */}
        <View style={[styles.settingRow, disabledStyle]}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Sonido de notificaciones</Text>
          <Switch
            value={notificationsSound}
            onValueChange={(value) => setNotificationsSound(value)}
            thumbColor={darkMode ? '#fff' : primaryColor}
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
            thumbColor={darkMode ? '#fff' : primaryColor}
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
            step={2}
            value={fontSize}
            onValueChange={(value) => setDisplayedFontSize(value)}
            onSlidingComplete={(value) => setFontSize(value)}
            minimumTrackTintColor={primaryColor}
            maximumTrackTintColor={darkMode ? '#fff' : '#000'}
            thumbTintColor={primaryColor}
          />
          <Text style={{ fontSize: displayedFontSize, color: darkMode ? '#fff' : '#000' }}>Aa</Text>
        </View>

        {/* Botón Guardar */}
        <View style={styles.buttonSpacing}>
          <Button title="Guardar" onPress={handleSave} color={primaryColor} />
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
    paddingBottom: 40,
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
    marginBottom: 10,
  }
});
