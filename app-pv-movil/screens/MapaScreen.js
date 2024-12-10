import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from './firebase'; // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore

const MapaScreen = () => {
  const [region, setRegion] = useState({
    latitude: -42.471919, // Coordenadas de Achao
    longitude: -73.492904,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0221,
  });

  const [puntosVerdes, setPuntosVerdes] = useState([]); // Aquí se guardarán los puntos verdes obtenidos de Firestore
  const [error, setError] = useState(null); // Para manejar y mostrar cualquier error
  const [selectedPoint, setSelectedPoint] = useState(null); // Para almacenar el punto seleccionado

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "contenedores"));
        const puntos = [];

        if (querySnapshot.empty) {
          setError('No se encontraron puntos en la base de datos');
        }

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Datos del documento:", data);

          const gps = data.gps;

          if (gps && gps.latitude && gps.longitude) {
            const latitud = gps.latitude;
            const longitud = gps.longitude;

            if (!isNaN(latitud) && !isNaN(longitud)) {
              puntos.push({
                ...data,
                latitud,
                longitud,
              });
            } else {
              console.log("Coordenadas no válidas", gps);
            }
          } else {
            console.log("Campo gps no encontrado o mal formato", gps);
          }
        });

        setPuntosVerdes(puntos); // Actualiza el estado con los puntos obtenidos
      } catch (error) {
        console.log('Error al obtener los puntos:', error);
        setError('Error al cargar los puntos desde Firebase');
      }
    };

    fetchPuntos(); // Cargar los puntos verdes al inicio
  }, []);

  // Función para obtener las categorías activas
  const getCategorias = (punto) => {
    const categoriasActivas = [];
    if (punto) {
      if (punto.b === 1) categoriasActivas.push('Botellas de Plástico');
      if (punto.c === 1) categoriasActivas.push('Cartón');
      if (punto.l === 1) categoriasActivas.push('Latas de Aluminio');
      if (punto.p === 1) categoriasActivas.push('Papel');
      if (punto.v === 1) categoriasActivas.push('Vidrio');
      if (punto.o === 1) categoriasActivas.push('Orgánico');
    }

    return categoriasActivas;
  };

  // Función para manejar la selección de un punto
  const handleMarkerPress = (punto) => {
    setSelectedPoint(punto);
  };

  return (
    <View style={styles.container}>
      {error && <Text>{error}</Text>}
      {puntosVerdes.length > 0 ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
          mapType="satellite"
        >
          {puntosVerdes.map((punto, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: punto.latitud,
                longitude: punto.longitud,
              }}
              title={punto.titulo}
              description={punto.descripcion}
              onPress={() => handleMarkerPress(punto)} // Al presionar el marcador
            />
          ))}
        </MapView>
      ) : (
        <Text>No hay puntos disponibles para mostrar.</Text>
      )}

      {/* Modal para mostrar los detalles del punto */}
      {selectedPoint && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedPoint(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedPoint.titulo}</Text>
              <Text style={styles.modalDescription}>{selectedPoint.descripcion}</Text>

              <Text style={styles.modalCategoriesTitle}>Categorías:</Text>
              <ScrollView style={styles.categoriesContainer}>
                {getCategorias(selectedPoint).length > 0 ? (
                  getCategorias(selectedPoint).map((categoria, index) => (
                    <Text key={index} style={styles.categoryItem}>{categoria}</Text>
                  ))
                ) : (
                  <Text>No hay categorías activas.</Text>
                )}
              </ScrollView>

              {/* Mostrar imagen si existe */}
              {selectedPoint.imagen && (
                <Image
                  source={{ uri: selectedPoint.imagen }}
                  style={styles.image}
                />
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPoint(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  modalCategoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoryItem: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: '100%',  // Ocupa todo el ancho disponible del contenedor
    height: 0,      // Establece el alto en 0 inicialmente
    paddingBottom: '56.25%', // Este valor es para mantener la relación 16:9, ajusta según el tipo de imagen
    resizeMode: 'contain', // Mantiene las proporciones sin distorsionar
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapaScreen;
