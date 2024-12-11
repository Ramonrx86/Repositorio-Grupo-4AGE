import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from './firebase'; // Importa la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import Icon from 'react-native-vector-icons/MaterialIcons'; // Usando un ícono flotante
import Colors from './Colorstyle';
import * as Location from 'expo-location'; // Para acceder a la ubicación del usuario

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
  const [modalVisible, setModalVisible] = useState(false); // Para manejar la visibilidad del modal de categorías
  const [selectedCategory, setSelectedCategory] = useState(null); // Para almacenar la categoría seleccionada

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

  // Filtrar puntos según la categoría seleccionada
  const filteredPuntos = puntosVerdes.filter((punto) => {
    const categorias = getCategorias(punto);
    return selectedCategory ? categorias.includes(selectedCategory) : true;
  });

  // Mostrar u ocultar el modal de filtro
  const toggleFilterModal = () => {
    setModalVisible(!modalVisible);
  };

  // Manejar la selección de una categoría para el filtro
  const handleCategorySelect = (category) => {
    if (category === 'Todas las categorías') {
      setSelectedCategory(null); // Desmarcar cualquier categoría seleccionada
    } else {
      setSelectedCategory(selectedCategory === category ? null : category); // Si la categoría ya está seleccionada, la deselecciona
    }
    setModalVisible(false); // Cerrar el modal al seleccionar una categoría
  };

  // Función para obtener la ubicación del usuario
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso denegado para acceder a la ubicación');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.0221,
    });
  };

  return (
    <View style={styles.container}>
      {error && <Text>{error}</Text>}
      {filteredPuntos.length > 0 ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={false}
          zoomEnabled={true}
          scrollEnabled={true}
          mapType="satellite"
        >
          {filteredPuntos.map((punto, index) => (
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

      {/* Botón flotante para mostrar el modal de filtro */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
        <Icon name="filter-list" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal para seleccionar categorías */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleFilterModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
              <ScrollView style={styles.categoriesContainer}>
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect('Todas las categorías')} // Seleccionar "Todas las categorías"
                >
                  <Text style={styles.categoryText}>
                    {selectedCategory === null ? '✔ ' : ''}Todas las categorías
                  </Text>
                </TouchableOpacity>
                {['Botellas de Plástico', 'Cartón', 'Latas de Aluminio', 'Papel', 'Vidrio', 'Orgánico'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.categoryItem}
                    onPress={() => handleCategorySelect(category)} // Cierra el modal al seleccionar la categoría
                  >
                    <Text style={styles.categoryText}>
                      {selectedCategory === category ? '✔ ' : ''}{category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botón para cerrar el modal */}
              <TouchableOpacity style={styles.closeButton} onPress={toggleFilterModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

              {/* Botón para cerrar el modal del punto */}
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPoint(null)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Botón para localizar al usuario */}
      <TouchableOpacity style={styles.locationButton} onPress={getUserLocation}>
        <Icon name="my-location" size={30} color="#fff" />
      </TouchableOpacity>
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
  filterButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20, // Mover la ubicación del botón a la derecha
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalCategoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoryItem: {
    padding: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default MapaScreen;