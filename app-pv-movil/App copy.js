import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, FlatList, Text, TouchableWithoutFeedback, Dimensions, StatusBar, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [activeScreen, setActiveScreen] = useState('Home');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const menuTranslateX = useState(new Animated.Value(-Dimensions.get('window').width))[0];

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setSplashVisible(false);
    }, 3000);

    return () => clearTimeout(splashTimeout);
  }, []);

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(menuTranslateX, {
        toValue: -Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(menuTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const TopBar = () => (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <FontAwesome name="bars" size={24} color={activeScreen === 'Home' ? '#FFD700' : 'white'} />
          <Text style={[styles.iconText, { color: activeScreen === 'Home' ? '#FFD700' : 'white' }]}>Menú</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen('Notificaciones')} style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color={activeScreen === 'Notificaciones' ? '#FFD700' : 'white'} />
          <Text style={[styles.iconText, { color: activeScreen === 'Notificaciones' ? '#FFD700' : 'white' }]}>Notificaciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity 
        onPress={() => setActiveScreen('Mapa')} 
        style={styles.iconButton}
      >
        <FontAwesome 
          name="map-marker" 
          size={24} 
          color={activeScreen === 'Mapa' ? '#FFD700' : 'white'} // Color dorado cuando es la pestaña activa
        />
        <Text style={styles.iconText}>Mapa</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setActiveScreen('Recicla')} 
        style={styles.iconButton}
      >
        <FontAwesome 
          name="leaf" 
          size={24} 
          color={activeScreen === 'Recicla' ? '#FFD700' : 'white'} // Color dorado cuando es la pestaña activa
        />
        <Text style={styles.iconText}>Recicla</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setActiveScreen('Calendario')} 
        style={styles.iconButton}
      >
        <FontAwesome 
          name="calendar" 
          size={24} 
          color={activeScreen === 'Calendario' ? '#FFD700' : 'white'} // Color dorado cuando es la pestaña activa
        />
        <Text style={styles.iconText}>Calendario</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setActiveScreen('Denuncias')} 
        style={styles.iconButton}
      >
        <FontAwesome 
          name="exclamation-triangle" 
          size={24} 
          color={activeScreen === 'Denuncias' ? '#FFD700' : 'white'} // Color dorado cuando es la pestaña activa
        />
        <Text style={styles.iconText}>Denuncias</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <MapaScreen />;
      case 'Mapa':
        return <MapaScreen />;
      case 'Recicla':
        return <ReciclaScreen />;
      case 'Calendario':
        return <CalendarioScreen />;
      case 'Denuncias':
        return <DenunciasScreen />;
      case 'Ajustes':
        return <AjustesScreen />;
      case 'Notificaciones':
        return <NotificacionesScreen />;
      case 'AcercaApp':
        return <AcercaAppScreen />;
      case 'TerminosC':
        return <TerminosCScreen />;
      case 'Contacto':
        return <ContactoScreen />;
      default:
        return <MapaScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
      {isSplashVisible ? (
        <SplashScreen />
      ) : (
        <>
          <TopBar />
          <View style={styles.content}>
            {renderScreen()}
          </View>
          <BottomBar />
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: menuTranslateX }] },
            ]}
          >
            <TouchableWithoutFeedback onPress={toggleMenu}>
              <View style={styles.menuOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.menuContent}>
              <FlatList
                data={[
                  { label: 'Configuraciones', screen: 'Ajustes' },
                  { label: 'Acerca de la App', screen: 'AcercaApp' },
                  { label: 'Términos y Condiciones', screen: 'TerminosC' },
                  { label: 'Contacto', screen: 'Contacto' },
                ]}
                keyExtractor={(item) => item.screen}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setActiveScreen(item.screen);
                      toggleMenu();
                    }}
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.logoContainer}>
              <Image source={require('./assets/logo.png')} style={styles.logoImage} />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBarWrapper: {
    marginTop: 30,
    backgroundColor: 'black',
  },
  topBar: {
    height: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    borderBottomWidth: 0,
    borderBottomColor: '#388E3C',
    zIndex: 2,
  },
  iconButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    color: 'white',
    fontSize: 12,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
    borderTopColor: '#388E3C',
    zIndex: 2,
  },
  menuContainer: {
    position: 'absolute',
    top: 80,
    bottom: 60,
    left: 0,
    width: Dimensions.get('window').width * 0.7,
    backgroundColor: '#c6ffb7',
    zIndex: 1,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: Dimensions.get('window').width * 0.8,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
  },
  menuContent: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 50,
    right: 50,
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
});

export default App;

