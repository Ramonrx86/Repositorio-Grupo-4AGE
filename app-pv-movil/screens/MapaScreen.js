import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { puntosVerdes } from './puntosVerdes'; // Asegúrate de que esta ruta sea correcta

const MapaScreen = () => {
  const [region, setRegion] = useState({
    latitude: -42.471919,  // Nuevas coordenadas de Achao
    longitude: -73.492904,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0221,
  });

  const [reloadMap, setReloadMap] = useState(0); // Estado para forzar el reinicio del mapa

  useEffect(() => {
    // Resetear el estado de la región al iniciarse la app
    setRegion({
      latitude: -42.471919,
      longitude: -73.492904,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0221,
    });

    // Forzar el reinicio del mapa cada vez que la app se inicie
    setReloadMap(prevState => prevState + 1);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        key={reloadMap} // Cambiar la clave para reiniciar el mapa
        style={styles.map}
        initialRegion={region}  // Usamos initialRegion para centrar el mapa en Achao
        showsUserLocation={true}  // Mostrar la ubicación del usuario
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapType="hybrid"  // Modo híbrido para ver satélite con calles
      >
        {/* Marcadores para los puntos verdes */}
        {puntosVerdes.features.map((punto) => (
          <Marker
            key={punto.id}
            coordinate={{
              latitude: punto.geometry.coordinates[1],
              longitude: punto.geometry.coordinates[0],
            }}
            title={punto.properties.name}
            description={punto.properties.description}
            pinColor="green"
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
