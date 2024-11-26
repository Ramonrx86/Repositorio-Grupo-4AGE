import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, TouchableWithoutFeedback, Modal, Animated } from 'react-native';
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
import AyudaScreen from './screens/AyudaScreen';

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [activeScreen, setActiveScreen] = useState('Home'); // Control de la pantalla activa
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalOpacity] = useState(new Animated.Value(0)); // Para la animación del modal

  const handleSplashFinish = () => setSplashVisible(false);

  // Abre el modal con animación
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Cierra el modal con animación
  const closeModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const TopBar = () => (
    <View style={styles.topBar}>
      {/* Botón de notificaciones */}
      <TouchableOpacity onPress={() => setActiveScreen('Notificaciones')}>
        <FontAwesome name="bell" size={24} color="white" />
      </TouchableOpacity>

      {/* Botón de abrir Modal */}
      <TouchableOpacity onPress={openModal}>
        <FontAwesome name="bars" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const BottomBar = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => setActiveScreen('Mapa')}>
        <FontAwesome name="map-marker" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveScreen('Recicla')}>
        <FontAwesome name="leaf" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveScreen('Calendario')}>
        <FontAwesome name="calendar" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveScreen('Denuncias')}>
        <FontAwesome name="exclamation-triangle" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  // Maneja las pantallas de contenido según el estado activeScreen
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
      case 'Ayuda':
        return <AyudaScreen />;
      default:
        return <MapaScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior */}
      <TopBar />

      {/* Contenido de la pantalla activa */}
      {renderScreen()}

      {/* Barra inferior */}
      <BottomBar />

      {/* Modal */}
      {isModalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: modalOpacity },
          ]}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <FlatList
              data={[
                { label: 'Configuraciones', screen: 'Ajustes' },
                { label: 'Acerca de la App', screen: 'AcercaApp' },
                { label: 'Términos y Condiciones', screen: 'TerminosC' },
                { label: 'Contacto', screen: 'Contacto' },
                { label: 'Ayuda', screen: 'Ayuda' },
              ]}
              keyExtractor={(item) => item.screen}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setActiveScreen(item.screen); // Cambia la pantalla activa
                    closeModal();
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
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
  bottomBar: {
    height: 60,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#388E3C',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fondo oscuro
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;












