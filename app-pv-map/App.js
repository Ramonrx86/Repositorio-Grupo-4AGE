import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Dimensions, TouchableOpacity, Text, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { images } from './zoom1'; // Importa las imágenes desde zoom1.js

export default function App() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLogoVisible, setIsLogoVisible] = useState(true); // Estado para controlar la visibilidad del logo
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Estado para almacenar el desplazamiento de la malla

  const screenHeight = Dimensions.get('window').height; // Altura de la pantalla
  const screenWidth = Dimensions.get('window').width; // Ancho de la pantalla
  const topBarHeight = 70; // Altura de la barra superior
  const bottomBarHeight = 50; // Altura de la barra inferior

  const availableWidth = screenWidth; // Ancho disponible para la malla
  const availableHeight = screenHeight - topBarHeight - bottomBarHeight; // Altura disponible para la malla

  const [scale, setScale] = useState(1.8); // Estado para el zoom de la malla
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animación para el zoom

  useEffect(() => {
    // Animación de aparición y desaparición del logo
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        delay: 1000, // Mantiene el logo visible por 1 segundo antes de desaparecer
      }),
    ]).start(() => setIsLogoVisible(false)); // Cambia el estado cuando la animación termina
  }, []);

  useEffect(() => {
    // Asegura que la animación siga el valor del estado
    if (scaleAnim.__getValue() !== scale) {
      Animated.timing(scaleAnim, {
        toValue: scale,
        duration: 200, // Duración de la animación al cambiar de escala
        useNativeDriver: true,
      }).start();
    }
  }, [scale]); // Se ejecuta cada vez que el estado `scale` cambie

  // Función para cargar la malla de imágenes según filas y columnas
  const loadMapCells = () => {
    const rows = 3; // Mantener las 3 filas
    const cols = 4; // Mantener las 4 columnas
    const cells = [];
    for (let row = 0; row < rows; row++) {
      const rowCells = [];
      for (let col = 0; col < cols; col++) {
        // Accede a la imagen a través del mapeo de filas y columnas
        const imageKey = `${row + 1}-${col + 1}`;
        const imagePath = images[imageKey]; // Usamos el mapeo importado

        rowCells.push(
          <View key={`${row}-${col}`} style={styles.cell}>
            <Image source={imagePath} style={styles.image} />
          </View>
        );
      }
      cells.push(
        <View key={row} style={styles.row}>
          {rowCells}
        </View>
      );
    }
    return cells;
  };

  const zoomLevels = [
    1.8,   // Nivel 0 (10%)
    2.5,   // Nivel 1 (20%)
    3.5,   // Nivel 2 (30%)
    5.0,   // Nivel 3 (40%)
    7.0,   // Nivel 4 (50%)
    9.5,   // Nivel 5 (60%)
    12.5,  // Nivel 6 (70%)
    16.5,  // Nivel 7 (80%)
    21.0,  // Nivel 8 (90%)
    26.0,  // Nivel 9 (100%)
    30.0   // Nivel 10 (Final)
  ];
  



const handleZoomIn = () => {
  let currentIndex = zoomLevels.findIndex(level => level >= scale);
  if (currentIndex < zoomLevels.length - 1) {
    setScale(zoomLevels[currentIndex + 1]);  // Incrementa al siguiente nivel de zoom
  }
};

const handleZoomOut = () => {
  let currentIndex = zoomLevels.findIndex(level => level >= scale);
  if (currentIndex > 0) {
    setScale(zoomLevels[currentIndex - 1]);  // Decrementa al nivel anterior
  }
};


// Función para calcular el porcentaje de zoom
const calculateZoomPercentage = () => {
  const minZoom = zoomLevels[0];
  const maxZoom = zoomLevels[zoomLevels.length - 1];
  return Math.round(((scale - minZoom) / (maxZoom - minZoom)) * 100);
};




  // PanResponder para manejar el movimiento
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Permite iniciar el desplazamiento
      onMoveShouldSetPanResponder: () => true, // Permite mover el mapa
      onPanResponderMove: (event, gestureState) => {
        setOffset((prevOffset) => ({
          x: prevOffset.x + gestureState.dx, // Incrementa el desplazamiento
          y: prevOffset.y + gestureState.dy, // Incrementa el desplazamiento
        }));
      },
      onPanResponderRelease: () => {
        // Cuando se suelta el dedo, se mantiene la nueva posición
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {isLogoVisible && (
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
          <Image
            source={require('./assets/logos/LOGO-ORIGINAL-TRANS.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      {/* Contenido principal de la app que aparece después de que el logo desaparezca */}
      {!isLogoVisible && (
        <>
          <View style={styles.topBar}>
            <MaterialIcons name="notifications" size={24} color="black" style={styles.iconLeft} />
            <Image
              source={require('./assets/logos/logo-alargado.png')}
              style={styles.centerImage}
              resizeMode="contain"
            />
            <MaterialIcons name="settings" size={24} color="black" style={styles.iconRight} />
          </View>

          <View style={styles.bottomBar}>
            <MaterialIcons name="map" size={24} color="black" style={styles.icon} />
            <MaterialIcons name="calendar-today" size={24} color="black" style={styles.icon} />
          </View>

          {/* Mapa con celdas dinámicas */}
          <View style={styles.mapContainer}>
            <Animated.View
              style={[
                styles.mapGrid,
                {
                  height: availableHeight,
                  width: availableWidth,
                  transform: [
                    { scale: scaleAnim }, // Mantener el zoom
                    { translateX: offset.x }, // Mantener el desplazamiento en X
                    { translateY: offset.y }, // Mantener el desplazamiento en Y
                  ],
                },
              ]}
              {...panResponder.panHandlers} // Aplica los controles de panResponder
            >
              {loadMapCells()}
            </Animated.View>
          </View>

          {/* Botones de zoom a la derecha */}
          <View style={styles.zoomButtonsContainer}>
            <View style={styles.zoomPercentageContainer}>
              <Text style={styles.zoomPercentage}>{calculateZoomPercentage()}%</Text>
            </View>

            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <MaterialIcons name="zoom-in" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <MaterialIcons name="zoom-out" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B2FF66',
    zIndex: 1,
  },
  iconLeft: {
    marginLeft: 10,
  },
  centerImage: {
    width: 150,
    height: 40,
  },
  iconRight: {
    marginRight: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#B2FF66',
    zIndex: 1,
  },
  icon: {
    margin: 10,
  },
  mapContainer: {
    marginTop: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 125,
    height: 125,
  },
  image: {
    width: 125,
    height: 125,
    borderWidth: 1,
    borderColor: 'black',
  },
  zoomButtonsContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
  zoomPercentageContainer: {
    marginBottom: 20,
  },
  zoomPercentage: {
    fontSize: 20,
    color: 'white',
  },
});
