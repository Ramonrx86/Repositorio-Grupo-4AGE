import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location'; // Para manejar los permisos de ubicación
import PuntosVerdes from './PuntosVerdes'; // Importa el componente de puntos verdes
import { Ionicons } from '@expo/vector-icons'; 

const MapaScreen = () => {
  const [region, setRegion] = useState({
    latitude: -42.471919, // Coordenadas de Achao
    longitude: -73.492904,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0221,
  });

  const [hasLocationPermission, setHasLocationPermission] = useState(null); // Estado para gestionar los permisos
  const [puntosVerdes, setPuntosVerdes] = useState([
    {
      latitude: -42.471919,
      longitude: -73.492904,
      titulo: 'Punto Verde 1',
      descripcion: 'Este es un punto verde en Achao.',
      categoria: 'reciclaje', // Categoría asignada
    },
    {
      latitude: -42.470000,
      longitude: -73.490000,
      titulo: 'Punto Verde 2',
      descripcion: 'Este es otro punto verde en Achao.',
      categoria: 'basura', // Categoría asignada
    },
    
  ]);

  const [showCategories, setShowCategories] = useState(false); // Estado para controlar la visibilidad de los iconos de categorías
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para filtrar por categoría

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
      } else {
        setHasLocationPermission(false);
        console.log("Permiso de ubicación denegado");
      }
    };

    requestLocationPermission();
  }, []);

  if (hasLocationPermission === null) {
    return <View style={styles.container}><Text>Cargando...</Text></View>;
  }

  if (hasLocationPermission === false) {
    return <View style={styles.container}><Text>No se tiene acceso a la ubicación.</Text></View>;
  }

  // Filtra los puntos según la categoría seleccionada
  const filteredPuntos = puntosVerdes.filter(punto => 
    selectedCategory ? punto.categoria === selectedCategory : true
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region} 
        showsUserLocation={true} // Mostrar la ubicación del usuario
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapType="hybrid" // Modo híbrido para ver satélite con calles
      >
        
        <PuntosVerdes puntos={filteredPuntos} />
      </MapView>

      {/* Botón para desplegar las categorías */}
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setShowCategories(!showCategories)}
      >
        <Ionicons name="filter" size={30} color="white" />
      </TouchableOpacity>

      {/* Iconos de categorías desplegables */}
      {showCategories && (
        <View style={styles.categoriesContainer}>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('reciclaje')}
          >
            <Ionicons name="recycle" size={30} color="green" /> {/* Icono de reciclaje */}
            <Text style={styles.categoryText}>Reciclaje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('basura')}
          >
            <Ionicons name="trash" size={30} color="red" />
            <Text style={styles.categoryText}>Basura</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('papel')}
          >
            <Ionicons name="document-text" size={30} color="brown" />
            <Text style={styles.categoryText}>Papel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('carton')}
          >
            <Ionicons name="card" size={30} color="tan" />
            <Text style={styles.categoryText}>Cartón</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('aluminio')}
          >
            <Ionicons name="fitness" size={30} color="silver" />
            <Text style={styles.categoryText}>Aluminio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('vidrio')}
          >
            <Ionicons name="wine" size={30} color="blue" />
            <Text style={styles.categoryText}>Vidrio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryIcon}
            onPress={() => setSelectedCategory('organico')}
          >
            <Ionicons name="leaf" size={30} color="green" />
            <Text style={styles.categoryText}>Orgánico</Text>
          </TouchableOpacity>
        </View>
      )}
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
  categoryButton: {
    position: 'absolute',
    top: 20,
    right: 20, 
    backgroundColor: '#41a3ff',
    padding: 10,
    borderRadius: 30,
    zIndex: 1,
  },
  categoriesContainer: {
    position: 'absolute',
    top: 80,
    right: 20, 
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    zIndex: 1,
  },
  categoryIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MapaScreen;
