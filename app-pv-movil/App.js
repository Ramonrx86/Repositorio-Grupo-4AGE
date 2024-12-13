import React, { useState, useEffect } from 'react';
import Colors from './screens/Colorstyle';
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
      // Animación para cerrar
      Animated.timing(menuTranslateX, {
        toValue: -Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true); // Menú sea visible durante la animación
      Animated.timing(menuTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    if (isMenuVisible) {
      toggleMenu();
    }
  };

  const TopBar = () => (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
          <FontAwesome name="bars" size={24} color={activeScreen === 'Home' ? Colors.Touchpress : 'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('Notificaciones'); closeMenu(); }} style={styles.iconButton}>
          <FontAwesome name="bell" size={24} color={activeScreen === 'Notificaciones' ? Colors.Touchpress : 'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      {['Mapa', 'Recicla', 'Calendario', 'Denuncias'].map((screen, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => { setActiveScreen(screen); closeMenu(); }} 
          style={styles.iconButton}
        >
          <FontAwesome 
            name={
              screen === 'Mapa' ? 'map-marker' :
              screen === 'Recicla' ? 'leaf' :
              screen === 'Calendario' ? 'calendar' : 
              'exclamation-triangle'
            } 
            size={24} 
            color={activeScreen === screen ? Colors.Touchpress : 'white'}
          />
          <Text 
            style={[
              styles.iconText, 
              { color: activeScreen === screen ? Colors.Touchpress : 'white' }
            ]}
          >
            {screen}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  

  const renderScreen = () => {
    switch (activeScreen) {
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
    <TouchableWithoutFeedback onPress={closeMenu}>
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
            {isMenuVisible && (
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.menuContainer,
                    { transform: [{ translateX: menuTranslateX }] },
                  ]}
                >
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
              </TouchableWithoutFeedback>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  topBarWrapper: { 
    marginTop: 28, 
    backgroundColor: 'black', 
    borderBottomWidth: 2, 
    borderBottomColor: Colors.Touchpress, // Borde inferior visible
  },
  topBar: { 
    height: 60, 
    backgroundColor: Colors.primary, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 30 
  },
  iconButton: { 
    flexDirection: 'column', 
    alignItems: 'center' 
  },
  iconText: { 
    marginTop: 5, 
    color: 'white', 
    fontSize: 12 
  },
  content: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  bottomBar: { 
    height: 60, 
    backgroundColor: Colors.primary,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 2, 
    borderTopColor: Colors.Touchpress, // Borde superior visible
  },
  menuContainer: { 
    position: 'absolute', 
    top: 90, 
    bottom: 60, 
    left: 0, 
    width: Dimensions.get('window').width * 0.7, 
    backgroundColor: '#aed6f1' 
  },
  menuContent: { 
    flex: 1, 
    padding: 20 
  },
  menuItem: { 
    padding: 15, 
    marginBottom: 10, 
    backgroundColor: Colors.primary,
    borderRadius: 5 
  },
  menuText: { 
    color: 'white', 
    fontSize: 18 
  },
  logoContainer: { 
    position: 'absolute', 
    bottom: 20, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  logoImage: { 
    width: 120, 
    height: 120, 
    resizeMode: 'contain' 
  },
});


export default App;