import 'react-native-gesture-handler'; // Mantén esta línea
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importa GestureHandlerRootView

// Importar las pantallas de la app
import MapaScreen from './screens/MapaScreen';
import CalendarioScreen from './screens/CalendarioScreen';
import AjustesScreen from './screens/AjustesScreen';
import NotificacionesScreen from './screens/NotificacionesScreen';
import SplashScreen from './screens/Bienvenida'; // Importar el archivo Bienvenida.js

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const handleSplashFinish = () => {
    setSplashVisible(false); // Oculta la pantalla de bienvenida después del tiempo definido
  };

  const Stack = createNativeStackNavigator(); // Asegúrate de crear el Stack Navigator correctamente

  const TopBar = ({ setActiveScreen }) => (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => setActiveScreen('Ajustes')}>
        <FontAwesome name="cogs" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveScreen('Notificaciones')}>
        <FontAwesome name="bell" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const BottomBar = ({ setActiveScreen }) => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => setActiveScreen('Mapa')}>
        <FontAwesome name="map-marker" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveScreen('Calendario')}>
        <FontAwesome name="calendar" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const HomeScreen = () => {
    const [activeScreen, setActiveScreen] = useState('Mapa');

    const renderActiveScreen = () => {
      switch (activeScreen) {
        case 'Ajustes':
          return <AjustesScreen />;
        case 'Notificaciones':
          return <NotificacionesScreen />;
        case 'Calendario':
          return <CalendarioScreen />;
        default:
          return <MapaScreen />;
      }
    };

    return (
      <View style={styles.container}>
        <TopBar setActiveScreen={setActiveScreen} />  {/* Barra superior fija */}
        <View style={styles.content}>{renderActiveScreen()}</View>  {/* Contenido dinámico */}
        <BottomBar setActiveScreen={setActiveScreen} />  {/* Barra inferior fija */}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Oculta la cabecera en las pantallas
            animationEnabled: true, // Habilita animación para las transiciones entre pantallas
            gestureEnabled: true, // Habilita gestos de deslizamiento
          }}
        >
          {isSplashVisible ? (
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} // Aquí pasamos el componente directamente
              initialParams={{ onFinish: handleSplashFinish }} // Si es necesario pasar parámetros
            />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// Estilos de la app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',  // Fondo verde igual que las barras
  },
  topBar: {
    height: 60,  // Ajusta la altura de la barra superior
    backgroundColor: '#4CAF50',  // Color de fondo de la barra
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,  // Ajuste para no interferir con los iconos del sistema
    borderBottomWidth: 2, // Borde inferior
    borderBottomColor: '#388E3C', // Color del borde (más oscuro que el verde)
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',  // Asegura que el contenido se alineé desde el inicio
    alignItems: 'center',
    marginTop: 0,  // Elimina el margen superior adicional
  },
  bottomBar: {
    height: 60,  // Ajusta la altura de la barra inferior
    backgroundColor: '#4CAF50',  // Color de fondo de la barra
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 0, // Elimina cualquier margen adicional debajo de la barra inferior
    borderTopWidth: 2, // Borde superior
    borderTopColor: '#388E3C', // Color del borde (más oscuro que el verde)
  },
});

export default App;