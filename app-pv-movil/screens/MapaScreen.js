import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { puntosVerdes } from './puntosVerdes';  // Asegúrate de que esta ruta sea correcta

const MapaScreen = () => {
  const [region, setRegion] = useState({
    latitude: -42.47252985044294,  // Coordenadas de Achao
    longitude: -73.48994022306884,
    latitudeDelta: 0.0222,  // Ajuste del zoom inicial
    longitudeDelta: 0.0221,
  });

  const [mapKey, setMapKey] = useState(0);  // Estado adicional para forzar el reinicio del mapa

  // Recuperar datos guardados cuando la app se inicia
  useEffect(() => {
    const loadRegion = async () => {
      try {
        const savedRegion = await AsyncStorage.getItem('region');
        if (savedRegion) {
          setRegion(JSON.parse(savedRegion));  // Recupera los datos guardados
        }
      } catch (error) {
        console.error('Error loading region', error);
      }
    };
    loadRegion();
  }, []);

  // Guardar la región cada vez que el usuario mueva el mapa
  const handleRegionChange = (newRegion) => {
    setRegion(newRegion); // Actualiza el estado
    AsyncStorage.setItem('region', JSON.stringify(newRegion)); // Guarda la nueva región
  };

  // Resetear el mapa cuando el usuario ingrese a la pantalla
  const resetMap = () => {
    setMapKey(prevKey => prevKey + 1);  // Cambiar la clave del mapa para reiniciar el componente
  };

  useEffect(() => {
    resetMap();  // Llamamos a resetMap cuando se monta el componente
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  return (
    <View style={styles.container}>
      <MapView
        key={mapKey}  // Asignar el key para forzar el reinicio
        style={styles.map}
        initialRegion={region}  // Usa initialRegion para la primera carga
        onRegionChangeComplete={handleRegionChange}  // Guarda la nueva región
        zoomEnabled={true}  // Habilita el zoom en el mapa
        scrollEnabled={true}  // Habilita el desplazamiento del mapa
        pitchEnabled={true}  // Habilita el ángulo de inclinación
        rotateEnabled={true}  // Habilita la rotación del mapa
        mapType="hybrid"  // Mapa híbrido (satélite + calles)
      >
        {/* Marcadores para los puntos verdes */}
        {puntosVerdes.features.map((punto) => (
          <Marker
            key={punto.id}  // Usamos el id como clave única
            coordinate={{
              latitude: punto.geometry.coordinates[1],
              longitude: punto.geometry.coordinates[0],
            }}
            title={punto.properties.name}
            description={punto.properties.description}
            pinColor="green"  // Cambiar el color del marcador a verde
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 0,
    paddingTop: 0,
    width: '100%',
    height: '100%',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapaScreen;

