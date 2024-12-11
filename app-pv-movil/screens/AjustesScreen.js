import React, { useState, useEffect } from 'react'; // Hook para gestionar el estado
import Colors from './Colorstyle'; // Colores personalizados
import { View, Text, Switch, StyleSheet, Dimensions, Button, ScrollView } from 'react-native'; // Componentes de React Native
import Slider from '@react-native-community/slider'; // Componente deslizante para ajustar el tamaño de fuente
import { LinearGradient } from 'expo-linear-gradient'; // Gradiente de color para el fondo

// Componente SettingsScreen donde se configuran los ajustes de la aplicación
export default function SettingsScreen({ navigation }) {
  // Declaración de estados con useState
  const [darkMode, setDarkMode] = useState(false); // Estado para tema oscuro/claro
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado para habilitar/deshabilitar notificaciones
  const [fontSize, setFontSize] = useState(14); // Estado para el tamaño de la fuente
  const [displayedFontSize, setDisplayedFontSize] = useState(fontSize); // Estado para mostrar el tamaño de fuente actual
  const [highContrast, setHighContrast] = useState(false); // Estado para habilitar/deshabilitar alto contraste
  const [notificationsSound, setNotificationsSound] = useState(false); // Estado para habilitar sonido de notificaciones
  const [notificationsVibration, setNotificationsVibration] = useState(false); // Estado para habilitar vibración en notificaciones

  const [primaryColor, setPrimaryColor] = useState(Colors.primary); // Estado para el color primario de la app

  // useEffect para cambiar el color primario dependiendo del tema
  useEffect(() => {
    // Cambiar el color primario según el tema seleccionado (oscuro o claro)
    if (darkMode) {
      setPrimaryColor('#fff000'); // Color para tema oscuro
    } else {
      setPrimaryColor('#11a3ff'); // Color para tema claro
    }
  }, [darkMode]); // El efecto se ejecuta cuando el estado darkMode cambia

  // Estilo para deshabilitar las opciones si las notificaciones están desactivadas
  const disabledStyle = notificationsEnabled ? {} : { opacity: 0.5 }; 
  const disabledSwitch = notificationsEnabled ? {} : { disabled: true }; 

  // Función para manejar el guardado de configuraciones
  const handleSave = () => {
    alert('Configuraciones guardadas!');
  };

  return (
    <LinearGradient
      colors={darkMode ? ['#232526', '#414345'] : ['#f5f5f5', '#f5f5f5']} // Gradiente de fondo según el tema
      style={styles.gradientBackground} // Aplicar estilos del fondo gradiente
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}> {/* Permite hacer scroll en la pantalla */}
        {/* Fila para el interruptor del Tema Oscuro/Claro */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tema oscuro / claro</Text> {/* Texto con color condicionado al tema */}
          <Switch
            value={darkMode} // El valor del interruptor depende de darkMode
            onValueChange={(value) => setDarkMode(value)} // Actualiza el estado darkMode cuando cambia el interruptor
            thumbColor={darkMode ? '#fff' : primaryColor} // Color del pulgar del interruptor
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Color de la pista cuando está apagado o encendido
          />
        </View>

        {/* Fila para el interruptor de Alto Contraste */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Alto contraste</Text>
          <Switch
            value={highContrast} // El valor depende del estado highContrast
            onValueChange={(value) => setHighContrast(value)} // Actualiza el estado highContrast
            thumbColor={highContrast ? '#000' : primaryColor} // Color del pulgar cuando está activado o no
            trackColor={{ false: '#767577', true: '#ffeb3b' }} // Color de la pista cuando está apagado o encendido
          />
        </View>

        {/* Fila para el interruptor de Notificaciones */}
        <View style={styles.settingRow}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Notificaciones</Text>
          <Switch
            value={notificationsEnabled} // El valor depende de notificationsEnabled
            onValueChange={(value) => setNotificationsEnabled(value)} // Cambia el estado de las notificaciones
            thumbColor={darkMode ? '#fff' : primaryColor} // Color del pulgar dependiendo del tema
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Color de la pista
          />
        </View>

        {/* Fila para el interruptor de Sonido de Notificaciones, deshabilitado si las notificaciones están apagadas */}
        <View style={[styles.settingRow, disabledStyle]}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Sonido de notificaciones</Text>
          <Switch
            value={notificationsSound} // El valor depende de notificationsSound
            onValueChange={(value) => setNotificationsSound(value)} // Cambia el estado de sonido
            thumbColor={darkMode ? '#fff' : primaryColor} // Color del pulgar
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Color de la pista
            {...disabledSwitch} // Deshabilita el interruptor si notificationsEnabled es falso
          />
        </View>

        {/* Fila para el interruptor de Vibración en Notificaciones, deshabilitado si las notificaciones están apagadas */}
        <View style={[styles.settingRow, disabledStyle]}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Vibración en notificaciones</Text>
          <Switch
            value={notificationsVibration} // El valor depende de notificationsVibration
            onValueChange={(value) => setNotificationsVibration(value)} // Cambia el estado de vibración
            thumbColor={darkMode ? '#fff' : primaryColor} // Color del pulgar
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Color de la pista
            {...disabledSwitch} // Deshabilita el interruptor si notificationsEnabled es falso
          />
        </View>

        {/* Ajuste de Tamaño de Letras utilizando un Slider */}
        <View style={styles.sliderContainer}>
          <Text style={[styles.label, { color: darkMode ? '#fff' : '#000' }]}>Tamaño de letras</Text>
          <Slider
            style={styles.slider} // Aplica el estilo del slider
            minimumValue={10} // Valor mínimo del slider
            maximumValue={30} // Valor máximo del slider
            step={2} // Paso entre valores
            value={fontSize} // Valor inicial del slider
            onValueChange={(value) => setDisplayedFontSize(value)} // Muestra el valor del tamaño en tiempo real
            onSlidingComplete={(value) => setFontSize(value)} // Guarda el valor cuando el usuario deja de deslizar
            minimumTrackTintColor={primaryColor} // Color del track cuando el valor es mínimo
            maximumTrackTintColor={darkMode ? '#fff' : '#000'} // Color del track cuando el valor es máximo
            thumbTintColor={primaryColor} // Color del pulgar
          />
          <Text style={{ fontSize: displayedFontSize, color: darkMode ? '#fff' : '#000' }}>Aa</Text>
        </View>

        {/* Botón de Guardar */}
        <View style={styles.buttonSpacing}>
          <Button title="Guardar" onPress={handleSave} color={primaryColor} /> {/* Botón para guardar ajustes */}
        </View>
      </ScrollView>
    </LinearGradient> // Fondo con gradiente
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: Dimensions.get('window').width, // Ancho de la pantalla
    height: Dimensions.get('window').height, // Alto de la pantalla
    paddingHorizontal: 20, // Espaciado horizontal
    paddingVertical: 40, // Espaciado vertical
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  settingRow: {
    flexDirection: 'row', // Organiza los elementos en fila
    justifyContent: 'space-between', // Espacio entre los elementos
    alignItems: 'center', // Alineación vertical
    marginBottom: 20,
  },
  label: {
    fontSize: 16, // Tamaño del texto
    fontWeight: '500', // Peso de la fuente
  },
  sliderContainer: {
    marginVertical: 20,
    alignItems: 'center', // Centra los elementos del slider
  },
  slider: {
    width: '100%', // Ancho del slider
    height: 40, // Alto del slider
  },
  buttonSpacing: {
    marginBottom: 10, // Espaciado inferior para el botón
  }
});
