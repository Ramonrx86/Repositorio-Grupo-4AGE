import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const NotificacionesData = [
  { id: '1', title: 'Reciclaje de Plástico', message: 'Recuerda que el punto verde de la calle 10 está disponible para reciclar plástico.', category: 'Punto de Reciclaje' },
  { id: '2', title: 'Reciclaje de Vidrio', message: 'El punto de reciclaje en la calle 9 ha sido actualizado con más contenedores.', category: 'Punto de reciclaje' },
  { id: '3', title: 'Alerta de punto verde', message: 'El punto de reciclaje en la calle 8 ha sido destruido.', category: 'Alerta' },
  { id: '4', title: 'Reciclaje de Papel', message: 'El punto verde de la calle 5 está listo para recibir papel y cartón reciclable.', category: 'Punto de Reciclaje' },
{ id: '5', title: 'Reciclaje de Latas', message: 'Recuerda depositar las latas en el punto de reciclaje de la calle 7.', category: 'Punto de Reciclaje' },
{ id: '6', title: 'Reciclaje de Electrodomésticos', message: 'En la calle 12 se ha habilitado un punto especial para la disposición de electrodomésticos viejos.', category: 'Punto de Reciclaje' },
{ id: '7', title: 'Reciclaje de Ropa', message: 'Nuevo punto verde en la calle 3 para recolectar ropa usada para reciclar.', category: 'Punto de Reciclaje' },
{ id: '8', title: 'Alerta de Basura', message: 'Se ha reportado un contenedor desbordado en la calle 6. Se solicita limpieza inmediata.', category: 'Alerta' },
{ id: '9', title: 'Contenedor de Plásticos Dañado', message: 'El contenedor de plásticos en la calle 4 está dañado y no puede ser utilizado.', category: 'Alerta' },
{ id: '10', title: 'Contenedor lleno de Residuos Orgánicos', message: 'El contenedor de reciclaje de la calle 10 está siendo utilizado para residuos orgánicos, lo cual no es adecuado.', category: 'Alerta' },
{ id: '11', title: 'Reciclaje de Residuos Peligrosos', message: 'Recuerda que los puntos verdes no deben usarse para depositar productos peligrosos como pilas o productos químicos.', category: 'Punto de Reciclaje' },
{ id: '12', title: 'Contenedor en Abandono', message: 'El contenedor en la calle 14 lleva varios días sin ser vaciado y está lleno de basura.', category: 'Alerta' },
{ id: '13', title: 'Reciclaje de Cartón', message: 'Se ha habilitado un nuevo punto de reciclaje para cartón en la calle 2, por favor deposítalo allí.', category: 'Punto de Reciclaje' },
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
            color={isRead ? '#d4ac0d' : 'gray'}
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
    marginTop: 0,
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#41a3ff',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#41a3ff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 6,
  },
  
  boldTitle: {
    fontWeight: 'bold', //Aplicar negrita al título de las notificaciones
    color: '#ffffff',
  },
  italicSubtitle: {
    fontStyle: 'italic', //Aplicar cursiva al subtítulo de cada notificación (categoría)
    color: '#f5f5f5',
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
  },
  bellIconContainer: {
    alignSelf: 'flex-end', //Icono campanita
    margin: 8,
  },
});

export default NotificacionesScreen;