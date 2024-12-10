import React, { useState } from 'react';
import Colors from './Colorstyle';
import { View, Text, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import { Card } from 'react-native-paper';

const NotificacionesData = [
  { id: '1', title: 'Reciclaje de Plástico', message: 'Recuerda que el punto verde de la calle 10 está disponible para reciclar plástico.', date: '2024-12-01' },
  { id: '2', title: 'Reciclaje de Vidrio', message: 'El punto de reciclaje en la calle 9 ha sido actualizado con más contenedores.', date: '2024-12-02' },
  { id: '3', title: 'Alerta de punto verde', message: 'El punto de reciclaje en la calle 8 ha sido destruido.', date: '2024-12-03' },
  { id: '4', title: 'Reciclaje de Papel', message: 'El punto verde de la calle 5 está listo para recibir papel y cartón reciclable.', date: '2024-12-04' },
  { id: '5', title: 'Reciclaje de Latas', message: 'Recuerda depositar las latas en el punto de reciclaje de la calle 7.', date: '2024-12-05' },
  { id: '6', title: 'Reciclaje de Electrodomésticos', message: 'En la calle 12 se ha habilitado un punto especial para la disposición de electrodomésticos viejos.', date: '2024-12-06' },
  { id: '7', title: 'Reciclaje de Ropa', message: 'Nuevo punto verde en la calle 3 para recolectar ropa usada para reciclar.', date: '2024-12-07' },
  { id: '8', title: 'Alerta de Basura', message: 'Se ha reportado un contenedor desbordado en la calle 6. Se solicita limpieza inmediata.', date: '2024-12-08' },
  { id: '9', title: 'Contenedor de Plásticos Dañado', message: 'El contenedor de plásticos en la calle 4 está dañado y no puede ser utilizado.', date: '2024-12-09' },
  { id: '10', title: 'Contenedor lleno de Residuos Orgánicos', message: 'El contenedor de reciclaje de la calle 10 está siendo utilizado para residuos orgánicos, lo cual no es adecuado.', date: '2024-12-10' },
  { id: '11', title: 'Reciclaje de Residuos Peligrosos', message: 'Recuerda que los puntos verdes no deben usarse para depositar productos peligrosos como pilas o productos químicos.', date: '2024-12-11' },
  { id: '12', title: 'Contenedor en Abandono', message: 'El contenedor en la calle 14 lleva varios días sin ser vaciado y está lleno de basura.', date: '2024-12-12' },
  { id: '13', title: 'Reciclaje de Cartón', message: 'Se ha habilitado un nuevo punto de reciclaje para cartón en la calle 2, por favor deposítalo allí.', date: '2024-12-13' },
];

const NotificacionesScreen = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => openModal(item)}>
      <Card style={styles.card}>
        <Card.Title 
          title={<Text style={styles.boldTitle}>{item.title}</Text>} 
          subtitle={<Text style={styles.dateText}>{item.date}</Text>} 
        />
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Notificaciones de Reciclaje</Text>
      <FlatList
        data={NotificacionesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Modal para mostrar información completa */}
      {selectedNotification && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="none"  // Elimina la animación
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
              <Text style={styles.modalDate}>{selectedNotification.date}</Text>
              <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
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
    paddingHorizontal: 20,
    marginTop: 0,
    paddingTop: 30,
    backgroundColor: '#eeeeee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary, 
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 6,
  },
  boldTitle: {
    fontWeight: 'bold',
    color: Colors.primary, 
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary, 
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.primary, 
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificacionesScreen;
