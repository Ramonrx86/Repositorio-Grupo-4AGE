import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const NotificacionesData = [
  { id: '1', title: 'Reciclaje de Plástico', message: 'Recuerda que el punto verde de la calle 10 está disponible para reciclar plástico.', category: 'Punto de Reciclaje' },
  { id: '2', title: 'Reciclaje de Vidrio', message: 'El punto de reciclaje en la calle 9 ha sido actualizado con más contenedores.', category: 'Punto de reciclaje' },
  { id: '3', title: 'Alerta de punto verde', message: 'El punto de reciclaje en la calle 8 ha sido destruido.', category: 'Alerta' },
  // Más notificaciones con sus categorías
];

const NotificacionesScreen = () => {
  const [readNotificaciones, setReadNotificaciones] = useState({});

  const handleReadNotification = (id) => {
    setReadNotificaciones((prev) => ({
      ...prev,
      [id]: !prev[id], //Cambia el estado de lectura de la notificación por color del icono
    }));
  };

  const renderItem = ({ item, index }) => {
    const isRead = readNotificaciones[item.id]; //Verifica si la notificación ya fue leída al presionar campana

    return (
      <Card style={[styles.card, index === 0 && styles.firstCard]}>
        <Card.Title 
          title={<Text style={styles.boldTitle}>{item.title}</Text>} 
          subtitle={<Text style={styles.italicSubtitle}>{item.category}</Text>} //Muestra la categoría como subtítulo para modificar estilo
        />
        <Card.Content>
          <Text style={styles.messageText}>{item.message}</Text>
        </Card.Content>
        <Pressable onPress={() => handleReadNotification(item.id)} style={styles.bellIconContainer}>
          <FontAwesome
            name="bell"
            size={24}
            color={isRead ? 'green' : 'gray'}
          />
        </Pressable>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Notificaciones de Reciclaje</Text>
      <FlatList
        data={NotificacionesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 26,
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6,
  },
  
  boldTitle: {
    fontWeight: 'bold', //Aplicar negrita al título de las notificaciones
  },
  italicSubtitle: {
    fontStyle: 'italic', //Aplicar cursiva al subtítulo de cada notificación (categoría)
  },
  messageText: {
    fontSize: 16,
    color: '#555',
  },
  bellIconContainer: {
    alignSelf: 'flex-end', //Icono campanita
    margin: 8,
  },
});

export default NotificacionesScreen;