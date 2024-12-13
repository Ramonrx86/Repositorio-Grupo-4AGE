import React, { useEffect } from 'react';
import Colors from './Colorstyle';
import { Animated, View, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = new Animated.Value(0); // Inicializa la opacidad en 0

  useEffect(() => {
    // Animación de aparición
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duración de la aparición (1 segundo)
      useNativeDriver: true,
    }).start();

    // Animación de desaparición
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Duración de la desaparición (1 segundo)
        useNativeDriver: true,
      }).start();

      // Llamar a onFinish después de la desaparición para cambiar a la pantalla principal
      setTimeout(onFinish, 1000); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { opacity: fadeAnim }]} // Animación de opacidad
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.fondo, 
  },
  logo: {
    width: '80%', // Ajusta el tamaño para asegurarte de que el logo no esté recortado
    height: '80%',
  },
});

export default SplashScreen;
