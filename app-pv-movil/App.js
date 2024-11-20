import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar las pantallas de la app
import MapaScreen from './screens/MapaScreen';
import CalendarioScreen from './screens/CalendarioScreen';
import AjustesScreen from './screens/AjustesScreen';
import NotificacionesScreen from './screens/NotificacionesScreen';
import ReciclaScreen from './screens/ReciclaScreen';
import DenunciasScreen from './screens/DenunciasScreen';
import SplashScreen from './screens/Bienvenida';
import AcercaAppScreen from './screens/AcercaAppScreen';
import TerminosCScreen from './screens/TerminosCScreen';
import ContactoScreen from './screens/ContactoScreen';
import AyudaScreen from './screens/AyudaScreen';

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para el menú desplegable
  const [activeScreen, setActiveScreen] = useState('Mapa'); // Pantalla activa
  const [lastScreen, setLastScreen] = useState('Mapa'); // Guarda la última pantalla seleccionada

  const handleSplashFinish = () => {
    setSplashVisible(false); // Oculta la pantalla de bienvenida después del tiempo definido
  };

  const Stack = createNativeStackNavigator();

  const TopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => { 
        setActiveScreen('Notificaciones'); 
        setLastScreen('Notificaciones'); // Guarda la pantalla seleccionada
        setMenuVisible(false); // Cierra el menú cuando se selecciona una opción
      }}>
        <FontAwesome name="bell" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
        <FontAwesome name="bars" size={24} color="white" />
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity onPress={() => handleMenuItemPress('Ajustes')}>
            <Text style={styles.menuItem}>Configuraciones</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('AcercaApp')}>
            <Text style={styles.menuItem}>Acerca de la App</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('TerminosC')}>
            <Text style={styles.menuItem}>Términos y Condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Contacto')}>
            <Text style={styles.menuItem}>Contacto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleMenuItemPress('Ayuda')}>
            <Text style={styles.menuItem}>Ayuda</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => { 
        if (lastScreen !== 'Mapa') {
          setActiveScreen('Mapa'); 
          setLastScreen('Mapa');
        }
        setMenuVisible(false); 
      }}>
        <FontAwesome name="map-marker" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { 
        if (lastScreen !== 'Recicla') {
          setActiveScreen('Recicla');
          setLastScreen('Recicla');
        }
        setMenuVisible(false); 
      }}>
        <FontAwesome name="leaf" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { 
        if (lastScreen !== 'Calendario') {
          setActiveScreen('Calendario');
          setLastScreen('Calendario');
        }
        setMenuVisible(false); 
      }}>
        <FontAwesome name="calendar" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { 
        if (lastScreen !== 'Denuncias') {
          setActiveScreen('Denuncias');
          setLastScreen('Denuncias');
        }
        setMenuVisible(false); 
      }}>
        <FontAwesome name="exclamation-triangle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const handleMenuItemPress = (screen) => {
    if (screen !== activeScreen) {
      setActiveScreen(screen);
      setLastScreen(screen); // Guarda la última pantalla seleccionada
    }
    setMenuVisible(false); // Cierra el menú después de seleccionar una opción
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Ajustes':
        return <AjustesScreen />;
      case 'Notificaciones':
        return <NotificacionesScreen />;
      case 'Recicla':
        return <ReciclaScreen />;
      case 'Denuncias':
        return <DenunciasScreen />;
      case 'Calendario':
        return <CalendarioScreen />;
      case 'AcercaApp':
        return <AcercaAppScreen />;
      case 'TerminosC':
        return <TerminosCScreen />;
      case 'Contacto':
        return <ContactoScreen />;
      case 'Ayuda':
        return <AyudaScreen />;
      default:
        return <MapaScreen />;
    }
  };

  const HomeScreen = () => {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.content}>
          {renderActiveScreen()}
        </View>
        {menuVisible && (
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
        <BottomBar />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: true,
          }}
        >
          {isSplashVisible ? (
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              initialParams={{ onFinish: handleSplashFinish }}
            />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  topBar: {
    height: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#388E3C',
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    padding: 10,
    zIndex: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#388E3C',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
  }
});

export default App;








