import React, { useState } from 'react';
import { View, Image, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { imagenes } from './imagenes';

const MapaOffScreen = () => {
  const [scale, setScale] = useState(new Animated.Value(1));  // Controlar el zoom
  const [translate, setTranslate] = useState({ x: 0, y: 0 });  // Controlar el desplazamiento acumulado

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      // Actualizar los valores de desplazamiento de forma acumulada
      setTranslate(prevTranslate => ({
        x: prevTranslate.x + gestureState.dx,
        y: prevTranslate.y + gestureState.dy,
      }));
    },
    onPanResponderRelease: () => {
      // Al finalizar el movimiento, no hacemos nada extra, ya que el estado se actualiza en tiempo real
    },
  });

  // Función para controlar el zoom
  const handlePinch = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: false }
  );

  // Crear las celdas de la malla con imágenes
  const renderMapa = () => {
    const grid = [];
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 8; col++) {
        const key = `${row}-${col}`;  // Corregido con interpolación de variables
        grid.push(
          <Image key={key} source={imagenes[key]} style={styles.mapImage} />
        );
      }
    }
    return grid;
  };

  const windowHeight = Dimensions.get('window').height;
  const topBarHeight = 60; // Altura de la barra superior
  const bottomBarHeight = 60; // Altura de la barra inferior
  const mapHeight = windowHeight - topBarHeight - bottomBarHeight; // Calcular la altura disponible para el mapa

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Contenedor del mapa */}
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <Animated.View
          style={{
            transform: [
              { scale: scale },
              { translateX: translate.x },
              { translateY: translate.y },
            ],
          }}
          {...panResponder.panHandlers}
        >
          <View style={styles.grid}>
            {renderMapa()}
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Asegura que el contenido se alinee desde la parte superior
    alignItems: 'center',
    backgroundColor: 'black',
  },
  mapContainer: {
    width: Dimensions.get('window').width,
    marginTop: 60, // Asegura que haya un espacio de 60px para la barra superior
    position: 'absolute', // Coloca el mapa sobre el espacio restante de la pantalla
    top: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 1600,  // Ajusta el tamaño total de la cuadrícula según el número de imágenes
    height: 1200, // Ajusta el tamaño total de la cuadrícula
  },
  mapImage: {
    width: 200,  // Ajusta el tamaño de la imagen según tus necesidades
    height: 200,
  },
});

export default MapaOffScreen;
